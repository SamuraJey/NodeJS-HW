function infixToPostfix(expression)
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
                throw new Error("Invalid expression: operands must be of the same type");
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
                throw new Error("Invalid expression: operands must be of the same type");
            }
            postfix += token;
        }
        else if (token in precedence)
        {
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
            stack.push(token);
        }
        else if (token === ")")
        {
            while (stack.length > 0 && stack[stack.length - 1] !== "(")
            {
                postfix += stack.pop();
            }
            if (stack.length === 0)
            {
                throw new Error("Invalid expression: unbalanced brackets");
            }
            stack.pop(); // pop "("
        }
        else
        {
            throw new Error(`Invalid token: ${token}`);
        }
    }

    while (stack.length > 0)
    {
        const token = stack.pop();
        if (token === "(")
        {
            throw new Error("Invalid expression: unbalanced brackets");
        }
        postfix += token;
    }

    return postfix;
}
