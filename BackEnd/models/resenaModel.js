const DAO = require('./dao');
const db = new DAO().getDb();
const { v4: uuidv4 } = require('uuid');

class ResenaModel {
  async crear({ usuario_id, lugar_id, puntuacion, comentario }) {
    const qrReserva = `
      SELECT id
      FROM "Reserva"
      WHERE usuario_id = $1 AND lugar_id = $2
      LIMIT 1
    `;
    const res = await db.oneOrNone(qrReserva, [usuario_id, lugar_id]);
    const reserva_id = res ? res.id : null;

    const qrInsert = `
      INSERT INTO "Reseña"(id, reserva_id, usuario_id, puntuacion, comentario, fecha)
      VALUES($1, $2, $3, $4, $5, NOW())
      RETURNING *
    `;
    const values = [uuidv4(), reserva_id, usuario_id, puntuacion, comentario];
    return await db.one(qrInsert, values);
  }

  async listarPorLugar(lugar_id) {
    const qr = `
      SELECT r.id, r.puntuacion, r.comentario, r.fecha, u.nombre AS usuario
      FROM "Reseña" r
      LEFT JOIN "Reserva" res ON res.id = r.reserva_id
      JOIN "Usuario" u ON u.id = r.usuario_id
      WHERE res.lugar_id = $1
      ORDER BY r.fecha DESC
    `;
    return await db.any(qr, [lugar_id]);
  }

  async listarTodas() {
    const qr = `
      SELECT r.id, r.puntuacion, r.comentario, r.fecha,
             u.nombre AS usuario, l.titulo AS lugar
      FROM "Reseña" r
      LEFT JOIN "Reserva" res ON res.id = r.reserva_id
      LEFT JOIN "Lugar" l ON res.lugar_id = l.id
      JOIN "Usuario" u ON u.id = r.usuario_id
      ORDER BY r.fecha DESC
    `;
    return await db.any(qr);
  }
}

module.exports = ResenaModel;
