$( document ).ready(function() {
var intervalRef;
var correctAnswers = 0;
var totalQuestions = 10;
var answerKey = [];
var currentQuestion = 0;
var time;



var queryURL = "https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple";

var getQuestions = function () {
  console.log(queryURL);
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {

    parseQuestionObjToDOM(response);
    giveNewQuestion();

  });
}

var parseQuestionObjToDOM = function (qObj) {

  var trivia = qObj.results;
  var questionHTML;
  var questionTextHTML;
  var answerHTML;
  var divHTML;
  var answers = [];

  for (var i = 0; i < totalQuestions; i++) {
    //Populate answer array with incorrect answers;
    answers = trivia[i].incorrect_answers;

    //Create a Random Number for Insertion of Correct Answer
    //there are four answers per question so the random index is between 0 - 3
    randomIndex = Math.floor(Math.random() * 4)

    //Save answer key for game logic to check answers later
    answerKey[i] = {
      "key": randomIndex,
      "answer": trivia[i].correct_answer
    };

    //Insert correct answer into randomIndex of the answer array
    answers.splice(randomIndex, 0, trivia[i].correct_answer);

    //Create HTML div block for questions
    questionHTML = $("<div class='questions' id='q-" + i + "'>");
    questionHTML.html("<h2 class='display-5'>Question "+ (i + 1) +"</h2>");
    questionTextHTML = $("<div class='question-text'>");
    questionTextHTML.html("<p class='lead'>"+trivia[i].question+"</p> <hr class='my-4'>");
    divHTML = $(questionHTML.append(questionTextHTML));
    for (var j = 0; j < answers.length; j++) {
      answerHTML = $("<div class='btn btn-primary btn-lg answers answer-" + i + "'>");
      $(answerHTML).html(answers[j]);
      divHTML.append(answerHTML);
    }
    console.log(divHTML);
    //write HTML to update the DOM
    $("#play").append(divHTML);

  }

  $(".questions").css({
    "display": "none"
  });

  $(".answers").on("click", function () {

    //return the number associated with the answer so that we can check for the correct answer in the game logic

    //there are four answers per question so get the  index of the html element with the answer class modulo 4

    var answerNumber = $(".answers").index(this) % 4;

    checkAnswer(answerNumber);

  });

}

function giveNewQuestion() {
  resetTimer();
  
  $(".questions").css({"display": "none" });
  $("#play").css({"display": "block" });
  $("#answer").css({"display": "none" });

  $(`#q-${currentQuestion}`).css({"display": "block"});

  
  intervalRef = setInterval(updateTime, 1000);
  

}

function checkAnswer(index) {

  clearInterval(intervalRef);
  resetTimer();

  $("#play").css({"display": "none" });
  $("#answer").css({"display": "block" });
  $("#container_timer").css({"display": "none"});

  var HTML;
  var answerHTML;

  if (index === answerKey[currentQuestion].key) {
    //Correct Answer
    HTML = $("<h2 class='display-5'>Correct!</h3>");
    correctAnswers++;
  } else if (index === -1) {
    //Time Up
    HTML = $("<h2 class='display-5'>Time's Up!</h2>");
  } else {
    //Wrong Answer
    HTML = $("<h2 class='display-5'>Incorrect!</h2>");
  }

  answerHTML = $("<p>The answer is " + answerKey[currentQuestion].answer + "!</p>");

  $("#answer").html(HTML).append(answerHTML);

  currentQuestion++;

  if (currentQuestion === 10)
  {
    $("#play").css({"display": "none" });
    $("#answer").css({"display": "none" });
    $("#container_timer").css({"display": "none"});
    $("#results").css({"display": "initial"});
    var resultHTML= $("<p class='lead'>You got "+ correctAnswers +" out of "+ totalQuestions +" correct!</p>");
    $("#result").html(resultHTML);

    resetTimer();
    return false;
  }
  setTimeout(giveNewQuestion,3000);
}

//Timer Functions
function updateTime() {
  time--;
  var timeHTML = $("<h2>").text(time);
  if (time < 4){
    timeHTML.addClass("warning");
  }
  $("#timer").html(timeHTML);
  if (time == 0) {
    checkAnswer(-1);
  }
}

function resetTimer() {
  clearInterval(intervalRef);
  time = 10;
  var timeHTML = $("<h2>").text(time);
  $("#timer").html(timeHTML);
}

function resetGame(){
  answerKey = [];
  correctAnswers = 0;
  currentQuestion = 0;
  resetTimer();
  $("#play").html("");
  $("#answer").html("");
  getQuestions();
  $("#results").css({"display": "none" });
  $("#play").css({"display": "block"});
  
}
function startGame(){
  getQuestions();
  $("#intro").css({"display": "none" });
  $("#play").css({"display": "block" });
  
}

$("#results").css({"display": "none" });

$("#reset").on("click", resetGame);

$("#start").on("click", startGame);

});