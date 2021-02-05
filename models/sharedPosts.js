module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "sharedPosts",
    {
      originalPostId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      sharedPostId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
