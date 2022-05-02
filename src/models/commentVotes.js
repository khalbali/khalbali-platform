module.exports = (sequelize, DataTypes) => {
  const CommentVotes = sequelize.define('commentvote', {
    vote_value: { type: DataTypes.ENUM('1', '-1', '0'), allowNull: false },
  })

  return CommentVotes
}
