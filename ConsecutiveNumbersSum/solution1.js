var consecutiveNumbersSum = function(N)
{
    let count = 0;
    
    let k = 2;
    let b = 1;
    
    while (b < N)
    {
        if (((N-b) % k) === 0) count++;
        b += k;
        k++;
    }
    
    return count+1;
};