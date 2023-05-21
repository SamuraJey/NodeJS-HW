
// function infixToPostfix1(expression) {
//     const precedence = {
//         "+": 1,
//         "-": 1,
//         "*": 2,
//         "/": 2,
//         "^": 3,
//     };
//     const stack = [];
//     let postfix = "";
//     let operandType = null;
//     if (expression.length === 0)
//         throw new Error("Invalid expression: empty string");
//     if (expression.length === 1)
//         throw new Error("Invalid expression: expression must contain at least two operands and one operator");

//     for (let i = 0; i < expression.length; i++) {
//         const token = expression[i];
//         if (!isNaN(token)) { // Check if token is a number
//             if (operandType === null) {
//                 operandType = "number";
//             }
//             else if (operandType !== "number") {
//                 throw new Error("Invalid expression: operands must be of the same type");
//             }
//             postfix += token;
//         }
//         else if (/[a-zA-Z]/.test(token)) { // Check if token is a letter
//             if (operandType === null) {
//                 operandType = "letter";
//             }
//             else if (operandType !== "letter") {
//                 throw new Error("Invalidexpression: operands must be of the same type");
//             }
//             postfix += token;
//         }
//         else if (token in precedence) {
//             while (
//                 stack.length > 0 &&
//                 stack[stack.length - 1] !== "(" &&
//                 precedence[token] <= precedence[stack[stack.length - 1]]
//             ) {
//                 postfix += stack.pop();
//             }
//             stack.push(token);
//         }
//         else if (token === "(") {
//             if (i < expression.length - 1 && expression[i + 1] === ")") {
//                 throw new Error("Invalid expression: empty brackets");
//             }
//             stack.push(token);
//         }
//         else if (token === ")") {
//             if (stack.length === 0 || stack[stack.length - 1] === "(") {
//                 throw new Error("Invalid expression: empty brackets or missing operands");
//             }
//             while (stack.length > 0 && stack[stack.length - 1] !== "(") {
//                 postfix += stack.pop();
//             }
//             if (stack.length === 0) {
//                 throw new Error("Invalid expression: unbalanced brackets");
//             }
//             stack.pop(); // pop "("
//         }
//         else {
//             throw new Error(`Invalid token: ${token}`);
//         }
//     }

//     if (stack.length === 1 && stack[0] === "(") {
//         throw new Error("Invalid expression: missing operands");
//     }

//     while (stack.length > 0) {
//         const token = stack.pop();
//         if (token === "(") {
//             throw new Error("Invalid expression: unbalanced brackets");
//         }
//         postfix += token;
//     }

//     return postfix;
// }

function infixToPostfix2(expression) { // cool but not working with a++b it works?
    const precedence = {
        "+": 1,
        "-": 1,
        "*": 2,
        "/": 2,
        "^": 3,
    };
    const stack = [];
    let postfix = "";
    let operandType = null;

    if (expression.length === 0)
        throw new Error("Invalid expression: empty string");

    if (expression.length === 1)
        throw new Error(`Invalid expression ( ${expression} ): expression must contain at least two operands and one operator`);

    for (let i = 0; i < expression.length; i++) {
        const token = expression[i];
        if (!isNaN(token)) { // Check if token is a number
            if (operandType === null) {
                operandType = "number";
            }
            else if (operandType !== "number") {
                throw new Error("Invalid expression: operands must be of the same type");
            }
            if (i < expression.length - 1 && !isNaN(expression[i + 1])) {
                throw new Error("Invalid expression: multiple operands");
            }
            postfix += token;
        }
        else if (/[a-zA-Z]/.test(token)) { // Check if token is a letter
            if (operandType === null) {
                operandType = "letter";
            }
            else if (operandType !== "letter") {
                throw new Error("Invalid expression: operands must be of the same type");
            }
            if (i < expression.length - 1 && /[a-zA-Z]/.test(expression[i + 1])) {
                throw new Error("Invalid expression: multiple operands");
            }
            postfix += token;
        }
        else if (token in precedence) {
            if (i === 0 || i === expression.length - 1) {
                throw new Error("Invalid expression: missing operands");
            }
            if (expression[i - 1] in precedence && expression[i] in precedence) {
                throw new Error("Invalid expression: multiple operators");
            }
            while (
                stack.length > 0 &&
                stack[stack.length - 1] !== "(" &&
                precedence[token] <= precedence[stack[stack.length - 1]]
            ) {
                postfix += stack.pop();
            }
            stack.push(token);
        }
        else if (token === "(") {
            if (i < expression.length - 1 && expression[i + 1] === ")") {
                throw new Error("Invalid expression: empty brackets");
            }
            stack.push(token);
        }
        else if (token === ")") {
            if (stack.length === 0 || stack[stack.length - 1] === "(") {
                throw new Error(`Invalid expression [ ${expression} ] : empty brackets or missing operands`);
            }
            while (stack.length > 0 && stack[stack.length - 1] !== "(") {
                postfix += stack.pop();
            }
            if (stack.length === 0) {
                throw new Error(`Invalid expression [ ${expression} ] : unbalanced brackets`);
            }
            stack.pop(); // pop "("
        }
        else {
            throw new Error(`Invalid token: ${token}`);
        }
    }

    if (stack.length === 1 && stack[0] === "(") {
        throw new Error(`Invalid expression [ ${expression} ]: missing operands`);
    }

    while (stack.length > 0) {
        const token = stack.pop();
        if (token === "(") {
            throw new Error(`Invalid expression [ ${expression} ] : unbalanced brackets`);
        }
        postfix += token;
    }

    return postfix;
}


let expr = "4+4";

// // console.log(infixToPostfix1(expr));
// // console.log(infixToPostfix(expr));
console.log(infixToPostfix2(expr));


function generateRandomExpression() {
    const maxDepth = 3; // Maximum recursion depth
    const maxOperands = 2; // Maximum number of operands per sub-expression
    const operators = ["+", "-", "*", "/",];
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
            // if (numOperands < 2) {
            //     numOperands = 2; // Ensure at least two operands
            // }
            let subExpression = "";
            let operator = "";
            for (let i = 0; i < numOperands; i++) {
                const operand = generateSubExpression(depth + 1, operator);
                const useParentheses = previousOperator !== null && hasLowerPrecedence(operator, previousOperator);
                if (useParentheses && operand.length > 1) {
                    subExpression += `(${operand})`;
                }
                else if (!isNaN(operand)) {
                    subExpression += operand;
                }
                else {
                    subExpression += operand; // operand is asub-expression, so enclose it in parentheses
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
            if (subExpression.length === 1) {
                // we should not have a single operand so we need to add another operand and operator
                const nextOperator = operators[Math.floor(Math.random() * operators.length)];
                const nextOperand = operands[Math.floor(Math.random() * operands.length)];
                subExpression += nextOperator + nextOperand;
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


function testCases(num) {
    for (let i = 0; i < num; i++) {
        const expression = generateRandomExpression();
        const postfixExpression = infixToPostfix2(expression);
        const infixExpression = postfixToInfix(postfixExpression);
        const infixResult = evaluateInfixExpression(infixExpression);
        const postfixResult = evaluatePostfixExpression(postfixExpression);
        console.log(`Test case ${i + 1}:`);
        console.log(`Expression1: ${expression}\nExpression2: ${postfixExpression}\nExpression3: ${infixExpression}`);
        console.log(`Result infix: ${infixResult} Result postfix: ${postfixResult}\n`);
        if (expression !== infixExpression && infixResult !== postfixResult) {
            if (infixResult !== postfixResult) {
                console.log(`Error in calc: ${infixResult} !== ${postfixResult}`);
            }
            console.log(`Error: ${expression} !== ${infixExpression}`);
        }
    }
}
testCases(10);



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


function evaluateInfixExpression(expression) {
    expression = expression.replace(/\^/g, "**");
    return eval(expression);
}

function evaluatePostfixExpression(expr) {
    const stack = [];
    const operators = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => a / b,
        '^': (a, b) => Math.pow(a, b)
    };

    const tokens = expr.split('');

    for (let token of tokens) {
        if (!isNaN(token)) {
            stack.push(Number(token));
        }
        else if (token in operators) {
            const b = stack.pop();
            const a = stack.pop();
            const result = operators[token](a, b);
            stack.push(result);
        }
        else {
            throw new Error(`Invalid character: ${token}`);
        }
    }
    return stack[0];
}