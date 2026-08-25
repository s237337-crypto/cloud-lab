const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

app.get("/api/hello", (req, res) => {
  res.json({
    message: "Backend is working!"
  });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
