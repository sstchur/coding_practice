# Remove Zero Sum Consecutive Nodes from Linked List

[https://leetcode.com/problems/remove-zero-sum-consecutive-nodes-from-linked-list/](https://leetcode.com/problems/remove-zero-sum-consecutive-nodes-from-linked-list/)

---
Given the head of a linked list, we repeatedly delete consecutive sequences of nodes that sum to 0 until there are no such sequences.

After doing so, return the head of the final linked list.  You may return any such answer.

(Note that in the examples below, all sequences are serializations of ListNode objects.)

```
Example 1:**
Input: head = [1,2,-3,3,1]
Output: [3,1]
Note: The answer [1,2,1] would also be accepted.

Example 2:
Input: head = [1,2,3,-3,4]
Output: [1,2,4]

Example 3:
Input: head = [1,2,3,-3,-2]
Output: [1]
```
---

## My thoughts

Leetcode calls this a "medium" problem.  [Daily Coding Problem](https://www.dailycodingproblem.com/) calls it an "easy."  I'm pretty sure it's more like a "medium" for most people.  I definitely thought it was harder than "easy" but perhaps I am missing something.  I have a solution that is accepted and beats about 80% (sometimes, depending on runtime variance).  But I'll admit that I don't know if this is a great solution.  It does have the advantage of being (I think) fairly straight-foward and easy to understand, while also being relatively little code.  But again, maybe there is a better solution, and I just don't know it yet.

So how do we do this?  The first thing I considered was that I could keep a cumulative sum and anytime I encountered a zero, that was a signal that I could remove a bunch of nodes.  And that's true for a case where a bunch of numbers sum to some value, and then a bunch more reduce it back to zero exactly, as in this example:

```
1 -> 2 -> -3 -> 8 -> 2
```
In this case, 1+2 sums to 3, and then you have -3, so that's 0, and then you're left with just 8 -> 2.  Makes sense.  But what about this case:

```
8 -> 2 -> -2 -> 3
```
In this case, you have a 2 and a -2 right in the middle, which obvious sums to 0 and needs to be removed.  However, if you keep a cumulative sum from the beginning, you'll get: 8, 10, 8, 11.  There are no zeros in there, so what is your signal that something needs to be removed?




A -> B -> C -> D -> E -> null
p1        p2
```

Pointer p1 and p2 are 2 nodes apart (p1 would have to traverse two times to catch up to p2).  What happens if these two pointers walk the list in tandem (by which I mean, every time p1 advances, so does p2)?

When p2 reaches the null (the end of the list), where will p1 be?  It will be at D.  And D is how far from the end of the list?  Hopefully you answered 2.

It's important to get our terminology straight here.  We consider E (the last element) to be the "1st to last" (which sounds weird, but it is what it is), while D is "2nd to last", C is "3rd from last", B is "4th from last", and A is "5th from last."

> *You could make a pretty valid case that E should be considered "0th from last."  It is, after all, 0 spots away from being last (it **is** last).  But this is not what leetcode expects.  Leetcode expects that if you request to delete the "1st from last" element, that you are deleting the E.  As long as we keep consistent with how we refer to the nodes, we'll be fine.*

Hopefully you're getting the idea now.  We're given n, the number of spots from last, so if we walk p2 that many spots, it'll be n spots away from the p1.  It's also helpful if we keep a previous pointer to make deletions easy.  If we had a previous pointer, it would be one prior to p1 when p2 reaches null, thereby positioning it perfectly to delete the element at p1.

Using the same example as before, suppose we want to delete the 2nd to last node (D) from A -> B -> C -> D -> E -> null.

We'll start with previous being null, p1 and p2 both pointing at the head.  We'll walk p2 2 spots, so that it ends up at C.

We'll then walk previous, p1, and p2 until p2 reaches null. At this point, previous's .next can be updated to be previous.next.next, thereby skipping over p1 and effectively deleting it.

What happens if we want to delete the 5th to last node in our example?  You should realize that that is, in fact, the head.  In this case, previous will be null so we cannot set previous.next = previous.next.next.  Instead, we'll check to see if previous is null, and if so, we'll simply update the head directly.

```javascript
var removeNthFromEnd = function(head, n)
{
	if (n < 1) throw 'impossible';

    let prev = null;
    let p1 = head;
    let p2 = head;
    while (n--)
    {
        if (!p2) throw 'impossible';
        p2 = p2.next;        
    }

    while (p2)
    {
        p2 = p2.next;
        prev = p1;
        p1 = p1.next;
    }

    if (prev === null)
    {
        return head.next;
    }
    else
    {
        prev.next = prev.next.next;
    }
    return head;
}
```

Though leetcode doesn't ask us to, I've added two checks: one to ensure that n is not less than 1.  If it is, we've essentially been asked to delete a phantom node that doesn't exist, so we throw.  Alternatively, I suppose you could choose to no-op here since deleting a node past the end of the list would not actually change the list.

The other is to throw if we've been asked to delete a node that comes before the head.  Here again, I suppose you could consider a no-op here if you wanted.  I've chosen to throw.

In the end, it doesn't matter because the problem statement on leetcode guarantees that n will be valid.


