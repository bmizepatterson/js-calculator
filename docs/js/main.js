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
  var key = event.target.innerHTML;

  if (key == '&nbsp;') {
    // This is an empty button; ignore it.
    return;
  } // Route to the function appropriate for this key


  if (isNumeric(key)) {
    enterNumber(key);
  } else if (isOperator(key)) {
    // Same behavior for operator buttons and equals button
    enterOperator(key);
  } else if (isEquals(key)) {
    enterEquals(key);
  } else if (isClear(key)) {
    clearDisplay();
  } else if (isDecimal(key)) {
    enterDecimal();
  } // Add this key to the history


  keyStack.push(key);
}

function clearDisplay() {
  // Reset display and global variables
  display.value = '0';
  operand1 = null;
  operator = null;
  operand2 = null;
  keyStack = [];
}

function enterDecimal() {
  // Enter a decimal only if the display isn't full and
  // doesn't already contain a decimal.
  if (displayIsFull() || display.value.search(/\./) > -1) {// Do nothing
  } else {
    display.value += '.';
  }
}

function enterNumber(key) {
  // If the display is full, then don't add any more digits
  if (displayIsFull()) return;

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
  } // If we have enough information to perform a calculation, then perform it.
  // NOTE: The operands are saved as strings, so even "0" evaluates to true.


  if (operand1 && operator) {
    operand2 = display.value; // Save the results of the calculation in operand1 so additional
    // calculations can be made, if desired. Also, update the display.

    display.value = operand1 = calculate();
    operand2 = null;
  } else {
    operand1 = display.value;
  }

  operator = key;
}

function enterEquals(key) {
  // If we have enough information to make a calculation, then do so.
  if (operand1 && operator) {
    operand2 = display.value;
    display.value = calculate(); // Move operand2 over to operand1 so we can continue to make
    // calculations on this value if the equals is pressed multiple
    // times in succession.

    operand1 = operand2;
  }
}

function calculate() {
  // Performs operator on operand1 and operand2
  // First check that we have all the information we need. If not, return.
  var fail = false;

  if (operand1 == null) {
    console.log('Cannot perform calculation: operand1 is null.');
    fail = true;
  }

  if (operand2 == null) {
    console.log('Cannot perform calculation: operand2 is null.');
    fail = true;
  }

  if (operator == null) {
    console.log('Cannot perform calculation: operator is null.');
    fail = true;
  }

  if (fail) return; // Perform the operator on operand1 and operand2

  var total = null;

  if (operator === '+') {
    total = Number(operand1) + Number(operand2);
  } else if (operator === '-') {
    total = Number(operand1) - Number(operand2);
  } else if (operator === 'x') {
    total = Number(operand1) * Number(operand2);
  } else if (operator === '/' && operand2) {
    // Watch out for division by zero.
    total = Number(operand1) / Number(operand2);
  } else {
    console.log('Operator not recognized.'); // leave total = null
  } // Make sure to return the total as a string.


  return total.toString();
}
/**
 * UTILITY FUNCTIONS
 * These functions encapsulate pieces of logic so that the main functions
 * will be easier to read.
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

function old_calculate() {
  if (calc_state == ERROR) {
    clear_display();
    return;
  }

  operand2 = parseFloat(display.innerHTML);
  console.log('BEGINNING OF CALCULATE()');
  debug();
  var solution;
  var temp_first = operand1.toString();
  var temp_second = operand2.toString();
  var first_dec_places = 0;
  var second_dec_places = 0;

  if (temp_first.search(/\./) > -1) {
    first_dec_places = temp_first.substring(temp_first.search(/\./) + 1).length;
  }

  if (temp_second.search(/\./) > -1) {
    second_dec_places = temp_second.substring(temp_second.search(/\./) + 1).length;
  }

  var dec_places = 0;

  if (first_dec_places > second_dec_places) {
    dec_places = first_dec_places;
  } else {
    dec_places = second_dec_places;
  }

  temp_first = operand1 * Math.pow(10, dec_places);
  temp_second = operand2 * Math.pow(10, dec_places);
  console.log('temp_first', temp_first);
  console.log('temp_second', temp_second);

  if (sign === '/') {
    if (operand2 === 0) {
      throw_error();
      return;
    }

    solution = temp_first / temp_second;
  } else if (sign === 'x') {
    solution = temp_first * temp_second;
  } else if (sign === '-') {
    solution = temp_first - temp_second;
  } else if (sign === '+') {
    solution = temp_first + temp_second;
  }

  solution = solution / Math.pow(10, dec_places * 2); // If the number of digits in front of the decimal is too many, throw error
  // Grab the "integer" part of the solution

  var temp_str = solution.toString();

  if (temp_str.length > 9) {
    console.log('solution', solution);
    var integer = temp_str;

    if (temp_str.search(/\./) > -1) {
      integer = temp_str.substring(0, temp_str.search(/\./));
    }

    console.log('integer', integer);

    if (integer.length > 9) {
      // Can't fit this number on our display; display ERROR.
      throw_error();
      return;
    }

    var total_decimals = temp_str.substring(temp_str.search(/\./) + 1); // Limit the total digits in the display to 9

    var avail_digits = 9;
    var exp_not = ''; // Detect exponential notation

    if (total_decimals.search("e") >= 0) {
      // Find the length of the e+XX part
      exp_not = total_decimals.substring(total_decimals.search("e"));
      total_decimals = total_decimals.substring(0, total_decimals.search("e"));
      console.log('total_decimals, step -1', total_decimals);
      avail_digits -= exp_not.length;
    } // If found, round digits but keep notation


    console.log('total_decimals, step 1', total_decimals);
    var num_decimals = avail_digits - integer.length;

    if (total_decimals.length > num_decimals) {
      total_decimals = total_decimals / Math.pow(10, total_decimals.length - num_decimals);
      total_decimals = Math.round(total_decimals);
      total_decimals = "" + total_decimals + exp_not;
    }

    solution = "" + integer + '.' + total_decimals;
  }

  solution = parseFloat(solution);
  display.innerHTML = solution;
  calc_state = SOLVED;
  display_state = READY_FOR_ENTRY;
  sign = null;
  operand1 = solution;
  operand2 = null;
  console.log('END OF CALCULATE()');
  debug();
  console.log('solution', solution, typeof solution);
  document.getElementById('/').style.backgroundColor = '#5FB9FF';
  document.getElementById('x').style.backgroundColor = '#5FB9FF';
  document.getElementById('-').style.backgroundColor = '#5FB9FF';
  document.getElementById('+').style.backgroundColor = '#5FB9FF';
  return solution;
}