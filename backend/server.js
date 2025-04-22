const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const uploadRoutes = require('./routes/uploadRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Crear directorio de uploads si no existe
const fs = require('fs');
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// Rutas
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/sales', require('./routes/saleRoutes'));
app.use('/api/upload', uploadRoutes);


// Verificar si estamos en Render (Render establece esta variable automáticamente)
const isRender = process.env.RENDER === 'true';

// Servir archivos estáticos en producción o en Render
if (process.env.NODE_ENV === 'production' || isRender) {
  // Servir archivos estáticos desde la carpeta build
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  // Cualquier ruta no reconocida, enviar el index.html
  app.get('*', (req, res) => 
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API está funcionando');
  });
}

// Middleware de errores
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});