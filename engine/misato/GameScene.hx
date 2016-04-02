
package engine.misato;

import h3d.scene.Scene;

import engine.objects.Object;

class GameScene implements engine.GameScene
{

    public var name:String;

    public var apiObject:Object;
    public var s3d:Scene;

    var light:h3d.scene.DirLight;

    public function new(engine:Engine)
    {
        apiObject = new Object(engine.s3d);
        s3d = engine.s3d;
    }

    public function init()
    {
        light = new h3d.scene.DirLight(new h3d.Vector(0.6, 0.5, -0.5), s3d);
        // light.enableSpecular = true;

        s3d.lightSystem.ambientLight.set(0.3, 0.3, 0.3);
    }

    public function update(dt:Float)
    {

    }

}
