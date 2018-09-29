/**
 * GLOBALS
 */
// The "display" of the calculator -- an HTML input element
let display    = null;

// The first value of the current calculation
let operand1  = null;

// The second value of the current calculation
let operand2 = null;

// The operation currently being performed
let operator   = null;

// A history of every key pressed (resets when clear is pressed)
let keyStack   = [];

// The maximum number of digits (inc. decimal point) that the display can hold
let maxDigits  = 9;

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

    // Ignore empty buttons
    if (key == '&nbsp;') return;

    // Route to the function appropriate for this key
    if (isNumeric(key))       enterNumber(key);

    else if (isOperator(key)) enterOperator(key);

    else if (isEquals(key))   enterEquals(key);

    else if (isClear(key))    clearDisplay();

    else if (isDecimal(key))  enterDecimal(key);

    // Add this key to the history
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
    if (displayIsFull()) return;

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
    }

    // If we have enough information to perform a calculation, then perform it.
    // NOTE: The operands are saved as strings, so even "0" evaluates to true.
    if (operand1 && operator) {
        operand2 = display.value;
        // Save the results of the calculation in operand1 so additional
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
        display.value = calculate();
        // Move operand2 over to operand1 so we can continue to make
        // calculations on this value if the equals is pressed multiple
        // times in succession.
        operand1 = operand2;
    }
}

function calculate() {
    // Performs operator on operand1 and operand2

    // First check that we have all the information we need. If not, return.
    let fail = false;
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
    if (fail) return;

    // Prepare the operands for processing
    let num1 = integerize(operand1);
    let num2 = integerize(operand2);

    // Perform the operator on the operands
    let total = null;
    if (operator === '+') {
        total = num1.integer + num2.integer;

    } else if (operator === '-') {
        total = num1.integer - num2.integer;

    } else if (operator === 'x') {
        total = num1.integer * num2.integer;

    } else if (operator === '/' && num2.integer) {
        // Watch out for division by zero.
        total = num1.integer / num2.integer;

    } else {
        console.log('Operator not recognized.');
        // leave total = null
    }

    // Format total and return
    return formatTotal(total, num1, num2);
}



/**
 * UTILITY FUNCTIONS
 * These functions encapsulate pieces of logic so that the main functions
 * will be easier to interpret.
 **/
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

function readyForInput() {
    // Is the display ready for a new number?
    // The display shows a single 0 upon initial load and after
    // clear is pressed. If the user last clicked an operator
    // key or the equals key, then they're ready to enter a new number.
    return (display.value == '0' || isOperator(getLastKey()) || isEquals(getLastKey()));
}

function getLastKey() {
    // Returns the last button pressed,
    // which is the last element of the keyStack array
    return keyStack[keyStack.length - 1];
}

function getLastOperator() {
    // Search back in the keyStack and find the last operator entered.
    // We must search in reverse--from the end of the array to the beginning.
    for (let i = keyStack.length - 1; i >= 0; i--) {
        if (isOperator(keyStack[i])) return keyStack[i];
    }
    // No operator found. That happens sometimes. Explicitly return null
    // so we know that no error occurred.
    return null;
}

function displayIsFull() {
    return (display.value.length >= maxDigits);
}

function containsDecimal(string) {
    return (findDecimalPoint(string) > -1);
}

function findDecimalPoint(string) {
    return string.search(/\./);
}

/**
 *  Floating point operations are tricky. Let's avoid them by turning each
 *  operand into an integer before performing any operations. We can do this
 *  by multiplying by an appropriate power of 10, depending on how many
 *  digits come after the decimal point.
 *
 *  We just have to remember to move that decimal point back to the right spot
 *  once we have the total.
 *  @param operand string to convert to integer, scaling up by a power of 10 if
 *      necessary
 *  @return object with two properties:
 *      - integer, the converted integer
 *      - decimalPlaces, the number of decimal places we had to scale
 */
function integerize(operand) {
    let result = {
        integer: parseInt(operand),
        decimalPlaces: 0
    };
    if (containsDecimal(operand)) {
        // The number of decimal places is equal to the length of the substring
        // starting at the location of the decimal point + 1
        result.decimalPlaces = operand.substring(findDecimalPoint(operand) + 1).length;
        result.integer = parseInt(operand * Math.pow(10, result.decimalPlaces));
    }
    return result;
}

function formatTotal(total, num1, num2) {
    // Scale down total if either operands had to be scaled up.
    // Total should be scaled down by the greater number of decimal places
    // present in the original operands.
    if (num1.decimalPlaces || num2.decimalPlaces) {
        total /= Math.pow(10, Math.max(num1.decimalPlaces, num2.decimalPlaces));
    }
    return total.toString();
}
