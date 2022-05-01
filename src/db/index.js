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
db.Subreddit = require('../models/Subreddit')(sequelize, DataTypes)
db.comment = require('../models/Comment')(sequelize, DataTypes)
db.Post = require('../models/Post')(sequelize, DataTypes)

db.users.hasMany(db.comment, {
  foreignKey: 'author_id',
  foreignKeyConstraint: true,
})
db.Post.hasMany(db.comment, {
  foreignKey: 'post_id',
  foreignKeyConstraint: true,
})
db.comment.hasMany(db.comment, {
  foreignKey: 'parent_comment_id',
  foreignKeyConstraint: true,
})
db.users.hasMany(db.Post, {
  foreignKey: 'author_id',
  foreignKeyConstraint: true,
})
db.Subreddit.hasMany(
  db.Post,
  { constraints: false },
  {
    foreignKey: 'subbReddit_id',
    foreignKeyConstraint: true,
  }
)
db.Post.hasMany(
  db.votes,
  { constraints: false },
  {
    foreignKey: 'post_id',
    foreignKeyConstraint: true,
  }
)
db.users.hasMany(db.votes, {
  foreignKey: 'user_id',
  foreignKeyConstraint: true,
})
db.users.hasMany(db.moderators, {
  foreignKey: 'user_id',
  foreignKeyConstraint: true,
})
db.Subreddit.hasMany(
  db.moderators,
  { constraints: false },
  {
    foreignKey: 'subreddit_id',
    foreignKeyConstraint: true,
  }
)

db.sequelize.sync({ force: false }).then(() => {
  console.log('yes re-sync done!')
})

module.exports = db
