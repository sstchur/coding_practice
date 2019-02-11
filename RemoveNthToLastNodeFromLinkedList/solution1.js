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