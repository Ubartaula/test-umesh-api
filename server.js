require("dotenv").config();
require("express-async-handler");
const path = require("path");
const cors = require("cors");
const express = require("express");
const corsOptions = require("./config/coreOption");
const connectToDataBase = require("./config/connectToDb");
const { default: mongoose } = require("mongoose");
const { logger } = require("./middleware/logEvent");
const cookieParser = require("cookie-parser");
const errorLogger = require("./middleware/errorLogger");
const app = express();
const PORT = process.env.PORT || 4000;

//connection to dataBAse
connectToDataBase;
app.use(logger);
app.use(cors(corsOptions));

//middleware
app.use(express.json());
app.use(cookieParser());

//route
app.use("/", require("./route/rootRoute"));
app.use("/users", require("./route/userRoute"));
app.use("/notes", require("./route/noteRoute"));
//app.use("/auth", require("./route/authRoute"));

//error page
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.send("No Json data");
  } else {
    res.send("not found the kew word, try search");
  }
});

app.use(errorLogger);

mongoose.connection.once("open", () => {
  console.log(`app is connected to Mongo Data Base`);

  app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
  });
});
