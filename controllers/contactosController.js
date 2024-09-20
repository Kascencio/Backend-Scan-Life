const mysql = require('mysql2');

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: '172.17.230.165',
  user: 'remote_user',
  password: 'remote_password',
  database: 'sistema_usuarios',
});

exports.agregarContacto = (req, res) => {
  const { usuarioId, nombre, telefono, relacion } = req.body;

  const query = 'INSERT INTO contactos_emergencia (usuario_id, nombre_contacto, telefono_contacto, relacion) VALUES (?, ?, ?, ?)';
  db.query(query, [usuarioId, nombre, telefono, relacion], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: result.insertId, nombre, telefono, relacion });
  });
};

exports.eliminarContacto = (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM contactos_emergencia WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Contacto eliminado' });
  });
};
