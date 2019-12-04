/*
* Basic idea is as follows.
* 
* Step 1: Keep a count of each letter as we travel from left to right, but if at any point
* increasing the count of a letter could cause its count to go beyond n (length of string divided by 4)
* then bail out of the process.
*
* Step 2: Repeat step 1 but this time from right to left (using the same count hash.
*
* Step 3: Record the best option found so far
*
* Step 4: "Unravel" the left-most recorded character and see if that allows for "capturing" right-side
* characters that we were previously unable to capture.  If so, continue capting right-side characters
* until we can no longer do so. Each iteration, update the best variable, if applicable.
* Decrease the left points (i) by one and repeat this process until i is less than zero. 
*
* Leetcode accepted
*/

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

