
package poly;

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
}
