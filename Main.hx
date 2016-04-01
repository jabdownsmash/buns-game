
import engine.Engine;

class Main extends Engine {
    
    var scene:engine.GameScene;

    static function main()
    {
        hxd.Res.initEmbed();

        new Main();
    }

    override function init()
    {
        super.init();

        scene = new assets.scenes.Test(s3d);
        scene.init();
    }

    override function update(dt:Float)
    {
        super.update(dt);
        scene.update(dt);
    }

}