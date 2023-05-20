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

    for (let i = 0; i < expression.length; i++) {
        const token = expression[i];
        if (!isNaN(token)) {
            postfix += token;
        } else if (/[a-zA-Z]/.test(token)) {
            postfix += token;
        } else if (token in precedence) {
            while (
                stack.length > 0 &&
                stack[stack.length - 1] !== "(" &&
                precedence[token] <= precedence[stack[stack.length - 1]]
            ) {
                postfix += stack.pop();
            }
            stack.push(token);
        } else if (token === "(") {
            stack.push(token);
        } else if (token === ")") {
            while (stack.length > 0 && stack[stack.length - 1] !== "(") {
                postfix += stack.pop();
            }
            if (stack.length === 0) {
                throw new Error("Invalid expression: unbalanced brackets");
            }
            stack.pop(); // pop "("
        } else {
            throw new Error(`Invalid token: ${token}`);
        }
    }

    while (stack.length > 0) {
        const token = stack.pop();
        if (token === "(") {
            throw new Error("Invalid expression: unbalanced brackets");
        }
        postfix += token;
    }

    return postfix;
}

// function postfixToInfix(expression) {
//     let stack = [];
//     let operators = new Set(['+', '-', '*', '/', '^']);

//     for (let char of expression) {
//         if (!operators.has(char)) {
//             stack.push(char);
//         } else {
//             let operand1 = stack.pop();
//             let operand2 = stack.pop();
//             stack.push(`(${operand2}${char}${operand1})`);
//         }
//     }

//     let infixExpression = stack[0];
//     let openingBrackets = infixExpression.split('(').length - 1;
//     let closingBrackets = infixExpression.split(')').length - 1;

//     if (openingBrackets === closingBrackets) {
//         infixExpression = infixExpression.slice(1, -1);
//     }

//     return infixExpression;
// }

function postfixToInfix(expression) {
    let stack = [];
    let operators = new Set(['+', '-', '*', '/', '^']);

    for (let char of expression) {
        if (!operators.has(char)) {
            stack.push(char);
        } else {
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




const expression = "1+1*2^5-1"; // 12+4*3+
const postfixExpression = infixToPostfix(expression);
console.log(postfixExpression); // 1125^*+1-


let infixExpression = postfixToInfix(postfixExpression);
console.log(infixExpression);  // выведет 2+3


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
        } else {
            // Generate a sub-expression with multiple operands
            const numOperands = Math.floor(Math.random() * maxOperands) + 1;
            let subExpression = "";
            let operator = "";
            for (let i = 0; i < numOperands; i++) {
                const operand = generateSubExpression(depth + 1, operator);
                const useParentheses = previousOperator !== null && hasLowerPrecedence(operator, previousOperator);
                if (useParentheses) {
                    subExpression += `(${operand})`;
                } else {
                    subExpression += operand;
                }
                if (i < numOperands - 1) {
                    const nextOperator = operators[Math.floor(Math.random() * operators.length)];
                    const nextUseParentheses = hasLowerPrecedence(nextOperator, operator) || (nextOperator === "^" && operator === "^");
                    if (nextUseParentheses) {
                        subExpression += ` ${nextOperator} `;
                    } else {
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
    console.log(`Expression1: ${expression}\nExpression2: ${postfixExpression}\nExpression3: ${infixExpression}\n`);
    if (expression !== infixExpression) 
    {
        console.log(`Error: ${expression} !== ${infixExpression}`);
    }
}

//console.log(generateRandomExpression());
