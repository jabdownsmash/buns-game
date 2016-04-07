
package assets.misato.poly.passes;

import haxe.ds.StringMap;
import h3d.scene.Object;
import h3d.col.Point;

class LinearExpandPass extends engine.misato.poly.PolyTransformPass
{

    public var hasCustomAxis:Bool = false;
    public var customAxis:Point; 

    public var startWidth:Float;
    public var endWidth:Float;
    public var height:Float;
    public var offset:Float;

    public function new( sw:Float , ew:Float , h:Float = 1 , o:Float = 0, ?axis:Point )
    {
        if(axis != null)
        {
            customAxis = axis;
            hasCustomAxis = true;
        }

        startWidth = sw;
        endWidth = ew;
        height = h;
        offset = o;

        var func = function(p:Point)
            {
                if(!hasCustomAxis)
                {
                    var multiplier = startWidth + (endWidth - startWidth)*((p.y - offset)/height - 1/2);
                    p.x *= multiplier;
                    p.z *= multiplier;
                }
            };

        super(func);
    }

}
