// This is the JavaScript file we edit

let display = document.getElementById('display');
let first_num, second_num;
let state = 'ready';
let sign;

function input(digit) {
    if (digit === '.' && display.innerHTML.search(/\./) >= 0) {
        return;
    }
    if (state === 'ready_second' || state === 'solved') {
        display.innerHTML = digit;
        state = 'ready';
    } else {

        if (display.innerHTML === '0') {
            display.innerHTML = digit;    
        } else {
            display.innerHTML += digit;
        }
    }

}

function clear_display() {
    display.innerHTML = '0';
}

function operator(current_sign) {
    first_num = parseFloat(display.innerHTML);
    console.log('first_num:', first_num);
    state = 'ready_second';
    sign = current_sign;
}

function calculate() {
    second_num = parseFloat(display.innerHTML);
    let solution;

    if (sign === '/') {
        solution = first_num / second_num;
    } else if (sign === 'x') {
        solution = first_num * second_num;
    } else if (sign === '-') {
        solution = first_num - second_num;
    } else if (sign === '+') {
        solution = first_num + second_num;
    }

    display.innerHTML = solution;
    state = 'solved';
}

