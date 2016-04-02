
package engine.m00;

import h3d.scene.Scene;

// import engine.objects.Object;

class GameScene implements engine.GameScene
{

    public var name:String;

    public var apiObject:h2d.Sprite;
    public var engine:Engine;

    public function new(e:Engine)
    {
        apiObject = new h2d.Sprite(e.s2d);
        engine = e;
    }

    public function init()
    {
        var mask = new h2d.CachedBitmap(engine.s2d,64, 64);
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
