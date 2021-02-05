module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "comments",
    {
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },

      postId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },

      text: {
        allowNull: false,
        type: DataTypes.STRING,
      },

      media: DataTypes.STRING,

      totalLikes: {
        defaultValue: 0,
        type: DataTypes.INTEGER,
      },
    },

    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: false,
      underscored: true,
    }
  );
};
