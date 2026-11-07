const MAX_DISPLAY_DECIMAL_PLACES = 4;
const MAX_DISPLAY_CHARS = 10;

const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

function operate(operator, a, b) {
  switch (operator) {
    case '+':
      return add(a, b);
    case '-':
      return subtract(a, b);
    case '*':
      return multiply(a, b);
    case '/':
      return divide(a, b);
    default:
      throw new Error(`invalid operator: ${operator}`);
  }
}

function getRoundedString(number) {
  if (Number.isInteger(number)) {
    return String(number);
  }
  const numDecimalPlaces = String(number).split('.')[1].length;
  if (numDecimalPlaces <= MAX_DISPLAY_DECIMAL_PLACES) {
    return String(number);
  }
  return number.toFixed(MAX_DISPLAY_DECIMAL_PLACES);
}

function getScientificNotation(number) {
  if (number == 0) {
    return "0e0";
  }
  negative = number < 0;
  if (negative) {
    number *= -1;
  }
  power = 0;
  while (number >= 10) {
    number /= 10;
    power += 1;
  }
  while (number < 1) {
    number *= 10;
    power -= 1;
  }
  if (negative) {
    return `${getRoundedString(-1 * number)}e${power}`;
  }
  return `${getRoundedString(number)}e${power}`;
}

let firstNumber = 0;
let secondNumber = 0;
let operator = "";
let lastButtonPressWasOperator = false;
let lastButtonPressWasEquals = false;
let hasDecimalPoint = false;
let pressedOperator = "";
let currentNumber = 0;

const display = document.querySelector("#display");

function resetPressedOperatorButton() {
  if (pressedOperator.length > 0) {
    operatorToButton[pressedOperator].classList.remove("pressed");
    pressedOperator = "";
  }
}

function displayNumber() {
  if (String(currentNumber).length > MAX_DISPLAY_CHARS) {
    display.textContent = getScientificNotation(currentNumber);
  } else {
    display.textContent = getRoundedString(currentNumber);
  }
}

function handlePositiveDigitClick(digitString) {
  return (_) => {
    resetPressedOperatorButton();
    if (currentNumber === null) {
      return;
    }
    if (lastButtonPressWasEquals) {
      operator = "";
    }
    if (lastButtonPressWasEquals || lastButtonPressWasOperator) {
      currentNumber = Number(digitString);
      display.textContent = digitString;
      lastButtonPressWasEquals = false;
      lastButtonPressWasOperator = false;
      hasDecimalPoint = false;
      return;
    }
    if (currentNumber == 0 && !hasDecimalPoint) {
      currentNumber = Number(digitString);
      display.textContent = digitString;
    } else {
      display.textContent += digitString;
      currentNumber = Number(display.textContent);
    }
  }
}

const handleZeroDigitClick = (_) => {
  resetPressedOperatorButton();
  if (currentNumber === null) {
    return;
  }
  if (lastButtonPressWasEquals) {
    operator = "";
  }
  if (lastButtonPressWasEquals || lastButtonPressWasOperator) {
    currentNumber = 0;
    display.textContent = "0";
    lastButtonPressWasEquals = false;
    lastButtonPressWasOperator = false;
    hasDecimalPoint = false;
    return;
  }
  if (currentNumber == 0 && !hasDecimalPoint) {
    return;
  }
  display.textContent += "0";
  // currentNumber can't just be multiplied by 10 because if the 0 is added 
  // after a decimal, then currentNumber shouldn't change
  currentNumber = Number(display.textContent);
}

const handleClearClick = (_) => {
  resetPressedOperatorButton();
  currentNumber = 0;
  display.textContent = "0";
  hasDecimalPoint = false;
  lastButtonPressWasEquals = false;
  lastButtonPressWasOperator = false;
  operator = "";
}

const handleDecimalPointClick = (_) => {
  resetPressedOperatorButton();
  if (currentNumber === null) {
    return
  }
  if (lastButtonPressWasEquals) {
    operator = "";
  }
  if (lastButtonPressWasEquals || lastButtonPressWasOperator) {
    currentNumber = 0;
    display.textContent = "0.";
    lastButtonPressWasEquals = false;
    lastButtonPressWasOperator = false;
    hasDecimalPoint = true;
    return;
  }
  if (hasDecimalPoint) {
    return;
  }
  hasDecimalPoint = true;
  display.textContent += ".";
}

const handleBackspaceClick = (_) => {
  lastButtonPressWasEquals = false;
  lastButtonPressWasOperator = false;
  if (display.textContent.length == 1) {
    currentNumber = 0;
    display.textContent = "0";
  } else {
    if (display.textContent.at(-1) == ".") {
      hasDecimalPoint = false;
    }
    display.textContent = display.textContent.slice(0, -1);
    currentNumber = Number(display.textContent);
  }
}

function evaluateOperation() {
  if (operator == "/" && secondNumber == 0) {
    currentNumber = null;
    display.textContent = "NaN";
    hasDecimalPoint = false;
    operator == "";
    return;
  }
  currentNumber = operate(operator, firstNumber, secondNumber);
  displayNumber();
  // display.textContent = getRoundedString(operate(operator, firstNumber, secondNumber));
  hasDecimalPoint = display.textContent.includes('.');
}

function handleOperatorClick(operatorString) {
  return (_) => {
    if (lastButtonPressWasOperator) {
      operator = operatorString;
      return;
    }
    lastButtonPressWasOperator = true;
    if (lastButtonPressWasEquals) {
      firstNumber = Number(display.textContent);
      operator = operatorString;
      lastButtonPressWasEquals = false;
      return;
    }
    if (operator.length > 0) {
      secondNumber = Number(display.textContent);
      evaluateOperation();
    }
    firstNumber = Number(display.textContent);
    operator = operatorString;
  }
}

const handleEqualsClick = (_) => {
  resetPressedOperatorButton();
  if (operator.length == 0 || currentNumber === null) {
    return
  } else if (lastButtonPressWasOperator) {
    lastButtonPressWasEquals = true;
    lastButtonPressWasOperator = false;
    secondNumber = firstNumber
    evaluateOperation();
    firstNumber = Number(display.textContent);
  } else if (lastButtonPressWasEquals) {
    firstNumber = Number(display.textContent);
    display.textContent = getRoundedString(operate(operator, firstNumber, secondNumber));
    hasDecimalPoint = display.textContent.includes('.')
  } else {
    lastButtonPressWasEquals = true;
    secondNumber = Number(display.textContent);
    evaluateOperation();
  }
}


// Set up button click event listeners

const positiveDigitStringToElementId = {
  "1": "#one",
  "2": "#two",
  "3": "#three",
  "4": "#four",
  "5": "#five",
  "6": "#six",
  "7": "#seven",
  "8": "#eight",
  "9": "#nine",
}

for (const [digitString, elementID] of Object.entries(positiveDigitStringToElementId)) {
  document.querySelector(elementID).addEventListener('click', handlePositiveDigitClick(digitString));
}

document.querySelector("#zero").addEventListener('click', handleZeroDigitClick);

document.querySelector("#clear").addEventListener('click', handleClearClick);
document.querySelector("#backspace").addEventListener('click', handleBackspaceClick);

const addButton = document.querySelector("#add");
const subtractButton = document.querySelector("#subtract");
const multiplyButton = document.querySelector("#multiply");
const divideButton = document.querySelector("#divide");

const operatorToButton = {
  "+": document.querySelector("#add"),
  "-": document.querySelector("#subtract"),
  "*": document.querySelector("#multiply"),
  "/": document.querySelector("#divide"),
}

for (const [operator, button] of Object.entries(operatorToButton)) {
  button.addEventListener('click', handleOperatorClick(operator));
  button.addEventListener('mousedown', () => {
    if (pressedOperator.length > 0) {
      operatorToButton[pressedOperator].classList.remove("pressed");
    }
    button.classList.add("pressed");
    pressedOperator = operator;
  });
}

document.querySelector("#equals").addEventListener('click', handleEqualsClick);

document.querySelector("#point").addEventListener('click', handleDecimalPointClick);


// Set up key press event listeners

const keyStringToElementId = {
  ...positiveDigitStringToElementId,
  "0": "#zero",
  "+": "#add",
  "-": "#subtract",
  "*": "#multiply",
  "/": "#divide",
  "=": "#equals",
  ".": "#point",
  "Backspace": "#backspace",
  "Escape": "#clear",
}

document.addEventListener('keydown', (event) => {
  if (event.key in keyStringToElementId) {
    const button = document.querySelector(keyStringToElementId[event.key]);
    button.classList.add("pressed");
    button.click();
    if (event.key in operatorToButton) {
      if (pressedOperator.length > 0 && pressedOperator != event.key) {
        operatorToButton[pressedOperator].classList.remove("pressed");
      }
      pressedOperator = event.key;
    } else {
      setTimeout(() => {button.classList.remove("pressed")}, 100);
    }
  }
})