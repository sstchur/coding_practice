/*

Solution 1-A
This solution is slow and unimpressive

*/

var numSubarraysWithSum = function(A, S)
{
	let sums = [];
	let count = 0;

	A.forEach((n,i) =>
	{
		const sum = n + (sums[i-1]||0);
		if (sum === S) count++;
		sums.push(sum);
	});

	for (let i = 0; i < sums.length; i++)
	{
		for (let j = i+1; j < sums.length; j++)
		{
			const subtract = sums[i];
			const sum = sums[j]-subtract;
			if (sum === S) count++;
			sums[j] = sum;
		}
	}

	return count;
};