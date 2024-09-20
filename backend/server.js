const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const contactosRoutes = require('./routes/contactos');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: '172.17.230.165',
  user: 'remote_user',
  password: 'remote_password',
  database: 'sistema_usuarios',
});

db.connect((err) => {
  if (err) {
    console.error('Error conectando a MySQL:', err);
    return;
  }
  console.log('Conexión a MySQL exitosa');
});

// Rutas
const authRoutes = require('./routes/auth');
const qrRoutes = require('./routes/qr');
app.use('/api/auth', authRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/contactos', contactosRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
