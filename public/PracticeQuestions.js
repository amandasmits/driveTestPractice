let questions;
let curr;

document.addEventListener("DOMContentLoaded", function(){
    let questionsData = document.getElementById("questionsdata").innerText;
    questionsData = questionsData.substring(2)
    console.log(questionsData)
    questions = (JSON.parse(questionsData))

    curr = 0;

    function showQuestion(index){
        document.getElementById("question").innerText = questions[index].question;
        document.getElementById("answer1").innerText = questions[index].answers[0];
        document.getElementById("answer2").innerText = questions[index].answers[1];
        document.getElementById("answer3").innerText = questions[index].answers[2];
        document.getElementById("answer4").innerText = questions[index].answers[3];
    }
    window.GlobalShowQuestion = showQuestion;

    showQuestion(curr);

    document.getElementById("next").onclick = (function(){
        if (curr <(questions.length -1)){
            curr++
            showQuestion(curr)
        } else {
            document.getElementById("complete").style.display = "block"
        }
    })

    document.getElementById("back").onclick = (function(){
        if (curr>0){
            curr--;
            showQuestion(curr)
        }
    })

})

function verify(letter){
    console.log(letter)
    console.log(questions[curr].correct)
    if (questions[curr].correct === letter){
        alert("Yay! You got it!");
        curr++
        GlobalShowQuestion(curr)
    } else {
        alert("Sorry princess! Try again!");
    }
}