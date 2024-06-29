const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected to mongoDB...");
  } catch (error) {
    console.log("failed connection to mongoDB!", error);
  }
}

module.exports = connectToDB
