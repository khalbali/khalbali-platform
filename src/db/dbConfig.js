module.exports = {
  HOST: 'localhost',

  DB: 'mysql',
  USER: 'root',
  PASSWORD: 'piya19117',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
}
