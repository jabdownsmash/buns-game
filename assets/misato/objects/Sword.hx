
package assets.misato.objects;

import assets.misato.poly.*;
import assets.misato.poly.passes.LinearExpandPass;

class Sword extends engine.misato.GameObject
{

    public var blade:Kite;
    public var handleEnd:Sphere;
    public var handle:Cube;
    public var hilt:Cube;

    public var handleEndExpandPass:LinearExpandPass;

    public function new( s3d )
    {
        super(s3d);

        blade = new Kite(this, .1, 1, .1, .2, true);
        handleEnd = new Sphere(this, .15, .15, .15, 20);
        handle = new Cube(this, .06, .25, .06);
        hilt = new Cube(this, .34, .1, .1);

        handleEnd.material.color.setColor(0x4ECDC4);
        handle.material.color.setColor(0xC7F464);
        hilt.material.color.setColor(0xFF6B6B);
        blade.material.color.setColor(0xC44D58);

        blade.material.mainPass.enableLights = false;
        handleEnd.material.mainPass.enableLights = false;
        handle.material.mainPass.enableLights = false;
        hilt.material.mainPass.enableLights = false;

        blade.y = .5;
        handleEnd.y = -.525;
        hilt.y = .1;

        handleEndExpandPass = new LinearExpandPass(1,-1,.1);
        handleEnd.addPass(handleEndExpandPass);
        handle.addPass(new LinearExpandPass(2,.5,.25));
        handleEnd.scaleY = 2;

    }

    private var handleT:Float = 0;

    public override function update(dt:Float)
    {
        handleT += dt;
        handleEndExpandPass.offset = Math.sin(handleT/60)*.05;
        super.update(dt);
    }

}
