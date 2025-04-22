const PDFDocument = require('pdfkit');
const fs = require('fs');

const generatePDF = async (sale, outputPath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      
      // Pipe the PDF to the output file
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);
      
      // Encabezado
      doc.fontSize(20).text('FACTURA DE VENTA', { align: 'center' });
      doc.moveDown();
      
      // Información de la empresa
      doc.fontSize(12).text('Sistema de Gestión de Ventas', { align: 'center' });
      doc.fontSize(10).text('NIT: 900.123.456-7', { align: 'center' });
      doc.fontSize(10).text('Dirección: Calle Principal #123', { align: 'center' });
      doc.fontSize(10).text('Teléfono: (601) 123-4567', { align: 'center' });
      doc.moveDown(2);
      
      // Información de la factura
      const fecha = new Date(sale.createdAt);
      doc.fontSize(12).text(`Factura No: ${sale._id}`);
      doc.fontSize(10).text(`Fecha: ${fecha.toLocaleDateString()}`);
      doc.fontSize(10).text(`Hora: ${fecha.toLocaleTimeString()}`);
      doc.moveDown();
      
      // Información del cliente
      doc.fontSize(12).text('Datos del Cliente:');
      doc.fontSize(10).text(`Nombre: ${sale.cliente.nombreCompleto}`);
      doc.fontSize(10).text(`Documento: ${sale.cliente.tipoDocumento} ${sale.cliente.numeroDocumento}`);
      doc.fontSize(10).text(`Contacto: ${sale.cliente.numeroContacto}`);
      doc.moveDown(2);
      
      // Tabla de productos
      doc.fontSize(12).text('Detalle de Productos:');
      doc.moveDown();
      
      // Encabezados de la tabla
      const tableTop = doc.y;
      const tableHeaders = ['Cantidad', 'Producto', 'Valor Unitario', 'Valor Total'];
      const columnWidth = (doc.page.width - 100) / tableHeaders.length;
      
      let position = tableTop;
      
      // Dibujar encabezados
      doc.fontSize(10);
      tableHeaders.forEach((header, i) => {
        doc.text(header, 50 + (i * columnWidth), position, { width: columnWidth, align: 'left' });
      });
      
      position += 20;
      
      // Dibujar línea horizontal
      doc.moveTo(50, position - 5)
         .lineTo(doc.page.width - 50, position - 5)
         .stroke();
      
      // Dibujar filas de productos
      doc.fontSize(10);
      sale.items.forEach(item => {
        doc.text(item.cantidad.toString(), 50, position, { width: columnWidth, align: 'left' });
        doc.text(item.producto.nombreProducto, 50 + columnWidth, position, { width: columnWidth, align: 'left' });
        doc.text(`$${item.valorUnitario.toLocaleString()}`, 50 + (columnWidth * 2), position, { width: columnWidth, align: 'left' });
        doc.text(`$${item.valorTotal.toLocaleString()}`, 50 + (columnWidth * 3), position, { width: columnWidth, align: 'left' });
        
        position += 20;
        
        // Si estamos cerca del final de la página, crear una nueva
        if (position > doc.page.height - 100) {
          doc.addPage();
          position = 50;
        }
      });
      
      // Dibujar línea horizontal
      doc.moveTo(50, position)
         .lineTo(doc.page.width - 50, position)
         .stroke();
      
      position += 20;
      
      // Totales
      doc.fontSize(10).text(`Subtotal: $${sale.valorTotal.toLocaleString()}`, doc.page.width - 150, position, { width: 100, align: 'right' });
      position += 15;
      doc.text(`IVA (19%): $${(sale.valorTotalConIVA - sale.valorTotal).toLocaleString()}`, doc.page.width - 150, position, { width: 100, align: 'right' });
      position += 15;
      doc.fontSize(12).text(`TOTAL: $${sale.valorTotalConIVA.toLocaleString()}`, doc.page.width - 150, position, { width: 100, align: 'right' });
      
      // Pie de página
      doc.fontSize(10).text('Gracias por su compra', 50, doc.page.height - 100, { align: 'center' });
      
      // Finalizar el documento
      doc.end();
      
      stream.on('finish', () => {
        resolve(outputPath);
      });
      
      stream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generatePDF;