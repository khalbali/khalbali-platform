//require('dotenv').config()
module.exports = {
  HOST: 'localhost',

  DB: 'test',
  USER: 'root',
  PASSWORD: '@@@@',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
}
