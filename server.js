require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT|| 5005;

connectDB();

app.listen(PORT, () => {
  console.log("Server running on port 5000 🚀");
});