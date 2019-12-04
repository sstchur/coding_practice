# Subsets

[https://leetcode.com/problems/replace-the-substring-for-balanced-string/](https://leetcode.com/problems/replace-the-substring-for-balanced-string/)

---
You are given a string containing only 4 kinds of characters 'Q', 'W', 'E' and 'R'.

A string is said to be balanced if each of its characters appears n/4 times where n is the length of the string.

Return the minimum length of the substring that can be replaced with any other string of the same length to make the original string s balanced.

Return 0 if the string is already balanced.

```
Example 1:
Input: s = "QWER"
Output: 0
Explanation: s is already balanced.

Example 2:
Input: s = "QQWE"
Output: 1
Explanation: We need to replace a 'Q' to 'R', so that "RQWE" (or "QRWE") is balanced.

Example 3:
Input: s = "QQQW"
Output: 2
Explanation: We can replace the first "QQ" to "ER". 

Example 4:
Input: s = "QQQQ"
Output: 3
Explanation: We can replace the last 3 'Q' to make s = "QWER".

```

---

## My thoughts
Haven't had time to write up my thoughts on this yet.  Two solutions are available, linked below.  Solutuion2 is TLE and only included for learning. Solution1 is Leetcode accepted and has some comments at the top explaining the basic idea.

Uncommented code below, links to js files below the inline code.

```javascript
function balancedString(s)
{
    const n = s.length / 4;

    const count =
    {
        Q: 0,
        E: 0,
        R: 0,
        W: 0
    };
    let total = 0;

    let i, j;

    for (i = 0; i < s.length; i++)
    {
        const c = s[i];
        if (count[c] < n)
        {
            count[c]++;
            total++;
        }
        else break;
    }

    for (j = s.length - 1; j >= 0; j--)
    {
        const c = s[j];
        if (count[c] < n)
        {
            count[c]++;
            total++;
        }
        else break;
    }

    i--;
    let best = s.length - total;

    while (i >= 0)
    {
        const leftChar = s[i];
        count[leftChar]--;
        total--;

        if (count[s[j]] < n)
        {
            while (count[s[j]] < n)
            {
                count[s[j]]++;
                total++;

                const option = s.length - total;
                if (option < best) best = option;

                j--;
            }
        }

        i--;
    }

    return best;
}
```


Full code available in [solution1.js](solution1.js)

TLE version available in [solution2_TLE.js](solution2_TLE.js)


