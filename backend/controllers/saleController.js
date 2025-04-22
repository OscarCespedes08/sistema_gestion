const asyncHandler = require('express-async-handler');
const Sale = require('../models/saleModel');
const Product = require('../models/productModel');
const Client = require('../models/clientModel');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// @desc    Obtener todas las ventas
// @route   GET /api/sales
// @access  Public
const getSales = asyncHandler(async (req, res) => {
  const sales = await Sale.find({})
    .populate('client', 'fullName documentNumber')
    .populate('items.product', 'name productId');
  res.json(sales);
});

// @desc    Obtener una venta por ID
// @route   GET /api/sales/:id
// @access  Public
const getSaleById = asyncHandler(async (req, res) => {
  const sale = await Sale.findById(req.params.id)
    .populate('client', 'fullName documentNumber contactNumber email')
    .populate('items.product', 'name productId unitPrice');
  
  if (sale) {
    res.json(sale);
  } else {
    res.status(404);
    throw new Error('Venta no encontrada');
  }
});

// @desc    Crear una nueva venta
// @route   POST /api/sales
// @access  Public
const createSale = asyncHandler(async (req, res) => {
  const { clientId, items } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No hay productos en la venta');
  }

  // Verificar que el cliente existe
  const client = await Client.findById(clientId);
  if (!client) {
    res.status(404);
    throw new Error('Cliente no encontrado');
  }

  // Procesar cada ítem de la venta
  const saleItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);
    
    if (!product) {
      res.status(404);
      throw new Error(`Producto con ID ${item.productId} no encontrado`);
    }
    
    if (product.quantity < item.quantity) {
      res.status(400);
      throw new Error(`Stock insuficiente para ${product.name}`);
    }
    
    // Calcular el precio total del ítem
    const itemTotal = product.unitPrice * item.quantity;
    
    saleItems.push({
      product: product._id,
      quantity: item.quantity,
      unitPrice: product.unitPrice,
      totalPrice: itemTotal
    });
    
    subtotal += itemTotal;
    
    // Actualizar el stock del producto
    product.quantity -= item.quantity;
    await product.save();
  }

  // Calcular el total con IVA
  const tax = subtotal * 0.19;
  const total = subtotal + tax;

  // Crear la venta
  const sale = await Sale.create({
    client: clientId,
    items: saleItems,
    subtotal,
    tax,
    total
  });

  if (sale) {
    // Generar el PDF de la factura
    const pdfPath = await generateInvoice(sale);
    
    // Actualizar la venta con la ruta del PDF
    sale.invoicePdf = pdfPath;
    await sale.save();
    
    // Poblar los datos para la respuesta
    const populatedSale = await Sale.findById(sale._id)
      .populate('client', 'fullName documentNumber contactNumber email')
      .populate('items.product', 'name productId');
    
    res.status(201).json(populatedSale);
  } else {
    res.status(400);
    throw new Error('Error al crear la venta');
  }
});

// Función para generar la factura en PDF
const generateInvoice = async (sale) => {
  // Crear directorio para facturas si no existe
  const invoicesDir = path.join(__dirname, '../uploads/invoices');
  if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir, { recursive: true });
  }

  const filename = `invoice-${sale._id}.pdf`;
  const filepath = path.join(invoicesDir, filename);
  
  // Obtener datos completos
  const populatedSale = await Sale.findById(sale._id)
    .populate('client', 'fullName documentNumber contactNumber email')
    .populate('items.product', 'name productId');
  
  // Crear el PDF
  const doc = new PDFDocument();
  const stream = fs.createWriteStream(filepath);
  
  doc.pipe(stream);
  
  // Encabezado
  doc.fontSize(20).text('FACTURA DE VENTA', { align: 'center' });
  doc.moveDown();
  
  // Fecha y hora
  const date = new Date(populatedSale.createdAt);
  doc.fontSize(12).text(`Fecha: ${date.toLocaleDateString()}`);
  doc.text(`Hora: ${date.toLocaleTimeString()}`);
  doc.moveDown();
  
  // Datos del cliente
  doc.fontSize(14).text('Datos del Cliente:');
  doc.fontSize(12).text(`Nombre: ${populatedSale.client.fullName}`);
  doc.text(`Documento: ${populatedSale.client.documentNumber}`);
  doc.text(`Contacto: ${populatedSale.client.contactNumber}`);
  doc.text(`Email: ${populatedSale.client.email}`);
  doc.moveDown();
  
  // Productos
  doc.fontSize(14).text('Productos:');
  doc.moveDown();
  
  // Tabla de productos
  const tableTop = doc.y;
  const itemX = 50;
  const quantityX = 300;
  const priceX = 400;
  const totalX = 500;
  
  doc.fontSize(12).text('Producto', itemX, tableTop);
  doc.text('Cantidad', quantityX, tableTop);
  doc.text('Precio Unit.', priceX, tableTop);
  doc.text('Total', totalX, tableTop);
  
  const lineY = doc.y + 5;
  doc.moveTo(itemX, lineY).lineTo(totalX + 50, lineY).stroke();
  doc.moveDown();
  
  let y = doc.y;
  
  populatedSale.items.forEach(item => {
    doc.text(item.product.name, itemX, y);
    doc.text(item.quantity.toString(), quantityX, y);
    doc.text(`$${item.unitPrice.toFixed(2)}`, priceX, y);
    doc.text(`$${item.totalPrice.toFixed(2)}`, totalX, y);
    y += 20;
  });
  
  doc.moveDown();
  doc.moveTo(itemX, y).lineTo(totalX + 50, y).stroke();
  doc.moveDown();
  
  // Totales
  y += 10;
  doc.text('Subtotal:', 400, y);
  doc.text(`$${populatedSale.subtotal.toFixed(2)}`, totalX, y);
  y += 20;
  
  doc.text('IVA (19%):', 400, y);
  doc.text(`$${populatedSale.tax.toFixed(2)}`, totalX, y);
  y += 20;
  
  doc.fontSize(14).text('TOTAL:', 400, y);
  doc.text(`$${populatedSale.total.toFixed(2)}`, totalX, y);
  
  // Pie de página
  doc.fontSize(10).text('Gracias por su compra', { align: 'center' });
  
  doc.end();
  
  // Esperar a que se complete la escritura del archivo
  return new Promise((resolve, reject) => {
    stream.on('finish', () => {
      resolve(`/uploads/invoices/${filename}`);
    });
    stream.on('error', reject);
  });
};

// @desc    Descargar factura PDF
// @route   GET /api/sales/:id/invoice
// @access  Public
const downloadInvoice = asyncHandler(async (req, res) => {
  const sale = await Sale.findById(req.params.id);
  
  if (sale && sale.invoicePdf) {
    const filePath = path.join(__dirname, '..', sale.invoicePdf);
    
    if (fs.existsSync(filePath)) {
      res.download(filePath);
    } else {
      res.status(404);
      throw new Error('Archivo de factura no encontrado');
    }
  } else {
    res.status(404);
    throw new Error('Factura no encontrada');
  }
});

module.exports = {
  getSales,
  getSaleById,
  createSale,
  downloadInvoice
};