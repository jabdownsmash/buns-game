
package engine.poly;

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

    public var x:Float = 0;
    public var y:Float = 0;
    public var z:Float = 0;

    public var needsUpdate:Bool = false;
    public var faceNormals:Bool = true;

    public function new( p:Array<Point>, idx:hxd.IndexBuffer,fn = true)
    {
        pointList = p;
        originalPointList = [];
        for(point in pointList)
        {
            originalPointList.push(point.clone());
        }
        idList = idx;

        super(p, idx);

        // unindex the faces to create hard edges normals
        // unindex();
        reload();

        // add face normals
        if(fn)
        {
            addNormals();
        }
        else
        {
            addVertexNormals();
        }
        faceNormals = fn;
        
        reload();
    }

    public function applyTween(tweenApplicator:Point->Point->tweenx909.advanced.StandardTweenX<Point>)
    {
        tweenPoints = [];
        for(i in 0...pointList.length)
        {
            var np = pointList[i].clone();
            tweenPoints.push(np);
            tweenApplicator(np,originalPointList[i]);
        }
        tweening = true;
    }

    public function finish(e)
    {
        tweening = false;
    }

    public function runFilter( filter:Point->Point -> Point)
    {
        // tweening = false;
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
        needsUpdate = true;
    }

    private function setPoints(ps:Array<Point>)
    {
        for(i in 0...ps.length)
        {
            var p = ps[i];
            pointList[i].set(p.x,p.y,p.z);
        }
    }

    private function reload()
    {
        if(faceNormals)
        {
            if( idList != null && pointList.length != idList.length )
            {
                var p = [];
                var used = [];
                for( i in 0...idList.length )
                {
                    var point = pointList[idList[i]].clone();
                    point.x += x;
                    point.y += y;
                    point.z += z;
                    p.push(point);
                }
                points = p;
                idx = null;
            }
        }
        else
        {
            points = pointList;
            idx = idList;
        }
        dispose();
    }

    public function addVertexNormals()
    {
        normals = [];
        for(point in pointList)
        {
            var p = point.clone();
            p.normalize();
            normals.push(p);
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
            }
            needsUpdate = true;
        }
        if(needsUpdate)
        {
            reload();
        }
    }
}
