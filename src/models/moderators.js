module.exports = (sequelize, DataTypes) => {
  const Moderator = sequelize.define('moderators', {
    user_id: { type: DataTypes.INTEGER, alowwNull: false, primaryKey: true },
    subreddit_id: {
      type: DataTypes.INTEGER,
      alowwNull: false,
      primaryKey: true,
    },
  })
  return Moderator
}
