function checkRightAnswers(button, answersElements, rightAnswersIndex) {
    let amountOfPoints = 0;

    for (let i = 0; i < answersElements.length; i++) {
        if (i === rightAnswersIndex) {
            amountOfPoints++;
            answersElements[i].classList.add('answer-right');
        } else {
            answersElements[i].classList.add('answer-wrong');
        }
        answersElements[i].classList.remove('answer-one');
        answersElements[i].removeEventListener('click', checkRightAnswers);
    }
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


                if (questions.questions[page].type === 'one-right') {
                    for (let i = 0; i < answers.length; i++) {
                        let element = `<div class=\"answer-one\"><p>${answers[i]}</p></div>`;
                        list.insertAdjacentHTML('beforeend', element);
                    }

                    const answersElements = document.querySelectorAll('.answer-one')
                    const rightAnswers = rightAnswersIndex-1;
                    console.log(rightAnswers);

                    for (let i = 0; i < answersElements.length; i++) {
                        answersElements[i].addEventListener('click',
                            () => checkRightAnswers(answersElements[i], answersElements, rightAnswers));
                    }
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