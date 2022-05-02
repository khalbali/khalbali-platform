const Subreddit = require('./Subreddit')
const users = require('./users')

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('post', {
    type: {
      type: DataTypes.ENUM('text', 'link'),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  })

  return Post
}
