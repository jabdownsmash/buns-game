
package engine.poly;

import h3d.col.Point;
import h3d.prim.*;
import h3d.scene.*;

import engine.objects.*;

class CustomMesh extends Mesh {

    public var customPolygon:CustomPolygon;

    public function new( parent:GameObject, p:Array<Point>, idx:hxd.IndexBuffer,fn = true)
    {

        primitive = new CustomPolygon(p,idx,fn);

        super(primitive, new h3d.mat.MeshMaterial(), parent.apiObject);

        material.mainPass.enableLights = true;
    }
}
