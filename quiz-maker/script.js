const questions = [
    {
        q: "Which property is used to change the background color in CSS?",
        options: ["color", "bgcolor", "background-color", "paint"],
        correct: 2
    },
    {
        q: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlink Text Machine Language", "None of these"],
        correct: 0
    }
];

let currentIdx = 0;
let score = 0;

function loadQuiz() {
    const qText = document.getElementById('q-text');
    const box = document.getElementById('options-box');
    const progress = document.getElementById('progress');

    if (!qText) return;

    const current = questions[currentIdx];
    progress.innerText = `QUESTION ${currentIdx + 1} / ${questions.length}`;
    qText.innerText = current.q;
    box.innerHTML = '';

    current.options.forEach((opt, i) => {
        const div = document.createElement('div');
        div.className = 'option-pill';
        div.innerHTML = `<span class="index">${String.fromCharCode(65 + i)}</span> <span>${opt}</span>`;
        div.onclick = () => checkAnswer(i, div);
        box.appendChild(div);
    });
}

function checkAnswer(idx, el) {
    const correct = questions[currentIdx].correct;
    const all = document.querySelectorAll('.option-pill');
    all.forEach(p => p.style.pointerEvents = 'none');

    if (idx === correct) {
        el.classList.add('correct');
        score++;
    } else {
        el.classList.add('wrong');
        all[correct].classList.add('correct');
    }

    setTimeout(() => {
        currentIdx++;
        if (currentIdx < questions.length) {
            loadQuiz();
        } else {
            localStorage.setItem('finalScore', score);
            window.location.href = 'result.html';
        }
    }, 1200);
}

document.addEventListener('DOMContentLoaded', loadQuiz);