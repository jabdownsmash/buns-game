
import engine.Engine;

class Main extends Engine {
    
    var scene:engine.m00.GameScene;

    static function main()
    {
        hxd.Res.initEmbed();

        new Main();
    }

    override function init()
    {
        super.init();

        scene = new assets.m00.scenes.Test(this);
        scene.init();
    }

    override function update(dt:Float)
    {
        super.update(dt);
        scene.update(dt);
    }

}