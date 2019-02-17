function minDistance(word1, word2)
{
	return minDistCount(word1, word2, 0, 0, {});
}

function minDistCount(word1, word2, i, j, memo)
{
   	let key = `${i}:${j}`;
	if (memo[key] !== undefined) return memo[key];

	if (i === word1.length && j === word2.length) return 0;

	if (word1[i] === word2[j])
	{
		let m = minDistCount(word1, word2, i+1, j+1, memo);
		memo[key] = m;
		return m;
	}

	if (j === word2.length)
	{
		let m = 1 + minDistCount(word1, word2, i+1, j, memo);
		memo[key] = m;
		return m;
	}

	if (i === word1.length)
	{
		let m = 1 + minDistCount(word1, word2, i, j+1, memo);
		memo[key] = m;
		return m;
	}

	let replace = minDistCount(word1, word2, i+1, j+1, memo);
	let del = minDistCount(word1, word2, i+1, j, memo);
	let ins = minDistCount(word1, word2, i, j+1, memo);

	let m = 1 + Math.min(replace, del, ins);
	memo[key] = m;
	return m;
}