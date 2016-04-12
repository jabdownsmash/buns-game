
package assets.misato.scenes;

import assets.misato.objects.Sword;

class Test extends engine.misato.GameScene
{

    var time = 0.;
    var swords:Array<Sword> = [];
    var numSwords = 25;


    override function init()
    {
        super.init();
        // sword = new Sword(apiObject);
        for( i in 0...numSwords )
        {
            var sword = new Sword(apiObject);
            // sword.apiObject.z = (i/numSwords - .5);
            swords.push(sword);
            // sword.apiObject.setRotate(0,0,i/numSwords*Math.PI*2);
        }
    }

    override function update( dt:Float )
    {
        super.update(dt);
        time += .01*dt;

        var dist = 5;
        engine.engine.backgroundColor = 0xFF556270;
        // engine.s3d.camera.pos.set(Math.cos(time) * dist, Math.sin(time) * dist, dist * 0.7 * Math.sin(time));

        var s = Math.sin(time);
        var c = Math.sin(time);

        var numSwords = Math.floor(-Math.sin(time*4)*100 + 105);
        s *= 2;
        c *= 2;
        if(time%(Math.PI*2) > Math.PI)
        {
            s = 0;
        }
        else
        {
            c = 0;
        }
        var i = 0;
        for(sword in swords)
        {
            sword.apiObject.z = c*(i/(numSwords - 1) - .5);
            sword.apiObject.x = s*(i/(numSwords - 1) - .5);
            sword.apiObject.setRotate(c*(i/(numSwords - 1) - .5)*Math.PI*2 + Math.PI,0,s*(i/(numSwords - 1) - .5)*Math.PI*2);

            sword.hilt.xRotation += dt/10;
            sword.update(dt);
            i++;
        }
    }

}