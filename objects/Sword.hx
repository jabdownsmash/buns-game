
package objects;

import h3d.scene.*;
import hxd.Event;
import hxd.Key;
import poly.*;

import h3d.col.Point;
import h3d.prim.UV;

class Sword extends Object {

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

        prim = new Kite(.2,1,.1,.2, true);
        prim2 = new Sphere(.15,.15,.15);
        prim3 = new Cube(.06,.25,.06);
        prim4 = new Cube(.34,.1,.1);

        // prim.x += 1;

        // accesss the logo resource and convert it to a texture
        var tex = hxd.Res.hxlogo.toTexture();

        // create a material with this texture
        var mat = new h3d.mat.MeshMaterial();
        // var mat = new h3d.mat.MeshMaterial(tex);

        // our first cube mesh on the 3D scene with our created material
        obj1 = new Mesh(prim, mat, this);

        // creates another cube, this time with no texture
        obj2 = new Mesh(prim2, new h3d.mat.MeshMaterial(), this);
        obj3 = new Mesh(prim3, new h3d.mat.MeshMaterial(), this);
        obj4 = new Mesh(prim4, new h3d.mat.MeshMaterial(), this);

        // set the second cube color
        obj1.material.color.setColor(0xFFB280);
        obj2.material.color.setColor(0xFFB280);
        obj3.material.color.setColor(0xFFB280);
        obj4.material.color.setColor(0xFFB280);

        // put it above the first cube
        obj1.y = .5;
        obj2.y = -.125;
        obj4.y = .1;

        obj1.material.mainPass.enableLights = true;
        obj2.material.mainPass.enableLights = true;
        obj3.material.mainPass.enableLights = true;
        obj4.material.mainPass.enableLights = true;
    }
}
