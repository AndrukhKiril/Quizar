function selectAnswers(answerElement, questionClass) {
    if (answerElement.className === "answer-selected") {
        answerElement.classList.remove("answer-selected");
        answerElement.classList.add(questionClass);
    } else {
        answerElement.classList.remove(questionClass);
        answerElement.classList.add('answer-selected');
    }
}

function checkRightAnswers(answersElements, rightAnswersIndex) {
    let amountOfPoints = 0;

    for (let i = 0; i < answersElements.length; i++) {
        if (answersElements[i].classList.contains("answer-selected")) {
            if (typeof rightAnswersIndex === 'number') {
                if (i === rightAnswersIndex) {
                    amountOfPoints++;
                    answersElements[i].classList.add('answer-right');
                } else {
                    answersElements[i].classList.add('answer-wrong');
                }
            } 
            if (typeof rightAnswersIndex === 'object') {
                for (let j = 0; j < rightAnswersIndex.length; j++) {
                    if (rightAnswersIndex[j] === i) {
                        console.log(rightAnswersIndex[j] + ' ' + i);
                        amountOfPoints += 1;
                        answersElements[i].classList.add('answer-right');
                    }
                }
            }
        } else {
            answersElements[i].classList.remove('answer-one');
            answersElements[i].classList.add('answer-wrong');
        }
        
        answersElements[i].classList.remove('answer-selected');
    }

    if (typeof rightAnswersIndex === 'object') {
        for (let i = 0; i < rightAnswersIndex.length; i++) {
            answersElements[rightAnswersIndex[i]].classList.add('answer-expected');
        }
    }
    if (typeof rightAnswersIndex === 'number') {
        answersElements[rightAnswersIndex].classList.add('answer-expected');
    }
}

function moveToQuestion(doc, page) {
    document.querySelector('.question').innerHTML = '';
    document.querySelector('.grid-answers').innerHTML = '';
    document.querySelector('.grid-move-and-submit').innerHTML = '';

    fetch(doc)
        .then(response => response.json())
        .then(quizData => {
            const questions = quizData;
            const answers = questions.questions[page].answers;
            const rightAnswersIndex = questions.questions[page].right_answers;

            document.querySelector('.question').insertAdjacentHTML('beforeend', `<h1>${questions.questions[page].question}</h1>`);

            for (let i = 0; i < answers.length; i++) {
                let answer = `<div class=\"answer-one\"><p>${answers[i]}</p></div>`;
                document.querySelector('.grid-answers').insertAdjacentHTML('beforeend', answer);
            }

            let answersElements = document.querySelectorAll('.answer-one');

            for (let i = 0; i < answersElements.length; i++) {
                answersElements[i].addEventListener('click',
                    () => selectAnswers(answersElements[i], 'answer-one'));
            }

            const actions = document.querySelector('.grid-move-and-submit');

                if (page !== 0) {
                    let prevQuestion = '<button id="previous">Previous question</button>';
                    actions.insertAdjacentHTML('beforeend', prevQuestion);
                    document.getElementById('previous').addEventListener('click', () => moveToQuestion(doc, page-1));
                }

                let submit = '<button id="submit">Submit</button>';
                actions.insertAdjacentHTML('beforeend', submit)
                document.getElementById('submit').addEventListener('click', () => checkRightAnswers(answersElements, rightAnswersIndex));

                if (page !== questions.questions.length - 1) {
                    let nextQuestion = '<button id="next">Next question</button>';
                    actions.insertAdjacentHTML('beforeend', nextQuestion)
                    document.getElementById('next').addEventListener('click', () => moveToQuestion(doc, page+1));
                }
        })
        .catch(error => {
            console.error('An error occurred while fetching or parsing the JSON file:', error);
        });
}

function testCheck(doc) {
    const list = document.querySelector('.grid-answers');

    fetch(doc)
        .then(response => response.json())
        .then(quizData => {
            const questions = quizData;

            let page = 0;
            const answers = questions.questions[page].answers;
            const rightAnswersIndex = questions.questions[page].right_answers;

            document.querySelector('.question').insertAdjacentHTML('beforeend', `<h1>${questions.questions[page].question}</h1>`);

            for (let i = 0; i < answers.length; i++) {
                let answer = `<div class=\"answer-one\"><p>${answers[i]}</p></div>`;
                list.insertAdjacentHTML('beforeend', answer);
            }

            let answersElements = document.querySelectorAll('.answer-one');

            for (let i = 0; i < answersElements.length; i++) {
                answersElements[i].addEventListener('click',
                    () => selectAnswers(answersElements[i], 'answer-one'));
            }

            const actions = document.querySelector('.grid-move-and-submit');

            let submit = '<button id="submit">Submit</button>';
            actions.insertAdjacentHTML('beforeend', submit)
            document.getElementById('submit').addEventListener('click', () => checkRightAnswers(answersElements, rightAnswersIndex)); 
            
            if (page !== questions.questions.length - 1) {
                let nextQuestion = '<button id="next">Next question</button>';
                actions.insertAdjacentHTML('beforeend', nextQuestion)
                document.getElementById('next').addEventListener('click', () => moveToQuestion(doc, 1));
            }
            } 
        )
        .catch(error => {
            console.error('An error occurred while fetching or parsing the JSON file:', error);
        });
}

export { testCheck };