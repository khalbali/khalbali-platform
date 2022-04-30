module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    username: { type: DataTypes.STRING, alowwNull: false },
    password: { type: DataTypes.STRING, alowwNull: false },
    tokens: { type: DataTypes.TEXT, alowwNull: false },
  })
  return User
}
