import h3d.scene.*;
import h3d.col.Point;
import tweenx909.TweenX;
import tweenx909.EaseX;
import tweenx909.advanced.UpdateModeX;
import hxd.Event;
import hxd.Key;
import poly.*;

class Main extends hxd.App {

    var time : Float = 0.;
    var pulseCounter: Float = 0;
    var obj1 : Mesh;
    var obj2 : Mesh;
    var obj3 : Mesh;
    var obj4 : Mesh;
    var prim:Kite;
    var prim2:Sphere;
    var prim3:Cube;
    var prim4:Cube;
    var light:h3d.scene.DirLight;

    override function init() {
        motion.actuators.SimpleActuator.stage_onEnterFrame();
        TweenX.updateMode = UpdateModeX.MANUAL;
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
        obj1 = new Mesh(prim, mat, s3d);

        // creates another cube, this time with no texture
        obj2 = new Mesh(prim2, new h3d.mat.MeshMaterial(), s3d);
        obj3 = new Mesh(prim3, new h3d.mat.MeshMaterial(), s3d);
        obj4 = new Mesh(prim4, new h3d.mat.MeshMaterial(), s3d);

        // set the second cube color
        obj1.material.color.setColor(0xFFB280);
        obj2.material.color.setColor(0xFFB280);
        obj3.material.color.setColor(0xFFB280);
        obj4.material.color.setColor(0xFFB280);

        // put it above the first cube
        obj1.y = .5;
        obj2.y = -.125;
        obj4.y = .1;
        // obj1.addChild(obj2);

        // scale it down to 60%
        // obj2.scale(0.6);

        // adds a directional light to the scene
        light = new h3d.scene.DirLight(new h3d.Vector(0.6, 0.5, -0.5), s3d);
        // light.enableSpecular = true;

        // set the ambient light to 30%
        s3d.lightSystem.ambientLight.set(0.3, 0.3, 0.3);

        // activate lights on boss cubes
        obj1.material.mainPass.enableLights = true;
        obj2.material.mainPass.enableLights = true;
        obj3.material.mainPass.enableLights = true;
        obj4.material.mainPass.enableLights = true;


        s2d.addEventListener(handleKeys);
    }

    function handleKeys(e)
    {
        if(e.kind == EKeyDown)
        {
            if(e.keyCode == Key.LEFT)
            {
                obj1.x += 1;
            }
            if(e.keyCode == Key.RIGHT)
            {
                obj1.x -= 1;
            }
        }
    }

    override function update( dt : Float ) {
        // motion.actuators.SimpleActuator.stage_onEnterFrame();
        TweenX.manualUpdate( dt);
        // time is flying...
        time += .01*dt;

        pulseCounter += dt;

        var kek = new Point();
        if(pulseCounter > 150000)
        {
            prim.runFilter(function(op:Point,p:Point)
                {
                    p.setLength(Math.random()*2 + 1);
                    kek = p;

                    return null;
                });
            prim.applyTween(function(np,op)
                {
                    return TweenX.to( np, {x:op.x,y:op.y,z:op.z} ).time( 100 ).ease( EaseX.bounceOut );
                });
            prim2.runFilter(function(op:Point,p:Point)
                {
                    p.setLength(Math.random()*2 + 1);
                    kek = p;

                    return null;
                });
            prim2.applyTween(function(np,op)
                {
                    return TweenX.to( np, {x:op.x,y:op.y,z:op.z} ).time( 10 ).ease( EaseX.bounceOut );
                });
            obj2.material.color.setColor(Math.floor(Math.random()*0xFFFFFF));
            pulseCounter -= 150;
        }

        // prim.runFilter(function(op:Point,p:Point)
        //     {
        //         p.x = p.x - p.x%.2;
        //         p.y = p.y - p.y%.2;
        //         p.z = p.z - p.z%.2;
        //         trace(p.y);

        //         return null;
        //     });
        // prim.x += .01 * dt;
        // prim.z += .01 * dt;
        prim.needsUpdate = true;
        prim2.needsUpdate = true;

        prim.update();
        prim2.update();
        // move the camera position around the two cubes
        var dist = 5;
        s3d.camera.pos.set(Math.cos(time) * dist, Math.sin(time) * dist, dist * 0.7 * Math.sin(time));

        // rotate the second cube along a given axis + angle
        // obj2.setRotateAxis(-0.5, 2, Math.cos(time), time + Math.PI / 2);
    }

    static function main() {

        // initialize embeded ressources
        hxd.Res.initEmbed();

        // start the application
        new Main();
    }

}