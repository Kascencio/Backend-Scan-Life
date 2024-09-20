const express = require('express');
const router = express.Router();
const { agregarContacto, eliminarContacto } = require('../controllers/contactosController');

// Ruta para agregar un nuevo contacto de emergencia
router.post('/', agregarContacto);

// Ruta para eliminar un contacto de emergencia
router.delete('/:id', eliminarContacto);

module.exports = router;
