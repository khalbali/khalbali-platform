module.exports = (sequelize, DataTypes) => {
  const Subreddit = sequelize.define('Subreddit', {
    name: {
      type: DataTypes.STRING,
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
