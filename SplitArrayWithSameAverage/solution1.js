var splitArraySameAverage = function(A)
{
	if (A.length < 2) return false;

	let sum = A.reduce((a,b) => a+b);
	if (sum == 0) return true;

	const targetMean = sum / A.length;

	const possibilities = [];
	for (let i = 1; i < A.length; i++)
	{
		let s = targetMean * i;
		s = Math.round(s * 10000)/10000;

		if (Number.isInteger(s))
		{
			possibilities.push({ sum: s, qty: i });
		}
	}

	A.sort((a,b) => a-b);
	for (p of possibilities)
	{
		if (kSum(A, p.sum, 0, p.qty)) return true;
	}

	return false;    
};

function kSum(nums, sum, i, k)
{
	if (k == 1) return nums.indexOf(sum) >= 0;
	
	if (k == 2)
	{
		let j = nums.length-1;
		while (i < j)
		{
			const s = nums[i] + nums[j];
			if (s == sum) return true;
			else if (s < sum) i++;
			else if (s > sum) j--;
		}
		return false;
	}

	let last = -1;
	for (let x = i; x < nums.length; x++)
	{
		if (nums[x] == last) continue;
		last = nums[x];

		if (kSum(nums, sum - nums[x], x+1, k-1)) return true;
	}

	return false;
}