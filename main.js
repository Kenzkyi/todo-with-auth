const app = require("./app");
const connectToDB = require("./db");
require("dotenv").config();

const PORT = process.env.PORT;

connectToDB();

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
