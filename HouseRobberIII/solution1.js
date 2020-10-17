var rob = function(root)
{
    const options = traverse(root);
    return Math.max.apply(null, options);
};

function traverse(n)
{
    if (!n) return [0, 0];

    const left = traverse(n.left);
    const right = traverse(n.right);

    const option1 = left[1] + n.val + right[1];
    const option2 = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);

    return [option1, option2]; 
}