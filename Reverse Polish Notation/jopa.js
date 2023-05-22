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

// function rightPriority(c)
// {
//     if (c == '+') return 1;
//     if (c == '-') return 2;
//     if (c == '*') return 3;
//     if (c == '/') return 4;
//     if (c == '^') return 5;
//     return 0;
// }

function infixToPostfix(expr)
{
    priorityMap = new Map([
        ['^', 3],
        ['*', 2],
        ['/', 2],
        ['+', 1],
        ['-', 1]
    ]);
    operators = new Set(['+', '-', '*', '/', '^']);
    let spacedExpr = "";
    expr = expr.replace(/\s+/g, '');
    for (let i = 0; i < expr.length; i++)
    {
        spacedExpr += expr[i];
        if (i < expr.length - 1)
        {
            spacedExpr += " ";
        }
    }
    expr = spacedExpr;
    let i = 0;
    // const nextToken = function()
    //     {
    //         while (i < expr.length && expr[i] == ' ') i++;
    //         if (i == expr.length) return '';
    //         var b = '';
    //         while (i < expr.length && expr[i] != ' ' && expr[i] != '(' && expr[i] != ')' && !isOperator(expr[i])) b += expr[i++];
    //         if (b != '') return b;
    //         return expr[i++];
    //     };
    function nextToken() // tested works fine
    {
        while (i < expr.length && expr[i] == ' ') {i++;}
        if (i == expr.length) {return '';}
        let b = '';
        while (i < expr.length && expr[i] != ' ' && expr[i] != '(' && expr[i] != ')' && !operators.has(expr[i])) {b += expr[i++];}
        if (b != '') {return b;}
        return expr[i++];
    }
    //var S = [], O = [], tok;
    let S = []; // works fine
    let O = [];
    let tok;
    while ((tok = nextToken()) != '')
    {
        if (tok == '(') {S.push(tok);} // fine
        else if (tok == ')')
        {
            while (S.length > 0 && S[S.length - 1] != '(') O.push(S.pop());
            if (S.length == 0) return 'Mismatched parenthesis.';
            S.pop();
        }
        else if (operators.has(tok)) // opereators
        {
            //console.log(`isOperator ${isOperator(tok)}\noperators.has(tok) ${opereators.has(tok)}\n`);
            // need to repalce leftAssoc(tok) with something else like 
            //            while (S.length > 0 && operators.has(S[S.length - 1]) && ((leftAssoc(tok) && priority(tok) <= priority(S[S.length - 1])) || (!leftAssoc(tok) && priority(tok) < priority(S[S.length - 1])))) O.push(S.pop());
            // console.log(`!leftAssoc(tok) ${!leftAssoc(tok)}\n(tok != '^') ${tok != '^' ? false : true}\n`);
            // if (!leftAssoc(tok) != (tok == '^'))
            // {
            //     console.log(tok);
            // }
            // so !leftAssoc(tok) must be changed for tok == '^'
            while (S.length > 0 
                && operators.has(S[S.length - 1]) 
                //&& ((leftAssoc(tok) 
                && (((tok != '^') // replaced leftAssoc(tok) with this works fine
                && priorityMap.get(tok) 
                <= priorityMap.get(S[S.length - 1])) 
                //|| ((!leftAssoc(tok))
                || ((tok == '^') // replaced !leftAssoc(tok) with this works fine
                && priorityMap.get(tok) 
                < priorityMap.get(S[S.length - 1])))) {O.push(S.pop());}
            S.push(tok);
        }
        else
        {
            O.push(tok);
        }
    }
    while (S.length > 0)
    {
        //need to replace !isOperator(S[S.length - 1]) with operators.has(S[S.length - 1])
        // if ((!(isOperator(S[S.length - 1]) == !(operators.has(S[S.length - 1])))))
        // {
        //     console.log(S[S.length - 1]);
        // }
        if(!(operators.has(S[S.length - 1]))) {return 'Mismatched parenthesis.';}
        //!(operators.has(S[S.length - 1]))
        //if (!isOperator(S[S.length - 1])) return 'Mismatched parenthesis.';
        O.push(S.pop());
    }
    if (O.length == 0) {return 'Invalid expression.';}
    let s = '';
    for (let i = 0; i < O.length; i++)
    {
        if (i != 0) s += ' ';
        s += O[i];
    }
    s = s.replace(/\s/g, '');
    return s;
}

let ppp = "6-8^4*7*1/3";
console.log(ppp);
console.log("Resssss " + infixToPostfix(ppp));
console.log("Must be 684^7*1*3/-");









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




// Javascript program to evaluate value of a postfix expression
// Method to evaluate value of a postfix expression
function evaluatePostfix(exp)
{
	//create a stack
		let stack=[];
		
		// Scan all characters one by one
		for(let i=0;i<exp.length;i++)
		{
			let c=exp[i];
			
			// If the scanned character is an operand (number here),
			// push it to the stack.
			if(! isNaN( parseInt(c) ))
			stack.push(c.charCodeAt(0) - '0'.charCodeAt(0));
			
			// If the scanned character is an operator, pop two
			// elements from stack apply the operator
			else
			{
				let val1 = stack.pop();
				let val2 = stack.pop();
				
				switch(c)
				{
					case '+':
					stack.push(val2+val1);
					break;
					
					case '-':
					stack.push(val2- val1);
					break;
					
					case '/':
					stack.push(val2/val1);
					break;
					
					case '*':
					stack.push(val2*val1);
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
        while (i < expression.length && expression[i] == ' ') {
            i++;}
        if (i == expression.length) {return '';}
        let token = '';
        while (i < expression.length && expression[i] != ' ') {token += expression[i++];}
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
        let postfixExpression = infixToPostfix(expression);
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

testCases(1000);