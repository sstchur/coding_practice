# Remove K Digits

[https://leetcode.com/problems/remove-k-digits/](https://leetcode.com/problems/remove-k-digits/)

---
Given a non-negative integer num represented as a string, remove k digits from the number so that the new number is the smallest possible.

Notes:
- The length of num is less than 10002 and will be ≥ k.
- The given num does not contain any leading zero.


Example 1:
```
Input: num = "1432219", k = 3
Output: "1219"
Explanation: Remove the three digits 4, 3, and 2 to form the new number 1219 which is the smallest.
```

Example 2:
```
Input: num = "10200", k = 1
Output: "200"
Explanation: Remove the leading 1 and the number is 200. Note that the output must not contain leading zeroes.
```

Example 3:
```
Input: num = "10", k = 2
Output: "0"
Explanation: Remove all the digits from the number and it is left with nothing which is 0.
```
---

## My thoughts

This problem really boils down to a two sub-problems. Quite obviously, we have to remove K digits from the string. So the two problems we need to solve are:
- How do we find out which digits (characters) to remove?
- How do we efficiently remove them, since strings are usually immutable? 

The basic shell of the solution could be as simple as this (and in fact, this is what I did for my first solution):

```javascript
function removeKdigits(num, k)
{
    num = [...num];
    for (let i = 0; i < num.length; i++)
    {
        const j = findIndexToDelete(num);
        num[j] = -1;
    }

    // loop through num, skipping over -1 (deleted elements) and
    // construct a new string to be returned
}
```

This is pretty simply to grasp (I think).  We first convert the string to an array of characters.  Then we loop through that array, and call a helper function to find the index of the character that needs to be deleted.  We'll do this k times, since we must remove k digits.  Removing a digit is equivalent to marking it with a -1.  

At the end, we'll need to write some more code that will loop through and construct a new string that omits any deleted characters (with one caveat around 0s, which I'll get to later).

I've glossed over a detail, which is the implementation of *findIndexToDelete(..)*.  How, exactly, do we do this?


## Finding the index of the character to delete

If we only need to remove a single character (say k = 1), observe which character that ought to be in the following string:

```
"1364219"
```

You could try removing each and every character one by one, look at the resulting string and see which is smallest.  But that's wasteful; you can do better.

In the string "1364219", the character you want to remove in order to create the smallest number would be the "6" (index 2). Intuitively, you want the smallest value digits on the left. We know we must reduce the size of the string (by 1 in this case), which means we'll end up with a string of length 6.  Keeping the digits in relative order, it should be obvious that 134xxx is always going to be smaller than 136xxx. 

Any other digit you choose to remove would leave either a larger digit in place of the 3 (not helpful), or would leave the 6 where it currently is (also not helpful since removing it would result in a smaller digit (the 4) taking its place, which is preferrable).

## What is technique then?

The technique is to itereate the characters in the string from left to right, looking for "points of decrease."  When you find such a point, the character right **before** the decrease point is that character you want to delete.  In the example "1364219", the point at which we first see decreasing numbers is from 6 to 4.  This means the 6 is the character we want to remove.

If k > 1 (i.e. you have multiple digits to remove), simply repeat this process.

## What about repeated digits?

Repeated digits are not a problem.  The technique says to look for "decreasing points" (in other words, any point at which the array stops being non-decreasing). Take "1355541" as an example. From 1 to 3 is non-decreasing, from 3 to 5 is non-decreasing, from 5 to 5 is non-decreasing, again from 5 to 5 is non-decreasing. Finally, from 5 to 4 is **NOT** non-decreasing.  It is, obviously, very **de**creasing.  Which means that the digit before the 4 is the one we want to remove.

## What if we never find a decreasing point?

Then we want to remove the right-most digit.  For example: in "13579" we'll want to remove the 9.  Or another example: if we have "33333" then we want to remove the right-most 3 (of course it doesn't matter *really* matter which 3 we remove, but it's helpful to think about removing the right-most one since that is what we do for *any* case that involves a series of digits that never decrease).

## What about zeros?

Suppose you have an input string like "10000".  In this case, you obviously want to remove the 1.  But this will leave you with "0000" which is not an answer you can return.  There is no number, 0000, there is only 0, so you must return "0" in this case.  We can special case this at the end.

## What about removing all digits?

The problem statement says that if you end up with an empty string to return "0" which is pretty easy to handle.  In fact, if you want to, you can make a micro-optimization and if the length of the input string == the input variable *k*, you can simply return "0" (the problem statement says *k* will never be greater than the length of the string).

## How do we delete individual digits from the string efficiently?

Ah, this is sub-problem #2.  Problem #1 we discussed above: how to determine which digit to delete?  But once we know, how do we do it efficiently?

If the input were an array, we could leverage native javascript and do something like

```javascript
num.splice(i, 1);
```

This will pluck out the character at index i and return a new string without that character.  And since this is a native Javascript method, it will be quite fast.  However, it's still worst case O(n) since it fundamentally involves shifting non-deleted elements.  But again, it will be reasonably fast in most modern browsers.

However, the input isn't an array, so it would need to be converted. So you've got two bits of unnecessary work going on if you do that, plus use the splice idea. We want better, if for no other reason that the idea of unnecessarily shifting elements around when you delete one is completely offensive!

Converting the input to an array is "okay" (it's done only once, up front) so we'll use that as part of solution #1, but as we'll see later, even that can be avoided.

But ok, we've converted our input to an array.  Now what?  How do we delete while avoiding shifts?  One option is to mark the index of the deleted item by changing its value to something that can't be part of the original input (for example: -1).

In this way deleting the 3rd element from:

```javascript
[ 3, 4, 8, 1, 3, 4, 5, 6 ]
```

Would result in:

```javascript
[ 3, 4, -1, 1, 3, 4, 5, 6 ]
```

This is, after all, very very fast, and at the end, once we've marked all items that need to be deleted, we can make a final pass through the array, constructing a new, output array which omits the -1s.

Here's what's the code looks like (with the function *findIndexToDelete* omitted for now (I will explain it below):

## Solution #1 - Acceptable ##

```javascript
function removeKdigits(num, k)
{
    // First, convert num from a string to an array.
    // Why? So we can set the value of specific incdices
	// to -1 to signify deletion
	num = [...num];
    
	// loop k times, since that's how many digits we need to delete
	for (let i = 0; i < k; i++)
    {
		// find the next index to delete and update the value at
		// that index to -1 (to signify deletion)
        const j = findIndexToDelete(num);
        num[j] = -1;
    }

	// build a new output array to hold the final answer
    const strBuffer = [];

	// loop through the num array, skipping deleted items (-1s)
    for (let i = 0; i < num.length; i++)
    {
        if (num[i] !== -1)
        {
			// gotcha: need to also omit leading 0s
			// if our output array contains nothing,
			// and the current value is 0, skip it to
			// avoid leading 0s in the final output
            if (num[i] === '0' && strBuffer.length === 0) continue;
            strBuffer.push(num[i]);
        }
    }

	// if the strBuffer isn't empty, convert it to a string and return
	// otherwise, just return 0
    return strBuffer.length > 0 ? strBuffer.join('') : '0';
}
```

## What about the *findIndexToDelete* method?

It's pretty straight forward. We iterate through the entire array from the beginning, skipping over deleted items as we go.  We also keep track of the last value and the lastIndex.  This is important.  We never want lastIndex to point at something that's been deleted, so we only update it if we haven't skipped this iteration.  This is why we cannot simply using the looping variable *i* and instead need a separate variable, *lastIndex* to track that.

If at any point, we discover that last > current, we've found a decreasing point, which means we can bail out and return lastIndex!

*Note: iterating from the beginning of the array every time is inefficient and unnecessary.  We'll see how to improve this in Solutions 2 and 3*

```javascript
function findIndexToDelete(arr)
{
    let lastIndex = -1;
    for (let i = 0; i < arr.length; i++)
    {
        const current = arr[i];
        const last = arr[lastIndex] || -Infinity;

        if (current === -1) continue;

        if (last > current)
        {
            return lastIndex;
        }

        lastIndex = i;
    }

    return lastIndex;
}
```

So that's solution #1. You can find the full code for it here: [solution1.js](solution1.js)

It's an ok solution. It makes sense and it's fairly easy to understand and code, but we can do better.  In fact, just one small tweak will speed it up considerably.

## Solution #2 - Good (Tell *findIndexToDelete* where to start) ##

If you consider a few examples, you'll realize that you don't need to go back to the beginning every time you want to find the next index to delete.  You only need to go back one, **unless** going back one would land you on a deleted element, in which case, you need to keep cycling backwards until you hit a non-deleted element.  Here's what that might look like:

```javascript
const j = findIndexToDelete(num, start);
start = j-1;
while (num[start] === -1)
{
	start--;
	if (start < 0)
	{
		start = 0;
		break;
	}
}
```

See what we've done?  We simply go back one from the index returned by the *findIndexToDelete* function. If (and while) that happens to be a -1 (a deleted item) we just keep going back by one.  If we reach 0, we stop, obviously, since 0 is the left-most index we can possibly access.

Now, one small tweak to *findIndexToDelete* so that it accepts a start argument, and we're all set:

```javascript
function findIndexToDelete(arr, start)
{
    let lastIndex = -1;
    for (let i = start; i < arr.length; i++)
    {
        const current = arr[i];
        const last = arr[lastIndex] || -Infinity;

        if (current === -1) continue;
        
        if (last > current)
        {
            return lastIndex;
        }

        lastIndex = i;
    }

    return lastIndex;
}
```

Nothing terribly difficult here.  It's exactly the same code as before with the only change being that we iterate starting from the *start* variable, rather than from 0!

This solution is available in full in [solution2.js](solution2.js)

## We can still do better! (Solution #3) ##

Suppose we didn't have to convert the input string to an array in the first place?  That's a micro-optimization.  It's not a **huge** speed boost, but if we can avoid it, we might as well.  Turns out we can.  We can simply use another structure to record which indicies were deleted.  A Set is perfect for this!

Further, we could avoid the case where backtracking involves repeatedly skipping over deleted items if we knew precisely what item to jump back to. We can't track this with a single variable though, becasue there may be gaps.  Consider the following:


```javascript
//0  1  2  3  4  5  6  7  8  
[ 1, 4, 3, 2, 3, 4, 8, 5, 7 ]
```

After deleting 3 elements, you'll be left with:

```javascript
//0  1  2  3  4  5  6  7  8  
[ 1, X, X, 2, 3, 4, X, 5, 7 ]
```

The last element you'd have deleted here is the 8 (at index 6), which means your starting point for the next search is index 5.  If you continue deleting elements, you'll see that the element you need to delete "jumps" (not sure if that makes sense, but if you try to track this with just a single variable, you will quickly see that it doesn't work).

One solution is to use a stack in concert with *left* and *right* pointers. The idea is this: We will start by comparing the elements at left pointer and right points (which are initially set to index 0 and index 1, respectively).  As long as *num[left] <= num[right]* we can continue advancing the pointers.

We advance *left* by setting it to *right*, and we advance *right* by incrementing it. When this process cannot proceed any further, we've found a decreasing point, so we add the *left* index to our *deletions* Set.  Here's a snippet:

```javascript
while (num[left] <= num[right])
{
	left = right;
	right++;
}
deletions.add(left);
```

Now, we also need to use that stack I mentioned previously. As long as our *left* pointer is >= 0 **and not** in our *deletions* Set, we'll push it into our stack (this will help us track where we need to "jump" back to should we delete an item, move back one and encounter an already-deleted item.

However, before doing that, we need to check if the index of the item we just added to the *deletions* Set is also at the top of our stack.  If so, we'll want to pop it off the top of the stack.  Like so:

```javascript
// advance both pointers as long as we're non-decreasing
while (num[left] <= num[right])
{
	left = right;
	right++;
}

// mark left index for deletion once we've found a decreasing point
deletions.add(left);

// if the index we just marked for deletion is the top of the stack, pop the stack
if (stack[stack.length-1] === left)
{
	stack.pop();
}

// move back one
left--;

// if the left pointer is valid (>=0) and not already deleted,
// push it into the stack so we know where to go back later
if (left >= 0 && !deletions.has(left))
{
	stack.push(left);
}
// however, if deletions DOES contain left, and if the stack isn't empty,
// left will move back to the index at the top of the stack
else if (deletions.has(left) && stack.length > 0)
{
	left = stack[stack.length-1];
}
// if left hasn't been deleted, both pointers can simply be advanced
else
{
	left = right;
	right++;
}
```

That's the basic idea. The only thing missing now is to wrap this logic in a loop that run *k* times, so that we do this once for each element that needs to be deleted.

And then finally, we'll loop through the characters in the *num* string a final time, skipping over elements in the *deletions* Set, like we did in prior solutions.

This solution available in full in [solution3.js](solution3.js)

## We can **stil** do better! (Solution #4) ##

*Disclaimer: The above three solutions are 100% mine. I didn't receive help from anyone in coming up with them, nor did I look at the Leetcode dicsussion.  The same cannot be said of this next solution. This next solution is 90% my own, but the idea for it was sparked by looking at submitted solutions that had better runtimes than my solution #3.  Must give credit where credit is due!*

All of the three solutions above are simliar in concept in that they each determine which elements to **delete** and proceed to return a new string which has the deleted items omitted.

This next solution goes the opposite direction.  Instead of determine which items to delete, we strive to determine which items to **keep**.

This subtle change affords us the ability to:

1. Avoid making a final pass that skips omitted elements and avoids leading zeros
2. Gives us a way to prevent leading zeros from even being included in the first place

We again use a stack, and we aggressively push an item into it as long as it is greater than the item that came before it.  However, once we realize that that was a mistake (because the next item creates a decreasing point) we will pop the stack!  That's the basic idea, but there are a few details that need to be dealt with in order to make it all work.

Here's the full code with comments:

```javascript
function removeKdigits(num, k)
{
	if (num.length <= k) return '0';

	// stack beings with the first element already in it
	const stack = [num[0]];

	let current = num[1];
	let prev = num[0];

	// loop over all items in num, starting at 1
	for (let i = 1; i < num.length; i++)
	{
		// loop as long as there are more items to delete
		while (k > 0)
		{
			// as long as we're non-decreasing...
			while (current >= prev)
			{
				// push the current item into the stack (just make sure that
				// if the stack is empty, that we're not pushing a leading zero
				if (current > 0 || stack.length > 1) stack.push(current);

				// advance prev and current
				prev = current;
				current = num[++i];
			}

			// found a decreasing point, so pop the stack
			stack.pop();

			// set prev back to the element on the top of the stack
			prev = stack[stack.length-1];

			// unless that's undefined (in which case we can just use -Infinity)
			if (prev === undefined) prev = -Infinity;

			// reduce k as we now have one less item to delete
			k--;
		}

		// After we've deleted everything we need do, we still need to add
		// any remaining items from num, into the stack.
		// BUT, we need to be sure that if the stack is empty, we aren't adding
		// any leading zeros.
		// AND, we need to be sure that even if the stack is not empty, that
		// we aren't attempting to add elements beyond the length of num
		if (stack.length === 0) 
		{
			if (num[i] > 0) stack.push(num[i]);
		}
		else
		{
			if (num[i] >= 0) stack.push(num[i]);
		}
	}

	// finally, return the stack (joined into a string), or if that would be
	// empty string, just return 0
	return stack.join('') || '0'
}
```

And there we go.  Hopefully the comments make it clear.

Full solution available in [solution4.js](solution4.js)




