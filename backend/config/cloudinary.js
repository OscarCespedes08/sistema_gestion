const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  secure: true // opcional pero recomendable para HTTPS
});

module.exports = cloudinary;
