const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const URI = "mongodb://localhost:27017/Harry";

const connectToMongo = () => {
 try {
    mongoose.connect(URI, () => {
        console.log("Connection complete with mongo");
      });
 } catch (error) {
    console.log(error)
 }
};

module.exports = connectToMongo;
