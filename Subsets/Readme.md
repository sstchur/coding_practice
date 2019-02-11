# Subsets

[https://leetcode.com/problems/subsets/](https://leetcode.com/problems/subsets/)

---
Given a set of distinct integers, nums, return all possible subsets (the power set).

Note: The solution set must not contain duplicate subsets.

---

## My thoughts

This can be done without bit manipulation.  In fact, my first instinct would be to do it *without* bit manipulation.  But using bits is clever and interesting to think about.  For the non bit manipulation solution, see the file: solution2.js

Regarding solving this with bits...

Observe what happens when you count in binary:

```000
001
010
011
100
101
110
111
```

Here we have 8 numbers in total, the numbers 0 through 7.  What do you notice about them?  What you should notice is that all the subsets have been considered (if you think of each 1 as “include this thing and 0 as “exclude this thing”).

Suppose, you’re considering all the subsets of {A,B,C}.

You can think of 000 as the empty set (that is, exclude A, exclude B, exclude C).

The next number, 001, would mean: exclude A, exclude B, include C.

For completeness, here are the rest

```
010 = exclude A, include B, exclude C
011 = exclude A, include B, include C
100 = include A, exclude B, exclude C
101 = include A, exclude B, include C
110 = include A, include B, exclude C
111 = include A, include B, include C
```

The great thing about this is that generating the series of numbers 0 through 7 (or 000 through 111), is as easy as counting!  It’s just a loop from 0 to 7!

```javascript
for (let i = 0; i < 7; i++)
{
     // we’ve just generated all the subsets: 000 through 111 😊
}
```

The only thing left to do is figure out how to check during each iteration, which bits are set and include the corresponding elements in the set we’re considering.

There are a number of ways to determine if a bit is set. The basic idea is to AND the bit you want to check with the number 1.  Or, another way to think about it is to AND some power of 2 with the number that contains the bit you want to check.  If this sounds confusing or abstract, an example may help.

Suppose you have the binary number 1001. There are 4 bits there. To ensure we're speaking the same language, I'm going to number them from 1 to 4 from *right to left*.

```
4321
1001
```

The first bit is that one all the way to the right.  The second bit is the one to the left of the first bit, and so on.

*Disclaimer:* I don't know if most people number/label the bits this way, and I don't especially care.  All that really matters is that we have some language of referring to each bit and that we're consistent in doing so.

To check if the 1-bit is set, we can simply AND with 1

```javascript
1001 & 0001
```

If we get 1, the 1-bit is set.  How do we check if the 2-bit is set?  One option is to take the number 1 and left shift it 1 place, giving us 2 (or 0010) which we can then AND with our number:

```javascript
1001 & 0010
```

In this case, we'll discover that the 2-bit is *not* set.

We can continue left-shifting 1 to check all of the bits.

Another option, is to right shift the number itself and always AND with 1.  Since the 1-bit is aligned with 1 to start with, we'll actually right-shift by one *less* than the bit we want to check.

For example, to check if the 3-bit is set, we'll right shift our number by 2 and then AND that with 1

```javascript
0010 & 0001
```

We will discover that the 3-bit is *not* set.

We now have a general way of determining if a bit in a number is set.  Here's one way (not the only way) one might write this function:

```javascript
function isSet(n, bit)
{
    n = n >> bit-1;
    return (n & 1) === 1;
}
```

In this case, I chose to right-shift the number and AND that with 1 to see if the result is 1.  I could have chosen to left-shift the bit in order to align it with the bit in the number I wanted to check.  Either way works (and I'm sure a better coder than I could enlighten me on yet more ways to do this).

## Generating subsets

Ok, the real problem is here how to generate subsets.  A good first step is to determine *how many* subsets there will be.  If you didn't know, the answer is 2^n, where n is the number of elements in your complete set.  I would suggest that you simply memorize this.  Suppose you're considering all the subsets of { 6, 7, 8 }.

There are 3 elements in that set, therefore, there will be 2^3 = 8 total subsets.  Conveniently, the numbers 0 through 7 (000 through 111) are perfect representations of each subset.  If this doesn't make sense to you, go back to the beginning of this article and re-read where the part where I enumerate all the binary representations of 1 through 7 and where I explain how 1 mean "include" and 0 means "exclude."

Since generating the numbers 0 through 7 is trivial (it's just a loop after all), the only things left to do is write the inner-logic for that loop.  Specifically, for each number in the range 0 through 7, we'll generate 1 subset.  What goes into the subset will be determined by which number (0 through 7) is being considered.

## Determining which elements belong in a set

Let's write a function that takes a number, n, and based on that number, generates a set.  We'll consider the binary representation of n and for each bit in n which *is* set, we'll include an element, only if its index corresponds to a set bit in n.  An example will help illustrate.

```
  1, 2, 3
{ A, B, C }
```

The element, A, is at index 1, B at 2, and C at 3 (yes, I know arrays are 0-indexed, but this is trivial for you to deal with).  For each number 0 through 7 (000 through 111), we will include A only if the 1-bit is set; we'll include B only if the 2-bit is set, and we'll include C only if the 3-bit is set.

Here's what it looks like:

```javascript
function generateSet(n, things)
{
    return things.filter((k, i) => isSet(n, i+1));
}
```

Suppose n = 101, and things = [ A, B, C ]. The return value will then be an array which includes A, excludes B, and includes C.  

All that's left now, is to run our generateSet function once for every number in the range 0 through 7.

```javascript
var subsets = function(things)
{
    let r = [];
    let total = 1 << things.length
    while (total--)	// looping forward would have been fine too
    {
        r.push(generateSet(total, things));
    }    
    return r;
};
```

Full code available in solution1.js


