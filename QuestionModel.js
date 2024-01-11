const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let QuestionSchema = Schema({
    question: {
        type: String,
        required: true,
    },
    answers: [String],
    correct: {
        type: String,
    },
    number:{
        type: Number,
    }
    
});

module.exports = mongoose.model("Question", QuestionSchema);