
package engine.misato.poly;

import h3d.col.Point;
import h3d.prim.*;
import h3d.scene.*;

class CustomPolygon extends Polygon
{

    public var pointList : Array<Point>;
    public var idList : hxd.IndexBuffer;

    public var tweening : Bool = false;
    public var tweenPoints : Array<Point>;

    public var faceNormals:Bool = true;

    public function new(p:Array<Point>, idx:hxd.IndexBuffer,fn = true)
    {
        pointList = p;
        idList = idx;

        super(p, idx);

        faceNormals = fn;
        resetPoints();

        if(faceNormals)
        {
            addNormals();
        }
        else
        {
            addVertexNormals();
        }
    }

    public function runFilter( filter:Point -> Void)
    {
        for(point in points)
        {
            filter(point);
        }
        dispose();
    }

    public function addVertexNormals()
    {
        normals = [];
        for(point in pointList)
        {
            var p = point.clone();
            p.normalize();
            normals.push(p);
        }
    }

    public function resetPoints()
    {
        if(faceNormals)
        {
            if( idList != null && pointList.length != idList.length )
            {
                var p = [];
                var used = [];
                for( i in 0...idList.length )
                {
                    p.push(pointList[idList[i]].clone());
                }
                points = p;
                idx = null;
            }
        }
        else
        {
            points = [];
            for( point in pointList )
            {
                points.push(point.clone());
            }
            idx = idList;
        }
        dispose();
    }

}
