const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  productId: {
    type: String,
    required: [true, 'Por favor ingrese el ID del producto'],
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Por favor ingrese el nombre del producto']
  },
  description: {
    type: String,
    required: [true, 'Por favor ingrese la descripción del producto']
  },
  quantity: {
    type: Number,
    required: [true, 'Por favor ingrese la cantidad disponible'],
    min: [0, 'La cantidad no puede ser negativa']
  },
  image: {
    type: String,
    required: [true, 'Por favor suba una imagen del producto']
  },
  unitPrice: {
    type: Number,
    required: [true, 'Por favor ingrese el valor unitario'],
    min: [0, 'El precio no puede ser negativo']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);