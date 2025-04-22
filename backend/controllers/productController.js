const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const fs = require('fs');
const path = require('path');

// @desc    Obtener todos los productos
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc    Obtener un producto por ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Producto no encontrado');
  }
});

// @desc    Crear un nuevo producto
// @route   POST /api/products
// @access  Public
const createProduct = asyncHandler(async (req, res) => {
  const { productId, name, description, quantity, unitPrice } = req.body;
  
  if (!req.file) {
    res.status(400);
    throw new Error('Por favor suba una imagen');
  }

  const productExists = await Product.findOne({ productId });

  if (productExists) {
    // Eliminar la imagen subida si el producto ya existe
    fs.unlinkSync(req.file.path);
    res.status(400);
    throw new Error('El ID del producto ya existe');
  }

  const product = await Product.create({
    productId,
    name,
    description,
    quantity,
    image: `/uploads/${req.file.filename}`,
    unitPrice
  });

  if (product) {
    res.status(201).json(product);
  } else {
    // Eliminar la imagen si hay error al crear el producto
    fs.unlinkSync(req.file.path);
    res.status(400);
    throw new Error('Datos de producto inválidos');
  }
});

// @desc    Actualizar un producto
// @route   PUT /api/products/:id
// @access  Public
const updateProduct = asyncHandler(async (req, res) => {
  const { productId, name, description, quantity, unitPrice } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.productId = productId || product.productId;
    product.name = name || product.name;
    product.description = description || product.description;
    product.quantity = quantity !== undefined ? quantity : product.quantity;
    product.unitPrice = unitPrice !== undefined ? unitPrice : product.unitPrice;

    // Si hay una nueva imagen
    if (req.file) {
      // Eliminar la imagen anterior
      const oldImagePath = path.join(__dirname, '..', product.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      product.image = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    // Si hay una imagen subida pero el producto no existe
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(404);
    throw new Error('Producto no encontrado');
  }
});

// @desc    Eliminar un producto
// @route   DELETE /api/products/:id
// @access  Public
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    // Eliminar la imagen asociada
    const imagePath = path.join(__dirname, '..', product.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    
    await product.deleteOne();
    res.json({ message: 'Producto eliminado' });
  } else {
    res.status(404);
    throw new Error('Producto no encontrado');
  }
});

// @desc    Actualizar stock de un producto
// @route   PUT /api/products/:id/stock
// @access  Public
const updateStock = asyncHandler(async (req, res) => {
  const { quantity } = req.body;

  if (quantity === undefined || quantity <= 0) {
    res.status(400);
    throw new Error('Por favor ingrese una cantidad válida');
  }

  const product = await Product.findById(req.params.id);

  if (product) {
    product.quantity = product.quantity + parseInt(quantity);
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Producto no encontrado');
  }
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock
};