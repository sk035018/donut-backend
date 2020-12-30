require("dotenv").config();
const { router, express } = require("./routes");

const app = express();

app.use(express.static(__dirname));
app.use(router);

app.listen(process.env.port, () => {
  console.log("Server is running on port " + process.env.port);
});
