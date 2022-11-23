const mongoose = require("mongoose");

const { MONGO_URI } = process.env;

exports.connect = () => {
    //connecting to the database
    mongoose
        .connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology:true,
            useCreateIndex: true,
            useFindAndModify: false,
        })
        .then(() => {
            console.log("Successfully connected to database");
        })
        .catch((error) => {
            console.log("database connection failed. exiting now...");
            console.log(error);
            process.exit(1);
        });
};