var findJudge = function(N, trust)
{
    if (N === 1 && trust.length === 0) return 1;
    
    let trustees = {};
    let possibleJudges = {};
    
    for (let i = 0; i < trust.length; i++)
    {
        let truster = trust[i][0];
        let trustee = trust[i][1];
        
        // if you're a truster, you can't be a judge
        possibleJudges[truster] = false;

        // if enough people trust you, you might be a judge
        trustees[trustee] = (trustees[trustee] || 0) + 1;
        
        // if N-1 people trust you AND you aren't already known to be eliminated from judgeship, you might be a judge
        if (trustees[trustee] === N-1 && possibleJudges[trustee] !== false)
        {
            possibleJudges[trustee] = true;
        }
    }
    
    // only one person can be the judge, and if he exists, his value in the possibleJudges hash will be true
    let filtered = Object.keys(possibleJudges).filter(key => possibleJudges[key]);
    return filtered.length > 0 ? filtered[0] : -1;    
};