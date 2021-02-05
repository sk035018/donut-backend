module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "notifications",
    {
      from: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      to: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("LIKEPOST", "LIKECOMMENT", "COMMENT", "SHARE"),
        allowNull: false,
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      delivered: {
        defaultValue: true,
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
