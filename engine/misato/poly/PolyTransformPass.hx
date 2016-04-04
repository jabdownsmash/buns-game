
package engine.misato;

import haxe.ds.StringMap;
import h3d.scene.Object;

class PolyTransformPass
{

    public var transformFunc:Point->Point -> Point;
    public var priority = 0;

    public function new( func:Point->Point -> Point )
    {
        transformFunc = func;
    }

}
