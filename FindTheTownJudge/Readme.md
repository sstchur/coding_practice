# Find the Town Judge

[https://leetcode.com/problems/find-the-town-judge/](https://leetcode.com/problems/find-the-town-judge/)

---
In a town, there are N people labelled from 1 to N.  There is a rumor that one of these people is secretly the town judge.
If the town judge exists, then:

1. The town judge trusts nobody.
2. Everybody (except for the town judge) trusts the town judge.
3. There is exactly one person that satisfies properties 1 and 2.

You are given trust, an array of pairs trust[i] = [a, b] representing that the person labelled a trusts the person labelled b.
If the town judge exists and can be identified, return the label of the town judge.  Otherwise, return -1.

Example 1:
```
Input: N = 2, trust = [[1,2]]
Output: 2
```

Example 2:
```
Input: N = 3, trust = [[1,3],[2,3]]
Output: 3
```

Example 3:
```
Input: N = 3, trust = [[1,3],[2,3],[3,1]]
Output: -1
```

Example 4:
```
Input: N = 3, trust = [[1,2],[2,3]]
Output: -1
```

Example 5:
```
Input: N = 4, trust = [[1,3],[1,4],[2,3],[2,4],[4,3]]
Output: 3
```
---

## My thoughts

Leetcode classifies this as a Graph problem and called it an "easy" problem.  I'd have to agree, especially as far as graph problems go.

There are two ways I coded this, one faster than the other.

The slower way, is easier to read (I think), but the concept of both solutions is pretty straight-forward to think about.

The are two key points (given quite clearly in the problem statement) that you need to leverage to solve this.  The first is that the town judge trusts nobody.  This means that if you model this as a graph with outgoing edges representing trust, that the town judge has no outgoing edges.

The second key point is that everyone else trusts the town judge. That means the town judge must have N-1 incoming edges. If there are N people and they all (except for the judge himself) trust the judge, then they'll all have outgoing "trust" edges to the judge, which means that the judge will have N-1 incoming edges.

So, for me, the easiest way to think about this is to build a graph, and then iterate through its verticies, looking for a vertex that has N-1 incoming edges and also has zero outgoing edges.  We're told that a such a person exists, there is guaranteed to be only one.  If we don't find a vertex with N-1 incoming edges and zero outgoing edges, then we can't know who the town judge is, and we return -1.

```javascript
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
```

## Explanation

If N === 1 and there are no known trust relationships, then that one person must be the judge. Why? Because he satisfies the two conditions: that he trusts no one and everyone *else* trusts him. Of course, there *is* no one else available to trust him, but that's irrelevant. He still technically satisfies the conditions.

Beyond that edge case, the routine is pretty simple.  We just build a graph using a hash. Each key in the hash represents a vertext in the graph, and each key points to an object which has an array of in-vertices (inV) and out-vertices (outV).  I can build this easily by looping through the trust array and using the "truster" as the one key in the hash and the "trustee" as another key in the hash.  If 1 trusts 2, then 1 is the "truster" and 2 is the "trustee."  Both need entries in the hash. The only difference is that the truster's outV will have the trustee added to it, and the trustee's inV will have the truster added to it.  

With our graph build, all we have to do now is look for a vertex with N-1 in-vertices (meaning everyone else trusts this person) and 0 out-vertices (meaning he trusts no one).  If we don't find such a vertext, we return -1.

## A slightly more optimal solution

This first solution makes leetcode happy, so that's good.  But it's sub-optimal in a few ways.  We don't actually need to build a data structure with every vertex's in-vertices and out-vertices.  All we care about is who the town judge is (if he exists).  We know that he trusts no one and that everyone else trusts him, so we can be a bit more efficient here.

Suppose we track only trustees and their in-degrees; that is, the number of incoming edges to a given trustee (one who is trusted).  We know this number must be N-1 for the person to have a shot at being the town judge (i.e. everyone trusts him).  We also know that he must trust no one if he is to be judge. We don't need to track out-degrees of *all* trustees; even *one* out-edge eliminates a person from being judge. 

We can track in-degrees of trustees and also separately track possible judges. For any person with an out-going edge, we'll set that person's key to false in the possibleJudges hash.  Only if a trustee has accumulated N-1 in-coming edges *and* he isn't already set to fasle in the possibleJudges hash, will we set his value to true in the possibleJudges hash.

Here's what it looks like:

```
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
```

It bothers me a litle bit that I'm using Object.keys(possibleJudges).filter at the end of this function.  That's technically two loops.  I really wanted to do this in O(n) with a single loop.  Turns out, I can!

Since we know from the problem statement that there can be only one person who satisfies the condition for being a judge, we don't need to track all possible judges (most of whom then later turned out to be ineligible).  Instead we can replace the possibleJudges hash (or dictionary if you prefer that term) with an ineligible hash.  We track only those that are not eligible to be judges, while at the same time tracking one person who we think is currently eligible to be judge.  At the end, we simply check that our one candidate isn't in the hash of ineligible judges and if he's not, he's our guy!

Here's what that one looks like:

```
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
```
That's all I've got.  All of these solutions make leetcode happy.  Here's a link to the raw js for each one.

[solution1.js](solution1.js) // easy to read, but not so fast

[solution2.js](solution2.js) // fast, uses a .filter at the end

[solution3.js](solution3.js) // uses just a single loop
