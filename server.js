require("dotenv").config();
const app = require("./src/app");

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT} 🚀`);
});