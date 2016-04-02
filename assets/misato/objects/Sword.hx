
package assets.misato.objects;

import assets.misato.poly.*;

class Sword extends engine.misato.GameObject
{

    var prim:Kite;
    var prim2:Sphere;
    var prim3:Cube;
    var prim4:Cube;

    public function new( s3d )
    {
        super(s3d);

        prim = new Kite(this, .2, 1, .1, .2, true);
        prim2 = new Sphere(this, .15, .15, .15);
        prim3 = new Cube(this, .06, .25, .06);
        prim4 = new Cube(this, .34, .1, .1);

        prim.material.color.setColor(0xFFB280);
        prim2.material.color.setColor(0xFFB280);
        prim3.material.color.setColor(0xFFB280);
        prim4.material.color.setColor(0xFFB280);

        prim.y = .5;
        prim2.y = -.125;
        prim4.y = .1;
    }

}
