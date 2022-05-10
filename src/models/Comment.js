const Post = require('./Post')
const users = require('./users')
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('comment', {
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  })

  return Comment
}
