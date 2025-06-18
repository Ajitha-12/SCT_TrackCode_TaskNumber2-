const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');
const modeToggle = document.getElementById('modeToggle');
let expression = '';

function updateDisplay(value) {
  display.textContent = value;
}

function evaluateExpression() {
  try {
    const safeExpression = expression
      .replace(/π/g, Math.PI)
      .replace(/e/g, Math.E)
      .replace(/√\(/g, 'Math.sqrt(')
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(');

    const result = eval(safeExpression);
    updateDisplay(result);
    saveToHistory(expression, result);
    expression = result.toString();
  } catch (error) {
    updateDisplay('Error');
  }
}

function saveToHistory(exp, result) {
  let history = JSON.parse(localStorage.getItem('calcHistory')) || [];
  history.push(`${exp} = ${result}`);
  localStorage.setItem('calcHistory', JSON.stringify(history));
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const val = button.textContent;

    if (val === 'C') {
      expression = '';
      updateDisplay('0');
    } else if (val === '=') {
      evaluateExpression();
    } else if (val === 'π') {
      expression += 'π';
      updateDisplay(expression);
    } else if (val === 'e') {
      expression += 'e';
      updateDisplay(expression);
    } else if (val === '√') {
      expression += '√(';
      updateDisplay(expression);
    } else if (['sin', 'cos', 'tan'].includes(val)) {
      expression += `${val}(`;
      updateDisplay(expression);
    } else {
      expression += val;
      updateDisplay(expression);
    }
  });
});

modeToggle.addEventListener('change', () => {
  document.body.classList.toggle('light');
  updateDisplay(expression || '0'); // Recolor display
});

document.addEventListener('keydown', (e) => {
  if (/[0-9\+\-\*\/\.]/.test(e.key)) {
    expression += e.key;
    updateDisplay(expression);
  } else if (e.key === 'Enter') {
    evaluateExpression();
  } else if (e.key === 'Backspace') {
    expression = expression.slice(0, -1);
    updateDisplay(expression || '0');
  }
});
