module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "messages",
    {
      sender: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },

      reciever: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },

      message: {
        allowNull: false,
        type: DataTypes.STRING,
      },

      delivered: {
        defaultValue: true,
        type: DataTypes.BOOLEAN,
      },

      showTo: {
        defaultValue: 0,
        type: DataTypes.INTEGER,
      },
    },

    {
      timestamps: true,
      createdAt: "created_at",
      underscored: true,
    }
  );
};
