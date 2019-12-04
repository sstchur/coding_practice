/*
* NOTE: This solution is TLE!  Don't use it.  It may be (somewhat) useful for learning and as a though-exercise,
* but it is not efficient at all.
*
* Also, because it TLE'd on test case 29 (out of 40), I cannot be 100% sure it is "correct."  I **think** it is,
* but smarter programmers than I could probably enlighten me as to whether or not it really is.
*
*/

function balancedString(s)
{
    const n = s.length / 4;
    const count =
    {
        Q: 0,
        E: 0,
        W: 0,
        R: 0,
        total: 0
    };
    const min = {
        val: Infinity
    };

    bsHelper(s, n, 0, s.length - 1, count, min, {});
    return min.val;
}

function bsHelper(s, n, i, j, count, min, memo)
{
    const key = `${i}:${j}`;
    if (memo[key] !== undefined)
    {
        //console.log('from memo');
        return;
    }

    if (i > j) return;

    const leftChar = s.charAt(i);
    const rightChar = s.charAt(j);

    if (count[leftChar] < n)
    {
        count[leftChar]++;
        count.total++;

        const best = s.length - count.total;
        if (best < min.val) min.val = best;

        bsHelper(s, n, i + 1, j, count, min, memo);
        memo[key] = 1;

        count[leftChar]--;
        count.total--;
    }

    if (count[rightChar] < n)
    {
        count[rightChar]++;
        count.total++;

        const best = s.length - count.total;
        if (best < min.val) min.val = best;

        bsHelper(s, n, i, j - 1, count, min, memo);
        memo[key] = 1;

        count[rightChar]--;
        count.total--;
    }

    const best = s.length - count.total;
    if (best < min.val) min.val = best;
}