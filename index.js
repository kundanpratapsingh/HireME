const express = require("express");
const app = express();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`HireMe RUNNING ON PORT ${PORT}.`));

app.get("/", (req, res) => {
  res.send("Hello Developer");
});
