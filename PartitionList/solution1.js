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