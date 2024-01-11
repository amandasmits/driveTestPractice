const pug = require("pug");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

const Question = require("./QuestionModel");

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1/questions')


//routes

let questionRouter = require("./question-router");
const { ReadableStreamDefaultReader } = require("node:stream/web");
app.use("/TestQuestions", questionRouter)

const renderHome = pug.compileFile("views/homePage.pug")
app.get("/", function(req,res){
    currentQuestion = 0;
    let data = renderHome();
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(data);
});

const renderTest = pug.compileFile("views/Test.pug");
app.get("/Test", function(req,res){
    let data = renderTest();
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(data);   
});


const renderTestResults = pug.compileFile("views/TestResults.pug")
app.post("/SubmitTest", function(req,res){
    let answers = req.body;

    const promises = answers.map(answer => {
        let q = answer.split(":"); //divide the ID of the answered elements into question and answer 
        return Question.find()
        .where("question").regex(new RegExp(q[0])) //find the database object for the question
        .where("correct").regex(new RegExp(q[1])) //find the question only if the answer was correct
        .exec()
        .then(result => {
            if (result.length === 0) { //means that answer was incorrect, record what the question was
            return q[0]; 
            }
            return null; //means it was correct, doesn't matter then 
        })
        .catch(err => {
            console.error(err);
            throw err; 
        });
    });
    
    Promise.all(promises)
        .then(results => {
        const incorrectquestions = results.filter(q => q !== null); //sort out the incorrect answers
        const totalcorrect = answers.length - incorrectquestions.length; //record number of answers

        let data = renderTestResults({incorrect : incorrectquestions, correct : totalcorrect});
        res.statusCode = 201;
        res.send(data)
    
        })
        .catch(err => {
        console.error('Error:', err);
        });
  
        //get all of the incorrect questions from the database and record their correct answers
        //send question, answer, correctanswer in an array to the pug file and send that HTML as a response 
});


let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function() {
	app.listen(3000);
	console.log("Server listening on port 3000, link http://127.0.0.1:3000/");
});