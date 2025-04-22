const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

// Ruta para subir una imagen
router.post('/image', upload.single('image'), (req, res) => {
  res.json({ imageUrl: req.file.path }); // URL pública de Cloudinary
});

module.exports = router;
