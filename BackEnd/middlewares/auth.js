const jwt = require('jsonwebtoken');
const DAO = require('../models/dao');
const db = new DAO().getDb();

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_aqui';

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');

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
    console.error('JWT Error:', err);
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};
