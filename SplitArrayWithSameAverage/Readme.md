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

1. Start with two empty lists. Add one item to one list and see if the means are the same. If not, try to figure out the "best" number to add to the other list to keep the means the same (or as close as possible). This got me nowhere

2. Start by splitting the original array in half and compare the means.  Try to determine which number should be moved from one list to the other in order to "close the gap" in means between the two lists.  This also got me nowhere.

3. Research some properties of the arithmetic mean (like if you add a constant to each observation, then the mean increases by that constant).  Similarly, if you subtract a constant from each observation, multiply or divide, the mean is adjusted accordingly.  This also got me nowhere. 

4. Try some algebra based on:  (A1 + A2 + ... + An) / n = (B1 + B2 + ... + Bm) / m
While this is true, there are just far to many unknowns here for it to be useful.

## The first observation that proved useful

We're given the example of [ 1,2,3,4,5,6,7,8] and told that it should return true because this list can be split into [ 1,4,5,8 ] and [ 2,3,6,7 ].  Each of those lists has a mean of 4.5.

Observe that the mean for [ 1,2,3,4,5,6,7,8 ] is also 4.5!  Does that mean I can take any list of numbers, and if it's possible to break it into two smaller lists such that their means are equal, the mean of each list will be equal to the mean of the original list?

Turn out it does!  I'm not going to mathematically prove this to you (mostly becuase I am not good a mathematical proofs) but here are a few examples of this phenomenon in action:

**Example A:**

[ 3, 5, 2, 2, 1, 4, 4, 5 ] has a mean of 3.25 (26/8)

I can break this list down into [ 1,4,4,5 ] and [ 2,2,4,5 ] both of which have a mean of 3.25.

**Example B:**

[ 6, 2, 2, 5, 4, 1, 1 ] has a mean of of 3 (21/7)

I can beak this list down into [ 2,4 ] and [ 1, 1, 2, 5, 6 ] both of which have a mean of 3.

There's actually another option here two: [ 1,2,6 ] and [ 1,2,4,5 ], both of which have a mean of 3.

## So how does knowing the Target Mean help?

Knowing the target mean of the two lists: A and B, is very useful.  If I know what the mean of each list must be, then really, the problem boils down to: is there a set of numbers such that the mean of that set will equal the target mean (if so, the leftover set of numbers must **also** equal the target mean).  And if there is no such set of numbers, then it is not possible to split the list into two smaller lists with equal means, so we return false.

The above probably needs some additional explanation.  If we can find a set of numbers whose mean equals the target mean (ignore for the moment **how** to do this), how do we know that the remaining set of numbers has the same mean?

Math. Suppose we have 7 numbers: [ 6, 2, 2, 5, 4, 1, 1 ].  We've already established that the target mean is 3 (that is the sum of all numbers divided by 7).  In order to achieve a mean of 3 with only integers (which is all I have available), I need multiples of 3 that divide evenly by some integer.  For example: 6/2, or 9/3, or 12/4, or 15/5, etc.  How else can you achieve a mean of 3?

How far can we push this?  If we know the target mean (3), and if we know the total number of numbers (7), and we know the *smallest* possible list we can create (a list with just 1 item), then we effecitively know all the possibilities!

## This is a kSum problem in disguise

This problem boils down to what is effectively a kSum problem.  Have you ever solved two sum or three sum?  Well, if you can solve those, you should be able to extend the solution to solve kSum.

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

Let's start with the code that makes use of kSum, but I'll omit the implementation of kSum for now and come back to that later.

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

		// it must be a whole number integer though, and because of Javascript's
		// floating point numbers, we can't simply multiple and check Number.isInteger
		// (we would end up with a number like 29.00000005
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
```
