// simple calculator script

// select all the buttons and display elem
const buttons = document.querySelectorAll('button');
const display = document.querySelector('.display');
var variableStack = [];
var operatorStack = [];

// add event listener
buttons.forEach(function(button) {
  button.addEventListener('click', calculate);
});

// init map with methods for every single operation
var operators = new Map();
operators.set("/", function(a, b) {
    a = parseFloat(a);
    b = parseFloat(b);

    if (b !== 0.0) {
        return a/b;
    } else 
        return 0;
});

operators.set("*", function(a, b) {
    if (a === '0' || b === '0') 
        return 0;
    else {
        a = parseFloat(a);
        b = parseFloat(b);
        return a*b;
    }
});

operators.set("-", function(a, b) {
    a = parseFloat(a);
    b = parseFloat(b);
    
    return a-b;
});

operators.set("+", function(a, b) {
    a = parseFloat(a);
    b = parseFloat(b);
    
    return a+b;
});

// init map with buttons type (variable, operator, result, clear, clear all)
var typeMap = new Map();
typeMap.set("00", "var");
typeMap.set("0", "var");
typeMap.set("1", "var");
typeMap.set("2", "var");
typeMap.set("3", "var");
typeMap.set("4", "var");
typeMap.set("5", "var");
typeMap.set("6", "var");
typeMap.set("7", "var");
typeMap.set("8", "var");
typeMap.set("9", "var");
typeMap.set("/", "op");
typeMap.set("*", "op");
typeMap.set("-", "op");
typeMap.set("+", "op");
typeMap.set("=", "res");
typeMap.set("C", "clear");
typeMap.set("AC", "clear_all");
typeMap.set("DEL", "delete_last");
typeMap.set(".", "var");

// init map with methods to perform on event's value based on the button type
var events = new Map();
events.set("var", function (value) {
    display.value += value;
});

events.set("op", function (value) {
    if (display.value !== '') {
        variableStack.push(parseFloat(display.value));
        operatorStack.push(value);
        display.value = '';
    }
});

events.set("res", function () {
    if (display.value !== '')
        variableStack.push(parseFloat(display.value));
    if (variableStack.length == 1)
        display.value = variableStack.pop();
    else {
        display.value = computeOutcome();
    }
});

events.set("clear", function () {
    display.value = '';
});

events.set("clear_all", function () {
    display.value = '';
    variableStack = [];
    operatorStack = [];
});

events.set("delete_last", function () {
    display.value = display.value.slice(0, -1);
});

function calculate(event) {
  const clickedButtonValue = event.target.value;

  var type = typeMap.get(clickedButtonValue);
  var callEvent = events.get(type);
  callEvent(clickedButtonValue);
}

function computeOutcome() {
    var a = 0;
    var b = 0;
    var result = 0.0;
    var op = '';
    var func;

    while (operatorStack.length > 0) {
        op = operatorStack.pop();
        a = variableStack.pop();
        b = variableStack.pop();
        func = operators.get(op);
        variableStack.push(func(b, a));
    }

    return variableStack.pop();
}

function checkOperatorPriority (operator1, operator2) {
    var priorityMap = new Map();
    priorityMap.set("*", 2);
    priorityMap.set("/", 2);
    priorityMap.set("+", 1);
    priorityMap.set("-", 1);

    if (priorityMap.get(operator1) >= priorityMap.get(operator2))
        return true;
    else 
        return false;
}