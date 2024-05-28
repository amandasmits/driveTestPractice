const pug = require("pug");
const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session');
const bodyParser = require('body-parser');
const storeconnection = require('connect-mongodb-session')(session);
const crypto = require('crypto');
const favicon = require('serve-favicon')
const path = require('path');

const User = require("./UserModel")
const Question = require("./QuestionModel");
const app = express();

app.use(express.static('public'));
faviconPath = "C:/Users/jla_s/driveTestPractice/DrivetestPractice2/public/favicon.ico"
app.use(favicon(faviconPath));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json())




const sessionstore = new storeconnection({
    uri: 'mongodb://127.0.0.1/questions',
    collection: 'users'
})

mongoose.connect('mongodb://127.0.0.1/questions')

//this will clear the sessions when the server shuts down
process.on('SIGINT', async() =>{
    await sessionstore.clear();
    console.log("sessions cleared");
    process.exit(0);
})

app.use(session({
    secret: "secretcodeforsessions",
    cookie: {maxAge:100000},
    rolling: true,
    store: sessionstore,
    resave: true,
    saveUninitialized: false
}));

//routes

let questionRouter = require("./question-router");
const { ReadableStreamDefaultReader } = require("node:stream/web");
app.use("/", questionRouter)

const renderLogin = pug.compileFile("views/login.pug");
app.get("/", function(req,res){
    let data = renderLogin();
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(data);
})

const renderNewUser = pug.compileFile("views/newUser.pug");
app.get("/newUser", function(req,res){
    let data = renderNewUser();
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(data);
})

function hashPasswords(password){
    const hash = crypto.createHash('sha256');
    hash.update(password)
    return hash.digest('hex');
}

app.get("/redirect", (req,res) => {
    res.redirect("/");
})

app.post("/newUser",function(req,res){
    let u = new User();
    u.username = req.body.username;
    encrypted = hashPasswords(req.body.password);
    u.password = encrypted;
    u.points = 0;

    User.findOne({"username": req.body.username}).then( result =>{
        if (result){
           res.status(400).send("User already exists"); 
        } else {
            u.save()
                .then(result =>{
                    res.redirect("/");
                    console.log("saved");
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).send("Error saving user")
                })
        }
    });  
    

});

const renderHome = pug.compileFile("views/homePage.pug")
app.get("/homePage", function(req,res){
    User.find().where("username").equals(req.session.username).then(result =>{
        let data = renderHome({points: result[0].points});
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.send(data)
    })



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
        const totalcorrect = answers.length - incorrectquestions.length; //record number of correct answers
        User.findOne({username: req.session.username}).then(user =>{
            user.points = user.points + 200;
            user.save();



            let data = renderTestResults({incorrect : incorrectquestions, correct : totalcorrect, points: user.points});
            res.statusCode = 201;
            res.send(data)

        })
    
        })
        .catch(err => {
        console.error('Error:', err);
        });
  
        //get all of the incorrect questions from the database and record their correct answers
        //send question, answer, correctanswer in an array to the pug file and send that HTML as a response 
});

app.post("/login", function(req,res){
	if (req.session.loggedin) {
        res.redirect(`/homePage`)
		return;
	}

	let username = req.body.username;
	let password = hashPasswords(req.body.password);

    User.find()
    .where("username").equals(username)
    .where("password").equals(password)
    .then(result =>{
        if (result.length > 0){
            req.session.loggedin = true;
            req.session.username = username;
            res.redirect(`/homePage`)
        } else {
            res.status(404).send("No user with that password, try again")
        }
    })
    .catch(err=>{
        console.log("error caught", err)
        res.status(404).send("No user with that password, try again")
        return;
    });

});

const renderPracticeQuestionLandingPage = pug.compileFile("views/PracticeQuestionLandingPage.pug")
app.get("/PracticeQuestionLandingPage", function(req,res){
    let data = renderPracticeQuestionLandingPage();
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(data);    
});


const renderPracticeQuestionsComplete = pug.compileFile("views/PracticeQuestionsComplete.pug");
app.get("/QuestionsComplete", function(req,res){
    User.findOne({username: req.session.username}).then(user =>{
        user.points = user.points + 100;
        user.save();

        let data = renderPracticeQuestionsComplete({points: user.points});
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(data);  
    })
})


app.get("/logout", function(req,res){
    req.session.destroy(err =>{
        if (err){
            console.log("error logging out")
        } else {
            res.redirect("/")
        }
    })
})

console.log(app._router.stack);

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function() {
	app.listen(3000);
	console.log("Server listening on port 3000, link http://127.0.0.1:3000/");
});