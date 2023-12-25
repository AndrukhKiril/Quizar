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
            if (rightAnswersIndex === i) {
                amountOfPoints++;
                answersElements[i].classList.add('answer-right');
            } else {
                answersElements[i].classList.add('answer-wrong');
            }

            answersElements[i].classList.remove('answer-selected');
        } else {
            answersElements[i].classList.remove('answer-one');
            answersElements[i].classList.add('answer-wrong');
        }
    }

    answersElements[rightAnswersIndex].classList.add("answer-expected");

}

function moveToQuestion(step) {
    page += step;
}

function testCheck(doc) {
    const list = document.querySelector('.grid-answers');

    fetch(doc)
        .then(response => response.json())
        .then(quizData => {
            const questions = quizData;

            let page = 0;
            const pages = quizData.length;
            const answers = questions.questions[page].answers;
            const rightAnswersIndex = questions.questions[page].right_answers;

            document.querySelector('.question').insertAdjacentHTML('beforeend', `<h1>${questions.questions[page].question}</h1>`);

            if (questions.questions[page].type === 'one-right') {
                for (let i = 0; i < answers.length; i++) {
                    let answer = `<div class=\"answer-one\"><p>${answers[i]}</p></div>`;
                    list.insertAdjacentHTML('beforeend', answer);
                }

                let answersElements = document.querySelectorAll('.answer-one');
                const rightAnswers = rightAnswersIndex-1;
                console.log(rightAnswers);

                for (let i = 0; i < answersElements.length; i++) {
                    answersElements[i].addEventListener('click',
                        () => selectAnswers(answersElements[i], 'answer-one'));
                }

                const actions = document.querySelector('.grid-move-and-submit');
                // if (page !== 0) {
                    let prevQuestion = '<button id="previous">Previous question</button>';
                    actions.insertAdjacentHTML('beforeend', prevQuestion);
                    document.getElementById('previous').addEventListener('click', () => moveToQuestion(-1));
                // }
    
                let submit = '<button id="submit">Submit</button>';
                actions.insertAdjacentHTML('beforeend', submit)
                document.getElementById('submit').addEventListener('click', () => checkRightAnswers(answersElements, rightAnswers)); 
    
                // if (page === pages.length - 1) {
                    let nextQuestion = '<button id="next">Next question</button>';
                    actions.insertAdjacentHTML('beforeend', nextQuestion)
                    document.getElementById('next').addEventListener('click', () => moveToQuestion(1));
                // }
            } else if (questions.questions[page].type === 'more-right') {
                console.log();
            }
            }
        )
        .catch(error => {
            console.error('An error occurred while fetching or parsing the JSON file:', error);
        });
}

export { testCheck };