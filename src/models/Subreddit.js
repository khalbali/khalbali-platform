module.exports = (sequelize, DataTypes) => {
  const Subreddit = sequelize.define('subreddit', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  })

  return Subreddit
}
