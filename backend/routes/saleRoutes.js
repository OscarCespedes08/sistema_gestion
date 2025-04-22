const express = require('express');
const router = express.Router();
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