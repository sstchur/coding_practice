var findJudge = function(N, trust)
{
    if (N === 1 && trust.length === 0) return 1;
    
    let graph = {};
    for (let i = 0; i < trust.length; i++)
    {
        let truster = trust[i][0];
        let trustee = trust[i][1];
        
        graph[truster] = graph[truster] || { inV: [], outV: [] };
        graph[truster].outV.push(trustee);
        
        graph[trustee] = graph[trustee] || { inV: [], outV: [] };
        graph[trustee].inV.push(truster);
    }
    
    let judge = Object.keys(graph).filter(key =>
    {
        return graph[key].inV.length === N-1 && graph[key].outV.length === 0;
    });
    
    return judge.length > 0 ? judge[0] : -1;
};