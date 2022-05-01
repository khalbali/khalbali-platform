module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    username: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    tokens: { type: DataTypes.TEXT, allowNull: false },
  })
  return User
}
