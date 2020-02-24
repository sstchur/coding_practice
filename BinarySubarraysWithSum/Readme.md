# Binary Subarrays With Sum

[https://leetcode.com/problems/binary-subarrays-with-sum/](https://leetcode.com/problems/binary-subarrays-with-sum/)

---
In an array A of 0s and 1s, how many non-empty subarrays have sum S?

```
Example 1:
Input: A = [1,0,1,0,1], S = 2
Output: 4

Explanation: 
The 4 subarrays are markd in parenthesis below:
[(1,0,1),0,1]
[(1,0,1,0),1]
[1,(0,1,0,1)]
[1,0,(1,0,1)]

Notes:
A.length <= 30000
0 <= S <= A.length
A[i] is either 0 or 1.
```
---

## My thoughts
This problem is a little tricky. My first attempt at this problem, over a year ago (from the time of this writing) resulted in multiple wrong answers and TLE (time limit exceeded). I've improved at these sorts of problems over the last year, so I was able to solve it this time.

At a brute force level, this problem isn't hard to understand. You probably already have an idea of how to solve it, and what you're thinking of will likely TLE.

## My first idea (TLE)

Check every possible subarray in the array and for each subarray whose sum === S, increase a counter.

Here's one way to code it:

```javascript
var numSubarraysWithSum = function(A, S)
{
    let count = 0;
    let i = A.length;
    while (i--)
    {
        count += countSubarraySumOfSpecificLen(A, i+1, S);
    }
    return count;
};

function countSubarraySumOfSpecificLen(A, len, sum)
{
    let i = 0;
    let j = len-1;
    let total = 0;
    let count = 0;
    while (j < A.length)
    {        
		total = 0;
        for (let x = i; x <= j; x++)
        {
            total += A[x];
        }
        if (total === sum) count++;
        i++;
        j++;
    }
    return count;
}
```

This code isn't very good (at least not in terms of runtime performance). We look every subarray of length n, then n-1, then n-2, etc...  For instance, if A were [1,2,3,4,5] we'll look for:

- all subarrays of length 5, of which there is only one: (1,2,3,4,5)
- then all subarrays of length 4, of which there is two: (1,2,3,4) & (2,3,4,5)
- then all subarrays of length 3, of which there is three: (1,2,3) & (2,3,4) & (3,4,5)
- then all subarrays of length 2, of which there is four: (1,2) & (2,3) & (3,4) & 4,5)
- then all subarrays of length 1, of which there is five: (1) & (2) & (3) & (4) & (5)

*Note: the problem statement only allows 0s and 1s in the input array -- the above example is only to help visually illustrate all the possible subarrays of each length*

Now, for each subarray, we can calculate the total and if the total equals S, we'll increase our counter.

This is simple and straight forward. It's also impossibly slow and won't be accepted because it will TLE, and that shouldn't be surprising since this is exponential running time.

## A year later - a different idea

I forgot all about this problem quite honestly, but I use Leetcode often (at least once a week) and sometimes when I log in and look for random problems to solve, I notice some that have a **?** next to the title.  This is how Leetcode indicates that you've tried a problem but didn't get a successful submission. Well, I noticed a **?** by this question, so I decided to look at it again. Having failed it the first time, I knew I needed a different strategy.

### What about sums?

Here's a thought. What if I were to store in memory, the sum of the subarray from 0:1, from 0:2, from 0:3 ... up to 0:n?  And then also, the subarray from 1:2, from 1:3 ... to 1:n?

You might notice something right away, which is that once you've calculate the sum from say, 0:3, the sum from 1:3 is essentially already known. Why? Because the sum from 1:3 is simply the sum from 0:3 minus the value at index 0!  Let's use the following input array as an example: *[1,0,1,0,1]*

And let's build a matrix of what the sums would look like:

```
A = [1,0,1,0,1]

    0 1 2 3 4
   ----------
0 | 1 1 2 2 3
1 |   0 1 1 2
2 |     1 1 2
3 |       0 1
4 |         1
```

Now, my first thought was simply to build and fill in this matrix.  However, this won't work; you'll run out of memory.

But if you look carefully, you'll notice that each row in the matrix is simply the proir row minus the first value in the prior row.

For example, in row 0, the first value is 1. If you substract 1 from every value in row one (except the first), you'll get all the values in the next row (row 1).

The first value in row 1 is 0. If you subtract 0 from every value in row two (except the first), you'll get all the values in the next row (row 2).

And so on.  And hopefully, it's clear that you don't actually need a matrix for this.  You can actually do it will just a simple array that you keep updating.

How does this help you find the answer? Suppose you're looking for *S = 2*. All you need to do is count how many 2s you see in the above matrix. That's your answer.

When using an array instead of a matrix that you continually update, simply increase a counter each time you encounter your target value.  

## Solution 1 - Accepted, but very slow

```javascript
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
```

We first run through all the numbers in *A* storing the sum from 0:i in the *sums* array.  As we're doing so, we may encounter our target, and if so, we'll increment our *count* variable at that time.

Second, we run a nested loop which subtracts the first value in the *sums* array (*sums[i]*) from every subsequent value in the sums array, updating *sums[j]* as we go.

*Actually, you can save an operation by not updating sums[j], and instead of looping over the sums array, looping over the original input array.  This works because the values in the original input array are precisely the values that you need to subtract from your sum, each iteration!  I ran both solutions and both are Leetcode accepted (and both are too slow to bother with)*

## Solution 2 - Micro-optimizing the sums idea. Faster, but still too slow

By observing that as you're subtracting from values in the *sums* array, there may come a point where your sum is greater than *S*.  If that happens, there is no point in continuing with **that** iteration of the inner loop, we might as well break out and save some computation.  This helps (it cuts the runtime nearly in half vs solution 1), but it's still too slow :-(

For funsies, here's the code:

```javascript
var numSubarraysWithSum = function(A, S)
{
    let sums = [];
    let count = 0;
    
    A.forEach((n,i) =>
    {
        const sum = n + (sums[i-1] || 0);
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
            if (sum < S) continue;
            count++;
        }
        i++;
    }
    
    return count;
};
```

## Solution 3 - An actual, fast solution!

Alright, now bear with me. This solution is a little hard to explain, and I'm not completely satisfied with the code -- it doesn't read as nicely as I'd like, but it does run fairly fast (Leetcode says is beats 96% for runtime and 100% for memory, 60ms).

Let's use the following as an example:

```
A = [ 0, 0, 0, 1, 1, 1, 0 ]
S = 3
```

If you focus in on the first place where you find a sum of 3, you'll see it's where you have three 1s in a row (from index 3 to index 5).

That's one (the three 1s in a row), but there are obviously more, because you can add the 0s on the left and/or the 0s on the right to get a bunch more answers: 7 more to be exact.

Is there some way to figure this out without manually counting them all?  Why yes, there is!

### What is a "tight" subarray?

Well, a "tight" subarray is just a term I made up!  So I wouldn't expect you to know what I mean.  But I'll explain. A "tight" subarray is one that sums to our target value, *S*, **and** which doesn't contain any extraneous 0s on either side.

In the example above, the subarray from index 3 to index 5 is what I'm calling a "tight" subarray that sums to 3. Note that a "tight" subarray need not be devoid of all 0s; it just cannot have extraneous 0s on either the left or the right.

If you find a "tight" subarray that sums to your target value, *S*, then you can count the number of **consecutive* 0s to its **immediate** left, and the number of **consecutive** 0s to its **immediate** right, and then use the following formula:

count = 1 + leftZeros + rightZeros + (leftZeros*rightZeros)

Don't believe me?  Try it!  Using the example above, we have three consecutive 0s immediately to the left of our "tight" subarray" and one to the right.  Therefore

```
count = 1 + 3 + 1 + (3x1) = 8
```

And 8, is indeed the answer to this problem.

### But what if S = 2?

If S = 2, we simply repeat this process for **each** tight subarray that sums to 2:

```
1 + 3 + 0 + (3x0) = 4
1 + 0 + 1 + (0x1) = 2
4 + 2 = 6
```

### The hard part

So hopefully this makes sense. Find each "tight" subarray that sums to your target value, *S*, and run the formula each time. Add up all the answers, and the total is your final answer!

The hard part though, is determining where a "tight" subarray begins and ends, and how many zeros you have on either side, and how to efficiently move from one "tight" subarray to the next without doing a bunch of unnecessary work.

Here's the code I came up with to do this. Since I used a bunch of one-character variable names, I'll explain what they mean in the comments:

```javascript
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
```

## Explanation

### Variables h, i, j and k
After initializing a bunch of variables, we proceed to iterate through the input array, *A*, using *j* as our main looping variable. Remember that *j* is where a "tight" subarray ends. As we loop, we'll build up the *sum* variable, which tells us how many 1s we have from i to j. The *sum* can only increase by (at most) 1 at a time, so we simply loop as long as *sum < S*, increasing j as necessary.

The *if (sum === S)* statement may seem unnecessary, but we need it to handle a case where the input, *S* equals 0. In that case, it's quite possible for sum to end up **larger** than *S*, which means we definitely don't want to run the formula and add to the the total *count*.

### Determining how many zeros on left and right
Once we've found a sum that equals *S*, we need to know how many 0s on the left and right. Two while loops help me accomplish this, but to be honest, I'm not especially happy with this code. It feels a little convoluted to me, but I haven't (yet) thought of a way to clean it up.

The first while loop increments *i* (the beginning of a "tight" subarray") as long as it points to a 0. This makes sense, because, by definition, "tight" subarrays cannot have extraneous 0s on their immediate left.

The second while loop is similar. It starts just beyond *j* (the end of a "tight" subarray) and increments as long as *k* points to a 0. Again, a "tight" subarray cannot have extraneous 0s on its immediate right.

With variables *h, i, j, and k* set correctly, we can now determine the number of 0s on the left and right. That part is easy, it's simply *i - h - 1* and *k - j - 1*.  We assign these values to *leftZeros* and *rightZeros*, and use them to run the formula.

### Advancing *h,* *i*, and *j*

The last piece is to advance *h*, *i*, and *j*.   Advancing *h* is easy - it just needs to jump up to where *i* is (and we make sure to do this before advnacing *i*. 

Advancing *i* means we'll be removing one digit (a 0 or a 1) from the left side of our "tight" subarray, which means that our *sum* may change. This is why we must execute the bit *sum -= A[i++]*.

Advancing *j* goes hand in hand with advancing *i*. Since we're subtracting out the value at *i* from our sum, we need to add in the value at the *next* j, which we accomplish by simply advancing *j*. Adding it to the sum will happen automatically on the next loop iteration.

## Three solutions 

Solution 1-A (slow) available in [solution1a.js](solution1a.js)

Solution 1-B (slow, but faster than 1-A) available in [solution1b.js](solution1b.js)

Solution 2 (fast) available in [solution2.js](solution2.js)
