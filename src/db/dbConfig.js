//require('dotenv').config()
module.exports = {
  HOST: 'localhost',
  DB: 'testdata',
  USER: 'root',
  PASSWORD: 'kartikey',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
}
