const mongoose = require("mongoose");
const Question = require("./QuestionModel");

const fs = require("fs");

let initial = JSON.parse(fs.readFileSync("questions.json"));

let questions = [];

for (let i in initial["questions"]){
    let q = new Question();
    q.question = initial["questions"][i]["question"];

    for (let a in initial["questions"][i]["answers"]){
        q.answers.push(initial["questions"][i]["answers"][a]);
    }

    q.correct = initial["questions"][i]["correctAnswer"]
    q.number = i;
    questions.push(q);
}

mongoose.connect('mongodb://127.0.0.1/questions');
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', async function () {
	await mongoose.connection.dropDatabase()
    console.log("Dropped database, ready to begin new connection");

    let addedQuestions = 0;
    questions.forEach(question =>{
        question.save()
            .then(result =>{
                addedQuestions ++;
                if (addedQuestions >= questions.length){
                    console.log("All questions saved");
                }
            })
            .catch(err=>{
                throw err;
            })
    });
});
