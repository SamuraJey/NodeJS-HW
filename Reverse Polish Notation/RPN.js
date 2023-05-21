const fs = require('fs');

function infixToPostfix2(expression)
{
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
        throw new Error(`Invalid expression [ ${expression} ]: expression must contain at least two operands and one operator`);
    let counter = 1;
    for (let i = 0; i < expression.length; i++)
    {
        const token = expression[i];
        if (!isNaN(token))
        { // Check if token is a number
            if (operandType === null)
            {
                operandType = "number";
            }
            else if (operandType !== "number")
            {
                throw new Error(`Invalid expression [ ${expression} ] : operands must be of the same type`);
            }
            if (i < expression.length - 1 && !isNaN(expression[i + 1]))
            {
                throw new Error(`Invalid expression [ ${expression} ] : multiple operands`);
            }
            postfix += token;
        }
        else if (/[a-zA-Z]/.test(token))
        { // Check if token is a letter
            if (operandType === null)
            {
                operandType = "letter";
            }
            else if (operandType !== "letter")
            {
                throw new Error(`Invalid expression [ ${expression} ] : operands must be of the same type`);
            }
            if (i < expression.length - 1 && /[a-zA-Z]/.test(expression[i + 1]))
            {
                throw new Error(`Invalid expression [ ${expression} ] : multiple operands`);
            }
            postfix += token;
        }
        else if (token in precedence)
        {
            if (i === 0 || i === expression.length - 1)
            {
                throw new Error(`Invalid expression [ ${expression} ] : missing operands`);
            }
            if (expression[i - 1] in precedence && expression[i] in precedence)
            {
                throw new Error(`Invalid expression [ ${expression} ] : multiple operators`);
            }
            while (
                stack.length > 0 &&
                stack[stack.length - 1] !== "(" &&
                precedence[token] <= precedence[stack[stack.length - 1]]
            )
            {
                postfix += stack.pop();
            }
            stack.push(token);
        }
        else if (token === "(")
        {
            if (i < expression.length - 1 && expression[i + 1] === ")")
            {
                throw new Error(`Invalid expression [ ${expression} ] : empty brackets`);
            }
            stack.push(token);
        }
        else if (token === ")")
        {
            if (stack.length === 0 || stack[stack.length - 1] === "(")
            {
                throw new Error(`Invalid expression [ ${expression} ] : empty brackets or missing operands`);
            }
            while (stack.length > 0 && stack[stack.length - 1] !== "(")
            {
                postfix += stack.pop();
            }
            if (stack.length === 0)
            {
                throw new Error(`Invalid expression [ ${expression} ] : unbalanced brackets`);
            }
            stack.pop(); // pop "("
        }
        else
        {
            throw new Error(`Invalid token: ${token}`);
        }
        const stackCopyStr = JSON.stringify(stack);
        // Запись состояния постфикса в файл
        fs.appendFileSync('stack_state_inf_to_pref.json', `State ${counter}: ${postfix} \n`, err =>
        {
            if (err) throw err;

        });
        counter++;
    }

    if (stack.length === 1 && stack[0] === "(")
    {
        throw new Error(`Invalid expression [ ${expression} ]: missing operands`);
    }

    while (stack.length > 0)
    {
        const token = stack.pop();
        if (token === "(")
        {
            throw new Error(`Invalid expression [ ${expression} ] : unbalanced brackets`);
        }
        postfix += token;
        fs.appendFileSync('stack_state_inf_to_pref.json', `State ${counter}: ${postfix} \n`, err =>
        {
            if (err) throw err;
        });
    }

    return postfix;
}

function postfixToInfix(expression)
{
    const operators = new Set(['+', '-', '*', '/', '^']);
    const priorityMap = new Map([
        ['-', 1],
        ['+', 1],
        ['/', 2],
        ['*', 2],
        ['^', 3]
    ]);

    const rightPriorityMap = new Map([
        ['+', 1],
        ['-', 2],
        ['*', 3],
        ['/', 4],
        ['^', 5]
    ]);

    let spacedExpr = "";
    for (let i = 0; i < expression.length; i++)
    {
        spacedExpr += expression[i];
        if (i < expression.length - 1)
        {
            spacedExpr += " ";
        }
    }
    expression = spacedExpr;

    let i = 0;
    const nextToken = function()
    {
        while (i < expression.length && expression[i] == ' ') i++;
        if (i == expression.length) return '';
        let token = '';
        while (i < expression.length && expression[i] != ' ') token += expression[i++];
        return token;
    };
    const printExpression = function(node) // Получаем дерево
    {
        if (typeof(node) == 'string')
        {
            return node;
        }
        let left = printExpression(node.left);
        let right = printExpression(node.right);
        if (typeof(node.left) != 'string' && (priorityMap.get(node.left.op) < priorityMap.get(node.op) || (node.left.op == node.op && node.op == '^')))
        {
            left = '(' + left + ')';
        }
        if (typeof(node.right) != 'string' && (rightPriorityMap.get(node.right.op) < rightPriorityMap.get(node.op) || (node.left.op == node.op && (node.op == '-' || node.op == '/'))))
        {
            right = '(' + right + ')';
        }
        return left + ' ' + node.op + ' ' + right;
    };
    const stack = [];
    let token;
    let counter = 1;
    while ((token = nextToken(expression)) != '') // 7+3/5-1-(8-5)
    {
        //if (isOperator(token))
        if (operators.has(token))
        {
            if (stack.length < 2) return 'Invalid expression.';
            stack.push(
            {
                op: token,
                right: stack.pop(),
                left: stack.pop()
            });
        }
        else
        {
            stack.push(token);
        }
        const stackCopyStr = JSON.stringify(stack);
        // Запись состояния стека в файл
        fs.appendFileSync('stack_state_pref_to_inf.json', `State ${counter}: ${stackCopyStr} \n`, err =>
        {
            if (err) throw err;
            //console.log('Состояние стека было успешно записано в файл!');
        });
        counter++;
    }
    if (stack.length != 1) return 'Invalid expression.';
    return printExpression(stack.pop()).replace(/\s/g, '');
}

function evaluateInfixExpression(expression)
{
    expression = expression.replace(/\^/g, "**");
    return eval(expression);
}

function evaluatePostfixExpression(expr)
{
    const stack = [];
    const operators = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => a / b,
        '^': (a, b) => Math.pow(a, b)
    };

    const tokens = expr.split('');

    for (let token of tokens)
    {
        if (!isNaN(token))
        {
            stack.push(Number.parseFloat(token));
        }
        else if (token in operators)
        {
            const b = stack.pop();
            const a = stack.pop();
            const result = operators[token](a, b);
            stack.push(result);
        }
        else
        {
            throw new Error(`Invalid character: ${token}`);
        }
    }
    return stack[0];
}

function generateRandomExpression()
{
    const maxDepth = 3; // Maximum recursion depth
    const maxOperands = 2; // Maximum number of operands per sub-expression
    const operators = ["+", "-", "*", "/", ];
    const operands = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    let expression = "";

    function generateSubExpression(depth, previousOperator = null)
    {
        if (depth >= maxDepth)
        {
            // At maximum depth, return a single operand
            return operands[Math.floor(Math.random() * operands.length)];
        }
        else
        {
            // Generate a sub-expression with multiple operands
            const numOperands = Math.floor(Math.random() * maxOperands) + 1;
            // if (numOperands < 2) {
            //     numOperands = 2; // Ensure at least two operands
            // }
            let subExpression = "";
            let operator = "";
            for (let i = 0; i < numOperands; i++)
            {
                const operand = generateSubExpression(depth + 1, operator);
                const useParentheses = previousOperator !== null && hasLowerPrecedence(operator, previousOperator);
                if (useParentheses && operand.length > 1)
                {
                    subExpression += `(${operand})`;
                }
                else if (!isNaN(operand))
                {
                    subExpression += operand;
                }
                else
                {
                    subExpression += operand; // operand is asub-expression, so enclose it in parentheses
                }
                if (i < numOperands - 1)
                {
                    const nextOperator = operators[Math.floor(Math.random() * operators.length)];
                    const nextUseParentheses = hasLowerPrecedence(nextOperator, operator) || (nextOperator === "^" && operator === "^");
                    if (nextUseParentheses)
                    {
                        subExpression += ` ${nextOperator} `;
                    }
                    else
                    {
                        subExpression += nextOperator;
                    }
                    operator = nextOperator;
                }
            }
            if (subExpression.slice(-1) === "(")
            {
                subExpression = subExpression.slice(0, -1);
            }
            if (subExpression[0] === "(" && subExpression.slice(-1) === ")")
            {
                subExpression = subExpression.slice(1, -1);
            }
            if (subExpression.length === 1)
            {
                // we should not have a single operand so we need to add another operand and operator
                const nextOperator = operators[Math.floor(Math.random() * operators.length)];
                const nextOperand = operands[Math.floor(Math.random() * operands.length)];
                subExpression += nextOperator + nextOperand;
            }

            return subExpression;
        }
    }

    function hasLowerPrecedence(operator1, operator2)
    {
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

function testCases(num)
{
    for (let i = 0; i < num; i++)
    {
        const expression = generateRandomExpression();
        const postfixExpression = infixToPostfix2(expression);
        const infixExpression = postfixToInfix(postfixExpression);
        const infixResult = evaluateInfixExpression(infixExpression);
        const postfixResult = evaluatePostfixExpression(postfixExpression);
        console.log(`Test case ${i + 1}:`);
        console.log(`Expression1: ${expression}\nExpression2: ${postfixExpression}\nExpression3: ${infixExpression}`);
        console.log(`Result infix: ${infixResult} Result postfix: ${postfixResult}\n`);
        if (expression !== infixExpression && infixResult !== postfixResult)
        {
            if (infixResult !== postfixResult)
            {
                console.log(`Error in calc: ${infixResult} !== ${postfixResult}`);
            }
            console.log(`Error: ${expression} !== ${infixExpression}`);
        }
    }
}

function main()
{
    let [mode, inputExpr, input3] = process.argv.slice(2);
    const allowedModes = ['-t', '-e', '-d'];

    switch (mode)
    {
        case undefined:
            console.log("No mode specified");
            console.log(`Allowed modes: ${allowedModes}`);
            process.exit(1);
        case '-t':
            testCases(inputExpr);
            break;
        case '-e':
            try
            {
                if (/[a-zA-Z]/.test(inputExpr) && !(/[0-9]/.test(inputExpr)))
                {
                    const postfixExpression = infixToPostfix2(inputExpr);
                    const infixExpression = postfixToInfix(postfixExpression);
                    console.log(`Postfix expression: ${postfixExpression}`);
                    console.log(`Restored Infix expression: ${infixExpression}`);
                }
                else if (/[0-9]/.test(inputExpr) && !(/[a-zA-Z]/.test(inputExpr)))
                {
                    const postfixExpression = infixToPostfix2(inputExpr);
                    const postfixResult = evaluatePostfixExpression(postfixExpression);
                    const infixExpression = postfixToInfix(postfixExpression);
                    const infixResult = evaluateInfixExpression(infixExpression);
                    console.log(`Postfix expression: ${postfixExpression}`);
                    console.log(`Postfix result: ${postfixResult}`);
                    console.log(`Restored Infix expression: ${infixExpression}`);
                    console.log(`Infix result: ${infixResult}`);
                }
                else
                {
                    throw new Error(`Invalid expression [ ${  inputExpr } ] : operands must be of the same type`);
                }
            }
            catch (error)
            {
                console.log(error.message);
            }
            break;
        case '-d':
            try
            {
                if (/[a-zA-Z]/.test(inputExpr) && !(/[0-9]/.test(inputExpr)))
                {
                    const infixExpression = postfixToInfix(inputExpr);
                    const postfixExpression = infixToPostfix2(infixExpression);
                    console.log(`Infix expression: ${infixExpression}`);
                    console.log(`Restored Postfix expression: ${postfixExpression}`);
                }
                else if (/[0-9]/.test(inputExpr) && !(/[a-zA-Z]/.test(inputExpr)))
                {
                    const infixExpression = postfixToInfix(inputExpr);
                    const infixResult = evaluateInfixExpression(infixExpression);
                    const postfixExpression = infixToPostfix2(infixExpression);
                    const postfixResult = evaluatePostfixExpression(postfixExpression);
                    console.log(`Infix expression: ${infixExpression}`);
                    console.log(`Infix result: ${infixResult}`);
                    console.log(`Restored Postfix expression: ${postfixExpression}`);
                    console.log(`Posrfix result: ${postfixResult}`);
                }
                else
                {
                    throw new Error(`Invalid expression [ ${  inputExpr } ] : operands must be of the same type`);
                }
            }
            catch (error)
            {
                console.log(error.message);
            }
            break;
        default:
            console.log(`Invalid mode: ${mode}`);
            console.log(`Allowed modes: ${allowedModes}`);
            process.exit(1);
    }
}
main();

/*
for test
// testCases(10);
// console.log(evaluateInfixExpression("7+3/5-1-(8-5)"));
// console.log(evaluatePostfixExpression("735/+1-85--"));
// console.log(postfixToInfix("735/+1-85--"));
// 735/+1-85-- 735/+1-85--
*/
