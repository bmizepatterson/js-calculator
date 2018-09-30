"use strict";

/**
 * GLOBALS
 */
// The "display" of the calculator -- an HTML input element
var display = null; // The first value of the current calculation

var operand1 = null; // The second value of the current calculation

var operand2 = null; // The operation currently being performed

var operator = null; // A history of every key pressed (resets when clear is pressed)

var keyStack = []; // The maximum number of digits (inc. decimal point) that the display can hold

var maxDigits = 9;

document.onreadystatechange = function () {
  if (document.readyState == 'interactive') {
    init();
  }
};

function init() {
  // Grab the display
  display = document.getElementById('display'); // Add event listener to each key

  var buttons = document.getElementsByClassName('key');
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = buttons[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var button = _step.value;
      button.addEventListener('click', input);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

function input(event) {
  var key = event.target.innerHTML; // Ignore empty buttons

  if (key == '&nbsp;') return; // Route to the function appropriate for this key

  if (isNumeric(key)) enterNumber(key);else if (isOperator(key)) enterOperator(key);else if (isEquals(key)) enterEquals(key);else if (isClear(key)) clearDisplay();else if (isDecimal(key)) enterDecimal(key); // Add this key to the history

  keyStack.push(key);
}

function clearDisplay() {
  // Reset display and global variables
  display.value = '0';
  operand1 = operand2 = operator = null;
  keyStack = [];
}

function enterDecimal(key) {
  // Enter a decimal only if the display isn't full and
  // doesn't already contain a decimal.
  if (displayIsFull() && !isOperator(getLastKey())) return;

  if (readyForInput()) {
    // Prepend a 0 if we are starting to enter a new number
    display.value = '0' + key;
  } else if (!containsDecimal(display.value)) {
    // Append a decimal if there isn't one already
    display.value += key;
  }
}

function enterNumber(key) {
  // If the display is full, then don't add any more digits
  if (displayIsFull() && !isOperator(getLastKey())) return;

  if (readyForInput()) {
    // If the display is ready for a new number, then this
    // key should replace current value of the display.
    display.value = key;
  } else {
    // If we're in the middle of entering a number, then
    // append this key to the value of the display.
    display.value += key;
  }
}

function enterOperator(key) {
  // Repeated presses of an operator should update the
  // operator, but do nothing else.
  if (isOperator(getLastKey())) {
    operator = key;
    return;
  } // NOTE: The operands are saved as strings, so even "0" evaluates to true.


  if (operand2) {
    // Pressing equals leaves operand2 set, so if operand2 is set at this
    // point, the user is starting a new calculation on an old result.
    // We need to move operand2 to operand1.
    operand1 = display.value;
    operand2 = null;
  } else if (operand1 && operator) {
    // We have enough information to perform a calculation, so perform it.
    operand2 = display.value; // printGlobals();
    // Save the results of the calculation in operand1 so additional
    // calculations can be made, if desired. Also, update the display.

    display.value = operand1 = calculate();
    operand2 = null;
  } else {
    // If neither operand1, operand2, nor operator are set, then we are at
    // the very beginning of a new calculation.
    operand1 = display.value;
  }

  operator = key;
  printGlobals();
}

function enterEquals(key) {
  // If we have enough information, then perform the calculation.
  if (operand1 && operator) {
    // If operand2 is set from a previous calculation, then reuse it.
    // Otherwise use the number on the display as the second operand.
    if (operand2 == null) {
      operand2 = display.value;
    }

    display.value = operand1 = calculate(); // Leave operand2 set so we can use it again if the equals button is
    // clicked multiple times in succession.
  }

  printGlobals();
}

function calculate() {
  // Performs operator on operand1 and operand2
  if (!readyForCalculation()) return; // Prepare the operands for the calculation

  var integersForCalculation = integerizeOperands();
  var num1 = integersForCalculation.int1;
  var num2 = integersForCalculation.int2;
  var power = integersForCalculation.decimalPlaces; // Perform the operator on the operands

  var total = null;

  if (operator === '+') {
    total = num1 + num2;
  } else if (operator === '-') {
    total = num1 - num2;
  } else if (operator === 'x') {
    total = num1 * num2;
  } else if (operator === '/' && num2) {
    // Watch out for division by zero.
    total = num1 / num2;
  } else {
    console.log('Operator not recognized.'); // leave total = null
  } // TODO: Format total should convert to scientific notation if answer is
  // too long for the display.
  // TODO: Format total should round off decimal places if necessary.
  // Format total and return


  return formatTotal(total, power);
}
/**
 * UTILITY FUNCTIONS
 * These functions encapsulate pieces of logic so that the main functions
 * will be easier to interpret.
 **/


function isNumeric(key) {
  return 0 <= key && key <= 9;
}

function isOperator(key) {
  return key == '+' || key == '-' || key == 'x' || key == '/';
}

function isEquals(key) {
  return key == '=';
}

function isClear(key) {
  return key == 'C';
}

function isDecimal(key) {
  return key == '.';
}

function readyForInput() {
  // Is the display ready for a new number?
  // The display shows a single 0 upon initial load and after
  // clear is pressed. If the user last clicked an operator
  // key or the equals key, then they're ready to enter a new number.
  return display.value == '0' || isOperator(getLastKey()) || isEquals(getLastKey());
}

function getLastKey() {
  // Returns the last button pressed,
  // which is the last element of the keyStack array
  return keyStack[keyStack.length - 1];
}

function getLastOperator() {
  // Search back in the keyStack and find the last operator entered.
  // We must search in reverse--from the end of the array to the beginning.
  for (var i = keyStack.length - 1; i >= 0; i--) {
    if (isOperator(keyStack[i])) return keyStack[i];
  } // No operator found. That happens sometimes. Explicitly return null
  // so we know that no error occurred.


  return null;
}

function displayIsFull() {
  return display.value.length >= maxDigits;
}

function containsDecimal(string) {
  return findDecimalPoint(string) > -1;
}

function findDecimalPoint(string) {
  return string.search(/\./);
}
/**
 *  Floating point operations are tricky. Let's avoid them by turning each
 *  operand into an integer before performing any operations. We can do this
 *  by multiplying both operands by an appropriate power of 10.
 *
 *  We just have to remember to move that decimal point back to the right spot
 *  once we have the total.
 *
 *  @param operand string to convert to integer, scaling up by a power of 10 if
 *      necessary
 *  @return object with two properties:
 *      - integer, the converted integer
 *      - decimalPlaces, the number of decimal places we had to scale
 */


function integerizeOperands() {
  var result = {
    int1: parseInt(operand1),
    int2: parseInt(operand2),
    decimalPlaces: 0
  }; // Figure out which operand contains the greater number of digits after the
  // decimal point. Then multiply each operand by 10 raised to that number.

  var decPlaces1 = 0,
      decPlaces2 = 0;

  if (containsDecimal(operand1)) {
    decPlaces1 = operand1.substring(findDecimalPoint(operand1) + 1).length;
  }

  if (containsDecimal(operand2)) {
    decPlaces2 = operand2.substring(findDecimalPoint(operand2) + 1).length;
  } // If either operand has digits after the decimal, multiply BOTH operands
  // by 10 raised to that number.
  // If both operands have digits after the decimal, muliply BOTH operands
  // by 10 raised to the GREATER number.


  if (decPlaces1 || decPlaces2) {
    result.decimalPlaces = Math.max(decPlaces1, decPlaces2);
    result.int1 = parseInt(operand1 * Math.pow(10, result.decimalPlaces));
    result.int2 = parseInt(operand2 * Math.pow(10, result.decimalPlaces));
  }

  return result;
}

function formatTotal(total, power) {
  // Scale down total if the operands had to be scaled up.
  total /= Math.pow(10, power);
  var totalParts = getNumParts(total);
  var powerExp = '';
  console.log('total1', total);

  if (totalParts.str.length > maxDigits) {
    // We can't just display the total as-is.
    // We may need to convert to scientific notation, or
    // round the digits after the decimal, or both.
    var wholeNumDigits = totalParts.wholeNum.toString().length;

    if (wholeNumDigits > maxDigits) {
      // Convert to scientific notation
      var exponent = wholeNumDigits - 1;
      powerExp = "e" + exponent;
      total /= Math.pow(10, exponent);
      console.log('total2', total); // Round the decimal so that there's room for the exponent

      totalParts = getNumParts(total);
      console.log('decimalDigits', totalParts.decimalDigits);
      var decimalLength = maxDigits - totalParts.wholeNum.toString().length - powerExp.length;
      console.log('decimalLength', decimalLength);
      totalParts.decimalDigits = Math.round(totalParts.decimalDigits / Math.pow(10, totalParts.decimalDigits.toString().length - decimalLength)); // If this rounding should result in incrementing the whole number part, then do so.

      if (totalParts.decimalDigits.toString().length > decimalLength) {
        totalParts.wholeNum++;
        totalParts.decimalDigits = totalParts.decimalDigits.toString().substring(1);
      }

      console.log('rounded decimal digits', totalParts.decimalDigits); // Excise trailing zeros

      while (totalParts.decimalDigits.toString().substring(totalParts.decimalDigits.toString().length - 1) === '0') {
        totalParts.decimalDigits = totalParts.decimalDigits.toString().substring(0, totalParts.decimalDigits.toString().length - 1);
        console.log('excise trailing zeros:', totalParts.decimalDigits);
      } // Paste the parts back together


      if (totalParts.decimalDigits) {
        total = "" + totalParts.wholeNum + '.' + totalParts.decimalDigits + powerExp;
      } else {
        total = "" + totalParts.wholeNum + powerExp;
      }

      console.log('total3', total);
    }
  } // Return as a string.


  return total.toString();
}

function readyForCalculation() {
  // Checks that operand1, operand2, and operator are set.
  // If any are not set, it prints a message to the console and returns false.
  var ready = true;

  if (operand1 == null) {
    console.log('Cannot perform calculation: operand1 is null.');
    ready = false;
  }

  if (operand2 == null) {
    console.log('Cannot perform calculation: operand2 is null.');
    ready = false;
  }

  if (operator == null) {
    console.log('Cannot perform calculation: operator is null.');
    ready = false;
  }

  return ready;
}

function getNumParts(n) {
  // Splits a number on the decimal point (if present) and returns the parts
  // as an object
  var numParts = {
    original: n,
    str: n.toString(),
    wholeNum: n,
    decimalDigits: null
  };

  if (containsDecimal(numParts.str)) {
    var parts_arr = numParts.str.split(/\./);

    if (parts_arr.length > 2) {
      console.log('Improper number passed to getNumParts()');
      return;
    }

    numParts.wholeNum = parts_arr[0];
    numParts.decimalDigits = parts_arr[1];
  }

  return numParts;
}

function printGlobals() {
  console.log('===GLOBALS===');
  console.log('\toperand1', operand1);
  console.log('\toperator', operator);
  console.log('\toperand2', operand2);
}