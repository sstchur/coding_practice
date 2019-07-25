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
        return new Node(!!(grid[i][j] === 1), true, null, null, null, null);
    }
    else
    {
        const half = n/2;
        const topLeft = quadHelper(grid, i, j, half);
        const topRight = quadHelper(grid, i, j + half, half);
        const bottomLeft = quadHelper(grid, i+half, j, half);
        const bottomRight = quadHelper(grid, i+half, j+half, half);
        
        if (allSame(topLeft, topRight, bottomLeft, bottomRight))
        {
            return topLeft;
        }
        else
        {
            const root = new Node('*', false, topLeft, topRight, bottomLeft, bottomRight);
            return root;
        }
    }
}
    
function allSame(TL, TR, BL, BR)
{
    if (TL.isLeaf && TR.isLeaf && BL.isLeaf && BR.isLeaf && 
       ((TL.val === true && TR.val === true && BL.val === true && BR.val === true) ||
        (TL.val === false && TR.val === false && BL.val === false && BR.val === false)))
        {
            return true;
        }
    return false;
}