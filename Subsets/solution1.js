var subsets = function(things)
{
    let r = [];
    let total = 1 << things.length
    while (total--)	// looping forward would have been fine too
    {
        r.push(generateSet(total, things));
    }    
    return r;
};

function generateSet(n, things)
{
    return things.filter((k, i) => isSet(n, i+1));
}

function isSet(n, bit)
{
    n = n >> bit-1;
    return (n & 1) === 1;
}