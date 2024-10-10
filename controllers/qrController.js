const { Pool } = require('pg');
const QRCode = require('qrcode');

const pool = new Pool({
  host: 'dpg-crmhlo5umphs739eh5dg-a.oregon-postgres.render.com',
  user: 'sistema_usuarios_user',
  password: 'T2UIdTJCBbNrkNPpihVDJ9TMDu8Y82Ms',
  database: 'sistema_usuarios',
  port: 5432,
  ssl: { rejectUnauthorized: false }  // Configuración de SSL
});


exports.generarQR = async (req, res) => {
  const { usuario_id, nombre, apellido, edad, institucion_medica, alergias } = req.body;
  
  // Concatenar la información para generar el QR
  const informacion = `${nombre}, ${apellido}, ${edad}, ${institucion_medica}, ${alergias}`;

  try {
    // Generar código QR como un Data URL
    const qrUrl = await QRCode.toDataURL(informacion);

    // Guardar en la base de datos
    const query = `INSERT INTO informacion_personal 
                   (usuario_id, nombre, apellido, edad, institucion_medica, alergias, qr_code) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`;
    const result = await pool.query(query, [usuario_id, nombre, apellido, edad, institucion_medica, alergias, qrUrl]);

    // Devolver el código QR generado y el id
    res.status(201).json({ message: 'Información guardada y QR generado', qr_code: qrUrl, id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: 'Error generando QR o guardando la información', detail: err.message });
  }
};


exports.leerQR = async (req, res) => {
  const { id } = req.params;

  try {
    // Buscar la información en la base de datos por ID
    const query = 'SELECT * FROM informacion_personal WHERE id = $1';
    const result = await pool.query(query, [id]);

    // Verificar si existe el registro
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontró información' });
    }

    // Devolver la información asociada al QR
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
