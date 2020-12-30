module.exports = function (sequelize, DataTypes) {
  const posts = sequelize.define(
    "posts",
    {
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      text: {
        type: DataTypes.STRING,
      },
      media: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: false,
      underscored: true,
      freezeTableName: true,
    }
  );
  return posts;
};
