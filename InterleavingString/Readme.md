# Interleaving String

[https://leetcode.com/problems/interleaving-string/](https://leetcode.com/problems/interleaving-string/)

---
Given strings s1, s2, and s3, find whether s3 is formed by an interleaving of s1 and s2.

An interleaving of two strings s and t is a configuration where they are divided into non-empty substrings such that:

```
s = s1 + s2 + ... + sn
t = t1 + t2 + ... + tm
|n - m| <= 1
```

The interleaving is s1 + t1 + s2 + t2 + s3 + t3 + ... or t1 + s1 + t2 + s2 + t3 + s3 + ...

```
Example 1:

Input: s1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"
Output: true
Explanation: "aa" (s1) + "dbbc" (s2) + "b" (s1) + "ca" (s2) + "c" (s1) yields s3
```

```
Example 2:

Input: s1 = "aabcc", s2 = "dbbca", s3 = "aadbbbaccc"
Output: false
Explanation: No possible way to interleave s1 and s2 to create "aadbbbaccc"
```

```
Example 3:
Input: s1 = "", s2 = "", s3 = ""
Output: true
Explanation: "" (s1) + "" (s2) yields s3
```

---

## My thoughts

This feels recusive. It feels backtracky. It feels dynamic-programmy. I sence that this will require recursion + memo or a bottom-up DP technique. Recusion tends to come more naturally to me, so that's the direction I decided to go.  I like to draw the recursive tree on my white board to make things clear to me. Here's a digital representation of what I drew for Example 1:

## The recursive tree

```preserve
Target string = aadbbcbcac

      aabcc : dbbca =>
            |
       abcc : dbbca => a
            |
        bcc : dbbca => aa
            |
        bcc : bbca => aad
        /         \
    cc:bbca       bcc:bca => aadb
      |           /      \
  cc:bca     cc:bca     bcc:ca => aadbb
    |          |           |
   c:bca      c:bca     bcc:a => aadbbc
    |          |           |
   c:ca       c:ca       cc:a => aadbbcb
  /    \     /    \        |
  :ca   c:a  :ca  c:a     c:a => aadbbcbc
  |      |   |     |       |
  X     c:   X    c:      c:  => aadbbcbca
         |         |       |
         :         :       :  => aadbbcbcac

```
**Level 1**

Hopefully my tree makes sense to you. Starting from the top, we've got *s1* (<kbd>aabcc</kbd>) and *s2* (<kbd>dbbca</kbd>), and the => denotes that we've not yet chosen any characters from either *s1* or *s2*, so we have no interwoven output string yet.

**Level 2**

We look at the available characters in both strings. We have <kbd>a</kbd> from *s1* and <kbd>d</kbd> from *s2*. Since our target is the <kbd>a</kbd> from <kbd>aadbbcbcac</kbd>, our only option is to pick the <kbd>a</kbd> from *s1*.

**Level 3 and 4**

The next level of the tree is similar. We need another <kbd>a</kbd> which we can only get from what's left of *s1* (<kbd>abcc</kbd>). And following that, we need a <kbd>d</kbd> which we can only get from what's left of *s2* (<kbd>dbbca</kbd>). We've just worked our way through the 4th level of the tree, and so far we have <kbd>aad</kbd>.

**Level 5**

Now, for the first time, we have two choices: either the <kbd>b</kbd> from what's left of *s1* (<kbd>bcc</kbd>) or the <kbd>b</kbd> from what's left of *s2* (<kbd>bbca</kbd>). 

I'm not going to write out an explanation for every level of the tree. Hopefully you can follow it now. At certain points in the tree, we may hit an impossibility (denoted with an <kbd>X</kbd>), which would mean returning <kbd>false</kbd>. But if we make it all the way through both strings *s1* and *s2*, **and** if we have generated the requisite interleaved string *s3*, then we'd return <kbd>true</kbd>. 

## Resursive Solution

Here's one way to code it recursively. Note that we're using memoization here to avoid duplicate work. Without memoization, this solution would TLE.

The variables *i, j,* and *k* represetions the positions within strings *s1, s2,* and *s3* respectively. That is, *s1[i]* is the *ith* character of *s1*, *s2[j]* is the *jth* character of *s2*, and *s3[k]* is the *kth* character of *s3*. We can use these positions to generate a memoization key. If you go back and look at the tree, you'll see some branches that repeat, and those repeated branches will have the same values for *i, j,* and *k*.

Beyond that, the code is fairly straight forward. If the positions of *i, j,* and *k* are such that we've made it to the end of all 3 strings, we've succeeded and can return true.

If we've reached the end of *s3* but not *s1* or *s2*, that's also condition for returning false. Similarly, if at any point, neither the character at *s1[i]*, nor the characters at *s2[j]* matches the character at *s3[k]*, that indicates an impossibility and we must return false.

Barring those condition, we either take the character at *s1[i]* (if that's the only choice) **or** the character at *s2[j]* (if **that** is the only choice).  If both are valid, we have to take both paths.

Here's the full code inline with comments.

```javascript
var isInterleave = function(s1, s2, s3)
{
    return interleaveHelper(s1, 0, s2, 0, s3, 0, new Map());
};

function interleaveHelper(s1, i, s2, j, s3, k, memo)
{
    // avoid duplicate work by returning result from memo
    // if we have it
    const key = `${i}:${j}:${k}`;
    if (memo.has(key)) return memo.get(key);
    
    let result;
    
    // if we've made through all chars in s1, s2, and s3, then
    // we've found an interleaving string
    if (i === s1.length && j === s2.length && k === s3.length)
    {
        result = true;
    }
    // Two cases here indicate failure:
    // 1. if we've made it through the interleaved string (s3), but
    // not all the way through either s1 or s2
    // 2. if at any point, neither of the characters available in
    // s1 or s3 match the character we're looking for in s3
    else if (k === s3.length && (i !== s1.length || j !== s2.length) ||
             (s1[i] !== s3[k] && s2[j] !== s3[k]))
    {
        result = false;
    }
    // if our only choice is the char at i in s3, take that
    // char and recurse
    else if (s1[i] === s3[k] && s2[j] !== s3[k])
    {
        result = interleaveHelper(s1, i+1, s2, j, s3, k+1, memo);
    }
    // if our only choice is the char at j in s2, take that
    // char and recurse
    else if (s1[i] !== s3[k] && s2[j] === s3[k])
    {
        result = interleaveHelper(s1, i, s2, j+1, s3, k+1, memo);
    }
    // if both s1[i] and s2[j] match s3[k], we'll have to check
    // both possibilities
    else 
    {
        result = interleaveHelper(s1, i, s2, j+1, s3, k+1, memo) ||
                 interleaveHelper(s1, i+1, s2, j, s3, k+1, memo);
    }
    
    // store the result in cache and return
    memo.set(key, result);
    return result;
}