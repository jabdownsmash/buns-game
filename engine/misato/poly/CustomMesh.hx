
package engine.misato.poly;

class CustomMesh extends h3d.scene.Mesh
{

    // public var x:Float = 0;
    // public var y:Float = 0;
    // public var z:Float = 0;

    // public var xScale:Float = 1;
    // public var yScale:Float = 1;
    // public var zScale:Float = 1;

    // public var xRotation:Float = 1;
    // public var yRotation:Float = 1;
    // public var zRotation:Float = 1;

    public var customPolygon:CustomPolygon;

    public function new( parent:engine.misato.GameObject, p:Array<h3d.col.Point>, idx:hxd.IndexBuffer,fn = true)
    {
        primitive = new CustomPolygon(p,idx,fn);

        super(primitive, new h3d.mat.MeshMaterial(), parent.apiObject);

        material.mainPass.enableLights = true;
    }

}
