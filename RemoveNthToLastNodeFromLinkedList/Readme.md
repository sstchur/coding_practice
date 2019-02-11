# Remove nth from last node from linked list

[https://leetcode.com/problems/remove-nth-node-from-end-of-list/](https://leetcode.com/problems/remove-nth-node-from-end-of-list/)

---
Given a linked list, remove the n-th node from the end of list and return its head.

---

## My thoughts

The "challenge" here is to do this in one pass and without extra memory (by which I mean no more than O(1) memory).

If at first you're thinking this is impossible, you're very likely not alone.  At first, I assumed that I was stuck making at least two passes through the list. The first pass would count the total number of nodes, and the second pass would actually traverse to the point where I could delete the nth node.

However, the more problems you do, the more you will draw on past experience to solve problems you've never seen before.  This problem is a good example where past experience using two pointers can help.

Consider what happens if you have two pointers in the list, separated by some number of nodes (it does not matter how many they are separated by for this example).

```
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


