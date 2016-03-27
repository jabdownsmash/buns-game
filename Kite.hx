
import h3d.col.Point;
import h3d.prim.UV;

class Kite extends CustomPolygon {

    public function new( x = 1., y = 1., z = 1., my = .5)
    {
        var p = [
            new Point( 0,  -y/2,      0),
            new Point( x/2, y*my-y/2, 0),
            new Point(-x/2, y*my-y/2, 0),
            new Point( 0,   y*my-y/2, z/2),
            new Point( 0,   y*my-y/2, -z/2),
            new Point( 0,   y/2,      0),
        ];
        var idx = new hxd.IndexBuffer();
        idx.push(0); idx.push(1); idx.push(3);
        idx.push(0); idx.push(3); idx.push(2);
        idx.push(0); idx.push(4); idx.push(1);
        idx.push(0); idx.push(2); idx.push(4);

        idx.push(5); idx.push(3); idx.push(1);
        idx.push(5); idx.push(2); idx.push(3);
        idx.push(5); idx.push(1); idx.push(4);
        idx.push(5); idx.push(4); idx.push(2);

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
        ];

        originalUvs = [];

        for( uv in uvs )
        {
            originalUvs.push(uv);
        }


        // var r = new Point(1,0,0);
        // var g = new Point(0,1,0);
        // var b = new Point(0,0,1);
        // var x = new Point(1,1,1);

        // colors = [r,g,b,x,r,g,b,x];
    }
}
