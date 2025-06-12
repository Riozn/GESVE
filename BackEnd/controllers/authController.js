const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const DAO = require('../models/dao');
const dao = new DAO();
const db = dao.getDb();

const SECRET = 'CLAVESECRETA';

function generarToken(usuario) {
  return jwt.sign({ id: usuario.id, nombre: usuario.nombre, rol: usuario.rol }, SECRET, { expiresIn: '2h' });
}

module.exports = {
  registro: async (req, res) => {
    try {
      const { nombre, email, telefono, contrasena } = req.body;

      const usuario = await db.tx(async t => {
        const existe = await t.any('SELECT 1 FROM Usuario WHERE email = $1', [email]);
        if (existe.length > 0) {
          throw new Error('El usuario ya existe');
        }

        const id = uuidv4();
        const rol = 'cliente';
        const hash = await bcrypt.hash(contrasena, 10);
        await t.none(
          `INSERT INTO Usuario (id, nombre, email, telefono, contrasena, rol, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE)`,
          [id, nombre, email, telefono, hash, rol]
        );

        return { id, nombre, email, rol };
      });

      const token = generarToken(usuario);
      res.json({ usuario, token });
    } catch (err) {
      console.error('Error en registro:', err);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, contrasena } = req.body;
      const rows = await dao.consultar('SELECT * FROM Usuario WHERE email = $1', [email]);
      if (rows.length === 0) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const coincide = await bcrypt.compare(contrasena, rows[0].contrasena);
      if (!coincide) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const usuario = {
        id: rows[0].id,
        nombre: rows[0].nombre,
        email: rows[0].email,
        rol: rows[0].rol
      };
      const token = generarToken(usuario);
      res.json({ usuario, token });
    } catch (err) {
      console.error('Error en login:', err);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  }
};
