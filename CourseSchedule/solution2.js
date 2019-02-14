// NOTE: this code needs to be cleaned up -- it can be made clearer and more concise

function canFinish(numCourses, preReqs)
{
    let g = Array(numCourses).fill(0);
	g = g.map(x => []);
    let dependencyCount = Array(numCourses).fill(0);
    
    let grandTotal = 0;
    preReqs.forEach(pr =>
    {
        let dependent = pr[0];
        let parent = pr[1];
        g[parent].push(dependent)
        dependencyCount[dependent]++;
        grandTotal++;
    });
    
    // q contains ids of all nodes that have no dependencies
    let q = [];
    for (let i = 0; i < dependencyCount.length; i++)
    {
		if (dependencyCount[i] === 0) q.push(i);
    }
    
    while (q.length)
    {
        let k = q.pop();
        let nodesThatDependOnK = g[k];
        for (let i = 0; i < nodesThatDependOnK.length; i++)
        {
            let dependent = nodesThatDependOnK[i];
            dependencyCount[dependent]--;
            grandTotal--;
            if (dependencyCount[dependent] === 0)
            {
                q.push(dependent);
            }
        }
    }
    
    return grandTotal === 0;
}