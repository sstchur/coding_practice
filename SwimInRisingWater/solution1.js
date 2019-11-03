var swimInWater = function(grid)
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
    
    const prevCol = c-1;
    const prevRow = r-1
    const nextCol = c+1;
    const nextRow = r+1;
    
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
    
    let pick = possibilities.dequeue();

    if (pick.val > answer.val) answer.val = pick.val;
    
    traverse(grid, pick.coords.r, pick.coords.c, visited, possibilities, answer);    
}

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