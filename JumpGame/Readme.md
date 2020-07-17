# Jump Game

[https://leetcode.com/problems/jump-game/](https://leetcode.com/problems/jump-game/)

---
Given an array of non-negative integers, you are initially positioned at the first index of the array.

Each element in the array represents your maximum jump length at that position.

Determine if you are able to reach the last index.

Example 1:
```
Input: nums = [2,3,1,1,4]
Output: true
Explanation: Jump 1 step from index 0 to 1, then 3 steps to the last index.
```

Example 2:
```
Input: nums = [3,2,1,0,4]
Output: false
Explanation: You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.
```

Notes:
* 1 <= nums.length <= 3 * 10^4
* 0 <= nums[i][j] <= 10^5
---

## My thoughts

This style of problem comes up every so often.  I immediately identified it as recursive in nature (though I'm sure you can solve it without recursion).  In my head (and on my whiteboard) I drew out a tree, where the values of *nums[i]* represents the number of recursive calls you're going to make. For a small setup of input, and for values of *nums[i]* that aren't very big, this is no big deal.  But you might quickly realize that if *nums[i]* is say, 5817, that's a **lot** of extra calls.

## Attempt 1 (TLE)

Start at index 0, as per problem statement.  Call a recursive function that takes the *nums* array, and an integer, *i*, indicating where you currently are in the array.  If *i === nums.length-1* you've reached the end, and you can return *true*.  If not, grab the value of *nums[i]*.  If it's 0, you return *false*.  If no, then in a loop, make additional calls to your recursive function, checking to see if any of them return true.  If not, you'll return false.

Here's what it looks like.  It's correct.  It's also *impossibly* slow.

```javascript
var canJump = function(nums)
{
    return canWin(nums, 0);
}

function canWin(A, i)
{
    if (i === A.length-1) return true;

    let j = A[i];
    if (j === 0) return false;
    while (j--)
    {
        if (canWin(A, i+j+1)) return true;
    }
    return false;
}
```

You could probably tell without even running it that this is going to be slow for large inputs.  I knew it would be, but gave it the 'ol Leetcode submit just to validate that it would TLE as I suspected (it does).

## Attempt 2 (Accepted)

You might be able to memoize the above solution, but that's not what I did.  Instead, I thought of starting from the end and check to see if it were possible to *arrive* at that position from some prior position.  If not, then I can quite early and return false.  If so, then call my function recursively from the new (prior) position.  It's very straight-forward:

```javascript
var canJump = function(nums)
{
    return canJumpTo(nums, nums.length-1);
}
    
function canJumpTo(nums, k)
{
    if (k === 0) return true;
    
    for (let i = k-1; i >= 0; i--)
    {
        if (i + nums[i] >= k) return canJumpTo(nums, i);
    }
    
    return false;
}
```

The function *canJump* simply asked "can we jump to k?" where k is the last element in the *nums* array.  The function *canJumpTo* works backwards.  If you reach the starting index (index 0), then of course the answer is 'yes.'  Prior to that, you have to check and see if it would have been possible to reach index k.  How do you determine that?  You cycle backwards from *k-1* and check to see if the index of that spot, plus its value, would get you to (or past) *k*. If not, we go back one more index and check again.  If we check all prior indices and none would allow me to reach *k* then this ain't gonna work (and we return *false*).  However, if **any** index would, in fact, allow me to reach *k*, then we have a chance.  We won't know until we move backwards to that index and call *canJumpTo* again.  But if we're able to do this repeatedly and eventually reach index 0, voilà!

Full solution is also shown above, but here it is in a stand alone file if that's the way you like it: [solution1.js](solution1.js)
