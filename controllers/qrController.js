const mysql = require('mysql2');
const QRCode = require('qrcode');

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

exports.generarQR = (req, res) => {
  const { usuario_id, nombre, apellido, edad, institucion_medica, alergias } = req.body;

  const informacion = `${nombre}, ${apellido}, ${edad}, ${institucion_medica}, ${alergias}`;

  QRCode.toDataURL(informacion, (err, url) => {
    if (err) return res.status(500).json({ error: 'Error generando QR' });

    const query = 'INSERT INTO informacion_personal (usuario_id, nombre, apellido, edad, institucion_medica, alergias, qr_code) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [usuario_id, nombre, apellido, edad, institucion_medica, alergias, url], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Información guardada y QR generado', qr_code: url });
    });
  });
};

exports.leerQR = (req, res) => {
  const { id } = req.params;

  const query = 'SELECT * FROM informacion_personal WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'No se encontró información' });

    res.json(result[0]);
  });
};
