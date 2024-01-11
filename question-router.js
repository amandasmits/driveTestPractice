const Question = require("./QuestionModel");
const express = require("express")
let router = express.Router();

router.get("/", loadQuestions);
router.get("/", respondQuestions);

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

function respondQuestions(req,res,next){
    res.format({
		"text/html": () => { res.render("TestQuestions.pug", { questions: res.questions}) },
		"application/json": () => { res.status(200).json(res.questions) }
    })
};

module.exports = router;