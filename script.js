const clickSound = document.getElementById('clickSound');
const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');
const finishSound = document.getElementById('finishSound');

const fullQuizData = [
    {
        question: "What is the capital of France?",
        options: ["Paris", "London", "Berlin", "Madrid"],
        answer: "Paris"
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        answer: "Mars"
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic", "Indian", "Arctic", "Pacific"],
        answer: "Pacific"
    },
    {
        question: "Who wrote 'Macbeth'?",
        options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Leo Tolstoy"],
        answer: "William Shakespeare"
    },
    {
        question: "What is H2O commonly known as?",
        options: ["Oxygen", "Hydrogen", "Water", "Carbon Dioxide"],
        answer: "Water"
    },
    {
        question: "What year did World War II end?",
        options: ["1945", "1939", "1918", "1965"],
        answer: "1945"
    },
    {
        question: "What is the smallest prime number?",
        options: ["1", "2", "3", "0"],
        answer: "2"
    },
    {
        question: "Which gas do plants absorb?",
        options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
        answer: "Carbon Dioxide"
    },
    {
        question: "What is the speed of light?",
        options: ["300,000 km/s", "150,000 km/s", "100,000 km/s", "1,000,000 km/s"],
        answer: "300,000 km/s"
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["Van Gogh", "Picasso", "Leonardo da Vinci", "Michelangelo"],
        answer: "Leonardo da Vinci"
    },
    {
        question: "What is the chemical symbol for gold?",
        options: ["Au", "Ag", "Fe", "Pb"],
        answer: "Au"
    },
    {
        question: "How many continents are there?",
        options: ["5", "6", "7", "8"],
        answer: "7"
    },
    {
        question: "What is the tallest mountain in the world?",
        options: ["K2", "Everest", "Kangchenjunga", "Lhotse"],
        answer: "Everest"
    },
    {
        question: "What is the hardest natural substance?",
        options: ["Gold", "Iron", "Diamond", "Silver"],
        answer: "Diamond"
    },
    {
        question: "Who discovered gravity?",
        options: ["Einstein", "Newton", "Galileo", "Tesla"],
        answer: "Newton"
    }
];

let current = 0;
let score = 0;
let quizData = [];

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function startQuiz() {
    quizData = shuffle(fullQuizData).slice(0, 5);
    current = 0;
    score = 0;
    document.getElementById("quiz").classList.remove("hidden");
    document.getElementById("result").classList.add("hidden");
    updateProgressBar();
    loadQuestion();
    clearConfetti();
}

function loadQuestion() {
    const quiz = quizData[current];
    document.getElementById("question").textContent = quiz.question;
    const optionsBox = document.getElementById("options");
    optionsBox.innerHTML = "";

    quiz.options.forEach(opt => {
        const btn = document.createElement("div");
        btn.className = "option";
        btn.textContent = opt;
        btn.onclick = () => selectOption(btn, quiz.answer);
        optionsBox.appendChild(btn);
    });

    document.getElementById("nextBtn").style.display = "none";
    updateProgressBar();
}

function updateProgressBar() {
    const progressBar = document.getElementById("progressBar");
    const progressPercent = (current / quizData.length) * 100;
    progressBar.style.width = progressPercent + "%";
}

function selectOption(selected, correct) {
    clickSound.play();

    const options = document.querySelectorAll(".option");
    options.forEach(opt => opt.style.pointerEvents = "none");

    if (selected.textContent === correct) {
        selected.style.background = "green";
        pulseAnimation(selected);
        score++;
        correctSound.play();
    } else {
        selected.style.background = "red";
        shakeAnimation(selected);
        options.forEach(opt => {
            if (opt.textContent === correct) opt.style.background = "green";
        });
        wrongSound.play();
    }

    document.getElementById("nextBtn").style.display = "block";
}

function pulseAnimation(element) {
    element.style.animation = "pulse 0.8s ease";
    element.addEventListener("animationend", () => {
        element.style.animation = "";
    }, { once: true });
}

function shakeAnimation(element) {
    element.style.animation = "shake 0.5s ease";
    element.addEventListener("animationend", () => {
        element.style.animation = "";
    }, { once: true });
}

function nextQuestion() {
    current++;
    if (current < quizData.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    finishSound.play();
    document.getElementById("quiz").classList.add("hidden");
    const resultBox = document.getElementById("result");
    resultBox.classList.remove("hidden");
    const scoreEl = document.getElementById("score");
    scoreEl.textContent = "0";

    animateScore(scoreEl, 0, score, 2000);
    launchConfetti();
    updateProgressBar();
}

function animateScore(element, start, end, duration) {
    let startTime = null;

    function animation(currentTime) {
        if (!startTime) startTime = currentTime;
        const progress = currentTime - startTime;
        const currentScore = Math.min(Math.floor(progress / duration * (end - start) + start), end);
        element.textContent = currentScore;
        if (progress < duration) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

function restartQuiz() {
    startQuiz();
}

const confettiCanvas = document.getElementById('confetti');
const ctx = confettiCanvas.getContext('2d');
let confettiElements = [];
let animationFrameId;

function resizeCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class ConfettiParticle {
    constructor() {
        this.x = Math.random() * confettiCanvas.width;
        this.y = Math.random() * confettiCanvas.height - confettiCanvas.height;
        this.r = (Math.random() * 6) + 4;
        this.d = (Math.random() * 10) + 10;
        this.color = `hsl(${Math.floor(Math.random() * 360)}, 100%, 60%)`;
        this.tilt = Math.floor(Math.random() * 10) - 10;
        this.tiltAngleIncrement = 0.07 * (Math.random() + 0.5);
        this.tiltAngle = 0;
    }
    update() {
        this.y += (Math.cos(this.d) + 3 + this.r / 2) / 2;
        this.x += Math.sin(this.d);
        this.tiltAngle += this.tiltAngleIncrement;
        this.tilt = Math.sin(this.tiltAngle) * 15;

        if (this.y > confettiCanvas.height) {
            this.x = Math.random() * confettiCanvas.width;
            this.y = -20;
            this.tilt = Math.floor(Math.random() * 10) - 10;
        }
    }
    draw() {
        ctx.beginPath();
        ctx.lineWidth = this.r / 2;
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.x + this.tilt + (this.r / 4), this.y);
        ctx.lineTo(this.x + this.tilt, this.y + this.tilt + (this.r / 4));
        ctx.stroke();
    }
}

function createConfetti() {
    for (let i = 0; i < 150; i++) {
        confettiElements.push(new ConfettiParticle());
    }
}

function drawConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiElements.forEach(p => {
        p.update();
        p.draw();
    });
    animationFrameId = requestAnimationFrame(drawConfetti);
}

function launchConfetti() {
    createConfetti();
    drawConfetti();
    setTimeout(clearConfetti, 5000);
}

function clearConfetti() {
    cancelAnimationFrame(animationFrameId);
    confettiElements = [];
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
}

window.onload = startQuiz;
