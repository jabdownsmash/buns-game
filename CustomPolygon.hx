
import h3d.col.Point;
import h3d.prim.*;
// import tweenx909.TweenX;
// import tweenx909.EaseX;
import tweenx909.EventX;
// import tweenx909.advanced.UpdateModeX;
// import motion.Actuate;

class CustomPolygon extends Polygon {

    public var originalPointFilter : Point -> Point = null;
    public var transformFilter : Point->Point -> Point = null;

    public var pointList : Array<Point>;
    public var idList : hxd.IndexBuffer;

    public var tweening : Bool = false;
    public var tweenPoints : Array<Point>;
    public var originalPointList : Array<Point>;
    public var originalUvs : Array<UV>;

    public function new( p:Array<Point>, idx:hxd.IndexBuffer)
    {
        pointList = p;
        originalPointList = [];
        for(point in pointList)
        {
            originalPointList.push(point.clone());
        }
        idList = idx;

        super(p, idx);
    }

    public function applyTween(tweenApplicator:Point->Point->tweenx909.advanced.StandardTweenX<Point>)
    {
        tweenPoints = [];
        for(i in 0...pointList.length)
        {
            var np = pointList[i].clone();
            tweenPoints.push(np);
            tweenApplicator(np,originalPointList[i]);
            // .addEventListener( EventX.FINISH,finish);
            // Actuate.tween(np, 1, {x:100}); 
        }
        tweening = true;
    }

    public function finish(e)
    {
        tweening = false;
    }

    public function runFilter( filter:Point->Point -> Point)
    {
        tweening = false;
        for(i in 0...pointList.length)
        {
            var op = originalPointList[i];
            if(originalPointFilter != null)
            {
                op = originalPointFilter(op);
            }
            var p = filter(op,pointList[i]);
            if(p != null)
                pointList[i].set(p.x,p.y,p.z);
        }
        reload();
    }

    private function setPoints(ps:Array<Point>)
    {
        for(i in 0...ps.length)
        {
            var p = ps[i];
            pointList[i].set(p.x,p.y,p.z);
        }
    }

    public function reload()
    {
        if( idList != null && pointList.length != idList.length )
        {
            var p = [];
            var used = [];
            for( i in 0...idList.length )
            {
                p.push(pointList[idList[i]].clone());
            }
            if( normals != null )
            {
                var n = [];
                for( i in 0...idList.length )
                {
                    n.push(normals[idList[i]].clone());
                }
                normals = n;
            }
            if( colors != null )
            {
                var n = [];
                for( i in 0...idList.length )
                {
                    n.push(colors[idList[i]].clone());
                }
                colors = n;
            }
            if( originalUvs != null )
            {
                var t = [];
                for( i in 0...idList.length )
                {
                    t.push(originalUvs[idList[i]].clone());
                }
                uvs = t;
            }
            points = p;
            idx = null;
            alloc(null);
        }
    }

    public function update()
    {
        if(transformFilter != null)
        {
            runFilter(transformFilter);
        }
        if(tweening)
        {
            for(i in 0...pointList.length)
            {
                var op = tweenPoints[i];
                pointList[i].set(op.x,op.y,op.z);
                if(i == 0)trace(op.x);
            }
            reload();
        }
    }
}
