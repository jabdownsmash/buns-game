
package engine;

import tweenx909.TweenX;
import tweenx909.advanced.UpdateModeX;
import hxd.Event;
import hxd.Key;
import input.Input;

class Engine extends hxd.App
{

    public var input:Input;

    override function init()
    {
        TweenX.updateMode = UpdateModeX.MANUAL;

        s2d.addEventListener(handleKeys);

        input = new Input();
    }

    function handleKeys( e )
    {
        if(e.kind == EKeyDown)
        {
            input.onKeyDown(e.keyCode);
        }
        if(e.kind == EKeyUp)
        {
            input.onKeyUp(e.keyCode);
        }
    }

    override function update( dt : Float )
    {
        TweenX.manualUpdate( dt);
    }

}