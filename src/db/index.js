const dbConfig = require('./dbConfig.js')

const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: '127.0.0.1',
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
})

sequelize
  .authenticate()
  .then(() => {
    console.log('connected..')
  })
  .catch((err) => {
    console.log('Error' + err.message)
  })

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.users = require('../models/users.js')(sequelize, DataTypes)
db.votes = require('../models/postVotes')(sequelize, DataTypes)
db.moderators = require('../models/moderators')(sequelize, DataTypes)

db.sequelize.sync({ force: false }).then(() => {
  console.log('yes re-sync done!')
})

module.exports = db
