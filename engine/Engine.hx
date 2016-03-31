
package engine;

import h3d.scene.*;
import h3d.col.Point;
import tweenx909.TweenX;
import tweenx909.advanced.UpdateModeX;
import hxd.Event;
import hxd.Key;

class Engine extends hxd.App {

    var time : Float = 0.;
    var light:h3d.scene.DirLight;

    override function init() {
        TweenX.updateMode = UpdateModeX.MANUAL;

        // adds a directional light to the scene
        light = new h3d.scene.DirLight(new h3d.Vector(0.6, 0.5, -0.5), s3d);
        // light.enableSpecular = true;

        // set the ambient light to 30%
        s3d.lightSystem.ambientLight.set(0.3, 0.3, 0.3);


        s2d.addEventListener(handleKeys);
    }

    function handleKeys(e)
    {
    }

    override function update( dt : Float ) {
        TweenX.manualUpdate( dt);
    }
}