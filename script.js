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
    display.textContent = String(operate(operator, firstNumber, secondNumber));
    operator = "";
    resetDisplayOnNextDigitOrDecimalPoint = true;
  }
}

document.querySelector("#one").addEventListener('click', handlePositiveDigitClick("1"));
document.querySelector("#two").addEventListener('click', handlePositiveDigitClick("2"));
document.querySelector("#three").addEventListener('click', handlePositiveDigitClick("3"));
document.querySelector("#four").addEventListener('click', handlePositiveDigitClick("4"));
document.querySelector("#five").addEventListener('click', handlePositiveDigitClick("5"));
document.querySelector("#six").addEventListener('click', handlePositiveDigitClick("6"));
document.querySelector("#seven").addEventListener('click', handlePositiveDigitClick("7"));
document.querySelector("#eight").addEventListener('click', handlePositiveDigitClick("8"));
document.querySelector("#nine").addEventListener('click', handlePositiveDigitClick("9"));
document.querySelector("#zero").addEventListener('click', handleZeroDigitClick);

document.querySelector("#clear").addEventListener('click', handleClearClick);
document.querySelector("#backspace").addEventListener('click', handleBackspaceClick);

document.querySelector("#add").addEventListener('click', handleOperatorClick("+"));
document.querySelector("#subtract").addEventListener('click', handleOperatorClick("-"));
document.querySelector("#multiply").addEventListener('click', handleOperatorClick("*"));
document.querySelector("#divide").addEventListener('click', handleOperatorClick("/"));

document.querySelector("#equals").addEventListener('click', handleEqualsClick);

document.querySelector("#point").addEventListener('click', handleDecimalPointClick);
