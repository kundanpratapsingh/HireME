const express = require("express");
const app = express();
const connectDB = require("./config/db");

const PORT = process.env.PORT || 3001;

//Connect To DATABASE
connectDB();
app.use(express.json());
app.listen(PORT, () => console.log(`HireMe RUNNING ON PORT ${PORT}.`));

app.use("/api/users", require("./routes/api/users"));
app.use("/api/profiles", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/auth", require("./routes/api/auth"));

//module.exports = app;
