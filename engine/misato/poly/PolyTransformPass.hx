
package engine.misato.poly;

import haxe.ds.StringMap;
import h3d.scene.Object;
import h3d.col.Point;

class PolyTransformPass
{

    public var transformFunc:Point -> Point;
    public var priority = 0;

    public function new( func:Point -> Point )
    {
        transformFunc = func;
    }

}
