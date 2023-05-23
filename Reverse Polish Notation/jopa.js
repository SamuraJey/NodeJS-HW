function infixToPostfix(expression)
{
    priorityMap = new Map([
        ['^', 3],
        ['*', 2],
        ['/', 2],
        ['+', 1],
        ['-', 1]
    ]);
    operators = new Set(['+', '-', '*', '/', '^']);
    let operandType = null; // Тип операнда для проверки на однотипность

    if (expression.length === 0) // Проверка на пустую строку
        throw new Error("Invalid expression: empty string");

    if (expression.length === 1) // Проверка на один символ
        throw new Error(`Invalid expression [ ${expression} ]: expression must contain at least two operands and one operator`);
    
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
    let index = 0;
    function nextToken() // tested works fine TODO ИЗБАВИТСЯ НАХЕР ОТ НЕЁЁ, НАДО ДЕЛАТЬ ВСЕ В ОДНОМ ЦИКЛЕ ВАЙЛ
    {
        while (index < expression.length && expression[index] == ' ')
        {
            index++;
        }
        if (index == expression.length)
        {
            return '';
        }
        let buffer = '';
        while (index < expression.length && expression[index] != ' ' && expression[index] != '(' && expression[index] != ')' && !operators.has(expression[index]))
        {
            buffer += expression[index++];
        }
        if (buffer != '')
        {
            return buffer;
        }
        return expression[index++];
    }
    //var S = [], O = [], tok;
    let stackOp = []; // works fine
    let output = [];
    let currentToken;
    while ((currentToken = nextToken()) != '')
    {
        if (operandType === null) // Проверка на тип операнда
        {
            if (!(currentToken == '(' || currentToken == ')'))
            {
                if (!isNaN(currentToken))
                {
                    operandType = 'number';
                }
                else if (/[a-zA-Z]/.test(currentToken))
                {
                    operandType = 'letter';
                }
                //operandType = typeof(currentToken);
                //console.log(`operandType ${operandType}\n`);
            }
        }
        else if (operandType !== null)
        {
            if (operandType === 'number' && isNaN(currentToken) && currentToken != " " && !(operators.has(currentToken)))
            {
                console.log(`operandType ${operandType}\n currentToken ${currentToken}\n`);
                throw new Error(`1Invalid expression [ ${expression} ]: operands must be of the same type`);
            }
            else if (operandType === 'letter' && !(/[a-zA-Z]/.test(currentToken)) && currentToken != " " && !(operators.has(currentToken)))
            {
                console.log(`operandType ${operandType}\n currentToken ${currentToken}\n`);
                throw new Error(`2Invalid expression [ ${expression} ]: operands must be of the same type`);
            }
        }
        if (currentToken == '(')
        {
            stackOp.push(currentToken);
        } // fine
        else if (currentToken == ')')
        {
            while (stackOp.length > 0 && stackOp[stackOp.length - 1] != '(') output.push(stackOp.pop());
            if (stackOp.length == 0) {return 'Mismatched parenthesis.';}
            stackOp.pop();
        }
        else if (operators.has(currentToken)) // opereators
        {
            // so !leftAssoc(tok) must be changed for tok == '^'
            while (stackOp.length > 0 &&
                operators.has(stackOp[stackOp.length - 1])
                //&& ((leftAssoc(tok) 
                &&
                (((currentToken != '^') // replaced leftAssoc(tok) with this works fine
                        &&
                        priorityMap.get(currentToken) <=
                        priorityMap.get(stackOp[stackOp.length - 1]))
                    //|| ((!leftAssoc(tok))
                    ||
                    ((currentToken == '^') // replaced !leftAssoc(tok) with this works fine
                        &&
                        priorityMap.get(currentToken) <
                        priorityMap.get(stackOp[stackOp.length - 1]))))
            {
                output.push(stackOp.pop());
            }
            stackOp.push(currentToken);
        }
        else
        {
            output.push(currentToken);
        }
    }
    while (stackOp.length > 0)
    {

        if (!(operators.has(stackOp[stackOp.length - 1])))
        {
            return 'Mismatched parenthesis.';
        }
        output.push(stackOp.pop());
    }
    if (output.length == 0)
    {
        return 'Invalid expression.';
    }
    let s = '';
    for (let i = 0; i < output.length; i++)
    {
        if (i != 0) s += ' ';
        s += output[i];
    }
    s = s.replace(/\s/g, '');
    return s;
}

// let ppp = "((2+2))";
// // console.log(ppp);
// console.log("Resssss " + infixToPostfix(ppp));

// console.log("Must be 684^7*1*3/-");

// return;
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
    //     const printExpression = function(node) // Получаем дерево
    // {
    //     if (typeof(node) == 'string')
    //     {
    //         return node;
    //     }
    //     let left = printExpression(node.left);
    //     let right = printExpression(node.right);
    //     if (typeof(node.left) != 'string' && (priorityMap.get(node.left.op) < priorityMap.get(node.op) || (node.left.op == node.op && node.op == '^')))
    //     {
    //         left = '(' + left + ')';
    //     }
    //     if (typeof(node.right) != 'string' && (rightPriorityMap.get(node.right.op) < rightPriorityMap.get(node.op) || (node.right.op == node.op && (node.op == '-' || node.op == '/'))))
    //     {
    //         right = '(' + right + ')';
    //     }
    //     return left + ' ' + node.op + ' ' + right;
    // };

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
        // fs.appendFileSync('stack_state_pref_to_inf.json', `State ${counter}: ${stackCopyStr} \n`, err =>
        // {
        //     if (err) throw err;
        //     //console.log('Состояние стека было успешно записано в файл!');
        // });
        counter++;
    }
    if (stack.length != 1) return 'Invalid expression.';
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
        let postfixExpression = infixToPostfix2(expression);
        let infixExpression = postfixToInfix(postfixExpression);
        infixExpression = infixExpression.replace(/\s+/g, '');
        postfixExpression = postfixExpression.replace(/\s+/g, '');
        let infixResult = evaluateInfixExpression(infixExpression);
        let postfixResult = evaluatePostfix(postfixExpression); //evaluatePostfixExpression

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

console.time("testCases");
testCases(1000);
console.timeEnd("testCases");



function infixToPostfix2(expression) {
    const priorityMap = new Map([
        ['^', 3],
        ['*', 2],
        ['/', 2],
        ['+', 1],
        ['-', 1]
    ]);
    const operators = new Set(['+', '-', '*', '/', '^']);
    let operandType = null; // Тип операнда для проверки на однотипность

    if (expression.length === 0) // Проверка на пустую строку
        throw new Error("Invalid expression: empty string");

    if (expression.length === 1) // Проверка на один символ
        throw new Error(`Invalid expression [ ${expression} ]: expression must contain at least two operands and one operator`);

    let spacedExpr = "";
    expression = expression.replace(/\s+/g, '');
    for (let i = 0; i < expression.length; i++) {
        spacedExpr += expression[i];
        if (i < expression.length - 1) {
            spacedExpr += " ";
        }
    }
    expression = spacedExpr;
    let stackOp = [];
    let output = [];
    let currentToken ="";
    let index = 0;
    while (index < expression.length) {
        let buffer = '';
        while (index < expression.length && expression[index] != ' ' && expression[index] != '(' && expression[index] != ')' && !operators.has(expression[index])) {
            buffer += expression[index++];
        }
        if (buffer != '') {
            currentToken = buffer;
        } else {
            currentToken = expression[index++];
            while (currentToken == ' ') {
                currentToken = expression[index++];
            }
        }
        if (currentToken == '(') {
            stackOp.push(currentToken);
        } else if (currentToken == ')') {
            while (stackOp.length > 0 && stackOp[stackOp.length - 1] != '(') output.push(stackOp.pop());
            if (stackOp.length == 0) {
                return 'Mismatched parenthesis.';
            }
            stackOp.pop();
        } else if (operators.has(currentToken))
        {
            while (stackOp.length > 0 &&
                operators.has(stackOp[stackOp.length - 1]) && (((currentToken != '^') && 
                priorityMap.get(currentToken) <= priorityMap.get(stackOp[stackOp.length - 1])) ||
                ((currentToken == '^') && priorityMap.get(currentToken) < priorityMap.get(stackOp[stackOp.length - 1]))))
            {
                output.push(stackOp.pop());
            }
            stackOp.push(currentToken);
        } else {
            output.push(currentToken);
        }
    }
    while (stackOp.length > 0) {
        if (!(operators.has(stackOp[stackOp.length - 1]))) {
            return 'Mismatched parenthesis.';
        }
        output.push(stackOp.pop());
    }
    if (output.length == 0) {
        return 'Invalid expression.';
    }
    let s = '';
    for (let i = 0; i < output.length; i++) {
        if (i != 0) s += ' ';
        s += output[i];
    }
    s = s.replace(/\s/g, '');
    return s;
}