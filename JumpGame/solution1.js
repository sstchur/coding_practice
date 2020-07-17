var canJump = function(nums)
{
    return canJumpTo(nums, nums.length-1);
}
    
function canJumpTo(nums, k)
{
    if (k === 0) return true;
    
    for (let i = k-1; i >= 0; i--)
    {
        if (i + nums[i] >= k) return canJumpTo(nums, i);
    }
    
    return false;
}