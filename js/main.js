//Select Elements
let countSpan = document.querySelector('.count span');
let flagImgDiv = document.querySelector('.flag-img');
let flagImg = document.querySelector('.flag-img img');
let flagOptions = document.querySelector('.flag-options ul');
let flagLis = document.querySelectorAll('.flag-options ul li');
let score = document.querySelector('h3 span');
let scoreDiv = document.querySelector('.score');
let correctAns = document.querySelector('.score .right span');
let incorrectAns = document.querySelector('.score .incorrect span');
let btnNewGame = document.querySelector('#newGame');

let currentIndex = 0;
let rightAnswers = 0;

function getQuestions() {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questions = JSON.parse(this.responseText);
            let qCount = 10;
            questionNum(qCount);
            questions = questions.sort(() => Math.random() - Math.random()).slice(0, 10);
            //Add Questions Data
            addQuestionData(questions[currentIndex], qCount);

            flagLis.forEach(li => {
                li.addEventListener('click', () => {
                    let rightAnswer = questions[currentIndex].right_answer;
                    li.classList.add('active');
                    //Increase Index
                    currentIndex++;

                    //check The Answer after 500
                    setTimeout(() => {
                        checkAnswer(rightAnswer, qCount);
                    }, 500);

                    setTimeout(() => {
                        //Remove Previous Image Source
                        flagImg.src = '';

                        //Remove All Classes
                        li.classList.remove('active');
                        li.classList.remove('success');
                        li.classList.remove('wrong');

                        //Add Questions Data
                        addQuestionData(questions[currentIndex], qCount);
                    }, 1000);

                    setTimeout(() => {
                        showResults(qCount);
                    }, 1002)
                });
            });
        }
    };

    myRequest.open("GET", "js/flag_questions.json", true);
    myRequest.send();
}

getQuestions();

function questionNum(num) {
    countSpan.innerHTML = num;
}

function addQuestionData(obj, count) {
    if (currentIndex < count) {

        flagImg.src = `img/${obj.img}`;
        // Create Options
        flagLis.forEach((li, i) => {
            //Give Each Li a dynamic Id
            li.id = `answer_${i+1}`;
            //Create for Each Li a dynamic data-attribut
            li.dataset.answer = obj[`options`][i];
            //Insert the option in the li
            li.innerHTML = obj[`options`][i];
        });
    }
}

function checkAnswer(rAnswer, count) {
    let answers = document.querySelectorAll('.flag-options ul li');
    let choosenAnswer;
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].classList.contains('active')) {
            choosenAnswer = answers[i].dataset.answer;
            if (rAnswer === choosenAnswer) {
                answers[i].classList.add('success');
                rightAnswers++;
                score.innerHTML = rightAnswers;
            } else {
                answers[i].classList.add('wrong');
            }
        }
    }
}

function showResults(count) {
    if (currentIndex === count) {
        flagOptions.innerHTML = '';
        flagImgDiv.innerHTML = '';
        scoreDiv.style.display = 'block';
        correctAns.innerHTML = rightAnswers;
        incorrectAns.innerHTML = count - rightAnswers;
    }
}

btnNewGame.addEventListener('click', () => {
    window.location.reload();
});