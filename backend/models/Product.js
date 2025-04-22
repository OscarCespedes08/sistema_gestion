const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    idProducto: {
      type: String,
      required: true,
      unique: true
    },
    nombreProducto: {
      type: String,
      required: true
    },
    descripcion: {
      type: String,
      required: true
    },
    cantidad: {
      type: Number,
      required: true,
      default: 0
    },
    imagen: {
      type: String,
      required: true
    },
    valorUnitario: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;