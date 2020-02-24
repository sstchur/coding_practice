/*

Solution 2
This solution is fast and beats 90-96% runtime and 100% for memory

*/

var numSubarraysWithSum = function(A, S)
{
	let h = -1;		// h is our starting point: between this point and i represents the number of 0s on the left
	let i = 0;		// i is the point at which a "tight" subarray begins
	let j = 0;		// j is the point at which a "tight" subarray ends
	let k = 0;		// k is point to the right of a "tight" subarray after which we don't see any more consecutive 0s

	let sum = 0;
	let count = 0;

	while (j < A.length)
	{
		sum += A[j];
		if (sum < S)
		{
			j++;
			continue;
		}

		if (sum === S)
		{
			while (A[i] === 0 && i < j) i++;

			if (k <= j) k = j+1;
			while (A[k] === 0 && k < A.length) k++;

			const leftZeros = i-h-1;
			const rightZeros = k-j-1;
			count += 1 + leftZeros + rightZeros + leftZeros*rightZeros;
		}

		h = i;
		sum -= A[i++];
		j++;
	}

	return count;  
};