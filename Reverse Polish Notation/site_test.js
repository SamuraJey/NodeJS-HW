
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
    var i = 0,
        nextToken = function()
        {
            while (i < expr.length && expr[i] == ' ') i++;
            if (i == expr.length) return '';
            var b = '';
            while (i < expr.length && expr[i] != ' ' && expr[i] != '(' && expr[i] != ')' && !isOperator(expr[i])) b += expr[i++];
            if (b != '') return b;
            return expr[i++];
        };
    var S = [],
        O = [],
        tok;
    while ((tok = nextToken()) != '')
    {
        if (tok == '(') S.push(tok);
        else if (tok == ')')
        {
            while (S.length > 0 && S[S.length - 1] != '(') O.push(S.pop());
            if (S.length == 0) return 'Mismatched parenthesis.';
            S.pop();
        }
        else if (isOperator(tok))
        {
            while (S.length > 0 && isOperator(S[S.length - 1]) && ((leftAssoc(tok) && priority(tok) <= priority(S[S.length - 1])) || (!leftAssoc(tok) && priority(tok) < priority(S[S.length - 1])))) O.push(S.pop());
            S.push(tok);
        }
        else
        {
            O.push(tok);
        }
    }
    while (S.length > 0)
    {
        if (!isOperator(S[S.length - 1])) return 'Mismatched parenthesis.';
        O.push(S.pop());
    }
    if (O.length == 0) return 'Invalid expression.'
    var s = '';
    for (var i = 0; i < O.length; i++)
    {
        if (i != 0) s += ' ';
        s += O[i];
    }
    return s;
}

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
            if (typeof(x.r) != 'string' && (rightPriority(x.r.op) < rightPriority(x.op) || (x.r.op == x.op && (x.op == '-' || x.op == '/'))))
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