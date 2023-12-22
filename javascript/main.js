let createQuizButton = document.querySelector('#create-quiz');
let takeQuizButton = document.querySelector('#take-quiz');
let testItButton = document.querySelector('#test-it');

function loadPage(doc) {
    document.location.href = String(doc)
}

createQuizButton.addEventListener('click', () => loadPage('create-quiz.html'));
takeQuizButton.addEventListener('click', () =>  loadPage('take-quiz.html'));
testItButton.addEventListener('click', () =>  loadPage('test-it.html'));