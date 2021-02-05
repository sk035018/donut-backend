module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "users",
    {
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      userName: {
        unique: true,
        type: DataTypes.STRING,
        allowNull: false,
      },

      dob: DataTypes.DATEONLY,

      email: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING,
      },

      bio: DataTypes.STRING,

      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },

      profilePic: DataTypes.STRING,

      totalFriends: {
        defaultValue: 0,
        type: DataTypes.INTEGER,
      },

      activeAt: DataTypes.DATE,
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
