function infixToPostfix(expression) {
  const precedence = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
    "^": 3,
  };
  const stack = [];
  let postfix = "";

  // Проверка на соответствие правилам
  let openingBrackets = expression.split('(').length - 1;
  let closingBrackets = expression.split(')').length - 1;

  if (openingBrackets !== closingBrackets) {
    throw new Error("Invalid expression: unbalanced brackets");
  }

  if (/^[^\d(]/.test(expression) || /[^\d)]$/.test(expression)) {
    throw new Error("Invalid expression: expression must start and end with an operand or closing bracket");
  }

  let hasOperand = false;
  for (let i = 0; i < expression.length; i++) {
    const token = expression[i];
    if (!isNaN(token)) {
      postfix += token;
      hasOperand = true;
    } else if (token in precedence) {
      while (
        stack.length > 0 &&
        stack[stack.length - 1] !== "(" &&
        (precedence[token] < precedence[// Продолжение исправленного примера функции

          stack[stack.length - 1]]) ||
        (precedence[token] === precedence[stack[stack.length - 1]] && token === "^")) {
        postfix += stack.pop();
      }
      stack.push(token);
    } else if (token === "(") {
      stack.push(token);
    } else if (token === ")") {
      while (stack.length > 0 && stack[stack.length - 1] !== "(") {
        postfix += stack.pop();
      }
      if (stack.length === 0) {
        console.log("Invalid expression: unbalanced brackets");
        return "Invalid expression: unbalanced brackets";
        throw new Error("Invalid expression: unbalanced brackets");
      }
      stack.pop(); // pop "("
    } else {
      console.log(`Invalid token: ${token}`);
      return `Invalid token: ${token}`;
      throw new Error(`Invalid token: ${token}`);
    }
  }

  if (stack.length > 0) {
    while (stack.length > 0) {
      if (stack[stack.length - 1] === "(") {
        console.log("Invalid expression: unbalanced brackets");
        return "Invalid expression: unbalanced brackets";
        throw new Error("Invalid expression: unbalanced brackets");
      }
      postfix += stack.pop();
    }
  } else if (!hasOperand) {
    console.log("Invalid expression: no operands in the expression");
    return "Invalid expression: no operands in the expression";
    throw new Error("Invalid expression: no operands in the expression");
  }

  return postfix;
}

function evaluatePostfixExpression(expression) {

  const stack = [];
  const operators = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
    "^": (a, b) => Math.pow(a, b),
  };

  for (let i = 0; i < expression.length; i++) {
    const token = expression[i];
    if (!isNaN(token)) {
      stack.push(parseFloat(token));
    } else if (token in operators) {
      const [b, a] = [stack.pop(), stack.pop()];
      stack.push(operators[token](a, b));
    }
  }

  return stack.pop();
}

const expression = "1+1*2^5-1"; // 12+4*3+
const postfixExpression = infixToPostfix(expression);
console.log(postfixExpression); // Output: "12+4*3+"
const result = evaluatePostfixExpression(postfixExpression);
console.log(result);

function postfixToInfix(expression) {
  let stack = [];
  let operators = new Set(['+', '-', '*', '/', '^']);

  for (let char of expression) {
    if (!operators.has(char)) {
      stack.push(char);
    } else {
      let operand1 = stack.pop();
      let operand2 = stack.pop();
      stack.push(`(${operand2}${char}${operand1})`);
    }
  }

  let infixExpression = stack[0];
  let openingBrackets = infixExpression.split('(').length - 1;
  let closingBrackets = infixExpression.split(')').length - 1;

  if (openingBrackets === closingBrackets) {
    infixExpression = infixExpression.slice(1, -1);
  }

  return infixExpression;
}

let infixExpression = postfixToInfix(postfixExpression);
console.log(infixExpression);  // выведет 2+3


