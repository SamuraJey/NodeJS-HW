const fs = require('fs');

// function isOperator(c)
// {
//     return c == '+' || c == '-' || c == '*' || c == '/' || c == '^';
// }

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




function postfixToInfix5(expression)
{

    const operators = new Set(['+', '-', '*', '/', '^']);
    // const priorityMap = new Map([
    //     ['^', 3],   
    //     ['*', 2],    
    //     ['/', 2],
    //     ['+', 1],
    //     ['-', 1]

    //  ]);

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
    for (let i = 0; i < expr.length; i++)
    {
        spacedExpr += expr[i];
        if (i < expr.length - 1)
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
        if (typeof(node.left) != 'string' && (priority(node.left.op) < priority(node.op) || (node.left.op == node.op && node.op == '^')))
            {
                left = '(' + left + ')';
            }
        if (typeof(node.right) != 'string' && (rightPriority(node.right.op) < rightPriority(node.op) || (node.left.op == node.op && (node.op == '-' || node.op == '/'))))
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
    fs.appendFileSync('stack_state.json', `State ${counter}: ${stackCopyStr} \n`, err => {
        if (err) throw err;
        //console.log('Состояние стека было успешно записано в файл!');
    });
    counter++;
    }
    if (stack.length != 1) return 'Invalid expression.';
    return printExpression(stack.pop()).replace(/\s/g, '');
}

let expr = "735/+1-85--";
console.log(postfixToInfix5(expr));


// var result = postfixToInfix("7 3 5 / + 1 - 8 5 - -");
// console.log(result);

// console.log(infixToPostfix("7+3/5-1-(8-5)"));


// function infixToPostfix(expr) {
//     var i = 0,
//         nextToken = function () {
//             while (i < expr.length && expr[i] == ' ') i++;
//             if (i == expr.length) return '';
//             var b = '';
//             while (i < expr.length && expr[i] != ' ' && expr[i] != '(' && expr[i] != ')' && !isOperator(expr[i])) b += expr[i++];
//             if (b != '') return b;
//             return expr[i++];
//         };
//     var S = [],
//         O = [],
//         tok;
//     while ((tok = nextToken()) != '') {
//         if (tok == '(') S.push(tok);
//         else if (tok == ')') {
//             while (S.length > 0 && S[S.length - 1] != '(') O.push(S.pop());
//             if (S.length == 0) return 'Mismatched parenthesis.';
//             S.pop();
//         }
//         else if (isOperator(tok)) {
//             while (S.length > 0 && isOperator(S[S.length - 1]) && ((leftAssoc(tok) && priority(tok) <= priority(S[S.length - 1])) || (!leftAssoc(tok) && priority(tok) < priority(S[S.length - 1])))) O.push(S.pop());
//             S.push(tok);
//         }
//         else {
//             O.push(tok);
//         }
//     }
//     while (S.length > 0) {
//         if (!isOperator(S[S.length - 1])) return 'Mismatched parenthesis.';
//         O.push(S.pop());
//     }
//     if (O.length == 0) return 'Invalid expression.'
//     var s = '';
//     for (var i = 0; i < O.length; i++) {
//         if (i != 0) s += ' ';
//         s += O[i];
//     }
//     return s;
// }

// function postfixToInfix(expr)
// {
//     var i = 0,
//         nextToken = function()
//         {
//             while (i < expr.length && expr[i] == ' ') i++;
//             if (i == expr.length) return '';
//             var b = '';
//             while (i < expr.length && expr[i] != ' ') b += expr[i++];
//             return b;
//         },
//         print = function(x)
//         {
//             if (typeof(x) == 'string') return x;
//             var l = print(x.l),
//                 r = print(x.r);
//             if (typeof(x.l) != 'string' && (priority(x.l.op) < priority(x.op) || (x.l.op == x.op && x.op == '^')))
//                 l = '(' + l + ')';
//             if (typeof(x.r) != 'string' && (rightPriority(x.r.op) < rightPriority(x.op) || (x.l.op == x.op && (x.op == '-' || x.op == '/'))))
//                 r = '(' + r + ')';
//             return l + ' ' + x.op + ' ' + r;
//         };
//     var S = [],
//         tok;
//     while ((tok = nextToken(expr)) != '')
//     {
//         if (isOperator(tok))
//         {
//             if (S.length < 2) return 'Invalid expression.';
//             S.push(
//             {
//                 op: tok,
//                 r: S.pop(),
//                 l: S.pop()
//             });
//         }
//         else
//         {
//             S.push(tok);
//         }
//     }
//     if (S.length != 1) return 'Invalid expression.';
//     return print(S.pop());
// }