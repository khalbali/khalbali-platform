const Post = require('./Post')
const users = require('./users')
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Subreddit', {
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    author_id: {
      type: DataTypes.INTERGER,
      allowNull: false,
      references: {
        model: users,
        key: 'id',
      },
    },
    post_id: {
      type: DataTypes.INTERGER,
      allowNull: false,
      references: {
        model: Post,
        key: 'id',
      },
    },
    parent_comment_id: {
      type: DataTypes.INTERGER,
      allowNull: false,
      references: {
        model: Comment,
        key: 'id',
      },
    },
  })

  return Comment
}
