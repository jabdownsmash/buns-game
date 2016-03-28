
package poly;

import h3d.col.Point;
import h3d.prim.UV;

class Sphere extends CustomPolygon {

    public function new( x = 1., y = 1., z = 1., fn = false, layers = 5, longs = 10)
    {
        var p = [];
        var idx = new hxd.IndexBuffer();

        var py = getSliceY(0,layers,y);
        var r = getSliceRadius(y,py);
        p.push(sliceFirstPoint(x,r,py));

        for(j in 1...longs)
        {
            p.push(slicePoint(x,z,r,py,j,longs));
        }

        for(i in 1...layers)
        {
            var py = getSliceY(i,layers,y);
            var r = getSliceRadius(y,py);
            p.push(sliceFirstPoint(x,r,py));
            for(j in 1...longs)
            {
                p.push(slicePoint(x,z,r,py,j,longs));

                var p1 = i * longs + j;
                var p2 = i * longs + j - 1;
                var p3 = (i - 1) * longs + j;
                var p4 = (i - 1) * longs + j - 1;
                idx.push(p1); idx.push(p3); idx.push(p2);
                idx.push(p4); idx.push(p2); idx.push(p3);
            }
            var p1 = i * longs;
            var p2 = (i + 1) * longs - 1;
            var p3 = (i - 1) * longs;
            var p4 = i * longs - 1;
            idx.push(p1); idx.push(p3); idx.push(p2);
            idx.push(p4); idx.push(p2); idx.push(p3);
        }

        p.push(new Point(0,-y/2,0));
        for(i in 1...longs)
        {
            idx.push(longs*layers); idx.push(i - 1); idx.push(i);
        }

        var p1 = 0;
        var p2 = longs - 1;
        idx.push(p2); idx.push(p1); idx.push(longs*layers);

        p.push(new Point(0,y/2,0));
        for(i in 1...longs)
        {
            idx.push(longs*layers + 1); idx.push(longs*(layers - 1) + i); idx.push(longs*(layers - 1) + i - 1);
        }
        var p1 = longs*(layers - 1);
        var p2 = longs*layers - 1;
        idx.push(p1); idx.push(p2); idx.push(longs*layers + 1);

        super(p, idx, fn);
    }

    private function getSliceY(i:Int,layers:Int,y:Float)
    {
        // return (i + 1)/(layers + 1)*y - y/2;
        return -Math.cos((i + 1)/(layers + 1)*Math.PI)*y/2;
    }

    private function getSliceRadius(y:Float,py:Float)
    {
        var t = py/(y/2);
        if(t == 0)
        {
            return y/2;
        }
        return py * Math.sqrt(1 - t*t)/t;
    }

    private function sliceFirstPoint(x:Float,r:Float,py:Float)
    {
        return new Point(x/2*r,py,0);
    }

    private function slicePoint(x:Float,z:Float,r:Float,py:Float,j:Int,longs:Int)
    {
        var angle = j/longs * Math.PI * 2;
        var px = Math.cos(angle);
        var pz = Math.sin(angle);
        return new Point(px*x/2*r,py,pz*z/2*r);
    }
}
