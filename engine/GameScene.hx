
package engine;

import h3d.scene.*;
import hxd.Event;
import hxd.Key;
import poly.*;

import h3d.col.Point;
import h3d.prim.UV;
import haxe.ds.StringMap;

import engine.objects.*;

class GameScene
{
    public var name:String;

    public var apiObject:Object;
    public var s3d:h3d.scene.Scene;


    public function new(s3d:h3d.scene.Scene)
    {
        apiObject = new Object(s3d);
        this.s3d = s3d;
    }

    public function init()
    {

    }

    public function update(dt:Float)
    {

    }

}
