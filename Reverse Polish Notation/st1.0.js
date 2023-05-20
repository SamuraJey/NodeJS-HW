function infixToPostfix(expression) {
    const precedence = {
      '+': 1,
      '-': 1,
      '*': 2,
      '/': 2
    };
    const stack = [];
    let postfix = '';
  
    for (let i = 0; i < expression.length; i++) {
      const token = expression[i];
      if (!isNaN(token)) {
        postfix += token;
      } else if (token in precedence) {
        while (
          stack.length > 0 &&
          stack[stack.length - 1] !== '(' &&
          precedence[token] <= precedence[stack[stack.length - 1]]
        ) {
          postfix += stack.pop();
        }
        stack.push(token);
      } else if (token === '(') {
        stack.push(token);
      } else if (token === ')') {
        while (stack[stack.length - 1] !== '(') {
          postfix += stack.pop();
        }
        stack.pop();
      }
    }
  
    while (stack.length > 0) {
      postfix += stack.pop();
    }
  
    return postfix;
  }
  
  const expression = '1+2*4+3';
  const postfixExpression = infixToPostfix(expression);
  console.log(postfixExpression); // Output: "124*+3+"