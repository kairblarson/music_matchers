const mongoose = require("mongoose");

mongoose
    .connect("mongodb://localhost:27017/music_matchers_db")
    .then(() => {
        console.log("Connected to database successfully...");
    })
    .catch((err) => console.log(err));