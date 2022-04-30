module.exports = (sequelize, DataTypes) => {
  const Vote = sequelize.define('votes', {
    user_id: { type: DataTypes.INTEGER, alowwNull: false, primaryKey: true },
    post_id: { type: DataTypes.INTEGER, alowwNull: false, primaryKey: true },
    vote_value: { type: DataTypes.ENUM('1', '-1', '0'), alowwNull: false },
  })
  return Vote
}
