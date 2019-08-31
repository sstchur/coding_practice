# Consecutive Numbers Sum

[https://leetcode.com/problems/consecutive-numbers-sum/](https://leetcode.com/problems/consecutive-numbers-sum/)

---
Given a positive integer N, how many ways can we write it as a sum of consecutive positive integers?

**Note:** 1 <= N <= 10 ^ 9.

Example 1:
```
Input: 5
Output: 2
Explanation: 5 = 5 = 2 + 3
```

Example 2:
```
Input: 9
Output: 3
Explanation: 9 = 9 = 4 + 5 = 2 + 3 + 4
```

Example 3:
```
Input: 15
Output: 4
Explanation: 15 = 15 = 8 + 7 = 4 + 5 + 6 = 1 + 2 + 3 + 4 + 5
```
---

## My thoughts

I would have to say this is one of crowning achievements on Leetcode. LC called this a "hard" and I not only got it on my own, without any help or hints, but I got a solution that Leetcode says beats 100% of submitted Javascript solutions. How did I do it? I'll walk you through my thought process below.

First, I solved the problem using something or a brute force style. I didn't expect this to be super fast (and it wasn't -- it was TLE), but I feel it's always good to make sure you **can** solve the problem, even if your solution is suboptimal. It will ensure that you truly understand the problem and often, it can lead to insights you can use to make your initial solution faster.

## First Idea

Right off the bat, my intuition told me that perhaps I could somehow do this in O(logn) by repeatedly dividing the number by 2. After all, if I have an odd number and I integer divide it by two, I'll get the first of two consecutive numbers that sum to my target.  For example, if my target is 9, and I integer divide 9 by 2, I'll get 4. And 4 + 5 are consecutive numbers that sum to 9.

But since I need **all** possible consecutive number combination (not just two numbers, but if it exists, three, or four or five (or more) consecutive numbers that sum to my target.

I really couldn't get anywhere with this repeated division approach, so I abandoned it.  Why do I mention it at all?  We'll come back to it in a tangential sort of way.

## Second Idea -- TLE

My second idea was to imagine the numbers laid out in an array and use two pointers (left and right) to walk through the array, keeping a consecutive sum as I go. The left pointer represents the start of the consecutive number series and the right represents the end of it. An illustration may help:

```
[ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
     L     R
```

In the above, I have a left pointer at 2 and a right pointer at 4. You'll notice (I hope) that 2 + 3 + 4 === 9! The idea here is to keep moving the right pointer as long as my cumulative sum is less than my target. If we were to continue above, and move R to the 5, the cumulative sum would now be 14.  That's too big.  So what do we do?  We "peel" off the left side until we either find our target or the cumulative sum becomes less than the target.

In this case, 14 - 2 = 12. That's still too big, so we continue to "peel" fromt he left side. Now we have 12 - 3 = 9. We found our target again, and this time, L is at 4 and R is at 5. This means 4 + 5 === 9.

This works! However, it is not fast. That is an understandmetn in fact, because on Leetcode, it exceeds the time limit :-(

Just for funsies though, here is the code:

(**NOTE: this is not the solution you want if you're just looking for the code -- the "good" solution is further down**)

```javascript
// Slow solution - TLE on LeetCode
var consecutiveNumbersSum = function(N)
{
    if (N === 1) return 1;
    
    let left = 1;
    let right = 1;
    let sum = 0;
    let count = 0;
    while (true)
    {
        sum += right;
        if (sum <= N)
        {
            if (sum === N) count++;
            right++;
            continue;
        }
        
        while (sum > N)
        {
            sum -= left++;
            if (sum === N) count++;
        }
        
        if (left === N) break;
        
        right++;
        
    }

    return count;
};
```

## Third idea - My Crowning Achievement!

I decided to go back to the white board. I threw out everything I had done up to this point and decided to just do some maths.

What I've done below is just basic algebra, but perhaps my thought process requires some explanation. To make this more concrete, let's assume our target number is 15 (the answer for 15 is 4, I will tell you that up front).

Further suppose, that I have exactly **two** numbers that sum to 15. We can represent this as follows:

```
A + B = 15
```

And what do we know about A and B? There is a very clear relationship between them (because of the problem statement). Hopefully it's obvious to you. It's that B = A + 1. It has to because the numbers must be consecutive. Therefore, we can substitute and get the entire equation in terms of A.

```
2A + 1 = 15
```

Ok fine, but how does this help us?  To be honest, when I first started doing this, I wasn't sure. But I decided to keep pushing it. What if I have exactly **three** numbers that sum to 15?

```
A + B + C = 15
```

Again, what do we know?  We know that C = B + 1, so we can substitute:

```
A + B + B+1 = 15
```

And what do we also know about B? That's right, it's A + 1, has to be, since the number must be consecutive.

```
A + A+1 + A+1 + 1 = 15 ==> 3A + 1 = 15
```

Let's keep going:
```
A + B + C + D = 15
A + B + C + C+1 = 15
A + B + B+1 + B+1+1 = 15
A + A+1 + A+1+1 + A+1+1+1 = 15
4A + 6 = 15
```

And we'll keep going:
```
A + B + C + D + E = 15
A + B + C + D + D+1 = 15
A + B + C + C+1 + C+1+1 = 15
A + B + B+1 + B+1+1 + B+1+1+1 = 15
A + A+1 + A+1+1 + A+1+1+1 + A+1+1+1+1 = 15
5A + 10 = 15
```

What's the pattern here?  Well, obviously, each time, the coefficient of A increases by 1; that much is clear.  But what about the constant? Look carefully and you'll see that however many A's you had last time, you'll have that many more 1s to add to your constant.  For eample:

```
For 3 numbers: A + B + C = 15, we got:
3A + 3 = 15

For 4 numbers: A + B + C + D = 15, we'll have:
1 additional A (so 4A) and
3 additional 1s (so 6 total), or:
4A + 6 = 15
```

## What does it all mean??

How does **any** of this help or lead to a solution? 

Why don't we try solving for A in each of these equations?

```
2A + 1 = 15
2A = 14
A = 7; therefore 7 + 8 are my consecutive numbers that sum to 15
```

How about the next one:
```
3A + 3 = 15
3A = 12
A = 4; therefore 4 + 5 + 6 are consecutive numbers that sum to 15
```

What about 4A + 6?
```
4A + 6 = 15
4A = 9
A = 4.5; 4.5 is not an integers; this one doesn't work!
```

5A + 10?
```
5A + 10 = 15
5A = 5
A = 1; 1 + 2 + 3 + 4 + 5 = 15, this one works!
```

6A + 15?
```
6A + 15 = 15
6A = 0
A = 0; 0 + 1 + 2 + 3 + 4 + 5 = 15, this works, EXCEPT!
```

Except: the problem statement says "consecutive positive integers."  This means, we need not go any further.  In fact, we didn't even need to go 6A + 15.  We can stop when the  constant equals the target.

How many of the formulas worked? If you were counting along, you'd have gotten 3. The 3 that worked were:

```
2A + 1
3A + 3
5A + 10
```

But we know the answer is 4. What gives? Well, there's one I didn't bother to write.  That one is:

```
1A + 0 = 15
1A = 15
A = 15
```

Yes, 15 alone is a "consecutive" series of positive integer(s) that sums to 15.  That's our 4th, so we've gotten the answer for 15.

## The code already, the code!

Alright, so how do we translate this into code?  Well, we use a generic formula, like:

```
kA + b = N
```

Where k is the number of As,  b is the constant, and N is our target number.  We can begin with k = 2 and b = 1 which would give us:

```
2A + 1 = N
```

Then we simply solve for A and see if it turns out to be a whole number integer.  If so, we found a working forumla and we increase a global count variable.

We then move to the next formula by calculating the new b, which will be, b += k, and then increasing k by 1.

Here's what the full code looks like:

```javascript
var consecutiveNumbersSum = function(N)
{
    let count = 0;
    
    let k = 2;
    let b = 1;
    
    while (b < N)
    {
        if (((N-b) % k) === 0) count++;
        b += k;
        k++;
    }
    
    return count+1;
};
```
### One final note

If you're wondering why I return *count + 1;* instead of just *return count;* remember back to the explanation where I mentioned that there is one formula I didn't bother writing: 1A + 0 = N.  We already know that *N* is always going to account for at least 1 of the answers.  So we can start our logic with the 2A + 1 formula, and simply hard code the +1 when returning our final answer!

This makes Leetcode happy and performs very well.

Full code in raw form here:
[solution1.js](solution1.js)