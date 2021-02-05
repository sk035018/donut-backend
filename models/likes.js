module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "likes",
    {
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },

      likeType: {
        type: DataTypes.ENUM("POST", "COMMENT"),
        allowNull: false,
      },

      typeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
