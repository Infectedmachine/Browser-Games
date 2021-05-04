// simple calculator script

// select all the buttons and display elem
const buttons = document.querySelectorAll('button');
const display = document.querySelector('.display');

// add event listener to each button in doc
buttons.forEach(function (button) {
    button.addEventListener('click', calculate);
});

const operator_function = {
    '+': function (a, b) {
        a = parseFloat(a);
        b = parseFloat(b);

        return a + b;
    },

    '-': function (a, b) {
        a = parseFloat(a);
        b = parseFloat(b);

        return a - b;
    },

    '*': function (a, b) {
        if (a === '0' || b === '0')
            return 0;
        else {
            a = parseFloat(a);
            b = parseFloat(b);
            return a * b;
        }
    },

    '/': function (a, b) {
        a = parseFloat(a);
        b = parseFloat(b);

        if (b !== 0.0) {
            return a / b;
        } else
            return 0;
    }
}

const stack_handler = {
    VARSTACK: [],
    OPSTACK: [],
    var_length: 0,
    op_length: 0,

    PUSH_VAR(value) {
        this.VARSTACK.push(value);
        this.var_length++;
    },
    POP_VAR() {
        this.var_length--;
        return this.VARSTACK.pop();
    },
    PUSH_OP(value) {
        this.OPSTACK.push(value);
        this.op_length++;
    },
    POP_OP() {
        this.op_length--;
        return this.OPSTACK.pop();
    },
    CLEAR_VARSTACK() {
        this.VARSTACK = [];
        this.var_length = 0;
    },
    CLEAR_OPSTACK() {
        this.OPSTACK = [];
        this.op_length = 0;
    }
}

const event_caller = {
    float: false,
    hasNumber: false,
    hasOperator: false,
    lastOperatorPriority: 1,
    computed: true,

    NUMBER(value) {
        if (event_caller.computed) {
            event_caller.computed = false;
            display.value = '';
        }
        if (event_caller.hasOperator) {
            display.value = '';
            event_caller.hasOperator = false;
            event_caller.float = false;
        }
        if (value !== '.') {
            display.value += value;
        } else if (!event_caller.float) {
            event_caller.float = true;
            display.value += value;
        }
        event_caller.hasNumber = true;
    },

    OPERATOR(value) {
        if (!event_caller.hasNumber && value === '-') {
            display.value = value;
            event_caller.computed = false;
        } else if (event_caller.hasNumber && !event_caller.hasOperator) {
            if (event_caller.lastOperatorPriority >= operator_priority[value]) {
                stack_handler['PUSH_VAR'](parseFloat(display.value));
                display.value = compute();
            }
            stack_handler['PUSH_VAR'](parseFloat(display.value));
            stack_handler['PUSH_OP'](value);
            event_caller.float = false;
            event_caller.hasOperator = true;
            event_caller.lastOperatorPriority = operator_priority[value];
        } else if (event_caller.hasNumber && event_caller.hasOperator) {
            stack_handler['POP_OP']();
            stack_handler['PUSH_OP'](value);
            event_caller.lastOperatorPriority = operator_priority[value];
        }
    },

    RESULT() {
        if (!event_caller.computed) {
            if (display.value !== '' && !event_caller.hasOperator)
                stack_handler['PUSH_VAR'](parseFloat(display.value));
            if (stack_handler['var_length'] === 1)
                display.value = stack_handler['POP_VAR']();
            else {
                display.value = compute();
            }
            stack_handler['CLEAR_VARSTACK']();
            stack_handler['CLEAR_OPSTACK']();
            event_caller.float = false;
            event_caller.hasOperator = false;
            event_caller.hasNumber = false;
            event_caller.computed = true;
            event_caller.lastOperatorPriority = 1;
        }

    },

    CLEAR() {
        display.value = '';
        event_caller.float = false;
    },

    ALLCLEAR() {
        display.value = '';
        stack_handler['CLEAR_VARSTACK']();
        stack_handler['CLEAR_OPSTACK']();
        event_caller.float = false;
        event_caller.hasOperator = false;
        event_caller.hasNumber = false;
        event_caller.computed = true;
        event_caller.lastOperatorPriority = 1;
    },

    DELETE() {
        display.value = display.value.slice(0, -1);
        if (!display.value.includes('.'))
            event_caller.float = false;
    }
}

const button_type = {
    "/": event_caller['OPERATOR'],
    "*": event_caller['OPERATOR'],
    "-": event_caller['OPERATOR'],
    "+": event_caller['OPERATOR'],
    "=": event_caller['RESULT'],
    "C": event_caller['CLEAR'],
    "AC": event_caller['ALLCLEAR'],
    "DEL": event_caller['DELETE']
}

const operator_priority = {
    "/": 3,
    "*": 3,
    "-": 2,
    "+": 2
}



function calculate(event) {
    const clickedButtonValue = event.target.value;

    if (button_type.hasOwnProperty(clickedButtonValue)) {
        let callEvent = button_type[clickedButtonValue];
        callEvent(clickedButtonValue);
    } else {
        let callEvent = event_caller['NUMBER'];
        callEvent(clickedButtonValue);
    }


}

function compute() {
    var a = 0;
    var b = 0;
    var op = '';
    var func;

    while (stack_handler['op_length'] > 0) {
        op = stack_handler['POP_OP']();
        a = stack_handler['POP_VAR']();
        b = stack_handler['POP_VAR']();
        func = operator_function[op];
        stack_handler['PUSH_VAR'](func(b, a));
    }

    return stack_handler['POP_VAR']();
}