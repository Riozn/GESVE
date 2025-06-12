const pgp = require('pg-promise')();

const db = pgp({
  host: 'localhost',
  port: 5432,
  database: 'GesEven',
  user: 'postgres',
  password: '021147'
});

class DAO {
  consultar(sql, params = []) {
    return db.any(sql, params);
  }

  transaccion(fn) {
    return db.tx(fn).catch(err => {
      console.error('Rollback transacción:', err.message);
      throw err;
    });
  }

  getDb() {
    return db;
  }
}

module.exports = DAO;
