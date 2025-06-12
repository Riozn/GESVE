const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');

router.get('/', pagoController.listarPagos);
router.post('/', pagoController.uploadPago, pagoController.registrarPago);

module.exports = router;
