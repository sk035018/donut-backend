module.exports = function (sequelize, DataTypes) {
    const likes = sequelize.define(
      "likes",
      {
        postId: {
          allowNull: false,
          type: DataTypes.INTEGER,
        },
        userId: {
          allowNull: false,
          type: DataTypes.INTEGER,
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
  
    return likes;
  };
  