const MAX_DISPLAY_DECIMAL_PLACES = 4;

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
  // const partials = String(number).split('.');
  // const integerString = partials[0];
  // const decimalString = partials[1];
  const numDecimalPlaces = String(number).split('.')[1].length;
  if (numDecimalPlaces <= MAX_DISPLAY_DECIMAL_PLACES) {
    return String(number);
  }
  return number.toFixed(MAX_DISPLAY_DECIMAL_PLACES);
}

let firstNumber = 0;
let secondNumber = 0;
let operator = "";
let resetDisplayOnNextDigitOrDecimalPoint = false;
let hasDecimalPoint = false;

const display = document.querySelector("#display");

function appendDigit(currentNumberString, digitString) {
  if (currentNumberString === "0" && digitString === "0") {
    return "0"
  }
  return currentNumberString + digitString
}

function handlePositiveDigitClick(digitString) {
  return (_) => {
    if (display.textContent == "NaN") {
      return;
    }
    if (resetDisplayOnNextDigitOrDecimalPoint) {
      display.textContent = digitString;
      resetDisplayOnNextDigitOrDecimalPoint = false;
      return;
    }
    if (display.textContent == "0") {
      display.textContent = digitString;
    } else {
      display.textContent += digitString;
    }
  }
}

function handlePositiveDigitKeyPress(digitString) {
  return (_)
}

const handleZeroDigitClick = (_) => {
  if (display.textContent == "NaN") {
    return;
  }
  if (resetDisplayOnNextDigitOrDecimalPoint) {
    display.textContent = "0";
    resetDisplayOnNextDigitOrDecimalPoint = false;
    return;
  }
  if (display.textContent == "0") {
    return;
  }
  display.textContent += "0";
}

const handleClearClick = (_) => {
  display.textContent = "0";
  operator = "";
}

const handleDecimalPointClick = (_) => {
  if (resetDisplayOnNextDigitOrDecimalPoint) {
    display.textContent = "0."
    resetDisplayOnNextDigitOrDecimalPoint = false;
    return;
  }
  if (hasDecimalPoint) {
    return;
  }
  display.textContent += ".";
}

const handleBackspaceClick = (_) => {
  if (display.textContent.length == 1) {
    display.textContent = "0";
  } else {
    display.textContent = display.textContent.slice(0, -1);
  }
}

function handleOperatorClick(operatorString) {
  return (_) => {
    if (operator.length > 0) {
      display.textContent = "NaN";
    } else {
      firstNumber = Number(display.textContent);
      operator = operatorString;
      resetDisplayOnNextDigitOrDecimalPoint = true;
    }
  }
}

const handleEqualsClick = (_) => {
  if (operator.length > 0) {
    secondNumber = Number(display.textContent);
    if (operator == "/" && secondNumber == 0) {
      display.textContent = "NaN";
      resetDisplayOnNextDigitOrDecimalPoint = true;
      operator == "";
      return;
    }
    display.textContent = getRoundedString(operate(operator, firstNumber, secondNumber));
    operator = "";
    resetDisplayOnNextDigitOrDecimalPoint = true;
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

document.querySelector("#add").addEventListener('click', handleOperatorClick("+"));
document.querySelector("#subtract").addEventListener('click', handleOperatorClick("-"));
document.querySelector("#multiply").addEventListener('click', handleOperatorClick("*"));
document.querySelector("#divide").addEventListener('click', handleOperatorClick("/"));

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
}

document.addEventListener('keydown', (event) => {
  if (event.key in keyStringToElementId) {
    document.querySelector(keyStringToElementId[event.key]).click();
  }
})