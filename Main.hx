import h3d.scene.*;
import h3d.col.Point;
import tweenx909.TweenX;
import tweenx909.EaseX;
import tweenx909.advanced.UpdateModeX;
import hxd.Event;
import hxd.Key;

class Main extends hxd.App {

    var time : Float = 0.;
    var light:h3d.scene.DirLight;

    override function init() {
        motion.actuators.SimpleActuator.stage_onEnterFrame();
        TweenX.updateMode = UpdateModeX.MANUAL;
        var kek = new assets.objects.Sword(s3d);

        // adds a directional light to the scene
        light = new h3d.scene.DirLight(new h3d.Vector(0.6, 0.5, -0.5), s3d);
        // light.enableSpecular = true;

        // set the ambient light to 30%
        s3d.lightSystem.ambientLight.set(0.3, 0.3, 0.3);


        s2d.addEventListener(handleKeys);
    }

    function handleKeys(e)
    {
        // if(e.kind == EKeyDown)
        // {
        //     if(e.keyCode == Key.LEFT)
        //     {
        //         obj1.x += 1;
        //     }
        //     if(e.keyCode == Key.RIGHT)
        //     {
        //         obj1.x -= 1;
        //     }
        // }
    }

    override function update( dt : Float ) {
        // motion.actuators.SimpleActuator.stage_onEnterFrame();
        TweenX.manualUpdate( dt);
        // time is flying...
        time += .01*dt;

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