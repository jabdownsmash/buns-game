
package assets.scenes;

class Test extends engine.GameScene
{

    var time = 0.;

    override function init()
    {
        var kek = new assets.objects.Sword(apiObject);
    }

    override function update( dt:Float )
    {

        time += .01*dt;

        var dist = 5;
        s3d.camera.pos.set(Math.cos(time) * dist, Math.sin(time) * dist, dist * 0.7 * Math.sin(time));
    }

}