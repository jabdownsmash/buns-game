
package engine.misato.poly;

import h3d.col.Point;
import haxe.ds.ArraySort;

class CustomMesh extends h3d.scene.Mesh
{

    public var xRotation:Float = 0;
    public var yRotation:Float = 0;
    public var zRotation:Float = 0;

    public var customPolygon:CustomPolygon;

    public var passes:Array<PolyTransformPass> = [];

    public function new( parent:engine.misato.GameObject, p:Array<h3d.col.Point>, idx:hxd.IndexBuffer,fn = true)
    {
        customPolygon = new CustomPolygon(p,idx,fn);
        primitive = customPolygon;

        super(primitive, new h3d.mat.MeshMaterial(), parent.apiObject);
        material.mainPass.enableLights = true;

        var transformPass = new PolyTransformPass(applyTransforms);
        transformPass.priority = 100;
        addPass(transformPass);

        parent.addMesh(this);
    }

    public function addPass( pass:PolyTransformPass )
    {
        if(passes.length == 0)
        {
            passes.push(pass);
        }
        else
        {
            var inserted = false;
            for( i in 0...passes.length)
            {
                if(passes[i].priority < pass.priority)
                {
                    passes.insert(i,pass);
                    inserted = true;
                    break;
                }
            }
            if(!inserted)
            {
                passes.push(pass);
            }
        }
    }

    private function applyTransforms(p2:Point)
    {
        var sx = Math.sin(xRotation);
        var cx = Math.cos(xRotation);
        var sy = Math.sin(yRotation);
        var cy = Math.cos(yRotation);
        var sz = Math.sin(zRotation);
        var cz = Math.cos(zRotation);

        var y = p2.y;
        var z = p2.z;

        p2.y = y * cx - z * sx;
        p2.z = y * sx + z * cx;

        var x = p2.x;
        z = p2.z;

        p2.x = x * cy + z * sy;
        p2.z = z * cy - x * sy;

        x = p2.x;
        y = p2.y;

        p2.x = x * cz - y * sz;
        p2.y = x * sz + y * cz;
    }

    public function update(dt)
    {
        ArraySort.sort(passes,function(p1,p2)
            {
                if(p1.priority < p2.priority)
                {
                    return -1;
                }
                if(p1.priority > p2.priority)
                {
                    return 1;
                }
                return 0;
            });
        customPolygon.resetPoints();
        for(pass in passes)
        {
            customPolygon.runFilter(pass.transformFunc);
        }
        if(customPolygon.faceNormals)
        {
            customPolygon.addNormals();
        }
        else
        {
            customPolygon.addVertexNormals();
        }
    }

}
