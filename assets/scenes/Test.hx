
package assets.scenes;

import engine.GameScene;
import assets.objects.Sword;

class Test extends GameScene {

    var time : Float = 0.;

    override function init() {
        var kek = new assets.objects.Sword(apiObject);
    }

    override function update( dt : Float ) {

        time += .01*dt;

        var dist = 5;
        s3d.camera.pos.set(Math.cos(time) * dist, Math.sin(time) * dist, dist * 0.7 * Math.sin(time));
    }

}