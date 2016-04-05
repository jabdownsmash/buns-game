
package assets.misato.scenes;

import assets.misato.objects.Sword;

class Test extends engine.misato.GameScene
{

    var time = 0.;
    var sword:Sword;

    override function init()
    {
        super.init();
        sword = new Sword(apiObject);
    }

    override function update( dt:Float )
    {
        super.update(dt);
        time += .01*dt;

        var dist = 5;
        engine.s3d.camera.pos.set(Math.cos(time) * dist, Math.sin(time) * dist, dist * 0.7 * Math.sin(time));

        sword.hilt.xRotation += dt/10;
        sword.update(dt);
    }

}