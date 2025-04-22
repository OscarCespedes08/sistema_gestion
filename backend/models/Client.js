const mongoose = require('mongoose');

const clientSchema = mongoose.Schema(
  {
    tipoDocumento: {
      type: String,
      required: true,
      enum: ['CC', 'CE', 'NIT', 'Pasaporte']
    },
    numeroDocumento: {
      type: String,
      required: true,
      unique: true
    },
    nombreCompleto: {
      type: String,
      required: true
    },
    numeroContacto: {
      type: String,
      required: true
    },
    correoElectronico: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;