/*

Solution 1-B
This solution is slow and unimpressive (but about twice as fast as 1-A)

*/

var numSubarraysWithSum = function(A, S)
{
	let sums = [];
	let count = 0;

	A.forEach((n,i) =>
	{
		const sum = n + (sums[i-1]||0);
		if (sum === S)
		{
		count++;
		}
		sums.push(sum);
	});

	let i = 0;
	for (let m = 0; m < sums.length; m++)
	{
		for (let n = m + 1; n < sums.length; n++)
		{
			const sum = sums[n] - sums[i];
			if (sum > S) break;
			if (sum === S)
			{
				count++;
			}
		}
		i++;
	}

	return count;
};