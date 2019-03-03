# Course Schedule 2

[https://leetcode.com/problems/course-schedule-ii/](https://leetcode.com/problems/course-schedule-ii/)

---
There are a total of n courses you have to take, labeled from 0 to n-1.

Some courses may have prerequisites, for example to take course 0 you have to first take course 1, which is expressed as a pair: [0,1]

Given the total number of courses and a list of prerequisite pairs, return the ordering of courses you should take to finish all courses.

There may be multiple correct orders, you just need to return one of them. If it is impossible to finish all courses, return an empty array.

```
Example 1:

Input: 2, [[1,0]] 
Output: [0,1]
Explanation: There are a total of 2 courses to take. To take course 1 you should have finished   
             course 0. So the correct course order is [0,1].
```

```			 
Example 2:

Input: 4, [[1,0],[2,0],[3,1],[3,2]]
Output: [0,1,2,3] or [0,2,1,3]
Explanation: There are a total of 4 courses to take. To take course 3 you should have finished both     
             courses 1 and 2. Both courses 1 and 2 should be taken after you finished course 0. 
             So one correct course order is [0,1,2,3]. Another correct ordering is [0,2,1,3] .
```
---

## My thoughts

This is very very similar to Course Schedule 1, to which I wrote an explanation [here](https://github.com/sstchur/coding_practice/tree/master/CourseSchedule)

I actually wrote two solutions to that problem.  The first was modeling the input as a graph and then using the WhiteSet/GraySet/BlackSet concept to detect a cycle.

The second was tracking reverse dependencies.  You can find my comments in the [solution2.js](https://github.com/sstchur/coding_practice/blob/master/CourseSchedule/solution2.js) file.  It's a good starting point, because I'm going to use the same concept to solve this problem.

## Track Dependencies in Reverse

To start, I'm going to create an array from 0 to n-1, where n is the given number of courses. Each index in the array will represent a course number, and it will point to another array, which holds all the courses that depend on that course number.  If that sounds confusing, maybe this will help:

```
Suppose that
0 depends on 1, 2, 3, 4
1 depends on 2, 3, 4
2 depends on 3, 4
3 depends on 4
4 (no dependencies)

Then, we'll build a structure like:

0 -> []                 // 0 is depended upon by no one
1 -> [ 0 ]              // 1 is depended upon by 0
2 -> [ 0, 1 ]           // 2 is depended upon by 0 and 1
3 -> [ 0, 1, 2 ]        // 3 is depended upon by 0, 1 and 2
4 -> [ 0, 1, 2, 3 ]     // 4 is depended upon by 0, 2, 3, and 3
```

## DependencyCounts tracker

In addition, I'll have an array from 0 to n-1 which holds the number of dependencies each course has.  For example:

```
[ 4, 3, 2, 1, 0 ]		// 0 has 2 dependencies, 1 has 1, and 2, 3, 4 have none
``` 

## Find a Course Order

To being, we'll run through the reverse dependencies array and look for any entries that have nothing that depend on them.  Those are the courses we can unconditionally take first. In the example above, that would be 4 only (it's the only one that has no dependencies).

The array of courses that have no dependencies will be our starting point. I'll call it my result array. We'll loop through that collection (potentially adding to it as we do) and for each entry in that collection, we'll "whittle" away dependencies.

For instance, the first course with no dependenies is course 4, so we jump to index 4 in our reverse dependencies structure, and see what things are dependent on 4. In this case, it's courses 0, 1, 2, and 3.  For each of them, we can hop into the dependenciesCount array and reduce the number of dependencies by 1.  So course 0 drops its dependeny count to 3, course 1 drops to 2, course 2 drops to 1, and course 3 drops to 0.

The last one is important.  Any time a course's dependency count drops to 0, we can add it to our result array. 

Then we repeat this process for any courses in the result array that haven't yet been dealth with.  So now that course 3's dependency count has fallen to 0, any course that had been dependent upon 3 can now be taken.  We keep doing this until there is nothing left to do.

When we're done, the number of courses in our result array had better equal the total number of courses.  If it doesn't, it means that the dependencies are such that it's impossible to complete all courses.

Here's the full code, which made leetcode happy:

```javascript
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
```

The code is also available as a raw javascript file in [solution1.js](solution1.js)