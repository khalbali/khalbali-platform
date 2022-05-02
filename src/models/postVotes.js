const Post = require('./Post')
const users = require('./users')

module.exports = (sequelize, DataTypes) => {
  const Vote = sequelize.define('votes', {
    vote_value: { type: DataTypes.ENUM('1', '-1', '0'), allowNull: false },
  })

  return Vote
}
