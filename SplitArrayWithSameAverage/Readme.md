# Split Array With Same Average

[https://leetcode.com/problems/split-array-with-same-average/](https://leetcode.com/problems/split-array-with-same-average/)

---
In a given integer array A, we must move every element of A to either list B or list C. (B and C initially start empty.)

Return true if and only if after such a move, it is possible that the average value of B is equal to the average value of C, and B and C are both non-empty.

Example:
```
Input: 
[1,2,3,4,5,6,7,8]
Output: true
Explanation: We can split the array into [1,4,5,8] and [2,3,6,7], and both of them have the average of 4.5.
```

Notes:
- The length of A will be in the range [1, 30].
-  A[i] will be in the range of [0, 10000].

## My thoughts

This is a hard problem.  At least, I thought it was hard.  I had no clue how to solve it at first, other than "just try everything."  But you'll quickly see that that's basically a non-starter in terms of efficiency.

I didn't write a single line of code for this problem for a few days.  I spent time playing with the math on my white board for 10 min here, 20 min there, over the course of several days before I began to develop a framework for a general solution.

I tried a variety of ideas, including:

1. Start with two empty lists. Add one item to one list and see if the means are the same. If not, try to figure out the "best" number to add to the other list to keep the means the same (or as close as possible). This got me nowhere.

2. Start by splitting the original array in half and compare the means.  Try to determine which number should be moved from one list to the other in order to "close the gap" in means between the two lists.  This also got me nowhere.

3. Research some properties of the arithmetic mean (like if you add a constant to each observation, then the mean increases by that constant).  Similarly, if you subtract a constant from each observation, multiply or divide, the mean is adjusted accordingly.  This also got me nowhere. 

4. Try some algebra based on:  (A1 + A2 + ... + An) / n = (B1 + B2 + ... + Bm) / m
While this is true, there are just far to many unknowns here for it to be useful.

## The first observation that proved useful

We're given the example of [ 1, 2, 3, 4, 5, 6, 7, 8 ] and told that it should return true because this list can be split into [ 1, 4, 5, 8 ] and [ 2, 3, 6, 7 ].  Each of those lists has a mean of 4.5.

Observe that the mean for [ 1, 2, 3, 4, 5, 6, 7, 8 ] is also 4.5!  Does that mean I can take any list of numbers, and if it's possible to break it into two smaller lists such that their means are equal, the mean of each list will be equal to the mean of the original list?

Turn out it does!  I'm not going to mathematically prove this to you (mostly becuase I am not good a mathematical proofs) but here are a few examples of this phenomenon in action:

**Example A:**

[ 3, 5, 2, 2, 1, 4, 4, 5 ] has a mean of 3.25 (26 / 8)

I can break this list down into [ 1,4,4,5 ] and [ 2,2,4,5 ] both of which have a mean of 3.25.

**Example B:**

[ 6, 2, 2, 5, 4, 1, 1 ] has a mean of of 3 (21 / 7)

I can beak this list down into [ 2, 4 ] and [ 1, 1, 2, 5, 6 ] both of which have a mean of 3.

There's actually another option here two: [ 1, 2, 6 ] and [ 1, 2, 4, 5 ], both of which have a mean of 3.

## So how does knowing the Target Mean help?

Knowing the target mean of the two lists: A and B, is very useful.  If I know what the mean of each list must be, then really, the problem boils down to: is there a set of numbers such that the mean of that set will equal the target mean (if so, the leftover set of numbers must **also** equal the target mean).  And if there is no such set of numbers, then it is not possible to split the list into two smaller lists with equal means, so we return false.

The above probably needs some additional explanation.  If we can find a set of numbers whose mean equals the target mean (ignore for the moment **how** to do this), how do we know that the remaining set of numbers has the same mean?

Math. Suppose we have 7 numbers: [ 6, 2, 2, 5, 4, 1, 1 ].  We've already established that the target mean is 3 (that is the sum of all numbers divided by 7).  In order to achieve a mean of 3 with only integers (which is all I have available), I need multiples of 3 that divide evenly by some integer.  For example: 6/2, or 9/3, or 12/4, or 15/5, etc.  How else can you achieve a mean of 3?

How far can we push this?  If we know the target mean (3), and if we know the total number of numbers (7), and we know the *smallest* possible list we can create (a list with just 1 item), then we effecitively know all the possibilities!

## This is a kSum problem in disguise

This problem boils down to what is effectively a kSum problem.  Have you ever solved [Two Sum](https://leetcode.com/problems/two-sum/) or [Three Sum](https://leetcode.com/problems/3sum/)?  Well, if you can solve those, you should be able to extend the solution to solve kSum.

The kSum problem would be: given an integer value k, a target sum, and a list of integers, determine if it's possible to form the sum with exactly k numbers.

For example:
```
input = [ 1, 2, 4, 3, 5, 6, 2 ]
k = 4
sum = 11
```
Are there 4 numbers whose sum equals 11? Yes: 6, 2, 2, 1

How does this help?  Let's return to the problem at hand with the input: [ 6, 2, 2, 5, 4, 1, 1 ].  We know the target mean must be 3.  We know we must split the list into two smaller lists.  How many items will be in each list?  Here are all the possibilities:

```
List A: 1 item, List B: 6 items
List A: 2 items, List B: 5 items
List A: 3 items, List B: 4 items
```

## Ok, but how is this a kSum problem?

Let's take another example: [ 3, 5, 2, 2, 1, 4, 4, 5 ].

The target mean for the above input is 3.25. There are 8 numbers in that list.  We must split the list into two lists with fewer numbers than 8 and more than 0.  That could be:

- 1 number and 7 numbers
- 2 numbers and 6 numbers
- 3 numbers and 5 nuumbers
- 4 numbers and 4 numbers

**However**, several of those combinations can be completely eliminated!  A list with 1 number is out.  How are you going to have a list with just one integer in it and have the mean be 3.25?  You can't.

If your list has 2 numbers, then those 2 numbers must sum to 6.5 in order to have a mean of 3.25.  But that's also impossible.  What two *integers* can you add together to get 6.5?

If your list has 3 numbers?  Still impossible.  The 3 numbers would need to total 9.75.

How about a list with 4 numbers?  Ah! Now we have a *possibility*. Four numbers would need to sum to 3.25*4 = 13.  It's totally possible to have 4 numbers that sum to 13.

Now, whether or not the necessary numbers exist in the original list is a different question.  In fact, it's the question we need to answer!  And you'll note that it's effecticely a kSum problem!

Are there k=4 numbers that sum to 13 in the list [ 3, 5, 2, 2, 1, 4, 4, 5 ]?
Turns out there are, so for this input, we would return true.  If there weren't, we would return false, but that's only because we already confirmed that the combinations of 1:7, 2:6, 3:5 were not feasible.  We cannot simply stop early and return false if we find one of the combinations to be non-feasible, or (even if it is feasible) if we determine that no such kSum exists.  We must try all the combinations in order to confidently return false.

We can of course, return true early if we find anything that works.

## What does the code look like?

Let's start with the code that makes use of kSum, but I'll omit the implementation of kSum for now and come back to that later. (The code isn't that long - it just looks long because I've added a lot of comments for clarity).

```javascript
var splitArraySameAverage = function(A)
{
	// if we don't have at least 2 element, we cannot possibly split
	// the list into two *non-empty* lists, return false
	if (A.length < 2) return false;

	// determine the sum of all numbers
	let sum = A.reduce((a,b) => a+b);

	// if the sum is 0, and we have at least two numbers, return true
	if (sum == 0) return true;

	// determine the target mean
	const targetMean = sum / A.length;

	// determine what k:sum possibilities exist
	// for example, 1 number that sums to 3, or 2 numbers that sum to 6, etc...
	const possibilities = [];
	for (let i = 1; i < A.length; i++)
	{
		// the sum is simply the targetMean multiplied by some integer
		let s = targetMean * i;

		// --See *Note below code--
		// it must be a whole number integer though, and because of Javascript's
		// floating point numbers, we can't simply multiple and check Number.isInteger
		// (we would end up with a number like 29.000000000000004)
		s = Math.round(s * 10000)/10000;

		// if targetMean x some integer is a whole number,
		// we've found a possibility that we need to test (the sum
		// is s, and the k (or quantity) is i
		if (Number.isInteger(s))
		{
			possibilities.push({ sum: s, qty: i });
		}
	}

	// There are a few solutions to kSum, but one technique involves working
	// on a sorted list, so we do that first, before iterating through
	// the possibilities
	A.sort((a,b) => a-b);
	for (p of possibilities)
	{
		// for each possibility, we check if there exists k (or qty) numbers
		// which sume to exactly p.sum (possibility.sum)
		if (kSum(A, p.sum, 0, p.qty)) return true;
	}

	// no kSum succeeded, so return false
	return false;    
};
```

> ### *Note:
> This is a floating point math issue.  All Javascript numbers are IEEE 754. Without getting into the details, it means that you can multiple a fraction like 29/7 which is exactly (4 1/7) by a multiple of 7 and NOT get a prefect whole number o_O.  In your favorite Javascript console, try
>
> (29 / 7) * 7
>
>The output will be 29.000000000000004.  Of course, mathematically, the answer *should* be exactly 29.0.  In our code, we need to treat 29.000000000000004 *as if it were* exactly 29.  How?  We can't just round or truncate, because we'll end up including or excluding some values that we shouldn't.  One way is to first multiply by a large factor of 10, round that, and then divide by the same factor.

## Ok, what about kSum?

Well, this article isn't really about kSum, so my explanation will be brief.  But I will provide the code for it, and the full code at the bottom.

Before solving kSum, let's think about TwoSum and how a sorted list of numbers helps solve that problem:

[ 1, 2, 2, 4, 6, 7, 9, 9, 10 ]

Suppose we're looking for a sum of 13.  We begin by using two pointers, one on the left, starting at 0 and the other on the right, starting at length-1.  The first two values we'd encounter would be *1* and *10* whose sum is *11*.  That's smaller than we're looking for, so which pointer should we move?

Obviously, we need our sum to increase, but we want to do so by the smallest possible amount.  That means increasing the left pointer, so that we're now adding *2* and *10*.  Now we have 12.  Closer, but still not what we want. If we increase our left pointer again, we'll find another *2*.  Not helpful, so let's keep doing. 

We're now at *4* and *10* which sums to *11*.  Too big this time, so now we need to *decrease* our right pointer.

Finally, we're at *4* and *9* which sums to 13, so we've found an answer.

Now, this only explains how to solve the problem for TwoSum.  We need to extend it for kSum.  Rather the explain this (this post is long enough alrady), I'm just going to past the code for kSum, with a few comments.  Hopefully it will make sense to you.

```javascript
function kSum(nums, sum, i, k)
{
	// if k is 1, then we just need to determine if the sum exists at all
	if (k == 1) return nums.indexOf(sum) >= 0;

	// if k is 2, we have a TwoSum problem, solve that using
	// the two pointer concept
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

	// if k > 2, we can solve this resursively
	let last = -1;
	for (let x = i; x < nums.length; x++)
	{
		// no need to recursively call kSum if nums[x] is a repeat
		// of the last number we encountered -- just continue in that case
		if (nums[x] == last) continue;
		last = nums[x];

		// Call kSum, reducing the target sum by nums[x], reducing k by 1,
		// and increasing the pointer at which kSum will start searching (x+1).
		// If kSum returns true, bail out early for perf 
		if (kSum(nums, sum - nums[x], x+1, k-1)) return true;
	}

	// no collection of k elements found that sum to the given sum
	return false;
}
```

So hopefully this makes sense.  We simply leverage the concept I explained for TwoSum, but we expand it through recursion to work for kSum.

We can now put all the code together.  You'll find the raw Javascript (sans comments) below.

```javascript
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
```

Full solution available in [solution1.js](solution1.js)