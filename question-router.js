const Question = require("./QuestionModel");
const express = require("express")
let router = express.Router();

router.get("/respondTest", loadQuestions);
router.get("/respondTest", respondQuestionsTest);
router.get("/respondPractice", loadQuestions)
router.get("/respondPractice", respondQuestionsPractice);

function loadQuestions(req,res,next){
	Question.find({})
		.exec()
		.then(result => {
			res.questions= result;
			next();
			return;
		})
		.catch(err => {
			res.status(500).send("Error reading questions.");
			console.log(err);
			return;
		});
};


function respondQuestionsTest(req,res,next){
    res.format({
		"text/html": () => { res.render("TestQuestions.pug", { questions: res.questions}) },
		"application/json": () => { res.status(200).json(res.questions) }
    })
};

function respondQuestionsPractice(req,res,next){
	console.log("practice")
    res.format({
		"text/html": () => { res.render("PracticeQuestions.pug", {questions: JSON.stringify(res.questions)}) },
		"application/json": () => { res.status(200).json(res.questions) }
    })	
}
module.exports = router;