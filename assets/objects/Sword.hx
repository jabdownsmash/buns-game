
package assets.objects;

import h3d.scene.*;
import hxd.Event;
import hxd.Key;
import assets.poly.*;
import engine.objects.*;

import h3d.col.Point;
import h3d.prim.UV;

class Sword extends GameObject {

    var obj1 : Mesh;
    var obj2 : Mesh;
    var obj3 : Mesh;
    var obj4 : Mesh;
    var prim:Kite;
    var prim2:Sphere;
    var prim3:Cube;
    var prim4:Cube;

    public function new(s3d)
    {
        super(s3d);

        prim = new Kite(apiObject,.2,1,.1,.2, true);
        prim2 = new Sphere(apiObject,.15,.15,.15);
        prim3 = new Cube(apiObject,.06,.25,.06);
        prim4 = new Cube(apiObject,.34,.1,.1);

        // set the second cube color
        prim.mesh.material.color.setColor(0xFFB280);
        prim2.mesh.material.color.setColor(0xFFB280);
        prim3.mesh.material.color.setColor(0xFFB280);
        prim4.mesh.material.color.setColor(0xFFB280);

        // put it above the first cube
        prim.mesh.y = .5;
        prim2.mesh.y = -.125;
        prim4.mesh.y = .1;
    }
}
