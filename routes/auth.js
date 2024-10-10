const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.post('/register', register); // Esta ruta debe estar presente
router.post('/login', login); // Esta ruta también debe estar presente

module.exports = router;