# Construct Quad Tree

[https://leetcode.com/problems/construct-quad-tree/](https://leetcode.com/problems/construct-quad-tree/)

---
We want to use quad trees to store an N x N boolean grid. Each cell in the grid can only be true or false. The root node represents the whole grid. For each node, it will be subdivided into four children nodes until the values in the region it represents are all the same.

Each node has another two boolean attributes : isLeaf and val. isLeaf is true if and only if the node is a leaf node. The val attribute for a leaf node contains the value of the region it represents.

---

## My thoughts

My first thought when I encountered this problem was "ah crap; this sounds confusing!" But after reading and re-reading the problem description a few times, I started to get it.  However, I resisted the temptation to rush into coding, as that surely would have let to failure.  This is the sort of problem that requires some careful consideration (I th

### Example 1
I'll start with a simple example.  Suppose we have a 2x2 grid:

```
01
10
```

Essentially what we have to do is split the grid into 4 equal quadrants, such that each quadrant's cells have all the same value (either all 0s or all 1s).  If we split the grid above, we get:

```
0|1
---
1|0
```

In the UpperLeft we have a 0, the UpperRight is a 1, the BottomLeft is a 1, and the BottomRight is a zero.

Now ask yourself, "self, for any given quadrant, is every cell in that quadrant the same (either all 0s or all 1s)?"

In this case, the answer, of course, is yes! Granted, there is only ONE cell in each quadrant, but that doesn't make the answer any less true.

What if our 2x2 grid contained all 0s or all 1s?  Should we still split it? Well, that depends.  According to the problem statement, no we shouldn't.  A quad tree node would only have child nodes if (and only if) all the cell's values in the grid aren't the same.  If all values are the same, there'd be no need to create additional tree nodes (and no need to further split the grid).

However, it turns out that splittig the grid anyway is useful.

## Recursion is what we want here

It's probably not a shock to you that this problems smacks of recursion.  The question is: what's our base case?  At first, I was thinking that the base case is when a quadrant's cells contain all the same value (either all 0s or all 1s) and that I'd have to traverse through a quadrant to determine that. And if it turned out that all values were the same, then I wouldn't need to further split that quadrant (or create any new tree nodes).

But if you allow your brain to think recursively, what you'll discover is that you can determine if a quadrant's cells contain all the same values by continuing to split the grid all the way down to a single cell.  Let's go back to the example 1.

We first split the grid into 4 quadrants.

```
TopLeft =     [ 0 ]
TopRight =    [ 1 ]
BottomLeft =  [ 1 ]
BottomRight = [ 0 ]
```

We now attempt to further split each of those quadrants into 4s.  We can't though, because there is only a single cell in each quadrant.  That's a good thing!  That's our base case.  When this happens, we know two things for sure:

1. We have a leaf node
2. The value of the leaf node will be whatever value is in that single cell

So for the grid we're working with, we'll create 4 leaf nodes, hich will all be
*nearly* identical.  Remember that the Node class given to us has:

- val
- isLeaf
- topLeft
- topRight
- bottomLeft
- bottomRight

Each node we'll create will have null for the 4 properties of **topLeft**, **topRight**, **bottomLeft**, and **bottomRight**.  Each will also have *true* specified for **isLeaf**. The only question is: will they all have the same value for the **val** property?

In this case, no. Some will have true (1) and some will have false (0).

However, if they DID all have the same value, then every node would effectively be identical, which would mean that the splitting was unnecessary to begin with! That's ok though, we can simply pick any of the 4 nodes we created (they're all the same after all) and return it.

Now, if even one of the nodes is different, then we need to somehow return all 4 nodes, which we'll do by creating a root node whose **isLeaf** property is set to *false* and whose **val** property is set to "*" (this is part of the problem statement).

How can we determine if all 4 quadrants are the same?  Well, here it get a little difficult to describe because we're blurring the lines between a "cell" and a "quadrant."  But... the idea is that a node represents a quadrant, and if all the values in that quadrant are the same, then the node will not have any children and whatever value that node has, is the value that every cell in that quadrant has. 

This is easies to think about when there is only one cell in the quadrant, but let's take a larger example and see how it breaks down:

```
00|11
00|11
-----
11|00
11|00
```

Here we have an 8x8 grid split into 4 quadrants.  It's each to see that in each quadrant, every cell's values are the same.  But our code doesn't know that.  It just blindly keeps splitting until it can split no further. So it'll start with the TopLeft quadrant and split that:

```
0|0
---
0|0
```

Once again, the code will attempt to split each quadrant, but this time, it won't be able to, but n = 1.  In that case, it will return a single Node whose **isLeaf** property is *true* and whose **val** property is false (for 0).

This will happen for each of the 4 quadrants and once that's done, we'll need to examine each quadrant's node to see if they are all the same.  As long as they every cell in each quadrant has the same value **AND** every node is a leaf node, then all 4 nodes are the same!  Which means we can just return any one of them.

That will take us back to the larger 8x8 grid, where this process will repeat.  The TopRight will split into 4 leaf nodes each of value 1, which again, are all the same, so we'll just pick any one and return it. 

Then the BottomLeft will split and do the same, as will the BottomRight.

At end of it all, we'll have 4 nodes, all leaf nodes, but this time, representing different values (false for TopLeft and BottomRight, and true for TopRight and BottomLeft).  Since all 4 quadrants (nodes) this time are NOT the same, we'll have to create a new root node that is NOT a leaf node and whose value is "*", and then affix each of the 4 quadrant nodes we created to it.


## The code already!

 I've rambled on for quite some time now and I'm still not convinced that I've done a good job of explaining this one.  So here's the code along with some inline comments.

```javascript
/**
 * // Definition for a QuadTree node.
 * function Node(val,isLeaf,topLeft,topRight,bottomLeft,bottomRight) {
 *    this.val = val;
 *    this.isLeaf = isLeaf;
 *    this.topLeft = topLeft;
 *    this.topRight = topRight;
 *    this.bottomLeft = bottomLeft;
 *    this.bottomRight = bottomRight;
 * };
 */
/**
 * @param {number[][]} grid
 * @return {Node}
 */
var construct = function(grid)
{
    return quadHelper(grid, 0, 0, grid[0].length);
};

function quadHelper(grid, i, j, n)
{
    if (n === 1)
    {
        // double bang will convert 1 to true and 0 to false
        // second param specifies isLeaf, which will always be true for single cell grids
        // all other params are null as leaf nodes have no children
        return new Node(!!(grid[i][j] === 1), true, null, null, null, null);
    }
    else
    {
        // split the grid in half (problem statement guarantees a power of 2)
        const half = n/2;

        // recursively construct nodes for each quadrant
        const topLeft = quadHelper(grid, i, j, half);
        const topRight = quadHelper(grid, i, j + half, half);
        const bottomLeft = quadHelper(grid, i+half, j, half);
        const bottomRight = quadHelper(grid, i+half, j+half, half);
        
        // determine if all 4 quadrants (nodes) are the same
        if (allSame(topLeft, topRight, bottomLeft, bottomRight))
        {
            // if so, pick any one of them to return
            return topLeft;
        }
        else
        {
            // if not all the same, create a new (non-leaft) root node
            // whose value is * and affix each of the quadrant nodes to it 
            const root = new Node('*', false, topLeft, topRight, bottomLeft, bottomRight);
            return root;
        }
    }
}
    
function allSame(TL, TR, BL, BR)
{
	// Quadrant nodes are "equal" if
	// 1. They are all leaf nodes
	// 2. Every value in each node is true or every value in each node is false
	// NOTE: not strictly necessary to use === true and === false; could have avoided those, but since
	// javascript doesn't have type safety and because sometiems val = "*", I chose to be explicit. This is
	// just for clarity though.
    if (TL.isLeaf && TR.isLeaf && BL.isLeaf && BR.isLeaf && 
       ((TL.val === true && TR.val === true && BL.val === true && BR.val === true) ||
        (TL.val === false && TR.val === false && BL.val === false && BR.val === false)))
        {
            return true;
        }
    return false;
}
```

And here's the full, stand-alone code available in [solution1.js](solution1.js)


