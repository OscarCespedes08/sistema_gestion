const express = require('express');
const router = express.Router();
const facturaUrl = await uploadInvoiceToCloudinary('/ruta/a/la/factura.png');
// guarda `facturaUrl` en la base de datos, o úsala como necesites

const { 
  getSales, 
  getSaleById, 
  createSale,
  downloadInvoice
} = require('../controllers/saleController');

router.route('/')
  .get(getSales)
  .post(createSale);

router.route('/:id')
  .get(getSaleById);

router.route('/:id/invoice')
  .get(downloadInvoice);

module.exports = router;