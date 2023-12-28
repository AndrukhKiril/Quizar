function elementFromHTML(html) {
    const template = document.createElement('template');

    template.innerHTML = html.trim();

    return template.content.firstElementChild;
}

function selectAnswers(answer) {
    if (answer.classList.contains("answer-one")) {
        if (answer.classList.contains("answer-selected")) {
            answer.classList.remove("answer-selected");
        } else {
            answer.classList.add('answer-selected');
        }
    }
}

function checkRightAnswers(answers, rightAnswers) {
    let amountOfPoints = 0;

    for (let i = 0; i < answers.length; i++) {
        answers[i].classList.remove('answer-one');

        if ((typeof rightAnswers === 'number' && i === rightAnswers) || 
            (typeof rightAnswers === 'object' && rightAnswers.includes(i))) {
            if (answers[i].classList.contains('answer-selected')) {
                amountOfPoints += 1;
            }
            answers[i].classList.add('answer-right');
        } else {
            answers[i].classList.add('answer-wrong');
        }
    }
}

function generateQuestion(page, pagesLength, pages, question, answers, rightAnswers) {
    const questionHTML = elementFromHTML(`<h1>${question}</h1>`);

    let answersHTML = [];

    for (let i = 0; i < answers.length; i++) {
        let additionalStyle = '';

        if (answers.length % 2 !== 0 && i === answers.length - 1) { 
            additionalStyle = 'grid-column: 1/-1;';
        }
        
        const answer = elementFromHTML(`<div class=\"answer-one\" style=\"${additionalStyle}\"><p>${answers[i]}</p></div>`);
        
        answer.addEventListener('click', () => selectAnswers(answer));
        answersHTML.push(answer);
    }

    let actionsHTML = [];

    if (page !== 0) {
        let prevQuestion = elementFromHTML('<button id="previous">Previous question</button>');
        prevQuestion.addEventListener('click', () => moveToQuestion(pages[page-1]));
        actionsHTML.push(prevQuestion);
    }

    let submit = elementFromHTML('<button id="submit">Submit</button>');
    submit.addEventListener('click', () => checkRightAnswers(answersHTML, rightAnswers));
    actionsHTML.push(submit)

    if (page !== pagesLength - 1) {
        let nextQuestion = elementFromHTML('<button id="next">Next question</button>');
        nextQuestion.addEventListener('click', () => moveToQuestion(pages[page+1]));
        actionsHTML.push(nextQuestion);
    } else {
        let result = elementFromHTML('<button id="next">Result</button>');
        actionsHTML.push(result);
    }

    const pageObj = {question: questionHTML, answers: answersHTML, actions: actionsHTML};

    return pageObj;
}

function moveToQuestion(page) {
    document.querySelector('.question').innerHTML = '';
    document.querySelector('.grid-answers').innerHTML = '';
    document.querySelector('.grid-move-and-submit').innerHTML = '';

    document.querySelector('.question').insertAdjacentElement('beforeend', page.question);
    page.answers.forEach(element => {
        document.querySelector('.grid-answers').insertAdjacentElement('beforeend', element);
    });
    page.actions.forEach(element => {
        document.querySelector('.grid-move-and-submit').insertAdjacentElement('beforeend', element); 
    });
}

function testCheck(doc) {
    fetch(doc)
        .then(response => response.json())
        .then(quizData => {
            const questions = quizData.questions;

            let pages = [];

            for (let i = 0; i < questions.length; i++) {
                const question = questions[i].question;
                const answers = questions[i].answers;
                const rightAnswers = questions[i].right_answers;

                let page = generateQuestion(i, questions.length, pages, question, answers, rightAnswers);

                pages.push(page);
            }

            moveToQuestion(pages[0]);
            } 
        )
        .catch(error => {
            console.error('An error occurred while fetching or parsing the JSON file:', error);
        });
}

export { testCheck };