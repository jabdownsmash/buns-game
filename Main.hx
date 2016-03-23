import h3d.scene.*;
import h3d.col.Point;

class Main extends hxd.App {

    var time : Float = 0.;
    var obj1 : Mesh;
    var obj2 : Mesh;
    var prim : CustomPolygon;

    override function init() {

        // creates a new unit cube

        var x = 1;
        var y = 1;
        var z = 1;
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
        prim = new CustomPolygon(p, idx);
        // prim = new h3d.prim.Cube();

        // translate it so its center will be at the center of the cube
        prim.translate( -0.5, -0.5, -0.5);

        // unindex the faces to create hard edges normals
        // prim.unindex();

        // add face normals
        // prim.addNormals();

        // add texture coordinates
        prim.addUVs();

        // accesss the logo resource and convert it to a texture
        var tex = hxd.Res.hxlogo.toTexture();

        // create a material with this texture
        var mat = new h3d.mat.MeshMaterial(tex);

        // our first cube mesh on the 3D scene with our created material
        obj1 = new Mesh(prim, mat, s3d);

        // creates another cube, this time with no texture
        obj2 = new Mesh(prim, new h3d.mat.MeshMaterial(), s3d);

        // set the second cube color
        obj2.material.color.setColor(0xFFB280);

        // put it above the first cube
        obj2.z = 0.7;

        // scale it down to 60%
        obj2.scale(0.6);

        // adds a directional light to the scene
        var light = new h3d.scene.DirLight(new h3d.Vector(0.5, 0.5, -0.5), s3d);
        light.enableSpecular = true;

        // set the ambient light to 30%
        s3d.lightSystem.ambientLight.set(0.3, 0.3, 0.3);

        // activate lights on boss cubes
        obj1.material.mainPass.enableLights = true;
        obj2.material.mainPass.enableLights = true;
    }

    override function update( dt : Float ) {

        // time is flying...
        time += 0.01 * dt;

        prim.pointList[2].x += 1;
        prim.reload();
        // prim.points[2].z += .1;

        // prim.unindex();
        // prim.alloc(null);

        // move the camera position around the two cubes
        var dist = 5;
        s3d.camera.pos.set(Math.cos(time) * dist, Math.sin(time) * dist, dist * 0.7 * Math.sin(time));

        // rotate the second cube along a given axis + angle
        obj2.setRotateAxis(-0.5, 2, Math.cos(time), time + Math.PI / 2);
    }

    static function main() {

        // initialize embeded ressources
        hxd.Res.initEmbed();

        // start the application
        new Main();
    }

}