function infixToPostfix(expression) {
    const precedence = {
        "+": 1,
        "-": 1,
        "*": 2,
        "/": 2,
        "^": 3,
    };
    const stack = [];
    let postfix = "";

    // Проверка на соответствие правилам
    let openingBrackets = expression.split('(').length - 1;
    let closingBrackets = expression.split(')').length - 1;

    if (openingBrackets !== closingBrackets) {
        console.log("Invalid expression: unbalanced brackets");
        return "Invalid expression: unbalanced brackets";
        throw new Error("Invalid expression: unbalanced brackets");
    }

    if (/^[^\d(]/.test(expression) || /[^\d)]$/.test(expression)) {
        console.log("Invalid expression: expression must start and end with an operand or closing bracket");
        return "Invalid expression: expression must start and end with an operand or closing bracket";
        throw new Error("Invalid expression: expression must start and end with an operand or closing bracket");
    }

    let hasOperand = false;
    for (let i = 0; i < expression.length; i++) {
        const token = expression[i];
        if (!isNaN(token)) { // Operand (number)  
            postfix += token;
            hasOperand = true;
        }
        else if (token in precedence) { // Operator
            const prec = precedence[token];
            while (stack.length > 0 && precedence[stack[stack.length - 1]] >= prec) {
                postfix += stack.pop();
            }
            stack.push(token);
        }
        else if (token === "(") {
            stack.push(token);
        }
        else if (token === ")") {
            while (stack.length > 0 && stack[stack.length - 1] !== "(") {
                postfix += stack.pop();
            }
            stack.pop();
        }
        else {
            console.log(`Invalid token: ${token}`);
            return `Invalid token: ${token}`;
            throw new Error(`Invalid token: ${token}`);
        }
    }

    if (stack.length > 0) {
        while (stack.length > 0) {
            if (stack[stack.length - 1] === "(") {
                console.log("Invalid expression: unbalanced brackets");
                return "Invalid expression: unbalanced brackets";
                throw new Error("Invalid expression: unbalanced brackets");
            }
            postfix += stack.pop();
        }
    }
    else if (!hasOperand) {
        console.log("Invalid expression: no operands in the expression");
        return "Invalid expression: no operands in the expression";
        throw new Error("Invalid expression: no operands in the expression");
    }

    return postfix;
}

function postfixToInfix(expression) {
    let stack = [];
    let operators = new Set(['+', '-', '*', '/', '^']);

    for (let char of expression) {
        if (!operators.has(char)) {
            stack.push(char);
        }
        else {
            let operand1 = stack.pop();
            let operand2 = stack.pop();
            let operator = char;
            if (operators.has(operand1[operand1.length - 1])) { // Check if operand1 is an expression
                operand1 = `(${operand1})`;
            }
            if (operators.has(operand2[operand2.length - 1]) || operand2 === "") { // Check if operand2 is an expression
                operand2 = `(${operand2})`;
            }
            stack.push(`${operand2}${operator}${operand1}`);
        }
    }

    let infixExpression = stack[0];
    let openingBrackets = infixExpression.split('(').length - 1;
    let closingBrackets = infixExpression.split(')').length - 1;

    if (openingBrackets === closingBrackets && infixExpression[0] === '(' && infixExpression[infixExpression.length - 1] === ')') {
        infixExpression = infixExpression.slice(1, -1);
    }

    return infixExpression;
}

const expression = "3/9/4-3/7"; // 3/9/4-3/7
const postfixExpression = infixToPostfix(expression);
console.log(postfixExpression); // 1125^*+1-

let infixExpression = postfixToInfix(postfixExpression);
console.log(infixExpression); // выведет 2+3

// we need to test everyhing, so must write a function that will generate random expressions


function generateRandomExpression() {
    const maxDepth = 3; // Maximum recursion depth
    const maxOperands = 2; // Maximum number of operands per sub-expression
    const operators = ["+", "-", "*", "/", "^"];
    const operands = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    let expression = "";

    function generateSubExpression(depth, previousOperator = null) {
        if (depth >= maxDepth) {
            // At maximum depth, return a single operand
            return operands[Math.floor(Math.random() * operands.length)];
        }
        else {
            // Generate a sub-expression with multiple operands
            const numOperands = Math.floor(Math.random() * maxOperands) + 1;
            let subExpression = "";
            let operator = "";
            for (let i = 0; i < numOperands; i++) {
                const operand = generateSubExpression(depth + 1, operator);
                const useParentheses = previousOperator !== null && hasLowerPrecedence(operator, previousOperator);
                if (useParentheses) {
                    subExpression += `(${operand})`;
                }
                else {
                    subExpression += operand;
                }
                if (i < numOperands - 1) {
                    const nextOperator = operators[Math.floor(Math.random() * operators.length)];
                    const nextUseParentheses = hasLowerPrecedence(nextOperator, operator) || (nextOperator === "^" && operator === "^");
                    if (nextUseParentheses) {
                        subExpression += ` ${nextOperator} `;
                    }
                    else {
                        subExpression += nextOperator;
                    }
                    operator = nextOperator;
                }
            }
            if (subExpression.slice(-1) === "(") {
                subExpression = subExpression.slice(0, -1);
            }
            if (subExpression[0] === "(" && subExpression.slice(-1) === ")") {
                subExpression = subExpression.slice(1, -1);
            }

            return subExpression;
        }
    }

    function hasLowerPrecedence(operator1, operator2) {
        const precedence = {
            "^": 4,
            "*": 3,
            "/": 3,
            "+": 2,
            "-": 2
        };
        return precedence[operator1] < precedence[operator2];
    }

    expression = generateSubExpression(0);

    return expression;
}

for (let i = 0; i < 10; i++) {
    const expression = generateRandomExpression();
    const postfixExpression = infixToPostfix(expression);
    const infixExpression = postfixToInfix(postfixExpression);
    const infixResult = evaluateInfixExpression(infixExpression);
    const postfixResult = evaluatePostfixExpression(postfixExpression);
    console.log(`Expression1: ${expression}\nExpression2: ${postfixExpression}\nExpression3: ${infixExpression}\n`);
    if (expression !== infixExpression || infixResult !== postfixResult) 
    {
        if (infixResult !== postfixResult)
        {
            console.log(`Error in calc: ${infixResult} !== ${postfixResult}`);
        }
        console.log(`Error: ${expression} !== ${infixExpression}`);
    }
}

function evaluateInfixExpression(expression) {
    // need to replace all ^ with **, because Math.pow() doesn't work with ^
    expression = expression.replace(/\^/g, "**");
    //console.log(`Expression in infixeval: ${expression}`);
    return eval(expression);
}

console.log(eval("2/9-5**6**2+5**3"));
console.log(evaluateInfixExpression("2/9-5^6^2+5^3"));

function evaluatePostfixExpression(expression) {

    const stack = [];
    const operators = {
        "+": (a, b) => a + b,
        "-": (a, b) => a - b,
        "*": (a, b) => a * b,
        "/": (a, b) => a / b,
        "^": (a, b) => Math.pow(a, b),
    };

    for (let i = 0; i < expression.length; i++) {
        const token = expression[i];
        if (!isNaN(token)) {
            stack.push(parseFloat(token));
        } else if (token in operators) {
            const [b, a] = [stack.pop(), stack.pop()];
            stack.push(operators[token](a, b));
        }
    }

    return stack.pop();
}

//console.log(evaluatePostfixExpression("12+4*3+"));

//console.log(generateRandomExpression());
