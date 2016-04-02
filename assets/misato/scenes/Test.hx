
package assets.misato.scenes;

class Test extends engine.misato.GameScene
{

    var time = 0.;

    override function init()
    {
        super.init();
        var kek = new assets.misato.objects.Sword(apiObject);
    }

    override function update( dt:Float )
    {
        super.update(dt);
        time += .01*dt;

        var dist = 5;
        engine.s3d.camera.pos.set(Math.cos(time) * dist, Math.sin(time) * dist, dist * 0.7 * Math.sin(time));
    }

}