# Partition List

[https://leetcode.com/problems/partition-list/](https://leetcode.com/problems/partition-list/)

---
Given a linked list and a value x, partition it such that all nodes less than x come before nodes greater than or equal to x.

You should preserve the original relative order of the nodes in each of the two partitions.

Example:
```
Input: head = 1->4->3->2->5->2, x = 3
Output: 1->2->2->4->3->5
```
---

## My thoughts

Ideally, we'd like to do this in one pass and without a lot of extra memory.  We're told that we should preserve the original relative order of the nodes, which actually makes life a bit easier.

Suppose I were to traverse the list looking only for items greater than or equal to x.  Whenever I find one, I'll "pull it out" of the list.  Don't worry too much about the details here, just spend a bit of time considering the idea.

We start at 1.  It's less than x (3), so we ignore it and keep going.  Next we encounter 4.  It's not less than x, so we remove it from the list (don't worry about where we put it when we remove it; we'll get to that soon enough), leaving us with:

```
1->3->2->5->2
```

Next we come to 3, which is not less than x, so again we remove it.  Because I don't feel like writing out every single intermediate state for you, I'm going to trust you can keep this in your head and we'll keep going.  Next we come to 2.  It's less than x, so we ignore it.  Now're we at 5, which is not less than x, so we remove it.

At this point, with 4 removed, 3 removed, and 5 removed, our list looks like this:

```
1->2->2
```

Here's something you'll want to pay attention to.  What was the order in which 4, 3, and 5, were removed?  Hopefully it's obvious.  *That* order!  They were removed in exactly the order they appeared.  Which means, it's very easy to construct a second list as we remove them, which is a collection of all elements greater than or equal to x, in thier original (relative) order!

Had we built that second list out of removed items as we were traversing the first list, it would have looked like this:

```
4->3->5
```

If I were then to take list1 and tack list1 onto the end of it, I have my answer:

```
1->2->2->4->3->5
```

 Working with lists can be a minor pain, especially when you start with an empty list.  I fight this battle by using a "dummy" head, which you'll see in the code.  

A "dummy" head let's me blindy append to a list without having to worry about whether or not the item I'm appending is going to serve as the head or not.

Here's one way to code this that makes leetcode happy.

```javascript
function partition(head, x)
{
    let list1 = new ListNode();
    let list1Head = list1;
    let list2 = new ListNode();
    let list2Head = list2;
    
    let p = head;
    while (p)
    {
        if (p.val < x)
        {
            list1.next = p;
            list1 = list1.next;
        }
        else
        {
            list2.next = p;
            list2 = list2.next;
        }
        
        p = p.next;
    }
    
    list2.next = null;
    list1.next = list2Head.next;
    return list1Head.next;
}
```

## Further explanation

I create two lists start with: list1, which will be items less than x, and list2 which will be items greater than or equal to x.  I initialize each list with a "dummy" head so that it's easy for me to add items to the list.  I chose to initialize my dummy heads with undefined (which I can do in Javascript).  In your language of choice, you may be forced to give a value like MIN_NUMBER or something like that.  It shouldn't matter, because the dummy head will never be used (unless you have a bug in your code).

I then traverse the list, examining the value of each node.  If it's less than x, I append the node to list1.  If it's greater than or equal to x, I append it to list2. Whichever list I've appended to, I move that list forward one node.  And regardless of which list I've appended to, I move the pointer, p, up one as well so that I am always moving through the original list.

Once this process is done, it's just a matter of combining the two lists together.  I take special care to ensure that list2.next gets set to null becuase list2 represents all the items that are greater than or equal to x.  Therefore, there should be nothing past the end of list2.  If you were to omit this code, you could end up with a circular list.

Next, I list1.next (list1 at this point represents list1's tail) to the head of list2.  Except that I've got the "dummy" head to deal with, but that's easy.  I just skip past it when connecting list1's tail with list2's head.

Finally, I need to return list1's head, which is the node immediately following its "dummy" head.

And there you have it.  Full code is already in this file, but it's in [solution1.js](solution1.js) as well.