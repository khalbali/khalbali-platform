module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    oauthId: { type: DataTypes.STRING },
    username: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING },
  })
  return User
}
