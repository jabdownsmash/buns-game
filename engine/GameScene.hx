
package engine;

import h3d.scene.Scene;

import engine.objects.Object;

class GameScene
{

    public var name:String;

    public var apiObject:Object;
    public var s3d:Scene;

    public function new(s3d:Scene)
    {
        apiObject = new Object(s3d);
        this.s3d = s3d;
    }

    public function init()
    {

    }

    public function update(dt:Float)
    {

    }

}
