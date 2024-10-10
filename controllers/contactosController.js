const { Pool } = require('pg');

// Conexión a la base de datos PostgreSQL
const pool = new Pool({
  host: 'dpg-crmhlo5umphs739eh5dg-a.oregon-postgres.render.com',
  user: 'sistema_usuarios_user',
  password: 'T2UIdTJCBbNrkNPpihVDJ9TMDu8Y82Ms',
  database: 'sistema_usuarios',
  port: 5432,
  ssl: { rejectUnauthorized: false }  // Configuración de SSL
});

exports.agregarContacto = async (req, res) => {
  const { usuarioId, nombre, telefono, relacion } = req.body;

  // Validación de los campos (opcional)
  if (!usuarioId || !nombre || !telefono || !relacion) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  // Query SQL para insertar el contacto
  const query = 'INSERT INTO contactos_emergencia (usuario_id, nombre_contacto, telefono_contacto, relacion) VALUES ($1, $2, $3, $4) RETURNING id';

  try {
    const result = await pool.query(query, [usuarioId, nombre, telefono, relacion]);
    res.status(201).json({ id: result.rows[0].id, nombre, telefono, relacion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.eliminarContacto = async (req, res) => {
  const { id } = req.params;

  // Query SQL para eliminar el contacto por ID
  const query = 'DELETE FROM contactos_emergencia WHERE id = $1';

  try {
    await pool.query(query, [id]);
    res.status(200).json({ message: 'Contacto eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
