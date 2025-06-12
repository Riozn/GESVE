const DAO = require('./dao');
const dao = new DAO();
const db = dao.getDb();

class PagoModel {
  async registrarPago({ reserva_id, monto, imagen_pago, es_pago_completo }) {
    const sql = `
      INSERT INTO Pago (id, reserva_id, imagen_pago, monto, fecha_pago, es_pago_completo)
      VALUES (uuid_generate_v4(), $1, $2, $3, CURRENT_DATE, $4)
    `;
    return dao.consultar(sql, [reserva_id, imagen_pago, monto, es_pago_completo]);
  }

  async registrarTransacciones(lista) {
    for (const item of lista) {
      const sql = `
        INSERT INTO DetalleTransaccion (id, reserva_id, concepto, monto)
        VALUES (uuid_generate_v4(), $1, $2, $3)
      `;
      await dao.consultar(sql, [item.reserva_id, item.concepto, item.monto]);
    }
  }

  async registrarPagoConTransacciones(pago, transacciones) {
    return db.tx(async t => {
      await t.none(
        `INSERT INTO Pago (id, reserva_id, imagen_pago, monto, fecha_pago, es_pago_completo)
         VALUES (uuid_generate_v4(), $1, $2, $3, CURRENT_DATE, $4)`,
        [pago.reserva_id, pago.imagen_pago, pago.monto, pago.es_pago_completo]
      );

      for (const item of transacciones) {
        await t.none(
          `INSERT INTO DetalleTransaccion (id, reserva_id, concepto, monto)
           VALUES (uuid_generate_v4(), $1, $2, $3)`,
          [item.reserva_id, item.concepto, item.monto]
        );
      }
    });
  }
}

module.exports = PagoModel;
