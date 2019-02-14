/*
Explanation:

The basic idea is as follows:  If we have a list of all courses and their dependencies, one or more of those courses
must have zero dependencies, call it k.  If we start with the course (or courses) that has/have zero dependencies, we can iterate
through all other courses, removing k as one of their dependencies.  For example:

0,1
0,2
0,3
0,4
1,2
1,3,
1,4
2,3
2,4
3,4

0 depends on 1, 2, 3, 4
1 depends on 2, 3, 4
2 depends on 3, 4
3 depends on 4
4 (no dependencies)

We can see that 4 depends on nothing (we'll call it k), so we can look at all other courses, removing 4 from any of their dependency lists.
That would leave us with:

0 depends on 1, 2, 3
1 depends on 2, 3
2 depends on 3,
3 (no dependencies)
4 (no dependencies)

No we see that 3 has no dependencies, so we can perform the process with 3.

0 depends on 1, 2
1 depends on 2
2 (no dependencies)
3 (no dependencies)
4 (no dependencies)

Hopefully you see the pattern.  If we get the point where all dependencies have eliminated, we know we're in good shape.
This can be a simple totalDependencies variable that we decrement until it reaches 0, or until there there is nothing new has
gotten added to our list of courses with zero dependencies.  At that time, if totalDependencies hasn't gotten to 0, we know
we have a cycle.

Now... the way I've described this is inefficient because we're scanning over the list of courses repeatedly to see what dependencies
it has.  We can make this more efficient by build our graph "in reverse" so to speak. 

That is, instead of putting a course in the graph and having that point to a list of its dependencies, we'll instead have each
node in our graph point to a list of things that depend on IT! For instance, instead of recoding 0 has dependencies on 1, 2, 3, and 4,
and that 1 has dependencies on 2, 3, and 4, and so on...

We'll instead record that:

0 -> []                 // 0 is depended upon by no one
1 -> [ 0 ]              // 1 is depended upon by 0
2 -> [ 0, 1 ]           // 2 is depended upon by 0 and 1
3 -> [ 0, 1, 2 ]        // 3 is depended upon by 0, 1 and 2
4 -> [ 0, 1, 2, 3 ]     // 4 is depended upon by 0, 2, 3, and 3

In this way, when we come across a course and want to know who all depends on it, we can discover this with a quick lookup.  What courses
depend on 4? Courses 0, 1, 2, and 3 do!

With this information available for quick lookup, we can go through our list of courses with no dependencies (call them k1..kn)
and quickly remove them k1..kn from their list.

In doing so, we can also keep track of how many dependencies each course has.  Everytime we remove a dependency, we decrease that
course's dependency count.  Eventually all dependencies will have been accounted for (or not, in which case, taking all the couses
would be impossible).

*/

function canFinish(numCourses, prereqs)
{
    let graph = [];
	for (let i = 0; i < numCourses; i++) graph.push([]);
    
    let dependencyCounts = Array(numCourses).fill(0);
    
    prereqs.forEach(prereq =>
    {
        let courseId = prereq[0];
        let dependencyId = prereq[1];
        graph[dependencyId].push(courseId);
        dependencyCounts[courseId]++;
    });
    
    let nodesWithNoDependencies = [];
    for (let i = 0; i < dependencyCounts.length; i++)
    {
		if (dependencyCounts[i] === 0) nodesWithNoDependencies.push(i);
    }
    
    let totalDependencies = prereqs.length;
    while (nodesWithNoDependencies.length)
    {
        let k = nodesWithNoDependencies.pop();
        let nodesThatDependOnK = graph[k];
        for (let i = 0; i < nodesThatDependOnK.length; i++)
        {
            let dependent = nodesThatDependOnK[i];
            dependencyCounts[dependent]--;
            if (dependencyCounts[dependent] === 0)
            {
                nodesWithNoDependencies.push(dependent);
            }
            totalDependencies--;
        }
    }
    
    return totalDependencies === 0;
}