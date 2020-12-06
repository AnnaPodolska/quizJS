interface IQuiz {
    quizNum: number;
    questions: IQuestion[];
} 

interface IQuestion {
        question: string;
        answers: string[];
        correctanswer: string;
}

let quizjson: string = 
`{ 
    "quizNum": "1",
    "questions" : [
        {
            "question" : "(2 + 4) : 3 = ",
            "answers" : ["3", "2", "4"],
            "correctanswer"  : "2"
            },
            {
            "question" : "[(9 + 11) : 4] * 3 + 4= ",
            "answers" : ["35", "27", "19"],
            "correctanswer"  : "19"
            },
            {
            "question" : "[(7 - 2) * 3]^2 * 2 - 2= ",
            "answers" : ["0", "448", "88"],
            "correctanswer"  : "448"
            },
            {
            "question" : "sqrt(64) * 3 - 1= ",
            "answers" : ["17", "16", "23"],
            "correctanswer"  : "23"
            },
            {
            "question" : "2^2 + 4^2= ",
            "answers" : ["36", "12", "20"],
            "correctanswer"  : "20"
            },
            {
            "question" : "sqrt(5^2) + 1  = ",
            "answers" : ["6", "sqrt(26)", "sqrt(11)"],
            "correctanswer"  : "6"
            },
            {
            "question" : " 10 + 6 * 0 - 2 * 3= ",
            "answers" : ["4", "14", "-6"],
            "correctanswer"  : "4"
            }
    ]}`;

    let quizContent : IQuiz = JSON.parse(quizjson);
    let timeSpent = new Array();
    // let answersTable = new Map<number, string>();
    let answersTable = new Array();

    let userName :string;
    let userScore :number = 0;
    let currentTime :Date;
    let questionCounter :number;
    let questionsList :IQuestion[] = quizContent.questions;

    let middlePart = document.getElementsByClassName('middle')[0] as HTMLDivElement;
    let infoIcon = document.getElementById('info');
    let homeIcon = document.getElementById('home');
    let intro = document.getElementById('intro') as HTMLElement;

    let infoWindow = document.createElement('div');
    infoWindow.className = 'infoWindow';
    infoWindow.appendChild(document.createTextNode(intro.textContent));
    middlePart.appendChild(infoWindow);

    let buttonsDiv = document.createElement('div');
    let txtDiv = document.createElement('div');

    let previousBtn = document.createElement('button');
    previousBtn.id = 'prev';
    let nextBtn = document.createElement('button');
    nextBtn.id = 'next';
    let submitAns = document.createElement('button');
    submitAns.id = 'ok';
    let submitBtn = document.createElement('button');
    submitBtn.id = 'submit';

    previousBtn.appendChild(document.createTextNode('<'));
    submitAns.appendChild(document.createTextNode('Save answer'));
    nextBtn.appendChild(document.createTextNode('>'));
    submitBtn.appendChild(document.createTextNode('Check answers'));

    buttonsDiv.className = 'navigationButton';
    txtDiv.className = 'textOfQuestion';

    buttonsDiv.appendChild(submitAns);
    buttonsDiv.appendChild(previousBtn);
    buttonsDiv.appendChild(nextBtn);
    // buttonsDiv.appendChild(submitBtn);

   let startBtn = document.getElementById('startBtn') as HTMLElement;
   let statsBtn = document.getElementById('statsBtn') as HTMLElement;
   let firstStepPage = document.getElementsByClassName('firstpage')[0] as HTMLDivElement;

   let gameDiv = document.createElement('div');
    txtDiv.appendChild(document.createTextNode(""));
    gameDiv.appendChild(txtDiv);
    gameDiv.appendChild(buttonsDiv);
    hide(gameDiv);
    middlePart.appendChild(gameDiv);

    let statisticsDiv = document.createElement('div');
    statisticsDiv.className = 'statisticsLS';
    statisticsDiv.appendChild(document.createTextNode(""));
    hide(statisticsDiv);
    middlePart.appendChild(statisticsDiv);

    let scoreDiv = document.createElement('div');
    scoreDiv.className = 'textOfFinalScore';
    scoreDiv.appendChild(document.createTextNode(""));
    hide(scoreDiv);
    middlePart.appendChild(scoreDiv);

    //icons 
    infoIcon.addEventListener('mouseover', function () {
        infoWindow.style.visibility = 'visible';
    });
    
    infoIcon.addEventListener('mouseout', function () {
        infoWindow.style.visibility = 'hidden';
    });
    
    homeIcon.addEventListener('click', initStartPageView);

    //buttons
    startBtn.addEventListener('click', function() {
        questionCounter = 0;
        previousBtn.disabled = true;
        initGameView();
        initGame();
        updateQuestion();
    });
    
    statsBtn.addEventListener('click', function(){  
        hide(firstStepPage);
        show(homeIcon);
        statisticsDiv.innerHTML = '<h3>Zachowane wyniki:</h3>';
        for(var i = 0; i < localStorage.length; i++){
            let currLS = localStorage.key(i);
            statisticsDiv.innerHTML += '<p>' + currLS + " " + localStorage.getItem(currLS) + '</p>';
        }
        show(statisticsDiv);
    })
    
    submitAns.addEventListener('click', function(){
        let answer = (document.querySelector("input[name=ans]:checked") as HTMLInputElement);
        if(answer){
        saveAnswer(answer.value);
        saveTime(countTime(currentTime));
        }
        if(ifAllAnswered(answersTable))
        buttonsDiv.appendChild(submitBtn);
        
    });

    previousBtn.addEventListener('click', function() {
        if(answersTable[questionCounter] === null)
            saveTime(countTime(currentTime));
        checkPreviousState();
        questionCounter--;
        updateQuestion();
    });
    
    nextBtn.addEventListener('click', function() {
        if(answersTable[questionCounter] === null)
            saveTime(countTime(currentTime));
        checkNextState();
        questionCounter++;
        updateQuestion();  
    })
    
    submitBtn.addEventListener('click', function(){
        userScore = checkAnswers();
        let finalText = 'Congratulation! You scored ' + userScore + 'points';
        initFinalStage(finalText);
        setTimeout(function() {
            if(window.confirm('Do you want to save your score?')){
                userName = prompt('What is your nickname?', 'user');
                localStorage.setItem( userName, userScore.toString());
            }
            hide(scoreDiv);
            initStartPageView();
        },3000);
    });

    //functions
function initStartPageView() {
    hide(homeIcon);
    if(statisticsDiv.style.display !== 'none'){
        hide(statisticsDiv);
    } else {
        hide(gameDiv);
        hide(infoIcon);
    }
    show(firstStepPage);
}

function initGameView() {
    hide(firstStepPage);
    show(gameDiv);
    show(infoIcon);
    show(homeIcon);
}

function initFinalStage(text :string) {
    hide(gameDiv);
    scoreDiv.innerText = text;
    show(scoreDiv);
}

function initGame(){
    for(var x = 0; x<= questionsList.length -1; x++) {
        timeSpent[x] = null;
        answersTable[x] = null;
    }
}

function ifAllAnswered(arr :Array<string>) :Boolean{
    let flag = 0;
    arr.map(function(val){
    if(val === null)
        flag++;
    });
    if(flag === 0)
        return true;
    else
        return false;
}

function checkPreviousState() {
    if(questionCounter === questionsList.length - 1)
        nextBtn.disabled = false;
    if(questionCounter === 1)
        previousBtn.disabled = true;
    if( answersTable[questionCounter - 1] !== null)
        submitAns.disabled = true;
    else 
        submitAns.disabled = false;
}

function checkNextState() {
    if( questionCounter === 0 )
        previousBtn.disabled = false;
    if( questionCounter === questionsList.length - 2 )
        nextBtn.disabled = true;
    if( answersTable[questionCounter + 1] !== null )
        submitAns.disabled = true;
    else 
        submitAns.disabled = false;
}

function checkAnswers() : number{
    let points :number = 0;
    answersTable.map(function(val, ind) {
        if(isCorrectAnswer(questionsList[ind],val))
           points = points + 10 - (timeSpent[ind]/10) ;
    });
    return Number(points.toFixed(2));
}

function countTime(start :Date) :number{
    let startTime = start.getTime();
    let end = new Date().getTime();
    return (end - startTime) / 1000;
}

function updateQuestion() {
    // if( !isAlreadyAnswered(questionCounter) )   
    currentTime = new Date();
    txtDiv.innerHTML = displayQuestion(questionCounter);
}

function saveAnswer(val :string){
    answersTable[questionCounter] = val;
}

function saveTime(val : number){
    let temp = timeSpent[questionCounter];
    if(temp === null)
        timeSpent[questionCounter] = val;
    else    
        timeSpent[questionCounter] += val;
}

function isCorrectAnswer(currentQuestion :IQuestion, chosenAnswer :string) {
    if(chosenAnswer === currentQuestion.correctanswer)
        return true;
    else
        return false;
}

function hide(div :HTMLElement) {
    div.style.display = 'none';
}

function show(div :HTMLElement) {
    div.style.display = 'block';
    }

function isAlreadyAnswered(num :number) : Boolean{
    if ( answersTable[num] === null ) 
        return false;
    else
        return true;
}

function displayQuestion(number :number) : string {
    let currQ :IQuestion = questionsList[number];
    let questionText = currQ.question;
    questionText += "<form name = 'case'>"
    for(var i in currQ.answers){
        questionText += "<p><label><input type = 'radio' name='ans' value = '" + currQ.answers[i] + "'";
        if(answersTable[number] != null) {
            if(currQ.answers[i] === answersTable[number]){
                questionText += " checked >";
            } else {
                questionText += ">";
            }
        } else {
            questionText += ">";
        }
        questionText += currQ.answers[i] + "</label></p>";
    }
    questionText += "</form>";
    return questionText;
    }
