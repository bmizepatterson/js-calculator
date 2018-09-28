/**
 * GLOBALS
 */
// The "display" of the calculator -- an HTML input element
let display    = null;

// The first value of the current calculation
let first_num  = null;

// The second value of the current calculation
let second_num = null;

// The operation currently being performed
let operator   = null;

// A history of every key pressed
let keyStack   = [];

// The maximum number of digits (inc. decimal point) that the display can hold
let maxDigits  = 9;

// Calculation state describes the state of the calculation
// currently being performed.
const READY_FIRST  = 1,
      READY_SECOND = 2,
      SOLVED       = 3,
      ERROR        = 4;
let calc_state     = READY_FIRST;

// const READY_FOR_ENTRY   = 1;
// const ENTRY_IN_PROGRESS = 2;
// let display_state       = READY_FOR_ENTRY;

document.onreadystatechange = function() {
    if (document.readyState == 'interactive') {
        init();
    }
}

function init() {
    // Grab the display
    display = document.getElementById('display');
    // Add event listener to each key
    let buttons = document.getElementsByClassName('key');
    for (let button of buttons) {
        button.addEventListener('click', input);
    }
}

function input(event) {
    let key = event.target.innerHTML;

    // Route to the function appropriate for this key
    if (isNumeric(key))       enterNumber(key);
    else if (isOperator(key)) enterOperator(key);
    else if (isEquals(key))   equals();
    else if (isClear(key))    clear();
    else if (isDecimal(key))  enterDecimal();

    // Add this key to the history
    keyStack.push(key);
}

function isNumeric(key) {
    return (0 <= key && key <= 9);
}

function isOperator(key) {
    return (key == '+' || key == '-' || key == 'x' || key == '/');
}

function isEquals(key) {
    return (key == '=');
}

function isClear(key) {
    return (key == 'C');
}

function isDecimal(key) {
    return (key == '.');
}

function clear() {
    // Reset display and global variables
    display.value = '0';
    first_num = null;
    operator = null;
    second_num = null;
    keyStack = [];
}

function enterDecimal() {
    // If the display is full, then don't add any more digits
    if (displayIsFull()) return;

    // Enter a decimal only if the display doesn't already
    // contain a decimal.
    if (display.value.search(/\./) === -1) {
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

function readyForInput() {
    // Is the display ready for a new number?
    // The display shows a single 0 upon initial load and after
    // clear is pressed. If the user last clicked an operator
    // key, then they're ready to enter a new number.
    return (display.value == '0' || isOperator(keyStack[-1]));
}

function displayIsFull() {
    return (display.value.length >= maxDigits);
}

function enterOperator(key) {

}

function equals() {

}




function operator(current_sign) {
    console.log('BEGINNING OF OPERATOR()');
    debug();

    if (sign != null) {
      sign = current_sign;
      document.getElementById('/').style.backgroundColor = '#5FB9FF';
      document.getElementById('x').style.backgroundColor = '#5FB9FF';
      document.getElementById('-').style.backgroundColor = '#5FB9FF';
      document.getElementById('+').style.backgroundColor = '#5FB9FF';
      document.getElementById(sign).style.backgroundColor = '#ccc';
      return;
    }

    if (calc_state == ERROR) {

        clear_display();
        return;

    }

    if (calc_state == READY_FIRST) {

        first_num = parseFloat(display.innerHTML);

    } else if (calc_state == READY_SECOND) { // && second_num != null) {

        calculate();

    }

    calc_state = READY_SECOND;
    sign = current_sign;

    display_state = READY_FOR_ENTRY;
    document.getElementById('/').style.backgroundColor = '#5FB9FF';
    document.getElementById('x').style.backgroundColor = '#5FB9FF';
    document.getElementById('-').style.backgroundColor = '#5FB9FF';
    document.getElementById('+').style.backgroundColor = '#5FB9FF';
    document.getElementById(sign).style.backgroundColor = '#ccc';

  console.log('END OF OPERATOR()');
  debug();
}

function calculate() {
    if (calc_state == ERROR) {
        clear_display();
        return;
    }
  second_num = parseFloat(display.innerHTML);
  console.log('BEGINNING OF CALCULATE()');
  debug();


  let solution;
  let temp_first = first_num.toString();
  let temp_second = second_num.toString();

  let first_dec_places = 0;
  let second_dec_places = 0;
  if (temp_first.search(/\./) > -1) {
    first_dec_places = temp_first.substring(temp_first.search(/\./) + 1).length;
  }
  if (temp_second.search(/\./) > -1) {
    second_dec_places = temp_second.substring(temp_second.search(/\./) + 1).length;
  }
  let dec_places = 0;

  if (first_dec_places > second_dec_places) {
    dec_places = first_dec_places;
  } else {
    dec_places = second_dec_places;
  }

  temp_first = first_num * Math.pow(10, dec_places);
  temp_second = second_num * Math.pow(10, dec_places);
  console.log('temp_first', temp_first);
  console.log('temp_second', temp_second);


  if (sign === '/') {
    if (second_num === 0) {
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


  solution = solution / Math.pow(10, dec_places*2);

  // If the number of digits in front of the decimal is too many, throw error
  // Grab the "integer" part of the solution
  let temp_str = solution.toString();
  if (temp_str.length > 9) {
    console.log('solution', solution);
    let integer = temp_str;
    if (temp_str.search(/\./) > -1) {
      integer = temp_str.substring(0, temp_str.search(/\./));
    } 
    console.log('integer', integer);
    if (integer.length > 9) {
      // Can't fit this number on our display; display ERROR.
      throw_error();
      return;
    }
    let total_decimals = temp_str.substring(temp_str.search(/\./) + 1);
    // Limit the total digits in the display to 9
    let avail_digits = 9;
    let exp_not = '';
    // Detect exponential notation
    if (total_decimals.search("e") >= 0) {
      // Find the length of the e+XX part
      exp_not = total_decimals.substring(total_decimals.search("e"));
      total_decimals = total_decimals.substring(0, total_decimals.search("e"));
      console.log('total_decimals, step -1', total_decimals);
      avail_digits -= exp_not.length;
    }
    // If found, round digits but keep notation
    console.log('total_decimals, step 1', total_decimals);
    let num_decimals = avail_digits - integer.length;
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

  first_num = solution;
  second_num = null;
  console.log('END OF CALCULATE()');
  debug();
  console.log('solution', solution, typeof solution);


  document.getElementById('/').style.backgroundColor = '#5FB9FF';
  document.getElementById('x').style.backgroundColor = '#5FB9FF';
  document.getElementById('-').style.backgroundColor = '#5FB9FF';
  document.getElementById('+').style.backgroundColor = '#5FB9FF';
  return solution;
}


function highlight(id) {
    document.getElementById(id).style.backgroundColor = '#CCC';
}

function unhighlight(id, color = '#FFF') {
    document.getElementById(id).style.backgroundColor = color;
}

function debug() {
    console.log('   first_num', first_num, typeof first_num);
    console.log('   second_num', second_num, typeof second_num);
    console.log('   sign', sign, typeof sign);
    console.log('   calc_state', calc_state);
    console.log('   display_state', display_state);
}

function throw_error() {
    display.innerHTML = 'ERROR';
    first_num = second_num = sign = null;
    calc_state = ERROR;
    display_state = READY_FOR_ENTRY;
    document.getElementById('/').style.backgroundColor = '#5FB9FF';
    document.getElementById('x').style.backgroundColor = '#5FB9FF';
    document.getElementById('-').style.backgroundColor = '#5FB9FF';
    document.getElementById('+').style.backgroundColor = '#5FB9FF';
}
