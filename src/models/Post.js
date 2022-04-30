const users = require('../models/users')
const Subreddit = require('./Subreddit')

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    type: {
      type: DataTypes.ENUM('text', 'link'),
    },
    title: {
      type: DataTypes.STRING,
    },
    body: {
      type: DataTypes.TEXT,
    },
    author_id: {
      type: DataTypes.INTERGER,
      references: {
        model: users,
        key: 'id',
      },
    },
    subbReddit_id: {
      type: DataTypes.INTERGER,
      references: {
        model: Subreddit,
        key: 'id',
      },
    },
  })
  return Post
}
