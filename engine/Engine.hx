
package engine;

import tweenx909.TweenX;
import tweenx909.advanced.UpdateModeX;
import hxd.Event;
import hxd.Key;

class Engine extends hxd.App
{

    var time : Float = 0.;
    var light:h3d.scene.DirLight;

    override function init()
    {
        TweenX.updateMode = UpdateModeX.MANUAL;

        light = new h3d.scene.DirLight(new h3d.Vector(0.6, 0.5, -0.5), s3d);
        // light.enableSpecular = true;

        s3d.lightSystem.ambientLight.set(0.3, 0.3, 0.3);

        s2d.addEventListener(handleKeys);
    }

    function handleKeys( e )
    {

    }

    override function update( dt : Float )
    {
        TweenX.manualUpdate( dt);
    }

}