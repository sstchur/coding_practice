# Edit Distance

[https://leetcode.com/problems/edit-distance/](https://leetcode.com/problems/edit-distance/)

---
Given two words word1 and word2, find the minimum number of operations required to convert word1 to word2.

You have the following 3 operations permitted on a word:

```
Insert a character
Delete a character
Replace a character
```

```
Example 1:

Input: word1 = "horse", word2 = "ros"
Output: 3
Explanation: 
horse -> rorse (replace 'h' with 'r')
rorse -> rose (remove 'r')
rose -> ros (remove 'e')
```
---

## My thoughts

First, I should probably say that I don't have any original thoughts on this.  Lest you think I am brilliant (not that any of you do or would anyway), I must sheepishly admit that I only know how to solve this problem because of Tushar Roy's coaching.  If you haven't yet, you should check out his YouTube channel: [Coding Made Simple](https://www.youtube.com/user/tusharroy2525/)

The Edit Distance problem is also know as Levenshtein Distance. It's the minimum number of single character edits (inserts, deletions, or replacements) needed to tranform one word into another.

So, how do we solve this?  If you haven't experience this problem before, it probably isn't obvious. You could, I'm sure, approach this "bottom up" (like the cool kids say) and do it with dynamic programming.

True to form, I prefer top down recursion, and then we'll turn it into dynamic programming by memoizing it.

## Key Insights

Perhaps the first "ah ha" moment you need to have (there are several) is that you *don't actually have to transform one string into the other.*  This made sound obvious to some of you (it wasn't to me at first), but it's an important point.  You only need to determine:

1. If two characters are are equal?
2. Is it required for you to insert a character?
3. Is it required for you to delete a character?
4. If you have multiple options, which is cheapest?

Maybe that still doesn't explain it very well, so hopefully an example will help.  I'll use the example leetcode uses.

```
word1 = horse
word2 = ros
```

We start by examining the first character in each string: h and r.  We see that they are not equal.  We have many options at this point. We could delete h, we could insert an r, or we could replace h with r.  Which should we choose?

Well, we do not know which will lead to the best result, we must examine them all and choose the cheapest.  In pseudo code, it'd be something like this:

```
let cost = min(del, ins, rep);
```

What are del, ins, and rep?  Those are the costs of each operation.  I haven't (yet) included the code for them (we'll get there).

## Don't just try all three operations unconditionally

We must be careful not to *always* run all 3 operations and take the cheapest.  Why?  Because there are cases, where the *only* operation that makes any sense is delete, and there are other cases where the *only* operation that makes any sense is insert.

Suppose we have:

```
ros
rosx
```

Once we have compared r with r, o with o, and s with s, we're at a point where replace does not make any sense and neither does delete.  If we attempt to use them recursively, we will be trying them forever. For instance, no matter how many deletes I make to 'ros' (once we've passed the s), I will never transform that word into 'rosx.' In fact, it doesn't even even make sense to try to delete (or replace for that matter) since there is no character to delete or replace (once we've passed the s).

So we'll need to special case those two scenarios.

## How to determine characters are the same, and when we're done

And we'll need to consider two other cases.  The first is when both characters are the same, and the second is if we're all done (that is, we've completed transforming word1 into word2).

Determining when both characters is the same is pretty easy.  We'll have a pointer for the current character in word1 (call it i) and one for the current character in word2 (call it j).

If word1[i] == word[j], we know both characters are the same, and we can move on to checking the next characters (i.e. advance both pointers).

To determine if we've actually completed transforming word1 into word2, we can check that our i pointer has reached the end of word1 *and* that our j pointer has reached the end of word2.

## Another "ah ha" moment

If your face is scrunched up at this point, wondering how word1 could be one length, and word2 be a differnt length, and still claim that we've successfully transformed word1 into word2 (if their respective character pointers have reached the ends of each word), don't feel bed.  It's a little weird to think about, but remember, it isn't necessary to actually transform the words to solve this problem.  We need only determine the minimum number of edits to make it happen.

Let's return to a simple example:

```
word1 = rosx
word2 = ros
```

Pointer i starts at r in word1, while pointer j is at r in word2.  We'll see that they are equal and move each pointer up by 1.  So i will be 2 and j will be 2 and we'll compare o with o.  So far so good.  Then i will be 3 and j will be 3 and we'll see that s is equal to s.

At this point, i will move to 4 and j will move to 4.  But there is nothing at word2[j]! And that's ok! It simply means that something must be deleted from word1. 

Deletion from word1 can be as simply as advancing the i pointer.  Hopefully you can see why.  I reiterate that we do not actually have to transform word1 into word2. It's enough to know that a delete was needed.  In this case, a delete will advance the i pointer, and i will be equal to word1.length.  The j pointer had previously been equal to word2.length, so both pointers now equal the length of their respective strings.

And that means we're done! One edit (a delete) was all it took.

## Write some damn code already

Ok ok, I know I've babbled on a lot with this one. Let's start building out the function.  We have a few cases that are pretty each to code. Our function will be recursive, and it will return a number which is the minimum number of edits required:

``` javascript
function minDistCount(word1, word2, i, j)
{
	// we're done
	if (i === word1.length && j === word2.length) return 0;

	// chars are the same
	// no edits = no cost
	// simply advance the points and call again
	if (word1[i] === word2[j])
	{
		return minDistCount(word1, word2, i+1, j+1);
	}

	// when j pointer equals word2's length,
	// it means a delete is required from word1
	if (j === word2.length)
	{
		// we can "delete" from word1, by advancing the i pointer.
		// this costs 1 edit, hence the 1 +
		return 1 + minDistCount(word1, word2, i+1, j);
	}

	// when i pointer equals word1's length,
	// it means an insert is needed in word1
	if (i === word1.length)
	{
		// we'll insert the correct character (obviously),
		// and after having done so, both chars will be the same,
		// so "inserting" just means advancing the j pointer.
		// this costs 1 edit, hence the 1 +
		return 1 + minDistCount(word1, word2, i, j+1);
	}

	// at this point, we have to test all 3 options

	// after "replace", both chars will be same, so advance both
	let replace = minDistCount(word1, word2, i+1, j+1);

	// del means advance i
	let del = minDistCount(word1, word2, i+1, j);

	// insert means advance j
	let ins = minDistCount(word1, word2, i, j+1);

	// all edits cost 1, and we want the "cheapest"
	return 1 + Math.min(replace, del, ins);
}
```

This should do it, for the most part.  We'll need to call our minDistCount helper function from leetcode's mandatory minDistance function, but that's trivial.

But we'll be slow right now.  We're recusring down the same paths many times, so there is opportunity to memoize here, and we should.

The easiest way is to use a hash and create a key out of i and j, like:

``` javascript
let key = `${i}:${j}`;
```

If that makes you feel yucky, you could opt to create a 2-dimensional array (or in Javascript an array of arrays).  That works too.  It is, I think slighly faster, but I'm going to go with the hash because it is easy to understand.  Here's the revised helper function (with comments removed and memoization added), along with the main function that calls it.

```javascript
function minDistance(word1, word2)
{
	return minDistCount(word1, word2, 0, 0, {});
}

function minDistCount(word1, word2, i, j, memo)
{
   	let key = `${i}:${j}`;
	if (memo[key] !== undefined) return memo[key];

	if (i === word1.length && j === word2.length) return 0;

	if (word1[i] === word2[j])
	{
		let m = minDistCount(word1, word2, i+1, j+1, memo);
		memo[key] = m;
		return m;
	}

	if (j === word2.length)
	{
		let m = 1 + minDistCount(word1, word2, i+1, j, memo);
		memo[key] = m;
		return m;
	}

	if (i === word1.length)
	{
		let m = 1 + minDistCount(word1, word2, i, j+1, memo);
		memo[key] = m;
		return m;
	}

	let replace = minDistCount(word1, word2, i+1, j+1, memo);
	let del = minDistCount(word1, word2, i+1, j, memo);
	let ins = minDistCount(word1, word2, i, j+1, memo);

	let m = 1 + Math.min(replace, del, ins);
	memo[key] = m;
	return m;
}
```

According the leetcode, it's a touch faster when using an array of arrays to memo, rather than a hash.  I suspect that the bottom up dynamic programming approach is probably faster still, but I prefer this approach in terms of explanation.  Perhaps I will revisit this bottom-up at some point, but for now, I'm happy with this solution, as I feel I understand it well.

Full solution available in solution1.js





