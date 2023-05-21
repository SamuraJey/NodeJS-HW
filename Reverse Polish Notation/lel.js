function evaluateInfixExpression(expression)
{
    const precedence = {
        "+": 1,
        "-": 1,
        "*": 2,
        "/": 2,
        "^": 3
    };

    const stack = [];

    // Split expression into tokens
    const tokens = expression.split(/(\d+|+|-|*|/ | ^ | ( | )) / g);

for (let i = 0; i < tokens.length; i++)
{
    const token = tokens[i];
    if (!isNaN(token))
    {
        // Operand, push to stack
        stack.push(parseFloat(token));
    }
    else if (token === "+" || token === "-" ||
        token === "*" || token === "/" || token === "^")
    {
        // Operator, apply based on precedence
        while (stack.length > 1 &&
            precedence[token] <= precedence[stack[stack.length - 1]])
        {
            let right = stack.pop();
            let left = stack.pop();

            if (token === "+")
            {
                stack.push(left + right);
            }
            else if (token === "-")
            {
                stack.push(left - right);
            }
            else if (token === "*")
            {
                stack.push(left * right);
            }
            else if (token === "/")
            {
                stack.push(left / right);
            }
            else if (token === "^")
            {
                stack.push(Math.pow(left, right));
            }
        }
        stack.push(token);
    }
    else if (token === "(")
    {
        stack.push(token);
    }
    else if (token === ")")
    {
        // Pop until (
        while (stack[stack.length - 1] !== "(")
        {
            let right = stack.pop();
            let left = stack.pop();
            ...
        }
        stack.pop(); // Pop (    
    }
}

// Apply remaining operators
while (stack.length > 1)
{
    let right = stack.pop();
    let left = stack.pop();

}
return stack[0];
}
