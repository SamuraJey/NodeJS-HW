function isOperator(c)
{
    return c == '+' || c == '-' || c == '*' || c == '/' || c == '^';
}

function leftAssoc(c)
{
    return c != '^';
}

function priority(c)
{
    if (c == '^') return 3;
    if (c == '*') return 2;
    if (c == '/') return 2;
    if (c == '+') return 1;
    if (c == '-') return 1;
    return 0;
}

function rightPriority(c)
{
    if (c == '+') return 1;
    if (c == '-') return 2;
    if (c == '*') return 3;
    if (c == '/') return 4;
    if (c == '^') return 5;
    return 0;
}

function infixToPostfix(expr)
{

    const operators = new Set(['+', '-', '*', '/', '^']);
    const priorityMap = new Map([
        ['-', 1],
        ['+', 1],
        ['/', 2],
        ['*', 2],
        ['^', 3]
    ]);

    let index = 0;

    //delete all spaces from expr
    expr = expr.replace(/\s+/g, '');
    //add spaces between operators and operands
    let spacedExpr = "";
    for (let i = 0; i < expr.length; i++)
    {
        spacedExpr += expr[i];
        if (i < expr.length - 1)
        {
            spacedExpr += " ";
        }
    }
    expr = spacedExpr; 

    function nextToken()
    {
        while (index < expr.length && expr[index] == ' ')
        {
            index++;
        }
        if (index == expr.length)
        {
            return '';
        }
        let buffer = '';
        while (index < expr.length && expr[index] != ' ' && expr[index] != '(' && expr[index] != ')' && !operators.has(expr[index]))
        {
            buffer += expr[index++];
        }
        if (buffer != '')
        {
            return buffer;
        }
        return expr[index++];
    }

    const stack_op = [];
    const output = [];
    let token;

    while ((token = nextToken()) !== '')
    {
        if (token === '(')
        {
            stack_op.push(token);
        }
        else if (token === ')')
        {
            while (stack_op.length > 0 && stack_op[stack_op.length - 1] !== '(')
            {
                output.push(stack_op.pop());
            }
            if (stack_op.length === 0)
            {
                return 'Mismatched parenthesis.';
            }
            stack_op.pop();
        }
        else if (operators.has(token))
        {
            while (
                stack_op.length > 0 && stack_op[stack_op.length - 1] in operators &&
                ((token == "^" && priorityMap.get(token) <= priorityMap.get(stack_op[stack_op.length - 1]))) ||
                (token != "^" && priorityMap.get(token) < priorityMap.get(stack_op[stack_op.length - 1])))
            {
                output.push(stack_op.pop());
            }
            stack_op.push(token);
        }
        else
        {
            output.push(token);
        }
    }

    while (stack_op.length > 0)
    {
        if (!operators.has(stack_op[stack_op.length - 1]))
        {
            return 'Mismatched parenthesis.';
        }
        output.push(stack_op.pop());
    }

    if (output.length === 0)
    {
        return 'Invalid expression.';
    }

    let result = '';
    for (let i = 0; i < output.length; i++)
    {
        if (i !== 0)
        {
            result += ' ';
        }
        result += output[i];
    }
    result = result.replace(/\s+/g, '');
    return result;
}

console.log(infixToPostfix("2 + 2 ( 6 - 3 ) ^ 7")) // TODO сделать проверку что оператооров на 1 меньше чем операндов

function infixToPostfix2(expression) // Функция перевода инфиксной записи в постфиксную
{
    const precedence = { // Приоритеты операторов
        "(": 0, // "(" - самый низкий приоритет
        ")": 1, // ")" - самый низкий приоритет
        "+": 2,
        "-": 2,
        "*": 3,
        "/": 3,
        "^": 4,
    };

    const stack = []; // Стек операторов
    let postfix = ""; // Постфиксная запись, сюда записываем результат
    let operandType = null; // Тип операнда для проверки на однотипность
    let counter = 1; // Счетчик для записи состояния постфикса в файл

    if (expression.length === 0) // Проверка на пустую строку
        throw new Error("Invalid expression: empty string");

    if (expression.length === 1) // Проверка на один символ
        throw new Error(`Invalid expression [ ${expression} ]: expression must contain at least two operands and one operator`);

    for (let i = 0; i < expression.length; i++) // Проход по всему выражению
    {
        const token = expression[i]; // Текущий символ
        if (!isNaN(token)) // Проверка что текущий символ число
        {
            if (operandType === null) // Проверка что тип операнда не задан
            {
                operandType = "number"; // Задаем тип операнда
            }
            else if (operandType !== "number") // Проверка что тип операнда совпадает с предыдущим
            {
                throw new Error(`Invalid expression [ ${expression} ] : operands must be of the same type`);
            }
            if (i < expression.length - 1 && !isNaN(expression[i + 1])) // Проверка что следующий символ число
            {
                throw new Error(`Invalid expression [ ${expression} ] : multiple operands`);
            }
            postfix += token; // Добавляем число в постфиксную запись если прошло все проверки
        }
        else if (/[a-zA-Z]/.test(token)) // Проверка что текущий символ буква
        {
            if (operandType === null) // Проверка что тип операнда не задан
            {
                operandType = "letter";
            }
            else if (operandType !== "letter") // Проверка что тип операнда совпадает с предыдущим
            {

                throw new Error(`Invalid expression [ ${expression} ] : operands must be of the same type`);
            }
            if (i < expression.length - 1 && /[a-zA-Z]/.test(expression[i + 1])) // Проверка что следующий символ буква
            {
                throw new Error(`Invalid expression [ ${expression} ] : multiple operands`);
            }
            postfix += token; // Добавляем букву в постфиксную запись если прошло все проверки
        }
        else if (token in precedence) // Проверка что текущий символ оператор
        {
            if (i === 0 || i === expression.length - 1 && precedence[expression[i]] > 1) // Проверка что оператор не первый или последний символ
            {
                throw new Error(`Invalid expression [ ${expression} ] : missing operands`);
            }
            if (expression[i - 1] in precedence && expression[i] in precedence && precedence[expression[i]] > 1) // Проверка что и после оператора не оператор
            {
                throw new Error(`Invalid expression [ ${expression} ] : multiple operators`);
            }
            while (
                stack.length > 0 &&
                //stack[stack.length - 1] !== "(" &&
                precedence[token] <= precedence[stack[stack.length - 1]]
            ) // Проверка что стек не пустой и последний символ в стеке не "(" и приоритет текущего оператора меньше или равен приоритету последнего символа в стеке
            {
                postfix += stack.pop(); // Добавляем последний символ в стеке в постфиксную запись
            }
            stack.push(token); // Добавляем текущий оператор в стек
        }
        else if (token === "(") // Проверка что текущий символ "("
        {
            if (i < expression.length - 1 && expression[i + 1] === ")") // Проверка если следующий символ ")" то выражение в скобках пустое это ошибка
            {
                throw new Error(`Invalid expression [ ${expression} ] : empty brackets`);
            }
            stack.push(token); // Добавляем "(" в стек если прошло все проверки
        }
        else if (token === ")") // Проверка что текущий символ ")"
        {
            if (stack.length === 0 || stack[stack.length - 1] === "(") // Проверка что стек не пустой и последний символ в стеке не "("
            {
                throw new Error(`Invalid expression [ ${expression} ] : empty brackets or missing operands`);
            }
            while (stack.length > 0 && stack[stack.length - 1] !== "(") // Цикл пока стек не пустой и последний символ в стеке не "("
            {
                postfix += stack.pop(); // Добавляем последний символ в стеке в постфиксную запись
            }
            if (stack.length === 0) // Проверка что стек не пустой, если пустой то ошибочное выражение
            {
                throw new Error(`Invalid expression [ ${expression} ] : unbalanced brackets`);
            }
            stack.pop(); // Удаляем "(" из стека
        }
        else // Если текущий символ не число, не буква, не оператор, не "(" и не ")" то это ошибка
        {
            throw new Error(`Invalid token: ${token}`);
        }
        const stackCopyStr = JSON.stringify(stack);
        // Запись состояния постфикса в файл
        // fs.appendFileSync('stack_state_inf_to_pref.json', `State ${counter}: ${postfix} \n`, err =>
        // {
        //     if (err) throw err;

        // });
        counter++;
    }

    if (stack.length === 1 && stack[0] === "(") // Проверка что стек не пустой и последний символ в стеке не "("
    {
        throw new Error(`Invalid expression [ ${expression} ]: missing operands`);
    }

    while (stack.length > 0) // Цикл пока стек не пустой
    {
        const token = stack.pop(); // Берём последний символ в стеке
        if (token === "(" && false) // Если последний символ в стеке "(" то это ошибка
        {
            console.log(stack);
            throw new Error(`Invalid expression [ ${expression} ] : unbalanced brackets`);
        }
        postfix += token; // Добавляем последний символ в стеке в постфиксную запись
        // fs.appendFileSync('stack_state_inf_to_pref.json', `State ${counter}: ${postfix} \n`, err =>
        // {
        //     if (err) throw err;
        // }); // Запись состояния постфикса в файл
    }

    return postfix;
}


function testCases(num)
{
    for (let i = 0; i < num; i++)
    {
        const expression = generateRandomExpression();
        const postfixExpression = infixToPostfix(expression);
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

testCases(1000);

function postfixToInfix(expr)
{
    var i = 0,
        nextToken = function()
        {
            while (i < expr.length && expr[i] == ' ') i++;
            if (i == expr.length) return '';
            var b = '';
            while (i < expr.length && expr[i] != ' ') b += expr[i++];
            return b;
        },
        print = function(x)
        {
            if (typeof(x) == 'string') return x;
            var l = print(x.l),
                r = print(x.r);
            if (typeof(x.l) != 'string' && (priority(x.l.op) < priority(x.op) || (x.l.op == x.op && x.op == '^')))
                l = '(' + l + ')';
            if (typeof(x.r) != 'string' && (rightPriority(x.r.op) < rightPriority(x.op) || (x.l.op == x.op && (x.op == '-' || x.op == '/'))))
                r = '(' + r + ')';
            return l + ' ' + x.op + ' ' + r;
        };
    var S = [],
        tok;
    while ((tok = nextToken(expr)) != '')
    {
        if (isOperator(tok))
        {
            if (S.length < 2) return 'Invalid expression.';
            S.push(
            {
                op: tok,
                r: S.pop(),
                l: S.pop()
            });
        }
        else
        {
            S.push(tok);
        }
    }
    if (S.length != 1) return 'Invalid expression.';
    return print(S.pop());
}


function evaluateInfixExpression(expression)
{
    console.log("evaluateInfixExpression " + expression);
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
    const operators = ["+", "-", "*", "/", "^" ];
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

