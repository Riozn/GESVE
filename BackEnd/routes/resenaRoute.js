const express = require('express');
const router  = express.Router();
const auth    = require('../middlewares/auth');
const {
  crearResena,
  obtenerResenas,
  listarResenas
} = require('../controllers/resenaController');

router.post('/', auth, crearResena);

router.get('/:lugarId', obtenerResenas);
router.get('/', listarResenas);

module.exports = router;
