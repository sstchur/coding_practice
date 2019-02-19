function firstMissingPositive(nums)
{
	for (let i = 0; i < nums.length; i++)
	{
		let n = nums[i];
		slot(nums, n);
	}

	for (let i = 0; i < nums.length; i++)
	{
		if (nums[i] !== i+1) return i+1;
	}
	return nums.length + 1;
}

function slot(nums, n)
{
	if (n < 1 || n > nums.length || nums[n-1] === n) return;

	let tmp = nums[n-1];
	nums[n-1] = n;
	slot(nums, tmp);
}