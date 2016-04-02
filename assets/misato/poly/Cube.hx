
package assets.misato.poly;

import h3d.col.Point;

class Cube extends engine.misato.poly.CustomMesh
{

    public function new( parent , x = 1. , y = 1. , z = 1. , fn = false )
    {
        var p = [
            new Point(-x/2, -y/2, -z/2),
            new Point( x/2, -y/2, -z/2),
            new Point(-x/2,  y/2, -z/2),
            new Point(-x/2, -y/2,  z/2),
            new Point( x/2,  y/2, -z/2),
            new Point( x/2, -y/2,  z/2),
            new Point(-x/2,  y/2,  z/2),
            new Point( x/2,  y/2,  z/2),
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

        super(parent, p, idx,fn);
    }

}
