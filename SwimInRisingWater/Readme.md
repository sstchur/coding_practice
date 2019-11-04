# Swim In Rising Water

[https://leetcode.com/problems/swim-in-rising-water/submissions/](https://leetcode.com/problems/swim-in-rising-water/submissions/)

---
On an N x N grid, each square grid[i][j] represents the elevation at that point (i,j).

Now rain starts to fall. At time t, the depth of the water everywhere is t. You can swim from a square to another 4-directionally adjacent square if and only if the elevation of both squares individually are at most t. You can swim infinite distance in zero time. Of course, you must stay within the boundaries of the grid during your swim.

You start at the top left square (0, 0). What is the least time until you can reach the bottom right square (N-1, N-1)?

Example 1:
```
Input: [[0,2],[1,3]]
Output: 3
Explanation:
At time 0, you are in grid location (0, 0).
You cannot go anywhere else because 4-directionally adjacent neighbors have a higher elevation than t = 0.

You cannot reach point (1, 1) until time 3.
When the depth of water is 3, we can swim anywhere inside the grid.
```

Example 2:
```
Input: [[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]
Output: 16
Explanation:
 0  1  2  3  4
24 23 22 21  5
12 13 14 15 16
11 17 18 19 20
10  9  8  7  6

The final route is marked in bold.
We need to wait until time 16 so that (0, 0) and (4, 4) are connected.
```
---

## My thoughts

Pretty happy with myself on this one.  I got a solution that performs well (according to Leetcode) and which I didn't need to look at the discussion for.

I actually submitted 3 solutions for this, each of got progressively faster, but the basic idea behind all three submissions was the same, which was:

Start at the target cell and traverse my way backwards to cell 0,0.  At each step of the traversal, choose the "cheapest" option available, while at the same time, "stashing away" any cell coordinates I chose not to visit (which I call 'possibilities').  The reason for this "stashing" is that my traversal which chooses the cheapest option each time, might lead me down a path which I'll end up realizing was the wrong when.  If (and when) that happens, we need to pluck out the chepeast option from 'possibilities' and continue the traversal in the same way.

## Attempt 1

I needed a data structure to store the 'possibilities' and also something to store 'visited' cells so that I don't end up re-visiting cells I've been to (and end up recursing forever).

For my first variation of my solution, I chose plain old Javascript objects for this.  This worked, but it's not very fast for two reasons:
1. Using built in Sets and Maps in Javascript is generally much faster than using a plain Javascript object.
2. For the 'possibilities' data structure, what we really want is a min heap, not merely a hashset, as a min heap allows us to pull out the cheapest possibility without iterating.

## Attempt 2

Basically changing nothing except converting the plain old Javascript objects to a Set and a Map improved the runtime of the solution by about 3.5!  However, at that point, it was about 250ms and still better than only about 20% of Javascript submissions.

## Attempt 3

One final change made a big big difference.  I suspected it would, but I was lazy and didn't feel like writing a Min-Heap (Javascript, to my knowledge, doesn't have one built in).  But I finally broke down and wrote one, and boy did that make a difference in the runtime.  Final solution clocked in at 68ms (better than 98%).  However, another time I ran the same code, I got 88ms (better than 86%).  I dunno, Leetcode can be funny with its reported timings sometimes.

Anyway, here's the full solution, with inline comments to help explain. It looks like, but that's mostly because of the code to implement the heap.  The actual logic for *swimInWater* really isn't too bad.

``` javascript
var swimInWater = function(grid)
{
	// answer.val will be the "pass by reference" variable that
	// will store the final answer
    let answer = { val: grid[grid.length-1][grid.length-1] };

	// traverse the grid, starting at the target cell; use a Set
	// to track visited cells; use a Heap to track possibilities
	// we haven't yet tried 
    traverse(grid, grid.length-1, grid.length-1, new Set(), new Heap(), answer);

    return answer.val;
};

function traverse(grid, r, c, visited, possibilities, answer)
{
	// if we've reached cell 0,0, we're done!
    if (r === 0 && c === 0)
    {
        return;
    }
    
	// if we're attempting to access a cell that it out of the
	// boundaries of the grid, just ignore that
    if (r < 0 || r > grid.length-1 || c < 0 || c > grid.length-1) return;
    
	// if we've been to this cell before, bail out -- no need to try again 
    const key = `${r}:${c}`;
    if (visited.has(key)) return;
    
	// if this is the first time visiting this cell, mark it as visited
    visited.add(key);
    
	// var swimInWater = function(grid)
{
    let answer = { val: grid[grid.length-1][grid.length-1] };
    traverse(grid, grid.length-1, grid.length-1, new Set(), new Heap(), answer);
    return answer.val;
};

function traverse(grid, r, c, visited, possibilities, answer)
{
    if (r === 0 && c === 0)
    {
        return;
    }
    
    if (r < 0 || r > grid.length-1 || c < 0 || c > grid.length-1) return;
    
    const key = `${r}:${c}`;
    if (visited.has(key)) return;
    
    visited.add(key);
    
	// problem statement says we can only move up, down, left or right - these
	// are our possibilities
    const prevCol = c-1;
    const prevRow = r-1
    const nextCol = c+1;
    const nextRow = r+1;
    
	// but we have to make sure that each possibility is a valid one before storing it,
	// which means that it's both "in bounds" and hasn't been visited before

	// left (same row, prev col)
    if (r >= 0 && r <= grid.length-1 && prevCol >= 0 && prevCol <= grid.length-1)
    {
        const left = grid[r][prevCol];
        const key = `${r}:${prevCol}`;
        if (!visited.has(key))
        {
            let p = { val: left, coords: { r, c: prevCol } };
            possibilities.enqueue(p);
            
        }
    }
    
	// up (same col, prev row)
    if (prevRow >= 0 && prevRow <= grid.length-1 && c >=0 && c <= grid.length-1)
    {
        const up = grid[prevRow][c];
        const key = `${prevRow}:${c}`;
        if (!visited.has(key))
        {
            let p = { val: up, coords: { r: prevRow, c } };
            possibilities.enqueue(p);
        }
    }
    
	// right (same row, next col)
    if (nextCol >= 0 && nextCol <= grid.length-1 && r >= 0 && r <= grid.length-1)
    {
        const right = grid[r][nextCol];
        const key = `${r}:${nextCol}`;
        if (!visited.has(key))
        {
            let p = { val: right, coords: { r, c: nextCol } };
            possibilities.enqueue(p);
        }
    }
    
	// down (same col, next row)
    if (nextRow >= 0 && nextRow <= grid.length-1 && c >= 0 && c <= grid.length-1)
    {
        const down = grid[nextRow][c];
        const key = `${nextRow}:${c}`;
        if (!visited.has(key))
        {
            let p = { val: down, coords: { r: nextRow, c } };
            possibilities.enqueue(p);
        }
    }
    
	// pull out the "cheapest" possibility; since this is a Min Heap, that's
	// just a simple dequeue call
    let pick = possibilities.dequeue();

	// we're looking for the minimum time as we traverse, but at each step, we might
	// be forced to pick a higher value time; if/when that happens, we need to update
	// our "best" answer
    if (pick.val > answer.val) answer.val = pick.val;
    
	// continue the traversal using the "best" chosen cell
    traverse(grid, pick.coords.r, pick.coords.c, visited, possibilities, answer);    
}

// Min Heap implementation -- not going to explain this as you can find many
// resources online that will explain a Heap implementation.
// 
// Other thing to note is that I use a combination of an array and a Set in this implementation,
// and the reason for that is to prevent duplicates in this Heap (which is ok in case, since the
// problem statement guarantees there will not be duplicates)
class Heap
{
	constructor()
    {
		this.list = [];
		this.set = new Set();
    }
        
    isEmpty()
    {
        return this.list.length === 0;    
    };
    
    enqueue(item)
    {
		if (!this.set.has(item.val))
        {
            this.list.push(item);
            this.set.add(item.val);
            this.swim(this.list.length-1);
        }
    };
    
    dequeue()
    {
        if (this.isEmpty()) throw 'heap is empty!';
		let top = this.list[0];
		this.list[0] = this.list[this.list.length-1]
        this.list.pop();
		this.sink(0);
		this.set.delete(top.val);
		return top;
    }
    
    sink(i)
    {
    	let left = 2*i + 1;
		let right = 2*i + 2;
	   
		let smaller = left;
		if (right < this.list.length)
        {
			if (this.list[right].val < this.list[left].val) smaller = right;
        }

		let parent = this.list[i];
		if (this.list[smaller] !== undefined && parent.val > this.list[smaller].val)
        {
			this.swap(i, smaller);
			this.sink(smaller);
        }
    }
    
    swim(i)
    {
		if (i === 0) return;
		let parent = Math.floor((i - 1)/2);
        if (this.list[parent] !== undefined && this.list[i].val < this.list[parent].val)
        {
			this.swap(i, parent);
			this.swim(parent);
        }
    }

	swap(i, j)
    {
		let tmp = this.list[i];
		this.list[i] = this.list[j];
		this.list[j] = tmp;
    }

	print()
    {
		console.log(this.list);
    }
}
   
```