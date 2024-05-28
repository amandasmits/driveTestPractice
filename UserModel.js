const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserSchema = Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String, 
        required: true,
    },
    points:{
        type:Number, 
        value: 0,
    }
});

module.exports = mongoose.model("User", UserSchema);