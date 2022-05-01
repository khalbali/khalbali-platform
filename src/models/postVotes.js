const Post = require('./Post')
const users = require('./users')

module.exports = (sequelize, DataTypes) => {
  const Vote = sequelize.define('votes', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'posts',
        key: 'id',
      },
    },
    vote_value: { type: DataTypes.ENUM('1', '-1', '0'), allowNull: false },
  })

  return Vote
}
