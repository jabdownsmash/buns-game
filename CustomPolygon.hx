
import h3d.col.Point;
import h3d.prim.*;

class CustomPolygon extends Polygon {

    public var pointList : Array<Point>;
    public var idList : hxd.IndexBuffer;

    public function new( p:Array<Point>, idx:hxd.IndexBuffer)
    {
        pointList = p;
        idList = idx;

        super(p, idx);
    }

    override function addUVs() {
        // unindex();

        var z = new UV(0, 1);
        var x = new UV(1, 1);
        var y = new UV(0, 0);
        var o = new UV(1, 0);

        uvs = [
            z, x, o,
            z, o, y,
            x, z, y,
            x, y, o,
            x, z, y,
            x, y, o,
            z, o, x,
            z, y, o,
            x, y, z,
            x, o, y,
            z, o, x,
            z, y, o,
        ];

        var r = new Point(1,0,0);
        var g = new Point(0,1,0);
        var b = new Point(0,0,1);
        var x = new Point(1,1,1);

        colors = [
            r, g, b,
            r, b, x,
            g, r, x,
            g, x, b,
            g, r, x,
            g, x, b,
            r, b, g,
            r, x, b,
            g, x, r,
            g, b, x,
            r, b, g,
            r, x, b,
        ];
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
}
