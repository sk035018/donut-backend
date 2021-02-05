module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "posts",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      text: DataTypes.STRING,

      media: DataTypes.STRING,

      totalLikes: {
        defaultValue: 0,
        type: DataTypes.INTEGER,
      },

      totalComments: {
        defaultValue: 0,
        type: DataTypes.INTEGER,
      },

      isShared: {
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
    },

    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
      deletedAt: false,
      underscored: true,
    }
  );
};
