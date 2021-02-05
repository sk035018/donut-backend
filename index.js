require("dotenv").config();
const { router, express } = require("./routes");

const { PORT } = process.env;

const app = express();

app.use(router);

const server = require("http").createServer(app);

require("./socket").connection(server, {
  cors: { origin: "http://localhost:3000" },
});

server.listen(PORT || 4000, () =>
  console.log("Server Started Successfully on Port : ", PORT)
);
