const display = document.getElementById("display");
const sound = document.getElementById("click-sound");

function playSound() {
    sound.currentTime = 0;
    sound.play();
}

function appendValue(value) {
    playSound();
    // Logic to prevent multiple dots in one number
    const lastNumber = display.value.split(/[\+\-\*\/]/).pop();
    if (value === '.' && lastNumber.includes('.')) return;
    
    display.value += value;
}

function clearDisplay() {
    playSound();
    display.value = "";
}

function deleteLast() {
    playSound();
    display.value = display.value.slice(0, -1);
}

function calculate() {
    playSound();
    try {
        // Clean the expression for eval
        let expression = display.value.replace(/×/g, '*').replace(/÷/g, '/');
        // Round to 8 decimal places to avoid 0.1+0.2 bugs
        let result = eval(expression);
        display.value = Number(Math.round(result + 'e8') + 'e-8');
    } catch {
        display.value = "Error";
        setTimeout(clearDisplay, 1500);
    }
}

function scientific(command) {
    playSound();
    let val = parseFloat(display.value) || 0;
    switch(command) {
        case 'sqrt': display.value = Math.sqrt(val); break;
        case 'pow':  display.value = Math.pow(val, 2); break;
        case 'pi':   display.value += Math.PI.toFixed(4); break;
        case 'sin':  display.value = Math.sin(val * Math.PI / 180).toFixed(4); break;
    }
}

function toggleTheme() {
    const body = document.body;
    const current = body.getAttribute("data-theme");
    body.setAttribute("data-theme", current === "dark" ? "light" : "dark");
}

// Keyboard Support
window.addEventListener("keydown", (e) => {
    if ((e.key >= "0" && e.key <= "9") || "+-*/.%".includes(e.key)) appendValue(e.key);
    if (e.key === "Enter" || e.key === "=") { e.preventDefault(); calculate(); }
    if (e.key === "Backspace") deleteLast();
    if (e.key === "Escape") clearDisplay();
});