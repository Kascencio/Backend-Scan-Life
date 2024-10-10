const { Pool } = require('pg');
const bcrypt = require('bcrypt'); // Asegúrate de tener bcrypt instalado
const jwt = require('jsonwebtoken'); // Asegúrate de tener jsonwebtoken instalado
const jwtSecret = 'DOcwc5Xn078SlYD6ZHVe'; // Define tu secreto aquí

const pool = new Pool({
  host: 'dpg-crmhlo5umphs739eh5dg-a.oregon-postgres.render.com',
  user: 'sistema_usuarios_user',
  password: 'T2UIdTJCBbNrkNPpihVDJ9TMDu8Y82Ms',
  database: 'sistema_usuarios',
  port: 5432,
  ssl: { rejectUnauthorized: false }  // Configuración de SSL
});

// Registro de usuario
exports.register = async (req, res) => {
  const { nombre, apellido, email, password } = req.body;

  // Validación de datos (opcional)
  if (!nombre || !apellido || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  // Hash de la contraseña
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Query SQL para registrar el usuario
  const query = 'INSERT INTO usuarios (nombre, apellido, email, password) VALUES ($1, $2, $3, $4) RETURNING id';
  
  try {
    const result = await pool.query(query, [nombre, apellido, email, hashedPassword]);
    res.status(201).json({ message: 'Usuario registrado exitosamente', userId: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Inicio de sesión de usuario
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
  }

  const query = 'SELECT * FROM usuarios WHERE email = $1';

  try {
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password); // Asegúrate de usar await

    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login exitoso', token });
  } catch (err) {
    console.error('Error en el login:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
