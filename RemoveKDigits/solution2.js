function subsets(things)
{
    let sets = [[]];
    things.forEach(thing =>
    {
        let i = sets.length;
        while (i--)
        {
            sets.push([thing].concat(sets[i]));
        }
    });
    
    return sets;
}

/*
The key thing to remember here is that your sets variable, is a "running" list of sets.
That is, for each item in the complete set, you want to combine that item with every set
in your running sets list.
*/