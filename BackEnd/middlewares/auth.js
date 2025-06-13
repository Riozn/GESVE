const jwt = require('jsonwebtoken');
const DAO = require('../models/dao');
const db = new DAO().getDb();

const { JWT_SECRET } = require('../config');
const getToken = require('../helpers/getToken');

module.exports = async (req, res, next) => {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ error: 'Falta token de autorización.' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    const row = await db.oneOrNone('SELECT nombre FROM "Usuario" WHERE id = $1', [payload.id]);
    if (!row) {
      return res.status(401).json({ error: 'Usuario no encontrado.' });
    }

    req.user = {
      id: payload.id,
      email: payload.email,
      nombre: row.nombre
    };

    next();
  } catch (err) {
    console.error('Auth error:', err);
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token inválido o expirado.' });
    }
    return res.status(500).json({ error: 'Error al validar token.' });
  }
};
