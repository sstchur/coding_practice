function GraphNode(id)
{
    this.id = id;
    this.edges = [];
}
function GraphEdge(from, to)
{
    //this.id = `${from}-to-${to}`;
    this.from = from;
    this.to = to;        
}

function canFinish(numCourses, preReqs)
{
    let whiteSet = {};
    let graySet = {};
    let blackSet = {};
    
    let g = {};
    for (let i = 0; i < numCourses; i++)
    {
        let n = new GraphNode(i);
        g[n.id] = n;
        whiteSet[n.id] = true;
    };
    
    preReqs.forEach(pr =>
    {
        let courseId = pr[0];
        let depId = pr[1];
        g[courseId].edges.push(new GraphEdge(courseId, depId));
    });
    
    for (let id in g)
    {
        if (!(id in whiteSet)) continue;
        if (traverse(g, g[id], whiteSet, graySet, blackSet)) return false;
    }
    return true;
}

function traverse(g, n, whiteSet, graySet, blackSet)
{
    delete whiteSet[n.id];
    graySet[n.id] = true;

    for (let i = 0; i < n.edges.length; i++)
    {
        let neighborId = n.edges[i].to;
        if (neighborId in blackSet)
        {
            continue;
        }

        if (neighborId in graySet) return true;
        
        if (traverse(g, g[neighborId], whiteSet, graySet, blackSet)) return true;
    }

    delete graySet[n.id];
    blackSet[n.id] = true;
    return false;
}

