
package engine.m00;

import h3d.scene.Scene;

// import engine.objects.Object;

class GameScene implements engine.GameScene
{

    public var name:String;

    public var apiObject:h2d.Sprite;
    public var s2d:h2d.Scene;

    public function new(engine:Engine)
    {
        apiObject = new h2d.Sprite(engine.s2d);
        s2d = engine.s2d;
    }

    public function init()
    {
        var mask = new h2d.CachedBitmap(s2d,64, 64);
        mask.x = 200;
        mask.y = 150;
        mask.scaleX = 20;
        mask.scaleY = 20;

        apiObject = mask;
    }

    public function update(dt:Float)
    {

    }

}
