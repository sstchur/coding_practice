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

Let's start with what didn't work.

## First idea - split the array in half

At first I thought "maybe I just arbitrarily split the array in half (call one list A and the other B), calculate the mean of each, see what their difference is, and then try to strategically move an item from one list to the other to close the mean gap."

This sounds useful at first, but it mostly leads nowhere.  First of all, it's a bad assumption that you'll only have to move one item from list A to B or vice versa.  For simplicity, that's what I tried.  If I couldn't find a single item that would make the mean difference between the two lists zero, I figured I'd pick the item that closed the gap the most.  But this is arbitrary and not guaranteed to be helpful at all!  

## Second idea - start with two empty lists and build up, trying to keep their means the same

Ok, so how about we start with two empty lists.  We add an item to one list and then we check the mean of each.  Then we determine what number we need to add to the other list in order to keep the mean the same.  For example, suppose you have:

```
[ 1, 2, 3, 4, 5, 6, 7, 8 ]
```

Now suppose you put 1 in list A.  What would you have to put in list B to achieve a mean of 1?  Well, you need a 1, and you don't have one available. So I guess, you put the next best thing: a 2.  Now your means differ.  List A has a mean of 1, while List B has a mean of 2.  Is there someone I could add to either list to make them the same?  Sure, I could add a 3 to list A.  Then I'd have (1+3)/2 which is 2, and then of course, List B already has a mean of 2.

But if you try to keep going in this manner, you'll find that you end up in a situation where you still at least one number left to place in either List A or B, but doing so will not yield you equal means.  But that doesn't mean it can't be done!  It just means you have the wrong items in the wrong lists (in this case).

Perhaps, instead of limiting yourself to placing just one number in a list, you could consider swapping numbers, and or swapping two for one or some such.  But this quickly gets out of control.

## Third idea -- more maths

The given example of [ 1, 2, 3, 4, 5, 6, 7, 8 ] says that it should return true, b/c the list can be split into two lists, each of which have a mean of 4.5.  Where did 4.5 come from?  Of course it is the sum of items in list A divided by the number of items in List A.  In this example, List A and List B happen to have the same number of items, but this doens't have to be the case (and often isn't).

Is there some way I can know the target mean for List A and List B from the get-go?  There is!  It turns out, that the target mean for List A and List B (if the problem is solvable) is going to be the same as the mean for the original list.

The mean of [ 1, 2, 3, 4, 5, 6, 7, 8 ] is 4.5, and so are the means for Lists A and B that it got broken into to solve the sample problem.

This holds true for any list of numbers!  **If** you **can** split the list into two smaller lists whose means are equal, then the mean of each list will be the same as the mean of the original list.

