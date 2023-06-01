function bruteForce(str, substr)
{
    let result = [];
    let counter = 0;
    for (let i = 0; i < str.length; i++)
    {
        let j = 0;
        while (j < substr.length && str[i + j] === substr[j])
        {
            j++;
        }
        if (j === substr.length)
        {
            result.push(i);
        }
    }
    if (result.length === 0)
    {
        result.push(-1);
    }
    return [result, counter];
}