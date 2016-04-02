
package engine.misato;

import h3d.scene.Scene;

import engine.objects.Object;

class GameScene
{

    public var name:String;

    public var apiObject:Object;
    public var s3d:Scene;

    public function new(engine:Engine)
    {
        apiObject = new Object(engine.s3d);
        this.s3d = engine.s3d;
    }

    public function init()
    {

    }

    public function update(dt:Float)
    {

    }

}
