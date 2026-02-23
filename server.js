require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});

// Connect to DB after server starts listening (non-blocking for Cloud Run health checks)
connectDB();