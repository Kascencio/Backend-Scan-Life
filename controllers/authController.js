const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});
exports.register = (req, res) => {
  const { nombre, apellido, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const query = 'INSERT INTO usuarios (nombre, apellido, email, password) VALUES (?, ?, ?, ?)';
  db.query(query, [nombre, apellido, email, hashedPassword], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(query, [email], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(400).json({ message: 'Usuario no encontrado' });

    const user = result[0];
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user.id, email: user.email }, 'secretkey', { expiresIn: '1h' });
    res.status(200).json({ message: 'Login exitoso', token });
  });
};
