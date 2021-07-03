var isInterleave = function(s1, s2, s3)
{
    return interleaveHelper(s1, 0, s2, 0, s3, 0, new Map());
};

function interleaveHelper(s1, i, s2, j, s3, k, memo)
{
    const key = `${i}:${j}:${k}`;
    if (memo.has(key)) return memo.get(key);
    
    let result;
    if (i === s1.length && j === s2.length && k === s3.length)
    {
        result = true;
    }
    else if (k === s3.length && (i !== s1.length || j !== s2.length) ||
             (s1[i] !== s3[k] && s2[j] !== s3[k]))
    {
        result = false;
    }
    else if (s1[i] === s3[k] && s2[j] !== s3[k])
    {
        result = interleaveHelper(s1, i+1, s2, j, s3, k+1, memo);
    }
    else if (s1[i] !== s3[k] && s2[j] === s3[k])
    {
        result = interleaveHelper(s1, i, s2, j+1, s3, k+1, memo);
    }
    else 
    {
        result = interleaveHelper(s1, i, s2, j+1, s3, k+1, memo) ||
                 interleaveHelper(s1, i+1, s2, j, s3, k+1, memo);
    }
    
    memo.set(key, result);
    return result;
}