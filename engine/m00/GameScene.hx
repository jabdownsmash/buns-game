
package engine.m00;

import h3d.scene.Scene;

// import engine.objects.Object;

class GameScene extends engine.GameScene
{

    public var apiObject:h2d.Sprite;

    public function new(e:Engine)
    {
        super(e);
        apiObject = new h2d.Sprite(e.s2d);
    }

    public override function init()
    {
        var mask = new h2d.CachedBitmap(engine.s2d,64, 64);
        mask.x = 200;
        mask.y = 150;
        mask.scaleX = 20;
        mask.scaleY = 20;

        apiObject = mask;
    }

    public override function update(dt:Float)
    {

    }

}
