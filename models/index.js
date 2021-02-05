const { Sequelize } = require("sequelize");

const { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "postgres",
  sync: true,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Creating Models
const db = {
  Sequelize,
  Users: require("./users")(sequelize, Sequelize.DataTypes),
  Posts: require("./posts")(sequelize, Sequelize.DataTypes),
  Likes: require("./likes")(sequelize, Sequelize.DataTypes),
  Friends: require("./friends")(sequelize, Sequelize.DataTypes),
  Comments: require("./comments")(sequelize, Sequelize.DataTypes),
  Messages: require("./messages")(sequelize, Sequelize.DataTypes),
  Notifications: require("./notifications")(sequelize, Sequelize.DataTypes),
  SharedPosts: require("./sharedPosts")(sequelize, Sequelize.DataTypes),
  transaction: (cb) => sequelize.transaction(cb),
};

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Database connnection established successfully");
  } catch (error) {
    console.log("Model Error", error);
  }
})();

// Associations
db.Users.hasMany(db.Posts, { foreignKey: "userId" });
db.Friends.belongsTo(db.Users, { foreignKey: "user1" });

module.exports = db;
