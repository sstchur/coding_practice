/*

This is very similar to solution1.js, but it does not use recursion.
Instead we make a pass through the nums array, slotting positive numbers
where they belong, considering each of the 3 cases I outline in the 
Readme.md

If a number is negative or greater than the nums array's length, we can ignore it.

If a number needs to be slotted and the targetIndex (its "rightful" position)
is before, i (the index of the number of our current iteration), or if the
targetNum (the to-be-overwritten number) can, in fact, be safely overwritten,
we overwrite it, increment i and continue the loop.

If neither of the above two cases plays out, we swap i with targetIdx without
incrementing i, and loop again.

*/

function firstMissingPositive(nums)
{
	let i = 0;
	while (i < nums.length)
	{
		let n = nums[i];
		if (n < 1 || n > nums.length || nums[n-1] === n)
		{
			i++;
		}
		else
		{
			let targetIdx = n-1;
			let targetNum = nums[targetIdx];
			if (targetIdx < i || targetNum < 1 || targetNum > nums.length)
			{
				nums[targetIdx] = n;
				i++;
			}
			else
			{
				swap(nums, i, targetIdx);
			}
		}
	}

	for (let i = 0; i < nums.length; i++)
	{
		if (nums[i] !== i+1) return i+1;
	}
	return nums.length + 1;
}

function swap(nums, i, j)
{
	let tmp = nums[i];
	nums[i] = nums[j];
	nums[j] = tmp;
}