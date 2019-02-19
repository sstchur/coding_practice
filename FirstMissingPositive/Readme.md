# First Missing Positive

[https://leetcode.com/problems/first-missing-positive/](https://leetcode.com/problems/first-missing-positive/)

---
Given an unsorted integer array, find the smallest missing positive integer.

```
Example 1:

Input: [1,2,0]
Output: 3
Example 2:

Input: [3,4,-1,1]
Output: 2
Example 3:

Input: [7,8,9,11,12]
Output: 1
Note:

Your algorithm should run in O(n) time and uses constant extra space.
```
---

## My thoughts
I came up with this solution on my own so yay me!  Leetcode classifies it has a "hard" problem, so double yay me.

If you prefer the recursive solution, see [solution1.js](solultion1.js)

If the recursive nature of my "slot" function makes you uncomfortable, check out [solution2.js](solution2.js)

At first, I thought this problem sounded kinda easy, but the more I tried naive solutions on a white board, the more I realize that it was rather tricky.

The key insight that eventually hit me was that I have an array of length n, and if it were fill with *all* the positive number from 1 to n, then each number would occupy its "rightful" spot in the array.  By that I mean, that the number 1 would be in the 1st position, number 2 in the second position, 3 in the 3rd and so forth.

If any number between 1 and n were missing, then the corresponding spot in the array would *not* hold the correct number.  For instance, if n = 5, but the 3 is missing, the array might look like this:

```
[ 1, 2, 11, 4, 5 ]
```

The first missing positive number is 3, and if we look to the index that should contain 3 (index 2), we'll see that it does *not* hold 3.  Rather, it holds 11. Since we found something other than 3 where we should have found a 3, we know what the missing number is. It's index + 1, which is 3.

Of course, this only works when every number that *can* occupy its "rightful" spot, *does.* That's not the input we're given (unfortunately), but is there a way we can turn our given array into one that looks like the above in O(n) time with constant extra space?

## I've made up a term. I call it "slotting"

The idea that occurred to me is to iterate over the array and "slot" each number into its "rightful" position. Easy with extra memory, but with only constant extra space?  What do you do with the number that already occupies that spot?  Before I answer that, consider the possibilities.

For each number we encounter, one of three things will be true:

1. The number cannot be slotted and should simply be ignored
2. The number can to be slotted (and what's currently occupying its "rightful" position is something that can be ignored)
3. The number needs to be slotted, but that which occupies its "rightful" position *also* needs to be slotted.

## Slotting: case 1
The first case is the easiest because some numbers don't have a "rightful" position (these are the ones that can be ignored).

Negative numbers for instance, would not have anywhere to go. You cannot slot -5 into index -5, since there is no index -5.

Similarly, numbers larger than n also do not have a "rightful" position. You cannot slot 10 into its "rightful" position in an array of size 5 (because there is no index 10 when the array length is only 5).

## Slotting: case 2

Sometimes, you'll encounter a number that needs to be slotted and it's trivial to do so because that which occupies its "rightful" position is something that falls into case 1 *or* is something that we've *already* slotted into its "rightful" position.  In either situation, we're free to overwrite the target index.

Here's an example:

```
[ 3, 4, -1, 1 ]
```

In the above list, the number 3 belongs in the 3rd position (index 2).  Index 2 contains a -1 which can be overwritten.

When we later encounter the last element in the array (the 1), we'll see that it belongs at the first position (index 0). Index 0 doesn't contain something that we'd normally overwrite, but in this case, we can, because the 3 has already been slotted into its rightful position

## Slotting: case 3

The third case is when we must slot a number, but that which occupies its "rightful" position *also* needs to be slotted. We have options here. We could slot recursively or we could swap and *not* advance in the array.

I quite like the recursive approach for its simplicity and elegance, but it's not as efficient as the swapping.

The recursive approach could kick off a "flurry" (so to speak) of slot calls.

Take the following example:

```
[ 4, 3, 2, 5, 1 ]
```

The number 4 must go where 5 is, but the number 5 must go where 1 is. Meanwhile, 1 must go where 4 is. A single recursive call to slot the 4 would take care of all of these by calling itself multiple times. It would eventually stop of course (because we'll include a base case).

Then we'd move on to slotting the 3 which would kick off a call to slot the 2, at which point we'd be done.

*You might not like this recursive approach. I had a friend challenge me claiming that the recursive nature of it made the overall solution not pure O(n). I'm not sure I agree with that since subsequent (admittedly unnecessary slot calls) will just result in a no-op, but if you feel that way, checkout [solution2.js](solution2.js) which doesn't use recursion.*

## The code

If we understand the basics here, this code is dead simple to write. At least everything other than the slot function is, and even that isn't too hard.

```javascript
function firstMissingPositive(nums)
{
	// slot every number that can be slotted into its "rightful" position
	for (let i = 0; i < nums.length; i++)
	{
		let n = nums[i];
		slot(nums, n);
	}

	// make a second pass through the array, looking for the first spot that doesn't hold the correct number
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
```

Full code available in [solution1.js](solution1.js)

For a non-recursive solution see [solution2.js](solution2.js)
