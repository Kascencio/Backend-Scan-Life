const express = require('express');
const router = express.Router();
const { generarQR, leerQR } = require('../controllers/qrController');

router.post('/generar', generarQR);
router.get('/:id', leerQR);

module.exports = router;
