
package input;

import haxe.ds.ObjectMap;
import haxe.ds.StringMap;

class Input
{

    public function new()
    {
    }

    public var keyMap:Map<Key,String> = new Map<Key,String>();
    public var inputStates:Map<String,Bool> = new Map<String,Bool>();

    public var axisMap:Map<String,Axis> = new Map<String,Axis>();
    public var negativeKeyAxisMap:Map<Key,Axis> = new Map<Key,Axis>();
    public var positiveKeyAxisMap:Map<Key,Axis> = new Map<Key,Axis>();
    
    public var keyDownEvents:Array<KeyHandler> = [];
    public var keyUpEvents:Array<KeyHandler> = [];

    public function registerAxis(negativeKey:Key,positiveKey:Key,axisName:String)
    {
        var axis:Axis =axisMap.get(axisName);
        if(axis == null)
        {
            axis = new Axis();
            axisMap.set(axisName, axis);
        }
        negativeKeyAxisMap.set(negativeKey,axis);
        positiveKeyAxisMap.set(positiveKey,axis);

        return this;
    }

    public function registerInput(key:Key,inputName:String)
    {
        keyMap.set(key,inputName);
        if(!inputStates.exists(inputName))
        {
            inputStates.set(inputName,false);
        }
        return this;
    }

    public function getInput(inputName:String)
    {
        return inputStates.get(inputName);
    }

    public function registerFunctionOnKeyDown(inputName:String,func:Void->Void)
    {
        keyDownEvents.push(Function(inputName,func));
        return this;
    }

    public function registerFunctionOnKeyUp(inputName:String,func:Void->Void)
    {
        keyUpEvents.push(Function(inputName,func));
        return this;
    }

    public function getAxis(axisName:String)
    {
        return axisMap.get(axisName).value;
    }
    
    public function onKeyDown(keyCode:Int)
    {
        var key = KeyboardKeys.getKeyFromCode(keyCode);
        var keyName = keyMap.get(key);
        if(keyName != null)
        {
            if(!inputStates.get(keyName))
            {
                inputStates.set(keyName,true);
                for(ev in keyDownEvents)
                {
                    switch(ev)
                    {
                        // case Object(inputName,object,event):
                        //     if(inputName == keyName)
                        //     {
                        //         object.processEvent(new GameEvent(event));
                        //     }
                        case Function(inputName, func):
                            if(inputName == keyName)
                            {
                                func();
                            }
                    }
                }
            }
        }
        if(positiveKeyAxisMap.exists(key))
        {
            positiveKeyAxisMap.get(key).positive = true;
            positiveKeyAxisMap.get(key).value = 1;
        }
        if(negativeKeyAxisMap.exists(key))
        {
            negativeKeyAxisMap.get(key).negative = true;
            negativeKeyAxisMap.get(key).value = -1;
        }
    }

    public function onKeyUp(keyCode:Int)
    {
        var key = KeyboardKeys.getKeyFromCode(keyCode);
        var keyName = keyMap.get(key);
        if(keyName != null)
        {
            if(inputStates.get(keyName))
            {
                inputStates.set(keyName,false);
                for(ev in keyUpEvents)
                {
                    switch(ev)
                    {
                        // case Object(inputName,object,event):
                        //     if(inputName == keyName)
                        //     {
                        //         object.processEvent(new GameEvent(event));
                        //     }
                        case Function(inputName, func):
                            if(inputName == keyName)
                            {
                                func();
                            }
                    }
                }
            }
        }
         
        if(positiveKeyAxisMap.exists(key))
        {
            var axis = positiveKeyAxisMap.get(key);
            axis.positive = false;
            if(axis.negative)
            {
                axis.value = -1;
            }
            else
            {
                axis.value = 0;
            }
        }
        
        if(negativeKeyAxisMap.exists(key))
        {       
            var axis = negativeKeyAxisMap.get(key);
            axis.negative = false;
            if(axis.positive)
            {
                axis.value = 1;
            }
            else
            {
                axis.value = 0;
            }
        }
    }

}