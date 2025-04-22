const mongoose = require('mongoose');

const saleItemSchema = mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  cantidad: {
    type: Number,
    required: true
  },
  valorUnitario: {
    type: Number,
    required: true
  },
  valorTotal: {
    type: Number,
    required: true
  }
});

const saleSchema = mongoose.Schema(
  {
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Client'
    },
    items: [saleItemSchema],
    valorTotal: {
      type: Number,
      required: true
    },
    valorTotalConIVA: {
      type: Number,
      required: true
    },
    pdfFactura: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;