
import engine.Engine;

class Main extends Engine {
    var scene:engine.GameScene;

    static function main()
    {

        // initialize embeded ressources
        hxd.Res.initEmbed();

        // start the application
        // var eng = new Engine();
        var mn = new Main();

        // mn.mInit();
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