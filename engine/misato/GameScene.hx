
package engine.misato;

import h3d.scene.Scene;
import h3d.scene.Object;

class GameScene extends engine.GameScene
{

    public var apiObject:Object;

    var light:h3d.scene.DirLight;

    public function new(e:Engine)
    {
        super(e);
        apiObject = new Object(e.s3d);
    }

    public override function init()
    {
        light = new h3d.scene.DirLight(new h3d.Vector(0.6, 0.5, -0.5), engine.s3d);
        // light.enableSpecular = true;

        engine.s3d.lightSystem.ambientLight.set(0.3, 0.3, 0.3);
    }

    public override function update(dt:Float)
    {

    }

}
