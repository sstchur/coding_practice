var findOrder = function(numCourses, prerequisites)
{
    let revDependencies = [];
    let dependencyCounts = Array(numCourses).fill(0);
    for (let i = 0; i < prerequisites.length; i++)
    {
        let prereq = prerequisites[i];
        let course = prereq[0];
        let dependency = prereq[1];
        revDependencies[dependency] = revDependencies[dependency] || [];
        revDependencies[dependency].push(course);
        
        dependencyCounts[course]++;
    }
    
    let result = [];
    dependencyCounts.forEach((n, i) =>
    {
       if (n === 0) result.push(i); 
    });
    
    let j = 0;
    while (j < result.length)
    {
        let course = result[j];
        let rd = revDependencies[course];
        if (rd)
        {
            rd.forEach(dependent =>
            {
                dependencyCounts[dependent]--;
                if (dependencyCounts[dependent] === 0)
                {
                    result.push(dependent);
                }
            });
        }
        
        j++;
    }
    
    return result.length === numCourses ? result : [];
};