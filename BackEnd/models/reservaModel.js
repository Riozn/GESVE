const DAO = require('./dao');
const dao = new DAO();

class ReservaModel {
  async crearReserva(data) {
    const params = [
      data.usuario_id,
      data.lugar_id,
      data.tipo_evento_id,
      data.fecha_inicio,
      data.fecha_fin,
      data.cantidad,
      data.total
    ];

    return dao.transaccion(async t => {
      const result = await t.one(
        `INSERT INTO Reserva (
           id, usuario_id, lugar_id, tipo_evento_id,
           fecha_inicio, fecha_fin, estado, cantidad, total, created_at)
         VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, 'pendiente', $6, $7, CURRENT_DATE)
         RETURNING id`,
        params
      );
      return result;
    });
  }

  async obtenerReservasPorLugar(lugarId) {
    const sql = `
      SELECT fecha_inicio, fecha_fin
      FROM Reserva
      WHERE lugar_id = $1 AND estado IN ('pendiente', 'confirmada')
    `;
    return await dao.consultar(sql, [lugarId]);
  }

  async obtenerPorCliente(clienteId) {
  const sql = `
    SELECT 
      r.fecha_inicio, 
      r.fecha_fin, 
      r.cantidad, 
      r.estado, 
      r.total,
      l.titulo AS lugar,
      u.nombre AS propietario
    FROM Reserva r
    JOIN Lugar l ON r.lugar_id = l.id
    JOIN Usuario u ON l.usuario_id = u.id
    WHERE r.usuario_id = $1
    ORDER BY r.fecha_inicio DESC
  `;
  return await dao.consultar(sql, [clienteId]);
}

  async obtenerTodas() {
    const sql = `
      SELECT
        r.id,
        r.fecha_inicio,
        r.fecha_fin,
        r.cantidad,
        r.total,
        r.estado,
        u.nombre AS cliente,
        l.titulo AS lugar
      FROM Reserva r
      JOIN Usuario u ON r.usuario_id = u.id
      JOIN Lugar l   ON r.lugar_id  = l.id
      ORDER BY r.fecha_inicio DESC
    `;
    return await dao.consultar(sql);
  }
}

module.exports = ReservaModel;
