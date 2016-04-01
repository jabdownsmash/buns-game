
package engine.objects;

import haxe.ds.StringMap;

import h3d.scene.Object;

class GameObject
{

    public var name:String;
    public var state:evsm.FState<GameObject,GameEvent>;
    public var parent:GameObject;
    public var hasParent:Bool = false;

    public var apiObject:Object;

    public function new( s3d )
    {
        apiObject = new Object(s3d);
    }

    public function processEvent( ?e:GameEvent, ?s:String )
    {
        var event:GameEvent;
        if(e == null && s == null)
        {
            trace("No argument given to processEvent on state " + name);
            return this;
        }
        if(e != null && s != null)
        {
            trace("Too many arguments given to processEvent on state " + name);
            return this;
        }

        if(e != null)
        {
            event = e;
        }
        else
        {
            event = new GameEvent(s);
        }

        if(state != null)
        {
            state.processEvent(this,event);
        }
        else
        {
            events.push(event);
        }

        if(eventListeners.exists(event.id))
        {
            for(listener in eventListeners.get(event.id))
            {
                listener(event);
            }
        }

        return this;
    }

    private var events:Array<GameEvent> = [];
    private var attributes:StringMap<Dynamic> = new StringMap<Dynamic>();
    private var eventTriggers:Array<{eventName:String,func:GameObject->Bool}> = [];
    private var eventListeners:StringMap<Array<GameEvent->Void>> = new StringMap<Array<GameEvent->Void>>();

}
