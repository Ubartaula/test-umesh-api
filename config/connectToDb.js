const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const connectToDataBase = mongoose.connect(process.env.URI);

module.exports = connectToDataBase;
