
import h3d.col.Point;
import h3d.prim.UV;

class Cube extends CustomPolygon {

    public function new( x = 1., y = 1., z = 1.)
    {
        var p = [
            new Point(0, 0, 0),
            new Point(x, 0, 0),
            new Point(0, y, 0),
            new Point(0, 0, z),
            new Point(x, y, 0),
            new Point(x, 0, z),
            new Point(0, y, z),
            new Point(x, y, z),
        ];
        var idx = new hxd.IndexBuffer();
        idx.push(0); idx.push(1); idx.push(5);
        idx.push(0); idx.push(5); idx.push(3);
        idx.push(1); idx.push(4); idx.push(7);
        idx.push(1); idx.push(7); idx.push(5);
        idx.push(3); idx.push(5); idx.push(7);
        idx.push(3); idx.push(7); idx.push(6);
        idx.push(0); idx.push(6); idx.push(2);
        idx.push(0); idx.push(3); idx.push(6);
        idx.push(2); idx.push(7); idx.push(4);
        idx.push(2); idx.push(6); idx.push(7);
        idx.push(0); idx.push(4); idx.push(1);
        idx.push(0); idx.push(2); idx.push(4);

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
            x, z,
        ];


        // var r = new Point(1,0,0);
        // var g = new Point(0,1,0);
        // var b = new Point(0,0,1);
        // var x = new Point(1,1,1);

        // colors = [r,g,b,x,r,g,b,x];
    }
}
