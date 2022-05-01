const Subreddit = require('./Subreddit')
const users = require('./users')

module.exports = (sequelize, DataTypes) => {
  const Moderator = sequelize.define('moderators', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    subreddit_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'subreddits',
        key: 'id',
      },
    },
  })

  return Moderator
}
