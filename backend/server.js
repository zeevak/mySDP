const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const sequelize = require("./config/db");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:5173" } });

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/land", require("./routes/land"));
app.use("/api/projects", require("./routes/projects"));

io.on("connection", (socket) => {
  console.log("User connected");
  socket.on("projectUpdate", (data) => {
    io.emit("notification", { msg: `Project ${data.project_id} updated` });
  });
  socket.on("disconnect", () => console.log("User disconnected"));
});

const PORT = process.env.PORT || 5000;
sequelize.sync({ force: false }).then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});