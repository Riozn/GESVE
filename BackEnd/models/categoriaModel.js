const DAO = require('./dao');
const db = new DAO().getDb();
const { v4: uuidv4 } = require('uuid');

class CategoriaModel {
  async obtenerTodas() {
    const sql = `SELECT id, nombre FROM categorialugar ORDER BY nombre`;
    return db.any(sql);
  }

  async crear(nombre) {
    const id = uuidv4();
    const sql = `INSERT INTO categorialugar(id, nombre) VALUES($1, $2) RETURNING id, nombre`;
    return db.one(sql, [id, nombre]);
  }

  async actualizar(id, nombre) {
    const sql = `UPDATE categorialugar SET nombre=$1 WHERE id=$2 RETURNING id, nombre`;
    return db.one(sql, [nombre, id]);
  }

  async eliminar(id) {
    const sql = `DELETE FROM categorialugar WHERE id=$1`;
    await db.none(sql, [id]);
    return true;
  }
}

module.exports = CategoriaModel;
