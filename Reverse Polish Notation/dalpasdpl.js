const fs = require('fs');

function infixToPostfix(expression)
{
    const priorityMap = new Map([
        ['^', 3],
        ['*', 2],
        ['/', 2],
        ['+', 1],
        ['-', 1]
    ]);
    const operators = new Set(['+', '-', '*', '/', '^']);
    let operandType = null; // Тип операнда для проверки на однотипность
    let lastToken = null; // последний обработанный токен

    if (expression.length === 0) // Проверка на пустую строку
        throw new Error("Error Invalid expression: empty string");

    if (expression.length === 1) // Проверка на один символ
        throw new Error(`Error Invalid expression [ ${expression} ]: expression must contain at least two operands and one operator`);

    let hasNumbers = /[a-zA-Z]/.test(expression);
    let hasChars = /[0-9]/.test(expression);
    if (hasNumbers && hasChars) // Проверка на наличие букв и цифр
    {
        console.log("Error Invalid expression: expression cannot contain letters and numbers at the same time");
        throw new Error(`Error Invalid expression [ ${expression} ]: expression cannot contain letters and numbers at the same time`);
    }

    let stack1 = [];
    for (let i = 0; i < expression.length; i++)
    {
        if (expression[i] === "(")
        {
            stack1.push("(");
        }
        else if (expression[i] === ")")
        {
            if (stack1.length === 0)
            {
                console.log("Error Invalid expression: closing bracket without opening bracket");
                throw new Error(`Error Invalid expression [ ${expression} ]: closing bracket without opening bracket`);
                break;
            }
            else
            {
                stack1.pop();
            }
        }
    }
    if (stack1.length !== 0)
    {
        console.log("Error Invalid expression: opening bracket without closing bracket");
        throw new Error(`Error Invalid expression [ ${expression} ]: opening bracket without closing bracket`);
    }

    let spacedExpr = "";
    expression = expression.replace(/\s+/g, '');
    for (let i = 0; i < expression.length; i++)
    {
        spacedExpr += expression[i];
        if (i < expression.length - 1)
        {
            spacedExpr += " ";
        }
    }
    expression = spacedExpr;

    let stackOp = []; // works fine
    let output = [];
    let currentToken = "";
    let index = 0;
    while (index < expression.length)
    {
        let buffer = '';
        while (index < expression.length && expression[index] != ' ' && expression[index] != '(' && expression[index] != ')' && !operators.has(expression[index]))
        {
            buffer += expression[index++];
        }
        if (buffer != '')
        {
            currentToken = buffer;
        }
        else
        {
            currentToken = expression[index++];
            while (currentToken == ' ')
            {
                currentToken = expression[index++];
            }
        }

        if (lastToken !== null) // Проверка на недопустимые последовательности
        {
            if (lastToken === '(' && operators.has(currentToken))
            {
                throw new Error(`Error Invalid expression [ ${expression} ]: expression cannot start with an operator after an opening bracket`);
            }
            else if (lastToken === ')' && !operators.has(currentToken) && currentToken != ')')
            {
                throw new Error(`Error Invalid expression [ ${expression} ]: expression cannot start with an operand after a closing bracket`);
            }
            else if (operators.has(lastToken) && operators.has(currentToken))
            {
                throw new Error(`Error Invalid expression [ ${expression} ]: expression cannot have two operators in a row`);
            }
            else if (lastToken === '(' && currentToken === ')')
            {
                throw new Error(`Error Invalid expression [ ${expression} ]: expression cannot have empty brackets`);
            }
            // ЕСЛИ открывающая скобка, а перед ней не оператор, то ошибка
            else if (currentToken === '(' && !(operators.has(lastToken)) && lastToken != " " && currentToken != " " && lastToken != '(' && lastToken != ')' && lastToken != '')
            {
                throw new Error(`Error Invalid expression [ ${expression} ]: WHO cannot have two operands in a row`);
            }
            else if (!(isNaN(lastToken)) && !(isNaN(currentToken)) && lastToken != " " && currentToken != " ")
            {
                throw new Error(`Error Invalid expression [ ${expression} ]: expression cannot have two operands in a row`);
            }
        }
        if (currentToken === '(')
        {
            stackOp.push(currentToken);
        }
        else if (currentToken === ')')
        {
            while (stackOp[stackOp.length - 1] !== '(')
            {
                output.push(stackOp.pop());
            }
            stackOp.pop();
        }
        else if (operators.has(currentToken))
        {
            while (stackOp.length > 0 && priorityMap.get(stackOp[stackOp.length - 1]) >= priorityMap.get(currentToken))
            {
                output.push(stackOp.pop());
            }
            stackOp.push(currentToken);
        }
        else
        {
            output.push(currentToken);
        }
        lastToken = currentToken; // Обновление последнего обработанного токена
    }
    while (stackOp.length > 0)
    {
        if (stackOp[stackOp.length - 1] === '(' || stackOp[stackOp.length - 1] === ')')
            throw new Error(`Error Invalid expression [ ${expression} ]: expression cannot end with a bracket`);
        output.push(stackOp.pop());
    }

    return output.join('');
}

// ЕСЛИ открывающая скобка, а перед ней не оператор, то ошибка

































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
            throw new Error(`Error Invalid character: ${token}`);
        }
    }
    return stack[0];
}

function generateRandomExpression()
{
    const maxDepth = 3; // Maximum recursion depth
    const maxOperands = 2; // Maximum number of operands per sub-expression
    const operators = ["+", "-", "*", "/", "^"];
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

// Javascript program to evaluate value of a postfix expression
// Method to evaluate value of a postfix expression
function evaluatePostfix(exp)
{
    //create a stack
    let stack = [];

    // Scan all characters one by one
    for (let i = 0; i < exp.length; i++)
    {
        let c = exp[i];

        // If the scanned character is an operand (number here),
        // push it to the stack.
        if (!isNaN(parseInt(c)))
            stack.push(c.charCodeAt(0) - '0'.charCodeAt(0));

        // If the scanned character is an operator, pop two
        // elements from stack apply the operator
        else
        {
            let val1 = stack.pop();
            let val2 = stack.pop();

            switch (c)
            {
                case '+':
                    stack.push(val2 + val1);
                    break;

                case '-':
                    stack.push(val2 - val1);
                    break;

                case '/':
                    stack.push(val2 / val1);
                    break;

                case '*':
                    stack.push(val2 * val1);
                    break;
                case '^':
                    stack.push(Math.pow(val2, val1));
                    break;
            }
        }
    }
    return stack.pop();
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
    expression = expression.replace(/\s+/g, '');
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
        while (i < expression.length && expression[i] == ' ')
        {
            i++;
        }
        if (i == expression.length)
        {
            return '';
        }
        let token = '';
        while (i < expression.length && expression[i] != ' ')
        {
            token += expression[i++];
        }
        return token;
    };

    function printExpression(node)
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
        if (typeof(node.right) != 'string' && (rightPriorityMap.get(node.right.op) < rightPriorityMap.get(node.op) || (node.right.op == node.op && (node.op == '-' || node.op == '/'))))
        {
            right = '(' + right + ')';
        }
        return left + ' ' + node.op + ' ' + right;
    }

    const stack = [];
    let token;
    let counter = 1;
    while ((token = nextToken(expression)) != '') // 7+3/5-1-(8-5)
    {
        //if (isOperator(token))
        if (operators.has(token))
        {
            if (stack.length < 2) return 'Error Invalid expression.';
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
    if (stack.length != 1) return 'Error Invalid expression.';
    return printExpression(stack.pop()).replace(/\s/g, '');
}

function evaluateInfixExpression(expression)
{
    console.log("evaluateInfixExpression " + expression);
    expression = expression.replace(/\^/g, "**");
    return eval(expression);
}

function testCases(num)
{
    for (let i = 0; i < num; i++)
    {
        let expression = generateRandomExpression();
        let postfixExpression = infixToPostfix(expression);
        let infixExpression = postfixToInfix(postfixExpression);
        infixExpression = infixExpression.replace(/\s+/g, '');
        postfixExpression = postfixExpression.replace(/\s+/g, '');
        let infixResult = evaluateInfixExpression(infixExpression);
        let postfixResult = evaluatePostfix(postfixExpression); //evaluatePostfixExpression

        console.log(`Test case ${i + 1}:`);
        console.log(`Orig Expression: ${expression}\nPost Expression2: ${postfixExpression}\nRecovExpression3: ${infixExpression}`);
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
                    const postfixExpression = infixToPostfix(inputExpr);
                    const infixExpression = postfixToInfix(postfixExpression);
                    console.log(`Postfix expression: ${postfixExpression}`);
                    console.log(`Restored Infix expression: ${infixExpression}`);
                }
                else if (/[0-9]/.test(inputExpr) && !(/[a-zA-Z]/.test(inputExpr)))
                {
                    const postfixExpression = infixToPostfix(inputExpr);
                    const postfixResult = evaluatePostfix(postfixExpression);
                    const infixExpression = postfixToInfix(postfixExpression);
                    const infixResult = evaluateInfixExpression(infixExpression);
                    console.log(`Postfix expression: ${postfixExpression}`);
                    console.log(`Postfix result: ${postfixResult}`);
                    console.log(`Restored Infix expression: ${infixExpression}`);
                    console.log(`Infix result: ${infixResult}`);
                }
                else
                {
                    throw new Error(`Error Invalid expression [ ${  inputExpr } ]`);
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
                    const postfixExpression = infixToPostfix(infixExpression);
                    console.log(`Infix expression: ${infixExpression}`);
                    console.log(`Restored Postfix expression: ${postfixExpression}`);
                }
                else if (/[0-9]/.test(inputExpr) && !(/[a-zA-Z]/.test(inputExpr)))
                {
                    const infixExpression = postfixToInfix(inputExpr);
                    const infixResult = evaluateInfixExpression(infixExpression);
                    const postfixExpression = infixToPostfix(infixExpression);
                    const postfixResult = evaluatePostfixExpression(postfixExpression);
                    console.log(`Infix expression: ${infixExpression}`);
                    console.log(`Infix result: ${infixResult}`);
                    console.log(`Restored Postfix expression: ${postfixExpression}`);
                    console.log(`Posrfix result: ${postfixResult}`);
                }
                else
                {
                    throw new Error(`Error Invalid expression [ ${  inputExpr } ] : operands must be of the same type`);
                }
            }
            catch (error)
            {
                console.log(error.message);
            }
            break;
        default:
            console.log(`Error Invalid mode: ${mode}`);
            console.log(`Allowed modes: ${allowedModes}`);
            process.exit(1);
    }
}
main();