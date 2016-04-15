(function (console, $global) { "use strict";
var $hxClasses = {},$estr = function() { return js_Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var HxOverrides = function() { };
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.strDate = function(s) {
	var _g = s.length;
	switch(_g) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k1 = s.split("-");
		return new Date(k1[0],k1[1] - 1,k1[2],0,0,0);
	case 19:
		var k2 = s.split(" ");
		var y = k2[0].split("-");
		var t = k2[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw new js__$Boot_HaxeError("Invalid date format : " + s);
	}
};
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Lambda = function() { };
$hxClasses["Lambda"] = Lambda;
Lambda.__name__ = ["Lambda"];
Lambda.array = function(it) {
	var a = [];
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		a.push(i);
	}
	return a;
};
Lambda.count = function(it,pred) {
	var n = 0;
	if(pred == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var _ = $it0.next();
			n++;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(pred(x)) n++;
		}
	}
	return n;
};
Lambda.indexOf = function(it,v) {
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var v2 = $it0.next();
		if(v == v2) return i;
		i++;
	}
	return -1;
};
var List = function() {
	this.length = 0;
};
$hxClasses["List"] = List;
List.__name__ = ["List"];
List.prototype = {
	add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,__class__: List
};
var hxd_App = function(engine) {
	var _g = this;
	if(engine != null) {
		this.engine = engine;
		engine.onReady = $bind(this,this.setup);
		haxe_Timer.delay($bind(this,this.setup),0);
	} else hxd_System.start(function() {
		_g.engine = engine = new h3d_Engine();
		engine.onReady = $bind(_g,_g.setup);
		engine.init();
	});
};
$hxClasses["hxd.App"] = hxd_App;
hxd_App.__name__ = ["hxd","App"];
hxd_App.prototype = {
	onResize: function() {
	}
	,setup: function() {
		var _g = this;
		var initDone = false;
		this.engine.onResized = function() {
			if(_g.s2d == null) return;
			_g.s2d.checkResize();
			if(initDone) _g.onResize();
		};
		this.s3d = new h3d_scene_Scene();
		this.s2d = new h2d_Scene();
		this.s3d.addPass(this.s2d);
		this.sevents = new hxd_SceneEvents();
		this.sevents.addScene(this.s2d);
		this.sevents.addScene(this.s3d);
		this.loadAssets(function() {
			initDone = true;
			_g.init();
			hxd_Timer.skip();
			_g.mainLoop();
			hxd_System.setLoop($bind(_g,_g.mainLoop));
			hxd_Key.initialize();
		});
	}
	,loadAssets: function(onLoaded) {
		onLoaded();
	}
	,init: function() {
	}
	,mainLoop: function() {
		hxd_Timer.update();
		this.sevents.checkEvents();
		this.update(hxd_Timer.tmod);
		this.s2d.setElapsedTime(hxd_Timer.tmod / 60);
		this.s3d.setElapsedTime(hxd_Timer.tmod / 60);
		this.engine.render(this.s3d);
	}
	,update: function(dt) {
	}
	,__class__: hxd_App
};
var engine_Engine = function(engine1) {
	hxd_App.call(this,engine1);
};
$hxClasses["engine.Engine"] = engine_Engine;
engine_Engine.__name__ = ["engine","Engine"];
engine_Engine.__super__ = hxd_App;
engine_Engine.prototype = $extend(hxd_App.prototype,{
	init: function() {
		tweenx909_TweenX.set_updateMode(tweenx909_advanced_UpdateModeX.MANUAL);
		this.s2d.addEventListener($bind(this,this.handleKeys));
		this.input = new input_Input();
	}
	,handleKeys: function(e) {
		if(e.kind == hxd_EventKind.EKeyDown) this.input.onKeyDown(e.keyCode);
		if(e.kind == hxd_EventKind.EKeyUp) this.input.onKeyUp(e.keyCode);
	}
	,update: function(dt) {
		tweenx909_TweenX.manualUpdate(dt);
	}
	,__class__: engine_Engine
});
var Main = function(engine1) {
	engine_Engine.call(this,engine1);
};
$hxClasses["Main"] = Main;
Main.__name__ = ["Main"];
Main.main = function() {
	hxd_Res.set_loader(new hxd_res_Loader((function($this) {
		var $r;
		hxd__$res_R_$trueTypeFont_$ttf;
		$r = new hxd_fs_EmbedFileSystem(haxe_Unserializer.run("oy14:customFont.fntty14:customFont.pngty10:hxlogo.pngty13:normalmap.pngty16:trueTypeFont.ttftg"));
		return $r;
	}(this))));
	new Main();
};
Main.__super__ = engine_Engine;
Main.prototype = $extend(engine_Engine.prototype,{
	init: function() {
		engine_Engine.prototype.init.call(this);
		this.scene = new assets_misato_scenes_Test(this);
		this.scene.init();
	}
	,update: function(dt) {
		engine_Engine.prototype.update.call(this,dt);
		this.scene.update(dt);
	}
	,__class__: Main
});
Math.__name__ = ["Math"];
var Reflect = function() { };
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = ["Reflect"];
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
Reflect.compare = function(a,b) {
	if(a == b) return 0; else if(a > b) return 1; else return -1;
};
Reflect.isEnumValue = function(v) {
	return v != null && v.__enum__ != null;
};
var Std = function() { };
$hxClasses["Std"] = Std;
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js_Boot.__instanceof(v,t);
};
Std.instance = function(value,c) {
	if((value instanceof c)) return value; else return null;
};
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.parseFloat = function(x) {
	return parseFloat(x);
};
var StringBuf = function() {
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	add: function(x) {
		this.b += Std.string(x);
	}
	,__class__: StringBuf
};
var StringTools = function() { };
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = ["StringTools"];
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c > 8 && c < 14 || c == 32;
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
var Type = function() { };
$hxClasses["Type"] = Type;
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null; else return js_Boot.getClass(o);
};
Type.getClassName = function(c) {
	var a = c.__name__;
	if(a == null) return null;
	return a.join(".");
};
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
};
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
};
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
};
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw new js__$Boot_HaxeError("No such constructor " + constr);
	if(Reflect.isFunction(f)) {
		if(params == null) throw new js__$Boot_HaxeError("Constructor " + constr + " need parameters");
		return Reflect.callMethod(e,f,params);
	}
	if(params != null && params.length != 0) throw new js__$Boot_HaxeError("Constructor " + constr + " does not need parameters");
	return f;
};
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
};
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2;
		var _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e1 ) {
		if (e1 instanceof js__$Boot_HaxeError) e1 = e1.val;
		return false;
	}
	return true;
};
Type.allEnums = function(e) {
	return e.__empty_constructs__;
};
var engine_misato_GameObject = function(s3d) {
	this.meshes = [];
	this.apiObject = new h3d_scene_Object(s3d);
};
$hxClasses["engine.misato.GameObject"] = engine_misato_GameObject;
engine_misato_GameObject.__name__ = ["engine","misato","GameObject"];
engine_misato_GameObject.prototype = {
	update: function(dt) {
		var _g = 0;
		var _g1 = this.meshes;
		while(_g < _g1.length) {
			var mesh = _g1[_g];
			++_g;
			mesh.update(dt);
		}
	}
	,addMesh: function(mesh) {
		this.meshes.push(mesh);
	}
	,__class__: engine_misato_GameObject
};
var assets_misato_objects_Sword = function(s3d) {
	this.handleT = 0;
	engine_misato_GameObject.call(this,s3d);
	this.blade = new assets_misato_poly_Kite(this,.1,1,.1,.2,true);
	this.handleEnd = new assets_misato_poly_Sphere(this,.15,.15,.15,null,20);
	this.handle = new assets_misato_poly_Cube(this,.06,.25,.06);
	this.hilt = new assets_misato_poly_Cube(this,.34,.1,.1);
	this.handleEnd.material.mshader.color__.setColor(5164484,null);
	this.handle.material.mshader.color__.setColor(13104228,null);
	this.hilt.material.mshader.color__.setColor(16739179,null);
	this.blade.material.mshader.color__.setColor(12864856,null);
	this.blade.material.passes.enableLights = false;
	this.handleEnd.material.passes.enableLights = false;
	this.handle.material.passes.enableLights = false;
	this.hilt.material.passes.enableLights = false;
	this.blade.set_y(.5);
	this.handleEnd.set_y(-.525);
	this.hilt.set_y(.1);
	this.handleEndExpandPass = new assets_misato_poly_passes_LinearExpandPass(1,-1,.1);
	this.handleEnd.addPass(this.handleEndExpandPass);
	this.handle.addPass(new assets_misato_poly_passes_LinearExpandPass(2,.5,.25));
	this.handleEnd.set_scaleY(2);
};
$hxClasses["assets.misato.objects.Sword"] = assets_misato_objects_Sword;
assets_misato_objects_Sword.__name__ = ["assets","misato","objects","Sword"];
assets_misato_objects_Sword.__super__ = engine_misato_GameObject;
assets_misato_objects_Sword.prototype = $extend(engine_misato_GameObject.prototype,{
	update: function(dt) {
		this.handleT += dt;
		this.handleEndExpandPass.offset = Math.sin(this.handleT / 60) * .05;
		engine_misato_GameObject.prototype.update.call(this,dt);
	}
	,__class__: assets_misato_objects_Sword
});
var h3d_scene_Object = function(parent) {
	this.flags = 0;
	this.absPos = new h3d_Matrix();
	this.absPos.identity();
	this.x = 0;
	this.set_posChanged(true);
	0;
	this.y = 0;
	this.set_posChanged(true);
	0;
	this.z = 0;
	this.set_posChanged(true);
	0;
	this.scaleX = 1;
	this.set_posChanged(true);
	1;
	this.scaleY = 1;
	this.set_posChanged(true);
	1;
	this.scaleZ = 1;
	this.set_posChanged(true);
	1;
	this.qRot = new h3d_Quat();
	this.set_posChanged(false);
	this.set_visible(true);
	this.childs = [];
	if(parent != null) parent.addChild(this);
};
$hxClasses["h3d.scene.Object"] = h3d_scene_Object;
h3d_scene_Object.__name__ = ["h3d","scene","Object"];
h3d_scene_Object.prototype = {
	set_posChanged: function(b) {
		var f = 1;
		if(b) this.flags |= f; else this.flags &= ~f;
		return b;
	}
	,set_culled: function(b) {
		var f = 4;
		if(b) this.flags |= f; else this.flags &= ~f;
		return b;
	}
	,set_visible: function(b) {
		this.set_culled(!b);
		var f = 2;
		if(b) this.flags |= f; else this.flags &= ~f;
		return b;
	}
	,set_allocated: function(b) {
		var f = 32;
		if(b) this.flags |= f; else this.flags &= ~f;
		return b;
	}
	,localToGlobal: function(pt) {
		this.syncPos();
		if(pt == null) pt = new h3d_Vector();
		pt.transform3x4(this.absPos);
		return pt;
	}
	,getInvPos: function() {
		this.syncPos();
		if(this.invPos == null) {
			this.invPos = new h3d_Matrix();
			this.invPos._44 = 0;
		}
		if(this.invPos._44 == 0) this.invPos.inverse3x4(this.absPos);
		return this.invPos;
	}
	,addChild: function(o) {
		this.addChildAt(o,this.childs.length);
	}
	,addChildAt: function(o,pos) {
		if(pos < 0) pos = 0;
		if(pos > this.childs.length) pos = this.childs.length;
		var p = this;
		while(p != null) {
			if(p == o) throw new js__$Boot_HaxeError("Recursive addChild");
			p = p.parent;
		}
		if(o.parent != null) {
			var old = (o.flags & 32) != 0;
			o.set_allocated(false);
			o.parent.removeChild(o);
			o.set_allocated(old);
		}
		this.childs.splice(pos,0,o);
		if(!((this.flags & 32) != 0) && (o.flags & 32) != 0) o.onDelete();
		o.parent = this;
		o.set_posChanged(true);
		if((this.flags & 32) != 0) {
			if(!((o.flags & 32) != 0)) o.onAlloc(); else o.onParentChangedRec();
		}
	}
	,onParentChangedRec: function() {
		this.onParentChanged();
		var _g = 0;
		var _g1 = this.childs;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			c.onParentChangedRec();
		}
	}
	,onParentChanged: function() {
	}
	,onAlloc: function() {
		this.set_allocated(true);
		var _g = 0;
		var _g1 = this.childs;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			c.onAlloc();
		}
	}
	,onDelete: function() {
		this.set_allocated(false);
		var _g = 0;
		var _g1 = this.childs;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			c.onDelete();
		}
	}
	,removeChild: function(o) {
		if(HxOverrides.remove(this.childs,o)) {
			if((o.flags & 32) != 0) o.onDelete();
			o.parent = null;
			o.set_posChanged(true);
		}
	}
	,getScene: function() {
		var p = this;
		while(p.parent != null) p = p.parent;
		return (p instanceof h3d_scene_Scene)?p:null;
	}
	,draw: function(ctx) {
	}
	,calcAbsPos: function() {
		this.qRot.saveToMatrix(this.absPos);
		this.absPos._11 *= this.scaleX;
		this.absPos._12 *= this.scaleX;
		this.absPos._13 *= this.scaleX;
		this.absPos._21 *= this.scaleY;
		this.absPos._22 *= this.scaleY;
		this.absPos._23 *= this.scaleY;
		this.absPos._31 *= this.scaleZ;
		this.absPos._32 *= this.scaleZ;
		this.absPos._33 *= this.scaleZ;
		this.absPos._41 = this.x;
		this.absPos._42 = this.y;
		this.absPos._43 = this.z;
		if(this.follow != null) {
			this.follow.syncPos();
			if((this.flags & 8) != 0) {
				var _g = this.absPos;
				_g._41 = _g._41 + this.follow.absPos._41;
				var _g1 = this.absPos;
				_g1._42 = _g1._42 + this.follow.absPos._42;
				var _g2 = this.absPos;
				_g2._43 = _g2._43 + this.follow.absPos._43;
			} else this.absPos.multiply3x4(this.absPos,this.follow.absPos);
		} else if(this.parent != null) this.absPos.multiply3x4inline(this.absPos,this.parent.absPos);
		if(this.defaultTransform != null) this.absPos.multiply3x4inline(this.defaultTransform,this.absPos);
		if(this.invPos != null) this.invPos._44 = 0;
	}
	,sync: function(ctx) {
	}
	,syncRec: function(ctx) {
		if(this.currentAnimation != null) {
			var old1 = this.parent;
			var dt = ctx.elapsedTime;
			while(dt > 0 && this.currentAnimation != null) dt = this.currentAnimation.update(dt);
			if(this.currentAnimation != null && (ctx.visibleFlag && (this.flags & 2) != 0 && !((this.flags & 4) != 0) || (this.flags & 64) != 0)) this.currentAnimation.sync();
			if(this.parent == null && old1 != null) return;
		}
		var old = ctx.visibleFlag;
		if(!((this.flags & 2) != 0) || (this.flags & 4) != 0 && (this.flags & 128) != 0) ctx.visibleFlag = false;
		var changed = (this.flags & 1) != 0;
		if(changed) this.calcAbsPos();
		this.sync(ctx);
		this.set_posChanged(this.follow == null);
		this.lastFrame = ctx.frame;
		var p = 0;
		var len = this.childs.length;
		while(p < len) {
			var c = this.childs[p];
			if(c == null) break;
			if(c.lastFrame != ctx.frame) {
				if(changed) c.set_posChanged(true);
				c.syncRec(ctx);
			}
			if(this.childs[p] != c) {
				p = 0;
				len = this.childs.length;
			} else p++;
		}
		ctx.visibleFlag = old;
	}
	,syncPos: function() {
		if(this.parent != null) this.parent.syncPos();
		if((this.flags & 1) != 0) {
			this.set_posChanged(false);
			this.calcAbsPos();
			var _g = 0;
			var _g1 = this.childs;
			while(_g < _g1.length) {
				var c = _g1[_g];
				++_g;
				c.set_posChanged(true);
			}
		}
	}
	,emit: function(ctx) {
	}
	,emitRec: function(ctx) {
		if((this.flags & 4) != 0) return;
		if((this.flags & 1) != 0) {
			if(this.currentAnimation != null) this.currentAnimation.sync();
			this.set_posChanged(false);
			this.calcAbsPos();
			var _g = 0;
			var _g1 = this.childs;
			while(_g < _g1.length) {
				var c = _g1[_g];
				++_g;
				c.set_posChanged(true);
			}
		}
		this.emit(ctx);
		var _g2 = 0;
		var _g11 = this.childs;
		while(_g2 < _g11.length) {
			var c1 = _g11[_g2];
			++_g2;
			c1.emitRec(ctx);
		}
	}
	,set_x: function(v) {
		this.x = v;
		this.set_posChanged(true);
		return v;
	}
	,set_y: function(v) {
		this.y = v;
		this.set_posChanged(true);
		return v;
	}
	,set_z: function(v) {
		this.z = v;
		this.set_posChanged(true);
		return v;
	}
	,set_scaleY: function(v) {
		this.scaleY = v;
		this.set_posChanged(true);
		return v;
	}
	,setRotate: function(rx,ry,rz) {
		this.qRot.initRotate(rx,ry,rz);
		this.set_posChanged(true);
	}
	,__class__: h3d_scene_Object
};
var h3d_scene_Mesh = function(prim,mat,parent) {
	h3d_scene_Object.call(this,parent);
	this.primitive = prim;
	if(mat == null) mat = new h3d_mat_MeshMaterial(null);
	this.material = mat;
};
$hxClasses["h3d.scene.Mesh"] = h3d_scene_Mesh;
h3d_scene_Mesh.__name__ = ["h3d","scene","Mesh"];
h3d_scene_Mesh.__super__ = h3d_scene_Object;
h3d_scene_Mesh.prototype = $extend(h3d_scene_Object.prototype,{
	draw: function(ctx) {
		this.primitive.render(ctx.engine);
	}
	,emit: function(ctx) {
		ctx.emit(this.material,this,null);
	}
	,__class__: h3d_scene_Mesh
});
var engine_misato_poly_CustomMesh = function(parent,p,idx,fn) {
	if(fn == null) fn = true;
	this.passes = [];
	this.zRotation = 0;
	this.yRotation = 0;
	this.xRotation = 0;
	this.customPolygon = new engine_misato_poly_CustomPolygon(p,idx,fn);
	this.primitive = this.customPolygon;
	h3d_scene_Mesh.call(this,this.primitive,new h3d_mat_MeshMaterial(),parent.apiObject);
	this.material.passes.enableLights = true;
	var transformPass = new engine_misato_poly_PolyTransformPass($bind(this,this.applyTransforms));
	transformPass.priority = 100;
	this.addPass(transformPass);
	parent.addMesh(this);
};
$hxClasses["engine.misato.poly.CustomMesh"] = engine_misato_poly_CustomMesh;
engine_misato_poly_CustomMesh.__name__ = ["engine","misato","poly","CustomMesh"];
engine_misato_poly_CustomMesh.__super__ = h3d_scene_Mesh;
engine_misato_poly_CustomMesh.prototype = $extend(h3d_scene_Mesh.prototype,{
	addPass: function(pass) {
		if(this.passes.length == 0) this.passes.push(pass); else {
			var inserted = false;
			var _g1 = 0;
			var _g = this.passes.length;
			while(_g1 < _g) {
				var i = _g1++;
				if(this.passes[i].priority < pass.priority) {
					this.passes.splice(i,0,pass);
					inserted = true;
					break;
				}
			}
			if(!inserted) this.passes.push(pass);
		}
	}
	,applyTransforms: function(p2) {
		var sx = Math.sin(this.xRotation);
		var cx = Math.cos(this.xRotation);
		var sy = Math.sin(this.yRotation);
		var cy = Math.cos(this.yRotation);
		var sz = Math.sin(this.zRotation);
		var cz = Math.cos(this.zRotation);
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
	,update: function(dt) {
		haxe_ds_ArraySort.sort(this.passes,function(p1,p2) {
			if(p1.priority < p2.priority) return -1;
			if(p1.priority > p2.priority) return 1;
			return 0;
		});
		this.customPolygon.resetPoints();
		var _g = 0;
		var _g1 = this.passes;
		while(_g < _g1.length) {
			var pass = _g1[_g];
			++_g;
			this.customPolygon.runFilter(pass.transformFunc);
		}
		if(this.customPolygon.faceNormals) this.customPolygon.addNormals(); else this.customPolygon.addVertexNormals();
	}
	,__class__: engine_misato_poly_CustomMesh
});
var assets_misato_poly_Cube = function(parent,x,y,z,fn) {
	if(fn == null) fn = false;
	if(z == null) z = 1.;
	if(y == null) y = 1.;
	if(x == null) x = 1.;
	var p = [new h3d_col_Point(-x / 2,-y / 2,-z / 2),new h3d_col_Point(x / 2,-y / 2,-z / 2),new h3d_col_Point(-x / 2,y / 2,-z / 2),new h3d_col_Point(-x / 2,-y / 2,z / 2),new h3d_col_Point(x / 2,y / 2,-z / 2),new h3d_col_Point(x / 2,-y / 2,z / 2),new h3d_col_Point(-x / 2,y / 2,z / 2),new h3d_col_Point(x / 2,y / 2,z / 2)];
	var idx;
	var this1;
	this1 = new Array(0);
	idx = this1;
	idx.push(0);
	idx.push(1);
	idx.push(5);
	idx.push(0);
	idx.push(5);
	idx.push(3);
	idx.push(1);
	idx.push(4);
	idx.push(7);
	idx.push(1);
	idx.push(7);
	idx.push(5);
	idx.push(3);
	idx.push(5);
	idx.push(7);
	idx.push(3);
	idx.push(7);
	idx.push(6);
	idx.push(0);
	idx.push(6);
	idx.push(2);
	idx.push(0);
	idx.push(3);
	idx.push(6);
	idx.push(2);
	idx.push(7);
	idx.push(4);
	idx.push(2);
	idx.push(6);
	idx.push(7);
	idx.push(0);
	idx.push(4);
	idx.push(1);
	idx.push(0);
	idx.push(2);
	idx.push(4);
	engine_misato_poly_CustomMesh.call(this,parent,p,idx,fn);
};
$hxClasses["assets.misato.poly.Cube"] = assets_misato_poly_Cube;
assets_misato_poly_Cube.__name__ = ["assets","misato","poly","Cube"];
assets_misato_poly_Cube.__super__ = engine_misato_poly_CustomMesh;
assets_misato_poly_Cube.prototype = $extend(engine_misato_poly_CustomMesh.prototype,{
	__class__: assets_misato_poly_Cube
});
var assets_misato_poly_Kite = function(parent,x,y,z,my,fn) {
	if(fn == null) fn = false;
	if(my == null) my = .5;
	if(z == null) z = 1.;
	if(y == null) y = 1.;
	if(x == null) x = 1.;
	var p = [new h3d_col_Point(0,-y / 2,0),new h3d_col_Point(x / 2,y * my - y / 2,0),new h3d_col_Point(-x / 2,y * my - y / 2,0),new h3d_col_Point(0,y * my - y / 2,z / 2),new h3d_col_Point(0,y * my - y / 2,-z / 2),new h3d_col_Point(0,y / 2,0)];
	var idx;
	var this1;
	this1 = new Array(0);
	idx = this1;
	idx.push(0);
	idx.push(1);
	idx.push(3);
	idx.push(0);
	idx.push(3);
	idx.push(2);
	idx.push(0);
	idx.push(4);
	idx.push(1);
	idx.push(0);
	idx.push(2);
	idx.push(4);
	idx.push(5);
	idx.push(3);
	idx.push(1);
	idx.push(5);
	idx.push(2);
	idx.push(3);
	idx.push(5);
	idx.push(1);
	idx.push(4);
	idx.push(5);
	idx.push(4);
	idx.push(2);
	engine_misato_poly_CustomMesh.call(this,parent,p,idx,fn);
};
$hxClasses["assets.misato.poly.Kite"] = assets_misato_poly_Kite;
assets_misato_poly_Kite.__name__ = ["assets","misato","poly","Kite"];
assets_misato_poly_Kite.__super__ = engine_misato_poly_CustomMesh;
assets_misato_poly_Kite.prototype = $extend(engine_misato_poly_CustomMesh.prototype,{
	__class__: assets_misato_poly_Kite
});
var assets_misato_poly_Sphere = function(parent,x,y,z,fn,layers,longs) {
	if(longs == null) longs = 10;
	if(layers == null) layers = 5;
	if(fn == null) fn = false;
	if(z == null) z = 1.;
	if(y == null) y = 1.;
	if(x == null) x = 1.;
	var p = [];
	var idx;
	var this1;
	this1 = new Array(0);
	idx = this1;
	var py = this.getSliceY(0,layers,y);
	var r = this.getSliceRadius(y,py);
	p.push(this.sliceFirstPoint(x,y,r,py));
	var _g = 1;
	while(_g < longs) {
		var j = _g++;
		p.push(this.slicePoint(x,y,z,r,py,j,longs));
	}
	var _g1 = 1;
	while(_g1 < layers) {
		var i = _g1++;
		var py1 = this.getSliceY(i,layers,y);
		var r1 = this.getSliceRadius(y,py1);
		p.push(this.sliceFirstPoint(x,y,r1,py1));
		var _g11 = 1;
		while(_g11 < longs) {
			var j1 = _g11++;
			p.push(this.slicePoint(x,y,z,r1,py1,j1,longs));
			var p13 = i * longs + j1;
			var p23 = i * longs + j1 - 1;
			var p31 = (i - 1) * longs + j1;
			var p41 = (i - 1) * longs + j1 - 1;
			idx.push(p13);
			idx.push(p31);
			idx.push(p23);
			idx.push(p41);
			idx.push(p23);
			idx.push(p31);
		}
		var p12 = i * longs;
		var p22 = (i + 1) * longs - 1;
		var p3 = (i - 1) * longs;
		var p4 = i * longs - 1;
		idx.push(p12);
		idx.push(p3);
		idx.push(p22);
		idx.push(p4);
		idx.push(p22);
		idx.push(p3);
	}
	p.push(new h3d_col_Point(0,-y / 2,0));
	var _g2 = 1;
	while(_g2 < longs) {
		var i1 = _g2++;
		idx.push(longs * layers);
		idx.push(i1 - 1);
		idx.push(i1);
	}
	var p1 = 0;
	var p2 = longs - 1;
	idx.push(p2);
	idx.push(p1);
	idx.push(longs * layers);
	p.push(new h3d_col_Point(0,y / 2,0));
	var _g3 = 1;
	while(_g3 < longs) {
		var i2 = _g3++;
		idx.push(longs * layers + 1);
		idx.push(longs * (layers - 1) + i2);
		idx.push(longs * (layers - 1) + i2 - 1);
	}
	var p11 = longs * (layers - 1);
	var p21 = longs * layers - 1;
	idx.push(p11);
	idx.push(p21);
	idx.push(longs * layers + 1);
	engine_misato_poly_CustomMesh.call(this,parent,p,idx,fn);
};
$hxClasses["assets.misato.poly.Sphere"] = assets_misato_poly_Sphere;
assets_misato_poly_Sphere.__name__ = ["assets","misato","poly","Sphere"];
assets_misato_poly_Sphere.__super__ = engine_misato_poly_CustomMesh;
assets_misato_poly_Sphere.prototype = $extend(engine_misato_poly_CustomMesh.prototype,{
	getSliceY: function(i,layers,y) {
		return -Math.cos((i + 1) / (layers + 1) * Math.PI) * y / 2;
	}
	,getSliceRadius: function(y,py) {
		var t = py / (y / 2);
		if(t == 0) return y / 2;
		return py * Math.sqrt(1 - t * t) / t;
	}
	,sliceFirstPoint: function(x,y,r,py) {
		return new h3d_col_Point(x / 2 / (y / 2) * r,py,0);
	}
	,slicePoint: function(x,y,z,r,py,j,longs) {
		var angle = j / longs * Math.PI * 2;
		var px = Math.cos(angle);
		var pz = Math.sin(angle);
		return new h3d_col_Point(px / (y / 2) * x / 2 * r,py,pz / (y / 2) * z / 2 * r);
	}
	,__class__: assets_misato_poly_Sphere
});
var engine_misato_poly_PolyTransformPass = function(func) {
	this.priority = 0;
	this.transformFunc = func;
};
$hxClasses["engine.misato.poly.PolyTransformPass"] = engine_misato_poly_PolyTransformPass;
engine_misato_poly_PolyTransformPass.__name__ = ["engine","misato","poly","PolyTransformPass"];
engine_misato_poly_PolyTransformPass.prototype = {
	__class__: engine_misato_poly_PolyTransformPass
};
var assets_misato_poly_passes_LinearExpandPass = function(sw,ew,h,o,axis) {
	if(o == null) o = 0;
	if(h == null) h = 1;
	this.hasCustomAxis = false;
	var _g = this;
	if(axis != null) {
		this.customAxis = axis;
		this.hasCustomAxis = true;
	}
	this.startWidth = sw;
	this.endWidth = ew;
	this.height = h;
	this.offset = o;
	var func = function(p) {
		if(!_g.hasCustomAxis) {
			var multiplier = _g.startWidth + (_g.endWidth - _g.startWidth) * ((p.y - _g.offset) / _g.height + 0.5);
			p.x *= multiplier;
			p.z *= multiplier;
		}
	};
	engine_misato_poly_PolyTransformPass.call(this,func);
};
$hxClasses["assets.misato.poly.passes.LinearExpandPass"] = assets_misato_poly_passes_LinearExpandPass;
assets_misato_poly_passes_LinearExpandPass.__name__ = ["assets","misato","poly","passes","LinearExpandPass"];
assets_misato_poly_passes_LinearExpandPass.__super__ = engine_misato_poly_PolyTransformPass;
assets_misato_poly_passes_LinearExpandPass.prototype = $extend(engine_misato_poly_PolyTransformPass.prototype,{
	__class__: assets_misato_poly_passes_LinearExpandPass
});
var engine_GameScene = function(e) {
	this.engine = e;
};
$hxClasses["engine.GameScene"] = engine_GameScene;
engine_GameScene.__name__ = ["engine","GameScene"];
engine_GameScene.prototype = {
	__class__: engine_GameScene
};
var engine_misato_GameScene = function(e) {
	engine_GameScene.call(this,e);
	this.apiObject = new h3d_scene_Object(e.s3d);
};
$hxClasses["engine.misato.GameScene"] = engine_misato_GameScene;
engine_misato_GameScene.__name__ = ["engine","misato","GameScene"];
engine_misato_GameScene.__super__ = engine_GameScene;
engine_misato_GameScene.prototype = $extend(engine_GameScene.prototype,{
	init: function() {
		this.light = new h3d_scene_DirLight(new h3d_Vector(0.6,0.5,-0.5),this.engine.s3d);
		this.engine.s3d.lightSystem.ambientLight.set(0.3,0.3,0.3,null);
	}
	,update: function(dt) {
	}
	,__class__: engine_misato_GameScene
});
var assets_misato_scenes_Test = function(e) {
	this.numSwords = 25;
	this.swords = [];
	this.time = 0.;
	engine_misato_GameScene.call(this,e);
};
$hxClasses["assets.misato.scenes.Test"] = assets_misato_scenes_Test;
assets_misato_scenes_Test.__name__ = ["assets","misato","scenes","Test"];
assets_misato_scenes_Test.__super__ = engine_misato_GameScene;
assets_misato_scenes_Test.prototype = $extend(engine_misato_GameScene.prototype,{
	init: function() {
		engine_misato_GameScene.prototype.init.call(this);
		var _g1 = 0;
		var _g = this.numSwords;
		while(_g1 < _g) {
			var i = _g1++;
			var sword = new assets_misato_objects_Sword(this.apiObject);
			this.swords.push(sword);
		}
	}
	,update: function(dt) {
		engine_misato_GameScene.prototype.update.call(this,dt);
		this.time += .01 * dt;
		var dist = 5;
		this.engine.engine.backgroundColor = -11181456;
		var s = Math.sin(this.time);
		var c = Math.sin(this.time);
		var numSwords = Math.floor(-Math.sin(this.time * 4) * 100 + 105);
		s *= 2;
		c *= 2;
		if(this.time % (Math.PI * 2) > Math.PI) s = 0; else c = 0;
		var i = 0;
		var _g = 0;
		var _g1 = this.swords;
		while(_g < _g1.length) {
			var sword = _g1[_g];
			++_g;
			sword.apiObject.set_z(c * (i / (numSwords - 1) - .5));
			sword.apiObject.set_x(s * (i / (numSwords - 1) - .5));
			sword.apiObject.setRotate(c * (i / (numSwords - 1) - .5) * Math.PI * 2 + Math.PI,0,s * (i / (numSwords - 1) - .5) * Math.PI * 2);
			sword.hilt.xRotation += dt / 10;
			sword.update(dt);
			i++;
		}
	}
	,__class__: assets_misato_scenes_Test
});
var engine_GameEvent = function() { };
$hxClasses["engine.GameEvent"] = engine_GameEvent;
engine_GameEvent.__name__ = ["engine","GameEvent"];
engine_GameEvent.prototype = {
	__class__: engine_GameEvent
};
var h3d_prim_Primitive = function() { };
$hxClasses["h3d.prim.Primitive"] = h3d_prim_Primitive;
h3d_prim_Primitive.__name__ = ["h3d","prim","Primitive"];
h3d_prim_Primitive.prototype = {
	triCount: function() {
		if(this.indexes != null) return this.indexes.count / 3 | 0; else if(this.buffer == null) return 0; else return Std["int"](this.buffer.totalVertices() / 3);
	}
	,alloc: function(engine) {
		throw new js__$Boot_HaxeError("not implemented");
	}
	,render: function(engine) {
		if(this.buffer == null || this.buffer.isDisposed()) this.alloc(engine);
		if(this.indexes == null) {
			if((this.buffer.flags & 1 << h3d_BufferFlag.Quads[1]) != 0) engine.renderBuffer(this.buffer,engine.mem.quadIndexes,2,0,-1); else engine.renderBuffer(this.buffer,engine.mem.triIndexes,3,0,-1);
		} else engine.renderIndexed(this.buffer,this.indexes);
	}
	,dispose: function() {
		if(this.buffer != null) {
			this.buffer.dispose();
			this.buffer = null;
		}
		if(this.indexes != null) {
			this.indexes.dispose();
			this.indexes = null;
		}
	}
	,__class__: h3d_prim_Primitive
};
var h3d_prim_Polygon = function(points,idx) {
	this.points = points;
	this.idx = idx;
};
$hxClasses["h3d.prim.Polygon"] = h3d_prim_Polygon;
h3d_prim_Polygon.__name__ = ["h3d","prim","Polygon"];
h3d_prim_Polygon.__super__ = h3d_prim_Primitive;
h3d_prim_Polygon.prototype = $extend(h3d_prim_Primitive.prototype,{
	alloc: function(engine) {
		this.dispose();
		var size = 3;
		if(this.normals != null) size += 3;
		if(this.uvs != null) size += 2;
		if(this.colors != null) size += 3;
		var buf;
		var this1;
		this1 = new Array(0);
		buf = this1;
		var _g1 = 0;
		var _g = this.points.length;
		while(_g1 < _g) {
			var k = _g1++;
			var p = this.points[k];
			buf.push(p.x);
			buf.push(p.y);
			buf.push(p.z);
			if(this.normals != null) {
				var n = this.normals[k];
				buf.push(n.x);
				buf.push(n.y);
				buf.push(n.z);
			}
			if(this.uvs != null) {
				var t = this.uvs[k];
				buf.push(t.u);
				buf.push(t.v);
			}
			if(this.colors != null) {
				var c = this.colors[k];
				buf.push(c.x);
				buf.push(c.y);
				buf.push(c.z);
			}
		}
		var flags = [];
		if(this.idx == null) flags.push(h3d_BufferFlag.Triangles);
		if(this.normals == null) flags.push(h3d_BufferFlag.RawFormat);
		this.buffer = h3d_Buffer.ofFloats(buf,size,flags);
		if(this.idx != null) this.indexes = h3d_Indexes.alloc(this.idx);
	}
	,addNormals: function() {
		this.normals = [];
		var _g1 = 0;
		var _g = this.points.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.normals[i] = new h3d_col_Point();
		}
		var pos = 0;
		var _g11 = 0;
		var _g2 = this.triCount();
		while(_g11 < _g2) {
			var i1 = _g11++;
			var i0;
			var i11;
			var i2;
			if(this.idx == null) {
				i0 = pos++;
				i11 = pos++;
				i2 = pos++;
			} else {
				var key = pos++;
				i0 = this.idx[key];
				var key1 = pos++;
				i11 = this.idx[key1];
				var key2 = pos++;
				i2 = this.idx[key2];
			}
			var p0 = this.points[i0];
			var p1 = this.points[i11];
			var p2 = this.points[i2];
			var n = new h3d_col_Point(p1.x - p0.x,p1.y - p0.y,p1.z - p0.z).cross(new h3d_col_Point(p2.x - p0.x,p2.y - p0.y,p2.z - p0.z));
			this.normals[i0].x += n.x;
			this.normals[i0].y += n.y;
			this.normals[i0].z += n.z;
			this.normals[i11].x += n.x;
			this.normals[i11].y += n.y;
			this.normals[i11].z += n.z;
			this.normals[i2].x += n.x;
			this.normals[i2].y += n.y;
			this.normals[i2].z += n.z;
		}
		var _g3 = 0;
		var _g12 = this.normals;
		while(_g3 < _g12.length) {
			var n1 = _g12[_g3];
			++_g3;
			n1.normalize();
		}
	}
	,triCount: function() {
		var n = h3d_prim_Primitive.prototype.triCount.call(this);
		if(n != 0) return n;
		return (this.idx == null?this.points.length:this.idx.length) / 3 | 0;
	}
	,__class__: h3d_prim_Polygon
});
var engine_misato_poly_CustomPolygon = function(p,idx,fn) {
	if(fn == null) fn = true;
	this.faceNormals = true;
	this.pointList = p;
	this.idList = idx;
	h3d_prim_Polygon.call(this,p,idx);
	this.faceNormals = fn;
	this.resetPoints();
	if(this.faceNormals) this.addNormals(); else this.addVertexNormals();
};
$hxClasses["engine.misato.poly.CustomPolygon"] = engine_misato_poly_CustomPolygon;
engine_misato_poly_CustomPolygon.__name__ = ["engine","misato","poly","CustomPolygon"];
engine_misato_poly_CustomPolygon.__super__ = h3d_prim_Polygon;
engine_misato_poly_CustomPolygon.prototype = $extend(h3d_prim_Polygon.prototype,{
	runFilter: function(filter) {
		var _g = 0;
		var _g1 = this.points;
		while(_g < _g1.length) {
			var point = _g1[_g];
			++_g;
			filter(point);
		}
		this.dispose();
	}
	,addVertexNormals: function() {
		this.normals = [];
		var _g = 0;
		var _g1 = this.pointList;
		while(_g < _g1.length) {
			var point = _g1[_g];
			++_g;
			var p = new h3d_col_Point(point.x,point.y,point.z);
			p.normalize();
			this.normals.push(p);
		}
	}
	,resetPoints: function() {
		if(this.faceNormals) {
			if(this.idList != null && this.pointList.length != this.idList.length) {
				var p = [];
				var used = [];
				var _g1 = 0;
				var _g = this.idList.length;
				while(_g1 < _g) {
					var i = _g1++;
					p.push(this.pointList[this.idList[i]].clone());
				}
				this.points = p;
				this.idx = null;
			}
		} else {
			this.points = [];
			var _g2 = 0;
			var _g11 = this.pointList;
			while(_g2 < _g11.length) {
				var point = _g11[_g2];
				++_g2;
				this.points.push(new h3d_col_Point(point.x,point.y,point.z));
			}
			this.idx = this.idList;
		}
		this.dispose();
	}
	,__class__: engine_misato_poly_CustomPolygon
});
var evsm_FState = function() { };
$hxClasses["evsm.FState"] = evsm_FState;
evsm_FState.__name__ = ["evsm","FState"];
var h2d_Sprite = function(parent) {
	this.alpha = 1.;
	this.matA = 1;
	this.matB = 0;
	this.matC = 0;
	this.matD = 1;
	this.absX = 0;
	this.absY = 0;
	this.posChanged = true;
	this.x = 0;
	this.posChanged = true;
	this.y = 0;
	this.posChanged = true;
	this.scaleX = 1;
	this.posChanged = true;
	this.scaleY = 1;
	this.posChanged = true;
	this.rotation = 0;
	this.posChanged = parent != null;
	this.visible = true;
	this.childs = [];
	this.filters = [];
	if(parent != null) parent.addChild(this);
};
$hxClasses["h2d.Sprite"] = h2d_Sprite;
h2d_Sprite.__name__ = ["h2d","Sprite"];
h2d_Sprite.prototype = {
	getBounds: function(relativeTo,out) {
		if(out == null) out = new h2d_col_Bounds();
		if(relativeTo != null) relativeTo.syncPos();
		if(relativeTo != this) this.syncPos();
		this.getBoundsRec(relativeTo,out,false);
		if(out.xMax <= out.xMin || out.yMax <= out.yMin) {
			this.addBounds(relativeTo,out,-1,-1,2,2);
			out.xMax = out.xMin = (out.xMax + out.xMin) * 0.5;
			out.yMax = out.yMin = (out.yMax + out.yMin) * 0.5;
		}
		return out;
	}
	,getBoundsRec: function(relativeTo,out,forSize) {
		if(this.posChanged) {
			this.calcAbsPos();
			var _g = 0;
			var _g1 = this.childs;
			while(_g < _g1.length) {
				var c = _g1[_g];
				++_g;
				c.posChanged = true;
			}
			this.posChanged = false;
		}
		var n = this.childs.length;
		if(n == 0) {
			out.xMin = 1e20;
			out.yMin = 1e20;
			out.xMax = -1e20;
			out.yMax = -1e20;
			return;
		}
		if(n == 1) {
			var c1 = this.childs[0];
			if(c1.visible) c1.getBoundsRec(relativeTo,out,forSize); else {
				out.xMin = 1e20;
				out.yMin = 1e20;
				out.xMax = -1e20;
				out.yMax = -1e20;
			}
			return;
		}
		var xmin = Infinity;
		var ymin = Infinity;
		var xmax = -Infinity;
		var ymax = -Infinity;
		var _g2 = 0;
		var _g11 = this.childs;
		while(_g2 < _g11.length) {
			var c2 = _g11[_g2];
			++_g2;
			if(!c2.visible) continue;
			c2.getBoundsRec(relativeTo,out,forSize);
			if(out.xMin < xmin) xmin = out.xMin;
			if(out.yMin < ymin) ymin = out.yMin;
			if(out.xMax > xmax) xmax = out.xMax;
			if(out.yMax > ymax) ymax = out.yMax;
		}
		out.xMin = xmin;
		out.yMin = ymin;
		out.xMax = xmax;
		out.yMax = ymax;
	}
	,addBounds: function(relativeTo,out,dx,dy,width,height) {
		if(width <= 0 || height <= 0) return;
		if(relativeTo == null) {
			var x1;
			var y1;
			out.addPos(dx * this.matA + dy * this.matC + this.absX,dx * this.matB + dy * this.matD + this.absY);
			out.addPos((dx + width) * this.matA + dy * this.matC + this.absX,(dx + width) * this.matB + dy * this.matD + this.absY);
			out.addPos(dx * this.matA + (dy + height) * this.matC + this.absX,dx * this.matB + (dy + height) * this.matD + this.absY);
			out.addPos((dx + width) * this.matA + (dy + height) * this.matC + this.absX,(dx + width) * this.matB + (dy + height) * this.matD + this.absY);
			return;
		}
		if(relativeTo == this) {
			if(out.xMin > dx) out.xMin = dx;
			if(out.yMin > dy) out.yMin = dy;
			if(out.xMax < dx + width) out.xMax = dx + width;
			if(out.yMax < dy + height) out.yMax = dy + height;
			return;
		}
		var det = 1 / (relativeTo.matA * relativeTo.matD - relativeTo.matB * relativeTo.matC);
		var rA = relativeTo.matD * det;
		var rB = -relativeTo.matB * det;
		var rC = -relativeTo.matC * det;
		var rD = relativeTo.matA * det;
		var rX = this.absX - relativeTo.absX;
		var rY = this.absY - relativeTo.absY;
		var x;
		var y;
		x = dx * this.matA + dy * this.matC + rX;
		y = dx * this.matB + dy * this.matD + rY;
		out.addPos(x * rA + y * rC,x * rB + y * rD);
		x = (dx + width) * this.matA + dy * this.matC + rX;
		y = (dx + width) * this.matB + dy * this.matD + rY;
		out.addPos(x * rA + y * rC,x * rB + y * rD);
		x = dx * this.matA + (dy + height) * this.matC + rX;
		y = dx * this.matB + (dy + height) * this.matD + rY;
		out.addPos(x * rA + y * rC,x * rB + y * rD);
		x = (dx + width) * this.matA + (dy + height) * this.matC + rX;
		y = (dx + width) * this.matB + (dy + height) * this.matD + rY;
		out.addPos(x * rA + y * rC,x * rB + y * rD);
	}
	,getScene: function() {
		var p = this;
		while(p.parent != null) p = p.parent;
		return (p instanceof h2d_Scene)?p:null;
	}
	,addChild: function(s) {
		this.addChildAt(s,this.childs.length);
	}
	,addChildAt: function(s,pos) {
		if(pos < 0) pos = 0;
		if(pos > this.childs.length) pos = this.childs.length;
		var p = this;
		while(p != null) {
			if(p == s) throw new js__$Boot_HaxeError("Recursive addChild");
			p = p.parent;
		}
		if(s.parent != null) {
			var old = s.allocated;
			s.allocated = false;
			s.parent.removeChild(s);
			s.allocated = old;
		}
		this.childs.splice(pos,0,s);
		if(!this.allocated && s.allocated) s.onDelete();
		s.parent = this;
		s.posChanged = true;
		if(this.allocated) {
			if(!s.allocated) s.onAlloc(); else s.onParentChangedRec();
		}
	}
	,onParentChangedRec: function() {
		this.onParentChanged();
		var _g = 0;
		var _g1 = this.childs;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			c.onParentChangedRec();
		}
	}
	,onParentChanged: function() {
	}
	,onAlloc: function() {
		this.allocated = true;
		var _g = 0;
		var _g1 = this.childs;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			c.onAlloc();
		}
	}
	,onDelete: function() {
		this.allocated = false;
		var _g = 0;
		var _g1 = this.childs;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			c.onDelete();
		}
	}
	,removeChild: function(s) {
		if(HxOverrides.remove(this.childs,s)) {
			if(s.allocated) s.onDelete();
			s.parent = null;
			s.posChanged = true;
		}
	}
	,draw: function(ctx) {
	}
	,sync: function(ctx) {
		var changed = this.posChanged;
		if(changed) {
			this.calcAbsPos();
			this.posChanged = false;
		}
		this.lastFrame = ctx.frame;
		var p = 0;
		var len = this.childs.length;
		while(p < len) {
			var c = this.childs[p];
			if(c == null) break;
			if(c.lastFrame != ctx.frame) {
				if(changed) c.posChanged = true;
				c.sync(ctx);
			}
			if(this.childs[p] != c) {
				p = 0;
				len = this.childs.length;
			} else p++;
		}
	}
	,syncPos: function() {
		if(this.parent != null) this.parent.syncPos();
		if(this.posChanged) {
			this.calcAbsPos();
			var _g = 0;
			var _g1 = this.childs;
			while(_g < _g1.length) {
				var c = _g1[_g];
				++_g;
				c.posChanged = true;
			}
			this.posChanged = false;
		}
	}
	,calcAbsPos: function() {
		if(this.parent == null) {
			var cr;
			var sr;
			if(this.rotation == 0) {
				cr = 1.;
				sr = 0.;
				this.matA = this.scaleX;
				this.matB = 0;
				this.matC = 0;
				this.matD = this.scaleY;
			} else {
				cr = Math.cos(this.rotation);
				sr = Math.sin(this.rotation);
				this.matA = this.scaleX * cr;
				this.matB = this.scaleX * sr;
				this.matC = this.scaleY * -sr;
				this.matD = this.scaleY * cr;
			}
			this.absX = this.x;
			this.absY = this.y;
		} else {
			if(this.rotation == 0) {
				this.matA = this.scaleX * this.parent.matA;
				this.matB = this.scaleX * this.parent.matB;
				this.matC = this.scaleY * this.parent.matC;
				this.matD = this.scaleY * this.parent.matD;
			} else {
				var cr1 = Math.cos(this.rotation);
				var sr1 = Math.sin(this.rotation);
				var tmpA = this.scaleX * cr1;
				var tmpB = this.scaleX * sr1;
				var tmpC = this.scaleY * -sr1;
				var tmpD = this.scaleY * cr1;
				this.matA = tmpA * this.parent.matA + tmpB * this.parent.matC;
				this.matB = tmpA * this.parent.matB + tmpB * this.parent.matD;
				this.matC = tmpC * this.parent.matA + tmpD * this.parent.matC;
				this.matD = tmpC * this.parent.matB + tmpD * this.parent.matD;
			}
			this.absX = this.x * this.parent.matA + this.y * this.parent.matC + this.parent.absX;
			this.absY = this.x * this.parent.matB + this.y * this.parent.matD + this.parent.absY;
		}
	}
	,emitTile: function(ctx,tile) {
		if(h2d_Sprite.nullDrawable == null) h2d_Sprite.nullDrawable = new h2d_Drawable(null);
		h2d_Sprite.nullDrawable.absX = this.absX;
		h2d_Sprite.nullDrawable.absY = this.absY;
		h2d_Sprite.nullDrawable.matA = this.matA;
		h2d_Sprite.nullDrawable.matB = this.matB;
		h2d_Sprite.nullDrawable.matC = this.matC;
		h2d_Sprite.nullDrawable.matD = this.matD;
		ctx.drawTile(h2d_Sprite.nullDrawable,tile);
		return;
		ctx.beginDrawBatch(h2d_Sprite.nullDrawable,tile.innerTex);
		var ax = this.absX + tile.dx * this.matA + tile.dy * this.matC;
		var ay = this.absY + tile.dx * this.matB + tile.dy * this.matD;
		var buf = ctx.buffer;
		var pos = ctx.bufPos;
		while(buf.length < pos + 32) buf.push(0.);
		var key = pos++;
		buf[key] = ax;
		var key1 = pos++;
		buf[key1] = ay;
		var key2 = pos++;
		buf[key2] = tile.u;
		var key3 = pos++;
		buf[key3] = tile.v;
		var key4 = pos++;
		buf[key4] = 1.;
		var key5 = pos++;
		buf[key5] = 1.;
		var key6 = pos++;
		buf[key6] = 1.;
		var key7 = pos++;
		buf[key7] = ctx.globalAlpha;
		var tw = tile.width;
		var th = tile.height;
		var dx1 = tw * this.matA;
		var dy1 = tw * this.matB;
		var dx2 = th * this.matC;
		var dy2 = th * this.matD;
		var key8 = pos++;
		buf[key8] = ax + dx1;
		var key9 = pos++;
		buf[key9] = ay + dy1;
		var key10 = pos++;
		buf[key10] = tile.u2;
		var key11 = pos++;
		buf[key11] = tile.v;
		var key12 = pos++;
		buf[key12] = 1.;
		var key13 = pos++;
		buf[key13] = 1.;
		var key14 = pos++;
		buf[key14] = 1.;
		var key15 = pos++;
		buf[key15] = ctx.globalAlpha;
		var key16 = pos++;
		buf[key16] = ax + dx2;
		var key17 = pos++;
		buf[key17] = ay + dy2;
		var key18 = pos++;
		buf[key18] = tile.u;
		var key19 = pos++;
		buf[key19] = tile.v2;
		var key20 = pos++;
		buf[key20] = 1.;
		var key21 = pos++;
		buf[key21] = 1.;
		var key22 = pos++;
		buf[key22] = 1.;
		var key23 = pos++;
		buf[key23] = ctx.globalAlpha;
		var key24 = pos++;
		buf[key24] = ax + dx1 + dx2;
		var key25 = pos++;
		buf[key25] = ay + dy1 + dy2;
		var key26 = pos++;
		buf[key26] = tile.u2;
		var key27 = pos++;
		buf[key27] = tile.v2;
		var key28 = pos++;
		buf[key28] = 1.;
		var key29 = pos++;
		buf[key29] = 1.;
		var key30 = pos++;
		buf[key30] = 1.;
		var key31 = pos++;
		buf[key31] = ctx.globalAlpha;
		ctx.bufPos = pos;
	}
	,clipBounds: function(ctx,bounds) {
		var _g = this;
		var view = ctx.tmpBounds;
		view.xMin = 1e20;
		view.yMin = 1e20;
		view.xMax = -1e20;
		view.yMax = -1e20;
		var x = bounds.xMin;
		var y = bounds.yMin;
		view.addPos(x * _g.matA + y * _g.matC + _g.absX,x * _g.matB + y * _g.matD + _g.absY);
		var x1 = bounds.xMax;
		var y1 = bounds.yMin;
		view.addPos(x1 * _g.matA + y1 * _g.matC + _g.absX,x1 * _g.matB + y1 * _g.matD + _g.absY);
		var x2 = bounds.xMin;
		var y2 = bounds.yMax;
		view.addPos(x2 * _g.matA + y2 * _g.matC + _g.absX,x2 * _g.matB + y2 * _g.matD + _g.absY);
		var x3 = bounds.xMax;
		var y3 = bounds.yMax;
		view.addPos(x3 * _g.matA + y3 * _g.matC + _g.absX,x3 * _g.matB + y3 * _g.matD + _g.absY);
		if(view.xMin < 0) view.xMin = 0;
		if(view.yMin < 0) view.yMin = 0;
		if(view.xMax > ctx.curWidth) view.xMax = ctx.curWidth;
		if(view.yMax > ctx.curHeight) view.yMax = ctx.curHeight;
		var invDet = 1 / (this.matA * this.matD - this.matB * this.matC);
		var sxMin = view.xMin;
		var syMin = view.yMin;
		var sxMax = view.xMax;
		var syMax = view.yMax;
		view.xMin = 1e20;
		view.yMin = 1e20;
		view.xMax = -1e20;
		view.yMax = -1e20;
		var x4 = sxMin;
		var y4 = syMin;
		x4 -= _g.absX;
		y4 -= _g.absY;
		view.addPos((x4 * _g.matD - y4 * _g.matC) * invDet,(-x4 * _g.matB + y4 * _g.matA) * invDet);
		var x5 = sxMax;
		var y5 = syMin;
		x5 -= _g.absX;
		y5 -= _g.absY;
		view.addPos((x5 * _g.matD - y5 * _g.matC) * invDet,(-x5 * _g.matB + y5 * _g.matA) * invDet);
		var x6 = sxMin;
		var y6 = syMax;
		x6 -= _g.absX;
		y6 -= _g.absY;
		view.addPos((x6 * _g.matD - y6 * _g.matC) * invDet,(-x6 * _g.matB + y6 * _g.matA) * invDet);
		var x7 = sxMax;
		var y7 = syMax;
		x7 -= _g.absX;
		y7 -= _g.absY;
		view.addPos((x7 * _g.matD - y7 * _g.matC) * invDet,(-x7 * _g.matB + y7 * _g.matA) * invDet);
		bounds.xMin = hxd_Math.max(bounds.xMin,view.xMin);
		bounds.yMin = hxd_Math.max(bounds.yMin,view.yMin);
		bounds.xMax = hxd_Math.min(bounds.xMax,view.xMax);
		bounds.yMax = hxd_Math.min(bounds.yMax,view.yMax);
	}
	,drawFilters: function(ctx) {
		var bounds = ctx.tmpBounds;
		var total = new h2d_col_Bounds();
		var maxExtent = -1.;
		var _g = 0;
		var _g1 = this.filters;
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			f.sync(ctx,this);
			if(f.autoBounds) {
				if(f.boundsExtend > maxExtent) maxExtent = f.boundsExtend;
			} else {
				f.getBounds(this,bounds);
				if(bounds.xMin < total.xMin) total.xMin = bounds.xMin;
				if(bounds.xMax > total.xMax) total.xMax = bounds.xMax;
				if(bounds.yMin < total.yMin) total.yMin = bounds.yMin;
				if(bounds.yMax > total.yMax) total.yMax = bounds.yMax;
			}
		}
		if(maxExtent >= 0) {
			this.getBounds(this,bounds);
			bounds.xMin -= maxExtent;
			bounds.yMin -= maxExtent;
			bounds.xMax += maxExtent;
			bounds.yMax += maxExtent;
			if(bounds.xMin < total.xMin) total.xMin = bounds.xMin;
			if(bounds.xMax > total.xMax) total.xMax = bounds.xMax;
			if(bounds.yMin < total.yMin) total.yMin = bounds.yMin;
			if(bounds.yMax > total.yMax) total.yMax = bounds.yMax;
		}
		this.clipBounds(ctx,total);
		var xMin = Math.floor(total.xMin + 1e-10);
		var yMin = Math.floor(total.yMin + 1e-10);
		var width = Math.ceil(total.xMax - xMin - 1e-10);
		var height = Math.ceil(total.yMax - yMin - 1e-10);
		if(width <= 0 || height <= 0 || total.xMax < total.xMin) return;
		var t = ctx.textures.allocTarget("filterTemp",ctx,width,height,false);
		ctx.pushTarget(t,xMin,yMin);
		ctx.engine.clear(0);
		var oldAlpha = ctx.globalAlpha;
		var shader = ctx.baseShader;
		var oldA = shader.filterMatrixA__.clone();
		var oldB = shader.filterMatrixB__.clone();
		var oldF = ctx.inFilter;
		var invDet = 1 / (this.matA * this.matD - this.matB * this.matC);
		var invA = this.matD * invDet;
		var invB = -this.matB * invDet;
		var invC = -this.matC * invDet;
		var invD = this.matA * invDet;
		var invX = -(this.absX * invA + this.absY * invC);
		var invY = -(this.absX * invB + this.absY * invD);
		ctx.inFilter = this;
		shader.filterMatrixA__.set(invA,invC,invX,null);
		shader.filterMatrixB__.set(invB,invD,invY,null);
		ctx.globalAlpha = 1;
		this.draw(ctx);
		var _g2 = 0;
		var _g11 = this.childs;
		while(_g2 < _g11.length) {
			var c = _g11[_g2];
			++_g2;
			c.drawRec(ctx);
		}
		var $final = h2d_Tile.fromTexture(t);
		$final.dx = xMin;
		$final.dy = yMin;
		var _g3 = 0;
		var _g12 = this.filters;
		while(_g3 < _g12.length) {
			var f1 = _g12[_g3];
			++_g3;
			var prev = $final;
			$final = f1.draw(ctx,$final);
			if($final == null) {
				ctx.popTarget();
				return;
			}
			if($final != prev) {
				$final.dx += xMin;
				$final.dy += yMin;
			}
		}
		shader.filterMatrixA__.load(oldA);
		shader.filterMatrixB__.load(oldB);
		ctx.inFilter = oldF;
		ctx.popTarget();
		ctx.globalAlpha = oldAlpha * this.alpha;
		this.emitTile(ctx,$final);
		ctx.globalAlpha = oldAlpha;
	}
	,drawRec: function(ctx) {
		if(!this.visible) return;
		if(this.posChanged) {
			this.calcAbsPos();
			var _g = 0;
			var _g1 = this.childs;
			while(_g < _g1.length) {
				var c = _g1[_g];
				++_g;
				c.posChanged = true;
			}
			this.posChanged = false;
		}
		if(this.filters.length > 0) this.drawFilters(ctx); else {
			var old = ctx.globalAlpha;
			ctx.globalAlpha *= this.alpha;
			this.draw(ctx);
			var _g2 = 0;
			var _g11 = this.childs;
			while(_g2 < _g11.length) {
				var c1 = _g11[_g2];
				++_g2;
				c1.drawRec(ctx);
			}
			ctx.globalAlpha = old;
		}
	}
	,__class__: h2d_Sprite
};
var h2d_Drawable = function(parent) {
	h2d_Sprite.call(this,parent);
	this.blendMode = h2d_BlendMode.Alpha;
	this.color = new h3d_Vector(1,1,1,1);
};
$hxClasses["h2d.Drawable"] = h2d_Drawable;
h2d_Drawable.__name__ = ["h2d","Drawable"];
h2d_Drawable.__super__ = h2d_Sprite;
h2d_Drawable.prototype = $extend(h2d_Sprite.prototype,{
	emitTile: function(ctx,tile) {
		if(tile == null) tile = new h2d_Tile(null,0,0,5,5);
		ctx.drawTile(this,tile);
		return;
		ctx.beginDrawBatch(this,tile.innerTex);
		var alpha = this.color.w * ctx.globalAlpha;
		var ax = this.absX + tile.dx * this.matA + tile.dy * this.matC;
		var ay = this.absY + tile.dx * this.matB + tile.dy * this.matD;
		var buf = ctx.buffer;
		var pos = ctx.bufPos;
		while(buf.length < pos + 32) buf.push(0.);
		var key = pos++;
		buf[key] = ax;
		var key1 = pos++;
		buf[key1] = ay;
		var key2 = pos++;
		buf[key2] = tile.u;
		var key3 = pos++;
		buf[key3] = tile.v;
		var key4 = pos++;
		buf[key4] = this.color.x;
		var key5 = pos++;
		buf[key5] = this.color.y;
		var key6 = pos++;
		buf[key6] = this.color.z;
		var key7 = pos++;
		buf[key7] = alpha;
		var tw = tile.width;
		var th = tile.height;
		var dx1 = tw * this.matA;
		var dy1 = tw * this.matB;
		var dx2 = th * this.matC;
		var dy2 = th * this.matD;
		var key8 = pos++;
		buf[key8] = ax + dx1;
		var key9 = pos++;
		buf[key9] = ay + dy1;
		var key10 = pos++;
		buf[key10] = tile.u2;
		var key11 = pos++;
		buf[key11] = tile.v;
		var key12 = pos++;
		buf[key12] = this.color.x;
		var key13 = pos++;
		buf[key13] = this.color.y;
		var key14 = pos++;
		buf[key14] = this.color.z;
		var key15 = pos++;
		buf[key15] = alpha;
		var key16 = pos++;
		buf[key16] = ax + dx2;
		var key17 = pos++;
		buf[key17] = ay + dy2;
		var key18 = pos++;
		buf[key18] = tile.u;
		var key19 = pos++;
		buf[key19] = tile.v2;
		var key20 = pos++;
		buf[key20] = this.color.x;
		var key21 = pos++;
		buf[key21] = this.color.y;
		var key22 = pos++;
		buf[key22] = this.color.z;
		var key23 = pos++;
		buf[key23] = alpha;
		var key24 = pos++;
		buf[key24] = ax + dx1 + dx2;
		var key25 = pos++;
		buf[key25] = ay + dy1 + dy2;
		var key26 = pos++;
		buf[key26] = tile.u2;
		var key27 = pos++;
		buf[key27] = tile.v2;
		var key28 = pos++;
		buf[key28] = this.color.x;
		var key29 = pos++;
		buf[key29] = this.color.y;
		var key30 = pos++;
		buf[key30] = this.color.z;
		var key31 = pos++;
		buf[key31] = alpha;
		ctx.bufPos = pos;
	}
	,__class__: h2d_Drawable
});
var h2d_BlendMode = $hxClasses["h2d.BlendMode"] = { __ename__ : true, __constructs__ : ["None","Alpha","Add","SoftAdd","Multiply","Erase","Screen"] };
h2d_BlendMode.None = ["None",0];
h2d_BlendMode.None.toString = $estr;
h2d_BlendMode.None.__enum__ = h2d_BlendMode;
h2d_BlendMode.Alpha = ["Alpha",1];
h2d_BlendMode.Alpha.toString = $estr;
h2d_BlendMode.Alpha.__enum__ = h2d_BlendMode;
h2d_BlendMode.Add = ["Add",2];
h2d_BlendMode.Add.toString = $estr;
h2d_BlendMode.Add.__enum__ = h2d_BlendMode;
h2d_BlendMode.SoftAdd = ["SoftAdd",3];
h2d_BlendMode.SoftAdd.toString = $estr;
h2d_BlendMode.SoftAdd.__enum__ = h2d_BlendMode;
h2d_BlendMode.Multiply = ["Multiply",4];
h2d_BlendMode.Multiply.toString = $estr;
h2d_BlendMode.Multiply.__enum__ = h2d_BlendMode;
h2d_BlendMode.Erase = ["Erase",5];
h2d_BlendMode.Erase.toString = $estr;
h2d_BlendMode.Erase.__enum__ = h2d_BlendMode;
h2d_BlendMode.Screen = ["Screen",6];
h2d_BlendMode.Screen.toString = $estr;
h2d_BlendMode.Screen.__enum__ = h2d_BlendMode;
h2d_BlendMode.__empty_constructs__ = [h2d_BlendMode.None,h2d_BlendMode.Alpha,h2d_BlendMode.Add,h2d_BlendMode.SoftAdd,h2d_BlendMode.Multiply,h2d_BlendMode.Erase,h2d_BlendMode.Screen];
var h2d_col_Bounds = function() {
	this.xMin = 1e20;
	this.yMin = 1e20;
	this.xMax = -1e20;
	this.yMax = -1e20;
};
$hxClasses["h2d.col.Bounds"] = h2d_col_Bounds;
h2d_col_Bounds.__name__ = ["h2d","col","Bounds"];
h2d_col_Bounds.prototype = {
	addPos: function(x,y) {
		if(x < this.xMin) this.xMin = x;
		if(x > this.xMax) this.xMax = x;
		if(y < this.yMin) this.yMin = y;
		if(y > this.yMax) this.yMax = y;
	}
	,__class__: h2d_col_Bounds
};
var hxd_Interactive = function() { };
$hxClasses["hxd.Interactive"] = hxd_Interactive;
hxd_Interactive.__name__ = ["hxd","Interactive"];
hxd_Interactive.prototype = {
	__class__: hxd_Interactive
};
var h2d_Interactive = function() {
	this.propagateEvents = false;
	this.cancelEvents = false;
};
$hxClasses["h2d.Interactive"] = h2d_Interactive;
h2d_Interactive.__name__ = ["h2d","Interactive"];
h2d_Interactive.__interfaces__ = [hxd_Interactive];
h2d_Interactive.__super__ = h2d_Drawable;
h2d_Interactive.prototype = $extend(h2d_Drawable.prototype,{
	onAlloc: function() {
		this.scene = this.getScene();
		if(this.scene != null) this.scene.addEventTarget(this);
		h2d_Drawable.prototype.onAlloc.call(this);
	}
	,draw: function(ctx) {
		if(this.backgroundColor != null) this.emitTile(ctx,h2d_Tile.fromColor(this.backgroundColor,this.width | 0,this.height | 0,(this.backgroundColor >>> 24) / 255));
	}
	,getBoundsRec: function(relativeTo,out,forSize) {
		h2d_Drawable.prototype.getBoundsRec.call(this,relativeTo,out,forSize);
		if(this.backgroundColor != null) this.addBounds(relativeTo,out,0,0,this.width | 0,this.height | 0);
	}
	,onParentChanged: function() {
		if(this.scene != null) {
			this.scene.removeEventTarget(this);
			this.scene.addEventTarget(this);
		}
	}
	,onDelete: function() {
		if(this.scene != null) {
			this.scene.removeEventTarget(this,true);
			this.scene = null;
		}
		h2d_Drawable.prototype.onDelete.call(this);
	}
	,checkBounds: function(e) {
		var _g = e.kind;
		switch(_g[1]) {
		case 4:case 1:case 6:case 7:
			return false;
		default:
			return true;
		}
	}
	,getInteractiveScene: function() {
		return this.scene;
	}
	,handleEvent: function(e) {
		if(this.isEllipse && this.checkBounds(e)) {
			var cx = this.width * 0.5;
			var cy = this.height * 0.5;
			var dx = (e.relX - cx) / cx;
			var dy = (e.relY - cy) / cy;
			if(dx * dx + dy * dy > 1) {
				e.cancel = true;
				return;
			}
		}
		if(this.propagateEvents) e.propagate = true;
		if(this.cancelEvents) e.cancel = true;
		var _g = e.kind;
		switch(_g[1]) {
		case 2:
			this.onMove(e);
			break;
		case 0:
			if(this.enableRightButton || e.button == 0) {
				this.isMouseDown = e.button;
				this.onPush(e);
			}
			break;
		case 1:
			if(this.enableRightButton || e.button == 0) {
				this.onRelease(e);
				if(this.isMouseDown == e.button) this.onClick(e);
			}
			this.isMouseDown = -1;
			break;
		case 10:
			if(this.enableRightButton || e.button == 0) {
				e.kind = hxd_EventKind.ERelease;
				this.onRelease(e);
				e.kind = hxd_EventKind.EReleaseNoClick;
			}
			this.isMouseDown = -1;
			break;
		case 3:
			hxd_System.setCursor(this.cursor);
			this.onOver(e);
			break;
		case 4:
			this.isMouseDown = -1;
			hxd_System.setCursor(hxd_Cursor.Default);
			this.onOut(e);
			break;
		case 5:
			this.onWheel(e);
			break;
		case 7:
			this.onFocusLost(e);
			break;
		case 6:
			this.onFocus(e);
			break;
		case 9:
			this.onKeyUp(e);
			break;
		case 8:
			this.onKeyDown(e);
			break;
		}
	}
	,onOver: function(e) {
	}
	,onOut: function(e) {
	}
	,onPush: function(e) {
	}
	,onRelease: function(e) {
	}
	,onClick: function(e) {
	}
	,onMove: function(e) {
	}
	,onWheel: function(e) {
	}
	,onFocus: function(e) {
	}
	,onFocusLost: function(e) {
	}
	,onKeyUp: function(e) {
	}
	,onKeyDown: function(e) {
	}
	,__class__: h2d_Interactive
});
var h2d_Layers = function(parent) {
	h2d_Sprite.call(this,parent);
	this.layersIndexes = [];
	this.layerCount = 0;
};
$hxClasses["h2d.Layers"] = h2d_Layers;
h2d_Layers.__name__ = ["h2d","Layers"];
h2d_Layers.__super__ = h2d_Sprite;
h2d_Layers.prototype = $extend(h2d_Sprite.prototype,{
	addChild: function(s) {
		this.addChildAt(s,0);
	}
	,addChildAt: function(s,layer) {
		if(s.parent == this) {
			var old = s.allocated;
			s.allocated = false;
			this.removeChild(s);
			s.allocated = old;
		}
		while(layer >= this.layerCount) this.layersIndexes[this.layerCount++] = this.childs.length;
		h2d_Sprite.prototype.addChildAt.call(this,s,this.layersIndexes[layer]);
		var _g1 = layer;
		var _g = this.layerCount;
		while(_g1 < _g) {
			var i = _g1++;
			this.layersIndexes[i]++;
		}
	}
	,removeChild: function(s) {
		var _g1 = 0;
		var _g = this.childs.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.childs[i] == s) {
				this.childs.splice(i,1);
				if(s.allocated) s.onDelete();
				s.parent = null;
				var k = this.layerCount - 1;
				while(k >= 0 && this.layersIndexes[k] > i) {
					this.layersIndexes[k]--;
					k--;
				}
				break;
			}
		}
	}
	,__class__: h2d_Layers
});
var h3d_impl_RenderContext = function() {
	this.engine = h3d_Engine.CURRENT;
	this.frame = 0;
	this.time = 0.;
	this.elapsedTime = 1. / hxd_System.getDefaultFrameRate();
};
$hxClasses["h3d.impl.RenderContext"] = h3d_impl_RenderContext;
h3d_impl_RenderContext.__name__ = ["h3d","impl","RenderContext"];
h3d_impl_RenderContext.prototype = {
	__class__: h3d_impl_RenderContext
};
var h2d_RenderContext = function(scene) {
	this.tmpBounds = new h2d_col_Bounds();
	this.globalAlpha = 1.;
	h3d_impl_RenderContext.call(this);
	this.scene = scene;
	this.bufPos = 0;
	this.manager = new h3d_shader_Manager(["output.position","output.color"]);
	this.pass = new h3d_mat_Pass("",null);
	this.pass.depth(true,h3d_mat_Compare.Always);
	this.pass.set_culling(h3d_mat_Face.None);
	this.baseShader = new h3d_shader_Base2d();
	this.baseShader.priority = 100;
	this.baseShader.zValue__ = 0.;
	this.baseShaderList = new hxsl_ShaderList(this.baseShader);
	this.targetsStack = [];
	this.textures = new h3d_impl_TextureCache();
};
$hxClasses["h2d.RenderContext"] = h2d_RenderContext;
h2d_RenderContext.__name__ = ["h2d","RenderContext"];
h2d_RenderContext.__super__ = h3d_impl_RenderContext;
h2d_RenderContext.prototype = $extend(h3d_impl_RenderContext.prototype,{
	begin: function() {
		this.texture = null;
		this.currentObj = null;
		this.bufPos = 0;
		this.stride = 0;
		this.curX = 0;
		this.curY = 0;
		this.inFilter = null;
		this.curWidth = this.scene.width;
		this.curHeight = this.scene.height;
		this.manager.globals.set("time",this.time);
		this.baseShader.set_pixelAlign(false);
		this.baseShader.halfPixelInverse__.set(0.5 / this.engine.width,0.5 / this.engine.height,null,null);
		this.baseShader.viewport__.set(-this.scene.width * 0.5,-this.scene.height * 0.5,2 / this.scene.width,-2 / this.scene.height);
		this.baseShader.filterMatrixA__.set(1,0,0,null);
		this.baseShader.filterMatrixB__.set(0,1,0,null);
		this.baseShaderList.next = null;
		this.initShaders(this.baseShaderList);
		this.engine.selectMaterial(this.pass);
		this.textures.begin(this);
	}
	,initShaders: function(shaders) {
		this.currentShaders = shaders;
		this.compiledShader = this.manager.compileShaders(shaders);
		if(this.buffers == null) this.buffers = new h3d_shader_Buffers(this.compiledShader); else this.buffers.grow(this.compiledShader);
		this.manager.fillGlobals(this.buffers,this.compiledShader);
		this.engine.selectShader(this.compiledShader);
		this.engine.uploadShaderBuffers(this.buffers,0);
	}
	,end: function() {
		this.texture = null;
		this.currentObj = null;
		this.baseShaderList.next = null;
		if(this.targetsStack.length != 0) throw new js__$Boot_HaxeError("Missing popTarget()");
	}
	,pushTarget: function(t,startX,startY,width,height) {
		if(height == null) height = -1;
		if(width == null) width = -1;
		if(startY == null) startY = 0;
		if(startX == null) startX = 0;
		this.engine.pushTarget(t);
		this.initShaders(this.baseShaderList);
		if(width < 0) if(t == null) width = this.scene.width; else width = t.width;
		if(height < 0) if(t == null) height = this.scene.height; else height = t.height;
		this.baseShader.halfPixelInverse__.set(0.5 / (t == null?this.engine.width:t.width),0.5 / (t == null?this.engine.height:t.height),null,null);
		this.baseShader.viewport__.set(-width * 0.5 - startX,-height * 0.5 - startY,2 / width,-2 / height);
		this.targetsStack.push({ t : t, x : startX, y : startY, w : width, h : height});
		this.curX = startX;
		this.curY = startY;
		this.curWidth = width;
		this.curHeight = height;
	}
	,popTarget: function(restore) {
		if(restore == null) restore = true;
		var tinf = this.targetsStack.pop();
		if(tinf == null) throw new js__$Boot_HaxeError("Too many popTarget()");
		this.engine.popTarget();
		if(!restore) return;
		tinf = this.targetsStack[this.targetsStack.length - 1];
		var t;
		if(tinf == null) t = null; else t = tinf.t;
		var startX;
		if(tinf == null) startX = 0; else startX = tinf.x;
		var startY;
		if(tinf == null) startY = 0; else startY = tinf.y;
		var width;
		if(tinf == null) width = this.scene.width; else width = tinf.w;
		var height;
		if(tinf == null) height = this.scene.height; else height = tinf.h;
		this.initShaders(this.baseShaderList);
		this.baseShader.halfPixelInverse__.set(0.5 / (t == null?this.engine.width:t.width),0.5 / (t == null?this.engine.height:t.height),null,null);
		this.baseShader.viewport__.set(-width * 0.5 - startX,-height * 0.5 - startY,2 / width,-2 / height);
		this.curX = startX;
		this.curY = startY;
		this.curWidth = width;
		this.curHeight = height;
	}
	,beforeDraw: function() {
		if(this.texture == null) this.texture = h3d_mat_Texture.fromColor(16711935);
		this.baseShader.texture__ = this.texture;
		this.texture.set_filter(this.currentObj.filter?h3d_mat_Filter.Linear:h3d_mat_Filter.Nearest);
		this.texture.set_wrap(this.currentObj.tileWrap?h3d_mat_Wrap.Repeat:h3d_mat_Wrap.Clamp);
		var blend = this.currentObj.blendMode;
		if(this.inFilter == this.currentObj && blend == h2d_BlendMode.Erase) blend = h2d_BlendMode.Add;
		this.pass.setBlendMode(blend);
		this.manager.fillParams(this.buffers,this.compiledShader,this.currentShaders);
		this.engine.selectMaterial(this.pass);
		this.engine.uploadShaderBuffers(this.buffers,1);
		this.engine.uploadShaderBuffers(this.buffers,2);
	}
	,beginDrawBatch: function(obj,texture) {
		this.beginDraw(obj,texture,false);
	}
	,drawTile: function(obj,tile) {
		var matA;
		var matB;
		var matC;
		var matD;
		var absX;
		var absY;
		if(this.inFilter != null) {
			var f1 = this.baseShader.filterMatrixA__;
			var f2 = this.baseShader.filterMatrixB__;
			matA = obj.matA * f1.x + obj.matB * f1.y;
			matB = obj.matA * f2.x + obj.matB * f2.y;
			matC = obj.matC * f1.x + obj.matD * f1.y;
			matD = obj.matC * f2.x + obj.matD * f2.y;
			absX = obj.absX * f1.x + obj.absY * f1.y + f1.z;
			absY = obj.absX * f2.x + obj.absY * f2.y + f2.z;
		} else {
			matA = obj.matA;
			matB = obj.matB;
			matC = obj.matC;
			matD = obj.matD;
			absX = obj.absX;
			absY = obj.absY;
		}
		if(matB == 0 && matC == 0) {
			var tx = tile.dx + tile.width * 0.5;
			var ty = tile.dy + tile.height * 0.5;
			var tr;
			tr = (tile.width > tile.height?tile.width:tile.height) * 1.5 * hxd_Math.max(hxd_Math.abs(obj.matA),hxd_Math.abs(obj.matD));
			var cx = absX + tx * matA - this.curX;
			var cy = absY + ty * matD - this.curY;
			if(cx < -tr || cy < -tr || cx - tr > this.curWidth || cy - tr > this.curHeight) return;
		} else {
			var xMin = 1e20;
			var yMin = 1e20;
			var xMax = -1e20;
			var yMax = -1e20;
			var hw = tile.width * 0.5;
			var hh = tile.height * 0.5;
			var px = tile.dx * matA + tile.dy * matC;
			var py = tile.dx * matB + tile.dy * matD;
			if(px < xMin) xMin = px;
			if(px > xMax) xMax = px;
			if(py < yMin) yMin = py;
			if(py > yMax) yMax = py;
			var x = tile.width;
			var px1 = (x + tile.dx) * matA + tile.dy * matC;
			var py1 = (x + tile.dx) * matB + tile.dy * matD;
			if(px1 < xMin) xMin = px1;
			if(px1 > xMax) xMax = px1;
			if(py1 < yMin) yMin = py1;
			if(py1 > yMax) yMax = py1;
			var y = tile.height;
			var px2 = tile.dx * matA + (y + tile.dy) * matC;
			var py2 = tile.dx * matB + (y + tile.dy) * matD;
			if(px2 < xMin) xMin = px2;
			if(px2 > xMax) xMax = px2;
			if(py2 < yMin) yMin = py2;
			if(py2 > yMax) yMax = py2;
			var x1 = tile.width;
			var y1 = tile.height;
			var px3 = (x1 + tile.dx) * matA + (y1 + tile.dy) * matC;
			var py3 = (x1 + tile.dx) * matB + (y1 + tile.dy) * matD;
			if(px3 < xMin) xMin = px3;
			if(px3 > xMax) xMax = px3;
			if(py3 < yMin) yMin = py3;
			if(py3 > yMax) yMax = py3;
			var cx1 = absX - this.curX;
			var cy1 = absY - this.curY;
			if(cx1 + xMax < 0 || cy1 + yMax < 0 || cx1 + xMin > this.curWidth || cy1 + yMin > this.curHeight) return;
		}
		this.beginDraw(obj,tile.innerTex,true,true);
		if(this.inFilter == obj) this.baseShader.color__.set(1,1,1,1); else this.baseShader.color__.set(obj.color.x,obj.color.y,obj.color.z,obj.color.w * this.globalAlpha);
		this.baseShader.absoluteMatrixA__.set(tile.width * obj.matA,tile.height * obj.matC,obj.absX + tile.dx * obj.matA + tile.dy * obj.matC,null);
		this.baseShader.absoluteMatrixB__.set(tile.width * obj.matB,tile.height * obj.matD,obj.absY + tile.dx * obj.matB + tile.dy * obj.matD,null);
		this.baseShader.uvPos__.set(tile.u,tile.v,tile.u2 - tile.u,tile.v2 - tile.v);
		this.beforeDraw();
		if(this.fixedBuffer == null || this.fixedBuffer.isDisposed()) {
			this.fixedBuffer = new h3d_Buffer(4,8,[h3d_BufferFlag.Quads,h3d_BufferFlag.RawFormat]);
			var k;
			var this1;
			this1 = new Array(0);
			k = this1;
			var _g = 0;
			var _g1 = [0,0,0,0,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1];
			while(_g < _g1.length) {
				var v = _g1[_g];
				++_g;
				k.push(v);
			}
			this.fixedBuffer.uploadVector(k,0,4);
		}
		this.engine.renderQuadBuffer(this.fixedBuffer,null,null);
	}
	,beginDraw: function(obj,texture,isRelative,hasUVPos) {
		if(hasUVPos == null) hasUVPos = false;
		var stride = 8;
		var shaderChanged = false;
		var paramsChanged = false;
		var objShaders = obj.shaders;
		var curShaders = this.currentShaders.next;
		while(objShaders != null && curShaders != null) {
			var s = objShaders.s;
			var t = curShaders.s;
			objShaders = objShaders.next;
			curShaders = curShaders.next;
			if(s == t) continue;
			paramsChanged = true;
			s.updateConstants(this.manager.globals);
			if(s.instance != t.instance) shaderChanged = true;
		}
		if(objShaders != null || curShaders != null || this.baseShader.isRelative__ != isRelative || this.baseShader.hasUVPos__ != hasUVPos) shaderChanged = true;
		if(shaderChanged) {
			this.baseShader.set_hasUVPos(hasUVPos);
			this.baseShader.set_isRelative(isRelative);
			this.baseShader.updateConstants(this.manager.globals);
			this.baseShaderList.next = obj.shaders;
			this.initShaders(this.baseShaderList);
		} else if(paramsChanged) {
			if(this.currentShaders != this.baseShaderList) throw new js__$Boot_HaxeError("!");
			this.currentShaders.next = obj.shaders;
		}
		this.texture = texture;
		this.stride = stride;
		this.currentObj = obj;
	}
	,__class__: h2d_RenderContext
});
var hxd_InteractiveScene = function() { };
$hxClasses["hxd.InteractiveScene"] = hxd_InteractiveScene;
hxd_InteractiveScene.__name__ = ["hxd","InteractiveScene"];
hxd_InteractiveScene.prototype = {
	__class__: hxd_InteractiveScene
};
var h3d_IDrawable = function() { };
$hxClasses["h3d.IDrawable"] = h3d_IDrawable;
h3d_IDrawable.__name__ = ["h3d","IDrawable"];
h3d_IDrawable.prototype = {
	__class__: h3d_IDrawable
};
var h2d_Scene = function() {
	h2d_Layers.call(this,null);
	var e = h3d_Engine.CURRENT;
	this.ctx = new h2d_RenderContext(this);
	this.width = e.width;
	this.height = e.height;
	this.interactive = [];
	this.eventListeners = [];
	this.stage = hxd_Stage.getInstance();
	this.posChanged = true;
};
$hxClasses["h2d.Scene"] = h2d_Scene;
h2d_Scene.__name__ = ["h2d","Scene"];
h2d_Scene.__interfaces__ = [hxd_InteractiveScene,h3d_IDrawable];
h2d_Scene.__super__ = h2d_Layers;
h2d_Scene.prototype = $extend(h2d_Layers.prototype,{
	setEvents: function(events) {
		this.events = events;
	}
	,checkResize: function() {
		if(this.fixedSize) return;
		var engine = h3d_Engine.CURRENT;
		if(this.width != engine.width || this.height != engine.height) {
			this.width = engine.width;
			this.height = engine.height;
			this.posChanged = true;
		}
	}
	,dispatchListeners: function(event) {
		this.screenToLocal(event);
		var _g = 0;
		var _g1 = this.eventListeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l(event);
			if(!event.propagate) break;
		}
	}
	,screenToLocal: function(e) {
		var x = e.relX * this.width / (this.stage.get_width() * this.scaleX) - this.x;
		var y = e.relY * this.height / (this.stage.get_height() * this.scaleY) - this.y;
		var rx = x * this.matA + y * this.matB + this.absX;
		var ry = x * this.matC + y * this.matD + this.absY;
		e.relX = rx;
		e.relY = ry;
	}
	,dispatchEvent: function(event,to) {
		var i = to;
		this.screenToLocal(event);
		var rx = event.relX;
		var ry = event.relY;
		var dx = rx - i.absX;
		var dy = ry - i.absY;
		var w1 = i.width * i.matA;
		var h1 = i.width * i.matC;
		var ky = h1 * dx + w1 * dy;
		var w2 = i.height * i.matB;
		var h2 = i.height * i.matD;
		var kx = w2 * dy + h2 * dx;
		var max = w1 * h2 - h1 * w2;
		event.relX = kx / max * i.width;
		event.relY = ky / max * i.height;
		i.handleEvent(event);
	}
	,handleEvent: function(event,last) {
		this.screenToLocal(event);
		var rx = event.relX;
		var ry = event.relY;
		var index;
		if(last == null) index = 0; else index = HxOverrides.indexOf(this.interactive,last,0) + 1;
		var _g1 = index;
		var _g = this.interactive.length;
		while(_g1 < _g) {
			var idx = _g1++;
			var i = this.interactive[idx];
			if(i == null) break;
			var dx = rx - i.absX;
			var dy = ry - i.absY;
			var w1 = i.width * i.matA;
			var h1 = i.width * i.matC;
			var ky = h1 * dx + w1 * dy;
			if(ky < 0) continue;
			var w2 = i.height * i.matB;
			var h2 = i.height * i.matD;
			var kx = w2 * dy + h2 * dx;
			if(kx < 0) continue;
			var max = w1 * h2 - h1 * w2;
			if(ky >= max || kx >= max) continue;
			var visible = true;
			var p = i;
			while(p != null) {
				if(!p.visible) {
					visible = false;
					break;
				}
				p = p.parent;
			}
			if(!visible) continue;
			event.relX = kx / max * i.width;
			event.relY = ky / max * i.height;
			i.handleEvent(event);
			if(event.cancel) {
				event.cancel = false;
				event.propagate = true;
				continue;
			}
			return i;
		}
		return null;
	}
	,addEventListener: function(f) {
		this.eventListeners.push(f);
	}
	,addEventTarget: function(i) {
		var level;
		var i1 = i;
		var lv = 0;
		while(i1 != null) {
			i1 = i1.parent;
			lv++;
		}
		level = lv;
		var _g1 = 0;
		var _g = this.interactive.length;
		while(_g1 < _g) {
			var index = _g1++;
			var i11 = i;
			var i2 = this.interactive[index];
			var lv1 = level;
			var lv2;
			var i3 = i2;
			var lv3 = 0;
			while(i3 != null) {
				i3 = i3.parent;
				lv3++;
			}
			lv2 = lv3;
			var p1 = i11;
			var p2 = i2;
			while(lv1 > lv2) {
				i11 = p1;
				p1 = p1.parent;
				lv1--;
			}
			while(lv2 > lv1) {
				i2 = p2;
				p2 = p2.parent;
				lv2--;
			}
			while(p1 != p2) {
				i11 = p1;
				p1 = p1.parent;
				i2 = p2;
				p2 = p2.parent;
			}
			if((function($this) {
				var $r;
				var id = -1;
				{
					var _g11 = 0;
					var _g2 = p1.childs.length;
					while(_g11 < _g2) {
						var k = _g11++;
						if(p1.childs[k] == i11) {
							id = k;
							break;
						}
					}
				}
				$r = id;
				return $r;
			}(this)) > (function($this) {
				var $r;
				var id1 = -1;
				{
					var _g12 = 0;
					var _g3 = p2.childs.length;
					while(_g12 < _g3) {
						var k1 = _g12++;
						if(p2.childs[k1] == i2) {
							id1 = k1;
							break;
						}
					}
				}
				$r = id1;
				return $r;
			}(this))) {
				this.interactive.splice(index,0,i);
				return;
			}
		}
		this.interactive.push(i);
	}
	,removeEventTarget: function(i,notify) {
		if(notify == null) notify = false;
		HxOverrides.remove(this.interactive,i);
		if(notify && this.events != null) this.events.onRemove(i);
	}
	,setElapsedTime: function(v) {
		this.ctx.elapsedTime = v;
	}
	,render: function(engine) {
		this.ctx.engine = engine;
		this.ctx.frame++;
		this.ctx.time += this.ctx.elapsedTime;
		this.ctx.globalAlpha = this.alpha;
		this.sync(this.ctx);
		if(this.childs.length == 0) return;
		this.ctx.begin();
		this.drawRec(this.ctx);
		this.ctx.end();
	}
	,sync: function(ctx) {
		if(!this.allocated) this.onAlloc();
		if(!this.fixedSize && (this.width != ctx.engine.width || this.height != ctx.engine.height)) {
			this.width = ctx.engine.width;
			this.height = ctx.engine.height;
			this.posChanged = true;
		}
		h2d_Layers.prototype.sync.call(this,ctx);
	}
	,__class__: h2d_Scene
});
var h2d_Tile = function(tex,x,y,w,h,dx,dy) {
	if(dy == null) dy = 0;
	if(dx == null) dx = 0;
	this.innerTex = tex;
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
	this.dx = dx;
	this.dy = dy;
	if(tex != null) this.setTexture(tex);
};
$hxClasses["h2d.Tile"] = h2d_Tile;
h2d_Tile.__name__ = ["h2d","Tile"];
h2d_Tile.fromColor = function(color,width,height,alpha,allocPos) {
	if(alpha == null) alpha = 1.;
	if(height == null) height = 1;
	if(width == null) width = 1;
	var t = new h2d_Tile(h3d_mat_Texture.fromColor(color,alpha,allocPos),0,0,1,1);
	t.width = width;
	t.height = height;
	return t;
};
h2d_Tile.fromTexture = function(t) {
	return new h2d_Tile(t,0,0,t.width,t.height);
};
h2d_Tile.prototype = {
	setTexture: function(tex) {
		this.innerTex = tex;
		if(tex != null) {
			this.u = this.x / tex.width;
			this.v = this.y / tex.height;
			this.u2 = (this.x + this.width) / tex.width;
			this.v2 = (this.y + this.height) / tex.height;
		}
	}
	,__class__: h2d_Tile
};
var h2d_filter_Filter = function() {
	this.boundsExtend = 0.;
	this.autoBounds = true;
};
$hxClasses["h2d.filter.Filter"] = h2d_filter_Filter;
h2d_filter_Filter.__name__ = ["h2d","filter","Filter"];
h2d_filter_Filter.prototype = {
	sync: function(ctx,s) {
	}
	,getBounds: function(s,bounds) {
		s.getBounds(s,bounds);
		bounds.xMin -= this.boundsExtend;
		bounds.yMin -= this.boundsExtend;
		bounds.xMax += this.boundsExtend;
		bounds.yMax += this.boundsExtend;
	}
	,draw: function(ctx,input) {
		return input;
	}
	,__class__: h2d_filter_Filter
};
var h3d_BufferFlag = $hxClasses["h3d.BufferFlag"] = { __ename__ : true, __constructs__ : ["Dynamic","Triangles","Quads","Managed","RawFormat","NoAlloc"] };
h3d_BufferFlag.Dynamic = ["Dynamic",0];
h3d_BufferFlag.Dynamic.toString = $estr;
h3d_BufferFlag.Dynamic.__enum__ = h3d_BufferFlag;
h3d_BufferFlag.Triangles = ["Triangles",1];
h3d_BufferFlag.Triangles.toString = $estr;
h3d_BufferFlag.Triangles.__enum__ = h3d_BufferFlag;
h3d_BufferFlag.Quads = ["Quads",2];
h3d_BufferFlag.Quads.toString = $estr;
h3d_BufferFlag.Quads.__enum__ = h3d_BufferFlag;
h3d_BufferFlag.Managed = ["Managed",3];
h3d_BufferFlag.Managed.toString = $estr;
h3d_BufferFlag.Managed.__enum__ = h3d_BufferFlag;
h3d_BufferFlag.RawFormat = ["RawFormat",4];
h3d_BufferFlag.RawFormat.toString = $estr;
h3d_BufferFlag.RawFormat.__enum__ = h3d_BufferFlag;
h3d_BufferFlag.NoAlloc = ["NoAlloc",5];
h3d_BufferFlag.NoAlloc.toString = $estr;
h3d_BufferFlag.NoAlloc.__enum__ = h3d_BufferFlag;
h3d_BufferFlag.__empty_constructs__ = [h3d_BufferFlag.Dynamic,h3d_BufferFlag.Triangles,h3d_BufferFlag.Quads,h3d_BufferFlag.Managed,h3d_BufferFlag.RawFormat,h3d_BufferFlag.NoAlloc];
var h3d_Buffer = function(vertices,stride,flags,allocPos) {
	this.id = h3d_Buffer.GUID++;
	this.vertices = vertices;
	this.flags = 0;
	if(flags != null) {
		var _g = 0;
		while(_g < flags.length) {
			var f = flags[_g];
			++_g;
			this.flags |= 1 << f[1];
		}
	}
	if((this.flags & 1 << h3d_BufferFlag.Quads[1]) != 0 || (this.flags & 1 << h3d_BufferFlag.Triangles[1]) != 0) this.flags |= 1 << h3d_BufferFlag.Managed[1];
	if(!((this.flags & 1 << h3d_BufferFlag.NoAlloc[1]) != 0)) h3d_Engine.CURRENT.mem.allocBuffer(this,stride);
};
$hxClasses["h3d.Buffer"] = h3d_Buffer;
h3d_Buffer.__name__ = ["h3d","Buffer"];
h3d_Buffer.ofFloats = function(v,stride,flags,allocPos) {
	var nvert = v.length / stride | 0;
	var b = new h3d_Buffer(nvert,stride,flags,allocPos);
	b.uploadVector(v,0,nvert);
	return b;
};
h3d_Buffer.prototype = {
	isDisposed: function() {
		return this.buffer == null || this.buffer.vbuf == null;
	}
	,dispose: function() {
		if(this.buffer != null) {
			this.buffer.freeBuffer(this);
			this.buffer = null;
			if(this.next != null) this.next.dispose();
		}
	}
	,totalVertices: function() {
		var count = 0;
		var b = this;
		while(b != null) {
			count += b.vertices;
			b = b.next;
		}
		return count;
	}
	,uploadVector: function(buf,bufPos,vertices) {
		var cur = this;
		while(vertices > 0) {
			if(cur == null) throw new js__$Boot_HaxeError("Too many vertices");
			var count;
			if(vertices > cur.vertices) count = cur.vertices; else count = vertices;
			cur.buffer.uploadVertexBuffer(cur.position,count,buf,bufPos);
			bufPos += count * this.buffer.stride;
			vertices -= count;
			cur = cur.next;
		}
	}
	,__class__: h3d_Buffer
};
var h3d_Camera = function(fovY,zoom,screenRatio,zNear,zFar,rightHanded) {
	if(rightHanded == null) rightHanded = false;
	if(zFar == null) zFar = 4000.;
	if(zNear == null) zNear = 0.02;
	if(screenRatio == null) screenRatio = 1.333333;
	if(zoom == null) zoom = 1.;
	if(fovY == null) fovY = 25.;
	this.viewY = 0.;
	this.viewX = 0.;
	this.fovY = fovY;
	this.zoom = zoom;
	this.screenRatio = screenRatio;
	this.zNear = zNear;
	this.zFar = zFar;
	this.rightHanded = rightHanded;
	this.pos = new h3d_Vector(2,3,4);
	this.up = new h3d_Vector(0,0,1);
	this.target = new h3d_Vector(0,0,0);
	this.m = new h3d_Matrix();
	this.mcam = new h3d_Matrix();
	this.mproj = new h3d_Matrix();
	this.update();
};
$hxClasses["h3d.Camera"] = h3d_Camera;
h3d_Camera.__name__ = ["h3d","Camera"];
h3d_Camera.prototype = {
	getInverseViewProj: function() {
		if(this.minv == null) this.minv = new h3d_Matrix();
		if(this.needInv) {
			this.minv.inverse(this.m);
			this.needInv = false;
		}
		return this.minv;
	}
	,unproject: function(screenX,screenY,camZ) {
		var p = new h3d_Vector(screenX,screenY,camZ);
		p.project(this.getInverseViewProj());
		return p;
	}
	,update: function() {
		if(this.follow != null) {
			this.pos.set(0,0,0,null);
			this.target.set(0,0,0,null);
			this.follow.pos.localToGlobal(this.pos);
			this.follow.target.localToGlobal(this.target);
			if(this.follow.pos.name != null) {
				var p = this.follow.pos;
				while(p != null) {
					if(p.currentAnimation != null) {
						var v = p.currentAnimation.getPropValue(this.follow.pos.name,"FOVY");
						if(v != null) {
							this.fovY = v;
							break;
						}
					}
					p = p.parent;
				}
			}
		}
		this.makeCameraMatrix(this.mcam);
		this.makeFrustumMatrix(this.mproj);
		this.m.multiply(this.mcam,this.mproj);
		this.needInv = true;
	}
	,makeCameraMatrix: function(m) {
		var az;
		if(this.rightHanded) az = this.pos.sub(this.target); else az = this.target.sub(this.pos);
		az.normalize();
		var ax = this.up.cross(az);
		ax.normalize();
		if(Math.sqrt(ax.x * ax.x + ax.y * ax.y + ax.z * ax.z) == 0) {
			ax.x = az.y;
			ax.y = az.z;
			ax.z = az.x;
		}
		var ay = new h3d_Vector(az.y * ax.z - az.z * ax.y,az.z * ax.x - az.x * ax.z,az.x * ax.y - az.y * ax.x,1);
		m._11 = ax.x;
		m._12 = ay.x;
		m._13 = az.x;
		m._14 = 0;
		m._21 = ax.y;
		m._22 = ay.y;
		m._23 = az.y;
		m._24 = 0;
		m._31 = ax.z;
		m._32 = ay.z;
		m._33 = az.z;
		m._34 = 0;
		m._41 = -ax.dot3(this.pos);
		m._42 = -ay.dot3(this.pos);
		m._43 = -az.dot3(this.pos);
		m._44 = 1;
	}
	,makeFrustumMatrix: function(m) {
		m.zero();
		var bounds = this.orthoBounds;
		if(bounds != null) {
			var w = 1 / (bounds.xMax - bounds.xMin);
			var h = 1 / (bounds.yMax - bounds.yMin);
			var d = 1 / (bounds.zMax - bounds.zMin);
			m._11 = 2 * w;
			m._22 = 2 * h;
			m._33 = d;
			m._41 = -(bounds.xMin + bounds.xMax) * w;
			m._42 = -(bounds.yMin + bounds.yMax) * h;
			m._43 = -bounds.zMin * d;
			m._44 = 1;
		} else {
			var degToRad = Math.PI / 180;
			var halfFovX = Math.atan(Math.tan(this.fovY * 0.5 * degToRad) * this.screenRatio);
			var scale = this.zoom / Math.tan(halfFovX);
			m._11 = scale;
			m._22 = scale * this.screenRatio;
			m._33 = this.zFar / (this.zFar - this.zNear);
			m._34 = 1;
			m._43 = -(this.zNear * this.zFar) / (this.zFar - this.zNear);
		}
		m._11 += this.viewX * m._14;
		m._21 += this.viewX * m._24;
		m._31 += this.viewX * m._34;
		m._41 += this.viewX * m._44;
		m._12 += this.viewY * m._14;
		m._22 += this.viewY * m._24;
		m._32 += this.viewY * m._34;
		m._42 += this.viewY * m._44;
		if(this.rightHanded) {
			m._33 *= -1;
			m._34 *= -1;
		}
	}
	,__class__: h3d_Camera
};
var h3d__$Engine_TargetTmp = function(t,n) {
	this.t = t;
	this.next = n;
};
$hxClasses["h3d._Engine.TargetTmp"] = h3d__$Engine_TargetTmp;
h3d__$Engine_TargetTmp.__name__ = ["h3d","_Engine","TargetTmp"];
h3d__$Engine_TargetTmp.prototype = {
	__class__: h3d__$Engine_TargetTmp
};
var h3d_Engine = function(hardware,aa) {
	if(aa == null) aa = 0;
	if(hardware == null) hardware = true;
	this.tmpVector = new h3d_Vector();
	this.frameCount = 0;
	this.backgroundColor = -16777216;
	this.hardware = hardware;
	this.antiAlias = aa;
	this.autoResize = true;
	this.set_fullScreen(!hxd_System.get_isWindowed());
	var stage = hxd_Stage.getInstance();
	this.realFps = hxd_System.getDefaultFrameRate();
	this.lastTime = haxe_Timer.stamp();
	stage.addResizeEvent($bind(this,this.onStageResize));
	this.driver = new h3d_impl_GlDriver();
	h3d_Engine.CURRENT = this;
};
$hxClasses["h3d.Engine"] = h3d_Engine;
h3d_Engine.__name__ = ["h3d","Engine"];
h3d_Engine.prototype = {
	init: function() {
		this.driver.init($bind(this,this.onCreate),!this.hardware);
	}
	,selectShader: function(shader) {
		if(this.needFlushTarget) this.doFlushTarget();
		if(this.driver.selectShader(shader)) this.shaderSwitches++;
	}
	,selectMaterial: function(pass) {
		this.driver.selectMaterial(pass);
	}
	,uploadShaderBuffers: function(buffers,which) {
		this.driver.uploadShaderBuffers(buffers,which);
	}
	,selectBuffer: function(buf) {
		if(buf.isDisposed()) return false;
		if(this.needFlushTarget) this.doFlushTarget();
		this.driver.selectBuffer(buf);
		return true;
	}
	,renderQuadBuffer: function(b,start,max) {
		if(max == null) max = -1;
		if(start == null) start = 0;
		this.renderBuffer(b,this.mem.quadIndexes,2,start,max);
		return;
	}
	,renderBuffer: function(b,indexes,vertPerTri,startTri,drawTri) {
		if(drawTri == null) drawTri = -1;
		if(startTri == null) startTri = 0;
		if(indexes.isDisposed()) return;
		do {
			var ntri = b.vertices / vertPerTri | 0;
			var pos = b.position / vertPerTri | 0;
			if(startTri > 0) {
				if(startTri >= ntri) {
					startTri -= ntri;
					b = b.next;
					continue;
				}
				pos += startTri;
				ntri -= startTri;
				startTri = 0;
			}
			if(drawTri >= 0) {
				if(drawTri == 0) return;
				drawTri -= ntri;
				if(drawTri < 0) {
					ntri += drawTri;
					drawTri = 0;
				}
			}
			if(ntri > 0 && this.selectBuffer(b)) {
				this.driver.draw(indexes.ibuf,pos * 3,ntri);
				this.drawTriangles += ntri;
				this.drawCalls++;
			}
			b = b.next;
		} while(b != null);
	}
	,renderIndexed: function(b,indexes,startTri,drawTri) {
		if(drawTri == null) drawTri = -1;
		if(startTri == null) startTri = 0;
		if(b.next != null) throw new js__$Boot_HaxeError("Buffer is split");
		if(indexes.isDisposed()) return;
		var maxTri = indexes.count / 3 | 0;
		if(drawTri < 0) drawTri = maxTri - startTri;
		if(drawTri > 0 && this.selectBuffer(b)) {
			this.driver.draw(indexes.ibuf,startTri * 3,drawTri);
			this.drawTriangles += drawTri;
			this.drawCalls++;
		}
	}
	,set_debug: function(d) {
		this.debug = d;
		this.driver.setDebug(this.debug);
		return d;
	}
	,onCreate: function(disposed) {
		if(this.autoResize) {
			var stage = hxd_Stage.getInstance();
			this.width = stage.get_width();
			this.height = stage.get_height();
		}
		if(disposed) this.mem.onContextLost(); else {
			this.mem = new h3d_impl_MemoryManager(this.driver);
			this.mem.init();
		}
		this.hardware = this.driver.hasFeature(h3d_impl_Feature.HardwareAccelerated);
		this.set_debug(this.debug);
		this.set_fullScreen(this.fullScreen);
		this.resize(this.width,this.height);
		if(disposed) this.onContextLost(); else this.onReady();
	}
	,onContextLost: function() {
	}
	,onReady: function() {
	}
	,onStageResize: function() {
		if(this.autoResize && !this.driver.isDisposed()) {
			var stage = hxd_Stage.getInstance();
			var w = stage.get_width();
			var h = stage.get_height();
			if(w != this.width || h != this.height) this.resize(w,h);
			this.onResized();
		}
	}
	,set_fullScreen: function(v) {
		this.fullScreen = v;
		if(this.mem != null && hxd_System.get_isWindowed()) hxd_Stage.getInstance().setFullScreen(v);
		return v;
	}
	,onResized: function() {
	}
	,resize: function(width,height) {
		if(width < 32) width = 32;
		if(height < 32) height = 32;
		this.width = width;
		this.height = height;
		if(!this.driver.isDisposed()) this.driver.resize(width,height);
	}
	,begin: function() {
		if(this.driver.isDisposed()) return false;
		this.frameCount++;
		this.drawTriangles = 0;
		this.shaderSwitches = 0;
		this.drawCalls = 0;
		this.targetStack = null;
		this.needFlushTarget = this.currentTarget != null;
		this.driver.begin(this.frameCount);
		if(this.backgroundColor != null) this.clear(this.backgroundColor,1,0);
		return true;
	}
	,hasFeature: function(f) {
		return this.driver.hasFeature(f);
	}
	,end: function() {
		this.driver.present();
	}
	,pushTarget: function(tex) {
		var c = this.targetTmp;
		if(c == null) c = new h3d__$Engine_TargetTmp(tex,this.targetStack); else {
			this.targetTmp = c.next;
			c.t = tex;
			c.next = this.targetStack;
		}
		this.targetStack = c;
		this.needFlushTarget = this.currentTarget != tex;
	}
	,popTarget: function() {
		var c = this.targetStack;
		if(c == null) throw new js__$Boot_HaxeError("popTarget() with no matching pushTarget()");
		this.targetStack = c.next;
		var tex;
		if(this.targetStack == null) tex = null; else tex = this.targetStack.t;
		this.needFlushTarget = this.currentTarget != tex;
		c.t = null;
		c.next = this.targetTmp;
		this.targetTmp = c;
	}
	,doFlushTarget: function() {
		var tex;
		if(this.targetStack == null) tex = null; else tex = this.targetStack.t;
		this.currentTarget = tex;
		this.driver.setRenderTarget(tex);
		this.needFlushTarget = false;
	}
	,clear: function(color,depth,stencil) {
		if(color != null) this.tmpVector.setColor(color,null);
		if(this.needFlushTarget) this.doFlushTarget();
		this.driver.clear(color == null?null:this.tmpVector,depth,stencil);
	}
	,render: function(obj) {
		if(!this.begin()) return false;
		obj.render(this);
		this.end();
		var delta = haxe_Timer.stamp() - this.lastTime;
		this.lastTime += delta;
		if(delta > 0) {
			var curFps = 1. / delta;
			if(curFps > this.realFps * 2) curFps = this.realFps * 2; else if(curFps < this.realFps * 0.5) curFps = this.realFps * 0.5;
			var f = delta / .5;
			if(f > 0.3) f = 0.3;
			this.realFps = this.realFps * (1 - f) + curFps * f;
		}
		return true;
	}
	,__class__: h3d_Engine
};
var h3d_Indexes = function(count) {
	this.mem = h3d_Engine.CURRENT.mem;
	this.count = count;
	this.mem.allocIndexes(this);
};
$hxClasses["h3d.Indexes"] = h3d_Indexes;
h3d_Indexes.__name__ = ["h3d","Indexes"];
h3d_Indexes.alloc = function(i,startPos,length) {
	if(length == null) length = -1;
	if(startPos == null) startPos = 0;
	if(length < 0) length = i.length;
	var idx = new h3d_Indexes(length);
	idx.upload(i,0,length);
	return idx;
};
h3d_Indexes.prototype = {
	isDisposed: function() {
		return this.ibuf == null;
	}
	,upload: function(indexes,pos,count,bufferPos) {
		if(bufferPos == null) bufferPos = 0;
		this.mem.driver.uploadIndexBuffer(this.ibuf,pos,count,indexes,bufferPos);
	}
	,dispose: function() {
		if(this.ibuf != null) this.mem.deleteIndexes(this);
	}
	,__class__: h3d_Indexes
};
var h3d_Matrix = function() {
};
$hxClasses["h3d.Matrix"] = h3d_Matrix;
h3d_Matrix.__name__ = ["h3d","Matrix"];
h3d_Matrix.prototype = {
	zero: function() {
		this._11 = 0.0;
		this._12 = 0.0;
		this._13 = 0.0;
		this._14 = 0.0;
		this._21 = 0.0;
		this._22 = 0.0;
		this._23 = 0.0;
		this._24 = 0.0;
		this._31 = 0.0;
		this._32 = 0.0;
		this._33 = 0.0;
		this._34 = 0.0;
		this._41 = 0.0;
		this._42 = 0.0;
		this._43 = 0.0;
		this._44 = 0.0;
	}
	,identity: function() {
		this._11 = 1.0;
		this._12 = 0.0;
		this._13 = 0.0;
		this._14 = 0.0;
		this._21 = 0.0;
		this._22 = 1.0;
		this._23 = 0.0;
		this._24 = 0.0;
		this._31 = 0.0;
		this._32 = 0.0;
		this._33 = 1.0;
		this._34 = 0.0;
		this._41 = 0.0;
		this._42 = 0.0;
		this._43 = 0.0;
		this._44 = 1.0;
	}
	,multiply3x4: function(a,b) {
		this.multiply3x4inline(a,b);
	}
	,multiply3x4inline: function(a,b) {
		var m11 = a._11;
		var m12 = a._12;
		var m13 = a._13;
		var m21 = a._21;
		var m22 = a._22;
		var m23 = a._23;
		var a31 = a._31;
		var a32 = a._32;
		var a33 = a._33;
		var a41 = a._41;
		var a42 = a._42;
		var a43 = a._43;
		var b11 = b._11;
		var b12 = b._12;
		var b13 = b._13;
		var b21 = b._21;
		var b22 = b._22;
		var b23 = b._23;
		var b31 = b._31;
		var b32 = b._32;
		var b33 = b._33;
		var b41 = b._41;
		var b42 = b._42;
		var b43 = b._43;
		this._11 = m11 * b11 + m12 * b21 + m13 * b31;
		this._12 = m11 * b12 + m12 * b22 + m13 * b32;
		this._13 = m11 * b13 + m12 * b23 + m13 * b33;
		this._14 = 0;
		this._21 = m21 * b11 + m22 * b21 + m23 * b31;
		this._22 = m21 * b12 + m22 * b22 + m23 * b32;
		this._23 = m21 * b13 + m22 * b23 + m23 * b33;
		this._24 = 0;
		this._31 = a31 * b11 + a32 * b21 + a33 * b31;
		this._32 = a31 * b12 + a32 * b22 + a33 * b32;
		this._33 = a31 * b13 + a32 * b23 + a33 * b33;
		this._34 = 0;
		this._41 = a41 * b11 + a42 * b21 + a43 * b31 + b41;
		this._42 = a41 * b12 + a42 * b22 + a43 * b32 + b42;
		this._43 = a41 * b13 + a42 * b23 + a43 * b33 + b43;
		this._44 = 1;
	}
	,multiply: function(a,b) {
		var a11 = a._11;
		var a12 = a._12;
		var a13 = a._13;
		var a14 = a._14;
		var a21 = a._21;
		var a22 = a._22;
		var a23 = a._23;
		var a24 = a._24;
		var a31 = a._31;
		var a32 = a._32;
		var a33 = a._33;
		var a34 = a._34;
		var a41 = a._41;
		var a42 = a._42;
		var a43 = a._43;
		var a44 = a._44;
		var b11 = b._11;
		var b12 = b._12;
		var b13 = b._13;
		var b14 = b._14;
		var b21 = b._21;
		var b22 = b._22;
		var b23 = b._23;
		var b24 = b._24;
		var b31 = b._31;
		var b32 = b._32;
		var b33 = b._33;
		var b34 = b._34;
		var b41 = b._41;
		var b42 = b._42;
		var b43 = b._43;
		var b44 = b._44;
		this._11 = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
		this._12 = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
		this._13 = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
		this._14 = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
		this._21 = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
		this._22 = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
		this._23 = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
		this._24 = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
		this._31 = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
		this._32 = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
		this._33 = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
		this._34 = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
		this._41 = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
		this._42 = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
		this._43 = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
		this._44 = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
	}
	,inverse3x4: function(m) {
		var m11 = m._11;
		var m12 = m._12;
		var m13 = m._13;
		var m21 = m._21;
		var m22 = m._22;
		var m23 = m._23;
		var m31 = m._31;
		var m32 = m._32;
		var m33 = m._33;
		var m41 = m._41;
		var m42 = m._42;
		var m43 = m._43;
		this._11 = m22 * m33 - m23 * m32;
		this._12 = m13 * m32 - m12 * m33;
		this._13 = m12 * m23 - m13 * m22;
		this._14 = 0;
		this._21 = m23 * m31 - m21 * m33;
		this._22 = m11 * m33 - m13 * m31;
		this._23 = m13 * m21 - m11 * m23;
		this._24 = 0;
		this._31 = m21 * m32 - m22 * m31;
		this._32 = m12 * m31 - m11 * m32;
		this._33 = m11 * m22 - m12 * m21;
		this._34 = 0;
		this._41 = -m21 * m32 * m43 + m21 * m33 * m42 + m31 * m22 * m43 - m31 * m23 * m42 - m41 * m22 * m33 + m41 * m23 * m32;
		this._42 = m11 * m32 * m43 - m11 * m33 * m42 - m31 * m12 * m43 + m31 * m13 * m42 + m41 * m12 * m33 - m41 * m13 * m32;
		this._43 = -m11 * m22 * m43 + m11 * m23 * m42 + m21 * m12 * m43 - m21 * m13 * m42 - m41 * m12 * m23 + m41 * m13 * m22;
		this._44 = m11 * m22 * m33 - m11 * m23 * m32 - m21 * m12 * m33 + m21 * m13 * m32 + m31 * m12 * m23 - m31 * m13 * m22;
		this._44 = 1;
		var det = m11 * this._11 + m12 * this._21 + m13 * this._31;
		if((det < 0?-det:det) < 1e-10) {
			this.zero();
			return;
		}
		var invDet = 1.0 / det;
		this._11 *= invDet;
		this._12 *= invDet;
		this._13 *= invDet;
		this._21 *= invDet;
		this._22 *= invDet;
		this._23 *= invDet;
		this._31 *= invDet;
		this._32 *= invDet;
		this._33 *= invDet;
		this._41 *= invDet;
		this._42 *= invDet;
		this._43 *= invDet;
	}
	,inverse: function(m) {
		var m11 = m._11;
		var m12 = m._12;
		var m13 = m._13;
		var m14 = m._14;
		var m21 = m._21;
		var m22 = m._22;
		var m23 = m._23;
		var m24 = m._24;
		var m31 = m._31;
		var m32 = m._32;
		var m33 = m._33;
		var m34 = m._34;
		var m41 = m._41;
		var m42 = m._42;
		var m43 = m._43;
		var m44 = m._44;
		this._11 = m22 * m33 * m44 - m22 * m34 * m43 - m32 * m23 * m44 + m32 * m24 * m43 + m42 * m23 * m34 - m42 * m24 * m33;
		this._12 = -m12 * m33 * m44 + m12 * m34 * m43 + m32 * m13 * m44 - m32 * m14 * m43 - m42 * m13 * m34 + m42 * m14 * m33;
		this._13 = m12 * m23 * m44 - m12 * m24 * m43 - m22 * m13 * m44 + m22 * m14 * m43 + m42 * m13 * m24 - m42 * m14 * m23;
		this._14 = -m12 * m23 * m34 + m12 * m24 * m33 + m22 * m13 * m34 - m22 * m14 * m33 - m32 * m13 * m24 + m32 * m14 * m23;
		this._21 = -m21 * m33 * m44 + m21 * m34 * m43 + m31 * m23 * m44 - m31 * m24 * m43 - m41 * m23 * m34 + m41 * m24 * m33;
		this._22 = m11 * m33 * m44 - m11 * m34 * m43 - m31 * m13 * m44 + m31 * m14 * m43 + m41 * m13 * m34 - m41 * m14 * m33;
		this._23 = -m11 * m23 * m44 + m11 * m24 * m43 + m21 * m13 * m44 - m21 * m14 * m43 - m41 * m13 * m24 + m41 * m14 * m23;
		this._24 = m11 * m23 * m34 - m11 * m24 * m33 - m21 * m13 * m34 + m21 * m14 * m33 + m31 * m13 * m24 - m31 * m14 * m23;
		this._31 = m21 * m32 * m44 - m21 * m34 * m42 - m31 * m22 * m44 + m31 * m24 * m42 + m41 * m22 * m34 - m41 * m24 * m32;
		this._32 = -m11 * m32 * m44 + m11 * m34 * m42 + m31 * m12 * m44 - m31 * m14 * m42 - m41 * m12 * m34 + m41 * m14 * m32;
		this._33 = m11 * m22 * m44 - m11 * m24 * m42 - m21 * m12 * m44 + m21 * m14 * m42 + m41 * m12 * m24 - m41 * m14 * m22;
		this._34 = -m11 * m22 * m34 + m11 * m24 * m32 + m21 * m12 * m34 - m21 * m14 * m32 - m31 * m12 * m24 + m31 * m14 * m22;
		this._41 = -m21 * m32 * m43 + m21 * m33 * m42 + m31 * m22 * m43 - m31 * m23 * m42 - m41 * m22 * m33 + m41 * m23 * m32;
		this._42 = m11 * m32 * m43 - m11 * m33 * m42 - m31 * m12 * m43 + m31 * m13 * m42 + m41 * m12 * m33 - m41 * m13 * m32;
		this._43 = -m11 * m22 * m43 + m11 * m23 * m42 + m21 * m12 * m43 - m21 * m13 * m42 - m41 * m12 * m23 + m41 * m13 * m22;
		this._44 = m11 * m22 * m33 - m11 * m23 * m32 - m21 * m12 * m33 + m21 * m13 * m32 + m31 * m12 * m23 - m31 * m13 * m22;
		var det = m11 * this._11 + m12 * this._21 + m13 * this._31 + m14 * this._41;
		if((det < 0?-det:det) < 1e-10) {
			this.zero();
			return;
		}
		det = 1.0 / det;
		this._11 *= det;
		this._12 *= det;
		this._13 *= det;
		this._14 *= det;
		this._21 *= det;
		this._22 *= det;
		this._23 *= det;
		this._24 *= det;
		this._31 *= det;
		this._32 *= det;
		this._33 *= det;
		this._34 *= det;
		this._41 *= det;
		this._42 *= det;
		this._43 *= det;
		this._44 *= det;
	}
	,__class__: h3d_Matrix
};
var h3d_Quat = function(x,y,z,w) {
	if(w == null) w = 1.;
	if(z == null) z = 0.;
	if(y == null) y = 0.;
	if(x == null) x = 0.;
	this.x = x;
	this.y = y;
	this.z = z;
	this.w = w;
};
$hxClasses["h3d.Quat"] = h3d_Quat;
h3d_Quat.__name__ = ["h3d","Quat"];
h3d_Quat.prototype = {
	initRotate: function(ax,ay,az) {
		var sinX = Math.sin(ax * 0.5);
		var cosX = Math.cos(ax * 0.5);
		var sinY = Math.sin(ay * 0.5);
		var cosY = Math.cos(ay * 0.5);
		var sinZ = Math.sin(az * 0.5);
		var cosZ = Math.cos(az * 0.5);
		var cosYZ = cosY * cosZ;
		var sinYZ = sinY * sinZ;
		this.x = sinX * cosYZ - cosX * sinYZ;
		this.y = cosX * sinY * cosZ + sinX * cosY * sinZ;
		this.z = cosX * cosY * sinZ - sinX * sinY * cosZ;
		this.w = cosX * cosYZ + sinX * sinYZ;
	}
	,saveToMatrix: function(m) {
		var xx = this.x * this.x;
		var xy = this.x * this.y;
		var xz = this.x * this.z;
		var xw = this.x * this.w;
		var yy = this.y * this.y;
		var yz = this.y * this.z;
		var yw = this.y * this.w;
		var zz = this.z * this.z;
		var zw = this.z * this.w;
		m._11 = 1 - 2 * (yy + zz);
		m._12 = 2 * (xy + zw);
		m._13 = 2 * (xz - yw);
		m._14 = 0;
		m._21 = 2 * (xy - zw);
		m._22 = 1 - 2 * (xx + zz);
		m._23 = 2 * (yz + xw);
		m._24 = 0;
		m._31 = 2 * (xz + yw);
		m._32 = 2 * (yz - xw);
		m._33 = 1 - 2 * (xx + yy);
		m._34 = 0;
		m._41 = 0;
		m._42 = 0;
		m._43 = 0;
		m._44 = 1;
		return m;
	}
	,__class__: h3d_Quat
};
var h3d_Vector = function(x,y,z,w) {
	if(w == null) w = 1.;
	if(z == null) z = 0.;
	if(y == null) y = 0.;
	if(x == null) x = 0.;
	this.x = x;
	this.y = y;
	this.z = z;
	this.w = w;
};
$hxClasses["h3d.Vector"] = h3d_Vector;
h3d_Vector.__name__ = ["h3d","Vector"];
h3d_Vector.prototype = {
	sub: function(v) {
		return new h3d_Vector(this.x - v.x,this.y - v.y,this.z - v.z,this.w - v.w);
	}
	,cross: function(v) {
		return new h3d_Vector(this.y * v.z - this.z * v.y,this.z * v.x - this.x * v.z,this.x * v.y - this.y * v.x,1);
	}
	,dot3: function(v) {
		return this.x * v.x + this.y * v.y + this.z * v.z;
	}
	,normalize: function() {
		var k = this.x * this.x + this.y * this.y + this.z * this.z;
		if(k < 1e-10) k = 0; else k = 1. / Math.sqrt(k);
		this.x *= k;
		this.y *= k;
		this.z *= k;
	}
	,set: function(x,y,z,w) {
		if(w == null) w = 1.;
		if(z == null) z = 0.;
		if(y == null) y = 0.;
		if(x == null) x = 0.;
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}
	,load: function(v) {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		this.w = v.w;
	}
	,project: function(m) {
		var px = this.x * m._11 + this.y * m._21 + this.z * m._31 + this.w * m._41;
		var py = this.x * m._12 + this.y * m._22 + this.z * m._32 + this.w * m._42;
		var pz = this.x * m._13 + this.y * m._23 + this.z * m._33 + this.w * m._43;
		var iw = 1 / (this.x * m._14 + this.y * m._24 + this.z * m._34 + this.w * m._44);
		this.x = px * iw;
		this.y = py * iw;
		this.z = pz * iw;
		this.w = 1;
	}
	,transform3x4: function(m) {
		var px = this.x * m._11 + this.y * m._21 + this.z * m._31 + this.w * m._41;
		var py = this.x * m._12 + this.y * m._22 + this.z * m._32 + this.w * m._42;
		var pz = this.x * m._13 + this.y * m._23 + this.z * m._33 + this.w * m._43;
		this.x = px;
		this.y = py;
		this.z = pz;
	}
	,transform3x3: function(m) {
		var px = this.x * m._11 + this.y * m._21 + this.z * m._31;
		var py = this.x * m._12 + this.y * m._22 + this.z * m._32;
		var pz = this.x * m._13 + this.y * m._23 + this.z * m._33;
		this.x = px;
		this.y = py;
		this.z = pz;
	}
	,clone: function() {
		return new h3d_Vector(this.x,this.y,this.z,this.w);
	}
	,setColor: function(c,scale) {
		if(scale == null) scale = 1.0;
		var s = scale / 255;
		this.x = (c >> 16 & 255) * s;
		this.y = (c >> 8 & 255) * s;
		this.z = (c & 255) * s;
		this.w = (c >>> 24) * s;
	}
	,__class__: h3d_Vector
};
var h3d_anim_Animation = function() { };
$hxClasses["h3d.anim.Animation"] = h3d_anim_Animation;
h3d_anim_Animation.__name__ = ["h3d","anim","Animation"];
h3d_anim_Animation.prototype = {
	getPropValue: function(objectName,propName) {
		return null;
	}
	,sync: function(decompose) {
		if(decompose == null) decompose = false;
		throw new js__$Boot_HaxeError("assert");
	}
	,isPlaying: function() {
		return !this.pause && (this.speed < 0?-this.speed:this.speed) > 0.000001;
	}
	,endFrame: function() {
		return this.frameCount;
	}
	,update: function(dt) {
		if(!this.isInstance) throw new js__$Boot_HaxeError("You must instanciate this animation first");
		if(!this.isPlaying()) return 0;
		if(this.events != null && this.onEvent != null) {
			var f0 = this.frame | 0;
			var f1 = this.frame + dt * this.speed * this.sampling | 0;
			if(f1 >= this.frameCount) f1 = this.frameCount - 1;
			var _g1 = f0;
			var _g = f1 + 1;
			while(_g1 < _g) {
				var f = _g1++;
				if(f == this.lastEvent) continue;
				this.lastEvent = f;
				if(this.events[f] != null) {
					var oldF = this.frame;
					var oldDT = dt;
					dt -= (f - this.frame) / (this.speed * this.sampling);
					this.frame = f;
					this.onEvent(this.events[f]);
					if(this.frame == f && f == this.frameCount - 1) {
						this.frame = oldF;
						dt = oldDT;
						break;
					} else return dt;
				}
			}
		}
		if(this.onAnimEnd != null) {
			var end = this.endFrame();
			var et = (end - this.frame) / (this.speed * this.sampling);
			if(et <= dt && et > 0) {
				this.frame = end;
				dt -= et;
				this.onAnimEnd();
				if(this.frame == end && this.isPlaying()) {
					if(this.loop) this.frame = 0; else dt = 0;
				}
				return dt;
			}
		}
		this.frame += dt * this.speed * this.sampling;
		if(this.frame >= this.frameCount) {
			if(this.loop) this.frame %= this.frameCount; else this.frame = this.frameCount;
		}
		return 0;
	}
	,__class__: h3d_anim_Animation
};
var h3d_col_Collider = function() { };
$hxClasses["h3d.col.Collider"] = h3d_col_Collider;
h3d_col_Collider.__name__ = ["h3d","col","Collider"];
h3d_col_Collider.prototype = {
	__class__: h3d_col_Collider
};
var h3d_col_Bounds = function() {
	this.xMin = 1e20;
	this.xMax = -1e20;
	this.yMin = 1e20;
	this.yMax = -1e20;
	this.zMin = 1e20;
	this.zMax = -1e20;
};
$hxClasses["h3d.col.Bounds"] = h3d_col_Bounds;
h3d_col_Bounds.__name__ = ["h3d","col","Bounds"];
h3d_col_Bounds.__interfaces__ = [h3d_col_Collider];
h3d_col_Bounds.prototype = {
	rayIntersection: function(r,p) {
		var minTx = (this.xMin - r.px) / r.lx;
		var minTy = (this.yMin - r.py) / r.ly;
		var minTz = (this.zMin - r.pz) / r.lz;
		var maxTx = (this.xMax - r.px) / r.lx;
		var maxTy = (this.yMax - r.py) / r.ly;
		var maxTz = (this.zMax - r.pz) / r.lz;
		var realMinTx;
		if(minTx > maxTx) realMinTx = maxTx; else realMinTx = minTx;
		var realMinTy;
		if(minTy > maxTy) realMinTy = maxTy; else realMinTy = minTy;
		var realMinTz;
		if(minTz > maxTz) realMinTz = maxTz; else realMinTz = minTz;
		var realMaxTx;
		if(minTx < maxTx) realMaxTx = maxTx; else realMaxTx = minTx;
		var realMaxTy;
		if(minTy < maxTy) realMaxTy = maxTy; else realMaxTy = minTy;
		var realMaxTz;
		if(minTz < maxTz) realMaxTz = maxTz; else realMaxTz = minTz;
		var minmax = hxd_Math.min(realMaxTx > realMaxTy?realMaxTy:realMaxTx,realMaxTz);
		var maxmin = hxd_Math.max(realMinTx < realMinTy?realMinTy:realMinTx,realMinTz);
		if(minmax < maxmin) return null;
		if(p == null) p = new h3d_col_Point();
		p.x = r.px + maxmin * r.lx;
		p.y = r.py + maxmin * r.ly;
		p.z = r.pz + maxmin * r.lz;
		return p;
	}
	,empty: function() {
		this.xMin = 1e20;
		this.xMax = -1e20;
		this.yMin = 1e20;
		this.yMax = -1e20;
		this.zMin = 1e20;
		this.zMax = -1e20;
	}
	,__class__: h3d_col_Bounds
};
var h3d_col_Frustum = function(mvp) {
	this.checkNearFar = true;
	this.pleft = new h3d_col_Plane(mvp._14 + mvp._11,mvp._24 + mvp._21,mvp._34 + mvp._31,-(mvp._44 + mvp._41));
	this.pright = new h3d_col_Plane(mvp._14 - mvp._11,mvp._24 - mvp._21,mvp._34 - mvp._31,mvp._41 - mvp._44);
	this.ptop = new h3d_col_Plane(mvp._14 - mvp._12,mvp._24 - mvp._22,mvp._34 - mvp._32,mvp._42 - mvp._44);
	this.pbottom = new h3d_col_Plane(mvp._14 + mvp._12,mvp._24 + mvp._22,mvp._34 + mvp._32,-(mvp._44 + mvp._42));
	this.pnear = new h3d_col_Plane(mvp._13,mvp._23,mvp._33,-mvp._43);
	this.pfar = new h3d_col_Plane(mvp._14 - mvp._13,mvp._24 - mvp._23,mvp._34 - mvp._33,mvp._43 - mvp._44);
	this.pleft.normalize();
	this.pright.normalize();
	this.ptop.normalize();
	this.pbottom.normalize();
	this.pnear.normalize();
	this.pfar.normalize();
};
$hxClasses["h3d.col.Frustum"] = h3d_col_Frustum;
h3d_col_Frustum.__name__ = ["h3d","col","Frustum"];
h3d_col_Frustum.prototype = {
	hasSphere: function(s) {
		var p = new h3d_col_Point(s.x,s.y,s.z);
		if(this.pleft.distance(p) < -s.r) return false;
		if(this.pright.distance(p) < -s.r) return false;
		if(this.ptop.distance(p) < -s.r) return false;
		if(this.pbottom.distance(p) < -s.r) return false;
		if(this.checkNearFar) {
			if(this.pnear.distance(p) < -s.r) return false;
			if(this.pfar.distance(p) < -s.r) return false;
		}
		return true;
	}
	,__class__: h3d_col_Frustum
};
var h3d_col_Plane = function(nx,ny,nz,d) {
	this.nx = nx;
	this.ny = ny;
	this.nz = nz;
	this.d = d;
};
$hxClasses["h3d.col.Plane"] = h3d_col_Plane;
h3d_col_Plane.__name__ = ["h3d","col","Plane"];
h3d_col_Plane.prototype = {
	normalize: function() {
		var len = 1. / Math.sqrt(this.nx * this.nx + this.ny * this.ny + this.nz * this.nz);
		this.nx *= len;
		this.ny *= len;
		this.nz *= len;
		this.d *= len;
	}
	,distance: function(p) {
		return this.nx * p.x + this.ny * p.y + this.nz * p.z - this.d;
	}
	,__class__: h3d_col_Plane
};
var h3d_col_Point = function(x,y,z) {
	if(z == null) z = 0.;
	if(y == null) y = 0.;
	if(x == null) x = 0.;
	this.x = x;
	this.y = y;
	this.z = z;
};
$hxClasses["h3d.col.Point"] = h3d_col_Point;
h3d_col_Point.__name__ = ["h3d","col","Point"];
h3d_col_Point.prototype = {
	cross: function(p) {
		return new h3d_col_Point(this.y * p.z - this.z * p.y,this.z * p.x - this.x * p.z,this.x * p.y - this.y * p.x);
	}
	,normalize: function() {
		var k = this.x * this.x + this.y * this.y + this.z * this.z;
		if(k < 1e-10) k = 0; else k = 1. / Math.sqrt(k);
		this.x *= k;
		this.y *= k;
		this.z *= k;
	}
	,clone: function() {
		return new h3d_col_Point(this.x,this.y,this.z);
	}
	,__class__: h3d_col_Point
};
var h3d_col_Ray = function() {
};
$hxClasses["h3d.col.Ray"] = h3d_col_Ray;
h3d_col_Ray.__name__ = ["h3d","col","Ray"];
h3d_col_Ray.fromPoints = function(p1,p2) {
	var r = new h3d_col_Ray();
	r.px = p1.x;
	r.py = p1.y;
	r.pz = p1.z;
	r.lx = p2.x - p1.x;
	r.ly = p2.y - p1.y;
	r.lz = p2.z - p1.z;
	return r;
};
h3d_col_Ray.prototype = {
	clone: function() {
		var r = new h3d_col_Ray();
		r.px = this.px;
		r.py = this.py;
		r.pz = this.pz;
		r.lx = this.lx;
		r.ly = this.ly;
		r.lz = this.lz;
		return r;
	}
	,normalize: function() {
		var l = this.lx * this.lx + this.ly * this.ly + this.lz * this.lz;
		if(l < 1e-10) l = 0; else l = 1. / Math.sqrt(l);
		this.lx *= l;
		this.ly *= l;
		this.lz *= l;
	}
	,transform: function(m) {
		var p = new h3d_Vector(this.px,this.py,this.pz);
		p.transform3x4(m);
		this.px = p.x;
		this.py = p.y;
		this.pz = p.z;
		var l = new h3d_Vector(this.lx,this.ly,this.lz);
		l.transform3x3(m);
		this.lx = l.x;
		this.ly = l.y;
		this.lz = l.z;
	}
	,__class__: h3d_col_Ray
};
var h3d_col_Sphere = function(x,y,z,r) {
	if(r == null) r = 0.;
	if(z == null) z = 0.;
	if(y == null) y = 0.;
	if(x == null) x = 0.;
	this.x = x;
	this.y = y;
	this.z = z;
	this.r = r;
};
$hxClasses["h3d.col.Sphere"] = h3d_col_Sphere;
h3d_col_Sphere.__name__ = ["h3d","col","Sphere"];
h3d_col_Sphere.__interfaces__ = [h3d_col_Collider];
h3d_col_Sphere.prototype = {
	rayIntersection: function(r,p) {
		var r2 = this.r * this.r;
		var px = r.px + r.lx;
		var py = r.py + r.ly;
		var pz = r.pz + r.lz;
		var a = r.lx * r.lx + r.ly * r.ly + r.lz * r.lz;
		var b = 2 * r.lx * (this.x - px) + 2 * r.ly * (this.y - py) + 2 * r.lz * (this.z - pz);
		var c = this.x * this.x + this.y * this.y + this.z * this.z + (px * px + py * py + pz * pz) - 2 * (this.x * px + this.y * py + this.z * pz) - r2;
		var d = b * b - 4 * a * c;
		if(d < 0) return null;
		d = Math.sqrt(d);
		var t = (-b + d) / (2 * a);
		if(p == null) p = new h3d_col_Point();
		p.x = px - t * r.lx;
		p.y = py - t * r.ly;
		p.z = pz - t * r.lz;
		return p;
	}
	,__class__: h3d_col_Sphere
};
var h3d_impl_Feature = $hxClasses["h3d.impl.Feature"] = { __ename__ : true, __constructs__ : ["StandardDerivatives","FloatTextures","PerTargetDepthBuffer","TargetUseDefaultDepthBuffer","HardwareAccelerated","FullClearRequired","MultipleRenderTargets"] };
h3d_impl_Feature.StandardDerivatives = ["StandardDerivatives",0];
h3d_impl_Feature.StandardDerivatives.toString = $estr;
h3d_impl_Feature.StandardDerivatives.__enum__ = h3d_impl_Feature;
h3d_impl_Feature.FloatTextures = ["FloatTextures",1];
h3d_impl_Feature.FloatTextures.toString = $estr;
h3d_impl_Feature.FloatTextures.__enum__ = h3d_impl_Feature;
h3d_impl_Feature.PerTargetDepthBuffer = ["PerTargetDepthBuffer",2];
h3d_impl_Feature.PerTargetDepthBuffer.toString = $estr;
h3d_impl_Feature.PerTargetDepthBuffer.__enum__ = h3d_impl_Feature;
h3d_impl_Feature.TargetUseDefaultDepthBuffer = ["TargetUseDefaultDepthBuffer",3];
h3d_impl_Feature.TargetUseDefaultDepthBuffer.toString = $estr;
h3d_impl_Feature.TargetUseDefaultDepthBuffer.__enum__ = h3d_impl_Feature;
h3d_impl_Feature.HardwareAccelerated = ["HardwareAccelerated",4];
h3d_impl_Feature.HardwareAccelerated.toString = $estr;
h3d_impl_Feature.HardwareAccelerated.__enum__ = h3d_impl_Feature;
h3d_impl_Feature.FullClearRequired = ["FullClearRequired",5];
h3d_impl_Feature.FullClearRequired.toString = $estr;
h3d_impl_Feature.FullClearRequired.__enum__ = h3d_impl_Feature;
h3d_impl_Feature.MultipleRenderTargets = ["MultipleRenderTargets",6];
h3d_impl_Feature.MultipleRenderTargets.toString = $estr;
h3d_impl_Feature.MultipleRenderTargets.__enum__ = h3d_impl_Feature;
h3d_impl_Feature.__empty_constructs__ = [h3d_impl_Feature.StandardDerivatives,h3d_impl_Feature.FloatTextures,h3d_impl_Feature.PerTargetDepthBuffer,h3d_impl_Feature.TargetUseDefaultDepthBuffer,h3d_impl_Feature.HardwareAccelerated,h3d_impl_Feature.FullClearRequired,h3d_impl_Feature.MultipleRenderTargets];
var h3d_impl_Driver = function() { };
$hxClasses["h3d.impl.Driver"] = h3d_impl_Driver;
h3d_impl_Driver.__name__ = ["h3d","impl","Driver"];
h3d_impl_Driver.prototype = {
	hasFeature: function(f) {
		return false;
	}
	,isDisposed: function() {
		return true;
	}
	,begin: function(frame) {
	}
	,clear: function(color,depth,stencil) {
	}
	,init: function(onCreate,forceSoftware) {
		if(forceSoftware == null) forceSoftware = false;
	}
	,resize: function(width,height) {
	}
	,selectShader: function(shader) {
		return false;
	}
	,selectMaterial: function(pass) {
	}
	,uploadShaderBuffers: function(buffers,which) {
	}
	,selectBuffer: function(buffer) {
	}
	,draw: function(ibuf,startIndex,ntriangles) {
	}
	,setRenderTarget: function(tex) {
	}
	,present: function() {
	}
	,setDebug: function(b) {
	}
	,allocTexture: function(t) {
		return null;
	}
	,allocIndexes: function(count) {
		return null;
	}
	,allocVertexes: function(m) {
		return null;
	}
	,disposeTexture: function(t) {
	}
	,disposeIndexes: function(i) {
	}
	,disposeVertexes: function(v) {
	}
	,uploadIndexBuffer: function(i,startIndice,indiceCount,buf,bufPos) {
	}
	,uploadVertexBuffer: function(v,startVertex,vertexCount,buf,bufPos) {
	}
	,uploadTexturePixels: function(t,pixels,mipLevel,side) {
	}
	,__class__: h3d_impl_Driver
};
var h3d_impl__$GlDriver_CompiledShader = function(s,vertex,shader) {
	this.s = s;
	this.vertex = vertex;
	this.shader = shader;
};
$hxClasses["h3d.impl._GlDriver.CompiledShader"] = h3d_impl__$GlDriver_CompiledShader;
h3d_impl__$GlDriver_CompiledShader.__name__ = ["h3d","impl","_GlDriver","CompiledShader"];
h3d_impl__$GlDriver_CompiledShader.prototype = {
	__class__: h3d_impl__$GlDriver_CompiledShader
};
var h3d_impl__$GlDriver_CompiledProgram = function() {
};
$hxClasses["h3d.impl._GlDriver.CompiledProgram"] = h3d_impl__$GlDriver_CompiledProgram;
h3d_impl__$GlDriver_CompiledProgram.__name__ = ["h3d","impl","_GlDriver","CompiledProgram"];
h3d_impl__$GlDriver_CompiledProgram.prototype = {
	__class__: h3d_impl__$GlDriver_CompiledProgram
};
var h3d_impl_GlDriver = function() {
	this.canvas = hxd_Stage.getCanvas();
	if(this.canvas == null) throw new js__$Boot_HaxeError("Canvas #webgl not found");
	this.gl = js_html__$CanvasElement_CanvasUtil.getContextWebGL(this.canvas,{ alpha : false});
	if(this.gl == null) throw new js__$Boot_HaxeError("Could not acquire GL context");
	if(typeof(WebGLDebugUtils) != "undefined") this.gl = WebGLDebugUtils.makeDebugContext(this.gl);
	this.programs = new haxe_ds_IntMap();
	this.curAttribs = 0;
	this.curMatBits = -1;
	this.gl.pixelStorei(37440,1);
};
$hxClasses["h3d.impl.GlDriver"] = h3d_impl_GlDriver;
h3d_impl_GlDriver.__name__ = ["h3d","impl","GlDriver"];
h3d_impl_GlDriver.__super__ = h3d_impl_Driver;
h3d_impl_GlDriver.prototype = $extend(h3d_impl_Driver.prototype,{
	begin: function(frame) {
		this.frame = frame;
		this.gl.useProgram(null);
		this.curShader = null;
		this.curBuffer = null;
	}
	,compileShader: function(glout,shader) {
		var type;
		if(shader.vertex) type = 35633; else type = 35632;
		var s = this.gl.createShader(type);
		var code = glout.run(shader.data);
		this.gl.shaderSource(s,code);
		this.gl.compileShader(s);
		if(this.gl.getShaderParameter(s,35713) != 1) {
			var log = this.gl.getShaderInfoLog(s);
			var lid = Std.parseInt(HxOverrides.substr(log,9,null));
			var line;
			if(lid == null) line = null; else line = code.split("\n")[lid - 1];
			if(line == null) line = ""; else line = "(" + StringTools.trim(line) + ")";
			throw new js__$Boot_HaxeError("An error occurred compiling the shaders: " + log + line + "\n\n" + code);
		}
		return new h3d_impl__$GlDriver_CompiledShader(s,shader.vertex,shader);
	}
	,initShader: function(p,s,shader) {
		var prefix;
		if(s.vertex) prefix = "vertex"; else prefix = "fragment";
		s.globals = this.gl.getUniformLocation(p.p,prefix + "Globals");
		s.params = this.gl.getUniformLocation(p.p,prefix + "Params");
		var _g = [];
		var _g2 = 0;
		var _g1 = shader.textures2DCount;
		while(_g2 < _g1) {
			var i = _g2++;
			_g.push(this.gl.getUniformLocation(p.p,prefix + "Textures[" + i + "]"));
		}
		s.textures = _g;
	}
	,selectShader: function(shader) {
		var p = this.programs.h[shader.id];
		if(p == null) {
			p = new h3d_impl__$GlDriver_CompiledProgram();
			var glout = new hxsl_GlslOut();
			p.vertex = this.compileShader(glout,shader.vertex);
			p.fragment = this.compileShader(glout,shader.fragment);
			p.p = this.gl.createProgram();
			this.gl.attachShader(p.p,p.vertex.s);
			this.gl.attachShader(p.p,p.fragment.s);
			this.gl.linkProgram(p.p);
			this.gl.deleteShader(p.vertex.s);
			this.gl.deleteShader(p.fragment.s);
			if(this.gl.getProgramParameter(p.p,35714) != 1) {
				var log = this.gl.getProgramInfoLog(p.p);
				throw new js__$Boot_HaxeError("Program linkage failure: " + log);
			}
			this.initShader(p,p.vertex,shader.vertex);
			this.initShader(p,p.fragment,shader.fragment);
			p.attribNames = [];
			p.attribs = [];
			p.stride = 0;
			var _g = 0;
			var _g1 = shader.vertex.data.vars;
			while(_g < _g1.length) {
				var v = _g1[_g];
				++_g;
				var _g2 = v.kind;
				switch(_g2[1]) {
				case 1:
					var t = 5126;
					var size;
					{
						var _g3 = v.type;
						switch(_g3[1]) {
						case 5:
							var n = _g3[2];
							size = n;
							break;
						case 9:
							var n1 = _g3[2];
							t = 5120;
							size = n1;
							break;
						case 3:
							size = 1;
							break;
						default:
							throw new js__$Boot_HaxeError("assert " + Std.string(v.type));
						}
					}
					var index = this.gl.getAttribLocation(p.p,glout.varNames.h[v.id]);
					if(index < 0) continue;
					p.attribs.push({ offset : p.stride, index : index, size : size, type : t});
					p.attribNames.push(v.name);
					p.stride += size;
					break;
				default:
				}
			}
			this.programs.h[shader.id] = p;
		}
		if(this.curShader == p) return false;
		this.gl.useProgram(p.p);
		var _g11 = this.curAttribs;
		var _g4 = p.attribs.length;
		while(_g11 < _g4) {
			var i = _g11++;
			this.gl.enableVertexAttribArray(i);
			this.curAttribs++;
		}
		while(this.curAttribs > p.attribs.length) this.gl.disableVertexAttribArray(--this.curAttribs);
		this.curShader = p;
		this.curBuffer = null;
		return true;
	}
	,uploadShaderBuffers: function(buf,which) {
		this.uploadBuffer(this.curShader.vertex,buf.vertex,which);
		this.uploadBuffer(this.curShader.fragment,buf.fragment,which);
	}
	,uploadBuffer: function(s,buf,which) {
		switch(which) {
		case 0:
			if(s.globals != null) {
				var a = new Float32Array(buf.globals).subarray(0,s.shader.globalsSize * 4);
				this.gl.uniform4fv(s.globals,a);
			}
			break;
		case 1:
			if(s.params != null) {
				var a1 = new Float32Array(buf.params).subarray(0,s.shader.paramsSize * 4);
				this.gl.uniform4fv(s.params,a1);
			}
			break;
		case 2:
			var _g1 = 0;
			var _g = s.textures.length;
			while(_g1 < _g) {
				var i = _g1++;
				var t = buf.tex[i];
				if(t == null || t.t == null && t.realloc == null) {
					var color = h3d_mat_Defaults.loadingTextureColor;
					t = h3d_mat_Texture.fromColor(color,(color >>> 24) / 255);
				}
				if(t != null && t.t == null && t.realloc != null) {
					t.alloc();
					t.realloc();
				}
				t.lastFrame = this.frame;
				this.gl.activeTexture(33984 + i);
				this.gl.uniform1i(s.textures[i],i);
				this.gl.bindTexture(3553,t.t.t);
				var flags = h3d_impl_GlDriver.TFILTERS[t.mipMap[1]][t.filter[1]];
				this.gl.texParameteri(3553,10240,flags[0]);
				this.gl.texParameteri(3553,10241,flags[1]);
				var w = h3d_impl_GlDriver.TWRAP[t.wrap[1]];
				this.gl.texParameteri(3553,10242,w);
				this.gl.texParameteri(3553,10243,w);
			}
			break;
		}
	}
	,selectMaterial: function(pass) {
		this.selectMaterialBits(pass.bits);
	}
	,selectMaterialBits: function(bits) {
		var diff = bits ^ this.curMatBits;
		if(this.curMatBits < 0) diff = -1;
		if(diff == 0) return;
		if((diff & 3) != 0) {
			var cull = bits & 3;
			if(cull == 0) this.gl.disable(2884); else {
				if((this.curMatBits & 3) == 0) this.gl.enable(2884);
				this.gl.cullFace(h3d_impl_GlDriver.FACES[cull]);
			}
		}
		if((diff & 4194240) != 0) {
			var csrc = bits >> 6 & 15;
			var cdst = bits >> 10 & 15;
			var asrc = bits >> 14 & 15;
			var adst = bits >> 18 & 15;
			if(csrc == asrc && cdst == adst) {
				if(csrc == 0 && cdst == 1) this.gl.disable(3042); else {
					if(this.curMatBits < 0 || (this.curMatBits >> 6 & 15) == 0 && (this.curMatBits >> 10 & 15) == 1) this.gl.enable(3042);
					this.gl.blendFunc(h3d_impl_GlDriver.BLEND[csrc],h3d_impl_GlDriver.BLEND[cdst]);
				}
			} else {
				if(this.curMatBits < 0 || (this.curMatBits >> 6 & 15) == 0 && (this.curMatBits >> 10 & 15) == 1) this.gl.enable(3042);
				this.gl.blendFuncSeparate(h3d_impl_GlDriver.BLEND[csrc],h3d_impl_GlDriver.BLEND[cdst],h3d_impl_GlDriver.BLEND[asrc],h3d_impl_GlDriver.BLEND[adst]);
			}
		}
		if((diff & 62914560) != 0) {
			var cop = bits >> 22 & 3;
			var aop = bits >> 24 & 3;
			if(cop == aop) this.gl.blendEquation(h3d_impl_GlDriver.OP[cop]); else this.gl.blendEquationSeparate(h3d_impl_GlDriver.OP[cop],h3d_impl_GlDriver.OP[aop]);
		}
		if((diff & 4) != 0) this.gl.depthMask((bits >> 2 & 1) != 0);
		if((diff & 56) != 0) {
			var cmp = bits >> 3 & 7;
			if(cmp == 0) this.gl.disable(2929); else {
				if(this.curMatBits < 0 || (this.curMatBits >> 3 & 7) == 0) this.gl.enable(2929);
				this.gl.depthFunc(h3d_impl_GlDriver.COMPARE[cmp]);
			}
		}
		if((diff & 1006632960) != 0) {
			var m = bits >> 26 & 15;
			this.gl.colorMask((m & 1) != 0,(m & 2) != 0,(m & 4) != 0,(m & 8) != 0);
		}
		this.curMatBits = bits;
	}
	,clear: function(color,depth,stencil) {
		var bits = 0;
		if(color != null) {
			this.gl.colorMask(true,true,true,true);
			if(this.curMatBits >= 0) this.curMatBits |= 1006632960;
			this.gl.clearColor(color.x,color.y,color.z,color.w);
			bits |= 16384;
		}
		if(depth != null) {
			this.gl.depthMask(true);
			if(this.curMatBits >= 0) this.curMatBits |= 4;
			this.gl.clearDepth(depth);
			bits |= 256;
		}
		if(stencil != null) {
			this.gl.clearStencil(stencil);
			bits |= 1024;
		}
		if(bits != 0) this.gl.clear(bits);
		if(this.curTarget != null) this.curTarget.flags |= 1 << h3d_mat_TextureFlags.WasCleared[1];
	}
	,resize: function(width,height) {
		if(this.canvas.style.width == "") {
			this.canvas.style.width = Std["int"](width / window.devicePixelRatio) + "px";
			this.canvas.style.height = Std["int"](height / window.devicePixelRatio) + "px";
		}
		this.canvas.width = width;
		this.canvas.height = height;
		this.bufferWidth = width;
		this.bufferHeight = height;
		this.gl.viewport(0,0,width,height);
	}
	,getChannels: function(t) {
		var _g = t.internalFmt;
		switch(_g) {
		case 6408:
			return 6408;
		case 6406:
			return 6406;
		default:
			throw new js__$Boot_HaxeError("Invalid format " + t.internalFmt);
		}
	}
	,allocTexture: function(t) {
		if((t.flags & 1 << h3d_mat_TextureFlags.TargetUseDefaultDepth[1]) != 0) throw new js__$Boot_HaxeError("TargetUseDefaultDepth not supported in GL");
		var tt = this.gl.createTexture();
		var tt1 = { t : tt, width : t.width, height : t.height, internalFmt : 6408, pixelFmt : 5121};
		var _g = t.format;
		switch(_g[1]) {
		case 2:
			break;
		case 5:
			tt1.internalFmt = 6406;
			break;
		case 4:
			if(this.hasFeature(h3d_impl_Feature.FloatTextures)) tt1.pixelFmt = 5126; else throw new js__$Boot_HaxeError("Unsupported texture format " + Std.string(t.format));
			break;
		default:
			throw new js__$Boot_HaxeError("Unsupported texture format " + Std.string(t.format));
		}
		t.lastFrame = this.frame;
		t.flags &= 268435455 - (1 << h3d_mat_TextureFlags.WasCleared[1]);
		this.gl.bindTexture(3553,tt1.t);
		var mipMap;
		if((t.flags & 1 << h3d_mat_TextureFlags.MipMapped[1]) != 0) mipMap = 9985; else mipMap = 9729;
		this.gl.texParameteri(3553,10240,mipMap);
		this.gl.texParameteri(3553,10241,mipMap);
		this.gl.texImage2D(3553,0,tt1.internalFmt,tt1.width,tt1.height,0,this.getChannels(tt1),tt1.pixelFmt,null);
		if((t.flags & 1 << h3d_mat_TextureFlags.Target[1]) != 0) {
			var fb = this.gl.createFramebuffer();
			this.gl.bindFramebuffer(36160,fb);
			this.gl.framebufferTexture2D(36160,36064,3553,tt1.t,0);
			tt1.fb = fb;
			if((t.flags & 1 << h3d_mat_TextureFlags.TargetDepth[1]) != 0) {
				tt1.rb = this.gl.createRenderbuffer();
				this.gl.bindRenderbuffer(36161,tt1.rb);
				this.gl.renderbufferStorage(36161,33189,tt1.width,tt1.height);
				this.gl.framebufferRenderbuffer(36160,36096,36161,tt1.rb);
				this.gl.bindRenderbuffer(36161,null);
			}
			this.gl.bindFramebuffer(36160,this.curTarget == null?null:this.curTarget.t.fb);
		}
		this.gl.bindTexture(3553,null);
		return tt1;
	}
	,allocVertexes: function(m) {
		var b = this.gl.createBuffer();
		this.gl.bindBuffer(34962,b);
		if(m.size * m.stride == 0) throw new js__$Boot_HaxeError("assert");
		this.gl.bufferData(34962,m.size * m.stride * 4,(m.flags & 1 << h3d_BufferFlag.Dynamic[1]) != 0?35048:35044);
		this.gl.bindBuffer(34962,null);
		return { b : b, stride : m.stride};
	}
	,allocIndexes: function(count) {
		var b = this.gl.createBuffer();
		this.gl.bindBuffer(34963,b);
		this.gl.bufferData(34963,count * 2,35044);
		this.gl.bindBuffer(34963,null);
		return b;
	}
	,disposeTexture: function(t) {
		var tt = t.t;
		if(tt == null) return;
		t.t = null;
		this.gl.deleteTexture(tt.t);
		if(tt.rb != null) this.gl.deleteRenderbuffer(tt.rb);
		if(tt.fb != null) this.gl.deleteFramebuffer(tt.fb);
	}
	,disposeIndexes: function(i) {
		this.gl.deleteBuffer(i);
	}
	,disposeVertexes: function(v) {
		this.gl.deleteBuffer(v.b);
	}
	,uploadTexturePixels: function(t,pixels,mipLevel,side) {
		this.gl.bindTexture(3553,t.t.t);
		pixels.convert(t.format);
		this.gl.texImage2D(3553,mipLevel,t.t.internalFmt,t.width,t.height,0,this.getChannels(t.t),t.t.pixelFmt,new Uint8Array(pixels.bytes.b.bufferValue));
		if((t.flags & 1 << h3d_mat_TextureFlags.MipMapped[1]) != 0) this.gl.generateMipmap(3553);
		this.gl.bindTexture(3553,null);
		t.flags |= 1 << h3d_mat_TextureFlags.WasCleared[1];
	}
	,uploadVertexBuffer: function(v,startVertex,vertexCount,buf,bufPos) {
		var stride = v.stride;
		this.gl.bindBuffer(34962,v.b);
		var buf1 = new Float32Array(buf);
		var sub = new Float32Array(buf1.buffer,bufPos,vertexCount * stride);
		this.gl.bufferSubData(34962,startVertex * stride * 4,sub);
		this.gl.bindBuffer(34962,null);
	}
	,uploadIndexBuffer: function(i,startIndice,indiceCount,buf,bufPos) {
		this.gl.bindBuffer(34963,i);
		var buf1 = new Uint16Array(buf);
		var sub = new Uint16Array(buf1.buffer,bufPos,indiceCount);
		this.gl.bufferSubData(34963,startIndice * 2,sub);
		this.gl.bindBuffer(34963,null);
	}
	,selectBuffer: function(v) {
		if(v == this.curBuffer) return;
		if(this.curBuffer != null && v.buffer == this.curBuffer.buffer && (v.buffer.flags & 1 << h3d_BufferFlag.RawFormat[1]) != 0 == ((this.curBuffer.flags & 1 << h3d_BufferFlag.RawFormat[1]) != 0)) {
			this.curBuffer = v;
			return;
		}
		if(this.curShader == null) throw new js__$Boot_HaxeError("No shader selected");
		this.curBuffer = v;
		var m = v.buffer.vbuf;
		if(m.stride < this.curShader.stride) throw new js__$Boot_HaxeError("Buffer stride (" + m.stride + ") and shader stride (" + this.curShader.stride + ") mismatch");
		this.gl.bindBuffer(34962,m.b);
		if((v.flags & 1 << h3d_BufferFlag.RawFormat[1]) != 0) {
			var _g = 0;
			var _g1 = this.curShader.attribs;
			while(_g < _g1.length) {
				var a = _g1[_g];
				++_g;
				this.gl.vertexAttribPointer(a.index,a.size,a.type,false,m.stride * 4,a.offset * 4);
			}
		} else {
			var offset = 8;
			var _g11 = 0;
			var _g2 = this.curShader.attribs.length;
			while(_g11 < _g2) {
				var i = _g11++;
				var a1 = this.curShader.attribs[i];
				var _g21 = this.curShader.attribNames[i];
				var s = _g21;
				switch(_g21) {
				case "position":
					this.gl.vertexAttribPointer(a1.index,a1.size,a1.type,false,m.stride * 4,0);
					break;
				case "normal":
					if(m.stride < 6) throw new js__$Boot_HaxeError("Buffer is missing NORMAL data, set it to RAW format ?");
					this.gl.vertexAttribPointer(a1.index,a1.size,a1.type,false,m.stride * 4,12);
					break;
				case "uv":
					if(m.stride < 8) throw new js__$Boot_HaxeError("Buffer is missing UV data, set it to RAW format ?");
					this.gl.vertexAttribPointer(a1.index,a1.size,a1.type,false,m.stride * 4,24);
					break;
				default:
					this.gl.vertexAttribPointer(a1.index,a1.size,a1.type,false,m.stride * 4,offset * 4);
					offset += a1.size;
					if(offset > m.stride) throw new js__$Boot_HaxeError("Buffer is missing '" + s + "' data, set it to RAW format ?");
				}
			}
		}
	}
	,draw: function(ibuf,startIndex,ntriangles) {
		this.gl.bindBuffer(34963,ibuf);
		this.gl.drawElements(4,ntriangles * 3,5123,startIndex * 2);
		this.gl.bindBuffer(34963,null);
	}
	,present: function() {
		this.gl.finish();
	}
	,isDisposed: function() {
		return this.gl.isContextLost();
	}
	,setRenderTarget: function(tex) {
		this.curTarget = tex;
		if(tex == null) {
			this.gl.bindFramebuffer(36160,null);
			this.gl.viewport(0,0,this.bufferWidth,this.bufferHeight);
			return;
		}
		if(tex.t == null) tex.alloc();
		tex.lastFrame = this.frame;
		this.gl.bindFramebuffer(36160,tex.t.fb);
		this.gl.viewport(0,0,tex.width,tex.height);
	}
	,init: function(onCreate,forceSoftware) {
		if(forceSoftware == null) forceSoftware = false;
		var ready = false;
		window.addEventListener("load",function(_) {
			if(!ready) {
				ready = true;
				onCreate(false);
			}
		});
	}
	,hasFeature: function(f) {
		switch(f[1]) {
		case 0:
			return this.gl.getExtension("OES_standard_derivatives") != null;
		case 1:
			return this.gl.getExtension("OES_texture_float") != null && this.gl.getExtension("OES_texture_float_linear") != null;
		case 6:
			return this.gl.getExtension("WEBGL_draw_buffers") != null;
		case 2:
			return true;
		case 3:
			return false;
		case 4:
			return true;
		case 5:
			return false;
		}
	}
	,__class__: h3d_impl_GlDriver
});
var h3d_impl__$ManagedBuffer_FreeCell = function(pos,count,next) {
	this.pos = pos;
	this.count = count;
	this.next = next;
};
$hxClasses["h3d.impl._ManagedBuffer.FreeCell"] = h3d_impl__$ManagedBuffer_FreeCell;
h3d_impl__$ManagedBuffer_FreeCell.__name__ = ["h3d","impl","_ManagedBuffer","FreeCell"];
h3d_impl__$ManagedBuffer_FreeCell.prototype = {
	__class__: h3d_impl__$ManagedBuffer_FreeCell
};
var h3d_impl_ManagedBuffer = function(stride,size,flags) {
	this.flags = 0;
	if(flags != null) {
		var _g = 0;
		while(_g < flags.length) {
			var f = flags[_g];
			++_g;
			this.flags |= 1 << f[1];
		}
	}
	this.size = size;
	this.stride = stride;
	this.freeList = new h3d_impl__$ManagedBuffer_FreeCell(0,size,null);
	this.mem = h3d_Engine.CURRENT.mem;
	this.mem.allocManaged(this);
};
$hxClasses["h3d.impl.ManagedBuffer"] = h3d_impl_ManagedBuffer;
h3d_impl_ManagedBuffer.__name__ = ["h3d","impl","ManagedBuffer"];
h3d_impl_ManagedBuffer.prototype = {
	uploadVertexBuffer: function(start,vertices,buf,bufPos) {
		if(bufPos == null) bufPos = 0;
		this.mem.driver.uploadVertexBuffer(this.vbuf,start,vertices,buf,bufPos);
	}
	,allocPosition: function(nvert,align) {
		var free = this.freeList;
		while(free != null) {
			if(free.count >= nvert) {
				var d = (align - free.pos % align) % align;
				if(d == 0) break;
				if(free.count >= nvert + d) {
					free.next = new h3d_impl__$ManagedBuffer_FreeCell(free.pos + d,free.count - d,free.next);
					free.count = d;
					free = free.next;
					break;
				}
			}
			free = free.next;
		}
		if(free == null) return -1;
		var pos = free.pos;
		free.pos += nvert;
		free.count -= nvert;
		return pos;
	}
	,allocBuffer: function(b) {
		var align;
		if((b.flags & 1 << h3d_BufferFlag.Quads[1]) != 0) align = 4; else if((b.flags & 1 << h3d_BufferFlag.Triangles[1]) != 0) align = 3; else align = 1;
		var p = this.allocPosition(b.vertices,align);
		if(p < 0) return false;
		b.position = p;
		b.buffer = this;
		return true;
	}
	,freeBuffer: function(b) {
		var prev = null;
		var f = this.freeList;
		var nvert = b.vertices;
		var end = b.position + nvert;
		while(f != null) {
			if(f.pos == end) {
				f.pos -= nvert;
				f.count += nvert;
				if(prev != null && prev.pos + prev.count == f.pos) {
					prev.count += f.count;
					prev.next = f.next;
				}
				nvert = 0;
				break;
			}
			if(f.pos > end) {
				if(prev != null && prev.pos + prev.count == b.position) prev.count += nvert; else {
					var n = new h3d_impl__$ManagedBuffer_FreeCell(b.position,nvert,f);
					if(prev == null) this.freeList = n; else prev.next = n;
				}
				nvert = 0;
				break;
			}
			prev = f;
			f = f.next;
		}
		if(nvert != 0) throw new js__$Boot_HaxeError("assert");
		if(this.freeList.count == this.size && !((this.flags & 1 << h3d_BufferFlag.Managed[1]) != 0)) this.dispose();
	}
	,dispose: function() {
		this.mem.freeManaged(this);
	}
	,__class__: h3d_impl_ManagedBuffer
};
var h3d_impl_MemoryManager = function(driver) {
	this.bufferCount = 0;
	this.texMemory = 0;
	this.usedMemory = 0;
	this.driver = driver;
};
$hxClasses["h3d.impl.MemoryManager"] = h3d_impl_MemoryManager;
h3d_impl_MemoryManager.__name__ = ["h3d","impl","MemoryManager"];
h3d_impl_MemoryManager.prototype = {
	init: function() {
		this.indexes = [];
		this.textures = [];
		this.buffers = [];
		this.initIndexes();
	}
	,initIndexes: function() {
		var indices;
		var this1;
		this1 = new Array(0);
		indices = this1;
		var _g = 0;
		while(_g < 65533) {
			var i = _g++;
			indices.push(i);
		}
		this.triIndexes = h3d_Indexes.alloc(indices);
		var indices1;
		var this2;
		this2 = new Array(0);
		indices1 = this2;
		var p = 0;
		var _g1 = 0;
		var _g2 = 16383;
		while(_g1 < _g2) {
			var i1 = _g1++;
			var k = i1 << 2;
			indices1.push(k);
			indices1.push(k + 1);
			indices1.push(k + 2);
			indices1.push(k + 2);
			indices1.push(k + 1);
			indices1.push(k + 3);
		}
		indices1.push(65533);
		this.quadIndexes = h3d_Indexes.alloc(indices1);
	}
	,garbage: function() {
	}
	,cleanManagedBuffers: function() {
		var _g1 = 1;
		var _g = this.buffers.length;
		while(_g1 < _g) {
			var i = _g1++;
			var b = this.buffers[i];
			var prev = null;
			while(b != null) {
				if(b.freeList.count == b.size) {
					b.dispose();
					if(prev == null) this.buffers[i] = b.next; else prev.next = b.next;
				} else prev = b;
				b = b.next;
			}
		}
	}
	,allocManaged: function(m) {
		if(m.vbuf != null) return;
		var mem = m.size * m.stride * 4;
		while(this.usedMemory + mem > 262144000 || this.bufferCount >= 4096 || (m.vbuf = this.driver.allocVertexes(m)) == null) {
			var size = this.usedMemory - this.freeMemorySize();
			this.garbage();
			this.cleanManagedBuffers();
			if(this.usedMemory - this.freeMemorySize() == size) {
				if(this.bufferCount >= 4096) throw new js__$Boot_HaxeError("Too many buffer");
				throw new js__$Boot_HaxeError("Memory full (" + (size >> 10) + " KB," + this.bufferCount + " buffers)");
			}
		}
		this.usedMemory += mem;
		this.bufferCount++;
	}
	,freeManaged: function(m) {
		if(m.vbuf == null) return;
		this.driver.disposeVertexes(m.vbuf);
		m.vbuf = null;
		this.usedMemory -= m.size * m.stride * 4;
		this.bufferCount--;
	}
	,allocBuffer: function(b,stride) {
		var max;
		if((b.flags & 1 << h3d_BufferFlag.Quads[1]) != 0) max = 65532; else if((b.flags & 1 << h3d_BufferFlag.Triangles[1]) != 0) max = 65533; else max = 65534;
		if(b.vertices > max) {
			if(max == 65534) throw new js__$Boot_HaxeError("Cannot split buffer with " + b.vertices + " vertices if it's not Quads/Triangles");
			var rem = b.vertices - max;
			b.vertices = max;
			this.allocBuffer(b,stride);
			var n = b;
			while(n.next != null) n = n.next;
			var flags = [];
			var _g = 0;
			var _g1 = h3d_impl_MemoryManager.ALL_FLAGS;
			while(_g < _g1.length) {
				var f = _g1[_g];
				++_g;
				if((b.flags & 1 << f[1]) != 0) flags.push(f);
			}
			n.next = new h3d_Buffer(rem,stride,flags);
			return;
		}
		if(!((b.flags & 1 << h3d_BufferFlag.Managed[1]) != 0)) {
			var m1 = new h3d_impl_ManagedBuffer(stride,b.vertices);
			if(!m1.allocBuffer(b)) throw new js__$Boot_HaxeError("assert");
			return;
		}
		var m = this.buffers[stride];
		var prev = null;
		while(m != null) {
			if(m.allocBuffer(b)) return;
			prev = m;
			m = m.next;
		}
		var align;
		if((b.flags & 1 << h3d_BufferFlag.Triangles[1]) != 0) align = 3; else if((b.flags & 1 << h3d_BufferFlag.Quads[1]) != 0) align = 4; else align = 0;
		if(m == null && align > 0) {
			var total = b.vertices;
			var size = total;
			while(size > 2048) {
				m = this.buffers[stride];
				size >>= 1;
				size -= size % align;
				b.vertices = size;
				while(m != null) {
					if(m.allocBuffer(b)) {
						var flags1 = [];
						var _g2 = 0;
						var _g11 = h3d_impl_MemoryManager.ALL_FLAGS;
						while(_g2 < _g11.length) {
							var f1 = _g11[_g2];
							++_g2;
							if((b.flags & 1 << f1[1]) != 0) flags1.push(f1);
						}
						b.next = new h3d_Buffer(total - size,stride,flags1);
						return;
					}
					m = m.next;
				}
			}
			b.vertices = total;
		}
		m = new h3d_impl_ManagedBuffer(stride,65533,[h3d_BufferFlag.Managed]);
		if(prev == null) this.buffers[stride] = m; else prev.next = m;
		if(!m.allocBuffer(b)) throw new js__$Boot_HaxeError("assert");
	}
	,deleteIndexes: function(i) {
		HxOverrides.remove(this.indexes,i);
		this.driver.disposeIndexes(i.ibuf);
		i.ibuf = null;
		this.usedMemory -= i.count * 2;
	}
	,allocIndexes: function(i) {
		i.ibuf = this.driver.allocIndexes(i.count);
		this.indexes.push(i);
		this.usedMemory += i.count * 2;
	}
	,bpp: function(t) {
		return 4;
	}
	,cleanTextures: function(force) {
		if(force == null) force = true;
		this.textures.sort($bind(this,this.sortByLRU));
		var _g = 0;
		var _g1 = this.textures;
		while(_g < _g1.length) {
			var t = _g1[_g];
			++_g;
			if(t.realloc == null) continue;
			if(force || t.lastFrame < h3d_Engine.CURRENT.frameCount - 3600) {
				t.dispose();
				return true;
			}
		}
		return false;
	}
	,sortByLRU: function(t1,t2) {
		return t1.lastFrame - t2.lastFrame;
	}
	,deleteTexture: function(t) {
		HxOverrides.remove(this.textures,t);
		this.driver.disposeTexture(t);
		this.texMemory -= t.width * t.height * this.bpp(t);
	}
	,allocTexture: function(t) {
		var free = this.cleanTextures(false);
		t.t = this.driver.allocTexture(t);
		if(t.t == null) {
			if(!this.cleanTextures(true)) throw new js__$Boot_HaxeError("Maximum texture memory reached");
			this.allocTexture(t);
			return;
		}
		this.textures.push(t);
		this.texMemory += t.width * t.height * this.bpp(t);
	}
	,onContextLost: function() {
		this.dispose();
		this.initIndexes();
	}
	,dispose: function() {
		this.triIndexes.dispose();
		this.quadIndexes.dispose();
		this.triIndexes = null;
		this.quadIndexes = null;
		var _g = 0;
		var _g1 = this.textures.slice();
		while(_g < _g1.length) {
			var t = _g1[_g];
			++_g;
			t.dispose();
		}
		var _g2 = 0;
		var _g11 = this.buffers.slice();
		while(_g2 < _g11.length) {
			var b = _g11[_g2];
			++_g2;
			var b1 = b;
			while(b1 != null) {
				b1.dispose();
				b1 = b1.next;
			}
		}
		var _g3 = 0;
		var _g12 = this.indexes.slice();
		while(_g3 < _g12.length) {
			var i = _g12[_g3];
			++_g3;
			i.dispose();
		}
		this.buffers = [];
		this.indexes = [];
		this.textures = [];
		this.bufferCount = 0;
		this.usedMemory = 0;
		this.texMemory = 0;
	}
	,freeMemorySize: function() {
		var size = 0;
		var _g = 0;
		var _g1 = this.buffers;
		while(_g < _g1.length) {
			var b = _g1[_g];
			++_g;
			var b1 = b;
			while(b1 != null) {
				var free = b1.freeList;
				while(free != null) {
					size += free.count * b1.stride * 4;
					free = free.next;
				}
				b1 = b1.next;
			}
		}
		return size;
	}
	,__class__: h3d_impl_MemoryManager
};
var h3d_impl_TextureCache = function() {
	this.position = 0;
	this.cache = [];
	var engine = h3d_Engine.CURRENT;
	this.hasDefaultDepth = engine.driver.hasFeature(h3d_impl_Feature.TargetUseDefaultDepthBuffer);
	this.fullClearRequired = engine.driver.hasFeature(h3d_impl_Feature.FullClearRequired);
};
$hxClasses["h3d.impl.TextureCache"] = h3d_impl_TextureCache;
h3d_impl_TextureCache.__name__ = ["h3d","impl","TextureCache"];
h3d_impl_TextureCache.prototype = {
	begin: function(ctx) {
		if(this.frame != ctx.frame) {
			while(this.cache.length > this.position) {
				var t = this.cache.pop();
				if(t != null) t.dispose();
			}
			this.frame = ctx.frame;
			this.position = 0;
		}
	}
	,allocTarget: function(name,ctx,width,height,hasDepth) {
		if(hasDepth == null) hasDepth = true;
		this.begin(ctx);
		var t = this.cache[this.position];
		if(t == null || t.t == null && t.realloc == null || t.width != width || t.height != height || (t.flags & 1 << (this.hasDefaultDepth?h3d_mat_TextureFlags.TargetUseDefaultDepth:h3d_mat_TextureFlags.TargetDepth)[1]) != 0 != hasDepth) {
			if(t != null) t.dispose();
			var flags = [h3d_mat_TextureFlags.Target];
			if(hasDepth) flags.push(this.hasDefaultDepth?h3d_mat_TextureFlags.TargetUseDefaultDepth:h3d_mat_TextureFlags.TargetDepth);
			t = new h3d_mat_Texture(width,height,flags);
			this.cache[this.position] = t;
		}
		t.setName(name);
		this.position++;
		return t;
	}
	,__class__: h3d_impl_TextureCache
};
var h3d_mat_Face = $hxClasses["h3d.mat.Face"] = { __ename__ : true, __constructs__ : ["None","Back","Front","Both"] };
h3d_mat_Face.None = ["None",0];
h3d_mat_Face.None.toString = $estr;
h3d_mat_Face.None.__enum__ = h3d_mat_Face;
h3d_mat_Face.Back = ["Back",1];
h3d_mat_Face.Back.toString = $estr;
h3d_mat_Face.Back.__enum__ = h3d_mat_Face;
h3d_mat_Face.Front = ["Front",2];
h3d_mat_Face.Front.toString = $estr;
h3d_mat_Face.Front.__enum__ = h3d_mat_Face;
h3d_mat_Face.Both = ["Both",3];
h3d_mat_Face.Both.toString = $estr;
h3d_mat_Face.Both.__enum__ = h3d_mat_Face;
h3d_mat_Face.__empty_constructs__ = [h3d_mat_Face.None,h3d_mat_Face.Back,h3d_mat_Face.Front,h3d_mat_Face.Both];
var h3d_mat_Blend = $hxClasses["h3d.mat.Blend"] = { __ename__ : true, __constructs__ : ["One","Zero","SrcAlpha","SrcColor","DstAlpha","DstColor","OneMinusSrcAlpha","OneMinusSrcColor","OneMinusDstAlpha","OneMinusDstColor","ConstantColor","ConstantAlpha","OneMinusConstantColor","OneMinusConstantAlpha","SrcAlphaSaturate"] };
h3d_mat_Blend.One = ["One",0];
h3d_mat_Blend.One.toString = $estr;
h3d_mat_Blend.One.__enum__ = h3d_mat_Blend;
h3d_mat_Blend.Zero = ["Zero",1];
h3d_mat_Blend.Zero.toString = $estr;
h3d_mat_Blend.Zero.__enum__ = h3d_mat_Blend;
h3d_mat_Blend.SrcAlpha = ["SrcAlpha",2];
h3d_mat_Blend.SrcAlpha.toString = $estr;
h3d_mat_Blend.SrcAlpha.__enum__ = h3d_mat_Blend;
h3d_mat_Blend.SrcColor = ["SrcColor",3];
h3d_mat_Blend.SrcColor.toString = $estr;
h3d_mat_Blend.SrcColor.__enum__ = h3d_mat_Blend;
h3d_mat_Blend.DstAlpha = ["DstAlpha",4];
h3d_mat_Blend.DstAlpha.toString = $estr;
h3d_mat_Blend.DstAlpha.__enum__ = h3d_mat_Blend;
h3d_mat_Blend.DstColor = ["DstColor",5];
h3d_mat_Blend.DstColor.toString = $estr;
h3d_mat_Blend.DstColor.__enum__ = h3d_mat_Blend;
h3d_mat_Blend.OneMinusSrcAlpha = ["OneMinusSrcAlpha",6];
h3d_mat_Blend.OneMinusSrcAlpha.toString = $estr;
h3d_mat_Blend.OneMinusSrcAlpha.__enum__ = h3d_mat_Blend;
h3d_mat_Blend.OneMinusSrcColor = ["OneMinusSrcColor",7];
h3d_mat_Blend.OneMinusSrcColor.toString = $estr;
h3d_mat_Blend.OneMinusSrcColor.__enum__ = h3d_mat_Blend;
h3d_mat_Blend.OneMinusDstAlpha = ["OneMinusDstAlpha",8];
h3d_mat_Blend.OneMinusDstAlpha.toString = $estr;
h3d_mat_Blend.OneMinusDstAlpha.__enum__ = h3d_mat_Blend;
h3d_mat_Blend.OneMinusDstColor = ["OneMinusDstColor",9];
h3d_mat_Blend.OneMinusDstColor.toString = $estr;
h3d_mat_Blend.OneMinusDstColor.__enum__ = h3d_mat_Blend;
h3d_mat_Blend.ConstantColor = ["ConstantColor",10];
h3d_mat_Blend.ConstantColor.toString = $estr;
h3d_mat_Blend.ConstantColor.__enum__ = h3d_mat_Blend;
h3d_mat_Blend.ConstantAlpha = ["ConstantAlpha",11];
h3d_mat_Blend.ConstantAlpha.toString = $estr;
h3d_mat_Blend.ConstantAlpha.__enum__ = h3d_mat_Blend;
h3d_mat_Blend.OneMinusConstantColor = ["OneMinusConstantColor",12];
h3d_mat_Blend.OneMinusConstantColor.toString = $estr;
h3d_mat_Blend.OneMinusConstantColor.__enum__ = h3d_mat_Blend;
h3d_mat_Blend.OneMinusConstantAlpha = ["OneMinusConstantAlpha",13];
h3d_mat_Blend.OneMinusConstantAlpha.toString = $estr;
h3d_mat_Blend.OneMinusConstantAlpha.__enum__ = h3d_mat_Blend;
h3d_mat_Blend.SrcAlphaSaturate = ["SrcAlphaSaturate",14];
h3d_mat_Blend.SrcAlphaSaturate.toString = $estr;
h3d_mat_Blend.SrcAlphaSaturate.__enum__ = h3d_mat_Blend;
h3d_mat_Blend.__empty_constructs__ = [h3d_mat_Blend.One,h3d_mat_Blend.Zero,h3d_mat_Blend.SrcAlpha,h3d_mat_Blend.SrcColor,h3d_mat_Blend.DstAlpha,h3d_mat_Blend.DstColor,h3d_mat_Blend.OneMinusSrcAlpha,h3d_mat_Blend.OneMinusSrcColor,h3d_mat_Blend.OneMinusDstAlpha,h3d_mat_Blend.OneMinusDstColor,h3d_mat_Blend.ConstantColor,h3d_mat_Blend.ConstantAlpha,h3d_mat_Blend.OneMinusConstantColor,h3d_mat_Blend.OneMinusConstantAlpha,h3d_mat_Blend.SrcAlphaSaturate];
var h3d_mat_Compare = $hxClasses["h3d.mat.Compare"] = { __ename__ : true, __constructs__ : ["Always","Never","Equal","NotEqual","Greater","GreaterEqual","Less","LessEqual"] };
h3d_mat_Compare.Always = ["Always",0];
h3d_mat_Compare.Always.toString = $estr;
h3d_mat_Compare.Always.__enum__ = h3d_mat_Compare;
h3d_mat_Compare.Never = ["Never",1];
h3d_mat_Compare.Never.toString = $estr;
h3d_mat_Compare.Never.__enum__ = h3d_mat_Compare;
h3d_mat_Compare.Equal = ["Equal",2];
h3d_mat_Compare.Equal.toString = $estr;
h3d_mat_Compare.Equal.__enum__ = h3d_mat_Compare;
h3d_mat_Compare.NotEqual = ["NotEqual",3];
h3d_mat_Compare.NotEqual.toString = $estr;
h3d_mat_Compare.NotEqual.__enum__ = h3d_mat_Compare;
h3d_mat_Compare.Greater = ["Greater",4];
h3d_mat_Compare.Greater.toString = $estr;
h3d_mat_Compare.Greater.__enum__ = h3d_mat_Compare;
h3d_mat_Compare.GreaterEqual = ["GreaterEqual",5];
h3d_mat_Compare.GreaterEqual.toString = $estr;
h3d_mat_Compare.GreaterEqual.__enum__ = h3d_mat_Compare;
h3d_mat_Compare.Less = ["Less",6];
h3d_mat_Compare.Less.toString = $estr;
h3d_mat_Compare.Less.__enum__ = h3d_mat_Compare;
h3d_mat_Compare.LessEqual = ["LessEqual",7];
h3d_mat_Compare.LessEqual.toString = $estr;
h3d_mat_Compare.LessEqual.__enum__ = h3d_mat_Compare;
h3d_mat_Compare.__empty_constructs__ = [h3d_mat_Compare.Always,h3d_mat_Compare.Never,h3d_mat_Compare.Equal,h3d_mat_Compare.NotEqual,h3d_mat_Compare.Greater,h3d_mat_Compare.GreaterEqual,h3d_mat_Compare.Less,h3d_mat_Compare.LessEqual];
var h3d_mat_MipMap = $hxClasses["h3d.mat.MipMap"] = { __ename__ : true, __constructs__ : ["None","Nearest","Linear"] };
h3d_mat_MipMap.None = ["None",0];
h3d_mat_MipMap.None.toString = $estr;
h3d_mat_MipMap.None.__enum__ = h3d_mat_MipMap;
h3d_mat_MipMap.Nearest = ["Nearest",1];
h3d_mat_MipMap.Nearest.toString = $estr;
h3d_mat_MipMap.Nearest.__enum__ = h3d_mat_MipMap;
h3d_mat_MipMap.Linear = ["Linear",2];
h3d_mat_MipMap.Linear.toString = $estr;
h3d_mat_MipMap.Linear.__enum__ = h3d_mat_MipMap;
h3d_mat_MipMap.__empty_constructs__ = [h3d_mat_MipMap.None,h3d_mat_MipMap.Nearest,h3d_mat_MipMap.Linear];
var h3d_mat_Filter = $hxClasses["h3d.mat.Filter"] = { __ename__ : true, __constructs__ : ["Nearest","Linear"] };
h3d_mat_Filter.Nearest = ["Nearest",0];
h3d_mat_Filter.Nearest.toString = $estr;
h3d_mat_Filter.Nearest.__enum__ = h3d_mat_Filter;
h3d_mat_Filter.Linear = ["Linear",1];
h3d_mat_Filter.Linear.toString = $estr;
h3d_mat_Filter.Linear.__enum__ = h3d_mat_Filter;
h3d_mat_Filter.__empty_constructs__ = [h3d_mat_Filter.Nearest,h3d_mat_Filter.Linear];
var h3d_mat_Wrap = $hxClasses["h3d.mat.Wrap"] = { __ename__ : true, __constructs__ : ["Clamp","Repeat"] };
h3d_mat_Wrap.Clamp = ["Clamp",0];
h3d_mat_Wrap.Clamp.toString = $estr;
h3d_mat_Wrap.Clamp.__enum__ = h3d_mat_Wrap;
h3d_mat_Wrap.Repeat = ["Repeat",1];
h3d_mat_Wrap.Repeat.toString = $estr;
h3d_mat_Wrap.Repeat.__enum__ = h3d_mat_Wrap;
h3d_mat_Wrap.__empty_constructs__ = [h3d_mat_Wrap.Clamp,h3d_mat_Wrap.Repeat];
var h3d_mat_Operation = $hxClasses["h3d.mat.Operation"] = { __ename__ : true, __constructs__ : ["Add","Sub","ReverseSub"] };
h3d_mat_Operation.Add = ["Add",0];
h3d_mat_Operation.Add.toString = $estr;
h3d_mat_Operation.Add.__enum__ = h3d_mat_Operation;
h3d_mat_Operation.Sub = ["Sub",1];
h3d_mat_Operation.Sub.toString = $estr;
h3d_mat_Operation.Sub.__enum__ = h3d_mat_Operation;
h3d_mat_Operation.ReverseSub = ["ReverseSub",2];
h3d_mat_Operation.ReverseSub.toString = $estr;
h3d_mat_Operation.ReverseSub.__enum__ = h3d_mat_Operation;
h3d_mat_Operation.__empty_constructs__ = [h3d_mat_Operation.Add,h3d_mat_Operation.Sub,h3d_mat_Operation.ReverseSub];
var h3d_mat_TextureFlags = $hxClasses["h3d.mat.TextureFlags"] = { __ename__ : true, __constructs__ : ["Target","TargetDepth","TargetUseDefaultDepth","Cubic","MipMapped","IsNPOT","NoAlloc","Dynamic","AlphaPremultiplied","WasCleared","Loading"] };
h3d_mat_TextureFlags.Target = ["Target",0];
h3d_mat_TextureFlags.Target.toString = $estr;
h3d_mat_TextureFlags.Target.__enum__ = h3d_mat_TextureFlags;
h3d_mat_TextureFlags.TargetDepth = ["TargetDepth",1];
h3d_mat_TextureFlags.TargetDepth.toString = $estr;
h3d_mat_TextureFlags.TargetDepth.__enum__ = h3d_mat_TextureFlags;
h3d_mat_TextureFlags.TargetUseDefaultDepth = ["TargetUseDefaultDepth",2];
h3d_mat_TextureFlags.TargetUseDefaultDepth.toString = $estr;
h3d_mat_TextureFlags.TargetUseDefaultDepth.__enum__ = h3d_mat_TextureFlags;
h3d_mat_TextureFlags.Cubic = ["Cubic",3];
h3d_mat_TextureFlags.Cubic.toString = $estr;
h3d_mat_TextureFlags.Cubic.__enum__ = h3d_mat_TextureFlags;
h3d_mat_TextureFlags.MipMapped = ["MipMapped",4];
h3d_mat_TextureFlags.MipMapped.toString = $estr;
h3d_mat_TextureFlags.MipMapped.__enum__ = h3d_mat_TextureFlags;
h3d_mat_TextureFlags.IsNPOT = ["IsNPOT",5];
h3d_mat_TextureFlags.IsNPOT.toString = $estr;
h3d_mat_TextureFlags.IsNPOT.__enum__ = h3d_mat_TextureFlags;
h3d_mat_TextureFlags.NoAlloc = ["NoAlloc",6];
h3d_mat_TextureFlags.NoAlloc.toString = $estr;
h3d_mat_TextureFlags.NoAlloc.__enum__ = h3d_mat_TextureFlags;
h3d_mat_TextureFlags.Dynamic = ["Dynamic",7];
h3d_mat_TextureFlags.Dynamic.toString = $estr;
h3d_mat_TextureFlags.Dynamic.__enum__ = h3d_mat_TextureFlags;
h3d_mat_TextureFlags.AlphaPremultiplied = ["AlphaPremultiplied",8];
h3d_mat_TextureFlags.AlphaPremultiplied.toString = $estr;
h3d_mat_TextureFlags.AlphaPremultiplied.__enum__ = h3d_mat_TextureFlags;
h3d_mat_TextureFlags.WasCleared = ["WasCleared",9];
h3d_mat_TextureFlags.WasCleared.toString = $estr;
h3d_mat_TextureFlags.WasCleared.__enum__ = h3d_mat_TextureFlags;
h3d_mat_TextureFlags.Loading = ["Loading",10];
h3d_mat_TextureFlags.Loading.toString = $estr;
h3d_mat_TextureFlags.Loading.__enum__ = h3d_mat_TextureFlags;
h3d_mat_TextureFlags.__empty_constructs__ = [h3d_mat_TextureFlags.Target,h3d_mat_TextureFlags.TargetDepth,h3d_mat_TextureFlags.TargetUseDefaultDepth,h3d_mat_TextureFlags.Cubic,h3d_mat_TextureFlags.MipMapped,h3d_mat_TextureFlags.IsNPOT,h3d_mat_TextureFlags.NoAlloc,h3d_mat_TextureFlags.Dynamic,h3d_mat_TextureFlags.AlphaPremultiplied,h3d_mat_TextureFlags.WasCleared,h3d_mat_TextureFlags.Loading];
var h3d_mat_Defaults = function() { };
$hxClasses["h3d.mat.Defaults"] = h3d_mat_Defaults;
h3d_mat_Defaults.__name__ = ["h3d","mat","Defaults"];
var h3d_mat_Material = function(shader) {
	if(shader != null) this.addPass(new h3d_mat_Pass("default",null)).addShader(shader);
};
$hxClasses["h3d.mat.Material"] = h3d_mat_Material;
h3d_mat_Material.__name__ = ["h3d","mat","Material"];
h3d_mat_Material.prototype = {
	addPass: function(p) {
		var prev = null;
		var cur = this.passes;
		while(cur != null) {
			prev = cur;
			cur = cur.nextPass;
		}
		if(prev == null) this.passes = p; else prev.nextPass = p;
		p.nextPass = null;
		return p;
	}
	,__class__: h3d_mat_Material
};
var h3d_mat_MeshMaterial = function(texture) {
	this.mshader = new h3d_shader_BaseMesh();
	this.set_blendMode(h2d_BlendMode.None);
	h3d_mat_Material.call(this,this.mshader);
	this.set_texture(texture);
};
$hxClasses["h3d.mat.MeshMaterial"] = h3d_mat_MeshMaterial;
h3d_mat_MeshMaterial.__name__ = ["h3d","mat","MeshMaterial"];
h3d_mat_MeshMaterial.__super__ = h3d_mat_Material;
h3d_mat_MeshMaterial.prototype = $extend(h3d_mat_Material.prototype,{
	set_blendMode: function(v) {
		if(this.passes != null) {
			this.passes.setBlendMode(v);
			switch(v[1]) {
			case 0:
				this.passes.set_depthWrite(true);
				this.passes.setPassName("default");
				break;
			case 1:
				this.passes.set_depthWrite(true);
				this.passes.setPassName("alpha");
				break;
			case 2:
				this.passes.set_depthWrite(false);
				this.passes.setPassName("additive");
				break;
			case 3:
				this.passes.set_depthWrite(false);
				this.passes.setPassName("additive");
				break;
			case 4:
				this.passes.set_depthWrite(false);
				this.passes.setPassName("additive");
				break;
			case 5:
				this.passes.set_depthWrite(false);
				this.passes.setPassName("additive");
				break;
			case 6:
				this.passes.set_depthWrite(false);
				this.passes.setPassName("additive");
				break;
			}
		}
		return this.blendMode = v;
	}
	,set_texture: function(t) {
		if(t == null) {
			if(this.textureShader != null) {
				this.passes.removeShader(this.textureShader);
				this.textureShader = null;
			}
		} else {
			if(this.textureShader == null) {
				this.textureShader = new h3d_shader_Texture();
				this.passes.addShader(this.textureShader);
			}
			this.textureShader.texture__ = t;
		}
		return t;
	}
	,__class__: h3d_mat_MeshMaterial
});
var h3d_mat_Pass = function(name,shaders,parent) {
	this.bits = 0;
	this.parentPass = parent;
	this.shaders = shaders;
	this.setPassName(name);
	this.set_culling(h3d_mat_Face.Back);
	this.blend(h3d_mat_Blend.One,h3d_mat_Blend.Zero);
	this.depth(true,h3d_mat_Compare.Less);
	this.set_blendOp(this.set_blendAlphaOp(h3d_mat_Operation.Add));
	this.set_colorMask(15);
};
$hxClasses["h3d.mat.Pass"] = h3d_mat_Pass;
h3d_mat_Pass.__name__ = ["h3d","mat","Pass"];
h3d_mat_Pass.prototype = {
	setPassName: function(name) {
		this.name = name;
		this.passId = hxsl_Globals.allocID(name);
	}
	,blend: function(src,dst) {
		this.set_blendSrc(src);
		this.set_blendAlphaSrc(src);
		this.set_blendDst(dst);
		this.set_blendAlphaDst(dst);
	}
	,setBlendMode: function(b) {
		switch(b[1]) {
		case 0:
			this.blend(h3d_mat_Blend.One,h3d_mat_Blend.Zero);
			break;
		case 1:
			this.blend(h3d_mat_Blend.SrcAlpha,h3d_mat_Blend.OneMinusSrcAlpha);
			break;
		case 2:
			this.blend(h3d_mat_Blend.SrcAlpha,h3d_mat_Blend.One);
			break;
		case 3:
			this.blend(h3d_mat_Blend.OneMinusDstColor,h3d_mat_Blend.One);
			break;
		case 4:
			this.blend(h3d_mat_Blend.DstColor,h3d_mat_Blend.Zero);
			break;
		case 5:
			this.blend(h3d_mat_Blend.Zero,h3d_mat_Blend.OneMinusSrcColor);
			break;
		case 6:
			this.blend(h3d_mat_Blend.One,h3d_mat_Blend.OneMinusSrcColor);
			break;
		}
	}
	,depth: function(write,test) {
		this.set_depthWrite(write);
		this.set_depthTest(test);
	}
	,addShader: function(s) {
		this.shaders = new hxsl_ShaderList(s,this.shaders);
		return s;
	}
	,removeShader: function(s) {
		var sl = this.shaders;
		var prev = null;
		while(sl != null) {
			if(sl.s == s) {
				if(prev == null) this.shaders = sl.next; else prev.next = sl.next;
				return true;
			}
			prev = sl;
			sl = sl.next;
		}
		return false;
	}
	,getShadersRec: function() {
		if(this.parentPass == null || this.parentShaders == this.parentPass.shaders) return this.shaders;
		var s = this.shaders;
		var prev = null;
		while(s != null && s != this.parentShaders) {
			prev = s;
			s = s.next;
		}
		this.parentShaders = this.parentPass.shaders;
		if(prev == null) this.shaders = this.parentShaders; else prev.next = this.parentShaders;
		return this.shaders;
	}
	,set_culling: function(v) {
		this.bits = this.bits & -4 | v[1];
		return this.culling = v;
	}
	,set_depthWrite: function(v) {
		this.bits = this.bits & -5 | (v?1:0) << 2;
		return this.depthWrite = v;
	}
	,set_depthTest: function(v) {
		this.bits = this.bits & -57 | v[1] << 3;
		return this.depthTest = v;
	}
	,set_blendSrc: function(v) {
		this.bits = this.bits & -961 | v[1] << 6;
		return this.blendSrc = v;
	}
	,set_blendDst: function(v) {
		this.bits = this.bits & -15361 | v[1] << 10;
		return this.blendDst = v;
	}
	,set_blendAlphaSrc: function(v) {
		this.bits = this.bits & -245761 | v[1] << 14;
		return this.blendAlphaSrc = v;
	}
	,set_blendAlphaDst: function(v) {
		this.bits = this.bits & -3932161 | v[1] << 18;
		return this.blendAlphaDst = v;
	}
	,set_blendOp: function(v) {
		this.bits = this.bits & -12582913 | v[1] << 22;
		return this.blendOp = v;
	}
	,set_blendAlphaOp: function(v) {
		this.bits = this.bits & -50331649 | v[1] << 24;
		return this.blendAlphaOp = v;
	}
	,set_colorMask: function(v) {
		this.bits = this.bits & -1006632961 | (v & 15) << 26;
		return this.colorMask = v;
	}
	,__class__: h3d_mat_Pass
};
var hxd_PixelFormat = $hxClasses["hxd.PixelFormat"] = { __ename__ : true, __constructs__ : ["ARGB","BGRA","RGBA","RGBA16F","RGBA32F","ALPHA"] };
hxd_PixelFormat.ARGB = ["ARGB",0];
hxd_PixelFormat.ARGB.toString = $estr;
hxd_PixelFormat.ARGB.__enum__ = hxd_PixelFormat;
hxd_PixelFormat.BGRA = ["BGRA",1];
hxd_PixelFormat.BGRA.toString = $estr;
hxd_PixelFormat.BGRA.__enum__ = hxd_PixelFormat;
hxd_PixelFormat.RGBA = ["RGBA",2];
hxd_PixelFormat.RGBA.toString = $estr;
hxd_PixelFormat.RGBA.__enum__ = hxd_PixelFormat;
hxd_PixelFormat.RGBA16F = ["RGBA16F",3];
hxd_PixelFormat.RGBA16F.toString = $estr;
hxd_PixelFormat.RGBA16F.__enum__ = hxd_PixelFormat;
hxd_PixelFormat.RGBA32F = ["RGBA32F",4];
hxd_PixelFormat.RGBA32F.toString = $estr;
hxd_PixelFormat.RGBA32F.__enum__ = hxd_PixelFormat;
hxd_PixelFormat.ALPHA = ["ALPHA",5];
hxd_PixelFormat.ALPHA.toString = $estr;
hxd_PixelFormat.ALPHA.__enum__ = hxd_PixelFormat;
hxd_PixelFormat.__empty_constructs__ = [hxd_PixelFormat.ARGB,hxd_PixelFormat.BGRA,hxd_PixelFormat.RGBA,hxd_PixelFormat.RGBA16F,hxd_PixelFormat.RGBA32F,hxd_PixelFormat.ALPHA];
var h3d_mat_Texture = function(w,h,flags,format,allocPos) {
	var engine = h3d_Engine.CURRENT;
	this.mem = engine.mem;
	if(format == null) format = h3d_mat_Texture.nativeFormat;
	this.id = ++h3d_mat_Texture.UID;
	this.format = format;
	this.flags = 0;
	if(flags != null) {
		var _g = 0;
		while(_g < flags.length) {
			var f = flags[_g];
			++_g;
			this.flags |= 1 << f[1];
		}
	}
	var tw = 1;
	var th = 1;
	while(tw < w) tw <<= 1;
	while(th < h) th <<= 1;
	if(tw != w || th != h) this.flags |= 1 << h3d_mat_TextureFlags.IsNPOT[1];
	if((this.flags & 1 << h3d_mat_TextureFlags.Target[1]) != 0) this.realloc = function() {
	};
	this.width = w;
	this.height = h;
	this.set_mipMap((this.flags & 1 << h3d_mat_TextureFlags.MipMapped[1]) != 0?h3d_mat_MipMap.Nearest:h3d_mat_MipMap.None);
	this.set_filter(h3d_mat_Filter.Linear);
	this.set_wrap(h3d_mat_Wrap.Clamp);
	this.bits &= 32767;
	if(!((this.flags & 1 << h3d_mat_TextureFlags.NoAlloc[1]) != 0)) this.alloc();
};
$hxClasses["h3d.mat.Texture"] = h3d_mat_Texture;
h3d_mat_Texture.__name__ = ["h3d","mat","Texture"];
h3d_mat_Texture.fromColor = function(color,alpha,allocPos) {
	if(alpha == null) alpha = 1.;
	var aval = alpha * 255 | 0;
	if(aval < 0) aval = 0; else if(aval > 255) aval = 255;
	var key = color & 16777215 | aval << 24;
	var t = h3d_mat_Texture.COLOR_CACHE.h[key];
	if(t != null) return t;
	var t1 = new h3d_mat_Texture(1,1,null,null,allocPos);
	t1.clear(color,alpha);
	t1.realloc = function() {
		t1.clear(color,alpha);
	};
	h3d_mat_Texture.COLOR_CACHE.h[key] = t1;
	return t1;
};
h3d_mat_Texture.prototype = {
	alloc: function() {
		if(this.t == null) this.mem.allocTexture(this);
	}
	,setName: function(n) {
		this.name = n;
	}
	,set_mipMap: function(m) {
		this.bits |= 524288;
		this.bits = this.bits & -4 | m[1];
		return this.mipMap = m;
	}
	,set_filter: function(f) {
		this.bits |= 524288;
		this.bits = this.bits & -25 | f[1] << 3;
		return this.filter = f;
	}
	,set_wrap: function(w) {
		this.bits |= 524288;
		this.bits = this.bits & -193 | w[1] << 6;
		return this.wrap = w;
	}
	,clear: function(color,alpha) {
		if(alpha == null) alpha = 1.;
		this.alloc();
		var p = hxd_Pixels.alloc(this.width,this.height,hxd_PixelFormat.BGRA);
		var k = 0;
		var b = color & 255;
		var g = color >> 8 & 255;
		var r = color >> 16 & 255;
		var a = alpha * 255 | 0;
		if(a < 0) a = 0; else if(a > 255) a = 255;
		var _g1 = 0;
		var _g = this.width * this.height;
		while(_g1 < _g) {
			var i = _g1++;
			p.bytes.set(k++,b);
			p.bytes.set(k++,g);
			p.bytes.set(k++,r);
			p.bytes.set(k++,a);
		}
		this.uploadPixels(p);
		p.dispose();
	}
	,uploadPixels: function(pixels,mipLevel,side) {
		if(side == null) side = 0;
		if(mipLevel == null) mipLevel = 0;
		this.alloc();
		this.mem.driver.uploadTexturePixels(this,pixels,mipLevel,side);
		this.flags |= 1 << h3d_mat_TextureFlags.WasCleared[1];
	}
	,dispose: function() {
		if(this.t != null) this.mem.deleteTexture(this);
	}
	,__class__: h3d_mat_Texture
};
var hxd_res_Resource = function() { };
$hxClasses["hxd.res.Resource"] = hxd_res_Resource;
hxd_res_Resource.__name__ = ["hxd","res","Resource"];
hxd_res_Resource.prototype = {
	__class__: hxd_res_Resource
};
var hxd_fs_FileSystem = function() { };
$hxClasses["hxd.fs.FileSystem"] = hxd_fs_FileSystem;
hxd_fs_FileSystem.__name__ = ["hxd","fs","FileSystem"];
var hxd_res_Loader = function(fs) {
	this.fs = fs;
	this.cache = new haxe_ds_StringMap();
};
$hxClasses["hxd.res.Loader"] = hxd_res_Loader;
hxd_res_Loader.__name__ = ["hxd","res","Loader"];
hxd_res_Loader.prototype = {
	__class__: hxd_res_Loader
};
var haxe_Unserializer = function(buf) {
	this.buf = buf;
	this.length = buf.length;
	this.pos = 0;
	this.scache = [];
	this.cache = [];
	var r = haxe_Unserializer.DEFAULT_RESOLVER;
	if(r == null) {
		r = Type;
		haxe_Unserializer.DEFAULT_RESOLVER = r;
	}
	this.setResolver(r);
};
$hxClasses["haxe.Unserializer"] = haxe_Unserializer;
haxe_Unserializer.__name__ = ["haxe","Unserializer"];
haxe_Unserializer.initCodes = function() {
	var codes = [];
	var _g1 = 0;
	var _g = haxe_Unserializer.BASE64.length;
	while(_g1 < _g) {
		var i = _g1++;
		codes[haxe_Unserializer.BASE64.charCodeAt(i)] = i;
	}
	return codes;
};
haxe_Unserializer.run = function(v) {
	return new haxe_Unserializer(v).unserialize();
};
haxe_Unserializer.prototype = {
	setResolver: function(r) {
		if(r == null) this.resolver = { resolveClass : function(_) {
			return null;
		}, resolveEnum : function(_1) {
			return null;
		}}; else this.resolver = r;
	}
	,get: function(p) {
		return this.buf.charCodeAt(p);
	}
	,readDigits: function() {
		var k = 0;
		var s = false;
		var fpos = this.pos;
		while(true) {
			var c = this.buf.charCodeAt(this.pos);
			if(c != c) break;
			if(c == 45) {
				if(this.pos != fpos) break;
				s = true;
				this.pos++;
				continue;
			}
			if(c < 48 || c > 57) break;
			k = k * 10 + (c - 48);
			this.pos++;
		}
		if(s) k *= -1;
		return k;
	}
	,readFloat: function() {
		var p1 = this.pos;
		while(true) {
			var c = this.buf.charCodeAt(this.pos);
			if(c >= 43 && c < 58 || c == 101 || c == 69) this.pos++; else break;
		}
		return Std.parseFloat(HxOverrides.substr(this.buf,p1,this.pos - p1));
	}
	,unserializeObject: function(o) {
		while(true) {
			if(this.pos >= this.length) throw new js__$Boot_HaxeError("Invalid object");
			if(this.buf.charCodeAt(this.pos) == 103) break;
			var k = this.unserialize();
			if(!(typeof(k) == "string")) throw new js__$Boot_HaxeError("Invalid object key");
			var v = this.unserialize();
			o[k] = v;
		}
		this.pos++;
	}
	,unserializeEnum: function(edecl,tag) {
		if(this.get(this.pos++) != 58) throw new js__$Boot_HaxeError("Invalid enum format");
		var nargs = this.readDigits();
		if(nargs == 0) return Type.createEnum(edecl,tag);
		var args = [];
		while(nargs-- > 0) args.push(this.unserialize());
		return Type.createEnum(edecl,tag,args);
	}
	,unserialize: function() {
		var _g = this.get(this.pos++);
		switch(_g) {
		case 110:
			return null;
		case 116:
			return true;
		case 102:
			return false;
		case 122:
			return 0;
		case 105:
			return this.readDigits();
		case 100:
			return this.readFloat();
		case 121:
			var len = this.readDigits();
			if(this.get(this.pos++) != 58 || this.length - this.pos < len) throw new js__$Boot_HaxeError("Invalid string length");
			var s = HxOverrides.substr(this.buf,this.pos,len);
			this.pos += len;
			s = decodeURIComponent(s.split("+").join(" "));
			this.scache.push(s);
			return s;
		case 107:
			return NaN;
		case 109:
			return -Infinity;
		case 112:
			return Infinity;
		case 97:
			var buf = this.buf;
			var a = [];
			this.cache.push(a);
			while(true) {
				var c = this.buf.charCodeAt(this.pos);
				if(c == 104) {
					this.pos++;
					break;
				}
				if(c == 117) {
					this.pos++;
					var n = this.readDigits();
					a[a.length + n - 1] = null;
				} else a.push(this.unserialize());
			}
			return a;
		case 111:
			var o = { };
			this.cache.push(o);
			this.unserializeObject(o);
			return o;
		case 114:
			var n1 = this.readDigits();
			if(n1 < 0 || n1 >= this.cache.length) throw new js__$Boot_HaxeError("Invalid reference");
			return this.cache[n1];
		case 82:
			var n2 = this.readDigits();
			if(n2 < 0 || n2 >= this.scache.length) throw new js__$Boot_HaxeError("Invalid string reference");
			return this.scache[n2];
		case 120:
			throw new js__$Boot_HaxeError(this.unserialize());
			break;
		case 99:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) throw new js__$Boot_HaxeError("Class not found " + name);
			var o1 = Type.createEmptyInstance(cl);
			this.cache.push(o1);
			this.unserializeObject(o1);
			return o1;
		case 119:
			var name1 = this.unserialize();
			var edecl = this.resolver.resolveEnum(name1);
			if(edecl == null) throw new js__$Boot_HaxeError("Enum not found " + name1);
			var e = this.unserializeEnum(edecl,this.unserialize());
			this.cache.push(e);
			return e;
		case 106:
			var name2 = this.unserialize();
			var edecl1 = this.resolver.resolveEnum(name2);
			if(edecl1 == null) throw new js__$Boot_HaxeError("Enum not found " + name2);
			this.pos++;
			var index = this.readDigits();
			var tag = Type.getEnumConstructs(edecl1)[index];
			if(tag == null) throw new js__$Boot_HaxeError("Unknown enum index " + name2 + "@" + index);
			var e1 = this.unserializeEnum(edecl1,tag);
			this.cache.push(e1);
			return e1;
		case 108:
			var l = new List();
			this.cache.push(l);
			var buf1 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) l.add(this.unserialize());
			this.pos++;
			return l;
		case 98:
			var h = new haxe_ds_StringMap();
			this.cache.push(h);
			var buf2 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s1 = this.unserialize();
				h.set(s1,this.unserialize());
			}
			this.pos++;
			return h;
		case 113:
			var h1 = new haxe_ds_IntMap();
			this.cache.push(h1);
			var buf3 = this.buf;
			var c1 = this.get(this.pos++);
			while(c1 == 58) {
				var i = this.readDigits();
				h1.set(i,this.unserialize());
				c1 = this.get(this.pos++);
			}
			if(c1 != 104) throw new js__$Boot_HaxeError("Invalid IntMap format");
			return h1;
		case 77:
			var h2 = new haxe_ds_ObjectMap();
			this.cache.push(h2);
			var buf4 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s2 = this.unserialize();
				h2.set(s2,this.unserialize());
			}
			this.pos++;
			return h2;
		case 118:
			var d;
			if(this.buf.charCodeAt(this.pos) >= 48 && this.buf.charCodeAt(this.pos) <= 57 && this.buf.charCodeAt(this.pos + 1) >= 48 && this.buf.charCodeAt(this.pos + 1) <= 57 && this.buf.charCodeAt(this.pos + 2) >= 48 && this.buf.charCodeAt(this.pos + 2) <= 57 && this.buf.charCodeAt(this.pos + 3) >= 48 && this.buf.charCodeAt(this.pos + 3) <= 57 && this.buf.charCodeAt(this.pos + 4) == 45) {
				var s3 = HxOverrides.substr(this.buf,this.pos,19);
				d = HxOverrides.strDate(s3);
				this.pos += 19;
			} else {
				var t = this.readFloat();
				var d1 = new Date();
				d1.setTime(t);
				d = d1;
			}
			this.cache.push(d);
			return d;
		case 115:
			var len1 = this.readDigits();
			var buf5 = this.buf;
			if(this.get(this.pos++) != 58 || this.length - this.pos < len1) throw new js__$Boot_HaxeError("Invalid bytes length");
			var codes = haxe_Unserializer.CODES;
			if(codes == null) {
				codes = haxe_Unserializer.initCodes();
				haxe_Unserializer.CODES = codes;
			}
			var i1 = this.pos;
			var rest = len1 & 3;
			var size;
			size = (len1 >> 2) * 3 + (rest >= 2?rest - 1:0);
			var max = i1 + (len1 - rest);
			var bytes = haxe_io_Bytes.alloc(size);
			var bpos = 0;
			while(i1 < max) {
				var c11 = codes[StringTools.fastCodeAt(buf5,i1++)];
				var c2 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c11 << 2 | c2 >> 4);
				var c3 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c2 << 4 | c3 >> 2);
				var c4 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c3 << 6 | c4);
			}
			if(rest >= 2) {
				var c12 = codes[StringTools.fastCodeAt(buf5,i1++)];
				var c21 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c12 << 2 | c21 >> 4);
				if(rest == 3) {
					var c31 = codes[StringTools.fastCodeAt(buf5,i1++)];
					bytes.set(bpos++,c21 << 4 | c31 >> 2);
				}
			}
			this.pos += len1;
			this.cache.push(bytes);
			return bytes;
		case 67:
			var name3 = this.unserialize();
			var cl1 = this.resolver.resolveClass(name3);
			if(cl1 == null) throw new js__$Boot_HaxeError("Class not found " + name3);
			var o2 = Type.createEmptyInstance(cl1);
			this.cache.push(o2);
			o2.hxUnserialize(this);
			if(this.get(this.pos++) != 103) throw new js__$Boot_HaxeError("Invalid custom data");
			return o2;
		case 65:
			var name4 = this.unserialize();
			var cl2 = this.resolver.resolveClass(name4);
			if(cl2 == null) throw new js__$Boot_HaxeError("Class not found " + name4);
			return cl2;
		case 66:
			var name5 = this.unserialize();
			var e2 = this.resolver.resolveEnum(name5);
			if(e2 == null) throw new js__$Boot_HaxeError("Enum not found " + name5);
			return e2;
		default:
		}
		this.pos--;
		throw new js__$Boot_HaxeError("Invalid char " + this.buf.charAt(this.pos) + " at position " + this.pos);
	}
	,__class__: haxe_Unserializer
};
var h3d_pass_Base = function() {
	this.forceProcessing = false;
	this.priority = 0;
};
$hxClasses["h3d.pass.Base"] = h3d_pass_Base;
h3d_pass_Base.__name__ = ["h3d","pass","Base"];
h3d_pass_Base.prototype = {
	setContext: function(ctx) {
		this.ctx = ctx;
	}
	,draw: function(passes) {
		return passes;
	}
	,__class__: h3d_pass_Base
};
var h3d_pass_ScreenFx = function(shader) {
	this.shader = shader;
	this.shaders = new hxsl_ShaderList(shader);
	this.manager = new h3d_shader_Manager(["output.position","output.color"]);
	this.pass = new h3d_mat_Pass(Std.string(this),new hxsl_ShaderList(shader));
	this.pass.set_culling(h3d_mat_Face.None);
	this.pass.depth(false,h3d_mat_Compare.Always);
	this.plan = h3d_prim_Plan2D.get();
	this.engine = h3d_Engine.CURRENT;
	this.fullClearRequired = this.engine.hasFeature(h3d_impl_Feature.FullClearRequired);
};
$hxClasses["h3d.pass.ScreenFx"] = h3d_pass_ScreenFx;
h3d_pass_ScreenFx.__name__ = ["h3d","pass","ScreenFx"];
h3d_pass_ScreenFx.prototype = {
	render: function() {
		var rts = this.manager.compileShaders(this.shaders);
		this.engine.selectMaterial(this.pass);
		this.engine.selectShader(rts);
		if(this.buffers == null) this.buffers = new h3d_shader_Buffers(rts); else this.buffers.grow(rts);
		this.manager.fillGlobals(this.buffers,rts);
		this.manager.fillParams(this.buffers,rts,this.shaders);
		this.engine.uploadShaderBuffers(this.buffers,0);
		this.engine.uploadShaderBuffers(this.buffers,1);
		this.engine.uploadShaderBuffers(this.buffers,2);
		this.plan.render(this.engine);
	}
	,dispose: function() {
	}
	,__class__: h3d_pass_ScreenFx
};
var h3d_pass_Blur = function(quality,passes,sigma) {
	if(sigma == null) sigma = 1.;
	if(passes == null) passes = 1;
	if(quality == null) quality = 1;
	h3d_pass_ScreenFx.call(this,new h3d_shader_Blur());
	this.set_quality(quality);
	this.passes = passes;
	this.set_sigma(sigma);
};
$hxClasses["h3d.pass.Blur"] = h3d_pass_Blur;
h3d_pass_Blur.__name__ = ["h3d","pass","Blur"];
h3d_pass_Blur.__super__ = h3d_pass_ScreenFx;
h3d_pass_Blur.prototype = $extend(h3d_pass_ScreenFx.prototype,{
	set_quality: function(q) {
		this.values = null;
		return this.quality = q;
	}
	,set_sigma: function(s) {
		this.values = null;
		return this.sigma = s;
	}
	,gauss: function(x,s) {
		if(s <= 0) if(x == 0) return 1; else return 0;
		var sq = s * s;
		var p = Math.pow(2.718281828459,-(x * x) / (2 * sq));
		return p / Math.sqrt(2 * Math.PI * sq);
	}
	,calcValues: function() {
		this.values = [];
		var tot = 0.;
		var _g1 = 0;
		var _g = this.quality + 1;
		while(_g1 < _g) {
			var i = _g1++;
			var g = this.gauss(i,this.sigma);
			this.values[i] = g;
			tot += g;
			if(i > 0) tot += g;
		}
		var _g11 = 0;
		var _g2 = this.quality + 1;
		while(_g11 < _g2) {
			var i1 = _g11++;
			this.values[i1] /= tot;
		}
	}
	,apply: function(src,tmp,output,isDepth) {
		if(isDepth == null) isDepth = false;
		if((this.quality <= 0 || this.passes <= 0 || this.sigma <= 0) && this.shader.fixedColor__ == null) return;
		if(output == null) output = src;
		var alloc = tmp == null;
		if(alloc) tmp = new h3d_mat_Texture(src.width,src.height,[h3d_mat_TextureFlags.Target]);
		if(this.values == null) this.calcValues();
		this.shader.set_Quality(this.quality + 1);
		this.shader.values__ = this.values;
		this.shader.set_isDepth(isDepth);
		if(this.depthBlur != null) this.shader.set_cameraInverseViewProj(this.depthBlur.camera.getInverseViewProj());
		var _g1 = 0;
		var _g = this.passes;
		while(_g1 < _g) {
			var i = _g1++;
			this.shader.texture__ = src;
			this.shader.pixel__.set(1 / src.width,0,null,null);
			this.engine.pushTarget(tmp);
			if(this.fullClearRequired) this.engine.clear(0,1,0);
			this.render();
			this.engine.popTarget();
			this.shader.texture__ = tmp;
			this.shader.pixel__.set(0,1 / tmp.height,null,null);
			this.engine.pushTarget(output);
			if(this.fullClearRequired) this.engine.clear(0,1,0);
			this.render();
			this.engine.popTarget();
		}
		if(alloc) tmp.dispose();
	}
	,__class__: h3d_pass_Blur
});
var hxsl_Shader = function() {
	this.priority = 0;
	var cl = js_Boot.getClass(this);
	this.shader = cl._SHADER;
	this.constModified = true;
	if(this.shader == null) {
		this.shader = new hxsl_SharedShader(cl.SRC);
		cl._SHADER = this.shader;
	}
};
$hxClasses["hxsl.Shader"] = hxsl_Shader;
hxsl_Shader.__name__ = ["hxsl","Shader"];
hxsl_Shader.prototype = {
	getParamValue: function(index) {
		throw new js__$Boot_HaxeError("assert");
		return null;
	}
	,updateConstants: function(globals) {
		throw new js__$Boot_HaxeError("assert");
	}
	,updateConstantsFinal: function(globals) {
		var c = this.shader.consts;
		while(c != null) {
			if(c.globalId == 0) {
				c = c.next;
				continue;
			}
			var v = globals.map.h[c.globalId];
			var _g = c.v.type;
			switch(_g[1]) {
			case 1:
				var v1 = v;
				if(v1 >>> c.bits != 0) throw new js__$Boot_HaxeError("Constant " + c.v.name + " is outside range (" + v1 + " > " + ((1 << c.bits) - 1) + ")");
				this.constBits |= v1 << c.pos;
				break;
			case 2:
				var v2 = v;
				if(v2) this.constBits |= 1 << c.pos;
				break;
			default:
				throw new js__$Boot_HaxeError("assert");
			}
			c = c.next;
		}
		this.instance = this.shader.getInstance(this.constBits);
	}
	,__class__: hxsl_Shader
};
var h3d_pass__$Border_BorderShader = function() {
	this.color__ = new h3d_Vector();
	hxsl_Shader.call(this);
};
$hxClasses["h3d.pass._Border.BorderShader"] = h3d_pass__$Border_BorderShader;
h3d_pass__$Border_BorderShader.__name__ = ["h3d","pass","_Border","BorderShader"];
h3d_pass__$Border_BorderShader.__super__ = hxsl_Shader;
h3d_pass__$Border_BorderShader.prototype = $extend(hxsl_Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.color__;
		default:
		}
		return null;
	}
	,__class__: h3d_pass__$Border_BorderShader
});
var h3d_pass_Border = function(width,height,size) {
	if(size == null) size = 1;
	h3d_pass_ScreenFx.call(this,new h3d_pass__$Border_BorderShader());
	var bbuf;
	var this1;
	this1 = new Array(0);
	bbuf = this1;
	bbuf.push(0 / width * 2 - 1);
	bbuf.push(1 - 0 / height * 2);
	bbuf.push(width / width * 2 - 1);
	bbuf.push(1 - 0 / height * 2);
	bbuf.push(0 / width * 2 - 1);
	bbuf.push(1 - size / height * 2);
	bbuf.push(width / width * 2 - 1);
	bbuf.push(1 - size / height * 2);
	bbuf.push(0 / width * 2 - 1);
	bbuf.push(1 - 0 / height * 2);
	bbuf.push(size / width * 2 - 1);
	bbuf.push(1 - 0 / height * 2);
	bbuf.push(0 / width * 2 - 1);
	bbuf.push(1 - height / height * 2);
	bbuf.push(size / width * 2 - 1);
	bbuf.push(1 - height / height * 2);
	bbuf.push(0 / width * 2 - 1);
	bbuf.push(1 - (height - size) / height * 2);
	bbuf.push(width / width * 2 - 1);
	bbuf.push(1 - (height - size) / height * 2);
	bbuf.push(0 / width * 2 - 1);
	bbuf.push(1 - height / height * 2);
	bbuf.push(width / width * 2 - 1);
	bbuf.push(1 - height / height * 2);
	bbuf.push((width - size) / width * 2 - 1);
	bbuf.push(1 - 0 / height * 2);
	bbuf.push(width / width * 2 - 1);
	bbuf.push(1 - 0 / height * 2);
	bbuf.push((width - size) / width * 2 - 1);
	bbuf.push(1 - height / height * 2);
	bbuf.push(width / width * 2 - 1);
	bbuf.push(1 - height / height * 2);
	this.plan = new h3d_prim_RawPrimitive({ vbuf : bbuf, stride : 2, quads : true},true);
	this.shader.color__.set(1,1,1,1);
};
$hxClasses["h3d.pass.Border"] = h3d_pass_Border;
h3d_pass_Border.__name__ = ["h3d","pass","Border"];
h3d_pass_Border.__super__ = h3d_pass_ScreenFx;
h3d_pass_Border.prototype = $extend(h3d_pass_ScreenFx.prototype,{
	__class__: h3d_pass_Border
});
var h3d_shader_ScreenShader = function() {
	hxsl_Shader.call(this);
};
$hxClasses["h3d.shader.ScreenShader"] = h3d_shader_ScreenShader;
h3d_shader_ScreenShader.__name__ = ["h3d","shader","ScreenShader"];
h3d_shader_ScreenShader.__super__ = hxsl_Shader;
h3d_shader_ScreenShader.prototype = $extend(hxsl_Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		return null;
	}
	,__class__: h3d_shader_ScreenShader
});
var h3d_pass_ColorMatrixShader = function() {
	this.maskMatA__ = new h3d_Vector();
	this.maskPower__ = 0;
	this.maskChannel__ = new h3d_Vector();
	this.matrix2__ = new h3d_Matrix();
	this.matrix__ = new h3d_Matrix();
	this.maskMatB__ = new h3d_Vector();
};
$hxClasses["h3d.pass.ColorMatrixShader"] = h3d_pass_ColorMatrixShader;
h3d_pass_ColorMatrixShader.__name__ = ["h3d","pass","ColorMatrixShader"];
h3d_pass_ColorMatrixShader.__super__ = h3d_shader_ScreenShader;
h3d_pass_ColorMatrixShader.prototype = $extend(h3d_shader_ScreenShader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		if(this.maskInvert__) this.constBits |= 1;
		if(this.hasSecondMatrix__) this.constBits |= 2;
		if(this.useMask__) this.constBits |= 4;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.maskInvert__;
		case 1:
			return this.mask__;
		case 2:
			return this.maskMatB__;
		case 3:
			return this.texture__;
		case 4:
			return this.hasSecondMatrix__;
		case 5:
			return this.matrix__;
		case 6:
			return this.matrix2__;
		case 7:
			return this.useMask__;
		case 8:
			return this.maskChannel__;
		case 9:
			return this.maskPower__;
		case 10:
			return this.maskMatA__;
		default:
		}
		return null;
	}
	,__class__: h3d_pass_ColorMatrixShader
});
var h3d_pass__$Copy_CopyShader = function() { };
$hxClasses["h3d.pass._Copy.CopyShader"] = h3d_pass__$Copy_CopyShader;
h3d_pass__$Copy_CopyShader.__name__ = ["h3d","pass","_Copy","CopyShader"];
h3d_pass__$Copy_CopyShader.__super__ = h3d_shader_ScreenShader;
h3d_pass__$Copy_CopyShader.prototype = $extend(h3d_shader_ScreenShader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.texture__;
		default:
		}
		return null;
	}
	,__class__: h3d_pass__$Copy_CopyShader
});
var h3d_pass_Default = function() {
	this.sortPasses = true;
	this.textureCount = 1;
	this.shaderCount = 1;
	h3d_pass_Base.call(this);
	this.manager = new h3d_shader_Manager(this.getOutputs());
	this.tcache = new h3d_impl_TextureCache();
	this.shaderIdMap = [];
	this.textureIdMap = [];
	this.initGlobals();
};
$hxClasses["h3d.pass.Default"] = h3d_pass_Default;
h3d_pass_Default.__name__ = ["h3d","pass","Default"];
h3d_pass_Default.__super__ = h3d_pass_Base;
h3d_pass_Default.prototype = $extend(h3d_pass_Base.prototype,{
	getOutputs: function() {
		return ["output.position","output.color"];
	}
	,processShaders: function(p,shaders) {
		var p1 = this.ctx.extraShaders;
		while(p1 != null) {
			shaders = this.ctx.allocShaderList(p1.s,shaders);
			p1 = p1.next;
		}
		return shaders;
	}
	,setupShaders: function(passes) {
		var p = passes;
		var lightInit = false;
		while(p != null) {
			var shaders = p.pass.getShadersRec();
			shaders = this.processShaders(p,shaders);
			if(p.pass.enableLights && this.ctx.lightSystem != null) {
				if(!lightInit) {
					this.ctx.lightSystem.initGlobals(this.manager.globals);
					lightInit = true;
				}
				shaders = this.ctx.lightSystem.computeLight(p.obj,shaders);
			}
			p.shader = this.manager.compileShaders(shaders);
			p.shaders = shaders;
			var t = p.shader.fragment.textures2D;
			if(t == null) p.texture = 0; else {
				var t1 = this.manager.getParamValue(t,shaders);
				if(t1 == null) p.texture = 0; else p.texture = t1.id;
			}
			p = p.next;
		}
	}
	,uploadParams: function() {
		this.manager.fillParams(this.cachedBuffer,this.ctx.drawPass.shader,this.ctx.drawPass.shaders);
		this.ctx.engine.uploadShaderBuffers(this.cachedBuffer,1);
		this.ctx.engine.uploadShaderBuffers(this.cachedBuffer,2);
	}
	,drawObject: function(p) {
		this.ctx.drawPass = p;
		this.ctx.engine.selectMaterial(p.pass);
		p.obj.draw(this.ctx);
	}
	,draw: function(passes) {
		var _g = this;
		var _g1 = 0;
		var _g11 = this.ctx.sharedGlobals;
		while(_g1 < _g11.length) {
			var g = _g11[_g1];
			++_g1;
			this.manager.globals.fastSet(g.gid,g.value);
		}
		this.setGlobals();
		this.setupShaders(passes);
		var p = passes;
		var shaderStart = this.shaderCount;
		var textureStart = this.textureCount;
		while(p != null) {
			if(!(this.shaderIdMap[p.shader.id] >= shaderStart)) this.shaderIdMap[p.shader.id] = this.shaderCount++;
			if(!(this.textureIdMap[p.texture] >= textureStart)) this.textureIdMap[p.texture] = this.textureCount++;
			p = p.next;
		}
		if(this.sortPasses) passes = haxe_ds_ListSort.sortSingleLinked(passes,function(o1,o2) {
			var d = _g.shaderIdMap[o1.shader.id] - _g.shaderIdMap[o2.shader.id];
			if(d != 0) return d;
			return _g.textureIdMap[o1.texture] - _g.textureIdMap[o2.texture];
		});
		this.ctx.uploadParams = $bind(this,this.uploadParams);
		var p1 = passes;
		var buf = this.cachedBuffer;
		var prevShader = null;
		var drawTri = 0;
		var drawCalls = 0;
		var shaderSwitches = 0;
		if(this.ctx.engine.driver.logEnable) {
			drawTri = this.ctx.engine.drawTriangles;
			drawCalls = this.ctx.engine.drawCalls;
			shaderSwitches = this.ctx.engine.shaderSwitches;
		}
		while(p1 != null) {
			this.set_globalModelView(p1.obj.absPos);
			if(p1.shader.globals.h.hasOwnProperty(this.globalModelViewInverse_id)) this.set_globalModelViewInverse(p1.obj.getInvPos());
			if(prevShader != p1.shader) {
				prevShader = p1.shader;
				this.ctx.engine.selectShader(p1.shader);
				if(buf == null) buf = this.cachedBuffer = new h3d_shader_Buffers(p1.shader); else buf.grow(p1.shader);
				this.manager.fillGlobals(buf,p1.shader);
				this.ctx.engine.uploadShaderBuffers(buf,0);
			}
			if(!p1.pass.dynamicParameters) {
				this.manager.fillParams(buf,p1.shader,p1.shaders);
				this.ctx.engine.uploadShaderBuffers(buf,1);
				this.ctx.engine.uploadShaderBuffers(buf,2);
			}
			this.drawObject(p1);
			p1 = p1.next;
		}
		if(this.ctx.engine.driver.logEnable) null;
		this.ctx.nextPass();
		return passes;
	}
	,set_cameraView: function(v) {
		this.manager.globals.fastSet(this.cameraView_id,v);
		return v;
	}
	,set_cameraNear: function(v) {
		this.manager.globals.fastSet(this.cameraNear_id,v);
		return v;
	}
	,set_cameraFar: function(v) {
		this.manager.globals.fastSet(this.cameraFar_id,v);
		return v;
	}
	,set_cameraProj: function(v) {
		this.manager.globals.fastSet(this.cameraProj_id,v);
		return v;
	}
	,set_cameraPos: function(v) {
		this.manager.globals.fastSet(this.cameraPos_id,v);
		return v;
	}
	,set_cameraProjDiag: function(v) {
		this.manager.globals.fastSet(this.cameraProjDiag_id,v);
		return v;
	}
	,set_cameraViewProj: function(v) {
		this.manager.globals.fastSet(this.cameraViewProj_id,v);
		return v;
	}
	,set_cameraInverseViewProj: function(v) {
		this.manager.globals.fastSet(this.cameraInverseViewProj_id,v);
		return v;
	}
	,set_globalTime: function(v) {
		this.manager.globals.fastSet(this.globalTime_id,v);
		return v;
	}
	,set_pixelSize: function(v) {
		this.manager.globals.fastSet(this.pixelSize_id,v);
		return v;
	}
	,set_globalModelView: function(v) {
		this.manager.globals.fastSet(this.globalModelView_id,v);
		return v;
	}
	,set_globalModelViewInverse: function(v) {
		this.manager.globals.fastSet(this.globalModelViewInverse_id,v);
		return v;
	}
	,initGlobals: function() {
		var this1;
		this1 = hxsl_Globals.allocID("camera.view");
		this.cameraView_id = this1;
		var this2;
		this2 = hxsl_Globals.allocID("camera.zNear");
		this.cameraNear_id = this2;
		var this3;
		this3 = hxsl_Globals.allocID("camera.zFar");
		this.cameraFar_id = this3;
		var this4;
		this4 = hxsl_Globals.allocID("camera.proj");
		this.cameraProj_id = this4;
		var this5;
		this5 = hxsl_Globals.allocID("camera.position");
		this.cameraPos_id = this5;
		var this6;
		this6 = hxsl_Globals.allocID("camera.projDiag");
		this.cameraProjDiag_id = this6;
		var this7;
		this7 = hxsl_Globals.allocID("camera.viewProj");
		this.cameraViewProj_id = this7;
		var this8;
		this8 = hxsl_Globals.allocID("camera.inverseViewProj");
		this.cameraInverseViewProj_id = this8;
		var this9;
		this9 = hxsl_Globals.allocID("global.time");
		this.globalTime_id = this9;
		var this10;
		this10 = hxsl_Globals.allocID("global.pixelSize");
		this.pixelSize_id = this10;
		var this11;
		this11 = hxsl_Globals.allocID("global.modelView");
		this.globalModelView_id = this11;
		var this12;
		this12 = hxsl_Globals.allocID("global.modelViewInverse");
		this.globalModelViewInverse_id = this12;
	}
	,setGlobals: function() {
		this.set_cameraView(this.ctx.camera.mcam);
		this.set_cameraNear(this.ctx.camera.zNear);
		this.set_cameraFar(this.ctx.camera.zFar);
		this.set_cameraProj(this.ctx.camera.mproj);
		this.set_cameraPos(this.ctx.camera.pos);
		this.set_cameraProjDiag(new h3d_Vector(this.ctx.camera.mproj._11,this.ctx.camera.mproj._22,this.ctx.camera.mproj._33,this.ctx.camera.mproj._44));
		this.set_cameraViewProj(this.ctx.camera.m);
		this.set_cameraInverseViewProj(this.ctx.camera.getInverseViewProj());
		this.set_globalTime(this.ctx.time);
		this.set_pixelSize(new h3d_Vector(2 / this.ctx.engine.width,2 / this.ctx.engine.height));
	}
	,__class__: h3d_pass_Default
});
var h3d_pass_Depth = function() {
	this.reduceSize = 0;
	this.enableSky = false;
	h3d_pass_Default.call(this);
	this.priority = 10;
	this.depthMapId = hxsl_Globals.allocID("depthMap");
};
$hxClasses["h3d.pass.Depth"] = h3d_pass_Depth;
h3d_pass_Depth.__name__ = ["h3d","pass","Depth"];
h3d_pass_Depth.__super__ = h3d_pass_Default;
h3d_pass_Depth.prototype = $extend(h3d_pass_Default.prototype,{
	getOutputs: function() {
		return ["output.position","output.depth"];
	}
	,draw: function(passes) {
		var texture = this.tcache.allocTarget("depthMap",this.ctx,this.ctx.engine.width >> this.reduceSize,this.ctx.engine.height >> this.reduceSize);
		this.ctx.engine.pushTarget(texture);
		this.ctx.engine.clear(this.enableSky?0:16711680,1);
		passes = h3d_pass_Default.prototype.draw.call(this,passes);
		this.ctx.engine.popTarget();
		this.ctx.setGlobalID(this.depthMapId,texture);
		return passes;
	}
	,__class__: h3d_pass_Depth
});
var h3d_pass__$FXAA_FXAAShader = function() {
	this.delta__ = new h3d_Vector();
};
$hxClasses["h3d.pass._FXAA.FXAAShader"] = h3d_pass__$FXAA_FXAAShader;
h3d_pass__$FXAA_FXAAShader.__name__ = ["h3d","pass","_FXAA","FXAAShader"];
h3d_pass__$FXAA_FXAAShader.__super__ = h3d_shader_ScreenShader;
h3d_pass__$FXAA_FXAAShader.prototype = $extend(h3d_shader_ScreenShader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.texture__;
		case 1:
			return this.delta__;
		default:
		}
		return null;
	}
	,__class__: h3d_pass__$FXAA_FXAAShader
});
var h3d_pass_LightSystem = function() {
	this.perPixelLighting = true;
	this.maxLightsPerObject = 6;
	this.ambientLight = new h3d_Vector(0.5,0.5,0.5);
	this.ambientShader = new h3d_shader_AmbientLight();
	this.set_additiveLighting(true);
};
$hxClasses["h3d.pass.LightSystem"] = h3d_pass_LightSystem;
h3d_pass_LightSystem.__name__ = ["h3d","pass","LightSystem"];
h3d_pass_LightSystem.prototype = {
	set_additiveLighting: function(b) {
		return Std.instance(this.ambientShader,h3d_shader_AmbientLight).set_additive(b);
	}
	,initLights: function(ctx) {
		this.lightCount = 0;
		this.ctx = ctx;
		var l = ctx.lights;
		var prev = null;
		var frustum = new h3d_col_Frustum(ctx.camera.m);
		var s = new h3d_col_Sphere();
		while(l != null) {
			s.x = l.absPos._41;
			s.y = l.absPos._42;
			s.z = l.absPos._43;
			s.r = l.cullingDistance;
			if(!frustum.hasSphere(s)) {
				if(prev == null) ctx.lights = l.next; else prev.next = l.next;
				l = l.next;
				continue;
			}
			this.lightCount++;
			l.objectDistance = 0.;
			prev = l;
			l = l.next;
		}
		if(this.lightCount <= this.maxLightsPerObject) ctx.lights = haxe_ds_ListSort.sortSingleLinked(ctx.lights,$bind(this,this.sortLight));
		if(this.shadowLight == null || this.shadowLight.parent == null) {
			var l1 = ctx.lights;
			while(l1 != null) {
				var dl;
				dl = (l1 instanceof h3d_scene_DirLight)?l1:null;
				if(dl != null) {
					this.shadowLight = dl;
					break;
				}
				l1 = l1.next;
			}
		}
	}
	,initGlobals: function(globals) {
		globals.set("global.ambientLight",this.ambientLight);
		globals.set("global.perPixelLighting",this.perPixelLighting);
	}
	,sortLight: function(l1,l2) {
		var p = l1.priority - l2.priority;
		if(p != 0) return -p;
		if(l1.objectDistance < l2.objectDistance) return -1; else return 1;
	}
	,computeLight: function(obj,shaders) {
		var _g = this;
		if(this.lightCount > this.maxLightsPerObject) {
			var l1 = this.ctx.lights;
			while(l1 != null) {
				if((obj.flags & 16) != 0) l1.objectDistance = hxd_Math.distanceSq(l1.absPos._41 - this.ctx.camera.target.x,l1.absPos._42 - this.ctx.camera.target.y,l1.absPos._43 - this.ctx.camera.target.z); else l1.objectDistance = hxd_Math.distanceSq(l1.absPos._41 - obj.absPos._41,l1.absPos._42 - obj.absPos._42,l1.absPos._43 - obj.absPos._43);
				l1 = l1.next;
			}
			this.ctx.lights = haxe_ds_ListSort.sortSingleLinked(this.ctx.lights,$bind(this,this.sortLight));
		}
		shaders = _g.ctx.allocShaderList(this.ambientShader,shaders);
		var l = this.ctx.lights;
		var i = 0;
		while(l != null) {
			if(i++ == this.maxLightsPerObject) break;
			shaders = _g.ctx.allocShaderList(l.shader,shaders);
			l = l.next;
		}
		return shaders;
	}
	,__class__: h3d_pass_LightSystem
};
var h3d_pass_Normal = function() {
	h3d_pass_Default.call(this);
	this.priority = 10;
	this.normalMapId = hxsl_Globals.allocID("normalMap");
};
$hxClasses["h3d.pass.Normal"] = h3d_pass_Normal;
h3d_pass_Normal.__name__ = ["h3d","pass","Normal"];
h3d_pass_Normal.__super__ = h3d_pass_Default;
h3d_pass_Normal.prototype = $extend(h3d_pass_Default.prototype,{
	getOutputs: function() {
		return ["output.position","output.normal"];
	}
	,draw: function(passes) {
		var texture = this.tcache.allocTarget("normalMal",this.ctx,this.ctx.engine.width,this.ctx.engine.height);
		this.ctx.engine.pushTarget(texture);
		this.ctx.engine.clear(8421504,1);
		passes = h3d_pass_Default.prototype.draw.call(this,passes);
		this.ctx.engine.popTarget();
		this.ctx.setGlobalID(this.normalMapId,texture);
		return passes;
	}
	,__class__: h3d_pass_Normal
});
var h3d_pass_Object = function() {
	this.texture = 0;
};
$hxClasses["h3d.pass.Object"] = h3d_pass_Object;
h3d_pass_Object.__name__ = ["h3d","pass","Object"];
h3d_pass_Object.prototype = {
	__class__: h3d_pass_Object
};
var h3d_pass_ShadowMap = function(size) {
	this.bias = 0.01;
	this.power = 10.0;
	h3d_pass_Default.call(this);
	this.set_size(size);
	this.priority = 9;
	this.lightCamera = new h3d_Camera();
	this.lightCamera.orthoBounds = new h3d_col_Bounds();
	this.shadowMapId = hxsl_Globals.allocID("shadow.map");
	this.shadowProjId = hxsl_Globals.allocID("shadow.proj");
	this.shadowColorId = hxsl_Globals.allocID("shadow.color");
	this.shadowPowerId = hxsl_Globals.allocID("shadow.power");
	this.shadowBiasId = hxsl_Globals.allocID("shadow.bias");
	this.color = new h3d_Vector();
	this.blur = new h3d_pass_Blur(2,3);
	this.border = new h3d_pass_Border(size,size);
};
$hxClasses["h3d.pass.ShadowMap"] = h3d_pass_ShadowMap;
h3d_pass_ShadowMap.__name__ = ["h3d","pass","ShadowMap"];
h3d_pass_ShadowMap.__super__ = h3d_pass_Default;
h3d_pass_ShadowMap.prototype = $extend(h3d_pass_Default.prototype,{
	set_size: function(s) {
		if(this.border != null && this.size != s) {
			this.border.dispose();
			this.border = new h3d_pass_Border(s,s);
		}
		return this.size = s;
	}
	,calcShadowBounds: function(camera) {
		var bounds = camera.orthoBounds;
		bounds.xMin = -10;
		bounds.yMin = -10;
		bounds.zMin = -10;
		bounds.xMax = 10;
		bounds.yMax = 10;
		bounds.zMax = 10;
	}
	,getOutputs: function() {
		return ["output.position","output.depth"];
	}
	,setGlobals: function() {
		h3d_pass_Default.prototype.setGlobals.call(this);
		this.lightCamera.orthoBounds.empty();
		this.calcShadowBounds(this.lightCamera);
		this.lightCamera.update();
		this.set_cameraViewProj(this.lightCamera.m);
	}
	,draw: function(passes) {
		var texture = this.tcache.allocTarget("shadowMap",this.ctx,this.size,this.size);
		var ct = this.ctx.camera.target;
		var slight = this.ctx.lightSystem.shadowLight;
		if(slight == null) this.lightCamera.target.set(0,0,-1,null); else {
			this.lightCamera.target.set(slight.direction.x,slight.direction.y,slight.direction.z,null);
			this.lightCamera.target.normalize();
		}
		this.lightCamera.target.x += ct.x;
		this.lightCamera.target.y += ct.y;
		this.lightCamera.target.z += ct.z;
		this.lightCamera.pos.load(ct);
		this.lightCamera.update();
		this.ctx.engine.pushTarget(texture);
		this.ctx.engine.clear(16777215,1,this.tcache.fullClearRequired?0:null);
		passes = h3d_pass_Default.prototype.draw.call(this,passes);
		if(this.border != null) this.border.render();
		this.ctx.engine.popTarget();
		if(this.blur.quality > 0 && this.blur.passes > 0) this.blur.apply(texture,this.tcache.allocTarget("tmpBlur",this.ctx,this.size,this.size,false),null,true);
		this.ctx.setGlobalID(this.shadowMapId,texture);
		this.ctx.setGlobalID(this.shadowProjId,this.lightCamera.m);
		this.ctx.setGlobalID(this.shadowColorId,this.color);
		this.ctx.setGlobalID(this.shadowPowerId,this.power);
		this.ctx.setGlobalID(this.shadowBiasId,this.bias);
		return passes;
	}
	,__class__: h3d_pass_ShadowMap
});
var h3d_prim_Plan2D = function() {
};
$hxClasses["h3d.prim.Plan2D"] = h3d_prim_Plan2D;
h3d_prim_Plan2D.__name__ = ["h3d","prim","Plan2D"];
h3d_prim_Plan2D.get = function() {
	if(h3d_prim_Plan2D.inst == null) h3d_prim_Plan2D.inst = new h3d_prim_Plan2D();
	return h3d_prim_Plan2D.inst;
};
h3d_prim_Plan2D.__super__ = h3d_prim_Primitive;
h3d_prim_Plan2D.prototype = $extend(h3d_prim_Primitive.prototype,{
	triCount: function() {
		return 2;
	}
	,alloc: function(engine) {
		var v;
		var this1;
		this1 = new Array(0);
		v = this1;
		v.push(-1);
		v.push(-1);
		v.push(0);
		v.push(1);
		v.push(-1);
		v.push(1);
		v.push(0);
		v.push(0);
		v.push(1);
		v.push(-1);
		v.push(1);
		v.push(1);
		v.push(1);
		v.push(1);
		v.push(1);
		v.push(0);
		this.buffer = h3d_Buffer.ofFloats(v,4,[h3d_BufferFlag.Quads,h3d_BufferFlag.RawFormat]);
	}
	,render: function(engine) {
		if(this.buffer == null || this.buffer.isDisposed()) this.alloc(engine);
		engine.renderBuffer(this.buffer,engine.mem.quadIndexes,2,0,-1);
	}
	,__class__: h3d_prim_Plan2D
});
var h3d_prim_RawPrimitive = function(inf,persist) {
	if(persist == null) persist = false;
	this.onContextLost = function() {
		return inf;
	};
	this.alloc(null);
	if(!persist) this.onContextLost = null;
};
$hxClasses["h3d.prim.RawPrimitive"] = h3d_prim_RawPrimitive;
h3d_prim_RawPrimitive.__name__ = ["h3d","prim","RawPrimitive"];
h3d_prim_RawPrimitive.__super__ = h3d_prim_Primitive;
h3d_prim_RawPrimitive.prototype = $extend(h3d_prim_Primitive.prototype,{
	alloc: function(engine) {
		if(this.onContextLost == null) throw new js__$Boot_HaxeError("Cannot realloc " + Std.string(this));
		var inf = this.onContextLost();
		var flags = [];
		if(inf.ibuf == null) flags.push(inf.quads?h3d_BufferFlag.Quads:h3d_BufferFlag.Triangles);
		if(inf.stride < 8) flags.push(h3d_BufferFlag.RawFormat);
		this.buffer = h3d_Buffer.ofFloats(inf.vbuf,inf.stride,flags);
		this.vcount = this.buffer.vertices;
		if(inf.ibuf != null) this.tcount = inf.ibuf.length / 3 | 0; else if(inf.quads) this.tcount = this.vcount >> 1; else this.tcount = this.vcount / 3 | 0;
		if(inf.ibuf != null) this.indexes = h3d_Indexes.alloc(inf.ibuf); else if(this.indexes != null) {
			this.indexes.dispose();
			this.indexes = null;
		}
	}
	,triCount: function() {
		return this.tcount;
	}
	,__class__: h3d_prim_RawPrimitive
});
var h3d_prim_UV = function() { };
$hxClasses["h3d.prim.UV"] = h3d_prim_UV;
h3d_prim_UV.__name__ = ["h3d","prim","UV"];
h3d_prim_UV.prototype = {
	__class__: h3d_prim_UV
};
var h3d_scene_Light = function(shader,parent) {
	this.priority = 0;
	this.cullingDistance = 1e10;
	h3d_scene_Object.call(this,parent);
	this.shader = shader;
};
$hxClasses["h3d.scene.Light"] = h3d_scene_Light;
h3d_scene_Light.__name__ = ["h3d","scene","Light"];
h3d_scene_Light.__super__ = h3d_scene_Object;
h3d_scene_Light.prototype = $extend(h3d_scene_Object.prototype,{
	emit: function(ctx) {
		ctx.emitLight(this);
	}
	,__class__: h3d_scene_Light
});
var h3d_scene_DirLight = function(dir,parent) {
	this.dshader = new h3d_shader_DirLight();
	this.direction = dir;
	h3d_scene_Light.call(this,this.dshader,parent);
	this.priority = 100;
};
$hxClasses["h3d.scene.DirLight"] = h3d_scene_DirLight;
h3d_scene_DirLight.__name__ = ["h3d","scene","DirLight"];
h3d_scene_DirLight.__super__ = h3d_scene_Light;
h3d_scene_DirLight.prototype = $extend(h3d_scene_Light.prototype,{
	emit: function(ctx) {
		this.dshader.direction__.set(this.direction.x,this.direction.y,this.direction.z,null);
		this.dshader.direction__.normalize();
		h3d_scene_Light.prototype.emit.call(this,ctx);
	}
	,__class__: h3d_scene_DirLight
});
var h3d_scene_Interactive = function() {
	this.hitPoint = new h3d_Vector();
	this.propagateEvents = false;
	this.cancelEvents = false;
};
$hxClasses["h3d.scene.Interactive"] = h3d_scene_Interactive;
h3d_scene_Interactive.__name__ = ["h3d","scene","Interactive"];
h3d_scene_Interactive.__interfaces__ = [hxd_Interactive];
h3d_scene_Interactive.__super__ = h3d_scene_Object;
h3d_scene_Interactive.prototype = $extend(h3d_scene_Object.prototype,{
	onAlloc: function() {
		this.scene = this.getScene();
		if(this.scene != null) this.scene.addEventTarget(this);
		h3d_scene_Object.prototype.onAlloc.call(this);
	}
	,onDelete: function() {
		if(this.scene != null) {
			this.scene.removeEventTarget(this);
			this.scene = null;
		}
		h3d_scene_Object.prototype.onDelete.call(this);
	}
	,getInteractiveScene: function() {
		return this.scene;
	}
	,handleEvent: function(e) {
		if(this.propagateEvents) e.propagate = true;
		if(this.cancelEvents) e.cancel = true;
		var _g = e.kind;
		switch(_g[1]) {
		case 2:
			this.onMove(e);
			break;
		case 0:
			if(this.enableRightButton || e.button == 0) {
				this.isMouseDown = e.button;
				this.onPush(e);
			}
			break;
		case 1:
			if(this.enableRightButton || e.button == 0) {
				this.onRelease(e);
				if(this.isMouseDown == e.button) this.onClick(e);
			}
			this.isMouseDown = -1;
			break;
		case 10:
			if(this.enableRightButton || e.button == 0) {
				e.kind = hxd_EventKind.ERelease;
				this.onRelease(e);
				e.kind = hxd_EventKind.EReleaseNoClick;
			}
			this.isMouseDown = -1;
			break;
		case 3:
			hxd_System.setCursor(this.cursor);
			this.onOver(e);
			break;
		case 4:
			this.isMouseDown = -1;
			hxd_System.setCursor(hxd_Cursor.Default);
			this.onOut(e);
			break;
		case 5:
			this.onWheel(e);
			break;
		case 7:
			this.onFocusLost(e);
			break;
		case 6:
			this.onFocus(e);
			break;
		case 9:
			this.onKeyUp(e);
			break;
		case 8:
			this.onKeyDown(e);
			break;
		}
	}
	,onOver: function(e) {
	}
	,onOut: function(e) {
	}
	,onPush: function(e) {
	}
	,onRelease: function(e) {
	}
	,onClick: function(e) {
	}
	,onMove: function(e) {
	}
	,onWheel: function(e) {
	}
	,onFocus: function(e) {
	}
	,onFocusLost: function(e) {
	}
	,onKeyUp: function(e) {
	}
	,onKeyDown: function(e) {
	}
	,__class__: h3d_scene_Interactive
});
var h3d_scene__$RenderContext_SharedGlobal = function(gid,value) {
	this.gid = gid;
	this.value = value;
};
$hxClasses["h3d.scene._RenderContext.SharedGlobal"] = h3d_scene__$RenderContext_SharedGlobal;
h3d_scene__$RenderContext_SharedGlobal.__name__ = ["h3d","scene","_RenderContext","SharedGlobal"];
h3d_scene__$RenderContext_SharedGlobal.prototype = {
	__class__: h3d_scene__$RenderContext_SharedGlobal
};
var h3d_scene_RenderContext = function() {
	h3d_impl_RenderContext.call(this);
	this.cachedShaderList = [];
};
$hxClasses["h3d.scene.RenderContext"] = h3d_scene_RenderContext;
h3d_scene_RenderContext.__name__ = ["h3d","scene","RenderContext"];
h3d_scene_RenderContext.__super__ = h3d_impl_RenderContext;
h3d_scene_RenderContext.prototype = $extend(h3d_impl_RenderContext.prototype,{
	emit: function(mat,obj,index) {
		if(index == null) index = 0;
		var p = mat.passes;
		while(p != null) {
			this.emitPass(p,obj).index = index;
			p = p.nextPass;
		}
	}
	,start: function() {
		this.sharedGlobals = [];
		this.lights = null;
		this.drawPass = null;
		this.passes = null;
		this.lights = null;
		this.uploadParams = null;
		this.cachedPos = 0;
		this.visibleFlag = true;
		this.time += this.elapsedTime;
		this.frame++;
	}
	,nextPass: function() {
		this.cachedPos = 0;
		this.drawPass = null;
	}
	,setGlobalID: function(gid,value) {
		var _g = 0;
		var _g1 = this.sharedGlobals;
		while(_g < _g1.length) {
			var g = _g1[_g];
			++_g;
			if(g.gid == gid) {
				g.value = value;
				return;
			}
		}
		this.sharedGlobals.push(new h3d_scene__$RenderContext_SharedGlobal(gid,value));
	}
	,emitPass: function(pass,obj) {
		var o = this.pool;
		if(o == null) {
			o = new h3d_pass_Object();
			o.nextAlloc = this.firstAlloc;
			this.firstAlloc = o;
		} else this.pool = o.nextAlloc;
		o.pass = pass;
		o.obj = obj;
		o.next = this.passes;
		this.passes = o;
		return o;
	}
	,allocShaderList: function(s,next) {
		var sl = this.cachedShaderList[this.cachedPos++];
		if(sl == null) {
			sl = new hxsl_ShaderList(null);
			this.cachedShaderList[this.cachedPos - 1] = sl;
		}
		sl.s = s;
		sl.next = next;
		return sl;
	}
	,emitLight: function(l) {
		l.next = this.lights;
		this.lights = l;
	}
	,done: function() {
		this.drawPass = null;
		this.uploadParams = null;
		var p = this.firstAlloc;
		while(p != null) {
			p.obj = null;
			p.pass = null;
			p.shader = null;
			p.shaders = null;
			p.next = null;
			p.index = 0;
			p = p.nextAlloc;
		}
		this.pool = this.firstAlloc;
		var _g = 0;
		var _g1 = this.cachedShaderList;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			c.s = null;
			c.next = null;
		}
		this.passes = null;
		this.lights = null;
	}
	,__class__: h3d_scene_RenderContext
});
var h3d_scene_PassGroup = function(name,passes) {
	this.name = name;
	this.passes = passes;
};
$hxClasses["h3d.scene.PassGroup"] = h3d_scene_PassGroup;
h3d_scene_PassGroup.__name__ = ["h3d","scene","PassGroup"];
h3d_scene_PassGroup.prototype = {
	__class__: h3d_scene_PassGroup
};
var h3d_scene_Renderer = function() {
	this.hasSetTarget = false;
	this.passes = new haxe_ds_StringMap();
	this.allPasses = [];
	this.tcache = new h3d_impl_TextureCache();
	this.passGroups = new haxe_ds_StringMap();
};
$hxClasses["h3d.scene.Renderer"] = h3d_scene_Renderer;
h3d_scene_Renderer.__name__ = ["h3d","scene","Renderer"];
h3d_scene_Renderer.prototype = {
	createDefaultPass: function(name) {
		switch(name) {
		case "depth":
			if(this.depth != null) return this.depth;
			return this.depth = new h3d_pass_Depth();
		case "normal":
			if(this.normal != null) return this.normal;
			return this.normal = new h3d_pass_Normal();
		case "shadow":
			if(this.shadow != null) return this.shadow;
			return this.shadow = new h3d_pass_ShadowMap(1024);
		default:
			if(this.def != null) return this.def;
			return this.def = new h3d_pass_Default();
		}
	}
	,getPass: function(name,create) {
		if(create == null) create = true;
		var p = this.passes.get(name);
		if(p == null && create) {
			p = this.createDefaultPass(name);
			this.setPass(name,p);
		}
		return p;
	}
	,getPassPriority: function(p) {
		var pr = p.p.priority * 10;
		var _g = p.name;
		switch(_g) {
		case "alpha":
			pr -= 1;
			break;
		case "additive":
			pr -= 2;
			break;
		}
		return pr;
	}
	,setPass: function(name,p) {
		var _g = this;
		var _g1 = 0;
		var _g11 = this.allPasses;
		while(_g1 < _g11.length) {
			var p1 = _g11[_g1];
			++_g1;
			if(p1.name == name) HxOverrides.remove(this.allPasses,p1);
		}
		this.passes.set(name,p);
		this.allPasses.push({ name : name, p : p});
		this.allPasses.sort(function(p11,p2) {
			return _g.getPassPriority(p2) - _g.getPassPriority(p11);
		});
	}
	,depthSort: function(passes,frontToBack) {
		if(frontToBack == null) frontToBack = false;
		var p = passes;
		var cam = this.ctx.camera.m;
		while(p != null) {
			var z = p.obj.absPos._41 * cam._13 + p.obj.absPos._42 * cam._23 + p.obj.absPos._43 * cam._33 + cam._43;
			var w = p.obj.absPos._41 * cam._14 + p.obj.absPos._42 * cam._24 + p.obj.absPos._43 * cam._34 + cam._44;
			p.depth = z / w;
			p = p.next;
		}
		if(frontToBack) return haxe_ds_ListSort.sortSingleLinked(passes,function(p1,p2) {
			if(p1.depth > p2.depth) return 1; else return -1;
		}); else return haxe_ds_ListSort.sortSingleLinked(passes,function(p11,p21) {
			if(p11.depth > p21.depth) return -1; else return 1;
		});
	}
	,render: function() {
		var _g = 0;
		var _g1 = this.allPasses;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			var pdata = this.passGroups.get(p.name);
			if(pdata != null && pdata.rendered) continue;
			if(pdata != null || p.p.forceProcessing) {
				p.p.setContext(this.ctx);
				var passes;
				if(pdata == null) passes = null; else passes = pdata.passes;
				if(p.name == "alpha") passes = this.depthSort(passes);
				if(p.name == "default") passes = this.depthSort(passes,true);
				passes = p.p.draw(passes);
				if(pdata != null) {
					pdata.passes = passes;
					pdata.rendered = true;
				}
			}
		}
	}
	,process: function(passes) {
		this.hasSetTarget = false;
		var _g = 0;
		while(_g < passes.length) {
			var p = passes[_g];
			++_g;
			this.getPass(p.name).setContext(this.ctx);
			this.passGroups.set(p.name,p);
		}
		this.render();
		if(this.hasSetTarget) {
			this.ctx.engine.popTarget();
			this.hasSetTarget = false;
		}
		var _g1 = 0;
		while(_g1 < passes.length) {
			var p1 = passes[_g1];
			++_g1;
			this.passGroups.set(p1.name,null);
		}
	}
	,__class__: h3d_scene_Renderer
};
var h3d_scene_Scene = function() {
	h3d_scene_Object.call(this,null);
	this.hitInteractives = [];
	this.interactives = [];
	this.camera = new h3d_Camera();
	this.ctx = new h3d_scene_RenderContext();
	this.set_renderer(new h3d_scene_Renderer());
	this.lightSystem = new h3d_pass_LightSystem();
	this.postPasses = [];
	this.prePasses = [];
};
$hxClasses["h3d.scene.Scene"] = h3d_scene_Scene;
h3d_scene_Scene.__name__ = ["h3d","scene","Scene"];
h3d_scene_Scene.__interfaces__ = [hxd_InteractiveScene,h3d_IDrawable];
h3d_scene_Scene.__super__ = h3d_scene_Object;
h3d_scene_Scene.prototype = $extend(h3d_scene_Object.prototype,{
	setEvents: function(events) {
		this.events = events;
	}
	,dispatchListeners: function(event) {
	}
	,set_renderer: function(r) {
		this.renderer = r;
		if(r != null) r.ctx = this.ctx;
		return r;
	}
	,sortHitPointByCameraDistance: function(i1,i2) {
		var z1 = i1.hitPoint.w;
		var z2 = i2.hitPoint.w;
		if(z1 > z2) return -1;
		return 1;
	}
	,dispatchEvent: function(event,to) {
		var i = to;
		i.handleEvent(event);
	}
	,handleEvent: function(event,last) {
		if(this.interactives.length == 0) return null;
		if(this.hitInteractives.length == 0) {
			var stage = hxd_Stage.getInstance();
			var screenX = (event.relX / stage.get_width() - 0.5) * 2;
			var screenY = -(event.relY / stage.get_height() - 0.5) * 2;
			var p0 = this.camera.unproject(screenX,screenY,0);
			var p1 = this.camera.unproject(screenX,screenY,1);
			var r = h3d_col_Ray.fromPoints(new h3d_col_Point(p0.x,p0.y,p0.z),new h3d_col_Point(p1.x,p1.y,p1.z));
			var saveR = r.clone();
			var hitTmp = new h3d_col_Point();
			var _g = 0;
			var _g1 = this.interactives;
			while(_g < _g1.length) {
				var i = _g1[_g];
				++_g;
				var p = i;
				while(p != null && (p.flags & 2) != 0) p = p.parent;
				if(p != null) continue;
				var minv = i.getInvPos();
				r.transform(minv);
				r.normalize();
				if(r.lx != r.lx) {
					r.px = saveR.px;
					r.py = saveR.py;
					r.pz = saveR.pz;
					r.lx = saveR.lx;
					r.ly = saveR.ly;
					r.lz = saveR.lz;
					continue;
				}
				var hit = i.shape.rayIntersection(r,hitTmp);
				r.px = saveR.px;
				r.py = saveR.py;
				r.pz = saveR.pz;
				r.lx = saveR.lx;
				r.ly = saveR.ly;
				r.lz = saveR.lz;
				if(hit == null) continue;
				i.hitPoint.x = hit.x;
				i.hitPoint.y = hit.y;
				i.hitPoint.z = hit.z;
				this.hitInteractives.push(i);
			}
			if(this.hitInteractives.length == 0) return null;
			if(this.hitInteractives.length > 1) {
				var _g2 = 0;
				var _g11 = this.hitInteractives;
				while(_g2 < _g11.length) {
					var i1 = _g11[_g2];
					++_g2;
					var m = i1.invPos;
					var p2 = i1.hitPoint.clone();
					p2.transform3x4(i1.absPos);
					p2.project(this.camera.m);
					i1.hitPoint.w = p2.z;
				}
				this.hitInteractives.sort($bind(this,this.sortHitPointByCameraDistance));
			}
			this.hitInteractives.unshift(null);
		}
		while(this.hitInteractives.length > 0) {
			var i2 = this.hitInteractives.pop();
			if(i2 == null) return null;
			event.relX = i2.hitPoint.x;
			event.relY = i2.hitPoint.y;
			event.relZ = i2.hitPoint.z;
			i2.handleEvent(event);
			if(event.cancel) {
				event.cancel = false;
				event.propagate = true;
				continue;
			}
			if(!event.propagate) this.hitInteractives = [];
			return i2;
		}
		return null;
	}
	,addPass: function(p,before) {
		if(before == null) before = false;
		if(before) this.prePasses.push(p); else this.postPasses.push(p);
	}
	,addEventTarget: function(i) {
		this.interactives.push(i);
	}
	,removeEventTarget: function(i) {
		if(HxOverrides.remove(this.interactives,i) && this.events != null) this.events.onRemove(i);
	}
	,setElapsedTime: function(elapsedTime) {
		this.ctx.elapsedTime = elapsedTime;
	}
	,render: function(engine) {
		if(!((this.flags & 32) != 0)) this.onAlloc();
		this.camera.screenRatio = engine.width / engine.height;
		this.camera.update();
		this.ctx.camera = this.camera;
		this.ctx.engine = engine;
		this.ctx.start();
		var _g = 0;
		var _g1 = this.prePasses;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			p.render(engine);
		}
		this.syncRec(this.ctx);
		this.emitRec(this.ctx);
		this.ctx.passes = haxe_ds_ListSort.sortSingleLinked(this.ctx.passes,function(p1,p2) {
			return p1.pass.passId - p2.pass.passId;
		});
		var curPass = this.ctx.passes;
		var passes = [];
		while(curPass != null) {
			var passId = curPass.pass.passId;
			var p3 = curPass;
			var prev = null;
			while(p3 != null && p3.pass.passId == passId) {
				prev = p3;
				p3 = p3.next;
			}
			prev.next = null;
			passes.push(new h3d_scene_PassGroup(curPass.pass.name,curPass));
			curPass = p3;
		}
		this.ctx.lightSystem = this.lightSystem;
		this.lightSystem.initLights(this.ctx);
		this.renderer.process(passes);
		this.ctx.done();
		var _g2 = 0;
		var _g11 = this.postPasses;
		while(_g2 < _g11.length) {
			var p4 = _g11[_g2];
			++_g2;
			p4.render(engine);
		}
		this.ctx.camera = null;
		this.ctx.engine = null;
	}
	,__class__: h3d_scene_Scene
});
var h3d_shader_AlphaChannel = function() { };
$hxClasses["h3d.shader.AlphaChannel"] = h3d_shader_AlphaChannel;
h3d_shader_AlphaChannel.__name__ = ["h3d","shader","AlphaChannel"];
h3d_shader_AlphaChannel.__super__ = hxsl_Shader;
h3d_shader_AlphaChannel.prototype = $extend(hxsl_Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		if(this.showAlpha__) this.constBits |= 1;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.showAlpha__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_AlphaChannel
});
var h3d_shader_AlphaMap = function() {
	this.uvDelta__ = new h3d_Vector();
	this.uvScale__ = new h3d_Vector();
};
$hxClasses["h3d.shader.AlphaMap"] = h3d_shader_AlphaMap;
h3d_shader_AlphaMap.__name__ = ["h3d","shader","AlphaMap"];
h3d_shader_AlphaMap.__super__ = hxsl_Shader;
h3d_shader_AlphaMap.prototype = $extend(hxsl_Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.texture__;
		case 1:
			return this.uvScale__;
		case 2:
			return this.uvDelta__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_AlphaMap
});
var h3d_shader_AmbientLight = function() {
	hxsl_Shader.call(this);
};
$hxClasses["h3d.shader.AmbientLight"] = h3d_shader_AmbientLight;
h3d_shader_AmbientLight.__name__ = ["h3d","shader","AmbientLight"];
h3d_shader_AmbientLight.__super__ = hxsl_Shader;
h3d_shader_AmbientLight.prototype = $extend(hxsl_Shader.prototype,{
	set_additive: function(_v) {
		this.constModified = true;
		return this.additive__ = _v;
	}
	,updateConstants: function(globals) {
		this.constBits = 0;
		if(this.additive__) this.constBits |= 1;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.additive__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_AmbientLight
});
var h3d_shader_AnimatedTexture = function() {
	this.speed__ = 0;
	this.totalFrames__ = 0;
	this.frameDivision__ = new h3d_Vector();
	this.startTime__ = 0;
};
$hxClasses["h3d.shader.AnimatedTexture"] = h3d_shader_AnimatedTexture;
h3d_shader_AnimatedTexture.__name__ = ["h3d","shader","AnimatedTexture"];
h3d_shader_AnimatedTexture.__super__ = hxsl_Shader;
h3d_shader_AnimatedTexture.prototype = $extend(hxsl_Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		if(this.loop__) this.constBits |= 1;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.startTime__;
		case 1:
			return this.loop__;
		case 2:
			return this.texture__;
		case 3:
			return this.frameDivision__;
		case 4:
			return this.totalFrames__;
		case 5:
			return this.speed__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_AnimatedTexture
});
var h3d_shader_Base2d = function() {
	this.viewport__ = new h3d_Vector();
	this.filterMatrixB__ = new h3d_Vector();
	this.filterMatrixA__ = new h3d_Vector();
	this.color__ = new h3d_Vector();
	this.absoluteMatrixB__ = new h3d_Vector();
	this.uvPos__ = new h3d_Vector();
	this.halfPixelInverse__ = new h3d_Vector();
	this.absoluteMatrixA__ = new h3d_Vector();
	this.zValue__ = 0;
	hxsl_Shader.call(this);
};
$hxClasses["h3d.shader.Base2d"] = h3d_shader_Base2d;
h3d_shader_Base2d.__name__ = ["h3d","shader","Base2d"];
h3d_shader_Base2d.__super__ = hxsl_Shader;
h3d_shader_Base2d.prototype = $extend(hxsl_Shader.prototype,{
	set_hasUVPos: function(_v) {
		this.constModified = true;
		return this.hasUVPos__ = _v;
	}
	,set_pixelAlign: function(_v) {
		this.constModified = true;
		return this.pixelAlign__ = _v;
	}
	,set_isRelative: function(_v) {
		this.constModified = true;
		return this.isRelative__ = _v;
	}
	,updateConstants: function(globals) {
		this.constBits = 0;
		if(this.hasUVPos__) this.constBits |= 1;
		if(this.pixelAlign__) this.constBits |= 2;
		if(this.isRelative__) this.constBits |= 4;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.zValue__;
		case 1:
			return this.absoluteMatrixA__;
		case 2:
			return this.hasUVPos__;
		case 3:
			return this.texture__;
		case 4:
			return this.pixelAlign__;
		case 5:
			return this.halfPixelInverse__;
		case 6:
			return this.uvPos__;
		case 7:
			return this.isRelative__;
		case 8:
			return this.absoluteMatrixB__;
		case 9:
			return this.color__;
		case 10:
			return this.filterMatrixA__;
		case 11:
			return this.filterMatrixB__;
		case 12:
			return this.viewport__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_Base2d
});
var h3d_shader_BaseMesh = function() {
	this.color__ = new h3d_Vector();
	this.specularPower__ = 0;
	this.specularColor__ = new h3d_Vector();
	this.specularAmount__ = 0;
	hxsl_Shader.call(this);
	this.color__.set(1,1,1,null);
	this.specularColor__.set(1,1,1,null);
	this.specularPower__ = 50;
	this.specularAmount__ = 1;
};
$hxClasses["h3d.shader.BaseMesh"] = h3d_shader_BaseMesh;
h3d_shader_BaseMesh.__name__ = ["h3d","shader","BaseMesh"];
h3d_shader_BaseMesh.__super__ = hxsl_Shader;
h3d_shader_BaseMesh.prototype = $extend(hxsl_Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.specularAmount__;
		case 1:
			return this.specularColor__;
		case 2:
			return this.specularPower__;
		case 3:
			return this.color__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_BaseMesh
});
var h3d_shader_Bloom = function() {
	this.power__ = 0;
	this.amount__ = 0;
};
$hxClasses["h3d.shader.Bloom"] = h3d_shader_Bloom;
h3d_shader_Bloom.__name__ = ["h3d","shader","Bloom"];
h3d_shader_Bloom.__super__ = h3d_shader_ScreenShader;
h3d_shader_Bloom.prototype = $extend(h3d_shader_ScreenShader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.amount__;
		case 1:
			return this.texture__;
		case 2:
			return this.power__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_Bloom
});
var h3d_shader_Blur = function() {
	this.cameraInverseViewProj__ = new h3d_Matrix();
	this.values__ = [];
	this.fixedColor__ = new h3d_Vector();
	this.pixel__ = new h3d_Vector();
	this.Quality__ = 0;
	h3d_shader_ScreenShader.call(this);
};
$hxClasses["h3d.shader.Blur"] = h3d_shader_Blur;
h3d_shader_Blur.__name__ = ["h3d","shader","Blur"];
h3d_shader_Blur.__super__ = h3d_shader_ScreenShader;
h3d_shader_Blur.prototype = $extend(h3d_shader_ScreenShader.prototype,{
	set_Quality: function(_v) {
		this.constModified = true;
		return this.Quality__ = _v;
	}
	,set_isDepth: function(_v) {
		this.constModified = true;
		return this.isDepth__ = _v;
	}
	,set_cameraInverseViewProj: function(_v) {
		return this.cameraInverseViewProj__ = _v;
	}
	,updateConstants: function(globals) {
		this.constBits = 0;
		var v = this.Quality__;
		if(v >>> 8 != 0) throw new js__$Boot_HaxeError("Quality" + " is out of range " + v + ">" + 255);
		this.constBits |= v;
		if(this.hasFixedColor__) this.constBits |= 256;
		if(this.isDepth__) this.constBits |= 512;
		if(this.isDepthDependant__) this.constBits |= 1024;
		if(this.hasNormal__) this.constBits |= 2048;
		if(this.smoothFixedColor__) this.constBits |= 4096;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.Quality__;
		case 1:
			return this.pixel__;
		case 2:
			return this.hasFixedColor__;
		case 3:
			return this.fixedColor__;
		case 4:
			return this.values__;
		case 5:
			return this.texture__;
		case 6:
			return this.isDepth__;
		case 7:
			return this.normalTexture__;
		case 8:
			return this.isDepthDependant__;
		case 9:
			return this.hasNormal__;
		case 10:
			return this.cameraInverseViewProj__;
		case 11:
			return this.depthTexture__;
		case 12:
			return this.smoothFixedColor__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_Blur
});
var h3d_shader_ShaderBuffers = function(s) {
	var this1;
	this1 = new Array(s.globalsSize << 2);
	this.globals = this1;
	var this2;
	this2 = new Array(s.paramsSize << 2);
	this.params = this2;
	var this3;
	this3 = new Array(s.textures2DCount + s.texturesCubeCount);
	this.tex = this3;
};
$hxClasses["h3d.shader.ShaderBuffers"] = h3d_shader_ShaderBuffers;
h3d_shader_ShaderBuffers.__name__ = ["h3d","shader","ShaderBuffers"];
h3d_shader_ShaderBuffers.prototype = {
	grow: function(s) {
		var ng = s.globalsSize << 2;
		var np = s.paramsSize << 2;
		var nt = s.textures2DCount + s.texturesCubeCount;
		if(this.globals.length < ng) {
			var this1;
			this1 = new Array(ng);
			this.globals = this1;
		}
		if(this.params.length < np) {
			var this2;
			this2 = new Array(np);
			this.params = this2;
		}
		if(this.tex.length < nt) {
			var this3;
			this3 = new Array(nt);
			this.tex = this3;
		}
	}
	,__class__: h3d_shader_ShaderBuffers
};
var h3d_shader_Buffers = function(s) {
	this.vertex = new h3d_shader_ShaderBuffers(s.vertex);
	this.fragment = new h3d_shader_ShaderBuffers(s.fragment);
};
$hxClasses["h3d.shader.Buffers"] = h3d_shader_Buffers;
h3d_shader_Buffers.__name__ = ["h3d","shader","Buffers"];
h3d_shader_Buffers.prototype = {
	grow: function(s) {
		this.vertex.grow(s.vertex);
		this.fragment.grow(s.fragment);
	}
	,__class__: h3d_shader_Buffers
};
var h3d_shader_ChannelSelect = function() {
	this.bits__ = 0;
};
$hxClasses["h3d.shader.ChannelSelect"] = h3d_shader_ChannelSelect;
h3d_shader_ChannelSelect.__name__ = ["h3d","shader","ChannelSelect"];
h3d_shader_ChannelSelect.__super__ = hxsl_Shader;
h3d_shader_ChannelSelect.prototype = $extend(hxsl_Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		var v = this.bits__;
		if(v >>> 8 != 0) throw new js__$Boot_HaxeError("bits" + " is out of range " + v + ">" + 255);
		this.constBits |= v;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.bits__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_ChannelSelect
});
var h3d_shader_ColorAdd = function() {
	this.color__ = new h3d_Vector();
};
$hxClasses["h3d.shader.ColorAdd"] = h3d_shader_ColorAdd;
h3d_shader_ColorAdd.__name__ = ["h3d","shader","ColorAdd"];
h3d_shader_ColorAdd.__super__ = hxsl_Shader;
h3d_shader_ColorAdd.prototype = $extend(hxsl_Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.color__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_ColorAdd
});
var h3d_shader_ColorKey = function() {
	this.colorKey__ = new h3d_Vector();
};
$hxClasses["h3d.shader.ColorKey"] = h3d_shader_ColorKey;
h3d_shader_ColorKey.__name__ = ["h3d","shader","ColorKey"];
h3d_shader_ColorKey.__super__ = hxsl_Shader;
h3d_shader_ColorKey.prototype = $extend(hxsl_Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.colorKey__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_ColorKey
});
var h3d_shader_ColorMatrix = function() {
	this.matrix__ = new h3d_Matrix();
};
$hxClasses["h3d.shader.ColorMatrix"] = h3d_shader_ColorMatrix;
h3d_shader_ColorMatrix.__name__ = ["h3d","shader","ColorMatrix"];
h3d_shader_ColorMatrix.__super__ = hxsl_Shader;
h3d_shader_ColorMatrix.prototype = $extend(hxsl_Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.matrix__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_ColorMatrix
});
var h3d_shader_DirLight = function() {
	this.direction__ = new h3d_Vector();
	this.color__ = new h3d_Vector();
	hxsl_Shader.call(this);
	this.color__.set(1,1,1,null);
};
$hxClasses["h3d.shader.DirLight"] = h3d_shader_DirLight;
h3d_shader_DirLight.__name__ = ["h3d","shader","DirLight"];
h3d_shader_DirLight.__super__ = hxsl_Shader;
h3d_shader_DirLight.prototype = $extend(hxsl_Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		if(this.enableSpecular__) this.constBits |= 1;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.enableSpecular__;
		case 1:
			return this.color__;
		case 2:
			return this.direction__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_DirLight
});
var h3d_shader_Displacement = function() {
	this.displacement__ = new h3d_Vector();
	this.normalScale__ = new h3d_Vector();
	this.normalPos__ = new h3d_Vector();
};
$hxClasses["h3d.shader.Displacement"] = h3d_shader_Displacement;
h3d_shader_Displacement.__name__ = ["h3d","shader","Displacement"];
h3d_shader_Displacement.__super__ = h3d_shader_ScreenShader;
h3d_shader_Displacement.prototype = $extend(h3d_shader_ScreenShader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.texture__;
		case 1:
			return this.normalPos__;
		case 2:
			return this.normalScale__;
		case 3:
			return this.normalMap__;
		case 4:
			return this.displacement__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_Displacement
});
var h3d_shader_FixedColor = function() {
	this.viewport__ = new h3d_Vector();
	this.colorID__ = new h3d_Vector();
};
$hxClasses["h3d.shader.FixedColor"] = h3d_shader_FixedColor;
h3d_shader_FixedColor.__name__ = ["h3d","shader","FixedColor"];
h3d_shader_FixedColor.__super__ = hxsl_Shader;
h3d_shader_FixedColor.prototype = $extend(hxsl_Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.colorID__;
		case 1:
			return this.viewport__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_FixedColor
});
var h3d_shader_GpuParticle = function() {
	this.fadePower__ = 0;
	this.speedIncr__ = 0;
};
$hxClasses["h3d.shader.GpuParticle"] = h3d_shader_GpuParticle;
h3d_shader_GpuParticle.__name__ = ["h3d","shader","GpuParticle"];
h3d_shader_GpuParticle.__super__ = hxsl_Shader;
h3d_shader_GpuParticle.prototype = $extend(hxsl_Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.speedIncr__;
		case 1:
			return this.fadePower__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_GpuParticle
});
var h3d_shader_KillAlpha = function() {
	this.threshold__ = 0;
};
$hxClasses["h3d.shader.KillAlpha"] = h3d_shader_KillAlpha;
h3d_shader_KillAlpha.__name__ = ["h3d","shader","KillAlpha"];
h3d_shader_KillAlpha.__super__ = hxsl_Shader;
h3d_shader_KillAlpha.prototype = $extend(hxsl_Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.threshold__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_KillAlpha
});
var h3d_shader_LineShader = function() {
	this.width__ = 0;
	this.lengthScale__ = 0;
};
$hxClasses["h3d.shader.LineShader"] = h3d_shader_LineShader;
h3d_shader_LineShader.__name__ = ["h3d","shader","LineShader"];
h3d_shader_LineShader.__super__ = hxsl_Shader;
h3d_shader_LineShader.prototype = $extend(hxsl_Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.lengthScale__;
		case 1:
			return this.width__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_LineShader
});
var h3d_shader_Manager = function(output) {
	this.shaderCache = hxsl_Cache.get();
	this.globals = new hxsl_Globals();
	this.output = this.shaderCache.allocOutputVars(output);
};
$hxClasses["h3d.shader.Manager"] = h3d_shader_Manager;
h3d_shader_Manager.__name__ = ["h3d","shader","Manager"];
h3d_shader_Manager.prototype = {
	fillRec: function(v,type,out,pos) {
		switch(type[1]) {
		case 3:
			var val = v;
			out[pos] = val;
			return 1;
		case 5:
			var n = type[2];
			var v1 = v;
			var index = pos++;
			out[index] = v1.x;
			var index1 = pos++;
			out[index1] = v1.y;
			switch(n) {
			case 3:
				var index2 = pos++;
				out[index2] = v1.z;
				break;
			case 4:
				var index3 = pos++;
				out[index3] = v1.z;
				var index4 = pos++;
				out[index4] = v1.w;
				break;
			}
			return n;
		case 7:
			var m = v;
			var index5 = pos++;
			out[index5] = m._11;
			var index6 = pos++;
			out[index6] = m._21;
			var index7 = pos++;
			out[index7] = m._31;
			var index8 = pos++;
			out[index8] = m._41;
			var index9 = pos++;
			out[index9] = m._12;
			var index10 = pos++;
			out[index10] = m._22;
			var index11 = pos++;
			out[index11] = m._32;
			var index12 = pos++;
			out[index12] = m._42;
			var index13 = pos++;
			out[index13] = m._13;
			var index14 = pos++;
			out[index14] = m._23;
			var index15 = pos++;
			out[index15] = m._33;
			var index16 = pos++;
			out[index16] = m._43;
			var index17 = pos++;
			out[index17] = m._14;
			var index18 = pos++;
			out[index18] = m._24;
			var index19 = pos++;
			out[index19] = m._34;
			var index20 = pos++;
			out[index20] = m._44;
			return 16;
		case 8:
			var m1 = v;
			var index21 = pos++;
			out[index21] = m1._11;
			var index22 = pos++;
			out[index22] = m1._21;
			var index23 = pos++;
			out[index23] = m1._31;
			var index24 = pos++;
			out[index24] = m1._41;
			var index25 = pos++;
			out[index25] = m1._12;
			var index26 = pos++;
			out[index26] = m1._22;
			var index27 = pos++;
			out[index27] = m1._32;
			var index28 = pos++;
			out[index28] = m1._42;
			var index29 = pos++;
			out[index29] = m1._13;
			var index30 = pos++;
			out[index30] = m1._23;
			var index31 = pos++;
			out[index31] = m1._33;
			var index32 = pos++;
			out[index32] = m1._43;
			return 12;
		case 6:
			var m2 = v;
			var index33 = pos++;
			out[index33] = m2._11;
			var index34 = pos++;
			out[index34] = m2._21;
			var index35 = pos++;
			out[index35] = m2._31;
			var index36 = pos++;
			out[index36] = 0;
			var index37 = pos++;
			out[index37] = m2._12;
			var index38 = pos++;
			out[index38] = m2._22;
			var index39 = pos++;
			out[index39] = m2._32;
			var index40 = pos++;
			out[index40] = 0;
			var index41 = pos++;
			out[index41] = m2._13;
			var index42 = pos++;
			out[index42] = m2._23;
			var index43 = pos++;
			out[index43] = m2._33;
			var index44 = pos++;
			out[index44] = 0;
			return 12;
		case 14:
			var t = type[2];
			switch(type[2][1]) {
			case 5:
				switch(type[2][2]) {
				case 4:
					switch(type[2][3][1]) {
					case 1:
						switch(type[3][1]) {
						case 0:
							var len = type[3][2];
							var v2 = v;
							var _g = 0;
							while(_g < len) {
								var i = _g++;
								var n1 = v2[i];
								if(n1 == null) break;
								var index45 = pos++;
								out[index45] = n1.x;
								var index46 = pos++;
								out[index46] = n1.y;
								var index47 = pos++;
								out[index47] = n1.z;
								var index48 = pos++;
								out[index48] = n1.w;
							}
							return len * 4;
						default:
							throw new js__$Boot_HaxeError("assert " + Std.string(type));
						}
						break;
					default:
						switch(type[3][1]) {
						case 0:
							var len1 = type[3][2];
							var v3 = v;
							var size = 0;
							var _g1 = 0;
							while(_g1 < len1) {
								var i1 = _g1++;
								var n2 = v3[i1];
								if(n2 == null) break;
								size = this.fillRec(n2,t,out,pos);
								pos += size;
							}
							return len1 * size;
						default:
							throw new js__$Boot_HaxeError("assert " + Std.string(type));
						}
					}
					break;
				default:
					switch(type[3][1]) {
					case 0:
						var len2 = type[3][2];
						var v4 = v;
						var size1 = 0;
						var _g2 = 0;
						while(_g2 < len2) {
							var i2 = _g2++;
							var n3 = v4[i2];
							if(n3 == null) break;
							size1 = this.fillRec(n3,t,out,pos);
							pos += size1;
						}
						return len2 * size1;
					default:
						throw new js__$Boot_HaxeError("assert " + Std.string(type));
					}
				}
				break;
			case 8:
				switch(type[3][1]) {
				case 0:
					var len3 = type[3][2];
					var v5 = v;
					var _g3 = 0;
					while(_g3 < len3) {
						var i3 = _g3++;
						var m3 = v5[i3];
						if(m3 == null) break;
						var index49 = pos++;
						out[index49] = m3._11;
						var index50 = pos++;
						out[index50] = m3._21;
						var index51 = pos++;
						out[index51] = m3._31;
						var index52 = pos++;
						out[index52] = m3._41;
						var index53 = pos++;
						out[index53] = m3._12;
						var index54 = pos++;
						out[index54] = m3._22;
						var index55 = pos++;
						out[index55] = m3._32;
						var index56 = pos++;
						out[index56] = m3._42;
						var index57 = pos++;
						out[index57] = m3._13;
						var index58 = pos++;
						out[index58] = m3._23;
						var index59 = pos++;
						out[index59] = m3._33;
						var index60 = pos++;
						out[index60] = m3._43;
					}
					return len3 * 12;
				default:
					throw new js__$Boot_HaxeError("assert " + Std.string(type));
				}
				break;
			default:
				switch(type[3][1]) {
				case 0:
					var len4 = type[3][2];
					var v6 = v;
					var size2 = 0;
					var _g4 = 0;
					while(_g4 < len4) {
						var i4 = _g4++;
						var n4 = v6[i4];
						if(n4 == null) break;
						size2 = this.fillRec(n4,t,out,pos);
						pos += size2;
					}
					return len4 * size2;
				default:
					throw new js__$Boot_HaxeError("assert " + Std.string(type));
				}
			}
			break;
		case 12:
			var vl = type[2];
			var tot = 0;
			var _g5 = 0;
			while(_g5 < vl.length) {
				var vv = vl[_g5];
				++_g5;
				tot += this.fillRec(Reflect.field(v,vv.name),vv.type,out,pos + tot);
			}
			return tot;
		default:
			throw new js__$Boot_HaxeError("assert " + Std.string(type));
		}
		return 0;
	}
	,getParamValue: function(p,shaders) {
		if(p.perObjectGlobal != null) {
			var v1 = this.globals.map.h[p.perObjectGlobal.gid];
			if(v1 == null) throw new js__$Boot_HaxeError("Missing global value " + p.perObjectGlobal.path);
			return v1;
		}
		var si = shaders;
		var n = p.instance;
		while(n-- > 0) si = si.next;
		var v = si.s.getParamValue(p.index);
		if(v == null) throw new js__$Boot_HaxeError("Missing param value " + Std.string(si.s) + "." + p.name);
		return v;
	}
	,fillGlobals: function(buf,s) {
		var _g = this;
		var buf1 = buf.vertex;
		var s1 = s.vertex;
		var g = s1.globals;
		while(g != null) {
			var v = _g.globals.map.h[g.gid];
			if(v == null) {
				if(g.path == "__consts__") {
					_g.fillRec(s1.consts,g.type,buf1.globals,g.pos);
					g = g.next;
					continue;
				}
				throw new js__$Boot_HaxeError("Missing global value " + g.path);
			}
			_g.fillRec(v,g.type,buf1.globals,g.pos);
			g = g.next;
		}
		var buf2 = buf.fragment;
		var s2 = s.fragment;
		var g1 = s2.globals;
		while(g1 != null) {
			var v1 = _g.globals.map.h[g1.gid];
			if(v1 == null) {
				if(g1.path == "__consts__") {
					_g.fillRec(s2.consts,g1.type,buf2.globals,g1.pos);
					g1 = g1.next;
					continue;
				}
				throw new js__$Boot_HaxeError("Missing global value " + g1.path);
			}
			_g.fillRec(v1,g1.type,buf2.globals,g1.pos);
			g1 = g1.next;
		}
	}
	,fillParams: function(buf,s,shaders) {
		var _g = this;
		var buf1 = buf.vertex;
		var s1 = s.vertex;
		var p = s1.params;
		while(p != null) {
			var v = _g.getParamValue(p,shaders);
			_g.fillRec(v,p.type,buf1.params,p.pos);
			p = p.next;
		}
		var tid = 0;
		var p1 = s1.textures2D;
		while(p1 != null) {
			var t = _g.getParamValue(p1,shaders);
			if(t == null) t = h3d_mat_Texture.fromColor(16711935);
			var index = tid++;
			buf1.tex[index] = t;
			p1 = p1.next;
		}
		var p2 = s1.texturesCube;
		while(p2 != null) {
			var t1 = _g.getParamValue(p2,shaders);
			if(t1 == null) t1 = h3d_mat_Texture.fromColor(16711935);
			var index1 = tid++;
			buf1.tex[index1] = t1;
			p2 = p2.next;
		}
		var buf2 = buf.fragment;
		var s2 = s.fragment;
		var p3 = s2.params;
		while(p3 != null) {
			var v1 = _g.getParamValue(p3,shaders);
			_g.fillRec(v1,p3.type,buf2.params,p3.pos);
			p3 = p3.next;
		}
		var tid1 = 0;
		var p4 = s2.textures2D;
		while(p4 != null) {
			var t2 = _g.getParamValue(p4,shaders);
			if(t2 == null) t2 = h3d_mat_Texture.fromColor(16711935);
			var index2 = tid1++;
			buf2.tex[index2] = t2;
			p4 = p4.next;
		}
		var p5 = s2.texturesCube;
		while(p5 != null) {
			var t3 = _g.getParamValue(p5,shaders);
			if(t3 == null) t3 = h3d_mat_Texture.fromColor(16711935);
			var index3 = tid1++;
			buf2.tex[index3] = t3;
			p5 = p5.next;
		}
	}
	,compileShaders: function(shaders) {
		var _g = new hxsl__$ShaderList_ShaderIterator(shaders,null);
		while(_g.l != _g.last) {
			var s = _g.next();
			s.updateConstants(this.globals);
		}
		return this.shaderCache.link(shaders,this.output);
	}
	,__class__: h3d_shader_Manager
};
var h3d_shader_Outline = function() {
	this.distance__ = 0;
	this.color__ = new h3d_Vector();
	this.size__ = 0;
};
$hxClasses["h3d.shader.Outline"] = h3d_shader_Outline;
h3d_shader_Outline.__name__ = ["h3d","shader","Outline"];
h3d_shader_Outline.__super__ = hxsl_Shader;
h3d_shader_Outline.prototype = $extend(hxsl_Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.size__;
		case 1:
			return this.color__;
		case 2:
			return this.distance__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_Outline
});
var h3d_shader_ParticleShader = function() {
	this.size__ = new h3d_Vector();
	this.rotationAxis__ = new h3d_Matrix();
};
$hxClasses["h3d.shader.ParticleShader"] = h3d_shader_ParticleShader;
h3d_shader_ParticleShader.__name__ = ["h3d","shader","ParticleShader"];
h3d_shader_ParticleShader.__super__ = hxsl_Shader;
h3d_shader_ParticleShader.prototype = $extend(hxsl_Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		if(this.isAbsolute__) this.constBits |= 1;
		if(this.is3D__) this.constBits |= 2;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.rotationAxis__;
		case 1:
			return this.size__;
		case 2:
			return this.isAbsolute__;
		case 3:
			return this.is3D__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_ParticleShader
});
var h3d_shader_PointLight = function() {
	this.params__ = new h3d_Vector();
	this.color__ = new h3d_Vector();
	this.lightPosition__ = new h3d_Vector();
};
$hxClasses["h3d.shader.PointLight"] = h3d_shader_PointLight;
h3d_shader_PointLight.__name__ = ["h3d","shader","PointLight"];
h3d_shader_PointLight.__super__ = hxsl_Shader;
h3d_shader_PointLight.prototype = $extend(hxsl_Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.lightPosition__;
		case 1:
			return this.color__;
		case 2:
			return this.params__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_PointLight
});
var h3d_shader_SAO = function() {
	this.numSpiralTurns__ = 0;
	this.cameraInverseViewProj__ = new h3d_Matrix();
	this.numSamples__ = 0;
	this.screenRatio__ = new h3d_Vector();
	this.sampleRadius__ = 0;
	this.cameraView__ = new h3d_Matrix();
	this.bias__ = 0;
	this.fovTan__ = 0;
	this.intensity__ = 0;
	this.noiseScale__ = new h3d_Vector();
};
$hxClasses["h3d.shader.SAO"] = h3d_shader_SAO;
h3d_shader_SAO.__name__ = ["h3d","shader","SAO"];
h3d_shader_SAO.__super__ = h3d_shader_ScreenShader;
h3d_shader_SAO.prototype = $extend(h3d_shader_ScreenShader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		var v = this.numSamples__;
		if(v >>> 8 != 0) throw new js__$Boot_HaxeError("numSamples" + " is out of range " + v + ">" + 255);
		this.constBits |= v;
		var v1 = this.numSpiralTurns__;
		if(v1 >>> 8 != 0) throw new js__$Boot_HaxeError("numSpiralTurns" + " is out of range " + v1 + ">" + 255);
		this.constBits |= v1 << 8;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.noiseScale__;
		case 1:
			return this.intensity__;
		case 2:
			return this.fovTan__;
		case 3:
			return this.normalTexture__;
		case 4:
			return this.bias__;
		case 5:
			return this.cameraView__;
		case 6:
			return this.sampleRadius__;
		case 7:
			return this.screenRatio__;
		case 8:
			return this.numSamples__;
		case 9:
			return this.cameraInverseViewProj__;
		case 10:
			return this.numSpiralTurns__;
		case 11:
			return this.depthTexture__;
		case 12:
			return this.noiseTexture__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_SAO
});
var h3d_shader_Shadow = function() { };
$hxClasses["h3d.shader.Shadow"] = h3d_shader_Shadow;
h3d_shader_Shadow.__name__ = ["h3d","shader","Shadow"];
h3d_shader_Shadow.__super__ = hxsl_Shader;
h3d_shader_Shadow.prototype = $extend(hxsl_Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		if(this.perPixel__) this.constBits |= 1;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.perPixel__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_Shadow
});
var h3d_shader_SinusDeform = function() {
	this.speed__ = 0;
	this.frequency__ = 0;
	this.amplitude__ = 0;
};
$hxClasses["h3d.shader.SinusDeform"] = h3d_shader_SinusDeform;
h3d_shader_SinusDeform.__name__ = ["h3d","shader","SinusDeform"];
h3d_shader_SinusDeform.__super__ = hxsl_Shader;
h3d_shader_SinusDeform.prototype = $extend(hxsl_Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.amplitude__;
		case 1:
			return this.frequency__;
		case 2:
			return this.speed__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_SinusDeform
});
var h3d_shader_Skin = function() {
	this.MaxBones__ = 0;
	this.bonesMatrixes__ = [];
};
$hxClasses["h3d.shader.Skin"] = h3d_shader_Skin;
h3d_shader_Skin.__name__ = ["h3d","shader","Skin"];
h3d_shader_Skin.__super__ = hxsl_Shader;
h3d_shader_Skin.prototype = $extend(hxsl_Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		var v = this.MaxBones__;
		if(v >>> 8 != 0) throw new js__$Boot_HaxeError("MaxBones" + " is out of range " + v + ">" + 255);
		this.constBits |= v;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.bonesMatrixes__;
		case 1:
			return this.MaxBones__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_Skin
});
var h3d_shader_SpecularTexture = function() { };
$hxClasses["h3d.shader.SpecularTexture"] = h3d_shader_SpecularTexture;
h3d_shader_SpecularTexture.__name__ = ["h3d","shader","SpecularTexture"];
h3d_shader_SpecularTexture.__super__ = hxsl_Shader;
h3d_shader_SpecularTexture.prototype = $extend(hxsl_Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.texture__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_SpecularTexture
});
var h3d_shader_Texture = function(tex) {
	this.killAlphaThreshold__ = 0;
	hxsl_Shader.call(this);
	this.texture__ = tex;
	this.killAlphaThreshold__ = h3d_mat_Defaults.defaultKillAlphaThreshold;
};
$hxClasses["h3d.shader.Texture"] = h3d_shader_Texture;
h3d_shader_Texture.__name__ = ["h3d","shader","Texture"];
h3d_shader_Texture.__super__ = hxsl_Shader;
h3d_shader_Texture.prototype = $extend(hxsl_Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		if(this.additive__) this.constBits |= 1;
		if(this.specularAlpha__) this.constBits |= 2;
		if(this.killAlpha__) this.constBits |= 4;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.additive__;
		case 1:
			return this.texture__;
		case 2:
			return this.specularAlpha__;
		case 3:
			return this.killAlphaThreshold__;
		case 4:
			return this.killAlpha__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_Texture
});
var h3d_shader_Texture2 = function() {
	this.killAlphaThreshold__ = 0;
};
$hxClasses["h3d.shader.Texture2"] = h3d_shader_Texture2;
h3d_shader_Texture2.__name__ = ["h3d","shader","Texture2"];
h3d_shader_Texture2.__super__ = hxsl_Shader;
h3d_shader_Texture2.prototype = $extend(hxsl_Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		if(this.additive__) this.constBits |= 1;
		if(this.killAlpha__) this.constBits |= 2;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.additive__;
		case 1:
			return this.texture__;
		case 2:
			return this.killAlphaThreshold__;
		case 3:
			return this.killAlpha__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_Texture2
});
var h3d_shader_UVAnim = function() {
	this.speed__ = 0;
	this.totalFrames__ = 0;
	this.frameDivision__ = 0;
	this.startTime__ = 0;
};
$hxClasses["h3d.shader.UVAnim"] = h3d_shader_UVAnim;
h3d_shader_UVAnim.__name__ = ["h3d","shader","UVAnim"];
h3d_shader_UVAnim.__super__ = hxsl_Shader;
h3d_shader_UVAnim.prototype = $extend(hxsl_Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		if(this.loop__) this.constBits |= 1;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.startTime__;
		case 1:
			return this.loop__;
		case 2:
			return this.frameDivision__;
		case 3:
			return this.totalFrames__;
		case 4:
			return this.speed__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_UVAnim
});
var h3d_shader_UVDelta = function() {
	this.uvDelta__ = new h3d_Vector();
};
$hxClasses["h3d.shader.UVDelta"] = h3d_shader_UVDelta;
h3d_shader_UVDelta.__name__ = ["h3d","shader","UVDelta"];
h3d_shader_UVDelta.__super__ = hxsl_Shader;
h3d_shader_UVDelta.prototype = $extend(hxsl_Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.uvDelta__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_UVDelta
});
var h3d_shader_UVScroll = function() {
	this.uvSpeed__ = new h3d_Vector();
};
$hxClasses["h3d.shader.UVScroll"] = h3d_shader_UVScroll;
h3d_shader_UVScroll.__name__ = ["h3d","shader","UVScroll"];
h3d_shader_UVScroll.__super__ = hxsl_Shader;
h3d_shader_UVScroll.prototype = $extend(hxsl_Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.uvSpeed__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_UVScroll
});
var h3d_shader_VertexColor = function() { };
$hxClasses["h3d.shader.VertexColor"] = h3d_shader_VertexColor;
h3d_shader_VertexColor.__name__ = ["h3d","shader","VertexColor"];
h3d_shader_VertexColor.__super__ = hxsl_Shader;
h3d_shader_VertexColor.prototype = $extend(hxsl_Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		if(this.additive__) this.constBits |= 1;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.additive__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_VertexColor
});
var h3d_shader_VertexColorAlpha = function() { };
$hxClasses["h3d.shader.VertexColorAlpha"] = h3d_shader_VertexColorAlpha;
h3d_shader_VertexColorAlpha.__name__ = ["h3d","shader","VertexColorAlpha"];
h3d_shader_VertexColorAlpha.__super__ = hxsl_Shader;
h3d_shader_VertexColorAlpha.prototype = $extend(hxsl_Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		if(this.additive__) this.constBits |= 1;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.additive__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_VertexColorAlpha
});
var h3d_shader_VolumeDecal = function() {
	this.normal__ = new h3d_Vector();
	this.scale__ = new h3d_Vector();
};
$hxClasses["h3d.shader.VolumeDecal"] = h3d_shader_VolumeDecal;
h3d_shader_VolumeDecal.__name__ = ["h3d","shader","VolumeDecal"];
h3d_shader_VolumeDecal.__super__ = hxsl_Shader;
h3d_shader_VolumeDecal.prototype = $extend(hxsl_Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.scale__;
		case 1:
			return this.normal__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_VolumeDecal
});
var h3d_shader_WhiteAlpha = function() { };
$hxClasses["h3d.shader.WhiteAlpha"] = h3d_shader_WhiteAlpha;
h3d_shader_WhiteAlpha.__name__ = ["h3d","shader","WhiteAlpha"];
h3d_shader_WhiteAlpha.__super__ = hxsl_Shader;
h3d_shader_WhiteAlpha.prototype = $extend(hxsl_Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		return null;
	}
	,__class__: h3d_shader_WhiteAlpha
});
var h3d_shader_ZCut = function() {
	this.zMax__ = 0;
	this.zMin__ = 0;
};
$hxClasses["h3d.shader.ZCut"] = h3d_shader_ZCut;
h3d_shader_ZCut.__name__ = ["h3d","shader","ZCut"];
h3d_shader_ZCut.__super__ = hxsl_Shader;
h3d_shader_ZCut.prototype = $extend(hxsl_Shader.prototype,{
	updateConstants: function(globals) {
		this.constBits = 0;
		this.updateConstantsFinal(globals);
	}
	,getParamValue: function(index) {
		switch(index) {
		case 0:
			return this.zMin__;
		case 1:
			return this.zMax__;
		default:
		}
		return null;
	}
	,__class__: h3d_shader_ZCut
});
var haxe_IMap = function() { };
$hxClasses["haxe.IMap"] = haxe_IMap;
haxe_IMap.__name__ = ["haxe","IMap"];
var haxe__$Int64__$_$_$Int64 = function(high,low) {
	this.high = high;
	this.low = low;
};
$hxClasses["haxe._Int64.___Int64"] = haxe__$Int64__$_$_$Int64;
haxe__$Int64__$_$_$Int64.__name__ = ["haxe","_Int64","___Int64"];
haxe__$Int64__$_$_$Int64.prototype = {
	__class__: haxe__$Int64__$_$_$Int64
};
var haxe_Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
$hxClasses["haxe.Timer"] = haxe_Timer;
haxe_Timer.__name__ = ["haxe","Timer"];
haxe_Timer.delay = function(f,time_ms) {
	var t = new haxe_Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe_Timer.stamp = function() {
	return new Date().getTime() / 1000;
};
haxe_Timer.prototype = {
	stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
	,__class__: haxe_Timer
};
var haxe_io_Bytes = function(data) {
	this.length = data.byteLength;
	this.b = new Uint8Array(data);
	this.b.bufferValue = data;
	data.hxBytes = this;
	data.bytes = this.b;
};
$hxClasses["haxe.io.Bytes"] = haxe_io_Bytes;
haxe_io_Bytes.__name__ = ["haxe","io","Bytes"];
haxe_io_Bytes.alloc = function(length) {
	return new haxe_io_Bytes(new ArrayBuffer(length));
};
haxe_io_Bytes.prototype = {
	set: function(pos,v) {
		this.b[pos] = v & 255;
	}
	,blit: function(pos,src,srcpos,len) {
		if(pos < 0 || srcpos < 0 || len < 0 || pos + len > this.length || srcpos + len > src.length) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
		if(srcpos == 0 && len == src.length) this.b.set(src.b,pos); else this.b.set(src.b.subarray(srcpos,srcpos + len),pos);
	}
	,__class__: haxe_io_Bytes
};
var haxe_crypto_Md5 = function() {
};
$hxClasses["haxe.crypto.Md5"] = haxe_crypto_Md5;
haxe_crypto_Md5.__name__ = ["haxe","crypto","Md5"];
haxe_crypto_Md5.encode = function(s) {
	var m = new haxe_crypto_Md5();
	var h = m.doEncode(haxe_crypto_Md5.str2blks(s));
	return m.hex(h);
};
haxe_crypto_Md5.str2blks = function(str) {
	var nblk = (str.length + 8 >> 6) + 1;
	var blks = [];
	var blksSize = nblk * 16;
	var _g = 0;
	while(_g < blksSize) {
		var i1 = _g++;
		blks[i1] = 0;
	}
	var i = 0;
	while(i < str.length) {
		blks[i >> 2] |= HxOverrides.cca(str,i) << (str.length * 8 + i) % 4 * 8;
		i++;
	}
	blks[i >> 2] |= 128 << (str.length * 8 + i) % 4 * 8;
	var l = str.length * 8;
	var k = nblk * 16 - 2;
	blks[k] = l & 255;
	blks[k] |= (l >>> 8 & 255) << 8;
	blks[k] |= (l >>> 16 & 255) << 16;
	blks[k] |= (l >>> 24 & 255) << 24;
	return blks;
};
haxe_crypto_Md5.prototype = {
	bitOR: function(a,b) {
		var lsb = a & 1 | b & 1;
		var msb31 = a >>> 1 | b >>> 1;
		return msb31 << 1 | lsb;
	}
	,bitXOR: function(a,b) {
		var lsb = a & 1 ^ b & 1;
		var msb31 = a >>> 1 ^ b >>> 1;
		return msb31 << 1 | lsb;
	}
	,bitAND: function(a,b) {
		var lsb = a & 1 & (b & 1);
		var msb31 = a >>> 1 & b >>> 1;
		return msb31 << 1 | lsb;
	}
	,addme: function(x,y) {
		var lsw = (x & 65535) + (y & 65535);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return msw << 16 | lsw & 65535;
	}
	,hex: function(a) {
		var str = "";
		var hex_chr = "0123456789abcdef";
		var _g = 0;
		while(_g < a.length) {
			var num = a[_g];
			++_g;
			var _g1 = 0;
			while(_g1 < 4) {
				var j = _g1++;
				str += hex_chr.charAt(num >> j * 8 + 4 & 15) + hex_chr.charAt(num >> j * 8 & 15);
			}
		}
		return str;
	}
	,rol: function(num,cnt) {
		return num << cnt | num >>> 32 - cnt;
	}
	,cmn: function(q,a,b,x,s,t) {
		return this.addme(this.rol(this.addme(this.addme(a,q),this.addme(x,t)),s),b);
	}
	,ff: function(a,b,c,d,x,s,t) {
		return this.cmn(this.bitOR(this.bitAND(b,c),this.bitAND(~b,d)),a,b,x,s,t);
	}
	,gg: function(a,b,c,d,x,s,t) {
		return this.cmn(this.bitOR(this.bitAND(b,d),this.bitAND(c,~d)),a,b,x,s,t);
	}
	,hh: function(a,b,c,d,x,s,t) {
		return this.cmn(this.bitXOR(this.bitXOR(b,c),d),a,b,x,s,t);
	}
	,ii: function(a,b,c,d,x,s,t) {
		return this.cmn(this.bitXOR(c,this.bitOR(b,~d)),a,b,x,s,t);
	}
	,doEncode: function(x) {
		var a = 1732584193;
		var b = -271733879;
		var c = -1732584194;
		var d = 271733878;
		var step;
		var i = 0;
		while(i < x.length) {
			var olda = a;
			var oldb = b;
			var oldc = c;
			var oldd = d;
			step = 0;
			a = this.ff(a,b,c,d,x[i],7,-680876936);
			d = this.ff(d,a,b,c,x[i + 1],12,-389564586);
			c = this.ff(c,d,a,b,x[i + 2],17,606105819);
			b = this.ff(b,c,d,a,x[i + 3],22,-1044525330);
			a = this.ff(a,b,c,d,x[i + 4],7,-176418897);
			d = this.ff(d,a,b,c,x[i + 5],12,1200080426);
			c = this.ff(c,d,a,b,x[i + 6],17,-1473231341);
			b = this.ff(b,c,d,a,x[i + 7],22,-45705983);
			a = this.ff(a,b,c,d,x[i + 8],7,1770035416);
			d = this.ff(d,a,b,c,x[i + 9],12,-1958414417);
			c = this.ff(c,d,a,b,x[i + 10],17,-42063);
			b = this.ff(b,c,d,a,x[i + 11],22,-1990404162);
			a = this.ff(a,b,c,d,x[i + 12],7,1804603682);
			d = this.ff(d,a,b,c,x[i + 13],12,-40341101);
			c = this.ff(c,d,a,b,x[i + 14],17,-1502002290);
			b = this.ff(b,c,d,a,x[i + 15],22,1236535329);
			a = this.gg(a,b,c,d,x[i + 1],5,-165796510);
			d = this.gg(d,a,b,c,x[i + 6],9,-1069501632);
			c = this.gg(c,d,a,b,x[i + 11],14,643717713);
			b = this.gg(b,c,d,a,x[i],20,-373897302);
			a = this.gg(a,b,c,d,x[i + 5],5,-701558691);
			d = this.gg(d,a,b,c,x[i + 10],9,38016083);
			c = this.gg(c,d,a,b,x[i + 15],14,-660478335);
			b = this.gg(b,c,d,a,x[i + 4],20,-405537848);
			a = this.gg(a,b,c,d,x[i + 9],5,568446438);
			d = this.gg(d,a,b,c,x[i + 14],9,-1019803690);
			c = this.gg(c,d,a,b,x[i + 3],14,-187363961);
			b = this.gg(b,c,d,a,x[i + 8],20,1163531501);
			a = this.gg(a,b,c,d,x[i + 13],5,-1444681467);
			d = this.gg(d,a,b,c,x[i + 2],9,-51403784);
			c = this.gg(c,d,a,b,x[i + 7],14,1735328473);
			b = this.gg(b,c,d,a,x[i + 12],20,-1926607734);
			a = this.hh(a,b,c,d,x[i + 5],4,-378558);
			d = this.hh(d,a,b,c,x[i + 8],11,-2022574463);
			c = this.hh(c,d,a,b,x[i + 11],16,1839030562);
			b = this.hh(b,c,d,a,x[i + 14],23,-35309556);
			a = this.hh(a,b,c,d,x[i + 1],4,-1530992060);
			d = this.hh(d,a,b,c,x[i + 4],11,1272893353);
			c = this.hh(c,d,a,b,x[i + 7],16,-155497632);
			b = this.hh(b,c,d,a,x[i + 10],23,-1094730640);
			a = this.hh(a,b,c,d,x[i + 13],4,681279174);
			d = this.hh(d,a,b,c,x[i],11,-358537222);
			c = this.hh(c,d,a,b,x[i + 3],16,-722521979);
			b = this.hh(b,c,d,a,x[i + 6],23,76029189);
			a = this.hh(a,b,c,d,x[i + 9],4,-640364487);
			d = this.hh(d,a,b,c,x[i + 12],11,-421815835);
			c = this.hh(c,d,a,b,x[i + 15],16,530742520);
			b = this.hh(b,c,d,a,x[i + 2],23,-995338651);
			a = this.ii(a,b,c,d,x[i],6,-198630844);
			d = this.ii(d,a,b,c,x[i + 7],10,1126891415);
			c = this.ii(c,d,a,b,x[i + 14],15,-1416354905);
			b = this.ii(b,c,d,a,x[i + 5],21,-57434055);
			a = this.ii(a,b,c,d,x[i + 12],6,1700485571);
			d = this.ii(d,a,b,c,x[i + 3],10,-1894986606);
			c = this.ii(c,d,a,b,x[i + 10],15,-1051523);
			b = this.ii(b,c,d,a,x[i + 1],21,-2054922799);
			a = this.ii(a,b,c,d,x[i + 8],6,1873313359);
			d = this.ii(d,a,b,c,x[i + 15],10,-30611744);
			c = this.ii(c,d,a,b,x[i + 6],15,-1560198380);
			b = this.ii(b,c,d,a,x[i + 13],21,1309151649);
			a = this.ii(a,b,c,d,x[i + 4],6,-145523070);
			d = this.ii(d,a,b,c,x[i + 11],10,-1120210379);
			c = this.ii(c,d,a,b,x[i + 2],15,718787259);
			b = this.ii(b,c,d,a,x[i + 9],21,-343485551);
			a = this.addme(a,olda);
			b = this.addme(b,oldb);
			c = this.addme(c,oldc);
			d = this.addme(d,oldd);
			i += 16;
		}
		return [a,b,c,d];
	}
	,__class__: haxe_crypto_Md5
};
var haxe_ds_ArraySort = function() { };
$hxClasses["haxe.ds.ArraySort"] = haxe_ds_ArraySort;
haxe_ds_ArraySort.__name__ = ["haxe","ds","ArraySort"];
haxe_ds_ArraySort.sort = function(a,cmp) {
	haxe_ds_ArraySort.rec(a,cmp,0,a.length);
};
haxe_ds_ArraySort.rec = function(a,cmp,from,to) {
	var middle = from + to >> 1;
	if(to - from < 12) {
		if(to <= from) return;
		var _g = from + 1;
		while(_g < to) {
			var i = _g++;
			var j = i;
			while(j > from) {
				if(cmp(a[j],a[j - 1]) < 0) haxe_ds_ArraySort.swap(a,j - 1,j); else break;
				j--;
			}
		}
		return;
	}
	haxe_ds_ArraySort.rec(a,cmp,from,middle);
	haxe_ds_ArraySort.rec(a,cmp,middle,to);
	haxe_ds_ArraySort.doMerge(a,cmp,from,middle,to,middle - from,to - middle);
};
haxe_ds_ArraySort.doMerge = function(a,cmp,from,pivot,to,len1,len2) {
	var first_cut;
	var second_cut;
	var len11;
	var len22;
	var new_mid;
	if(len1 == 0 || len2 == 0) return;
	if(len1 + len2 == 2) {
		if(cmp(a[pivot],a[from]) < 0) haxe_ds_ArraySort.swap(a,pivot,from);
		return;
	}
	if(len1 > len2) {
		len11 = len1 >> 1;
		first_cut = from + len11;
		second_cut = haxe_ds_ArraySort.lower(a,cmp,pivot,to,first_cut);
		len22 = second_cut - pivot;
	} else {
		len22 = len2 >> 1;
		second_cut = pivot + len22;
		first_cut = haxe_ds_ArraySort.upper(a,cmp,from,pivot,second_cut);
		len11 = first_cut - from;
	}
	haxe_ds_ArraySort.rotate(a,cmp,first_cut,pivot,second_cut);
	new_mid = first_cut + len22;
	haxe_ds_ArraySort.doMerge(a,cmp,from,first_cut,new_mid,len11,len22);
	haxe_ds_ArraySort.doMerge(a,cmp,new_mid,second_cut,to,len1 - len11,len2 - len22);
};
haxe_ds_ArraySort.rotate = function(a,cmp,from,mid,to) {
	var n;
	if(from == mid || mid == to) return;
	n = haxe_ds_ArraySort.gcd(to - from,mid - from);
	while(n-- != 0) {
		var val = a[from + n];
		var shift = mid - from;
		var p1 = from + n;
		var p2 = from + n + shift;
		while(p2 != from + n) {
			a[p1] = a[p2];
			p1 = p2;
			if(to - p2 > shift) p2 += shift; else p2 = from + (shift - (to - p2));
		}
		a[p1] = val;
	}
};
haxe_ds_ArraySort.gcd = function(m,n) {
	while(n != 0) {
		var t = m % n;
		m = n;
		n = t;
	}
	return m;
};
haxe_ds_ArraySort.upper = function(a,cmp,from,to,val) {
	var len = to - from;
	var half;
	var mid;
	while(len > 0) {
		half = len >> 1;
		mid = from + half;
		if(cmp(a[val],a[mid]) < 0) len = half; else {
			from = mid + 1;
			len = len - half - 1;
		}
	}
	return from;
};
haxe_ds_ArraySort.lower = function(a,cmp,from,to,val) {
	var len = to - from;
	var half;
	var mid;
	while(len > 0) {
		half = len >> 1;
		mid = from + half;
		if(cmp(a[mid],a[val]) < 0) {
			from = mid + 1;
			len = len - half - 1;
		} else len = half;
	}
	return from;
};
haxe_ds_ArraySort.swap = function(a,i,j) {
	var tmp = a[i];
	a[i] = a[j];
	a[j] = tmp;
};
var haxe_ds_BalancedTree = function() {
};
$hxClasses["haxe.ds.BalancedTree"] = haxe_ds_BalancedTree;
haxe_ds_BalancedTree.__name__ = ["haxe","ds","BalancedTree"];
haxe_ds_BalancedTree.prototype = {
	set: function(key,value) {
		this.root = this.setLoop(key,value,this.root);
	}
	,get: function(key) {
		var node = this.root;
		while(node != null) {
			var c = this.compare(key,node.key);
			if(c == 0) return node.value;
			if(c < 0) node = node.left; else node = node.right;
		}
		return null;
	}
	,iterator: function() {
		var ret = [];
		this.iteratorLoop(this.root,ret);
		return HxOverrides.iter(ret);
	}
	,setLoop: function(k,v,node) {
		if(node == null) return new haxe_ds_TreeNode(null,k,v,null);
		var c = this.compare(k,node.key);
		if(c == 0) return new haxe_ds_TreeNode(node.left,k,v,node.right,node == null?0:node._height); else if(c < 0) {
			var nl = this.setLoop(k,v,node.left);
			return this.balance(nl,node.key,node.value,node.right);
		} else {
			var nr = this.setLoop(k,v,node.right);
			return this.balance(node.left,node.key,node.value,nr);
		}
	}
	,iteratorLoop: function(node,acc) {
		if(node != null) {
			this.iteratorLoop(node.left,acc);
			acc.push(node.value);
			this.iteratorLoop(node.right,acc);
		}
	}
	,balance: function(l,k,v,r) {
		var hl;
		if(l == null) hl = 0; else hl = l._height;
		var hr;
		if(r == null) hr = 0; else hr = r._height;
		if(hl > hr + 2) {
			if((function($this) {
				var $r;
				var _this = l.left;
				$r = _this == null?0:_this._height;
				return $r;
			}(this)) >= (function($this) {
				var $r;
				var _this1 = l.right;
				$r = _this1 == null?0:_this1._height;
				return $r;
			}(this))) return new haxe_ds_TreeNode(l.left,l.key,l.value,new haxe_ds_TreeNode(l.right,k,v,r)); else return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l.left,l.key,l.value,l.right.left),l.right.key,l.right.value,new haxe_ds_TreeNode(l.right.right,k,v,r));
		} else if(hr > hl + 2) {
			if((function($this) {
				var $r;
				var _this2 = r.right;
				$r = _this2 == null?0:_this2._height;
				return $r;
			}(this)) > (function($this) {
				var $r;
				var _this3 = r.left;
				$r = _this3 == null?0:_this3._height;
				return $r;
			}(this))) return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l,k,v,r.left),r.key,r.value,r.right); else return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l,k,v,r.left.left),r.left.key,r.left.value,new haxe_ds_TreeNode(r.left.right,r.key,r.value,r.right));
		} else return new haxe_ds_TreeNode(l,k,v,r,(hl > hr?hl:hr) + 1);
	}
	,compare: function(k1,k2) {
		return Reflect.compare(k1,k2);
	}
	,__class__: haxe_ds_BalancedTree
};
var haxe_ds_TreeNode = function(l,k,v,r,h) {
	if(h == null) h = -1;
	this.left = l;
	this.key = k;
	this.value = v;
	this.right = r;
	if(h == -1) this._height = ((function($this) {
		var $r;
		var _this = $this.left;
		$r = _this == null?0:_this._height;
		return $r;
	}(this)) > (function($this) {
		var $r;
		var _this1 = $this.right;
		$r = _this1 == null?0:_this1._height;
		return $r;
	}(this))?(function($this) {
		var $r;
		var _this2 = $this.left;
		$r = _this2 == null?0:_this2._height;
		return $r;
	}(this)):(function($this) {
		var $r;
		var _this3 = $this.right;
		$r = _this3 == null?0:_this3._height;
		return $r;
	}(this))) + 1; else this._height = h;
};
$hxClasses["haxe.ds.TreeNode"] = haxe_ds_TreeNode;
haxe_ds_TreeNode.__name__ = ["haxe","ds","TreeNode"];
haxe_ds_TreeNode.prototype = {
	__class__: haxe_ds_TreeNode
};
var haxe_ds_EnumValueMap = function() {
	haxe_ds_BalancedTree.call(this);
};
$hxClasses["haxe.ds.EnumValueMap"] = haxe_ds_EnumValueMap;
haxe_ds_EnumValueMap.__name__ = ["haxe","ds","EnumValueMap"];
haxe_ds_EnumValueMap.__interfaces__ = [haxe_IMap];
haxe_ds_EnumValueMap.__super__ = haxe_ds_BalancedTree;
haxe_ds_EnumValueMap.prototype = $extend(haxe_ds_BalancedTree.prototype,{
	compare: function(k1,k2) {
		var d = k1[1] - k2[1];
		if(d != 0) return d;
		var p1 = k1.slice(2);
		var p2 = k2.slice(2);
		if(p1.length == 0 && p2.length == 0) return 0;
		return this.compareArgs(p1,p2);
	}
	,compareArgs: function(a1,a2) {
		var ld = a1.length - a2.length;
		if(ld != 0) return ld;
		var _g1 = 0;
		var _g = a1.length;
		while(_g1 < _g) {
			var i = _g1++;
			var d = this.compareArg(a1[i],a2[i]);
			if(d != 0) return d;
		}
		return 0;
	}
	,compareArg: function(v1,v2) {
		if(Reflect.isEnumValue(v1) && Reflect.isEnumValue(v2)) return this.compare(v1,v2); else if((v1 instanceof Array) && v1.__enum__ == null && ((v2 instanceof Array) && v2.__enum__ == null)) return this.compareArgs(v1,v2); else return Reflect.compare(v1,v2);
	}
	,__class__: haxe_ds_EnumValueMap
});
var haxe_ds_IntMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.IntMap"] = haxe_ds_IntMap;
haxe_ds_IntMap.__name__ = ["haxe","ds","IntMap"];
haxe_ds_IntMap.__interfaces__ = [haxe_IMap];
haxe_ds_IntMap.prototype = {
	set: function(key,value) {
		this.h[key] = value;
	}
	,remove: function(key) {
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i];
		}};
	}
	,__class__: haxe_ds_IntMap
};
var haxe_ds_ListSort = function() { };
$hxClasses["haxe.ds.ListSort"] = haxe_ds_ListSort;
haxe_ds_ListSort.__name__ = ["haxe","ds","ListSort"];
haxe_ds_ListSort.sortSingleLinked = function(list,cmp) {
	if(list == null) return null;
	var insize = 1;
	var nmerges;
	var psize = 0;
	var qsize = 0;
	var p;
	var q;
	var e;
	var tail;
	while(true) {
		p = list;
		list = null;
		tail = null;
		nmerges = 0;
		while(p != null) {
			nmerges++;
			q = p;
			psize = 0;
			var _g = 0;
			while(_g < insize) {
				var i = _g++;
				psize++;
				q = q.next;
				if(q == null) break;
			}
			qsize = insize;
			while(psize > 0 || qsize > 0 && q != null) {
				if(psize == 0) {
					e = q;
					q = q.next;
					qsize--;
				} else if(qsize == 0 || q == null || cmp(p,q) <= 0) {
					e = p;
					p = p.next;
					psize--;
				} else {
					e = q;
					q = q.next;
					qsize--;
				}
				if(tail != null) tail.next = e; else list = e;
				tail = e;
			}
			p = q;
		}
		tail.next = null;
		if(nmerges <= 1) break;
		insize *= 2;
	}
	return list;
};
var haxe_ds_ObjectMap = function() {
	this.h = { };
	this.h.__keys__ = { };
};
$hxClasses["haxe.ds.ObjectMap"] = haxe_ds_ObjectMap;
haxe_ds_ObjectMap.__name__ = ["haxe","ds","ObjectMap"];
haxe_ds_ObjectMap.__interfaces__ = [haxe_IMap];
haxe_ds_ObjectMap.prototype = {
	set: function(key,value) {
		var id = key.__id__ || (key.__id__ = ++haxe_ds_ObjectMap.count);
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,remove: function(key) {
		var id = key.__id__;
		if(this.h.__keys__[id] == null) return false;
		delete(this.h[id]);
		delete(this.h.__keys__[id]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h.__keys__ ) {
		if(this.h.hasOwnProperty(key)) a.push(this.h.__keys__[key]);
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe_ds_ObjectMap
};
var haxe_ds__$StringMap_StringMapIterator = function(map,keys) {
	this.map = map;
	this.keys = keys;
	this.index = 0;
	this.count = keys.length;
};
$hxClasses["haxe.ds._StringMap.StringMapIterator"] = haxe_ds__$StringMap_StringMapIterator;
haxe_ds__$StringMap_StringMapIterator.__name__ = ["haxe","ds","_StringMap","StringMapIterator"];
haxe_ds__$StringMap_StringMapIterator.prototype = {
	hasNext: function() {
		return this.index < this.count;
	}
	,next: function() {
		return this.map.get(this.keys[this.index++]);
	}
	,__class__: haxe_ds__$StringMap_StringMapIterator
};
var haxe_ds_StringMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.StringMap"] = haxe_ds_StringMap;
haxe_ds_StringMap.__name__ = ["haxe","ds","StringMap"];
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	set: function(key,value) {
		if(__map_reserved[key] != null) this.setReserved(key,value); else this.h[key] = value;
	}
	,get: function(key) {
		if(__map_reserved[key] != null) return this.getReserved(key);
		return this.h[key];
	}
	,exists: function(key) {
		if(__map_reserved[key] != null) return this.existsReserved(key);
		return this.h.hasOwnProperty(key);
	}
	,setReserved: function(key,value) {
		if(this.rh == null) this.rh = { };
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) return null; else return this.rh["$" + key];
	}
	,existsReserved: function(key) {
		if(this.rh == null) return false;
		return this.rh.hasOwnProperty("$" + key);
	}
	,keys: function() {
		var _this = this.arrayKeys();
		return HxOverrides.iter(_this);
	}
	,arrayKeys: function() {
		var out = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) out.push(key);
		}
		if(this.rh != null) {
			for( var key in this.rh ) {
			if(key.charCodeAt(0) == 36) out.push(key.substr(1));
			}
		}
		return out;
	}
	,iterator: function() {
		return new haxe_ds__$StringMap_StringMapIterator(this,this.arrayKeys());
	}
	,__class__: haxe_ds_StringMap
};
var haxe_io_Eof = function() { };
$hxClasses["haxe.io.Eof"] = haxe_io_Eof;
haxe_io_Eof.__name__ = ["haxe","io","Eof"];
haxe_io_Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe_io_Eof
};
var haxe_io_Error = $hxClasses["haxe.io.Error"] = { __ename__ : true, __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
haxe_io_Error.Blocked = ["Blocked",0];
haxe_io_Error.Blocked.toString = $estr;
haxe_io_Error.Blocked.__enum__ = haxe_io_Error;
haxe_io_Error.Overflow = ["Overflow",1];
haxe_io_Error.Overflow.toString = $estr;
haxe_io_Error.Overflow.__enum__ = haxe_io_Error;
haxe_io_Error.OutsideBounds = ["OutsideBounds",2];
haxe_io_Error.OutsideBounds.toString = $estr;
haxe_io_Error.OutsideBounds.__enum__ = haxe_io_Error;
haxe_io_Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe_io_Error; $x.toString = $estr; return $x; };
haxe_io_Error.__empty_constructs__ = [haxe_io_Error.Blocked,haxe_io_Error.Overflow,haxe_io_Error.OutsideBounds];
var haxe_io_FPHelper = function() { };
$hxClasses["haxe.io.FPHelper"] = haxe_io_FPHelper;
haxe_io_FPHelper.__name__ = ["haxe","io","FPHelper"];
haxe_io_FPHelper.i32ToFloat = function(i) {
	var sign = 1 - (i >>> 31 << 1);
	var exp = i >>> 23 & 255;
	var sig = i & 8388607;
	if(sig == 0 && exp == 0) return 0.0;
	return sign * (1 + Math.pow(2,-23) * sig) * Math.pow(2,exp - 127);
};
haxe_io_FPHelper.floatToI32 = function(f) {
	if(f == 0) return 0;
	var af;
	if(f < 0) af = -f; else af = f;
	var exp = Math.floor(Math.log(af) / 0.6931471805599453);
	if(exp < -127) exp = -127; else if(exp > 128) exp = 128;
	var sig = Math.round((af / Math.pow(2,exp) - 1) * 8388608) & 8388607;
	return (f < 0?-2147483648:0) | exp + 127 << 23 | sig;
};
haxe_io_FPHelper.i64ToDouble = function(low,high) {
	var sign = 1 - (high >>> 31 << 1);
	var exp = (high >> 20 & 2047) - 1023;
	var sig = (high & 1048575) * 4294967296. + (low >>> 31) * 2147483648. + (low & 2147483647);
	if(sig == 0 && exp == -1023) return 0.0;
	return sign * (1.0 + Math.pow(2,-52) * sig) * Math.pow(2,exp);
};
haxe_io_FPHelper.doubleToI64 = function(v) {
	var i64 = haxe_io_FPHelper.i64tmp;
	if(v == 0) {
		i64.low = 0;
		i64.high = 0;
	} else {
		var av;
		if(v < 0) av = -v; else av = v;
		var exp = Math.floor(Math.log(av) / 0.6931471805599453);
		var sig;
		var v1 = (av / Math.pow(2,exp) - 1) * 4503599627370496.;
		sig = Math.round(v1);
		var sig_l = sig | 0;
		var sig_h = sig / 4294967296.0 | 0;
		i64.low = sig_l;
		i64.high = (v < 0?-2147483648:0) | exp + 1023 << 20 | sig_h;
	}
	return i64;
};
var haxe_macro_Binop = $hxClasses["haxe.macro.Binop"] = { __ename__ : true, __constructs__ : ["OpAdd","OpMult","OpDiv","OpSub","OpAssign","OpEq","OpNotEq","OpGt","OpGte","OpLt","OpLte","OpAnd","OpOr","OpXor","OpBoolAnd","OpBoolOr","OpShl","OpShr","OpUShr","OpMod","OpAssignOp","OpInterval","OpArrow"] };
haxe_macro_Binop.OpAdd = ["OpAdd",0];
haxe_macro_Binop.OpAdd.toString = $estr;
haxe_macro_Binop.OpAdd.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpMult = ["OpMult",1];
haxe_macro_Binop.OpMult.toString = $estr;
haxe_macro_Binop.OpMult.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpDiv = ["OpDiv",2];
haxe_macro_Binop.OpDiv.toString = $estr;
haxe_macro_Binop.OpDiv.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpSub = ["OpSub",3];
haxe_macro_Binop.OpSub.toString = $estr;
haxe_macro_Binop.OpSub.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpAssign = ["OpAssign",4];
haxe_macro_Binop.OpAssign.toString = $estr;
haxe_macro_Binop.OpAssign.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpEq = ["OpEq",5];
haxe_macro_Binop.OpEq.toString = $estr;
haxe_macro_Binop.OpEq.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpNotEq = ["OpNotEq",6];
haxe_macro_Binop.OpNotEq.toString = $estr;
haxe_macro_Binop.OpNotEq.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpGt = ["OpGt",7];
haxe_macro_Binop.OpGt.toString = $estr;
haxe_macro_Binop.OpGt.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpGte = ["OpGte",8];
haxe_macro_Binop.OpGte.toString = $estr;
haxe_macro_Binop.OpGte.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpLt = ["OpLt",9];
haxe_macro_Binop.OpLt.toString = $estr;
haxe_macro_Binop.OpLt.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpLte = ["OpLte",10];
haxe_macro_Binop.OpLte.toString = $estr;
haxe_macro_Binop.OpLte.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpAnd = ["OpAnd",11];
haxe_macro_Binop.OpAnd.toString = $estr;
haxe_macro_Binop.OpAnd.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpOr = ["OpOr",12];
haxe_macro_Binop.OpOr.toString = $estr;
haxe_macro_Binop.OpOr.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpXor = ["OpXor",13];
haxe_macro_Binop.OpXor.toString = $estr;
haxe_macro_Binop.OpXor.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpBoolAnd = ["OpBoolAnd",14];
haxe_macro_Binop.OpBoolAnd.toString = $estr;
haxe_macro_Binop.OpBoolAnd.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpBoolOr = ["OpBoolOr",15];
haxe_macro_Binop.OpBoolOr.toString = $estr;
haxe_macro_Binop.OpBoolOr.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpShl = ["OpShl",16];
haxe_macro_Binop.OpShl.toString = $estr;
haxe_macro_Binop.OpShl.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpShr = ["OpShr",17];
haxe_macro_Binop.OpShr.toString = $estr;
haxe_macro_Binop.OpShr.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpUShr = ["OpUShr",18];
haxe_macro_Binop.OpUShr.toString = $estr;
haxe_macro_Binop.OpUShr.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpMod = ["OpMod",19];
haxe_macro_Binop.OpMod.toString = $estr;
haxe_macro_Binop.OpMod.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpAssignOp = function(op) { var $x = ["OpAssignOp",20,op]; $x.__enum__ = haxe_macro_Binop; $x.toString = $estr; return $x; };
haxe_macro_Binop.OpInterval = ["OpInterval",21];
haxe_macro_Binop.OpInterval.toString = $estr;
haxe_macro_Binop.OpInterval.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.OpArrow = ["OpArrow",22];
haxe_macro_Binop.OpArrow.toString = $estr;
haxe_macro_Binop.OpArrow.__enum__ = haxe_macro_Binop;
haxe_macro_Binop.__empty_constructs__ = [haxe_macro_Binop.OpAdd,haxe_macro_Binop.OpMult,haxe_macro_Binop.OpDiv,haxe_macro_Binop.OpSub,haxe_macro_Binop.OpAssign,haxe_macro_Binop.OpEq,haxe_macro_Binop.OpNotEq,haxe_macro_Binop.OpGt,haxe_macro_Binop.OpGte,haxe_macro_Binop.OpLt,haxe_macro_Binop.OpLte,haxe_macro_Binop.OpAnd,haxe_macro_Binop.OpOr,haxe_macro_Binop.OpXor,haxe_macro_Binop.OpBoolAnd,haxe_macro_Binop.OpBoolOr,haxe_macro_Binop.OpShl,haxe_macro_Binop.OpShr,haxe_macro_Binop.OpUShr,haxe_macro_Binop.OpMod,haxe_macro_Binop.OpInterval,haxe_macro_Binop.OpArrow];
var haxe_macro_Unop = $hxClasses["haxe.macro.Unop"] = { __ename__ : true, __constructs__ : ["OpIncrement","OpDecrement","OpNot","OpNeg","OpNegBits"] };
haxe_macro_Unop.OpIncrement = ["OpIncrement",0];
haxe_macro_Unop.OpIncrement.toString = $estr;
haxe_macro_Unop.OpIncrement.__enum__ = haxe_macro_Unop;
haxe_macro_Unop.OpDecrement = ["OpDecrement",1];
haxe_macro_Unop.OpDecrement.toString = $estr;
haxe_macro_Unop.OpDecrement.__enum__ = haxe_macro_Unop;
haxe_macro_Unop.OpNot = ["OpNot",2];
haxe_macro_Unop.OpNot.toString = $estr;
haxe_macro_Unop.OpNot.__enum__ = haxe_macro_Unop;
haxe_macro_Unop.OpNeg = ["OpNeg",3];
haxe_macro_Unop.OpNeg.toString = $estr;
haxe_macro_Unop.OpNeg.__enum__ = haxe_macro_Unop;
haxe_macro_Unop.OpNegBits = ["OpNegBits",4];
haxe_macro_Unop.OpNegBits.toString = $estr;
haxe_macro_Unop.OpNegBits.__enum__ = haxe_macro_Unop;
haxe_macro_Unop.__empty_constructs__ = [haxe_macro_Unop.OpIncrement,haxe_macro_Unop.OpDecrement,haxe_macro_Unop.OpNot,haxe_macro_Unop.OpNeg,haxe_macro_Unop.OpNegBits];
var hxd_BitmapData = function() { };
$hxClasses["hxd.BitmapData"] = hxd_BitmapData;
hxd_BitmapData.__name__ = ["hxd","BitmapData"];
hxd_BitmapData.prototype = {
	__class__: hxd_BitmapData
};
var hxd_EventKind = $hxClasses["hxd.EventKind"] = { __ename__ : true, __constructs__ : ["EPush","ERelease","EMove","EOver","EOut","EWheel","EFocus","EFocusLost","EKeyDown","EKeyUp","EReleaseNoClick"] };
hxd_EventKind.EPush = ["EPush",0];
hxd_EventKind.EPush.toString = $estr;
hxd_EventKind.EPush.__enum__ = hxd_EventKind;
hxd_EventKind.ERelease = ["ERelease",1];
hxd_EventKind.ERelease.toString = $estr;
hxd_EventKind.ERelease.__enum__ = hxd_EventKind;
hxd_EventKind.EMove = ["EMove",2];
hxd_EventKind.EMove.toString = $estr;
hxd_EventKind.EMove.__enum__ = hxd_EventKind;
hxd_EventKind.EOver = ["EOver",3];
hxd_EventKind.EOver.toString = $estr;
hxd_EventKind.EOver.__enum__ = hxd_EventKind;
hxd_EventKind.EOut = ["EOut",4];
hxd_EventKind.EOut.toString = $estr;
hxd_EventKind.EOut.__enum__ = hxd_EventKind;
hxd_EventKind.EWheel = ["EWheel",5];
hxd_EventKind.EWheel.toString = $estr;
hxd_EventKind.EWheel.__enum__ = hxd_EventKind;
hxd_EventKind.EFocus = ["EFocus",6];
hxd_EventKind.EFocus.toString = $estr;
hxd_EventKind.EFocus.__enum__ = hxd_EventKind;
hxd_EventKind.EFocusLost = ["EFocusLost",7];
hxd_EventKind.EFocusLost.toString = $estr;
hxd_EventKind.EFocusLost.__enum__ = hxd_EventKind;
hxd_EventKind.EKeyDown = ["EKeyDown",8];
hxd_EventKind.EKeyDown.toString = $estr;
hxd_EventKind.EKeyDown.__enum__ = hxd_EventKind;
hxd_EventKind.EKeyUp = ["EKeyUp",9];
hxd_EventKind.EKeyUp.toString = $estr;
hxd_EventKind.EKeyUp.__enum__ = hxd_EventKind;
hxd_EventKind.EReleaseNoClick = ["EReleaseNoClick",10];
hxd_EventKind.EReleaseNoClick.toString = $estr;
hxd_EventKind.EReleaseNoClick.__enum__ = hxd_EventKind;
hxd_EventKind.__empty_constructs__ = [hxd_EventKind.EPush,hxd_EventKind.ERelease,hxd_EventKind.EMove,hxd_EventKind.EOver,hxd_EventKind.EOut,hxd_EventKind.EWheel,hxd_EventKind.EFocus,hxd_EventKind.EFocusLost,hxd_EventKind.EKeyDown,hxd_EventKind.EKeyUp,hxd_EventKind.EReleaseNoClick];
var hxd_Event = function(k,x,y) {
	if(y == null) y = 0.;
	if(x == null) x = 0.;
	this.button = 0;
	this.kind = k;
	this.relX = x;
	this.relY = y;
};
$hxClasses["hxd.Event"] = hxd_Event;
hxd_Event.__name__ = ["hxd","Event"];
hxd_Event.prototype = {
	__class__: hxd_Event
};
var hxd_Key = function() { };
$hxClasses["hxd.Key"] = hxd_Key;
hxd_Key.__name__ = ["hxd","Key"];
hxd_Key.initialize = function() {
	if(hxd_Key.initDone) hxd_Key.dispose();
	hxd_Key.initDone = true;
	hxd_Key.keyPressed = [];
	hxd_Stage.getInstance().addEventTarget(hxd_Key.onEvent);
};
hxd_Key.dispose = function() {
	if(hxd_Key.initDone) {
		hxd_Stage.getInstance().removeEventTarget(hxd_Key.onEvent);
		hxd_Key.initDone = false;
		hxd_Key.keyPressed = [];
	}
};
hxd_Key.onEvent = function(e) {
	var _g = e.kind;
	switch(_g[1]) {
	case 8:
		hxd_Key.keyPressed[e.keyCode] = h3d_Engine.CURRENT.frameCount + 1;
		break;
	case 9:
		hxd_Key.keyPressed[e.keyCode] = -(h3d_Engine.CURRENT.frameCount + 1);
		break;
	case 0:
		hxd_Key.keyPressed[e.button] = h3d_Engine.CURRENT.frameCount + 1;
		break;
	case 1:
		hxd_Key.keyPressed[e.button] = -(h3d_Engine.CURRENT.frameCount + 1);
		break;
	case 5:
		hxd_Key.keyPressed[e.wheelDelta > 0?3:2] = h3d_Engine.CURRENT.frameCount + 1;
		break;
	default:
	}
};
var hxd_Math = function() { };
$hxClasses["hxd.Math"] = hxd_Math;
hxd_Math.__name__ = ["hxd","Math"];
hxd_Math.round = function(f) {
	return Math.round(f);
};
hxd_Math.abs = function(f) {
	if(f < 0) return -f; else return f;
};
hxd_Math.max = function(a,b) {
	if(a < b) return b; else return a;
};
hxd_Math.min = function(a,b) {
	if(a > b) return b; else return a;
};
hxd_Math.distanceSq = function(dx,dy,dz) {
	if(dz == null) dz = 0.;
	return dx * dx + dy * dy + dz * dz;
};
var hxd_Flags = $hxClasses["hxd.Flags"] = { __ename__ : true, __constructs__ : ["ReadOnly","AlphaPremultiplied","FlipY"] };
hxd_Flags.ReadOnly = ["ReadOnly",0];
hxd_Flags.ReadOnly.toString = $estr;
hxd_Flags.ReadOnly.__enum__ = hxd_Flags;
hxd_Flags.AlphaPremultiplied = ["AlphaPremultiplied",1];
hxd_Flags.AlphaPremultiplied.toString = $estr;
hxd_Flags.AlphaPremultiplied.__enum__ = hxd_Flags;
hxd_Flags.FlipY = ["FlipY",2];
hxd_Flags.FlipY.toString = $estr;
hxd_Flags.FlipY.__enum__ = hxd_Flags;
hxd_Flags.__empty_constructs__ = [hxd_Flags.ReadOnly,hxd_Flags.AlphaPremultiplied,hxd_Flags.FlipY];
var hxd_Pixels = function(width,height,bytes,format,offset) {
	if(offset == null) offset = 0;
	this.width = width;
	this.height = height;
	this.bytes = bytes;
	this.set_format(format);
	this.offset = offset;
};
$hxClasses["hxd.Pixels"] = hxd_Pixels;
hxd_Pixels.__name__ = ["hxd","Pixels"];
hxd_Pixels.bytesPerPixel = function(format) {
	switch(format[1]) {
	case 5:
		return 1;
	case 0:case 1:case 2:
		return 4;
	case 3:
		return 8;
	case 4:
		return 16;
	}
};
hxd_Pixels.alloc = function(width,height,format) {
	return new hxd_Pixels(width,height,hxd_impl_Tmp.getBytes(width * height * hxd_Pixels.bytesPerPixel(format)),format);
};
hxd_Pixels.prototype = {
	set_format: function(fmt) {
		this.format = fmt;
		this.bpp = hxd_Pixels.bytesPerPixel(fmt);
		return fmt;
	}
	,copyInner: function() {
		var old = this.bytes;
		this.bytes = hxd_impl_Tmp.getBytes(this.width * this.height * 4);
		this.bytes.blit(0,old,this.offset,this.width * this.height * 4);
		this.offset = 0;
		this.flags &= 268435455 - (1 << hxd_Flags.ReadOnly[1]);
	}
	,convert: function(target) {
		if(this.format == target) return;
		if((this.flags & 1 << hxd_Flags.ReadOnly[1]) != 0) this.copyInner();
		{
			var _g = this.format;
			switch(_g[1]) {
			case 1:
				switch(target[1]) {
				case 0:
					var mem = hxd_impl_Memory.select(this.bytes);
					var _g2 = 0;
					var _g1 = this.width * this.height;
					while(_g2 < _g1) {
						var i = _g2++;
						var p = (i << 2) + this.offset;
						var a = hxd_impl_Memory.current.b[p];
						var r = hxd_impl_Memory.current.b[p + 1];
						var g = hxd_impl_Memory.current.b[p + 2];
						var b = hxd_impl_Memory.current.b[p + 3];
						hxd_impl_Memory.current.b[p] = b & 255;
						hxd_impl_Memory.current.b[p + 1] = g & 255;
						hxd_impl_Memory.current.b[p + 2] = r & 255;
						hxd_impl_Memory.current.b[p + 3] = a & 255;
					}
					hxd_impl_Memory.end();
					break;
				case 2:
					var mem1 = hxd_impl_Memory.select(this.bytes);
					var _g21 = 0;
					var _g11 = this.width * this.height;
					while(_g21 < _g11) {
						var i1 = _g21++;
						var p1 = (i1 << 2) + this.offset;
						var b1 = hxd_impl_Memory.current.b[p1];
						var r1 = hxd_impl_Memory.current.b[p1 + 2];
						hxd_impl_Memory.current.b[p1] = r1 & 255;
						hxd_impl_Memory.current.b[p1 + 2] = b1 & 255;
					}
					hxd_impl_Memory.end();
					break;
				default:
					throw new js__$Boot_HaxeError("Cannot convert from " + Std.string(this.format) + " to " + Std.string(target));
				}
				break;
			case 0:
				switch(target[1]) {
				case 1:
					var mem2 = hxd_impl_Memory.select(this.bytes);
					var _g22 = 0;
					var _g12 = this.width * this.height;
					while(_g22 < _g12) {
						var i2 = _g22++;
						var p2 = (i2 << 2) + this.offset;
						var a1 = hxd_impl_Memory.current.b[p2];
						var r2 = hxd_impl_Memory.current.b[p2 + 1];
						var g1 = hxd_impl_Memory.current.b[p2 + 2];
						var b2 = hxd_impl_Memory.current.b[p2 + 3];
						hxd_impl_Memory.current.b[p2] = b2 & 255;
						hxd_impl_Memory.current.b[p2 + 1] = g1 & 255;
						hxd_impl_Memory.current.b[p2 + 2] = r2 & 255;
						hxd_impl_Memory.current.b[p2 + 3] = a1 & 255;
					}
					hxd_impl_Memory.end();
					break;
				case 2:
					var mem3 = hxd_impl_Memory.select(this.bytes);
					var _g23 = 0;
					var _g13 = this.width * this.height;
					while(_g23 < _g13) {
						var i3 = _g23++;
						var p3 = (i3 << 2) + this.offset;
						var a2 = hxd_impl_Memory.current.b[p3];
						hxd_impl_Memory.current.b[p3] = hxd_impl_Memory.current.b[p3 + 1] & 255;
						hxd_impl_Memory.current.b[p3 + 1] = hxd_impl_Memory.current.b[p3 + 2] & 255;
						hxd_impl_Memory.current.b[p3 + 2] = hxd_impl_Memory.current.b[p3 + 3] & 255;
						hxd_impl_Memory.current.b[p3 + 3] = a2 & 255;
					}
					hxd_impl_Memory.end();
					break;
				default:
					throw new js__$Boot_HaxeError("Cannot convert from " + Std.string(this.format) + " to " + Std.string(target));
				}
				break;
			case 2:
				switch(target[1]) {
				case 1:
					var mem4 = hxd_impl_Memory.select(this.bytes);
					var _g24 = 0;
					var _g14 = this.width * this.height;
					while(_g24 < _g14) {
						var i4 = _g24++;
						var p4 = (i4 << 2) + this.offset;
						var b3 = hxd_impl_Memory.current.b[p4];
						var r3 = hxd_impl_Memory.current.b[p4 + 2];
						hxd_impl_Memory.current.b[p4] = r3 & 255;
						hxd_impl_Memory.current.b[p4 + 2] = b3 & 255;
					}
					hxd_impl_Memory.end();
					break;
				default:
					throw new js__$Boot_HaxeError("Cannot convert from " + Std.string(this.format) + " to " + Std.string(target));
				}
				break;
			default:
				throw new js__$Boot_HaxeError("Cannot convert from " + Std.string(this.format) + " to " + Std.string(target));
			}
		}
		this.set_format(target);
	}
	,dispose: function() {
		if(this.bytes != null) {
			if(!((this.flags & 1 << hxd_Flags.ReadOnly[1]) != 0)) hxd_impl_Tmp.saveBytes(this.bytes);
			this.bytes = null;
		}
	}
	,__class__: hxd_Pixels
};
var hxd_Res = function() { };
$hxClasses["hxd.Res"] = hxd_Res;
hxd_Res.__name__ = ["hxd","Res"];
hxd_Res.set_loader = function(l) {
	return hxd_res_Loader.currentInstance = l;
};
var hxd_SceneEvents = function() {
	this.onOut = new hxd_Event(hxd_EventKind.EOut);
	this.fakeMove = new hxd_Event(hxd_EventKind.EMove);
	this.focusLost = new hxd_Event(hxd_EventKind.EFocusLost);
	this.mouseY = -1.;
	this.mouseX = -1.;
	this.scenes = [];
	this.pendingEvents = [];
	this.pushList = [];
	hxd_Stage.getInstance().addEventTarget($bind(this,this.onEvent));
};
$hxClasses["hxd.SceneEvents"] = hxd_SceneEvents;
hxd_SceneEvents.__name__ = ["hxd","SceneEvents"];
hxd_SceneEvents.prototype = {
	onRemove: function(i) {
		if(i == this.currentFocus) this.currentFocus = null;
		if(i == this.currentOver) {
			this.currentOver = null;
			hxd_System.setCursor(hxd_Cursor.Default);
		}
		HxOverrides.remove(this.pushList,i);
	}
	,addScene: function(s,index) {
		s.setEvents(this);
		if(index == null) this.scenes.push(s); else this.scenes.splice(index,0,s);
	}
	,blur: function() {
		if(this.currentFocus == null) return;
		this.focusLost.cancel = false;
		this.currentFocus.handleEvent(this.focusLost);
		if(!this.focusLost.cancel) this.currentFocus = null;
	}
	,emitEvent: function(event) {
		var oldX = event.relX;
		var oldY = event.relY;
		var handled = false;
		var checkOver = false;
		var checkPush = false;
		var cancelFocus = false;
		var _g = event.kind;
		switch(_g[1]) {
		case 2:
			checkOver = true;
			break;
		case 0:
			cancelFocus = true;
			checkPush = true;
			break;
		case 1:
			checkPush = true;
			break;
		case 9:case 8:case 5:
			if(this.currentFocus != null) {
				event.relX = event.relY = 0;
				this.currentFocus.handleEvent(event);
				event.relX = oldX;
				event.relY = oldY;
				if(!event.propagate) return;
			}
			break;
		default:
		}
		var _g1 = 0;
		var _g11 = this.scenes;
		while(_g1 < _g11.length) {
			var s = _g11[_g1];
			++_g1;
			var last = null;
			while(true) {
				var i = s.handleEvent(event,last);
				if(i == null) break;
				if(checkOver) {
					if(this.currentOver != i) {
						this.onOut.cancel = false;
						if(this.currentOver != null) this.currentOver.handleEvent(this.onOut);
						if(!this.onOut.cancel) {
							var old = event.propagate;
							event.kind = hxd_EventKind.EOver;
							event.cancel = false;
							i.handleEvent(event);
							if(event.cancel) this.currentOver = null; else {
								this.currentOver = i;
								checkOver = false;
							}
							event.kind = hxd_EventKind.EMove;
							event.cancel = false;
							event.propagate = old;
						}
					} else checkOver = false;
				} else {
					if(checkPush) {
						if(event.kind == hxd_EventKind.EPush) this.pushList.push(i); else HxOverrides.remove(this.pushList,i);
					}
					if(cancelFocus && i == this.currentFocus) cancelFocus = false;
				}
				event.relX = oldX;
				event.relY = oldY;
				if(!event.propagate) {
					handled = true;
					break;
				}
				last = i;
				event.propagate = false;
			}
			if(handled) break;
		}
		if(cancelFocus && this.currentFocus != null) this.blur();
		if(checkOver && this.currentOver != null) {
			this.onOut.cancel = false;
			this.currentOver.handleEvent(this.onOut);
			if(!this.onOut.cancel) this.currentOver = null;
		}
		if(!handled && event != this.fakeMove) {
			if(event.kind == hxd_EventKind.EPush) this.pushList.push(null); else if(event.kind == hxd_EventKind.ERelease) HxOverrides.remove(this.pushList,null);
			this.dispatchListeners(event);
		}
		if(event.kind == hxd_EventKind.ERelease && this.pushList.length > 0) {
			var _g2 = 0;
			var _g12 = this.pushList;
			while(_g2 < _g12.length) {
				var i1 = _g12[_g2];
				++_g2;
				if(i1 == null) this.dispatchListeners(event); else {
					var s1 = i1.getInteractiveScene();
					if(s1 == null) continue;
					event.kind = hxd_EventKind.EReleaseNoClick;
					s1.dispatchEvent(event,i1);
					event.kind = hxd_EventKind.ERelease;
					event.relX = oldX;
					event.relY = oldY;
				}
			}
			this.pushList = [];
		}
	}
	,checkEvents: function() {
		var old = this.pendingEvents;
		var checkMoved = false;
		if(old.length > 0) {
			this.pendingEvents = [];
			var _g = 0;
			while(_g < old.length) {
				var e = old[_g];
				++_g;
				var ox = e.relX;
				var oy = e.relY;
				if(e.kind == hxd_EventKind.EMove) {
					checkMoved = true;
					this.mouseX = e.relX;
					this.mouseY = e.relY;
				}
				if(this.currentDrag != null && (this.currentDrag.ref == null || this.currentDrag.ref == e.touchId)) {
					this.currentDrag.f(e);
					e.relX = ox;
					e.relY = oy;
					if(e.cancel) continue;
				}
				this.emitEvent(e);
			}
		}
		if(!checkMoved && this.currentDrag == null) {
			this.fakeMove.relX = this.mouseX;
			this.fakeMove.relY = this.mouseY;
			this.fakeMove.cancel = false;
			this.fakeMove.propagate = false;
			this.emitEvent(this.fakeMove);
		}
	}
	,onEvent: function(e) {
		this.pendingEvents.push(e);
	}
	,dispatchListeners: function(event) {
		var ox = event.relX;
		var oy = event.relY;
		event.propagate = true;
		event.cancel = false;
		var _g = 0;
		var _g1 = this.scenes;
		while(_g < _g1.length) {
			var s = _g1[_g];
			++_g;
			s.dispatchListeners(event);
			event.relX = ox;
			event.relY = oy;
			if(!event.propagate) break;
		}
	}
	,__class__: hxd_SceneEvents
};
var hxd_Stage = function() {
	this.curMouseY = 0.;
	this.curMouseX = 0.;
	var _g = this;
	this.eventTargets = new List();
	this.resizeEvents = new List();
	this.canvas = hxd_Stage.getCanvas();
	this.canvasPos = this.canvas.getBoundingClientRect();
	window.addEventListener("mousedown",$bind(this,this.onMouseDown));
	window.addEventListener("mousemove",$bind(this,this.onMouseMove));
	window.addEventListener("mouseup",$bind(this,this.onMouseUp));
	window.addEventListener("mousewheel",$bind(this,this.onMouseWheel));
	window.addEventListener("keydown",$bind(this,this.onKeyDown));
	window.addEventListener("keyup",$bind(this,this.onKeyUp));
	this.canvas.addEventListener("mousedown",function(e) {
		_g.onMouseDown(e);
		e.stopPropagation();
		e.preventDefault();
	});
	var curW = this.get_width();
	var curH = this.get_height();
	var t0 = new haxe_Timer(100);
	t0.run = function() {
		_g.canvasPos = _g.canvas.getBoundingClientRect();
		var cw = _g.get_width();
		var ch = _g.get_height();
		if(curW != cw || curH != ch) {
			curW = cw;
			curH = ch;
			_g.onResize(null);
		}
	};
};
$hxClasses["hxd.Stage"] = hxd_Stage;
hxd_Stage.__name__ = ["hxd","Stage"];
hxd_Stage.getCanvas = function() {
	var canvas = window.document.getElementById("webgl");
	if(canvas == null) throw new js__$Boot_HaxeError("Missing canvas#webgl");
	return canvas;
};
hxd_Stage.getInstance = function() {
	if(hxd_Stage.inst == null) hxd_Stage.inst = new hxd_Stage();
	return hxd_Stage.inst;
};
hxd_Stage.prototype = {
	event: function(e) {
		var _g_head = this.eventTargets.h;
		var _g_val = null;
		while(_g_head != null) {
			var et;
			et = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			et(e);
		}
	}
	,addEventTarget: function(et) {
		this.eventTargets.add(et);
	}
	,removeEventTarget: function(et) {
		this.eventTargets.remove(et);
	}
	,addResizeEvent: function(f) {
		this.resizeEvents.push(f);
	}
	,onResize: function(e) {
		var _g_head = this.resizeEvents.h;
		var _g_val = null;
		while(_g_head != null) {
			var r;
			r = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			r();
		}
	}
	,setFullScreen: function(v) {
	}
	,get_width: function() {
		return hxd_Math.round(this.canvasPos.width * window.devicePixelRatio);
	}
	,get_height: function() {
		return hxd_Math.round(this.canvasPos.height * window.devicePixelRatio);
	}
	,get_mouseX: function() {
		return hxd_Math.round((this.curMouseX - this.canvasPos.left) * window.devicePixelRatio);
	}
	,get_mouseY: function() {
		return hxd_Math.round((this.curMouseY - this.canvasPos.top) * window.devicePixelRatio);
	}
	,onMouseDown: function(e) {
		this.event(new hxd_Event(hxd_EventKind.EPush,this.get_mouseX(),this.get_mouseY()));
	}
	,onMouseUp: function(e) {
		this.event(new hxd_Event(hxd_EventKind.ERelease,this.get_mouseX(),this.get_mouseY()));
	}
	,onMouseMove: function(e) {
		this.curMouseX = e.clientX;
		this.curMouseY = e.clientY;
		this.event(new hxd_Event(hxd_EventKind.EMove,this.get_mouseX(),this.get_mouseY()));
	}
	,onMouseWheel: function(e) {
		var ev = new hxd_Event(hxd_EventKind.EWheel,this.get_mouseX(),this.get_mouseY());
		ev.wheelDelta = -e.wheelDelta / 30.0;
		this.event(ev);
	}
	,onKeyUp: function(e) {
		var ev = new hxd_Event(hxd_EventKind.EKeyUp,this.get_mouseX(),this.get_mouseY());
		ev.keyCode = e.keyCode;
		ev.charCode = e.charCode;
		this.event(ev);
	}
	,onKeyDown: function(e) {
		var ev = new hxd_Event(hxd_EventKind.EKeyDown,this.get_mouseX(),this.get_mouseY());
		ev.keyCode = e.keyCode;
		ev.charCode = e.charCode;
		this.event(ev);
	}
	,__class__: hxd_Stage
};
var hxd_Cursor = $hxClasses["hxd.Cursor"] = { __ename__ : true, __constructs__ : ["Default","Button","Move","TextInput","Hide","Custom"] };
hxd_Cursor.Default = ["Default",0];
hxd_Cursor.Default.toString = $estr;
hxd_Cursor.Default.__enum__ = hxd_Cursor;
hxd_Cursor.Button = ["Button",1];
hxd_Cursor.Button.toString = $estr;
hxd_Cursor.Button.__enum__ = hxd_Cursor;
hxd_Cursor.Move = ["Move",2];
hxd_Cursor.Move.toString = $estr;
hxd_Cursor.Move.__enum__ = hxd_Cursor;
hxd_Cursor.TextInput = ["TextInput",3];
hxd_Cursor.TextInput.toString = $estr;
hxd_Cursor.TextInput.__enum__ = hxd_Cursor;
hxd_Cursor.Hide = ["Hide",4];
hxd_Cursor.Hide.toString = $estr;
hxd_Cursor.Hide.__enum__ = hxd_Cursor;
hxd_Cursor.Custom = function(frames,speed,offsetX,offsetY) { var $x = ["Custom",5,frames,speed,offsetX,offsetY]; $x.__enum__ = hxd_Cursor; $x.toString = $estr; return $x; };
hxd_Cursor.__empty_constructs__ = [hxd_Cursor.Default,hxd_Cursor.Button,hxd_Cursor.Move,hxd_Cursor.TextInput,hxd_Cursor.Hide];
var hxd_System = function() { };
$hxClasses["hxd.System"] = hxd_System;
hxd_System.__name__ = ["hxd","System"];
hxd_System.loopFunc = function() {
	var $window = window;
	var rqf = $window.requestAnimationFrame || $window.webkitRequestAnimationFrame || $window.mozRequestAnimationFrame;
	rqf(hxd_System.loopFunc);
	if(hxd_System.LOOP != null) hxd_System.LOOP();
};
hxd_System.setLoop = function(f) {
	if(!hxd_System.LOOP_INIT) {
		hxd_System.LOOP_INIT = true;
		hxd_System.loopFunc();
	}
	hxd_System.LOOP = f;
};
hxd_System.start = function(callb) {
	callb();
};
hxd_System.setNativeCursor = function(c) {
	var canvas = window.document.getElementById("webgl");
	if(canvas != null) switch(c[1]) {
	case 0:
		canvas.style.cursor = "default";
		break;
	case 1:
		canvas.style.cursor = "pointer";
		break;
	case 2:
		canvas.style.cursor = "move";
		break;
	case 3:
		canvas.style.cursor = "text";
		break;
	case 4:
		canvas.style.cursor = "none";
		break;
	case 5:
		throw new js__$Boot_HaxeError("Custom cursor not supported");
		break;
	}
};
hxd_System.get_isWindowed = function() {
	return true;
};
hxd_System.getDefaultFrameRate = function() {
	return 60.;
};
var hxd_Timer = function() { };
$hxClasses["hxd.Timer"] = hxd_Timer;
hxd_Timer.__name__ = ["hxd","Timer"];
hxd_Timer.update = function() {
	hxd_Timer.frameCount++;
	var newTime = haxe_Timer.stamp();
	hxd_Timer.deltaT = newTime - hxd_Timer.oldTime;
	hxd_Timer.oldTime = newTime;
	if(hxd_Timer.deltaT < hxd_Timer.maxDeltaTime) hxd_Timer.calc_tmod = hxd_Timer.calc_tmod * hxd_Timer.tmod_factor + (1 - hxd_Timer.tmod_factor) * hxd_Timer.deltaT * hxd_Timer.wantedFPS; else hxd_Timer.deltaT = 1 / hxd_Timer.wantedFPS;
	hxd_Timer.tmod = hxd_Timer.calc_tmod;
};
hxd_Timer.skip = function() {
	hxd_Timer.oldTime = haxe_Timer.stamp();
};
var hxd_res_Embed = function() { };
$hxClasses["hxd.res.Embed"] = hxd_res_Embed;
hxd_res_Embed.__name__ = ["hxd","res","Embed"];
var hxd__$res_R_$trueTypeFont_$ttf = function() { };
$hxClasses["hxd._res.R_trueTypeFont_ttf"] = hxd__$res_R_$trueTypeFont_$ttf;
hxd__$res_R_$trueTypeFont_$ttf.__name__ = ["hxd","_res","R_trueTypeFont_ttf"];
hxd__$res_R_$trueTypeFont_$ttf.__super__ = hxd_res_Embed;
hxd__$res_R_$trueTypeFont_$ttf.prototype = $extend(hxd_res_Embed.prototype,{
	__class__: hxd__$res_R_$trueTypeFont_$ttf
});
var hxd_fs_EmbedFileSystem = function(root) {
	this.root = root;
};
$hxClasses["hxd.fs.EmbedFileSystem"] = hxd_fs_EmbedFileSystem;
hxd_fs_EmbedFileSystem.__name__ = ["hxd","fs","EmbedFileSystem"];
hxd_fs_EmbedFileSystem.__interfaces__ = [hxd_fs_FileSystem];
hxd_fs_EmbedFileSystem.prototype = {
	__class__: hxd_fs_EmbedFileSystem
};
var hxd_fs_NotFound = function() { };
$hxClasses["hxd.fs.NotFound"] = hxd_fs_NotFound;
hxd_fs_NotFound.__name__ = ["hxd","fs","NotFound"];
hxd_fs_NotFound.prototype = {
	toString: function() {
		return "Resource file not found '" + this.path + "'";
	}
	,__class__: hxd_fs_NotFound
};
var hxd_impl_MemoryReader = function() {
};
$hxClasses["hxd.impl.MemoryReader"] = hxd_impl_MemoryReader;
hxd_impl_MemoryReader.__name__ = ["hxd","impl","MemoryReader"];
hxd_impl_MemoryReader.prototype = {
	__class__: hxd_impl_MemoryReader
};
var hxd_impl_Memory = function() { };
$hxClasses["hxd.impl.Memory"] = hxd_impl_Memory;
hxd_impl_Memory.__name__ = ["hxd","impl","Memory"];
hxd_impl_Memory.select = function(b) {
	if(hxd_impl_Memory.current != null) hxd_impl_Memory.stack.push(hxd_impl_Memory.current);
	hxd_impl_Memory.current = b;
	return hxd_impl_Memory.inst;
};
hxd_impl_Memory.end = function() {
	hxd_impl_Memory.current = hxd_impl_Memory.stack.pop();
};
var hxd_impl_Tmp = function() { };
$hxClasses["hxd.impl.Tmp"] = hxd_impl_Tmp;
hxd_impl_Tmp.__name__ = ["hxd","impl","Tmp"];
hxd_impl_Tmp.outOfMemory = function() {
};
hxd_impl_Tmp.getBytes = function(size) {
	var found = -1;
	var _g1 = 0;
	var _g = hxd_impl_Tmp.bytes.length;
	while(_g1 < _g) {
		var i = _g1++;
		var b = hxd_impl_Tmp.bytes[i];
		if(b.length >= size) found = i;
	}
	if(found >= 0) {
		var b1 = hxd_impl_Tmp.bytes[found];
		hxd_impl_Tmp.bytes.splice(found,1);
		return b1;
	}
	var sz = 1024;
	while(sz < size) sz = sz * 3 >> 1;
	return hxd_impl_Tmp.allocBytes(sz);
};
hxd_impl_Tmp.freeMemory = function() {
	hxd_impl_Tmp.bytes = [];
	hxd_impl_Tmp.outOfMemory();
};
hxd_impl_Tmp.allocBytes = function(size) {
	try {
		return haxe_io_Bytes.alloc(size);
	} catch( e ) {
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		hxd_impl_Tmp.freeMemory();
		return haxe_io_Bytes.alloc(size);
	}
};
hxd_impl_Tmp.saveBytes = function(b) {
	var _g1 = 0;
	var _g = hxd_impl_Tmp.bytes.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(hxd_impl_Tmp.bytes[i].length <= b.length) {
			hxd_impl_Tmp.bytes.splice(i,0,b);
			if(hxd_impl_Tmp.bytes.length > 8) hxd_impl_Tmp.bytes.pop();
			return;
		}
	}
	hxd_impl_Tmp.bytes.push(b);
};
var hxd_res_BitmapFont = function() { };
$hxClasses["hxd.res.BitmapFont"] = hxd_res_BitmapFont;
hxd_res_BitmapFont.__name__ = ["hxd","res","BitmapFont"];
hxd_res_BitmapFont.__super__ = hxd_res_Resource;
hxd_res_BitmapFont.prototype = $extend(hxd_res_Resource.prototype,{
	__class__: hxd_res_BitmapFont
});
var hxd_res_Font = function() { };
$hxClasses["hxd.res.Font"] = hxd_res_Font;
hxd_res_Font.__name__ = ["hxd","res","Font"];
hxd_res_Font.__super__ = hxd_res_Resource;
hxd_res_Font.prototype = $extend(hxd_res_Resource.prototype,{
	__class__: hxd_res_Font
});
var hxd_res_Image = function() { };
$hxClasses["hxd.res.Image"] = hxd_res_Image;
hxd_res_Image.__name__ = ["hxd","res","Image"];
hxd_res_Image.__super__ = hxd_res_Resource;
hxd_res_Image.prototype = $extend(hxd_res_Resource.prototype,{
	__class__: hxd_res_Image
});
var hxsl_Type = $hxClasses["hxsl.Type"] = { __ename__ : true, __constructs__ : ["TVoid","TInt","TBool","TFloat","TString","TVec","TMat3","TMat4","TMat3x4","TBytes","TSampler2D","TSamplerCube","TStruct","TFun","TArray"] };
hxsl_Type.TVoid = ["TVoid",0];
hxsl_Type.TVoid.toString = $estr;
hxsl_Type.TVoid.__enum__ = hxsl_Type;
hxsl_Type.TInt = ["TInt",1];
hxsl_Type.TInt.toString = $estr;
hxsl_Type.TInt.__enum__ = hxsl_Type;
hxsl_Type.TBool = ["TBool",2];
hxsl_Type.TBool.toString = $estr;
hxsl_Type.TBool.__enum__ = hxsl_Type;
hxsl_Type.TFloat = ["TFloat",3];
hxsl_Type.TFloat.toString = $estr;
hxsl_Type.TFloat.__enum__ = hxsl_Type;
hxsl_Type.TString = ["TString",4];
hxsl_Type.TString.toString = $estr;
hxsl_Type.TString.__enum__ = hxsl_Type;
hxsl_Type.TVec = function(size,t) { var $x = ["TVec",5,size,t]; $x.__enum__ = hxsl_Type; $x.toString = $estr; return $x; };
hxsl_Type.TMat3 = ["TMat3",6];
hxsl_Type.TMat3.toString = $estr;
hxsl_Type.TMat3.__enum__ = hxsl_Type;
hxsl_Type.TMat4 = ["TMat4",7];
hxsl_Type.TMat4.toString = $estr;
hxsl_Type.TMat4.__enum__ = hxsl_Type;
hxsl_Type.TMat3x4 = ["TMat3x4",8];
hxsl_Type.TMat3x4.toString = $estr;
hxsl_Type.TMat3x4.__enum__ = hxsl_Type;
hxsl_Type.TBytes = function(size) { var $x = ["TBytes",9,size]; $x.__enum__ = hxsl_Type; $x.toString = $estr; return $x; };
hxsl_Type.TSampler2D = ["TSampler2D",10];
hxsl_Type.TSampler2D.toString = $estr;
hxsl_Type.TSampler2D.__enum__ = hxsl_Type;
hxsl_Type.TSamplerCube = ["TSamplerCube",11];
hxsl_Type.TSamplerCube.toString = $estr;
hxsl_Type.TSamplerCube.__enum__ = hxsl_Type;
hxsl_Type.TStruct = function(vl) { var $x = ["TStruct",12,vl]; $x.__enum__ = hxsl_Type; $x.toString = $estr; return $x; };
hxsl_Type.TFun = function(variants) { var $x = ["TFun",13,variants]; $x.__enum__ = hxsl_Type; $x.toString = $estr; return $x; };
hxsl_Type.TArray = function(t,size) { var $x = ["TArray",14,t,size]; $x.__enum__ = hxsl_Type; $x.toString = $estr; return $x; };
hxsl_Type.__empty_constructs__ = [hxsl_Type.TVoid,hxsl_Type.TInt,hxsl_Type.TBool,hxsl_Type.TFloat,hxsl_Type.TString,hxsl_Type.TMat3,hxsl_Type.TMat4,hxsl_Type.TMat3x4,hxsl_Type.TSampler2D,hxsl_Type.TSamplerCube];
var hxsl_VecType = $hxClasses["hxsl.VecType"] = { __ename__ : true, __constructs__ : ["VInt","VFloat","VBool"] };
hxsl_VecType.VInt = ["VInt",0];
hxsl_VecType.VInt.toString = $estr;
hxsl_VecType.VInt.__enum__ = hxsl_VecType;
hxsl_VecType.VFloat = ["VFloat",1];
hxsl_VecType.VFloat.toString = $estr;
hxsl_VecType.VFloat.__enum__ = hxsl_VecType;
hxsl_VecType.VBool = ["VBool",2];
hxsl_VecType.VBool.toString = $estr;
hxsl_VecType.VBool.__enum__ = hxsl_VecType;
hxsl_VecType.__empty_constructs__ = [hxsl_VecType.VInt,hxsl_VecType.VFloat,hxsl_VecType.VBool];
var hxsl_SizeDecl = $hxClasses["hxsl.SizeDecl"] = { __ename__ : true, __constructs__ : ["SConst","SVar"] };
hxsl_SizeDecl.SConst = function(v) { var $x = ["SConst",0,v]; $x.__enum__ = hxsl_SizeDecl; $x.toString = $estr; return $x; };
hxsl_SizeDecl.SVar = function(v) { var $x = ["SVar",1,v]; $x.__enum__ = hxsl_SizeDecl; $x.toString = $estr; return $x; };
hxsl_SizeDecl.__empty_constructs__ = [];
var hxsl_Error = function(msg,pos) {
	this.msg = msg;
	this.pos = pos;
};
$hxClasses["hxsl.Error"] = hxsl_Error;
hxsl_Error.__name__ = ["hxsl","Error"];
hxsl_Error.t = function(msg,pos) {
	throw new js__$Boot_HaxeError(new hxsl_Error(msg,pos));
	return null;
};
hxsl_Error.prototype = {
	toString: function() {
		return "Error(" + this.msg + ")@" + Std.string(this.pos);
	}
	,__class__: hxsl_Error
};
var hxsl_VarKind = $hxClasses["hxsl.VarKind"] = { __ename__ : true, __constructs__ : ["Global","Input","Param","Var","Local","Output","Function"] };
hxsl_VarKind.Global = ["Global",0];
hxsl_VarKind.Global.toString = $estr;
hxsl_VarKind.Global.__enum__ = hxsl_VarKind;
hxsl_VarKind.Input = ["Input",1];
hxsl_VarKind.Input.toString = $estr;
hxsl_VarKind.Input.__enum__ = hxsl_VarKind;
hxsl_VarKind.Param = ["Param",2];
hxsl_VarKind.Param.toString = $estr;
hxsl_VarKind.Param.__enum__ = hxsl_VarKind;
hxsl_VarKind.Var = ["Var",3];
hxsl_VarKind.Var.toString = $estr;
hxsl_VarKind.Var.__enum__ = hxsl_VarKind;
hxsl_VarKind.Local = ["Local",4];
hxsl_VarKind.Local.toString = $estr;
hxsl_VarKind.Local.__enum__ = hxsl_VarKind;
hxsl_VarKind.Output = ["Output",5];
hxsl_VarKind.Output.toString = $estr;
hxsl_VarKind.Output.__enum__ = hxsl_VarKind;
hxsl_VarKind.Function = ["Function",6];
hxsl_VarKind.Function.toString = $estr;
hxsl_VarKind.Function.__enum__ = hxsl_VarKind;
hxsl_VarKind.__empty_constructs__ = [hxsl_VarKind.Global,hxsl_VarKind.Input,hxsl_VarKind.Param,hxsl_VarKind.Var,hxsl_VarKind.Local,hxsl_VarKind.Output,hxsl_VarKind.Function];
var hxsl_VarQualifier = $hxClasses["hxsl.VarQualifier"] = { __ename__ : true, __constructs__ : ["Const","Private","Nullable","PerObject","Name","Shared","Precision","Range","Ignore"] };
hxsl_VarQualifier.Const = function(max) { var $x = ["Const",0,max]; $x.__enum__ = hxsl_VarQualifier; $x.toString = $estr; return $x; };
hxsl_VarQualifier.Private = ["Private",1];
hxsl_VarQualifier.Private.toString = $estr;
hxsl_VarQualifier.Private.__enum__ = hxsl_VarQualifier;
hxsl_VarQualifier.Nullable = ["Nullable",2];
hxsl_VarQualifier.Nullable.toString = $estr;
hxsl_VarQualifier.Nullable.__enum__ = hxsl_VarQualifier;
hxsl_VarQualifier.PerObject = ["PerObject",3];
hxsl_VarQualifier.PerObject.toString = $estr;
hxsl_VarQualifier.PerObject.__enum__ = hxsl_VarQualifier;
hxsl_VarQualifier.Name = function(n) { var $x = ["Name",4,n]; $x.__enum__ = hxsl_VarQualifier; $x.toString = $estr; return $x; };
hxsl_VarQualifier.Shared = ["Shared",5];
hxsl_VarQualifier.Shared.toString = $estr;
hxsl_VarQualifier.Shared.__enum__ = hxsl_VarQualifier;
hxsl_VarQualifier.Precision = function(p) { var $x = ["Precision",6,p]; $x.__enum__ = hxsl_VarQualifier; $x.toString = $estr; return $x; };
hxsl_VarQualifier.Range = function(min,max) { var $x = ["Range",7,min,max]; $x.__enum__ = hxsl_VarQualifier; $x.toString = $estr; return $x; };
hxsl_VarQualifier.Ignore = ["Ignore",8];
hxsl_VarQualifier.Ignore.toString = $estr;
hxsl_VarQualifier.Ignore.__enum__ = hxsl_VarQualifier;
hxsl_VarQualifier.__empty_constructs__ = [hxsl_VarQualifier.Private,hxsl_VarQualifier.Nullable,hxsl_VarQualifier.PerObject,hxsl_VarQualifier.Shared,hxsl_VarQualifier.Ignore];
var hxsl_Prec = $hxClasses["hxsl.Prec"] = { __ename__ : true, __constructs__ : ["Low","Medium","High"] };
hxsl_Prec.Low = ["Low",0];
hxsl_Prec.Low.toString = $estr;
hxsl_Prec.Low.__enum__ = hxsl_Prec;
hxsl_Prec.Medium = ["Medium",1];
hxsl_Prec.Medium.toString = $estr;
hxsl_Prec.Medium.__enum__ = hxsl_Prec;
hxsl_Prec.High = ["High",2];
hxsl_Prec.High.toString = $estr;
hxsl_Prec.High.__enum__ = hxsl_Prec;
hxsl_Prec.__empty_constructs__ = [hxsl_Prec.Low,hxsl_Prec.Medium,hxsl_Prec.High];
var hxsl_Const = $hxClasses["hxsl.Const"] = { __ename__ : true, __constructs__ : ["CNull","CBool","CInt","CFloat","CString"] };
hxsl_Const.CNull = ["CNull",0];
hxsl_Const.CNull.toString = $estr;
hxsl_Const.CNull.__enum__ = hxsl_Const;
hxsl_Const.CBool = function(b) { var $x = ["CBool",1,b]; $x.__enum__ = hxsl_Const; $x.toString = $estr; return $x; };
hxsl_Const.CInt = function(v) { var $x = ["CInt",2,v]; $x.__enum__ = hxsl_Const; $x.toString = $estr; return $x; };
hxsl_Const.CFloat = function(v) { var $x = ["CFloat",3,v]; $x.__enum__ = hxsl_Const; $x.toString = $estr; return $x; };
hxsl_Const.CString = function(v) { var $x = ["CString",4,v]; $x.__enum__ = hxsl_Const; $x.toString = $estr; return $x; };
hxsl_Const.__empty_constructs__ = [hxsl_Const.CNull];
var hxsl_FunctionKind = $hxClasses["hxsl.FunctionKind"] = { __ename__ : true, __constructs__ : ["Vertex","Fragment","Init","Helper"] };
hxsl_FunctionKind.Vertex = ["Vertex",0];
hxsl_FunctionKind.Vertex.toString = $estr;
hxsl_FunctionKind.Vertex.__enum__ = hxsl_FunctionKind;
hxsl_FunctionKind.Fragment = ["Fragment",1];
hxsl_FunctionKind.Fragment.toString = $estr;
hxsl_FunctionKind.Fragment.__enum__ = hxsl_FunctionKind;
hxsl_FunctionKind.Init = ["Init",2];
hxsl_FunctionKind.Init.toString = $estr;
hxsl_FunctionKind.Init.__enum__ = hxsl_FunctionKind;
hxsl_FunctionKind.Helper = ["Helper",3];
hxsl_FunctionKind.Helper.toString = $estr;
hxsl_FunctionKind.Helper.__enum__ = hxsl_FunctionKind;
hxsl_FunctionKind.__empty_constructs__ = [hxsl_FunctionKind.Vertex,hxsl_FunctionKind.Fragment,hxsl_FunctionKind.Init,hxsl_FunctionKind.Helper];
var hxsl_TGlobal = $hxClasses["hxsl.TGlobal"] = { __ename__ : true, __constructs__ : ["Radians","Degrees","Sin","Cos","Tan","Asin","Acos","Atan","Pow","Exp","Log","Exp2","Log2","Sqrt","Inversesqrt","Abs","Sign","Floor","Ceil","Fract","Mod","Min","Max","Clamp","Mix","Step","SmoothStep","Length","Distance","Dot","Cross","Normalize","LReflect","Texture2D","TextureCube","ToInt","ToFloat","ToBool","Vec2","Vec3","Vec4","IVec2","IVec3","IVec4","BVec2","BVec3","BVec4","Mat2","Mat3","Mat4","Mat3x4","Saturate","Pack","Unpack","PackNormal","UnpackNormal","DFdx","DFdy","Fwidth"] };
hxsl_TGlobal.Radians = ["Radians",0];
hxsl_TGlobal.Radians.toString = $estr;
hxsl_TGlobal.Radians.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Degrees = ["Degrees",1];
hxsl_TGlobal.Degrees.toString = $estr;
hxsl_TGlobal.Degrees.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Sin = ["Sin",2];
hxsl_TGlobal.Sin.toString = $estr;
hxsl_TGlobal.Sin.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Cos = ["Cos",3];
hxsl_TGlobal.Cos.toString = $estr;
hxsl_TGlobal.Cos.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Tan = ["Tan",4];
hxsl_TGlobal.Tan.toString = $estr;
hxsl_TGlobal.Tan.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Asin = ["Asin",5];
hxsl_TGlobal.Asin.toString = $estr;
hxsl_TGlobal.Asin.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Acos = ["Acos",6];
hxsl_TGlobal.Acos.toString = $estr;
hxsl_TGlobal.Acos.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Atan = ["Atan",7];
hxsl_TGlobal.Atan.toString = $estr;
hxsl_TGlobal.Atan.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Pow = ["Pow",8];
hxsl_TGlobal.Pow.toString = $estr;
hxsl_TGlobal.Pow.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Exp = ["Exp",9];
hxsl_TGlobal.Exp.toString = $estr;
hxsl_TGlobal.Exp.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Log = ["Log",10];
hxsl_TGlobal.Log.toString = $estr;
hxsl_TGlobal.Log.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Exp2 = ["Exp2",11];
hxsl_TGlobal.Exp2.toString = $estr;
hxsl_TGlobal.Exp2.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Log2 = ["Log2",12];
hxsl_TGlobal.Log2.toString = $estr;
hxsl_TGlobal.Log2.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Sqrt = ["Sqrt",13];
hxsl_TGlobal.Sqrt.toString = $estr;
hxsl_TGlobal.Sqrt.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Inversesqrt = ["Inversesqrt",14];
hxsl_TGlobal.Inversesqrt.toString = $estr;
hxsl_TGlobal.Inversesqrt.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Abs = ["Abs",15];
hxsl_TGlobal.Abs.toString = $estr;
hxsl_TGlobal.Abs.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Sign = ["Sign",16];
hxsl_TGlobal.Sign.toString = $estr;
hxsl_TGlobal.Sign.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Floor = ["Floor",17];
hxsl_TGlobal.Floor.toString = $estr;
hxsl_TGlobal.Floor.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Ceil = ["Ceil",18];
hxsl_TGlobal.Ceil.toString = $estr;
hxsl_TGlobal.Ceil.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Fract = ["Fract",19];
hxsl_TGlobal.Fract.toString = $estr;
hxsl_TGlobal.Fract.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Mod = ["Mod",20];
hxsl_TGlobal.Mod.toString = $estr;
hxsl_TGlobal.Mod.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Min = ["Min",21];
hxsl_TGlobal.Min.toString = $estr;
hxsl_TGlobal.Min.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Max = ["Max",22];
hxsl_TGlobal.Max.toString = $estr;
hxsl_TGlobal.Max.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Clamp = ["Clamp",23];
hxsl_TGlobal.Clamp.toString = $estr;
hxsl_TGlobal.Clamp.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Mix = ["Mix",24];
hxsl_TGlobal.Mix.toString = $estr;
hxsl_TGlobal.Mix.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Step = ["Step",25];
hxsl_TGlobal.Step.toString = $estr;
hxsl_TGlobal.Step.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.SmoothStep = ["SmoothStep",26];
hxsl_TGlobal.SmoothStep.toString = $estr;
hxsl_TGlobal.SmoothStep.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Length = ["Length",27];
hxsl_TGlobal.Length.toString = $estr;
hxsl_TGlobal.Length.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Distance = ["Distance",28];
hxsl_TGlobal.Distance.toString = $estr;
hxsl_TGlobal.Distance.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Dot = ["Dot",29];
hxsl_TGlobal.Dot.toString = $estr;
hxsl_TGlobal.Dot.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Cross = ["Cross",30];
hxsl_TGlobal.Cross.toString = $estr;
hxsl_TGlobal.Cross.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Normalize = ["Normalize",31];
hxsl_TGlobal.Normalize.toString = $estr;
hxsl_TGlobal.Normalize.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.LReflect = ["LReflect",32];
hxsl_TGlobal.LReflect.toString = $estr;
hxsl_TGlobal.LReflect.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Texture2D = ["Texture2D",33];
hxsl_TGlobal.Texture2D.toString = $estr;
hxsl_TGlobal.Texture2D.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.TextureCube = ["TextureCube",34];
hxsl_TGlobal.TextureCube.toString = $estr;
hxsl_TGlobal.TextureCube.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.ToInt = ["ToInt",35];
hxsl_TGlobal.ToInt.toString = $estr;
hxsl_TGlobal.ToInt.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.ToFloat = ["ToFloat",36];
hxsl_TGlobal.ToFloat.toString = $estr;
hxsl_TGlobal.ToFloat.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.ToBool = ["ToBool",37];
hxsl_TGlobal.ToBool.toString = $estr;
hxsl_TGlobal.ToBool.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Vec2 = ["Vec2",38];
hxsl_TGlobal.Vec2.toString = $estr;
hxsl_TGlobal.Vec2.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Vec3 = ["Vec3",39];
hxsl_TGlobal.Vec3.toString = $estr;
hxsl_TGlobal.Vec3.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Vec4 = ["Vec4",40];
hxsl_TGlobal.Vec4.toString = $estr;
hxsl_TGlobal.Vec4.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.IVec2 = ["IVec2",41];
hxsl_TGlobal.IVec2.toString = $estr;
hxsl_TGlobal.IVec2.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.IVec3 = ["IVec3",42];
hxsl_TGlobal.IVec3.toString = $estr;
hxsl_TGlobal.IVec3.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.IVec4 = ["IVec4",43];
hxsl_TGlobal.IVec4.toString = $estr;
hxsl_TGlobal.IVec4.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.BVec2 = ["BVec2",44];
hxsl_TGlobal.BVec2.toString = $estr;
hxsl_TGlobal.BVec2.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.BVec3 = ["BVec3",45];
hxsl_TGlobal.BVec3.toString = $estr;
hxsl_TGlobal.BVec3.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.BVec4 = ["BVec4",46];
hxsl_TGlobal.BVec4.toString = $estr;
hxsl_TGlobal.BVec4.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Mat2 = ["Mat2",47];
hxsl_TGlobal.Mat2.toString = $estr;
hxsl_TGlobal.Mat2.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Mat3 = ["Mat3",48];
hxsl_TGlobal.Mat3.toString = $estr;
hxsl_TGlobal.Mat3.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Mat4 = ["Mat4",49];
hxsl_TGlobal.Mat4.toString = $estr;
hxsl_TGlobal.Mat4.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Mat3x4 = ["Mat3x4",50];
hxsl_TGlobal.Mat3x4.toString = $estr;
hxsl_TGlobal.Mat3x4.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Saturate = ["Saturate",51];
hxsl_TGlobal.Saturate.toString = $estr;
hxsl_TGlobal.Saturate.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Pack = ["Pack",52];
hxsl_TGlobal.Pack.toString = $estr;
hxsl_TGlobal.Pack.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Unpack = ["Unpack",53];
hxsl_TGlobal.Unpack.toString = $estr;
hxsl_TGlobal.Unpack.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.PackNormal = ["PackNormal",54];
hxsl_TGlobal.PackNormal.toString = $estr;
hxsl_TGlobal.PackNormal.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.UnpackNormal = ["UnpackNormal",55];
hxsl_TGlobal.UnpackNormal.toString = $estr;
hxsl_TGlobal.UnpackNormal.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.DFdx = ["DFdx",56];
hxsl_TGlobal.DFdx.toString = $estr;
hxsl_TGlobal.DFdx.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.DFdy = ["DFdy",57];
hxsl_TGlobal.DFdy.toString = $estr;
hxsl_TGlobal.DFdy.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.Fwidth = ["Fwidth",58];
hxsl_TGlobal.Fwidth.toString = $estr;
hxsl_TGlobal.Fwidth.__enum__ = hxsl_TGlobal;
hxsl_TGlobal.__empty_constructs__ = [hxsl_TGlobal.Radians,hxsl_TGlobal.Degrees,hxsl_TGlobal.Sin,hxsl_TGlobal.Cos,hxsl_TGlobal.Tan,hxsl_TGlobal.Asin,hxsl_TGlobal.Acos,hxsl_TGlobal.Atan,hxsl_TGlobal.Pow,hxsl_TGlobal.Exp,hxsl_TGlobal.Log,hxsl_TGlobal.Exp2,hxsl_TGlobal.Log2,hxsl_TGlobal.Sqrt,hxsl_TGlobal.Inversesqrt,hxsl_TGlobal.Abs,hxsl_TGlobal.Sign,hxsl_TGlobal.Floor,hxsl_TGlobal.Ceil,hxsl_TGlobal.Fract,hxsl_TGlobal.Mod,hxsl_TGlobal.Min,hxsl_TGlobal.Max,hxsl_TGlobal.Clamp,hxsl_TGlobal.Mix,hxsl_TGlobal.Step,hxsl_TGlobal.SmoothStep,hxsl_TGlobal.Length,hxsl_TGlobal.Distance,hxsl_TGlobal.Dot,hxsl_TGlobal.Cross,hxsl_TGlobal.Normalize,hxsl_TGlobal.LReflect,hxsl_TGlobal.Texture2D,hxsl_TGlobal.TextureCube,hxsl_TGlobal.ToInt,hxsl_TGlobal.ToFloat,hxsl_TGlobal.ToBool,hxsl_TGlobal.Vec2,hxsl_TGlobal.Vec3,hxsl_TGlobal.Vec4,hxsl_TGlobal.IVec2,hxsl_TGlobal.IVec3,hxsl_TGlobal.IVec4,hxsl_TGlobal.BVec2,hxsl_TGlobal.BVec3,hxsl_TGlobal.BVec4,hxsl_TGlobal.Mat2,hxsl_TGlobal.Mat3,hxsl_TGlobal.Mat4,hxsl_TGlobal.Mat3x4,hxsl_TGlobal.Saturate,hxsl_TGlobal.Pack,hxsl_TGlobal.Unpack,hxsl_TGlobal.PackNormal,hxsl_TGlobal.UnpackNormal,hxsl_TGlobal.DFdx,hxsl_TGlobal.DFdy,hxsl_TGlobal.Fwidth];
var hxsl_Component = $hxClasses["hxsl.Component"] = { __ename__ : true, __constructs__ : ["X","Y","Z","W"] };
hxsl_Component.X = ["X",0];
hxsl_Component.X.toString = $estr;
hxsl_Component.X.__enum__ = hxsl_Component;
hxsl_Component.Y = ["Y",1];
hxsl_Component.Y.toString = $estr;
hxsl_Component.Y.__enum__ = hxsl_Component;
hxsl_Component.Z = ["Z",2];
hxsl_Component.Z.toString = $estr;
hxsl_Component.Z.__enum__ = hxsl_Component;
hxsl_Component.W = ["W",3];
hxsl_Component.W.toString = $estr;
hxsl_Component.W.__enum__ = hxsl_Component;
hxsl_Component.__empty_constructs__ = [hxsl_Component.X,hxsl_Component.Y,hxsl_Component.Z,hxsl_Component.W];
var hxsl_TExprDef = $hxClasses["hxsl.TExprDef"] = { __ename__ : true, __constructs__ : ["TConst","TVar","TGlobal","TParenthesis","TBlock","TBinop","TUnop","TVarDecl","TCall","TSwiz","TIf","TDiscard","TReturn","TFor","TContinue","TBreak","TArray","TArrayDecl"] };
hxsl_TExprDef.TConst = function(c) { var $x = ["TConst",0,c]; $x.__enum__ = hxsl_TExprDef; $x.toString = $estr; return $x; };
hxsl_TExprDef.TVar = function(v) { var $x = ["TVar",1,v]; $x.__enum__ = hxsl_TExprDef; $x.toString = $estr; return $x; };
hxsl_TExprDef.TGlobal = function(g) { var $x = ["TGlobal",2,g]; $x.__enum__ = hxsl_TExprDef; $x.toString = $estr; return $x; };
hxsl_TExprDef.TParenthesis = function(e) { var $x = ["TParenthesis",3,e]; $x.__enum__ = hxsl_TExprDef; $x.toString = $estr; return $x; };
hxsl_TExprDef.TBlock = function(el) { var $x = ["TBlock",4,el]; $x.__enum__ = hxsl_TExprDef; $x.toString = $estr; return $x; };
hxsl_TExprDef.TBinop = function(op,e1,e2) { var $x = ["TBinop",5,op,e1,e2]; $x.__enum__ = hxsl_TExprDef; $x.toString = $estr; return $x; };
hxsl_TExprDef.TUnop = function(op,e1) { var $x = ["TUnop",6,op,e1]; $x.__enum__ = hxsl_TExprDef; $x.toString = $estr; return $x; };
hxsl_TExprDef.TVarDecl = function(v,init) { var $x = ["TVarDecl",7,v,init]; $x.__enum__ = hxsl_TExprDef; $x.toString = $estr; return $x; };
hxsl_TExprDef.TCall = function(e,args) { var $x = ["TCall",8,e,args]; $x.__enum__ = hxsl_TExprDef; $x.toString = $estr; return $x; };
hxsl_TExprDef.TSwiz = function(e,regs) { var $x = ["TSwiz",9,e,regs]; $x.__enum__ = hxsl_TExprDef; $x.toString = $estr; return $x; };
hxsl_TExprDef.TIf = function(econd,eif,eelse) { var $x = ["TIf",10,econd,eif,eelse]; $x.__enum__ = hxsl_TExprDef; $x.toString = $estr; return $x; };
hxsl_TExprDef.TDiscard = ["TDiscard",11];
hxsl_TExprDef.TDiscard.toString = $estr;
hxsl_TExprDef.TDiscard.__enum__ = hxsl_TExprDef;
hxsl_TExprDef.TReturn = function(e) { var $x = ["TReturn",12,e]; $x.__enum__ = hxsl_TExprDef; $x.toString = $estr; return $x; };
hxsl_TExprDef.TFor = function(v,it,loop) { var $x = ["TFor",13,v,it,loop]; $x.__enum__ = hxsl_TExprDef; $x.toString = $estr; return $x; };
hxsl_TExprDef.TContinue = ["TContinue",14];
hxsl_TExprDef.TContinue.toString = $estr;
hxsl_TExprDef.TContinue.__enum__ = hxsl_TExprDef;
hxsl_TExprDef.TBreak = ["TBreak",15];
hxsl_TExprDef.TBreak.toString = $estr;
hxsl_TExprDef.TBreak.__enum__ = hxsl_TExprDef;
hxsl_TExprDef.TArray = function(e,index) { var $x = ["TArray",16,e,index]; $x.__enum__ = hxsl_TExprDef; $x.toString = $estr; return $x; };
hxsl_TExprDef.TArrayDecl = function(el) { var $x = ["TArrayDecl",17,el]; $x.__enum__ = hxsl_TExprDef; $x.toString = $estr; return $x; };
hxsl_TExprDef.__empty_constructs__ = [hxsl_TExprDef.TDiscard,hxsl_TExprDef.TContinue,hxsl_TExprDef.TBreak];
var hxsl_Tools = function() { };
$hxClasses["hxsl.Tools"] = hxsl_Tools;
hxsl_Tools.__name__ = ["hxsl","Tools"];
hxsl_Tools.allocVarId = function() {
	return ++hxsl_Tools.UID;
};
hxsl_Tools.getName = function(v) {
	if(v.qualifiers == null) return v.name;
	var _g = 0;
	var _g1 = v.qualifiers;
	while(_g < _g1.length) {
		var q = _g1[_g];
		++_g;
		switch(q[1]) {
		case 4:
			var n = q[2];
			return n;
		default:
		}
	}
	return v.name;
};
hxsl_Tools.getConstBits = function(v) {
	var _g = v.type;
	switch(_g[1]) {
	case 2:
		return 1;
	case 1:
		var _g1 = 0;
		var _g2 = v.qualifiers;
		while(_g1 < _g2.length) {
			var q = _g2[_g1];
			++_g1;
			switch(q[1]) {
			case 0:
				var n = q[2];
				if(n != null) {
					var bits = 0;
					while(n >= 1 << bits) bits++;
					return bits;
				}
				return 8;
			default:
			}
		}
		break;
	default:
	}
	return 0;
};
hxsl_Tools.isConst = function(v) {
	if(v.qualifiers != null) {
		var _g = 0;
		var _g1 = v.qualifiers;
		while(_g < _g1.length) {
			var q = _g1[_g];
			++_g;
			switch(q[1]) {
			case 0:
				return true;
			default:
			}
		}
	}
	return false;
};
hxsl_Tools.hasQualifier = function(v,q) {
	if(v.qualifiers != null) {
		var _g = 0;
		var _g1 = v.qualifiers;
		while(_g < _g1.length) {
			var q2 = _g1[_g];
			++_g;
			if(q2 == q) return true;
		}
	}
	return false;
};
hxsl_Tools.toString = function(t) {
	switch(t[1]) {
	case 5:
		var t1 = t[3];
		var size = t[2];
		var prefix;
		switch(t1[1]) {
		case 1:
			prefix = "";
			break;
		case 0:
			prefix = "I";
			break;
		case 2:
			prefix = "B";
			break;
		}
		return prefix + "Vec" + size;
	case 12:
		var vl = t[2];
		return "{" + ((function($this) {
			var $r;
			var _g = [];
			{
				var _g1 = 0;
				while(_g1 < vl.length) {
					var v = vl[_g1];
					++_g1;
					_g.push(v.name + " : " + hxsl_Tools.toString(v.type));
				}
			}
			$r = _g;
			return $r;
		}(this))).join(",") + "}";
	case 14:
		var s = t[3];
		var t2 = t[2];
		return hxsl_Tools.toString(t2) + "[" + (function($this) {
			var $r;
			switch(s[1]) {
			case 0:
				$r = (function($this) {
					var $r;
					var i = s[2];
					$r = "" + i;
					return $r;
				}($this));
				break;
			case 1:
				$r = (function($this) {
					var $r;
					var v1 = s[2];
					$r = v1.name;
					return $r;
				}($this));
				break;
			}
			return $r;
		}(this)) + "]";
	default:
		return HxOverrides.substr(t[0],1,null);
	}
};
hxsl_Tools.iter = function(e,f) {
	{
		var _g = e.e;
		switch(_g[1]) {
		case 3:
			var e1 = _g[2];
			f(e1);
			break;
		case 4:
			var el = _g[2];
			var _g1 = 0;
			while(_g1 < el.length) {
				var e2 = el[_g1];
				++_g1;
				f(e2);
			}
			break;
		case 5:
			var e21 = _g[4];
			var e11 = _g[3];
			f(e11);
			f(e21);
			break;
		case 6:
			var e12 = _g[3];
			f(e12);
			break;
		case 7:
			var init = _g[3];
			if(init != null) f(init);
			break;
		case 8:
			var args = _g[3];
			var e3 = _g[2];
			f(e3);
			var _g11 = 0;
			while(_g11 < args.length) {
				var a = args[_g11];
				++_g11;
				f(a);
			}
			break;
		case 9:
			var e4 = _g[2];
			f(e4);
			break;
		case 10:
			var eelse = _g[4];
			var eif = _g[3];
			var econd = _g[2];
			f(econd);
			f(eif);
			if(eelse != null) f(eelse);
			break;
		case 12:
			var e5 = _g[2];
			if(e5 != null) f(e5);
			break;
		case 13:
			var loop = _g[4];
			var it = _g[3];
			f(it);
			f(loop);
			break;
		case 16:
			var index = _g[3];
			var e6 = _g[2];
			f(e6);
			f(index);
			break;
		case 17:
			var el1 = _g[2];
			var _g12 = 0;
			while(_g12 < el1.length) {
				var e7 = el1[_g12];
				++_g12;
				f(e7);
			}
			break;
		case 0:case 1:case 2:case 11:case 14:case 15:
			break;
		}
	}
};
hxsl_Tools.map = function(e,f) {
	var ed;
	{
		var _g = e.e;
		switch(_g[1]) {
		case 3:
			var e1 = _g[2];
			ed = hxsl_TExprDef.TParenthesis(f(e1));
			break;
		case 4:
			var el = _g[2];
			ed = hxsl_TExprDef.TBlock((function($this) {
				var $r;
				var _g1 = [];
				{
					var _g2 = 0;
					while(_g2 < el.length) {
						var e2 = el[_g2];
						++_g2;
						_g1.push(f(e2));
					}
				}
				$r = _g1;
				return $r;
			}(this)));
			break;
		case 5:
			var e21 = _g[4];
			var e11 = _g[3];
			var op = _g[2];
			ed = hxsl_TExprDef.TBinop(op,f(e11),f(e21));
			break;
		case 6:
			var e12 = _g[3];
			var op1 = _g[2];
			ed = hxsl_TExprDef.TUnop(op1,f(e12));
			break;
		case 7:
			var init = _g[3];
			var v = _g[2];
			ed = hxsl_TExprDef.TVarDecl(v,init != null?f(init):null);
			break;
		case 8:
			var args = _g[3];
			var e3 = _g[2];
			ed = hxsl_TExprDef.TCall(f(e3),(function($this) {
				var $r;
				var _g11 = [];
				{
					var _g21 = 0;
					while(_g21 < args.length) {
						var a = args[_g21];
						++_g21;
						_g11.push(f(a));
					}
				}
				$r = _g11;
				return $r;
			}(this)));
			break;
		case 9:
			var c = _g[3];
			var e4 = _g[2];
			ed = hxsl_TExprDef.TSwiz(f(e4),c);
			break;
		case 10:
			var eelse = _g[4];
			var eif = _g[3];
			var econd = _g[2];
			ed = hxsl_TExprDef.TIf(f(econd),f(eif),eelse != null?f(eelse):null);
			break;
		case 12:
			var e5 = _g[2];
			ed = hxsl_TExprDef.TReturn(e5 != null?f(e5):null);
			break;
		case 13:
			var loop = _g[4];
			var it = _g[3];
			var v1 = _g[2];
			ed = hxsl_TExprDef.TFor(v1,f(it),f(loop));
			break;
		case 16:
			var index = _g[3];
			var e6 = _g[2];
			ed = hxsl_TExprDef.TArray(f(e6),f(index));
			break;
		case 17:
			var el1 = _g[2];
			ed = hxsl_TExprDef.TArrayDecl((function($this) {
				var $r;
				var _g12 = [];
				{
					var _g22 = 0;
					while(_g22 < el1.length) {
						var e7 = el1[_g22];
						++_g22;
						_g12.push(f(e7));
					}
				}
				$r = _g12;
				return $r;
			}(this)));
			break;
		case 0:case 1:case 2:case 11:case 14:case 15:
			ed = e.e;
			break;
		}
	}
	return { e : ed, t : e.t, p : e.p};
};
var hxsl_Tools2 = function() { };
$hxClasses["hxsl.Tools2"] = hxsl_Tools2;
hxsl_Tools2.__name__ = ["hxsl","Tools2"];
hxsl_Tools2.toString = function(g) {
	var n = g[0];
	return n.charAt(0).toLowerCase() + HxOverrides.substr(n,1,null);
};
var hxsl_SearchMap = function() {
};
$hxClasses["hxsl.SearchMap"] = hxsl_SearchMap;
hxsl_SearchMap.__name__ = ["hxsl","SearchMap"];
hxsl_SearchMap.prototype = {
	__class__: hxsl_SearchMap
};
var hxsl_Cache = function() {
	this.constsToGlobal = false;
	this.linkCache = new haxe_ds_IntMap();
	this.outVarsMap = new haxe_ds_StringMap();
	this.outVars = [];
	this.byID = new haxe_ds_StringMap();
};
$hxClasses["hxsl.Cache"] = hxsl_Cache;
hxsl_Cache.__name__ = ["hxsl","Cache"];
hxsl_Cache.get = function() {
	var c = hxsl_Cache.INST;
	if(c == null) hxsl_Cache.INST = c = new hxsl_Cache();
	return c;
};
hxsl_Cache.prototype = {
	allocOutputVars: function(vars) {
		var key = vars.join(",");
		var id = this.outVarsMap.get(key);
		if(id != null) return id;
		vars = vars.slice();
		vars.sort(Reflect.compare);
		var key1 = vars.join(",");
		id = this.outVarsMap.get(key1);
		if(id != null) {
			this.outVarsMap.set(key,id);
			return id;
		}
		id = this.outVars.length;
		this.outVars.push(vars);
		this.outVarsMap.set(key,id);
		return id;
	}
	,link: function(shaders,outVars) {
		var c = this.linkCache.h[outVars];
		if(c == null) {
			c = new hxsl_SearchMap();
			this.linkCache.h[outVars] = c;
		}
		var _g = new hxsl__$ShaderList_ShaderIterator(shaders,null);
		while(_g.l != _g.last) {
			var s = _g.next();
			var i = s.instance;
			if(c.next == null) c.next = new haxe_ds_IntMap();
			var cs = c.next.h[i.id];
			if(cs == null) {
				cs = new hxsl_SearchMap();
				c.next.h[i.id] = cs;
			}
			c = cs;
		}
		if(c.linked == null) c.linked = this.compileRuntimeShader(shaders,outVars);
		return c.linked;
	}
	,compileRuntimeShader: function(shaders,outVars) {
		var shaderDatas = [];
		var index = 0;
		var _g2 = new hxsl__$ShaderList_ShaderIterator(shaders,null);
		while(_g2.l != _g2.last) {
			var s4 = _g2.next();
			var i = s4.instance;
			shaderDatas.push({ inst : i, p : s4.priority, index : index++});
		}
		shaderDatas.reverse();
		haxe_ds_ArraySort.sort(shaderDatas,function(s11,s21) {
			return s21.p - s11.p;
		});
		var linker = new hxsl_Linker();
		var s1 = linker.link((function($this) {
			var $r;
			var _g = [];
			{
				var _g1 = 0;
				while(_g1 < shaderDatas.length) {
					var s = shaderDatas[_g1];
					++_g1;
					_g.push(s.inst.shader);
				}
			}
			$r = _g;
			return $r;
		}(this)),this.outVars[outVars]);
		var paramVars = new haxe_ds_IntMap();
		var _g11 = 0;
		var _g21 = linker.allVars;
		while(_g11 < _g21.length) {
			var v = _g21[_g11];
			++_g11;
			if(v.v.kind == hxsl_VarKind.Param) {
				{
					var _g3 = v.v.type;
					switch(_g3[1]) {
					case 12:
						continue;
						break;
					default:
					}
				}
				var inf = shaderDatas[v.instanceIndex];
				var value = { instance : inf.index, index : inf.inst.params.h[v.merged[0].id]};
				paramVars.h[v.id] = value;
			}
		}
		var prev = s1;
		var s2 = new hxsl_Splitter().split(s1);
		var prev1 = s2;
		var s3 = new hxsl_Dce().dce(s2.vertex,s2.fragment);
		var r = new hxsl_RuntimeShader();
		r.vertex = this.flattenShader(s3.vertex,hxsl_FunctionKind.Vertex,paramVars);
		r.vertex.vertex = true;
		r.fragment = this.flattenShader(s3.fragment,hxsl_FunctionKind.Fragment,paramVars);
		r.globals = new haxe_ds_IntMap();
		this.initGlobals(r,r.vertex);
		this.initGlobals(r,r.fragment);
		r.signature = haxe_crypto_Md5.encode(hxsl_Printer.shaderToString(r.vertex.data) + hxsl_Printer.shaderToString(r.fragment.data));
		var r2 = this.byID.get(r.signature);
		if(r2 != null) r.id = r2.id; else this.byID.set(r.signature,r);
		return r;
	}
	,initGlobals: function(r,s) {
		var p = s.globals;
		while(p != null) {
			r.globals.h[p.gid] = true;
			p = p.next;
		}
		var p1 = s.params;
		while(p1 != null) {
			if(p1.perObjectGlobal != null) r.globals.h[p1.perObjectGlobal.gid] = true;
			p1 = p1.next;
		}
	}
	,getPath: function(v) {
		if(v.parent == null) return v.name;
		return this.getPath(v.parent) + "." + v.name;
	}
	,flattenShader: function(s,kind,params) {
		var flat = new hxsl_Flatten();
		var c = new hxsl_RuntimeShaderData();
		var data = flat.flatten(s,kind,this.constsToGlobal);
		c.consts = flat.consts;
		var $it0 = flat.allocData.keys();
		while( $it0.hasNext() ) {
			var g = $it0.next();
			var alloc = flat.allocData.h[g.__id__];
			var _g = g.kind;
			switch(_g[1]) {
			case 2:
				var out = [];
				var _g1 = 0;
				while(_g1 < alloc.length) {
					var a = alloc[_g1];
					++_g1;
					if(a.v == null) continue;
					var p = params.h[a.v.id];
					if(p == null) {
						var ap = new hxsl_AllocParam(a.v.name,a.pos,-1,-1,a.v.type);
						ap.perObjectGlobal = new hxsl_AllocGlobal(-1,this.getPath(a.v),a.v.type);
						out.push(ap);
						continue;
					}
					out.push(new hxsl_AllocParam(a.v.name,a.pos,p.instance,p.index,a.v.type));
				}
				var _g2 = 0;
				var _g11 = out.length - 1;
				while(_g2 < _g11) {
					var i = _g2++;
					out[i].next = out[i + 1];
				}
				{
					var _g12 = g.type;
					switch(_g12[1]) {
					case 14:
						switch(_g12[2][1]) {
						case 10:
							c.textures2D = out[0];
							c.textures2DCount = out.length;
							break;
						case 11:
							c.texturesCube = out[0];
							c.texturesCubeCount = out.length;
							break;
						case 5:
							switch(_g12[2][2]) {
							case 4:
								switch(_g12[2][3][1]) {
								case 1:
									switch(_g12[3][1]) {
									case 0:
										var size = _g12[3][2];
										c.params = out[0];
										c.paramsSize = size;
										break;
									default:
										throw new js__$Boot_HaxeError("assert");
									}
									break;
								default:
									throw new js__$Boot_HaxeError("assert");
								}
								break;
							default:
								throw new js__$Boot_HaxeError("assert");
							}
							break;
						default:
							throw new js__$Boot_HaxeError("assert");
						}
						break;
					default:
						throw new js__$Boot_HaxeError("assert");
					}
				}
				break;
			case 0:
				var out1;
				var _g13 = [];
				var _g21 = 0;
				while(_g21 < alloc.length) {
					var a1 = alloc[_g21];
					++_g21;
					if(a1.v != null) _g13.push(new hxsl_AllocGlobal(a1.pos,this.getPath(a1.v),a1.v.type));
				}
				out1 = _g13;
				var _g3 = 0;
				var _g22 = out1.length - 1;
				while(_g3 < _g22) {
					var i1 = _g3++;
					out1[i1].next = out1[i1 + 1];
				}
				{
					var _g23 = g.type;
					switch(_g23[1]) {
					case 14:
						switch(_g23[2][1]) {
						case 5:
							switch(_g23[2][2]) {
							case 4:
								switch(_g23[2][3][1]) {
								case 1:
									switch(_g23[3][1]) {
									case 0:
										var size1 = _g23[3][2];
										c.globals = out1[0];
										c.globalsSize = size1;
										break;
									default:
										throw new js__$Boot_HaxeError("assert");
									}
									break;
								default:
									throw new js__$Boot_HaxeError("assert");
								}
								break;
							default:
								throw new js__$Boot_HaxeError("assert");
							}
							break;
						default:
							throw new js__$Boot_HaxeError("assert");
						}
						break;
					default:
						throw new js__$Boot_HaxeError("assert");
					}
				}
				break;
			default:
				throw new js__$Boot_HaxeError("assert");
			}
		}
		if(c.globals == null) c.globalsSize = 0;
		if(c.params == null) c.paramsSize = 0;
		if(c.textures2D == null) c.textures2DCount = 0;
		if(c.texturesCube == null) c.texturesCubeCount = 0;
		c.data = data;
		return c;
	}
	,__class__: hxsl_Cache
};
var hxsl_Clone = function() {
	this.varMap = new haxe_ds_IntMap();
};
$hxClasses["hxsl.Clone"] = hxsl_Clone;
hxsl_Clone.__name__ = ["hxsl","Clone"];
hxsl_Clone.shaderData = function(s) {
	return new hxsl_Clone().shader(s);
};
hxsl_Clone.prototype = {
	tvar: function(v) {
		var v2 = this.varMap.h[v.id];
		if(v2 != null) return v2;
		v2 = { id : hxsl_Tools.allocVarId(), type : v.type, name : v.name, kind : v.kind};
		this.varMap.h[v.id] = v2;
		if(v.parent != null) v2.parent = this.tvar(v.parent);
		if(v.qualifiers != null) v2.qualifiers = v.qualifiers.slice();
		v2.type = this.ttype(v.type);
		return v2;
	}
	,tfun: function(f) {
		return { ret : this.ttype(f.ret), kind : f.kind, ref : this.tvar(f.ref), args : (function($this) {
			var $r;
			var _g = [];
			{
				var _g1 = 0;
				var _g2 = f.args;
				while(_g1 < _g2.length) {
					var a = _g2[_g1];
					++_g1;
					_g.push($this.tvar(a));
				}
			}
			$r = _g;
			return $r;
		}(this)), expr : this.texpr(f.expr)};
	}
	,ttype: function(t) {
		switch(t[1]) {
		case 12:
			var vl = t[2];
			return hxsl_Type.TStruct((function($this) {
				var $r;
				var _g = [];
				{
					var _g1 = 0;
					while(_g1 < vl.length) {
						var v = vl[_g1];
						++_g1;
						_g.push($this.tvar(v));
					}
				}
				$r = _g;
				return $r;
			}(this)));
		case 14:
			var size = t[3];
			var t1 = t[2];
			return hxsl_Type.TArray(this.ttype(t1),(function($this) {
				var $r;
				switch(size[1]) {
				case 0:
					$r = size;
					break;
				case 1:
					$r = (function($this) {
						var $r;
						var v1 = size[2];
						$r = hxsl_SizeDecl.SVar($this.tvar(v1));
						return $r;
					}($this));
					break;
				}
				return $r;
			}(this)));
		case 13:
			var vars = t[2];
			return hxsl_Type.TFun((function($this) {
				var $r;
				var _g2 = [];
				{
					var _g11 = 0;
					while(_g11 < vars.length) {
						var v2 = vars[_g11];
						++_g11;
						_g2.push({ args : (function($this) {
							var $r;
							var _g21 = [];
							{
								var _g3 = 0;
								var _g4 = v2.args;
								while(_g3 < _g4.length) {
									var a = _g4[_g3];
									++_g3;
									_g21.push({ name : a.name, type : $this.ttype(a.type)});
								}
							}
							$r = _g21;
							return $r;
						}($this)), ret : $this.ttype(v2.ret)});
					}
				}
				$r = _g2;
				return $r;
			}(this)));
		default:
			return t;
		}
	}
	,texpr: function(e) {
		var e2 = hxsl_Tools.map(e,$bind(this,this.texpr));
		e2.t = this.ttype(e.t);
		{
			var _g = e2.e;
			switch(_g[1]) {
			case 1:
				var v = _g[2];
				e2.e = hxsl_TExprDef.TVar(this.tvar(v));
				break;
			case 7:
				var init = _g[3];
				var v1 = _g[2];
				e2.e = hxsl_TExprDef.TVarDecl(this.tvar(v1),init);
				break;
			case 13:
				var loop = _g[4];
				var it = _g[3];
				var v2 = _g[2];
				e2.e = hxsl_TExprDef.TFor(this.tvar(v2),it,loop);
				break;
			default:
				e2.e = e2.e;
			}
		}
		return e2;
	}
	,shader: function(s) {
		return { name : s.name, vars : (function($this) {
			var $r;
			var _g = [];
			{
				var _g1 = 0;
				var _g2 = s.vars;
				while(_g1 < _g2.length) {
					var v = _g2[_g1];
					++_g1;
					_g.push($this.tvar(v));
				}
			}
			$r = _g;
			return $r;
		}(this)), funs : (function($this) {
			var $r;
			var _g11 = [];
			{
				var _g21 = 0;
				var _g3 = s.funs;
				while(_g21 < _g3.length) {
					var f = _g3[_g21];
					++_g21;
					_g11.push($this.tfun(f));
				}
			}
			$r = _g11;
			return $r;
		}(this))};
	}
	,__class__: hxsl_Clone
};
var hxsl__$Dce_Exit = function() {
};
$hxClasses["hxsl._Dce.Exit"] = hxsl__$Dce_Exit;
hxsl__$Dce_Exit.__name__ = ["hxsl","_Dce","Exit"];
hxsl__$Dce_Exit.prototype = {
	__class__: hxsl__$Dce_Exit
};
var hxsl__$Dce_VarDeps = function(v) {
	this.v = v;
	this.used = false;
	this.deps = new haxe_ds_IntMap();
};
$hxClasses["hxsl._Dce.VarDeps"] = hxsl__$Dce_VarDeps;
hxsl__$Dce_VarDeps.__name__ = ["hxsl","_Dce","VarDeps"];
hxsl__$Dce_VarDeps.prototype = {
	__class__: hxsl__$Dce_VarDeps
};
var hxsl_Dce = function() {
};
$hxClasses["hxsl.Dce"] = hxsl_Dce;
hxsl_Dce.__name__ = ["hxsl","Dce"];
hxsl_Dce.prototype = {
	dce: function(vertex,fragment) {
		this.used = new haxe_ds_IntMap();
		var inputs = [];
		var _g = 0;
		var _g1 = vertex.vars;
		while(_g < _g1.length) {
			var v = _g1[_g];
			++_g;
			var i = this.get(v);
			if(v.kind == hxsl_VarKind.Input) inputs.push(i);
			if(v.kind == hxsl_VarKind.Output) i.keep = true;
		}
		var _g2 = 0;
		var _g11 = fragment.vars;
		while(_g2 < _g11.length) {
			var v1 = _g11[_g2];
			++_g2;
			var i1 = this.get(v1);
			if(v1.kind == hxsl_VarKind.Output) i1.keep = true;
		}
		var _g3 = 0;
		var _g12 = vertex.funs;
		while(_g3 < _g12.length) {
			var f = _g12[_g3];
			++_g3;
			this.check(f.expr,[]);
		}
		var _g4 = 0;
		var _g13 = fragment.funs;
		while(_g4 < _g13.length) {
			var f1 = _g13[_g4];
			++_g4;
			this.check(f1.expr,[]);
		}
		var $it0 = this.used.iterator();
		while( $it0.hasNext() ) {
			var v2 = $it0.next();
			if(v2.keep) this.markRec(v2);
		}
		while(inputs.length > 1 && !inputs[inputs.length - 1].used) inputs.pop();
		var _g5 = 0;
		while(_g5 < inputs.length) {
			var v3 = inputs[_g5];
			++_g5;
			this.markRec(v3);
		}
		var $it1 = this.used.iterator();
		while( $it1.hasNext() ) {
			var v4 = $it1.next();
			if(v4.used) continue;
			HxOverrides.remove(vertex.vars,v4.v);
			HxOverrides.remove(fragment.vars,v4.v);
		}
		var _g6 = 0;
		var _g14 = vertex.funs;
		while(_g6 < _g14.length) {
			var f2 = _g14[_g6];
			++_g6;
			f2.expr = this.mapExpr(f2.expr);
		}
		var _g7 = 0;
		var _g15 = fragment.funs;
		while(_g7 < _g15.length) {
			var f3 = _g15[_g7];
			++_g7;
			f3.expr = this.mapExpr(f3.expr);
		}
		return { fragment : fragment, vertex : vertex};
	}
	,get: function(v) {
		var vd = this.used.h[v.id];
		if(vd == null) {
			vd = new hxsl__$Dce_VarDeps(v);
			this.used.h[v.id] = vd;
		}
		return vd;
	}
	,markRec: function(v) {
		if(v.used) return;
		v.used = true;
		var $it0 = v.deps.iterator();
		while( $it0.hasNext() ) {
			var d = $it0.next();
			this.markRec(d);
		}
	}
	,link: function(v,writeTo) {
		var vd = this.get(v);
		var _g = 0;
		while(_g < writeTo.length) {
			var w = writeTo[_g];
			++_g;
			if(w == null) {
				vd.keep = true;
				continue;
			}
			w.deps.h[v.id] = vd;
		}
	}
	,hasDiscardRec: function(e) {
		var _g = e.e;
		switch(_g[1]) {
		case 11:
			throw new js__$Boot_HaxeError(new hxsl__$Dce_Exit());
			break;
		default:
			hxsl_Tools.iter(e,$bind(this,this.hasDiscardRec));
		}
	}
	,hasDiscard: function(e) {
		try {
			this.hasDiscardRec(e);
			return false;
		} catch( e1 ) {
			if (e1 instanceof js__$Boot_HaxeError) e1 = e1.val;
			if( js_Boot.__instanceof(e1,hxsl__$Dce_Exit) ) {
				return true;
			} else throw(e1);
		}
	}
	,check: function(e,writeTo) {
		{
			var _g = e.e;
			switch(_g[1]) {
			case 1:
				var v = _g[2];
				this.link(v,writeTo);
				break;
			case 5:
				switch(_g[2][1]) {
				case 4:
					switch(_g[3].e[1]) {
					case 1:
						var e1 = _g[4];
						var v1 = _g[3].e[2];
						writeTo.push(this.get(v1));
						this.check(e1,writeTo);
						writeTo.pop();
						break;
					case 9:
						switch(_g[3].e[2].e[1]) {
						case 1:
							var e2 = _g[4];
							var v2 = _g[3].e[2].e[2];
							writeTo.push(this.get(v2));
							this.check(e2,writeTo);
							writeTo.pop();
							break;
						default:
							hxsl_Tools.iter(e,(function(f,a1) {
								return function(e3) {
									f(e3,a1);
								};
							})($bind(this,this.check),writeTo));
						}
						break;
					default:
						hxsl_Tools.iter(e,(function(f,a1) {
							return function(e3) {
								f(e3,a1);
							};
						})($bind(this,this.check),writeTo));
					}
					break;
				case 20:
					switch(_g[3].e[1]) {
					case 1:
						var e4 = _g[4];
						var v3 = _g[3].e[2];
						writeTo.push(this.get(v3));
						this.check(e4,writeTo);
						writeTo.pop();
						break;
					case 9:
						switch(_g[3].e[2].e[1]) {
						case 1:
							var e5 = _g[4];
							var v4 = _g[3].e[2].e[2];
							writeTo.push(this.get(v4));
							this.check(e5,writeTo);
							writeTo.pop();
							break;
						default:
							hxsl_Tools.iter(e,(function(f,a1) {
								return function(e3) {
									f(e3,a1);
								};
							})($bind(this,this.check),writeTo));
						}
						break;
					default:
						hxsl_Tools.iter(e,(function(f,a1) {
							return function(e3) {
								f(e3,a1);
							};
						})($bind(this,this.check),writeTo));
					}
					break;
				default:
					hxsl_Tools.iter(e,(function(f,a1) {
						return function(e3) {
							f(e3,a1);
						};
					})($bind(this,this.check),writeTo));
				}
				break;
			case 7:
				var init = _g[3];
				var v5 = _g[2];
				if(init != null) {
					writeTo.push(this.get(v5));
					this.check(init,writeTo);
					writeTo.pop();
				} else hxsl_Tools.iter(e,(function(f,a1) {
					return function(e3) {
						f(e3,a1);
					};
				})($bind(this,this.check),writeTo));
				break;
			case 10:
				var eelse = _g[4];
				var eif = _g[3];
				var e6 = _g[2];
				if(this.hasDiscard(eif) || eelse != null && this.hasDiscard(eelse)) {
					writeTo.push(null);
					this.check(e6,writeTo);
					writeTo.pop();
					this.check(eif,writeTo);
					if(eelse != null) this.check(eelse,writeTo);
				} else hxsl_Tools.iter(e,(function(f,a1) {
					return function(e3) {
						f(e3,a1);
					};
				})($bind(this,this.check),writeTo));
				break;
			default:
				hxsl_Tools.iter(e,(function(f,a1) {
					return function(e3) {
						f(e3,a1);
					};
				})($bind(this,this.check),writeTo));
			}
		}
	}
	,mapExpr: function(e) {
		{
			var _g = e.e;
			switch(_g[1]) {
			case 4:
				var el = _g[2];
				var out = [];
				var count = 0;
				var _g1 = 0;
				while(_g1 < el.length) {
					var e1 = el[_g1];
					++_g1;
					var e2 = this.mapExpr(e1);
					{
						var _g2 = e2.e;
						switch(_g2[1]) {
						case 0:
							if(count < el.length) {
							} else out.push(e2);
							break;
						case 4:
							switch(_g2[2].length) {
							case 0:
								break;
							default:
								out.push(e2);
							}
							break;
						default:
							out.push(e2);
						}
					}
					count++;
				}
				return { e : hxsl_TExprDef.TBlock(out), p : e.p, t : e.t};
			case 7:
				var v = _g[2];
				if(!this.get(v).used) return { e : hxsl_TExprDef.TConst(hxsl_Const.CNull), t : e.t, p : e.p}; else return hxsl_Tools.map(e,$bind(this,this.mapExpr));
				break;
			case 5:
				switch(_g[2][1]) {
				case 4:
					switch(_g[3].e[1]) {
					case 1:
						var v1 = _g[3].e[2];
						if(!this.get(v1).used) return { e : hxsl_TExprDef.TConst(hxsl_Const.CNull), t : e.t, p : e.p}; else return hxsl_Tools.map(e,$bind(this,this.mapExpr));
						break;
					case 9:
						switch(_g[3].e[2].e[1]) {
						case 1:
							var v2 = _g[3].e[2].e[2];
							if(!this.get(v2).used) return { e : hxsl_TExprDef.TConst(hxsl_Const.CNull), t : e.t, p : e.p}; else return hxsl_Tools.map(e,$bind(this,this.mapExpr));
							break;
						default:
							return hxsl_Tools.map(e,$bind(this,this.mapExpr));
						}
						break;
					default:
						return hxsl_Tools.map(e,$bind(this,this.mapExpr));
					}
					break;
				case 20:
					switch(_g[3].e[1]) {
					case 1:
						var v3 = _g[3].e[2];
						if(!this.get(v3).used) return { e : hxsl_TExprDef.TConst(hxsl_Const.CNull), t : e.t, p : e.p}; else return hxsl_Tools.map(e,$bind(this,this.mapExpr));
						break;
					case 9:
						switch(_g[3].e[2].e[1]) {
						case 1:
							var v4 = _g[3].e[2].e[2];
							if(!this.get(v4).used) return { e : hxsl_TExprDef.TConst(hxsl_Const.CNull), t : e.t, p : e.p}; else return hxsl_Tools.map(e,$bind(this,this.mapExpr));
							break;
						default:
							return hxsl_Tools.map(e,$bind(this,this.mapExpr));
						}
						break;
					default:
						return hxsl_Tools.map(e,$bind(this,this.mapExpr));
					}
					break;
				default:
					return hxsl_Tools.map(e,$bind(this,this.mapExpr));
				}
				break;
			default:
				return hxsl_Tools.map(e,$bind(this,this.mapExpr));
			}
		}
	}
	,__class__: hxsl_Dce
};
var hxsl_Eval = function() {
	this.varMap = new haxe_ds_ObjectMap();
	this.funMap = new haxe_ds_ObjectMap();
	this.constants = new haxe_ds_ObjectMap();
};
$hxClasses["hxsl.Eval"] = hxsl_Eval;
hxsl_Eval.__name__ = ["hxsl","Eval"];
hxsl_Eval.prototype = {
	setConstant: function(v,c) {
		var value = hxsl_TExprDef.TConst(c);
		this.constants.set(v,value);
	}
	,mapVar: function(v) {
		var v2 = this.varMap.h[v.__id__];
		if(v2 != null) if(v == v2) return v2; else return this.mapVar(v2);
		if(v.parent != null) {
			this.mapVar(v.parent);
			v2 = this.varMap.h[v.__id__];
			if(v2 != null) if(v == v2) return v2; else return this.mapVar(v2);
		}
		v2 = { id : hxsl_Tools.allocVarId(), name : v.name, type : v.type, kind : v.kind};
		if(v.parent != null) v2.parent = this.mapVar(v.parent);
		if(v.qualifiers != null) v2.qualifiers = v.qualifiers.slice();
		this.varMap.set(v,v2);
		this.varMap.set(v2,v2);
		{
			var _g = v2.type;
			switch(_g[1]) {
			case 12:
				var vl = _g[2];
				v2.type = hxsl_Type.TStruct((function($this) {
					var $r;
					var _g1 = [];
					{
						var _g2 = 0;
						while(_g2 < vl.length) {
							var v1 = vl[_g2];
							++_g2;
							_g1.push($this.mapVar(v1));
						}
					}
					$r = _g1;
					return $r;
				}(this)));
				break;
			case 14:
				switch(_g[3][1]) {
				case 1:
					var t = _g[2];
					var vs = _g[3][2];
					var c = this.constants.h[vs.__id__];
					if(c != null) switch(c[1]) {
					case 0:
						switch(c[2][1]) {
						case 2:
							var v3 = c[2][2];
							v2.type = hxsl_Type.TArray(t,hxsl_SizeDecl.SConst(v3));
							break;
						default:
							hxsl_Error.t("Integer value expected for array size constant " + vs.name,null);
						}
						break;
					default:
						hxsl_Error.t("Integer value expected for array size constant " + vs.name,null);
					} else {
						var vs2 = this.mapVar(vs);
						v2.type = hxsl_Type.TArray(t,hxsl_SizeDecl.SVar(vs2));
					}
					break;
				default:
				}
				break;
			default:
			}
		}
		return v2;
	}
	,'eval': function(s) {
		var funs = [];
		var _g = 0;
		var _g1 = s.funs;
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			var f2 = { kind : f.kind, ref : this.mapVar(f.ref), args : (function($this) {
				var $r;
				var _g2 = [];
				{
					var _g3 = 0;
					var _g4 = f.args;
					while(_g3 < _g4.length) {
						var a = _g4[_g3];
						++_g3;
						_g2.push($this.mapVar(a));
					}
				}
				$r = _g2;
				return $r;
			}(this)), ret : f.ret, expr : f.expr};
			if(!this.inlineCalls || f.kind != hxsl_FunctionKind.Helper) funs.push(f2);
			this.funMap.set(f2.ref,f);
		}
		var _g11 = 0;
		var _g5 = funs.length;
		while(_g11 < _g5) {
			var i = _g11++;
			this.curFun = funs[i];
			this.curFun.expr = this.evalExpr(this.curFun.expr,false);
		}
		return { name : s.name, vars : (function($this) {
			var $r;
			var _g6 = [];
			{
				var _g12 = 0;
				var _g21 = s.vars;
				while(_g12 < _g21.length) {
					var v = _g21[_g12];
					++_g12;
					_g6.push($this.mapVar(v));
				}
			}
			$r = _g6;
			return $r;
		}(this)), funs : funs};
	}
	,hasReturn: function(e) {
		this.markReturn = false;
		this.hasReturnLoop(e);
		return this.markReturn;
	}
	,hasReturnLoop: function(e) {
		{
			var _g = e.e;
			switch(_g[1]) {
			case 12:
				this.markReturn = true;
				break;
			default:
				if(!this.markReturn) hxsl_Tools.iter(e,$bind(this,this.hasReturnLoop));
			}
		}
	}
	,handleReturn: function(e,$final) {
		if($final == null) $final = false;
		{
			var _g = e.e;
			switch(_g[1]) {
			case 12:
				var v = _g[2];
				if(!$final) hxsl_Error.t("Cannot inline not final return",e.p);
				if(v == null) return { e : hxsl_TExprDef.TBlock([]), t : hxsl_Type.TVoid, p : e.p};
				return this.handleReturn(v,true);
			case 4:
				var el = _g[2];
				var i = 0;
				var last = el.length;
				var out = [];
				try {
					while(i < last) {
						var e1 = el[i++];
						if(i == last) out.push(this.handleReturn(e1,$final)); else {
							var _g1 = e1.e;
							switch(_g1[1]) {
							case 10:
								if(_g1[4] == null) {
									var econd = _g1[2];
									var eif = _g1[3];
									if($final && this.hasReturn(eif)) {
										out.push(this.handleReturn({ e : hxsl_TExprDef.TIf(econd,eif,{ e : hxsl_TExprDef.TBlock(el.slice(i)), t : e1.t, p : e1.p}), t : e1.t, p : e1.p}));
										throw "__break__";
									} else out.push(this.handleReturn(e1));
								} else switch(_g1[4]) {
								default:
									out.push(this.handleReturn(e1));
								}
								break;
							case 12:
								var e2 = _g1[2];
								out.push(this.handleReturn(e2,$final));
								throw "__break__";
								break;
							default:
								out.push(this.handleReturn(e1));
							}
						}
					}
				} catch( e ) { if( e != "__break__" ) throw e; }
				var t;
				if($final) t = out[out.length - 1].t; else t = e.t;
				return { e : hxsl_TExprDef.TBlock(out), t : t, p : e.p};
			case 3:
				var v1 = _g[2];
				var v2 = this.handleReturn(v1,$final);
				return { e : hxsl_TExprDef.TParenthesis(v2), t : v2.t, p : e.p};
			case 10:
				var eelse = _g[4];
				var eif1 = _g[3];
				var cond = _g[2];
				if(eelse != null && $final) {
					var cond1 = this.handleReturn(cond);
					var eif2 = this.handleReturn(eif1,$final);
					return { e : hxsl_TExprDef.TIf(cond1,eif2,this.handleReturn(eelse,$final)), t : eif2.t, p : e.p};
				} else return hxsl_Tools.map(e,$bind(this,this.handleReturnDef));
				break;
			default:
				return hxsl_Tools.map(e,$bind(this,this.handleReturnDef));
			}
		}
	}
	,handleReturnDef: function(e) {
		return this.handleReturn(e);
	}
	,evalCall: function(g,args) {
		switch(g[1]) {
		case 36:
			switch(args.length) {
			case 1:
				switch(args[0].e[1]) {
				case 0:
					switch(args[0].e[2][1]) {
					case 2:
						var i = args[0].e[2][2];
						return hxsl_TExprDef.TConst(hxsl_Const.CFloat(i));
					default:
						return null;
					}
					break;
				default:
					return null;
				}
				break;
			default:
				return null;
			}
			break;
		default:
			return null;
		}
	}
	,evalExpr: function(e,isVal) {
		if(isVal == null) isVal = true;
		var _g6 = this;
		var d;
		{
			var _g = e.e;
			switch(_g[1]) {
			case 2:case 0:
				d = e.e;
				break;
			case 1:
				var v = _g[2];
				var c = this.constants.h[v.__id__];
				if(c != null) d = c; else {
					var v2 = this.mapVar(v);
					d = hxsl_TExprDef.TVar(v2);
				}
				break;
			case 7:
				var init = _g[3];
				var v1 = _g[2];
				d = hxsl_TExprDef.TVarDecl(this.mapVar(v1),init == null?null:this.evalExpr(init));
				break;
			case 16:
				var e2 = _g[3];
				var e1 = _g[2];
				var e11 = this.evalExpr(e1);
				var e21 = this.evalExpr(e2);
				{
					var _g1 = e11.e;
					var _g2 = e21.e;
					switch(_g1[1]) {
					case 17:
						switch(_g2[1]) {
						case 0:
							switch(_g2[2][1]) {
							case 2:
								var el = _g1[2];
								var i = _g2[2][2];
								if(i >= 0 && i < el.length) d = el[i].e; else d = hxsl_TExprDef.TArray(e11,e21);
								break;
							default:
								d = hxsl_TExprDef.TArray(e11,e21);
							}
							break;
						default:
							d = hxsl_TExprDef.TArray(e11,e21);
						}
						break;
					default:
						d = hxsl_TExprDef.TArray(e11,e21);
					}
				}
				break;
			case 9:
				var r = _g[3];
				var e3 = _g[2];
				d = hxsl_TExprDef.TSwiz(this.evalExpr(e3),r.slice());
				break;
			case 12:
				var e4 = _g[2];
				d = hxsl_TExprDef.TReturn(e4 == null?null:this.evalExpr(e4));
				break;
			case 8:
				var args = _g[3];
				var c1 = _g[2];
				var c2 = this.evalExpr(c1);
				var args1;
				var _g11 = [];
				var _g21 = 0;
				while(_g21 < args.length) {
					var a = args[_g21];
					++_g21;
					_g11.push(this.evalExpr(a));
				}
				args1 = _g11;
				{
					var _g22 = c2.e;
					switch(_g22[1]) {
					case 2:
						var g = _g22[2];
						var v3 = this.evalCall(g,args1);
						if(v3 != null) d = v3; else d = hxsl_TExprDef.TCall(c2,args1);
						break;
					case 1:
						if(!this.inlineCalls) d = hxsl_TExprDef.TCall(c2,args1); else {
							var v4 = _g22[2];
							if(this.funMap.h.__keys__[v4.__id__] != null) {
								var f = this.funMap.h[v4.__id__];
								var outExprs = [];
								var undo = [];
								var _g4 = 0;
								var _g3 = f.args.length;
								while(_g4 < _g3) {
									var i1 = _g4++;
									var v5 = [f.args[i1]];
									var e6 = args1[i1];
									{
										var _g5 = e6.e;
										switch(_g5[1]) {
										case 0:
											var old = [this.constants.h[v5[0].__id__]];
											undo.push((function(old,v5) {
												return function() {
													if(old[0] == null) _g6.constants.remove(v5[0]); else _g6.constants.set(v5[0],old[0]);
												};
											})(old,v5));
											this.constants.set(v5[0],e6.e);
											break;
										case 1:
											switch(_g5[2].kind[1]) {
											case 1:case 2:case 0:
												var old1 = [this.constants.h[v5[0].__id__]];
												undo.push((function(old1,v5) {
													return function() {
														if(old1[0] == null) _g6.constants.remove(v5[0]); else _g6.constants.set(v5[0],old1[0]);
													};
												})(old1,v5));
												this.constants.set(v5[0],e6.e);
												break;
											default:
												var old2 = [this.varMap.h[v5[0].__id__]];
												if(old2[0] == null) undo.push((function(v5) {
													return function() {
														_g6.varMap.remove(v5[0]);
													};
												})(v5)); else {
													this.varMap.remove(v5[0]);
													undo.push((function(old2,v5) {
														return function() {
															_g6.varMap.set(v5[0],old2[0]);
														};
													})(old2,v5));
												}
												var v21 = this.mapVar(v5[0]);
												outExprs.push({ e : hxsl_TExprDef.TVarDecl(v21,e6), t : hxsl_Type.TVoid, p : e6.p});
											}
											break;
										default:
											var old3 = [this.varMap.h[v5[0].__id__]];
											if(old3[0] == null) undo.push((function(v5) {
												return function() {
													_g6.varMap.remove(v5[0]);
												};
											})(v5)); else {
												this.varMap.remove(v5[0]);
												undo.push((function(old3,v5) {
													return function() {
														_g6.varMap.set(v5[0],old3[0]);
													};
												})(old3,v5));
											}
											var v22 = this.mapVar(v5[0]);
											outExprs.push({ e : hxsl_TExprDef.TVarDecl(v22,e6), t : hxsl_Type.TVoid, p : e6.p});
										}
									}
								}
								var e5 = this.handleReturn(this.evalExpr(f.expr,false),true);
								var _g31 = 0;
								while(_g31 < undo.length) {
									var u = undo[_g31];
									++_g31;
									u();
								}
								{
									var _g32 = e5.e;
									switch(_g32[1]) {
									case 4:
										var el1 = _g32[2];
										var _g41 = 0;
										while(_g41 < el1.length) {
											var e7 = el1[_g41];
											++_g41;
											outExprs.push(e7);
										}
										break;
									default:
										outExprs.push(e5);
									}
								}
								d = hxsl_TExprDef.TBlock(outExprs);
							} else d = hxsl_Error.t("Cannot eval non-static call expresssion '" + new hxsl_Printer().exprString(c2) + "'",c2.p);
						}
						break;
					default:
						d = hxsl_Error.t("Cannot eval non-static call expresssion '" + new hxsl_Printer().exprString(c2) + "'",c2.p);
					}
				}
				break;
			case 4:
				var el2 = _g[2];
				var out = [];
				var last = el2.length - 1;
				var _g23 = 0;
				var _g12 = el2.length;
				while(_g23 < _g12) {
					var i2 = _g23++;
					var isVal1 = isVal && i2 == last;
					var e8 = this.evalExpr(el2[i2],isVal1);
					{
						var _g33 = e8.e;
						switch(_g33[1]) {
						case 0:
							if(!isVal1) {
							} else out.push(e8);
							break;
						case 1:
							if(!isVal1) {
							} else out.push(e8);
							break;
						default:
							out.push(e8);
						}
					}
				}
				if(out.length == 1 && this.curFun.kind != hxsl_FunctionKind.Init) d = out[0].e; else d = hxsl_TExprDef.TBlock(out);
				break;
			case 5:
				var e22 = _g[4];
				var e12 = _g[3];
				var op = _g[2];
				var e13 = this.evalExpr(e12);
				var e23 = this.evalExpr(e22);
				switch(op[1]) {
				case 0:
					{
						var _g13 = e13.e;
						var _g24 = e23.e;
						switch(_g13[1]) {
						case 0:
							switch(_g13[2][1]) {
							case 2:
								switch(_g24[1]) {
								case 0:
									switch(_g24[2][1]) {
									case 2:
										var a1 = _g13[2][2];
										var b = _g24[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CInt(Std["int"](a1 + b)));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 3:
								switch(_g24[1]) {
								case 0:
									switch(_g24[2][1]) {
									case 3:
										var a2 = _g13[2][2];
										var b1 = _g24[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CFloat(a2 + b1));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							default:
								d = hxsl_TExprDef.TBinop(op,e13,e23);
							}
							break;
						default:
							d = hxsl_TExprDef.TBinop(op,e13,e23);
						}
					}
					break;
				case 3:
					{
						var _g14 = e13.e;
						var _g25 = e23.e;
						switch(_g14[1]) {
						case 0:
							switch(_g14[2][1]) {
							case 2:
								switch(_g25[1]) {
								case 0:
									switch(_g25[2][1]) {
									case 2:
										var a3 = _g14[2][2];
										var b2 = _g25[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CInt(Std["int"](a3 - b2)));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 3:
								switch(_g25[1]) {
								case 0:
									switch(_g25[2][1]) {
									case 3:
										var a4 = _g14[2][2];
										var b3 = _g25[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CFloat(a4 - b3));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							default:
								d = hxsl_TExprDef.TBinop(op,e13,e23);
							}
							break;
						default:
							d = hxsl_TExprDef.TBinop(op,e13,e23);
						}
					}
					break;
				case 1:
					{
						var _g15 = e13.e;
						var _g26 = e23.e;
						switch(_g15[1]) {
						case 0:
							switch(_g15[2][1]) {
							case 2:
								switch(_g26[1]) {
								case 0:
									switch(_g26[2][1]) {
									case 2:
										var a5 = _g15[2][2];
										var b4 = _g26[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CInt(Std["int"](a5 * b4)));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 3:
								switch(_g26[1]) {
								case 0:
									switch(_g26[2][1]) {
									case 3:
										var a6 = _g15[2][2];
										var b5 = _g26[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CFloat(a6 * b5));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							default:
								d = hxsl_TExprDef.TBinop(op,e13,e23);
							}
							break;
						default:
							d = hxsl_TExprDef.TBinop(op,e13,e23);
						}
					}
					break;
				case 2:
					{
						var _g16 = e13.e;
						var _g27 = e23.e;
						switch(_g16[1]) {
						case 0:
							switch(_g16[2][1]) {
							case 2:
								switch(_g27[1]) {
								case 0:
									switch(_g27[2][1]) {
									case 2:
										var a7 = _g16[2][2];
										var b6 = _g27[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CInt(Std["int"](a7 / b6)));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 3:
								switch(_g27[1]) {
								case 0:
									switch(_g27[2][1]) {
									case 3:
										var a8 = _g16[2][2];
										var b7 = _g27[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CFloat(a8 / b7));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							default:
								d = hxsl_TExprDef.TBinop(op,e13,e23);
							}
							break;
						default:
							d = hxsl_TExprDef.TBinop(op,e13,e23);
						}
					}
					break;
				case 19:
					{
						var _g17 = e13.e;
						var _g28 = e23.e;
						switch(_g17[1]) {
						case 0:
							switch(_g17[2][1]) {
							case 2:
								switch(_g28[1]) {
								case 0:
									switch(_g28[2][1]) {
									case 2:
										var a9 = _g17[2][2];
										var b8 = _g28[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CInt(Std["int"](a9 % b8)));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 3:
								switch(_g28[1]) {
								case 0:
									switch(_g28[2][1]) {
									case 3:
										var a10 = _g17[2][2];
										var b9 = _g28[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CFloat(a10 % b9));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							default:
								d = hxsl_TExprDef.TBinop(op,e13,e23);
							}
							break;
						default:
							d = hxsl_TExprDef.TBinop(op,e13,e23);
						}
					}
					break;
				case 13:
					{
						var _g18 = e13.e;
						var _g29 = e23.e;
						switch(_g18[1]) {
						case 0:
							switch(_g18[2][1]) {
							case 2:
								switch(_g29[1]) {
								case 0:
									switch(_g29[2][1]) {
									case 2:
										var a11 = _g18[2][2];
										var b10 = _g29[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CInt(a11 ^ b10));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							default:
								d = hxsl_TExprDef.TBinop(op,e13,e23);
							}
							break;
						default:
							d = hxsl_TExprDef.TBinop(op,e13,e23);
						}
					}
					break;
				case 12:
					{
						var _g19 = e13.e;
						var _g210 = e23.e;
						switch(_g19[1]) {
						case 0:
							switch(_g19[2][1]) {
							case 2:
								switch(_g210[1]) {
								case 0:
									switch(_g210[2][1]) {
									case 2:
										var a12 = _g19[2][2];
										var b11 = _g210[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CInt(a12 | b11));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							default:
								d = hxsl_TExprDef.TBinop(op,e13,e23);
							}
							break;
						default:
							d = hxsl_TExprDef.TBinop(op,e13,e23);
						}
					}
					break;
				case 11:
					{
						var _g110 = e13.e;
						var _g211 = e23.e;
						switch(_g110[1]) {
						case 0:
							switch(_g110[2][1]) {
							case 2:
								switch(_g211[1]) {
								case 0:
									switch(_g211[2][1]) {
									case 2:
										var a13 = _g110[2][2];
										var b12 = _g211[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CInt(a13 & b12));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							default:
								d = hxsl_TExprDef.TBinop(op,e13,e23);
							}
							break;
						default:
							d = hxsl_TExprDef.TBinop(op,e13,e23);
						}
					}
					break;
				case 17:
					{
						var _g111 = e13.e;
						var _g212 = e23.e;
						switch(_g111[1]) {
						case 0:
							switch(_g111[2][1]) {
							case 2:
								switch(_g212[1]) {
								case 0:
									switch(_g212[2][1]) {
									case 2:
										var a14 = _g111[2][2];
										var b13 = _g212[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CInt(a14 >> b13));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							default:
								d = hxsl_TExprDef.TBinop(op,e13,e23);
							}
							break;
						default:
							d = hxsl_TExprDef.TBinop(op,e13,e23);
						}
					}
					break;
				case 18:
					{
						var _g112 = e13.e;
						var _g213 = e23.e;
						switch(_g112[1]) {
						case 0:
							switch(_g112[2][1]) {
							case 2:
								switch(_g213[1]) {
								case 0:
									switch(_g213[2][1]) {
									case 2:
										var a15 = _g112[2][2];
										var b14 = _g213[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CInt(a15 >>> b14));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							default:
								d = hxsl_TExprDef.TBinop(op,e13,e23);
							}
							break;
						default:
							d = hxsl_TExprDef.TBinop(op,e13,e23);
						}
					}
					break;
				case 16:
					{
						var _g113 = e13.e;
						var _g214 = e23.e;
						switch(_g113[1]) {
						case 0:
							switch(_g113[2][1]) {
							case 2:
								switch(_g214[1]) {
								case 0:
									switch(_g214[2][1]) {
									case 2:
										var a16 = _g113[2][2];
										var b15 = _g214[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CInt(a16 << b15));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							default:
								d = hxsl_TExprDef.TBinop(op,e13,e23);
							}
							break;
						default:
							d = hxsl_TExprDef.TBinop(op,e13,e23);
						}
					}
					break;
				case 14:
					{
						var _g114 = e13.e;
						var _g215 = e23.e;
						switch(_g114[1]) {
						case 0:
							switch(_g114[2][1]) {
							case 1:
								switch(_g215[1]) {
								case 0:
									switch(_g215[2][1]) {
									case 1:
										var a17 = _g114[2][2];
										var b16 = _g215[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(a17 && b16));
										break;
									default:
										var a18 = _g114[2][2];
										if(a18 == false) d = hxsl_TExprDef.TConst(hxsl_Const.CBool(a18)); else d = e23.e;
									}
									break;
								default:
									var a19 = _g114[2][2];
									if(a19 == false) d = hxsl_TExprDef.TConst(hxsl_Const.CBool(a19)); else d = e23.e;
								}
								break;
							default:
								switch(_g215[1]) {
								case 0:
									switch(_g215[2][1]) {
									case 1:
										var a20 = _g215[2][2];
										if(a20 == false) d = hxsl_TExprDef.TConst(hxsl_Const.CBool(a20)); else d = e13.e;
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
							}
							break;
						default:
							switch(_g215[1]) {
							case 0:
								switch(_g215[2][1]) {
								case 1:
									var a21 = _g215[2][2];
									if(a21 == false) d = hxsl_TExprDef.TConst(hxsl_Const.CBool(a21)); else d = e13.e;
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							default:
								d = hxsl_TExprDef.TBinop(op,e13,e23);
							}
						}
					}
					break;
				case 15:
					{
						var _g115 = e13.e;
						var _g216 = e23.e;
						switch(_g115[1]) {
						case 0:
							switch(_g115[2][1]) {
							case 1:
								switch(_g216[1]) {
								case 0:
									switch(_g216[2][1]) {
									case 1:
										var a22 = _g115[2][2];
										var b17 = _g216[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(a22 || b17));
										break;
									default:
										var a23 = _g115[2][2];
										if(a23 == true) d = hxsl_TExprDef.TConst(hxsl_Const.CBool(a23)); else d = e23.e;
									}
									break;
								default:
									var a24 = _g115[2][2];
									if(a24 == true) d = hxsl_TExprDef.TConst(hxsl_Const.CBool(a24)); else d = e23.e;
								}
								break;
							default:
								switch(_g216[1]) {
								case 0:
									switch(_g216[2][1]) {
									case 1:
										var a25 = _g216[2][2];
										if(a25 == true) d = hxsl_TExprDef.TConst(hxsl_Const.CBool(a25)); else d = e13.e;
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
							}
							break;
						default:
							switch(_g216[1]) {
							case 0:
								switch(_g216[2][1]) {
								case 1:
									var a26 = _g216[2][2];
									if(a26 == true) d = hxsl_TExprDef.TConst(hxsl_Const.CBool(a26)); else d = e13.e;
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							default:
								d = hxsl_TExprDef.TBinop(op,e13,e23);
							}
						}
					}
					break;
				case 5:
					{
						var _g116 = e13.e;
						var _g217 = e23.e;
						switch(_g116[1]) {
						case 0:
							switch(_g116[2][1]) {
							case 0:
								switch(_g217[1]) {
								case 0:
									switch(_g217[2][1]) {
									case 0:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(true));
										break;
									default:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(false));
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 1:
								switch(_g217[1]) {
								case 0:
									switch(_g217[2][1]) {
									case 0:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(false));
										break;
									case 1:
										var a27 = _g116[2][2];
										var b18 = _g217[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool((a27 == b18?0:1) == 0));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 2:
								switch(_g217[1]) {
								case 0:
									switch(_g217[2][1]) {
									case 0:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(false));
										break;
									case 2:
										var a28 = _g116[2][2];
										var b19 = _g217[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(a28 - b19 == 0));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 3:
								switch(_g217[1]) {
								case 0:
									switch(_g217[2][1]) {
									case 0:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(false));
										break;
									case 3:
										var a29 = _g116[2][2];
										var b20 = _g217[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool((a29 > b20?1:a29 == b20?0:-1) == 0));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 4:
								switch(_g217[1]) {
								case 0:
									switch(_g217[2][1]) {
									case 0:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(false));
										break;
									case 4:
										var a30 = _g116[2][2];
										var b21 = _g217[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool((a30 > b21?1:a30 == b21?0:-1) == 0));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							}
							break;
						default:
							d = hxsl_TExprDef.TBinop(op,e13,e23);
						}
					}
					break;
				case 6:
					{
						var _g117 = e13.e;
						var _g218 = e23.e;
						switch(_g117[1]) {
						case 0:
							switch(_g117[2][1]) {
							case 0:
								switch(_g218[1]) {
								case 0:
									switch(_g218[2][1]) {
									case 0:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(false));
										break;
									default:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(true));
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 1:
								switch(_g218[1]) {
								case 0:
									switch(_g218[2][1]) {
									case 0:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(true));
										break;
									case 1:
										var a31 = _g117[2][2];
										var b22 = _g218[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool((a31 == b22?0:1) != 0));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 2:
								switch(_g218[1]) {
								case 0:
									switch(_g218[2][1]) {
									case 0:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(true));
										break;
									case 2:
										var a32 = _g117[2][2];
										var b23 = _g218[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(a32 - b23 != 0));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 3:
								switch(_g218[1]) {
								case 0:
									switch(_g218[2][1]) {
									case 0:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(true));
										break;
									case 3:
										var a33 = _g117[2][2];
										var b24 = _g218[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool((a33 > b24?1:a33 == b24?0:-1) != 0));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 4:
								switch(_g218[1]) {
								case 0:
									switch(_g218[2][1]) {
									case 0:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(true));
										break;
									case 4:
										var a34 = _g117[2][2];
										var b25 = _g218[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool((a34 > b25?1:a34 == b25?0:-1) != 0));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							}
							break;
						default:
							d = hxsl_TExprDef.TBinop(op,e13,e23);
						}
					}
					break;
				case 7:
					{
						var _g118 = e13.e;
						var _g219 = e23.e;
						switch(_g118[1]) {
						case 0:
							switch(_g118[2][1]) {
							case 0:
								switch(_g219[1]) {
								case 0:
									switch(_g219[2][1]) {
									case 0:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(false));
										break;
									default:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(false));
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 1:
								switch(_g219[1]) {
								case 0:
									switch(_g219[2][1]) {
									case 0:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(true));
										break;
									case 1:
										var a35 = _g118[2][2];
										var b26 = _g219[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool((a35 == b26?0:1) > 0));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 2:
								switch(_g219[1]) {
								case 0:
									switch(_g219[2][1]) {
									case 0:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(true));
										break;
									case 2:
										var a36 = _g118[2][2];
										var b27 = _g219[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(a36 - b27 > 0));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 3:
								switch(_g219[1]) {
								case 0:
									switch(_g219[2][1]) {
									case 0:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(true));
										break;
									case 3:
										var a37 = _g118[2][2];
										var b28 = _g219[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool((a37 > b28?1:a37 == b28?0:-1) > 0));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 4:
								switch(_g219[1]) {
								case 0:
									switch(_g219[2][1]) {
									case 0:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(true));
										break;
									case 4:
										var a38 = _g118[2][2];
										var b29 = _g219[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool((a38 > b29?1:a38 == b29?0:-1) > 0));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							}
							break;
						default:
							d = hxsl_TExprDef.TBinop(op,e13,e23);
						}
					}
					break;
				case 8:
					{
						var _g119 = e13.e;
						var _g220 = e23.e;
						switch(_g119[1]) {
						case 0:
							switch(_g119[2][1]) {
							case 0:
								switch(_g220[1]) {
								case 0:
									switch(_g220[2][1]) {
									case 0:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(true));
										break;
									default:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(false));
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 1:
								switch(_g220[1]) {
								case 0:
									switch(_g220[2][1]) {
									case 0:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(true));
										break;
									case 1:
										var a39 = _g119[2][2];
										var b30 = _g220[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool((a39 == b30?0:1) >= 0));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 2:
								switch(_g220[1]) {
								case 0:
									switch(_g220[2][1]) {
									case 0:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(true));
										break;
									case 2:
										var a40 = _g119[2][2];
										var b31 = _g220[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(a40 - b31 >= 0));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 3:
								switch(_g220[1]) {
								case 0:
									switch(_g220[2][1]) {
									case 0:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(true));
										break;
									case 3:
										var a41 = _g119[2][2];
										var b32 = _g220[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool((a41 > b32?1:a41 == b32?0:-1) >= 0));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 4:
								switch(_g220[1]) {
								case 0:
									switch(_g220[2][1]) {
									case 0:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(true));
										break;
									case 4:
										var a42 = _g119[2][2];
										var b33 = _g220[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool((a42 > b33?1:a42 == b33?0:-1) >= 0));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							}
							break;
						default:
							d = hxsl_TExprDef.TBinop(op,e13,e23);
						}
					}
					break;
				case 9:
					{
						var _g120 = e13.e;
						var _g221 = e23.e;
						switch(_g120[1]) {
						case 0:
							switch(_g120[2][1]) {
							case 0:
								switch(_g221[1]) {
								case 0:
									switch(_g221[2][1]) {
									case 0:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(false));
										break;
									default:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(true));
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 1:
								switch(_g221[1]) {
								case 0:
									switch(_g221[2][1]) {
									case 0:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(false));
										break;
									case 1:
										var a43 = _g120[2][2];
										var b34 = _g221[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool((a43 == b34?0:1) < 0));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 2:
								switch(_g221[1]) {
								case 0:
									switch(_g221[2][1]) {
									case 0:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(false));
										break;
									case 2:
										var a44 = _g120[2][2];
										var b35 = _g221[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(a44 - b35 < 0));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 3:
								switch(_g221[1]) {
								case 0:
									switch(_g221[2][1]) {
									case 0:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(false));
										break;
									case 3:
										var a45 = _g120[2][2];
										var b36 = _g221[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool((a45 > b36?1:a45 == b36?0:-1) < 0));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 4:
								switch(_g221[1]) {
								case 0:
									switch(_g221[2][1]) {
									case 0:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(false));
										break;
									case 4:
										var a46 = _g120[2][2];
										var b37 = _g221[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool((a46 > b37?1:a46 == b37?0:-1) < 0));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							}
							break;
						default:
							d = hxsl_TExprDef.TBinop(op,e13,e23);
						}
					}
					break;
				case 10:
					{
						var _g121 = e13.e;
						var _g222 = e23.e;
						switch(_g121[1]) {
						case 0:
							switch(_g121[2][1]) {
							case 0:
								switch(_g222[1]) {
								case 0:
									switch(_g222[2][1]) {
									case 0:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(true));
										break;
									default:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(true));
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 1:
								switch(_g222[1]) {
								case 0:
									switch(_g222[2][1]) {
									case 0:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(false));
										break;
									case 1:
										var a47 = _g121[2][2];
										var b38 = _g222[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool((a47 == b38?0:1) <= 0));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 2:
								switch(_g222[1]) {
								case 0:
									switch(_g222[2][1]) {
									case 0:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(false));
										break;
									case 2:
										var a48 = _g121[2][2];
										var b39 = _g222[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(a48 - b39 <= 0));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 3:
								switch(_g222[1]) {
								case 0:
									switch(_g222[2][1]) {
									case 0:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(false));
										break;
									case 3:
										var a49 = _g121[2][2];
										var b40 = _g222[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool((a49 > b40?1:a49 == b40?0:-1) <= 0));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							case 4:
								switch(_g222[1]) {
								case 0:
									switch(_g222[2][1]) {
									case 0:
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool(false));
										break;
									case 4:
										var a50 = _g121[2][2];
										var b41 = _g222[2][2];
										d = hxsl_TExprDef.TConst(hxsl_Const.CBool((a50 > b41?1:a50 == b41?0:-1) <= 0));
										break;
									default:
										d = hxsl_TExprDef.TBinop(op,e13,e23);
									}
									break;
								default:
									d = hxsl_TExprDef.TBinop(op,e13,e23);
								}
								break;
							}
							break;
						default:
							d = hxsl_TExprDef.TBinop(op,e13,e23);
						}
					}
					break;
				case 21:case 4:case 20:
					d = hxsl_TExprDef.TBinop(op,e13,e23);
					break;
				case 22:
					throw new js__$Boot_HaxeError("assert");
					break;
				}
				break;
			case 6:
				var e9 = _g[3];
				var op1 = _g[2];
				var e10 = this.evalExpr(e9);
				{
					var _g122 = e10.e;
					switch(_g122[1]) {
					case 0:
						var c3 = _g122[2];
						switch(op1[1]) {
						case 2:
							switch(c3[1]) {
							case 1:
								var b42 = c3[2];
								d = hxsl_TExprDef.TConst(hxsl_Const.CBool(!b42));
								break;
							default:
								d = hxsl_TExprDef.TUnop(op1,e10);
							}
							break;
						case 3:
							switch(c3[1]) {
							case 2:
								var i3 = c3[2];
								d = hxsl_TExprDef.TConst(hxsl_Const.CInt(-i3));
								break;
							case 3:
								var f1 = c3[2];
								d = hxsl_TExprDef.TConst(hxsl_Const.CFloat(-f1));
								break;
							default:
								d = hxsl_TExprDef.TUnop(op1,e10);
							}
							break;
						default:
							d = hxsl_TExprDef.TUnop(op1,e10);
						}
						break;
					default:
						d = hxsl_TExprDef.TUnop(op1,e10);
					}
				}
				break;
			case 3:
				var e14 = _g[2];
				var e15 = this.evalExpr(e14,isVal);
				{
					var _g123 = e15.e;
					switch(_g123[1]) {
					case 0:
						d = e15.e;
						break;
					default:
						d = hxsl_TExprDef.TParenthesis(e15);
					}
				}
				break;
			case 10:
				var eelse = _g[4];
				var eif = _g[3];
				var econd = _g[2];
				var econd1 = this.evalExpr(econd);
				{
					var _g124 = econd1.e;
					switch(_g124[1]) {
					case 0:
						switch(_g124[2][1]) {
						case 1:
							var b43 = _g124[2][2];
							if(b43) d = this.evalExpr(eif,isVal).e; else if(eelse == null) d = hxsl_TExprDef.TConst(hxsl_Const.CNull); else d = this.evalExpr(eelse,isVal).e;
							break;
						default:
							if(isVal && eelse != null) d = hxsl_TExprDef.TCall({ e : hxsl_TExprDef.TGlobal(hxsl_TGlobal.Mix), t : e.t, p : e.p},[eif,eelse,{ e : hxsl_TExprDef.TCall({ e : hxsl_TExprDef.TGlobal(hxsl_TGlobal.ToFloat), t : hxsl_Type.TFun([]), p : econd1.p},[econd1]), t : hxsl_Type.TFloat, p : e.p}]); else d = hxsl_TExprDef.TIf(econd1,this.evalExpr(eif,isVal),eelse == null?null:this.evalExpr(eelse,isVal));
						}
						break;
					default:
						if(isVal && eelse != null) d = hxsl_TExprDef.TCall({ e : hxsl_TExprDef.TGlobal(hxsl_TGlobal.Mix), t : e.t, p : e.p},[eif,eelse,{ e : hxsl_TExprDef.TCall({ e : hxsl_TExprDef.TGlobal(hxsl_TGlobal.ToFloat), t : hxsl_Type.TFun([]), p : econd1.p},[econd1]), t : hxsl_Type.TFloat, p : e.p}]); else d = hxsl_TExprDef.TIf(econd1,this.evalExpr(eif,isVal),eelse == null?null:this.evalExpr(eelse,isVal));
					}
				}
				break;
			case 15:
				d = hxsl_TExprDef.TBreak;
				break;
			case 14:
				d = hxsl_TExprDef.TContinue;
				break;
			case 11:
				d = hxsl_TExprDef.TDiscard;
				break;
			case 13:
				var loop = _g[4];
				var it = _g[3];
				var v6 = _g[2];
				var v23 = this.mapVar(v6);
				var it1 = this.evalExpr(it);
				var e16;
				{
					var _g125 = it1.e;
					switch(_g125[1]) {
					case 5:
						switch(_g125[2][1]) {
						case 21:
							switch(_g125[3].e[1]) {
							case 0:
								switch(_g125[3].e[2][1]) {
								case 2:
									switch(_g125[4].e[1]) {
									case 0:
										switch(_g125[4].e[2][1]) {
										case 2:
											var start = _g125[3].e[2][2];
											var len = _g125[4].e[2][2];
											if(this.unrollLoops) {
												var out1 = [];
												var _g223 = start;
												while(_g223 < len) {
													var i4 = _g223++;
													var value = hxsl_TExprDef.TConst(hxsl_Const.CInt(i4));
													this.constants.set(v6,value);
													out1.push(this.evalExpr(loop,false));
												}
												this.constants.remove(v6);
												e16 = hxsl_TExprDef.TBlock(out1);
											} else e16 = hxsl_TExprDef.TFor(v23,it1,this.evalExpr(loop,false));
											break;
										default:
											e16 = hxsl_TExprDef.TFor(v23,it1,this.evalExpr(loop,false));
										}
										break;
									default:
										e16 = hxsl_TExprDef.TFor(v23,it1,this.evalExpr(loop,false));
									}
									break;
								default:
									e16 = hxsl_TExprDef.TFor(v23,it1,this.evalExpr(loop,false));
								}
								break;
							default:
								e16 = hxsl_TExprDef.TFor(v23,it1,this.evalExpr(loop,false));
							}
							break;
						default:
							e16 = hxsl_TExprDef.TFor(v23,it1,this.evalExpr(loop,false));
						}
						break;
					default:
						e16 = hxsl_TExprDef.TFor(v23,it1,this.evalExpr(loop,false));
					}
				}
				this.varMap.remove(v6);
				d = e16;
				break;
			case 17:
				var el3 = _g[2];
				d = hxsl_TExprDef.TArrayDecl((function($this) {
					var $r;
					var _g126 = [];
					{
						var _g224 = 0;
						while(_g224 < el3.length) {
							var e17 = el3[_g224];
							++_g224;
							_g126.push($this.evalExpr(e17));
						}
					}
					$r = _g126;
					return $r;
				}(this)));
				break;
			}
		}
		return { e : d, t : e.t, p : e.p};
	}
	,__class__: hxsl_Eval
};
var hxsl__$Flatten_Alloc = function(g,t,pos,size) {
	this.g = g;
	this.t = t;
	this.pos = pos;
	this.size = size;
};
$hxClasses["hxsl._Flatten.Alloc"] = hxsl__$Flatten_Alloc;
hxsl__$Flatten_Alloc.__name__ = ["hxsl","_Flatten","Alloc"];
hxsl__$Flatten_Alloc.prototype = {
	__class__: hxsl__$Flatten_Alloc
};
var hxsl_ARead = $hxClasses["hxsl.ARead"] = { __ename__ : true, __constructs__ : ["AIndex","AOffset"] };
hxsl_ARead.AIndex = function(a) { var $x = ["AIndex",0,a]; $x.__enum__ = hxsl_ARead; $x.toString = $estr; return $x; };
hxsl_ARead.AOffset = function(a,stride,delta) { var $x = ["AOffset",1,a,stride,delta]; $x.__enum__ = hxsl_ARead; $x.toString = $estr; return $x; };
hxsl_ARead.__empty_constructs__ = [];
var hxsl_Flatten = function() {
};
$hxClasses["hxsl.Flatten"] = hxsl_Flatten;
hxsl_Flatten.__name__ = ["hxsl","Flatten"];
hxsl_Flatten.prototype = {
	flatten: function(s,kind,constsToGlobal) {
		this.globals = [];
		this.params = [];
		this.outVars = [];
		if(constsToGlobal) {
			this.consts = [];
			var p = s.funs[0].expr.p;
			var gc = { id : hxsl_Tools.allocVarId(), name : "__consts__", kind : hxsl_VarKind.Global, type : null};
			this.econsts = { e : hxsl_TExprDef.TVar(gc), t : null, p : p};
			s = { name : s.name, vars : s.vars.slice(), funs : (function($this) {
				var $r;
				var _g = [];
				{
					var _g1 = 0;
					var _g2 = s.funs;
					while(_g1 < _g2.length) {
						var f = _g2[_g1];
						++_g1;
						_g.push($this.mapFun(f,$bind($this,$this.mapConsts)));
					}
				}
				$r = _g;
				return $r;
			}(this))};
			var _g11 = 0;
			var _g21 = s.vars;
			while(_g11 < _g21.length) {
				var v = _g21[_g11];
				++_g11;
				{
					var _g3 = v.type;
					switch(_g3[1]) {
					case 9:
						this.allocConst(255,p);
						break;
					default:
					}
				}
			}
			if(this.consts.length > 0) {
				gc.type = this.econsts.t = hxsl_Type.TArray(hxsl_Type.TFloat,hxsl_SizeDecl.SConst(this.consts.length));
				s.vars.push(gc);
			}
		}
		this.varMap = new haxe_ds_ObjectMap();
		this.allocData = new haxe_ds_ObjectMap();
		var _g4 = 0;
		var _g12 = s.vars;
		while(_g4 < _g12.length) {
			var v1 = _g12[_g4];
			++_g4;
			this.gatherVar(v1);
		}
		var prefix;
		switch(kind[1]) {
		case 0:
			prefix = "vertex";
			break;
		case 1:
			prefix = "fragment";
			break;
		default:
			throw new js__$Boot_HaxeError("assert");
		}
		this.pack(prefix + "Globals",hxsl_VarKind.Global,this.globals,hxsl_VecType.VFloat);
		this.pack(prefix + "Params",hxsl_VarKind.Param,this.params,hxsl_VecType.VFloat);
		var allVars = this.globals.concat(this.params);
		var textures = this.packTextures(prefix + "Textures",allVars,hxsl_Type.TSampler2D).concat(this.packTextures(prefix + "TexturesCube",allVars,hxsl_Type.TSamplerCube));
		var funs;
		var _g5 = [];
		var _g13 = 0;
		var _g22 = s.funs;
		while(_g13 < _g22.length) {
			var f1 = _g22[_g13];
			++_g13;
			_g5.push(this.mapFun(f1,$bind(this,this.mapExpr)));
		}
		funs = _g5;
		var _g14 = 0;
		while(_g14 < textures.length) {
			var t = textures[_g14];
			++_g14;
			t.pos >>= 2;
		}
		return { name : s.name, vars : this.outVars, funs : funs};
	}
	,mapFun: function(f,mapExpr) {
		return { kind : f.kind, ret : f.ret, args : f.args, ref : f.ref, expr : mapExpr(f.expr)};
	}
	,mapExpr: function(e) {
		{
			var _g = e.e;
			switch(_g[1]) {
			case 1:
				var v = _g[2];
				var a = this.varMap.h[v.__id__];
				if(a == null) e = e; else e = this.access(a,v.type,e.p,hxsl_ARead.AIndex(a));
				break;
			case 16:
				switch(_g[2].e[1]) {
				case 1:
					var eindex = _g[3];
					var vp = _g[2].p;
					var v1 = _g[2].e[2];
					if(!(function($this) {
						var $r;
						var _g1 = eindex.e;
						$r = (function($this) {
							var $r;
							switch(_g1[1]) {
							case 0:
								$r = (function($this) {
									var $r;
									switch(_g1[2][1]) {
									case 2:
										$r = true;
										break;
									default:
										$r = false;
									}
									return $r;
								}($this));
								break;
							default:
								$r = false;
							}
							return $r;
						}($this));
						return $r;
					}(this))) {
						var a1 = this.varMap.h[v1.__id__];
						if(a1 == null) e = e; else {
							var _g11 = v1.type;
							switch(_g11[1]) {
							case 14:
								var t = _g11[2];
								var stride = this.varSize(t,a1.t);
								if(stride == 0 || (stride & 3) != 0) throw new js__$Boot_HaxeError(new hxsl_Error("Dynamic access to an Array which size is not 4 components-aligned is not allowed",e.p));
								stride >>= 2;
								eindex = this.mapExpr(eindex);
								var toInt = { e : hxsl_TExprDef.TCall({ e : hxsl_TExprDef.TGlobal(hxsl_TGlobal.ToInt), t : hxsl_Type.TFun([]), p : vp},[eindex]), t : hxsl_Type.TInt, p : vp};
								e = this.access(a1,t,vp,hxsl_ARead.AOffset(a1,stride,stride == 1?toInt:{ e : hxsl_TExprDef.TBinop(haxe_macro_Binop.OpMult,toInt,{ e : hxsl_TExprDef.TConst(hxsl_Const.CInt(stride)), t : hxsl_Type.TInt, p : vp}), t : hxsl_Type.TInt, p : vp}));
								break;
							default:
								throw new js__$Boot_HaxeError("assert");
							}
						}
					} else e = hxsl_Tools.map(e,$bind(this,this.mapExpr));
					break;
				default:
					e = hxsl_Tools.map(e,$bind(this,this.mapExpr));
				}
				break;
			default:
				e = hxsl_Tools.map(e,$bind(this,this.mapExpr));
			}
		}
		return this.optimize(e);
	}
	,mapConsts: function(e) {
		{
			var _g = e.e;
			switch(_g[1]) {
			case 16:
				var eindex = _g[3];
				var eindex1 = _g[3];
				switch(_g[3].e[1]) {
				case 0:
					switch(_g[3].e[2][1]) {
					case 2:
						var ea = _g[2];
						return { e : hxsl_TExprDef.TArray(this.mapConsts(ea),eindex), t : e.t, p : e.p};
					default:
						var ea1 = _g[2];
						{
							var _g1 = ea1.t;
							switch(_g1[1]) {
							case 14:
								var t = _g1[2];
								var stride = this.varSize(t,hxsl_VecType.VFloat) >> 2;
								this.allocConst(stride,e.p);
								break;
							default:
							}
						}
					}
					break;
				default:
					var ea2 = _g[2];
					{
						var _g11 = ea2.t;
						switch(_g11[1]) {
						case 14:
							var t1 = _g11[2];
							var stride1 = this.varSize(t1,hxsl_VecType.VFloat) >> 2;
							this.allocConst(stride1,e.p);
							break;
						default:
						}
					}
				}
				break;
			case 5:
				switch(_g[2][1]) {
				case 1:
					switch(_g[4].t[1]) {
					case 8:
						this.allocConst(1,e.p);
						break;
					default:
					}
					break;
				default:
				}
				break;
			case 0:
				var c = _g[2];
				switch(c[1]) {
				case 3:
					var v = c[2];
					return this.allocConst(v,e.p);
				case 2:
					var v1 = c[2];
					return this.allocConst(v1,e.p);
				default:
					return e;
				}
				break;
			case 2:
				var g = _g[2];
				switch(g[1]) {
				case 52:
					this.allocConsts([1,255,65025,16581375],e.p);
					this.allocConsts([0.00392156862745098,0.00392156862745098,0.00392156862745098,0],e.p);
					break;
				case 53:
					this.allocConsts([1,0.00392156862745098,1.53787004998077679e-05,6.03086294110108446e-08],e.p);
					break;
				case 0:
					this.allocConst(Math.PI / 180,e.p);
					break;
				case 1:
					this.allocConst(180 / Math.PI,e.p);
					break;
				case 10:
					this.allocConst(0.6931471805599453,e.p);
					break;
				case 9:
					this.allocConst(1.4426950408889634,e.p);
					break;
				case 24:
					this.allocConst(1,e.p);
					break;
				case 55:
					this.allocConst(0.5,e.p);
					break;
				case 54:
					this.allocConst(1,e.p);
					this.allocConst(0.5,e.p);
					break;
				default:
				}
				break;
			case 8:
				switch(_g[2].e[1]) {
				case 2:
					switch(_g[2].e[2][1]) {
					case 40:
						switch(_g[3].length) {
						case 2:
							switch(_g[3][0].t[1]) {
							case 5:
								switch(_g[3][0].t[2]) {
								case 3:
									switch(_g[3][0].t[3][1]) {
									case 1:
										switch(_g[3][0].e[1]) {
										case 1:
											switch(_g[3][0].e[2].kind[1]) {
											case 0:case 2:case 1:case 3:
												switch(_g[3][1].e[1]) {
												case 0:
													switch(_g[3][1].e[2][1]) {
													case 2:
														switch(_g[3][1].e[2][2]) {
														case 1:
															return e;
														default:
														}
														break;
													default:
													}
													break;
												default:
												}
												break;
											default:
											}
											break;
										default:
										}
										break;
									default:
									}
									break;
								default:
								}
								break;
							default:
							}
							break;
						default:
						}
						break;
					default:
					}
					break;
				default:
				}
				break;
			default:
			}
		}
		return hxsl_Tools.map(e,$bind(this,this.mapConsts));
	}
	,allocConst: function(v,p) {
		var index = HxOverrides.indexOf(this.consts,v,0);
		if(index < 0) {
			index = this.consts.length;
			this.consts.push(v);
		}
		return { e : hxsl_TExprDef.TArray(this.econsts,{ e : hxsl_TExprDef.TConst(hxsl_Const.CInt(index)), t : hxsl_Type.TInt, p : p}), t : hxsl_Type.TFloat, p : p};
	}
	,allocConsts: function(va,p) {
		var _g = this;
		var pad = va.length - 1 & 3;
		var index = -1;
		var _g1 = 0;
		var _g2 = this.consts.length - (va.length - 1);
		while(_g1 < _g2) {
			var i = _g1++;
			if(i >> 2 != i + pad >> 2) continue;
			var found = true;
			var _g3 = 0;
			var _g21 = va.length;
			while(_g3 < _g21) {
				var j = _g3++;
				if(this.consts[i + j] != va[j]) {
					found = false;
					break;
				}
			}
			if(found) {
				index = i;
				break;
			}
		}
		if(index < 0) {
			while(this.consts.length >> 2 != this.consts.length + pad >> 2) this.consts.push(0);
			index = this.consts.length;
			var _g4 = 0;
			while(_g4 < va.length) {
				var v = va[_g4];
				++_g4;
				this.consts.push(v);
			}
		}
		var _g5 = va.length;
		switch(_g5) {
		case 1:
			return { e : hxsl_TExprDef.TArray(_g.econsts,{ e : hxsl_TExprDef.TConst(hxsl_Const.CInt(index)), t : hxsl_Type.TInt, p : p}), t : hxsl_Type.TFloat, p : p};
		case 2:
			return { e : hxsl_TExprDef.TCall({ e : hxsl_TExprDef.TGlobal(hxsl_TGlobal.Vec2), t : hxsl_Type.TVoid, p : p},[{ e : hxsl_TExprDef.TArray(_g.econsts,{ e : hxsl_TExprDef.TConst(hxsl_Const.CInt(index)), t : hxsl_Type.TInt, p : p}), t : hxsl_Type.TFloat, p : p},{ e : hxsl_TExprDef.TArray(_g.econsts,{ e : hxsl_TExprDef.TConst(hxsl_Const.CInt(index + 1)), t : hxsl_Type.TInt, p : p}), t : hxsl_Type.TFloat, p : p}]), t : hxsl_Type.TVec(2,hxsl_VecType.VFloat), p : p};
		case 3:
			return { e : hxsl_TExprDef.TCall({ e : hxsl_TExprDef.TGlobal(hxsl_TGlobal.Vec3), t : hxsl_Type.TVoid, p : p},[{ e : hxsl_TExprDef.TArray(_g.econsts,{ e : hxsl_TExprDef.TConst(hxsl_Const.CInt(index)), t : hxsl_Type.TInt, p : p}), t : hxsl_Type.TFloat, p : p},{ e : hxsl_TExprDef.TArray(_g.econsts,{ e : hxsl_TExprDef.TConst(hxsl_Const.CInt(index + 1)), t : hxsl_Type.TInt, p : p}), t : hxsl_Type.TFloat, p : p},{ e : hxsl_TExprDef.TArray(_g.econsts,{ e : hxsl_TExprDef.TConst(hxsl_Const.CInt(index + 2)), t : hxsl_Type.TInt, p : p}), t : hxsl_Type.TFloat, p : p}]), t : hxsl_Type.TVec(3,hxsl_VecType.VFloat), p : p};
		case 4:
			return { e : hxsl_TExprDef.TCall({ e : hxsl_TExprDef.TGlobal(hxsl_TGlobal.Vec4), t : hxsl_Type.TVoid, p : p},[{ e : hxsl_TExprDef.TArray(_g.econsts,{ e : hxsl_TExprDef.TConst(hxsl_Const.CInt(index)), t : hxsl_Type.TInt, p : p}), t : hxsl_Type.TFloat, p : p},{ e : hxsl_TExprDef.TArray(_g.econsts,{ e : hxsl_TExprDef.TConst(hxsl_Const.CInt(index + 1)), t : hxsl_Type.TInt, p : p}), t : hxsl_Type.TFloat, p : p},{ e : hxsl_TExprDef.TArray(_g.econsts,{ e : hxsl_TExprDef.TConst(hxsl_Const.CInt(index + 3)), t : hxsl_Type.TInt, p : p}), t : hxsl_Type.TFloat, p : p},{ e : hxsl_TExprDef.TArray(_g.econsts,{ e : hxsl_TExprDef.TConst(hxsl_Const.CInt(index + 4)), t : hxsl_Type.TInt, p : p}), t : hxsl_Type.TFloat, p : p}]), t : hxsl_Type.TVec(4,hxsl_VecType.VFloat), p : p};
		default:
			throw new js__$Boot_HaxeError("assert");
		}
	}
	,readOffset: function(a,stride,delta,index,pos) {
		var index1 = (a.pos >> 2) + index;
		var offset;
		if(index1 == 0) offset = delta; else offset = { e : hxsl_TExprDef.TBinop(haxe_macro_Binop.OpAdd,delta,{ e : hxsl_TExprDef.TConst(hxsl_Const.CInt(index1)), t : hxsl_Type.TInt, p : pos}), t : hxsl_Type.TInt, p : pos};
		return { e : hxsl_TExprDef.TArray({ e : hxsl_TExprDef.TVar(a.g), t : a.g.type, p : pos},offset), t : hxsl_Type.TVec(4,a.t), p : pos};
	}
	,access: function(a,t,pos,acc) {
		var _g = this;
		switch(t[1]) {
		case 7:
			return { e : hxsl_TExprDef.TCall({ e : hxsl_TExprDef.TGlobal(hxsl_TGlobal.Mat4), t : hxsl_Type.TFun([]), p : pos},[(function($this) {
				var $r;
				switch(acc[1]) {
				case 0:
					$r = (function($this) {
						var $r;
						var a1 = acc[2];
						$r = { e : hxsl_TExprDef.TArray({ e : hxsl_TExprDef.TVar(a1.g), t : a1.g.type, p : pos},{ e : hxsl_TExprDef.TConst(hxsl_Const.CInt(a1.pos >> 2)), t : hxsl_Type.TInt, p : pos}), t : hxsl_Type.TVec(4,a1.t), p : pos};
						return $r;
					}($this));
					break;
				case 1:
					$r = (function($this) {
						var $r;
						var delta = acc[4];
						var stride = acc[3];
						var a2 = acc[2];
						$r = _g.readOffset(a2,stride,delta,0,pos);
						return $r;
					}($this));
					break;
				}
				return $r;
			}(this)),(function($this) {
				var $r;
				switch(acc[1]) {
				case 0:
					$r = (function($this) {
						var $r;
						var a3 = acc[2];
						$r = { e : hxsl_TExprDef.TArray({ e : hxsl_TExprDef.TVar(a3.g), t : a3.g.type, p : pos},{ e : hxsl_TExprDef.TConst(hxsl_Const.CInt((a3.pos >> 2) + 1)), t : hxsl_Type.TInt, p : pos}), t : hxsl_Type.TVec(4,a3.t), p : pos};
						return $r;
					}($this));
					break;
				case 1:
					$r = (function($this) {
						var $r;
						var delta1 = acc[4];
						var stride1 = acc[3];
						var a4 = acc[2];
						$r = _g.readOffset(a4,stride1,delta1,1,pos);
						return $r;
					}($this));
					break;
				}
				return $r;
			}(this)),(function($this) {
				var $r;
				switch(acc[1]) {
				case 0:
					$r = (function($this) {
						var $r;
						var a5 = acc[2];
						$r = { e : hxsl_TExprDef.TArray({ e : hxsl_TExprDef.TVar(a5.g), t : a5.g.type, p : pos},{ e : hxsl_TExprDef.TConst(hxsl_Const.CInt((a5.pos >> 2) + 2)), t : hxsl_Type.TInt, p : pos}), t : hxsl_Type.TVec(4,a5.t), p : pos};
						return $r;
					}($this));
					break;
				case 1:
					$r = (function($this) {
						var $r;
						var delta2 = acc[4];
						var stride2 = acc[3];
						var a6 = acc[2];
						$r = _g.readOffset(a6,stride2,delta2,2,pos);
						return $r;
					}($this));
					break;
				}
				return $r;
			}(this)),(function($this) {
				var $r;
				switch(acc[1]) {
				case 0:
					$r = (function($this) {
						var $r;
						var a7 = acc[2];
						$r = { e : hxsl_TExprDef.TArray({ e : hxsl_TExprDef.TVar(a7.g), t : a7.g.type, p : pos},{ e : hxsl_TExprDef.TConst(hxsl_Const.CInt((a7.pos >> 2) + 3)), t : hxsl_Type.TInt, p : pos}), t : hxsl_Type.TVec(4,a7.t), p : pos};
						return $r;
					}($this));
					break;
				case 1:
					$r = (function($this) {
						var $r;
						var delta3 = acc[4];
						var stride3 = acc[3];
						var a8 = acc[2];
						$r = _g.readOffset(a8,stride3,delta3,3,pos);
						return $r;
					}($this));
					break;
				}
				return $r;
			}(this))]), t : hxsl_Type.TMat4, p : pos};
		case 8:
			return { e : hxsl_TExprDef.TCall({ e : hxsl_TExprDef.TGlobal(hxsl_TGlobal.Mat3x4), t : hxsl_Type.TFun([]), p : pos},[(function($this) {
				var $r;
				switch(acc[1]) {
				case 0:
					$r = (function($this) {
						var $r;
						var a9 = acc[2];
						$r = { e : hxsl_TExprDef.TArray({ e : hxsl_TExprDef.TVar(a9.g), t : a9.g.type, p : pos},{ e : hxsl_TExprDef.TConst(hxsl_Const.CInt(a9.pos >> 2)), t : hxsl_Type.TInt, p : pos}), t : hxsl_Type.TVec(4,a9.t), p : pos};
						return $r;
					}($this));
					break;
				case 1:
					$r = (function($this) {
						var $r;
						var delta4 = acc[4];
						var stride4 = acc[3];
						var a10 = acc[2];
						$r = _g.readOffset(a10,stride4,delta4,0,pos);
						return $r;
					}($this));
					break;
				}
				return $r;
			}(this)),(function($this) {
				var $r;
				switch(acc[1]) {
				case 0:
					$r = (function($this) {
						var $r;
						var a11 = acc[2];
						$r = { e : hxsl_TExprDef.TArray({ e : hxsl_TExprDef.TVar(a11.g), t : a11.g.type, p : pos},{ e : hxsl_TExprDef.TConst(hxsl_Const.CInt((a11.pos >> 2) + 1)), t : hxsl_Type.TInt, p : pos}), t : hxsl_Type.TVec(4,a11.t), p : pos};
						return $r;
					}($this));
					break;
				case 1:
					$r = (function($this) {
						var $r;
						var delta5 = acc[4];
						var stride5 = acc[3];
						var a12 = acc[2];
						$r = _g.readOffset(a12,stride5,delta5,1,pos);
						return $r;
					}($this));
					break;
				}
				return $r;
			}(this)),(function($this) {
				var $r;
				switch(acc[1]) {
				case 0:
					$r = (function($this) {
						var $r;
						var a13 = acc[2];
						$r = { e : hxsl_TExprDef.TArray({ e : hxsl_TExprDef.TVar(a13.g), t : a13.g.type, p : pos},{ e : hxsl_TExprDef.TConst(hxsl_Const.CInt((a13.pos >> 2) + 2)), t : hxsl_Type.TInt, p : pos}), t : hxsl_Type.TVec(4,a13.t), p : pos};
						return $r;
					}($this));
					break;
				case 1:
					$r = (function($this) {
						var $r;
						var delta6 = acc[4];
						var stride6 = acc[3];
						var a14 = acc[2];
						$r = _g.readOffset(a14,stride6,delta6,2,pos);
						return $r;
					}($this));
					break;
				}
				return $r;
			}(this))]), t : hxsl_Type.TMat3x4, p : pos};
		case 6:
			return { e : hxsl_TExprDef.TCall({ e : hxsl_TExprDef.TGlobal(hxsl_TGlobal.Mat3), t : hxsl_Type.TFun([]), p : pos},[this.access(a,hxsl_Type.TMat3x4,pos,acc)]), t : hxsl_Type.TMat3, p : pos};
		case 14:
			switch(t[3][1]) {
			case 0:
				var t1 = t[2];
				var len = t[3][2];
				var stride7 = a.size / len | 0;
				var earr;
				var _g1 = [];
				var _g11 = 0;
				while(_g11 < len) {
					var i = _g11++;
					_g1.push((function($this) {
						var $r;
						var a15 = new hxsl__$Flatten_Alloc(a.g,a.t,a.pos + stride7 * i,stride7);
						$r = $this.access(a15,t1,pos,hxsl_ARead.AIndex(a15));
						return $r;
					}(this)));
				}
				earr = _g1;
				return { e : hxsl_TExprDef.TArrayDecl(earr), t : t1, p : pos};
			default:
				var size = this.varSize(t,a.t);
				if(size <= 4) {
					var k;
					switch(acc[1]) {
					case 0:
						var a16 = acc[2];
						k = { e : hxsl_TExprDef.TArray({ e : hxsl_TExprDef.TVar(a16.g), t : a16.g.type, p : pos},{ e : hxsl_TExprDef.TConst(hxsl_Const.CInt(a16.pos >> 2)), t : hxsl_Type.TInt, p : pos}), t : hxsl_Type.TVec(4,a16.t), p : pos};
						break;
					case 1:
						var delta7 = acc[4];
						var stride8 = acc[3];
						var a17 = acc[2];
						k = _g.readOffset(a17,stride8,delta7,0,pos);
						break;
					}
					if(size == 4) {
						if((a.pos & 3) != 0) throw new js__$Boot_HaxeError("assert");
						return k;
					} else {
						var sw = [];
						var _g2 = 0;
						while(_g2 < size) {
							var i1 = _g2++;
							sw.push(hxsl_Tools.SWIZ[i1 + (a.pos & 3)]);
						}
						return { e : hxsl_TExprDef.TSwiz(k,sw), t : t, p : pos};
					}
				}
				return hxsl_Error.t("Access not supported for " + hxsl_Tools.toString(t),null);
			}
			break;
		case 10:case 11:
			switch(acc[1]) {
			case 0:
				var a18 = acc[2];
				return { e : hxsl_TExprDef.TArray({ e : hxsl_TExprDef.TVar(a18.g), t : a18.g.type, p : pos},{ e : hxsl_TExprDef.TConst(hxsl_Const.CInt(a18.pos >> 2)), t : hxsl_Type.TInt, p : pos}), t : hxsl_Type.TVec(4,a18.t), p : pos};
			case 1:
				var delta8 = acc[4];
				var stride9 = acc[3];
				var a19 = acc[2];
				return _g.readOffset(a19,stride9,delta8,0,pos);
			}
			break;
		default:
			var size1 = this.varSize(t,a.t);
			if(size1 <= 4) {
				var k1;
				switch(acc[1]) {
				case 0:
					var a20 = acc[2];
					k1 = { e : hxsl_TExprDef.TArray({ e : hxsl_TExprDef.TVar(a20.g), t : a20.g.type, p : pos},{ e : hxsl_TExprDef.TConst(hxsl_Const.CInt(a20.pos >> 2)), t : hxsl_Type.TInt, p : pos}), t : hxsl_Type.TVec(4,a20.t), p : pos};
					break;
				case 1:
					var delta9 = acc[4];
					var stride10 = acc[3];
					var a21 = acc[2];
					k1 = _g.readOffset(a21,stride10,delta9,0,pos);
					break;
				}
				if(size1 == 4) {
					if((a.pos & 3) != 0) throw new js__$Boot_HaxeError("assert");
					return k1;
				} else {
					var sw1 = [];
					var _g3 = 0;
					while(_g3 < size1) {
						var i2 = _g3++;
						sw1.push(hxsl_Tools.SWIZ[i2 + (a.pos & 3)]);
					}
					return { e : hxsl_TExprDef.TSwiz(k1,sw1), t : t, p : pos};
				}
			}
			return hxsl_Error.t("Access not supported for " + hxsl_Tools.toString(t),null);
		}
	}
	,optimize: function(e) {
		{
			var _g = e.e;
			switch(_g[1]) {
			case 8:
				switch(_g[2].e[1]) {
				case 2:
					switch(_g[2].e[2][1]) {
					case 50:
						switch(_g[3].length) {
						case 1:
							switch(_g[3][0].e[1]) {
							case 8:
								switch(_g[3][0].e[2].e[1]) {
								case 2:
									switch(_g[3][0].e[2].e[2][1]) {
									case 49:
										var args = _g[3][0].e[3];
										var rem = 0;
										var size = 0;
										while(size < 4) {
											var t = args[args.length - 1 - rem].t;
											size += this.varSize(t,hxsl_VecType.VFloat);
											rem++;
										}
										if(size == 4) {
											var _g1 = 0;
											while(_g1 < rem) {
												var i = _g1++;
												args.pop();
											}
											var emat;
											{
												var _g11 = e.e;
												switch(_g11[1]) {
												case 8:
													var e1 = _g11[2];
													emat = e1;
													break;
												default:
													throw new js__$Boot_HaxeError("assert");
												}
											}
											return { e : hxsl_TExprDef.TCall(emat,args), t : e.t, p : e.p};
										}
										break;
									default:
									}
									break;
								default:
								}
								break;
							default:
							}
							break;
						default:
						}
						break;
					default:
					}
					break;
				default:
				}
				break;
			case 16:
				switch(_g[2].e[1]) {
				case 17:
					switch(_g[3].e[1]) {
					case 0:
						switch(_g[3].e[2][1]) {
						case 2:
							var el = _g[2].e[2];
							var i1 = _g[3].e[2][2];
							if(i1 >= 0 && i1 < el.length) return el[i1];
							hxsl_Error.t("Reading outside array bounds",e.p);
							break;
						default:
						}
						break;
					default:
					}
					break;
				default:
				}
				break;
			default:
			}
		}
		return e;
	}
	,packTextures: function(name,vars,t) {
		var alloc = [];
		var g = { id : hxsl_Tools.allocVarId(), name : name, type : t, kind : hxsl_VarKind.Param};
		var _g = 0;
		while(_g < vars.length) {
			var v = vars[_g];
			++_g;
			if(v.type != t) continue;
			var a = new hxsl__$Flatten_Alloc(g,null,alloc.length << 2,1);
			a.v = v;
			this.varMap.set(v,a);
			alloc.push(a);
		}
		g.type = hxsl_Type.TArray(t,hxsl_SizeDecl.SConst(alloc.length));
		if(alloc.length > 0) {
			this.outVars.push(g);
			this.allocData.set(g,alloc);
		}
		return alloc;
	}
	,pack: function(name,kind,vars,t) {
		var alloc = [];
		var apos = 0;
		var g = { id : hxsl_Tools.allocVarId(), name : name, type : hxsl_Type.TVec(0,t), kind : kind};
		var _g = 0;
		while(_g < vars.length) {
			var v = vars[_g];
			++_g;
			var _g1 = v.type;
			switch(_g1[1]) {
			case 10:case 11:
				continue;
				break;
			default:
			}
			var size = this.varSize(v.type,t);
			var best = null;
			var _g11 = 0;
			while(_g11 < alloc.length) {
				var a = alloc[_g11];
				++_g11;
				if(a.v == null && a.size >= size && (best == null || best.size > a.size)) best = a;
			}
			if(best != null) {
				var free = best.size - size;
				if(free > 0) {
					var i = Lambda.indexOf(alloc,best);
					var a1 = new hxsl__$Flatten_Alloc(g,t,best.pos + size,free);
					alloc.splice(i + 1,0,a1);
					best.size = size;
				}
				best.v = v;
				this.varMap.set(v,best);
			} else {
				var a2 = new hxsl__$Flatten_Alloc(g,t,apos,size);
				apos += size;
				a2.v = v;
				this.varMap.set(v,a2);
				alloc.push(a2);
				var pad = (4 - size % 4) % 4;
				if(pad > 0) {
					var a3 = new hxsl__$Flatten_Alloc(g,t,apos,pad);
					apos += pad;
					alloc.push(a3);
				}
			}
		}
		g.type = hxsl_Type.TArray(hxsl_Type.TVec(4,t),hxsl_SizeDecl.SConst(apos >> 2));
		if(apos > 0) {
			this.outVars.push(g);
			this.allocData.set(g,alloc);
		}
		return g;
	}
	,varSize: function(v,t) {
		switch(v[1]) {
		case 3:
			if(t == hxsl_VecType.VFloat) return 1; else throw new js__$Boot_HaxeError(hxsl_Tools.toString(v) + " size unknown for type " + Std.string(t));
			break;
		case 5:
			var t2 = v[3];
			var n = v[2];
			if(t == t2) return n; else throw new js__$Boot_HaxeError(hxsl_Tools.toString(v) + " size unknown for type " + Std.string(t));
			break;
		case 7:
			if(t == hxsl_VecType.VFloat) return 16; else throw new js__$Boot_HaxeError(hxsl_Tools.toString(v) + " size unknown for type " + Std.string(t));
			break;
		case 6:
			if(t == hxsl_VecType.VFloat) return 12; else throw new js__$Boot_HaxeError(hxsl_Tools.toString(v) + " size unknown for type " + Std.string(t));
			break;
		case 8:
			if(t == hxsl_VecType.VFloat) return 12; else throw new js__$Boot_HaxeError(hxsl_Tools.toString(v) + " size unknown for type " + Std.string(t));
			break;
		case 14:
			switch(v[3][1]) {
			case 0:
				var at = v[2];
				var n1 = v[3][2];
				return this.varSize(at,t) * n1;
			default:
				throw new js__$Boot_HaxeError(hxsl_Tools.toString(v) + " size unknown for type " + Std.string(t));
			}
			break;
		default:
			throw new js__$Boot_HaxeError(hxsl_Tools.toString(v) + " size unknown for type " + Std.string(t));
		}
	}
	,gatherVar: function(v) {
		{
			var _g = v.type;
			switch(_g[1]) {
			case 12:
				var vl = _g[2];
				var _g1 = 0;
				while(_g1 < vl.length) {
					var v1 = vl[_g1];
					++_g1;
					this.gatherVar(v1);
				}
				break;
			default:
				var _g11 = v.kind;
				switch(_g11[1]) {
				case 0:
					if(hxsl_Tools.hasQualifier(v,hxsl_VarQualifier.PerObject)) this.params.push(v); else this.globals.push(v);
					break;
				case 2:
					this.params.push(v);
					break;
				default:
					this.outVars.push(v);
				}
			}
		}
	}
	,__class__: hxsl_Flatten
};
var hxsl_Globals = function() {
	this.map = new haxe_ds_IntMap();
};
$hxClasses["hxsl.Globals"] = hxsl_Globals;
hxsl_Globals.__name__ = ["hxsl","Globals"];
hxsl_Globals.allocID = function(path) {
	if(hxsl_Globals.MAP == null) {
		hxsl_Globals.MAP = new haxe_ds_StringMap();
		hxsl_Globals.ALL = [];
	}
	var id = hxsl_Globals.MAP.get(path);
	if(id == null) {
		id = hxsl_Globals.ALL.length;
		hxsl_Globals.ALL.push(path);
		hxsl_Globals.MAP.set(path,id);
	}
	return id;
};
hxsl_Globals.prototype = {
	set: function(path,v) {
		var key = hxsl_Globals.allocID(path);
		var value = v;
		this.map.set(key,value);
	}
	,fastSet: function(id,v) {
		var value = v;
		this.map.set(id,value);
	}
	,__class__: hxsl_Globals
};
var js_Boot = function() { };
$hxClasses["js.Boot"] = js_Boot;
js_Boot.__name__ = ["js","Boot"];
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else {
		var cl = o.__class__;
		if(cl != null) return cl;
		var name = js_Boot.__nativeClassName(o);
		if(name != null) return js_Boot.__resolveNativeClass(name);
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js_Boot.__interfLoop(js_Boot.getClass(o),cl)) return true;
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(o instanceof cl) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") return null;
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	return $global[name];
};
var hxsl_GlslOut = function() {
	this.exprIds = 0;
	this.varNames = new haxe_ds_IntMap();
	this.allNames = new haxe_ds_StringMap();
	this.flipY = true;
};
$hxClasses["hxsl.GlslOut"] = hxsl_GlslOut;
hxsl_GlslOut.__name__ = ["hxsl","GlslOut"];
hxsl_GlslOut.prototype = {
	add: function(v) {
		this.buf.add(v);
	}
	,decl: function(s) {
		var _g = 0;
		var _g1 = this.decls;
		while(_g < _g1.length) {
			var d = _g1[_g];
			++_g;
			if(d == s) return;
		}
		this.decls.push(s);
	}
	,addType: function(t) {
		switch(t[1]) {
		case 0:
			this.buf.add("void");
			break;
		case 1:
			this.buf.add("int");
			break;
		case 9:
			var n = t[2];
			this.buf.add("vec");
			this.buf.add(n);
			break;
		case 2:
			this.buf.add("bool");
			break;
		case 3:
			this.buf.add("float");
			break;
		case 4:
			this.buf.add("string");
			break;
		case 5:
			var k = t[3];
			var size = t[2];
			switch(k[1]) {
			case 1:
				break;
			case 0:
				this.buf.add("i");
				break;
			case 2:
				this.buf.add("b");
				break;
			}
			this.buf.add("vec");
			this.buf.add(size);
			break;
		case 6:
			this.buf.add("mat3");
			break;
		case 7:
			this.buf.add("mat4");
			break;
		case 8:
			this.decl(hxsl_GlslOut.MAT34);
			this.buf.add("mat3x4");
			break;
		case 10:
			this.buf.add("sampler2D");
			break;
		case 11:
			this.buf.add("samplerCube");
			break;
		case 12:
			var vl = t[2];
			this.buf.add("struct { ");
			var _g = 0;
			while(_g < vl.length) {
				var v = vl[_g];
				++_g;
				this.addVar(v);
				this.buf.add(";");
			}
			this.buf.add(" }");
			break;
		case 13:
			this.buf.add("function");
			break;
		case 14:
			var size1 = t[3];
			var t1 = t[2];
			this.addType(t1);
			this.buf.add("[");
			switch(size1[1]) {
			case 1:
				var v1 = size1[2];
				this.add(this.varName(v1));
				break;
			case 0:
				var v2 = size1[2];
				this.buf.add(v2);
				break;
			}
			this.buf.add("]");
			break;
		}
	}
	,addVar: function(v) {
		{
			var _g = v.type;
			switch(_g[1]) {
			case 14:
				var size = _g[3];
				var t = _g[2];
				var old = v.type;
				v.type = t;
				this.addVar(v);
				v.type = old;
				this.buf.add("[");
				switch(size[1]) {
				case 1:
					var v1 = size[2];
					this.add(this.varName(v1));
					break;
				case 0:
					var n = size[2];
					this.buf.add(n);
					break;
				}
				this.buf.add("]");
				break;
			default:
				this.addType(v.type);
				this.buf.add(" ");
				this.add(this.varName(v));
			}
		}
	}
	,addValue: function(e,tabs) {
		{
			var _g = e.e;
			switch(_g[1]) {
			case 4:
				var el = _g[2];
				var name = "val" + this.exprIds++;
				var tmp = this.buf;
				this.buf = new StringBuf();
				this.addType(e.t);
				this.buf.add(" ");
				this.buf.add(name);
				this.buf.add("(void)");
				var el2 = el.slice();
				var last = el2[el2.length - 1];
				el2[el2.length - 1] = { e : hxsl_TExprDef.TReturn(last), t : e.t, p : last.p};
				var e2 = { t : hxsl_Type.TVoid, e : hxsl_TExprDef.TBlock(el2), p : e.p};
				this.addExpr(e2,"");
				this.exprValues.push(this.buf.b);
				this.buf = tmp;
				this.buf.add(name);
				this.buf.add("()");
				break;
			default:
				this.addExpr(e,tabs);
			}
		}
	}
	,addExpr: function(e,tabs) {
		{
			var _g = e.e;
			switch(_g[1]) {
			case 0:
				var c = _g[2];
				switch(c[1]) {
				case 2:
					var v = c[2];
					this.buf.add(v);
					break;
				case 3:
					var f = c[2];
					var str = "" + f;
					this.buf.add(str);
					if(str.indexOf(".") == -1 && str.indexOf("e") == -1) this.buf.add(".");
					break;
				case 4:
					var v1 = c[2];
					this.buf.add("\"" + v1 + "\"");
					break;
				case 0:
					this.buf.add("null");
					break;
				case 1:
					var b = c[2];
					this.buf.add(b);
					break;
				}
				break;
			case 1:
				var v2 = _g[2];
				this.add(this.varName(v2));
				break;
			case 2:
				var g = _g[2];
				switch(g[1]) {
				case 50:
					this.decl(hxsl_GlslOut.MAT34);
					break;
				case 56:case 57:case 58:
					this.decl("#extension GL_OES_standard_derivatives:enable");
					break;
				case 52:
					this.decl("vec4 pack( float v ) { vec4 color = fract(v * vec4(1, 255, 255.*255., 255.*255.*255.)); return color - color.yzww * vec4(1. / 255., 1. / 255., 1. / 255., 0.); }");
					break;
				case 53:
					this.decl("float unpack( vec4 color ) { return dot(color,vec4(1., 1. / 255., 1. / (255. * 255.), 1. / (255. * 255. * 255.))); }");
					break;
				case 54:
					this.decl("vec4 packNormal( vec3 v ) { return vec4((v + vec3(1.)) * vec3(0.5),1.); }");
					break;
				case 55:
					this.decl("vec3 unpackNormal( vec4 v ) { return normalize((v.xyz - vec3(0.5)) * vec3(2.)); }");
					break;
				case 33:
					this.decl("vec4 _texture2D( sampler2D t, vec2 v ) { return texture2D(t,vec2(v.x," + (this.flipY?"0.999999-v.y":"v.y") + ")); }");
					break;
				default:
				}
				this.add(hxsl_GlslOut.GLOBALS.get(g));
				break;
			case 3:
				var e1 = _g[2];
				this.buf.add("(");
				this.addValue(e1,tabs);
				this.buf.add(")");
				break;
			case 4:
				var el = _g[2];
				this.buf.add("{\n");
				var t2 = tabs + "\t";
				var _g1 = 0;
				while(_g1 < el.length) {
					var e2 = el[_g1];
					++_g1;
					this.buf.add(t2);
					this.addExpr(e2,t2);
					this.buf.add(";\n");
				}
				this.buf.add(tabs);
				this.buf.add("}");
				break;
			case 5:
				var e21 = _g[4];
				var e11 = _g[3];
				var op = _g[2];
				{
					var _g11 = e11.t;
					var _g2 = e21.t;
					switch(op[1]) {
					case 1:
						switch(_g11[1]) {
						case 5:
							switch(_g11[2]) {
							case 3:
								switch(_g11[3][1]) {
								case 1:
									switch(_g2[1]) {
									case 8:
										this.decl(hxsl_GlslOut.MAT34);
										this.decl("vec3 m3x4mult( vec3 v, mat3x4 m) { vec4 ve = vec4(v,1.0); return vec3(dot(m.a,ve),dot(m.b,ve),dot(m.c,ve)); }");
										this.buf.add("m3x4mult(");
										this.addValue(e11,tabs);
										this.buf.add(",");
										this.addValue(e21,tabs);
										this.buf.add(")");
										break;
									default:
										this.addValue(e11,tabs);
										this.buf.add(" ");
										this.add(hxsl_Printer.opStr(op));
										this.buf.add(" ");
										this.addValue(e21,tabs);
									}
									break;
								default:
									this.addValue(e11,tabs);
									this.buf.add(" ");
									this.add(hxsl_Printer.opStr(op));
									this.buf.add(" ");
									this.addValue(e21,tabs);
								}
								break;
							default:
								this.addValue(e11,tabs);
								this.buf.add(" ");
								this.add(hxsl_Printer.opStr(op));
								this.buf.add(" ");
								this.addValue(e21,tabs);
							}
							break;
						default:
							this.addValue(e11,tabs);
							this.buf.add(" ");
							this.add(hxsl_Printer.opStr(op));
							this.buf.add(" ");
							this.addValue(e21,tabs);
						}
						break;
					case 19:
						this.buf.add("mod(");
						this.addValue(e11,tabs);
						this.buf.add(",");
						this.addValue(e21,tabs);
						this.buf.add(")");
						break;
					default:
						this.addValue(e11,tabs);
						this.buf.add(" ");
						this.add(hxsl_Printer.opStr(op));
						this.buf.add(" ");
						this.addValue(e21,tabs);
					}
				}
				break;
			case 6:
				var e12 = _g[3];
				var op1 = _g[2];
				this.buf.add((function($this) {
					var $r;
					switch(op1[1]) {
					case 2:
						$r = "!";
						break;
					case 3:
						$r = "-";
						break;
					case 0:
						$r = "++";
						break;
					case 1:
						$r = "--";
						break;
					case 4:
						$r = "~";
						break;
					}
					return $r;
				}(this)));
				this.addValue(e12,tabs);
				break;
			case 7:
				var init = _g[3];
				var v3 = _g[2];
				this.locals.h[v3.id] = v3;
				if(init != null) {
					this.add(this.varName(v3));
					this.buf.add(" = ");
					this.addValue(init,tabs);
				} else this.buf.add("/*var*/");
				break;
			case 8:
				var e3 = _g[2];
				switch(_g[2].e[1]) {
				case 2:
					switch(_g[2].e[2][1]) {
					case 48:
						var args = _g[3];
						switch(_g[3].length) {
						case 1:
							var e4 = _g[3][0];
							if(e4.t == hxsl_Type.TMat3x4) {
								this.decl("mat3 _mat3( mat3x4 v ) { return mat3(v.a.xyz,v.b.xyz,v.c.xyz); }");
								this.buf.add("_mat3(");
								this.addValue(e4,tabs);
								this.buf.add(")");
							} else {
								this.addValue(e3,tabs);
								this.buf.add("(");
								var first = true;
								var _g12 = 0;
								while(_g12 < args.length) {
									var e5 = args[_g12];
									++_g12;
									if(first) first = false; else this.buf.add(", ");
									this.addValue(e5,tabs);
								}
								this.buf.add(")");
							}
							break;
						default:
							this.addValue(e3,tabs);
							this.buf.add("(");
							var first1 = true;
							var _g13 = 0;
							while(_g13 < args.length) {
								var e6 = args[_g13];
								++_g13;
								if(first1) first1 = false; else this.buf.add(", ");
								this.addValue(e6,tabs);
							}
							this.buf.add(")");
						}
						break;
					case 51:
						var args1 = _g[3];
						switch(_g[3].length) {
						case 1:
							var e7 = _g[3][0];
							this.buf.add("clamp(");
							this.addValue(e7,tabs);
							this.buf.add(", 0., 1.)");
							break;
						default:
							this.addValue(e3,tabs);
							this.buf.add("(");
							var first2 = true;
							var _g14 = 0;
							while(_g14 < args1.length) {
								var e8 = args1[_g14];
								++_g14;
								if(first2) first2 = false; else this.buf.add(", ");
								this.addValue(e8,tabs);
							}
							this.buf.add(")");
						}
						break;
					default:
						var args2 = _g[3];
						this.addValue(e3,tabs);
						this.buf.add("(");
						var first3 = true;
						var _g15 = 0;
						while(_g15 < args2.length) {
							var e9 = args2[_g15];
							++_g15;
							if(first3) first3 = false; else this.buf.add(", ");
							this.addValue(e9,tabs);
						}
						this.buf.add(")");
					}
					break;
				default:
					var args3 = _g[3];
					this.addValue(e3,tabs);
					this.buf.add("(");
					var first4 = true;
					var _g16 = 0;
					while(_g16 < args3.length) {
						var e10 = args3[_g16];
						++_g16;
						if(first4) first4 = false; else this.buf.add(", ");
						this.addValue(e10,tabs);
					}
					this.buf.add(")");
				}
				break;
			case 9:
				var regs = _g[3];
				var e13 = _g[2];
				var _g17 = e13.t;
				switch(_g17[1]) {
				case 3:
					var _g21 = 0;
					while(_g21 < regs.length) {
						var r = regs[_g21];
						++_g21;
						if(r != hxsl_Component.X) throw new js__$Boot_HaxeError("assert");
					}
					var _g22 = regs.length;
					switch(_g22) {
					case 1:
						this.addValue(e13,tabs);
						break;
					case 2:
						this.decl("vec2 _vec2( float v ) { return vec2(v,v); }");
						this.buf.add("_vec2(");
						this.addValue(e13,tabs);
						this.buf.add(")");
						break;
					case 3:
						this.decl("vec3 _vec3( float v ) { return vec3(v,v,v); }");
						this.buf.add("_vec3(");
						this.addValue(e13,tabs);
						this.buf.add(")");
						break;
					case 4:
						this.decl("vec4 _vec4( float v ) { return vec4(v,v,v,v); }");
						this.buf.add("_vec4(");
						this.addValue(e13,tabs);
						this.buf.add(")");
						break;
					default:
						throw new js__$Boot_HaxeError("assert");
					}
					break;
				default:
					this.addValue(e13,tabs);
					this.buf.add(".");
					var _g23 = 0;
					while(_g23 < regs.length) {
						var r1 = regs[_g23];
						++_g23;
						this.buf.add((function($this) {
							var $r;
							switch(r1[1]) {
							case 0:
								$r = "x";
								break;
							case 1:
								$r = "y";
								break;
							case 2:
								$r = "z";
								break;
							case 3:
								$r = "w";
								break;
							}
							return $r;
						}(this)));
					}
				}
				break;
			case 10:
				var eelse = _g[4];
				var eif = _g[3];
				var econd = _g[2];
				this.buf.add("if( ");
				this.addValue(econd,tabs);
				this.buf.add(") ");
				this.addExpr(eif,tabs);
				if(eelse != null) {
					this.buf.add(" else ");
					this.addExpr(eelse,tabs);
				}
				break;
			case 11:
				this.buf.add("discard");
				break;
			case 12:
				var e14 = _g[2];
				if(e14 == null) this.buf.add("return"); else {
					this.buf.add("return ");
					this.addValue(e14,tabs);
				}
				break;
			case 13:
				var loop = _g[4];
				var it = _g[3];
				var v4 = _g[2];
				this.buf.add("for(...)");
				break;
			case 14:
				this.buf.add("continue");
				break;
			case 15:
				this.buf.add("break");
				break;
			case 16:
				var index = _g[3];
				var e15 = _g[2];
				this.addValue(e15,tabs);
				this.buf.add("[");
				this.addValue(index,tabs);
				this.buf.add("]");
				break;
			case 17:
				var el1 = _g[2];
				this.buf.add("[");
				var first5 = true;
				var _g18 = 0;
				while(_g18 < el1.length) {
					var e16 = el1[_g18];
					++_g18;
					if(first5) first5 = false; else this.buf.add(", ");
					this.addValue(e16,tabs);
				}
				this.buf.add("]");
				break;
			}
		}
	}
	,varName: function(v) {
		if(v.kind == hxsl_VarKind.Output) if(this.isVertex) return "gl_Position"; else return "gl_FragColor";
		var n = this.varNames.h[v.id];
		if(n != null) return n;
		n = v.name;
		if(hxsl_GlslOut.KWDS.exists(n)) n = "_" + n;
		if(this.allNames.exists(n)) {
			var k = 2;
			n += "_";
			while(this.allNames.exists(n + k)) k++;
			n += k;
		}
		this.varNames.h[v.id] = n;
		this.allNames.set(n,v.id);
		return n;
	}
	,run: function(s) {
		this.locals = new haxe_ds_IntMap();
		this.decls = [];
		this.buf = new StringBuf();
		this.exprValues = [];
		this.decls.push("#version 100");
		this.decls.push("precision mediump float;");
		if(s.funs.length != 1) throw new js__$Boot_HaxeError("assert");
		var f = s.funs[0];
		this.isVertex = f.kind == hxsl_FunctionKind.Vertex;
		var _g = 0;
		var _g1 = s.vars;
		while(_g < _g1.length) {
			var v = _g1[_g];
			++_g;
			var _g2 = v.kind;
			switch(_g2[1]) {
			case 2:case 0:
				this.buf.add("uniform ");
				break;
			case 1:
				this.buf.add("attribute ");
				break;
			case 3:
				this.buf.add("varying ");
				break;
			case 6:case 5:
				continue;
				break;
			case 4:
				break;
			}
			if(v.qualifiers != null) {
				var _g21 = 0;
				var _g3 = v.qualifiers;
				while(_g21 < _g3.length) {
					var q = _g3[_g21];
					++_g21;
					switch(q[1]) {
					case 6:
						var p = q[2];
						switch(p[1]) {
						case 0:
							this.buf.add("lowp ");
							break;
						case 1:
							this.buf.add("mediump ");
							break;
						case 2:
							this.buf.add("highp ");
							break;
						}
						break;
					default:
					}
				}
			}
			this.addVar(v);
			this.buf.add(";\n");
		}
		this.buf.add("\n");
		var tmp = this.buf;
		this.buf = new StringBuf();
		this.buf.add("void main(void) {\n");
		{
			var _g4 = f.expr.e;
			switch(_g4[1]) {
			case 4:
				var el = _g4[2];
				var _g11 = 0;
				while(_g11 < el.length) {
					var e = el[_g11];
					++_g11;
					this.buf.add("\t");
					this.addExpr(e,"\t");
					this.buf.add(";\n");
				}
				break;
			default:
				this.addExpr(f.expr,"");
			}
		}
		this.buf.add("}");
		this.exprValues.push(this.buf.b);
		this.buf = tmp;
		var $it0 = this.locals.iterator();
		while( $it0.hasNext() ) {
			var v1 = $it0.next();
			this.addVar(v1);
			this.buf.add(";\n");
		}
		this.buf.add("\n");
		var _g5 = 0;
		var _g12 = this.exprValues;
		while(_g5 < _g12.length) {
			var e1 = _g12[_g5];
			++_g5;
			this.buf.add(e1);
			this.buf.add("\n\n");
		}
		this.decls.push(this.buf.b);
		this.buf = null;
		return this.decls.join("\n");
	}
	,__class__: hxsl_GlslOut
};
var hxsl__$Linker_AllocatedVar = function() {
};
$hxClasses["hxsl._Linker.AllocatedVar"] = hxsl__$Linker_AllocatedVar;
hxsl__$Linker_AllocatedVar.__name__ = ["hxsl","_Linker","AllocatedVar"];
hxsl__$Linker_AllocatedVar.prototype = {
	__class__: hxsl__$Linker_AllocatedVar
};
var hxsl__$Linker_ShaderInfos = function(n,v) {
	this.name = n;
	this.vertex = v;
	this.processed = new haxe_ds_IntMap();
	this.usedFunctions = [];
	this.read = new haxe_ds_IntMap();
	this.write = new haxe_ds_IntMap();
};
$hxClasses["hxsl._Linker.ShaderInfos"] = hxsl__$Linker_ShaderInfos;
hxsl__$Linker_ShaderInfos.__name__ = ["hxsl","_Linker","ShaderInfos"];
hxsl__$Linker_ShaderInfos.prototype = {
	__class__: hxsl__$Linker_ShaderInfos
};
var hxsl_Linker = function() {
	this.debugDepth = 0;
};
$hxClasses["hxsl.Linker"] = hxsl_Linker;
hxsl_Linker.__name__ = ["hxsl","Linker"];
hxsl_Linker.prototype = {
	error: function(msg,p) {
		return hxsl_Error.t(msg,p);
	}
	,mergeVar: function(path,v,v2,p) {
		var _g = v.kind;
		switch(_g[1]) {
		case 0:case 1:case 3:case 4:case 5:
			break;
		case 2:case 6:
			throw new js__$Boot_HaxeError("assert");
			break;
		}
		if(v.kind != v2.kind && v.kind != hxsl_VarKind.Local && v2.kind != hxsl_VarKind.Local) this.error("'" + path + "' kind does not match : " + Std.string(v.kind) + " should be " + Std.string(v2.kind),p);
		{
			var _g1 = v.type;
			var _g11 = v2.type;
			switch(_g1[1]) {
			case 12:
				switch(_g11[1]) {
				case 12:
					var fl1 = _g1[2];
					var fl2 = _g11[2];
					var _g2 = 0;
					while(_g2 < fl1.length) {
						var f1 = fl1[_g2];
						++_g2;
						var ft = null;
						var _g3 = 0;
						while(_g3 < fl2.length) {
							var f2 = fl2[_g3];
							++_g3;
							if(f1.name == f2.name) {
								ft = f2;
								break;
							}
						}
						if(ft == null) fl2.push(this.allocVar(f1,p).v); else this.mergeVar(path + "." + ft.name,f1,ft,p);
					}
					break;
				default:
					if(!Type.enumEq(v.type,v2.type)) this.error("'" + path + "' type does not match : " + hxsl_Tools.toString(v.type) + " should be " + hxsl_Tools.toString(v2.type),p);
				}
				break;
			default:
				if(!Type.enumEq(v.type,v2.type)) this.error("'" + path + "' type does not match : " + hxsl_Tools.toString(v.type) + " should be " + hxsl_Tools.toString(v2.type),p);
			}
		}
	}
	,allocVar: function(v,p,path,parent) {
		if(v.parent != null && parent == null) {
			parent = this.allocVar(v.parent,p);
			var p1 = parent.v;
			path = p1.name;
			p1 = p1.parent;
			while(p1 != null) {
				path = p1.name + "." + path;
				p1 = p1.parent;
			}
		}
		var key;
		if(path == null) key = v.name; else key = path + "." + v.name;
		if(v.qualifiers != null) {
			var _g = 0;
			var _g1 = v.qualifiers;
			while(_g < _g1.length) {
				var q = _g1[_g];
				++_g;
				switch(q[1]) {
				case 4:
					var n = q[2];
					key = n;
					break;
				default:
				}
			}
		}
		var v2 = this.varMap.get(key);
		var vname = v.name;
		if(v2 != null) {
			var _g2 = 0;
			var _g11 = v2.merged;
			while(_g2 < _g11.length) {
				var vm = _g11[_g2];
				++_g2;
				if(vm == v) return v2;
			}
			if(v.kind == hxsl_VarKind.Param && !hxsl_Tools.hasQualifier(v,hxsl_VarQualifier.Shared) || v.kind == hxsl_VarKind.Function || v.kind == hxsl_VarKind.Var && hxsl_Tools.hasQualifier(v,hxsl_VarQualifier.Private) || (function($this) {
				var $r;
				var v1 = v2.v;
				$r = v1.kind == hxsl_VarKind.Param && !hxsl_Tools.hasQualifier(v1,hxsl_VarQualifier.Shared) || v1.kind == hxsl_VarKind.Function || v1.kind == hxsl_VarKind.Var && hxsl_Tools.hasQualifier(v1,hxsl_VarQualifier.Private);
				return $r;
			}(this)) || v.kind == hxsl_VarKind.Param && v2.v.kind == hxsl_VarKind.Param) {
				var k = 2;
				while(true) {
					var a1 = this.varMap.get(key + k);
					if(a1 == null) break;
					var _g3 = 0;
					var _g12 = a1.merged;
					while(_g3 < _g12.length) {
						var vm1 = _g12[_g3];
						++_g3;
						if(vm1 == v) return a1;
					}
					k++;
				}
				vname += k;
				key += k;
			} else {
				v2.merged.push(v);
				this.mergeVar(key,v,v2.v,p);
				this.varIdMap.h[v.id] = v2.id;
				return v2;
			}
		}
		var vid = this.allVars.length + 1;
		var v21 = { id : vid, name : vname, type : v.type, kind : v.kind == hxsl_VarKind.Output?hxsl_VarKind.Local:v.kind, qualifiers : v.qualifiers, parent : parent == null?null:parent.v};
		var a = new hxsl__$Linker_AllocatedVar();
		a.v = v21;
		a.merged = [v];
		a.path = key;
		a.id = vid;
		a.parent = parent;
		a.instanceIndex = this.curInstance;
		this.allVars.push(a);
		this.varMap.set(key,a);
		{
			var _g4 = v21.type;
			switch(_g4[1]) {
			case 12:
				var vl = _g4[2];
				v21.type = hxsl_Type.TStruct((function($this) {
					var $r;
					var _g13 = [];
					{
						var _g21 = 0;
						while(_g21 < vl.length) {
							var v3 = vl[_g21];
							++_g21;
							_g13.push($this.allocVar(v3,p,key,a).v);
						}
					}
					$r = _g13;
					return $r;
				}(this)));
				break;
			default:
			}
		}
		return a;
	}
	,mapExprVar: function(e) {
		{
			var _g = e.e;
			switch(_g[1]) {
			case 1:
				var v = _g[2];
				if(!this.locals.h.hasOwnProperty(v.id)) {
					var v1 = this.allocVar(v,e.p);
					if(this.curShader != null && !this.curShader.write.h.hasOwnProperty(v1.id)) {
						this.curShader.read.h[v1.id] = v1;
						if(this.curShader.vertex == null && v1.v.kind == hxsl_VarKind.Var) this.curShader.vertex = false;
					}
					return { e : hxsl_TExprDef.TVar(v1.v), t : v1.v.type, p : e.p};
				} else {
				}
				break;
			case 5:
				var e2 = _g[4];
				var e1 = _g[3];
				var op = _g[2];
				{
					var _g1 = e1.e;
					switch(op[1]) {
					case 4:
						switch(_g1[1]) {
						case 1:
							var v2 = _g1[2];
							if(!this.locals.h.hasOwnProperty(v2.id)) {
								var e21 = this.mapExprVar(e2);
								var v3 = this.allocVar(v2,e1.p);
								if(this.curShader != null) this.curShader.write.h[v3.id] = v3;
								return { e : hxsl_TExprDef.TBinop(op,{ e : hxsl_TExprDef.TVar(v3.v), t : v3.v.type, p : e.p},e21), t : e.t, p : e.p};
							} else {
								var v4 = _g1[2];
								if(!this.locals.h.hasOwnProperty(v4.id)) {
									var e11 = this.mapExprVar(e1);
									var e22 = this.mapExprVar(e2);
									var v5 = this.allocVar(v4,e11.p);
									if(this.curShader != null) this.curShader.write.h[v5.id] = v5;
									return { e : hxsl_TExprDef.TBinop(op,e11,e22), t : e.t, p : e.p};
								} else {
								}
							}
							break;
						case 9:
							switch(_g1[2].e[1]) {
							case 1:
								var v6 = _g1[2].e[2];
								if(!this.locals.h.hasOwnProperty(v6.id)) {
									var e12 = this.mapExprVar(e1);
									var e23 = this.mapExprVar(e2);
									var v7 = this.allocVar(v6,e12.p);
									if(this.curShader != null) this.curShader.write.h[v7.id] = v7;
									return { e : hxsl_TExprDef.TBinop(op,e12,e23), t : e.t, p : e.p};
								} else {
								}
								break;
							default:
							}
							break;
						default:
						}
						break;
					case 20:
						switch(_g1[1]) {
						case 1:
							var v8 = _g1[2];
							if(!this.locals.h.hasOwnProperty(v8.id)) {
								var e13 = this.mapExprVar(e1);
								var e24 = this.mapExprVar(e2);
								var v9 = this.allocVar(v8,e13.p);
								if(this.curShader != null) this.curShader.write.h[v9.id] = v9;
								return { e : hxsl_TExprDef.TBinop(op,e13,e24), t : e.t, p : e.p};
							} else {
							}
							break;
						case 9:
							switch(_g1[2].e[1]) {
							case 1:
								var v10 = _g1[2].e[2];
								if(!this.locals.h.hasOwnProperty(v10.id)) {
									var e14 = this.mapExprVar(e1);
									var e25 = this.mapExprVar(e2);
									var v11 = this.allocVar(v10,e14.p);
									if(this.curShader != null) this.curShader.write.h[v11.id] = v11;
									return { e : hxsl_TExprDef.TBinop(op,e14,e25), t : e.t, p : e.p};
								} else {
								}
								break;
							default:
							}
							break;
						default:
						}
						break;
					default:
					}
				}
				break;
			case 11:
				if(this.curShader != null) {
					this.curShader.vertex = false;
					this.curShader.hasDiscard = true;
				}
				break;
			case 7:
				var v12 = _g[2];
				this.locals.h[v12.id] = true;
				break;
			default:
			}
		}
		return hxsl_Tools.map(e,$bind(this,this.mapExprVar));
	}
	,addShader: function(name,vertex,e,p) {
		var s = new hxsl__$Linker_ShaderInfos(name,vertex);
		this.curShader = s;
		s.priority = p;
		s.body = this.mapExprVar(e);
		this.shaders.push(s);
		this.curShader = null;
		return s;
	}
	,sortByPriorityDesc: function(s1,s2) {
		return s2.priority - s1.priority;
	}
	,buildDependency: function(s,v,isWritten) {
		var found = !isWritten;
		var _g = 0;
		var _g1 = this.shaders;
		while(_g < _g1.length) {
			var parent = _g1[_g];
			++_g;
			if(parent == s) {
				found = true;
				continue;
			} else if(!found) continue;
			if(!parent.write.h.hasOwnProperty(v.id)) continue;
			if(s.vertex && parent.vertex == false) continue;
			s.deps.set(parent,true);
			this.debugDepth++;
			this.initDependencies(parent);
			this.debugDepth--;
			if(!parent.read.h.hasOwnProperty(v.id)) return;
		}
		if(v.v.kind == hxsl_VarKind.Var) this.error("Variable " + v.path + " required by " + s.name + " is missing initializer",null);
	}
	,initDependencies: function(s) {
		if(s.deps != null) return;
		s.deps = new haxe_ds_ObjectMap();
		var $it0 = s.read.iterator();
		while( $it0.hasNext() ) {
			var r = $it0.next();
			this.buildDependency(s,r,s.write.h.hasOwnProperty(r.id));
		}
		if(s.vertex == null) {
			var $it1 = s.deps.keys();
			while( $it1.hasNext() ) {
				var d = $it1.next();
				if(d.vertex == false) {
					s.vertex = false;
					break;
				}
			}
		}
		if(s.vertex) {
			var $it2 = s.deps.keys();
			while( $it2.hasNext() ) {
				var d1 = $it2.next();
				if(d1.vertex == null) d1.vertex = true;
			}
		}
	}
	,collect: function(cur,out,vertex) {
		if(cur.onStack) this.error("Loop in shader dependencies (" + cur.name + ")",null);
		if(cur.marked == vertex) return;
		cur.marked = vertex;
		cur.onStack = true;
		var deps;
		var _g = [];
		var $it0 = cur.deps.keys();
		while( $it0.hasNext() ) {
			var d = $it0.next();
			_g.push(d);
		}
		deps = _g;
		deps.sort($bind(this,this.sortByPriorityDesc));
		var _g1 = 0;
		while(_g1 < deps.length) {
			var d1 = deps[_g1];
			++_g1;
			this.collect(d1,out,vertex);
		}
		if(cur.vertex == null) cur.vertex = vertex;
		if(cur.vertex == vertex) out.push(cur);
		cur.onStack = false;
	}
	,uniqueLocals: function(expr,locals) {
		{
			var _g = expr.e;
			switch(_g[1]) {
			case 7:
				var v = _g[2];
				if(locals.exists(v.name)) {
					var k = 2;
					while(locals.exists(v.name + k)) k++;
					v.name += k;
				}
				locals.set(v.name,true);
				break;
			case 4:
				var el = _g[2];
				var locals1;
				var _g1 = new haxe_ds_StringMap();
				var $it0 = locals.keys();
				while( $it0.hasNext() ) {
					var k1 = $it0.next();
					if(__map_reserved[k1] != null) _g1.setReserved(k1,true); else _g1.h[k1] = true;
				}
				locals1 = _g1;
				var _g2 = 0;
				while(_g2 < el.length) {
					var e = el[_g2];
					++_g2;
					this.uniqueLocals(e,locals1);
				}
				break;
			default:
				hxsl_Tools.iter(expr,(function(f,a2) {
					return function(a1) {
						f(a1,a2);
					};
				})($bind(this,this.uniqueLocals),locals));
			}
		}
	}
	,link: function(shadersData,outVars) {
		var _g1 = this;
		this.varMap = new haxe_ds_StringMap();
		this.varIdMap = new haxe_ds_IntMap();
		this.allVars = [];
		this.shaders = [];
		this.locals = new haxe_ds_IntMap();
		var dupShaders = new haxe_ds_ObjectMap();
		var _g = [];
		var _g12 = 0;
		while(_g12 < shadersData.length) {
			var s1 = shadersData[_g12];
			++_g12;
			_g.push((function($this) {
				var $r;
				var s2 = s1;
				var sreal = s2;
				if(dupShaders.h.__keys__[s2.__id__] != null) s2 = hxsl_Clone.shaderData(s2);
				dupShaders.set(s2,sreal);
				$r = s2;
				return $r;
			}(this)));
		}
		shadersData = _g;
		this.curInstance = 0;
		var _g13 = 0;
		while(_g13 < shadersData.length) {
			var s3 = shadersData[_g13];
			++_g13;
			var _g21 = 0;
			var _g31 = s3.vars;
			while(_g21 < _g31.length) {
				var v2 = _g31[_g21];
				++_g21;
				this.allocVar(v2,null);
			}
			var _g22 = 0;
			var _g32 = s3.funs;
			while(_g22 < _g32.length) {
				var f1 = _g32[_g22];
				++_g22;
				var v3 = this.allocVar(f1.ref,f1.expr.p);
				v3.kind = f1.kind;
			}
			this.curInstance++;
		}
		var priority = 0;
		var _g14 = 0;
		while(_g14 < shadersData.length) {
			var s4 = shadersData[_g14];
			++_g14;
			var _g23 = 0;
			var _g33 = s4.funs;
			while(_g23 < _g33.length) {
				var f2 = _g33[_g23];
				++_g23;
				var v4 = this.allocVar(f2.ref,f2.expr.p);
				if(v4.kind == null) throw new js__$Boot_HaxeError("assert");
				var _g4 = v4.kind;
				if(_g4 != null) switch(_g4[1]) {
				case 0:case 1:
					this.addShader(s4.name + "." + (v4.kind == hxsl_FunctionKind.Vertex?"vertex":"fragment"),v4.kind == hxsl_FunctionKind.Vertex,f2.expr,priority);
					break;
				case 2:
					var status;
					var _g5 = f2.ref.name;
					switch(_g5) {
					case "__init__vertex":
						status = true;
						break;
					case "__init__fragment":
						status = false;
						break;
					default:
						status = null;
					}
					{
						var _g51 = f2.expr.e;
						switch(_g51[1]) {
						case 4:
							var el1 = _g51[2];
							var index = 0;
							var priority1 = -el1.length;
							var _g6 = 0;
							while(_g6 < el1.length) {
								var e1 = el1[_g6];
								++_g6;
								this.addShader(s4.name + "." + f2.ref.name + index++,status,e1,priority1++);
							}
							break;
						default:
							this.addShader(s4.name + "." + f2.ref.name,status,f2.expr,-1);
						}
					}
					break;
				case 3:
					throw new js__$Boot_HaxeError("Unexpected helper function in linker " + v4.v.name);
					break;
				}
			}
			priority++;
		}
		this.shaders.sort($bind(this,this.sortByPriorityDesc));
		var entry = new hxsl__$Linker_ShaderInfos("<entry>",false);
		entry.deps = new haxe_ds_ObjectMap();
		var _g15 = 0;
		while(_g15 < outVars.length) {
			var outVar = outVars[_g15];
			++_g15;
			var v5 = this.varMap.get(outVar);
			if(v5 == null) throw new js__$Boot_HaxeError("Variable not found " + outVar);
			v5.v.kind = hxsl_VarKind.Output;
			this.buildDependency(entry,v5,false);
		}
		var _g16 = 0;
		var _g24 = this.shaders;
		while(_g16 < _g24.length) {
			var s5 = _g24[_g16];
			++_g16;
			if(s5.hasDiscard) {
				this.initDependencies(s5);
				entry.deps.set(s5,true);
			}
		}
		var _g17 = 0;
		var _g25 = this.shaders;
		while(_g17 < _g25.length) {
			var s6 = _g25[_g17];
			++_g17;
			if(s6.vertex != null) continue;
			var onlyParams = true;
			var $it0 = s6.read.iterator();
			while( $it0.hasNext() ) {
				var r = $it0.next();
				if(r.v.kind != hxsl_VarKind.Param) {
					onlyParams = false;
					break;
				}
			}
			if(onlyParams) s6.vertex = false;
		}
		var v = [];
		var f = [];
		this.collect(entry,v,true);
		this.collect(entry,f,false);
		if(f.pop() != entry) throw new js__$Boot_HaxeError("assert");
		var _g18 = 0;
		var _g26 = this.shaders;
		while(_g18 < _g26.length) {
			var s7 = _g26[_g18];
			++_g18;
			s7.marked = null;
		}
		var _g19 = 0;
		var _g27 = v.concat(f);
		while(_g19 < _g27.length) {
			var s8 = _g27[_g19];
			++_g19;
			var $it1 = s8.deps.keys();
			while( $it1.hasNext() ) {
				var d = $it1.next();
				if(d.marked == null) this.error(d.name + " needed by " + s8.name + " is unreachable",null);
			}
			s8.marked = true;
		}
		var outVars1 = [];
		var varMap = new haxe_ds_IntMap();
		var addVar;
		var addVar1 = null;
		addVar1 = function(v6) {
			if(varMap.h.hasOwnProperty(v6.id)) return;
			varMap.h[v6.id] = true;
			if(v6.v.parent != null) addVar1(v6.parent); else outVars1.push(v6.v);
		};
		addVar = addVar1;
		var _g110 = 0;
		var _g28 = v.concat(f);
		while(_g110 < _g28.length) {
			var s9 = _g28[_g110];
			++_g110;
			var $it2 = s9.read.iterator();
			while( $it2.hasNext() ) {
				var v7 = $it2.next();
				addVar(v7);
			}
			var $it3 = s9.write.iterator();
			while( $it3.hasNext() ) {
				var v8 = $it3.next();
				addVar(v8);
			}
		}
		var cleanVar;
		var cleanVar1 = null;
		cleanVar1 = function(v9) {
			{
				var _g111 = v9.type;
				switch(_g111[1]) {
				case 12:
					var vl = _g111[2];
					if(v9.kind != hxsl_VarKind.Input) {
						var vout = [];
						var _g29 = 0;
						while(_g29 < vl.length) {
							var v10 = vl[_g29];
							++_g29;
							if(varMap.h.hasOwnProperty(v10.id)) {
								cleanVar1(v10);
								vout.push(v10);
							}
						}
						v9.type = hxsl_Type.TStruct(vout);
					} else {
					}
					break;
				default:
				}
			}
		};
		cleanVar = cleanVar1;
		var _g112 = 0;
		while(_g112 < outVars1.length) {
			var v11 = outVars1[_g112];
			++_g112;
			cleanVar(v11);
		}
		var build = function(kind,name,a) {
			var v1 = { id : hxsl_Tools.allocVarId(), name : name, type : hxsl_Type.TFun([{ ret : hxsl_Type.TVoid, args : []}]), kind : hxsl_VarKind.Function};
			outVars1.push(v1);
			var exprs = [];
			var _g11 = 0;
			while(_g11 < a.length) {
				var s = a[_g11];
				++_g11;
				{
					var _g2 = s.body.e;
					switch(_g2[1]) {
					case 4:
						var el = _g2[2];
						var _g3 = 0;
						while(_g3 < el.length) {
							var e = el[_g3];
							++_g3;
							exprs.push(e);
						}
						break;
					default:
						exprs.push(s.body);
					}
				}
			}
			var expr = { e : hxsl_TExprDef.TBlock(exprs), t : hxsl_Type.TVoid, p : exprs.length == 0?null:exprs[0].p};
			_g1.uniqueLocals(expr,new haxe_ds_StringMap());
			return { kind : kind, ref : v1, ret : hxsl_Type.TVoid, args : [], expr : expr};
		};
		var funs = [build(hxsl_FunctionKind.Vertex,"vertex",v),build(hxsl_FunctionKind.Fragment,"fragment",f)];
		var $it4 = dupShaders.keys();
		while( $it4.hasNext() ) {
			var s10 = $it4.next();
			var sreal1 = dupShaders.h[s10.__id__];
			if(s10 == sreal1) continue;
			var _g210 = 0;
			var _g113 = s10.vars.length;
			while(_g210 < _g113) {
				var i = _g210++;
				this.allocVar(s10.vars[i],null).merged.unshift(sreal1.vars[i]);
			}
		}
		return { name : "out", vars : outVars1, funs : funs};
	}
	,__class__: hxsl_Linker
};
var hxsl_Printer = function(varId) {
	if(varId == null) varId = false;
	this.varId = varId;
};
$hxClasses["hxsl.Printer"] = hxsl_Printer;
hxsl_Printer.__name__ = ["hxsl","Printer"];
hxsl_Printer.opStr = function(op) {
	switch(op[1]) {
	case 0:
		return "+";
	case 3:
		return "-";
	case 1:
		return "*";
	case 2:
		return "/";
	case 19:
		return "%";
	case 5:
		return "==";
	case 6:
		return "!=";
	case 7:
		return ">";
	case 9:
		return "<";
	case 8:
		return ">=";
	case 10:
		return "<=";
	case 13:
		return "^";
	case 12:
		return "|";
	case 11:
		return "&";
	case 16:
		return "<<";
	case 17:
		return ">>";
	case 18:
		return ">>>";
	case 14:
		return "&&";
	case 15:
		return "||";
	case 4:
		return "=";
	case 20:
		var op1 = op[2];
		return hxsl_Printer.opStr(op1) + "=";
	case 22:
		return "=>";
	case 21:
		return "...";
	}
};
hxsl_Printer.shaderToString = function(s,varId) {
	if(varId == null) varId = false;
	return new hxsl_Printer(varId).shaderString(s);
};
hxsl_Printer.prototype = {
	add: function(v) {
		this.buffer.add(v);
	}
	,shaderString: function(s) {
		this.buffer = new StringBuf();
		var _g = 0;
		var _g1 = s.vars;
		while(_g < _g1.length) {
			var v = _g1[_g];
			++_g;
			this.addVar(v,hxsl_VarKind.Var);
			this.buffer.add(";\n");
		}
		if(s.vars.length > 0) this.buffer.add("\n");
		var _g2 = 0;
		var _g11 = s.funs;
		while(_g2 < _g11.length) {
			var f = _g11[_g2];
			++_g2;
			this.addFun(f);
			this.buffer.add("\n\n");
		}
		return this.buffer.b;
	}
	,exprString: function(e) {
		this.buffer = new StringBuf();
		this.addExpr(e,"");
		return this.buffer.b;
	}
	,addVar: function(v,defKind,tabs,parent) {
		if(tabs == null) tabs = "";
		if(v.qualifiers != null) {
			var _g = 0;
			var _g1 = v.qualifiers;
			while(_g < _g1.length) {
				var q = _g1[_g];
				++_g;
				this.add("@" + (function($this) {
					var $r;
					switch(q[1]) {
					case 0:
						$r = (function($this) {
							var $r;
							var max = q[2];
							$r = "const" + (max == null?"":"(" + max + ")");
							return $r;
						}($this));
						break;
					case 1:
						$r = "private";
						break;
					case 2:
						$r = "nullable";
						break;
					case 3:
						$r = "perObject";
						break;
					case 4:
						$r = (function($this) {
							var $r;
							var n = q[2];
							$r = "name('" + n + "')";
							return $r;
						}($this));
						break;
					case 5:
						$r = "shared";
						break;
					case 6:
						$r = (function($this) {
							var $r;
							var p = q[2];
							$r = p[0].toLowerCase() + "p";
							return $r;
						}($this));
						break;
					case 7:
						$r = (function($this) {
							var $r;
							var max1 = q[3];
							var min = q[2];
							$r = "range(" + min + "," + max1 + ")";
							return $r;
						}($this));
						break;
					case 8:
						$r = "ignore";
						break;
					}
					return $r;
				}(this)) + " ");
			}
		}
		if(v.kind != defKind) {
			var _g2 = v.kind;
			switch(_g2[1]) {
			case 4:
				this.buffer.add("@local ");
				break;
			case 0:
				this.buffer.add("@global ");
				break;
			case 3:
				this.buffer.add("@var ");
				break;
			case 2:
				this.buffer.add("@param ");
				break;
			case 1:
				this.buffer.add("@input ");
				break;
			case 6:
				this.buffer.add("@function ");
				break;
			case 5:
				this.buffer.add("@output ");
				break;
			}
		}
		this.buffer.add("var ");
		if(v.parent == parent) this.buffer.add(v.name + (this.varId?"@" + v.id:"")); else this.addVarName(v);
		this.buffer.add(" : ");
		{
			var _g3 = v.type;
			switch(_g3[1]) {
			case 12:
				var vl = _g3[2];
				this.buffer.add("{");
				var first = true;
				var _g11 = 0;
				while(_g11 < vl.length) {
					var v1 = vl[_g11];
					++_g11;
					if(first) first = false; else this.buffer.add(", ");
					this.addVar(v1,v1.kind,tabs,v1);
				}
				this.buffer.add("}");
				break;
			default:
				this.add(hxsl_Tools.toString(v.type));
			}
		}
	}
	,addFun: function(f) {
		this.buffer.add("function " + f.ref.name + "(");
		var first = true;
		var _g = 0;
		var _g1 = f.args;
		while(_g < _g1.length) {
			var a = _g1[_g];
			++_g;
			if(first) {
				this.buffer.add(" ");
				first = false;
			} else this.buffer.add(", ");
			this.addVar(a,hxsl_VarKind.Local);
		}
		if(f.args.length > 0) this.buffer.add(" ");
		this.add(") : " + hxsl_Tools.toString(f.ret) + " ");
		this.addExpr(f.expr,"");
	}
	,addVarName: function(v) {
		if(v.parent != null) {
			this.addVarName(v.parent);
			this.buffer.add(".");
		}
		this.buffer.add(v.name);
		if(this.varId) this.buffer.add("@" + v.id);
	}
	,addExpr: function(e,tabs) {
		{
			var _g = e.e;
			switch(_g[1]) {
			case 1:
				var v = _g[2];
				this.addVarName(v);
				break;
			case 7:
				var init = _g[3];
				var v1 = _g[2];
				this.addVar(v1,hxsl_VarKind.Local,tabs);
				if(init != null) {
					this.buffer.add(" = ");
					this.addExpr(init,tabs);
				}
				break;
			case 9:
				var regs = _g[3];
				var e1 = _g[2];
				this.addExpr(e1,tabs);
				this.buffer.add(".");
				var _g1 = 0;
				while(_g1 < regs.length) {
					var r = regs[_g1];
					++_g1;
					this.buffer.add(hxsl_Printer.SWIZ[r[1]]);
				}
				break;
			case 12:
				var e2 = _g[2];
				this.buffer.add("return");
				if(e2 != null) {
					this.buffer.add(" ");
					this.addExpr(e2,tabs);
				}
				break;
			case 10:
				var eelse = _g[4];
				var eif = _g[3];
				var cond = _g[2];
				this.buffer.add("if( ");
				this.addExpr(cond,tabs);
				this.buffer.add(" ) ");
				this.addExpr(eif,tabs);
				if(eelse != null) {
					this.buffer.add(" else ");
					this.addExpr(eelse,tabs);
				}
				break;
			case 2:
				var g = _g[2];
				this.add(hxsl_Tools2.toString(g));
				break;
			case 8:
				var el = _g[3];
				var e3 = _g[2];
				this.addExpr(e3,tabs);
				this.buffer.add("(");
				var first = true;
				var _g11 = 0;
				while(_g11 < el.length) {
					var e4 = el[_g11];
					++_g11;
					if(first) first = false; else this.buffer.add(", ");
					this.addExpr(e4,tabs);
				}
				this.buffer.add(")");
				break;
			case 13:
				var loop = _g[4];
				var it = _g[3];
				var v2 = _g[2];
				this.buffer.add("for( " + v2.name + " in ");
				this.addExpr(it,tabs);
				this.buffer.add(") ");
				this.addExpr(loop,tabs);
				break;
			case 14:
				this.buffer.add("continue");
				break;
			case 15:
				this.buffer.add("break");
				break;
			case 11:
				this.buffer.add("discard");
				break;
			case 4:
				var el1 = _g[2];
				this.buffer.add("{");
				tabs += "\t";
				var _g12 = 0;
				while(_g12 < el1.length) {
					var e5 = el1[_g12];
					++_g12;
					this.buffer.add("\n" + tabs);
					this.addExpr(e5,tabs);
					this.buffer.add(";");
				}
				tabs = HxOverrides.substr(tabs,1,null);
				if(el1.length > 0) this.buffer.add("\n" + tabs);
				this.buffer.add("}");
				break;
			case 6:
				var e6 = _g[3];
				var op = _g[2];
				this.buffer.add((function($this) {
					var $r;
					switch(op[1]) {
					case 2:
						$r = "!";
						break;
					case 3:
						$r = "-";
						break;
					case 4:
						$r = "~";
						break;
					case 0:
						$r = "++";
						break;
					case 1:
						$r = "--";
						break;
					}
					return $r;
				}(this)));
				this.addExpr(e6,tabs);
				break;
			case 5:
				var e21 = _g[4];
				var e11 = _g[3];
				var op1 = _g[2];
				this.addExpr(e11,tabs);
				this.add(" " + hxsl_Printer.opStr(op1) + " ");
				this.addExpr(e21,tabs);
				break;
			case 16:
				var e22 = _g[3];
				var e12 = _g[2];
				this.addExpr(e12,tabs);
				this.buffer.add("[");
				this.addExpr(e22,tabs);
				this.buffer.add("]");
				break;
			case 3:
				var e7 = _g[2];
				this.buffer.add("(");
				this.addExpr(e7,tabs);
				this.buffer.add(")");
				break;
			case 0:
				var c = _g[2];
				this.buffer.add((function($this) {
					var $r;
					switch(c[1]) {
					case 0:
						$r = "null";
						break;
					case 1:
						$r = (function($this) {
							var $r;
							var b = c[2];
							$r = b;
							return $r;
						}($this));
						break;
					case 2:
						$r = (function($this) {
							var $r;
							var i = c[2];
							$r = i;
							return $r;
						}($this));
						break;
					case 3:
						$r = (function($this) {
							var $r;
							var f = c[2];
							$r = f;
							return $r;
						}($this));
						break;
					case 4:
						$r = (function($this) {
							var $r;
							var s = c[2];
							$r = "\"" + s + "\"";
							return $r;
						}($this));
						break;
					}
					return $r;
				}(this)));
				break;
			case 17:
				var el2 = _g[2];
				this.buffer.add("[");
				var first1 = true;
				var _g13 = 0;
				while(_g13 < el2.length) {
					var e8 = el2[_g13];
					++_g13;
					if(first1) first1 = false; else this.buffer.add(", ");
					this.addExpr(e8,tabs);
				}
				this.buffer.add("]");
				break;
			}
		}
	}
	,__class__: hxsl_Printer
};
var hxsl_AllocParam = function(name,pos,instance,index,type) {
	this.name = name;
	this.pos = pos;
	this.instance = instance;
	this.index = index;
	this.type = type;
};
$hxClasses["hxsl.AllocParam"] = hxsl_AllocParam;
hxsl_AllocParam.__name__ = ["hxsl","AllocParam"];
hxsl_AllocParam.prototype = {
	__class__: hxsl_AllocParam
};
var hxsl_AllocGlobal = function(pos,path,type) {
	this.pos = pos;
	this.path = path;
	this.gid = hxsl_Globals.allocID(path);
	this.type = type;
};
$hxClasses["hxsl.AllocGlobal"] = hxsl_AllocGlobal;
hxsl_AllocGlobal.__name__ = ["hxsl","AllocGlobal"];
hxsl_AllocGlobal.prototype = {
	__class__: hxsl_AllocGlobal
};
var hxsl_RuntimeShaderData = function() {
};
$hxClasses["hxsl.RuntimeShaderData"] = hxsl_RuntimeShaderData;
hxsl_RuntimeShaderData.__name__ = ["hxsl","RuntimeShaderData"];
hxsl_RuntimeShaderData.prototype = {
	__class__: hxsl_RuntimeShaderData
};
var hxsl_RuntimeShader = function() {
	this.id = hxsl_RuntimeShader.UID++;
};
$hxClasses["hxsl.RuntimeShader"] = hxsl_RuntimeShader;
hxsl_RuntimeShader.__name__ = ["hxsl","RuntimeShader"];
hxsl_RuntimeShader.prototype = {
	__class__: hxsl_RuntimeShader
};
var hxsl_ShaderList = function(s,n) {
	this.s = s;
	this.next = n;
};
$hxClasses["hxsl.ShaderList"] = hxsl_ShaderList;
hxsl_ShaderList.__name__ = ["hxsl","ShaderList"];
hxsl_ShaderList.prototype = {
	__class__: hxsl_ShaderList
};
var hxsl__$ShaderList_ShaderIterator = function(l,last) {
	this.l = l;
	this.last = last;
};
$hxClasses["hxsl._ShaderList.ShaderIterator"] = hxsl__$ShaderList_ShaderIterator;
hxsl__$ShaderList_ShaderIterator.__name__ = ["hxsl","_ShaderList","ShaderIterator"];
hxsl__$ShaderList_ShaderIterator.prototype = {
	hasNext: function() {
		return this.l != this.last;
	}
	,next: function() {
		var s = this.l.s;
		this.l = this.l.next;
		return s;
	}
	,__class__: hxsl__$ShaderList_ShaderIterator
};
var hxsl_ShaderInstance = function(shader) {
	this.id = hxsl_Tools.allocVarId();
	this.shader = shader;
	this.params = new haxe_ds_IntMap();
};
$hxClasses["hxsl.ShaderInstance"] = hxsl_ShaderInstance;
hxsl_ShaderInstance.__name__ = ["hxsl","ShaderInstance"];
hxsl_ShaderInstance.prototype = {
	__class__: hxsl_ShaderInstance
};
var hxsl_ShaderGlobal = function(v,gid) {
	this.v = v;
	this.globalId = gid;
};
$hxClasses["hxsl.ShaderGlobal"] = hxsl_ShaderGlobal;
hxsl_ShaderGlobal.__name__ = ["hxsl","ShaderGlobal"];
hxsl_ShaderGlobal.prototype = {
	__class__: hxsl_ShaderGlobal
};
var hxsl_ShaderConst = function(v,pos,bits) {
	this.v = v;
	this.pos = pos;
	this.bits = bits;
};
$hxClasses["hxsl.ShaderConst"] = hxsl_ShaderConst;
hxsl_ShaderConst.__name__ = ["hxsl","ShaderConst"];
hxsl_ShaderConst.prototype = {
	__class__: hxsl_ShaderConst
};
var hxsl_SharedShader = function(src) {
	this.instanceCache = new haxe_ds_IntMap();
	this.data = haxe_Unserializer.run(src);
	this.consts = null;
	this.globals = [];
	var _g = 0;
	var _g1 = this.data.vars;
	while(_g < _g1.length) {
		var v = _g1[_g];
		++_g;
		this.browseVar(v);
	}
};
$hxClasses["hxsl.SharedShader"] = hxsl_SharedShader;
hxsl_SharedShader.__name__ = ["hxsl","SharedShader"];
hxsl_SharedShader.prototype = {
	getInstance: function(constBits) {
		var i = this.instanceCache.h[constBits];
		if(i == null) return this.makeInstance(constBits); else return i;
	}
	,makeInstance: function(constBits) {
		var $eval = new hxsl_Eval();
		var c = this.consts;
		while(c != null) {
			$eval.setConstant(c.v,(function($this) {
				var $r;
				var _g = c.v.type;
				$r = (function($this) {
					var $r;
					switch(_g[1]) {
					case 2:
						$r = hxsl_Const.CBool((constBits >>> c.pos & 1) != 0);
						break;
					case 1:
						$r = hxsl_Const.CInt(constBits >>> c.pos & (1 << c.bits) - 1);
						break;
					default:
						$r = (function($this) {
							var $r;
							throw new js__$Boot_HaxeError("assert");
							return $r;
						}($this));
					}
					return $r;
				}($this));
				return $r;
			}(this)));
			c = c.next;
		}
		$eval.inlineCalls = true;
		$eval.unrollLoops = true;
		var i = new hxsl_ShaderInstance($eval["eval"](this.data));
		this.paramsCount = 0;
		var _g1 = 0;
		var _g11 = this.data.vars;
		while(_g1 < _g11.length) {
			var v = _g11[_g1];
			++_g1;
			this.addParam($eval,i,v);
		}
		this.instanceCache.h[constBits] = i;
		return i;
	}
	,addParam: function($eval,i,v) {
		{
			var _g = v.type;
			switch(_g[1]) {
			case 12:
				var vl = _g[2];
				var _g1 = 0;
				while(_g1 < vl.length) {
					var v1 = vl[_g1];
					++_g1;
					this.addParam($eval,i,v1);
				}
				break;
			default:
				if(v.kind == hxsl_VarKind.Param) {
					var key = $eval.varMap.h[v.__id__].id;
					i.params.h[key] = this.paramsCount;
					this.paramsCount++;
				}
			}
		}
	}
	,browseVar: function(v,path) {
		v.id = hxsl_Tools.allocVarId();
		if(path == null) path = hxsl_Tools.getName(v); else path += "." + v.name;
		{
			var _g = v.type;
			switch(_g[1]) {
			case 12:
				var vl = _g[2];
				var _g1 = 0;
				while(_g1 < vl.length) {
					var vs = vl[_g1];
					++_g1;
					this.browseVar(vs,path);
				}
				break;
			default:
				var globalId = 0;
				if(v.kind == hxsl_VarKind.Global) {
					globalId = hxsl_Globals.allocID(path);
					this.globals.push(new hxsl_ShaderGlobal(v,globalId));
				}
				if(!hxsl_Tools.isConst(v)) return;
				var bits = hxsl_Tools.getConstBits(v);
				if(bits > 0) {
					var pos;
					if(this.consts == null) pos = 0; else pos = this.consts.pos + this.consts.bits;
					var c = new hxsl_ShaderConst(v,pos,bits);
					c.globalId = globalId;
					c.next = this.consts;
					this.consts = c;
				}
			}
		}
	}
	,__class__: hxsl_SharedShader
};
var hxsl__$Splitter_VarProps = function(v) {
	this.v = v;
	this.read = 0;
	this.write = 0;
};
$hxClasses["hxsl._Splitter.VarProps"] = hxsl__$Splitter_VarProps;
hxsl__$Splitter_VarProps.__name__ = ["hxsl","_Splitter","VarProps"];
hxsl__$Splitter_VarProps.prototype = {
	__class__: hxsl__$Splitter_VarProps
};
var hxsl_Splitter = function() {
};
$hxClasses["hxsl.Splitter"] = hxsl_Splitter;
hxsl_Splitter.__name__ = ["hxsl","Splitter"];
hxsl_Splitter.prototype = {
	split: function(s) {
		var vfun = null;
		var vvars = new haxe_ds_IntMap();
		var ffun = null;
		var fvars = new haxe_ds_IntMap();
		this.varNames = new haxe_ds_StringMap();
		var _g = 0;
		var _g1 = s.funs;
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			var _g2 = f.kind;
			switch(_g2[1]) {
			case 0:
				this.vars = vvars;
				vfun = f;
				this.checkExpr(f.expr);
				break;
			case 1:
				this.vars = fvars;
				ffun = f;
				this.checkExpr(f.expr);
				break;
			default:
				throw new js__$Boot_HaxeError("assert");
			}
		}
		this.varMap = new haxe_ds_ObjectMap();
		var _g3 = 0;
		var _g11 = Lambda.array(vvars);
		while(_g3 < _g11.length) {
			var inf = _g11[_g3];
			++_g3;
			var v = inf.v;
			var _g21 = v.kind;
			switch(_g21[1]) {
			case 3:case 4:
				if(fvars.h.hasOwnProperty(v.id)) v.kind = hxsl_VarKind.Var; else v.kind = hxsl_VarKind.Local;
				break;
			default:
			}
			var _g22 = v.kind;
			switch(_g22[1]) {
			case 3:case 5:
				if(inf.read > 0 || inf.write > 1) {
					var nv = { id : hxsl_Tools.allocVarId(), name : v.name, kind : v.kind, type : v.type};
					this.vars = vvars;
					var ninf = this.get(nv);
					v.kind = hxsl_VarKind.Local;
					var p = vfun.expr.p;
					var e = { e : hxsl_TExprDef.TBinop(haxe_macro_Binop.OpAssign,{ e : hxsl_TExprDef.TVar(nv), t : nv.type, p : p},{ e : hxsl_TExprDef.TVar(v), t : v.type, p : p}), t : nv.type, p : p};
					this.addExpr(vfun,e);
					this.checkExpr(e);
					if(nv.kind == hxsl_VarKind.Var) {
						var old = fvars.h[v.id];
						this.varMap.set(v,nv);
						fvars.remove(v.id);
						var np = new hxsl__$Splitter_VarProps(nv);
						np.read = old.read;
						np.write = old.write;
						fvars.h[nv.id] = np;
					}
				}
				break;
			default:
			}
		}
		var finits = [];
		var todo = [];
		var $it0 = fvars.iterator();
		while( $it0.hasNext() ) {
			var inf1 = $it0.next();
			var v1 = inf1.v;
			var _g4 = v1.kind;
			switch(_g4[1]) {
			case 1:
				var nv1 = { id : hxsl_Tools.allocVarId(), name : v1.name, kind : hxsl_VarKind.Var, type : v1.type};
				this.uniqueName(nv1);
				var i = vvars.h[v1.id];
				if(i == null) {
					i = new hxsl__$Splitter_VarProps(v1);
					vvars.h[v1.id] = i;
				}
				i.read++;
				var vp = new hxsl__$Splitter_VarProps(nv1);
				vp.write = 1;
				vvars.h[nv1.id] = vp;
				var fp = new hxsl__$Splitter_VarProps(nv1);
				fp.read = 1;
				todo.push(fp);
				this.addExpr(vfun,{ e : hxsl_TExprDef.TBinop(haxe_macro_Binop.OpAssign,{ e : hxsl_TExprDef.TVar(nv1), t : v1.type, p : vfun.expr.p},{ e : hxsl_TExprDef.TVar(v1), t : v1.type, p : vfun.expr.p}), t : v1.type, p : vfun.expr.p});
				this.varMap.set(v1,nv1);
				inf1.local = true;
				break;
			case 3:
				if(inf1.write > 0) {
					var nv2 = { id : hxsl_Tools.allocVarId(), name : v1.name, kind : hxsl_VarKind.Local, type : v1.type};
					this.uniqueName(nv2);
					finits.push({ e : hxsl_TExprDef.TVarDecl(nv2,{ e : hxsl_TExprDef.TVar(v1), t : v1.type, p : ffun.expr.p}), t : hxsl_Type.TVoid, p : ffun.expr.p});
					this.varMap.set(v1,nv2);
				} else {
				}
				break;
			default:
			}
		}
		var _g5 = 0;
		while(_g5 < todo.length) {
			var v2 = todo[_g5];
			++_g5;
			fvars.h[v2.v.id] = v2;
		}
		var $it1 = vvars.iterator();
		while( $it1.hasNext() ) {
			var v3 = $it1.next();
			this.checkVar(v3,true,vvars);
		}
		var $it2 = fvars.iterator();
		while( $it2.hasNext() ) {
			var v4 = $it2.next();
			this.checkVar(v4,false,vvars);
		}
		var $it3 = this.varMap.keys();
		while( $it3.hasNext() ) {
			var v5 = $it3.next();
			var v21;
			var key = this.varMap.h[v5.__id__];
			v21 = this.varMap.h[key.__id__];
			if(v21 != null) this.varMap.set(v5,v21);
		}
		ffun = { ret : ffun.ret, ref : ffun.ref, kind : ffun.kind, args : ffun.args, expr : this.mapVars(ffun.expr)};
		{
			var _g6 = ffun.expr.e;
			switch(_g6[1]) {
			case 4:
				var el = _g6[2];
				var _g12 = 0;
				while(_g12 < finits.length) {
					var e1 = finits[_g12];
					++_g12;
					el.unshift(e1);
				}
				break;
			default:
				finits.push(ffun.expr);
				ffun.expr = { e : hxsl_TExprDef.TBlock(finits), t : hxsl_Type.TVoid, p : ffun.expr.p};
			}
		}
		var vvars1;
		var _g7 = [];
		var $it4 = vvars.iterator();
		while( $it4.hasNext() ) {
			var v6 = $it4.next();
			if(!v6.local) _g7.push(v6.v);
		}
		vvars1 = _g7;
		var fvars1;
		var _g13 = [];
		var $it5 = fvars.iterator();
		while( $it5.hasNext() ) {
			var v7 = $it5.next();
			if(!v7.local) _g13.push(v7.v);
		}
		fvars1 = _g13;
		vvars1.sort(function(v11,v22) {
			return v11.id - v22.id;
		});
		fvars1.sort(function(v12,v23) {
			return v12.id - v23.id;
		});
		return { vertex : { name : "vertex", vars : vvars1, funs : [vfun]}, fragment : { name : "fragment", vars : fvars1, funs : [ffun]}};
	}
	,addExpr: function(f,e) {
		{
			var _g = f.expr.e;
			switch(_g[1]) {
			case 4:
				var el = _g[2];
				el.push(e);
				break;
			default:
				f.expr = { e : hxsl_TExprDef.TBlock([f.expr,e]), t : hxsl_Type.TVoid, p : f.expr.p};
			}
		}
	}
	,checkVar: function(v,vertex,vvars) {
		var _g = v.v.kind;
		switch(_g[1]) {
		case 4:
			if(v.requireInit) throw new js__$Boot_HaxeError("Variable " + v.v.name + " is written without being initialized"); else {
			}
			break;
		case 3:
			if(!vertex) {
				var i = vvars.h[v.v.id];
				if(i == null || i.write == 0) throw new js__$Boot_HaxeError("Varying " + v.v.name + " is not written by vertex shader");
			}
			break;
		default:
		}
	}
	,mapVars: function(e) {
		{
			var _g = e.e;
			switch(_g[1]) {
			case 1:
				var v = _g[2];
				var v2 = this.varMap.h[v.__id__];
				if(v2 == null) return e; else return { e : hxsl_TExprDef.TVar(v2), t : e.t, p : e.p};
				break;
			default:
				return hxsl_Tools.map(e,$bind(this,this.mapVars));
			}
		}
	}
	,get: function(v) {
		var i = this.vars.h[v.id];
		if(i == null) {
			i = new hxsl__$Splitter_VarProps(v);
			this.vars.h[v.id] = i;
			this.uniqueName(v);
		}
		return i;
	}
	,uniqueName: function(v) {
		if(v.kind == hxsl_VarKind.Global || v.kind == hxsl_VarKind.Output || v.kind == hxsl_VarKind.Input) return;
		v.parent = null;
		var n = this.varNames.get(v.name);
		if(n != null && n != v) {
			var k = 2;
			while(this.varNames.exists(v.name + k)) k++;
			v.name += k;
		}
		this.varNames.set(v.name,v);
	}
	,checkExpr: function(e) {
		{
			var _g = e.e;
			switch(_g[1]) {
			case 1:
				var v = _g[2];
				var inf = this.get(v);
				if(inf.write == 0) inf.requireInit = true;
				inf.read++;
				break;
			case 5:
				switch(_g[2][1]) {
				case 4:
					switch(_g[3].e[1]) {
					case 1:
						var e1 = _g[4];
						var v1 = _g[3].e[2];
						var inf1 = this.get(v1);
						inf1.write++;
						this.checkExpr(e1);
						break;
					case 9:
						switch(_g[3].e[2].e[1]) {
						case 1:
							var e2 = _g[4];
							var v2 = _g[3].e[2].e[2];
							var inf2 = this.get(v2);
							inf2.write++;
							this.checkExpr(e2);
							break;
						default:
							hxsl_Tools.iter(e,$bind(this,this.checkExpr));
						}
						break;
					default:
						hxsl_Tools.iter(e,$bind(this,this.checkExpr));
					}
					break;
				case 20:
					switch(_g[3].e[1]) {
					case 1:
						var e3 = _g[4];
						var v3 = _g[3].e[2];
						var inf3 = this.get(v3);
						if(inf3.write == 0) inf3.requireInit = true;
						inf3.read++;
						inf3.write++;
						this.checkExpr(e3);
						break;
					case 9:
						switch(_g[3].e[2].e[1]) {
						case 1:
							var e4 = _g[4];
							var v4 = _g[3].e[2].e[2];
							var inf4 = this.get(v4);
							if(inf4.write == 0) inf4.requireInit = true;
							inf4.read++;
							inf4.write++;
							this.checkExpr(e4);
							break;
						default:
							hxsl_Tools.iter(e,$bind(this,this.checkExpr));
						}
						break;
					default:
						hxsl_Tools.iter(e,$bind(this,this.checkExpr));
					}
					break;
				default:
					hxsl_Tools.iter(e,$bind(this,this.checkExpr));
				}
				break;
			case 7:
				var init = _g[3];
				var v5 = _g[2];
				var inf5 = this.get(v5);
				inf5.local = true;
				if(init != null) {
					this.checkExpr(init);
					inf5.write++;
				}
				break;
			default:
				hxsl_Tools.iter(e,$bind(this,this.checkExpr));
			}
		}
	}
	,__class__: hxsl_Splitter
};
var input_Axis = function() {
	this.value = 0;
	this.negative = false;
	this.positive = false;
};
$hxClasses["input.Axis"] = input_Axis;
input_Axis.__name__ = ["input","Axis"];
input_Axis.prototype = {
	__class__: input_Axis
};
var input_Input = function() {
	this.keyUpEvents = [];
	this.keyDownEvents = [];
	this.positiveKeyAxisMap = new haxe_ds_ObjectMap();
	this.negativeKeyAxisMap = new haxe_ds_ObjectMap();
	this.inputStates = new haxe_ds_StringMap();
	this.keyMap = new haxe_ds_ObjectMap();
};
$hxClasses["input.Input"] = input_Input;
input_Input.__name__ = ["input","Input"];
input_Input.prototype = {
	onKeyDown: function(keyCode) {
		var key = input_KeyboardKeys.getKeyFromCode(keyCode);
		var keyName = this.keyMap.h[key.__id__];
		if(keyName != null) {
			if(!this.inputStates.get(keyName)) {
				this.inputStates.set(keyName,true);
				var _g = 0;
				var _g1 = this.keyDownEvents;
				while(_g < _g1.length) {
					var ev = _g1[_g];
					++_g;
					{
						var func = ev[3];
						var inputName = ev[2];
						if(inputName == keyName) func();
					}
				}
			}
		}
		if(this.positiveKeyAxisMap.h.__keys__[key.__id__] != null) {
			this.positiveKeyAxisMap.h[key.__id__].positive = true;
			this.positiveKeyAxisMap.h[key.__id__].value = 1;
		}
		if(this.negativeKeyAxisMap.h.__keys__[key.__id__] != null) {
			this.negativeKeyAxisMap.h[key.__id__].negative = true;
			this.negativeKeyAxisMap.h[key.__id__].value = -1;
		}
	}
	,onKeyUp: function(keyCode) {
		var key = input_KeyboardKeys.getKeyFromCode(keyCode);
		var keyName = this.keyMap.h[key.__id__];
		if(keyName != null) {
			if(this.inputStates.get(keyName)) {
				this.inputStates.set(keyName,false);
				var _g = 0;
				var _g1 = this.keyUpEvents;
				while(_g < _g1.length) {
					var ev = _g1[_g];
					++_g;
					{
						var func = ev[3];
						var inputName = ev[2];
						if(inputName == keyName) func();
					}
				}
			}
		}
		if(this.positiveKeyAxisMap.h.__keys__[key.__id__] != null) {
			var axis = this.positiveKeyAxisMap.h[key.__id__];
			axis.positive = false;
			if(axis.negative) axis.value = -1; else axis.value = 0;
		}
		if(this.negativeKeyAxisMap.h.__keys__[key.__id__] != null) {
			var axis1 = this.negativeKeyAxisMap.h[key.__id__];
			axis1.negative = false;
			if(axis1.positive) axis1.value = 1; else axis1.value = 0;
		}
	}
	,__class__: input_Input
};
var input_Key = function(code,$char,output,shiftOutput) {
	this.code = code;
	this["char"] = $char;
	this.output = output;
	this.shiftOutput = shiftOutput;
};
$hxClasses["input.Key"] = input_Key;
input_Key.__name__ = ["input","Key"];
input_Key.prototype = {
	__class__: input_Key
};
var input_KeyHandler = $hxClasses["input.KeyHandler"] = { __ename__ : true, __constructs__ : ["Function"] };
input_KeyHandler.Function = function(inputName,func) { var $x = ["Function",0,inputName,func]; $x.__enum__ = input_KeyHandler; $x.toString = $estr; return $x; };
input_KeyHandler.__empty_constructs__ = [];
var input_KeyboardKeys = function() { };
$hxClasses["input.KeyboardKeys"] = input_KeyboardKeys;
input_KeyboardKeys.__name__ = ["input","KeyboardKeys"];
input_KeyboardKeys.getKeyFromCode = function(code) {
	var _g = 0;
	var _g1 = input_KeyboardKeys.keys;
	while(_g < _g1.length) {
		var key = _g1[_g];
		++_g;
		if(key.code == code) return key;
	}
	return null;
};
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) Error.captureStackTrace(this,js__$Boot_HaxeError);
};
$hxClasses["js._Boot.HaxeError"] = js__$Boot_HaxeError;
js__$Boot_HaxeError.__name__ = ["js","_Boot","HaxeError"];
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
	__class__: js__$Boot_HaxeError
});
var js_html__$CanvasElement_CanvasUtil = function() { };
$hxClasses["js.html._CanvasElement.CanvasUtil"] = js_html__$CanvasElement_CanvasUtil;
js_html__$CanvasElement_CanvasUtil.__name__ = ["js","html","_CanvasElement","CanvasUtil"];
js_html__$CanvasElement_CanvasUtil.getContextWebGL = function(canvas,attribs) {
	var _g = 0;
	var _g1 = ["webgl","experimental-webgl"];
	while(_g < _g1.length) {
		var name = _g1[_g];
		++_g;
		var ctx = canvas.getContext(name,attribs);
		if(ctx != null) return ctx;
	}
	return null;
};
var js_html_compat_ArrayBuffer = function(a) {
	if((a instanceof Array) && a.__enum__ == null) {
		this.a = a;
		this.byteLength = a.length;
	} else {
		var len = a;
		this.a = [];
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			this.a[i] = 0;
		}
		this.byteLength = len;
	}
};
$hxClasses["js.html.compat.ArrayBuffer"] = js_html_compat_ArrayBuffer;
js_html_compat_ArrayBuffer.__name__ = ["js","html","compat","ArrayBuffer"];
js_html_compat_ArrayBuffer.sliceImpl = function(begin,end) {
	var u = new Uint8Array(this,begin,end == null?null:end - begin);
	var result = new ArrayBuffer(u.byteLength);
	var resultArray = new Uint8Array(result);
	resultArray.set(u);
	return result;
};
js_html_compat_ArrayBuffer.prototype = {
	slice: function(begin,end) {
		return new js_html_compat_ArrayBuffer(this.a.slice(begin,end));
	}
	,__class__: js_html_compat_ArrayBuffer
};
var js_html_compat_DataView = function(buffer,byteOffset,byteLength) {
	this.buf = buffer;
	if(byteOffset == null) this.offset = 0; else this.offset = byteOffset;
	if(byteLength == null) this.length = buffer.byteLength - this.offset; else this.length = byteLength;
	if(this.offset < 0 || this.length < 0 || this.offset + this.length > buffer.byteLength) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
};
$hxClasses["js.html.compat.DataView"] = js_html_compat_DataView;
js_html_compat_DataView.__name__ = ["js","html","compat","DataView"];
js_html_compat_DataView.prototype = {
	getInt8: function(byteOffset) {
		var v = this.buf.a[this.offset + byteOffset];
		if(v >= 128) return v - 256; else return v;
	}
	,getUint8: function(byteOffset) {
		return this.buf.a[this.offset + byteOffset];
	}
	,getInt16: function(byteOffset,littleEndian) {
		var v = this.getUint16(byteOffset,littleEndian);
		if(v >= 32768) return v - 65536; else return v;
	}
	,getUint16: function(byteOffset,littleEndian) {
		if(littleEndian) return this.buf.a[this.offset + byteOffset] | this.buf.a[this.offset + byteOffset + 1] << 8; else return this.buf.a[this.offset + byteOffset] << 8 | this.buf.a[this.offset + byteOffset + 1];
	}
	,getInt32: function(byteOffset,littleEndian) {
		var p = this.offset + byteOffset;
		var a = this.buf.a[p++];
		var b = this.buf.a[p++];
		var c = this.buf.a[p++];
		var d = this.buf.a[p++];
		if(littleEndian) return a | b << 8 | c << 16 | d << 24; else return d | c << 8 | b << 16 | a << 24;
	}
	,getUint32: function(byteOffset,littleEndian) {
		var v = this.getInt32(byteOffset,littleEndian);
		if(v < 0) return v + 4294967296.; else return v;
	}
	,getFloat32: function(byteOffset,littleEndian) {
		return haxe_io_FPHelper.i32ToFloat(this.getInt32(byteOffset,littleEndian));
	}
	,getFloat64: function(byteOffset,littleEndian) {
		var a = this.getInt32(byteOffset,littleEndian);
		var b = this.getInt32(byteOffset + 4,littleEndian);
		return haxe_io_FPHelper.i64ToDouble(littleEndian?a:b,littleEndian?b:a);
	}
	,setInt8: function(byteOffset,value) {
		if(value < 0) this.buf.a[byteOffset + this.offset] = value + 128 & 255; else this.buf.a[byteOffset + this.offset] = value & 255;
	}
	,setUint8: function(byteOffset,value) {
		this.buf.a[byteOffset + this.offset] = value & 255;
	}
	,setInt16: function(byteOffset,value,littleEndian) {
		this.setUint16(byteOffset,value < 0?value + 65536:value,littleEndian);
	}
	,setUint16: function(byteOffset,value,littleEndian) {
		var p = byteOffset + this.offset;
		if(littleEndian) {
			this.buf.a[p] = value & 255;
			this.buf.a[p++] = value >> 8 & 255;
		} else {
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p] = value & 255;
		}
	}
	,setInt32: function(byteOffset,value,littleEndian) {
		this.setUint32(byteOffset,value,littleEndian);
	}
	,setUint32: function(byteOffset,value,littleEndian) {
		var p = byteOffset + this.offset;
		if(littleEndian) {
			this.buf.a[p++] = value & 255;
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p++] = value >> 16 & 255;
			this.buf.a[p++] = value >>> 24;
		} else {
			this.buf.a[p++] = value >>> 24;
			this.buf.a[p++] = value >> 16 & 255;
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p++] = value & 255;
		}
	}
	,setFloat32: function(byteOffset,value,littleEndian) {
		this.setUint32(byteOffset,haxe_io_FPHelper.floatToI32(value),littleEndian);
	}
	,setFloat64: function(byteOffset,value,littleEndian) {
		var i64 = haxe_io_FPHelper.doubleToI64(value);
		if(littleEndian) {
			this.setUint32(byteOffset,i64.low);
			this.setUint32(byteOffset,i64.high);
		} else {
			this.setUint32(byteOffset,i64.high);
			this.setUint32(byteOffset,i64.low);
		}
	}
	,__class__: js_html_compat_DataView
};
var js_html_compat_Float32Array = function() { };
$hxClasses["js.html.compat.Float32Array"] = js_html_compat_Float32Array;
js_html_compat_Float32Array.__name__ = ["js","html","compat","Float32Array"];
js_html_compat_Float32Array._new = function(arg1,offset,length) {
	var arr;
	if(typeof(arg1) == "number") {
		arr = [];
		var _g = 0;
		while(_g < arg1) {
			var i = _g++;
			arr[i] = 0;
		}
		arr.byteLength = arr.length << 2;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer((function($this) {
			var $r;
			var _g1 = [];
			{
				var _g2 = 0;
				var _g11 = arr.length << 2;
				while(_g2 < _g11) {
					var i1 = _g2++;
					_g1.push(0);
				}
			}
			$r = _g1;
			return $r;
		}(this)));
	} else if(js_Boot.__instanceof(arg1,js_html_compat_ArrayBuffer)) {
		var buffer = arg1;
		if(offset == null) offset = 0;
		if(length == null) length = buffer.byteLength - offset >> 2;
		arr = [];
		var _g3 = 0;
		while(_g3 < length) {
			var i2 = _g3++;
			var val = buffer.a[offset++] | buffer.a[offset++] << 8 | buffer.a[offset++] << 16 | buffer.a[offset++] << 24;
			arr.push(haxe_io_FPHelper.i32ToFloat(val));
		}
		arr.byteLength = arr.length << 2;
		arr.byteOffset = offset;
		arr.buffer = buffer;
	} else if((arg1 instanceof Array) && arg1.__enum__ == null) {
		arr = arg1.slice();
		var buffer1 = [];
		var _g4 = 0;
		while(_g4 < arr.length) {
			var f = arr[_g4];
			++_g4;
			var i3 = haxe_io_FPHelper.floatToI32(f);
			buffer1.push(i3 & 255);
			buffer1.push(i3 >> 8 & 255);
			buffer1.push(i3 >> 16 & 255);
			buffer1.push(i3 >>> 24);
		}
		arr.byteLength = arr.length << 2;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer(buffer1);
	} else throw new js__$Boot_HaxeError("TODO " + Std.string(arg1));
	arr.subarray = js_html_compat_Float32Array._subarray;
	arr.set = js_html_compat_Float32Array._set;
	return arr;
};
js_html_compat_Float32Array._set = function(arg,offset) {
	var t = this;
	if(js_Boot.__instanceof(arg.buffer,js_html_compat_ArrayBuffer)) {
		var a = arg;
		if(arg.byteLength + offset > t.byteLength) throw new js__$Boot_HaxeError("set() outside of range");
		var _g1 = 0;
		var _g = arg.byteLength;
		while(_g1 < _g) {
			var i = _g1++;
			t[i + offset] = a[i];
		}
	} else if((arg instanceof Array) && arg.__enum__ == null) {
		var a1 = arg;
		if(a1.length + offset > t.byteLength) throw new js__$Boot_HaxeError("set() outside of range");
		var _g11 = 0;
		var _g2 = a1.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			t[i1 + offset] = a1[i1];
		}
	} else throw new js__$Boot_HaxeError("TODO");
};
js_html_compat_Float32Array._subarray = function(start,end) {
	var t = this;
	var a = js_html_compat_Float32Array._new(t.slice(start,end));
	a.byteOffset = start * 4;
	return a;
};
var js_html_compat_Uint8Array = function() { };
$hxClasses["js.html.compat.Uint8Array"] = js_html_compat_Uint8Array;
js_html_compat_Uint8Array.__name__ = ["js","html","compat","Uint8Array"];
js_html_compat_Uint8Array._new = function(arg1,offset,length) {
	var arr;
	if(typeof(arg1) == "number") {
		arr = [];
		var _g = 0;
		while(_g < arg1) {
			var i = _g++;
			arr[i] = 0;
		}
		arr.byteLength = arr.length;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer(arr);
	} else if(js_Boot.__instanceof(arg1,js_html_compat_ArrayBuffer)) {
		var buffer = arg1;
		if(offset == null) offset = 0;
		if(length == null) length = buffer.byteLength - offset;
		if(offset == 0) arr = buffer.a; else arr = buffer.a.slice(offset,offset + length);
		arr.byteLength = arr.length;
		arr.byteOffset = offset;
		arr.buffer = buffer;
	} else if((arg1 instanceof Array) && arg1.__enum__ == null) {
		arr = arg1.slice();
		arr.byteLength = arr.length;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer(arr);
	} else throw new js__$Boot_HaxeError("TODO " + Std.string(arg1));
	arr.subarray = js_html_compat_Uint8Array._subarray;
	arr.set = js_html_compat_Uint8Array._set;
	return arr;
};
js_html_compat_Uint8Array._set = function(arg,offset) {
	var t = this;
	if(js_Boot.__instanceof(arg.buffer,js_html_compat_ArrayBuffer)) {
		var a = arg;
		if(arg.byteLength + offset > t.byteLength) throw new js__$Boot_HaxeError("set() outside of range");
		var _g1 = 0;
		var _g = arg.byteLength;
		while(_g1 < _g) {
			var i = _g1++;
			t[i + offset] = a[i];
		}
	} else if((arg instanceof Array) && arg.__enum__ == null) {
		var a1 = arg;
		if(a1.length + offset > t.byteLength) throw new js__$Boot_HaxeError("set() outside of range");
		var _g11 = 0;
		var _g2 = a1.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			t[i1 + offset] = a1[i1];
		}
	} else throw new js__$Boot_HaxeError("TODO");
};
js_html_compat_Uint8Array._subarray = function(start,end) {
	var t = this;
	var a = js_html_compat_Uint8Array._new(t.slice(start,end));
	a.byteOffset = start;
	return a;
};
var tweenx909_EaseX = function() { };
$hxClasses["tweenx909.EaseX"] = tweenx909_EaseX;
tweenx909_EaseX.__name__ = ["tweenx909","EaseX"];
tweenx909_EaseX.linear = function(t) {
	return t;
};
var tweenx909_advanced_CommandX = function() { };
$hxClasses["tweenx909.advanced.CommandX"] = tweenx909_advanced_CommandX;
tweenx909_advanced_CommandX.__name__ = ["tweenx909","advanced","CommandX"];
tweenx909_advanced_CommandX.prototype = {
	__class__: tweenx909_advanced_CommandX
};
var tweenx909_rule_BoolRuleX = function() { };
$hxClasses["tweenx909.rule.BoolRuleX"] = tweenx909_rule_BoolRuleX;
tweenx909_rule_BoolRuleX.__name__ = ["tweenx909","rule","BoolRuleX"];
tweenx909_rule_BoolRuleX.calc = function(_from,_to,t1,t2,tween) {
	return 0 < (_from?1:0) * t2 + (_to?1:0) * t1;
};
tweenx909_rule_BoolRuleX.defaultFrom = function(value,_to,tween) {
	return value;
};
var tweenx909_rule_ArrayRuleX = function() { };
$hxClasses["tweenx909.rule.ArrayRuleX"] = tweenx909_rule_ArrayRuleX;
tweenx909_rule_ArrayRuleX.__name__ = ["tweenx909","rule","ArrayRuleX"];
tweenx909_rule_ArrayRuleX.calc = function(_from,_to,t1,t2,tween) {
	var fi = $iterator(_from)();
	var arr = [];
	var $it0 = $iterator(_to)();
	while( $it0.hasNext() ) {
		var t = $it0.next();
		var f = fi.next();
		arr.push(tweenx909_rule_ArrayRuleX._calc(f,t,t1,t2,tween));
	}
	return arr;
};
tweenx909_rule_ArrayRuleX._calc = function(_from,_to,t1,t2,tween) {
	if(typeof(_to) == "number") return _from * t2 + _to * t1; else {
		var result = null;
		var ok = false;
		var $it0 = $iterator(tweenx909_TweenX.get_rules())();
		while( $it0.hasNext() ) {
			var r = $it0.next();
			if(js_Boot.__instanceof(_to,r.inputClass)) {
				ok = true;
				result = r.calc(_from,_to,t1,t2,tween);
				break;
			}
		}
		if(!ok) {
			var eh = tween;
			throw new js__$Boot_HaxeError(eh.error("The tween rule for " + Type.getClassName(Type.getClass(_to)) + " is not defined"));
		}
		return result;
	}
};
tweenx909_rule_ArrayRuleX.defaultFrom = function(value,_to,tween) {
	var eh = tween;
	if(value != null) {
		var arr = [];
		var $it0 = $iterator(_to)();
		while( $it0.hasNext() ) {
			var t = $it0.next();
			arr.push(null);
		}
	} else if(Lambda.count(value) != Lambda.count(_to)) throw new js__$Boot_HaxeError(eh.error("The array length must be same with start."));
	var result = [];
	var it = $iterator(_to)();
	var $it1 = $iterator(value)();
	while( $it1.hasNext() ) {
		var v = $it1.next();
		var t1 = it.next();
		result.push(tweenx909_rule_ArrayRuleX._defaultFrom(v,t1,tween));
	}
	return result;
};
tweenx909_rule_ArrayRuleX._defaultFrom = function(value,_to,tween) {
	if(typeof(_to) == "number") return value;
	var $it0 = $iterator(tweenx909_TweenX.get_rules())();
	while( $it0.hasNext() ) {
		var r = $it0.next();
		if(js_Boot.__instanceof(_to,r.inputClass)) return r.defaultFrom(value,_to,tween);
	}
	var eh = tween;
	throw new js__$Boot_HaxeError(eh.error("The tween rule for " + Type.getClassName(Type.getClass(_to)) + " is not defined"));
	return null;
};
var tweenx909_rule_TimelineX = function() { };
$hxClasses["tweenx909.rule.TimelineX"] = tweenx909_rule_TimelineX;
tweenx909_rule_TimelineX.__name__ = ["tweenx909","rule","TimelineX"];
tweenx909_rule_TimelineX.calc = function(_from,_to,t1,t2,tween) {
	var t = t1 * _to.length;
	var ts = _to.timeline;
	var l = ts.length;
	var min = 0;
	var max = l;
	var n = max >> 1;
	while(max - min > 1) {
		var val = ts[n];
		if(t < val) max = n; else min = n;
		n = min + (max - min >> 1);
	}
	return _to.data[min];
};
tweenx909_rule_TimelineX.defaultFrom = function(value,_to,tween) {
	return null;
};
tweenx909_rule_TimelineX.prototype = {
	__class__: tweenx909_rule_TimelineX
};
var tweenx909_rule_RgbX = function(red,green,blue) {
	this.r = red;
	this.g = green;
	this.b = blue;
};
$hxClasses["tweenx909.rule.RgbX"] = tweenx909_rule_RgbX;
tweenx909_rule_RgbX.__name__ = ["tweenx909","rule","RgbX"];
tweenx909_rule_RgbX.calc = function(_from,_to,t1,t2,tween) {
	var r = (_from.r * t2 + _to.r * t1) * 255 | 0;
	if(r < 0) r = 0; else if(r > 255) r = 255;
	var g = (_from.g * t2 + _to.g * t1) * 255 | 0;
	if(g < 0) g = 0; else if(g > 255) g = 255;
	var b = (_from.b * t2 + _to.b * t1) * 255 | 0;
	if(b < 0) b = 0; else if(b > 255) b = 255;
	return r << 16 | g << 8 | b;
};
tweenx909_rule_RgbX.defaultFrom = function(value,_to,tween) {
	return tweenx909_rule_RgbX.of(value);
};
tweenx909_rule_RgbX.of = function(color) {
	return new tweenx909_rule_RgbX((color >> 16 & 255) / 255,(color >> 8 & 255) / 255,(color & 255) / 255);
};
tweenx909_rule_RgbX.prototype = {
	__class__: tweenx909_rule_RgbX
};
var tweenx909_rule_HsvX = function(hue,saturation,value) {
	this.h = hue;
	this.s = saturation;
	this.v = value;
};
$hxClasses["tweenx909.rule.HsvX"] = tweenx909_rule_HsvX;
tweenx909_rule_HsvX.__name__ = ["tweenx909","rule","HsvX"];
tweenx909_rule_HsvX.calc = function(_from,_to,t1,t2,tween) {
	var h = _from.h * t2 + _to.h * t1;
	var s = _from.s * t2 + _to.s * t1;
	var v = _from.v * t2 + _to.v * t1;
	h = (h - Math.floor(h)) * 6;
	var hi = Math.floor(h);
	if(s > 1) s = 1;
	if(s < 0) s = 0;
	if(v > 1) v = 1;
	if(v < 0) v = 0;
	var m = v * (1 - s);
	var f = h - hi;
	var r = .0;
	var g = .0;
	var b = .0;
	switch(hi) {
	case 0:
		r = v;
		g = v * (1 - s * (1 - f));
		b = m;
		break;
	case 1:
		r = v * (1 - s * f);
		g = v;
		b = m;
		break;
	case 2:
		r = m;
		g = v;
		b = v * (1 - s * (1 - f));
		break;
	case 3:
		r = m;
		g = v * (1 - s * f);
		b = v;
		break;
	case 4:
		r = v * (1 - s * (1 - f));
		g = m;
		b = v;
		break;
	case 5:
		r = v;
		g = m;
		b = v * (1 - s * f);
		break;
	}
	return (r * 255 | 0) << 16 | (g * 255 | 0) << 8 | (b * 255 | 0);
};
tweenx909_rule_HsvX.defaultFrom = function(value,_to,tween) {
	return tweenx909_rule_HsvX.of(value);
};
tweenx909_rule_HsvX.of = function(color,hueIndex) {
	if(hueIndex == null) hueIndex = 0;
	var r = (color >> 16 & 255) / 255;
	var g = (color >> 8 & 255) / 255;
	var b = (color & 255) / 255;
	var max;
	var min;
	var diff;
	var h;
	if(r < g) {
		if(g < b) {
			max = b;
			min = r;
			h = (4 + (r - g) / (diff = max - min)) / 6;
		} else {
			max = g;
			if(r < b) min = r; else min = b;
			h = (2 + (b - r) / (diff = max - min)) / 6;
		}
	} else if(r < b) {
		max = b;
		min = g;
		h = (4 + (r - g) / (diff = max - min)) / 6;
	} else {
		max = r;
		if(g < b) min = g; else min = b;
		h = (g - b) / (diff = max - min) / 6;
	}
	if(h < 0) h += 1;
	var s = diff / max;
	return new tweenx909_rule_HsvX(h + hueIndex,s,max);
};
tweenx909_rule_HsvX.prototype = {
	__class__: tweenx909_rule_HsvX
};
var tweenx909_rule_ArgbX = function(alpha,red,green,blue) {
	this.a = alpha;
	this.r = red;
	this.g = green;
	this.b = blue;
};
$hxClasses["tweenx909.rule.ArgbX"] = tweenx909_rule_ArgbX;
tweenx909_rule_ArgbX.__name__ = ["tweenx909","rule","ArgbX"];
tweenx909_rule_ArgbX.calc = function(_from,_to,t1,t2,tween) {
	var a = (_from.a * t2 + _to.a * t1) * 255 | 0;
	if(a < 0) a = 0; else if(a > 255) a = 255;
	var r = (_from.r * t2 + _to.r * t1) * 255 | 0;
	if(r < 0) r = 0; else if(r > 255) r = 255;
	var g = (_from.g * t2 + _to.g * t1) * 255 | 0;
	if(g < 0) g = 0; else if(g > 255) g = 255;
	var b = (_from.b * t2 + _to.b * t1) * 255 | 0;
	if(b < 0) b = 0; else if(b > 255) b = 255;
	return a << 24 | r << 16 | g << 8 | b;
};
tweenx909_rule_ArgbX.defaultFrom = function(value,_to,tween) {
	return tweenx909_rule_ArgbX.of(value);
};
tweenx909_rule_ArgbX.of = function(color) {
	return new tweenx909_rule_ArgbX((color >>> 24 & 255) / 255,(color >> 16 & 255) / 255,(color >> 8 & 255) / 255,(color & 255) / 255);
};
tweenx909_rule_ArgbX.prototype = {
	__class__: tweenx909_rule_ArgbX
};
var tweenx909_rule_AhsvX = function(alpha,hue,saturation,value) {
	this.a = alpha;
	this.h = hue;
	this.s = saturation;
	this.v = value;
};
$hxClasses["tweenx909.rule.AhsvX"] = tweenx909_rule_AhsvX;
tweenx909_rule_AhsvX.__name__ = ["tweenx909","rule","AhsvX"];
tweenx909_rule_AhsvX.calc = function(_from,_to,t1,t2,tween) {
	var a = _from.a * t2 + _to.a * t1;
	if(a > 1) a = 1;
	if(a < 0) a = 0;
	var h = _from.h * t2 + _to.h * t1;
	var s = _from.s * t2 + _to.s * t1;
	var v = _from.v * t2 + _to.v * t1;
	h = (h - Math.floor(h)) * 6;
	var hi = Math.floor(h);
	if(s > 1) s = 1;
	if(s < 0) s = 0;
	if(v > 1) v = 1;
	if(v < 0) v = 0;
	var m = v * (1 - s);
	var f = h - hi;
	var r = .0;
	var g = .0;
	var b = .0;
	switch(hi) {
	case 0:
		r = v;
		g = v * (1 - s * (1 - f));
		b = m;
		break;
	case 1:
		r = v * (1 - s * f);
		g = v;
		b = m;
		break;
	case 2:
		r = m;
		g = v;
		b = v * (1 - s * (1 - f));
		break;
	case 3:
		r = m;
		g = v * (1 - s * f);
		b = v;
		break;
	case 4:
		r = v * (1 - s * (1 - f));
		g = m;
		b = v;
		break;
	case 5:
		r = v;
		g = m;
		b = v * (1 - s * f);
		break;
	}
	return (a * 255 | 0) << 24 | (r * 255 | 0) << 16 | (g * 255 | 0) << 8 | (b * 255 | 0);
};
tweenx909_rule_AhsvX.defaultFrom = function(value,_to,tween) {
	return tweenx909_rule_AhsvX.of(value);
};
tweenx909_rule_AhsvX.of = function(color,hueIndex) {
	if(hueIndex == null) hueIndex = 0;
	var a = (color >>> 24 & 255) / 255;
	var r = (color >> 16 & 255) / 255;
	var g = (color >> 8 & 255) / 255;
	var b = (color & 255) / 255;
	var max;
	var min;
	var diff;
	var h;
	if(r < g) {
		if(g < b) {
			max = b;
			min = r;
			h = (4 + (r - g) / (diff = max - min)) / 6;
		} else {
			max = g;
			if(r < b) min = r; else min = b;
			h = (2 + (b - r) / (diff = max - min)) / 6;
		}
	} else if(r < b) {
		max = b;
		min = g;
		h = (4 + (r - g) / (diff = max - min)) / 6;
	} else {
		max = r;
		if(g < b) min = g; else min = b;
		h = (g - b) / (diff = max - min) / 6;
	}
	if(h < 0) h += 1;
	var s = diff / max;
	return new tweenx909_rule_AhsvX(a,h + hueIndex,s,max);
};
tweenx909_rule_AhsvX.prototype = {
	__class__: tweenx909_rule_AhsvX
};
var tweenx909_rule_QuakeX = function(value,scale,ease) {
	this.value = value;
	this.scale = scale;
	if(ease == null) this.ease = $bind(this,this.none); else this.ease = ease;
};
$hxClasses["tweenx909.rule.QuakeX"] = tweenx909_rule_QuakeX;
tweenx909_rule_QuakeX.__name__ = ["tweenx909","rule","QuakeX"];
tweenx909_rule_QuakeX.calc = function(_from,_to,t1,t2,tween) {
	var p;
	if(t1 < 0.5) p = _from.ease(t1 * 2); else p = _to.ease(t2 * 2);
	return _from.value * t2 + _to.value * t1 + p * (Math.random() * 2 - 1) * (_from.scale * t2 + _to.scale * t1);
};
tweenx909_rule_QuakeX.defaultFrom = function(value,_to,tween) {
	return new tweenx909_rule_QuakeX(value,_to.scale,_to.ease);
};
tweenx909_rule_QuakeX.prototype = {
	none: function(t) {
		if(t <= 0) return 0; else return 1;
	}
	,__class__: tweenx909_rule_QuakeX
};
var tweenx909_advanced_UpdateModeX = $hxClasses["tweenx909.advanced.UpdateModeX"] = { __ename__ : true, __constructs__ : ["MANUAL","TIME"] };
tweenx909_advanced_UpdateModeX.MANUAL = ["MANUAL",0];
tweenx909_advanced_UpdateModeX.MANUAL.toString = $estr;
tweenx909_advanced_UpdateModeX.MANUAL.__enum__ = tweenx909_advanced_UpdateModeX;
tweenx909_advanced_UpdateModeX.TIME = function(frameRate) { var $x = ["TIME",1,frameRate]; $x.__enum__ = tweenx909_advanced_UpdateModeX; $x.toString = $estr; return $x; };
tweenx909_advanced_UpdateModeX.__empty_constructs__ = [tweenx909_advanced_UpdateModeX.MANUAL];
var tweenx909_TweenX = function() {
	this.timeScale = 1;
	this._skip = null;
	this._currentTime = 0;
};
$hxClasses["tweenx909.TweenX"] = tweenx909_TweenX;
tweenx909_TweenX.__name__ = ["tweenx909","TweenX"];
tweenx909_TweenX.get_rules = function() {
	return tweenx909_TweenX._rules;
};
tweenx909_TweenX.dumpDefaults = function() {
	return new tweenx909_advanced_DefaultsX().dump();
};
tweenx909_TweenX.setDefaults = function(defaults) {
	defaults.apply();
};
tweenx909_TweenX.set_updateMode = function(value) {
	tweenx909_TweenX.updateMode = value;
	tweenx909_TweenX.initManager();
	return value;
};
tweenx909_TweenX.initManager = function() {
	tweenx909_TweenX.managerInited = true;
	tweenx909_TweenX.stopUpdater();
	{
		var _g = tweenx909_TweenX.updateMode;
		switch(_g[1]) {
		case 1:
			var f = _g[2];
			tweenx909_TweenX.prevTime = new Date().getTime();
			tweenx909_TweenX.setInterval(tweenx909_TweenX.mainLoop,Math.round(1000 / f));
			break;
		case 0:
			break;
		}
	}
};
tweenx909_TweenX.mainLoop = function() {
	{
		var _g = tweenx909_TweenX.updateMode;
		switch(_g[1]) {
		case 1:
			var f = _g[2];
			tweenx909_TweenX.manualUpdate((new Date().getTime() - tweenx909_TweenX.prevTime) / 1000);
			tweenx909_TweenX.prevTime = new Date().getTime();
			break;
		case 0:
			throw new js__$Boot_HaxeError("invalid auto update");
			break;
		}
	}
};
tweenx909_TweenX.stopUpdater = function() {
	if(tweenx909_TweenX._timer != null) {
		tweenx909_TweenX._timer.stop();
		tweenx909_TweenX._timer = null;
	}
};
tweenx909_TweenX.manualUpdate = function(time) {
	tweenx909_TweenX.initTweens();
	var l = tweenx909_TweenX._tweens.length;
	var i = 0;
	while(i < l) {
		var t = tweenx909_TweenX._tweens[i++];
		t._update(time * t.timeScale * tweenx909_TweenX.topLevelTimeScale);
		if(!t.playing) {
			tweenx909_TweenX._tweens.splice(--i,1);
			l--;
		}
	}
	tweenx909_TweenX._resetLog();
};
tweenx909_TweenX.initTweens = function() {
	var _g = 0;
	var _g1 = tweenx909_TweenX._addedTweens;
	while(_g < _g1.length) {
		var t = _g1[_g];
		++_g;
		t._init();
	}
	tweenx909_TweenX._addedTweens.splice(0,tweenx909_TweenX._addedTweens.length);
};
tweenx909_TweenX.setInterval = function(f,t) {
	if(tweenx909_TweenX._timer != null) tweenx909_TweenX._timer.stop();
	tweenx909_TweenX._timer = new haxe_Timer(t);
	tweenx909_TweenX._timer.run = f;
};
tweenx909_TweenX._resetLog = function() {
	tweenx909_TweenX._initLog = [];
	tweenx909_TweenX.dictionary = new haxe_ds_ObjectMap();
};
tweenx909_TweenX.field = function(o,key) {
	var tmp;
	if(o == null) return null; else if(o.__properties__ && (tmp = o.__properties__["get_" + key])) return o[tmp](); else return o[key];
};
tweenx909_TweenX.setField = function(o,key,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + key])) o[tmp](value); else o[key] = value;
};
tweenx909_TweenX.__super__ = tweenx909_advanced_CommandX;
tweenx909_TweenX.prototype = $extend(tweenx909_advanced_CommandX.prototype,{
	get_currentTime: function() {
		var t = this.get_totalTime();
		var p;
		if(this.backward) p = t - this._currentTime; else p = this._currentTime;
		if(p < 0) p = 0;
		if(p > t) p = t;
		return p;
	}
	,get_singleTime: function() {
		return this._time + this._interval;
	}
	,get_totalTime: function() {
		return this._delay + this.get_singleTime() * this._repeat - this._interval + this._rest;
	}
	,error: function(msg) {
		var p = this.definedPosInfos;
		return msg + "(Tween_" + this.id + " was generated at " + p.className + "/" + p.methodName + "() [" + p.fileName + ":" + p.lineNumber + "])";
	}
	,play: function() {
		if(this._parent != null) throw new js__$Boot_HaxeError(this.error("Can't play serialized object directly"));
		if(this.playing) return this;
		if(!this._inited) this._init();
		this.playing = true;
		tweenx909_TweenX._tweens.push(this);
		this.dispatch(0);
		if(this._onPlay != null) this._onPlay();
		this.update(1.49011614158922645e-08);
		return this;
	}
	,_stop: function() {
		if(!this.playing) return;
		this.playing = false;
		this.dispatch(9);
		if(this._onStop != null) this._onStop();
	}
	,update: function(time) {
		if(this._parent != null) throw new js__$Boot_HaxeError(this.error("Can't stop serialized object directly"));
		this._update(time * this.timeScale * tweenx909_TweenX.topLevelTimeScale);
		return this;
	}
	,_invert: function() {
		this._currentTime = this._totalTime - this._currentTime;
		if(this._repeat % 2 == 0) this._odd = !this._odd;
		this._inverted = !this._inverted;
		var d = this._delay;
		this._delay = this._rest;
		this._rest = d;
	}
	,_init: function() {
		if(this._inited) return;
		this._inited = true;
		if(tweenx909_TweenX._groupDefaults) {
			if(this._easeIsDefault) this._ease = tweenx909_TweenX.defaultEase;
			if(this._timeIsDefault) this._time = tweenx909_TweenX.defaultTime;
			if(this._delayIsDefault) this._delay = tweenx909_TweenX.defaultDelay;
			if(this._intervalIsDefault) this._interval = tweenx909_TweenX.defaultInterval;
			if(this._repeatIsDefault) this._repeat = tweenx909_TweenX.defaultRepeat;
			if(this._yoyoIsDefault) this._yoyo = tweenx909_TweenX.defaultYoyo;
			if(this._zigzagIsDefault) this._zigzag = tweenx909_TweenX.defaultZigZag;
			if(this._autoPlayIsDefault) this._autoPlay = tweenx909_TweenX.defaultAutoPlay;
		}
		if(this._repeat == 0) this._repeat = 2147483646;
		if(this._time < 1.49011614158922645e-08) this._time = 1.49011614158922645e-08;
		var ot = new Date().getTime();
		this._fastMode = true;
		{
			var _g = this._type;
			switch(_g[1]) {
			case 2:
				var _to = _g[4];
				var _from = _g[3];
				var target = _g[2];
				this._initFromTo(target,_from,_to);
				this._toKeys = Reflect.fields(_to);
				break;
			case 1:
				var toArr = _g[4];
				var fromArr = _g[3];
				var targets = _g[2];
				var i = 0;
				var $it0 = $iterator(targets)();
				while( $it0.hasNext() ) {
					var target1 = $it0.next();
					var _from1 = fromArr[i];
					var _to1 = toArr[i];
					this._initFromTo(target1,_from1,_to1);
					if(i == 0) this._toKeys = Reflect.fields(_to1);
					i++;
				}
				break;
			case 0:
				var g = _g[2];
				this.initGroup(g);
				break;
			default:
			}
		}
		this._singleTime = this.get_singleTime();
		this._totalTime = this.get_totalTime();
		if(this._autoPlay) this.play();
	}
	,_initFromTo: function(target,_from,_to) {
		throw new js__$Boot_HaxeError(this.error("must be standard tween."));
	}
	,_update: function(spent) {
		if(!this._inited) this._init();
		if(spent == 0) return;
		if(this.backward) spent = -spent;
		if(spent < 0) {
			this._invert();
			this.backward = !this.backward;
			spent = -spent;
		}
		var _currentTime = this._currentTime;
		var _singleTime = this.get_singleTime();
		var _totalTime = this._totalTime;
		var time = this._time;
		var delay = this._delay;
		var untilRest = _totalTime - this._rest;
		var delaying = _currentTime - delay < 1.49011614158922645e-08;
		var resting = !delaying && 1.49011614158922645e-08 > untilRest - _currentTime;
		var body = _currentTime - delay;
		var repeatNum = Math.floor(body / _singleTime);
		var position = body - repeatNum * _singleTime;
		var intervending = 1.49011614158922645e-08 > time - position;
		this._currentTime = _currentTime += spent;
		position += spent;
		body += spent;
		if(_currentTime - delay < 1.49011614158922645e-08) {
			this.dispatch(1);
			if(this._onDelay != null) this._onDelay();
			return;
		} else if(delaying) {
			this._apply(0,0);
			this.dispatch(2);
			if(this._onHead != null) this._onHead();
			this.dispatch(3);
			if(this._onUpdate != null) this._onUpdate();
			delaying = false;
		}
		if(1.49011614158922645e-08 > untilRest - _currentTime) {
			if(!resting) {
				if(intervending) {
					this.dispatch(6);
					if(this._onRepeat != null) this._onRepeat();
					this._apply(0,repeatNum);
					this.dispatch(2);
					if(this._onHead != null) this._onHead();
					this.dispatch(3);
					if(this._onUpdate != null) this._onUpdate();
				}
				this._apply(this._time,this._repeat - 1);
				this.dispatch(3);
				if(this._onUpdate != null) this._onUpdate();
				this.dispatch(4);
				if(this._onFoot != null) this._onFoot();
			}
			if(1.49011614158922645e-08 > _totalTime - _currentTime) {
				this._currentTime = this._totalTime;
				this.dispatch(8);
				if(this._onFinish != null) this._onFinish();
				this._stop();
			} else {
				this.dispatch(7);
				if(this._onRest != null) this._onRest();
			}
		} else {
			if(1.49011614158922645e-08 > time - position) {
				if(!intervending && repeatNum >= 0) {
					this._apply(this._time,repeatNum);
					this.dispatch(3);
					if(this._onUpdate != null) this._onUpdate();
					this.dispatch(4);
					if(this._onFoot != null) this._onFoot();
				}
				if(position < _singleTime) {
					this.dispatch(5);
					if(this._onInterval != null) this._onInterval();
					return;
				} else {
					if(repeatNum >= 0) {
						this.dispatch(6);
						if(this._onRepeat != null) this._onRepeat();
						this._apply(0,repeatNum);
						this.dispatch(2);
						if(this._onHead != null) this._onHead();
						this.dispatch(3);
						if(this._onUpdate != null) this._onUpdate();
					}
					repeatNum = body / _singleTime | 0;
					position = body - repeatNum * _singleTime;
					if(1.49011614158922645e-08 > time - position) {
						this._apply(this._time,repeatNum);
						this.dispatch(3);
						if(this._onUpdate != null) this._onUpdate();
						this.dispatch(4);
						if(this._onFoot != null) this._onFoot();
						this.dispatch(5);
						if(this._onInterval != null) this._onInterval();
						return;
					}
				}
			} else if(intervending) {
				this.dispatch(6);
				if(this._onRepeat != null) this._onRepeat();
				this._apply(0,repeatNum);
				this.dispatch(2);
				if(this._onHead != null) this._onHead();
				this.dispatch(3);
				if(this._onUpdate != null) this._onUpdate();
			}
			this._apply(position,repeatNum);
			this.dispatch(3);
			if(this._onUpdate != null) this._onUpdate();
		}
	}
	,_apply: function(p,repeatNum) {
		var t = this._getPosition(p,repeatNum % 2 == 1);
		{
			var _g = this._type;
			switch(_g[1]) {
			case 2:
				var _to = _g[4];
				var _from = _g[3];
				var target = _g[2];
				var t2 = 1 - t;
				if(this._fastMode) {
					var _g1 = 0;
					var _g2 = this._toKeys;
					while(_g1 < _g2.length) {
						var key = _g2[_g1];
						++_g1;
						tweenx909_TweenX.setField(target,key,this._fastCalc(tweenx909_TweenX.field(_from,key),tweenx909_TweenX.field(_to,key),t,t2));
					}
				} else {
					var _g11 = 0;
					var _g21 = this._toKeys;
					while(_g11 < _g21.length) {
						var key1 = _g21[_g11];
						++_g11;
						tweenx909_TweenX.setField(target,key1,this._calc(tweenx909_TweenX.field(_from,key1),tweenx909_TweenX.field(_to,key1),t,t2));
					}
				}
				break;
			case 1:
				var tos = _g[4];
				var froms = _g[3];
				var targets = _g[2];
				var t21 = 1 - t;
				var i = 0;
				var $it0 = $iterator(targets)();
				while( $it0.hasNext() ) {
					var target1 = $it0.next();
					var _to1 = tos[i];
					var _from1 = froms[i++];
					var _g12 = 0;
					var _g22 = this._toKeys;
					while(_g12 < _g22.length) {
						var key2 = _g22[_g12];
						++_g12;
						tweenx909_TweenX.setField(target1,key2,this._calc(tweenx909_TweenX.field(_from1,key2),tweenx909_TweenX.field(_to1,key2),t,t21));
					}
				}
				break;
			case 3:
				var _to2 = _g[4];
				var _from2 = _g[3];
				var func = _g[2];
				var t22 = 1 - t;
				var arr = [];
				var _g23 = 0;
				var _g13 = _to2.length;
				while(_g23 < _g13) {
					var i1 = _g23++;
					arr[i1] = this._calc(_from2[i1],_to2[i1],t,t22);
				}
				Reflect.callMethod(null,func,arr);
				break;
			case 0:
				var g = _g[2];
				var ts = g.tweens;
				var spent = (this._time * t - g.current) * 1.00000001;
				if(spent < 0) {
					var _g14 = 1 - ts.length;
					while(_g14 < 1) {
						var i2 = _g14++;
						ts[-i2]._update(spent);
					}
				} else {
					var _g24 = 0;
					var _g15 = ts.length;
					while(_g24 < _g15) {
						var i3 = _g24++;
						ts[i3]._update(spent);
					}
				}
				g.current = g.tweens[0].get_currentTime();
				break;
			case 4:
				var f = _g[2];
				if(t == 1) f();
				break;
			}
		}
	}
	,_fastCalc: function(_from,_to,t1,t2) {
		return _from * t2 + _to * t1;
	}
	,_calc: function(_from,_to,t1,t2) {
		if(typeof(_to) == "number") {
			var d = _from * t2 + _to * t1;
			return d;
		} else {
			var i = 0;
			var l = tweenx909_TweenX._rules.length;
			var f;
			var result = null;
			var ok = false;
			while(i < l) if(Std["is"](_to,(f = tweenx909_TweenX._rules[i++]).inputClass)) {
				ok = true;
				result = f.calc(_from,_to,t1,t2,this);
				break;
			}
			if(!ok) throw new js__$Boot_HaxeError(this.error("The tween rule for " + Type.getClassName(Type.getClass(_to)) + " is not defined"));
			return result;
		}
	}
	,_getPosition: function(p,back) {
		var t = p / this._time;
		if(this._odd) back = !back;
		if(this._inverted) t = 1 - t;
		if(back) {
			if(this._yoyo) t = 1 - t;
			t = this._ease(t);
			if(this._zigzag) t = 1 - t;
		} else t = this._ease(t);
		return t;
	}
	,dispatch: function(num) {
		var listeners = this._eventListeners[num];
		if(listeners != null) {
			var _g = 0;
			while(_g < listeners.length) {
				var f = listeners[_g];
				++_g;
				f(this);
			}
		}
	}
	,initGroup: function(g) {
		var df = null;
		var gd = false;
		if(g.defaults != null) {
			df = tweenx909_TweenX.dumpDefaults();
			gd = tweenx909_TweenX._groupDefaults;
			tweenx909_TweenX._groupDefaults = true;
			tweenx909_TweenX.setDefaults(g.defaults);
			tweenx909_TweenX.defaultAutoPlay = false;
		}
		var delay = 0.0;
		var max = 0.0;
		var result = [];
		{
			var _g = g.type;
			switch(_g[1]) {
			case 0:
				var $it0 = $iterator(g.source)();
				while( $it0.hasNext() ) {
					var t = $it0.next();
					if(t == null) continue;
					{
						var _g1 = t.command;
						switch(_g1[1]) {
						case 1:
							var d = _g1[2];
							delay += d;
							break;
						case 0:
							var o = _g1[2];
							result.push(o);
							o._autoPlay = false;
							if(tweenx909_TweenX._groupDefaults && o._delayIsDefault) o._delay = tweenx909_TweenX.defaultDelay;
							o._init();
							o._delay += delay;
							o._totalTime += delay;
							var totalTime = o._totalTime;
							if(o._skip != null) delay = delay + o._skip; else delay = totalTime;
							if(max < totalTime) max = totalTime;
							break;
						}
					}
				}
				break;
			case 1:
				var lag = _g[2];
				var $it1 = $iterator(g.source)();
				while( $it1.hasNext() ) {
					var t1 = $it1.next();
					if(t1 == null) continue;
					{
						var _g11 = t1.command;
						switch(_g11[1]) {
						case 1:
							var d1 = _g11[2];
							delay += d1;
							break;
						case 0:
							var o1 = _g11[2];
							result.push(o1);
							o1._init();
							o1._delay += delay;
							o1._totalTime += delay;
							var totalTime1 = o1._totalTime;
							if(o1._skip != null) delay += o1._skip; else delay += lag;
							if(max < totalTime1) max = totalTime1;
							break;
						}
					}
				}
				break;
			}
		}
		var _g2 = 0;
		while(_g2 < result.length) {
			var t2 = result[_g2];
			++_g2;
			var diff = max - t2._totalTime;
			t2._rest += diff;
			t2._totalTime += diff;
		}
		this._time = max;
		g.tweens = result;
		g.source = null;
		if(g.defaults != null) {
			tweenx909_TweenX._groupDefaults = gd;
			tweenx909_TweenX.setDefaults(df);
		}
	}
	,__class__: tweenx909_TweenX
});
var tweenx909_advanced_CommandTypeX = $hxClasses["tweenx909.advanced.CommandTypeX"] = { __ename__ : true, __constructs__ : ["TWEEN","WAIT"] };
tweenx909_advanced_CommandTypeX.TWEEN = function(tween) { var $x = ["TWEEN",0,tween]; $x.__enum__ = tweenx909_advanced_CommandTypeX; $x.toString = $estr; return $x; };
tweenx909_advanced_CommandTypeX.WAIT = function(delay) { var $x = ["WAIT",1,delay]; $x.__enum__ = tweenx909_advanced_CommandTypeX; $x.toString = $estr; return $x; };
tweenx909_advanced_CommandTypeX.__empty_constructs__ = [];
var tweenx909_advanced_DefaultsX = function() {
	this._autoPlay = true;
	this._zigzag = false;
	this._yoyo = false;
	this._repeat = 1;
	this._interval = 0;
	this._delay = 0;
	this._time = 0.3;
	this._ease = tweenx909_TweenX.DEFAULT_EASE;
};
$hxClasses["tweenx909.advanced.DefaultsX"] = tweenx909_advanced_DefaultsX;
tweenx909_advanced_DefaultsX.__name__ = ["tweenx909","advanced","DefaultsX"];
tweenx909_advanced_DefaultsX.prototype = {
	dump: function() {
		this._time = tweenx909_TweenX.defaultTime;
		this._ease = tweenx909_TweenX.defaultEase;
		this._delay = tweenx909_TweenX.defaultDelay;
		this._interval = tweenx909_TweenX.defaultInterval;
		this._repeat = tweenx909_TweenX.defaultRepeat;
		this._yoyo = tweenx909_TweenX.defaultYoyo;
		this._zigzag = tweenx909_TweenX.defaultZigZag;
		this._autoPlay = tweenx909_TweenX.defaultAutoPlay;
		return this;
	}
	,apply: function() {
		tweenx909_TweenX.defaultTime = this._time;
		tweenx909_TweenX.defaultEase = this._ease;
		tweenx909_TweenX.defaultDelay = this._delay;
		tweenx909_TweenX.defaultInterval = this._interval;
		tweenx909_TweenX.defaultRepeat = this._repeat;
		tweenx909_TweenX.defaultYoyo = this._yoyo;
		tweenx909_TweenX.defaultZigZag = this._zigzag;
		tweenx909_TweenX.defaultAutoPlay = this._autoPlay;
	}
	,__class__: tweenx909_advanced_DefaultsX
};
var tweenx909_advanced_GroupX = function() {
	this.current = 0;
};
$hxClasses["tweenx909.advanced.GroupX"] = tweenx909_advanced_GroupX;
tweenx909_advanced_GroupX.__name__ = ["tweenx909","advanced","GroupX"];
tweenx909_advanced_GroupX.prototype = {
	__class__: tweenx909_advanced_GroupX
};
var tweenx909_advanced__$GroupX_GroupTypeX = $hxClasses["tweenx909.advanced._GroupX.GroupTypeX"] = { __ename__ : true, __constructs__ : ["SERIAL","LAG"] };
tweenx909_advanced__$GroupX_GroupTypeX.SERIAL = ["SERIAL",0];
tweenx909_advanced__$GroupX_GroupTypeX.SERIAL.toString = $estr;
tweenx909_advanced__$GroupX_GroupTypeX.SERIAL.__enum__ = tweenx909_advanced__$GroupX_GroupTypeX;
tweenx909_advanced__$GroupX_GroupTypeX.LAG = function(lag) { var $x = ["LAG",1,lag]; $x.__enum__ = tweenx909_advanced__$GroupX_GroupTypeX; $x.toString = $estr; return $x; };
tweenx909_advanced__$GroupX_GroupTypeX.__empty_constructs__ = [tweenx909_advanced__$GroupX_GroupTypeX.SERIAL];
var tweenx909_advanced_TweenTypeX = $hxClasses["tweenx909.advanced.TweenTypeX"] = { __ename__ : true, __constructs__ : ["GROUP","ARRAY","FROM_TO","FUNC","CALL"] };
tweenx909_advanced_TweenTypeX.GROUP = function(group) { var $x = ["GROUP",0,group]; $x.__enum__ = tweenx909_advanced_TweenTypeX; $x.toString = $estr; return $x; };
tweenx909_advanced_TweenTypeX.ARRAY = function(targets,_from,_to) { var $x = ["ARRAY",1,targets,_from,_to]; $x.__enum__ = tweenx909_advanced_TweenTypeX; $x.toString = $estr; return $x; };
tweenx909_advanced_TweenTypeX.FROM_TO = function(target,_from,_to) { var $x = ["FROM_TO",2,target,_from,_to]; $x.__enum__ = tweenx909_advanced_TweenTypeX; $x.toString = $estr; return $x; };
tweenx909_advanced_TweenTypeX.FUNC = function(func,_from,_to) { var $x = ["FUNC",3,func,_from,_to]; $x.__enum__ = tweenx909_advanced_TweenTypeX; $x.toString = $estr; return $x; };
tweenx909_advanced_TweenTypeX.CALL = function(func) { var $x = ["CALL",4,func]; $x.__enum__ = tweenx909_advanced_TweenTypeX; $x.toString = $estr; return $x; };
tweenx909_advanced_TweenTypeX.__empty_constructs__ = [];
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
$hxClasses.Math = Math;
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
$hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
var __map_reserved = {}
var hx__registerFont;
hx__registerFont = function(name,data) {
	var s;
	var _this = window.document;
	s = _this.createElement("style");
	s.type = "text/css";
	s.innerHTML = "@font-face{ font-family: " + name + "; src: url('data:font/ttf;base64," + data + "') format('truetype'); }";
	window.document.getElementsByTagName("head")[0].appendChild(s);
	var div;
	var _this1 = window.document;
	div = _this1.createElement("div");
	div.style.fontFamily = name;
	div.style.opacity = 0;
	div.style.width = "1px";
	div.style.height = "1px";
	div.style.position = "fixed";
	div.style.bottom = "0px";
	div.style.right = "0px";
	div.innerHTML = ".";
	div.className = "hx__loadFont";
	window.document.body.appendChild(div);
};
hx__registerFont("R_trueTypeFont_ttf","AAEAAAAMAIAAAwBAT1MvMkUHkm0AAAFIAAAAYGNtYXC8mLvZAAAFWAAAA1ZnYXNw//8AAwAANUwAAAAIZ2x5ZsNj/vkAAAqMAAAi7GhlYWQBsXbtAAAAzAAAADZoaGVhFXoNlQAAAQQAAAAkaG10eM9aWwQAAAGoAAADsGtlcm744/tUAAAteAAAAMZsb2NhRJI8pAAACLAAAAHabWF4cAD5AHMAAAEoAAAAIG5hbWUoC6SUAAAuQAAABMFwb3N0v6VKoAAAMwQAAAJFAAEAAAABAAAvfAdhXw889QALCAAAAAAAylDs8wAAAADKXD+UAGT+tQ2CBrYAAAAGAAEAAAAAAAAAAQAABrT+XgDeDeYAZABkDYIAAQAAAAAAAAAAAAAAAAAAAOwAAQAAAOwATQAEACQABQAAAAAAAAAAAAAAAAAAAAMAAgADBCYBkAAFAAgFmgUzAAABGwWaBTMAAAPRAGYCEgAAAgAFAAAAAAAAAIAAAKdQAABKAAAAAAAAAABITCAgAEAAIPsCBZr+ZgDNBrQBoiAAARFBAAAABAAFmgAAACAAAAQAAGQAAAAAAfwAAAH8AAAB3ABkAroAZASiAGQEogBkBhwAZASiAGQBjgBkAmUAZAJlAGQCQwBkA44AZAHcAGQC0QBkAdwAZAPVAGQEogBkAdwAZASiAGQEogBkBKIAZASiAGQEogBkBKIAZASiAGQEogBkAdwAZAHcAGQDjgBkA44AZAOOAGQEogBkBKIAZASiAGQEogBkBKIAZASiAGQEogBkBKIAZASiAGQEogBkAdwAZASiAGQEogBkBKIAZAUaAGQEogBkBKIAZASiAGQEogBkBKIAZASiAGQEogBkBKIAZASiAGQGPwBkBKYAZASiAGQEogBkAmQAZAPVAGQCZABkBKwAZARlAGQBxQBkBKIAZASiAGQEogBkBKIAZASiAGQEogBkBKIAZASiAGQB3ABkBKIAZASiAGQEogBkBRoAZASiAGQEogBkBKIAZASiAGQEogBkBKIAZASiAGQEogBkBKIAZAY/AGQEpgBkBKIAZASiAGQC1QBkAVgAZALVAGQDdQBkAdwAZASiAGQEogBkBAsAZASiAGQBWQBkBKMAZAN1AGQGmgBkArUAZAMYAGQDjwBkBlIAZALRAGQCtQBkA44AZAK1AGQCtQBkAcUAZASkAGQEVABkAdwAZAGhAGQBUgBkArUAZAMYAGQFvABkBgQAZAX4AGQEogBkBKIAZASiAGQEogBkBKIAZASiAGQEogBkB3MAZASiAGQEogBkBKIAZASiAGQEogBkAdwAZAHjAGQCbQBkA3UAZAUmAGQEogBkBKIAZASiAGQEogBkBKIAZASiAGQDdwBkBSwAZASiAGQEogBkBKIAZASiAGQEogBkBKIAZAlEAGQEogBkBKIAZASiAGQEogBkBKIAZASiAGQHcwBkBKIAZASiAGQEogBkBKIAZASiAGQB3ABkAeMAZAJtAGQDdQBkBSYAZASiAGQEogBkBKIAZASiAGQEogBkBKIAZAOOAGQFLABkBKIAZASiAGQEogBkBKIAZASiAGQEogBkBKIAZAHcAGQCbQBkAm0AZALRAGQCbQBkAdwAZAG+AGQB9ABkAvMAZALOAGQEmgBkBpgAZAHcAGQB3ABkAdwAZANRAGQDUQBkA1EAZAQjAGQEIwBkAq8AZAVJAGQBwQBkAcEAZAWGAGQJRABkBKIAZA3mAGQFOwBkCyAAZAUjAGQEogBkBKIAZAQjAGQEIwBkA44AZARvAGQF/gBkAqkAZAN1AGQDjgBkA44AZAZ+AGQJRABkAAAAAwAAAAMAAAAcAAEAAAAAAUwAAwABAAAAHAAEATAAAABGAEAABQAGAH4AoACsAK0A/wExAscCyQLdA34gFCAaIB4gIiAmIDogRCCkIKcgrCEWISIiAiIGIg8iEiIVIhoiHiIrIkgiZfAC+wL//wAAACAAoAChAK0ArgExAsYCyQLYA34gEyAYIBwgICAmIDkgRCCjIKcgrCEWISIiAiIGIg8iESIVIhkiHiIrIkgiZPAB+wH////jAAD/wQAA/8D/j/37/fr97Pyg4LfgtOCz4LLgr+Cd4JTgNuA04DDfx9+83t3e2t7S3tHewwAA3sfeu96f3oQQ6QXpAAEAAABEAAAAQgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAMAEAB3AOQABgIKAAAAAAEAAAEAAAAAAAAAAAAAAAAAAAABAAIAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAADAAQABQAGAAcACAAJAAoACwAMAA0ADgAPABAAEQASABMAFAAVABYAFwAYABkAGgAbABwAHQAeAB8AIAAhACIAIwAkACUAJgAnACgAKQAqACsALAAtAC4ALwAwADEAMgAzADQANQA2ADcAOAA5ADoAOwA8AD0APgA/AEAAQQBCAEMARABFAEYARwBIAEkASgBLAEwATQBOAE8AUABRAFIAUwBUAFUAVgBXAFgAWQBaAFsAXABdAF4AXwBgAGEAAACEAIUAhwCJAJEAlgCcAKEAoACiAKQAowClAKcAqQCoAKoAqwCtAKwArgCvALEAswCyALQAtgC1ALoAuQC7ALwA0gBwAGMAZABoANQAdgCfAG4AagDeAHQAaQAAAIYAmADlAHEA6ADpAGYAdQDfAOIA4QAAAOYAawB6AAAApgC4AH8AYgBtAOQAAADnAOAAbAB7ANUAAwCAAIMAlQAAAAAAygDLAM8A0ADMAM0AtwAAAL8AAADYAGUA1gDXAOoA6wDTAHcAzgDRAAAAggCKAIEAiwCIAI0AjgCPAIwAkwCUAAAAkgCaAJsAmQDAAMEAyABvAMQAxQDGAHgAyQDHAMIAAAAAAFYAVgBWAFYAagB2AKYAyADYAPYBBAEaATABTgFkAXQBggGQAZ4BtAHCAdwB9AIMAiYCQgJUAnICjgKaAqYCvALKAuAC/AMcAzgDXANwA4gDogO4A9ID7AP6BA4EKgQ6BFgEcASGBJ4EvATeBPgFDAUgBTYFVgV4BZAFpgW4BcgF2gXwBf4GDAYUBhwGJAYsBjQGPAZEBkwGVAZcBmQGbAZ0BnwGhAaMBpQGnAakBqwGtAa8BsQGzAbUBtwG+gcIByYHOgdQB2wHjgfMB/IIBggoCD4IqAjCCM4I4AlaCWQJegmGCZ4JtgnECdwJ+goICiAKLgpEClAKdAqcCswK6gr2CwILDgsaCyYLMgtYC2QLcAt8C4gLlAugC6wLuAvEC+gL9AwADAwMGAwkDDAMSgxwDHwMiAyUDKAMrAzKDNYM3gzmDO4M9gz+DQYNDg0WDR4NJg0uDTYNPg1GDU4NVg1eDWYNbg12DX4Nhg2ODawNtA28DcQNzA3UDdwN5A3wDfgODA4gDigOOg5IDm4OgA6UDqAOrg68Ds4O4A7oDvQPAA8MDyQPSA9gD3APhA+WD6QPsA/YD+gQDBAcEEIQXhB2EIoQphC0EMoRGBE4EUYRUhFeEWoRdgAAAAQAZAAAA5wFmgADAAcAJAA4AAAzESERJSERIRc2NzYzMhYVFAYHDgEVFBcjJjU0EjU0JiMiBwYHEzc2MzIfARYVFA8BBiMiLwEmNTRkAzj8+gLU/SyvHxs1O1xwLkA/SBggI6NCOiYfGh5AOQsJCgw4CQo4DgcLCT0HBZr6ZjIFNuwcDx5fUDFjUFBoLyZfYTNMARxLOUIRDxn8/zoKCzwLCQsLPg4KRwkJCgACAGQAAAF4BZwAAwAHAAATESERFREhEWQBFP7sAYcEFfvrhf7+AQL//wBkBAoCVgWcACIACgAAAAMACgEsAAAAAgBkAAAEPgWcABsAHwAAASMRIREjNTM1IzUzESERMxEhETMVIxUzFSMRIQMzNSMCq7T+7H9/f38BFLQBFH9/f3/+7LS0tAF6/oYBeurl6gFp/pcBaf6X6uXq/oYCZOUAAQBk/1gEPgYyABMAACURIREhNTMVIRUhESERIRUjNSE1Azv9KQGbqAGX/ToCxv5pqP5l9gFjA0OWlvb+nfy9qKj2AP//AGQAAAW4BZwAIgBwAAAAIwBwA2f9NgACANhOAAAAAAIAZAAABD4FnAADAA0AAAERIRE1ESERIREhFSERAXgBwwED/CYD2v06Aln+nQFj6gEJ+7QFnPb+nQAAAAEAZAQKASoFnAADAAABESMRASrGBZz+bgGSAAABAGQAAAIBBZwACQAAKQEnETchFSMRMwIB/spnaAE1mpp+BKB+9vxQAAAAAAEAZAAAAgEFnAAJAAA3MxEjNSEXEQchZJqaATVoZ/7K9gOw9n77YH4AAAAAAQBkBCIB3wWcAA4AABMVJwcXBxc3FzcnNycHNftgN3NUSE5UQkJyKmAFnHgqVDxaPGZsPGYwVB5yAAAAAQBkAVsDKgQhAAsAAAEVIzUjNTM1MxUzFQJH6vn56uMCWf7+6t7e6gAAAAABAGT/EAF4AQIABgAAMyMRIREHI997ARRwnAEC/v7wAAEAZAJZAm0DQwADAAATIRUhZAIJ/fcDQ+oAAAABAGQAAAF4AQIAAwAAAREhEQF4/uwBAv7+AQIAAQBkAAADcQWcAAMAACkBASEBeP7sAfkBFAWcAAIAZAAABD4FnAADAAcAAAERIREFIREhBD78JgLX/j0BwwWc+mQFnPb8UAAAAQBkAAABeAWcAAMAACkBESEBeP7sARQFnAAAAAEAZAAABD4FnAALAAAlFSERIREhNSERIREEPvwmAtf9KQPa/Tr29gNDAWP2/L3+nQAAAAABAGQAAAQ+BZwACwAAEzUhESE1IREhNSERZAPa/CYC1/0pAtcEpvb6ZPYBY+oBYwABAGQAAAQ+BZwACQAAExEhESERIREhEWQBFAHDAQP+/QJZA0P9pwJZ+mQCWQAAAAABAGQAAAQ+BZwACwAAExEhFSERIREhNSERZAPa/ToCxvwmAtcCWQND9v6d/L32AWMAAAAAAgBkAAAEPgWcAAcACwAAAREhESERIRUBESERAXgCxvwmA9r9OgHDBKb+nfy9BZz2/bP+nQFjAAABAGQAAAQ+BZwABQAAASE1IREhAzv9KQPa/v0Epvb6ZAAAAAADAGQAAAQ+BZwAAwAHAAsAAAERIREBESERAREhEQQ+/CYBFAHD/j0BwwWc+mQFnPy9/p0BYwJN/p0BYwACAGQAAAQ+BZwABwALAAAlESERIREhNQERIREDO/0pA9r8JgEUAcP2AWMDQ/pk9gOw/p0BYwAA//8AZAAAAXgDowAiAHcAAAACABEAAAAA//8AZP8QAXgDowAiAHcAAAACAA8AAAAAAAEAZAEhAyoFBQAGAAATARUFARUBZALG/fUCC/06A/cBDurn/tfqAVwAAAD//wBkAckDKgRRACMA4wAAAQ4AAwDjAAD/cAAAAAEAZAEhAyoFBQAGAAAJATUBJTUBAyr9OgIL/fUCxgJ9/qTqASnn6v7yAAAAAgBkAAAEPgWcAAkADQAAExEhESE1IREhHQERIRFkAtf9KQPa/Tr+7AF1Ac4BY/b8veRz/v4BAgACAGQAAAQ+BZwAAwAPAAABNSMVEzUhESEVIREhESERAzumpv49Asb8JgPa/ZcCWdLSAZO6/FD2BZz8CQJHAAAAAgBkAAAEPgWcAAcACwAAASERIREhESEBESERAzv+Pf7sA9r+/f49AcMCWf2nBZz6ZASm/p0BYwADAGQAAAQ+BZwABgAKAA4AAAERBxcRIREBESERAREhEQQ+eXn8JgEUAcP+PQHDBZz94LO0/esFnPy9/p0BYwJN/p0BYwAAAAABAGQAAAQ+BZwABwAAJSEVIREhFSEBeALG/CYD2v069vYFnPYAAAAAAgBkAAAEPgWcAAUACQAAMxEhFxEHAyERIWQDcmhnnP49AcMFnH77YH4EpvxQAAAAAQBkAAAEPgWcAAsAAAERIRUhESEVIREhFQF4Asb9OgLG/CYD2gSm/p3q/p32BZz2AAAAAAEAZAAABD4FnAAJAAApAREhFSERIRUhAXj+7APa/ToCxv06BZz2/p3qAAAAAQBkAAAEPgWcAAsAAAEhESERIRUhESERIQIdAiH8JgPa/ToBw/7iA0P8vQWc9vxQAWMAAAEAZAAABD4FnAALAAApAREhESERIREhESEBeP7sARQBwwED/v3+PQWc/acCWfpkAlkAAAABAGQAAAF4BZwAAwAAKQERIQF4/uwBFAWcAAAAAQBkAAAEPgWcAAcAAAERIREhESERAXgBwwED/CYCa/6LBKb6ZAJrAAEAZAAABD4FnAAKAAApAREhEQEhCQEhAQF4/uwBFAHDAQP+HwHh/v3+PQWc/acCWf1E/SACWQAAAQBkAAAEPgWcAAUAACUhFSERIQF4Asb8JgEU9vYFnAABAGQAAAS2BZwADAAAKQERIQkBIREhEQMjAwF4/uwBFAEYASMBA/79yaLQBZz87QMT+mQCWf2nAlkAAAABAGQAAAQ+BZwACQAAKQERIQERIREhAQF4/uwBFAHDAQP+/f49BZz82wMl+mQDPQACAGQAAAQ+BZwAAwAHAAABESERBSERIQQ+/CYC1/49AcMFnPpkBZz2/FAAAAIAZAAABD4FnAAFAAkAACkBESERIRkBIREBeP7sA9r9OgHDBZz8vQJN/p0BYwAAAAIAZP8QBD4FnAAGAA4AAAERIREzJzMDIREhESMXIwM7/j3dXfIR/YsD2n953wEFA6H8UK/+WwWc+mTwAAIAZAAABD4FnAADAA0AAAERIREBESERIQEhASMRAXgBw/0pA9r+rwFR/v3+nmEEpv6dAWP7WgWc/L39pwJZ/acAAAAAAQBkAAAEPgWcAAsAABMRIRUhESERITUhEWQD2v06Asb8JgLXAlkDQ/b+nfy99gFjAAAAAAEAZAAABD4FnAAHAAABITUhFSERIQHZ/osD2v6v/uwEpvb2+1oAAAABAGQAAAQ+BZwABwAAASERIREhESEDOwED/CYBFAHDBZz6ZAWc+1oAAQBkAAAEPgWcAAYAAAEhASEBIRMDOwED/sf+sP6vARTYBZz6ZAWc+68AAAABAGQAAAXbBZwADAAAAQMhASEbASEbASEBIQMgdf65/wABGoiRARGRiAEa/wD+uQKQ/XAFnPxAA8D8QAPA+mQAAQBkAAEEQgWcAA0AAAEjASEbASEBMwEhCwEhAc0J/qQBFN/kAQP+lwkBXP7s3+T+/QLOAs7+OAHI/TP9MgHI/jgAAAABAGQAAAQ+BZwACAAAAREhEQEhGwEhAtT+7P6kARTf5AEDAs79MgLOAs7+OAHIAAABAGQAAAQ+BZwACQAAASE1IRUBIRUhNQLt/XcD2v2DAn38JgSm9vb8UPb2AAEAZAAAAgAFnAAHAAApARMhFSMRMwIA/mQBAZuamgWc9vxQAAEAZAAAA3EFnAADAAATIQEhZAEUAfn+7AWc+mQAAAAAAQBkAAACAAWcAAcAADczESM1IRMhZJqaAZsB/mT2A7D2+mQAAQBkAtYESAWcAAYAAAkBIwMBIwEDOgEO6uf+1+oBXAWc/ToCC/31AsYAAAABAGT/iAQBAAYAAwAAJRUhNQQB/GMGfn4AAAAAAQBkBcABYQaTAAMAABMXMydkZ5ZmBpPT0wAA//8AZAAABD4FnAACACQAAP//AGQAAAQ+BZwAAgAlAAD//wBkAAAEPgWcAAIAJgAA//8AZAAABD4FnAACACcAAP//AGQAAAQ+BZwAAgAoAAD//wBkAAAEPgWcAAIAKQAA//8AZAAABD4FnAACACoAAP//AGQAAAQ+BZwAAgArAAD//wBkAAABeAWcAAIALAAA//8AZAAABD4FnAACAC0AAP//AGQAAAQ+BZwAAgAuAAD//wBkAAAEPgWcAAIALwAA//8AZAAABLYFnAACADAAAP//AGQAAAQ+BZwAAgAxAAD//wBkAAAEPgWcAAIAMgAA//8AZAAABD4FnAACADMAAP//AGT/EAQ+BZwAAgA0AAD//wBkAAAEPgWcAAIANQAA//8AZAAABD4FnAACADYAAP//AGQAAAQ+BZwAAgA3AAD//wBkAAAEPgWcAAIAOAAA//8AZAAABD4FnAACADkAAP//AGQAAAXbBZwAAgA6AAD//wBkAAEEQgWcAAIAOwAA//8AZAAABD4FnAACADwAAP//AGQAAAQ+BZwAAgA9AAAAAQBkAAACcQWcAA8AABMRNyEVIxEHFxEzFSEnESfUaAE1mkNDmv7KZ3ADMwHrfvb+iF5M/nL2fgH8UQAAAQBk/2QA9AZ7AAMAABMRIxH0kAZ7+OkHFwAAAAEAZAAAAnEFnAAPAAABBxEHITUzETcnESM1IRcRAnFwZ/7KmkNDmgE1aALLUf4EfvYBjkxeAXj2fv4VAAEAZAI9AxEDtgAHAAATFzYENycGJmRSZwE7uWCJ8AMelnS/1HR7rAACAGQAAAF4BZwAAwAHAAABESERNREhEQF4/uwBFAQV++sEFYUBAv7+AAAAAAEAZACpBD4FMAAPAAABESEVIRUjNSERITUzFSEVAXgCxv5pqP5lAZuoAZcDpP6d6q6uA0OWlvYAAQBkAAAEPgWcABMAAAERITUhETMVIxEhFSE1MxEjNTMRBD7+/f7asbECKfwmnZqaBZz+RMb+ner+nfb2AWPqAlkAAAACAGQAxgOnBIIAGwAnAAABNxcHFhUUBxcHJwYjIicHJzcmNTQ3JzcXNjMyByIGFRQWMzI2NTQmAttyWnNGV11bYVZreFxxWnBJbGZacExcenpehYVeXYWFA9B5WnpigI9qelp/NkN4W3dkg55xhlqTJ5CJYWCJiWBhiQAAAQBkAAAEPgWcABYAAAkBIRsBIQEzFSMVMxUjFSE1IzUzNSM1Aa3+twEU3+QBA/6ql6urq/7suLi4AvUCp/44Acj9Wd5n3tLS3mfeAAIAZP9kAPUGewADAAcAABMRIxE1ETMR9ZGRApv8yQM3ugMm/NoAAAACAGT+vAQ/BqUACwAPAAATIRUhESERITUhESEBESERZQPa/ToCxfwmAtf9KgETAcQGpfb+qfpk9gFXAln+nQFjAAAAAAIAZAWoAxEGqwADAAcAAAERIRElESERAXj+7AKt/uwGqv7+AQIB/v4BAgAAAwBkAAcGNgXXAA8AHwBBAAABMgQSFRQCBCMiJAI1NBIkFyIEAhUUEgQzMiQSNTQCJBcTIy4BIyIGBw4BFRQWMzI3FwYjIgA1NAAzMhYXFjMyNjcDTbwBZcjF/p3Bwv6fxskBZbur/ru4tAFEsLABRLW4/rvEFikno3RXhisgKsCczHsnkv/T/uwBJuQyPlQZDBEYDAXXwP6bwsL+nMPDAWTCwgFlwECw/rqxsf69tbUBQ7GxAUawyf7afXtIOy6WUd/TqhTVARDCyQEcDBsJEx0AAAACAGQCzgJRBZwABwALAAABIxEjESERIwMVMzUB0OKKAe2B4uID+/7TAs79MgJTsbEAAAD//wBkAZ0CtASCACIA1gAAAAMA1gFXAAAAAQBkATIDKwNDAAUAAAEhNSETIwJ9/ecCxgGuAlnq/e8AAAAABABk/+EF7gVqAA8AHwBCAEwAAAEyBBIVFAIEIyIkAjU0EiQXIgQCFRQSBDMyJBI1NAIkBSEyFhUUBgcTFhcWFxUjASMRHgEzFSE1MjY3NjURNCcuASMTMj4BNTQmIyIHAye1AVLAvP6vurf+r7u+AVSxof7IrawBNKapATWqrf7K/dQBgpGXZnfRJh4TIrj+2kwGLUT+kDApCAcDByYs7XdsOnJWKC0Farb+qre6/q+7uwFRurcBVrY7qf7JqKn+zKurATSpqAE3qdWDXUt0H/7XNxIMBCIBlf7MIh0iIhYXEUwCCksOFhn+gy5UNFBvDwAA//8AZAW0Am0GngADABAAAANbAAAAAgBkAs4CUQWcAAMABwAAAREhEQUjETMCUf4TAWzi4gWc/TICznv+KAAAAP//AGQAAAMqBCEAIgAOAAAAAwDjAAD9pwABAGQCzgJRBZwACwAAARUhESE1ITUhESEVAlH+EwFs/pQB7f6dA0l7AaKxe/5fsgABAGQCzgJRBZwACwAAEzUhESE1ITUhNSE1ZAHt/hMBbP6UAWwFIXv9MnuydbEAAAABAGQFwAFhBpMAAwAAEwczN8pmlmcGk9PTAAAAAQBk/rUEQAPOAAkAAAEjEyERIREhESEBYf0CAQMBwwEU/SH+tQUZ/SgC2PwyAAAAAQBk/14D8AWoAA4AAAERIxEjESMRIAISPgEFFQOubU5+/rbHEp2WAkcFMfotAmv9lQJlAUQBV/xOEmUAAQBkAqEBeAOjAAMAAAERIREBeP7sA6P+/gECAAEAZP7IAT0AAAAMAAAXFTI+ASc3IwcVMhQGZE9sHmBIWklJGN5aHopISE5CMDAAAAEAZALOAO4FnAADAAATIxEz7oqKAs4CzgAAAAACAGQCzgJRBZwAAwAHAAABESERBSMRMwJR/hMBbOLiBZz9MgLOe/4oAAAA//8AZAGdArQEggAjANcBVwAAAAIA1wAAAAMAZP/9BVgFnAADAAcAEQAAKQEBIQEjETMBETMRMxEzESMRAXj+7AOqART8jYqKAbyK4oGBBZz9MgLO+44Bof7UASz9MgEtAAMAZAAABaAFnAADAAcAEwAAKQEBIQEjETMBFSERITUhNSERIRUBeP7sA6oBFPyNiooD8f4TAWz+lAHt/p0FnP0yAs764nsBorF7/l+yAAAAAwBk//0FlAWcAAMADQAZAAApAQEhAREzETMRMxEjEQE1IREhNSE1ITUhNQG0/uwDqgEU/kmK4oGB+1EB7f4TAWz+lAFsBZz7jgGh/tQBLP0yAS0D93v9MnuydbEAAAAAAgBkAAAEPgWcAAkADQAAAREhESEVIREhPQERIREEPv0pAtf8JgLGARQEJ/4y/p32A0PkcwEC/v4AAAD//wBkAAAEPgaTACIAJAAAAAMAQwFdAAD//wBkAAAEPgaTACIAJAAAAAMAdAGTAAD//wBkAAAEPgaUACIAJAAAAAMAwQEUAAD//wBkAAAEPga2ACIAJAAAAAMAyADYAAD//wBkAAAEPgarACIAJAAAAAMAaQCiAAD//wBkAAAEPgafACIAJAAAAAMAxgFXAAAAAgBkAAAHDwWcAA8AEwAAASERIREhFSERIRUhESEVIRkBIREDNf5D/uwGq/06Asb9OgLG/Cb+QwJZ/acFnPb+ner+nfYDQwFj/p0A//8AZP7IBD4FnAAiACYAAAADAHgBewAA//8AZAAABD4GkwAiACgAAAADAEMBbwAA//8AZAAABD4GkwAiACgAAAADAHQBkwAA//8AZAAABD4GlAAiACgAAAADAMEBIAAA//8AZAAABD4GqwAiACgAAAADAGkAnAAA//8AZAAAAXgGkwAiACwAAAACAEMAAAAA//8AZAAAAX8GkwAiACwAAAACAHQeAAAA//8AZAAAAgkGlAAiACxCAAACAMEAAAAA//8AZAAAAxEGqwAjACwAxgAAAAIAaQAAAAIAZAAABMIFnAAHABEAAAERIREhETMVJREhFxEHIREjNQH8AcP+PYP+aQNyaGf8jYQCWf6dA7D+nerqAll++2B+AlnqAAAA//8AZAAABD4GtgAiADEAAAADAMgA6gAA//8AZAAABD4GkwAiADIAAAADAEMBPwAA//8AZAAABD4GkwAiADIAAAADAHQBhwAA//8AZAAABD4GlAAiADIAAAADAMEBGgAA//8AZAAABD4GtgAiADIAAAADAMgAzAAA//8AZAAABD4GqwAiADIAAAADAGkAkAAAAAEAZAHsAxMEjAALAAABFwcnByc3JzcXNxcCX7Sms7GlsJ2mnaClA0a0prSwpbGdpZ2hpgADAGT/QATIBkoAAgAFABEAACUhEQkBISUzESEHITcjESE3IQJGAT3+PQEu/tICthD9TFr+7FoSArZSART2AqH+jQKC9vpkwMAFnK7//wBkAAAEPgaTACMAQwFdAAAAAgA4AAD//wBkAAAEPgaTACIAOAAAAAMAdAGNAAD//wBkAAAEPgaUACIAOAAAAAMAwQEaAAD//wBkAAAEPgarACIAOAAAAAMAaQCKAAD//wBkAAAEPgaTACIAPAAAAAMAdAGBAAAAAgBkAAAEPgWcAAkADQAAASERIRUzFSERIREhESEBeALG/ToD/ukBFAHD/j0Egvy9SfYFnPyNAWMAAAD//wBkAAAI4AWcACMANgSiAAAAAgA2AAD//wBkAAAEPgaTAAIAgAAA//8AZAAABD4GkwACAIEAAP//AGQAAAQ+BpQAAgCCAAD//wBkAAAEPga2AAIAgwAA//8AZAAABD4GqwACAIQAAP//AGQAAAQ+Bp8AAgCFAAD//wBkAAAHDwWcAAIAhgAA//8AZP7IBD4FnAACAIcAAP//AGQAAAQ+BpMAAgCIAAD//wBkAAAEPgaTAAIAiQAA//8AZAAABD4GlAACAIoAAP//AGQAAAQ+BqsAAgCLAAD//wBkAAABeAaTAAIAjAAA//8AZAAAAX8GkwACAI0AAP//AGQAAAIJBpQAAgCOAAD//wBkAAADEQarAAIAjwAA//8AZAAABMIFnAACAJAAAP//AGQAAAQ+BrYAAgCRAAD//wBkAAAEPgaTAAIAkgAA//8AZAAABD4GkwACAJMAAP//AGQAAAQ+BpQAAgCUAAD//wBkAAAEPga2AAIAlQAA//8AZAAABD4GqwACAJYAAAADAGQA9wMqBJoAAwAHAAsAABMhFSEBESERAREhEWQCxv06AfP+7AEU/uwDQ+oCQf7+AQL9X/7+AQIAAP//AGT/QATIBkoAAgCYAAD//wBkAAAEPgaTAAIAmQAA//8AZAAABD4GkwACAJoAAP//AGQAAAQ+BpQAAgCbAAD//wBkAAAEPgarAAIAnAAA//8AZAAABD4GkwACAJ0AAP//AGQAAAQ+BZwAAgCeAAD//wBkAAAEPgarACIAPAAAAAMAaQCQAAD//wBkAAABeAWcAAIALAAAAAEAZAXAAgkGlAAIAAABMycjFSMHMzcBc5Zml0Jmlj0FwdMB03wAAAABAGQFwAIJBpQACAAAEyMXMzUzNyMH+pZml0Jmlj0Gk9MB03wAAAD//wBkBbQCbQaeAAIAbwAAAAEAZAXAAgkGlAAGAAATIxY2NyMG+pZm2WaWNwaT0wHTpgAAAAEAZAWoAXgGqgADAAABESERAXj+7Aaq/v4BAgACAGQFqAFaBp8ACwAXAAAAFhUUBiMiJjU0NjMVIgYVFBYzMjY1NCYBEkhIMzNISDMXIiIXGCEhBp9JMzNISDMzSUIiGBciIhcYIgAAAQBk/vIBkAAAAAcAADsBHgE3FSImZJAGKmxgojBsBnhsAAAAAQBkBXYCjwa2AAcAABMXNhY3JwYmZEJU/5ZObsMGNX9iorNjaJIA//8AZAXAAmoGkwAiAHQAAAADAHQBCQAAAAEAZAJZBDYDQwADAAATIRUhZAPS/C4DQ+oAAAABAGQCWQY0A0MAAwAAEyEVIWQF0PowA0PqAAAAAQBkA6oBeAWcAAYAAAEjJxEhESMBcJxwARR7A6rwAQL+/gAAAQBkA6oBeAWcAAYAABMjESERByPfewEUcJwEmgEC/v7wAAD//wBk/xABeAECAAIADwAA//8AZAOqAu0FnAAiAMwAAAADAMwBdQAA//8AZAOqAu0FnAAiAM0AAAADAM0BdQAA//8AZP8QAu0BAgAjAM4BdQAAAAIAzgAAAAEAZP9kA78GewALAAABITUhETMRIRUhESMB2P6MAXSQAVf+qZAEBJEB5v4akftgAAEAZP9kA78GewATAAABITUhETMRIRUhESEVIREjESE1IQHY/owBdJABV/6pAVf+qZD+jAF0BASRAeb+GpH9/JH99QILkQAAAAEAZAHnAksDzQALAAAAFhUUBiMiJjU0NjMBvI+PZWSPj2QDzY5lZY6OZWWOAAAA//8AZAAABOUBAwAiABEAAAAjABEBvQAAAAMAEQNtAAEAAQBkAZ0BXQSCAAYAAAEnNxEHERcBXXVz9/kCfIV4AQnf/tTaAAAAAAEAZAGdAV0EggAGAAATNxEnERcHZPn3c3UBndoBLN/+93iFAAEAZAAABSIFnAADAAApAQEhAXj+7AOqARQFnP//AGQAAAjgBZwAIwA1BKIAAAACACkAAAABAGQAAAQ+BZwAGwAAARUhFSE1MzUjNTM1IzUzESERITUhFTMVIxUzFQIVAin8Jp2ampqaAz3+/f7asbGxAbfB9vbB3kjqAdX+RMbf6kje//8AZAAADYIFnAAiADMAAAAjADcEogAAAAMANglEAAAAAQBkAAAE1wWcABcAABMRIRUhFTMVIxUzFSMVIRUhESM1MzUjNf0D2v06srKysgLG/CaZmZkDxwHV9t/qSN7B9gG33kjqAAD//wBkAAAKvAWcACIAMQAAACMAMgSiAAAAAwARCUQAAAACAGQCzgS/BZwABwAUAAABIzUhFSMRIyEjETMbATMRIxEDIwMBH7sB7aiKAgGKioySgYFlUWgFIXt7/a0Czv53AYn9MgEt/tMBLQAAAgBkAAAEPgWcAAcACwAAEzUhESERIREBESERZAPa/CYC1/49AcMEpvb6ZANDAWP9s/6dAWMAAAACAGQAAAQ+BZwAAgAGAAABCwEJASEBAwOzpf65AVEBUAE5AQcDSvy2/vkFnPpkAAABAGT/ZAO/BnsABwAAExEjESERIxH0kANbkAXq+XoHF/jpBoYAAAAAAQBk/2QDvwZ7AAsAABMhFSEJASEVITUJAWQDW/01AWn+lwLL/KUBb/6RBnuR/Qn9CJedAusC+QABAGQCWQMqA0MAAwAAEyEVIWQCxv06A0PqAAAAAQBk/v4ECwVyAAYAAAEHATMBIwEBM88BBt4Bw9P+mAKnAvxZBnT7DAAAAAADAGQBvAWaBKAACwAXADMAAAEiBhUUFjMyNjU0JgUiBhUUFjMyNjU0JgEGBwYjIiY1NDYzMhcWFzY3NjMyFhUUBiMiJyYB01h7e1hXe3sB/Fd8fFdXe3v+ghAUbJma2NiamWwUEBEUbJmZ2NiZmWwVBAR8V1d7e1dXfAF7V1d7e1dXe/5PFRRs2JmZ2WwVFRUUbNiZmdltFAAAAAABAGT/QAJFBeQAEQAAFxUWPgEQAj4BMzUOAxEUBmQ8kWYMHlpCWoQqKkMenAYqWgEOA9SQBqgGDGZI+6KEZgD//wBkAX0DEQQ6ACMAYQAAAIQAAwBhAAD/QAAA//8AZAAAAyoFBQAjAOMAAP2nAAIAHwAA//8AZAAAAyoFBQAjAOMAAP2nAAIAIQAA//8AZAAABhoFnAAiACkAAAADACwEogAA//8AZAAACOAFnAAjAC8EogAAAAIAKQAAAAAAAQAAAMIAAQAeAGAABABUACkAD/3YACkAEf3YAC8AN/8TAC8AOf9xAC8AOv+wAC8APP8yAC8AXP8yAC8Azf3YADMAD/3YADMAEf3YADcAD/9SADcAEP9SADcAEf9SADcAHf9SADcAHv9SADkAD/+wADkAEf+wADoAD//MADoAEf/MADwAD/8yADwAEP9xADwAEf8yADwAHf+RADwAHv+RAFkAD/+wAFkAEf+wAFoAD//MAFoAEf/MAFwAD/8yAFwAEf8yAAAAAAAoAeYAAQAAAAAAAAAvAAAAAQAAAAAAAQAKADYAAQAAAAAAAgAHAC8AAQAAAAAAAwAXADYAAQAAAAAABAAKADYAAQAAAAAABQArAE0AAQAAAAAABgAKADYAAQAAAAAACgA/AHgAAwABBAMAAgAMApEAAwABBAUAAgAQALcAAwABBAYAAgAMAMcAAwABBAcAAgAQANMAAwABBAgAAgAQAOMAAwABBAkAAABeAPMAAwABBAkAAQAUAV8AAwABBAkAAgAOAVEAAwABBAkAAwAuAV8AAwABBAkABAAUAV8AAwABBAkABQBWAY0AAwABBAkABgAUAV8AAwABBAkACgB+AeMAAwABBAoAAgAMApEAAwABBAsAAgAQAmEAAwABBAwAAgAMApEAAwABBA4AAgAMAq8AAwABBBAAAgAOAnEAAwABBBMAAgASAn8AAwABBBQAAgAMApEAAwABBBUAAgAQApEAAwABBBYAAgAMApEAAwABBBkAAgAOAqEAAwABBBsAAgAQAq8AAwABBB0AAgAMApEAAwABBB8AAgAMApEAAwABBCQAAgAOAr8AAwABBC0AAgAOAs0AAwABCAoAAgAMApEAAwABCBYAAgAMApEAAwABDAoAAgAMApEAAwABDAwAAgAMApFUeXBlZmFjZSCpIEJvdSBGb250cy4gMjAxMS4gQWxsIFJpZ2h0cyBSZXNlcnZlZFJlZ3VsYXJTcXVhcmVGb250OlZlcnNpb24gMS4wMFZlcnNpb24gMS4wMCBKdWx5IDI0LCAyMDExLCBpbml0aWFsIHJlbGVhc2VUaGlzIGZvbnQgd2FzIGNyZWF0ZWQgdXNpbmcgRm9udENyZWF0b3IgNi4wIGZyb20gSGlnaC1Mb2dpYy5jb20AbwBiAHkBDQBlAGoAbgDpAG4AbwByAG0AYQBsAFMAdABhAG4AZABhAHIAZAOaA7EDvQO/A70DuQO6A6wAVAB5AHAAZQBmAGEAYwBlACAAqQAgAEIAbwB1ACAARgBvAG4AdABzAC4AIAAyADAAMQAxAC4AIABBAGwAbAAgAFIAaQBnAGgAdABzACAAUgBlAHMAZQByAHYAZQBkAFIAZQBnAHUAbABhAHIAUwBxAHUAYQByAGUARgBvAG4AdAA6AFYAZQByAHMAaQBvAG4AIAAxAC4AMAAwAFYAZQByAHMAaQBvAG4AIAAxAC4AMAAwACAASgB1AGwAeQAgADIANAAsACAAMgAwADEAMQAsACAAaQBuAGkAdABpAGEAbAAgAHIAZQBsAGUAYQBzAGUAVABoAGkAcwAgAGYAbwBuAHQAIAB3AGEAcwAgAGMAcgBlAGEAdABlAGQAIAB1AHMAaQBuAGcAIABGAG8AbgB0AEMAcgBlAGEAdABvAHIAIAA2AC4AMAAgAGYAcgBvAG0AIABIAGkAZwBoAC0ATABvAGcAaQBjAC4AYwBvAG0ATgBvAHIAbQBhAGEAbABpAE4AbwByAG0AYQBsAGUAUwB0AGEAbgBkAGEAYQByAGQATgBvAHIAbQBhAGwAbgB5BB4EMQRLBEcEPQRLBDkATgBvAHIAbQDhAGwAbgBlAE4AYQB2AGEAZABuAG8AQQByAHIAdQBuAHQAYQAAAAACAAAAAAAA/ycAlgAAAAAAAAAAAAAAAAAAAAAAAAAAAOwAAAABAAIAAwAEAAUABgAHAAgACQAKAAsADAANAA4ADwAQABEAEgATABQAFQAWABcAGAAZABoAGwAcAB0AHgAfACAAIQAiACMAJAAlACYAJwAoACkAKgArACwALQAuAC8AMAAxADIAMwA0ADUANgA3ADgAOQA6ADsAPAA9AD4APwBAAEEAQgBDAEQARQBGAEcASABJAEoASwBMAE0ATgBPAFAAUQBSAFMAVABVAFYAVwBYAFkAWgBbAFwAXQBeAF8AYABhAKMAhACFAL0AlgDoAIYAjgCLAJ0AqQCkAIoA2gCDAJMBAgEDAI0AlwCIAMMA3gEEAJ4AqgD1APQA9gCiAK0AyQDHAK4AYgBjAJAAZADLAGUAyADKAM8AzADNAM4A6QBmANMA0ADRAK8AZwDwAJEA1gDUANUAaADrAO0AiQBqAGkAawBtAGwAbgCgAG8AcQBwAHIAcwB1AHQAdgB3AOoAeAB6AHkAewB9AHwAuAChAH8AfgCAAIEA7ADuALoA1wDYAOEBBQDbANwA3QDgANkA3wCyALMAtgC3AMQAtAC1AMUAggDCAIcAqwC+AL8AvAD3AQYBBwEIAQkAjACYAKgAmgCZAO8ApQCSAJwApwCUAJUBCgELB3VuaTAwQjIHdW5pMDBCMwd1bmkwMEI5B3VuaTAyQzkEbGlyYQZwZXNldGEERXVybwlhZmlpNjEzNTIHdW5pRjAwMQd1bmlGMDAyAAAAAAAAAf//AAI=");
var ArrayBuffer = $global.ArrayBuffer || js_html_compat_ArrayBuffer;
if(ArrayBuffer.prototype.slice == null) ArrayBuffer.prototype.slice = js_html_compat_ArrayBuffer.sliceImpl;
var DataView = $global.DataView || js_html_compat_DataView;
var Float32Array = $global.Float32Array || js_html_compat_Float32Array._new;
var Uint8Array = $global.Uint8Array || js_html_compat_Uint8Array._new;
h3d_Buffer.GUID = 0;
h3d_impl_GlDriver.TFILTERS = [[[9728,9728],[9729,9729]],[[9728,9984],[9729,9985]],[[9728,9986],[9729,9987]]];
h3d_impl_GlDriver.TWRAP = [33071,10497];
h3d_impl_GlDriver.FACES = [0,1028,1029,1032];
h3d_impl_GlDriver.BLEND = [1,0,770,768,772,774,771,769,773,775,32769,32771,32770,32772,776];
h3d_impl_GlDriver.COMPARE = [519,512,514,517,516,518,513,515];
h3d_impl_GlDriver.OP = [32774,32778,32779];
h3d_impl_MemoryManager.ALL_FLAGS = Type.allEnums(h3d_BufferFlag);
h3d_mat_Defaults.defaultKillAlphaThreshold = 0.5;
h3d_mat_Defaults.loadingTextureColor = -65281;
h3d_mat_Texture.UID = 0;
h3d_mat_Texture.nativeFormat = hxd_PixelFormat.RGBA;
h3d_mat_Texture.COLOR_CACHE = new haxe_ds_IntMap();
haxe_Unserializer.DEFAULT_RESOLVER = Type;
haxe_Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
h3d_pass_Blur.__meta__ = { obj : { ignore : ["shader"]}, fields : { quality : { range : [1,4,1], inspect : null}, sigma : { range : [0,2], inspect : null}, passes : { range : [0,5,1], inspect : null}}};
h3d_pass__$Border_BorderShader.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:5:0y4:namey8:positiony4:typejy9:hxsl.Type:5:2i4jy12:hxsl.VecType:1:0y6:parentoR6r10R8y6:outputR10jR11:12:1ar9oR6r10R8y5:colorR10jR11:5:2i4r11R13r13y2:idi-188ghR16i-186gR16i-187gy1:poy4:filey61:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fpass%2FBorder.hxy3:maxi295y3:mini280gy1:tr12goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:40:0R17oR18R19R20i302R21i298gR22jR11:13:1ahgaoR3jR4:1:1oR6jR7:1:0R8R9R10jR11:5:2i2r11R13oR6r30R8y5:inputR10jR11:12:1ar29hR16i-184gR16i-185gR17oR18R19R20i317R21i303gR22r31goR3jR4:0:1jy10:hxsl.Const:3:1zR17oR18R19R20i320R21i319gR22jR11:3:0goR3jR4:0:1jR25:3:1i1R17oR18R19R20i323R21i322gR22r41ghR17oR18R19R20i324R21i298gR22jR11:5:2i4r11gR17oR18R19R20i324R21i280gR22r12ghR17oR18R19R20i330R21i274gR22jR11:0:0gR6jy17:hxsl.FunctionKind:0:0y3:refoR6jR7:6:0R8y6:vertexR10jR11:13:1aoR1ahy3:retr53ghR16i-189gR29r53goR1ahR2oR3jR4:4:1aoR3jR4:5:3r7oR3jR4:1:1r15R17oR18R19R20i374R21i362gR22r16goR3jR4:1:1oR6jR7:2:0R8R15R10jR11:5:2i4r11R16i-183gR17oR18R19R20i382R21i377gR22r72gR17oR18R19R20i382R21i362gR22r16ghR17oR18R19R20i388R21i356gR22r53gR6jR26:1:0R27oR6r56R8y8:fragmentR10jR11:13:1aoR1ahR29r53ghR16i-190gR29r53ghR8y29:h3d.pass._Border.BorderShadery4:varsar55r80r13r32r70hg";
h3d_shader_ScreenShader.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:5:0y4:namey8:positiony4:typejy9:hxsl.Type:5:2i4jy12:hxsl.VecType:1:0y6:parentoR6r10R8y6:outputR10jR11:12:1ar9oR6r10R8y5:colorR10jR11:5:2i4r11R13r13y2:idi-92ghR16i-90gR16i-91gy1:poy4:filey69:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FScreenShader.hxy3:maxi262y3:mini247gy1:tr12goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:40:0R17oR18R19R20i269R21i265gR22jR11:13:1ahgaoR3jR4:1:1oR6jR7:1:0R8R9R10jR11:5:2i2r11R13oR6r30R8y5:inputR10jR11:12:1ar29oR6r30R8y2:uvR10jR11:5:2i2r11R13r32R16i-89ghR16i-87gR16i-88gR17oR18R19R20i284R21i270gR22r31goR3jR4:0:1jy10:hxsl.Const:3:1zR17oR18R19R20i287R21i286gR22jR11:3:0goR3jR4:0:1jR26:3:1i1R17oR18R19R20i290R21i289gR22r43ghR17oR18R19R20i291R21i265gR22jR11:5:2i4r11gR17oR18R19R20i291R21i247gR22r12ghR17oR18R19R20i297R21i241gR22jR11:0:0gR6jy17:hxsl.FunctionKind:0:0y3:refoR6jR7:6:0R8y6:vertexR10jR11:13:1aoR1ahy3:retr55ghR16i-93gR30r55ghR8y23:h3d.shader.ScreenShadery4:varsar57r13r32hg";
h3d_pass_ColorMatrixShader.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:5:0y4:namey8:positiony4:typejy9:hxsl.Type:5:2i4jy12:hxsl.VecType:1:0y6:parentoR6r10R8y6:outputR10jR11:12:1ar9oR6r10R8y5:colorR10jR11:5:2i4r11R13r13y2:idi-99ghR16i-97gR16i-98gy1:poy4:filey69:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FScreenShader.hxy3:maxi262y3:mini247gy1:tr12goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:40:0R17oR18R19R20i269R21i265gR22jR11:13:1ahgaoR3jR4:1:1oR6jR7:1:0R8R9R10jR11:5:2i2r11R13oR6r30R8y5:inputR10jR11:12:1ar29oR6r30R8y2:uvR10jR11:5:2i2r11R13r32R16i-96ghR16i-94gR16i-95gR17oR18R19R20i284R21i270gR22r31goR3jR4:0:1jy10:hxsl.Const:3:1zR17oR18R19R20i287R21i286gR22jR11:3:0goR3jR4:0:1jR26:3:1i1R17oR18R19R20i290R21i289gR22r43ghR17oR18R19R20i291R21i265gR22jR11:5:2i4r11gR17oR18R19R20i291R21i247gR22r12ghR17oR18R19R20i297R21i241gR22jR11:0:0gR6jy17:hxsl.FunctionKind:0:0y3:refoR6jR7:6:0R8y6:vertexR10jR11:13:1aoR1ahy3:retr55ghR16i-111gR30r55goR1ahR2oR3jR4:4:1aoR3jR4:10:3oR3jR4:1:1oR6jR7:2:0R8y7:useMaskR10jR11:2:0y10:qualifiersajy17:hxsl.VarQualifier:0:1nhR16i-102gR17oR18y66:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fpass%2FColorMatrix.hxR20i504R21i497gR22r71goR3jR4:4:1aoR3jR4:7:2oR6jR7:4:0R8R15R10jR11:5:2i4r11R16i-113goR3jR4:8:2oR3jR4:2:1jR23:33:0R17oR18R34R20i533R21i526gR22jR11:13:1aoR1aoR8y1:_R10jR11:10:0goR8y1:bR10jR11:5:2i2r11ghR30r81ghgaoR3jR4:1:1oR6r70R8y7:textureR10r91R16i-100gR17oR18R34R20i533R21i526gR22r91goR3jR4:1:1r34R17oR18R34R20i546R21i538gR22r35ghR17oR18R34R20i547R21i526gR22r81gR17oR18R34R20i548R21i514gR22r55goR3jR4:7:2oR6r80R8R25R10jR11:5:2i3r11R16i-114goR3jR4:8:2oR3jR4:2:1jR23:39:0R17oR18R34R20i567R21i563gR22jR11:13:1ahgaoR3jR4:1:1r34R17oR18R34R20i576R21i568gR22r35goR3jR4:0:1jR26:3:1i1R17oR18R34R20i579R21i578gR22r43ghR17oR18R34R20i580R21i563gR22r109gR17oR18R34R20i581R21i554gR22r55goR3jR4:7:2oR6r80R8y1:kR10r43R16i-115goR3jR4:8:2oR3jR4:2:1jR23:8:0R17oR18R34R20i598R21i595gR22jR11:13:1aoR1aoR8y1:aR10r43goR8R36R10r43ghR30r43ghgaoR3jR4:8:2oR3jR4:2:1jR23:29:0R17oR18R34R20i651R21i599gR22jR11:13:1aoR1aoR8R35R10r81goR8R36R10r81ghR30r43ghgaoR3jR4:8:2oR3jR4:2:1r84R17oR18R34R20i603R21i599gR22jR11:13:1aoR1aoR8R35R10r91gr92hR30r81ghgaoR3jR4:1:1oR6r70R8y4:maskR10r91R16i-106gR17oR18R34R20i603R21i599gR22r91goR3jR4:8:2oR3jR4:2:1jR23:38:0R17oR18R34R20i613R21i609gR22jR11:13:1ahgaoR3jR4:8:2oR3jR4:2:1r145R17oR18R34R20i616R21i614gR22jR11:13:1aoR1aoR8R35R10r109goR8R36R10jR11:5:2i3r11ghR30r43ghgaoR3jR4:1:1r108R17oR18R34R20i616R21i614gR22r109goR3jR4:1:1oR6r70R8y8:maskMatAR10jR11:5:2i3r11R16i-107gR17oR18R34R20i629R21i621gR22r194ghR17oR18R34R20i630R21i614gR22r43goR3jR4:8:2oR3jR4:2:1r145R17oR18R34R20i634R21i632gR22jR11:13:1aoR1aoR8R35R10r109gr185hR30r43ghgaoR3jR4:1:1r108R17oR18R34R20i634R21i632gR22r109goR3jR4:1:1oR6r70R8y8:maskMatBR10jR11:5:2i3r11R16i-108gR17oR18R34R20i647R21i639gR22r214ghR17oR18R34R20i648R21i632gR22r43ghR17oR18R34R20i649R21i609gR22jR11:5:2i2r11ghR17oR18R34R20i651R21i599gR22r81goR3jR4:1:1oR6r70R8y11:maskChannelR10jR11:5:2i4r11R16i-110gR17oR18R34R20i667R21i656gR22r226ghR17oR18R34R20i668R21i599gR22r43goR3jR4:1:1oR6r70R8y9:maskPowerR10r43R16i-109gR17oR18R34R20i679R21i670gR22r43ghR17oR18R34R20i680R21i595gR22r43gR17oR18R34R20i681R21i587gR22r55goR3jR4:7:2oR6r80R8y6:color2R10r81R16i-116goR3jR4:10:3oR3jR4:1:1oR6r70R8y15:hasSecondMatrixR10r71R32ajR33:0:1nhR16i-104gR17oR18R34R20i715R21i700gR22r71goR3jR4:5:3jR5:1:0oR3jR4:1:1r79R17oR18R34R20i723R21i718gR22r81goR3jR4:1:1oR6r70R8y7:matrix2R10jR11:7:0R16i-105gR17oR18R34R20i733R21i726gR22r255gR17oR18R34R20i733R21i718gR22r81goR3jR4:1:1r79R17oR18R34R20i741R21i736gR22r81gR17oR18R34R20i741R21i700gR22r81gR17oR18R34R20i742R21i687gR22r55goR3jR4:5:3r7oR3jR4:1:1r15R17oR18R34R20i760R21i748gR22r16goR3jR4:10:3oR3jR4:1:1oR6r70R8y10:maskInvertR10r71R32ajR33:0:1nhR16i-103gR17oR18R34R20i773R21i763gR22r71goR3jR4:8:2oR3jR4:2:1jR23:24:0R17oR18R34R20i779R21i776gR22jR11:13:1aoR1aoR8y1:xR10r81goR8y1:yR10r81goR8R39R10r43ghR30r81ghgaoR3jR4:1:1r240R17oR18R34R20i786R21i780gR22r81goR3jR4:5:3r249oR3jR4:1:1r79R17oR18R34R20i793R21i788gR22r81goR3jR4:1:1oR6r70R8y6:matrixR10r255R16i-101gR17oR18R34R20i802R21i796gR22r255gR17oR18R34R20i802R21i788gR22r81goR3jR4:1:1r130R17oR18R34R20i805R21i804gR22r43ghR17oR18R34R20i806R21i776gR22r81goR3jR4:8:2oR3jR4:2:1r280R17oR18R34R20i812R21i809gR22jR11:13:1ar284hgaoR3jR4:5:3r249oR3jR4:1:1r79R17oR18R34R20i818R21i813gR22r81goR3jR4:1:1r299R17oR18R34R20i827R21i821gR22r255gR17oR18R34R20i827R21i813gR22r81goR3jR4:1:1r240R17oR18R34R20i835R21i829gR22r81goR3jR4:1:1r130R17oR18R34R20i838R21i837gR22r43ghR17oR18R34R20i839R21i809gR22r81gR17oR18R34R20i839R21i763gR22r81gR17oR18R34R20i839R21i748gR22r16ghR17oR18R34R20i846R21i507gR22r55goR3jR4:5:3r7oR3jR4:1:1r15R17oR18R34R20i869R21i857gR22r16goR3jR4:5:3r249oR3jR4:8:2oR3jR4:2:1r84R17oR18R34R20i879R21i872gR22jR11:13:1aoR1aoR8R35R10r91gr92hR30r81ghgaoR3jR4:1:1r97R17oR18R34R20i879R21i872gR22r91goR3jR4:1:1r34R17oR18R34R20i892R21i884gR22r35ghR17oR18R34R20i893R21i872gR22r81goR3jR4:1:1r299R17oR18R34R20i902R21i896gR22r255gR17oR18R34R20i902R21i872gR22r81gR17oR18R34R20i902R21i857gR22r16gR17oR18R34R20i902R21i493gR22r55ghR17oR18R34R20i908R21i487gR22r55gR6jR27:1:0R28oR6r58R8y8:fragmentR10jR11:13:1aoR1ahR30r55ghR16i-112gR30r55ghR8y26:h3d.pass.ColorMatrixShadery4:varsar273r57r166r213r374r97r243r299r13r254r32r69r225r232r193hg";
h3d_pass__$Copy_CopyShader.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:5:0y4:namey8:positiony4:typejy9:hxsl.Type:5:2i4jy12:hxsl.VecType:1:0y6:parentoR6r10R8y6:outputR10jR11:12:1ar9oR6r10R8y5:colorR10jR11:5:2i4r11R13r13y2:idi-175ghR16i-173gR16i-174gy1:poy4:filey69:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FScreenShader.hxy3:maxi262y3:mini247gy1:tr12goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:40:0R17oR18R19R20i269R21i265gR22jR11:13:1ahgaoR3jR4:1:1oR6jR7:1:0R8R9R10jR11:5:2i2r11R13oR6r30R8y5:inputR10jR11:12:1ar29oR6r30R8y2:uvR10jR11:5:2i2r11R13r32R16i-172ghR16i-170gR16i-171gR17oR18R19R20i284R21i270gR22r31goR3jR4:0:1jy10:hxsl.Const:3:1zR17oR18R19R20i287R21i286gR22jR11:3:0goR3jR4:0:1jR26:3:1i1R17oR18R19R20i290R21i289gR22r43ghR17oR18R19R20i291R21i265gR22jR11:5:2i4r11gR17oR18R19R20i291R21i247gR22r12ghR17oR18R19R20i297R21i241gR22jR11:0:0gR6jy17:hxsl.FunctionKind:0:0y3:refoR6jR7:6:0R8y6:vertexR10jR11:13:1aoR1ahy3:retr55ghR16i-179gR30r55goR1ahR2oR3jR4:4:1aoR3jR4:5:3r7oR3jR4:1:1oR6jR7:4:0R8y12:calculatedUVR10jR11:5:2i2r11R16i-178gR17oR18y59:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fpass%2FCopy.hxR20i237R21i225gR22r71goR3jR4:1:1r34R17oR18R32R20i248R21i240gR22r35gR17oR18R32R20i248R21i225gR22r71ghR17oR18R32R20i254R21i219gR22r55gR6jR27:2:0R28oR6r58R8y8:__init__R10jR11:13:1aoR1ahR30r55ghR16i-180gR30r55goR1ahR2oR3jR4:4:1aoR3jR4:5:3r7oR3jR4:1:1oR6r70R8y10:pixelColorR10jR11:5:2i4r11R16i-177gR17oR18R32R20i304R21i294gR22r94goR3jR4:8:2oR3jR4:2:1jR23:33:0R17oR18R32R20i314R21i307gR22jR11:13:1aoR1aoR8y1:_R10jR11:10:0goR8y1:bR10jR11:5:2i2r11ghR30jR11:5:2i4r11ghgaoR3jR4:1:1oR6jR7:2:0R8y7:textureR10r106R16i-176gR17oR18R32R20i314R21i307gR22r106goR3jR4:1:1r69R17oR18R32R20i331R21i319gR22r71ghR17oR18R32R20i332R21i307gR22r109gR17oR18R32R20i332R21i294gR22r94ghR17oR18R32R20i338R21i288gR22r55gR6r81R28oR6r58R8y16:__init__fragmentR10jR11:13:1aoR1ahR30r55ghR16i-181gR30r55goR1ahR2oR3jR4:4:1aoR3jR4:5:3r7oR3jR4:1:1r15R17oR18R32R20i382R21i370gR22r16goR3jR4:1:1r93R17oR18R32R20i395R21i385gR22r94gR17oR18R32R20i395R21i370gR22r16ghR17oR18R32R20i401R21i364gR22r55gR6jR27:1:0R28oR6r58R8y8:fragmentR10jR11:13:1aoR1ahR30r55ghR16i-182gR30r55ghR8y25:h3d.pass._Copy.CopyShadery4:varsar69r57r82r147r113r126r13r32r93hg";
h3d_pass_Default.__meta__ = { fields : { cameraView : { global : ["camera.view"]}, cameraNear : { global : ["camera.zNear"]}, cameraFar : { global : ["camera.zFar"]}, cameraProj : { global : ["camera.proj"]}, cameraPos : { global : ["camera.position"]}, cameraProjDiag : { global : ["camera.projDiag"]}, cameraViewProj : { global : ["camera.viewProj"]}, cameraInverseViewProj : { global : ["camera.inverseViewProj"]}, globalTime : { global : ["global.time"]}, pixelSize : { global : ["global.pixelSize"]}, globalModelView : { global : ["global.modelView"]}, globalModelViewInverse : { global : ["global.modelViewInverse"]}}};
h3d_pass__$FXAA_FXAAShader.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:5:0y4:namey8:positiony4:typejy9:hxsl.Type:5:2i4jy12:hxsl.VecType:1:0y6:parentoR6r10R8y6:outputR10jR11:12:1ar9oR6r10R8y5:colorR10jR11:5:2i4r11R13r13y2:idi-237ghR16i-235gR16i-236gy1:poy4:filey69:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FScreenShader.hxy3:maxi262y3:mini247gy1:tr12goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:40:0R17oR18R19R20i269R21i265gR22jR11:13:1ahgaoR3jR4:1:1oR6jR7:1:0R8R9R10jR11:5:2i2r11R13oR6r30R8y5:inputR10jR11:12:1ar29oR6r30R8y2:uvR10jR11:5:2i2r11R13r32R16i-234ghR16i-232gR16i-233gR17oR18R19R20i284R21i270gR22r31goR3jR4:0:1jy10:hxsl.Const:3:1zR17oR18R19R20i287R21i286gR22jR11:3:0goR3jR4:0:1jR26:3:1i1R17oR18R19R20i290R21i289gR22r43ghR17oR18R19R20i291R21i265gR22jR11:5:2i4r11gR17oR18R19R20i291R21i247gR22r12ghR17oR18R19R20i297R21i241gR22jR11:0:0gR6jy17:hxsl.FunctionKind:0:0y3:refoR6jR7:6:0R8y6:vertexR10jR11:13:1aoR1ahy3:retr55ghR16i-240gR30r55goR1ahR2oR3jR4:4:1aoR3jR4:7:2oR6jR7:4:0R8y3:tuvR10r35R16i-242goR3jR4:1:1r34R17oR18y59:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fpass%2FFXAA.hxR20i219R21i211gR22r35gR17oR18R32R20i220R21i201gR22r55goR3jR4:7:2oR6r69R8y2:nwR10jR11:5:2i3r11R16i-243goR3jR4:9:2oR3jR4:8:2oR3jR4:2:1jR23:33:0R17oR18R32R20i243R21i236gR22jR11:13:1aoR1aoR8y1:_R10jR11:10:0goR8y1:bR10jR11:5:2i2r11ghR30jR11:5:2i4r11ghgaoR3jR4:1:1oR6jR7:2:0R8y7:textureR10r88R16i-239gR17oR18R32R20i243R21i236gR22r88goR3jR4:5:3jR5:0:0oR3jR4:1:1r68R17oR18R32R20i251R21i248gR22r35goR3jR4:5:3jR5:1:0oR3jR4:8:2oR3jR4:2:1jR23:38:0R17oR18R32R20i258R21i254gR22jR11:13:1ahgaoR3jR4:0:1jR26:3:1i-1R17oR18R32R20i261R21i259gR22r43goR3jR4:0:1jR26:3:1i-1R17oR18R32R20i265R21i263gR22r43ghR17oR18R32R20i266R21i254gR22jR11:5:2i2r11goR3jR4:1:1oR6r96R8y5:deltaR10jR11:5:2i2r11R16i-238gR17oR18R32R20i274R21i269gR22r127gR17oR18R32R20i274R21i254gR22jR11:5:2i2r11gR17oR18R32R20i274R21i248gR22jR11:5:2i2r11ghR17oR18R32R20i275R21i236gR22r91gajy14:hxsl.Component:0:0jR38:1:0jR38:2:0hR17oR18R32R20i279R21i236gR22r77gR17oR18R32R20i280R21i227gR22r55goR3jR4:7:2oR6r69R8y2:neR10jR11:5:2i3r11R16i-244goR3jR4:9:2oR3jR4:8:2oR3jR4:2:1r81R17oR18R32R20i301R21i294gR22jR11:13:1aoR1aoR8R34R10r88gr89hR30r91ghgaoR3jR4:1:1r95R17oR18R32R20i301R21i294gR22r88goR3jR4:5:3r100oR3jR4:1:1r68R17oR18R32R20i309R21i306gR22r35goR3jR4:5:3r105oR3jR4:8:2oR3jR4:2:1r108R17oR18R32R20i316R21i312gR22r112gaoR3jR4:0:1jR26:3:1i1R17oR18R32R20i318R21i317gR22r43goR3jR4:0:1jR26:3:1i-1R17oR18R32R20i322R21i320gR22r43ghR17oR18R32R20i323R21i312gR22jR11:5:2i2r11goR3jR4:1:1r126R17oR18R32R20i331R21i326gR22r127gR17oR18R32R20i331R21i312gR22jR11:5:2i2r11gR17oR18R32R20i331R21i306gR22jR11:5:2i2r11ghR17oR18R32R20i332R21i294gR22r91gar139r140r141hR17oR18R32R20i336R21i294gR22r148gR17oR18R32R20i337R21i285gR22r55goR3jR4:7:2oR6r69R8y2:swR10jR11:5:2i3r11R16i-245goR3jR4:9:2oR3jR4:8:2oR3jR4:2:1r81R17oR18R32R20i358R21i351gR22jR11:13:1aoR1aoR8R34R10r88gr89hR30r91ghgaoR3jR4:1:1r95R17oR18R32R20i358R21i351gR22r88goR3jR4:5:3r100oR3jR4:1:1r68R17oR18R32R20i366R21i363gR22r35goR3jR4:5:3r105oR3jR4:8:2oR3jR4:2:1r108R17oR18R32R20i373R21i369gR22r112gaoR3jR4:0:1jR26:3:1i-1R17oR18R32R20i376R21i374gR22r43goR3jR4:0:1jR26:3:1i1R17oR18R32R20i379R21i378gR22r43ghR17oR18R32R20i380R21i369gR22jR11:5:2i2r11goR3jR4:1:1r126R17oR18R32R20i388R21i383gR22r127gR17oR18R32R20i388R21i369gR22jR11:5:2i2r11gR17oR18R32R20i388R21i363gR22jR11:5:2i2r11ghR17oR18R32R20i389R21i351gR22r91gar139r140r141hR17oR18R32R20i393R21i351gR22r202gR17oR18R32R20i394R21i342gR22r55goR3jR4:7:2oR6r69R8y2:seR10jR11:5:2i3r11R16i-246goR3jR4:9:2oR3jR4:8:2oR3jR4:2:1r81R17oR18R32R20i415R21i408gR22jR11:13:1aoR1aoR8R34R10r88gr89hR30r91ghgaoR3jR4:1:1r95R17oR18R32R20i415R21i408gR22r88goR3jR4:5:3r100oR3jR4:1:1r68R17oR18R32R20i423R21i420gR22r35goR3jR4:5:3r105oR3jR4:8:2oR3jR4:2:1r108R17oR18R32R20i430R21i426gR22r112gaoR3jR4:0:1jR26:3:1i1R17oR18R32R20i432R21i431gR22r43goR3jR4:0:1jR26:3:1i1R17oR18R32R20i435R21i434gR22r43ghR17oR18R32R20i436R21i426gR22jR11:5:2i2r11goR3jR4:1:1r126R17oR18R32R20i444R21i439gR22r127gR17oR18R32R20i444R21i426gR22jR11:5:2i2r11gR17oR18R32R20i444R21i420gR22jR11:5:2i2r11ghR17oR18R32R20i445R21i408gR22r91gar139r140r141hR17oR18R32R20i449R21i408gR22r256gR17oR18R32R20i450R21i399gR22r55goR3jR4:7:2oR6r69R8y3:midR10jR11:5:2i3r11R16i-247goR3jR4:9:2oR3jR4:8:2oR3jR4:2:1r81R17oR18R32R20i472R21i465gR22jR11:13:1aoR1aoR8R34R10r88gr89hR30r91ghgaoR3jR4:1:1r95R17oR18R32R20i472R21i465gR22r88goR3jR4:1:1r68R17oR18R32R20i480R21i477gR22r35ghR17oR18R32R20i481R21i465gR22r91gar139r140r141hR17oR18R32R20i485R21i465gR22r310gR17oR18R32R20i486R21i455gR22r55goR3jR4:7:2oR6r69R8y4:lumAR10jR11:5:2i3r11R16i-248goR3jR4:8:2oR3jR4:2:1jR23:39:0R17oR18R32R20i506R21i502gR22jR11:13:1ahgaoR3jR4:0:1jR26:3:1d0.299R17oR18R32R20i512R21i507gR22r43goR3jR4:0:1jR26:3:1d0.587R17oR18R32R20i519R21i514gR22r43goR3jR4:0:1jR26:3:1d0.114R17oR18R32R20i526R21i521gR22r43ghR17oR18R32R20i527R21i502gR22r337gR17oR18R32R20i528R21i491gR22r55goR3jR4:7:2oR6r69R8y5:lumNWR10r43R16i-249goR3jR4:8:2oR3jR4:2:1jR23:29:0R17oR18R32R20i547R21i545gR22jR11:13:1aoR1aoR8R34R10r77goR8R35R10jR11:5:2i3r11ghR30r43ghgaoR3jR4:1:1r76R17oR18R32R20i547R21i545gR22r77goR3jR4:1:1r336R17oR18R32R20i556R21i552gR22r337ghR17oR18R32R20i557R21i545gR22r43gR17oR18R32R20i558R21i533gR22r55goR3jR4:7:2oR6r69R8y5:lumNER10r43R16i-250goR3jR4:8:2oR3jR4:2:1r366R17oR18R32R20i577R21i575gR22jR11:13:1aoR1aoR8R34R10r148gr373hR30r43ghgaoR3jR4:1:1r147R17oR18R32R20i577R21i575gR22r148goR3jR4:1:1r336R17oR18R32R20i586R21i582gR22r337ghR17oR18R32R20i587R21i575gR22r43gR17oR18R32R20i588R21i563gR22r55goR3jR4:7:2oR6r69R8y5:lumSWR10r43R16i-251goR3jR4:8:2oR3jR4:2:1r366R17oR18R32R20i607R21i605gR22jR11:13:1aoR1aoR8R34R10r202gr373hR30r43ghgaoR3jR4:1:1r201R17oR18R32R20i607R21i605gR22r202goR3jR4:1:1r336R17oR18R32R20i616R21i612gR22r337ghR17oR18R32R20i617R21i605gR22r43gR17oR18R32R20i618R21i593gR22r55goR3jR4:7:2oR6r69R8y5:lumSER10r43R16i-252goR3jR4:8:2oR3jR4:2:1r366R17oR18R32R20i637R21i635gR22jR11:13:1aoR1aoR8R34R10r256gr373hR30r43ghgaoR3jR4:1:1r255R17oR18R32R20i637R21i635gR22r256goR3jR4:1:1r336R17oR18R32R20i646R21i642gR22r337ghR17oR18R32R20i647R21i635gR22r43gR17oR18R32R20i648R21i623gR22r55goR3jR4:7:2oR6r69R8y6:lumMidR10r43R16i-253goR3jR4:8:2oR3jR4:2:1r366R17oR18R32R20i669R21i666gR22jR11:13:1aoR1aoR8R34R10r310gr373hR30r43ghgaoR3jR4:1:1r309R17oR18R32R20i669R21i666gR22r310goR3jR4:1:1r336R17oR18R32R20i678R21i674gR22r337ghR17oR18R32R20i679R21i666gR22r43gR17oR18R32R20i680R21i653gR22r55goR3jR4:7:2oR6r69R8y6:lumMinR10r43R16i-254goR3jR4:8:2oR3jR4:2:1jR23:21:0R17oR18R32R20i701R21i698gR22jR11:13:1aoR1aoR8y1:aR10r43goR8R35R10r43ghR30r43ghgaoR3jR4:1:1r454R17oR18R32R20i708R21i702gR22r43goR3jR4:8:2oR3jR4:2:1r479R17oR18R32R20i713R21i710gR22jR11:13:1ar483hgaoR3jR4:8:2oR3jR4:2:1r479R17oR18R32R20i717R21i714gR22jR11:13:1ar483hgaoR3jR4:1:1r363R17oR18R32R20i723R21i718gR22r43goR3jR4:1:1r388R17oR18R32R20i730R21i725gR22r43ghR17oR18R32R20i731R21i714gR22r43goR3jR4:8:2oR3jR4:2:1r479R17oR18R32R20i736R21i733gR22jR11:13:1ar483hgaoR3jR4:1:1r410R17oR18R32R20i742R21i737gR22r43goR3jR4:1:1r432R17oR18R32R20i749R21i744gR22r43ghR17oR18R32R20i750R21i733gR22r43ghR17oR18R32R20i751R21i710gR22r43ghR17oR18R32R20i752R21i698gR22r43gR17oR18R32R20i753R21i685gR22r55goR3jR4:7:2oR6r69R8y6:lumMaxR10r43R16i-255goR3jR4:8:2oR3jR4:2:1jR23:22:0R17oR18R32R20i774R21i771gR22jR11:13:1ar483hgaoR3jR4:1:1r454R17oR18R32R20i781R21i775gR22r43goR3jR4:8:2oR3jR4:2:1r539R17oR18R32R20i786R21i783gR22jR11:13:1ar483hgaoR3jR4:8:2oR3jR4:2:1r539R17oR18R32R20i790R21i787gR22jR11:13:1ar483hgaoR3jR4:1:1r363R17oR18R32R20i796R21i791gR22r43goR3jR4:1:1r388R17oR18R32R20i803R21i798gR22r43ghR17oR18R32R20i804R21i787gR22r43goR3jR4:8:2oR3jR4:2:1r539R17oR18R32R20i809R21i806gR22jR11:13:1ar483hgaoR3jR4:1:1r410R17oR18R32R20i815R21i810gR22r43goR3jR4:1:1r432R17oR18R32R20i822R21i817gR22r43ghR17oR18R32R20i823R21i806gR22r43ghR17oR18R32R20i824R21i783gR22r43ghR17oR18R32R20i825R21i771gR22r43gR17oR18R32R20i826R21i758gR22r55goR3jR4:7:2oR6r69R8y3:dirR10jR11:5:2i2r11R16i-256gnR17oR18R32R20i846R21i831gR22r55goR3jR4:5:3r7oR3jR4:9:2oR3jR4:1:1r592R17oR18R32R20i854R21i851gR22r593gar139hR17oR18R32R20i856R21i851gR22r43goR3jR4:6:2jy15:haxe.macro.Unop:3:0oR3jR4:3:1oR3jR4:5:3jR5:3:0oR3jR4:3:1oR3jR4:5:3r100oR3jR4:1:1r363R17oR18R32R20i867R21i862gR22r43goR3jR4:1:1r388R17oR18R32R20i875R21i870gR22r43gR17oR18R32R20i875R21i862gR22r43gR17oR18R32R20i876R21i861gR22r43goR3jR4:3:1oR3jR4:5:3r100oR3jR4:1:1r410R17oR18R32R20i885R21i880gR22r43goR3jR4:1:1r432R17oR18R32R20i893R21i888gR22r43gR17oR18R32R20i893R21i880gR22r43gR17oR18R32R20i894R21i879gR22r43gR17oR18R32R20i894R21i861gR22r43gR17oR18R32R20i895R21i860gR22r43gR17oR18R32R20i895R21i859gR22r43gR17oR18R32R20i895R21i851gR22r43goR3jR4:5:3r7oR3jR4:9:2oR3jR4:1:1r592R17oR18R32R20i904R21i901gR22r593gar140hR17oR18R32R20i906R21i901gR22r43goR3jR4:3:1oR3jR4:5:3r608oR3jR4:3:1oR3jR4:5:3r100oR3jR4:1:1r363R17oR18R32R20i916R21i911gR22r43goR3jR4:1:1r410R17oR18R32R20i924R21i919gR22r43gR17oR18R32R20i924R21i911gR22r43gR17oR18R32R20i925R21i910gR22r43goR3jR4:3:1oR3jR4:5:3r100oR3jR4:1:1r388R17oR18R32R20i934R21i929gR22r43goR3jR4:1:1r432R17oR18R32R20i942R21i937gR22r43gR17oR18R32R20i942R21i929gR22r43gR17oR18R32R20i943R21i928gR22r43gR17oR18R32R20i943R21i910gR22r43gR17oR18R32R20i944R21i909gR22r43gR17oR18R32R20i944R21i901gR22r43goR3jR4:7:2oR6r69R8y9:dirReduceR10r43R16i-257goR3jR4:8:2oR3jR4:2:1r539R17oR18R32R20i969R21i966gR22jR11:13:1ar483hgaoR3jR4:5:3r105oR3jR4:3:1oR3jR4:5:3r100oR3jR4:5:3r100oR3jR4:5:3r100oR3jR4:1:1r363R17oR18R32R20i976R21i971gR22r43goR3jR4:1:1r388R17oR18R32R20i984R21i979gR22r43gR17oR18R32R20i984R21i971gR22r43goR3jR4:1:1r410R17oR18R32R20i992R21i987gR22r43gR17oR18R32R20i992R21i971gR22r43goR3jR4:1:1r432R17oR18R32R20i1000R21i995gR22r43gR17oR18R32R20i1000R21i971gR22r43gR17oR18R32R20i1001R21i970gR22r43goR3jR4:3:1oR3jR4:5:3jR5:2:0oR3jR4:0:1jR26:3:1d0.25R17oR18R32R20i1009R21i1005gR22r43goR3jR4:0:1jR26:3:1i128R17oR18R32R20i1015R21i1012gR22r43gR17oR18R32R20i1015R21i1005gR22r43gR17oR18R32R20i1016R21i1004gR22r43gR17oR18R32R20i1016R21i970gR22r43goR3jR4:5:3r717oR3jR4:0:1jR26:3:1d1R17oR18R32R20i1020R21i1018gR22r43goR3jR4:0:1jR26:3:1i8R17oR18R32R20i1024R21i1023gR22r43gR17oR18R32R20i1024R21i1018gR22r43ghR17oR18R32R20i1025R21i966gR22r43gR17oR18R32R20i1026R21i950gR22r55goR3jR4:7:2oR6r69R8y9:rcpDirMinR10r43R16i-258goR3jR4:5:3r717oR3jR4:0:1jR26:3:1i1R17oR18R32R20i1048R21i1047gR22r43goR3jR4:3:1oR3jR4:5:3r100oR3jR4:8:2oR3jR4:2:1r479R17oR18R32R20i1055R21i1052gR22jR11:13:1ar483hgaoR3jR4:8:2oR3jR4:2:1jR23:15:0R17oR18R32R20i1059R21i1056gR22jR11:13:1aoR1aoR8y5:valueR10r43ghR30r43ghgaoR3jR4:9:2oR3jR4:1:1r592R17oR18R32R20i1063R21i1060gR22r593gar139hR17oR18R32R20i1065R21i1060gR22r43ghR17oR18R32R20i1066R21i1056gR22r43goR3jR4:8:2oR3jR4:2:1r765R17oR18R32R20i1071R21i1068gR22jR11:13:1ar769hgaoR3jR4:9:2oR3jR4:1:1r592R17oR18R32R20i1075R21i1072gR22r593gar140hR17oR18R32R20i1077R21i1072gR22r43ghR17oR18R32R20i1078R21i1068gR22r43ghR17oR18R32R20i1079R21i1052gR22r43goR3jR4:1:1r682R17oR18R32R20i1091R21i1082gR22r43gR17oR18R32R20i1091R21i1052gR22r43gR17oR18R32R20i1092R21i1051gR22r43gR17oR18R32R20i1092R21i1047gR22r43gR17oR18R32R20i1093R21i1031gR22r55goR3jR4:5:3r7oR3jR4:1:1r592R17oR18R32R20i1101R21i1098gR22r593goR3jR4:5:3r105oR3jR4:8:2oR3jR4:2:1r479R17oR18R32R20i1107R21i1104gR22jR11:13:1aoR1aoR8R50R10r90goR8R35R10r90ghR30r90ghgaoR3jR4:8:2oR3jR4:2:1r108R17oR18R32R20i1112R21i1108gR22r112gaoR3jR4:0:1jR26:3:1i8R17oR18R32R20i1114R21i1113gR22r43goR3jR4:0:1jR26:3:1i8R17oR18R32R20i1117R21i1116gR22r43ghR17oR18R32R20i1118R21i1108gR22jR11:5:2i2r11goR3jR4:8:2oR3jR4:2:1r539R17oR18R32R20i1123R21i1120gR22jR11:13:1ar822hgaoR3jR4:8:2oR3jR4:2:1r108R17oR18R32R20i1128R21i1124gR22r112gaoR3jR4:0:1jR26:3:1i-8R17oR18R32R20i1131R21i1129gR22r43goR3jR4:0:1jR26:3:1i-8R17oR18R32R20i1135R21i1133gR22r43ghR17oR18R32R20i1136R21i1124gR22jR11:5:2i2r11goR3jR4:5:3r105oR3jR4:1:1r592R17oR18R32R20i1141R21i1138gR22r593goR3jR4:1:1r748R17oR18R32R20i1153R21i1144gR22r43gR17oR18R32R20i1153R21i1138gR22r593ghR17oR18R32R20i1154R21i1120gR22r90ghR17oR18R32R20i1155R21i1104gR22r90goR3jR4:1:1r126R17oR18R32R20i1163R21i1158gR22r127gR17oR18R32R20i1163R21i1104gR22jR11:5:2i2r11gR17oR18R32R20i1163R21i1098gR22r593goR3jR4:7:2oR6r69R8y4:rgbAR10jR11:5:2i3r11R16i-259goR3jR4:5:3r105oR3jR4:0:1jR26:3:1d0.5R17oR18R32R20i1185R21i1182gR22r43goR3jR4:3:1oR3jR4:5:3r100oR3jR4:9:2oR3jR4:8:2oR3jR4:2:1r81R17oR18R32R20i1196R21i1189gR22jR11:13:1aoR1aoR8R34R10r88gr89hR30r91ghgaoR3jR4:1:1r95R17oR18R32R20i1196R21i1189gR22r88goR3jR4:5:3r100oR3jR4:1:1r68R17oR18R32R20i1204R21i1201gR22r35goR3jR4:5:3r105oR3jR4:1:1r592R17oR18R32R20i1210R21i1207gR22r593goR3jR4:3:1oR3jR4:5:3r608oR3jR4:5:3r717oR3jR4:0:1jR26:3:1d1R17oR18R32R20i1217R21i1214gR22r43goR3jR4:0:1jR26:3:1d3R17oR18R32R20i1223R21i1220gR22r43gR17oR18R32R20i1223R21i1214gR22r43goR3jR4:0:1jR26:3:1d0.5R17oR18R32R20i1229R21i1226gR22r43gR17oR18R32R20i1229R21i1214gR22r43gR17oR18R32R20i1230R21i1213gR22r43gR17oR18R32R20i1230R21i1207gR22r593gR17oR18R32R20i1230R21i1201gR22jR11:5:2i2r11ghR17oR18R32R20i1231R21i1189gR22r91gar139r140r141hR17oR18R32R20i1235R21i1189gR22jR11:5:2i3r11goR3jR4:9:2oR3jR4:8:2oR3jR4:2:1r81R17oR18R32R20i1245R21i1238gR22jR11:13:1aoR1aoR8R34R10r88gr89hR30r91ghgaoR3jR4:1:1r95R17oR18R32R20i1245R21i1238gR22r88goR3jR4:5:3r100oR3jR4:1:1r68R17oR18R32R20i1253R21i1250gR22r35goR3jR4:5:3r105oR3jR4:1:1r592R17oR18R32R20i1259R21i1256gR22r593goR3jR4:3:1oR3jR4:5:3r608oR3jR4:5:3r717oR3jR4:0:1jR26:3:1d2R17oR18R32R20i1266R21i1263gR22r43goR3jR4:0:1jR26:3:1d3R17oR18R32R20i1272R21i1269gR22r43gR17oR18R32R20i1272R21i1263gR22r43goR3jR4:0:1jR26:3:1d0.5R17oR18R32R20i1278R21i1275gR22r43gR17oR18R32R20i1278R21i1263gR22r43gR17oR18R32R20i1279R21i1262gR22r43gR17oR18R32R20i1279R21i1256gR22r593gR17oR18R32R20i1279R21i1250gR22jR11:5:2i2r11ghR17oR18R32R20i1280R21i1238gR22r91gar139r140r141hR17oR18R32R20i1284R21i1238gR22jR11:5:2i3r11gR17oR18R32R20i1284R21i1189gR22r890gR17oR18R32R20i1285R21i1188gR22r890gR17oR18R32R20i1285R21i1182gR22r890gR17oR18R32R20i1286R21i1171gR22r55goR3jR4:7:2oR6r69R8y4:rgbBR10jR11:5:2i3r11R16i-260goR3jR4:5:3r100oR3jR4:5:3r105oR3jR4:1:1r889R17oR18R32R20i1306R21i1302gR22r890goR3jR4:0:1jR26:3:1d0.5R17oR18R32R20i1312R21i1309gR22r43gR17oR18R32R20i1312R21i1302gR22r890goR3jR4:5:3r105oR3jR4:0:1jR26:3:1d0.25R17oR18R32R20i1319R21i1315gR22r43goR3jR4:3:1oR3jR4:5:3r100oR3jR4:9:2oR3jR4:8:2oR3jR4:2:1r81R17oR18R32R20i1330R21i1323gR22jR11:13:1aoR1aoR8R34R10r88gr89hR30r91ghgaoR3jR4:1:1r95R17oR18R32R20i1330R21i1323gR22r88goR3jR4:5:3r100oR3jR4:1:1r68R17oR18R32R20i1338R21i1335gR22r35goR3jR4:5:3r105oR3jR4:1:1r592R17oR18R32R20i1344R21i1341gR22r593goR3jR4:0:1jR26:3:1d-0.5R17oR18R32R20i1351R21i1347gR22r43gR17oR18R32R20i1351R21i1341gR22r593gR17oR18R32R20i1351R21i1335gR22jR11:5:2i2r11ghR17oR18R32R20i1352R21i1323gR22r91gar139r140r141hR17oR18R32R20i1356R21i1323gR22jR11:5:2i3r11goR3jR4:9:2oR3jR4:8:2oR3jR4:2:1r81R17oR18R32R20i1366R21i1359gR22jR11:13:1aoR1aoR8R34R10r88gr89hR30r91ghgaoR3jR4:1:1r95R17oR18R32R20i1366R21i1359gR22r88goR3jR4:5:3r100oR3jR4:1:1r68R17oR18R32R20i1374R21i1371gR22r35goR3jR4:5:3r105oR3jR4:1:1r592R17oR18R32R20i1380R21i1377gR22r593goR3jR4:0:1jR26:3:1d0.5R17oR18R32R20i1386R21i1383gR22r43gR17oR18R32R20i1386R21i1377gR22r593gR17oR18R32R20i1386R21i1371gR22jR11:5:2i2r11ghR17oR18R32R20i1387R21i1359gR22r91gar139r140r141hR17oR18R32R20i1391R21i1359gR22jR11:5:2i3r11gR17oR18R32R20i1391R21i1323gR22jR11:5:2i3r11gR17oR18R32R20i1392R21i1322gR22r1111gR17oR18R32R20i1392R21i1315gR22r1111gR17oR18R32R20i1392R21i1302gR22r1016gR17oR18R32R20i1393R21i1291gR22r55goR3jR4:7:2oR6r69R8y4:lumBR10r43R16i-261goR3jR4:8:2oR3jR4:2:1r366R17oR18R32R20i1412R21i1409gR22jR11:13:1aoR1aoR8R50R10r374gr373hR30r43ghgaoR3jR4:1:1r1015R17oR18R32R20i1417R21i1413gR22r1016goR3jR4:1:1r336R17oR18R32R20i1423R21i1419gR22r337ghR17oR18R32R20i1424R21i1409gR22r43gR17oR18R32R20i1425R21i1398gR22r55goR3jR4:7:2oR6r69R8R15R10jR11:5:2i4r11R16i-262gnR17oR18R32R20i1447R21i1430gR22r55goR3jR4:7:2oR6r69R8y3:cmpR10jR11:5:2i2r11R16i-263goR3jR4:5:3jR5:7:0oR3jR4:8:2oR3jR4:2:1r108R17oR18R32R20i1466R21i1462gR22r112gaoR3jR4:1:1r1121R17oR18R32R20i1471R21i1467gR22r43goR3jR4:6:2r605oR3jR4:1:1r1121R17oR18R32R20i1478R21i1474gR22r43gR17oR18R32R20i1478R21i1473gR22r43ghR17oR18R32R20i1479R21i1462gR22r1149goR3jR4:8:2oR3jR4:2:1r108R17oR18R32R20i1486R21i1482gR22r112gaoR3jR4:1:1r476R17oR18R32R20i1493R21i1487gR22r43goR3jR4:6:2r605oR3jR4:1:1r536R17oR18R32R20i1502R21i1496gR22r43gR17oR18R32R20i1502R21i1495gR22r43ghR17oR18R32R20i1503R21i1482gR22jR11:5:2i2r11gR17oR18R32R20i1503R21i1462gR22r1149gR17oR18R32R20i1504R21i1452gR22r55goR3jR4:5:3r7oR3jR4:9:2oR3jR4:1:1r1143R17oR18R32R20i1514R21i1509gR22r1144gar139r140r141hR17oR18R32R20i1518R21i1509gR22jR11:5:2i3r11goR3jR4:8:2oR3jR4:2:1jR23:24:0R17oR18R32R20i1524R21i1521gR22jR11:13:1aoR1aoR8y1:xR10r374goR8y1:yR10r374goR8R50R10r43ghR30r374ghgaoR3jR4:1:1r889R17oR18R32R20i1529R21i1525gR22r890goR3jR4:1:1r1015R17oR18R32R20i1535R21i1531gR22r1016goR3jR4:5:3r105oR3jR4:9:2oR3jR4:1:1r1148R17oR18R32R20i1540R21i1537gR22r1149gar139hR17oR18R32R20i1542R21i1537gR22r43goR3jR4:9:2oR3jR4:1:1r1148R17oR18R32R20i1548R21i1545gR22r1149gar140hR17oR18R32R20i1550R21i1545gR22r43gR17oR18R32R20i1550R21i1537gR22r43ghR17oR18R32R20i1551R21i1521gR22r374gR17oR18R32R20i1551R21i1509gR22r1197goR3jR4:5:3r7oR3jR4:9:2oR3jR4:1:1r1143R17oR18R32R20i1562R21i1557gR22r1144gajR38:3:0hR17oR18R32R20i1564R21i1557gR22r43goR3jR4:0:1jR26:3:1d1R17oR18R32R20i1569R21i1567gR22r43gR17oR18R32R20i1569R21i1557gR22r43goR3jR4:5:3r7oR3jR4:1:1r15R17oR18R32R20i1587R21i1575gR22r16goR3jR4:1:1r1143R17oR18R32R20i1595R21i1590gR22r1144gR17oR18R32R20i1595R21i1575gR22r16ghR17oR18R32R20i1601R21i193gR22r55gR6jR27:1:0R28oR6r58R8y8:fragmentR10jR11:13:1aoR1ahR30r55ghR16i-241gR30r55ghR8y25:h3d.pass._FXAA.FXAAShadery4:varsar57r1265r95r13r32r126hg";
h3d_pass_ShadowMap.__meta__ = { fields : { border : { ignore : null}}};
h3d_shader_AlphaChannel.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:10:3oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:2:0y4:namey9:showAlphay4:typejy9:hxsl.Type:2:0y10:qualifiersajy17:hxsl.VarQualifier:0:1nhy2:idi-589gy1:poy4:filey69:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FAlphaChannel.hxy3:maxi187y3:mini178gy1:tr10goR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:9:2oR3jR4:1:1oR5jR6:4:0R7y10:pixelColorR9jR10:5:2i4jy12:hxsl.VecType:1:0R13i-588gR14oR15R16R17i200R18i190gR19r22gajy14:hxsl.Component:0:0jR23:1:0jR23:2:0hR14oR15R16R17i204R18i190gR19jR10:5:2i3r21goR3jR4:9:2oR3jR4:1:1r19R14oR15R16R17i217R18i207gR19r22gajR23:3:0r37r37hR14oR15R16R17i221R18i207gR19jR10:5:2i3r21gR14oR15R16R17i221R18i190gR19r31gnR14oR15R16R17i221R18i174gR19jR10:0:0goR3jR4:5:3r16oR3jR4:9:2oR3jR4:1:1r19R14oR15R16R17i237R18i227gR19r22gar37hR14oR15R16R17i239R18i227gR19jR10:3:0goR3jR4:0:1jy10:hxsl.Const:3:1d1R14oR15R16R17i244R18i242gR19r54gR14oR15R16R17i244R18i227gR19r54ghR14oR15R16R17i250R18i168gR19r45gR5jy17:hxsl.FunctionKind:1:0y3:refoR5jR6:6:0R7y8:fragmentR9jR10:13:1aoR1ahy3:retr45ghR13i-590gR28r45ghR7y23:h3d.shader.AlphaChannely4:varsar64r8r19hg";
h3d_shader_AlphaMap.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:20:1jR5:1:0oR3jR4:9:2oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey10:pixelColory4:typejy9:hxsl.Type:5:2i4jy12:hxsl.VecType:1:0y2:idi-533gy1:poy4:filey65:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FAlphaMap.hxy3:maxi271y3:mini261gy1:tr14gajy14:hxsl.Component:3:0hR14oR15R16R17i273R18i261gR19jR11:3:0goR3jR4:9:2oR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:33:0R14oR15R16R17i284R18i277gR19jR11:13:1aoR1aoR8y1:_R10jR11:10:0goR8y1:bR10jR11:5:2i2r13ghy3:retjR11:5:2i4r13ghgaoR3jR4:1:1oR6jR7:2:0R8y7:textureR10r32R13i-534gR14oR15R16R17i284R18i277gR19r32goR3jR4:5:3jR5:0:0oR3jR4:5:3r7oR3jR4:1:1oR6r12R8y12:calculatedUVR10jR11:5:2i2r13R13i-532gR14oR15R16R17i301R18i289gR19r48goR3jR4:1:1oR6r40R8y7:uvScaleR10jR11:5:2i2r13R13i-535gR14oR15R16R17i311R18i304gR19r53gR14oR15R16R17i311R18i289gR19jR11:5:2i2r13goR3jR4:1:1oR6r40R8y7:uvDeltaR10jR11:5:2i2r13R13i-536gR14oR15R16R17i321R18i314gR19r61gR14oR15R16R17i321R18i289gR19jR11:5:2i2r13ghR14oR15R16R17i322R18i277gR19r35gajR20:2:0hR14oR15R16R17i324R18i277gR19r21gR14oR15R16R17i324R18i261gR19r21ghR14oR15R16R17i330R18i255gR19jR11:0:0gR6jy17:hxsl.FunctionKind:1:0y3:refoR6jR7:6:0R8y8:fragmentR10jR11:13:1aoR1ahR24r77ghR13i-537gR24r77ghR8y19:h3d.shader.AlphaMapy4:varsar47r79r39r52r11r60hg";
h3d_shader_AmbientLight.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey10:lightColory4:typejy9:hxsl.Type:5:2i3jy12:hxsl.VecType:1:0y2:idi-510gy1:poy4:filey69:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FAmbientLight.hxy3:maxi349y3:mini339gy1:tr12goR3jR4:10:3oR3jR4:1:1oR6jR7:2:0R8y8:additiveR10jR11:2:0y10:qualifiersajy17:hxsl.VarQualifier:0:1nhR13i-511gR14oR15R16R17i360R18i352gR19r19goR3jR4:1:1oR6jR7:0:0R8y12:ambientLightR10jR11:5:2i3r11y6:parentoR6r26R8y6:globalR10jR11:12:1ar25oR6r26R8y16:perPixelLightingR10r19R24r28R21ajR22:0:1nhR13i-507ghR13i-505gR13i-506gR14oR15R16R17i382R18i363gR19r27goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:39:0R14oR15R16R17i389R18i385gR19jR11:13:1ahgaoR3jR4:0:1jy10:hxsl.Const:3:1d0R14oR15R16R17i392R18i390gR19jR11:3:0ghR14oR15R16R17i393R18i385gR19jR11:5:2i3r11gR14oR15R16R17i393R18i352gR19r27gR14oR15R16R17i393R18i339gR19r12ghR14oR15R16R17i399R18i333gR19jR11:0:0gR6jy17:hxsl.FunctionKind:2:0y3:refoR6jR7:6:0R8y8:__init__R10jR11:13:1aoR1ahy3:retr58ghR13i-512gR32r58goR1ahR2oR3jR4:4:1aoR3jR4:5:3r7oR3jR4:1:1oR6r10R8y15:lightPixelColorR10jR11:5:2i3r11R13i-509gR14oR15R16R17i454R18i439gR19r73goR3jR4:10:3oR3jR4:1:1r17R14oR15R16R17i465R18i457gR19r19goR3jR4:1:1r25R14oR15R16R17i487R18i468gR19r27goR3jR4:8:2oR3jR4:2:1r38R14oR15R16R17i494R18i490gR19r42gaoR3jR4:0:1jR28:3:1d0R14oR15R16R17i497R18i495gR19r48ghR14oR15R16R17i498R18i490gR19jR11:5:2i3r11gR14oR15R16R17i498R18i457gR19r27gR14oR15R16R17i498R18i439gR19r73ghR14oR15R16R17i504R18i433gR19r58gR6r59R30oR6r61R8y16:__init__fragmentR10jR11:13:1aoR1ahR32r58ghR13i-513gR32r58goR1aoR6r10R8R9R10jR11:5:2i3r11R13i-514ghR2oR3jR4:4:1aoR3jR4:12:1oR3jR4:10:3oR3jR4:1:1r17R14oR15R16R17i578R18i570gR19r19goR3jR4:1:1r108R14oR15R16R17i591R18i581gR19r109goR3jR4:3:1oR3jR4:5:3jR5:0:0oR3jR4:1:1r25R14oR15R16R17i614R18i595gR19r27goR3jR4:5:3jR5:1:0oR3jR4:8:2oR3jR4:2:1jR27:22:0R14oR15R16R17i642R18i617gR19jR11:13:1aoR1aoR8y1:_R10r27goR8y1:bR10r48ghR32jR11:5:2i3r11ghgaoR3jR4:3:1oR3jR4:5:3jR5:3:0oR3jR4:0:1jR28:3:1i1R14oR15R16R17i619R18i618gR19r48goR3jR4:1:1r25R14oR15R16R17i641R18i622gR19r27gR14oR15R16R17i641R18i618gR19r27gR14oR15R16R17i642R18i617gR19r27goR3jR4:0:1jR28:3:1d0R14oR15R16R17i649R18i647gR19r48ghR14oR15R16R17i650R18i617gR19r138goR3jR4:1:1r108R14oR15R16R17i663R18i653gR19r109gR14oR15R16R17i663R18i617gR19jR11:5:2i3r11gR14oR15R16R17i663R18i595gR19jR11:5:2i3r11gR14oR15R16R17i664R18i594gR19r169gR14oR15R16R17i664R18i570gR19r109gR14oR15R16R17i664R18i563gR19r58ghR14oR15R16R17i670R18i557gR19r58gR6jR29:3:0R30oR6r61R8y9:calcLightR10jR11:13:1aoR1aoR8R9R10r109ghR32jR11:5:2i3r11ghR13i-515gR32r184goR1ahR2oR3jR4:4:1aoR3jR4:10:3oR3jR4:6:2jy15:haxe.macro.Unop:2:0oR3jR4:1:1r30R14oR15R16R17i728R18i705gR19r19gR14oR15R16R17i728R18i704gR19r19goR3jR4:5:3jR5:20:1r127oR3jR4:9:2oR3jR4:1:1oR6r10R8y10:pixelColorR10jR11:5:2i4r11R13i-508gR14oR15R16R17i741R18i731gR19r203gajy14:hxsl.Component:0:0jR40:1:0jR40:2:0hR14oR15R16R17i745R18i731gR19jR11:5:2i3r11goR3jR4:8:2oR3jR4:1:1r179R14oR15R16R17i758R18i749gR19r185gaoR3jR4:1:1r9R14oR15R16R17i769R18i759gR19r12ghR14oR15R16R17i770R18i749gR19r184gR14oR15R16R17i770R18i731gR19r212gnR14oR15R16R17i770R18i700gR19r58ghR14oR15R16R17i776R18i694gR19r58gR6jR29:0:0R30oR6r61R8y6:vertexR10jR11:13:1aoR1ahR32r58ghR13i-516gR32r58goR1ahR2oR3jR4:4:1aoR3jR4:10:3oR3jR4:1:1r30R14oR15R16R17i835R18i812gR19r19goR3jR4:5:3jR5:20:1r127oR3jR4:9:2oR3jR4:1:1r202R14oR15R16R17i848R18i838gR19r203gar207r208r209hR14oR15R16R17i852R18i838gR19jR11:5:2i3r11goR3jR4:8:2oR3jR4:1:1r179R14oR15R16R17i865R18i856gR19r185gaoR3jR4:1:1r72R14oR15R16R17i881R18i866gR19r73ghR14oR15R16R17i882R18i856gR19r184gR14oR15R16R17i882R18i838gR19r252gnR14oR15R16R17i882R18i808gR19r58ghR14oR15R16R17i888R18i802gR19r58gR6jR29:1:0R30oR6r61R8y8:fragmentR10jR11:13:1aoR1ahR32r58ghR13i-517gR32r58ghR8y23:h3d.shader.AmbientLighty4:varsar230r9r60r270r17r101r179r28r202r72hg";
h3d_shader_AnimatedTexture.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:7:2oy4:kindjy12:hxsl.VarKind:4:0y4:namey5:framey4:typejy9:hxsl.Type:3:0y2:idi-680goR3jR4:5:3jy16:haxe.macro.Binop:1:0oR3jR4:3:1oR3jR4:5:3jR12:3:0oR3jR4:1:1oR5jR6:0:0R7y4:timeR9r9y6:parentoR5r17R7y6:globalR9jR10:12:1ar16hR11i-668gR11i-669gy1:poy4:filey72:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FAnimatedTexture.hxy3:maxi573y3:mini562gy1:tr9goR3jR4:1:1oR5jR6:2:0R7y9:startTimeR9r9R11i-673gR16oR17R18R19i585R20i576gR21r9gR16oR17R18R19i585R20i562gR21r9gR16oR17R18R19i586R20i561gR21r9goR3jR4:1:1oR5r25R7y5:speedR9r9R11i-670gR16oR17R18R19i594R20i589gR21r9gR16oR17R18R19i594R20i561gR21r9gR16oR17R18R19i595R20i549gR21jR10:0:0goR3jR4:5:3jR12:4:0oR3jR4:1:1oR5jR6:3:0R7y11:blendFactorR9r9y10:qualifiersajy17:hxsl.VarQualifier:1:0hR11i-675gR16oR17R18R19i610R20i599gR21r9goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:19:0R16oR17R18R19i618R20i613gR21jR10:13:1aoR1aoR7y1:_R9r9ghy3:retr9ghgaoR3jR4:1:1r7R16oR17R18R19i618R20i613gR21r9ghR16oR17R18R19i626R20i613gR21r9gR16oR17R18R19i626R20i599gR21r9goR3jR4:5:3jR12:20:1r14oR3jR4:1:1r7R16oR17R18R19i636R20i631gR21r9goR3jR4:1:1r44R16oR17R18R19i651R20i640gR21r9gR16oR17R18R19i651R20i631gR21r9goR3jR4:10:3oR3jR4:1:1oR5r25R7y4:loopR9jR10:2:0R25ajR26:0:1nhR11i-674gR16oR17R18R19i664R20i660gR21r81goR3jR4:5:3jR12:20:1jR12:19:0oR3jR4:1:1r7R16oR17R18R19i672R20i667gR21r9goR3jR4:1:1oR5r25R7y11:totalFramesR9r9R11i-672gR16oR17R18R19i687R20i676gR21r9gR16oR17R18R19i687R20i667gR21r9goR3jR4:5:3r42oR3jR4:1:1r7R16oR17R18R19i698R20i693gR21r9goR3jR4:8:2oR3jR4:2:1jR27:21:0R16oR17R18R19i704R20i701gR21jR10:13:1aoR1aoR7y1:aR9r9goR7y1:bR9r9ghR29r9ghgaoR3jR4:1:1r7R16oR17R18R19i710R20i705gR21r9goR3jR4:5:3r14oR3jR4:1:1r93R16oR17R18R19i723R20i712gR21r9goR3jR4:0:1jy10:hxsl.Const:3:1i1R16oR17R18R19i727R20i726gR21r9gR16oR17R18R19i727R20i712gR21r9ghR16oR17R18R19i728R20i701gR21r9gR16oR17R18R19i728R20i693gR21r9gR16oR17R18R19i728R20i656gR21r40goR3jR4:7:2oR5r8R7y9:nextFrameR9r9R11i-681goR3jR4:10:3oR3jR4:1:1r80R16oR17R18R19i757R20i753gR21r81goR3jR4:5:3r87oR3jR4:3:1oR3jR4:5:3jR12:0:0oR3jR4:1:1r7R16oR17R18R19i766R20i761gR21r9goR3jR4:0:1jR34:3:1i1R16oR17R18R19i770R20i769gR21r9gR16oR17R18R19i770R20i761gR21r9gR16oR17R18R19i771R20i760gR21r9goR3jR4:1:1r93R16oR17R18R19i785R20i774gR21r9gR16oR17R18R19i785R20i760gR21r9goR3jR4:8:2oR3jR4:2:1r104R16oR17R18R19i794R20i791gR21jR10:13:1ar108hgaoR3jR4:5:3r142oR3jR4:1:1r7R16oR17R18R19i800R20i795gR21r9goR3jR4:0:1jR34:3:1i1R16oR17R18R19i804R20i803gR21r9gR16oR17R18R19i804R20i795gR21r9goR3jR4:5:3r14oR3jR4:1:1r93R16oR17R18R19i817R20i806gR21r9goR3jR4:0:1jR34:3:1i1R16oR17R18R19i821R20i820gR21r9gR16oR17R18R19i821R20i806gR21r9ghR16oR17R18R19i822R20i791gR21r9gR16oR17R18R19i822R20i749gR21r9gR16oR17R18R19i823R20i733gR21r40goR3jR4:7:2oR5r8R7y5:deltaR9jR10:5:2i2jy12:hxsl.VecType:1:0R11i-682goR3jR4:5:3jR12:2:0oR3jR4:8:2oR3jR4:2:1jR27:38:0R16oR17R18R19i844R20i840gR21jR10:13:1ahgaoR3jR4:5:3r87oR3jR4:1:1r7R16oR17R18R19i851R20i846gR21r9goR3jR4:9:2oR3jR4:1:1oR5r25R7y13:frameDivisionR9jR10:5:2i2r194R11i-671gR16oR17R18R19i867R20i854gR21r213gajy14:hxsl.Component:0:0hR16oR17R18R19i869R20i854gR21r9gR16oR17R18R19i869R20i846gR21r9goR3jR4:8:2oR3jR4:2:1jR27:36:0R16oR17R18R19i876R20i871gR21jR10:13:1aoR1aoR7y5:valueR9jR10:1:0ghR29r9ghgaoR3jR4:8:2oR3jR4:2:1jR27:35:0R16oR17R18R19i880R20i877gR21jR10:13:1aoR1aoR7R40R9r9ghR29r231ghgaoR3jR4:5:3r197oR3jR4:1:1r7R16oR17R18R19i886R20i881gR21r9goR3jR4:9:2oR3jR4:1:1r212R16oR17R18R19i902R20i889gR21r213gar217hR16oR17R18R19i904R20i889gR21r9gR16oR17R18R19i904R20i881gR21r9ghR16oR17R18R19i905R20i877gR21r231ghR16oR17R18R19i906R20i871gR21r9ghR16oR17R18R19i908R20i840gR21jR10:5:2i2r194goR3jR4:1:1r212R16oR17R18R19i924R20i911gR21r213gR16oR17R18R19i924R20i840gR21r195gR16oR17R18R19i925R20i828gR21r40goR3jR4:5:3r42oR3jR4:1:1oR5r8R7y12:calculatedUVR9jR10:5:2i2r194R11i-666gR16oR17R18R19i941R20i929gR21r275goR3jR4:5:3r142oR3jR4:1:1oR5jR6:1:0R7y2:uvR9jR10:5:2i2r194R14oR5r281R7y5:inputR9jR10:12:1ar280hR11i-662gR11i-663gR16oR17R18R19i952R20i944gR21r282goR3jR4:1:1r193R16oR17R18R19i960R20i955gR21r195gR16oR17R18R19i960R20i944gR21jR10:5:2i2r194gR16oR17R18R19i960R20i929gR21r275goR3jR4:7:2oR5r8R7R36R9jR10:5:2i2r194R11i-683goR3jR4:5:3r197oR3jR4:8:2oR3jR4:2:1r200R16oR17R18R19i981R20i977gR21r204gaoR3jR4:5:3r87oR3jR4:1:1r134R16oR17R18R19i992R20i983gR21r9goR3jR4:9:2oR3jR4:1:1r212R16oR17R18R19i1008R20i995gR21r213gar217hR16oR17R18R19i1010R20i995gR21r9gR16oR17R18R19i1010R20i983gR21r9goR3jR4:8:2oR3jR4:2:1r224R16oR17R18R19i1017R20i1012gR21jR10:13:1ar228hgaoR3jR4:8:2oR3jR4:2:1r236R16oR17R18R19i1021R20i1018gR21jR10:13:1ar240hgaoR3jR4:5:3r197oR3jR4:1:1r134R16oR17R18R19i1031R20i1022gR21r9goR3jR4:9:2oR3jR4:1:1r212R16oR17R18R19i1047R20i1034gR21r213gar217hR16oR17R18R19i1049R20i1034gR21r9gR16oR17R18R19i1049R20i1022gR21r9ghR16oR17R18R19i1050R20i1018gR21r231ghR16oR17R18R19i1051R20i1012gR21r9ghR16oR17R18R19i1053R20i977gR21jR10:5:2i2r194goR3jR4:1:1r212R16oR17R18R19i1069R20i1056gR21r213gR16oR17R18R19i1069R20i977gR21r298gR16oR17R18R19i1070R20i965gR21r40goR3jR4:5:3r42oR3jR4:1:1oR5r8R7y13:calculatedUV2R9jR10:5:2i2r194R11i-667gR16oR17R18R19i1087R20i1074gR21r362goR3jR4:5:3r142oR3jR4:1:1r280R16oR17R18R19i1098R20i1090gR21r282goR3jR4:1:1r297R16oR17R18R19i1106R20i1101gR21r298gR16oR17R18R19i1106R20i1090gR21jR10:5:2i2r194gR16oR17R18R19i1106R20i1074gR21r362ghR16oR17R18R19i1111R20i543gR21r40gR5jy17:hxsl.FunctionKind:0:0y3:refoR5jR6:6:0R7y6:vertexR9jR10:13:1aoR1ahR29r40ghR11i-677gR29r40goR1ahR2oR3jR4:4:1aoR3jR4:5:3r42oR3jR4:1:1oR5r8R7y12:textureColorR9jR10:5:2i4r194R11i-676gR16oR17R18R19i1160R20i1148gR21r393goR3jR4:8:2oR3jR4:2:1jR27:24:0R16oR17R18R19i1166R20i1163gR21jR10:13:1aoR1aoR7y1:xR9jR10:5:2i4r194goR7y1:yR9r405goR7R32R9r9ghR29r405ghgaoR3jR4:8:2oR3jR4:2:1jR27:33:0R16oR17R18R19i1175R20i1168gR21jR10:13:1aoR1aoR7R28R9jR10:10:0goR7R33R9jR10:5:2i2r194ghR29r405ghgaoR3jR4:1:1oR5r25R7y7:textureR9r419R11i-664gR16oR17R18R19i1175R20i1168gR21r419goR3jR4:1:1r274R16oR17R18R19i1192R20i1180gR21r275ghR16oR17R18R19i1193R20i1168gR21r405goR3jR4:8:2oR3jR4:2:1r412R16oR17R18R19i1203R20i1196gR21jR10:13:1aoR1aoR7R28R9r419gr420hR29r405ghgaoR3jR4:1:1r425R16oR17R18R19i1203R20i1196gR21r419goR3jR4:1:1r361R16oR17R18R19i1221R20i1208gR21r362ghR16oR17R18R19i1222R20i1196gR21r405goR3jR4:1:1r44R16oR17R18R19i1235R20i1224gR21r9ghR16oR17R18R19i1236R20i1163gR21r405gR16oR17R18R19i1236R20i1148gR21r393ghR16oR17R18R19i1241R20i1143gR21r40gR5jR45:2:0R46oR5r381R7y16:__init__fragmentR9jR10:13:1aoR1ahR29r40ghR11i-678gR29r40goR1ahR2oR3jR4:4:1aoR3jR4:5:3jR12:20:1r11oR3jR4:1:1oR5r8R7y10:pixelColorR9jR10:5:2i4r194R11i-665gR16oR17R18R19i1280R20i1270gR21r474goR3jR4:1:1r392R16oR17R18R19i1296R20i1284gR21r393gR16oR17R18R19i1296R20i1270gR21r474ghR16oR17R18R19i1301R20i1265gR21r40gR5jR45:1:0R46oR5r381R7y8:fragmentR9jR10:13:1aoR1ahR29r40ghR11i-679gR29r40ghR7y26:h3d.shader.AnimatedTexturey4:varsar274r24r380r361r80r485r425r392r212r461r44r93r283r18r33r473hg";
h3d_shader_Base2d.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey14:spritePositiony4:typejy9:hxsl.Type:5:2i4jy12:hxsl.VecType:1:0y2:idi-315gy1:poy4:filey63:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FBase2d.hxy3:maxi919y3:mini905gy1:tr12goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:40:0R14oR15R16R17i926R18i922gR19jR11:13:1ahgaoR3jR4:1:1oR6jR7:1:0R8y8:positionR10jR11:5:2i2r11y6:parentoR6r25R8y5:inputR10jR11:12:1ar24oR6r25R8y2:uvR10jR11:5:2i2r11R22r27R13i-307goR6r25R8y5:colorR10jR11:5:2i4r11R22r27R13i-308ghR13i-305gR13i-306gR14oR15R16R17i941R18i927gR19r26goR3jR4:1:1oR6jR7:2:0R8y6:zValueR10jR11:3:0R13i-313gR14oR15R16R17i949R18i943gR19r39goR3jR4:0:1jy10:hxsl.Const:3:1i1R14oR15R16R17i952R18i951gR19r39ghR14oR15R16R17i953R18i922gR19jR11:5:2i4r11gR14oR15R16R17i953R18i905gR19r12goR3jR4:10:3oR3jR4:1:1oR6r38R8y10:isRelativeR10jR11:2:0y10:qualifiersajy17:hxsl.VarQualifier:0:1nhR13i-320gR14oR15R16R17i973R18i963gR19r54goR3jR4:4:1aoR3jR4:5:3r7oR3jR4:9:2oR3jR4:1:1oR6r10R8y16:absolutePositionR10jR11:5:2i4r11R13i-316gR14oR15R16R17i999R18i983gR19r65gajy14:hxsl.Component:0:0hR14oR15R16R17i1001R18i983gR19r39goR3jR4:8:2oR3jR4:2:1jR20:29:0R14oR15R16R17i1029R18i1004gR19jR11:13:1aoR1aoR8y1:_R10jR11:5:2i3r11goR8y1:bR10jR11:5:2i3r11ghy3:retr39ghgaoR3jR4:8:2oR3jR4:2:1jR20:39:0R14oR15R16R17i1008R18i1004gR19jR11:13:1ahgaoR3jR4:9:2oR3jR4:1:1r9R14oR15R16R17i1023R18i1009gR19r12gar69jR32:1:0hR14oR15R16R17i1026R18i1009gR19jR11:5:2i2r11goR3jR4:0:1jR27:3:1i1R14oR15R16R17i1028R18i1027gR19r39ghR14oR15R16R17i1029R18i1004gR19r81goR3jR4:1:1oR6r38R8y15:absoluteMatrixAR10jR11:5:2i3r11R13i-322gR14oR15R16R17i1049R18i1034gR19r111ghR14oR15R16R17i1050R18i1004gR19r39gR14oR15R16R17i1050R18i983gR19r39goR3jR4:5:3r7oR3jR4:9:2oR3jR4:1:1r64R14oR15R16R17i1073R18i1057gR19r65gar99hR14oR15R16R17i1075R18i1057gR19r39goR3jR4:8:2oR3jR4:2:1r74R14oR15R16R17i1103R18i1078gR19jR11:13:1aoR1aoR8R33R10jR11:5:2i3r11gr82hR35r39ghgaoR3jR4:8:2oR3jR4:2:1r88R14oR15R16R17i1082R18i1078gR19r92gaoR3jR4:9:2oR3jR4:1:1r9R14oR15R16R17i1097R18i1083gR19r12gar69r99hR14oR15R16R17i1100R18i1083gR19jR11:5:2i2r11goR3jR4:0:1jR27:3:1i1R14oR15R16R17i1102R18i1101gR19r39ghR14oR15R16R17i1103R18i1078gR19r134goR3jR4:1:1oR6r38R8y15:absoluteMatrixBR10jR11:5:2i3r11R13i-323gR14oR15R16R17i1123R18i1108gR19r158ghR14oR15R16R17i1124R18i1078gR19r39gR14oR15R16R17i1124R18i1057gR19r39goR3jR4:5:3r7oR3jR4:9:2oR3jR4:1:1r64R14oR15R16R17i1147R18i1131gR19r65gajR32:2:0jR32:3:0hR14oR15R16R17i1150R18i1131gR19jR11:5:2i2r11goR3jR4:9:2oR3jR4:1:1r9R14oR15R16R17i1167R18i1153gR19r12gar171r172hR14oR15R16R17i1170R18i1153gR19jR11:5:2i2r11gR14oR15R16R17i1170R18i1131gR19r175ghR14oR15R16R17i1177R18i976gR19jR11:0:0goR3jR4:5:3r7oR3jR4:1:1r64R14oR15R16R17i1204R18i1188gR19r65goR3jR4:1:1r9R14oR15R16R17i1221R18i1207gR19r12gR14oR15R16R17i1221R18i1188gR19r65gR14oR15R16R17i1221R18i959gR19r188goR3jR4:5:3r7oR3jR4:1:1oR6jR7:3:0R8y12:calculatedUVR10jR11:5:2i2r11R13i-319gR14oR15R16R17i1239R18i1227gR19r204goR3jR4:10:3oR3jR4:1:1oR6r38R8y8:hasUVPosR10r54R29ajR30:0:1nhR13i-326gR14oR15R16R17i1250R18i1242gR19r54goR3jR4:5:3jR5:0:0oR3jR4:5:3jR5:1:0oR3jR4:1:1r29R14oR15R16R17i1261R18i1253gR19r30goR3jR4:9:2oR3jR4:1:1oR6r38R8y5:uvPosR10jR11:5:2i4r11R13i-327gR14oR15R16R17i1269R18i1264gR19r224gar171r172hR14oR15R16R17i1272R18i1264gR19jR11:5:2i2r11gR14oR15R16R17i1272R18i1253gR19jR11:5:2i2r11goR3jR4:9:2oR3jR4:1:1r223R14oR15R16R17i1280R18i1275gR19r224gar69r99hR14oR15R16R17i1283R18i1275gR19jR11:5:2i2r11gR14oR15R16R17i1283R18i1253gR19jR11:5:2i2r11goR3jR4:1:1r29R14oR15R16R17i1294R18i1286gR19r30gR14oR15R16R17i1294R18i1242gR19r244gR14oR15R16R17i1294R18i1227gR19r204goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y10:pixelColorR10jR11:5:2i4r11R13i-317gR14oR15R16R17i1310R18i1300gR19r255goR3jR4:10:3oR3jR4:1:1r53R14oR15R16R17i1323R18i1313gR19r54goR3jR4:5:3r217oR3jR4:1:1oR6r38R8R25R10jR11:5:2i4r11R13i-321gR14oR15R16R17i1331R18i1326gR19r265goR3jR4:1:1r31R14oR15R16R17i1345R18i1334gR19r32gR14oR15R16R17i1345R18i1326gR19jR11:5:2i4r11goR3jR4:1:1r31R14oR15R16R17i1359R18i1348gR19r32gR14oR15R16R17i1359R18i1313gR19r273gR14oR15R16R17i1359R18i1300gR19r255goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y12:textureColorR10jR11:5:2i4r11R13i-318gR14oR15R16R17i1377R18i1365gR19r284goR3jR4:8:2oR3jR4:2:1jR20:33:0R14oR15R16R17i1387R18i1380gR19jR11:13:1aoR1aoR8R33R10jR11:10:0goR8R34R10jR11:5:2i2r11ghR35jR11:5:2i4r11ghgaoR3jR4:1:1oR6r38R8y7:textureR10r296R13i-314gR14oR15R16R17i1387R18i1380gR19r296goR3jR4:1:1r202R14oR15R16R17i1404R18i1392gR19r204ghR14oR15R16R17i1405R18i1380gR19r299gR14oR15R16R17i1405R18i1365gR19r284goR3jR4:5:3jR5:20:1r217oR3jR4:1:1r254R14oR15R16R17i1421R18i1411gR19r255goR3jR4:1:1r283R14oR15R16R17i1437R18i1425gR19r284gR14oR15R16R17i1437R18i1411gR19r255ghR14oR15R16R17i1443R18i899gR19r188gR6jy17:hxsl.FunctionKind:2:0y3:refoR6jR7:6:0R8y8:__init__R10jR11:13:1aoR1ahR35r188ghR13i-331gR35r188goR1ahR2oR3jR4:4:1aoR3jR4:7:2oR6r10R8y3:tmpR10jR11:5:2i3r11R13i-334goR3jR4:8:2oR3jR4:2:1r88R14oR15R16R17i1546R18i1542gR19r92gaoR3jR4:9:2oR3jR4:1:1r64R14oR15R16R17i1563R18i1547gR19r65gar69r99hR14oR15R16R17i1566R18i1547gR19jR11:5:2i2r11goR3jR4:0:1jR27:3:1i1R14oR15R16R17i1569R18i1568gR19r39ghR14oR15R16R17i1570R18i1542gR19r338gR14oR15R16R17i1571R18i1532gR19r188goR3jR4:5:3r7oR3jR4:9:2oR3jR4:1:1r64R14oR15R16R17i1592R18i1576gR19r65gar69hR14oR15R16R17i1594R18i1576gR19r39goR3jR4:8:2oR3jR4:2:1r74R14oR15R16R17i1600R18i1597gR19jR11:13:1aoR1aoR8R33R10r338gr82hR35r39ghgaoR3jR4:1:1r337R14oR15R16R17i1600R18i1597gR19r338goR3jR4:1:1oR6r38R8y13:filterMatrixAR10jR11:5:2i3r11R13i-324gR14oR15R16R17i1618R18i1605gR19r383ghR14oR15R16R17i1619R18i1597gR19r39gR14oR15R16R17i1619R18i1576gR19r39goR3jR4:5:3r7oR3jR4:9:2oR3jR4:1:1r64R14oR15R16R17i1641R18i1625gR19r65gar99hR14oR15R16R17i1643R18i1625gR19r39goR3jR4:8:2oR3jR4:2:1r74R14oR15R16R17i1649R18i1646gR19jR11:13:1aoR1aoR8R33R10r338gr82hR35r39ghgaoR3jR4:1:1r337R14oR15R16R17i1649R18i1646gR19r338goR3jR4:1:1oR6r38R8y13:filterMatrixBR10jR11:5:2i3r11R13i-325gR14oR15R16R17i1667R18i1654gR19r413ghR14oR15R16R17i1668R18i1646gR19r39gR14oR15R16R17i1668R18i1625gR19r39goR3jR4:5:3r7oR3jR4:9:2oR3jR4:1:1r64R14oR15R16R17i1719R18i1703gR19r65gar69r99hR14oR15R16R17i1722R18i1703gR19jR11:5:2i2r11goR3jR4:5:3r217oR3jR4:3:1oR3jR4:5:3r215oR3jR4:9:2oR3jR4:1:1r64R14oR15R16R17i1742R18i1726gR19r65gar69r99hR14oR15R16R17i1745R18i1726gR19jR11:5:2i2r11goR3jR4:9:2oR3jR4:1:1oR6r38R8y8:viewportR10jR11:5:2i4r11R13i-330gR14oR15R16R17i1756R18i1748gR19r443gar69r99hR14oR15R16R17i1759R18i1748gR19jR11:5:2i2r11gR14oR15R16R17i1759R18i1726gR19jR11:5:2i2r11gR14oR15R16R17i1760R18i1725gR19r452goR3jR4:9:2oR3jR4:1:1r442R14oR15R16R17i1771R18i1763gR19r443gar171r172hR14oR15R16R17i1774R18i1763gR19jR11:5:2i2r11gR14oR15R16R17i1774R18i1725gR19jR11:5:2i2r11gR14oR15R16R17i1774R18i1703gR19r428goR3jR4:10:3oR3jR4:1:1oR6r38R8y10:pixelAlignR10r54R29ajR30:0:1nhR13i-328gR14oR15R16R17i1880R18i1870gR19r54goR3jR4:5:3jR5:20:1jR5:3:0oR3jR4:9:2oR3jR4:1:1r64R14oR15R16R17i1899R18i1883gR19r65gar69r99hR14oR15R16R17i1902R18i1883gR19jR11:5:2i2r11goR3jR4:1:1oR6r38R8y16:halfPixelInverseR10jR11:5:2i2r11R13i-329gR14oR15R16R17i1922R18i1906gR19r488gR14oR15R16R17i1922R18i1883gR19r485gnR14oR15R16R17i1922R18i1866gR19r188goR3jR4:5:3r7oR3jR4:1:1oR6jR7:5:0R8R21R10jR11:5:2i4r11R22oR6r498R8y6:outputR10jR11:12:1ar497oR6r498R8R25R10jR11:5:2i4r11R22r500R13i-311ghR13i-309gR13i-310gR14oR15R16R17i1943R18i1928gR19r499goR3jR4:1:1r64R14oR15R16R17i1962R18i1946gR19r65gR14oR15R16R17i1962R18i1928gR19r499ghR14oR15R16R17i1968R18i1467gR19r188gR6jR44:0:0R45oR6r327R8y6:vertexR10jR11:13:1aoR1ahR35r188ghR13i-332gR35r188goR1ahR2oR3jR4:4:1aoR3jR4:5:3r7oR3jR4:1:1r502R14oR15R16R17i2012R18i2000gR19r503goR3jR4:1:1r254R14oR15R16R17i2025R18i2015gR19r255gR14oR15R16R17i2025R18i2000gR19r503ghR14oR15R16R17i2031R18i1994gR19r188gR6jR44:1:0R45oR6r327R8y8:fragmentR10jR11:13:1aoR1ahR35r188ghR13i-333gR35r188ghR8y17:h3d.shader.Base2dy4:varsar202r515r37r110r209r326r64r536r303r470r487r283r223r9r500r53r157r27r264oR6jR7:0:0R8y4:timeR10r39R13i-312gr382r254r412r442hg";
h3d_shader_BaseMesh.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey16:relativePositiony4:typejy9:hxsl.Type:5:2i3jy12:hxsl.VecType:1:0y2:idi-41gy1:poy4:filey65:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FBaseMesh.hxy3:maxi1268y3:mini1252gy1:tr12goR3jR4:1:1oR6jR7:1:0R8y8:positionR10jR11:5:2i3r11y6:parentoR6r17R8y5:inputR10jR11:12:1ar16oR6r17R8y6:normalR10jR11:5:2i3r11R21r19R13i-35ghR13i-33gR13i-34gR14oR15R16R17i1285R18i1271gR19r18gR14oR15R16R17i1285R18i1252gR19r12goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y19:transformedPositionR10jR11:5:2i3r11R13i-42gR14oR15R16R17i1310R18i1291gR19r31goR3jR4:5:3jR5:1:0oR3jR4:1:1r9R14oR15R16R17i1329R18i1313gR19r12goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:50:0R14oR15R16R17i1348R18i1332gR19jR11:13:1ahgaoR3jR4:1:1oR6jR7:0:0R8y9:modelViewR10jR11:7:0R21oR6r49R8y6:globalR10jR11:12:1aoR6r49R8y4:timeR10jR11:3:0R21r51R13i-29goR6r49R8y9:pixelSizeR10jR11:5:2i2r11R21r51R13i-30gr48oR6r49R8y16:modelViewInverseR10r50R21r51y10:qualifiersajy17:hxsl.VarQualifier:3:0hR13i-32ghR13i-28gR31ar59hR13i-31gR14oR15R16R17i1348R18i1332gR19r50ghR14oR15R16R17i1357R18i1332gR19jR11:8:0gR14oR15R16R17i1357R18i1313gR19jR11:5:2i3r11gR14oR15R16R17i1357R18i1291gR19r31goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y17:projectedPositionR10jR11:5:2i4r11R13i-45gR14oR15R16R17i1380R18i1363gR19r75goR3jR4:5:3r35oR3jR4:8:2oR3jR4:2:1jR25:40:0R14oR15R16R17i1387R18i1383gR19jR11:13:1ahgaoR3jR4:1:1r30R14oR15R16R17i1407R18i1388gR19r31goR3jR4:0:1jy10:hxsl.Const:3:1i1R14oR15R16R17i1410R18i1409gR19r54ghR14oR15R16R17i1411R18i1383gR19jR11:5:2i4r11goR3jR4:1:1oR6r49R8y8:viewProjR10r50R21oR6r49R8y6:cameraR10jR11:12:1aoR6r49R8y4:viewR10r50R21r99R13i-19goR6r49R8y4:projR10r50R21r99R13i-20goR6r49R8R20R10jR11:5:2i3r11R21r99R13i-21goR6r49R8y8:projDiagR10jR11:5:2i3r11R21r99R13i-22gr98oR6r49R8y15:inverseViewProjR10r50R21r99R13i-24goR6r49R8y5:zNearR10r54R21r99R13i-25goR6r49R8y4:zFarR10r54R21r99R13i-26goR6jR7:3:0R8y3:dirR10jR11:5:2i3r11R21r99R13i-27ghR13i-18gR13i-23gR14oR15R16R17i1429R18i1414gR19r50gR14oR15R16R17i1429R18i1383gR19jR11:5:2i4r11gR14oR15R16R17i1429R18i1363gR19r75goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y17:transformedNormalR10jR11:5:2i3r11R13i-44gR14oR15R16R17i1452R18i1435gR19r124goR3jR4:8:2oR3jR4:2:1jR25:31:0R14oR15R16R17i1495R18i1455gR19jR11:13:1aoR1aoR8y1:_R10r69ghy3:retr69ghgaoR3jR4:3:1oR3jR4:5:3r35oR3jR4:1:1r21R14oR15R16R17i1468R18i1456gR19r22goR3jR4:8:2oR3jR4:2:1jR25:48:0R14oR15R16R17i1487R18i1471gR19jR11:13:1ahgaoR3jR4:1:1r48R14oR15R16R17i1487R18i1471gR19r50ghR14oR15R16R17i1494R18i1471gR19jR11:6:0gR14oR15R16R17i1494R18i1456gR19r69gR14oR15R16R17i1495R18i1455gR19r69ghR14oR15R16R17i1507R18i1455gR19r69gR14oR15R16R17i1507R18i1435gR19r124goR3jR4:5:3r7oR3jR4:1:1r110R14oR15R16R17i1523R18i1513gR19r112goR3jR4:8:2oR3jR4:2:1r129R14oR15R16R17i1565R18i1526gR19jR11:13:1aoR1aoR8R45R10jR11:5:2i3r11ghR46r69ghgaoR3jR4:3:1oR3jR4:5:3jR5:3:0oR3jR4:1:1r103R14oR15R16R17i1542R18i1527gR19r104goR3jR4:1:1r30R14oR15R16R17i1564R18i1545gR19r31gR14oR15R16R17i1564R18i1527gR19r177gR14oR15R16R17i1565R18i1526gR19r177ghR14oR15R16R17i1577R18i1526gR19r69gR14oR15R16R17i1577R18i1513gR19r112goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y10:pixelColorR10jR11:5:2i4r11R13i-46gR14oR15R16R17i1593R18i1583gR19r200goR3jR4:1:1oR6jR7:2:0R8y5:colorR10jR11:5:2i4r11R13i-51gR14oR15R16R17i1601R18i1596gR19r206gR14oR15R16R17i1601R18i1583gR19r200goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y9:specPowerR10r54R13i-49gR14oR15R16R17i1616R18i1607gR19r54goR3jR4:1:1oR6r205R8y13:specularPowerR10r54R31ajR32:7:2d0d100hR13i-52gR14oR15R16R17i1632R18i1619gR19r54gR14oR15R16R17i1632R18i1607gR19r54goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y9:specColorR10jR11:5:2i3r11R13i-50gR14oR15R16R17i1647R18i1638gR19r227goR3jR4:5:3r35oR3jR4:1:1oR6r205R8y13:specularColorR10jR11:5:2i3r11R13i-54gR14oR15R16R17i1663R18i1650gR19r233goR3jR4:1:1oR6r205R8y14:specularAmountR10r54R31ajR32:7:2d0d10hR13i-53gR14oR15R16R17i1680R18i1666gR19r54gR14oR15R16R17i1680R18i1650gR19r233gR14oR15R16R17i1680R18i1638gR19r227goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y8:screenUVR10jR11:5:2i2r11R13i-48gR14oR15R16R17i1694R18i1686gR19r249goR3jR4:5:3jR5:0:0oR3jR4:5:3r35oR3jR4:3:1oR3jR4:5:3jR5:2:0oR3jR4:9:2oR3jR4:1:1r74R14oR15R16R17i1715R18i1698gR19r75gajy14:hxsl.Component:0:0jR55:1:0hR14oR15R16R17i1718R18i1698gR19jR11:5:2i2r11goR3jR4:9:2oR3jR4:1:1r74R14oR15R16R17i1738R18i1721gR19r75gajR55:3:0hR14oR15R16R17i1740R18i1721gR19r54gR14oR15R16R17i1740R18i1698gR19r267gR14oR15R16R17i1741R18i1697gR19r267goR3jR4:8:2oR3jR4:2:1jR25:38:0R14oR15R16R17i1748R18i1744gR19jR11:13:1ahgaoR3jR4:0:1jR34:3:1d0.5R14oR15R16R17i1752R18i1749gR19r54goR3jR4:0:1jR34:3:1d-0.5R14oR15R16R17i1758R18i1754gR19r54ghR14oR15R16R17i1759R18i1744gR19jR11:5:2i2r11gR14oR15R16R17i1759R18i1697gR19jR11:5:2i2r11goR3jR4:0:1jR34:3:1d0.5R14oR15R16R17i1765R18i1762gR19r54gR14oR15R16R17i1765R18i1697gR19r301gR14oR15R16R17i1765R18i1686gR19r249goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y5:depthR10r54R13i-47gR14oR15R16R17i1776R18i1771gR19r54goR3jR4:5:3r257oR3jR4:9:2oR3jR4:1:1r74R14oR15R16R17i1796R18i1779gR19r75gajR55:2:0hR14oR15R16R17i1798R18i1779gR19r54goR3jR4:9:2oR3jR4:1:1r74R14oR15R16R17i1818R18i1801gR19r75gar273hR14oR15R16R17i1820R18i1801gR19r54gR14oR15R16R17i1820R18i1779gR19r54gR14oR15R16R17i1820R18i1771gR19r54ghR14oR15R16R17i1826R18i1246gR19jR11:0:0gR6jy17:hxsl.FunctionKind:2:0y3:refoR6jR7:6:0R8y8:__init__R10jR11:13:1aoR1ahR46r337ghR13i-55gR46r337goR1ahR2oR3jR4:4:1aoR3jR4:5:3r7oR3jR4:1:1r123R14oR15R16R17i1883R18i1866gR19r124goR3jR4:8:2oR3jR4:2:1r129R14oR15R16R17i1903R18i1886gR19jR11:13:1aoR1aoR8R45R10r124ghR46r69ghgaoR3jR4:1:1r123R14oR15R16R17i1903R18i1886gR19r124ghR14oR15R16R17i1915R18i1886gR19r69gR14oR15R16R17i1915R18i1866gR19r124goR3jR4:5:3r7oR3jR4:1:1r248R14oR15R16R17i2024R18i2016gR19r249goR3jR4:5:3r253oR3jR4:5:3r35oR3jR4:3:1oR3jR4:5:3r257oR3jR4:9:2oR3jR4:1:1r74R14oR15R16R17i2045R18i2028gR19r75gar263r264hR14oR15R16R17i2048R18i2028gR19jR11:5:2i2r11goR3jR4:9:2oR3jR4:1:1r74R14oR15R16R17i2068R18i2051gR19r75gar273hR14oR15R16R17i2070R18i2051gR19r54gR14oR15R16R17i2070R18i2028gR19r385gR14oR15R16R17i2071R18i2027gR19r385goR3jR4:8:2oR3jR4:2:1r282R14oR15R16R17i2078R18i2074gR19r286gaoR3jR4:0:1jR34:3:1d0.5R14oR15R16R17i2082R18i2079gR19r54goR3jR4:0:1jR34:3:1d-0.5R14oR15R16R17i2088R18i2084gR19r54ghR14oR15R16R17i2089R18i2074gR19jR11:5:2i2r11gR14oR15R16R17i2089R18i2027gR19jR11:5:2i2r11goR3jR4:0:1jR34:3:1d0.5R14oR15R16R17i2095R18i2092gR19r54gR14oR15R16R17i2095R18i2027gR19r415gR14oR15R16R17i2095R18i2016gR19r249goR3jR4:5:3r7oR3jR4:1:1r312R14oR15R16R17i2106R18i2101gR19r54goR3jR4:5:3r257oR3jR4:9:2oR3jR4:1:1r74R14oR15R16R17i2126R18i2109gR19r75gar321hR14oR15R16R17i2128R18i2109gR19r54goR3jR4:9:2oR3jR4:1:1r74R14oR15R16R17i2148R18i2131gR19r75gar273hR14oR15R16R17i2150R18i2131gR19r54gR14oR15R16R17i2150R18i2109gR19r54gR14oR15R16R17i2150R18i2101gR19r54goR3jR4:5:3r7oR3jR4:1:1r213R14oR15R16R17i2243R18i2234gR19r54goR3jR4:1:1r217R14oR15R16R17i2259R18i2246gR19r54gR14oR15R16R17i2259R18i2234gR19r54goR3jR4:5:3r7oR3jR4:1:1r226R14oR15R16R17i2274R18i2265gR19r227goR3jR4:5:3r35oR3jR4:1:1r232R14oR15R16R17i2290R18i2277gR19r233goR3jR4:1:1r237R14oR15R16R17i2307R18i2293gR19r54gR14oR15R16R17i2307R18i2277gR19r233gR14oR15R16R17i2307R18i2265gR19r227ghR14oR15R16R17i2313R18i1860gR19r337gR6r338R58oR6r340R8y16:__init__fragmentR10jR11:13:1aoR1ahR46r337ghR13i-56gR46r337goR1ahR2oR3jR4:4:1aoR3jR4:5:3r7oR3jR4:1:1oR6jR7:5:0R8R20R10jR11:5:2i4r11R21oR6r485R8y6:outputR10jR11:12:1ar484oR6r485R8R48R10jR11:5:2i4r11R21r487R13i-38goR6r485R8R56R10jR11:5:2i4r11R21r487R13i-39goR6r485R8R23R10jR11:5:2i4r11R21r487R13i-40ghR13i-36gR13i-37gR14oR15R16R17i2358R18i2343gR19r486goR3jR4:1:1r74R14oR15R16R17i2378R18i2361gR19r75gR14oR15R16R17i2378R18i2343gR19r486goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y24:pixelTransformedPositionR10jR11:5:2i3r11R13i-43gR14oR15R16R17i2408R18i2384gR19r506goR3jR4:1:1r30R14oR15R16R17i2430R18i2411gR19r31gR14oR15R16R17i2430R18i2384gR19r506ghR14oR15R16R17i2436R18i2337gR19r337gR6jR57:0:0R58oR6r340R8y6:vertexR10jR11:13:1aoR1ahR46r337ghR13i-57gR46r337goR1ahR2oR3jR4:4:1aoR3jR4:5:3r7oR3jR4:1:1r489R14oR15R16R17i2480R18i2468gR19r490goR3jR4:1:1r199R14oR15R16R17i2493R18i2483gR19r200gR14oR15R16R17i2493R18i2468gR19r490goR3jR4:5:3r7oR3jR4:1:1r491R14oR15R16R17i2511R18i2499gR19r492goR3jR4:8:2oR3jR4:2:1jR25:52:0R14oR15R16R17i2518R18i2514gR19jR11:13:1aoR1aoR8y5:valueR10r54ghR46jR11:5:2i4r11ghgaoR3jR4:1:1r312R14oR15R16R17i2524R18i2519gR19r54ghR14oR15R16R17i2525R18i2514gR19r548gR14oR15R16R17i2525R18i2499gR19r492goR3jR4:5:3r7oR3jR4:1:1r493R14oR15R16R17i2544R18i2531gR19r494goR3jR4:8:2oR3jR4:2:1jR25:54:0R14oR15R16R17i2557R18i2547gR19jR11:13:1aoR1aoR8R64R10jR11:5:2i3r11ghR46jR11:5:2i4r11ghgaoR3jR4:1:1r123R14oR15R16R17i2575R18i2558gR19r124ghR14oR15R16R17i2576R18i2547gR19r572gR14oR15R16R17i2576R18i2531gR19r494ghR14oR15R16R17i2582R18i2462gR19r337gR6jR57:1:0R58oR6r340R8y8:fragmentR10jR11:13:1aoR1ahR46r337ghR13i-58gR46r337ghR8y19:h3d.shader.BaseMeshy4:varsar74r312r517r123r237r226r232r339r585r217r473r9r99r487r248r51r19r30r204r213r505r199hg";
h3d_shader_Bloom.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:5:0y4:namey8:positiony4:typejy9:hxsl.Type:5:2i4jy12:hxsl.VecType:1:0y6:parentoR6r10R8y6:outputR10jR11:12:1ar9oR6r10R8y5:colorR10jR11:5:2i4r11R13r13y2:idi-550ghR16i-548gR16i-549gy1:poy4:filey69:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FScreenShader.hxy3:maxi262y3:mini247gy1:tr12goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:40:0R17oR18R19R20i269R21i265gR22jR11:13:1ahgaoR3jR4:1:1oR6jR7:1:0R8R9R10jR11:5:2i2r11R13oR6r30R8y5:inputR10jR11:12:1ar29oR6r30R8y2:uvR10jR11:5:2i2r11R13r32R16i-547ghR16i-545gR16i-546gR17oR18R19R20i284R21i270gR22r31goR3jR4:0:1jy10:hxsl.Const:3:1zR17oR18R19R20i287R21i286gR22jR11:3:0goR3jR4:0:1jR26:3:1i1R17oR18R19R20i290R21i289gR22r43ghR17oR18R19R20i291R21i265gR22jR11:5:2i4r11gR17oR18R19R20i291R21i247gR22r12ghR17oR18R19R20i297R21i241gR22jR11:0:0gR6jy17:hxsl.FunctionKind:0:0y3:refoR6jR7:6:0R8y6:vertexR10jR11:13:1aoR1ahy3:retr55ghR16i-554gR30r55goR1ahR2oR3jR4:4:1aoR3jR4:7:2oR6jR7:4:0R8y1:cR10jR11:5:2i4r11R16i-556goR3jR4:8:2oR3jR4:2:1jR23:33:0R17oR18y62:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FBloom.hxR20i223R21i216gR22jR11:13:1aoR1aoR8y1:_R10jR11:10:0goR8y1:bR10jR11:5:2i2r11ghR30r70ghgaoR3jR4:1:1oR6jR7:2:0R8y7:textureR10r80R16i-551gR17oR18R32R20i223R21i216gR22r80goR3jR4:1:1r34R17oR18R32R20i236R21i228gR22r35ghR17oR18R32R20i237R21i216gR22r70gR17oR18R32R20i238R21i208gR22r55goR3jR4:7:2oR6r69R8y3:lumR10r43R16i-557goR3jR4:8:2oR3jR4:2:1jR23:29:0R17oR18R32R20i258R21i253gR22jR11:13:1aoR1aoR8R33R10jR11:5:2i3r11goR8R34R10jR11:5:2i3r11ghR30r43ghgaoR3jR4:9:2oR3jR4:1:1r68R17oR18R32R20i254R21i253gR22r70gajy14:hxsl.Component:0:0jR37:1:0jR37:2:0hR17oR18R32R20i258R21i253gR22r108goR3jR4:8:2oR3jR4:2:1jR23:39:0R17oR18R32R20i267R21i263gR22jR11:13:1ahgaoR3jR4:0:1jR26:3:1d0.2126R17oR18R32R20i274R21i268gR22r43goR3jR4:0:1jR26:3:1d0.7152R17oR18R32R20i282R21i276gR22r43goR3jR4:0:1jR26:3:1d0.0722R17oR18R32R20i290R21i284gR22r43ghR17oR18R32R20i291R21i263gR22jR11:5:2i3r11ghR17oR18R32R20i292R21i253gR22r43gR17oR18R32R20i293R21i243gR22r55goR3jR4:5:3r7oR3jR4:1:1r15R17oR18R32R20i310R21i298gR22r16goR3jR4:8:2oR3jR4:2:1r22R17oR18R32R20i317R21i313gR22r26gaoR3jR4:5:3jR5:1:0oR3jR4:5:3r160oR3jR4:5:3r160oR3jR4:9:2oR3jR4:1:1r68R17oR18R32R20i319R21i318gR22r70gar118r119r120hR17oR18R32R20i323R21i318gR22jR11:5:2i3r11goR3jR4:8:2oR3jR4:2:1jR23:8:0R17oR18R32R20i329R21i326gR22jR11:13:1aoR1aoR8R33R10r43goR8R34R10r43ghR30r43ghgaoR3jR4:1:1r98R17oR18R32R20i329R21i326gR22r43goR3jR4:1:1oR6r87R8y5:powerR10r43R16i-552gR17oR18R32R20i339R21i334gR22r43ghR17oR18R32R20i340R21i326gR22r43gR17oR18R32R20i340R21i318gR22r170goR3jR4:1:1oR6r87R8y6:amountR10r43R16i-553gR17oR18R32R20i349R21i343gR22r43gR17oR18R32R20i349R21i318gR22r170goR3jR4:9:2oR3jR4:1:1r68R17oR18R32R20i353R21i352gR22r70gajR37:3:0hR17oR18R32R20i355R21i352gR22r43gR17oR18R32R20i355R21i318gR22r170goR3jR4:9:2oR3jR4:1:1r68R17oR18R32R20i358R21i357gR22r70gar205hR17oR18R32R20i360R21i357gR22r43ghR17oR18R32R20i361R21i313gR22jR11:5:2i4r11gR17oR18R32R20i361R21i298gR22r16ghR17oR18R32R20i367R21i202gR22r55gR6jR27:1:0R28oR6r58R8y8:fragmentR10jR11:13:1aoR1ahR30r55ghR16i-555gR30r55ghR8y16:h3d.shader.Bloomy4:varsar57r195r225r86r187r13r32hg";
h3d_shader_Blur.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:5:0y4:namey8:positiony4:typejy9:hxsl.Type:5:2i4jy12:hxsl.VecType:1:0y6:parentoR6r10R8y6:outputR10jR11:12:1ar9oR6r10R8y5:colorR10jR11:5:2i4r11R13r13y2:idi-196ghR16i-194gR16i-195gy1:poy4:filey69:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FScreenShader.hxy3:maxi262y3:mini247gy1:tr12goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:40:0R17oR18R19R20i269R21i265gR22jR11:13:1ahgaoR3jR4:1:1oR6jR7:1:0R8R9R10jR11:5:2i2r11R13oR6r30R8y5:inputR10jR11:12:1ar29oR6r30R8y2:uvR10jR11:5:2i2r11R13r32R16i-193ghR16i-191gR16i-192gR17oR18R19R20i284R21i270gR22r31goR3jR4:0:1jy10:hxsl.Const:3:1zR17oR18R19R20i287R21i286gR22jR11:3:0goR3jR4:0:1jR26:3:1i1R17oR18R19R20i290R21i289gR22r43ghR17oR18R19R20i291R21i265gR22jR11:5:2i4r11gR17oR18R19R20i291R21i247gR22r12ghR17oR18R19R20i297R21i241gR22jR11:0:0gR6jy17:hxsl.FunctionKind:0:0y3:refoR6jR7:6:0R8y6:vertexR10jR11:13:1aoR1ahy3:retr55ghR16i-210gR30r55goR1ahR2oR3jR4:4:1aoR3jR4:10:3oR3jR4:1:1oR6jR7:2:0R8y16:isDepthDependantR10jR11:2:0y10:qualifiersajy17:hxsl.VarQualifier:0:1nhR16i-207gR17oR18y61:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FBlur.hxR20i638R21i622gR22r71goR3jR4:4:1aoR3jR4:7:2oR6jR7:4:0R8y4:pcurR10jR11:5:2i3r11R16i-214goR3jR4:8:2oR3jR4:1:1oR6r58R8y11:getPositionR10jR11:13:1aoR1aoR8R25R10jR11:5:2i2r11ghR30r81ghR16i-213gR17oR18R34R20i670R21i659gR22r90gaoR3jR4:1:1r34R17oR18R34R20i679R21i671gR22r35ghR17oR18R34R20i680R21i659gR22r81gR17oR18R34R20i681R21i648gR22r55goR3jR4:7:2oR6r80R8y4:ccurR10jR11:5:2i4r11R16i-215goR3jR4:8:2oR3jR4:2:1jR23:33:0R17oR18R34R20i705R21i698gR22jR11:13:1aoR1aoR8y1:_R10jR11:10:0goR8y1:bR10jR11:5:2i2r11ghR30r103ghgaoR3jR4:1:1oR6r70R8y7:textureR10r113R16i-198gR17oR18R34R20i705R21i698gR22r113goR3jR4:1:1r34R17oR18R34R20i718R21i710gR22r35ghR17oR18R34R20i719R21i698gR22r103gR17oR18R34R20i720R21i687gR22r55goR3jR4:7:2oR6r80R8R15R10jR11:5:2i4r11R16i-216goR3jR4:8:2oR3jR4:2:1r22R17oR18R34R20i742R21i738gR22r26gaoR3jR4:0:1jR26:3:1zR17oR18R34R20i744R21i743gR22r43goR3jR4:0:1jR26:3:1zR17oR18R34R20i747R21i746gR22r43goR3jR4:0:1jR26:3:1zR17oR18R34R20i750R21i749gR22r43goR3jR4:0:1jR26:3:1zR17oR18R34R20i753R21i752gR22r43ghR17oR18R34R20i754R21i738gR22r131gR17oR18R34R20i755R21i726gR22r55goR3jR4:7:2oR6r80R8y4:ncurR10jR11:5:2i3r11R16i-217goR3jR4:8:2oR3jR4:2:1jR23:55:0R17oR18R34R20i784R21i772gR22jR11:13:1aoR1aoR8y5:valueR10jR11:5:2i4r11ghR30r159ghgaoR3jR4:8:2oR3jR4:2:1r106R17oR18R34R20i798R21i785gR22jR11:13:1aoR1aoR8R38R10r113gr114hR30r103ghgaoR3jR4:1:1oR6r70R8y13:normalTextureR10r113R16i-209gR17oR18R34R20i798R21i785gR22r113goR3jR4:1:1r34R17oR18R34R20i811R21i803gR22r35ghR17oR18R34R20i812R21i785gR22r103ghR17oR18R34R20i813R21i772gR22r159gR17oR18R34R20i814R21i761gR22r55goR3jR4:13:3oR6r80R8y1:iR10jR11:1:0R16i-218goR3jR4:5:3jR5:21:0oR3jR4:5:3jR5:0:0oR3jR4:6:2jy15:haxe.macro.Unop:3:0oR3jR4:1:1oR6r70R8y7:QualityR10r197R32ajR33:0:1nhR16i-200gR17oR18R34R20i838R21i831gR22r197gR17oR18R34R20i838R21i830gR22r197goR3jR4:0:1jR26:2:1i1R17oR18R34R20i845R21i841gR22r197gR17oR18R34R20i845R21i830gR22r197goR3jR4:1:1r205R17oR18R34R20i852R21i845gR22r197gR17oR18R34R20i852R21i830gR22jR11:14:2r197jy13:hxsl.SizeDecl:0:1zgoR3jR4:4:1aoR3jR4:7:2oR6r80R8R25R10jR11:5:2i2r11R16i-219goR3jR4:5:3r201oR3jR4:1:1r34R17oR18R34R20i880R21i872gR22r35goR3jR4:5:3jR5:1:0oR3jR4:1:1oR6r70R8y5:pixelR10jR11:5:2i2r11R16i-203gR17oR18R34R20i888R21i883gR22r238goR3jR4:8:2oR3jR4:2:1jR23:36:0R17oR18R34R20i896R21i891gR22jR11:13:1aoR1aoR8R42R10r197ghR30r43ghgaoR3jR4:1:1r196R17oR18R34R20i898R21i897gR22r197ghR17oR18R34R20i899R21i891gR22r43gR17oR18R34R20i899R21i883gR22r238gR17oR18R34R20i899R21i872gR22r229gR17oR18R34R20i900R21i863gR22r55goR3jR4:7:2oR6r80R8y1:cR10r103R16i-220goR3jR4:8:2oR3jR4:2:1r106R17oR18R34R20i922R21i915gR22jR11:13:1aoR1aoR8R38R10r113gr114hR30r103ghgaoR3jR4:1:1r119R17oR18R34R20i922R21i915gR22r113goR3jR4:1:1r228R17oR18R34R20i929R21i927gR22r229ghR17oR18R34R20i930R21i915gR22r103gR17oR18R34R20i931R21i907gR22r55goR3jR4:7:2oR6r80R8R17R10r81R16i-221goR3jR4:8:2oR3jR4:1:1r84R17oR18R34R20i957R21i946gR22r90gaoR3jR4:1:1r228R17oR18R34R20i960R21i958gR22r229ghR17oR18R34R20i961R21i946gR22r81gR17oR18R34R20i962R21i938gR22r55goR3jR4:7:2oR6r80R8y1:dR10r43R16i-222goR3jR4:8:2oR3jR4:2:1jR23:29:0R17oR18R34R20i987R21i977gR22jR11:13:1aoR1aoR8R38R10jR11:5:2i3r11goR8R39R10jR11:5:2i3r11ghR30r43ghgaoR3jR4:3:1oR3jR4:5:3jR5:3:0oR3jR4:1:1r286R17oR18R34R20i979R21i978gR22r81goR3jR4:1:1r79R17oR18R34R20i986R21i982gR22r81gR17oR18R34R20i986R21i978gR22r310gR17oR18R34R20i987R21i977gR22r310goR3jR4:5:3r317oR3jR4:1:1r286R17oR18R34R20i993R21i992gR22r81goR3jR4:1:1r79R17oR18R34R20i1000R21i996gR22r81gR17oR18R34R20i1000R21i992gR22jR11:5:2i3r11ghR17oR18R34R20i1001R21i977gR22r43gR17oR18R34R20i1002R21i969gR22r55goR3jR4:7:2oR6r80R8y1:nR10r159R16i-223goR3jR4:8:2oR3jR4:2:1r162R17oR18R34R20i1029R21i1017gR22r170gaoR3jR4:8:2oR3jR4:2:1r106R17oR18R34R20i1043R21i1030gR22jR11:13:1aoR1aoR8R38R10r113gr114hR30r103ghgaoR3jR4:1:1r183R17oR18R34R20i1043R21i1030gR22r113goR3jR4:1:1r228R17oR18R34R20i1050R21i1048gR22r229ghR17oR18R34R20i1051R21i1030gR22r103ghR17oR18R34R20i1052R21i1017gR22r159gR17oR18R34R20i1053R21i1009gR22r55goR3jR4:5:3r7oR3jR4:1:1r264R17oR18R34R20i1063R21i1062gR22r103goR3jR4:8:2oR3jR4:2:1jR23:24:0R17oR18R34R20i1069R21i1066gR22jR11:13:1aoR1aoR8y1:xR10r103goR8y1:yR10r103goR8y1:aR10r43ghR30r103ghgaoR3jR4:1:1r102R17oR18R34R20i1074R21i1070gR22r103goR3jR4:1:1r264R17oR18R34R20i1077R21i1076gR22r103goR3jR4:8:2oR3jR4:2:1r303R17oR18R34R20i1083R21i1079gR22jR11:13:1aoR1aoR8R38R10r159gr311hR30r43ghgaoR3jR4:1:1r158R17oR18R34R20i1083R21i1079gR22r159goR3jR4:1:1r343R17oR18R34R20i1089R21i1088gR22r159ghR17oR18R34R20i1090R21i1079gR22r43ghR17oR18R34R20i1091R21i1066gR22r103gR17oR18R34R20i1091R21i1062gR22r103goR3jR4:5:3r7oR3jR4:1:1r264R17oR18R34R20i1100R21i1099gR22r103goR3jR4:8:2oR3jR4:2:1r377R17oR18R34R20i1106R21i1103gR22jR11:13:1ar381hgaoR3jR4:1:1r264R17oR18R34R20i1108R21i1107gR22r103goR3jR4:1:1r102R17oR18R34R20i1114R21i1110gR22r103goR3jR4:8:2oR3jR4:2:1jR23:21:0R17oR18R34R20i1146R21i1116gR22jR11:13:1aoR1aoR8R38R10r43goR8R39R10r43ghR30r43ghgaoR3jR4:3:1oR3jR4:5:3r235oR3jR4:8:2oR3jR4:2:1jR23:22:0R17oR18R34R20i1128R21i1117gR22jR11:13:1aoR1aoR8R38R10r43gr442hR30r43ghgaoR3jR4:3:1oR3jR4:5:3r317oR3jR4:1:1r300R17oR18R34R20i1119R21i1118gR22r43goR3jR4:0:1jR26:3:1d0.001R17oR18R34R20i1127R21i1122gR22r43gR17oR18R34R20i1127R21i1118gR22r43gR17oR18R34R20i1128R21i1117gR22r43goR3jR4:0:1jR26:3:1d0R17oR18R34R20i1135R21i1133gR22r43ghR17oR18R34R20i1136R21i1117gR22r43goR3jR4:0:1jR26:3:1i100000R17oR18R34R20i1145R21i1139gR22r43gR17oR18R34R20i1145R21i1117gR22r43gR17oR18R34R20i1146R21i1116gR22r43goR3jR4:0:1jR26:3:1d1R17oR18R34R20i1153R21i1151gR22r43ghR17oR18R34R20i1154R21i1116gR22r43ghR17oR18R34R20i1155R21i1103gR22r103gR17oR18R34R20i1155R21i1099gR22r103goR3jR4:5:3jR5:20:1r201oR3jR4:1:1r130R17oR18R34R20i1168R21i1163gR22r131goR3jR4:5:3r235oR3jR4:1:1r264R17oR18R34R20i1173R21i1172gR22r103goR3jR4:16:2oR3jR4:1:1oR6r70R8y6:valuesR10jR11:14:2r43jR47:1:1r205R16i-202gR17oR18R34R20i1182R21i1176gR22r508goR3jR4:10:3oR3jR4:5:3jR5:9:0oR3jR4:1:1r196R17oR18R34R20i1184R21i1183gR22r197goR3jR4:0:1jR26:2:1zR17oR18R34R20i1188R21i1187gR22r197gR17oR18R34R20i1188R21i1183gR22r71goR3jR4:6:2r203oR3jR4:1:1r196R17oR18R34R20i1193R21i1192gR22r197gR17oR18R34R20i1193R21i1191gR22r197goR3jR4:1:1r196R17oR18R34R20i1197R21i1196gR22r197gR17oR18R34R20i1197R21i1183gR22r197gR17oR18R34R20i1198R21i1176gR22r43gR17oR18R34R20i1198R21i1172gR22r103gR17oR18R34R20i1198R21i1163gR22r131ghR17oR18R34R20i1206R21i855gR22r55gR17oR18R34R20i1206R21i820gR22r55goR3jR4:5:3r7oR3jR4:1:1r15R17oR18R34R20i1224R21i1212gR22r16goR3jR4:1:1r130R17oR18R34R20i1232R21i1227gR22r131gR17oR18R34R20i1232R21i1212gR22r16ghR17oR18R34R20i1239R21i641gR22r55goR3jR4:10:3oR3jR4:1:1oR6r70R8y7:isDepthR10r71R32ajR33:0:1nhR16i-201gR17oR18R34R20i1260R21i1253gR22r71goR3jR4:4:1aoR3jR4:7:2oR6r80R8y3:valR10r43R16i-224goR3jR4:0:1jR26:3:1d0R17oR18R34R20i1282R21i1280gR22r43gR17oR18R34R20i1283R21i1270gR22r55goR3jR4:13:3oR6r80R8R44R10r197R16i-225goR3jR4:5:3r199oR3jR4:5:3r201oR3jR4:6:2r203oR3jR4:1:1r205R17oR18R34R20i1307R21i1300gR22r197gR17oR18R34R20i1307R21i1299gR22r197goR3jR4:0:1jR26:2:1i1R17oR18R34R20i1314R21i1310gR22r197gR17oR18R34R20i1314R21i1299gR22r197goR3jR4:1:1r205R17oR18R34R20i1321R21i1314gR22r197gR17oR18R34R20i1321R21i1299gR22jR11:14:2r197jR47:0:1zgoR3jR4:5:3jR5:20:1r201oR3jR4:1:1r565R17oR18R34R20i1333R21i1330gR22r43goR3jR4:5:3r235oR3jR4:8:2oR3jR4:2:1jR23:53:0R17oR18R34R20i1343R21i1337gR22jR11:13:1aoR1aoR8R42R10jR11:5:2i4r11ghR30r43ghgaoR3jR4:8:2oR3jR4:2:1r106R17oR18R34R20i1351R21i1344gR22jR11:13:1aoR1aoR8R38R10r113gr114hR30r103ghgaoR3jR4:1:1r119R17oR18R34R20i1351R21i1344gR22r113goR3jR4:5:3r201oR3jR4:1:1r34R17oR18R34R20i1364R21i1356gR22r35goR3jR4:5:3r235oR3jR4:1:1r237R17oR18R34R20i1372R21i1367gR22r238goR3jR4:8:2oR3jR4:2:1r243R17oR18R34R20i1380R21i1375gR22jR11:13:1ar247hgaoR3jR4:1:1r573R17oR18R34R20i1382R21i1381gR22r197ghR17oR18R34R20i1383R21i1375gR22r43gR17oR18R34R20i1383R21i1367gR22r238gR17oR18R34R20i1383R21i1356gR22jR11:5:2i2r11ghR17oR18R34R20i1384R21i1344gR22r103ghR17oR18R34R20i1385R21i1337gR22r43goR3jR4:16:2oR3jR4:1:1r506R17oR18R34R20i1394R21i1388gR22r508goR3jR4:10:3oR3jR4:5:3r513oR3jR4:1:1r573R17oR18R34R20i1396R21i1395gR22r197goR3jR4:0:1jR26:2:1zR17oR18R34R20i1400R21i1399gR22r197gR17oR18R34R20i1400R21i1395gR22r71goR3jR4:6:2r203oR3jR4:1:1r573R17oR18R34R20i1405R21i1404gR22r197gR17oR18R34R20i1405R21i1403gR22r197goR3jR4:1:1r573R17oR18R34R20i1409R21i1408gR22r197gR17oR18R34R20i1409R21i1395gR22r197gR17oR18R34R20i1410R21i1388gR22r43gR17oR18R34R20i1410R21i1337gR22r43gR17oR18R34R20i1410R21i1330gR22r43gR17oR18R34R20i1410R21i1289gR22r55goR3jR4:5:3r7oR3jR4:1:1r15R17oR18R34R20i1429R21i1417gR22r16goR3jR4:8:2oR3jR4:2:1jR23:52:0R17oR18R34R20i1436R21i1432gR22jR11:13:1aoR1aoR8R42R10r43ghR30jR11:5:2i4r11ghgaoR3jR4:8:2oR3jR4:2:1r435R17oR18R34R20i1440R21i1437gR22jR11:13:1aoR1aoR8R38R10r43gr442hR30r43ghgaoR3jR4:1:1r565R17oR18R34R20i1440R21i1437gR22r43goR3jR4:0:1jR26:3:1d0.9999999R17oR18R34R20i1454R21i1445gR22r43ghR17oR18R34R20i1455R21i1437gR22r43ghR17oR18R34R20i1456R21i1432gR22r702gR17oR18R34R20i1456R21i1417gR22r16ghR17oR18R34R20i1463R21i1263gR22r55goR3jR4:4:1aoR3jR4:7:2oR6r80R8R15R10jR11:5:2i4r11R16i-226goR3jR4:8:2oR3jR4:2:1r22R17oR18R34R20i1492R21i1488gR22r26gaoR3jR4:0:1jR26:3:1zR17oR18R34R20i1494R21i1493gR22r43goR3jR4:0:1jR26:3:1zR17oR18R34R20i1497R21i1496gR22r43goR3jR4:0:1jR26:3:1zR17oR18R34R20i1500R21i1499gR22r43goR3jR4:0:1jR26:3:1zR17oR18R34R20i1503R21i1502gR22r43ghR17oR18R34R20i1504R21i1488gR22r734gR17oR18R34R20i1505R21i1476gR22r55goR3jR4:13:3oR6r80R8R44R10r197R16i-227goR3jR4:5:3r199oR3jR4:5:3r201oR3jR4:6:2r203oR3jR4:1:1r205R17oR18R34R20i1529R21i1522gR22r197gR17oR18R34R20i1529R21i1521gR22r197goR3jR4:0:1jR26:2:1i1R17oR18R34R20i1536R21i1532gR22r197gR17oR18R34R20i1536R21i1521gR22r197goR3jR4:1:1r205R17oR18R34R20i1543R21i1536gR22r197gR17oR18R34R20i1543R21i1521gR22jR11:14:2r197jR47:0:1zgoR3jR4:5:3jR5:20:1r201oR3jR4:1:1r733R17oR18R34R20i1557R21i1552gR22r734goR3jR4:5:3r235oR3jR4:8:2oR3jR4:2:1r106R17oR18R34R20i1568R21i1561gR22jR11:13:1aoR1aoR8R38R10r113gr114hR30r103ghgaoR3jR4:1:1r119R17oR18R34R20i1568R21i1561gR22r113goR3jR4:5:3r201oR3jR4:1:1r34R17oR18R34R20i1581R21i1573gR22r35goR3jR4:5:3r235oR3jR4:1:1r237R17oR18R34R20i1589R21i1584gR22r238goR3jR4:8:2oR3jR4:2:1r243R17oR18R34R20i1597R21i1592gR22jR11:13:1ar247hgaoR3jR4:1:1r761R17oR18R34R20i1599R21i1598gR22r197ghR17oR18R34R20i1600R21i1592gR22r43gR17oR18R34R20i1600R21i1584gR22r238gR17oR18R34R20i1600R21i1573gR22jR11:5:2i2r11ghR17oR18R34R20i1601R21i1561gR22r103goR3jR4:16:2oR3jR4:1:1r506R17oR18R34R20i1610R21i1604gR22r508goR3jR4:10:3oR3jR4:5:3r513oR3jR4:1:1r761R17oR18R34R20i1612R21i1611gR22r197goR3jR4:0:1jR26:2:1zR17oR18R34R20i1616R21i1615gR22r197gR17oR18R34R20i1616R21i1611gR22r71goR3jR4:6:2r203oR3jR4:1:1r761R17oR18R34R20i1621R21i1620gR22r197gR17oR18R34R20i1621R21i1619gR22r197goR3jR4:1:1r761R17oR18R34R20i1625R21i1624gR22r197gR17oR18R34R20i1625R21i1611gR22r197gR17oR18R34R20i1626R21i1604gR22r43gR17oR18R34R20i1626R21i1561gR22r103gR17oR18R34R20i1626R21i1552gR22r734gR17oR18R34R20i1626R21i1511gR22r55goR3jR4:5:3r7oR3jR4:1:1r15R17oR18R34R20i1645R21i1633gR22r16goR3jR4:1:1r733R17oR18R34R20i1653R21i1648gR22r734gR17oR18R34R20i1653R21i1633gR22r16ghR17oR18R34R20i1660R21i1469gR22r55gR17oR18R34R20i1660R21i1249gR22r55gR17oR18R34R20i1660R21i618gR22r55goR3jR4:10:3oR3jR4:1:1oR6r70R8y13:hasFixedColorR10r71R32ajR33:0:1nhR16i-204gR17oR18R34R20i1682R21i1669gR22r71goR3jR4:4:1aoR3jR4:5:3r7oR3jR4:9:2oR3jR4:1:1r15R17oR18R34R20i1704R21i1692gR22r16gajy14:hxsl.Component:0:0jR59:1:0jR59:2:0hR17oR18R34R20i1708R21i1692gR22jR11:5:2i3r11goR3jR4:9:2oR3jR4:1:1oR6r70R8y10:fixedColorR10jR11:5:2i4r11R16i-206gR17oR18R34R20i1721R21i1711gR22r902gar893r894r895hR17oR18R34R20i1725R21i1711gR22jR11:5:2i3r11gR17oR18R34R20i1725R21i1692gR22r898goR3jR4:10:3oR3jR4:1:1oR6r70R8y16:smoothFixedColorR10r71R32ajR33:0:1nhR16i-205gR17oR18R34R20i1752R21i1736gR22r71goR3jR4:5:3jR5:20:1r235oR3jR4:9:2oR3jR4:1:1r15R17oR18R34R20i1773R21i1761gR22r16gajR59:3:0hR17oR18R34R20i1775R21i1761gR22r43goR3jR4:9:2oR3jR4:1:1r901R17oR18R34R20i1789R21i1779gR22r902gar925hR17oR18R34R20i1791R21i1779gR22r43gR17oR18R34R20i1791R21i1761gR22r43goR3jR4:5:3r7oR3jR4:9:2oR3jR4:1:1r15R17oR18R34R20i1821R21i1809gR22r16gar925hR17oR18R34R20i1823R21i1809gR22r43goR3jR4:5:3r235oR3jR4:9:2oR3jR4:1:1r901R17oR18R34R20i1836R21i1826gR22r902gar925hR17oR18R34R20i1838R21i1826gR22r43goR3jR4:8:2oR3jR4:2:1r243R17oR18R34R20i1846R21i1841gR22jR11:13:1aoR1aoR8R42R10r71ghR30r43ghgaoR3jR4:5:3jR5:7:0oR3jR4:9:2oR3jR4:1:1r15R17oR18R34R20i1859R21i1847gR22r16gar925hR17oR18R34R20i1861R21i1847gR22r43goR3jR4:0:1jR26:3:1zR17oR18R34R20i1865R21i1864gR22r43gR17oR18R34R20i1865R21i1847gR22r71ghR17oR18R34R20i1866R21i1841gR22r43gR17oR18R34R20i1866R21i1826gR22r43gR17oR18R34R20i1866R21i1809gR22r43gR17oR18R34R20i1866R21i1732gR22r55ghR17oR18R34R20i1873R21i1685gR22r55gnR17oR18R34R20i1873R21i1665gR22r55ghR17oR18R34R20i1878R21i612gR22r55gR6jR27:1:0R28oR6r58R8y8:fragmentR10jR11:13:1aoR1ahR30r55ghR16i-211gR30r55goR1aoR6r80R8R25R10r89R16i-212ghR2oR3jR4:4:1aoR3jR4:7:2oR6r80R8y5:depthR10r43R16i-228goR3jR4:8:2oR3jR4:2:1r603R17oR18R34R20i1949R21i1943gR22r611gaoR3jR4:8:2oR3jR4:2:1r106R17oR18R34R20i1962R21i1950gR22jR11:13:1aoR1aoR8R38R10r113gr114hR30r103ghgaoR3jR4:1:1oR6r70R8y12:depthTextureR10r113R16i-199gR17oR18R34R20i1962R21i1950gR22r113goR3jR4:1:1r1000R17oR18R34R20i1969R21i1967gR22r89ghR17oR18R34R20i1970R21i1950gR22r103ghR17oR18R34R20i1971R21i1943gR22r43gR17oR18R34R20i1972R21i1931gR22r55goR3jR4:7:2oR6r80R8y3:uv2R10jR11:5:2i2r11R16i-229goR3jR4:5:3r235oR3jR4:3:1oR3jR4:5:3r317oR3jR4:1:1r1000R17oR18R34R20i1990R21i1988gR22r89goR3jR4:0:1jR26:3:1d0.5R17oR18R34R20i1996R21i1993gR22r43gR17oR18R34R20i1996R21i1988gR22r89gR17oR18R34R20i1997R21i1987gR22r89goR3jR4:8:2oR3jR4:2:1jR23:38:0R17oR18R34R20i2004R21i2000gR22jR11:13:1ahgaoR3jR4:0:1jR26:3:1i2R17oR18R34R20i2006R21i2005gR22r43goR3jR4:0:1jR26:3:1i-2R17oR18R34R20i2010R21i2008gR22r43ghR17oR18R34R20i2011R21i2000gR22jR11:5:2i2r11gR17oR18R34R20i2011R21i1987gR22r1035gR17oR18R34R20i2012R21i1977gR22r55goR3jR4:7:2oR6r80R8y4:tempR10r103R16i-230goR3jR4:5:3r235oR3jR4:8:2oR3jR4:2:1r22R17oR18R34R20i2032R21i2028gR22r26gaoR3jR4:1:1r1034R17oR18R34R20i2036R21i2033gR22r1035goR3jR4:1:1r1004R17oR18R34R20i2043R21i2038gR22r43goR3jR4:0:1jR26:3:1i1R17oR18R34R20i2046R21i2045gR22r43ghR17oR18R34R20i2047R21i2028gR22jR11:5:2i4r11goR3jR4:1:1oR6r70R8y21:cameraInverseViewProjR10jR11:7:0R16i-197gR17oR18R34R20i2071R21i2050gR22r1096gR17oR18R34R20i2071R21i2028gR22r103gR17oR18R34R20i2072R21i2017gR22r55goR3jR4:7:2oR6r80R8y8:originWSR10jR11:5:2i3r11R16i-231goR3jR4:5:3jR5:2:0oR3jR4:9:2oR3jR4:1:1r1074R17oR18R34R20i2096R21i2092gR22r103gar893r894r895hR17oR18R34R20i2100R21i2092gR22r1105goR3jR4:9:2oR3jR4:1:1r1074R17oR18R34R20i2107R21i2103gR22r103gar925hR17oR18R34R20i2109R21i2103gR22r43gR17oR18R34R20i2109R21i2092gR22r1105gR17oR18R34R20i2110R21i2077gR22r55goR3jR4:12:1oR3jR4:1:1r1104R17oR18R34R20i2130R21i2122gR22r1105gR17oR18R34R20i2130R21i2115gR22r55ghR17oR18R34R20i2136R21i1925gR22r55gR6jR27:3:0R28r84R30r81ghR8y15:h3d.shader.Blury4:varsar57r205r237r880r901r506r993r84r119r557r183r69r13r32oR6r70R8y9:hasNormalR10r71R32ajR33:0:1nhR16i-208gr1095r1021r913hg";
h3d_shader_ChannelSelect.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:10:3oR3jR4:5:3jy16:haxe.macro.Binop:5:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:2:0y4:namey4:bitsy4:typejy9:hxsl.Type:1:0y10:qualifiersajy17:hxsl.VarQualifier:0:1nhy2:idi-703gy1:poy4:filey70:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FChannelSelect.hxy3:maxi181y3:mini177gy1:tr12goR3jR4:0:1jy10:hxsl.Const:2:1i1R15oR16R17R18i186R19i185gR20r12gR15oR16R17R18i186R19i177gR20jR11:2:0goR3jR4:5:3jR5:4:0oR3jR4:1:1oR6jR7:4:0R8y10:pixelColorR10jR11:5:2i4jy12:hxsl.VecType:1:0R14i-702gR15oR16R17R18i204R19i194gR20r30goR3jR4:9:2oR3jR4:1:1r27R15oR16R17R18i217R19i207gR20r30gajy14:hxsl.Component:0:0r38r38r38hR15oR16R17R18i222R19i207gR20jR11:5:2i4r29gR15oR16R17R18i222R19i194gR20r30goR3jR4:10:3oR3jR4:5:3r8oR3jR4:1:1r10R15oR16R17R18i241R19i237gR20r12goR3jR4:0:1jR21:2:1i2R15oR16R17R18i246R19i245gR20r12gR15oR16R17R18i246R19i237gR20r23goR3jR4:5:3r25oR3jR4:1:1r27R15oR16R17R18i264R19i254gR20r30goR3jR4:9:2oR3jR4:1:1r27R15oR16R17R18i277R19i267gR20r30gajR24:1:0r64r64r64hR15oR16R17R18i282R19i267gR20jR11:5:2i4r29gR15oR16R17R18i282R19i254gR20r30goR3jR4:10:3oR3jR4:5:3r8oR3jR4:1:1r10R15oR16R17R18i301R19i297gR20r12goR3jR4:0:1jR21:2:1i4R15oR16R17R18i306R19i305gR20r12gR15oR16R17R18i306R19i297gR20r23goR3jR4:5:3r25oR3jR4:1:1r27R15oR16R17R18i324R19i314gR20r30goR3jR4:9:2oR3jR4:1:1r27R15oR16R17R18i337R19i327gR20r30gajR24:2:0r90r90r90hR15oR16R17R18i342R19i327gR20jR11:5:2i4r29gR15oR16R17R18i342R19i314gR20r30goR3jR4:10:3oR3jR4:5:3r8oR3jR4:1:1r10R15oR16R17R18i361R19i357gR20r12goR3jR4:0:1jR21:2:1i8R15oR16R17R18i366R19i365gR20r12gR15oR16R17R18i366R19i357gR20r23goR3jR4:5:3r25oR3jR4:1:1r27R15oR16R17R18i384R19i374gR20r30goR3jR4:9:2oR3jR4:1:1r27R15oR16R17R18i397R19i387gR20r30gajR24:3:0r116r116r116hR15oR16R17R18i402R19i387gR20jR11:5:2i4r29gR15oR16R17R18i402R19i374gR20r30goR3jR4:5:3r25oR3jR4:1:1r27R15oR16R17R18i428R19i418gR20r30goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:40:0R15oR16R17R18i435R19i431gR20jR11:13:1ahgaoR3jR4:0:1jR21:3:1d0R15oR16R17R18i438R19i436gR20jR11:3:0ghR15oR16R17R18i439R19i431gR20jR11:5:2i4r29gR15oR16R17R18i439R19i418gR20r30gR15oR16R17R18i439R19i353gR20jR11:0:0gR15oR16R17R18i439R19i293gR20r146gR15oR16R17R18i439R19i233gR20r146gR15oR16R17R18i439R19i173gR20r146ghR15oR16R17R18i445R19i167gR20r146gR6jy17:hxsl.FunctionKind:2:0y3:refoR6jR7:6:0R8y8:__init__R10jR11:13:1aoR1ahy3:retr146ghR14i-704gR29r146ghR8y24:h3d.shader.ChannelSelecty4:varsar156r10r27hg";
h3d_shader_ColorAdd.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:20:1jR5:0:0oR3jR4:9:2oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey10:pixelColory4:typejy9:hxsl.Type:5:2i4jy12:hxsl.VecType:1:0y2:idi-542gy1:poy4:filey65:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FColorAdd.hxy3:maxi180y3:mini170gy1:tr14gajy14:hxsl.Component:0:0jR20:1:0jR20:2:0hR14oR15R16R17i184R18i170gR19jR11:5:2i3r13goR3jR4:1:1oR6jR7:2:0R8y5:colorR10jR11:5:2i3r13R13i-543gR14oR15R16R17i193R18i188gR19r27gR14oR15R16R17i193R18i170gR19r23ghR14oR15R16R17i199R18i164gR19jR11:0:0gR6jy17:hxsl.FunctionKind:1:0y3:refoR6jR7:6:0R8y8:fragmentR10jR11:13:1aoR1ahy3:retr34ghR13i-544gR25r34ghR8y19:h3d.shader.ColorAddy4:varsar36r25r11hg";
h3d_shader_ColorKey.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:7:2oy4:kindjy12:hxsl.VarKind:4:0y4:namey5:cdiffy4:typejy9:hxsl.Type:5:2i4jy12:hxsl.VecType:1:0y2:idi-541goR3jR4:5:3jy16:haxe.macro.Binop:3:0oR3jR4:1:1oR5r8R7y12:textureColorR9jR10:5:2i4r9R12i-539gy1:poy4:filey65:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FColorKey.hxy3:maxi197y3:mini185gy1:tr15goR3jR4:1:1oR5jR6:2:0R7y8:colorKeyR9jR10:5:2i4r9R12i-538gR15oR16R17R18i208R19i200gR20r21gR15oR16R17R18i208R19i185gR20r10gR15oR16R17R18i209R19i173gR20jR10:0:0goR3jR4:10:3oR3jR4:5:3jR13:9:0oR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:29:0R15oR16R17R18i223R19i218gR20jR10:13:1aoR1aoR7y1:_R9r10goR7y1:bR9jR10:5:2i4r9ghy3:retjR10:3:0ghgaoR3jR4:1:1r7R15oR16R17R18i223R19i218gR20r10goR3jR4:1:1r7R15oR16R17R18i233R19i228gR20r10ghR15oR16R17R18i234R19i218gR20r43goR3jR4:0:1jy10:hxsl.Const:3:1d1e-05R15oR16R17R18i244R19i237gR20r43gR15oR16R17R18i244R19i218gR20jR10:2:0goR3jR4:11:0R15oR16R17R18i254R19i247gR20r28gnR15oR16R17R18i254R19i214gR20r28ghR15oR16R17R18i260R19i167gR20r28gR5jy17:hxsl.FunctionKind:1:0y3:refoR5jR6:6:0R7y8:fragmentR9jR10:13:1aoR1ahR25r28ghR12i-540gR25r28ghR7y19:h3d.shader.ColorKeyy4:varsar69r19r14hg";
h3d_shader_ColorMatrix.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:7:2oy4:kindjy12:hxsl.VarKind:4:0y4:namey3:rgby4:typejy9:hxsl.Type:5:2i3jy12:hxsl.VecType:1:0y2:idi-482goR3jR4:5:3jy16:haxe.macro.Binop:1:0oR3jR4:9:2oR3jR4:1:1oR5r8R7y10:pixelColorR9jR10:5:2i4r9R12i-479gy1:poy4:filey68:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FColorMatrix.hxy3:maxi194y3:mini184gy1:tr16gajy14:hxsl.Component:0:0jR21:1:0jR21:2:0hR15oR16R17R18i198R19i184gR20jR10:5:2i3r9goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:50:0R15oR16R17R18i207R19i201gR20jR10:13:1ahgaoR3jR4:1:1oR5jR6:2:0R7y6:matrixR9jR10:7:0R12i-480gR15oR16R17R18i207R19i201gR20r37ghR15oR16R17R18i216R19i201gR20jR10:8:0gR15oR16R17R18i216R19i184gR20r10gR15oR16R17R18i217R19i174gR20jR10:0:0goR3jR4:5:3jR13:4:0oR3jR4:9:2oR3jR4:1:1r15R15oR16R17R18i232R19i222gR20r16gajR21:3:0hR15oR16R17R18i234R19i222gR20jR10:3:0goR3jR4:9:2oR3jR4:3:1oR3jR4:5:3r12oR3jR4:1:1r15R15oR16R17R18i248R19i238gR20r16goR3jR4:1:1r35R15oR16R17R18i257R19i251gR20r37gR15oR16R17R18i257R19i238gR20jR10:5:2i4r9gR15oR16R17R18i258R19i237gR20r70gar55hR15oR16R17R18i260R19i237gR20r58gR15oR16R17R18i260R19i222gR20r58goR3jR4:5:3r49oR3jR4:9:2oR3jR4:1:1r15R15oR16R17R18i276R19i266gR20r16gar20r21r22hR15oR16R17R18i280R19i266gR20jR10:5:2i3r9goR3jR4:1:1r7R15oR16R17R18i286R19i283gR20r10gR15oR16R17R18i286R19i266gR20r86ghR15oR16R17R18i292R19i168gR20r47gR5jy17:hxsl.FunctionKind:1:0y3:refoR5jR6:6:0R7y8:fragmentR9jR10:13:1aoR1ahy3:retr47ghR12i-481gR27r47ghR7y22:h3d.shader.ColorMatrixy4:varsar95r35r15hg";
h3d_shader_DirLight.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:7:2oy4:kindjy12:hxsl.VarKind:4:0y4:namey4:diffy4:typejy9:hxsl.Type:3:0y2:idi-84goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:22:0y1:poy4:filey65:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FDirLight.hxy3:maxi501y3:mini468gy1:tjR10:13:1aoR1aoR7y1:_R9r9goR7y1:bR9r9ghy3:retr9ghgaoR3jR4:8:2oR3jR4:2:1jR12:29:0R13oR14R15R16i485R17i468gR18jR10:13:1aoR1aoR7R19R9jR10:5:2i3jy12:hxsl.VecType:1:0goR7R20R9jR10:5:2i3r31ghR21r9ghgaoR3jR4:1:1oR5r8R7y17:transformedNormalR9r32R11i-77gR13oR14R15R16i485R17i468gR18r32goR3jR4:6:2jy15:haxe.macro.Unop:3:0oR3jR4:1:1oR5jR6:2:0R7y9:directionR9jR10:5:2i3r31R11i-71gR13oR14R15R16i500R17i491gR18r46gR13oR14R15R16i500R17i490gR18r46ghR13oR14R15R16i501R17i468gR18r9goR3jR4:0:1jy10:hxsl.Const:3:1d0R13oR14R15R16i508R17i506gR18r9ghR13oR14R15R16i509R17i468gR18r9gR13oR14R15R16i510R17i457gR18jR10:0:0goR3jR4:10:3oR3jR4:6:2jR24:2:0oR3jR4:1:1oR5r45R7y14:enableSpecularR9jR10:2:0y10:qualifiersajy17:hxsl.VarQualifier:0:1nhR11i-72gR13oR14R15R16i534R17i520gR18r67gR13oR14R15R16i534R17i519gR18r67goR3jR4:12:1oR3jR4:5:3jy16:haxe.macro.Binop:1:0oR3jR4:1:1oR5r45R7y5:colorR9jR10:5:2i3r31R11i-70gR13oR14R15R16i554R17i549gR18r79goR3jR4:1:1r7R13oR14R15R16i561R17i557gR18r9gR13oR14R15R16i561R17i549gR18r79gR13oR14R15R16i561R17i542gR18r61gnR13oR14R15R16i561R17i515gR18r61goR3jR4:7:2oR5r8R7y1:rR9r34R11i-85goR3jR4:8:2oR3jR4:2:1jR12:31:0R13oR14R15R16i612R17i575gR18jR10:13:1aoR1aoR7R19R9r34ghR21r34ghgaoR3jR4:8:2oR3jR4:2:1jR12:32:0R13oR14R15R16i582R17i575gR18jR10:13:1aoR1aoR7y1:aR9r34goR7R20R9r34ghR21r34ghgaoR3jR4:1:1r44R13oR14R15R16i592R17i583gR18r46goR3jR4:1:1r38R13oR14R15R16i611R17i594gR18r32ghR13oR14R15R16i612R17i575gR18r34ghR13oR14R15R16i624R17i575gR18r34gR13oR14R15R16i625R17i567gR18r61goR3jR4:7:2oR5r8R7y9:specValueR9r9R11i-86goR3jR4:8:2oR3jR4:2:1r12R13oR14R15R16i704R17i646gR18jR10:13:1aoR1aoR7R19R9r9gr19hR21r9ghgaoR3jR4:8:2oR3jR4:2:1r24R13oR14R15R16i647R17i646gR18jR10:13:1aoR1aoR7R19R9r34gr33hR21r9ghgaoR3jR4:1:1r92R13oR14R15R16i647R17i646gR18r34goR3jR4:8:2oR3jR4:2:1r95R13oR14R15R16i691R17i652gR18jR10:13:1aoR1aoR7R19R9jR10:5:2i3r31ghR21r34ghgaoR3jR4:3:1oR3jR4:5:3jR30:3:0oR3jR4:1:1oR5jR6:0:0R7y8:positionR9jR10:5:2i3r31y6:parentoR5r169R7y6:cameraR9jR10:12:1ar168hR11i-73gR11i-74gR13oR14R15R16i668R17i653gR18r170goR3jR4:1:1oR5r8R7y19:transformedPositionR9jR10:5:2i3r31R11i-78gR13oR14R15R16i690R17i671gR18r178gR13oR14R15R16i690R17i653gR18r161gR13oR14R15R16i691R17i652gR18r161ghR13oR14R15R16i703R17i652gR18r34ghR13oR14R15R16i704R17i646gR18r9goR3jR4:0:1jR26:3:1d0R13oR14R15R16i711R17i709gR18r9ghR13oR14R15R16i712R17i646gR18r9gR13oR14R15R16i713R17i630gR18r61goR3jR4:12:1oR3jR4:5:3r76oR3jR4:1:1r78R13oR14R15R16i730R17i725gR18r79goR3jR4:3:1oR3jR4:5:3jR30:0:0oR3jR4:1:1r7R13oR14R15R16i738R17i734gR18r9goR3jR4:5:3r76oR3jR4:1:1oR5r8R7y9:specColorR9jR10:5:2i3r31R11i-80gR13oR14R15R16i750R17i741gR18r211goR3jR4:8:2oR3jR4:2:1jR12:8:0R13oR14R15R16i756R17i753gR18jR10:13:1aoR1aoR7R33R9r9gr19hR21r9ghgaoR3jR4:1:1r129R13oR14R15R16i766R17i757gR18r9goR3jR4:1:1oR5r8R7y9:specPowerR9r9R11i-79gR13oR14R15R16i777R17i768gR18r9ghR13oR14R15R16i778R17i753gR18r9gR13oR14R15R16i778R17i741gR18r211gR13oR14R15R16i778R17i734gR18r211gR13oR14R15R16i779R17i733gR18r211gR13oR14R15R16i779R17i725gR18jR10:5:2i3r31gR13oR14R15R16i779R17i718gR18r61ghR13oR14R15R16i785R17i451gR18r61gR5jy17:hxsl.FunctionKind:3:0y3:refoR5jR6:6:0R7y12:calcLightingR9jR10:13:1aoR1ahR21jR10:5:2i3r31ghR11i-81gR21r253goR1ahR2oR3jR4:4:1aoR3jR4:5:3jR30:20:1r204oR3jR4:9:2oR3jR4:1:1oR5r8R7y10:lightColorR9jR10:5:2i3r31R11i-75gR13oR14R15R16i825R17i815gR18r264gajy14:hxsl.Component:0:0jR45:1:0jR45:2:0hR13oR14R15R16i829R17i815gR18jR10:5:2i3r31goR3jR4:8:2oR3jR4:1:1r248R13oR14R15R16i845R17i833gR18r254gahR13oR14R15R16i847R17i833gR18r253gR13oR14R15R16i847R17i815gR18r273ghR13oR14R15R16i853R17i809gR18r61gR5jR41:0:0R42oR5r249R7y6:vertexR9jR10:13:1aoR1ahR21r61ghR11i-82gR21r61goR1ahR2oR3jR4:4:1aoR3jR4:5:3jR30:20:1r204oR3jR4:9:2oR3jR4:1:1oR5r8R7y15:lightPixelColorR9jR10:5:2i3r31R11i-76gR13oR14R15R16i900R17i885gR18r300gar268r269r270hR13oR14R15R16i904R17i885gR18jR10:5:2i3r31goR3jR4:8:2oR3jR4:1:1r248R13oR14R15R16i920R17i908gR18r254gahR13oR14R15R16i922R17i908gR18r253gR13oR14R15R16i922R17i885gR18r306ghR13oR14R15R16i928R17i879gR18r61gR5jR41:1:0R42oR5r249R7y8:fragmentR9jR10:13:1aoR1ahR21r61ghR11i-83gR21r61ghR7y19:h3d.shader.DirLighty4:varsar286r66r38r263r210r319r248r171r78r177r44r229r299hg";
h3d_shader_Displacement.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:5:0y4:namey8:positiony4:typejy9:hxsl.Type:5:2i4jy12:hxsl.VecType:1:0y6:parentoR6r10R8y6:outputR10jR11:12:1ar9oR6r10R8y5:colorR10jR11:5:2i4r11R13r13y2:idi-579ghR16i-577gR16i-578gy1:poy4:filey69:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FScreenShader.hxy3:maxi262y3:mini247gy1:tr12goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:40:0R17oR18R19R20i269R21i265gR22jR11:13:1ahgaoR3jR4:1:1oR6jR7:1:0R8R9R10jR11:5:2i2r11R13oR6r30R8y5:inputR10jR11:12:1ar29oR6r30R8y2:uvR10jR11:5:2i2r11R13r32R16i-576ghR16i-574gR16i-575gR17oR18R19R20i284R21i270gR22r31goR3jR4:0:1jy10:hxsl.Const:3:1zR17oR18R19R20i287R21i286gR22jR11:3:0goR3jR4:0:1jR26:3:1i1R17oR18R19R20i290R21i289gR22r43ghR17oR18R19R20i291R21i265gR22jR11:5:2i4r11gR17oR18R19R20i291R21i247gR22r12ghR17oR18R19R20i297R21i241gR22jR11:0:0gR6jy17:hxsl.FunctionKind:0:0y3:refoR6jR7:6:0R8y6:vertexR10jR11:13:1aoR1ahy3:retr55ghR16i-585gR30r55goR1ahR2oR3jR4:4:1aoR3jR4:7:2oR6jR7:4:0R8y1:nR10jR11:5:2i3r11R16i-587goR3jR4:8:2oR3jR4:2:1jR23:55:0R17oR18y69:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FDisplacement.hxR20i301R21i289gR22jR11:13:1aoR1aoR8y5:valueR10jR11:5:2i4r11ghR30r70ghgaoR3jR4:8:2oR3jR4:2:1jR23:33:0R17oR18R32R20i311R21i302gR22jR11:13:1aoR1aoR8y1:_R10jR11:10:0goR8y1:bR10jR11:5:2i2r11ghR30jR11:5:2i4r11ghgaoR3jR4:1:1oR6jR7:2:0R8y9:normalMapR10r92R16i-581gR17oR18R32R20i311R21i302gR22r92goR3jR4:5:3jR5:0:0oR3jR4:5:3jR5:1:0oR3jR4:1:1r34R17oR18R32R20i324R21i316gR22r35goR3jR4:1:1oR6r100R8y11:normalScaleR10jR11:5:2i2r11R16i-582gR17oR18R32R20i338R21i327gR22r112gR17oR18R32R20i338R21i316gR22jR11:5:2i2r11goR3jR4:1:1oR6r100R8y9:normalPosR10jR11:5:2i2r11R16i-583gR17oR18R32R20i350R21i341gR22r120gR17oR18R32R20i350R21i316gR22jR11:5:2i2r11ghR17oR18R32R20i351R21i302gR22r95ghR17oR18R32R20i352R21i289gR22r70gR17oR18R32R20i353R21i281gR22r55goR3jR4:5:3r7oR3jR4:1:1r15R17oR18R32R20i369R21i357gR22r16goR3jR4:8:2oR3jR4:2:1r85R17oR18R32R20i379R21i372gR22jR11:13:1aoR1aoR8R34R10r92gr93hR30r95ghgaoR3jR4:1:1oR6r100R8y7:textureR10r92R16i-580gR17oR18R32R20i379R21i372gR22r92goR3jR4:5:3r104oR3jR4:1:1r34R17oR18R32R20i392R21i384gR22r35goR3jR4:5:3r106oR3jR4:9:2oR3jR4:1:1r68R17oR18R32R20i396R21i395gR22r70gajy14:hxsl.Component:0:0jR40:1:0hR17oR18R32R20i399R21i395gR22jR11:5:2i2r11goR3jR4:1:1oR6r100R8y12:displacementR10jR11:5:2i2r11R16i-584gR17oR18R32R20i414R21i402gR22r167gR17oR18R32R20i414R21i395gR22jR11:5:2i2r11gR17oR18R32R20i414R21i384gR22jR11:5:2i2r11ghR17oR18R32R20i415R21i372gR22r95gR17oR18R32R20i415R21i357gR22r16ghR17oR18R32R20i420R21i276gR22r55gR6jR27:1:0R28oR6r58R8y8:fragmentR10jR11:13:1aoR1ahR30r55ghR16i-586gR30r55ghR8y23:h3d.shader.Displacementy4:varsar57r183r147r119r13r111r32r99r166hg";
h3d_shader_FixedColor.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:5:0y4:namey12:pickPositiony4:typejy9:hxsl.Type:5:2i4jy12:hxsl.VecType:1:0y6:parentoR6r10R8y6:outputR10jR11:12:1aoR6r10R8y8:positionR10jR11:5:2i4r11R13r13y2:idi-657gr9oR6r10R8y7:colorIDR10jR11:5:2i4r11R13r13R16i-659ghR16i-656gR16i-658gy1:poy4:filey67:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FFixedColor.hxy3:maxi268y3:mini249gy1:tr12goR3jR4:5:3jR5:1:0oR3jR4:3:1oR3jR4:5:3jR5:0:0oR3jR4:1:1r15R18oR19R20R21i287R22i272gR23r16goR3jR4:5:3r23oR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:40:0R18oR19R20R21i294R22i290gR23jR11:13:1ahgaoR3jR4:9:2oR3jR4:1:1oR6jR7:2:0R8y8:viewportR10jR11:5:2i4r11R16i-655gR18oR19R20R21i303R22i295gR23r43gajy14:hxsl.Component:0:0jR26:1:0hR18oR19R20R21i306R22i295gR23jR11:5:2i2r11goR3jR4:0:1jy10:hxsl.Const:3:1d0R18oR19R20R21i310R22i308gR23jR11:3:0goR3jR4:0:1jR27:3:1d0R18oR19R20R21i314R22i312gR23r56ghR18oR19R20R21i315R22i290gR23jR11:5:2i4r11goR3jR4:9:2oR3jR4:1:1r15R18oR19R20R21i333R22i318gR23r16gajR26:3:0hR18oR19R20R21i335R22i318gR23r56gR18oR19R20R21i335R22i290gR23r63gR18oR19R20R21i335R22i272gR23jR11:5:2i4r11gR18oR19R20R21i336R22i271gR23r76goR3jR4:8:2oR3jR4:2:1r33R18oR19R20R21i343R22i339gR23r37gaoR3jR4:9:2oR3jR4:1:1r41R18oR19R20R21i352R22i344gR23r43gajR26:2:0r69hR18oR19R20R21i355R22i344gR23jR11:5:2i2r11goR3jR4:0:1jR27:3:1d1R18oR19R20R21i359R22i357gR23r56goR3jR4:0:1jR27:3:1d1R18oR19R20R21i363R22i361gR23r56ghR18oR19R20R21i364R22i339gR23jR11:5:2i4r11gR18oR19R20R21i364R22i271gR23jR11:5:2i4r11gR18oR19R20R21i364R22i249gR23r12ghR18oR19R20R21i369R22i244gR23jR11:0:0gR6jy17:hxsl.FunctionKind:0:0y3:refoR6jR7:6:0R8y6:vertexR10jR11:13:1aoR1ahy3:retr111ghR16i-660gR31r111goR1ahR2oR3jR4:4:1aoR3jR4:5:3r7oR3jR4:1:1r17R18oR19R20R21i411R22i397gR23r18goR3jR4:1:1oR6r42R8R17R10jR11:5:2i4r11R16i-654gR18oR19R20R21i421R22i414gR23r129gR18oR19R20R21i421R22i397gR23r18ghR18oR19R20R21i426R22i392gR23r111gR6jR28:1:0R29oR6r114R8y8:fragmentR10jR11:13:1aoR1ahR31r111ghR16i-661gR31r111ghR8y21:h3d.shader.FixedColory4:varsar113r137r128r13r41hg";
h3d_shader_GpuParticle.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey1:ty4:typejy9:hxsl.Type:3:0y2:idi-380gy1:poy4:filey68:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FGpuParticle.hxy3:maxi379y3:mini378gR9r11goR3jR4:5:3jR5:19:0oR3jR4:3:1oR3jR4:5:3jR5:0:0oR3jR4:1:1oR6jR7:1:0R8y4:timeR10r11y6:parentoR6r21R8y5:propsR10jR11:12:1aoR6r21R8y2:uvR10jR11:5:2i2jy12:hxsl.VecType:1:0R19r22R12i-373gr20oR6r21R8y4:lifeR10r11R19r22R12i-375goR6r21R8y4:initR10jR11:5:2i2r25R19r22R12i-376goR6r21R8y5:deltaR10jR11:5:2i2r25R19r22R12i-377ghR12i-372gR12i-374gR13oR14R15R16i393R17i383gR9r11goR3jR4:1:1oR6jR7:0:0R8R18R10r11R19oR6r37R8y6:globalR10jR11:12:1ar36oR6r37R8y9:pixelSizeR10jR11:5:2i2r25R19r38R12i-347goR6r37R8y9:modelViewR10jR11:7:0R19r38y10:qualifiersajy17:hxsl.VarQualifier:3:0hR12i-348goR6r37R8y16:modelViewInverseR10r43R19r38R29ar45hR12i-349ghR12i-345gR12i-346gR13oR14R15R16i407R17i396gR9r11gR13oR14R15R16i407R17i383gR9r11gR13oR14R15R16i408R17i382gR9r11goR3jR4:1:1r27R13oR14R15R16i421R17i411gR9r11gR13oR14R15R16i421R17i382gR9r11gR13oR14R15R16i421R17i378gR9r11goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y19:transformedPositionR10jR11:5:2i3r25R12i-359gR13oR14R15R16i446R17i427gR9r65goR3jR4:5:3r18oR3jR4:1:1oR6r21R8y8:positionR10jR11:5:2i3r25R19oR6r21R8y5:inputR10jR11:12:1ar70oR6r21R8y6:normalR10jR11:5:2i3r25R19r72R12i-352ghR12i-350gR12i-351gR13oR14R15R16i463R17i449gR9r71goR3jR4:5:3jR5:1:0oR3jR4:1:1r74R13oR14R15R16i478R17i466gR9r75goR3jR4:1:1r9R13oR14R15R16i482R17i481gR9r11gR13oR14R15R16i482R17i466gR9r75gR13oR14R15R16i482R17i449gR9jR11:5:2i3r25gR13oR14R15R16i482R17i427gR9r65goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y17:transformedNormalR10jR11:5:2i3r25R12i-361gR13oR14R15R16i528R17i511gR9r97goR3jR4:1:1oR6jR7:3:0R8y3:dirR10jR11:5:2i3r25R19oR6r37R8y6:cameraR10jR11:12:1aoR6r37R8y4:viewR10r43R19r104R12i-336goR6r37R8y4:projR10r43R19r104R12i-337goR6r37R8R33R10jR11:5:2i3r25R19r104R12i-338goR6r37R8y8:projDiagR10jR11:5:2i3r25R19r104R12i-339goR6r37R8y8:viewProjR10r43R19r104R12i-340goR6r37R8y15:inverseViewProjR10r43R19r104R12i-341goR6r37R8y5:zNearR10r11R19r104R12i-342goR6r37R8y4:zFarR10r11R19r104R12i-343gr101hR12i-335gR12i-344gR13oR14R15R16i541R17i531gR9r103gR13oR14R15R16i541R17i511gR9r97ghR13oR14R15R16i547R17i372gR9jR11:0:0gR6jy17:hxsl.FunctionKind:2:0y3:refoR6jR7:6:0R8y8:__init__R10jR11:13:1aoR1ahy3:retr123ghR12i-381gR49r123goR1ahR2oR3jR4:4:1aoR3jR4:7:2oR6r10R8y7:currentR10jR11:5:2i2r25R12i-383goR3jR4:5:3r18oR3jR4:1:1r28R13oR14R15R16i601R17i591gR9r29goR3jR4:5:3r80oR3jR4:1:1r30R13oR14R15R16i615R17i604gR9r31goR3jR4:1:1r9R13oR14R15R16i619R17i618gR9r11gR13oR14R15R16i619R17i604gR9r31gR13oR14R15R16i619R17i591gR9r137gR13oR14R15R16i620R17i577gR9r123goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y17:projectedPositionR10jR11:5:2i4r25R12i-362gR13oR14R15R16i642R17i625gR9r158goR3jR4:5:3r80oR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:40:0R13oR14R15R16i649R17i645gR9jR11:13:1ahgaoR3jR4:1:1r64R13oR14R15R16i669R17i650gR9r65goR3jR4:0:1jy10:hxsl.Const:3:1i1R13oR14R15R16i672R17i671gR9r11ghR13oR14R15R16i673R17i645gR9jR11:5:2i4r25goR3jR4:1:1r112R13oR14R15R16i691R17i676gR9r43gR13oR14R15R16i691R17i645gR9jR11:5:2i4r25gR13oR14R15R16i691R17i625gR9r158goR3jR4:7:2oR6r10R8y4:sizeR10r26R12i-384goR3jR4:5:3r80oR3jR4:3:1oR3jR4:5:3jR5:3:0oR3jR4:1:1r24R13oR14R15R16i717R17i709gR9r26goR3jR4:0:1jR53:3:1d0.5R13oR14R15R16i723R17i720gR9r11gR13oR14R15R16i723R17i709gR9r26gR13oR14R15R16i724R17i708gR9r26goR3jR4:8:2oR3jR4:2:1jR52:22:0R13oR14R15R16i736R17i727gR9jR11:13:1aoR1aoR8y1:_R10r11goR8y1:bR10r11ghR49r11ghgaoR3jR4:9:2oR3jR4:1:1r136R13oR14R15R16i734R17i727gR9r137gajy14:hxsl.Component:1:0hR13oR14R15R16i736R17i727gR9r11goR3jR4:0:1jR53:3:1d0R13oR14R15R16i743R17i741gR9r11ghR13oR14R15R16i744R17i727gR9r11gR13oR14R15R16i744R17i708gR9r26gR13oR14R15R16i745R17i697gR9r123goR3jR4:7:2oR6r10R8y3:rotR10r11R12i-385goR3jR4:9:2oR3jR4:1:1r136R13oR14R15R16i767R17i760gR9r137gajR57:0:0hR13oR14R15R16i769R17i760gR9r11gR13oR14R15R16i770R17i750gR9r123goR3jR4:7:2oR6r10R8y4:crotR10r11R12i-386goR3jR4:8:2oR3jR4:2:1jR52:3:0R13oR14R15R16i789R17i786gR9jR11:13:1aoR1aoR8y5:valueR10r11ghR49r11ghgaoR3jR4:1:1r236R13oR14R15R16i793R17i790gR9r11ghR13oR14R15R16i794R17i786gR9r11gR13oR14R15R16i812R17i775gR9r123goR3jR4:7:2oR6r10R8y4:srotR10r11R12i-387goR3jR4:8:2oR3jR4:2:1jR52:2:0R13oR14R15R16i806R17i803gR9jR11:13:1ar255hgaoR3jR4:1:1r236R13oR14R15R16i810R17i807gR9r11ghR13oR14R15R16i811R17i803gR9r11gR13oR14R15R16i812R17i775gR9r123goR3jR4:5:3jR5:20:1r18oR3jR4:9:2oR3jR4:1:1r157R13oR14R15R16i834R17i817gR9r158gar242r222hR13oR14R15R16i837R17i817gR9jR11:5:2i2r25goR3jR4:5:3r80oR3jR4:8:2oR3jR4:2:1jR52:38:0R13oR14R15R16i845R17i841gR9jR11:13:1ahgaoR3jR4:5:3r193oR3jR4:5:3r80oR3jR4:9:2oR3jR4:1:1r189R13oR14R15R16i850R17i846gR9r26gar242hR13oR14R15R16i852R17i846gR9r11goR3jR4:1:1r248R13oR14R15R16i859R17i855gR9r11gR13oR14R15R16i859R17i846gR9r11goR3jR4:5:3r80oR3jR4:9:2oR3jR4:1:1r189R13oR14R15R16i866R17i862gR9r26gar222hR13oR14R15R16i868R17i862gR9r11goR3jR4:1:1r268R13oR14R15R16i875R17i871gR9r11gR13oR14R15R16i875R17i862gR9r11gR13oR14R15R16i875R17i846gR9r11goR3jR4:5:3r18oR3jR4:5:3r80oR3jR4:9:2oR3jR4:1:1r189R13oR14R15R16i881R17i877gR9r26gar242hR13oR14R15R16i883R17i877gR9r11goR3jR4:1:1r268R13oR14R15R16i890R17i886gR9r11gR13oR14R15R16i890R17i877gR9r11goR3jR4:5:3r80oR3jR4:9:2oR3jR4:1:1r189R13oR14R15R16i897R17i893gR9r26gar222hR13oR14R15R16i899R17i893gR9r11goR3jR4:1:1r248R13oR14R15R16i906R17i902gR9r11gR13oR14R15R16i906R17i893gR9r11gR13oR14R15R16i906R17i877gR9r11ghR13oR14R15R16i907R17i841gR9jR11:5:2i2r25goR3jR4:8:2oR3jR4:2:1r297R13oR14R15R16i914R17i910gR9r301gaoR3jR4:5:3jR5:2:0oR3jR4:9:2oR3jR4:1:1r40R13oR14R15R16i931R17i915gR9r41gar242hR13oR14R15R16i933R17i915gR9r11goR3jR4:9:2oR3jR4:1:1r40R13oR14R15R16i952R17i936gR9r41gar222hR13oR14R15R16i954R17i936gR9r11gR13oR14R15R16i954R17i915gR9r11goR3jR4:0:1jR53:3:1i1R13oR14R15R16i957R17i956gR9r11ghR13oR14R15R16i958R17i910gR9jR11:5:2i2r25gR13oR14R15R16i958R17i841gR9jR11:5:2i2r25gR13oR14R15R16i958R17i817gR9r293goR3jR4:5:3r7oR3jR4:9:2oR3jR4:1:1oR6r10R8y10:pixelColorR10jR11:5:2i4r25R12i-363gR13oR14R15R16i974R17i964gR9r403gajR57:3:0hR13oR14R15R16i976R17i964gR9r11goR3jR4:5:3r193oR3jR4:0:1jR53:3:1i1R13oR14R15R16i980R17i979gR9r11goR3jR4:8:2oR3jR4:2:1jR52:8:0R13oR14R15R16i1012R17i983gR9jR11:13:1aoR1aoR8R55R10r11gr214hR49r11ghgaoR3jR4:8:2oR3jR4:2:1jR52:15:0R13oR14R15R16i986R17i983gR9jR11:13:1ar255hgaoR3jR4:5:3r193oR3jR4:5:3r80oR3jR4:3:1oR3jR4:5:3r370oR3jR4:1:1r9R13oR14R15R16i989R17i988gR9r11goR3jR4:1:1r27R13oR14R15R16i1002R17i992gR9r11gR13oR14R15R16i1002R17i988gR9r11gR13oR14R15R16i1003R17i987gR9r11goR3jR4:0:1jR53:3:1i2R13oR14R15R16i1007R17i1006gR9r11gR13oR14R15R16i1007R17i987gR9r11goR3jR4:0:1jR53:3:1i1R13oR14R15R16i1011R17i1010gR9r11gR13oR14R15R16i1011R17i987gR9r11ghR13oR14R15R16i1012R17i983gR9r11goR3jR4:1:1oR6jR7:2:0R8y9:fadePowerR10r11R12i-378gR13oR14R15R16i1026R17i1017gR9r11ghR13oR14R15R16i1027R17i983gR9r11gR13oR14R15R16i1027R17i979gR9r11gR13oR14R15R16i1027R17i964gR9r11ghR13oR14R15R16i1033R17i571gR9r123gR6jR46:0:0R47oR6r126R8y6:vertexR10jR11:13:1aoR1ahR49r123ghR12i-382gR49r123ghR8y22:h3d.shader.GpuParticley4:varsar157oR6r10R8y5:depthR10r11R12i-364gr476r96oR6r10R8y9:specColorR10jR11:5:2i3r25R12i-367gr125r22oR6r10R8y16:relativePositionR10jR11:5:2i3r25R12i-358gr9r104oR6jR7:5:0R8y6:outputR10jR11:12:1aoR6r488R8R33R10jR11:5:2i4r25R19r487R12i-354goR6r488R8y5:colorR10jR11:5:2i4r25R19r487R12i-355goR6r488R8R67R10jR11:5:2i4r25R19r487R12i-356goR6r488R8R35R10jR11:5:2i4r25R19r487R12i-357ghR12i-353goR6r10R8y8:screenUVR10jR11:5:2i2r25R12i-365gr38r72oR6r464R8y9:speedIncrR10r11R12i-379gr64oR6r10R8y9:specPowerR10r11R12i-366goR6r10R8y24:pixelTransformedPositionR10jR11:5:2i3r25R12i-360gr402r463hg";
h3d_shader_KillAlpha.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:10:3oR3jR4:5:3jy16:haxe.macro.Binop:9:0oR3jR4:9:2oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey10:pixelColory4:typejy9:hxsl.Type:5:2i4jy12:hxsl.VecType:1:0y2:idi-592gy1:poy4:filey66:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FKillAlpha.hxy3:maxi190y3:mini180gy1:tr14gajy14:hxsl.Component:3:0hR14oR15R16R17i192R18i180gR19jR11:3:0goR3jR4:1:1oR6jR7:2:0R8y9:thresholdR10r21R13i-591gR14oR15R16R17i204R18i195gR19r21gR14oR15R16R17i204R18i180gR19jR11:2:0goR3jR4:11:0R14oR15R16R17i214R18i207gR19jR11:0:0gnR14oR15R16R17i214R18i176gR19r33ghR14oR15R16R17i220R18i170gR19r33gR6jy17:hxsl.FunctionKind:1:0y3:refoR6jR7:6:0R8y8:fragmentR10jR11:13:1aoR1ahy3:retr33ghR13i-593gR25r33ghR8y20:h3d.shader.KillAlphay4:varsar23r39r11hg";
h3d_shader_LineShader.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:4:1aoR3jR4:7:2oy4:kindjy12:hxsl.VarKind:4:0y4:namey3:diry4:typejy9:hxsl.Type:5:2i3jy12:hxsl.VecType:1:0y2:idi-504goR3jR4:5:3jy16:haxe.macro.Binop:1:0oR3jR4:1:1oR5jR6:1:0R7y6:normalR9jR10:5:2i3r11y6:parentoR5r17R7y5:inputR9jR10:12:1aoR5r17R7y8:positionR9jR10:5:2i3r11R15r19R12i-491gr16oR5r17R7y2:uvR9jR10:5:2i2r11R15r19R12i-493ghR12i-490gR12i-492gy1:poy4:filey67:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FLineShader.hxy3:maxi683y3:mini671gy1:tr18goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:48:0R19oR20R21R22i702R23i686gR24jR10:13:1ahgaoR3jR4:1:1oR5jR6:0:0R7y9:modelViewR9jR10:7:0R15oR5r38R7y6:globalR9jR10:12:1aoR5r38R7y9:pixelSizeR9jR10:5:2i2r11R15r40R12i-488gr37hR12i-487gy10:qualifiersajy17:hxsl.VarQualifier:3:0hR12i-489gR19oR20R21R22i702R23i686gR24r39ghR19oR20R21R22i709R23i686gR24jR10:6:0gR19oR20R21R22i709R23i671gR24r12gR19oR20R21R22i710R23i661gR24jR10:0:0goR3jR4:5:3jR13:4:0oR3jR4:1:1oR5r10R7y4:pdirR9jR10:5:2i4r11R12i-501gR19oR20R21R22i734R23i730gR24r61goR3jR4:5:3r14oR3jR4:8:2oR3jR4:2:1jR25:40:0R19oR20R21R22i741R23i737gR24jR10:13:1ahgaoR3jR4:5:3r14oR3jR4:1:1r9R19oR20R21R22i745R23i742gR24r12goR3jR4:8:2oR3jR4:2:1r30R19oR20R21R22i752R23i748gR24jR10:13:1ahgaoR3jR4:1:1oR5r38R7y4:viewR9r39R15oR5r38R7y6:cameraR9jR10:12:1ar85oR5r38R7y4:projR9r39R15r86R12i-485goR5r38R7y8:viewProjR9r39R15r86R12i-486ghR12i-483gR12i-484gR19oR20R21R22i764R23i753gR24r39ghR19oR20R21R22i765R23i748gR24r51gR19oR20R21R22i765R23i742gR24r12goR3jR4:0:1jy10:hxsl.Const:3:1i1R19oR20R21R22i768R23i767gR24jR10:3:0ghR19oR20R21R22i769R23i737gR24jR10:5:2i4r11goR3jR4:1:1r88R19oR20R21R22i783R23i772gR24r39gR19oR20R21R22i783R23i737gR24jR10:5:2i4r11gR19oR20R21R22i783R23i730gR24r61goR3jR4:5:3jR13:20:1r14oR3jR4:9:2oR3jR4:1:1r60R19oR20R21R22i794R23i790gR24r61gajy14:hxsl.Component:0:0jR37:1:0hR19oR20R21R22i797R23i790gR24jR10:5:2i2r11goR3jR4:5:3jR13:2:0oR3jR4:0:1jR36:3:1i1R19oR20R21R22i802R23i801gR24r101goR3jR4:8:2oR3jR4:2:1jR25:13:0R19oR20R21R22i809R23i805gR24jR10:13:1aoR1aoR7y5:valueR9r101ghy3:retr101ghgaoR3jR4:5:3jR13:0:0oR3jR4:5:3r14oR3jR4:9:2oR3jR4:1:1r60R19oR20R21R22i814R23i810gR24r61gar120hR19oR20R21R22i816R23i810gR24r101goR3jR4:9:2oR3jR4:1:1r60R19oR20R21R22i823R23i819gR24r61gar120hR19oR20R21R22i825R23i819gR24r101gR19oR20R21R22i825R23i810gR24r101goR3jR4:5:3r14oR3jR4:9:2oR3jR4:1:1r60R19oR20R21R22i832R23i828gR24r61gar121hR19oR20R21R22i834R23i828gR24r101goR3jR4:9:2oR3jR4:1:1r60R19oR20R21R22i841R23i837gR24r61gar121hR19oR20R21R22i843R23i837gR24r101gR19oR20R21R22i843R23i828gR24r101gR19oR20R21R22i843R23i810gR24r101ghR19oR20R21R22i844R23i805gR24r101gR19oR20R21R22i844R23i801gR24r101gR19oR20R21R22i844R23i790gR24r124goR3jR4:5:3jR13:20:1r143oR3jR4:1:1oR5r10R7y19:transformedPositionR9jR10:5:2i3r11R12i-497gR19oR20R21R22i870R23i851gR24r190goR3jR4:5:3r14oR3jR4:5:3r14oR3jR4:1:1r9R19oR20R21R22i877R23i874gR24r12goR3jR4:9:2oR3jR4:1:1r23R19oR20R21R22i888R23i880gR24r24gar120hR19oR20R21R22i890R23i880gR24r101gR19oR20R21R22i890R23i874gR24r12goR3jR4:1:1oR5jR6:2:0R7y11:lengthScaleR9r101R12i-499gR19oR20R21R22i904R23i893gR24r101gR19oR20R21R22i904R23i874gR24r12gR19oR20R21R22i904R23i851gR24r190goR3jR4:5:3r58oR3jR4:1:1oR5r10R7y17:transformedNormalR9jR10:5:2i3r11R12i-496gR19oR20R21R22i928R23i911gR24r219goR3jR4:8:2oR3jR4:2:1jR25:31:0R19oR20R21R22i934R23i931gR24jR10:13:1aoR1aoR7y1:_R9r12ghR39r12ghgaoR3jR4:1:1r9R19oR20R21R22i934R23i931gR24r12ghR19oR20R21R22i946R23i931gR24r12gR19oR20R21R22i946R23i911gR24r219ghR19oR20R21R22i953R23i654gR24r56ghR19oR20R21R22i958R23i648gR24r56gR5jy17:hxsl.FunctionKind:2:0y3:refoR5jR6:6:0R7y8:__init__R9jR10:13:1aoR1ahR39r56ghR12i-502gR39r56goR1ahR2oR3jR4:4:1aoR3jR4:5:3jR13:20:1r143oR3jR4:9:2oR3jR4:1:1oR5r10R7y17:projectedPositionR9jR10:5:2i4r11R12i-498gR19oR20R21R22i1005R23i988gR24r260gar120r121hR19oR20R21R22i1008R23i988gR24jR10:5:2i2r11goR3jR4:5:3r14oR3jR4:5:3r14oR3jR4:5:3r14oR3jR4:5:3r14oR3jR4:3:1oR3jR4:5:3r14oR3jR4:9:2oR3jR4:1:1r60R19oR20R21R22i1017R23i1013gR24r61gar121r120hR19oR20R21R22i1020R23i1013gR24jR10:5:2i2r11goR3jR4:8:2oR3jR4:2:1jR25:38:0R19oR20R21R22i1027R23i1023gR24jR10:13:1ahgaoR3jR4:0:1jR36:3:1i1R19oR20R21R22i1029R23i1028gR24r101goR3jR4:0:1jR36:3:1i-1R19oR20R21R22i1032R23i1030gR24r101ghR19oR20R21R22i1033R23i1023gR24jR10:5:2i2r11gR19oR20R21R22i1033R23i1013gR24jR10:5:2i2r11gR19oR20R21R22i1034R23i1012gR24r302goR3jR4:3:1oR3jR4:5:3jR13:3:0oR3jR4:9:2oR3jR4:1:1r23R19oR20R21R22i1046R23i1038gR24r24gar121hR19oR20R21R22i1048R23i1038gR24r101goR3jR4:0:1jR36:3:1d0.5R19oR20R21R22i1054R23i1051gR24r101gR19oR20R21R22i1054R23i1038gR24r101gR19oR20R21R22i1055R23i1037gR24r101gR19oR20R21R22i1055R23i1012gR24r302goR3jR4:9:2oR3jR4:1:1r259R19oR20R21R22i1075R23i1058gR24r260gajR37:2:0hR19oR20R21R22i1077R23i1058gR24r101gR19oR20R21R22i1077R23i1012gR24r302goR3jR4:1:1r42R19oR20R21R22i1096R23i1080gR24r43gR19oR20R21R22i1096R23i1012gR24jR10:5:2i2r11goR3jR4:1:1oR5r209R7y5:widthR9r101R12i-500gR19oR20R21R22i1104R23i1099gR24r101gR19oR20R21R22i1104R23i1012gR24r340gR19oR20R21R22i1104R23i988gR24r266ghR19oR20R21R22i1110R23i982gR24r56gR5jR44:0:0R45oR5r246R7y6:vertexR9jR10:13:1aoR1ahR39r56ghR12i-503gR39r56ghR7y21:h3d.shader.LineShadery4:varsar259r352r218r245r208r60r86oR5jR6:5:0R7y6:outputR9jR10:12:1aoR5r359R7R17R9jR10:5:2i4r11R15r358R12i-495ghR12i-494gr40r19r189r342hg";
h3d_shader_Outline.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:20:1jR5:0:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey19:transformedPositiony4:typejy9:hxsl.Type:5:2i3jy12:hxsl.VecType:1:0y2:idi-417gy1:poy4:filey64:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FOutline.hxy3:maxi252y3:mini233gy1:tr13goR3jR4:5:3jR5:1:0oR3jR4:1:1oR6r11R8y17:transformedNormalR10jR11:5:2i3r12R13i-419gR14oR15R16R17i273R18i256gR19r20goR3jR4:1:1oR6jR7:2:0R8y4:sizeR10jR11:3:0R13i-430gR14oR15R16R17i280R18i276gR19r26gR14oR15R16R17i280R18i256gR19r20gR14oR15R16R17i280R18i233gR19r13ghR14oR15R16R17i286R18i227gR19jR11:0:0gR6jy17:hxsl.FunctionKind:2:0y3:refoR6jR7:6:0R8y14:__init__vertexR10jR11:13:1aoR1ahy3:retr35ghR13i-433gR25r35goR1ahR2oR3jR4:4:1aoR3jR4:5:3jR5:20:1jR5:3:0oR3jR4:9:2oR3jR4:1:1oR6r11R8y17:projectedPositionR10jR11:5:2i4r12R13i-420gR14oR15R16R17i333R18i316gR19r53gajy14:hxsl.Component:2:0hR14oR15R16R17i335R18i316gR19r26goR3jR4:5:3r17oR3jR4:1:1oR6r25R8y8:distanceR10r26R13i-431gR14oR15R16R17i347R18i339gR19r26goR3jR4:9:2oR3jR4:1:1r52R14oR15R16R17i367R18i350gR19r53gajR27:3:0hR14oR15R16R17i369R18i350gR19r26gR14oR15R16R17i369R18i339gR19r26gR14oR15R16R17i369R18i316gR19r26ghR14oR15R16R17i375R18i310gR19r35gR6jR22:0:0R23oR6r38R8y6:vertexR10jR11:13:1aoR1ahR25r35ghR13i-434gR25r35goR1ahR2oR3jR4:4:1aoR3jR4:5:3jR5:4:0oR3jR4:1:1oR6jR7:5:0R8y5:colorR10jR11:5:2i4r12y6:parentoR6r93R8y6:outputR10jR11:12:1aoR6r93R8y8:positionR10jR11:5:2i4r12R31r95R13i-412gr92oR6r93R8y5:depthR10jR11:5:2i4r12R31r95R13i-414goR6r93R8y6:normalR10jR11:5:2i4r12R31r95R13i-415ghR13i-411gR13i-413gR14oR15R16R17i419R18i407gR19r94goR3jR4:1:1oR6r25R8R30R10jR11:5:2i4r12R13i-432gR14oR15R16R17i427R18i422gR19r108gR14oR15R16R17i427R18i407gR19r94ghR14oR15R16R17i433R18i401gR19r35gR6jR22:1:0R23oR6r38R8y8:fragmentR10jR11:13:1aoR1ahR25r35ghR13i-435gR25r35ghR8y18:h3d.shader.Outliney4:varsar52oR6r11R8R34R10r26R13i-422gr80r19oR6r11R8y9:specColorR10jR11:5:2i3r12R13i-425gr116oR6r11R8y16:relativePositionR10jR11:5:2i3r12R13i-416goR6jR7:0:0R8y6:cameraR10jR11:12:1aoR6r128R8y4:viewR10jR11:7:0R31r127R13i-394goR6r128R8y4:projR10r131R31r127R13i-395goR6r128R8R33R10jR11:5:2i3r12R31r127R13i-396goR6r128R8y8:projDiagR10jR11:5:2i3r12R31r127R13i-397goR6r128R8y8:viewProjR10r131R31r127R13i-398goR6r128R8y15:inverseViewProjR10r131R31r127R13i-399goR6r128R8y5:zNearR10r26R31r127R13i-400goR6r128R8y4:zFarR10r26R31r127R13i-401goR6jR7:3:0R8y3:dirR10jR11:5:2i3r12R31r127R13i-402ghR13i-393gr95oR6r11R8y8:screenUVR10jR11:5:2i2r12R13i-423goR6r128R8y6:globalR10jR11:12:1aoR6r128R8y4:timeR10r26R31r147R13i-404goR6r128R8y9:pixelSizeR10jR11:5:2i2r12R31r147R13i-405goR6r128R8y9:modelViewR10r131R31r147y10:qualifiersajy17:hxsl.VarQualifier:3:0hR13i-406goR6r128R8y16:modelViewInverseR10r131R31r147R55ar154hR13i-407ghR13i-403goR6jR7:1:0R8y5:inputR10jR11:12:1aoR6r159R8R33R10jR11:5:2i3r12R31r158R13i-409goR6r159R8R35R10jR11:5:2i3r12R31r158R13i-410ghR13i-408gr24r10r107oR6r11R8y9:specPowerR10r26R13i-424gr37oR6r11R8y24:pixelTransformedPositionR10jR11:5:2i3r12R13i-418goR6r11R8y10:pixelColorR10jR11:5:2i4r12R13i-421gr62hg";
h3d_shader_ParticleShader.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:10:3oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:2:0y4:namey10:isAbsolutey4:typejy9:hxsl.Type:2:0y10:qualifiersajy17:hxsl.VarQualifier:0:1nhy2:idi-296gy1:poy4:filey71:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FParticleShader.hxy3:maxi709y3:mini699gy1:tr10goR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oR5jR6:4:0R7y19:transformedPositionR9jR10:5:2i3jy12:hxsl.VecType:1:0R13i-290gR14oR15R16R17i731R18i712gR19r21goR3jR4:1:1oR5jR6:1:0R7y8:positionR9jR10:5:2i3r20y6:parentoR5r26R7y5:inputR9jR10:12:1ar25oR5r26R7y6:normalR9jR10:5:2i3r20R24r28R13i-287goR5r26R7y4:sizeR9jR10:5:2i2r20R24r28R13i-288goR5r26R7y2:uvR9jR10:5:2i2r20R24r28R13i-289ghR13i-285gR13i-286gR14oR15R16R17i748R18i734gR19r27gR14oR15R16R17i748R18i712gR19r21gnR14oR15R16R17i748R18i695gR19jR10:0:0ghR14oR15R16R17i754R18i689gR19r43gR5jy17:hxsl.FunctionKind:2:0y3:refoR5jR6:6:0R7y8:__init__R9jR10:13:1aoR1ahy3:retr43ghR13i-297gR32r43goR1ahR2oR3jR4:4:1aoR3jR4:7:2oR5r19R7y4:rposR9jR10:5:2i2r20R13i-299goR3jR4:9:2oR3jR4:1:1r30R14oR15R16R17i807R18i795gR19r31gajy14:hxsl.Component:0:0jR34:1:0hR14oR15R16R17i810R18i795gR19r59gR14oR15R16R17i811R18i784gR19r43goR3jR4:7:2oR5r19R7y3:rotR9jR10:3:0R13i-300goR3jR4:9:2oR3jR4:1:1r30R14oR15R16R17i838R18i826gR19r31gajR34:2:0hR14oR15R16R17i840R18i826gR19r73gR14oR15R16R17i841R18i816gR19r43goR3jR4:7:2oR5r19R7y2:crR9r73R13i-301goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:3:0R14oR15R16R17i858R18i855gR19jR10:13:1aoR1aoR7y1:_R9r73ghR32r73ghgaoR3jR4:1:1r72R14oR15R16R17i858R18i855gR19r73ghR14oR15R16R17i864R18i855gR19r73gR14oR15R16R17i865R18i846gR19r43goR3jR4:7:2oR5r19R7y2:srR9r73R13i-302goR3jR4:8:2oR3jR4:2:1jR37:2:0R14oR15R16R17i882R18i879gR19jR10:13:1aoR1aoR7R38R9r73ghR32r73ghgaoR3jR4:1:1r72R14oR15R16R17i882R18i879gR19r73ghR14oR15R16R17i888R18i879gR19r73gR14oR15R16R17i889R18i870gR19r43goR3jR4:7:2oR5r19R7y3:posR9jR10:5:2i2r20R13i-303goR3jR4:5:3jR20:1:0oR3jR4:1:1r32R14oR15R16R17i914R18i904gR19r33goR3jR4:1:1r58R14oR15R16R17i921R18i917gR19r59gR14oR15R16R17i921R18i904gR19r126gR14oR15R16R17i922R18i894gR19r43goR3jR4:10:3oR3jR4:1:1oR5r9R7y4:is3DR9r10R11ajR12:0:1nhR13i-295gR14oR15R16R17i935R18i931gR19r10goR3jR4:5:3jR20:20:1r128oR3jR4:1:1r125R14oR15R16R17i941R18i938gR19r126goR3jR4:1:1oR5r9R7R27R9jR10:5:2i2r20R13i-294gR14oR15R16R17i949R18i945gR19r153gR14oR15R16R17i949R18i938gR19r126gnR14oR15R16R17i949R18i927gR19r43goR3jR4:7:2oR5r19R7y4:rtmpR9r73R13i-304goR3jR4:5:3jR20:0:0oR3jR4:5:3r128oR3jR4:9:2oR3jR4:1:1r125R14oR15R16R17i969R18i966gR19r126gar65hR14oR15R16R17i971R18i966gR19r73goR3jR4:1:1r85R14oR15R16R17i976R18i974gR19r73gR14oR15R16R17i976R18i966gR19r73goR3jR4:5:3r128oR3jR4:9:2oR3jR4:1:1r125R14oR15R16R17i982R18i979gR19r126gar66hR14oR15R16R17i984R18i979gR19r73goR3jR4:1:1r105R14oR15R16R17i989R18i987gR19r73gR14oR15R16R17i989R18i979gR19r73gR14oR15R16R17i989R18i966gR19r73gR14oR15R16R17i990R18i955gR19r43goR3jR4:5:3r16oR3jR4:9:2oR3jR4:1:1r125R14oR15R16R17i998R18i995gR19r126gar66hR14oR15R16R17i1000R18i995gR19r73goR3jR4:5:3jR20:3:0oR3jR4:5:3r128oR3jR4:9:2oR3jR4:1:1r125R14oR15R16R17i1006R18i1003gR19r126gar66hR14oR15R16R17i1008R18i1003gR19r73goR3jR4:1:1r85R14oR15R16R17i1013R18i1011gR19r73gR14oR15R16R17i1013R18i1003gR19r73goR3jR4:5:3r128oR3jR4:9:2oR3jR4:1:1r125R14oR15R16R17i1019R18i1016gR19r126gar65hR14oR15R16R17i1021R18i1016gR19r73goR3jR4:1:1r105R14oR15R16R17i1026R18i1024gR19r73gR14oR15R16R17i1026R18i1016gR19r73gR14oR15R16R17i1026R18i1003gR19r73gR14oR15R16R17i1026R18i995gR19r73goR3jR4:5:3r16oR3jR4:9:2oR3jR4:1:1r125R14oR15R16R17i1035R18i1032gR19r126gar65hR14oR15R16R17i1037R18i1032gR19r73goR3jR4:1:1r161R14oR15R16R17i1044R18i1040gR19r73gR14oR15R16R17i1044R18i1032gR19r73goR3jR4:10:3oR3jR4:1:1r141R14oR15R16R17i1058R18i1054gR19r10goR3jR4:4:1aoR3jR4:5:3jR20:20:1r163oR3jR4:1:1r18R14oR15R16R17i1087R18i1068gR19r21goR3jR4:5:3r128oR3jR4:8:2oR3jR4:2:1jR37:39:0R14oR15R16R17i1095R18i1091gR19jR10:13:1ahgaoR3jR4:1:1r125R14oR15R16R17i1099R18i1096gR19r126goR3jR4:0:1jy10:hxsl.Const:3:1zR14oR15R16R17i1101R18i1100gR19r73ghR14oR15R16R17i1102R18i1091gR19jR10:5:2i3r20goR3jR4:1:1oR5r9R7y12:rotationAxisR9jR10:6:0R13i-293gR14oR15R16R17i1117R18i1105gR19r279gR14oR15R16R17i1117R18i1091gR19jR10:5:2i3r20gR14oR15R16R17i1117R18i1068gR19r21ghR14oR15R16R17i1124R18i1061gR19r43goR3jR4:4:1aoR3jR4:5:3r16oR3jR4:1:1oR5r19R7y17:projectedPositionR9jR10:5:2i4r20R13i-292gR14oR15R16R17i1154R18i1137gR19r294goR3jR4:5:3r128oR3jR4:8:2oR3jR4:2:1jR37:40:0R14oR15R16R17i1161R18i1157gR19jR10:13:1ahgaoR3jR4:1:1r18R14oR15R16R17i1181R18i1162gR19r21goR3jR4:0:1jR43:3:1i1R14oR15R16R17i1183R18i1182gR19r73ghR14oR15R16R17i1184R18i1157gR19jR10:5:2i4r20goR3jR4:1:1oR5jR6:0:0R7y8:viewProjR9jR10:7:0R24oR5r318R7y6:cameraR9jR10:12:1ar317oR5r318R7R23R9jR10:5:2i3r20R24r320R13i-282ghR13i-280gR13i-281gR14oR15R16R17i1202R18i1187gR19r319gR14oR15R16R17i1202R18i1157gR19jR10:5:2i4r20gR14oR15R16R17i1202R18i1137gR19r294goR3jR4:5:3jR20:20:1r163oR3jR4:9:2oR3jR4:1:1r293R14oR15R16R17i1226R18i1209gR19r294gar65r66hR14oR15R16R17i1229R18i1209gR19jR10:5:2i2r20goR3jR4:5:3r128oR3jR4:1:1r125R14oR15R16R17i1236R18i1233gR19r126goR3jR4:1:1r152R14oR15R16R17i1243R18i1239gR19r153gR14oR15R16R17i1243R18i1233gR19jR10:5:2i2r20gR14oR15R16R17i1243R18i1209gR19r341ghR14oR15R16R17i1250R18i1130gR19r43gR14oR15R16R17i1250R18i1050gR19r43goR3jR4:5:3r16oR3jR4:1:1oR5r19R7y17:transformedNormalR9jR10:5:2i3r20R13i-291gR14oR15R16R17i1272R18i1255gR19r361goR3jR4:8:2oR3jR4:2:1jR37:31:0R14oR15R16R17i1314R18i1275gR19jR10:13:1aoR1aoR7R38R9jR10:5:2i3r20ghR32r284ghgaoR3jR4:3:1oR3jR4:5:3r203oR3jR4:1:1r18R14oR15R16R17i1295R18i1276gR19r21goR3jR4:1:1r322R14oR15R16R17i1313R18i1298gR19r323gR14oR15R16R17i1313R18i1276gR19r373gR14oR15R16R17i1314R18i1275gR19r373ghR14oR15R16R17i1326R18i1275gR19r284gR14oR15R16R17i1326R18i1255gR19r361ghR14oR15R16R17i1332R18i778gR19r43gR5jR29:0:0R30oR5r48R7y6:vertexR9jR10:13:1aoR1ahR32r43ghR13i-298gR32r43ghR7y25:h3d.shader.ParticleShadery4:varsar293r395r360r278r47r320oR5r318R7y6:globalR9jR10:12:1aoR5r318R7y9:modelViewR9r319R24r401R11ajR12:3:0hR13i-284ghR13i-283gr28r152r18r8r141hg";
h3d_shader_PointLight.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:7:2oy4:kindjy12:hxsl.VarKind:4:0y4:namey4:dvecy4:typejy9:hxsl.Type:5:2i3jy12:hxsl.VecType:1:0y2:idi-274goR3jR4:5:3jy16:haxe.macro.Binop:3:0oR3jR4:1:1oR5jR6:2:0R7y13:lightPositionR9jR10:5:2i3r9R12i-271gy1:poy4:filey67:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FPointLight.hxy3:maxi431y3:mini418gy1:tr16goR3jR4:1:1oR5r8R7y19:transformedPositionR9jR10:5:2i3r9R12i-266gR15oR16R17R18i453R19i434gR20r21gR15oR16R17R18i453R19i418gR20r10gR15oR16R17R18i454R19i407gR20jR10:0:0goR3jR4:7:2oR5r8R7y5:dist2R9jR10:3:0R12i-275goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:29:0R15oR16R17R18i475R19i471gR20jR10:13:1aoR1aoR7y1:_R9r10goR7y1:bR9jR10:5:2i3r9ghy3:retr31ghgaoR3jR4:1:1r7R15oR16R17R18i475R19i471gR20r10goR3jR4:1:1r7R15oR16R17R18i484R19i480gR20r10ghR15oR16R17R18i485R19i471gR20r31gR15oR16R17R18i486R19i459gR20r28goR3jR4:7:2oR5r8R7y4:distR9r31R12i-276goR3jR4:8:2oR3jR4:2:1jR23:13:0R15oR16R17R18i507R19i502gR20jR10:13:1aoR1aoR7R24R9r31ghR26r31ghgaoR3jR4:1:1r30R15oR16R17R18i507R19i502gR20r31ghR15oR16R17R18i514R19i502gR20r31gR15oR16R17R18i515R19i491gR20r28goR3jR4:5:3jR13:20:1jR13:0:0oR3jR4:9:2oR3jR4:1:1oR5r8R7y10:lightColorR9jR10:5:2i3r9R12i-264gR15oR16R17R18i577R19i567gR20r81gajy14:hxsl.Component:0:0jR29:1:0jR29:2:0hR15oR16R17R18i581R19i567gR20jR10:5:2i3r9goR3jR4:5:3jR13:1:0oR3jR4:1:1oR5r15R7y5:colorR9jR10:5:2i3r9R12i-269gR15oR16R17R18i590R19i585gR20r95goR3jR4:3:1oR3jR4:5:3jR13:2:0oR3jR4:8:2oR3jR4:2:1jR23:22:0R15oR16R17R18i621R19i594gR20jR10:13:1aoR1aoR7R24R9r31goR7R25R9r31ghR26r31ghgaoR3jR4:8:2oR3jR4:2:1r34R15oR16R17R18i611R19i594gR20jR10:13:1aoR1aoR7R24R9jR10:5:2i3r9gr41hR26r31ghgaoR3jR4:1:1oR5r8R7y17:transformedNormalR9r121R12i-268gR15oR16R17R18i611R19i594gR20r121goR3jR4:1:1r7R15oR16R17R18i620R19i616gR20r10ghR15oR16R17R18i621R19i594gR20r31goR3jR4:0:1jy10:hxsl.Const:3:1d0R15oR16R17R18i628R19i626gR20r31ghR15oR16R17R18i629R19i594gR20r31goR3jR4:8:2oR3jR4:2:1r34R15oR16R17R18i663R19i632gR20jR10:13:1aoR1aoR7R24R9jR10:5:2i3r9gr41hR26r31ghgaoR3jR4:8:2oR3jR4:2:1jR23:39:0R15oR16R17R18i636R19i632gR20jR10:13:1ahgaoR3jR4:1:1r56R15oR16R17R18i641R19i637gR20r31goR3jR4:1:1r30R15oR16R17R18i648R19i643gR20r31goR3jR4:5:3r92oR3jR4:1:1r56R15oR16R17R18i654R19i650gR20r31goR3jR4:1:1r30R15oR16R17R18i662R19i657gR20r31gR15oR16R17R18i662R19i650gR20r31ghR15oR16R17R18i663R19i632gR20r147goR3jR4:1:1oR5r15R7y6:paramsR9jR10:5:2i3r9R12i-270gR15oR16R17R18i674R19i668gR20r177ghR15oR16R17R18i675R19i632gR20r31gR15oR16R17R18i675R19i594gR20r31gR15oR16R17R18i676R19i593gR20r31gR15oR16R17R18i676R19i585gR20r95gR15oR16R17R18i676R19i567gR20r90ghR15oR16R17R18i682R19i401gR20r28gR5jy17:hxsl.FunctionKind:0:0y3:refoR5jR6:6:0R7y6:vertexR9jR10:13:1aoR1ahR26r28ghR12i-272gR26r28goR1ahR2oR3jR4:4:1aoR3jR4:7:2oR5r8R7R8R9jR10:5:2i3r9R12i-277goR3jR4:5:3r12oR3jR4:1:1r14R15oR16R17R18i738R19i725gR20r16goR3jR4:1:1oR5r8R7y24:pixelTransformedPositionR9jR10:5:2i3r9R12i-267gR15oR16R17R18i765R19i741gR20r212gR15oR16R17R18i765R19i725gR20r205gR15oR16R17R18i766R19i714gR20r28goR3jR4:7:2oR5r8R7R22R9r31R12i-278goR3jR4:8:2oR3jR4:2:1r34R15oR16R17R18i787R19i783gR20jR10:13:1aoR1aoR7R24R9r205gr41hR26r31ghgaoR3jR4:1:1r204R15oR16R17R18i787R19i783gR20r205goR3jR4:1:1r204R15oR16R17R18i796R19i792gR20r205ghR15oR16R17R18i797R19i783gR20r31gR15oR16R17R18i798R19i771gR20r28goR3jR4:7:2oR5r8R7R27R9r31R12i-279goR3jR4:8:2oR3jR4:2:1r59R15oR16R17R18i819R19i814gR20jR10:13:1aoR1aoR7R24R9r31ghR26r31ghgaoR3jR4:1:1r220R15oR16R17R18i819R19i814gR20r31ghR15oR16R17R18i826R19i814gR20r31gR15oR16R17R18i827R19i803gR20r28goR3jR4:5:3jR13:20:1r76oR3jR4:9:2oR3jR4:1:1oR5r8R7y15:lightPixelColorR9jR10:5:2i3r9R12i-265gR15oR16R17R18i847R19i832gR20r265gar85r86r87hR15oR16R17R18i851R19i832gR20jR10:5:2i3r9goR3jR4:5:3r92oR3jR4:1:1r94R15oR16R17R18i860R19i855gR20r95goR3jR4:3:1oR3jR4:5:3r100oR3jR4:8:2oR3jR4:2:1r103R15oR16R17R18i891R19i864gR20jR10:13:1aoR1aoR7R24R9r31gr110hR26r31ghgaoR3jR4:8:2oR3jR4:2:1r34R15oR16R17R18i881R19i864gR20jR10:13:1aoR1aoR7R24R9r121gr41hR26r31ghgaoR3jR4:1:1r125R15oR16R17R18i881R19i864gR20r121goR3jR4:1:1r204R15oR16R17R18i890R19i886gR20r205ghR15oR16R17R18i891R19i864gR20r31goR3jR4:0:1jR32:3:1d0R15oR16R17R18i898R19i896gR20r31ghR15oR16R17R18i899R19i864gR20r31goR3jR4:8:2oR3jR4:2:1r34R15oR16R17R18i933R19i902gR20jR10:13:1aoR1aoR7R24R9jR10:5:2i3r9gr41hR26r31ghgaoR3jR4:8:2oR3jR4:2:1r152R15oR16R17R18i906R19i902gR20r156gaoR3jR4:1:1r242R15oR16R17R18i911R19i907gR20r31goR3jR4:1:1r220R15oR16R17R18i918R19i913gR20r31goR3jR4:5:3r92oR3jR4:1:1r242R15oR16R17R18i924R19i920gR20r31goR3jR4:1:1r220R15oR16R17R18i932R19i927gR20r31gR15oR16R17R18i932R19i920gR20r31ghR15oR16R17R18i933R19i902gR20r320goR3jR4:1:1r176R15oR16R17R18i944R19i938gR20r177ghR15oR16R17R18i945R19i902gR20r31gR15oR16R17R18i945R19i864gR20r31gR15oR16R17R18i946R19i863gR20r31gR15oR16R17R18i946R19i855gR20r95gR15oR16R17R18i946R19i832gR20r271ghR15oR16R17R18i952R19i708gR20r28gR5jR34:1:0R35oR5r194R7y8:fragmentR9jR10:13:1aoR1ahR26r28ghR12i-273gR26r28ghR7y21:h3d.shader.PointLighty4:varsar193r125r80r14r361r20r94r211r264r176hg";
h3d_shader_SAO.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:5:0y4:namey8:positiony4:typejy9:hxsl.Type:5:2i4jy12:hxsl.VecType:1:0y6:parentoR6r10R8y6:outputR10jR11:12:1ar9oR6r10R8y5:colorR10jR11:5:2i4r11R13r13y2:idi-122ghR16i-120gR16i-121gy1:poy4:filey69:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FScreenShader.hxy3:maxi262y3:mini247gy1:tr12goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:40:0R17oR18R19R20i269R21i265gR22jR11:13:1ahgaoR3jR4:1:1oR6jR7:1:0R8R9R10jR11:5:2i2r11R13oR6r30R8y5:inputR10jR11:12:1ar29oR6r30R8y2:uvR10jR11:5:2i2r11R13r32R16i-119ghR16i-117gR16i-118gR17oR18R19R20i284R21i270gR22r31goR3jR4:0:1jy10:hxsl.Const:3:1zR17oR18R19R20i287R21i286gR22jR11:3:0goR3jR4:0:1jR26:3:1i1R17oR18R19R20i290R21i289gR22r43ghR17oR18R19R20i291R21i265gR22jR11:5:2i4r11gR17oR18R19R20i291R21i247gR22r12ghR17oR18R19R20i297R21i241gR22jR11:0:0gR6jy17:hxsl.FunctionKind:0:0y3:refoR6jR7:6:0R8y6:vertexR10jR11:13:1aoR1ahy3:retr55ghR16i-136gR30r55goR1aoR6jR7:4:0R8R25R10jR11:5:2i2r11R16i-137goR6r66R8R9R10jR11:5:2i3r11R16i-138goR6r66R8y6:normalR10jR11:5:2i3r11R16i-139goR6r66R8y8:radiusSSR10r43R16i-140goR6r66R8y8:tapIndexR10jR11:1:0R16i-141goR6r66R8y13:rotationAngleR10r43R16i-142ghR2oR3jR4:4:1aoR3jR4:7:2oR6r66R8y5:alphaR10r43R16i-147goR3jR4:5:3jR5:1:0oR3jR4:3:1oR3jR4:5:3jR5:0:0oR3jR4:8:2oR3jR4:2:1jR23:36:0R17oR18y60:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FSAO.hxR20i933R21i928gR22jR11:13:1aoR1aoR8y5:valueR10r74ghR30r43ghgaoR3jR4:1:1r73R17oR18R36R20i942R21i934gR22r74ghR17oR18R36R20i943R21i928gR22r43goR3jR4:0:1jR26:3:1d0.5R17oR18R36R20i949R21i946gR22r43gR17oR18R36R20i949R21i928gR22r43gR17oR18R36R20i950R21i927gR22r43goR3jR4:3:1oR3jR4:5:3jR5:2:0oR3jR4:0:1jR26:3:1d1R17oR18R36R20i957R21i954gR22r43goR3jR4:8:2oR3jR4:2:1r87R17oR18R36R20i965R21i960gR22jR11:13:1ar91hgaoR3jR4:1:1oR6jR7:2:0R8y10:numSamplesR10r74y10:qualifiersajy17:hxsl.VarQualifier:0:1njR40:7:2d4d30hR16i-123gR17oR18R36R20i976R21i966gR22r74ghR17oR18R36R20i977R21i960gR22r43gR17oR18R36R20i977R21i954gR22r43gR17oR18R36R20i978R21i953gR22r43gR17oR18R36R20i978R21i927gR22r43gR17oR18R36R20i979R21i915gR22r55goR3jR4:7:2oR6r66R8y5:angleR10r43R16i-148goR3jR4:5:3r84oR3jR4:5:3r81oR3jR4:1:1r79R17oR18R36R20i1000R21i995gR22r43goR3jR4:3:1oR3jR4:5:3r81oR3jR4:8:2oR3jR4:2:1r87R17oR18R36R20i1009R21i1004gR22jR11:13:1ar91hgaoR3jR4:1:1oR6r125R8y14:numSpiralTurnsR10r74R39ajR40:0:1njR40:7:2d1d10hR16i-124gR17oR18R36R20i1024R21i1010gR22r74ghR17oR18R36R20i1025R21i1004gR22r43goR3jR4:0:1jR26:3:1d6.28R17oR18R36R20i1032R21i1028gR22r43gR17oR18R36R20i1032R21i1004gR22r43gR17oR18R36R20i1033R21i1003gR22r43gR17oR18R36R20i1033R21i995gR22r43goR3jR4:1:1r75R17oR18R36R20i1049R21i1036gR22r43gR17oR18R36R20i1049R21i995gR22r43gR17oR18R36R20i1050R21i983gR22r55goR3jR4:7:2oR6r66R8y10:unitOffsetR10jR11:5:2i2r11R16i-149goR3jR4:8:2oR3jR4:2:1jR23:38:0R17oR18R36R20i1076R21i1072gR22jR11:13:1ahgaoR3jR4:8:2oR3jR4:2:1jR23:3:0R17oR18R36R20i1080R21i1077gR22jR11:13:1aoR1aoR8R37R10r43ghR30r43ghgaoR3jR4:1:1r142R17oR18R36R20i1086R21i1081gR22r43ghR17oR18R36R20i1087R21i1077gR22r43goR3jR4:8:2oR3jR4:2:1jR23:2:0R17oR18R36R20i1092R21i1089gR22jR11:13:1ar200hgaoR3jR4:1:1r142R17oR18R36R20i1098R21i1093gR22r43ghR17oR18R36R20i1099R21i1089gR22r43ghR17oR18R36R20i1100R21i1072gR22r185gR17oR18R36R20i1101R21i1055gR22r55goR3jR4:7:2oR6r66R8y8:targetUVR10jR11:5:2i2r11R16i-150goR3jR4:5:3r84oR3jR4:1:1r65R17oR18R36R20i1122R21i1120gR22r67goR3jR4:5:3r81oR3jR4:5:3r81oR3jR4:5:3r81oR3jR4:1:1r72R17oR18R36R20i1133R21i1125gR22r43goR3jR4:1:1r79R17oR18R36R20i1141R21i1136gR22r43gR17oR18R36R20i1141R21i1125gR22r43goR3jR4:1:1r184R17oR18R36R20i1154R21i1144gR22r185gR17oR18R36R20i1154R21i1125gR22r185goR3jR4:1:1oR6r125R8y11:screenRatioR10jR11:5:2i2r11R39ajR40:8:0hR16i-134gR17oR18R36R20i1168R21i1157gR22r252gR17oR18R36R20i1168R21i1125gR22jR11:5:2i2r11gR17oR18R36R20i1168R21i1120gR22r229gR17oR18R36R20i1169R21i1105gR22r55goR3jR4:7:2oR6r66R8y1:QR10jR11:5:2i3r11R16i-151goR3jR4:8:2oR3jR4:1:1oR6r58R8y11:getPositionR10jR11:13:1aoR1aoR8R25R10jR11:5:2i2r11ghR30r266ghR16i-145gR17oR18R36R20i1192R21i1181gR22r275gaoR3jR4:1:1r228R17oR18R36R20i1201R21i1193gR22r229ghR17oR18R36R20i1202R21i1181gR22r266gR17oR18R36R20i1203R21i1173gR22r55goR3jR4:7:2oR6r66R8y1:vR10jR11:5:2i3r11R16i-152goR3jR4:5:3jR5:3:0oR3jR4:1:1r265R17oR18R36R20i1216R21i1215gR22r266goR3jR4:1:1r68R17oR18R36R20i1227R21i1219gR22r69gR17oR18R36R20i1227R21i1215gR22r288gR17oR18R36R20i1228R21i1207gR22r55goR3jR4:7:2oR6r66R8y2:vvR10r43R16i-153goR3jR4:8:2oR3jR4:2:1jR23:29:0R17oR18R36R20i1245R21i1242gR22jR11:13:1aoR1aoR8y1:aR10jR11:5:2i3r11goR8y1:bR10r312ghR30r43ghgaoR3jR4:1:1r287R17oR18R36R20i1247R21i1246gR22r288goR3jR4:1:1r287R17oR18R36R20i1250R21i1249gR22r288ghR17oR18R36R20i1251R21i1242gR22r43gR17oR18R36R20i1252R21i1233gR22r55goR3jR4:7:2oR6r66R8y2:vnR10r43R16i-154goR3jR4:5:3r290oR3jR4:8:2oR3jR4:2:1r305R17oR18R36R20i1268R21i1265gR22jR11:13:1ar309hgaoR3jR4:1:1r287R17oR18R36R20i1270R21i1269gR22r288goR3jR4:1:1r70R17oR18R36R20i1278R21i1272gR22r71ghR17oR18R36R20i1279R21i1265gR22r43goR3jR4:3:1oR3jR4:5:3r81oR3jR4:1:1oR6r125R8y4:biasR10r43R39ajR40:7:2d0d0.2hR16i-131gR17oR18R36R20i1287R21i1283gR22r43goR3jR4:1:1oR6r125R8y12:sampleRadiusR10r43R39ajR40:7:2d0d10hR16i-129gR17oR18R36R20i1302R21i1290gR22r43gR17oR18R36R20i1302R21i1283gR22r43gR17oR18R36R20i1303R21i1282gR22r43gR17oR18R36R20i1303R21i1265gR22r43gR17oR18R36R20i1304R21i1256gR22r55goR3jR4:7:2oR6r66R8y7:radius2R10r43R16i-155goR3jR4:5:3r81oR3jR4:1:1r353R17oR18R36R20i1425R21i1413gR22r43goR3jR4:1:1r353R17oR18R36R20i1440R21i1428gR22r43gR17oR18R36R20i1440R21i1413gR22r43gR17oR18R36R20i1441R21i1399gR22r55goR3jR4:7:2oR6r66R8y1:fR10r43R16i-156goR3jR4:5:3r111oR3jR4:8:2oR3jR4:2:1jR23:22:0R17oR18R36R20i1456R21i1453gR22jR11:13:1aoR1aoR8R50R10r43goR8R51R10r43ghR30r43ghgaoR3jR4:5:3r290oR3jR4:1:1r367R17oR18R36R20i1464R21i1457gR22r43goR3jR4:1:1r302R17oR18R36R20i1469R21i1467gR22r43gR17oR18R36R20i1469R21i1457gR22r43goR3jR4:0:1jR26:3:1d0R17oR18R36R20i1474R21i1471gR22r43ghR17oR18R36R20i1475R21i1453gR22r43goR3jR4:1:1r367R17oR18R36R20i1485R21i1478gR22r43gR17oR18R36R20i1485R21i1453gR22r43gR17oR18R36R20i1486R21i1445gR22r55goR3jR4:7:2oR6r66R8y7:epsilonR10r43R16i-157goR3jR4:0:1jR26:3:1d0.01R17oR18R36R20i1508R21i1504gR22r43gR17oR18R36R20i1509R21i1490gR22r55goR3jR4:12:1oR3jR4:5:3r81oR3jR4:5:3r81oR3jR4:5:3r81oR3jR4:1:1r380R17oR18R36R20i1521R21i1520gR22r43goR3jR4:1:1r380R17oR18R36R20i1525R21i1524gR22r43gR17oR18R36R20i1525R21i1520gR22r43goR3jR4:1:1r380R17oR18R36R20i1529R21i1528gR22r43gR17oR18R36R20i1529R21i1520gR22r43goR3jR4:8:2oR3jR4:2:1r384R17oR18R36R20i1535R21i1532gR22jR11:13:1ar388hgaoR3jR4:5:3r111oR3jR4:1:1r327R17oR18R36R20i1538R21i1536gR22r43goR3jR4:3:1oR3jR4:5:3r84oR3jR4:1:1r417R17oR18R36R20i1549R21i1542gR22r43goR3jR4:1:1r302R17oR18R36R20i1554R21i1552gR22r43gR17oR18R36R20i1554R21i1542gR22r43gR17oR18R36R20i1555R21i1541gR22r43gR17oR18R36R20i1555R21i1536gR22r43goR3jR4:0:1jR26:3:1d0R17oR18R36R20i1560R21i1557gR22r43ghR17oR18R36R20i1561R21i1532gR22r43gR17oR18R36R20i1561R21i1520gR22r43gR17oR18R36R20i1561R21i1513gR22r55ghR17oR18R36R20i1566R21i771gR22r55gR6jR27:3:0R28oR6r58R8y8:sampleAOR10jR11:13:1aoR1aoR8R25R10r67goR8R9R10r69goR8R31R10r71goR8R32R10r43goR8R33R10r74goR8R34R10r43ghR30r43ghR16i-143gR30r43goR1aoR6r66R8R25R10r274R16i-144ghR2oR3jR4:4:1aoR3jR4:7:2oR6r66R8y5:depthR10r43R16i-158goR3jR4:8:2oR3jR4:2:1jR23:53:0R17oR18R36R20i1634R21i1628gR22jR11:13:1aoR1aoR8R37R10jR11:5:2i4r11ghR30r43ghgaoR3jR4:8:2oR3jR4:2:1jR23:33:0R17oR18R36R20i1647R21i1635gR22jR11:13:1aoR1aoR8y1:_R10jR11:10:0goR8R51R10jR11:5:2i2r11ghR30jR11:5:2i4r11ghgaoR3jR4:1:1oR6r125R8y12:depthTextureR10r518R39ar254hR16i-125gR17oR18R36R20i1647R21i1635gR22r518goR3jR4:1:1r492R17oR18R36R20i1654R21i1652gR22r274ghR17oR18R36R20i1655R21i1635gR22r521ghR17oR18R36R20i1656R21i1628gR22r43gR17oR18R36R20i1657R21i1616gR22r55goR3jR4:7:2oR6r66R8y3:uv2R10jR11:5:2i2r11R16i-159goR3jR4:5:3r81oR3jR4:3:1oR3jR4:5:3r290oR3jR4:1:1r492R17oR18R36R20i1674R21i1672gR22r274goR3jR4:0:1jR26:3:1d0.5R17oR18R36R20i1680R21i1677gR22r43gR17oR18R36R20i1680R21i1672gR22r274gR17oR18R36R20i1681R21i1671gR22r274goR3jR4:8:2oR3jR4:2:1r188R17oR18R36R20i1688R21i1684gR22r192gaoR3jR4:0:1jR26:3:1i2R17oR18R36R20i1690R21i1689gR22r43goR3jR4:0:1jR26:3:1i-2R17oR18R36R20i1694R21i1692gR22r43ghR17oR18R36R20i1695R21i1684gR22jR11:5:2i2r11gR17oR18R36R20i1695R21i1671gR22r540gR17oR18R36R20i1696R21i1661gR22r55goR3jR4:7:2oR6r66R8y4:tempR10r521R16i-160goR3jR4:5:3r81oR3jR4:8:2oR3jR4:2:1r22R17oR18R36R20i1715R21i1711gR22r26gaoR3jR4:1:1r539R17oR18R36R20i1719R21i1716gR22r540goR3jR4:1:1r496R17oR18R36R20i1726R21i1721gR22r43goR3jR4:0:1jR26:3:1i1R17oR18R36R20i1729R21i1728gR22r43ghR17oR18R36R20i1730R21i1711gR22jR11:5:2i4r11goR3jR4:1:1oR6r125R8y21:cameraInverseViewProjR10jR11:7:0R39ar254hR16i-133gR17oR18R36R20i1754R21i1733gR22r598gR17oR18R36R20i1754R21i1711gR22r521gR17oR18R36R20i1755R21i1700gR22r55goR3jR4:7:2oR6r66R8y8:originWSR10jR11:5:2i3r11R16i-161goR3jR4:5:3r111oR3jR4:9:2oR3jR4:1:1r576R17oR18R36R20i1778R21i1774gR22r521gajy14:hxsl.Component:0:0jR66:1:0jR66:2:0hR17oR18R36R20i1782R21i1774gR22r608goR3jR4:9:2oR3jR4:1:1r576R17oR18R36R20i1789R21i1785gR22r521gajR66:3:0hR17oR18R36R20i1791R21i1785gR22r43gR17oR18R36R20i1791R21i1774gR22r608gR17oR18R36R20i1792R21i1759gR22r55goR3jR4:12:1oR3jR4:1:1r607R17oR18R36R20i1811R21i1803gR22r608gR17oR18R36R20i1811R21i1796gR22r55ghR17oR18R36R20i1816R21i1611gR22r55gR6r478R28r269R30r266goR1ahR2oR3jR4:4:1aoR3jR4:7:2oR6r66R8y3:vUVR10r35R16i-162goR3jR4:1:1r34R17oR18R36R20i1864R21i1856gR22r35gR17oR18R36R20i1865R21i1846gR22r55goR3jR4:7:2oR6r66R8y9:occlusionR10r43R16i-163goR3jR4:0:1jR26:3:1d0R17oR18R36R20i1888R21i1885gR22r43gR17oR18R36R20i1889R21i1869gR22r55goR3jR4:7:2oR6r66R8y6:originR10r266R16i-164goR3jR4:8:2oR3jR4:1:1r269R17oR18R36R20i1917R21i1906gR22r275gaoR3jR4:1:1r645R17oR18R36R20i1921R21i1918gR22r35ghR17oR18R36R20i1922R21i1906gR22r266gR17oR18R36R20i1923R21i1893gR22r55goR3jR4:7:2oR6r66R8R31R10jR11:5:2i3r11R16i-165goR3jR4:8:2oR3jR4:2:1jR23:55:0R17oR18R36R20i1952R21i1940gR22jR11:13:1aoR1aoR8R37R10jR11:5:2i4r11ghR30r675ghgaoR3jR4:8:2oR3jR4:2:1r511R17oR18R36R20i1966R21i1953gR22jR11:13:1aoR1aoR8R60R10r518gr519hR30r521ghgaoR3jR4:1:1oR6r125R8y13:normalTextureR10r518R39ar254hR16i-126gR17oR18R36R20i1966R21i1953gR22r518goR3jR4:1:1r645R17oR18R36R20i1974R21i1971gR22r35ghR17oR18R36R20i1975R21i1953gR22r521ghR17oR18R36R20i1976R21i1940gR22r675gR17oR18R36R20i1977R21i1927gR22r55goR3jR4:7:2oR6r66R8y11:sampleNoiseR10r43R16i-166goR3jR4:9:2oR3jR4:8:2oR3jR4:2:1r511R17oR18R36R20i2012R21i2000gR22jR11:13:1aoR1aoR8R60R10r518gr519hR30r521ghgaoR3jR4:1:1oR6r125R8y12:noiseTextureR10r518R16i-127gR17oR18R36R20i2012R21i2000gR22r518goR3jR4:5:3r111oR3jR4:5:3r81oR3jR4:1:1r645R17oR18R36R20i2020R21i2017gR22r35goR3jR4:1:1oR6r125R8y10:noiseScaleR10jR11:5:2i2r11R16i-128gR17oR18R36R20i2033R21i2023gR22r736gR17oR18R36R20i2033R21i2017gR22jR11:5:2i2r11goR3jR4:1:1r251R17oR18R36R20i2047R21i2036gR22r252gR17oR18R36R20i2047R21i2017gR22jR11:5:2i2r11ghR17oR18R36R20i2048R21i2000gR22r521gar615hR17oR18R36R20i2050R21i2000gR22r43gR17oR18R36R20i2051R21i1982gR22r55goR3jR4:7:2oR6r66R8y26:randomPatternRotationAngleR10r43R16i-167goR3jR4:5:3r81oR3jR4:5:3r81oR3jR4:0:1jR26:3:1d2R17oR18R36R20i2091R21i2088gR22r43goR3jR4:0:1jR26:3:1d3.14159265358979312R17oR18R36R20i2096R21i2094gR22r43gR17oR18R36R20i2096R21i2088gR22r43goR3jR4:1:1r713R17oR18R36R20i2110R21i2099gR22r43gR17oR18R36R20i2110R21i2088gR22r43gR17oR18R36R20i2111R21i2055gR22r55goR3jR4:7:2oR6r66R8R32R10r43R16i-168goR3jR4:5:3r111oR3jR4:3:1oR3jR4:5:3r81oR3jR4:1:1r353R17oR18R36R20i2182R21i2170gR22r43goR3jR4:1:1oR6r125R8y6:fovTanR10r43R39ar254hR16i-135gR17oR18R36R20i2191R21i2185gR22r43gR17oR18R36R20i2191R21i2170gR22r43gR17oR18R36R20i2192R21i2169gR22r43goR3jR4:9:2oR3jR4:3:1oR3jR4:5:3r81oR3jR4:1:1r660R17oR18R36R20i2202R21i2196gR22r266goR3jR4:1:1oR6r125R8y10:cameraViewR10jR11:8:0R39ar254hR16i-132gR17oR18R36R20i2215R21i2205gR22r801gR17oR18R36R20i2215R21i2196gR22r312gR17oR18R36R20i2216R21i2195gR22r312gar617hR17oR18R36R20i2218R21i2195gR22r43gR17oR18R36R20i2218R21i2169gR22r43gR17oR18R36R20i2219R21i2154gR22r55goR3jR4:13:3oR6r66R8y1:iR10r74R16i-169goR3jR4:5:3jR5:21:0oR3jR4:0:1jR26:2:1zR17oR18R36R20i2238R21i2234gR22r74goR3jR4:1:1r124R17oR18R36R20i2248R21i2238gR22r74gR17oR18R36R20i2248R21i2234gR22jR11:14:2r74jy13:hxsl.SizeDecl:0:1zgoR3jR4:5:3jR5:20:1r84oR3jR4:1:1r652R17oR18R36R20i2264R21i2255gR22r43goR3jR4:8:2oR3jR4:1:1r479R17oR18R36R20i2276R21i2268gR22r489gaoR3jR4:1:1r645R17oR18R36R20i2280R21i2277gR22r35goR3jR4:1:1r660R17oR18R36R20i2288R21i2282gR22r266goR3jR4:1:1r674R17oR18R36R20i2296R21i2290gR22r675goR3jR4:1:1r777R17oR18R36R20i2306R21i2298gR22r43goR3jR4:1:1r817R17oR18R36R20i2309R21i2308gR22r74goR3jR4:1:1r756R17oR18R36R20i2337R21i2311gR22r43ghR17oR18R36R20i2338R21i2268gR22r43gR17oR18R36R20i2338R21i2255gR22r43gR17oR18R36R20i2338R21i2224gR22r55goR3jR4:5:3r7oR3jR4:1:1r652R17oR18R36R20i2353R21i2344gR22r43goR3jR4:5:3r290oR3jR4:0:1jR26:3:1d1R17oR18R36R20i2359R21i2356gR22r43goR3jR4:5:3r111oR3jR4:1:1r652R17oR18R36R20i2371R21i2362gR22r43goR3jR4:8:2oR3jR4:2:1r87R17oR18R36R20i2379R21i2374gR22jR11:13:1ar91hgaoR3jR4:1:1r124R17oR18R36R20i2390R21i2380gR22r74ghR17oR18R36R20i2391R21i2374gR22r43gR17oR18R36R20i2391R21i2362gR22r43gR17oR18R36R20i2391R21i2356gR22r43gR17oR18R36R20i2391R21i2344gR22r43goR3jR4:5:3r7oR3jR4:1:1r652R17oR18R36R20i2405R21i2396gR22r43goR3jR4:8:2oR3jR4:2:1jR23:23:0R17oR18R36R20i2413R21i2408gR22jR11:13:1aoR1aoR8R37R10r43goR8R21R10r43goR8R20R10r43ghR30r43ghgaoR3jR4:8:2oR3jR4:2:1jR23:8:0R17oR18R36R20i2417R21i2414gR22jR11:13:1ar388hgaoR3jR4:1:1r652R17oR18R36R20i2427R21i2418gR22r43goR3jR4:5:3r84oR3jR4:0:1jR26:3:1d1R17oR18R36R20i2432R21i2429gR22r43goR3jR4:1:1oR6r125R8y9:intensityR10r43R39ajR40:7:2d0d10hR16i-130gR17oR18R36R20i2444R21i2435gR22r43gR17oR18R36R20i2444R21i2429gR22r43ghR17oR18R36R20i2445R21i2414gR22r43goR3jR4:0:1jR26:3:1d0R17oR18R36R20i2450R21i2447gR22r43goR3jR4:0:1jR26:3:1d1R17oR18R36R20i2455R21i2452gR22r43ghR17oR18R36R20i2456R21i2408gR22r43gR17oR18R36R20i2456R21i2396gR22r43goR3jR4:5:3r7oR3jR4:1:1r15R17oR18R36R20i2474R21i2462gR22r16goR3jR4:8:2oR3jR4:2:1r22R17oR18R36R20i2481R21i2477gR22r26gaoR3jR4:9:2oR3jR4:1:1r652R17oR18R36R20i2491R21i2482gR22r43gar615r615r615hR17oR18R36R20i2495R21i2482gR22jR11:5:2i3r11goR3jR4:0:1jR26:3:1d1R17oR18R36R20i2499R21i2497gR22r43ghR17oR18R36R20i2500R21i2477gR22jR11:5:2i4r11gR17oR18R36R20i2500R21i2462gR22r16ghR17oR18R36R20i2505R21i1840gR22r55gR6jR27:1:0R28oR6r58R8y8:fragmentR10jR11:13:1aoR1ahR30r55ghR16i-146gR30r55ghR8y14:h3d.shader.SAOy4:varsar57r735r269r980r930r785r699r347r800r353r251r13r32r124r597r158r525r726r479hg";
h3d_shader_Shadow.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:10:3oR3jR4:6:2jy15:haxe.macro.Unop:2:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:2:0y4:namey8:perPixely4:typejy9:hxsl.Type:2:0y10:qualifiersajy17:hxsl.VarQualifier:0:1nhy2:idi-694gy1:poy4:filey63:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FShadow.hxy3:maxi416y3:mini408gy1:tr12gR15oR16R17R18i416R19i407gR20r12goR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oR6jR7:3:0R8y9:shadowPosR10jR11:5:2i3jy12:hxsl.VecType:1:0R12ajR13:1:0hR14i-693gR15oR16R17R18i428R19i419gR20r25goR3jR4:5:3jR21:0:0oR3jR4:5:3jR21:1:0oR3jR4:5:3r33oR3jR4:1:1oR6jR7:4:0R8y19:transformedPositionR10jR11:5:2i3r24R14i-691gR15oR16R17R18i450R19i431gR20r38goR3jR4:1:1oR6jR7:0:0R8y4:projR10jR11:8:0y6:parentoR6r43R8y6:shadowR10jR11:12:1aoR6r43R8y3:mapR10jR11:10:0R26r45R14i-685gr42oR6r43R8y5:colorR10jR11:5:2i3r24R26r45R14i-687goR6r43R8y5:powerR10jR11:3:0R26r45R14i-688goR6r43R8y4:biasR10r52R26r45R14i-689ghR14i-684gR14i-686gR15oR16R17R18i464R19i453gR20r44gR15oR16R17R18i464R19i431gR20jR11:5:2i3r24goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:39:0R15oR16R17R18i471R19i467gR20jR11:13:1ahgaoR3jR4:0:1jy10:hxsl.Const:3:1d0.5R15oR16R17R18i475R19i472gR20r52goR3jR4:0:1jR33:3:1d-0.5R15oR16R17R18i481R19i477gR20r52goR3jR4:0:1jR33:3:1i1R15oR16R17R18i484R19i483gR20r52ghR15oR16R17R18i485R19i467gR20jR11:5:2i3r24gR15oR16R17R18i485R19i431gR20jR11:5:2i3r24goR3jR4:8:2oR3jR4:2:1r62R15oR16R17R18i492R19i488gR20r66gaoR3jR4:0:1jR33:3:1d0.5R15oR16R17R18i496R19i493gR20r52goR3jR4:0:1jR33:3:1d0.5R15oR16R17R18i501R19i498gR20r52goR3jR4:0:1jR33:3:1zR15oR16R17R18i504R19i503gR20r52ghR15oR16R17R18i505R19i488gR20jR11:5:2i3r24gR15oR16R17R18i505R19i431gR20jR11:5:2i3r24gR15oR16R17R18i505R19i419gR20r25gnR15oR16R17R18i505R19i403gR20jR11:0:0ghR15oR16R17R18i511R19i397gR20r113gR6jy17:hxsl.FunctionKind:0:0y3:refoR6jR7:6:0R8y6:vertexR10jR11:13:1aoR1ahy3:retr113ghR14i-695gR37r113goR1ahR2oR3jR4:4:1aoR3jR4:7:2oR6r37R8R22R10jR11:5:2i3r24R14i-697goR3jR4:10:3oR3jR4:1:1r10R15oR16R17R18i573R19i565gR20r12goR3jR4:5:3r31oR3jR4:5:3r33oR3jR4:5:3r33oR3jR4:1:1oR6r37R8y24:pixelTransformedPositionR10jR11:5:2i3r24R14i-692gR15oR16R17R18i600R19i576gR20r139goR3jR4:1:1r42R15oR16R17R18i614R19i603gR20r44gR15oR16R17R18i614R19i576gR20r59goR3jR4:8:2oR3jR4:2:1r62R15oR16R17R18i621R19i617gR20r66gaoR3jR4:0:1jR33:3:1d0.5R15oR16R17R18i625R19i622gR20r52goR3jR4:0:1jR33:3:1d-0.5R15oR16R17R18i631R19i627gR20r52goR3jR4:0:1jR33:3:1i1R15oR16R17R18i634R19i633gR20r52ghR15oR16R17R18i635R19i617gR20jR11:5:2i3r24gR15oR16R17R18i635R19i576gR20jR11:5:2i3r24goR3jR4:8:2oR3jR4:2:1r62R15oR16R17R18i642R19i638gR20r66gaoR3jR4:0:1jR33:3:1d0.5R15oR16R17R18i646R19i643gR20r52goR3jR4:0:1jR33:3:1d0.5R15oR16R17R18i651R19i648gR20r52goR3jR4:0:1jR33:3:1zR15oR16R17R18i654R19i653gR20r52ghR15oR16R17R18i655R19i638gR20jR11:5:2i3r24gR15oR16R17R18i655R19i576gR20r129goR3jR4:1:1r22R15oR16R17R18i670R19i661gR20r25gR15oR16R17R18i670R19i561gR20r129gR15oR16R17R18i671R19i545gR20r113goR3jR4:7:2oR6r37R8y5:depthR10r52R14i-698goR3jR4:8:2oR3jR4:2:1jR32:53:0R15oR16R17R18i696R19i690gR20jR11:13:1aoR1aoR8y5:valueR10jR11:5:2i4r24ghR37r52ghgaoR3jR4:8:2oR3jR4:2:1jR32:33:0R15oR16R17R18i707R19i697gR20jR11:13:1aoR1aoR8y1:_R10r48goR8y1:bR10jR11:5:2i2r24ghR37jR11:5:2i4r24ghgaoR3jR4:1:1r47R15oR16R17R18i707R19i697gR20r48goR3jR4:9:2oR3jR4:1:1r128R15oR16R17R18i721R19i712gR20r129gajy14:hxsl.Component:0:0jR43:1:0hR15oR16R17R18i724R19i712gR20jR11:5:2i2r24ghR15oR16R17R18i725R19i697gR20r224ghR15oR16R17R18i726R19i690gR20r52gR15oR16R17R18i727R19i678gR20r113goR3jR4:7:2oR6r37R8y4:zMaxR10r52R14i-699goR3jR4:8:2oR3jR4:2:1jR32:51:0R15oR16R17R18i919R19i908gR20jR11:13:1aoR1aoR8R41R10r52ghR37r52ghgaoR3jR4:9:2oR3jR4:1:1r128R15oR16R17R18i917R19i908gR20r129gajR43:2:0hR15oR16R17R18i919R19i908gR20r52ghR15oR16R17R18i930R19i908gR20r52gR15oR16R17R18i931R19i897gR20r113goR3jR4:7:2oR6r37R8y5:deltaR10r52R14i-700goR3jR4:5:3jR21:3:0oR3jR4:8:2oR3jR4:2:1jR32:21:0R15oR16R17R18i969R19i948gR20jR11:13:1aoR1aoR8R41R10r52goR8R42R10r52ghR37r52ghgaoR3jR4:3:1oR3jR4:5:3r31oR3jR4:1:1r200R15oR16R17R18i954R19i949gR20r52goR3jR4:1:1r53R15oR16R17R18i968R19i957gR20r52gR15oR16R17R18i968R19i949gR20r52gR15oR16R17R18i969R19i948gR20r52goR3jR4:1:1r247R15oR16R17R18i978R19i974gR20r52ghR15oR16R17R18i979R19i948gR20r52goR3jR4:1:1r247R15oR16R17R18i986R19i982gR20r52gR15oR16R17R18i986R19i948gR20r52gR15oR16R17R18i987R19i936gR20r113goR3jR4:7:2oR6r37R8y5:shadeR10r52R14i-701goR3jR4:8:2oR3jR4:2:1r250R15oR16R17R18i1032R19i1004gR20jR11:13:1aoR1aoR8R41R10r52ghR37r52ghgaoR3jR4:8:2oR3jR4:2:1jR32:9:0R15oR16R17R18i1007R19i1004gR20jR11:13:1aoR1aoR8R40R10r52ghR37r52ghgaoR3jR4:5:3r33oR3jR4:1:1r51R15oR16R17R18i1021R19i1009gR20r52goR3jR4:1:1r272R15oR16R17R18i1029R19i1024gR20r52gR15oR16R17R18i1029R19i1009gR20r52ghR15oR16R17R18i1032R19i1004gR20r52ghR15oR16R17R18i1043R19i1004gR20r52gR15oR16R17R18i1044R19i992gR20r113goR3jR4:5:3jR21:20:1r33oR3jR4:9:2oR3jR4:1:1oR6r37R8y10:pixelColorR10jR11:5:2i4r24R14i-690gR15oR16R17R18i1059R19i1049gR20r354gar235r236r264hR15oR16R17R18i1063R19i1049gR20jR11:5:2i3r24goR3jR4:5:3r31oR3jR4:5:3r33oR3jR4:3:1oR3jR4:5:3r274oR3jR4:0:1jR33:3:1i1R15oR16R17R18i1069R19i1068gR20r52goR3jR4:1:1r312R15oR16R17R18i1077R19i1072gR20r52gR15oR16R17R18i1077R19i1068gR20r52gR15oR16R17R18i1078R19i1067gR20r52goR3jR4:9:2oR3jR4:1:1r49R15oR16R17R18i1093R19i1081gR20r50gar235r236r264hR15oR16R17R18i1097R19i1081gR20jR11:5:2i3r24gR15oR16R17R18i1097R19i1067gR20r383goR3jR4:1:1r312R15oR16R17R18i1105R19i1100gR20r52gR15oR16R17R18i1105R19i1067gR20r383gR15oR16R17R18i1105R19i1049gR20r360ghR15oR16R17R18i1111R19i537gR20r113gR6jR34:1:0R35oR6r118R8y8:fragmentR10jR11:13:1aoR1ahR37r113ghR14i-696gR37r113ghR8y17:h3d.shader.Shadowy4:varsar117r396r45r22r36r353r138r10hg";
h3d_shader_SinusDeform.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:20:1jR5:0:0oR3jR4:9:2oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey12:calculatedUVy4:typejy9:hxsl.Type:5:2i2jy12:hxsl.VecType:1:0y2:idi-562gy1:poy4:filey68:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FSinusDeform.hxy3:maxi285y3:mini273gy1:tr14gajy14:hxsl.Component:0:0hR14oR15R16R17i287R18i273gR19jR11:3:0goR3jR4:5:3jR5:1:0oR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:2:0R14oR15R16R17i294R18i291gR19jR11:13:1aoR1aoR8y5:valueR10r21ghy3:retr21ghgaoR3jR4:5:3r7oR3jR4:5:3r23oR3jR4:9:2oR3jR4:1:1r11R14oR15R16R17i307R18i295gR19r14gajR20:1:0hR14oR15R16R17i309R18i295gR19r21goR3jR4:1:1oR6jR7:2:0R8y9:frequencyR10r21R13i-560gR14oR15R16R17i321R18i312gR19r21gR14oR15R16R17i321R18i295gR19r21goR3jR4:5:3r23oR3jR4:1:1oR6jR7:0:0R8y4:timeR10r21R13i-558gR14oR15R16R17i328R18i324gR19r21goR3jR4:1:1oR6r47R8y5:speedR10r21R13i-559gR14oR15R16R17i336R18i331gR19r21gR14oR15R16R17i336R18i324gR19r21gR14oR15R16R17i336R18i295gR19r21ghR14oR15R16R17i337R18i291gR19r21goR3jR4:1:1oR6r47R8y9:amplitudeR10r21R13i-561gR14oR15R16R17i349R18i340gR19r21gR14oR15R16R17i349R18i291gR19r21gR14oR15R16R17i349R18i273gR19r21ghR14oR15R16R17i355R18i267gR19jR11:0:0gR6jy17:hxsl.FunctionKind:1:0y3:refoR6jR7:6:0R8y8:fragmentR10jR11:13:1aoR1ahR23r78ghR13i-563gR23r78ghR8y22:h3d.shader.SinusDeformy4:varsar11r80r69r46r54r59hg";
h3d_shader_Skin.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey19:transformedPositiony4:typejy9:hxsl.Type:5:2i3jy12:hxsl.VecType:1:0y2:idi-65gy1:poy4:filey61:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FSkin.hxy3:maxi538y3:mini519gy1:tr12goR3jR4:5:3jR5:0:0oR3jR4:5:3r16oR3jR4:5:3jR5:1:0oR3jR4:3:1oR3jR4:5:3r19oR3jR4:1:1oR6r10R8y16:relativePositionR10jR11:5:2i3r11R13i-64gR14oR15R16R17i563R18i547gR19r24goR3jR4:16:2oR3jR4:1:1oR6jR7:2:0R8y13:bonesMatrixesR10jR11:14:2jR11:8:0jy13:hxsl.SizeDecl:1:1oR6r30R8y8:MaxBonesR10jR11:1:0y10:qualifiersajy17:hxsl.VarQualifier:0:1nhR13i-67gR13i-68gR14oR15R16R17i579R18i566gR19r37goR3jR4:9:2oR3jR4:1:1oR6jR7:1:0R8y7:indexesR10jR11:9:1i4y6:parentoR6r43R8y5:inputR10jR11:12:1aoR6r43R8y8:positionR10jR11:5:2i3r11R27r45R13i-60goR6r43R8y6:normalR10jR11:5:2i3r11R27r45R13i-61goR6r43R8y7:weightsR10jR11:5:2i3r11R27r45R13i-62gr42hR13i-59gR13i-63gR14oR15R16R17i593R18i580gR19r44gajy14:hxsl.Component:0:0hR14oR15R16R17i595R18i580gR19r33gR14oR15R16R17i596R18i566gR19r31gR14oR15R16R17i596R18i547gR19jR11:5:2i3r11gR14oR15R16R17i597R18i546gR19r64goR3jR4:9:2oR3jR4:1:1r51R14oR15R16R17i613R18i600gR19r52gar57hR14oR15R16R17i615R18i600gR19jR11:3:0gR14oR15R16R17i615R18i546gR19r64goR3jR4:5:3r19oR3jR4:3:1oR3jR4:5:3r19oR3jR4:1:1r23R14oR15R16R17i640R18i624gR19r24goR3jR4:16:2oR3jR4:1:1r29R14oR15R16R17i656R18i643gR19r37goR3jR4:9:2oR3jR4:1:1r42R14oR15R16R17i670R18i657gR19r44gajR32:1:0hR14oR15R16R17i672R18i657gR19r33gR14oR15R16R17i673R18i643gR19r31gR14oR15R16R17i673R18i624gR19r64gR14oR15R16R17i674R18i623gR19r64goR3jR4:9:2oR3jR4:1:1r51R14oR15R16R17i690R18i677gR19r52gar92hR14oR15R16R17i692R18i677gR19r74gR14oR15R16R17i692R18i623gR19r64gR14oR15R16R17i692R18i546gR19jR11:5:2i3r11goR3jR4:5:3r19oR3jR4:3:1oR3jR4:5:3r19oR3jR4:1:1r23R14oR15R16R17i717R18i701gR19r24goR3jR4:16:2oR3jR4:1:1r29R14oR15R16R17i733R18i720gR19r37goR3jR4:9:2oR3jR4:1:1r42R14oR15R16R17i747R18i734gR19r44gajR32:2:0hR14oR15R16R17i749R18i734gR19r33gR14oR15R16R17i750R18i720gR19r31gR14oR15R16R17i750R18i701gR19r64gR14oR15R16R17i751R18i700gR19r64goR3jR4:9:2oR3jR4:1:1r51R14oR15R16R17i767R18i754gR19r52gar128hR14oR15R16R17i769R18i754gR19r74gR14oR15R16R17i769R18i700gR19r64gR14oR15R16R17i769R18i546gR19jR11:5:2i3r11gR14oR15R16R17i769R18i519gR19r12goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y17:transformedNormalR10jR11:5:2i3r11R13i-66gR14oR15R16R17i792R18i775gR19r154goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:31:0R14oR15R16R17i804R18i795gR19jR11:13:1aoR1aoR8y5:valueR10r64ghy3:retr64ghgaoR3jR4:5:3r16oR3jR4:5:3r16oR3jR4:5:3r19oR3jR4:3:1oR3jR4:5:3r19oR3jR4:1:1r49R14oR15R16R17i824R18i812gR19r50goR3jR4:8:2oR3jR4:2:1jR34:48:0R14oR15R16R17i831R18i827gR19jR11:13:1ahgaoR3jR4:16:2oR3jR4:1:1r29R14oR15R16R17i845R18i832gR19r37goR3jR4:9:2oR3jR4:1:1r42R14oR15R16R17i859R18i846gR19r44gar57hR14oR15R16R17i861R18i846gR19r33gR14oR15R16R17i862R18i832gR19r31ghR14oR15R16R17i863R18i827gR19jR11:6:0gR14oR15R16R17i863R18i812gR19r64gR14oR15R16R17i864R18i811gR19r64goR3jR4:9:2oR3jR4:1:1r51R14oR15R16R17i880R18i867gR19r52gar57hR14oR15R16R17i882R18i867gR19r74gR14oR15R16R17i882R18i811gR19r64goR3jR4:5:3r19oR3jR4:3:1oR3jR4:5:3r19oR3jR4:1:1r49R14oR15R16R17i903R18i891gR19r50goR3jR4:8:2oR3jR4:2:1r178R14oR15R16R17i910R18i906gR19r182gaoR3jR4:16:2oR3jR4:1:1r29R14oR15R16R17i924R18i911gR19r37goR3jR4:9:2oR3jR4:1:1r42R14oR15R16R17i938R18i925gR19r44gar92hR14oR15R16R17i940R18i925gR19r33gR14oR15R16R17i941R18i911gR19r31ghR14oR15R16R17i942R18i906gR19r199gR14oR15R16R17i942R18i891gR19r64gR14oR15R16R17i943R18i890gR19r64goR3jR4:9:2oR3jR4:1:1r51R14oR15R16R17i959R18i946gR19r52gar92hR14oR15R16R17i961R18i946gR19r74gR14oR15R16R17i961R18i890gR19r64gR14oR15R16R17i961R18i811gR19jR11:5:2i3r11goR3jR4:5:3r19oR3jR4:3:1oR3jR4:5:3r19oR3jR4:1:1r49R14oR15R16R17i982R18i970gR19r50goR3jR4:8:2oR3jR4:2:1r178R14oR15R16R17i989R18i985gR19r182gaoR3jR4:16:2oR3jR4:1:1r29R14oR15R16R17i1003R18i990gR19r37goR3jR4:9:2oR3jR4:1:1r42R14oR15R16R17i1017R18i1004gR19r44gar128hR14oR15R16R17i1019R18i1004gR19r33gR14oR15R16R17i1020R18i990gR19r31ghR14oR15R16R17i1021R18i985gR19r199gR14oR15R16R17i1021R18i970gR19r64gR14oR15R16R17i1022R18i969gR19r64goR3jR4:9:2oR3jR4:1:1r51R14oR15R16R17i1038R18i1025gR19r52gar128hR14oR15R16R17i1040R18i1025gR19r74gR14oR15R16R17i1040R18i969gR19r64gR14oR15R16R17i1040R18i811gR19jR11:5:2i3r11ghR14oR15R16R17i1041R18i795gR19r64gR14oR15R16R17i1041R18i775gR19r154ghR14oR15R16R17i1056R18i420gR19jR11:0:0gR6jy17:hxsl.FunctionKind:0:0y3:refoR6jR7:6:0R8y6:vertexR10jR11:13:1aoR1ahR36r303ghR13i-69gR36r303ghR8y15:h3d.shader.Skiny4:varsar305r153r29r23r45r9r32hg";
h3d_shader_SpecularTexture.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:20:1jR5:1:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey9:specColory4:typejy9:hxsl.Type:5:2i3jy12:hxsl.VecType:1:0y2:idi-3gy1:poy4:filey72:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FSpecularTexture.hxy3:maxi218y3:mini209gy1:tr13goR3jR4:9:2oR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:33:0R14oR15R16R17i229R18i222gR19jR11:13:1aoR1aoR8y1:_R10jR11:10:0goR8y1:bR10jR11:5:2i2r12ghy3:retjR11:5:2i4r12ghgaoR3jR4:1:1oR6jR7:2:0R8y7:textureR10r26R13i-1gR14oR15R16R17i229R18i222gR19r26goR3jR4:1:1oR6r11R8y12:calculatedUVR10jR11:5:2i2r12R13i-2gR14oR15R16R17i246R18i234gR19r39ghR14oR15R16R17i247R18i222gR19r29gajy14:hxsl.Component:0:0jR26:1:0jR26:2:0hR14oR15R16R17i251R18i222gR19jR11:5:2i3r12gR14oR15R16R17i251R18i209gR19r13ghR14oR15R16R17i257R18i203gR19jR11:0:0gR6jy17:hxsl.FunctionKind:1:0y3:refoR6jR7:6:0R8y8:fragmentR10jR11:13:1aoR1ahR23r55ghR13i-4gR23r55ghR8y26:h3d.shader.SpecularTexturey4:varsar38r10r57r33hg";
h3d_shader_Texture.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey12:calculatedUVy4:typejy9:hxsl.Type:5:2i2jy12:hxsl.VecType:1:0y2:idi-12gy1:poy4:filey64:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FTexture.hxy3:maxi443y3:mini431gy1:tr12goR3jR4:1:1oR6jR7:1:0R8y2:uvR10jR11:5:2i2r11y6:parentoR6r17R8y5:inputR10jR11:12:1ar16hR13i-5gR13i-6gR14oR15R16R17i454R18i446gR19r18gR14oR15R16R17i454R18i431gR19r12ghR14oR15R16R17i460R18i425gR19jR11:0:0gR6jy17:hxsl.FunctionKind:0:0y3:refoR6jR7:6:0R8y6:vertexR10jR11:13:1aoR1ahy3:retr28ghR13i-15gR26r28goR1ahR2oR3jR4:4:1aoR3jR4:7:2oR6r10R8y1:cR10jR11:5:2i4r11R13i-17goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:33:0R14oR15R16R17i507R18i500gR19jR11:13:1aoR1aoR8y1:_R10jR11:10:0goR8y1:bR10jR11:5:2i2r11ghR26r42ghgaoR3jR4:1:1oR6jR7:2:0R8y7:textureR10r52R13i-11gR14oR15R16R17i507R18i500gR19r52goR3jR4:1:1r9R14oR15R16R17i524R18i512gR19r12ghR14oR15R16R17i525R18i500gR19r42gR14oR15R16R17i526R18i492gR19r28goR3jR4:10:3oR3jR4:5:3jR5:14:0oR3jR4:1:1oR6r59R8y9:killAlphaR10jR11:2:0y10:qualifiersajy17:hxsl.VarQualifier:0:1nhR13i-8gR14oR15R16R17i544R18i535gR19r74goR3jR4:5:3jR5:9:0oR3jR4:5:3jR5:3:0oR3jR4:9:2oR3jR4:1:1r41R14oR15R16R17i549R18i548gR19r42gajy14:hxsl.Component:3:0hR14oR15R16R17i551R18i548gR19jR11:3:0goR3jR4:1:1oR6r59R8y18:killAlphaThresholdR10r91R33ajR34:7:2d0d1hR13i-10gR14oR15R16R17i572R18i554gR19r91gR14oR15R16R17i572R18i548gR19r91goR3jR4:0:1jy10:hxsl.Const:3:1zR14oR15R16R17i576R18i575gR19r91gR14oR15R16R17i576R18i548gR19r74gR14oR15R16R17i576R18i535gR19r74goR3jR4:11:0R14oR15R16R17i586R18i579gR19r28gnR14oR15R16R17i586R18i531gR19r28goR3jR4:10:3oR3jR4:1:1oR6r59R8y8:additiveR10r74R33ajR34:0:1nhR13i-7gR14oR15R16R17i604R18i596gR19r74goR3jR4:5:3jR5:20:1jR5:0:0oR3jR4:1:1oR6r10R8y10:pixelColorR10jR11:5:2i4r11R13i-13gR14oR15R16R17i622R18i612gR19r125goR3jR4:1:1r41R14oR15R16R17i627R18i626gR19r42gR14oR15R16R17i627R18i612gR19r125goR3jR4:5:3jR5:20:1jR5:1:0oR3jR4:1:1r124R14oR15R16R17i653R18i643gR19r125goR3jR4:1:1r41R14oR15R16R17i658R18i657gR19r42gR14oR15R16R17i658R18i643gR19r125gR14oR15R16R17i658R18i592gR19r28goR3jR4:10:3oR3jR4:1:1oR6r59R8y13:specularAlphaR10r74R33ajR34:0:1nhR13i-9gR14oR15R16R17i681R18i668gR19r74goR3jR4:5:3jR5:20:1r134oR3jR4:1:1oR6r10R8y9:specColorR10jR11:5:2i3r11R13i-14gR14oR15R16R17i698R18i689gR19r157goR3jR4:9:2oR3jR4:1:1r41R14oR15R16R17i703R18i702gR19r42gar88r88r88hR14oR15R16R17i707R18i702gR19jR11:5:2i3r11gR14oR15R16R17i707R18i689gR19r157gnR14oR15R16R17i707R18i664gR19r28ghR14oR15R16R17i713R18i486gR19r28gR6jR23:1:0R24oR6r31R8y8:fragmentR10jR11:13:1aoR1ahR26r28ghR13i-16gR26r28ghR8y18:h3d.shader.Texturey4:varsar9r30r156r175r115r58r148r93r19r73r124hg";
h3d_shader_Texture2.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey13:calculatedUV2y4:typejy9:hxsl.Type:5:2i2jy12:hxsl.VecType:1:0y2:idi-649gy1:poy4:filey65:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FTexture2.hxy3:maxi448y3:mini435gy1:tr12goR3jR4:1:1oR6jR7:1:0R8y3:uv2R10jR11:5:2i2r11y6:parentoR6r17R8y5:inputR10jR11:12:1ar16hR13i-643gR13i-644gR14oR15R16R17i460R18i451gR19r18gR14oR15R16R17i460R18i435gR19r12ghR14oR15R16R17i466R18i429gR19jR11:0:0gR6jy17:hxsl.FunctionKind:0:0y3:refoR6jR7:6:0R8y6:vertexR10jR11:13:1aoR1ahy3:retr28ghR13i-651gR26r28goR1ahR2oR3jR4:4:1aoR3jR4:7:2oR6r10R8y1:cR10jR11:5:2i4r11R13i-653goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:33:0R14oR15R16R17i513R18i506gR19jR11:13:1aoR1aoR8y1:_R10jR11:10:0goR8y1:bR10jR11:5:2i2r11ghR26r42ghgaoR3jR4:1:1oR6jR7:2:0R8y7:textureR10r52R13i-648gR14oR15R16R17i513R18i506gR19r52goR3jR4:1:1r9R14oR15R16R17i531R18i518gR19r12ghR14oR15R16R17i532R18i506gR19r42gR14oR15R16R17i533R18i498gR19r28goR3jR4:10:3oR3jR4:5:3jR5:14:0oR3jR4:1:1oR6r59R8y9:killAlphaR10jR11:2:0y10:qualifiersajy17:hxsl.VarQualifier:0:1nhR13i-646gR14oR15R16R17i551R18i542gR19r74goR3jR4:5:3jR5:9:0oR3jR4:5:3jR5:3:0oR3jR4:9:2oR3jR4:1:1r41R14oR15R16R17i556R18i555gR19r42gajy14:hxsl.Component:3:0hR14oR15R16R17i558R18i555gR19jR11:3:0goR3jR4:1:1oR6r59R8y18:killAlphaThresholdR10r91R13i-647gR14oR15R16R17i579R18i561gR19r91gR14oR15R16R17i579R18i555gR19r91goR3jR4:0:1jy10:hxsl.Const:3:1zR14oR15R16R17i583R18i582gR19r91gR14oR15R16R17i583R18i555gR19r74gR14oR15R16R17i583R18i542gR19r74goR3jR4:11:0R14oR15R16R17i593R18i586gR19r28gnR14oR15R16R17i593R18i538gR19r28goR3jR4:10:3oR3jR4:1:1oR6r59R8y8:additiveR10r74R33ajR34:0:1nhR13i-645gR14oR15R16R17i611R18i603gR19r74goR3jR4:5:3jR5:20:1jR5:0:0oR3jR4:1:1oR6r10R8y10:pixelColorR10jR11:5:2i4r11R13i-650gR14oR15R16R17i629R18i619gR19r123goR3jR4:1:1r41R14oR15R16R17i634R18i633gR19r42gR14oR15R16R17i634R18i619gR19r123goR3jR4:5:3jR5:20:1jR5:1:0oR3jR4:1:1r122R14oR15R16R17i660R18i650gR19r123goR3jR4:1:1r41R14oR15R16R17i665R18i664gR19r42gR14oR15R16R17i665R18i650gR19r123gR14oR15R16R17i665R18i599gR19r28ghR14oR15R16R17i671R18i492gR19r28gR6jR23:1:0R24oR6r31R8y8:fragmentR10jR11:13:1aoR1ahR26r28ghR13i-652gR26r28ghR8y19:h3d.shader.Texture2y4:varsar30r9r147r113r58r93r19r73r122hg";
h3d_shader_UVAnim.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:7:2oy4:kindjy12:hxsl.VarKind:4:0y4:namey5:framey4:typejy9:hxsl.Type:3:0y2:idi-527goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:36:0y1:poy4:filey63:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FUVAnim.hxy3:maxi374y3:mini369gy1:tjR10:13:1aoR1aoR7y5:valueR9jR10:1:0ghy3:retr9ghgaoR3jR4:8:2oR3jR4:2:1jR12:35:0R13oR14R15R16i378R17i375gR18jR10:13:1aoR1aoR7R19R9r9ghR20r19ghgaoR3jR4:5:3jy16:haxe.macro.Binop:1:0oR3jR4:3:1oR3jR4:5:3jR21:3:0oR3jR4:1:1oR5jR6:0:0R7y4:timeR9r9y6:parentoR5r40R7y6:globalR9jR10:12:1ar39hR11i-519gR11i-520gR13oR14R15R16i391R17i380gR18r9goR3jR4:1:1oR5jR6:2:0R7y9:startTimeR9r9R11i-524gR13oR14R15R16i403R17i394gR18r9gR13oR14R15R16i403R17i380gR18r9gR13oR14R15R16i404R17i379gR18r9goR3jR4:1:1oR5r48R7y5:speedR9r9R11i-521gR13oR14R15R16i412R17i407gR18r9gR13oR14R15R16i412R17i379gR18r9ghR13oR14R15R16i413R17i375gR18r19ghR13oR14R15R16i414R17i369gR18r9gR13oR14R15R16i415R17i357gR18jR10:0:0goR3jR4:10:3oR3jR4:1:1oR5r48R7y4:loopR9jR10:2:0y10:qualifiersajy17:hxsl.VarQualifier:0:1nhR11i-525gR13oR14R15R16i428R17i424gR18r71goR3jR4:5:3jR21:20:1jR21:19:0oR3jR4:1:1r7R13oR14R15R16i436R17i431gR18r9goR3jR4:1:1oR5r48R7y11:totalFramesR9r9R11i-523gR13oR14R15R16i451R17i440gR18r9gR13oR14R15R16i451R17i431gR18r9goR3jR4:5:3jR21:4:0oR3jR4:1:1r7R13oR14R15R16i462R17i457gR18r9goR3jR4:8:2oR3jR4:2:1jR12:21:0R13oR14R15R16i468R17i465gR18jR10:13:1aoR1aoR7y1:aR9r9goR7y1:bR9r9ghR20r9ghgaoR3jR4:1:1r7R13oR14R15R16i474R17i469gR18r9goR3jR4:5:3r37oR3jR4:1:1r83R13oR14R15R16i487R17i476gR18r9goR3jR4:0:1jy10:hxsl.Const:3:1i1R13oR14R15R16i491R17i490gR18r9gR13oR14R15R16i491R17i476gR18r9ghR13oR14R15R16i492R17i465gR18r9gR13oR14R15R16i492R17i457gR18r9gR13oR14R15R16i492R17i420gR18r67goR3jR4:7:2oR5r8R7y5:deltaR9jR10:5:2i2jy12:hxsl.VecType:1:0R11i-528goR3jR4:5:3r34oR3jR4:8:2oR3jR4:2:1jR12:38:0R13oR14R15R16i514R17i510gR18jR10:13:1ahgaoR3jR4:5:3jR21:2:0oR3jR4:0:1jR33:3:1d1R13oR14R15R16i517R17i515gR18r9goR3jR4:1:1oR5r48R7y13:frameDivisionR9r9R11i-522gR13oR14R15R16i533R17i520gR18r9gR13oR14R15R16i533R17i515gR18r9goR3jR4:5:3r138oR3jR4:0:1jR33:3:1d1R13oR14R15R16i537R17i535gR18r9goR3jR4:1:1r144R13oR14R15R16i553R17i540gR18r9gR13oR14R15R16i553R17i535gR18r9ghR13oR14R15R16i554R17i510gR18jR10:5:2i2r126goR3jR4:8:2oR3jR4:2:1r131R13oR14R15R16i561R17i557gR18r135gaoR3jR4:5:3r77oR3jR4:1:1r7R13oR14R15R16i568R17i563gR18r9goR3jR4:1:1r144R13oR14R15R16i584R17i571gR18r9gR13oR14R15R16i584R17i563gR18r9goR3jR4:8:2oR3jR4:2:1r12R13oR14R15R16i591R17i586gR18jR10:13:1ar16hgaoR3jR4:8:2oR3jR4:2:1r24R13oR14R15R16i595R17i592gR18jR10:13:1ar28hgaoR3jR4:5:3r138oR3jR4:1:1r7R13oR14R15R16i601R17i596gR18r9goR3jR4:1:1r144R13oR14R15R16i617R17i604gR18r9gR13oR14R15R16i617R17i596gR18r9ghR13oR14R15R16i618R17i592gR18r19ghR13oR14R15R16i619R17i586gR18r9ghR13oR14R15R16i621R17i557gR18jR10:5:2i2r126gR13oR14R15R16i621R17i510gR18r127gR13oR14R15R16i622R17i498gR18r67goR3jR4:5:3jR21:20:1jR21:0:0oR3jR4:1:1oR5r8R7y12:calculatedUVR9jR10:5:2i2r126R11i-518gR13oR14R15R16i639R17i627gR18r215goR3jR4:1:1r125R13oR14R15R16i648R17i643gR18r127gR13oR14R15R16i648R17i627gR18r215ghR13oR14R15R16i654R17i351gR18r67gR5jy17:hxsl.FunctionKind:0:0y3:refoR5jR6:6:0R7y6:vertexR9jR10:13:1aoR1ahR20r67ghR11i-526gR20r67ghR7y17:h3d.shader.UVAnimy4:varsar214r47r226r70r144r83r41r56hg";
h3d_shader_UVDelta.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:20:1jR5:0:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey12:calculatedUVy4:typejy9:hxsl.Type:5:2i2jy12:hxsl.VecType:1:0y2:idi-530gy1:poy4:filey64:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FUVDelta.hxy3:maxi179y3:mini167gy1:tr13goR3jR4:1:1oR6jR7:2:0R8y7:uvDeltaR10jR11:5:2i2r12R13i-529gR14oR15R16R17i190R18i183gR19r19gR14oR15R16R17i190R18i167gR19r13ghR14oR15R16R17i196R18i161gR19jR11:0:0gR6jy17:hxsl.FunctionKind:0:0y3:refoR6jR7:6:0R8y6:vertexR10jR11:13:1aoR1ahy3:retr26ghR13i-531gR24r26ghR8y18:h3d.shader.UVDeltay4:varsar10r28r17hg";
h3d_shader_UVScroll.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:20:1jR5:0:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey12:calculatedUVy4:typejy9:hxsl.Type:5:2i2jy12:hxsl.VecType:1:0y2:idi-572gy1:poy4:filey65:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FUVScroll.hxy3:maxi234y3:mini222gy1:tr13goR3jR4:5:3jR5:1:0oR3jR4:1:1oR6jR7:2:0R8y7:uvSpeedR10jR11:5:2i2r12R13i-571gR14oR15R16R17i245R18i238gR19r21goR3jR4:1:1oR6jR7:0:0R8y4:timeR10jR11:3:0y6:parentoR6r26R8y6:globalR10jR11:12:1ar25hR13i-569gR13i-570gR14oR15R16R17i259R18i248gR19r27gR14oR15R16R17i259R18i238gR19r21gR14oR15R16R17i259R18i222gR19r13ghR14oR15R16R17i265R18i216gR19jR11:0:0gR6jy17:hxsl.FunctionKind:0:0y3:refoR6jR7:6:0R8y6:vertexR10jR11:13:1aoR1ahy3:retr39ghR13i-573gR27r39ghR8y19:h3d.shader.UVScrolly4:varsar10r41r19r28hg";
h3d_shader_VertexColor.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:10:3oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:2:0y4:namey8:additivey4:typejy9:hxsl.Type:2:0y10:qualifiersajy17:hxsl.VarQualifier:0:1nhy2:idi-567gy1:poy4:filey68:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FVertexColor.hxy3:maxi240y3:mini232gy1:tr10goR3jR4:5:3jy16:haxe.macro.Binop:20:1jR20:0:0oR3jR4:9:2oR3jR4:1:1oR5jR6:4:0R7y10:pixelColorR9jR10:5:2i4jy12:hxsl.VecType:1:0R13i-566gR14oR15R16R17i258R18i248gR19r23gajy14:hxsl.Component:0:0jR23:1:0jR23:2:0hR14oR15R16R17i262R18i248gR19jR10:5:2i3r22goR3jR4:1:1oR5jR6:1:0R7y5:colorR9jR10:5:2i3r22y6:parentoR5r35R7y5:inputR9jR10:12:1ar34hR13i-564gR13i-565gR14oR15R16R17i277R18i266gR19r36gR14oR15R16R17i277R18i248gR19r32goR3jR4:5:3jR20:20:1jR20:1:0oR3jR4:9:2oR3jR4:1:1r20R14oR15R16R17i303R18i293gR19r23gar27r28r29hR14oR15R16R17i307R18i293gR19jR10:5:2i3r22goR3jR4:1:1r34R14oR15R16R17i322R18i311gR19r36gR14oR15R16R17i322R18i293gR19r54gR14oR15R16R17i322R18i228gR19jR10:0:0ghR14oR15R16R17i328R18i222gR19r62gR5jy17:hxsl.FunctionKind:1:0y3:refoR5jR6:6:0R7y8:fragmentR9jR10:13:1aoR1ahy3:retr62ghR13i-568gR30r62ghR7y22:h3d.shader.VertexColory4:varsar66r8r37r20hg";
h3d_shader_VertexColorAlpha.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:10:3oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:2:0y4:namey8:additivey4:typejy9:hxsl.Type:2:0y10:qualifiersajy17:hxsl.VarQualifier:0:1nhy2:idi-391gy1:poy4:filey73:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FVertexColorAlpha.hxy3:maxi245y3:mini237gy1:tr10goR3jR4:5:3jy16:haxe.macro.Binop:20:1jR20:0:0oR3jR4:1:1oR5jR6:4:0R7y10:pixelColorR9jR10:5:2i4jy12:hxsl.VecType:1:0R13i-390gR14oR15R16R17i263R18i253gR19r22goR3jR4:1:1oR5jR6:1:0R7y5:colorR9jR10:5:2i4r21y6:parentoR5r27R7y5:inputR9jR10:12:1ar26hR13i-388gR13i-389gR14oR15R16R17i278R18i267gR19r28gR14oR15R16R17i278R18i253gR19r22goR3jR4:5:3jR20:20:1jR20:1:0oR3jR4:1:1r19R14oR15R16R17i304R18i294gR19r22goR3jR4:1:1r26R14oR15R16R17i319R18i308gR19r28gR14oR15R16R17i319R18i294gR19r22gR14oR15R16R17i319R18i233gR19jR10:0:0ghR14oR15R16R17i325R18i227gR19r49gR5jy17:hxsl.FunctionKind:1:0y3:refoR5jR6:6:0R7y8:fragmentR9jR10:13:1aoR1ahy3:retr49ghR13i-392gR29r49ghR7y27:h3d.shader.VertexColorAlphay4:varsar53r8r29r19hg";
h3d_shader_VolumeDecal.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey17:transformedNormaly4:typejy9:hxsl.Type:5:2i3jy12:hxsl.VecType:1:0y2:idi-620gy1:poy4:filey68:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FVolumeDecal.hxy3:maxi282y3:mini265gy1:tr12goR3jR4:1:1oR6jR7:2:0R8y6:normalR10jR11:5:2i3r11R13i-633gR14oR15R16R17i291R18i285gR19r18gR14oR15R16R17i291R18i265gR19r12ghR14oR15R16R17i297R18i259gR19jR11:0:0gR6jy17:hxsl.FunctionKind:0:0y3:refoR6jR7:6:0R8y6:vertexR10jR11:13:1aoR1ahy3:retr25ghR13i-635gR24r25goR1ahR2oR3jR4:4:1aoR3jR4:7:2oR6r10R8y6:matrixR10jR11:7:0R13i-637goR3jR4:5:3jR5:1:0oR3jR4:1:1oR6jR7:0:0R8y15:inverseViewProjR10r39y6:parentoR6r44R8y6:cameraR10jR11:12:1aoR6r44R8y4:viewR10r39R27r45R13i-595goR6r44R8y4:projR10r39R27r45R13i-596goR6r44R8y8:positionR10jR11:5:2i3r11R27r45R13i-597goR6r44R8y8:projDiagR10jR11:5:2i3r11R27r45R13i-598goR6r44R8y8:viewProjR10r39R27r45R13i-599gr43oR6r44R8y5:zNearR10jR11:3:0R27r45R13i-601goR6r44R8y4:zFarR10r55R27r45R13i-602goR6jR7:3:0R8y3:dirR10jR11:5:2i3r11R27r45R13i-603ghR13i-594gR13i-600gR14oR15R16R17i364R18i342gR19r39goR3jR4:1:1oR6r44R8y16:modelViewInverseR10r39R27oR6r44R8y6:globalR10jR11:12:1aoR6r44R8y4:timeR10r55R27r65R13i-605goR6r44R8y9:pixelSizeR10jR11:5:2i2r11R27r65R13i-606goR6r44R8y9:modelViewR10r39R27r65y10:qualifiersajy17:hxsl.VarQualifier:3:0hR13i-607gr64hR13i-604gR42ar72hR13i-608gR14oR15R16R17i390R18i367gR19r39gR14oR15R16R17i390R18i342gR19r39gR14oR15R16R17i391R18i329gR19r25goR3jR4:7:2oR6r10R8y9:screenPosR10jR11:5:2i2r11R13i-638goR3jR4:5:3jR5:2:0oR3jR4:9:2oR3jR4:1:1oR6r10R8y17:projectedPositionR10jR11:5:2i4r11R13i-621gR14oR15R16R17i429R18i412gR19r89gajy14:hxsl.Component:0:0jR46:1:0hR14oR15R16R17i432R18i412gR19r83goR3jR4:9:2oR3jR4:1:1r88R14oR15R16R17i452R18i435gR19r89gajR46:3:0hR14oR15R16R17i454R18i435gR19r55gR14oR15R16R17i454R18i412gR19r83gR14oR15R16R17i455R18i396gR19r25goR3jR4:7:2oR6r10R8y3:tuvR10jR11:5:2i2r11R13i-639goR3jR4:5:3jR5:0:0oR3jR4:5:3r41oR3jR4:1:1r82R14oR15R16R17i479R18i470gR19r83goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:38:0R14oR15R16R17i486R18i482gR19jR11:13:1ahgaoR3jR4:0:1jy10:hxsl.Const:3:1d0.5R14oR15R16R17i490R18i487gR19r55goR3jR4:0:1jR49:3:1d-0.5R14oR15R16R17i496R18i492gR19r55ghR14oR15R16R17i497R18i482gR19jR11:5:2i2r11gR14oR15R16R17i497R18i470gR19jR11:5:2i2r11goR3jR4:8:2oR3jR4:2:1r120R14oR15R16R17i504R18i500gR19r124gaoR3jR4:0:1jR49:3:1d0.5R14oR15R16R17i508R18i505gR19r55goR3jR4:0:1jR49:3:1d0.5R14oR15R16R17i513R18i510gR19r55ghR14oR15R16R17i514R18i500gR19jR11:5:2i2r11gR14oR15R16R17i514R18i470gR19r111gR14oR15R16R17i515R18i460gR19r25goR3jR4:7:2oR6r10R8y3:ruvR10jR11:5:2i4r11R13i-640goR3jR4:8:2oR3jR4:2:1jR48:40:0R14oR15R16R17i534R18i530gR19jR11:13:1ahgaoR3jR4:1:1r82R14oR15R16R17i550R18i541gR19r83goR3jR4:8:2oR3jR4:2:1jR48:53:0R14oR15R16R17i563R18i557gR19jR11:13:1aoR1aoR8y5:valueR10jR11:5:2i4r11ghR24r55ghgaoR3jR4:8:2oR3jR4:2:1jR48:33:0R14oR15R16R17i572R18i564gR19jR11:13:1aoR1aoR8y1:_R10jR11:10:0goR8y1:bR10jR11:5:2i2r11ghR24jR11:5:2i4r11ghgaoR3jR4:1:1oR6r44R8y8:depthMapR10r195R13i-631gR14oR15R16R17i572R18i564gR19r195goR3jR4:1:1r110R14oR15R16R17i580R18i577gR19r111ghR14oR15R16R17i581R18i564gR19r198ghR14oR15R16R17i582R18i557gR19r55goR3jR4:0:1jR49:3:1i1R14oR15R16R17i590R18i589gR19r55ghR14oR15R16R17i596R18i530gR19r162gR14oR15R16R17i597R18i520gR19r25goR3jR4:7:2oR6r10R8y4:wposR10r198R13i-641goR3jR4:5:3r41oR3jR4:1:1r161R14oR15R16R17i616R18i613gR19r162goR3jR4:1:1r38R14oR15R16R17i625R18i619gR19r39gR14oR15R16R17i625R18i613gR19r198gR14oR15R16R17i626R18i602gR19r25goR3jR4:7:2oR6r10R8y4:pposR10r198R13i-642goR3jR4:5:3r41oR3jR4:1:1r161R14oR15R16R17i645R18i642gR19r162goR3jR4:1:1r43R14oR15R16R17i670R18i648gR19r39gR14oR15R16R17i670R18i642gR19r198gR14oR15R16R17i671R18i631gR19r25goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y24:pixelTransformedPositionR10jR11:5:2i3r11R13i-619gR14oR15R16R17i700R18i676gR19r249goR3jR4:5:3r85oR3jR4:9:2oR3jR4:1:1r234R14oR15R16R17i707R18i703gR19r198gar93r94jR46:2:0hR14oR15R16R17i711R18i703gR19jR11:5:2i3r11goR3jR4:9:2oR3jR4:1:1r234R14oR15R16R17i718R18i714gR19r198gar102hR14oR15R16R17i720R18i714gR19r55gR14oR15R16R17i720R18i703gR19r261gR14oR15R16R17i720R18i676gR19r249goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y12:calculatedUVR10jR11:5:2i2r11R13i-634gR14oR15R16R17i738R18i726gR19r276goR3jR4:5:3r113oR3jR4:5:3r41oR3jR4:1:1oR6r17R8y5:scaleR10jR11:5:2i2r11R13i-632gR14oR15R16R17i746R18i741gR19r283goR3jR4:3:1oR3jR4:5:3r85oR3jR4:9:2oR3jR4:1:1r221R14oR15R16R17i754R18i750gR19r198gar93r94hR14oR15R16R17i757R18i750gR19jR11:5:2i2r11goR3jR4:9:2oR3jR4:1:1r221R14oR15R16R17i764R18i760gR19r198gar102hR14oR15R16R17i766R18i760gR19r55gR14oR15R16R17i766R18i750gR19r295gR14oR15R16R17i767R18i749gR19r295gR14oR15R16R17i767R18i741gR19jR11:5:2i2r11goR3jR4:0:1jR49:3:1d0.5R14oR15R16R17i773R18i770gR19r55gR14oR15R16R17i773R18i741gR19r309gR14oR15R16R17i773R18i726gR19r276goR3jR4:10:3oR3jR4:5:3jR5:9:0oR3jR4:8:2oR3jR4:2:1jR48:21:0R14oR15R16R17i786R18i783gR19jR11:13:1aoR1aoR8y1:aR10r55goR8R53R10r55ghR24r55ghgaoR3jR4:8:2oR3jR4:2:1r323R14oR15R16R17i790R18i787gR19jR11:13:1ar327hgaoR3jR4:9:2oR3jR4:1:1r275R14oR15R16R17i803R18i791gR19r276gar93hR14oR15R16R17i805R18i791gR19r55goR3jR4:9:2oR3jR4:1:1r275R14oR15R16R17i819R18i807gR19r276gar94hR14oR15R16R17i821R18i807gR19r55ghR14oR15R16R17i822R18i787gR19r55goR3jR4:8:2oR3jR4:2:1r323R14oR15R16R17i827R18i824gR19jR11:13:1ar327hgaoR3jR4:5:3jR5:3:0oR3jR4:0:1jR49:3:1i1R14oR15R16R17i829R18i828gR19r55goR3jR4:9:2oR3jR4:1:1r275R14oR15R16R17i844R18i832gR19r276gar93hR14oR15R16R17i846R18i832gR19r55gR14oR15R16R17i846R18i828gR19r55goR3jR4:5:3r364oR3jR4:0:1jR49:3:1i1R14oR15R16R17i849R18i848gR19r55goR3jR4:9:2oR3jR4:1:1r275R14oR15R16R17i864R18i852gR19r276gar94hR14oR15R16R17i866R18i852gR19r55gR14oR15R16R17i866R18i848gR19r55ghR14oR15R16R17i867R18i824gR19r55ghR14oR15R16R17i868R18i783gR19r55goR3jR4:0:1jR49:3:1zR14oR15R16R17i872R18i871gR19r55gR14oR15R16R17i872R18i783gR19jR11:2:0goR3jR4:11:0R14oR15R16R17i882R18i875gR19r25gnR14oR15R16R17i882R18i779gR19r25ghR14oR15R16R17i888R18i323gR19r25gR6jR21:1:0R22oR6r28R8y8:fragmentR10jR11:13:1aoR1ahR24r25ghR13i-636gR24r25ghR8y22:h3d.shader.VolumeDecaly4:varsar88oR6r10R8y5:depthR10r55R13i-623gr275r27r9r282oR6r10R8y9:specColorR10jR11:5:2i3r11R13i-626gr16r411r202oR6r10R8y16:relativePositionR10jR11:5:2i3r11R13i-617gr45oR6jR7:5:0R8y6:outputR10jR11:12:1aoR6r423R8R31R10jR11:5:2i4r11R27r422R13i-613goR6r423R8y5:colorR10jR11:5:2i4r11R27r422R13i-614goR6r423R8R64R10jR11:5:2i4r11R27r422R13i-615goR6r423R8R20R10jR11:5:2i4r11R27r422R13i-616ghR13i-612goR6r10R8y8:screenUVR10jR11:5:2i2r11R13i-624gr65oR6jR7:1:0R8y5:inputR10jR11:12:1aoR6r437R8R31R10jR11:5:2i3r11R27r436R13i-610goR6r437R8R20R10jR11:5:2i3r11R27r436R13i-611ghR13i-609goR6r10R8y19:transformedPositionR10jR11:5:2i3r11R13i-618goR6r10R8y9:specPowerR10r55R13i-625gr248oR6r10R8y10:pixelColorR10jR11:5:2i4r11R13i-622ghg";
h3d_shader_WhiteAlpha.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:9:2oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey12:textureColory4:typejy9:hxsl.Type:5:2i4jy12:hxsl.VecType:1:0y2:idi-436gy1:poy4:filey67:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FWhiteAlpha.hxy3:maxi149y3:mini137gy1:tr13gajy14:hxsl.Component:0:0jR20:1:0jR20:2:0hR14oR15R16R17i153R18i137gR19jR11:5:2i3r12goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:39:0R14oR15R16R17i160R18i156gR19jR11:13:1ahgaoR3jR4:0:1jy10:hxsl.Const:3:1d1R14oR15R16R17i164R18i161gR19jR11:3:0ghR14oR15R16R17i165R18i156gR19jR11:5:2i3r12gR14oR15R16R17i165R18i137gR19r22ghR14oR15R16R17i170R18i132gR19jR11:0:0gR6jy17:hxsl.FunctionKind:1:0y3:refoR6jR7:6:0R8y8:fragmentR10jR11:13:1aoR1ahy3:retr43ghR13i-437gR26r43ghR8y21:h3d.shader.WhiteAlphay4:varsar45r10hg";
h3d_shader_ZCut.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:7:2oy4:kindjy12:hxsl.VarKind:4:0y4:namey1:zy4:typejy9:hxsl.Type:3:0y2:idi-478goR3jR4:5:3jy16:haxe.macro.Binop:2:0oR3jR4:9:2oR3jR4:1:1oR5r8R7y17:projectedPositionR9jR10:5:2i4jy12:hxsl.VecType:1:0R11i-465gy1:poy4:filey61:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FZCut.hxy3:maxi224y3:mini207gy1:tr16gajy14:hxsl.Component:2:0hR15oR16R17R18i226R19i207gR20r9goR3jR4:9:2oR3jR4:1:1r14R15oR16R17R18i246R19i229gR20r16gajR21:3:0hR15oR16R17R18i248R19i229gR20r9gR15oR16R17R18i248R19i207gR20r9gR15oR16R17R18i249R19i199gR20jR10:0:0goR3jR4:5:3jR12:20:1jR12:3:0oR3jR4:1:1r7R15oR16R17R18i255R19i254gR20r9goR3jR4:5:3jR12:1:0oR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:21:0R15oR16R17R18i262R19i259gR20jR10:13:1aoR1aoR7y1:aR9r9goR7y1:bR9r9ghy3:retr9ghgaoR3jR4:5:3r37oR3jR4:1:1r7R15oR16R17R18i264R19i263gR20r9goR3jR4:1:1oR5jR6:2:0R7y4:zMinR9r9R11i-475gR15oR16R17R18i271R19i267gR20r9gR15oR16R17R18i271R19i263gR20r9goR3jR4:0:1jy10:hxsl.Const:3:1d0R15oR16R17R18i275R19i273gR20r9ghR15oR16R17R18i276R19i259gR20r9goR3jR4:0:1jR27:3:1d100000000R15oR16R17R18i282R19i279gR20r9gR15oR16R17R18i282R19i259gR20r9gR15oR16R17R18i282R19i254gR20r9goR3jR4:5:3jR12:20:1jR12:0:0oR3jR4:1:1r7R15oR16R17R18i289R19i288gR20r9goR3jR4:5:3r43oR3jR4:8:2oR3jR4:2:1r46R15oR16R17R18i296R19i293gR20jR10:13:1ar50hgaoR3jR4:5:3r37oR3jR4:1:1oR5r62R7y4:zMaxR9r9R11i-476gR15oR16R17R18i301R19i297gR20r9goR3jR4:1:1r7R15oR16R17R18i305R19i304gR20r9gR15oR16R17R18i305R19i297gR20r9goR3jR4:0:1jR27:3:1d0R15oR16R17R18i309R19i307gR20r9ghR15oR16R17R18i310R19i293gR20r9goR3jR4:0:1jR27:3:1d100000000R15oR16R17R18i316R19i313gR20r9gR15oR16R17R18i316R19i293gR20r9gR15oR16R17R18i316R19i288gR20r9goR3jR4:5:3jR12:4:0oR3jR4:9:2oR3jR4:1:1r14R15oR16R17R18i339R19i322gR20r16gar20hR15oR16R17R18i341R19i322gR20r9goR3jR4:5:3r43oR3jR4:1:1r7R15oR16R17R18i345R19i344gR20r9goR3jR4:9:2oR3jR4:1:1r14R15oR16R17R18i365R19i348gR20r16gar28hR15oR16R17R18i367R19i348gR20r9gR15oR16R17R18i367R19i344gR20r9gR15oR16R17R18i367R19i322gR20r9goR3jR4:5:3r120oR3jR4:9:2oR3jR4:1:1oR5r8R7y10:pixelColorR9jR10:5:2i4r15R11i-466gR15oR16R17R18i383R19i373gR20r147gajR21:0:0jR21:1:0r20hR15oR16R17R18i387R19i373gR20jR10:5:2i3r15goR3jR4:9:2oR3jR4:1:1r7R15oR16R17R18i391R19i390gR20r9gar151r151r151hR15oR16R17R18i395R19i390gR20jR10:5:2i3r15gR15oR16R17R18i395R19i373gR20r155ghR15oR16R17R18i401R19i193gR20r35gR5jy17:hxsl.FunctionKind:0:0y3:refoR5jR6:6:0R7y6:vertexR9jR10:13:1aoR1ahR25r35ghR11i-477gR25r35ghR7y15:h3d.shader.ZCuty4:varsar14oR5r8R7y5:depthR9r9R11i-467gr169oR5r8R7y17:transformedNormalR9jR10:5:2i3r15R11i-464goR5r8R7y9:specColorR9jR10:5:2i3r15R11i-470gr61oR5r8R7y16:relativePositionR9jR10:5:2i3r15R11i-461goR5jR6:0:0R7y6:cameraR9jR10:12:1aoR5r184R7y4:viewR9jR10:7:0y6:parentr183R11i-439goR5r184R7y4:projR9r187R41r183R11i-440goR5r184R7y8:positionR9jR10:5:2i3r15R41r183R11i-441goR5r184R7y8:projDiagR9jR10:5:2i3r15R41r183R11i-442goR5r184R7y8:viewProjR9r187R41r183R11i-443goR5r184R7y15:inverseViewProjR9r187R41r183R11i-444goR5r184R7y5:zNearR9r9R41r183R11i-445goR5r184R7y4:zFarR9r9R41r183R11i-446goR5jR6:3:0R7y3:dirR9jR10:5:2i3r15R41r183R11i-447ghR11i-438goR5jR6:5:0R7y6:outputR9jR10:12:1aoR5r202R7R43R9jR10:5:2i4r15R41r201R11i-457goR5r202R7y5:colorR9jR10:5:2i4r15R41r201R11i-458goR5r202R7R35R9jR10:5:2i4r15R41r201R11i-459goR5r202R7y6:normalR9jR10:5:2i4r15R41r201R11i-460ghR11i-456goR5r8R7y8:screenUVR9jR10:5:2i2r15R11i-468goR5r184R7y6:globalR9jR10:12:1aoR5r184R7y4:timeR9r9R41r215R11i-449goR5r184R7y9:pixelSizeR9jR10:5:2i2r15R41r215R11i-450goR5r184R7y9:modelViewR9r187R41r215y10:qualifiersajy17:hxsl.VarQualifier:3:0hR11i-451goR5r184R7y16:modelViewInverseR9r187R41r215R58ar222hR11i-452ghR11i-448goR5jR6:1:0R7y5:inputR9jR10:12:1aoR5r227R7R43R9jR10:5:2i3r15R41r226R11i-454goR5r227R7R52R9jR10:5:2i3r15R41r226R11i-455ghR11i-453goR5r8R7y19:transformedPositionR9jR10:5:2i3r15R11i-462gr97oR5r8R7y9:specPowerR9r9R11i-469goR5r8R7y24:pixelTransformedPositionR9jR10:5:2i3r15R11i-463gr146hg";
haxe_ds_ObjectMap.count = 0;
haxe_io_FPHelper.i64tmp = (function($this) {
	var $r;
	var x = new haxe__$Int64__$_$_$Int64(0,0);
	$r = x;
	return $r;
}(this));
hxd_Key.initDone = false;
hxd_Key.keyPressed = [];
hxd_System.setCursor = hxd_System.setNativeCursor;
hxd_System.LOOP_INIT = false;
hxd_Timer.wantedFPS = 60.;
hxd_Timer.maxDeltaTime = 0.5;
hxd_Timer.oldTime = haxe_Timer.stamp();
hxd_Timer.tmod_factor = 0.95;
hxd_Timer.calc_tmod = 1;
hxd_Timer.tmod = 1;
hxd_Timer.deltaT = 1;
hxd_Timer.frameCount = 0;
hxd_impl_Memory.stack = [];
hxd_impl_Memory.inst = new hxd_impl_MemoryReader();
hxd_impl_Tmp.bytes = [];
hxsl_Tools.UID = 0;
hxsl_Tools.SWIZ = Type.allEnums(hxsl_Component);
js_Boot.__toStr = {}.toString;
hxsl_GlslOut.KWD_LIST = ["input","output","discard","dvec2","dvec3","dvec4"];
hxsl_GlslOut.KWDS = (function($this) {
	var $r;
	var _g = new haxe_ds_StringMap();
	{
		var _g1 = 0;
		var _g2 = hxsl_GlslOut.KWD_LIST;
		while(_g1 < _g2.length) {
			var k = _g2[_g1];
			++_g1;
			if(__map_reserved[k] != null) _g.setReserved(k,true); else _g.h[k] = true;
		}
	}
	$r = _g;
	return $r;
}(this));
hxsl_GlslOut.GLOBALS = (function($this) {
	var $r;
	var m = new haxe_ds_EnumValueMap();
	{
		var _g = 0;
		var _g1 = Type.allEnums(hxsl_TGlobal);
		while(_g < _g1.length) {
			var g = _g1[_g];
			++_g;
			var n = "" + Std.string(g);
			n = n.charAt(0).toLowerCase() + HxOverrides.substr(n,1,null);
			m.set(g,n);
		}
	}
	m.set(hxsl_TGlobal.ToInt,"int");
	m.set(hxsl_TGlobal.ToFloat,"float");
	m.set(hxsl_TGlobal.ToBool,"bool");
	m.set(hxsl_TGlobal.Texture2D,"_texture2D");
	m.set(hxsl_TGlobal.LReflect,"reflect");
	var $it0 = m.iterator();
	while( $it0.hasNext() ) {
		var g1 = $it0.next();
		hxsl_GlslOut.KWDS.set(g1,true);
	}
	$r = m;
	return $r;
}(this));
hxsl_GlslOut.MAT34 = "struct mat3x4 { vec4 a; vec4 b; vec4 c; };";
hxsl_Printer.SWIZ = ["x","y","z","w"];
hxsl_RuntimeShader.UID = 0;
input_KeyboardKeys.NUMBER_0 = new input_Key(48,"0","0",")");
input_KeyboardKeys.NUMBER_1 = new input_Key(49,"1","1","!");
input_KeyboardKeys.NUMBER_2 = new input_Key(50,"2","2","@");
input_KeyboardKeys.NUMBER_3 = new input_Key(51,"3","3","#");
input_KeyboardKeys.NUMBER_4 = new input_Key(52,"4","4","$");
input_KeyboardKeys.NUMBER_5 = new input_Key(53,"5","5","%");
input_KeyboardKeys.NUMBER_6 = new input_Key(54,"6","6","^");
input_KeyboardKeys.NUMBER_7 = new input_Key(55,"7","7","&");
input_KeyboardKeys.NUMBER_8 = new input_Key(56,"8","8","*");
input_KeyboardKeys.NUMBER_9 = new input_Key(57,"9","9","(");
input_KeyboardKeys.A = new input_Key(65,"a","a","A");
input_KeyboardKeys.B = new input_Key(66,"b","b","B");
input_KeyboardKeys.C = new input_Key(67,"c","c","C");
input_KeyboardKeys.D = new input_Key(68,"d","d","D");
input_KeyboardKeys.E = new input_Key(69,"e","e","E");
input_KeyboardKeys.F = new input_Key(70,"f","f","F");
input_KeyboardKeys.G = new input_Key(71,"g","g","G");
input_KeyboardKeys.H = new input_Key(72,"h","h","H");
input_KeyboardKeys.I = new input_Key(73,"i","i","I");
input_KeyboardKeys.J = new input_Key(74,"j","j","J");
input_KeyboardKeys.K = new input_Key(75,"k","k","K");
input_KeyboardKeys.L = new input_Key(76,"l","l","L");
input_KeyboardKeys.M = new input_Key(77,"m","m","M");
input_KeyboardKeys.N = new input_Key(78,"n","n","N");
input_KeyboardKeys.O = new input_Key(79,"o","o","O");
input_KeyboardKeys.P = new input_Key(80,"p","p","P");
input_KeyboardKeys.Q = new input_Key(81,"q","q","Q");
input_KeyboardKeys.R = new input_Key(82,"r","r","R");
input_KeyboardKeys.S = new input_Key(83,"s","s","S");
input_KeyboardKeys.T = new input_Key(84,"t","t","T");
input_KeyboardKeys.U = new input_Key(85,"u","u","U");
input_KeyboardKeys.V = new input_Key(86,"v","v","V");
input_KeyboardKeys.W = new input_Key(87,"w","w","W");
input_KeyboardKeys.X = new input_Key(88,"x","x","X");
input_KeyboardKeys.Y = new input_Key(89,"y","y","Y");
input_KeyboardKeys.Z = new input_Key(90,"z","z","Z");
input_KeyboardKeys.NUMPAD_0 = new input_Key(96,"n1","1","1");
input_KeyboardKeys.NUMPAD_1 = new input_Key(97,"n2","2","2");
input_KeyboardKeys.NUMPAD_2 = new input_Key(98,"n3","3","3");
input_KeyboardKeys.NUMPAD_3 = new input_Key(99,"n4","4","4");
input_KeyboardKeys.NUMPAD_4 = new input_Key(100,"n5","5","5");
input_KeyboardKeys.NUMPAD_5 = new input_Key(101,"n6","6","6");
input_KeyboardKeys.NUMPAD_6 = new input_Key(102,"n7","7","7");
input_KeyboardKeys.NUMPAD_7 = new input_Key(103,"n8","8","8");
input_KeyboardKeys.NUMPAD_8 = new input_Key(104,"n9","9","9");
input_KeyboardKeys.NUMPAD_9 = new input_Key(105,"n10","10","10");
input_KeyboardKeys.NUMPAD_MULTIPLY = new input_Key(106,"n*","*","*");
input_KeyboardKeys.NUMPAD_ADD = new input_Key(107,"n+","+","+");
input_KeyboardKeys.NUMPAD_ENTER = new input_Key(108,"nenter","\n","\n");
input_KeyboardKeys.NUMPAD_SUBTRACT = new input_Key(109,"n-","-","-");
input_KeyboardKeys.NUMPAD_DECIMAL = new input_Key(110,"n.",".",".");
input_KeyboardKeys.NUMPAD_DIVIDE = new input_Key(111,"n/","/","/");
input_KeyboardKeys.F1 = new input_Key(112,"f1","","");
input_KeyboardKeys.F2 = new input_Key(113,"f2","","");
input_KeyboardKeys.F3 = new input_Key(114,"f3","","");
input_KeyboardKeys.F4 = new input_Key(115,"f4","","");
input_KeyboardKeys.F5 = new input_Key(116,"f5","","");
input_KeyboardKeys.F6 = new input_Key(117,"f6","","");
input_KeyboardKeys.F7 = new input_Key(118,"f7","","");
input_KeyboardKeys.F8 = new input_Key(119,"f8","","");
input_KeyboardKeys.F9 = new input_Key(120,"f9","","");
input_KeyboardKeys.F10 = new input_Key(121,"f10","","");
input_KeyboardKeys.F11 = new input_Key(122,"f11","","");
input_KeyboardKeys.F12 = new input_Key(123,"f12","","");
input_KeyboardKeys.F13 = new input_Key(124,"f13","","");
input_KeyboardKeys.F14 = new input_Key(125,"f14","","");
input_KeyboardKeys.F15 = new input_Key(126,"f15","","");
input_KeyboardKeys.BACKSPACE = new input_Key(8,"backspace","","");
input_KeyboardKeys.TAB = new input_Key(9,"tab","\t","\t");
input_KeyboardKeys.ALTERNATE = new input_Key(18,"alt","","");
input_KeyboardKeys.ENTER = new input_Key(13,"enter","\n","\n");
input_KeyboardKeys.COMMAND = new input_Key(15,"command","","");
input_KeyboardKeys.SHIFT = new input_Key(16,"shift","","");
input_KeyboardKeys.CONTROL = new input_Key(17,"control","","");
input_KeyboardKeys.CAPS_LOCK = new input_Key(20,"capslock","","");
input_KeyboardKeys.NUMPAD = new input_Key(21,"numlock","","");
input_KeyboardKeys.ESCAPE = new input_Key(27,"escape","","");
input_KeyboardKeys.SPACE = new input_Key(32,"space"," "," ");
input_KeyboardKeys.PAGE_UP = new input_Key(33,"pageup","","");
input_KeyboardKeys.PAGE_DOWN = new input_Key(34,"pagedown","","");
input_KeyboardKeys.END = new input_Key(35,"end","","");
input_KeyboardKeys.HOME = new input_Key(36,"home","","");
input_KeyboardKeys.LEFT = new input_Key(37,"left","","");
input_KeyboardKeys.RIGHT = new input_Key(39,"right","","");
input_KeyboardKeys.UP = new input_Key(38,"up","","");
input_KeyboardKeys.DOWN = new input_Key(40,"down","","");
input_KeyboardKeys.INSERT = new input_Key(45,"insert","","");
input_KeyboardKeys.DELETE = new input_Key(46,"delete","","");
input_KeyboardKeys.NUMLOCK = new input_Key(144,"numlock","","");
input_KeyboardKeys.BREAK = new input_Key(19,"break","","");
input_KeyboardKeys.SEMICOLON = new input_Key(186,";",";",":");
input_KeyboardKeys.EQUAL = new input_Key(187,"=","=","+");
input_KeyboardKeys.COMMA = new input_Key(188,",",",","<");
input_KeyboardKeys.MINUS = new input_Key(189,"-","-","_");
input_KeyboardKeys.PERIOD = new input_Key(190,".",".",">");
input_KeyboardKeys.SLASH = new input_Key(191,"/","/","?");
input_KeyboardKeys.BACKQUOTE = new input_Key(192,"`","`","~");
input_KeyboardKeys.LEFTBRACKET = new input_Key(219,"[","[","{");
input_KeyboardKeys.BACKSLASH = new input_Key(220,"\\","\\","|");
input_KeyboardKeys.RIGHTBRACKET = new input_Key(221,"]","]","}");
input_KeyboardKeys.QUOTE = new input_Key(222,"'","'","\"");
input_KeyboardKeys.keys = [input_KeyboardKeys.NUMBER_0,input_KeyboardKeys.NUMBER_1,input_KeyboardKeys.NUMBER_2,input_KeyboardKeys.NUMBER_3,input_KeyboardKeys.NUMBER_4,input_KeyboardKeys.NUMBER_5,input_KeyboardKeys.NUMBER_6,input_KeyboardKeys.NUMBER_7,input_KeyboardKeys.NUMBER_8,input_KeyboardKeys.NUMBER_9,input_KeyboardKeys.A,input_KeyboardKeys.B,input_KeyboardKeys.C,input_KeyboardKeys.D,input_KeyboardKeys.E,input_KeyboardKeys.F,input_KeyboardKeys.G,input_KeyboardKeys.H,input_KeyboardKeys.I,input_KeyboardKeys.J,input_KeyboardKeys.K,input_KeyboardKeys.L,input_KeyboardKeys.M,input_KeyboardKeys.N,input_KeyboardKeys.O,input_KeyboardKeys.P,input_KeyboardKeys.Q,input_KeyboardKeys.R,input_KeyboardKeys.S,input_KeyboardKeys.T,input_KeyboardKeys.U,input_KeyboardKeys.V,input_KeyboardKeys.W,input_KeyboardKeys.X,input_KeyboardKeys.Y,input_KeyboardKeys.Z,input_KeyboardKeys.NUMPAD_0,input_KeyboardKeys.NUMPAD_1,input_KeyboardKeys.NUMPAD_2,input_KeyboardKeys.NUMPAD_3,input_KeyboardKeys.NUMPAD_4,input_KeyboardKeys.NUMPAD_5,input_KeyboardKeys.NUMPAD_6,input_KeyboardKeys.NUMPAD_7,input_KeyboardKeys.NUMPAD_8,input_KeyboardKeys.NUMPAD_9,input_KeyboardKeys.NUMPAD_MULTIPLY,input_KeyboardKeys.NUMPAD_ADD,input_KeyboardKeys.NUMPAD_ENTER,input_KeyboardKeys.NUMPAD_SUBTRACT,input_KeyboardKeys.NUMPAD_DECIMAL,input_KeyboardKeys.NUMPAD_DIVIDE,input_KeyboardKeys.F1,input_KeyboardKeys.F2,input_KeyboardKeys.F3,input_KeyboardKeys.F4,input_KeyboardKeys.F5,input_KeyboardKeys.F6,input_KeyboardKeys.F7,input_KeyboardKeys.F8,input_KeyboardKeys.F9,input_KeyboardKeys.F10,input_KeyboardKeys.F11,input_KeyboardKeys.F12,input_KeyboardKeys.F13,input_KeyboardKeys.F14,input_KeyboardKeys.F15,input_KeyboardKeys.BACKSPACE,input_KeyboardKeys.TAB,input_KeyboardKeys.ALTERNATE,input_KeyboardKeys.ENTER,input_KeyboardKeys.COMMAND,input_KeyboardKeys.SHIFT,input_KeyboardKeys.CONTROL,input_KeyboardKeys.CAPS_LOCK,input_KeyboardKeys.NUMPAD,input_KeyboardKeys.ESCAPE,input_KeyboardKeys.SPACE,input_KeyboardKeys.PAGE_UP,input_KeyboardKeys.PAGE_DOWN,input_KeyboardKeys.END,input_KeyboardKeys.HOME,input_KeyboardKeys.LEFT,input_KeyboardKeys.RIGHT,input_KeyboardKeys.UP,input_KeyboardKeys.DOWN,input_KeyboardKeys.INSERT,input_KeyboardKeys.DELETE,input_KeyboardKeys.NUMLOCK,input_KeyboardKeys.BREAK,input_KeyboardKeys.SEMICOLON,input_KeyboardKeys.EQUAL,input_KeyboardKeys.COMMA,input_KeyboardKeys.MINUS,input_KeyboardKeys.PERIOD,input_KeyboardKeys.SLASH,input_KeyboardKeys.BACKQUOTE,input_KeyboardKeys.LEFTBRACKET,input_KeyboardKeys.BACKSLASH,input_KeyboardKeys.RIGHTBRACKET,input_KeyboardKeys.QUOTE];
js_html_compat_Float32Array.BYTES_PER_ELEMENT = 4;
js_html_compat_Uint8Array.BYTES_PER_ELEMENT = 1;
tweenx909_rule_BoolRuleX.inputClass = Bool;
tweenx909_rule_ArrayRuleX.inputClass = Array;
tweenx909_rule_TimelineX.inputClass = tweenx909_rule_TimelineX;
tweenx909_rule_RgbX.inputClass = tweenx909_rule_RgbX;
tweenx909_rule_HsvX.inputClass = tweenx909_rule_HsvX;
tweenx909_rule_ArgbX.inputClass = tweenx909_rule_ArgbX;
tweenx909_rule_AhsvX.inputClass = tweenx909_rule_AhsvX;
tweenx909_rule_QuakeX.inputClass = tweenx909_rule_QuakeX;
tweenx909_TweenX._tweens = [];
tweenx909_TweenX._addedTweens = [];
tweenx909_TweenX.managerInited = false;
tweenx909_TweenX.DEFAULT_EASE = tweenx909_EaseX.linear;
tweenx909_TweenX.defaultEase = tweenx909_TweenX.DEFAULT_EASE;
tweenx909_TweenX.defaultTime = 0.3;
tweenx909_TweenX.defaultDelay = 0;
tweenx909_TweenX.defaultInterval = 0;
tweenx909_TweenX.defaultRepeat = 1;
tweenx909_TweenX.defaultYoyo = false;
tweenx909_TweenX.defaultZigZag = false;
tweenx909_TweenX.defaultAutoPlay = true;
tweenx909_TweenX._rules = [tweenx909_rule_BoolRuleX,tweenx909_rule_ArrayRuleX,tweenx909_rule_TimelineX,tweenx909_rule_RgbX,tweenx909_rule_HsvX,tweenx909_rule_ArgbX,tweenx909_rule_AhsvX,tweenx909_rule_QuakeX];
tweenx909_TweenX.topLevelTimeScale = 1;
tweenx909_TweenX._groupDefaults = false;
tweenx909_TweenX.updateMode = tweenx909_advanced_UpdateModeX.TIME(60);
tweenx909_TweenX._initLog = [];
tweenx909_TweenX.dictionary = new haxe_ds_ObjectMap();
Main.main();
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
