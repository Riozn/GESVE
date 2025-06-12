const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'CLAVESECRETA';

function getToken(req) {
  const header = req.headers.authorization || '';
  const parts = header.split(' ');
  return parts.length === 2 ? parts[1] : header;
}

module.exports = (req, res, next) => {
  const token = getToken(req);
  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
