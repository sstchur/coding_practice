# Course Schedule

[https://leetcode.com/problems/course-schedule/](https://leetcode.com/problems/course-schedule/)

---
There are a total of n courses you have to take, labeled from 0 to n-1.

Some courses may have prerequisites, for example to take course 0 you have to first take course 1, which is expressed as a pair: [0,1]

Given the total number of courses and a list of prerequisite pairs, is it possible for you to finish all courses?
```
Example 1:

Input: 2, [[1,0]] 
Output: true
Explanation: There are a total of 2 courses to take. 
             To take course 1 you should have finished course 0. So it is possible.
Example 2:

Input: 2, [[1,0],[0,1]]
Output: false
Explanation: There are a total of 2 courses to take. 
             To take course 1 you should have finished course 0, and to take course 0 you should
             also have finished course 1. So it is impossible.
```
---

## My thoughts

This is, I think, a classic problem of how to detect a cycle in a graph.  My first solution to this problem was my own (yay me), but it was slow (boo me).  Essentially, it involved modeling the input as a graph and then traversing the graph, keeping track of visited nodes.  But visited isn't enough.  Try this for yourself and you will see why.

I realized, after looking at it for a bit, that I needed to determine if I'm in a cycle.  I was able to do this by essentially "abusing" my visited hash.  I put in it, two styles of keys.  The first was simply the id of the node that's been visited.  The second was a key that indicated which node I traversed from in order to visit the current node:

```
visited["5"] = true   // means node id="5" has been visited
visited["3-5"] = true // means node id="5" was visited FROM node id="3"
```

This allowed me to skip traversing nodes I've already visited (the first style of key) while at the same time, determining if I'm in a cycle (the second style of key already exists in the visited hash).

This worked (leetcode accepted it).  But it was very slow.

## WhiteSet, GraySet, BlackSet (from Tushar Roy)

Then I learned a technique from Tushar Roy, involving WhiteSet, GraySet, and BlackSet. Here's how it works.

The WhiteSet represents all nodes in the graph that have not been visited.  The BlackSet represents all nodes in the graph that have been fully traversed (that is, all of its neighbor's have been visited).  The GraySet represents nodes that are in the process of being traversed.

To start out, every node in the graph is added to the WhiteSet.  You pick a node out of the WhiteSet and perform a depth-first-search on your graph, starting from the node you chose out of the WhiteSet.  At the same time, you move the node from the WhiteSet to the GraySet.

To perform your DFS, you iterate over all of the given node's neighbors, doing one of 3 things:

1. If the neighbor node is in the BlackSet, there is no need to go down this path again. We can skip this node!
2. If the neighbor node is in the GraySet, we're in a cycle. We should break out of the traversal.
3. If the neighbor node is in the WhiteSet, we should traverse the neighbor.

Once we have traversed all the neighbors of a given node, the node itself can be moved from the GraySet to the BlackSet (because it has been fully visited).

## Back to the problem: Course Schedule

So the problem statement is that you're given a list of courses 0 - n, along with a list of prerequisite pairs.  For example, you might be given:

```
3
[[0,1],[1,2]]
```

Which means there are 3 courses and course 0 depends on 1, and course 1 depends on 2.  The question is, can you take all 3 courses?  Of course you can. You can take course 2, which will then enable you to take course 1, which will then enable you to take course 0.

If course 1 had depended on course 0, you'd have a circular dependency and the answer would be no.

## Model the input as a graph

I decided to model this as a graph as follows:

```javascript
function GraphNode(id)
{
    this.id = id;
    this.edges = [];
}
function GraphEdge(from, to)
{
    //this.id = `${from}-to-${to}`;
    this.from = from;
    this.to = to;        
}
```

The GraphEdge doesn't really need an id (for this problem) which is why I commented it out.

A graph is really just a collection of nodes (and their edges), so creating a graph can be as simply as:

```javascript
// create a graph
let g = {};

// create a node
let n1 = new GraphNode('stephen');
// create another
let n2 = new GraphNode('emily');

// create an edge
n1.edges.push(new GraphEdge('stephen', 'emily'));

// add nodes to graph
g[n1.id] = n1;
g[n2.id] = n2;
```

For the given problem, we'll create a graph based on the given input. That is, we'll create one node for every integer from 0 to numCourses, and we'll create an edge for every pair of prerequisites we're given.

Here's what that looks like:

```javascript
let g = {};
for (let i = 0; i < numCourses; i++)
{
	let n = new GraphNode(i);
	g[n.id] = n;
};

preReqs.forEach(pr =>
{
	let courseId = pr[0];
	let depId = pr[1];
	g[courseId].edges.push(new GraphEdge(courseId, depId));
});
```

With out graph built, we just need to follow the logic I explained above that leverages the idea of WhiteSet, GraySet, and BlackSet.

Typically, you'd use a Set class of some sort, and loop while the set isn't empty.  Javascript actually does have sets (which is "newish" to me -- I don't think they existed in es5), but I didn't use them here.

Instead, since I have a list of all nodes in the graph, I'll just loop over them, and only if the node is *not* in the WhiteSet, will I call traverse (only nodes in the WhiteSet need to be considered).  This should have the same effect as looping while the WhiteSet isn't empty.  

```javascript
function canFinish(numCourses, preReqs)
{
    // Assume the graph, g, has already been built based on
    // input: numCourses and preReqs

    for (let id in g)
    {
        if (!(id in whiteSet)) continue;	// skip nodes not in the WhiteSet
        if (traverse(g, g[id], whiteSet, graySet, blackSet)) return false;
    }
    return true;
}
```

Our canFinish function leverages a traverse function (which I'll show in a moment), whose purpose is to detect a cycle.  It returns true if a cycle was found, and false if one wasn't.  Thus, our canFinish function can return true if a cycle *wasn't* found, and false if one was.

For completeness, here's the traverse function

```javascript
function traverse(g, n, whiteSet, graySet, blackSet)
{
    delete whiteSet[n.id];
    graySet[n.id] = true;

    for (let i = 0; i < n.edges.length; i++)
    {
        let neighborId = n.edges[i].to;
        if (neighborId in blackSet)
        {
            continue;
        }

        if (neighborId in graySet) return true;
        
        if (traverse(g, g[neighborId], whiteSet, graySet, blackSet)) return true;
    }

    delete graySet[n.id];
    blackSet[n.id] = true;
    return false;
}
```

Full solution is available in [solution1.js](solution1.js)

The file [solution2.js](solution2.js) has an alternate way of solving this problem, which is to track the dependents, rather than the dependencies.