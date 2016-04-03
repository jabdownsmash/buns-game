
package assets.misato.objects;

import assets.misato.poly.*;

class Sword extends engine.misato.GameObject
{

    public var blade:Kite;
    public var handleEnd:Sphere;
    public var handle:Cube;
    public var hilt:Cube;

    public function new( s3d )
    {
        super(s3d);

        blade = new Kite(this, .2, 1, .1, .2, true);
        handleEnd = new Sphere(this, .15, .15, .15);
        handle = new Cube(this, .06, .25, .06);
        hilt = new Cube(this, .34, .1, .1);

        blade.material.color.setColor(0xFFB280);
        handleEnd.material.color.setColor(0xFFB280);
        handle.material.color.setColor(0xFFB280);
        hilt.material.color.setColor(0xFFB280);

        blade.y = .5;
        handleEnd.y = -.125;
        hilt.y = .1;

    }

    public override function update(dt:Float)
    {
        blade.update(dt);
        handleEnd.update(dt);
        handle.update(dt);
        hilt.update(dt);
    }

}
