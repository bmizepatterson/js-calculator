"use strict";

// This is the "use strict";
// This is the JavaScript file we edit
var display = document.getElementById('display');
var first_num = null;
var second_num = null;
var sign = null;
var READY_FIRST = 1;
var READY_SECOND = 2;
var SOLVED = 3;
var ERROR = 4;
var calc_state = READY_FIRST;
var READY_FOR_ENTRY = 1;
var ENTRY_IN_PROGRESS = 2;
var display_state = READY_FOR_ENTRY;

function input(digit) {
  if (display_state == ENTRY_IN_PROGRESS && display.innerHTML.length > 10) {
    return;
  }

  if (digit === '.') {
    if (display_state == READY_FOR_ENTRY) {
      display.innerHTML = "0" + digit;
      display_state = ENTRY_IN_PROGRESS;
      return;
    }

    if (display.innerHTML.search(/\./) >= 0) {
      return;
    }
  }

  if (display_state == READY_FOR_ENTRY) {
    // After typing one digit, switch display_state so future inputs
    // are appended to the current entry.
    display.innerHTML = digit;
    display_state = ENTRY_IN_PROGRESS;
  } else if (display_state == ENTRY_IN_PROGRESS) {
    display.innerHTML += digit;
  }
}

function clear_display() {
  display.innerHTML = '0';
  calc_state = READY_FIRST;
  display_state = READY_FOR_ENTRY;
  first_num = second_num = null;
  sign = null;
  document.getElementById('/').style.backgroundColor = '#5FB9FF';
  document.getElementById('x').style.backgroundColor = '#5FB9FF';
  document.getElementById('-').style.backgroundColor = '#5FB9FF';
  document.getElementById('+').style.backgroundColor = '#5FB9FF';
  console.log('END OF CLEAR_DISPLAY()');
  debug();
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
  } else if (calc_state == READY_SECOND) {
    // && second_num != null) {
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
  var solution;
  var temp_first = first_num.toString();
  var temp_second = second_num.toString();
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

function unhighlight(id) {
  var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '#FFF';
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