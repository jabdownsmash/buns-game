
import h3d.col.Point;
import h3d.prim.*;

class CustomPolygon extends Polygon {

    public var _originalPointList : Array<Point>;

    public var originalPointFilter : Point -> Point = null;
    public var transformFilter : Point->Point -> Point = null;

    public var pointList : Array<Point>;
    public var idList : hxd.IndexBuffer;

    public function new( p:Array<Point>, idx:hxd.IndexBuffer)
    {
        pointList = p;
        _originalPointList = [];
        for(point in pointList)
        {
            _originalPointList.push(point.clone());
        }
        idList = idx;

        super(p, idx);
    }

    public function runFilter( filter:Point->Point -> Point)
    {
        for(i in 0...pointList.length)
        {
            var op = _originalPointList[i];
            if(originalPointFilter != null)
            {
                op = originalPointFilter(op);
            }
            var p = filter(op,pointList[i]);
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
            if( uvs != null )
            {
                var t = [];
                for( i in 0...idList.length )
                {
                    t.push(uvs[idList[i]].clone());
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
        runFilter(transformFilter);
    }
}
