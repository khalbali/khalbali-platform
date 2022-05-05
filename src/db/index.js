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

db.user = require('../models/users.js')(sequelize, DataTypes)
db.vote = require('../models/postVotes')(sequelize, DataTypes)
db.moderator = require('../models/moderators')(sequelize, DataTypes)
db.subreddit = require('../models/Subreddit')(sequelize, DataTypes)
db.comment = require('../models/Comment')(sequelize, DataTypes)
db.post = require('../models/Post')(sequelize, DataTypes)
db.commentvote = require('../models/commentVotes')(sequelize, DataTypes)

db.user.hasMany(db.comment)
db.comment.belongsTo(db.user)
db.post.belongsTo(db.user)
db.post.belongsTo(db.subreddit)
db.post.hasMany(db.comment)
db.comment.hasMany(db.comment)
db.comment.belongsTo(db.post)
db.user.hasMany(db.post)
db.subreddit.hasMany(db.post)
db.post.hasMany(db.vote)
db.user.hasMany(db.vote)
db.user.hasMany(db.moderator)
db.subreddit.hasMany(db.moderator)
db.moderator.belongsTo(db.subreddit)
db.moderator.belongsTo(db.user)
db.comment.hasMany(db.commentvote)
db.user.hasMany(db.commentvote)

db.sequelize.sync({ force: false }).then(() => {
  console.log('yes re-sync done!')
})

module.exports = db
