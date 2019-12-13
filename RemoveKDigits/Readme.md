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

Ah, this is sub-problem #2.  Problem 1 we discussed above.  how to determine which digit to delete.  But once we know, how do we do it efficiently?

We could leverage native javascript and do something like

```javascript
num.splice(i, 1);
```

This will pluck out the character at index i and return a new string without that character.  And since this is a native Javascript method, it will be quite fast.  However, it's still worst case O(n) since it fundamentally involves shifting non-deleted elements.  But again, it will be very fast in most modern browsers.















## Solution 1

Ok, so we're ready for solution 1, which isn't especially fast.  But later, I'll show how, with one simply tweak, we can speed it up considerably.

```javascript
function removeKdigits(num, k)
{
    // First, convert num from a string to an array.
    // Why? So we can set individual num = [...num];
    for (let i = 0; i < k; i++)
    {
        const j = findIndexToDelete(num);
        num[j] = -1;
    }

    const strBuffer = [];
    for (let i = 0; i < num.length; i++)
    {
        if (num[i] !== -1)
        {
            if (num[i] === '0' && strBuffer.length === 0) continue;
            strBuffer.push(num[i]);
        }
    }

    return strBuffer.length > 0 ? strBuffer.join('') : '0';
}

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


Full code available in [solution1.js](solution1.js)

Alternative version available in [solution2.js](solution2.js)


