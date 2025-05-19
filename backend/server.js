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

app.use("/api/customer", require("./routes/customerRoutes"));
app.use("/api/staff", require("./routes/staffRoutes"));
app.use("/api/land", require("./routes/landRoutes"));
app.use("/api/project", require("./routes/projectRoutes"));
app.use("/api/message", require("./routes/messageRoutes"));
app.use("/api/progress", require("./routes/progressRoutes"));

io.on("connection", (socket) => {
  console.log("User connected");
  socket.on("projectUpdate", (data) => {
    io.emit("notification", { msg: `Project ${data.project_id} updated` });
  });
  socket.on("disconnect", () => console.log("User disconnected"));
});

app.get("/", (req, res) => {
  res.send("Backend service is running!");
});

const PORT = process.env.PORT || 5000;
sequelize.sync({ force: false }).then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});