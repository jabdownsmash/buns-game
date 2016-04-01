
package engine.poly;

class CustomMesh extends h3d.scene.Mesh
{

    public var customPolygon:CustomPolygon;

    public function new( parent:engine.objects.GameObject, p:Array<h3d.col.Point>, idx:hxd.IndexBuffer,fn = true)
    {
        primitive = new CustomPolygon(p,idx,fn);

        super(primitive, new h3d.mat.MeshMaterial(), parent.apiObject);

        material.mainPass.enableLights = true;
    }

}
