const { Sequelize } = require("sequelize");
const { fs } = require("../utils");

const db = {};

const { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "postgres",
  sync: true,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
    logging: true,
  },
});

// Creating Models
db.users = require('./users')(sequelize, Sequelize.DataTypes);
db.posts = require('./posts')(sequelize, Sequelize.DataTypes);
db.likes = require('./likes')(sequelize, Sequelize.DataTypes);
db.comments = require('./comments')(sequelize, Sequelize.DataTypes);

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Database connnection established successfully");
  } catch (error) {
    console.log(error, ">err in index model.");
  }
})();

// Providing Associations to models
db.posts.belongsTo(db.users, { foreignKey: 'userId' });

db.sequelize = sequelize;

db.transaction = (cb) => {
  return sequelize.transaction(cb);
}

module.exports = db;