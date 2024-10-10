const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const authRoutes = require('./routes/auth'); // Asegúrate de que la ruta sea correcta
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  host: 'dpg-crmhlo5umphs739eh5dg-a.oregon-postgres.render.com',
  user: 'sistema_usuarios_user',
  password: 'T2UIdTJCBbNrkNPpihVDJ9TMDu8Y82Ms',
  database: 'sistema_usuarios',
  port: 5432,
  ssl: { rejectUnauthorized: false }  // Configuración de SSL
});

// Verificar la conexión
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error al conectar a PostgreSQL:', err);
  } else {
    console.log('Conectado a PostgreSQL');
    release();
  }
});

// Usa el router para las rutas de autenticación
app.use('/api/auth', authRoutes); // Aquí es donde se define la ruta base

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
