var findJudge = function(N, trust)
{
    if (N === 1 && trust.length === 0) return 1;
    
    let trustees = {};
    let ineligible = {};
    let judge = null;
    
    for (let i = 0; i < trust.length; i++)
    {
        let truster = trust[i][0];
        let trustee = trust[i][1];
        
        // trusters cannot be judges
        ineligible[truster] = true;

        // trustees can be judges, if enough people trust them
        trustees[trustee] = (trustees[trustee] || 0) + 1;
        
        // if enough people trust this candidate and we know he's not INeligible, he's probably the judge, but might later turn out not to be
        if (trustees[trustee] === N-1 && !ineligible[trustee])
        {
            judge = trustee;
        }
    }
    
    // as long as our candidate (the judge variable) isn't in the list of ineligibles, he's our guy
    return !ineligible[judge] && judge || -1;   
};