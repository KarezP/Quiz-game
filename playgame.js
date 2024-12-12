const gameContainer = document.querySelector('.root');


let currentQuestionIndex = 0;
let score                = 0;
let questions            = [];
let timeInterval;


const startButton = document.createElement('button');
startButton.textContent = 'Start Game';
gameContainer.appendChild(startButton);

startButton.addEventListener('click', () => {
startButton.classList.add('hide');//it would be hide when the user clicked on. 
fetchQuestionsAndStartGame()
});

async function fetchQuestionsAndStartGame() {

   try{

  
   const response = await fetch('playGame.json');
   if (!response.ok) throw new Error('Failed to fetch JSON file');

   questions = await response.json();
 

  showQuestions()
   
} catch(error ){
   console.error('Error loading questions:', error);
   gameContainer.innerHTML = `<p>Error loading game questions. Please try again later.</p>`;
  }
} 

function showQuestions() {
  if (currentQuestionIndex >= questions.length) {
   gameContainer.innerHTML = `<p>Your final score is: ${score}</p>`;
   

   displayRestartButton()
   return
  }
  

  const question = questions[currentQuestionIndex];


  gameContainer.innerHTML = '';

  const scoreDisplay = document.createElement('p');
  scoreDisplay.textContent = `Score: ${score}`;
  scoreDisplay.id = 'score-display';
  gameContainer.appendChild(scoreDisplay);

  const questionElement = document.createElement('div');
  questionElement.textContent = question.question;
  gameContainer.appendChild(questionElement);


  //set time remaining
  let timeRemaining = 10;
  const timerDisplay = document.createElement('p');
  timerDisplay.textContent = `Time remaining: ${timeRemaining}s`;
  timerDisplay.id = 'timer-display';
  gameContainer.appendChild(timerDisplay);

  timeInterval = setInterval(() => {
    timeRemaining--;
    timerDisplay.textContent = `Time remaining: ${timeRemaining}s`;

    if (timeRemaining <= 0) {
      clearInterval(timeInterval);
      moveToNextQuestion();
    }
  }, 1000);

  question.options.forEach(option => {
    const optionButton = document.createElement('button');
    optionButton.textContent = option;
    gameContainer.appendChild(optionButton);

    optionButton.addEventListener('click', () => {
      clearInterval(timeInterval)
      if (option === question.answer) {
         optionButton.classList.add('correct');
         score++;
       } else {
         optionButton.classList.add('incorrect');
         

         //while the user selects a wrong answer, it shows the correct one. 
         document.querySelectorAll('button').forEach(btn => {
           if (btn.textContent === question.answer) {
             btn.classList.add('correct');
           }
         });
       }
      
      
      
      document.querySelectorAll('button').forEach(btn => btn.disabled = true);
      

      scoreDisplay.textContent = `Score until now: ${score}`;



      

      
    

    setTimeout(() => {
      currentQuestionIndex++;
      showQuestions();
    }, 1000);
  })
  })
}

function displayRestartButton() {
   const restartBtn = document.createElement('button');
   restartBtn.textContent = 'Restart game';
   gameContainer.appendChild(restartBtn);

   restartBtn.addEventListener('click', () => {
   restartBtn.classList.add('hide');
   currentQuestionIndex = 0;
   score = 0;
   fetchQuestionsAndStartGame()
   
});
}


function moveToNextQuestion() {
  currentQuestionIndex++;
  showQuestions();

}



