function isPrime(number) {
    if (number < 2) {
      return false;
    }
    for (let i = 2; i <= Math.sqrt(number); i++) {
      if (number % i === 0) {
        return false;
      }
    }
    return true;
  }
  
  for (let i = 690700; i < 700731; i++) {
    if (isPrime(i)) {
      console.log(i);
    }
  }
  