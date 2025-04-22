const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
  documentType: {
    type: String,
    required: [true, 'Por favor ingrese el tipo de documento'],
    enum: ['CC', 'CE', 'TI', 'Pasaporte', 'NIT']
  },
  documentNumber: {
    type: String,
    required: [true, 'Por favor ingrese el número de documento'],
    unique: true
  },
  fullName: {
    type: String,
    required: [true, 'Por favor ingrese el nombre completo']
  },
  contactNumber: {
    type: String,
    required: [true, 'Por favor ingrese el número de contacto']
  },
  email: {
    type: String,
    required: [true, 'Por favor ingrese el correo electrónico'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor ingrese un correo electrónico válido'
    ]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Client', clientSchema);