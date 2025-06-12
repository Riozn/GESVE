const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const getToken = require('../helpers/getToken');

module.exports = (req, res, next) => {
  const token = getToken(req);
  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
