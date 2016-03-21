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
	get_wantedFPS: function() {
		return hxd_Timer.wantedFPS;
	}
	,set_wantedFPS: function(fps) {
		return hxd_Timer.wantedFPS = fps;
	}
	,onResize: function() {
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
	,dispose: function() {
		this.s2d.dispose();
		this.s3d.dispose();
		this.sevents.dispose();
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
var Main = function(engine) {
	hxd_App.call(this,engine);
};
$hxClasses["Main"] = Main;
Main.__name__ = ["Main"];
Main.main = function() {
	new Main();
};
Main.__super__ = hxd_App;
Main.prototype = $extend(hxd_App.prototype,{
	init: function() {
		var tile = h2d_Tile.fromColor(16711680,100,100);
		this.bmp = new h2d_Bitmap(tile,this.s2d);
		this.bmp.set_x(this.s2d.width * 0.5);
		this.bmp.set_y(this.s2d.height * 0.5);
	}
	,update: function(dt) {
		var _g = this.bmp;
		_g.posChanged = true;
		_g.rotation = _g.rotation + 0.1;
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
Std.random = function(x) {
	if(x <= 0) return 0; else return Math.floor(Math.random() * x);
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
var format_png_Color = $hxClasses["format.png.Color"] = { __ename__ : true, __constructs__ : ["ColGrey","ColTrue","ColIndexed"] };
format_png_Color.ColGrey = function(alpha) { var $x = ["ColGrey",0,alpha]; $x.__enum__ = format_png_Color; $x.toString = $estr; return $x; };
format_png_Color.ColTrue = function(alpha) { var $x = ["ColTrue",1,alpha]; $x.__enum__ = format_png_Color; $x.toString = $estr; return $x; };
format_png_Color.ColIndexed = ["ColIndexed",2];
format_png_Color.ColIndexed.toString = $estr;
format_png_Color.ColIndexed.__enum__ = format_png_Color;
format_png_Color.__empty_constructs__ = [format_png_Color.ColIndexed];
var format_png_Chunk = $hxClasses["format.png.Chunk"] = { __ename__ : true, __constructs__ : ["CEnd","CHeader","CData","CPalette","CUnknown"] };
format_png_Chunk.CEnd = ["CEnd",0];
format_png_Chunk.CEnd.toString = $estr;
format_png_Chunk.CEnd.__enum__ = format_png_Chunk;
format_png_Chunk.CHeader = function(h) { var $x = ["CHeader",1,h]; $x.__enum__ = format_png_Chunk; $x.toString = $estr; return $x; };
format_png_Chunk.CData = function(b) { var $x = ["CData",2,b]; $x.__enum__ = format_png_Chunk; $x.toString = $estr; return $x; };
format_png_Chunk.CPalette = function(b) { var $x = ["CPalette",3,b]; $x.__enum__ = format_png_Chunk; $x.toString = $estr; return $x; };
format_png_Chunk.CUnknown = function(id,data) { var $x = ["CUnknown",4,id,data]; $x.__enum__ = format_png_Chunk; $x.toString = $estr; return $x; };
format_png_Chunk.__empty_constructs__ = [format_png_Chunk.CEnd];
var format_png_Tools = function() { };
$hxClasses["format.png.Tools"] = format_png_Tools;
format_png_Tools.__name__ = ["format","png","Tools"];
format_png_Tools.getHeader = function(d) {
	var _g_head = d.h;
	var _g_val = null;
	while(_g_head != null) {
		var c;
		c = (function($this) {
			var $r;
			_g_val = _g_head[0];
			_g_head = _g_head[1];
			$r = _g_val;
			return $r;
		}(this));
		switch(c[1]) {
		case 1:
			var h = c[2];
			return h;
		default:
		}
	}
	throw new js__$Boot_HaxeError("Header not found");
};
format_png_Tools.getPalette = function(d) {
	var _g_head = d.h;
	var _g_val = null;
	while(_g_head != null) {
		var c;
		c = (function($this) {
			var $r;
			_g_val = _g_head[0];
			_g_head = _g_head[1];
			$r = _g_val;
			return $r;
		}(this));
		switch(c[1]) {
		case 3:
			var b = c[2];
			return b;
		default:
		}
	}
	return null;
};
format_png_Tools.filter = function(data,x,y,stride,prev,p,numChannels) {
	if(numChannels == null) numChannels = 4;
	var b;
	if(y == 0) b = 0; else b = data.b[p - stride];
	var c;
	if(x == 0 || y == 0) c = 0; else c = data.b[p - stride - numChannels];
	var k = prev + b - c;
	var pa = k - prev;
	if(pa < 0) pa = -pa;
	var pb = k - b;
	if(pb < 0) pb = -pb;
	var pc = k - c;
	if(pc < 0) pc = -pc;
	if(pa <= pb && pa <= pc) return prev; else if(pb <= pc) return b; else return c;
};
format_png_Tools.reverseBytes = function(b) {
	var p = 0;
	var _g1 = 0;
	var _g = b.length >> 2;
	while(_g1 < _g) {
		var i = _g1++;
		var b1 = b.b[p];
		var g = b.b[p + 1];
		var r = b.b[p + 2];
		var a = b.b[p + 3];
		var p1 = p++;
		b.b[p1] = a & 255;
		var p2 = p++;
		b.b[p2] = r & 255;
		var p3 = p++;
		b.b[p3] = g & 255;
		var p4 = p++;
		b.b[p4] = b1 & 255;
	}
};
format_png_Tools.extractGrey = function(d) {
	var h = format_png_Tools.getHeader(d);
	var grey = haxe_io_Bytes.alloc(h.width * h.height);
	var data = null;
	var fullData = null;
	var _g_head = d.h;
	var _g_val = null;
	while(_g_head != null) {
		var c;
		c = (function($this) {
			var $r;
			_g_val = _g_head[0];
			_g_head = _g_head[1];
			$r = _g_val;
			return $r;
		}(this));
		switch(c[1]) {
		case 2:
			var b = c[2];
			if(fullData != null) fullData.add(b); else if(data == null) data = b; else {
				fullData = new haxe_io_BytesBuffer();
				fullData.add(data);
				fullData.add(b);
				data = null;
			}
			break;
		default:
		}
	}
	if(fullData != null) data = fullData.getBytes();
	if(data == null) throw new js__$Boot_HaxeError("Data not found");
	data = format_tools_Inflate.run(data);
	var r = 0;
	var w = 0;
	{
		var _g = h.color;
		switch(_g[1]) {
		case 0:
			var alpha = _g[2];
			if(h.colbits != 8) throw new js__$Boot_HaxeError("Unsupported color mode");
			var width = h.width;
			var stride;
			stride = (alpha?2:1) * width + 1;
			if(data.length < h.height * stride) throw new js__$Boot_HaxeError("Not enough data");
			var rinc;
			if(alpha) rinc = 2; else rinc = 1;
			var _g2 = 0;
			var _g1 = h.height;
			while(_g2 < _g1) {
				var y = _g2++;
				var f = data.get(r++);
				switch(f) {
				case 0:
					var _g3 = 0;
					while(_g3 < width) {
						var x = _g3++;
						var v = data.b[r];
						r += rinc;
						grey.set(w++,v);
					}
					break;
				case 1:
					var cv = 0;
					var _g31 = 0;
					while(_g31 < width) {
						var x1 = _g31++;
						cv += data.b[r];
						r += rinc;
						grey.set(w++,cv);
					}
					break;
				case 2:
					var stride1;
					if(y == 0) stride1 = 0; else stride1 = width;
					var _g32 = 0;
					while(_g32 < width) {
						var x2 = _g32++;
						var v1 = data.b[r] + grey.b[w - stride1];
						r += rinc;
						grey.set(w++,v1);
					}
					break;
				case 3:
					var cv1 = 0;
					var stride2;
					if(y == 0) stride2 = 0; else stride2 = width;
					var _g33 = 0;
					while(_g33 < width) {
						var x3 = _g33++;
						cv1 = data.b[r] + (cv1 + grey.b[w - stride2] >> 1) & 255;
						r += rinc;
						grey.set(w++,cv1);
					}
					break;
				case 4:
					var stride3 = width;
					var cv2 = 0;
					var _g34 = 0;
					while(_g34 < width) {
						var x4 = _g34++;
						cv2 = format_png_Tools.filter(grey,x4,y,stride3,cv2,w,1) + data.b[r] & 255;
						r += rinc;
						grey.set(w++,cv2);
					}
					break;
				default:
					throw new js__$Boot_HaxeError("Invalid filter " + f);
				}
			}
			break;
		default:
			throw new js__$Boot_HaxeError("Unsupported color mode");
		}
	}
	return grey;
};
format_png_Tools.extract32 = function(d,bytes,flipY) {
	var h = format_png_Tools.getHeader(d);
	var bgra;
	if(bytes == null) bgra = haxe_io_Bytes.alloc(h.width * h.height * 4); else bgra = bytes;
	var data = null;
	var fullData = null;
	var _g_head = d.h;
	var _g_val = null;
	while(_g_head != null) {
		var c;
		c = (function($this) {
			var $r;
			_g_val = _g_head[0];
			_g_head = _g_head[1];
			$r = _g_val;
			return $r;
		}(this));
		switch(c[1]) {
		case 2:
			var b = c[2];
			if(fullData != null) fullData.add(b); else if(data == null) data = b; else {
				fullData = new haxe_io_BytesBuffer();
				fullData.add(data);
				fullData.add(b);
				data = null;
			}
			break;
		default:
		}
	}
	if(fullData != null) data = fullData.getBytes();
	if(data == null) throw new js__$Boot_HaxeError("Data not found");
	data = format_tools_Inflate.run(data);
	var r = 0;
	var w = 0;
	var lineDelta = 0;
	if(flipY) {
		lineDelta = -h.width * 8;
		w = (h.height - 1) * (h.width * 4);
	}
	var flipY1;
	if(flipY) flipY1 = -1; else flipY1 = 1;
	{
		var _g = h.color;
		switch(_g[1]) {
		case 2:
			var pal = format_png_Tools.getPalette(d);
			if(pal == null) throw new js__$Boot_HaxeError("PNG Palette is missing");
			var alpha = null;
			var _g1_head = d.h;
			var _g1_val = null;
			try {
				while(_g1_head != null) {
					var t;
					t = (function($this) {
						var $r;
						_g1_val = _g1_head[0];
						_g1_head = _g1_head[1];
						$r = _g1_val;
						return $r;
					}(this));
					switch(t[1]) {
					case 4:
						switch(t[2]) {
						case "tRNS":
							var data1 = t[3];
							alpha = data1;
							throw "__break__";
							break;
						default:
						}
						break;
					default:
					}
				}
			} catch( e ) { if( e != "__break__" ) throw e; }
			if(alpha != null && alpha.length < 1 << h.colbits) {
				var alpha2 = haxe_io_Bytes.alloc(1 << h.colbits);
				alpha2.blit(0,alpha,0,alpha.length);
				alpha2.fill(alpha.length,alpha2.length - alpha.length,255);
				alpha = alpha2;
			}
			var width = h.width;
			var stride = Math.ceil(width * h.colbits / 8) + 1;
			if(data.length < h.height * stride) throw new js__$Boot_HaxeError("Not enough data");
			var rline = h.width * h.colbits >> 3;
			var _g2 = 0;
			var _g1 = h.height;
			while(_g2 < _g1) {
				var y = _g2++;
				var f = data.get(r++);
				if(f == 0) {
					r += rline;
					continue;
				}
				switch(f) {
				case 1:
					var c1 = 0;
					var _g3 = 0;
					while(_g3 < width) {
						var x = _g3++;
						var v = data.b[r];
						c1 += v;
						data.set(r++,c1 & 255);
					}
					break;
				case 2:
					var stride1;
					if(y == 0) stride1 = 0; else stride1 = rline + 1;
					var _g31 = 0;
					while(_g31 < width) {
						var x1 = _g31++;
						var v1 = data.b[r];
						data.b[r] = v1 + data.b[r - stride1] & 255;
						r++;
					}
					break;
				case 3:
					var c2 = 0;
					var stride2;
					if(y == 0) stride2 = 0; else stride2 = rline + 1;
					var _g32 = 0;
					while(_g32 < width) {
						var x2 = _g32++;
						var v2 = data.b[r];
						c2 = v2 + (c2 + data.b[r - stride2] >> 1) & 255;
						data.set(r++,c2);
					}
					break;
				case 4:
					var stride3 = rline + 1;
					var c3 = 0;
					var _g33 = 0;
					while(_g33 < width) {
						var x3 = _g33++;
						var v3 = data.b[r];
						c3 = format_png_Tools.filter(data,x3,y,stride3,c3,r,1) + v3 & 255;
						data.set(r++,c3);
					}
					break;
				default:
					throw new js__$Boot_HaxeError("Invalid filter " + f);
				}
			}
			var r1 = 0;
			if(h.colbits == 8) {
				var _g21 = 0;
				var _g11 = h.height;
				while(_g21 < _g11) {
					var y1 = _g21++;
					r1++;
					var _g4 = 0;
					var _g34 = h.width;
					while(_g4 < _g34) {
						var x4 = _g4++;
						var c4 = data.get(r1++);
						bgra.set(w++,pal.b[c4 * 3 + 2]);
						bgra.set(w++,pal.b[c4 * 3 + 1]);
						bgra.set(w++,pal.b[c4 * 3]);
						bgra.set(w++,alpha != null?alpha.b[c4]:255);
					}
					w += lineDelta;
				}
			} else if(h.colbits < 8) {
				var req = h.colbits;
				var mask = (1 << req) - 1;
				var _g22 = 0;
				var _g12 = h.height;
				while(_g22 < _g12) {
					var y2 = _g22++;
					r1++;
					var bits = 0;
					var nbits = 0;
					var v4;
					var _g41 = 0;
					var _g35 = h.width;
					while(_g41 < _g35) {
						var x5 = _g41++;
						if(nbits < req) {
							bits = bits << 8 | data.get(r1++);
							nbits += 8;
						}
						var c5 = bits >>> nbits - req & mask;
						nbits -= req;
						bgra.set(w++,pal.b[c5 * 3 + 2]);
						bgra.set(w++,pal.b[c5 * 3 + 1]);
						bgra.set(w++,pal.b[c5 * 3]);
						bgra.set(w++,alpha != null?alpha.b[c5]:255);
					}
					w += lineDelta;
				}
			} else throw new js__$Boot_HaxeError(h.colbits + " indexed bits per pixel not supported");
			break;
		case 0:
			var alpha1 = _g[2];
			if(h.colbits != 8) throw new js__$Boot_HaxeError("Unsupported color mode");
			var width1 = h.width;
			var stride4;
			stride4 = (alpha1?2:1) * width1 + 1;
			if(data.length < h.height * stride4) throw new js__$Boot_HaxeError("Not enough data");
			var _g23 = 0;
			var _g13 = h.height;
			while(_g23 < _g13) {
				var y3 = _g23++;
				var f1 = data.get(r++);
				switch(f1) {
				case 0:
					if(alpha1) {
						var _g36 = 0;
						while(_g36 < width1) {
							var x6 = _g36++;
							var v5 = data.get(r++);
							bgra.set(w++,v5);
							bgra.set(w++,v5);
							bgra.set(w++,v5);
							bgra.set(w++,data.get(r++));
						}
					} else {
						var _g37 = 0;
						while(_g37 < width1) {
							var x7 = _g37++;
							var v6 = data.get(r++);
							bgra.set(w++,v6);
							bgra.set(w++,v6);
							bgra.set(w++,v6);
							bgra.set(w++,255);
						}
					}
					break;
				case 1:
					var cv = 0;
					var ca = 0;
					if(alpha1) {
						var _g38 = 0;
						while(_g38 < width1) {
							var x8 = _g38++;
							cv += data.get(r++);
							bgra.set(w++,cv);
							bgra.set(w++,cv);
							bgra.set(w++,cv);
							ca += data.get(r++);
							bgra.set(w++,ca);
						}
					} else {
						var _g39 = 0;
						while(_g39 < width1) {
							var x9 = _g39++;
							cv += data.get(r++);
							bgra.set(w++,cv);
							bgra.set(w++,cv);
							bgra.set(w++,cv);
							bgra.set(w++,255);
						}
					}
					break;
				case 2:
					var stride5;
					if(y3 == 0) stride5 = 0; else stride5 = width1 * 4 * flipY1;
					if(alpha1) {
						var _g310 = 0;
						while(_g310 < width1) {
							var x10 = _g310++;
							var v7 = data.get(r++) + bgra.b[w - stride5];
							bgra.set(w++,v7);
							bgra.set(w++,v7);
							bgra.set(w++,v7);
							bgra.set(w++,data.get(r++) + bgra.b[w - stride5]);
						}
					} else {
						var _g311 = 0;
						while(_g311 < width1) {
							var x11 = _g311++;
							var v8 = data.get(r++) + bgra.b[w - stride5];
							bgra.set(w++,v8);
							bgra.set(w++,v8);
							bgra.set(w++,v8);
							bgra.set(w++,255);
						}
					}
					break;
				case 3:
					var cv1 = 0;
					var ca1 = 0;
					var stride6;
					if(y3 == 0) stride6 = 0; else stride6 = width1 * 4 * flipY1;
					if(alpha1) {
						var _g312 = 0;
						while(_g312 < width1) {
							var x12 = _g312++;
							cv1 = data.get(r++) + (cv1 + bgra.b[w - stride6] >> 1) & 255;
							bgra.set(w++,cv1);
							bgra.set(w++,cv1);
							bgra.set(w++,cv1);
							ca1 = data.get(r++) + (ca1 + bgra.b[w - stride6] >> 1) & 255;
							bgra.set(w++,ca1);
						}
					} else {
						var _g313 = 0;
						while(_g313 < width1) {
							var x13 = _g313++;
							cv1 = data.get(r++) + (cv1 + bgra.b[w - stride6] >> 1) & 255;
							bgra.set(w++,cv1);
							bgra.set(w++,cv1);
							bgra.set(w++,cv1);
							bgra.set(w++,255);
						}
					}
					break;
				case 4:
					var stride7 = width1 * 4 * flipY1;
					var cv2 = 0;
					var ca2 = 0;
					if(alpha1) {
						var _g314 = 0;
						while(_g314 < width1) {
							var x14 = _g314++;
							cv2 = format_png_Tools.filter(bgra,x14,y3,stride7,cv2,w,null) + data.get(r++) & 255;
							bgra.set(w++,cv2);
							bgra.set(w++,cv2);
							bgra.set(w++,cv2);
							ca2 = format_png_Tools.filter(bgra,x14,y3,stride7,ca2,w,null) + data.get(r++) & 255;
							bgra.set(w++,ca2);
						}
					} else {
						var _g315 = 0;
						while(_g315 < width1) {
							var x15 = _g315++;
							cv2 = format_png_Tools.filter(bgra,x15,y3,stride7,cv2,w,null) + data.get(r++) & 255;
							bgra.set(w++,cv2);
							bgra.set(w++,cv2);
							bgra.set(w++,cv2);
							bgra.set(w++,255);
						}
					}
					break;
				default:
					throw new js__$Boot_HaxeError("Invalid filter " + f1);
				}
				w += lineDelta;
			}
			break;
		case 1:
			var alpha3 = _g[2];
			if(h.colbits != 8) throw new js__$Boot_HaxeError("Unsupported color mode");
			var width2 = h.width;
			var stride8;
			stride8 = (alpha3?4:3) * width2 + 1;
			if(data.length < h.height * stride8) throw new js__$Boot_HaxeError("Not enough data");
			var _g24 = 0;
			var _g14 = h.height;
			while(_g24 < _g14) {
				var y4 = _g24++;
				var f2 = data.get(r++);
				switch(f2) {
				case 0:
					if(alpha3) {
						var _g316 = 0;
						while(_g316 < width2) {
							var x16 = _g316++;
							bgra.set(w++,data.b[r + 2]);
							bgra.set(w++,data.b[r + 1]);
							bgra.set(w++,data.b[r]);
							bgra.set(w++,data.b[r + 3]);
							r += 4;
						}
					} else {
						var _g317 = 0;
						while(_g317 < width2) {
							var x17 = _g317++;
							bgra.set(w++,data.b[r + 2]);
							bgra.set(w++,data.b[r + 1]);
							bgra.set(w++,data.b[r]);
							bgra.set(w++,255);
							r += 3;
						}
					}
					break;
				case 1:
					var cr = 0;
					var cg = 0;
					var cb = 0;
					var ca3 = 0;
					if(alpha3) {
						var _g318 = 0;
						while(_g318 < width2) {
							var x18 = _g318++;
							cb += data.b[r + 2];
							bgra.set(w++,cb);
							cg += data.b[r + 1];
							bgra.set(w++,cg);
							cr += data.b[r];
							bgra.set(w++,cr);
							ca3 += data.b[r + 3];
							bgra.set(w++,ca3);
							r += 4;
						}
					} else {
						var _g319 = 0;
						while(_g319 < width2) {
							var x19 = _g319++;
							cb += data.b[r + 2];
							bgra.set(w++,cb);
							cg += data.b[r + 1];
							bgra.set(w++,cg);
							cr += data.b[r];
							bgra.set(w++,cr);
							bgra.set(w++,255);
							r += 3;
						}
					}
					break;
				case 2:
					var stride9;
					if(y4 == 0) stride9 = 0; else stride9 = width2 * 4 * flipY1;
					if(alpha3) {
						var _g320 = 0;
						while(_g320 < width2) {
							var x20 = _g320++;
							bgra.b[w] = data.b[r + 2] + bgra.b[w - stride9] & 255;
							w++;
							bgra.b[w] = data.b[r + 1] + bgra.b[w - stride9] & 255;
							w++;
							bgra.b[w] = data.b[r] + bgra.b[w - stride9] & 255;
							w++;
							bgra.b[w] = data.b[r + 3] + bgra.b[w - stride9] & 255;
							w++;
							r += 4;
						}
					} else {
						var _g321 = 0;
						while(_g321 < width2) {
							var x21 = _g321++;
							bgra.b[w] = data.b[r + 2] + bgra.b[w - stride9] & 255;
							w++;
							bgra.b[w] = data.b[r + 1] + bgra.b[w - stride9] & 255;
							w++;
							bgra.b[w] = data.b[r] + bgra.b[w - stride9] & 255;
							w++;
							bgra.set(w++,255);
							r += 3;
						}
					}
					break;
				case 3:
					var cr1 = 0;
					var cg1 = 0;
					var cb1 = 0;
					var ca4 = 0;
					var stride10;
					if(y4 == 0) stride10 = 0; else stride10 = width2 * 4 * flipY1;
					if(alpha3) {
						var _g322 = 0;
						while(_g322 < width2) {
							var x22 = _g322++;
							cb1 = data.b[r + 2] + (cb1 + bgra.b[w - stride10] >> 1) & 255;
							bgra.set(w++,cb1);
							cg1 = data.b[r + 1] + (cg1 + bgra.b[w - stride10] >> 1) & 255;
							bgra.set(w++,cg1);
							cr1 = data.b[r] + (cr1 + bgra.b[w - stride10] >> 1) & 255;
							bgra.set(w++,cr1);
							ca4 = data.b[r + 3] + (ca4 + bgra.b[w - stride10] >> 1) & 255;
							bgra.set(w++,ca4);
							r += 4;
						}
					} else {
						var _g323 = 0;
						while(_g323 < width2) {
							var x23 = _g323++;
							cb1 = data.b[r + 2] + (cb1 + bgra.b[w - stride10] >> 1) & 255;
							bgra.set(w++,cb1);
							cg1 = data.b[r + 1] + (cg1 + bgra.b[w - stride10] >> 1) & 255;
							bgra.set(w++,cg1);
							cr1 = data.b[r] + (cr1 + bgra.b[w - stride10] >> 1) & 255;
							bgra.set(w++,cr1);
							bgra.set(w++,255);
							r += 3;
						}
					}
					break;
				case 4:
					var stride11 = width2 * 4 * flipY1;
					var cr2 = 0;
					var cg2 = 0;
					var cb2 = 0;
					var ca5 = 0;
					if(alpha3) {
						var _g324 = 0;
						while(_g324 < width2) {
							var x24 = _g324++;
							cb2 = format_png_Tools.filter(bgra,x24,y4,stride11,cb2,w,null) + data.b[r + 2] & 255;
							bgra.set(w++,cb2);
							cg2 = format_png_Tools.filter(bgra,x24,y4,stride11,cg2,w,null) + data.b[r + 1] & 255;
							bgra.set(w++,cg2);
							cr2 = format_png_Tools.filter(bgra,x24,y4,stride11,cr2,w,null) + data.b[r] & 255;
							bgra.set(w++,cr2);
							ca5 = format_png_Tools.filter(bgra,x24,y4,stride11,ca5,w,null) + data.b[r + 3] & 255;
							bgra.set(w++,ca5);
							r += 4;
						}
					} else {
						var _g325 = 0;
						while(_g325 < width2) {
							var x25 = _g325++;
							cb2 = format_png_Tools.filter(bgra,x25,y4,stride11,cb2,w,null) + data.b[r + 2] & 255;
							bgra.set(w++,cb2);
							cg2 = format_png_Tools.filter(bgra,x25,y4,stride11,cg2,w,null) + data.b[r + 1] & 255;
							bgra.set(w++,cg2);
							cr2 = format_png_Tools.filter(bgra,x25,y4,stride11,cr2,w,null) + data.b[r] & 255;
							bgra.set(w++,cr2);
							bgra.set(w++,255);
							r += 3;
						}
					}
					break;
				default:
					throw new js__$Boot_HaxeError("Invalid filter " + f2);
				}
				w += lineDelta;
			}
			break;
		}
	}
	return bgra;
};
format_png_Tools.buildGrey = function(width,height,data) {
	var rgb = haxe_io_Bytes.alloc(width * height + height);
	var w = 0;
	var r = 0;
	var _g = 0;
	while(_g < height) {
		var y = _g++;
		rgb.set(w++,0);
		var _g1 = 0;
		while(_g1 < width) {
			var x = _g1++;
			rgb.set(w++,data.get(r++));
		}
	}
	var l = new List();
	l.add(format_png_Chunk.CHeader({ width : width, height : height, colbits : 8, color : format_png_Color.ColGrey(false), interlaced : false}));
	l.add(format_png_Chunk.CData(format_tools_Deflate.run(rgb)));
	l.add(format_png_Chunk.CEnd);
	return l;
};
format_png_Tools.buildRGB = function(width,height,data) {
	var rgb = haxe_io_Bytes.alloc(width * height * 3 + height);
	var w = 0;
	var r = 0;
	var _g = 0;
	while(_g < height) {
		var y = _g++;
		rgb.set(w++,0);
		var _g1 = 0;
		while(_g1 < width) {
			var x = _g1++;
			rgb.set(w++,data.b[r + 2]);
			rgb.set(w++,data.b[r + 1]);
			rgb.set(w++,data.b[r]);
			r += 3;
		}
	}
	var l = new List();
	l.add(format_png_Chunk.CHeader({ width : width, height : height, colbits : 8, color : format_png_Color.ColTrue(false), interlaced : false}));
	l.add(format_png_Chunk.CData(format_tools_Deflate.run(rgb)));
	l.add(format_png_Chunk.CEnd);
	return l;
};
format_png_Tools.build32ARGB = function(width,height,data) {
	var rgba = haxe_io_Bytes.alloc(width * height * 4 + height);
	var w = 0;
	var r = 0;
	var _g = 0;
	while(_g < height) {
		var y = _g++;
		rgba.set(w++,0);
		var _g1 = 0;
		while(_g1 < width) {
			var x = _g1++;
			rgba.set(w++,data.b[r + 1]);
			rgba.set(w++,data.b[r + 2]);
			rgba.set(w++,data.b[r + 3]);
			rgba.set(w++,data.b[r]);
			r += 4;
		}
	}
	var l = new List();
	l.add(format_png_Chunk.CHeader({ width : width, height : height, colbits : 8, color : format_png_Color.ColTrue(true), interlaced : false}));
	l.add(format_png_Chunk.CData(format_tools_Deflate.run(rgba)));
	l.add(format_png_Chunk.CEnd);
	return l;
};
format_png_Tools.build32BGRA = function(width,height,data) {
	var rgba = haxe_io_Bytes.alloc(width * height * 4 + height);
	var w = 0;
	var r = 0;
	var _g = 0;
	while(_g < height) {
		var y = _g++;
		rgba.set(w++,0);
		var _g1 = 0;
		while(_g1 < width) {
			var x = _g1++;
			rgba.set(w++,data.b[r + 2]);
			rgba.set(w++,data.b[r + 1]);
			rgba.set(w++,data.b[r]);
			rgba.set(w++,data.b[r + 3]);
			r += 4;
		}
	}
	var l = new List();
	l.add(format_png_Chunk.CHeader({ width : width, height : height, colbits : 8, color : format_png_Color.ColTrue(true), interlaced : false}));
	l.add(format_png_Chunk.CData(format_tools_Deflate.run(rgba)));
	l.add(format_png_Chunk.CEnd);
	return l;
};
var format_png_Writer = function(o) {
	this.o = o;
	o.set_bigEndian(true);
};
$hxClasses["format.png.Writer"] = format_png_Writer;
format_png_Writer.__name__ = ["format","png","Writer"];
format_png_Writer.prototype = {
	write: function(png) {
		var _g = 0;
		var _g1 = [137,80,78,71,13,10,26,10];
		while(_g < _g1.length) {
			var b = _g1[_g];
			++_g;
			this.o.writeByte(b);
		}
		var _g_head = png.h;
		var _g_val = null;
		while(_g_head != null) {
			var c;
			c = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			switch(c[1]) {
			case 1:
				var h = c[2];
				var b1 = new haxe_io_BytesOutput();
				b1.set_bigEndian(true);
				b1.writeInt32(h.width);
				b1.writeInt32(h.height);
				b1.writeByte(h.colbits);
				b1.writeByte((function($this) {
					var $r;
					var _g2 = h.color;
					$r = (function($this) {
						var $r;
						switch(_g2[1]) {
						case 0:
							$r = (function($this) {
								var $r;
								var alpha = _g2[2];
								$r = alpha?4:0;
								return $r;
							}($this));
							break;
						case 1:
							$r = (function($this) {
								var $r;
								var alpha1 = _g2[2];
								$r = alpha1?6:2;
								return $r;
							}($this));
							break;
						case 2:
							$r = 3;
							break;
						}
						return $r;
					}($this));
					return $r;
				}(this)));
				b1.writeByte(0);
				b1.writeByte(0);
				b1.writeByte(h.interlaced?1:0);
				this.writeChunk("IHDR",b1.getBytes());
				break;
			case 0:
				this.writeChunk("IEND",haxe_io_Bytes.alloc(0));
				break;
			case 2:
				var d = c[2];
				this.writeChunk("IDAT",d);
				break;
			case 3:
				var b2 = c[2];
				this.writeChunk("PLTE",b2);
				break;
			case 4:
				var data = c[3];
				var id = c[2];
				this.writeChunk(id,data);
				break;
			}
		}
	}
	,writeChunk: function(id,data) {
		this.o.writeInt32(data.length);
		this.o.writeString(id);
		this.o.write(data);
		var crc = new haxe_crypto_Crc32();
		var _g = 0;
		while(_g < 4) {
			var i = _g++;
			crc["byte"](HxOverrides.cca(id,i));
		}
		crc.update(data,0,data.length);
		this.o.writeInt32(crc.get());
	}
	,__class__: format_png_Writer
};
var format_tools_Adler32 = function() {
	this.a1 = 1;
	this.a2 = 0;
};
$hxClasses["format.tools.Adler32"] = format_tools_Adler32;
format_tools_Adler32.__name__ = ["format","tools","Adler32"];
format_tools_Adler32.read = function(i) {
	var a = new format_tools_Adler32();
	var a2a = i.readByte();
	var a2b = i.readByte();
	var a1a = i.readByte();
	var a1b = i.readByte();
	a.a1 = a1a << 8 | a1b;
	a.a2 = a2a << 8 | a2b;
	return a;
};
format_tools_Adler32.prototype = {
	update: function(b,pos,len) {
		var a1 = this.a1;
		var a2 = this.a2;
		var _g1 = pos;
		var _g = pos + len;
		while(_g1 < _g) {
			var p = _g1++;
			var c = b.b[p];
			a1 = (a1 + c) % 65521;
			a2 = (a2 + a1) % 65521;
		}
		this.a1 = a1;
		this.a2 = a2;
	}
	,equals: function(a) {
		return a.a1 == this.a1 && a.a2 == this.a2;
	}
	,__class__: format_tools_Adler32
};
var format_tools_Deflate = function() { };
$hxClasses["format.tools.Deflate"] = format_tools_Deflate;
format_tools_Deflate.__name__ = ["format","tools","Deflate"];
format_tools_Deflate.run = function(b) {
	throw new js__$Boot_HaxeError("Deflate is not supported on this platform");
	return null;
};
var format_tools_Huffman = $hxClasses["format.tools.Huffman"] = { __ename__ : true, __constructs__ : ["Found","NeedBit","NeedBits"] };
format_tools_Huffman.Found = function(i) { var $x = ["Found",0,i]; $x.__enum__ = format_tools_Huffman; $x.toString = $estr; return $x; };
format_tools_Huffman.NeedBit = function(left,right) { var $x = ["NeedBit",1,left,right]; $x.__enum__ = format_tools_Huffman; $x.toString = $estr; return $x; };
format_tools_Huffman.NeedBits = function(n,table) { var $x = ["NeedBits",2,n,table]; $x.__enum__ = format_tools_Huffman; $x.toString = $estr; return $x; };
format_tools_Huffman.__empty_constructs__ = [];
var format_tools_HuffTools = function() {
};
$hxClasses["format.tools.HuffTools"] = format_tools_HuffTools;
format_tools_HuffTools.__name__ = ["format","tools","HuffTools"];
format_tools_HuffTools.prototype = {
	treeDepth: function(t) {
		switch(t[1]) {
		case 0:
			return 0;
		case 2:
			throw new js__$Boot_HaxeError("assert");
			break;
		case 1:
			var b = t[3];
			var a = t[2];
			var da = this.treeDepth(a);
			var db = this.treeDepth(b);
			return 1 + (da < db?da:db);
		}
	}
	,treeCompress: function(t) {
		var d = this.treeDepth(t);
		if(d == 0) return t;
		if(d == 1) switch(t[1]) {
		case 1:
			var b = t[3];
			var a = t[2];
			return format_tools_Huffman.NeedBit(this.treeCompress(a),this.treeCompress(b));
		default:
			throw new js__$Boot_HaxeError("assert");
		}
		var size = 1 << d;
		var table = [];
		var _g = 0;
		while(_g < size) {
			var i = _g++;
			table.push(format_tools_Huffman.Found(-1));
		}
		this.treeWalk(table,0,0,d,t);
		return format_tools_Huffman.NeedBits(d,table);
	}
	,treeWalk: function(table,p,cd,d,t) {
		switch(t[1]) {
		case 1:
			var b = t[3];
			var a = t[2];
			if(d > 0) {
				this.treeWalk(table,p,cd + 1,d - 1,a);
				this.treeWalk(table,p | 1 << cd,cd + 1,d - 1,b);
			} else table[p] = this.treeCompress(t);
			break;
		default:
			table[p] = this.treeCompress(t);
		}
	}
	,treeMake: function(bits,maxbits,v,len) {
		if(len > maxbits) throw new js__$Boot_HaxeError("Invalid huffman");
		var idx = v << 5 | len;
		if(bits.h.hasOwnProperty(idx)) return format_tools_Huffman.Found(bits.h[idx]);
		v <<= 1;
		len += 1;
		return format_tools_Huffman.NeedBit(this.treeMake(bits,maxbits,v,len),this.treeMake(bits,maxbits,v | 1,len));
	}
	,make: function(lengths,pos,nlengths,maxbits) {
		var counts = [];
		var tmp = [];
		if(maxbits > 32) throw new js__$Boot_HaxeError("Invalid huffman");
		var _g = 0;
		while(_g < maxbits) {
			var i = _g++;
			counts.push(0);
			tmp.push(0);
		}
		var _g1 = 0;
		while(_g1 < nlengths) {
			var i1 = _g1++;
			var p = lengths[i1 + pos];
			if(p >= maxbits) throw new js__$Boot_HaxeError("Invalid huffman");
			counts[p]++;
		}
		var code = 0;
		var _g11 = 1;
		var _g2 = maxbits - 1;
		while(_g11 < _g2) {
			var i2 = _g11++;
			code = code + counts[i2] << 1;
			tmp[i2] = code;
		}
		var bits = new haxe_ds_IntMap();
		var _g3 = 0;
		while(_g3 < nlengths) {
			var i3 = _g3++;
			var l = lengths[i3 + pos];
			if(l != 0) {
				var n = tmp[l - 1];
				tmp[l - 1] = n + 1;
				bits.h[n << 5 | l] = i3;
			}
		}
		return this.treeCompress(format_tools_Huffman.NeedBit(this.treeMake(bits,maxbits,0,1),this.treeMake(bits,maxbits,1,1)));
	}
	,__class__: format_tools_HuffTools
};
var format_tools_Inflate = function() { };
$hxClasses["format.tools.Inflate"] = format_tools_Inflate;
format_tools_Inflate.__name__ = ["format","tools","Inflate"];
format_tools_Inflate.run = function(bytes) {
	return format_tools_InflateImpl.run(new haxe_io_BytesInput(bytes));
};
var format_tools__$InflateImpl_Window = function(hasCrc) {
	this.buffer = haxe_io_Bytes.alloc(65536);
	this.pos = 0;
	if(hasCrc) this.crc = new format_tools_Adler32();
};
$hxClasses["format.tools._InflateImpl.Window"] = format_tools__$InflateImpl_Window;
format_tools__$InflateImpl_Window.__name__ = ["format","tools","_InflateImpl","Window"];
format_tools__$InflateImpl_Window.prototype = {
	slide: function() {
		if(this.crc != null) this.crc.update(this.buffer,0,32768);
		var b = haxe_io_Bytes.alloc(65536);
		this.pos -= 32768;
		b.blit(0,this.buffer,32768,this.pos);
		this.buffer = b;
	}
	,addBytes: function(b,p,len) {
		if(this.pos + len > 65536) this.slide();
		this.buffer.blit(this.pos,b,p,len);
		this.pos += len;
	}
	,addByte: function(c) {
		if(this.pos == 65536) this.slide();
		this.buffer.b[this.pos] = c & 255;
		this.pos++;
	}
	,getLastChar: function() {
		return this.buffer.b[this.pos - 1];
	}
	,available: function() {
		return this.pos;
	}
	,checksum: function() {
		if(this.crc != null) this.crc.update(this.buffer,0,this.pos);
		return this.crc;
	}
	,__class__: format_tools__$InflateImpl_Window
};
var format_tools__$InflateImpl_State = $hxClasses["format.tools._InflateImpl.State"] = { __ename__ : true, __constructs__ : ["Head","Block","CData","Flat","Crc","Dist","DistOne","Done"] };
format_tools__$InflateImpl_State.Head = ["Head",0];
format_tools__$InflateImpl_State.Head.toString = $estr;
format_tools__$InflateImpl_State.Head.__enum__ = format_tools__$InflateImpl_State;
format_tools__$InflateImpl_State.Block = ["Block",1];
format_tools__$InflateImpl_State.Block.toString = $estr;
format_tools__$InflateImpl_State.Block.__enum__ = format_tools__$InflateImpl_State;
format_tools__$InflateImpl_State.CData = ["CData",2];
format_tools__$InflateImpl_State.CData.toString = $estr;
format_tools__$InflateImpl_State.CData.__enum__ = format_tools__$InflateImpl_State;
format_tools__$InflateImpl_State.Flat = ["Flat",3];
format_tools__$InflateImpl_State.Flat.toString = $estr;
format_tools__$InflateImpl_State.Flat.__enum__ = format_tools__$InflateImpl_State;
format_tools__$InflateImpl_State.Crc = ["Crc",4];
format_tools__$InflateImpl_State.Crc.toString = $estr;
format_tools__$InflateImpl_State.Crc.__enum__ = format_tools__$InflateImpl_State;
format_tools__$InflateImpl_State.Dist = ["Dist",5];
format_tools__$InflateImpl_State.Dist.toString = $estr;
format_tools__$InflateImpl_State.Dist.__enum__ = format_tools__$InflateImpl_State;
format_tools__$InflateImpl_State.DistOne = ["DistOne",6];
format_tools__$InflateImpl_State.DistOne.toString = $estr;
format_tools__$InflateImpl_State.DistOne.__enum__ = format_tools__$InflateImpl_State;
format_tools__$InflateImpl_State.Done = ["Done",7];
format_tools__$InflateImpl_State.Done.toString = $estr;
format_tools__$InflateImpl_State.Done.__enum__ = format_tools__$InflateImpl_State;
format_tools__$InflateImpl_State.__empty_constructs__ = [format_tools__$InflateImpl_State.Head,format_tools__$InflateImpl_State.Block,format_tools__$InflateImpl_State.CData,format_tools__$InflateImpl_State.Flat,format_tools__$InflateImpl_State.Crc,format_tools__$InflateImpl_State.Dist,format_tools__$InflateImpl_State.DistOne,format_tools__$InflateImpl_State.Done];
var format_tools_InflateImpl = function(i,header,crc) {
	if(crc == null) crc = true;
	if(header == null) header = true;
	this["final"] = false;
	this.htools = new format_tools_HuffTools();
	this.huffman = this.buildFixedHuffman();
	this.huffdist = null;
	this.len = 0;
	this.dist = 0;
	if(header) this.state = format_tools__$InflateImpl_State.Head; else this.state = format_tools__$InflateImpl_State.Block;
	this.input = i;
	this.bits = 0;
	this.nbits = 0;
	this.needed = 0;
	this.output = null;
	this.outpos = 0;
	this.lengths = [];
	var _g = 0;
	while(_g < 19) {
		var i1 = _g++;
		this.lengths.push(-1);
	}
	this.window = new format_tools__$InflateImpl_Window(crc);
};
$hxClasses["format.tools.InflateImpl"] = format_tools_InflateImpl;
format_tools_InflateImpl.__name__ = ["format","tools","InflateImpl"];
format_tools_InflateImpl.run = function(i,bufsize) {
	if(bufsize == null) bufsize = 65536;
	var buf = haxe_io_Bytes.alloc(bufsize);
	var output = new haxe_io_BytesBuffer();
	var inflate = new format_tools_InflateImpl(i);
	while(true) {
		var len = inflate.readBytes(buf,0,bufsize);
		output.addBytes(buf,0,len);
		if(len < bufsize) break;
	}
	return output.getBytes();
};
format_tools_InflateImpl.prototype = {
	buildFixedHuffman: function() {
		if(format_tools_InflateImpl.FIXED_HUFFMAN != null) return format_tools_InflateImpl.FIXED_HUFFMAN;
		var a = [];
		var _g = 0;
		while(_g < 288) {
			var n = _g++;
			a.push(n <= 143?8:n <= 255?9:n <= 279?7:8);
		}
		format_tools_InflateImpl.FIXED_HUFFMAN = this.htools.make(a,0,288,10);
		return format_tools_InflateImpl.FIXED_HUFFMAN;
	}
	,readBytes: function(b,pos,len) {
		this.needed = len;
		this.outpos = pos;
		this.output = b;
		if(len > 0) while(this.inflateLoop()) {
		}
		return len - this.needed;
	}
	,getBits: function(n) {
		while(this.nbits < n) {
			this.bits |= this.input.readByte() << this.nbits;
			this.nbits += 8;
		}
		var b = this.bits & (1 << n) - 1;
		this.nbits -= n;
		this.bits >>= n;
		return b;
	}
	,getBit: function() {
		if(this.nbits == 0) {
			this.nbits = 8;
			this.bits = this.input.readByte();
		}
		var b = (this.bits & 1) == 1;
		this.nbits--;
		this.bits >>= 1;
		return b;
	}
	,getRevBits: function(n) {
		if(n == 0) return 0; else if(this.getBit()) return 1 << n - 1 | this.getRevBits(n - 1); else return this.getRevBits(n - 1);
	}
	,resetBits: function() {
		this.bits = 0;
		this.nbits = 0;
	}
	,addBytes: function(b,p,len) {
		this.window.addBytes(b,p,len);
		this.output.blit(this.outpos,b,p,len);
		this.needed -= len;
		this.outpos += len;
	}
	,addByte: function(b) {
		this.window.addByte(b);
		this.output.b[this.outpos] = b & 255;
		this.needed--;
		this.outpos++;
	}
	,addDistOne: function(n) {
		var c = this.window.getLastChar();
		var _g = 0;
		while(_g < n) {
			var i = _g++;
			this.addByte(c);
		}
	}
	,addDist: function(d,len) {
		this.addBytes(this.window.buffer,this.window.pos - d,len);
	}
	,applyHuffman: function(h) {
		switch(h[1]) {
		case 0:
			var n = h[2];
			return n;
		case 1:
			var b = h[3];
			var a = h[2];
			return this.applyHuffman(this.getBit()?b:a);
		case 2:
			var tbl = h[3];
			var n1 = h[2];
			return this.applyHuffman(tbl[this.getBits(n1)]);
		}
	}
	,inflateLengths: function(a,max) {
		var i = 0;
		var prev = 0;
		while(i < max) {
			var n = this.applyHuffman(this.huffman);
			switch(n) {
			case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:case 8:case 9:case 10:case 11:case 12:case 13:case 14:case 15:
				prev = n;
				a[i] = n;
				i++;
				break;
			case 16:
				var end = i + 3 + this.getBits(2);
				if(end > max) throw new js__$Boot_HaxeError("Invalid data");
				while(i < end) {
					a[i] = prev;
					i++;
				}
				break;
			case 17:
				i += 3 + this.getBits(3);
				if(i > max) throw new js__$Boot_HaxeError("Invalid data");
				break;
			case 18:
				i += 11 + this.getBits(7);
				if(i > max) throw new js__$Boot_HaxeError("Invalid data");
				break;
			default:
				throw new js__$Boot_HaxeError("Invalid data");
			}
		}
	}
	,inflateLoop: function() {
		var _g = this.state;
		switch(_g[1]) {
		case 0:
			var cmf = this.input.readByte();
			var cm = cmf & 15;
			var cinfo = cmf >> 4;
			if(cm != 8) throw new js__$Boot_HaxeError("Invalid data");
			var flg = this.input.readByte();
			var fdict = (flg & 32) != 0;
			if(((cmf << 8) + flg) % 31 != 0) throw new js__$Boot_HaxeError("Invalid data");
			if(fdict) throw new js__$Boot_HaxeError("Unsupported dictionary");
			this.state = format_tools__$InflateImpl_State.Block;
			return true;
		case 4:
			var calc = this.window.checksum();
			if(calc == null) {
				this.state = format_tools__$InflateImpl_State.Done;
				return true;
			}
			var crc = format_tools_Adler32.read(this.input);
			if(!calc.equals(crc)) throw new js__$Boot_HaxeError("Invalid CRC");
			this.state = format_tools__$InflateImpl_State.Done;
			return true;
		case 7:
			return false;
		case 1:
			this["final"] = this.getBit();
			var _g1 = this.getBits(2);
			switch(_g1) {
			case 0:
				this.len = this.input.readUInt16();
				var nlen = this.input.readUInt16();
				if(nlen != 65535 - this.len) throw new js__$Boot_HaxeError("Invalid data");
				this.state = format_tools__$InflateImpl_State.Flat;
				var r = this.inflateLoop();
				this.resetBits();
				return r;
			case 1:
				this.huffman = this.buildFixedHuffman();
				this.huffdist = null;
				this.state = format_tools__$InflateImpl_State.CData;
				return true;
			case 2:
				var hlit = this.getBits(5) + 257;
				var hdist = this.getBits(5) + 1;
				var hclen = this.getBits(4) + 4;
				var _g2 = 0;
				while(_g2 < hclen) {
					var i = _g2++;
					this.lengths[format_tools_InflateImpl.CODE_LENGTHS_POS[i]] = this.getBits(3);
				}
				var _g21 = hclen;
				while(_g21 < 19) {
					var i1 = _g21++;
					this.lengths[format_tools_InflateImpl.CODE_LENGTHS_POS[i1]] = 0;
				}
				this.huffman = this.htools.make(this.lengths,0,19,8);
				var lengths = [];
				var _g3 = 0;
				var _g22 = hlit + hdist;
				while(_g3 < _g22) {
					var i2 = _g3++;
					lengths.push(0);
				}
				this.inflateLengths(lengths,hlit + hdist);
				this.huffdist = this.htools.make(lengths,hlit,hdist,16);
				this.huffman = this.htools.make(lengths,0,hlit,16);
				this.state = format_tools__$InflateImpl_State.CData;
				return true;
			default:
				throw new js__$Boot_HaxeError("Invalid data");
			}
			break;
		case 3:
			var rlen;
			if(this.len < this.needed) rlen = this.len; else rlen = this.needed;
			var bytes = this.input.read(rlen);
			this.len -= rlen;
			this.addBytes(bytes,0,rlen);
			if(this.len == 0) if(this["final"]) this.state = format_tools__$InflateImpl_State.Crc; else this.state = format_tools__$InflateImpl_State.Block;
			return this.needed > 0;
		case 6:
			var rlen1;
			if(this.len < this.needed) rlen1 = this.len; else rlen1 = this.needed;
			this.addDistOne(rlen1);
			this.len -= rlen1;
			if(this.len == 0) this.state = format_tools__$InflateImpl_State.CData;
			return this.needed > 0;
		case 5:
			while(this.len > 0 && this.needed > 0) {
				var rdist;
				if(this.len < this.dist) rdist = this.len; else rdist = this.dist;
				var rlen2;
				if(this.needed < rdist) rlen2 = this.needed; else rlen2 = rdist;
				this.addDist(this.dist,rlen2);
				this.len -= rlen2;
			}
			if(this.len == 0) this.state = format_tools__$InflateImpl_State.CData;
			return this.needed > 0;
		case 2:
			var n = this.applyHuffman(this.huffman);
			if(n < 256) {
				this.addByte(n);
				return this.needed > 0;
			} else if(n == 256) {
				if(this["final"]) this.state = format_tools__$InflateImpl_State.Crc; else this.state = format_tools__$InflateImpl_State.Block;
				return true;
			} else {
				n -= 257;
				var extra_bits = format_tools_InflateImpl.LEN_EXTRA_BITS_TBL[n];
				if(extra_bits == -1) throw new js__$Boot_HaxeError("Invalid data");
				this.len = format_tools_InflateImpl.LEN_BASE_VAL_TBL[n] + this.getBits(extra_bits);
				var dist_code;
				if(this.huffdist == null) dist_code = this.getRevBits(5); else dist_code = this.applyHuffman(this.huffdist);
				extra_bits = format_tools_InflateImpl.DIST_EXTRA_BITS_TBL[dist_code];
				if(extra_bits == -1) throw new js__$Boot_HaxeError("Invalid data");
				this.dist = format_tools_InflateImpl.DIST_BASE_VAL_TBL[dist_code] + this.getBits(extra_bits);
				if(this.dist > this.window.available()) throw new js__$Boot_HaxeError("Invalid data");
				if(this.dist == 1) this.state = format_tools__$InflateImpl_State.DistOne; else this.state = format_tools__$InflateImpl_State.Dist;
				return true;
			}
			break;
		}
	}
	,__class__: format_tools_InflateImpl
};
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
	,getSize: function(out) {
		if(out == null) out = new h2d_col_Bounds();
		this.getBoundsRec(this.parent,out,true);
		if(out.xMax <= out.xMin || out.yMax <= out.yMin) {
			this.addBounds(this.parent,out,-1,-1,2,2);
			out.xMax = out.xMin = (out.xMax + out.xMin) * 0.5;
			out.yMax = out.yMin = (out.yMax + out.yMin) * 0.5;
		}
		out.offset(-this.x,-this.y);
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
	,getSpritesCount: function() {
		var k = 0;
		var _g = 0;
		var _g1 = this.childs;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			k += c.getSpritesCount() + 1;
		}
		return k;
	}
	,localToGlobal: function(pt) {
		this.syncPos();
		if(pt == null) pt = new h2d_col_Point();
		var px = pt.x * this.matA + pt.y * this.matC + this.absX;
		var py = pt.x * this.matB + pt.y * this.matD + this.absY;
		pt.x = px;
		pt.y = py;
		return pt;
	}
	,globalToLocal: function(pt) {
		this.syncPos();
		pt.x -= this.absX;
		pt.y -= this.absY;
		var invDet = 1 / (this.matA * this.matD - this.matB * this.matC);
		var px = (pt.x * this.matD - pt.y * this.matC) * invDet;
		var py = (-pt.x * this.matB + pt.y * this.matA) * invDet;
		pt.x = px;
		pt.y = py;
		return pt;
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
	,getMatrix: function(m) {
		m.a = this.matA;
		m.b = this.matB;
		m.c = this.matC;
		m.d = this.matD;
		m.x = this.absX;
		m.y = this.absY;
	}
	,removeChild: function(s) {
		if(HxOverrides.remove(this.childs,s)) {
			if(s.allocated) s.onDelete();
			s.parent = null;
			s.posChanged = true;
		}
	}
	,remove: function() {
		if(this.parent != null) this.parent.removeChild(this);
	}
	,drawTo: function(t) {
		var s = this.getScene();
		var needDispose = s == null;
		if(s == null) s = new h2d_Scene();
		s.drawImplTo(this,t);
		if(needDispose) s.dispose();
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
			$final = f1.draw(ctx,$final);
			if($final == null) {
				ctx.popTarget();
				return;
			}
			$final.dx = xMin;
			$final.dy = yMin;
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
	,set_x: function(v) {
		this.posChanged = true;
		return this.x = v;
	}
	,set_y: function(v) {
		this.posChanged = true;
		return this.y = v;
	}
	,set_scaleX: function(v) {
		this.posChanged = true;
		return this.scaleX = v;
	}
	,set_scaleY: function(v) {
		this.posChanged = true;
		return this.scaleY = v;
	}
	,set_rotation: function(v) {
		this.posChanged = true;
		return this.rotation = v;
	}
	,move: function(dx,dy) {
		var _g = this;
		_g.set_x(_g.x + dx * Math.cos(this.rotation));
		var _g1 = this;
		_g1.set_y(_g1.y + dy * Math.sin(this.rotation));
	}
	,setPos: function(x,y) {
		this.posChanged = true;
		this.x = x;
		this.posChanged = true;
		this.y = y;
	}
	,rotate: function(v) {
		var _g = this;
		_g.posChanged = true;
		_g.rotation = _g.rotation + v;
	}
	,scale: function(v) {
		var _g = this;
		_g.posChanged = true;
		_g.scaleX = _g.scaleX * v;
		var _g1 = this;
		_g1.posChanged = true;
		_g1.scaleY = _g1.scaleY * v;
	}
	,setScale: function(v) {
		this.posChanged = true;
		this.scaleX = v;
		this.posChanged = true;
		this.scaleY = v;
	}
	,getChildAt: function(n) {
		return this.childs[n];
	}
	,getChildIndex: function(s) {
		var _g1 = 0;
		var _g = this.childs.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.childs[i] == s) return i;
		}
		return -1;
	}
	,get_numChildren: function() {
		return this.childs.length;
	}
	,iterator: function() {
		return new hxd_impl_ArrayIterator_$h2d_$Sprite(this.childs);
	}
	,toString: function() {
		var c = Type.getClassName(js_Boot.getClass(this));
		if(this.name == null) return c; else return this.name + "(" + c + ")";
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
	set_tileWrap: function(b) {
		return this.tileWrap = b;
	}
	,get_colorAdd: function() {
		var s = this.getShader(h3d_shader_ColorAdd);
		if(s == null) return null; else return s.color__;
	}
	,set_colorAdd: function(c) {
		var s = this.getShader(h3d_shader_ColorAdd);
		if(s == null) {
			if(c != null) {
				s = this.addShader(new h3d_shader_ColorAdd());
				s.color__ = c;
			}
		} else if(c == null) this.removeShader(s); else s.color__ = c;
		return c;
	}
	,set_colorKey: function(v) {
		var s = this.getShader(h3d_shader_ColorKey);
		if(s == null) {
			if(v != null) s = this.addShader(new h3d_shader_ColorKey(-16777216 | v));
		} else if(v == null) this.removeShader(s); else s.colorKey__.setColor(-16777216 | v,null);
		return this.colorKey = v;
	}
	,get_colorMatrix: function() {
		var s = this.getShader(h3d_shader_ColorMatrix);
		if(s == null) return null; else return s.matrix__;
	}
	,set_colorMatrix: function(m) {
		var s = this.getShader(h3d_shader_ColorMatrix);
		if(s == null) {
			if(m != null) {
				s = this.addShader(new h3d_shader_ColorMatrix());
				s.matrix__.loadFrom(m);
			}
		} else if(m == null) this.removeShader(s); else s.matrix__.loadFrom(m);
		return m;
	}
	,get_alpha: function() {
		return this.color.w;
	}
	,set_alpha: function(v) {
		return this.color.w = v;
	}
	,getDebugShaderCode: function(toHxsl) {
		if(toHxsl == null) toHxsl = true;
		var shader;
		var ctx = this.getScene().ctx;
		shader = ctx.manager.compileShaders(new hxsl_ShaderList(ctx.baseShader,this.shaders));
		var toString;
		if(toHxsl) toString = function(d) {
			return hxsl_Printer.shaderToString(d,true);
		}; else toString = hxsl_GlslOut.toGlsl;
		return "VERTEX=\n" + toString(shader.vertex.data) + "\n\nFRAGMENT=\n" + toString(shader.fragment.data);
	}
	,getShader: function(stype) {
		if(this.shaders != null) {
			var _g = new hxsl__$ShaderList_ShaderIterator(this.shaders,null);
			while(_g.l != _g.last) {
				var s = _g.next();
				var s1;
				s1 = (s instanceof stype)?s:null;
				if(s1 != null) return s1;
			}
		}
		return null;
	}
	,getShaders: function() {
		return new hxsl__$ShaderList_ShaderIterator(this.shaders,null);
	}
	,addShader: function(s) {
		if(s == null) throw new js__$Boot_HaxeError("Can't add null shader");
		this.shaders = new hxsl_ShaderList(s,this.shaders);
		return s;
	}
	,removeShader: function(s) {
		var prev = null;
		var cur = this.shaders;
		while(cur != null) {
			if(cur.s == s) {
				if(prev == null) this.shaders = cur.next; else prev.next = cur.next;
				return true;
			}
			prev = cur;
			cur = cur.next;
		}
		return false;
	}
	,emitTile: function(ctx,tile) {
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
var h2d_Bitmap = function(tile,parent) {
	h2d_Drawable.call(this,parent);
	this.tile = tile;
};
$hxClasses["h2d.Bitmap"] = h2d_Bitmap;
h2d_Bitmap.__name__ = ["h2d","Bitmap"];
h2d_Bitmap.create = function(bmp,allocPos) {
	return new h2d_Bitmap(h2d_Tile.fromBitmap(bmp,allocPos));
};
h2d_Bitmap.__super__ = h2d_Drawable;
h2d_Bitmap.prototype = $extend(h2d_Drawable.prototype,{
	set_tileWrap: function(b) {
		if(b && this.tile != null && (this.tile.innerTex.flags & 1 << h3d_mat_TextureFlags.IsNPOT[1]) != 0) throw new js__$Boot_HaxeError("Cannot set tileWrap on a non power-of-two texture");
		return this.tileWrap = b;
	}
	,getBoundsRec: function(relativeTo,out,forSize) {
		h2d_Drawable.prototype.getBoundsRec.call(this,relativeTo,out,forSize);
		if(this.tile != null) this.addBounds(relativeTo,out,this.tile.dx,this.tile.dy,this.tile.width,this.tile.height);
	}
	,draw: function(ctx) {
		this.emitTile(ctx,this.tile);
	}
	,__class__: h2d_Bitmap
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
var hxd_Interactive = function() { };
$hxClasses["hxd.Interactive"] = hxd_Interactive;
hxd_Interactive.__name__ = ["hxd","Interactive"];
hxd_Interactive.prototype = {
	__class__: hxd_Interactive
};
var h2d_Interactive = function(width,height,parent) {
	this.propagateEvents = false;
	this.cancelEvents = false;
	h2d_Drawable.call(this,parent);
	this.width = width;
	this.height = height;
	this.set_cursor(hxd_Cursor.Button);
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
	,set_cursor: function(c) {
		this.cursor = c;
		if(this.isOver()) hxd_System.setCursor(this.cursor);
		return c;
	}
	,eventToLocal: function(e) {
		var x = e.relX;
		var y = e.relY;
		var rx = x * this.scene.matA + y * this.scene.matB + this.scene.absX;
		var ry = x * this.scene.matC + y * this.scene.matD + this.scene.absY;
		var r = this.scene.height / this.scene.width;
		var i = this;
		var dx = rx - i.absX;
		var dy = ry - i.absY;
		var w1 = i.width * i.matA * r;
		var h1 = i.width * i.matC;
		var ky = h1 * dx - w1 * dy;
		var w2 = i.height * i.matB * r;
		var h2 = i.height * i.matD;
		var kx = w2 * dy - h2 * dx;
		var max = h1 * w2 - w1 * h2;
		e.relX = kx * r / max * i.width;
		e.relY = ky / max * i.height;
	}
	,startDrag: function(callb,onCancel) {
		var _g = this;
		this.scene.startDrag(function(event) {
			var x = event.relX;
			var y = event.relY;
			_g.eventToLocal(event);
			callb(event);
			event.relX = x;
			event.relY = y;
		},onCancel);
	}
	,stopDrag: function() {
		this.scene.stopDrag();
	}
	,focus: function() {
		if(this.scene == null || this.scene.events == null) return;
		this.scene.events.focus(this);
	}
	,blur: function() {
		if(this.hasFocus()) this.scene.events.blur();
	}
	,isOver: function() {
		return this.scene != null && this.scene.events != null && this.scene.events.currentOver == this;
	}
	,hasFocus: function() {
		return this.scene != null && this.scene.events != null && this.scene.events.currentFocus == this;
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
	,add: function(s,layer) {
		this.addChildAt(s,layer);
		return;
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
	,under: function(s) {
		var _g1 = 0;
		var _g = this.childs.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.childs[i] == s) {
				var pos = 0;
				var _g2 = 0;
				var _g3 = this.layersIndexes;
				while(_g2 < _g3.length) {
					var l = _g3[_g2];
					++_g2;
					if(l > i) break; else pos = l;
				}
				var p = i;
				while(p > pos) {
					this.childs[p] = this.childs[p - 1];
					p--;
				}
				this.childs[pos] = s;
				break;
			}
		}
	}
	,over: function(s) {
		var _g1 = 0;
		var _g = this.childs.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.childs[i] == s) {
				var _g2 = 0;
				var _g3 = this.layersIndexes;
				while(_g2 < _g3.length) {
					var l = _g3[_g2];
					++_g2;
					if(l > i) {
						var _g5 = i;
						var _g4 = l - 1;
						while(_g5 < _g4) {
							var p = _g5++;
							this.childs[p] = this.childs[p + 1];
						}
						this.childs[l - 1] = s;
						break;
					}
				}
				break;
			}
		}
	}
	,getLayer: function(layer) {
		var a;
		if(layer >= this.layerCount) a = []; else {
			var start;
			if(layer == 0) start = 0; else start = this.layersIndexes[layer - 1];
			var max = this.layersIndexes[layer];
			a = this.childs.slice(start,max);
		}
		return new hxd_impl_ArrayIterator_$h2d_$Sprite(a);
	}
	,ysort: function(layer) {
		if(layer >= this.layerCount) return;
		var start;
		if(layer == 0) start = 0; else start = this.layersIndexes[layer - 1];
		var max = this.layersIndexes[layer];
		if(start == max) return;
		var pos = start;
		var ymax = this.childs[pos++].y;
		while(pos < max) {
			var c = this.childs[pos];
			if(c.y < ymax) {
				var p = pos - 1;
				while(p >= start) {
					var c2 = this.childs[p];
					if(c.y >= c2.y) break;
					this.childs[p + 1] = c2;
					p--;
				}
				this.childs[p + 1] = c;
			} else ymax = c.y;
			pos++;
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
	dispose: function() {
		this.textures.dispose();
		if(this.fixedBuffer != null) this.fixedBuffer.dispose();
	}
	,hasBuffering: function() {
		return false;
	}
	,begin: function() {
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
	,flush: function() {
	}
	,_flush: function() {
		if(this.bufPos == 0) return;
		this.beforeDraw();
		var nverts = this.bufPos / this.stride | 0;
		var tmp = new h3d_Buffer(nverts,this.stride,[h3d_BufferFlag.Quads,h3d_BufferFlag.Dynamic,h3d_BufferFlag.RawFormat]);
		tmp.uploadVector(this.buffer,0,nverts);
		this.engine.renderQuadBuffer(tmp,null,null);
		tmp.dispose();
		this.bufPos = 0;
		this.texture = null;
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
	,beginDrawObject: function(obj,texture) {
		this.beginDraw(obj,texture,true);
		if(this.inFilter == obj) this.baseShader.color__.set(1,1,1,1); else this.baseShader.color__.set(obj.color.x,obj.color.y,obj.color.z,obj.color.w * this.globalAlpha);
		this.baseShader.absoluteMatrixA__.set(obj.matA,obj.matC,obj.absX,null);
		this.baseShader.absoluteMatrixB__.set(obj.matB,obj.matD,obj.absY,null);
		this.beforeDraw();
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
	,get_zoom: function() {
		return h3d_Engine.CURRENT.width / this.width | 0;
	}
	,set_zoom: function(v) {
		var e = h3d_Engine.CURRENT;
		var stage = hxd_Stage.getInstance();
		var twidth = hxd_Math.ceil(stage.get_width() / v);
		var theight = hxd_Math.ceil(stage.get_height() / v);
		var totalWidth = twidth * v;
		var totalHeight = theight * v;
		if(totalWidth != e.width || totalHeight != e.height) e.resize(totalWidth,totalHeight);
		this.setFixedSize(twidth,theight);
		return v;
	}
	,setFixedSize: function(w,h) {
		this.width = w;
		this.height = h;
		this.fixedSize = true;
		this.posChanged = true;
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
	,screenXToLocal: function(mx) {
		return mx * this.width / (this.stage.get_width() * this.scaleX) - this.x;
	}
	,screenYToLocal: function(my) {
		return my * this.height / (this.stage.get_height() * this.scaleY) - this.y;
	}
	,get_mouseX: function() {
		return this.screenXToLocal(this.stage.get_mouseX());
	}
	,get_mouseY: function() {
		return this.screenYToLocal(this.stage.get_mouseY());
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
	,getInteractive: function(x,y) {
		var rx = x * this.matA + y * this.matB + this.absX;
		var ry = x * this.matC + y * this.matD + this.absY;
		var _g = 0;
		var _g1 = this.interactive;
		while(_g < _g1.length) {
			var i = _g1[_g];
			++_g;
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
			return i;
		}
		return null;
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
	,removeEventListener: function(f) {
		return HxOverrides.remove(this.eventListeners,f);
	}
	,startDrag: function(f,onCancel,refEvent) {
		var _g = this;
		this.events.startDrag(function(e) {
			_g.screenToLocal(e);
			f(e);
		},onCancel,refEvent);
	}
	,stopDrag: function() {
		this.events.stopDrag();
	}
	,getFocus: function() {
		if(this.events == null) return null;
		var f = this.events.getFocus();
		if(f == null) return null;
		var i;
		i = (f instanceof h2d_Interactive)?f:null;
		if(i == null) return null;
		return this.interactive[HxOverrides.indexOf(this.interactive,i,0)];
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
	,dispose: function() {
		if(this.allocated) this.onDelete();
		this.ctx.dispose();
	}
	,setElapsedTime: function(v) {
		this.ctx.elapsedTime = v;
	}
	,drawImplTo: function(s,t) {
		if(!((t.flags & 1 << h3d_mat_TextureFlags.Target[1]) != 0)) throw new js__$Boot_HaxeError("Can only draw to texture created with Target flag");
		this.ctx.engine = h3d_Engine.CURRENT;
		this.ctx.engine.begin();
		this.ctx.globalAlpha = this.alpha;
		this.ctx.begin();
		this.ctx.pushTarget(t);
		if(!((t.flags & 1 << h3d_mat_TextureFlags.WasCleared[1]) != 0)) this.ctx.engine.driver.clear(new h3d_Vector(0,0,0,0),1,0);
		s.drawRec(this.ctx);
		this.ctx.popTarget();
		this.ctx.engine.driver.clear(new h3d_Vector(0,0,0,0),1,0);
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
	,captureBitmap: function(target) {
		var engine = h3d_Engine.CURRENT;
		if(target == null) {
			var tex1 = new h3d_mat_Texture(this.width,this.height,[h3d_mat_TextureFlags.Target]);
			target = new h2d_Tile(tex1,0,0,this.width,this.height);
		}
		engine.begin();
		engine.setRenderZone(target.x,target.y,target.width,target.height);
		var tex = target.innerTex;
		engine.pushTarget(tex);
		var ow = this.width;
		var oh = this.height;
		var of = this.fixedSize;
		this.setFixedSize(tex.width,tex.height);
		this.render(engine);
		engine.popTarget();
		this.width = ow;
		this.height = oh;
		this.fixedSize = of;
		this.posChanged = true;
		engine.setRenderZone();
		engine.end();
		return new h2d_Bitmap(target);
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
h2d_Tile.fromBitmap = function(bmp,allocPos) {
	var tex = h3d_mat_Texture.fromBitmap(bmp,allocPos);
	return new h2d_Tile(tex,0,0,bmp.ctx.canvas.width,bmp.ctx.canvas.height);
};
h2d_Tile.autoCut = function(bmp,width,height,allocPos) {
	bmp.lock();
	if(height == null) height = width;
	var colorBG = bmp.getPixel(bmp.ctx.canvas.width - 1,bmp.ctx.canvas.height - 1);
	var tl = [];
	var w = 1;
	var h = 1;
	while(w < bmp.ctx.canvas.width) w <<= 1;
	while(h < bmp.ctx.canvas.height) h <<= 1;
	var tex = new h3d_mat_Texture(w,h,null,null,allocPos);
	var _g1 = 0;
	var _g = bmp.ctx.canvas.height / height | 0;
	while(_g1 < _g) {
		var y = _g1++;
		var a = [];
		tl[y] = a;
		var _g3 = 0;
		var _g2 = bmp.ctx.canvas.width / width | 0;
		while(_g3 < _g2) {
			var x = _g3++;
			var sz = h2d_Tile.isEmpty(bmp,x * width,y * height,width,height,colorBG);
			if(sz == null) break;
			a.push(new h2d_Tile(tex,x * width + sz.dx,y * height + sz.dy,sz.w,sz.h,sz.dx,sz.dy));
		}
	}
	bmp.unlock();
	var main = new h2d_Tile(tex,0,0,bmp.ctx.canvas.width,bmp.ctx.canvas.height);
	main.upload(bmp);
	return { main : main, tiles : tl};
};
h2d_Tile.fromTexture = function(t) {
	return new h2d_Tile(t,0,0,t.width,t.height);
};
h2d_Tile.fromPixels = function(pixels,allocPos) {
	var pix2 = pixels.makeSquare(true);
	var t = h3d_mat_Texture.fromPixels(pix2);
	if(pix2 != pixels) pix2.dispose();
	return new h2d_Tile(t,0,0,pixels.width,pixels.height);
};
h2d_Tile.isEmpty = function(b,px,py,width,height,bg) {
	var empty = true;
	var xmin = width;
	var ymin = height;
	var xmax = 0;
	var ymax = 0;
	var _g = 0;
	while(_g < width) {
		var x = _g++;
		var _g1 = 0;
		while(_g1 < height) {
			var y = _g1++;
			var color = b.getPixel(x + px,y + py);
			if(color != bg) {
				empty = false;
				if(x < xmin) xmin = x;
				if(y < ymin) ymin = y;
				if(x > xmax) xmax = x;
				if(y > ymax) ymax = y;
			}
			if(color == bg) b.setPixel(x + px,y + py,0);
		}
	}
	if(empty) return null; else return { dx : xmin, dy : ymin, w : xmax - xmin + 1, h : ymax - ymin + 1};
};
h2d_Tile.prototype = {
	getTexture: function() {
		return this.innerTex;
	}
	,isDisposed: function() {
		return this.innerTex == null || this.innerTex.isDisposed();
	}
	,setTexture: function(tex) {
		this.innerTex = tex;
		if(tex != null) {
			this.u = this.x / tex.width;
			this.v = this.y / tex.height;
			this.u2 = (this.x + this.width) / tex.width;
			this.v2 = (this.y + this.height) / tex.height;
		}
	}
	,switchTexture: function(t) {
		this.setTexture(t.innerTex);
	}
	,sub: function(x,y,w,h,dx,dy) {
		if(dy == null) dy = 0;
		if(dx == null) dx = 0;
		return new h2d_Tile(this.innerTex,this.x + x,this.y + y,w,h,dx,dy);
	}
	,center: function() {
		return this.sub(0,0,this.width,this.height,-(this.width >> 1),-(this.height >> 1));
	}
	,setCenterRatio: function(px,py) {
		if(py == null) py = 0.5;
		if(px == null) px = 0.5;
		this.dx = -(px * this.width | 0);
		this.dy = -(py * this.height | 0);
	}
	,flipX: function() {
		var tmp = this.u;
		this.u = this.u2;
		this.u2 = tmp;
		this.dx = -this.dx - this.width;
	}
	,flipY: function() {
		var tmp = this.v;
		this.v = this.v2;
		this.v2 = tmp;
		this.dy = -this.dy - this.height;
	}
	,setPos: function(x,y) {
		this.x = x;
		this.y = y;
		var tex = this.innerTex;
		if(tex != null) {
			this.u = x / tex.width;
			this.v = y / tex.height;
			this.u2 = (x + this.width) / tex.width;
			this.v2 = (y + this.height) / tex.height;
		}
	}
	,setSize: function(w,h) {
		this.width = w;
		this.height = h;
		var tex = this.innerTex;
		if(tex != null) {
			this.u2 = (this.x + w) / tex.width;
			this.v2 = (this.y + h) / tex.height;
		}
	}
	,scaleToSize: function(w,h) {
		this.width = w;
		this.height = h;
	}
	,scrollDiscrete: function(dx,dy) {
		var tex = this.innerTex;
		this.u += dx / tex.width;
		this.v -= dy / tex.height;
		this.u2 += dx / tex.width;
		this.v2 -= dy / tex.height;
		this.x = this.u * tex.width | 0;
		this.y = this.v * tex.height | 0;
	}
	,dispose: function() {
		if(this.innerTex != null) this.innerTex.dispose();
		this.innerTex = null;
	}
	,clone: function() {
		var t = new h2d_Tile(null,this.x,this.y,this.width,this.height,this.dx,this.dy);
		t.innerTex = this.innerTex;
		t.u = this.u;
		t.u2 = this.u2;
		t.v = this.v;
		t.v2 = this.v2;
		return t;
	}
	,split: function(frames,vertical) {
		if(vertical == null) vertical = false;
		if(frames == null) frames = 0;
		var tl = [];
		if(vertical) {
			if(frames == 0) frames = this.height / this.width | 0;
			var stride = this.height / frames | 0;
			var _g = 0;
			while(_g < frames) {
				var i = _g++;
				tl.push(this.sub(0,i * stride,this.width,stride));
			}
		} else {
			if(frames == 0) frames = this.width / this.height | 0;
			var stride1 = this.width / frames | 0;
			var _g1 = 0;
			while(_g1 < frames) {
				var i1 = _g1++;
				tl.push(this.sub(i1 * stride1,0,stride1,this.height));
			}
		}
		return tl;
	}
	,grid: function(size,dx,dy) {
		if(dy == null) dy = 0;
		if(dx == null) dx = 0;
		var _g = [];
		var _g2 = 0;
		var _g1 = this.height / size | 0;
		while(_g2 < _g1) {
			var y = _g2++;
			var _g4 = 0;
			var _g3 = this.width / size | 0;
			while(_g4 < _g3) {
				var x = _g4++;
				_g.push(this.sub(x * size,y * size,size,size,dx,dy));
			}
		}
		return _g;
	}
	,toString: function() {
		return "Tile(" + this.x + "," + this.y + "," + this.width + "x" + this.height + (this.dx != 0 || this.dy != 0?"," + this.dx + ":" + this.dy:"") + ")";
	}
	,upload: function(bmp) {
		var w = this.innerTex.width;
		var h = this.innerTex.height;
		this.innerTex.uploadBitmap(bmp);
	}
	,__class__: h2d_Tile
};
var h2d_col_Bounds = function() {
	this.xMin = 1e20;
	this.yMin = 1e20;
	this.xMax = -1e20;
	this.yMax = -1e20;
};
$hxClasses["h2d.col.Bounds"] = h2d_col_Bounds;
h2d_col_Bounds.__name__ = ["h2d","col","Bounds"];
h2d_col_Bounds.fromValues = function(x0,y0,width,height) {
	var b = new h2d_col_Bounds();
	b.xMin = x0;
	b.yMin = y0;
	b.xMax = x0 + width;
	b.yMax = y0 + height;
	return b;
};
h2d_col_Bounds.fromPoints = function(min,max) {
	var b = new h2d_col_Bounds();
	b.xMin = min.x;
	b.yMin = min.y;
	b.xMax = max.x;
	b.yMax = max.y;
	return b;
};
h2d_col_Bounds.prototype = {
	toIBounds: function(scale) {
		if(scale == null) scale = 1.;
		return h2d_col_IBounds.fromValues(Math.floor(this.xMin * scale),Math.floor(this.yMin * scale),Math.floor((this.xMax - this.xMin) * scale),Math.floor((this.yMax - this.yMin) * scale));
	}
	,intersects: function(b) {
		return !(this.xMin > b.xMax || this.yMin > b.yMax || this.xMax < b.xMin || this.yMax < b.yMin);
	}
	,contains: function(p) {
		return p.x >= this.xMin && p.x < this.xMax && p.y >= this.yMin && p.y < this.yMax;
	}
	,addBounds: function(b) {
		if(b.xMin < this.xMin) this.xMin = b.xMin;
		if(b.xMax > this.xMax) this.xMax = b.xMax;
		if(b.yMin < this.yMin) this.yMin = b.yMin;
		if(b.yMax > this.yMax) this.yMax = b.yMax;
	}
	,addPoint: function(p) {
		if(p.x < this.xMin) this.xMin = p.x;
		if(p.x > this.xMax) this.xMax = p.x;
		if(p.y < this.yMin) this.yMin = p.y;
		if(p.y > this.yMax) this.yMax = p.y;
	}
	,addPos: function(x,y) {
		if(x < this.xMin) this.xMin = x;
		if(x > this.xMax) this.xMax = x;
		if(y < this.yMin) this.yMin = y;
		if(y > this.yMax) this.yMax = y;
	}
	,set: function(x,y,width,height) {
		this.xMin = x;
		this.yMin = y;
		this.xMax = x + width;
		this.yMax = y + height;
	}
	,setMin: function(p) {
		this.xMin = p.x;
		this.yMin = p.y;
	}
	,setMax: function(p) {
		this.xMax = p.x;
		this.yMax = p.y;
	}
	,doIntersect: function(b) {
		this.xMin = hxd_Math.max(this.xMin,b.xMin);
		this.yMin = hxd_Math.max(this.yMin,b.yMin);
		this.xMax = hxd_Math.min(this.xMax,b.xMax);
		this.yMax = hxd_Math.min(this.yMax,b.yMax);
	}
	,doUnion: function(b) {
		this.xMin = hxd_Math.min(this.xMin,b.xMin);
		this.yMin = hxd_Math.min(this.yMin,b.yMin);
		this.xMax = hxd_Math.max(this.xMax,b.xMax);
		this.yMax = hxd_Math.max(this.yMax,b.yMax);
	}
	,intersection: function(b) {
		var i = new h2d_col_Bounds();
		i.xMin = hxd_Math.max(this.xMin,b.xMin);
		i.yMin = hxd_Math.max(this.yMin,b.yMin);
		i.xMax = hxd_Math.min(this.xMax,b.xMax);
		i.yMax = hxd_Math.min(this.yMax,b.yMax);
		if(i.xMax < i.xMin) i.xMax = i.xMin;
		if(i.yMax < i.yMin) i.yMax = i.yMin;
		return i;
	}
	,union: function(b) {
		var i = new h2d_col_Bounds();
		i.xMin = hxd_Math.min(this.xMin,b.xMin);
		i.yMin = hxd_Math.min(this.yMin,b.yMin);
		i.xMax = hxd_Math.max(this.xMax,b.xMax);
		i.yMax = hxd_Math.max(this.yMax,b.yMax);
		return i;
	}
	,load: function(b) {
		this.xMin = b.xMin;
		this.yMin = b.yMin;
		this.xMax = b.xMax;
		this.yMax = b.yMax;
	}
	,scalePivot: function(v) {
		this.xMin *= v;
		this.yMin *= v;
		this.xMax *= v;
		this.yMax *= v;
	}
	,scaleCenter: function(v) {
		var dx = (this.xMax - this.xMin) * 0.5 * v;
		var dy = (this.yMax - this.yMin) * 0.5 * v;
		var mx = (this.xMax + this.xMin) * 0.5;
		var my = (this.yMax + this.yMin) * 0.5;
		this.xMin = mx - dx;
		this.yMin = my - dy;
		this.xMax = mx + dx;
		this.yMax = my + dy;
	}
	,rotate: function(angle) {
		var cos = Math.cos(angle);
		var sin = Math.sin(angle);
		var x0 = this.xMin;
		var y0 = this.yMin;
		var x1 = this.xMax;
		var y1 = this.yMax;
		this.xMin = 1e20;
		this.yMin = 1e20;
		this.xMax = -1e20;
		this.yMax = -1e20;
		this.addPos(x0 * cos - y0 * sin,x0 * sin + y0 * cos);
		this.addPos(x1 * cos - y0 * sin,x1 * sin + y0 * cos);
		this.addPos(x0 * cos - y1 * sin,x0 * sin + y1 * cos);
		this.addPos(x1 * cos - y1 * sin,x1 * sin + y1 * cos);
	}
	,offset: function(dx,dy) {
		this.xMin += dx;
		this.xMax += dx;
		this.yMin += dy;
		this.yMax += dy;
	}
	,getMin: function() {
		return new h2d_col_Point(this.xMin,this.yMin);
	}
	,getCenter: function() {
		return new h2d_col_Point((this.xMin + this.xMax) * 0.5,(this.yMin + this.yMax) * 0.5);
	}
	,getSize: function() {
		return new h2d_col_Point(this.xMax - this.xMin,this.yMax - this.yMin);
	}
	,getMax: function() {
		return new h2d_col_Point(this.xMax,this.yMax);
	}
	,isEmpty: function() {
		return this.xMax <= this.xMin || this.yMax <= this.yMin;
	}
	,empty: function() {
		this.xMin = 1e20;
		this.yMin = 1e20;
		this.xMax = -1e20;
		this.yMax = -1e20;
	}
	,all: function() {
		this.xMin = -1e20;
		this.yMin = -1e20;
		this.xMax = 1e20;
		this.yMax = 1e20;
	}
	,clone: function() {
		var b = new h2d_col_Bounds();
		b.xMin = this.xMin;
		b.yMin = this.yMin;
		b.xMax = this.xMax;
		b.yMax = this.yMax;
		return b;
	}
	,get_x: function() {
		return this.xMin;
	}
	,get_y: function() {
		return this.yMin;
	}
	,set_x: function(x) {
		this.xMax += x - this.xMin;
		return this.xMin = x;
	}
	,set_y: function(y) {
		this.yMax += y - this.yMin;
		return this.yMin = y;
	}
	,get_width: function() {
		return this.xMax - this.xMin;
	}
	,get_height: function() {
		return this.yMax - this.yMin;
	}
	,set_width: function(w) {
		this.xMax = this.xMin + w;
		return w;
	}
	,set_height: function(h) {
		this.yMax = this.yMin + h;
		return h;
	}
	,toString: function() {
		return "{" + Std.string(new h2d_col_Point(this.xMin,this.yMin)) + "," + Std.string(new h2d_col_Point(this.xMax - this.xMin,this.yMax - this.yMin)) + "}";
	}
	,__class__: h2d_col_Bounds
};
var h2d_col_IBounds = function() {
	this.xMin = 2147483647;
	this.yMin = 2147483647;
	this.xMax = -2147483648;
	this.yMax = -2147483648;
};
$hxClasses["h2d.col.IBounds"] = h2d_col_IBounds;
h2d_col_IBounds.__name__ = ["h2d","col","IBounds"];
h2d_col_IBounds.fromValues = function(x0,y0,width,height) {
	var b = new h2d_col_IBounds();
	b.xMin = x0;
	b.yMin = y0;
	b.xMax = x0 + width;
	b.yMax = y0 + height;
	return b;
};
h2d_col_IBounds.fromPoints = function(min,max) {
	var b = new h2d_col_IBounds();
	b.xMin = min.x;
	b.yMin = min.y;
	b.xMax = max.x;
	b.yMax = max.y;
	return b;
};
h2d_col_IBounds.prototype = {
	toBounds: function(scale) {
		if(scale == null) scale = 1.;
		return h2d_col_Bounds.fromValues(this.xMin * scale,this.yMin * scale,(this.xMax - this.xMin) * scale,(this.yMax - this.yMin) * scale);
	}
	,intersects: function(b) {
		return !(this.xMin > b.xMax || this.yMin > b.yMax || this.xMax < b.xMin || this.yMax < b.yMin);
	}
	,contains: function(p) {
		return p.x >= this.xMin && p.x < this.xMax && p.y >= this.yMin && p.y < this.yMax;
	}
	,addBounds: function(b) {
		if(b.xMin < this.xMin) this.xMin = b.xMin;
		if(b.xMax > this.xMax) this.xMax = b.xMax;
		if(b.yMin < this.yMin) this.yMin = b.yMin;
		if(b.yMax > this.yMax) this.yMax = b.yMax;
	}
	,addPoint: function(p) {
		if(p.x < this.xMin) this.xMin = p.x;
		if(p.x > this.xMax) this.xMax = p.x;
		if(p.y < this.yMin) this.yMin = p.y;
		if(p.y > this.yMax) this.yMax = p.y;
	}
	,addPos: function(x,y) {
		if(x < this.xMin) this.xMin = x;
		if(x > this.xMax) this.xMax = x;
		if(y < this.yMin) this.yMin = y;
		if(y > this.yMax) this.yMax = y;
	}
	,set: function(x,y,width,height) {
		this.xMin = x;
		this.yMin = y;
		this.xMax = x + width;
		this.yMax = y + height;
	}
	,setMin: function(p) {
		this.xMin = p.x;
		this.yMin = p.y;
	}
	,setMax: function(p) {
		this.xMax = p.x;
		this.yMax = p.y;
	}
	,doIntersect: function(b) {
		this.xMin = hxd_Math.imax(this.xMin,b.xMin);
		this.yMin = hxd_Math.imax(this.yMin,b.yMin);
		this.xMax = hxd_Math.imin(this.xMax,b.xMax);
		this.yMax = hxd_Math.imin(this.yMax,b.yMax);
	}
	,doUnion: function(b) {
		this.xMin = hxd_Math.imin(this.xMin,b.xMin);
		this.yMin = hxd_Math.imin(this.yMin,b.yMin);
		this.xMax = hxd_Math.imax(this.xMax,b.xMax);
		this.yMax = hxd_Math.imax(this.yMax,b.yMax);
	}
	,intersection: function(b) {
		var i = new h2d_col_Bounds();
		i.xMin = hxd_Math.imax(this.xMin,b.xMin);
		i.yMin = hxd_Math.imax(this.yMin,b.yMin);
		i.xMax = hxd_Math.imin(this.xMax,b.xMax);
		i.yMax = hxd_Math.imin(this.yMax,b.yMax);
		if(i.xMax < i.xMin) i.xMax = i.xMin;
		if(i.yMax < i.yMin) i.yMax = i.yMin;
		return i;
	}
	,union: function(b) {
		var i = new h2d_col_Bounds();
		i.xMin = hxd_Math.imin(this.xMin,b.xMin);
		i.yMin = hxd_Math.imin(this.yMin,b.yMin);
		i.xMax = hxd_Math.imax(this.xMax,b.xMax);
		i.yMax = hxd_Math.imax(this.yMax,b.yMax);
		return i;
	}
	,load: function(b) {
		this.xMin = b.xMin;
		this.yMin = b.yMin;
		this.xMax = b.xMax;
		this.yMax = b.yMax;
	}
	,offset: function(dx,dy) {
		this.xMin += dx;
		this.xMax += dx;
		this.yMin += dy;
		this.yMax += dy;
	}
	,getMin: function() {
		return new h2d_col_IPoint(this.xMin,this.yMin);
	}
	,getCenter: function() {
		return new h2d_col_IPoint(this.xMin + this.xMax >> 1,this.yMin + this.yMax >> 1);
	}
	,getSize: function() {
		return new h2d_col_IPoint(this.xMax - this.xMin,this.yMax - this.yMin);
	}
	,getMax: function() {
		return new h2d_col_IPoint(this.xMax,this.yMax);
	}
	,isEmpty: function() {
		return this.xMax <= this.xMin || this.yMax <= this.yMin;
	}
	,empty: function() {
		this.xMin = 2147483647;
		this.yMin = 2147483647;
		this.xMax = -2147483648;
		this.yMax = -2147483648;
	}
	,all: function() {
		this.xMin = -2147483648;
		this.yMin = -2147483648;
		this.xMax = 2147483647;
		this.yMax = 2147483647;
	}
	,clone: function() {
		var b = new h2d_col_Bounds();
		b.xMin = this.xMin;
		b.yMin = this.yMin;
		b.xMax = this.xMax;
		b.yMax = this.yMax;
		return b;
	}
	,get_x: function() {
		return this.xMin;
	}
	,get_y: function() {
		return this.yMin;
	}
	,set_x: function(x) {
		this.xMax += x - this.xMin;
		return this.xMin = x;
	}
	,set_y: function(y) {
		this.yMax += y - this.yMin;
		return this.yMin = y;
	}
	,get_width: function() {
		return this.xMax - this.xMin;
	}
	,get_height: function() {
		return this.yMax - this.yMin;
	}
	,set_width: function(w) {
		this.xMax = this.xMin + w;
		return w;
	}
	,set_height: function(h) {
		this.yMax = this.yMin + h;
		return h;
	}
	,toString: function() {
		return "{" + Std.string(new h2d_col_IPoint(this.xMin,this.yMin)) + "," + Std.string(new h2d_col_IPoint(this.xMax - this.xMin,this.yMax - this.yMin)) + "}";
	}
	,__class__: h2d_col_IBounds
};
var h2d_col_IPoint = function(x,y) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.x = x;
	this.y = y;
};
$hxClasses["h2d.col.IPoint"] = h2d_col_IPoint;
h2d_col_IPoint.__name__ = ["h2d","col","IPoint"];
h2d_col_IPoint.prototype = {
	toPoint: function(scale) {
		if(scale == null) scale = 1.;
		return new h2d_col_Point(this.x * scale,this.y * scale);
	}
	,distanceSq: function(p) {
		var dx = this.x - p.x;
		var dy = this.y - p.y;
		return dx * dx + dy * dy;
	}
	,distance: function(p) {
		return hxd_Math.sqrt(this.distanceSq(p));
	}
	,toString: function() {
		return "{" + this.x + "," + this.y + "}";
	}
	,sub: function(p) {
		return new h2d_col_Point(this.x - p.x,this.y - p.y);
	}
	,add: function(p) {
		return new h2d_col_Point(this.x + p.x,this.y + p.y);
	}
	,dot: function(p) {
		return this.x * p.x + this.y * p.y;
	}
	,lengthSq: function() {
		return this.x * this.x + this.y * this.y;
	}
	,length: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	,set: function(x,y) {
		this.x = x;
		this.y = y;
	}
	,clone: function() {
		return new h2d_col_IPoint(this.x,this.y);
	}
	,__class__: h2d_col_IPoint
};
var h2d_col_Matrix = function() {
	this.a = 1;
	this.b = 0;
	this.c = 0;
	this.d = 1;
	this.x = 0;
	this.y = 0;
};
$hxClasses["h2d.col.Matrix"] = h2d_col_Matrix;
h2d_col_Matrix.__name__ = ["h2d","col","Matrix"];
h2d_col_Matrix.prototype = {
	identity: function() {
		this.a = 1;
		this.b = 0;
		this.c = 0;
		this.d = 1;
		this.x = 0;
		this.y = 0;
	}
	,invert: function() {
		this.inverse(this);
	}
	,getDeterminant: function() {
		return this.a * this.d - this.b * this.c;
	}
	,inverse: function(m) {
		var a = m.a;
		var b = m.b;
		var c = m.c;
		var d = m.d;
		var x = m.x;
		var y = m.y;
		var invDet = 1 / (this.a * this.d - this.b * this.c);
		this.a = d * invDet;
		this.b = -b * invDet;
		this.c = -c * invDet;
		this.d = a * invDet;
		this.x = (-x * d + c * y) * invDet;
		this.y = (x * b - a * y) * invDet;
	}
	,transform: function(pt) {
		return new h2d_col_Point(pt.x * this.a + pt.y * this.c + this.x,pt.x * this.b + pt.y * this.d + this.y);
	}
	,translate: function(x,y) {
		this.x += x;
		this.y += y;
	}
	,prependTranslate: function(x,y) {
		this.x += this.a * x + this.c * y;
		this.y += this.b * x + this.d * y;
	}
	,multiply: function(a,b) {
		var aa = a.a;
		var ab = a.b;
		var ac = a.c;
		var ad = a.d;
		var ax = a.x;
		var ay = a.y;
		var ba = b.a;
		var bb = b.b;
		var bc = b.c;
		var bd = b.d;
		var bx = b.x;
		var by = b.y;
		this.a = aa * ba + ab * bc;
		this.b = aa * bb + ab * bd;
		this.c = ac * ba + ad * bc;
		this.d = ac * bb + ad * bd;
		this.x = ax * ba + ay * bc + bx;
		this.y = ax * bb + ay * bd + by;
	}
	,scale: function(sx,sy) {
		this.a *= sx;
		this.c *= sx;
		this.x *= sx;
		this.b *= sy;
		this.d *= sy;
		this.y *= sy;
	}
	,toString: function() {
		return "MAT=[\n" + "  [ " + hxd_Math.fmt(this.a) + ", " + hxd_Math.fmt(this.b) + " ]\n" + "  [ " + hxd_Math.fmt(this.c) + ", " + hxd_Math.fmt(this.d) + " ]\n" + "  [ " + hxd_Math.fmt(this.x) + ", " + hxd_Math.fmt(this.y) + " ]\n" + "]";
	}
	,__class__: h2d_col_Matrix
};
var h2d_col_Point = function(x,y) {
	if(y == null) y = 0.;
	if(x == null) x = 0.;
	this.x = x;
	this.y = y;
};
$hxClasses["h2d.col.Point"] = h2d_col_Point;
h2d_col_Point.__name__ = ["h2d","col","Point"];
h2d_col_Point.prototype = {
	toIPoint: function(scale) {
		if(scale == null) scale = 1.;
		return new h2d_col_IPoint(Math.floor(this.x * scale),Math.floor(this.y * scale));
	}
	,distanceSq: function(p) {
		var dx = this.x - p.x;
		var dy = this.y - p.y;
		return dx * dx + dy * dy;
	}
	,distance: function(p) {
		return hxd_Math.sqrt(this.distanceSq(p));
	}
	,toString: function() {
		return "{" + hxd_Math.fmt(this.x) + "," + hxd_Math.fmt(this.y) + "}";
	}
	,sub: function(p) {
		return new h2d_col_Point(this.x - p.x,this.y - p.y);
	}
	,add: function(p) {
		return new h2d_col_Point(this.x + p.x,this.y + p.y);
	}
	,dot: function(p) {
		return this.x * p.x + this.y * p.y;
	}
	,rotate: function(angle) {
		var c = Math.cos(angle);
		var s = Math.sin(angle);
		var x2 = this.x * c - this.y * s;
		var y2 = this.x * s + this.y * c;
		this.x = x2;
		this.y = y2;
	}
	,lengthSq: function() {
		return this.x * this.x + this.y * this.y;
	}
	,length: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	,normalize: function() {
		var k = this.x * this.x + this.y * this.y;
		if(k < 1e-10) k = 0; else k = 1. / Math.sqrt(k);
		this.x *= k;
		this.y *= k;
	}
	,normalizeFast: function() {
		var k = this.x * this.x + this.y * this.y;
		k = 1. / Math.sqrt(k);
		this.x *= k;
		this.y *= k;
	}
	,set: function(x,y) {
		this.x = x;
		this.y = y;
	}
	,scale: function(f) {
		this.x *= f;
		this.y *= f;
	}
	,clone: function() {
		return new h2d_col_Point(this.x,this.y);
	}
	,__class__: h2d_col_Point
};
var h2d_filter_Filter = function() {
	this.filter = false;
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
h3d_Buffer.ofSubFloats = function(v,stride,vertices,flags,allocPos) {
	var b = new h3d_Buffer(vertices,stride,flags,allocPos);
	b.uploadVector(v,0,vertices);
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
	,uploadBytes: function(data,dataPos,vertices) {
		var cur = this;
		while(vertices > 0) {
			if(cur == null) throw new js__$Boot_HaxeError("Too many vertices");
			var count;
			if(vertices > cur.vertices) count = cur.vertices; else count = vertices;
			cur.buffer.uploadVertexBytes(cur.position,count,data,dataPos);
			dataPos += count * this.buffer.stride * 4;
			vertices -= count;
			cur = cur.next;
		}
	}
	,__class__: h3d_Buffer
};
var h3d_BufferOffset = function(buffer,offset) {
	this.id = h3d_BufferOffset.UID++;
	this.buffer = buffer;
	this.offset = offset;
};
$hxClasses["h3d.BufferOffset"] = h3d_BufferOffset;
h3d_BufferOffset.__name__ = ["h3d","BufferOffset"];
h3d_BufferOffset.prototype = {
	dispose: function() {
		if(this.buffer != null) {
			this.buffer.dispose();
			this.buffer = null;
		}
		this.next = null;
	}
	,__class__: h3d_BufferOffset
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
	setFovX: function(fovX,withRatio) {
		var degToRad = Math.PI / 180;
		this.fovY = 2 * Math.atan(Math.tan(fovX * 0.5 * degToRad) / withRatio) / degToRad;
	}
	,getFovX: function() {
		var degToRad = Math.PI / 180;
		var halfFovX = Math.atan(Math.tan(this.fovY * 0.5 * degToRad) * this.screenRatio);
		var fovX = halfFovX * 2 / degToRad;
		return fovX;
	}
	,clone: function() {
		var c = new h3d_Camera(this.fovY,this.zoom,this.screenRatio,this.zNear,this.zFar,this.rightHanded);
		c.pos = this.pos.clone();
		c.up = this.up.clone();
		c.target = this.target.clone();
		c.update();
		return c;
	}
	,getInverseViewProj: function() {
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
	,lostUp: function() {
		var p2 = this.pos.clone();
		p2.normalize();
		return Math.abs(p2.dot3(this.up)) > 0.999;
	}
	,movePosAxis: function(dx,dy,dz) {
		if(dz == null) dz = 0.;
		var p = new h3d_Vector(dx,dy,dz);
		p.project(this.mcam);
		this.pos.x += p.x;
		this.pos.y += p.y;
		this.pos.z += p.z;
	}
	,moveTargetAxis: function(dx,dy,dz) {
		if(dz == null) dz = 0.;
		var p = new h3d_Vector(dx,dy,dz);
		p.project(this.mcam);
		this.target.x += p.x;
		this.target.y += p.y;
		this.target.z += p.z;
	}
	,forward: function(speed) {
		if(speed == null) speed = 1.;
		var c = 1 - 0.025 * speed;
		this.pos.set(this.target.x + (this.pos.x - this.target.x) * c,this.target.y + (this.pos.y - this.target.y) * c,this.target.z + (this.pos.z - this.target.z) * c,null);
	}
	,backward: function(speed) {
		if(speed == null) speed = 1.;
		var c = 1 + 0.025 * speed;
		this.pos.set(this.target.x + (this.pos.x - this.target.x) * c,this.target.y + (this.pos.y - this.target.y) * c,this.target.z + (this.pos.z - this.target.z) * c,null);
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
	,project: function(x,y,z,screenWidth,screenHeight,snapToPixel) {
		if(snapToPixel == null) snapToPixel = true;
		var p = new h3d_Vector(x,y,z);
		p.project(this.m);
		p.x = (p.x + 1) * 0.5 * screenWidth;
		p.y = (-p.y + 1) * 0.5 * screenHeight;
		if(snapToPixel) {
			p.x = Math.round(p.x);
			p.y = Math.round(p.y);
		}
		return p;
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
h3d_Engine.check = function() {
};
h3d_Engine.getCurrent = function() {
	return h3d_Engine.CURRENT;
};
h3d_Engine.prototype = {
	setDriver: function(d) {
		this.driver = d;
		if(this.mem != null) this.mem.driver = d;
	}
	,setCurrent: function() {
		h3d_Engine.CURRENT = this;
	}
	,init: function() {
		this.driver.init($bind(this,this.onCreate),!this.hardware);
	}
	,driverName: function(details) {
		if(details == null) details = false;
		return this.driver.getDriverName(details);
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
	,renderTriBuffer: function(b,start,max) {
		if(max == null) max = -1;
		if(start == null) start = 0;
		this.renderBuffer(b,this.mem.triIndexes,3,start,max);
		return;
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
	,renderMultiBuffers: function(buffers,indexes,startTri,drawTri) {
		if(drawTri == null) drawTri = -1;
		if(startTri == null) startTri = 0;
		var maxTri = indexes.count / 3 | 0;
		if(maxTri <= 0) return;
		if(this.needFlushTarget) this.doFlushTarget();
		this.driver.selectMultiBuffers(buffers);
		if(indexes.isDisposed()) return;
		if(drawTri < 0) drawTri = maxTri - startTri;
		if(drawTri > 0) {
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
	,pushTargets: function(textures) {
		if(this.nullTexture == null) this.nullTexture = new h3d_mat_Texture(0,0,[h3d_mat_TextureFlags.NoAlloc]);
		this.pushTarget(this.nullTexture);
		this.driver.setRenderTargets(textures);
		this.currentTarget = this.nullTexture;
		this.needFlushTarget = false;
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
	,flushTarget: function() {
		if(this.needFlushTarget) this.doFlushTarget();
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
	,setRenderZone: function(x,y,width,height) {
		if(height == null) height = -1;
		if(width == null) width = -1;
		if(y == null) y = 0;
		if(x == null) x = 0;
		this.driver.setRenderZone(x,y,width,height);
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
	,dispose: function() {
		this.driver.dispose();
		hxd_Stage.getInstance().removeResizeEvent($bind(this,this.onStageResize));
	}
	,get_fps: function() {
		return Math.ceil(this.realFps * 100) / 100;
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
	,uploadBytes: function(bytes,dataPos,indices) {
		this.mem.driver.uploadIndexBytes(this.ibuf,0,indices,bytes,dataPos);
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
h3d_Matrix.I = function() {
	var m = new h3d_Matrix();
	m.identity();
	return m;
};
h3d_Matrix.L = function(a) {
	var m = new h3d_Matrix();
	m.load(a);
	return m;
};
h3d_Matrix.T = function(x,y,z) {
	if(z == null) z = 0.;
	if(y == null) y = 0.;
	if(x == null) x = 0.;
	var m = new h3d_Matrix();
	m.initTranslate(x,y,z);
	return m;
};
h3d_Matrix.R = function(x,y,z) {
	var m = new h3d_Matrix();
	m.initRotate(x,y,z);
	return m;
};
h3d_Matrix.S = function(x,y,z) {
	if(z == null) z = 1.0;
	if(y == null) y = 1.;
	if(x == null) x = 1.;
	var m = new h3d_Matrix();
	m.initScale(x,y,z);
	return m;
};
h3d_Matrix.lookAtX = function(dir,up,m) {
	if(up == null) up = new h3d_Vector(0,0,1);
	if(m == null) m = new h3d_Matrix();
	var ax = dir.getNormalized();
	var ay = new h3d_Vector(up.y * ax.z - up.z * ax.y,up.z * ax.x - up.x * ax.z,up.x * ax.y - up.y * ax.x,1).getNormalized();
	if(ay.x * ay.x + ay.y * ay.y + ay.z * ay.z < 1e-10) {
		ay.x = ax.y;
		ay.y = ax.z;
		ay.z = ax.x;
	}
	var az_x = ax.y * ay.z - ax.z * ay.y;
	var az_y = ax.z * ay.x - ax.x * ay.z;
	var az_z = ax.x * ay.y - ax.y * ay.x;
	var az_w = 1;
	m._11 = ax.x;
	m._12 = ax.y;
	m._13 = ax.z;
	m._14 = 0;
	m._21 = ay.x;
	m._22 = ay.y;
	m._23 = ay.z;
	m._24 = 0;
	m._31 = az_x;
	m._32 = az_y;
	m._33 = az_z;
	m._34 = 0;
	m._41 = 0;
	m._42 = 0;
	m._43 = 0;
	m._44 = 1;
	return m;
};
h3d_Matrix.prototype = {
	get_tx: function() {
		return this._41;
	}
	,get_ty: function() {
		return this._42;
	}
	,get_tz: function() {
		return this._43;
	}
	,set_tx: function(v) {
		return this._41 = v;
	}
	,set_ty: function(v) {
		return this._42 = v;
	}
	,set_tz: function(v) {
		return this._43 = v;
	}
	,zero: function() {
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
	,initRotateX: function(a) {
		var cos = Math.cos(a);
		var sin = Math.sin(a);
		this._11 = 1.0;
		this._12 = 0.0;
		this._13 = 0.0;
		this._14 = 0.0;
		this._21 = 0.0;
		this._22 = cos;
		this._23 = sin;
		this._24 = 0.0;
		this._31 = 0.0;
		this._32 = -sin;
		this._33 = cos;
		this._34 = 0.0;
		this._41 = 0.0;
		this._42 = 0.0;
		this._43 = 0.0;
		this._44 = 1.0;
	}
	,initRotateY: function(a) {
		var cos = Math.cos(a);
		var sin = Math.sin(a);
		this._11 = cos;
		this._12 = 0.0;
		this._13 = -sin;
		this._14 = 0.0;
		this._21 = 0.0;
		this._22 = 1.0;
		this._23 = 0.0;
		this._24 = 0.0;
		this._31 = sin;
		this._32 = 0.0;
		this._33 = cos;
		this._34 = 0.0;
		this._41 = 0.0;
		this._42 = 0.0;
		this._43 = 0.0;
		this._44 = 1.0;
	}
	,initRotateZ: function(a) {
		var cos = Math.cos(a);
		var sin = Math.sin(a);
		this._11 = cos;
		this._12 = sin;
		this._13 = 0.0;
		this._14 = 0.0;
		this._21 = -sin;
		this._22 = cos;
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
	,initTranslate: function(x,y,z) {
		if(z == null) z = 0.;
		if(y == null) y = 0.;
		if(x == null) x = 0.;
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
		this._41 = x;
		this._42 = y;
		this._43 = z;
		this._44 = 1.0;
	}
	,initScale: function(x,y,z) {
		if(z == null) z = 1.;
		if(y == null) y = 1.;
		if(x == null) x = 1.;
		this._11 = x;
		this._12 = 0.0;
		this._13 = 0.0;
		this._14 = 0.0;
		this._21 = 0.0;
		this._22 = y;
		this._23 = 0.0;
		this._24 = 0.0;
		this._31 = 0.0;
		this._32 = 0.0;
		this._33 = z;
		this._34 = 0.0;
		this._41 = 0.0;
		this._42 = 0.0;
		this._43 = 0.0;
		this._44 = 1.0;
	}
	,initRotateAxis: function(axis,angle) {
		var cos = Math.cos(angle);
		var sin = Math.sin(angle);
		var cos1 = 1 - cos;
		var x = -axis.x;
		var y = -axis.y;
		var z = -axis.z;
		var xx = x * x;
		var yy = y * y;
		var zz = z * z;
		var len = 1. / Math.sqrt(xx + yy + zz);
		x *= len;
		y *= len;
		z *= len;
		var xcos1 = x * cos1;
		var zcos1 = z * cos1;
		this._11 = cos + x * xcos1;
		this._12 = y * xcos1 - z * sin;
		this._13 = x * zcos1 + y * sin;
		this._14 = 0.;
		this._21 = y * xcos1 + z * sin;
		this._22 = cos + y * y * cos1;
		this._23 = y * zcos1 - x * sin;
		this._24 = 0.;
		this._31 = x * zcos1 - y * sin;
		this._32 = y * zcos1 + x * sin;
		this._33 = cos + z * zcos1;
		this._34 = 0.;
		this._41 = 0.;
		this._42 = 0.;
		this._43 = 0.;
		this._44 = 1.;
	}
	,initRotate: function(x,y,z) {
		var cx = Math.cos(x);
		var sx = Math.sin(x);
		var cy = Math.cos(y);
		var sy = Math.sin(y);
		var cz = Math.cos(z);
		var sz = Math.sin(z);
		var cxsy = cx * sy;
		var sxsy = sx * sy;
		this._11 = cy * cz;
		this._12 = cy * sz;
		this._13 = -sy;
		this._14 = 0;
		this._21 = sxsy * cz - cx * sz;
		this._22 = sxsy * sz + cx * cz;
		this._23 = sx * cy;
		this._24 = 0;
		this._31 = cxsy * cz + sx * sz;
		this._32 = cxsy * sz - sx * cz;
		this._33 = cx * cy;
		this._34 = 0;
		this._41 = 0;
		this._42 = 0;
		this._43 = 0;
		this._44 = 1;
	}
	,translate: function(x,y,z) {
		if(z == null) z = 0.;
		if(y == null) y = 0.;
		if(x == null) x = 0.;
		this._11 += x * this._14;
		this._12 += y * this._14;
		this._13 += z * this._14;
		this._21 += x * this._24;
		this._22 += y * this._24;
		this._23 += z * this._24;
		this._31 += x * this._34;
		this._32 += y * this._34;
		this._33 += z * this._34;
		this._41 += x * this._44;
		this._42 += y * this._44;
		this._43 += z * this._44;
	}
	,scale: function(x,y,z) {
		if(z == null) z = 1.;
		if(y == null) y = 1.;
		if(x == null) x = 1.;
		this._11 *= x;
		this._21 *= x;
		this._31 *= x;
		this._41 *= x;
		this._12 *= y;
		this._22 *= y;
		this._32 *= y;
		this._42 *= y;
		this._13 *= z;
		this._23 *= z;
		this._33 *= z;
		this._43 *= z;
	}
	,rotate: function(x,y,z) {
		var tmp = h3d_Matrix.tmp;
		tmp.initRotate(x,y,z);
		this.multiply(this,tmp);
	}
	,rotateAxis: function(axis,angle) {
		var tmp = h3d_Matrix.tmp;
		tmp.initRotateAxis(axis,angle);
		this.multiply(this,tmp);
	}
	,pos: function(v) {
		if(v == null) return new h3d_Vector(this._41,this._42,this._43,this._44);
		v.x = this._41;
		v.y = this._42;
		v.z = this._43;
		v.w = this._44;
		return v;
	}
	,prependTranslate: function(x,y,z) {
		if(z == null) z = 0.;
		if(y == null) y = 0.;
		if(x == null) x = 0.;
		var vx = this._11 * x + this._21 * y + this._31 * z + this._41;
		var vy = this._12 * x + this._22 * y + this._32 * z + this._42;
		var vz = this._13 * x + this._23 * y + this._33 * z + this._43;
		var vw = this._14 * x + this._24 * y + this._34 * z + this._44;
		this._41 = vx;
		this._42 = vy;
		this._43 = vz;
		this._44 = vw;
	}
	,getScale: function() {
		var v = new h3d_Vector();
		v.x = Math.sqrt(this._11 * this._11 + this._12 * this._12 + this._13 * this._13);
		v.y = Math.sqrt(this._21 * this._21 + this._22 * this._22 + this._23 * this._23);
		v.z = Math.sqrt(this._31 * this._31 + this._32 * this._32 + this._33 * this._33);
		if(this._11 * (this._22 * this._33 - this._23 * this._32) + this._12 * (this._23 * this._31 - this._21 * this._33) + this._13 * (this._21 * this._32 - this._22 * this._31) < 0) {
			v.x *= -1;
			v.y *= -1;
			v.z *= -1;
		}
		return v;
	}
	,prependRotate: function(x,y,z) {
		var tmp = h3d_Matrix.tmp;
		tmp.initRotate(x,y,z);
		this.multiply(tmp,this);
	}
	,prependRotateAxis: function(axis,angle) {
		var tmp = h3d_Matrix.tmp;
		tmp.initRotateAxis(axis,angle);
		this.multiply(tmp,this);
	}
	,prependScale: function(sx,sy,sz) {
		if(sz == null) sz = 1.;
		if(sy == null) sy = 1.;
		if(sx == null) sx = 1.;
		var tmp = h3d_Matrix.tmp;
		tmp.initScale(sx,sy,sz);
		this.multiply(tmp,this);
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
	,multiplyValue: function(v) {
		this._11 *= v;
		this._12 *= v;
		this._13 *= v;
		this._14 *= v;
		this._21 *= v;
		this._22 *= v;
		this._23 *= v;
		this._24 *= v;
		this._31 *= v;
		this._32 *= v;
		this._33 *= v;
		this._34 *= v;
		this._41 *= v;
		this._42 *= v;
		this._43 *= v;
		this._44 *= v;
	}
	,invert: function() {
		this.inverse(this);
	}
	,getDeterminant: function() {
		return this._11 * (this._22 * this._33 - this._23 * this._32) + this._12 * (this._23 * this._31 - this._21 * this._33) + this._13 * (this._21 * this._32 - this._22 * this._31);
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
	,transpose: function() {
		var tmp;
		tmp = this._12;
		this._12 = this._21;
		this._21 = tmp;
		tmp = this._13;
		this._13 = this._31;
		this._31 = tmp;
		tmp = this._14;
		this._14 = this._41;
		this._41 = tmp;
		tmp = this._23;
		this._23 = this._32;
		this._32 = tmp;
		tmp = this._24;
		this._24 = this._42;
		this._42 = tmp;
		tmp = this._34;
		this._34 = this._43;
		this._43 = tmp;
	}
	,clone: function() {
		var m = new h3d_Matrix();
		m._11 = this._11;
		m._12 = this._12;
		m._13 = this._13;
		m._14 = this._14;
		m._21 = this._21;
		m._22 = this._22;
		m._23 = this._23;
		m._24 = this._24;
		m._31 = this._31;
		m._32 = this._32;
		m._33 = this._33;
		m._34 = this._34;
		m._41 = this._41;
		m._42 = this._42;
		m._43 = this._43;
		m._44 = this._44;
		return m;
	}
	,loadFrom: function(m) {
		this._11 = m._11;
		this._12 = m._12;
		this._13 = m._13;
		this._14 = m._14;
		this._21 = m._21;
		this._22 = m._22;
		this._23 = m._23;
		this._24 = m._24;
		this._31 = m._31;
		this._32 = m._32;
		this._33 = m._33;
		this._34 = m._34;
		this._41 = m._41;
		this._42 = m._42;
		this._43 = m._43;
		this._44 = m._44;
	}
	,load: function(a) {
		this._11 = a[0];
		this._12 = a[1];
		this._13 = a[2];
		this._14 = a[3];
		this._21 = a[4];
		this._22 = a[5];
		this._23 = a[6];
		this._24 = a[7];
		this._31 = a[8];
		this._32 = a[9];
		this._33 = a[10];
		this._34 = a[11];
		this._41 = a[12];
		this._42 = a[13];
		this._43 = a[14];
		this._44 = a[15];
	}
	,getFloats: function() {
		return [this._11,this._12,this._13,this._14,this._21,this._22,this._23,this._24,this._31,this._32,this._33,this._34,this._41,this._42,this._43,this._44];
	}
	,toString: function() {
		return "MAT=[\n" + "  [ " + hxd_Math.fmt(this._11) + ", " + hxd_Math.fmt(this._12) + ", " + hxd_Math.fmt(this._13) + ", " + hxd_Math.fmt(this._14) + " ]\n" + "  [ " + hxd_Math.fmt(this._21) + ", " + hxd_Math.fmt(this._22) + ", " + hxd_Math.fmt(this._23) + ", " + hxd_Math.fmt(this._24) + " ]\n" + "  [ " + hxd_Math.fmt(this._31) + ", " + hxd_Math.fmt(this._32) + ", " + hxd_Math.fmt(this._33) + ", " + hxd_Math.fmt(this._34) + " ]\n" + "  [ " + hxd_Math.fmt(this._41) + ", " + hxd_Math.fmt(this._42) + ", " + hxd_Math.fmt(this._43) + ", " + hxd_Math.fmt(this._44) + " ]\n" + "]";
	}
	,colorHue: function(hue) {
		if(hue == 0.) return;
		var cosA = Math.cos(-hue);
		var sinA = Math.sin(-hue);
		var ch = (1 - cosA) / 3;
		h3d_Matrix.tmp._11 = cosA + ch;
		h3d_Matrix.tmp._12 = ch - 0.57735026918962576450914878050196 * sinA;
		h3d_Matrix.tmp._13 = ch + 0.57735026918962576450914878050196 * sinA;
		h3d_Matrix.tmp._21 = ch + 0.57735026918962576450914878050196 * sinA;
		h3d_Matrix.tmp._22 = cosA + ch;
		h3d_Matrix.tmp._23 = ch - 0.57735026918962576450914878050196 * sinA;
		h3d_Matrix.tmp._31 = ch - 0.57735026918962576450914878050196 * sinA;
		h3d_Matrix.tmp._32 = ch + 0.57735026918962576450914878050196 * sinA;
		h3d_Matrix.tmp._33 = cosA + ch;
		h3d_Matrix.tmp._34 = 0;
		h3d_Matrix.tmp._41 = 0;
		h3d_Matrix.tmp._42 = 0;
		h3d_Matrix.tmp._43 = 0;
		this.multiply3x4(this,h3d_Matrix.tmp);
	}
	,colorSaturation: function(sat) {
		var $is = 1 - sat;
		var r = $is * 0.212671;
		var g = $is * 0.71516;
		var b = $is * 0.072169;
		h3d_Matrix.tmp._11 = r + sat;
		h3d_Matrix.tmp._12 = r;
		h3d_Matrix.tmp._13 = r;
		h3d_Matrix.tmp._21 = g;
		h3d_Matrix.tmp._22 = g + sat;
		h3d_Matrix.tmp._23 = g;
		h3d_Matrix.tmp._31 = b;
		h3d_Matrix.tmp._32 = b;
		h3d_Matrix.tmp._33 = b + sat;
		h3d_Matrix.tmp._41 = 0;
		h3d_Matrix.tmp._42 = 0;
		h3d_Matrix.tmp._43 = 0;
		this.multiply3x4(this,h3d_Matrix.tmp);
	}
	,colorContrast: function(contrast) {
		var v = contrast + 1;
		h3d_Matrix.tmp._11 = v;
		h3d_Matrix.tmp._12 = 0;
		h3d_Matrix.tmp._13 = 0;
		h3d_Matrix.tmp._21 = 0;
		h3d_Matrix.tmp._22 = v;
		h3d_Matrix.tmp._23 = 0;
		h3d_Matrix.tmp._31 = 0;
		h3d_Matrix.tmp._32 = 0;
		h3d_Matrix.tmp._33 = v;
		h3d_Matrix.tmp._41 = -contrast * 0.5;
		h3d_Matrix.tmp._42 = -contrast * 0.5;
		h3d_Matrix.tmp._43 = -contrast * 0.5;
		this.multiply3x4(this,h3d_Matrix.tmp);
	}
	,colorBrightness: function(brightness) {
		this._41 += brightness;
		this._42 += brightness;
		this._43 += brightness;
	}
	,colorBits: function(bits,blend) {
		var t11 = 0.;
		var t12 = 0.;
		var t13 = 0.;
		var t21 = 0.;
		var t22 = 0.;
		var t23 = 0.;
		var t31 = 0.;
		var t32 = 0.;
		var t33 = 0.;
		var c = bits;
		if((c & 1) == 1) t11 = 1;
		c >>= 1;
		if((c & 1) == 1) t12 = 1;
		c >>= 1;
		if((c & 1) == 1) t13 = 1;
		c >>= 1;
		if((c & 1) == 1) t21 = 1;
		c >>= 1;
		if((c & 1) == 1) t22 = 1;
		c >>= 1;
		if((c & 1) == 1) t23 = 1;
		c >>= 1;
		if((c & 1) == 1) t31 = 1;
		c >>= 1;
		if((c & 1) == 1) t32 = 1;
		c >>= 1;
		if((c & 1) == 1) t33 = 1;
		c >>= 1;
		var r = t11 + t21 + t31;
		var g = t12 + t22 + t32;
		var b = t13 + t23 + t33;
		if(r > 1) {
			t11 /= r;
			t21 /= r;
			t31 /= r;
		}
		if(g > 1) {
			t12 /= g;
			t22 /= g;
			t32 /= g;
		}
		if(b > 1) {
			t13 /= b;
			t23 /= b;
			t33 /= b;
		}
		var b11 = this._11 * t11 + this._12 * t21 + this._13 * t31;
		var b12 = this._11 * t12 + this._12 * t22 + this._13 * t32;
		var b13 = this._11 * t13 + this._12 * t23 + this._13 * t33;
		var b21 = this._21 * t11 + this._22 * t21 + this._23 * t31;
		var b22 = this._21 * t12 + this._22 * t22 + this._23 * t32;
		var b23 = this._21 * t13 + this._22 * t23 + this._23 * t33;
		var b31 = this._31 * t11 + this._32 * t21 + this._33 * t31;
		var b32 = this._31 * t12 + this._32 * t22 + this._33 * t32;
		var b33 = this._31 * t13 + this._32 * t23 + this._33 * t33;
		var ik = blend;
		var k = 1 - ik;
		this._11 = this._11 * k + b11 * ik;
		this._12 = this._12 * k + b12 * ik;
		this._13 = this._13 * k + b13 * ik;
		this._21 = this._21 * k + b21 * ik;
		this._22 = this._22 * k + b22 * ik;
		this._23 = this._23 * k + b23 * ik;
		this._31 = this._31 * k + b31 * ik;
		this._32 = this._32 * k + b32 * ik;
		this._33 = this._33 * k + b33 * ik;
	}
	,colorAdd: function(c) {
		this._41 += (c >> 16 & 255) / 255;
		this._42 += (c >> 8 & 255) / 255;
		this._43 += (c & 255) / 255;
	}
	,colorSet: function(c,alpha) {
		if(alpha == null) alpha = 1.;
		this.zero();
		this._44 = alpha;
		this._41 += (c >> 16 & 255) / 255;
		this._42 += (c >> 8 & 255) / 255;
		this._43 += (c & 255) / 255;
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
	set: function(x,y,z,w) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}
	,identity: function() {
		this.x = this.y = this.z = 0;
		this.w = 1;
	}
	,lengthSq: function() {
		return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
	}
	,length: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
	}
	,clone: function() {
		return new h3d_Quat(this.x,this.y,this.z,this.w);
	}
	,initMoveTo: function(from,to) {
		var hx = from.x + to.x;
		var hy = from.y + to.y;
		var hz = from.z + to.z;
		var h = 1. / Math.sqrt(hx * hx + hy * hy + hz * hz);
		this.x = from.y * hz - from.z * hy;
		this.y = from.z * hx - from.x * hz;
		this.z = from.x * hy - from.y * hx;
		this.w = from.x * hx + from.y * hy + from.z * hz;
		this.normalize();
	}
	,initDirection: function(dir) {
		var ax = new h3d_Vector(dir.x,dir.y,dir.z,dir.w).getNormalized();
		var ay = new h3d_Vector(-ax.y,ax.x,0).getNormalized();
		if(ay.x * ay.x + ay.y * ay.y + ay.z * ay.z < 1e-10) {
			ay.x = ax.y;
			ay.y = ax.z;
			ay.z = ax.x;
		}
		var az_x = ax.y * ay.z - ax.z * ay.y;
		var az_y = ax.z * ay.x - ax.x * ay.z;
		var az_z = ax.x * ay.y - ax.y * ay.x;
		var az_w = 1;
		var tr = ax.x + ay.y + az_z;
		if(tr > 0) {
			var s = Math.sqrt(tr + 1.0) * 2;
			var $is = 1 / s;
			this.x = (ay.z - az_y) * $is;
			this.y = (az_x - ax.z) * $is;
			this.z = (ax.y - ay.x) * $is;
			this.w = 0.25 * s;
		} else if(ax.x > ay.y && ax.x > az_z) {
			var s1 = Math.sqrt(1.0 + ax.x - ay.y - az_z) * 2;
			var is1 = 1 / s1;
			this.x = 0.25 * s1;
			this.y = (ay.x + ax.y) * is1;
			this.z = (az_x + ax.z) * is1;
			this.w = (ay.z - az_y) * is1;
		} else if(ay.y > az_z) {
			var s2 = Math.sqrt(1.0 + ay.y - ax.x - az_z) * 2;
			var is2 = 1 / s2;
			this.x = (ay.x + ax.y) * is2;
			this.y = 0.25 * s2;
			this.z = (az_y + ay.z) * is2;
			this.w = (az_x - ax.z) * is2;
		} else {
			var s3 = Math.sqrt(1.0 + az_z - ax.x - ay.y) * 2;
			var is3 = 1 / s3;
			this.x = (az_x + ax.z) * is3;
			this.y = (az_y + ay.z) * is3;
			this.z = 0.25 * s3;
			this.w = (ax.y - ay.x) * is3;
		}
	}
	,initRotateAxis: function(x,y,z,a) {
		var sin = Math.sin(a / 2);
		var cos = Math.cos(a / 2);
		this.x = x * sin;
		this.y = y * sin;
		this.z = z * sin;
		this.w = cos * Math.sqrt(x * x + y * y + z * z);
		this.normalize();
	}
	,initRotateMatrix: function(m) {
		var tr = m._11 + m._22 + m._33;
		if(tr > 0) {
			var s = Math.sqrt(tr + 1.0) * 2;
			var $is = 1 / s;
			this.x = (m._23 - m._32) * $is;
			this.y = (m._31 - m._13) * $is;
			this.z = (m._12 - m._21) * $is;
			this.w = 0.25 * s;
		} else if(m._11 > m._22 && m._11 > m._33) {
			var s1 = Math.sqrt(1.0 + m._11 - m._22 - m._33) * 2;
			var is1 = 1 / s1;
			this.x = 0.25 * s1;
			this.y = (m._21 + m._12) * is1;
			this.z = (m._31 + m._13) * is1;
			this.w = (m._23 - m._32) * is1;
		} else if(m._22 > m._33) {
			var s2 = Math.sqrt(1.0 + m._22 - m._11 - m._33) * 2;
			var is2 = 1 / s2;
			this.x = (m._21 + m._12) * is2;
			this.y = 0.25 * s2;
			this.z = (m._32 + m._23) * is2;
			this.w = (m._31 - m._13) * is2;
		} else {
			var s3 = Math.sqrt(1.0 + m._33 - m._11 - m._22) * 2;
			var is3 = 1 / s3;
			this.x = (m._31 + m._13) * is3;
			this.y = (m._32 + m._23) * is3;
			this.z = 0.25 * s3;
			this.w = (m._12 - m._21) * is3;
		}
	}
	,normalize: function() {
		var len = this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
		if(len < 1e-10) {
			this.x = this.y = this.z = 0;
			this.w = 1;
		} else {
			var m = 1. / Math.sqrt(len);
			this.x *= m;
			this.y *= m;
			this.z *= m;
			this.w *= m;
		}
	}
	,initRotate: function(ax,ay,az) {
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
	,multiply: function(q1,q2) {
		var x2 = q1.x * q2.w + q1.w * q2.x + q1.y * q2.z - q1.z * q2.y;
		var y2 = q1.w * q2.y - q1.x * q2.z + q1.y * q2.w + q1.z * q2.x;
		var z2 = q1.w * q2.z + q1.x * q2.y - q1.y * q2.x + q1.z * q2.w;
		var w2 = q1.w * q2.w - q1.x * q2.x - q1.y * q2.y - q1.z * q2.z;
		this.x = x2;
		this.y = y2;
		this.z = z2;
		this.w = w2;
	}
	,toMatrix: function() {
		var m = new h3d_Matrix();
		this.saveToMatrix(m);
		return m;
	}
	,__toEuler: function() {
		var q = this.x * this.y + this.z * this.w;
		return new h3d_Vector(Math.atan2(2 * (this.x * this.w - this.y * this.z),1 - 2 * (this.x * this.x + this.z * this.z)),Math.atan2(2 * (this.y * this.w - this.x * this.z),1 - 2 * (this.y * this.y + this.z * this.z)),Math.asin(2 * q));
	}
	,lerp: function(q1,q2,v,nearest) {
		if(nearest == null) nearest = false;
		var v2;
		if(nearest && q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w < 0) v2 = v - 1; else v2 = 1 - v;
		var x = q1.x * v + q2.x * v2;
		var y = q1.y * v + q2.y * v2;
		var z = q1.z * v + q2.z * v2;
		var w = q1.w * v + q2.w * v2;
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}
	,slerp: function(q1,q2,v) {
		var cosHalfTheta = q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w;
		if((cosHalfTheta < 0?-cosHalfTheta:cosHalfTheta) >= 1) {
			this.x = q1.x;
			this.y = q1.y;
			this.z = q1.z;
			this.w = q1.w;
			return;
		}
		var halfTheta = Math.acos(cosHalfTheta);
		var invSinHalfTheta = 1. / Math.sqrt(1 - cosHalfTheta * cosHalfTheta);
		if((invSinHalfTheta < 0?-invSinHalfTheta:invSinHalfTheta) > 1e3) {
			this.lerp(q1,q2,0.5,true);
			return;
		}
		var a = Math.sin((1 - v) * halfTheta) * invSinHalfTheta;
		var b;
		b = Math.sin(v * halfTheta) * invSinHalfTheta * (cosHalfTheta < 0?-1:1);
		this.x = q1.x * a + q2.x * b;
		this.y = q1.y * a + q2.y * b;
		this.z = q1.z * a + q2.z * b;
		this.w = q1.w * a + q2.w * b;
	}
	,conjugate: function() {
		this.x = -this.x;
		this.y = -this.y;
		this.z = -this.z;
	}
	,negate: function() {
		this.x = -this.x;
		this.y = -this.y;
		this.z = -this.z;
		this.w = -this.w;
	}
	,dot: function(q) {
		return this.x * q.x + this.y * q.y + this.z * q.z + this.w * q.w;
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
	,toString: function() {
		return "{" + hxd_Math.fmt(this.x) + "," + hxd_Math.fmt(this.y) + "," + hxd_Math.fmt(this.z) + "," + hxd_Math.fmt(this.w) + "}";
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
h3d_Vector.fromColor = function(c,scale) {
	if(scale == null) scale = 1.0;
	var s = scale / 255;
	return new h3d_Vector((c >> 16 & 255) * s,(c >> 8 & 255) * s,(c & 255) * s,(c >>> 24) * s);
};
h3d_Vector.prototype = {
	distance: function(v) {
		return hxd_Math.sqrt(this.distanceSq(v));
	}
	,distanceSq: function(v) {
		var dx = v.x - this.x;
		var dy = v.y - this.y;
		var dz = v.z - this.z;
		return dx * dx + dy * dy + dz * dz;
	}
	,sub: function(v) {
		return new h3d_Vector(this.x - v.x,this.y - v.y,this.z - v.z,this.w - v.w);
	}
	,add: function(v) {
		return new h3d_Vector(this.x + v.x,this.y + v.y,this.z + v.z,this.w + v.w);
	}
	,cross: function(v) {
		return new h3d_Vector(this.y * v.z - this.z * v.y,this.z * v.x - this.x * v.z,this.x * v.y - this.y * v.x,1);
	}
	,reflect: function(n) {
		var k = 2 * (this.x * n.x + this.y * n.y + this.z * n.z);
		return new h3d_Vector(this.x - k * n.x,this.y - k * n.y,this.z - k * n.z,1);
	}
	,dot3: function(v) {
		return this.x * v.x + this.y * v.y + this.z * v.z;
	}
	,dot4: function(v) {
		return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
	}
	,lengthSq: function() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}
	,length: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}
	,normalize: function() {
		var k = this.x * this.x + this.y * this.y + this.z * this.z;
		if(k < 1e-10) k = 0; else k = 1. / Math.sqrt(k);
		this.x *= k;
		this.y *= k;
		this.z *= k;
	}
	,normalizeFast: function() {
		var k = 1. / Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
		this.x *= k;
		this.y *= k;
		this.z *= k;
	}
	,getNormalized: function() {
		var k = this.x * this.x + this.y * this.y + this.z * this.z;
		if(k < 1e-10) k = 0; else k = 1. / Math.sqrt(k);
		return new h3d_Vector(this.x * k,this.y * k,this.z * k);
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
	,scale3: function(f) {
		this.x *= f;
		this.y *= f;
		this.z *= f;
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
	,lerp: function(v1,v2,k) {
		var x = hxd_Math.lerp(v1.x,v2.x,k);
		var y = hxd_Math.lerp(v1.y,v2.y,k);
		var z = hxd_Math.lerp(v1.z,v2.z,k);
		var w = hxd_Math.lerp(v1.w,v2.w,k);
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
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
	,transform: function(m) {
		var px = this.x * m._11 + this.y * m._21 + this.z * m._31 + this.w * m._41;
		var py = this.x * m._12 + this.y * m._22 + this.z * m._32 + this.w * m._42;
		var pz = this.x * m._13 + this.y * m._23 + this.z * m._33 + this.w * m._43;
		var pw = this.x * m._14 + this.y * m._24 + this.z * m._34 + this.w * m._44;
		this.x = px;
		this.y = py;
		this.z = pz;
		this.w = pw;
	}
	,clone: function() {
		return new h3d_Vector(this.x,this.y,this.z,this.w);
	}
	,toPoint: function() {
		return new h3d_col_Point(this.x,this.y,this.z);
	}
	,toString: function() {
		return "{" + hxd_Math.fmt(this.x) + "," + hxd_Math.fmt(this.y) + "," + hxd_Math.fmt(this.z) + "," + hxd_Math.fmt(this.w) + "}";
	}
	,get_r: function() {
		return this.x;
	}
	,get_g: function() {
		return this.y;
	}
	,get_b: function() {
		return this.z;
	}
	,get_a: function() {
		return this.w;
	}
	,set_r: function(v) {
		return this.x = v;
	}
	,set_g: function(v) {
		return this.y = v;
	}
	,set_b: function(v) {
		return this.z = v;
	}
	,set_a: function(v) {
		return this.w = v;
	}
	,setColor: function(c,scale) {
		if(scale == null) scale = 1.0;
		var s = scale / 255;
		this.x = (c >> 16 & 255) * s;
		this.y = (c >> 8 & 255) * s;
		this.z = (c & 255) * s;
		this.w = (c >>> 24) * s;
	}
	,makeColor: function(hue,saturation,brightness) {
		if(brightness == null) brightness = 0.5;
		if(saturation == null) saturation = 1.;
		hue = hxd_Math.ufmod(hue,6.28318530717958623);
		var c = (1 - hxd_Math.abs(2 * brightness - 1)) * saturation;
		var x = c * (1 - hxd_Math.abs(hue * 3 / 3.14159265358979323 % 2. - 1));
		var m = brightness - c / 2;
		if(hue < 1.04719755119659763) {
			this.x = c;
			this.y = x;
			this.z = 0;
		} else if(hue < 2.09439510239319526) {
			this.x = x;
			this.y = c;
			this.z = 0;
		} else if(hue < 3.14159265358979323) {
			this.x = 0;
			this.y = c;
			this.z = x;
		} else if(hue < 4.18879020478639053) {
			this.x = 0;
			this.y = x;
			this.z = c;
		} else if(hue < 5.23598775598298882) {
			this.x = x;
			this.y = 0;
			this.z = c;
		} else {
			this.x = c;
			this.y = 0;
			this.z = x;
		}
		var _g = this;
		_g.x = _g.x + m;
		var _g1 = this;
		_g1.y = _g1.y + m;
		var _g2 = this;
		_g2.z = _g2.z + m;
		this.w = 1;
	}
	,toColor: function() {
		return Std["int"](hxd_Math.clamp(this.w,null,null) * 255 + 0.499) << 24 | Std["int"](hxd_Math.clamp(this.x,null,null) * 255 + 0.499) << 16 | Std["int"](hxd_Math.clamp(this.y,null,null) * 255 + 0.499) << 8 | Std["int"](hxd_Math.clamp(this.z,null,null) * 255 + 0.499);
	}
	,__class__: h3d_Vector
};
var h3d_anim_AnimatedObject = function(name) {
	this.objectName = name;
};
$hxClasses["h3d.anim.AnimatedObject"] = h3d_anim_AnimatedObject;
h3d_anim_AnimatedObject.__name__ = ["h3d","anim","AnimatedObject"];
h3d_anim_AnimatedObject.prototype = {
	clone: function() {
		return new h3d_anim_AnimatedObject(this.objectName);
	}
	,__class__: h3d_anim_AnimatedObject
};
var h3d_anim_Animation = function(name,frameCount,sampling) {
	this.name = name;
	this.frameCount = frameCount;
	this.sampling = sampling;
	this.objects = [];
	this.lastEvent = -1;
	this.frame = 0.;
	this.speed = 1.;
	this.loop = true;
	this.pause = false;
};
$hxClasses["h3d.anim.Animation"] = h3d_anim_Animation;
h3d_anim_Animation.__name__ = ["h3d","anim","Animation"];
h3d_anim_Animation.prototype = {
	getIFrame: function() {
		var f = this.frame | 0;
		var max = this.endFrame();
		if(f == max) f--;
		return f;
	}
	,unbind: function(objectName) {
		var _g = 0;
		var _g1 = this.objects;
		while(_g < _g1.length) {
			var o = _g1[_g];
			++_g;
			if(o.objectName == objectName) {
				this.isSync = false;
				o.targetObject = null;
				o.targetSkin = null;
				return;
			}
		}
	}
	,setEvents: function(el) {
		var _g = [];
		var _g2 = 0;
		var _g1 = this.frameCount;
		while(_g2 < _g1) {
			var i = _g2++;
			_g.push(null);
		}
		this.events = _g;
		var $it0 = $iterator(el)();
		while( $it0.hasNext() ) {
			var e = $it0.next();
			this.events[e.frame] = e.data;
		}
	}
	,setFrame: function(f) {
		this.frame = f;
		this.lastEvent = -1;
		while(this.frame < 0) this.frame += this.frameCount;
		while(this.frame > this.frameCount) this.frame -= this.frameCount;
	}
	,clone: function(a) {
		if(a == null) a = new h3d_anim_Animation(this.name,this.frameCount,this.sampling);
		a.objects = this.objects;
		a.speed = this.speed;
		a.loop = this.loop;
		a.pause = this.pause;
		a.events = this.events;
		return a;
	}
	,initInstance: function() {
		this.isInstance = true;
	}
	,createInstance: function(base) {
		var currentSkin = null;
		var objects;
		var _g = [];
		var _g1 = 0;
		var _g2 = this.objects;
		while(_g1 < _g2.length) {
			var a1 = _g2[_g1];
			++_g1;
			_g.push(a1.clone());
		}
		objects = _g;
		var a = this.clone();
		a.objects = objects;
		a.bind(base);
		a.initInstance();
		return a;
	}
	,bind: function(base) {
		var currentSkin = null;
		var _g = 0;
		var _g1 = this.objects.slice();
		while(_g < _g1.length) {
			var a = _g1[_g];
			++_g;
			if(currentSkin != null) {
				var j = currentSkin.skinData.namedJoints.get(a.objectName);
				if(j != null) {
					a.targetSkin = currentSkin;
					a.targetJoint = j.index;
				}
			}
			var obj = base.getObjectByName(a.objectName);
			if(obj == null) {
				HxOverrides.remove(this.objects,a);
				continue;
			}
			var joint;
			joint = (obj instanceof h3d_scene_Joint)?obj:null;
			if(joint != null) {
				currentSkin = joint.parent;
				a.targetSkin = currentSkin;
				a.targetJoint = joint.index;
			} else a.targetObject = obj;
		}
		this.isSync = false;
	}
	,getPropValue: function(objectName,propName) {
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
	,toString: function() {
		return this.name;
	}
	,__class__: h3d_anim_Animation
};
var h3d_anim_Joint = function() {
	this.bindIndex = -1;
	this.splitIndex = -1;
	this.subs = [];
};
$hxClasses["h3d.anim.Joint"] = h3d_anim_Joint;
h3d_anim_Joint.__name__ = ["h3d","anim","Joint"];
h3d_anim_Joint.prototype = {
	__class__: h3d_anim_Joint
};
var h3d_anim__$Skin_Permut = function() {
};
$hxClasses["h3d.anim._Skin.Permut"] = h3d_anim__$Skin_Permut;
h3d_anim__$Skin_Permut.__name__ = ["h3d","anim","_Skin","Permut"];
h3d_anim__$Skin_Permut.prototype = {
	__class__: h3d_anim__$Skin_Permut
};
var h3d_anim__$Skin_Influence = function(j,w) {
	this.j = j;
	this.w = w;
};
$hxClasses["h3d.anim._Skin.Influence"] = h3d_anim__$Skin_Influence;
h3d_anim__$Skin_Influence.__name__ = ["h3d","anim","_Skin","Influence"];
h3d_anim__$Skin_Influence.prototype = {
	__class__: h3d_anim__$Skin_Influence
};
var h3d_anim_Skin = function(name,vertexCount,bonesPerVertex) {
	this.name = name;
	this.vertexCount = vertexCount;
	this.bonesPerVertex = bonesPerVertex;
	if(vertexCount > 0) {
		var this1;
		this1 = new Array(vertexCount * bonesPerVertex);
		this.vertexJoints = this1;
		var this2;
		this2 = new Array(vertexCount * bonesPerVertex);
		this.vertexWeights = this2;
		this.envelop = [];
	}
};
$hxClasses["h3d.anim.Skin"] = h3d_anim_Skin;
h3d_anim_Skin.__name__ = ["h3d","anim","Skin"];
h3d_anim_Skin.prototype = {
	setJoints: function(joints,roots) {
		this.rootJoints = roots;
		this.allJoints = joints;
		this.namedJoints = new haxe_ds_StringMap();
		var _g = 0;
		while(_g < joints.length) {
			var j = joints[_g];
			++_g;
			if(j.name != null) this.namedJoints.set(j.name,j);
		}
	}
	,addInfluence: function(vid,j,w) {
		var il = this.envelop[vid];
		if(il == null) il = this.envelop[vid] = [];
		il.push(new h3d_anim__$Skin_Influence(j,w));
	}
	,sortInfluences: function(i1,i2) {
		if(i2.w > i1.w) return 1; else return -1;
	}
	,isSplit: function() {
		return this.splitJoints != null;
	}
	,initWeights: function() {
		this.boundJoints = [];
		var pos = 0;
		var _g1 = 0;
		var _g = this.vertexCount;
		while(_g1 < _g) {
			var i = _g1++;
			var il = this.envelop[i];
			if(il == null) il = [];
			haxe_ds_ArraySort.sort(il,$bind(this,this.sortInfluences));
			if(il.length > this.bonesPerVertex) il = il.slice(0,this.bonesPerVertex);
			var tw = 0.;
			var _g2 = 0;
			while(_g2 < il.length) {
				var i1 = il[_g2];
				++_g2;
				tw += i1.w;
			}
			tw = 1 / tw;
			var _g3 = 0;
			var _g21 = this.bonesPerVertex;
			while(_g3 < _g21) {
				var i2 = _g3++;
				var i3 = il[i2];
				if(i3 == null) {
					this.vertexJoints[pos] = 0;
					this.vertexWeights[pos] = 0;
				} else {
					if(i3.j.bindIndex == -1) {
						i3.j.bindIndex = this.boundJoints.length;
						this.boundJoints.push(i3.j);
					}
					this.vertexJoints[pos] = i3.j.bindIndex;
					this.vertexWeights[pos] = i3.w * tw;
				}
				pos++;
			}
		}
		this.envelop = null;
	}
	,sortByBindIndex: function(j1,j2) {
		return j1.bindIndex - j2.bindIndex;
	}
	,isSub: function(a,b) {
		var j = 0;
		var max = b.length;
		var _g = 0;
		while(_g < a.length) {
			var e = a[_g];
			++_g;
			while(e != b[j++]) {
				if(j >= max) return false;
				continue;
			}
		}
		return true;
	}
	,merge: function(permuts) {
		var _g = 0;
		while(_g < permuts.length) {
			var p1 = permuts[_g];
			++_g;
			var _g1 = 0;
			while(_g1 < permuts.length) {
				var p2 = permuts[_g1];
				++_g1;
				if(p1 != p2 && p1.material == p2.material && this.isSub(p1.joints,p2.joints)) {
					var _g2 = 0;
					var _g3 = p1.triangles;
					while(_g2 < _g3.length) {
						var t = _g3[_g2];
						++_g2;
						p2.triangles.push(t);
					}
					HxOverrides.remove(permuts,p1);
					return true;
				}
			}
		}
		return false;
	}
	,jointsDiff: function(p1,p2) {
		var diff = 0;
		var i = 0;
		var j = 0;
		var imax = p1.joints.length;
		var jmax = p2.joints.length;
		while(i < imax && j < jmax) {
			var j1 = p1.joints[i];
			var j2 = p2.joints[j];
			if(j1 == j2) {
				i++;
				j++;
			} else {
				diff++;
				if(j1.bindIndex < j2.bindIndex) i++; else j++;
			}
		}
		return diff + (imax - i) + (jmax - j);
	}
	,split: function(maxBones,index,triangleMaterials) {
		if(this.splitJoints != null) return true;
		if(this.boundJoints.length <= maxBones) return false;
		this.splitJoints = [];
		var this1;
		this1 = new Array(index.length / 3 | 0);
		this.triangleGroups = this1;
		var permuts = [];
		var _g1 = 0;
		var _g = index.length / 3 | 0;
		while(_g1 < _g) {
			var tri = _g1++;
			var iid = tri * 3;
			var mid;
			if(triangleMaterials == null) mid = 0; else mid = triangleMaterials[tri];
			var jl = [];
			var _g2 = 0;
			while(_g2 < 3) {
				var i = _g2++;
				var vid = index[iid + i];
				var _g4 = 0;
				var _g3 = this.bonesPerVertex;
				while(_g4 < _g3) {
					var b = _g4++;
					var bidx = vid * this.bonesPerVertex + b;
					if(this.vertexWeights[bidx] == 0) continue;
					var j = this.boundJoints[this.vertexJoints[bidx]];
					if(j.splitIndex != iid) {
						j.splitIndex = iid;
						jl.push(j);
					}
				}
			}
			jl.sort($bind(this,this.sortByBindIndex));
			var _g21 = 0;
			while(_g21 < permuts.length) {
				var p2 = permuts[_g21];
				++_g21;
				if(p2.material == mid && this.isSub(jl,p2.joints)) {
					p2.triangles.push(tri);
					jl = null;
					break;
				}
			}
			if(jl == null) continue;
			var _g22 = 0;
			while(_g22 < permuts.length) {
				var p21 = permuts[_g22];
				++_g22;
				if(p21.material == mid && this.isSub(p21.joints,jl)) {
					p21.joints = jl;
					p21.triangles.push(tri);
					jl = null;
					break;
				}
			}
			if(jl == null) continue;
			var pr = new h3d_anim__$Skin_Permut();
			pr.joints = jl;
			pr.triangles = [tri];
			pr.material = mid;
			permuts.push(pr);
		}
		while(true) {
			while(this.merge(permuts)) {
			}
			var minDif = 100000;
			var minTot = 100000;
			var minP1 = null;
			var minP2 = null;
			var _g11 = 0;
			var _g5 = permuts.length;
			while(_g11 < _g5) {
				var i1 = _g11++;
				var p11 = permuts[i1];
				if(p11.joints.length == maxBones) continue;
				var _g31 = i1 + 1;
				var _g23 = permuts.length;
				while(_g31 < _g23) {
					var j1 = _g31++;
					var p23 = permuts[j1];
					if(p23.joints.length == maxBones || p11.material != p23.material) continue;
					var count = this.jointsDiff(p11,p23);
					var tot = count + (p11.joints.length + p23.joints.length - count >> 1);
					if(tot > maxBones || tot > minTot || tot == minTot && count > minDif) continue;
					minDif = count;
					minTot = tot;
					minP1 = p11;
					minP2 = p23;
				}
			}
			if(minP1 == null) break;
			var p1 = minP1;
			var p22 = minP2;
			var _g6 = 0;
			var _g12 = p1.joints;
			while(_g6 < _g12.length) {
				var j2 = _g12[_g6];
				++_g6;
				HxOverrides.remove(p22.joints,j2);
				p22.joints.push(j2);
			}
			p22.joints.sort($bind(this,this.sortByBindIndex));
			var _g7 = 0;
			var _g13 = p1.triangles;
			while(_g7 < _g13.length) {
				var t = _g13[_g7];
				++_g7;
				p22.triangles.push(t);
			}
			HxOverrides.remove(permuts,p1);
		}
		var _g14 = 0;
		var _g8 = permuts.length;
		while(_g14 < _g8) {
			var i2 = _g14++;
			var _g24 = 0;
			var _g32 = permuts[i2].triangles;
			while(_g24 < _g32.length) {
				var tri1 = _g32[_g24];
				++_g24;
				this.triangleGroups[tri1] = i2;
			}
		}
		var jointsPermuts = [];
		var _g9 = 0;
		var _g15 = this.boundJoints;
		while(_g9 < _g15.length) {
			var j3 = _g15[_g9];
			++_g9;
			var pl = [];
			var _g25 = 0;
			while(_g25 < permuts.length) {
				var p = permuts[_g25];
				++_g25;
				if(HxOverrides.indexOf(p.joints,j3,0) >= 0) pl.push(p);
			}
			jointsPermuts.push({ j : j3, pl : pl});
		}
		jointsPermuts.sort(function(j11,j21) {
			return j21.pl.length - j11.pl.length;
		});
		var _g10 = 0;
		while(_g10 < permuts.length) {
			var p3 = permuts[_g10];
			++_g10;
			p3.indexedJoints = [];
		}
		var _g16 = 0;
		while(_g16 < jointsPermuts.length) {
			var j4 = jointsPermuts[_g16];
			++_g16;
			j4.j.splitIndex = -1;
			var _g17 = 0;
			while(_g17 < maxBones) {
				var id = _g17++;
				var ok = true;
				var _g26 = 0;
				var _g33 = j4.pl;
				while(_g26 < _g33.length) {
					var p4 = _g33[_g26];
					++_g26;
					if(p4.indexedJoints[id] != null) {
						ok = false;
						break;
					}
				}
				if(ok) {
					j4.j.splitIndex = id;
					var _g27 = 0;
					var _g34 = j4.pl;
					while(_g27 < _g34.length) {
						var p5 = _g34[_g27];
						++_g27;
						p5.indexedJoints[id] = j4.j;
					}
					break;
				}
			}
			if(j4.j.splitIndex < 0) throw new js__$Boot_HaxeError("Failed to assign index while spliting skin");
		}
		this.splitJoints = [];
		var _g18 = 0;
		while(_g18 < permuts.length) {
			var p6 = permuts[_g18];
			++_g18;
			var jl1 = [];
			var _g28 = 0;
			var _g19 = p6.indexedJoints.length;
			while(_g28 < _g19) {
				var i3 = _g28++;
				var j5 = p6.indexedJoints[i3];
				if(j5 == null) j5 = this.boundJoints[0];
				jl1.push(j5);
			}
			this.splitJoints.push({ material : p6.material, joints : jl1});
		}
		var _g110 = 0;
		var _g20 = this.vertexJoints.length;
		while(_g110 < _g20) {
			var i4 = _g110++;
			this.vertexJoints[i4] = this.boundJoints[this.vertexJoints[i4]].splitIndex;
		}
		return true;
	}
	,__class__: h3d_anim_Skin
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
h3d_col_Bounds.fromPoints = function(min,max) {
	var b = new h3d_col_Bounds();
	b.xMin = min.x;
	b.yMin = min.y;
	b.zMin = min.z;
	b.xMax = max.x;
	b.yMax = max.y;
	b.zMax = max.z;
	return b;
};
h3d_col_Bounds.fromValues = function(x,y,z,dx,dy,dz) {
	var b = new h3d_col_Bounds();
	b.xMin = x;
	b.yMin = y;
	b.zMin = z;
	b.xMax = x + dx;
	b.yMax = y + dy;
	b.zMax = z + dz;
	return b;
};
h3d_col_Bounds.prototype = {
	inFrustum: function(mvp) {
		if(this.testPlane(new h3d_col_Plane(mvp._14 + mvp._11,mvp._24 + mvp._21,mvp._34 + mvp._31,-(mvp._44 + mvp._41))) < 0) return false;
		if(this.testPlane(new h3d_col_Plane(mvp._14 - mvp._11,mvp._24 - mvp._21,mvp._34 - mvp._31,mvp._41 - mvp._44)) < 0) return false;
		if(this.testPlane(new h3d_col_Plane(mvp._14 + mvp._12,mvp._24 + mvp._22,mvp._34 + mvp._32,-(mvp._44 + mvp._42))) < 0) return false;
		if(this.testPlane(new h3d_col_Plane(mvp._14 - mvp._12,mvp._24 - mvp._22,mvp._34 - mvp._32,mvp._42 - mvp._44)) < 0) return false;
		if(this.testPlane(new h3d_col_Plane(mvp._13,mvp._23,mvp._33,-mvp._43)) < 0) return false;
		if(this.testPlane(new h3d_col_Plane(mvp._14 - mvp._13,mvp._24 - mvp._23,mvp._34 - mvp._33,mvp._43 - mvp._44)) < 0) return false;
		return true;
	}
	,testPlane: function(p) {
		var a = p.nx;
		var b = p.ny;
		var c = p.nz;
		var dd = a * (this.xMax + this.xMin) + b * (this.yMax + this.yMin) + c * (this.zMax + this.zMin);
		if(a < 0) a = -a;
		if(b < 0) b = -b;
		if(c < 0) c = -c;
		var rr = a * (this.xMax - this.xMin) + b * (this.yMax - this.yMin) + c * (this.zMax - this.zMin);
		return dd + rr - p.d * 2;
	}
	,rayIntersection: function(r,p) {
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
	,inFrustumDetails: function(mvp,checkZ) {
		if(checkZ == null) checkZ = true;
		var ret = 1;
		var p_nx = mvp._14 + mvp._11;
		var p_ny = mvp._24 + mvp._21;
		var p_nz = mvp._34 + mvp._31;
		var p_d = mvp._44 + mvp._41;
		var m;
		m = p_nx * (p_nx > 0?this.xMax:this.xMin) + p_ny * (p_ny > 0?this.yMax:this.yMin) + p_nz * (p_nz > 0?this.zMax:this.zMin);
		if(m + p_d < 0) return -1;
		var n;
		n = p_nx * (p_nx > 0?this.xMin:this.xMax) + p_ny * (p_ny > 0?this.yMin:this.yMax) + p_nz * (p_nz > 0?this.zMin:this.zMax);
		if(n + p_d < 0) ret = 0;
		var p_nx1 = mvp._14 - mvp._11;
		var p_ny1 = mvp._24 - mvp._21;
		var p_nz1 = mvp._34 - mvp._31;
		var p_d1 = mvp._44 - mvp._41;
		var m1;
		m1 = p_nx1 * (p_nx1 > 0?this.xMax:this.xMin) + p_ny1 * (p_ny1 > 0?this.yMax:this.yMin) + p_nz1 * (p_nz1 > 0?this.zMax:this.zMin);
		if(m1 + p_d1 < 0) return -1;
		var n1;
		n1 = p_nx1 * (p_nx1 > 0?this.xMin:this.xMax) + p_ny1 * (p_ny1 > 0?this.yMin:this.yMax) + p_nz1 * (p_nz1 > 0?this.zMin:this.zMax);
		if(n1 + p_d1 < 0) ret = 0;
		var p_nx2 = mvp._14 + mvp._12;
		var p_ny2 = mvp._24 + mvp._22;
		var p_nz2 = mvp._34 + mvp._32;
		var p_d2 = mvp._44 + mvp._42;
		var m2;
		m2 = p_nx2 * (p_nx2 > 0?this.xMax:this.xMin) + p_ny2 * (p_ny2 > 0?this.yMax:this.yMin) + p_nz2 * (p_nz2 > 0?this.zMax:this.zMin);
		if(m2 + p_d2 < 0) return -1;
		var n2;
		n2 = p_nx2 * (p_nx2 > 0?this.xMin:this.xMax) + p_ny2 * (p_ny2 > 0?this.yMin:this.yMax) + p_nz2 * (p_nz2 > 0?this.zMin:this.zMax);
		if(n2 + p_d2 < 0) ret = 0;
		var p_nx3 = mvp._14 - mvp._12;
		var p_ny3 = mvp._24 - mvp._22;
		var p_nz3 = mvp._34 - mvp._32;
		var p_d3 = mvp._44 - mvp._42;
		var m3;
		m3 = p_nx3 * (p_nx3 > 0?this.xMax:this.xMin) + p_ny3 * (p_ny3 > 0?this.yMax:this.yMin) + p_nz3 * (p_nz3 > 0?this.zMax:this.zMin);
		if(m3 + p_d3 < 0) return -1;
		var n3;
		n3 = p_nx3 * (p_nx3 > 0?this.xMin:this.xMax) + p_ny3 * (p_ny3 > 0?this.yMin:this.yMax) + p_nz3 * (p_nz3 > 0?this.zMin:this.zMax);
		if(n3 + p_d3 < 0) ret = 0;
		if(checkZ) {
			var p_nx4 = mvp._13;
			var p_ny4 = mvp._23;
			var p_nz4 = mvp._33;
			var p_d4 = mvp._43;
			var m4;
			m4 = p_nx4 * (p_nx4 > 0?this.xMax:this.xMin) + p_ny4 * (p_ny4 > 0?this.yMax:this.yMin) + p_nz4 * (p_nz4 > 0?this.zMax:this.zMin);
			if(m4 + p_d4 < 0) return -1;
			var n4;
			n4 = p_nx4 * (p_nx4 > 0?this.xMin:this.xMax) + p_ny4 * (p_ny4 > 0?this.yMin:this.yMax) + p_nz4 * (p_nz4 > 0?this.zMin:this.zMax);
			if(n4 + p_d4 < 0) ret = 0;
			var p_nx5 = mvp._14 - mvp._13;
			var p_ny5 = mvp._24 - mvp._23;
			var p_nz5 = mvp._34 - mvp._33;
			var p_d5 = mvp._44 - mvp._43;
			var m5;
			m5 = p_nx5 * (p_nx5 > 0?this.xMax:this.xMin) + p_ny5 * (p_ny5 > 0?this.yMax:this.yMin) + p_nz5 * (p_nz5 > 0?this.zMax:this.zMin);
			if(m5 + p_d5 < 0) return -1;
			var n5;
			n5 = p_nx5 * (p_nx5 > 0?this.xMin:this.xMax) + p_ny5 * (p_ny5 > 0?this.yMin:this.yMax) + p_nz5 * (p_nz5 > 0?this.zMin:this.zMax);
			if(n5 + p_d5 < 0) ret = 0;
		}
		return ret;
	}
	,transform3x4: function(m) {
		var xMin = this.xMin;
		var yMin = this.yMin;
		var zMin = this.zMin;
		var xMax = this.xMax;
		var yMax = this.yMax;
		var zMax = this.zMax;
		this.xMin = 1e20;
		this.xMax = -1e20;
		this.yMin = 1e20;
		this.yMax = -1e20;
		this.zMin = 1e20;
		this.zMax = -1e20;
		var v = new h3d_col_Point();
		v.x = xMin;
		v.y = yMin;
		v.z = zMin;
		v.transform(m);
		if(v.x < this.xMin) this.xMin = v.x;
		if(v.x > this.xMax) this.xMax = v.x;
		if(v.y < this.yMin) this.yMin = v.y;
		if(v.y > this.yMax) this.yMax = v.y;
		if(v.z < this.zMin) this.zMin = v.z;
		if(v.z > this.zMax) this.zMax = v.z;
		v.x = xMin;
		v.y = yMin;
		v.z = zMax;
		v.transform(m);
		if(v.x < this.xMin) this.xMin = v.x;
		if(v.x > this.xMax) this.xMax = v.x;
		if(v.y < this.yMin) this.yMin = v.y;
		if(v.y > this.yMax) this.yMax = v.y;
		if(v.z < this.zMin) this.zMin = v.z;
		if(v.z > this.zMax) this.zMax = v.z;
		v.x = xMin;
		v.y = yMax;
		v.z = zMin;
		v.transform(m);
		if(v.x < this.xMin) this.xMin = v.x;
		if(v.x > this.xMax) this.xMax = v.x;
		if(v.y < this.yMin) this.yMin = v.y;
		if(v.y > this.yMax) this.yMax = v.y;
		if(v.z < this.zMin) this.zMin = v.z;
		if(v.z > this.zMax) this.zMax = v.z;
		v.x = xMin;
		v.y = yMax;
		v.z = zMax;
		v.transform(m);
		if(v.x < this.xMin) this.xMin = v.x;
		if(v.x > this.xMax) this.xMax = v.x;
		if(v.y < this.yMin) this.yMin = v.y;
		if(v.y > this.yMax) this.yMax = v.y;
		if(v.z < this.zMin) this.zMin = v.z;
		if(v.z > this.zMax) this.zMax = v.z;
		v.x = xMax;
		v.y = yMin;
		v.z = zMin;
		v.transform(m);
		if(v.x < this.xMin) this.xMin = v.x;
		if(v.x > this.xMax) this.xMax = v.x;
		if(v.y < this.yMin) this.yMin = v.y;
		if(v.y > this.yMax) this.yMax = v.y;
		if(v.z < this.zMin) this.zMin = v.z;
		if(v.z > this.zMax) this.zMax = v.z;
		v.x = xMax;
		v.y = yMin;
		v.z = zMax;
		v.transform(m);
		if(v.x < this.xMin) this.xMin = v.x;
		if(v.x > this.xMax) this.xMax = v.x;
		if(v.y < this.yMin) this.yMin = v.y;
		if(v.y > this.yMax) this.yMax = v.y;
		if(v.z < this.zMin) this.zMin = v.z;
		if(v.z > this.zMax) this.zMax = v.z;
		v.x = xMax;
		v.y = yMax;
		v.z = zMin;
		v.transform(m);
		if(v.x < this.xMin) this.xMin = v.x;
		if(v.x > this.xMax) this.xMax = v.x;
		if(v.y < this.yMin) this.yMin = v.y;
		if(v.y > this.yMax) this.yMax = v.y;
		if(v.z < this.zMin) this.zMin = v.z;
		if(v.z > this.zMax) this.zMax = v.z;
		v.x = xMax;
		v.y = yMax;
		v.z = zMax;
		v.transform(m);
		if(v.x < this.xMin) this.xMin = v.x;
		if(v.x > this.xMax) this.xMax = v.x;
		if(v.y < this.yMin) this.yMin = v.y;
		if(v.y > this.yMax) this.yMax = v.y;
		if(v.z < this.zMin) this.zMin = v.z;
		if(v.z > this.zMax) this.zMax = v.z;
	}
	,collide: function(b) {
		return !(this.xMin > b.xMax || this.yMin > b.yMax || this.zMin > b.zMax || this.xMax < b.xMin || this.yMax < b.yMin || this.zMax < b.zMin);
	}
	,contains: function(p) {
		return p.x >= this.xMin && p.x < this.xMax && p.y >= this.yMin && p.y < this.yMax && p.z >= this.zMin && p.z < this.zMax;
	}
	,add: function(b) {
		if(b.xMin < this.xMin) this.xMin = b.xMin;
		if(b.xMax > this.xMax) this.xMax = b.xMax;
		if(b.yMin < this.yMin) this.yMin = b.yMin;
		if(b.yMax > this.yMax) this.yMax = b.yMax;
		if(b.zMin < this.zMin) this.zMin = b.zMin;
		if(b.zMax > this.zMax) this.zMax = b.zMax;
	}
	,addPoint: function(p) {
		if(p.x < this.xMin) this.xMin = p.x;
		if(p.x > this.xMax) this.xMax = p.x;
		if(p.y < this.yMin) this.yMin = p.y;
		if(p.y > this.yMax) this.yMax = p.y;
		if(p.z < this.zMin) this.zMin = p.z;
		if(p.z > this.zMax) this.zMax = p.z;
	}
	,addPos: function(x,y,z) {
		if(x < this.xMin) this.xMin = x;
		if(x > this.xMax) this.xMax = x;
		if(y < this.yMin) this.yMin = y;
		if(y > this.yMax) this.yMax = y;
		if(z < this.zMin) this.zMin = z;
		if(z > this.zMax) this.zMax = z;
	}
	,intersection: function(a,b) {
		var xMin = hxd_Math.max(a.xMin,b.xMin);
		var yMin = hxd_Math.max(a.yMin,b.yMin);
		var zMin = hxd_Math.max(a.zMin,b.zMin);
		var xMax = hxd_Math.max(a.xMax,b.xMax);
		var yMax = hxd_Math.max(a.yMax,b.yMax);
		var zMax = hxd_Math.max(a.zMax,b.zMax);
		this.xMin = xMin;
		this.xMax = xMax;
		this.yMin = yMin;
		this.yMax = yMax;
		this.zMin = zMin;
		this.zMax = zMax;
	}
	,offset: function(dx,dy,dz) {
		this.xMin += dx;
		this.xMax += dx;
		this.yMin += dy;
		this.yMax += dy;
		this.zMin += dz;
		this.zMax += dz;
	}
	,setMin: function(p) {
		this.xMin = p.x;
		this.yMin = p.y;
		this.zMin = p.z;
	}
	,setMax: function(p) {
		this.xMax = p.x;
		this.yMax = p.y;
		this.zMax = p.z;
	}
	,load: function(b) {
		this.xMin = b.xMin;
		this.xMax = b.xMax;
		this.yMin = b.yMin;
		this.yMax = b.yMax;
		this.zMin = b.zMin;
		this.zMax = b.zMax;
	}
	,scalePivot: function(v) {
		this.xMin *= v;
		this.yMin *= v;
		this.zMin *= v;
		this.xMax *= v;
		this.yMax *= v;
		this.zMax *= v;
	}
	,scaleCenter: function(v) {
		var dx = (this.xMax - this.xMin) * 0.5 * v;
		var dy = (this.yMax - this.yMin) * 0.5 * v;
		var dz = (this.zMax - this.zMin) * 0.5 * v;
		var mx = (this.xMax + this.xMin) * 0.5;
		var my = (this.yMax + this.yMin) * 0.5;
		var mz = (this.zMax + this.zMin) * 0.5;
		this.xMin = mx - dx;
		this.yMin = my - dy;
		this.zMin = mz - dz;
		this.xMax = mx + dx;
		this.yMax = my + dy;
		this.zMax = mz + dz;
	}
	,getMin: function() {
		return new h3d_col_Point(this.xMin,this.yMin,this.zMin);
	}
	,getCenter: function() {
		return new h3d_col_Point((this.xMin + this.xMax) * 0.5,(this.yMin + this.yMax) * 0.5,(this.zMin + this.zMax) * 0.5);
	}
	,getSize: function() {
		return new h3d_col_Point(this.xMax - this.xMin,this.yMax - this.yMin,this.zMax - this.zMin);
	}
	,getMax: function() {
		return new h3d_col_Point(this.xMax,this.yMax,this.zMax);
	}
	,get_xSize: function() {
		return this.xMax - this.xMin;
	}
	,get_ySize: function() {
		return this.yMax - this.yMin;
	}
	,get_zSize: function() {
		return this.zMax - this.zMin;
	}
	,set_xSize: function(v) {
		this.xMax = this.xMin + v;
		return v;
	}
	,set_ySize: function(v) {
		this.yMax = this.yMin + v;
		return v;
	}
	,set_zSize: function(v) {
		this.zMax = this.zMin + v;
		return v;
	}
	,empty: function() {
		this.xMin = 1e20;
		this.xMax = -1e20;
		this.yMin = 1e20;
		this.yMax = -1e20;
		this.zMin = 1e20;
		this.zMax = -1e20;
	}
	,all: function() {
		this.xMin = -1e20;
		this.xMax = 1e20;
		this.yMin = -1e20;
		this.yMax = 1e20;
		this.zMin = -1e20;
		this.zMax = 1e20;
	}
	,clone: function() {
		var b = new h3d_col_Bounds();
		b.xMin = this.xMin;
		b.xMax = this.xMax;
		b.yMin = this.yMin;
		b.yMax = this.yMax;
		b.zMin = this.zMin;
		b.zMax = this.zMax;
		return b;
	}
	,toString: function() {
		return "Bounds{" + Std.string(new h3d_col_Point(this.xMin,this.yMin,this.zMin)) + "," + Std.string(new h3d_col_Point(this.xMax - this.xMin,this.yMax - this.yMin,this.zMax - this.zMin)) + "}";
	}
	,toSphere: function() {
		var dx = this.xMax - this.xMin;
		var dy = this.yMax - this.yMin;
		var dz = this.zMax - this.zMin;
		return new h3d_col_Sphere((this.xMin + this.xMax) * 0.5,(this.yMin + this.yMax) * 0.5,(this.zMin + this.zMax) * 0.5,Math.sqrt(dx * dx + dy * dy + dz * dz) * 0.5);
	}
	,__class__: h3d_col_Bounds
};
var h3d_col_OptimizedCollider = function(a,b) {
	this.a = a;
	this.b = b;
};
$hxClasses["h3d.col.OptimizedCollider"] = h3d_col_OptimizedCollider;
h3d_col_OptimizedCollider.__name__ = ["h3d","col","OptimizedCollider"];
h3d_col_OptimizedCollider.__interfaces__ = [h3d_col_Collider];
h3d_col_OptimizedCollider.prototype = {
	rayIntersection: function(r,p) {
		if(this.a.rayIntersection(r,p) == null) return null;
		return this.b.rayIntersection(r,p);
	}
	,contains: function(p) {
		return this.a.contains(p) && this.b.contains(p);
	}
	,inFrustum: function(mvp) {
		return this.a.inFrustum(mvp) && this.b.inFrustum(mvp);
	}
	,__class__: h3d_col_OptimizedCollider
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
	,hasBounds: function(b) {
		if(b.testPlane(this.pleft) < 0) return false;
		if(b.testPlane(this.pright) < 0) return false;
		if(b.testPlane(this.ptop) < 0) return false;
		if(b.testPlane(this.ptop) < 0) return false;
		if(b.testPlane(this.pnear) < 0) return false;
		if(b.testPlane(this.pfar) < 0) return false;
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
h3d_col_Plane.fromPoints = function(p0,p1,p2) {
	var d1_x = p1.x - p0.x;
	var d1_y = p1.y - p0.y;
	var d1_z = p1.z - p0.z;
	var d2_x = p2.x - p0.x;
	var d2_y = p2.y - p0.y;
	var d2_z = p2.z - p0.z;
	var n_x = d1_y * d2_z - d1_z * d2_y;
	var n_y = d1_z * d2_x - d1_x * d2_z;
	var n_z = d1_x * d2_y - d1_y * d2_x;
	return new h3d_col_Plane(n_x,n_y,n_z,n_x * p0.x + n_y * p0.y + n_z * p0.z);
};
h3d_col_Plane.fromNormalPoint = function(n,p) {
	return new h3d_col_Plane(n.x,n.y,n.z,n.x * p.x + n.y * p.y + n.z * p.z);
};
h3d_col_Plane.X = function(v) {
	return new h3d_col_Plane(1,0,0,v);
};
h3d_col_Plane.Y = function(v) {
	return new h3d_col_Plane(0,1,0,v);
};
h3d_col_Plane.Z = function(v) {
	return new h3d_col_Plane(0,0,1,v);
};
h3d_col_Plane.frustumLeft = function(mvp) {
	return new h3d_col_Plane(mvp._14 + mvp._11,mvp._24 + mvp._21,mvp._34 + mvp._31,-(mvp._44 + mvp._41));
};
h3d_col_Plane.frustumRight = function(mvp) {
	return new h3d_col_Plane(mvp._14 - mvp._11,mvp._24 - mvp._21,mvp._34 - mvp._31,mvp._41 - mvp._44);
};
h3d_col_Plane.frustumBottom = function(mvp) {
	return new h3d_col_Plane(mvp._14 + mvp._12,mvp._24 + mvp._22,mvp._34 + mvp._32,-(mvp._44 + mvp._42));
};
h3d_col_Plane.frustumTop = function(mvp) {
	return new h3d_col_Plane(mvp._14 - mvp._12,mvp._24 - mvp._22,mvp._34 - mvp._32,mvp._42 - mvp._44);
};
h3d_col_Plane.frustumNear = function(mvp) {
	return new h3d_col_Plane(mvp._13,mvp._23,mvp._33,-mvp._43);
};
h3d_col_Plane.frustumFar = function(mvp) {
	return new h3d_col_Plane(mvp._14 - mvp._13,mvp._24 - mvp._23,mvp._34 - mvp._33,mvp._43 - mvp._44);
};
h3d_col_Plane.prototype = {
	getNormal: function() {
		return new h3d_col_Point(this.nx,this.ny,this.nz);
	}
	,getNormalDistance: function() {
		return this.d;
	}
	,normalize: function() {
		var len = 1. / Math.sqrt(this.nx * this.nx + this.ny * this.ny + this.nz * this.nz);
		this.nx *= len;
		this.ny *= len;
		this.nz *= len;
		this.d *= len;
	}
	,toString: function() {
		return "Plane{" + Std.string(new h3d_col_Point(this.nx,this.ny,this.nz)) + "," + hxd_Math.fmt(this.d) + "}";
	}
	,distance: function(p) {
		return this.nx * p.x + this.ny * p.y + this.nz * p.z - this.d;
	}
	,side: function(p) {
		return this.nx * p.x + this.ny * p.y + this.nz * p.z - this.d >= 0;
	}
	,project: function(p) {
		var d = this.nx * p.x + this.ny * p.y + this.nz * p.z - this.d;
		return new h3d_col_Point(p.x - d * this.nx,p.y - d * this.ny,p.z - d * this.nz);
	}
	,projectTo: function(p,out) {
		var d = this.nx * p.x + this.ny * p.y + this.nz * p.z - this.d;
		out.x = p.x - d * this.nx;
		out.y = p.y - d * this.ny;
		out.z = p.z - d * this.nz;
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
	inFrustum: function(mvp) {
		if(!new h3d_col_Plane(mvp._14 + mvp._11,mvp._24 + mvp._21,mvp._34 + mvp._31,-(mvp._44 + mvp._41)).side(this)) return false;
		if(!new h3d_col_Plane(mvp._14 - mvp._11,mvp._24 - mvp._21,mvp._34 - mvp._31,mvp._41 - mvp._44).side(this)) return false;
		if(!new h3d_col_Plane(mvp._14 + mvp._12,mvp._24 + mvp._22,mvp._34 + mvp._32,-(mvp._44 + mvp._42)).side(this)) return false;
		if(!new h3d_col_Plane(mvp._14 - mvp._12,mvp._24 - mvp._22,mvp._34 - mvp._32,mvp._42 - mvp._44).side(this)) return false;
		if(!new h3d_col_Plane(mvp._13,mvp._23,mvp._33,-mvp._43).side(this)) return false;
		if(!new h3d_col_Plane(mvp._14 - mvp._13,mvp._24 - mvp._23,mvp._34 - mvp._33,mvp._43 - mvp._44).side(this)) return false;
		return true;
	}
	,set: function(x,y,z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	,sub: function(p) {
		return new h3d_col_Point(this.x - p.x,this.y - p.y,this.z - p.z);
	}
	,add: function(p) {
		return new h3d_col_Point(this.x + p.x,this.y + p.y,this.z + p.z);
	}
	,cross: function(p) {
		return new h3d_col_Point(this.y * p.z - this.z * p.y,this.z * p.x - this.x * p.z,this.x * p.y - this.y * p.x);
	}
	,lengthSq: function() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}
	,length: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}
	,dot: function(p) {
		return this.x * p.x + this.y * p.y + this.z * p.z;
	}
	,distanceSq: function(p) {
		var dx = p.x - this.x;
		var dy = p.y - this.y;
		var dz = p.z - this.z;
		return dx * dx + dy * dy + dz * dz;
	}
	,distance: function(p) {
		return hxd_Math.sqrt(this.distanceSq(p));
	}
	,normalize: function() {
		var k = this.x * this.x + this.y * this.y + this.z * this.z;
		if(k < 1e-10) k = 0; else k = 1. / Math.sqrt(k);
		this.x *= k;
		this.y *= k;
		this.z *= k;
	}
	,normalizeFast: function() {
		var k = this.x * this.x + this.y * this.y + this.z * this.z;
		k = 1. / Math.sqrt(k);
		this.x *= k;
		this.y *= k;
		this.z *= k;
	}
	,transform: function(m) {
		var px = this.x * m._11 + this.y * m._21 + this.z * m._31 + m._41;
		var py = this.x * m._12 + this.y * m._22 + this.z * m._32 + m._42;
		var pz = this.x * m._13 + this.y * m._23 + this.z * m._33 + m._43;
		this.x = px;
		this.y = py;
		this.z = pz;
	}
	,toVector: function() {
		return new h3d_Vector(this.x,this.y,this.z);
	}
	,clone: function() {
		return new h3d_col_Point(this.x,this.y,this.z);
	}
	,toString: function() {
		return "Point{" + hxd_Math.fmt(this.x) + "," + hxd_Math.fmt(this.y) + "," + hxd_Math.fmt(this.z) + "}";
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
h3d_col_Ray.fromValues = function(x,y,z,dx,dy,dz) {
	var r = new h3d_col_Ray();
	r.px = x;
	r.py = y;
	r.pz = z;
	r.lx = dx;
	r.ly = dy;
	r.lz = dz;
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
	,load: function(r) {
		this.px = r.px;
		this.py = r.py;
		this.pz = r.pz;
		this.lx = r.lx;
		this.ly = r.ly;
		this.lz = r.lz;
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
	,getPos: function() {
		return new h3d_col_Point(this.px,this.py,this.pz);
	}
	,getDir: function() {
		return new h3d_col_Point(this.lx,this.ly,this.lz);
	}
	,toString: function() {
		return "Ray{" + Std.string(new h3d_col_Point(this.px,this.py,this.pz)) + "," + Std.string(new h3d_col_Point(this.lx,this.ly,this.lz)) + "}";
	}
	,intersect: function(p) {
		var d = this.lx * p.nx + this.ly * p.ny + this.lz * p.nz;
		var nd = p.d - (this.px * p.nx + this.py * p.ny + this.pz * p.nz);
		if((d < 0?-d:d) < 1e-10) if((nd < 0?-nd:nd) < 1e-10) return new h3d_col_Point(this.px,this.py,this.pz); else return null; else {
			var k = nd / d;
			return new h3d_col_Point(this.px + this.lx * k,this.py + this.ly * k,this.pz + this.lz * k);
		}
	}
	,collideFrustum: function(mvp) {
		var a = new h3d_Vector(this.px,this.py,this.pz);
		a.project(mvp);
		var b = new h3d_Vector(this.px + this.lx,this.py + this.ly,this.pz + this.lz);
		b.project(mvp);
		var lx = b.x - a.x;
		var ly = b.y - a.y;
		var lz = b.z - a.z;
		var dx = 1 / lx;
		var dy = 1 / ly;
		var dz = 1 / lz;
		var t1 = (-1 - a.x) * dx;
		var t2 = (1 - a.x) * dx;
		var t3 = (-1 - a.y) * dy;
		var t4 = (1 - a.y) * dy;
		var t5 = (0 - a.z) * dz;
		var t6 = (1 - a.z) * dz;
		var tmin = hxd_Math.max(hxd_Math.max(t1 > t2?t2:t1,t3 > t4?t4:t3),t5 > t6?t6:t5);
		var tmax = hxd_Math.min(hxd_Math.min(t1 < t2?t2:t1,t3 < t4?t4:t3),t5 < t6?t6:t5);
		return !(tmax < 0 || tmin > tmax);
	}
	,collide: function(b) {
		var dx = 1 / this.lx;
		var dy = 1 / this.ly;
		var dz = 1 / this.lz;
		var t1 = (b.xMin - this.px) * dx;
		var t2 = (b.xMax - this.px) * dx;
		var t3 = (b.yMin - this.py) * dy;
		var t4 = (b.yMax - this.py) * dy;
		var t5 = (b.zMin - this.pz) * dz;
		var t6 = (b.zMax - this.pz) * dz;
		var tmin = hxd_Math.max(hxd_Math.max(t1 > t2?t2:t1,t3 > t4?t4:t3),t5 > t6?t6:t5);
		var tmax = hxd_Math.min(hxd_Math.min(t1 < t2?t2:t1,t3 < t4?t4:t3),t5 < t6?t6:t5);
		if(tmax < 0) return false; else if(tmin > tmax) return false; else return true;
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
	getCenter: function() {
		return new h3d_col_Point(this.x,this.y,this.z);
	}
	,contains: function(p) {
		var dx = p.x - this.x;
		var dy = p.y - this.y;
		var dz = p.z - this.z;
		return dx * dx + dy * dy + dz * dz < this.r * this.r;
	}
	,rayIntersection: function(r,p) {
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
	,inFrustum: function(mvp) {
		var p_x = this.x;
		var p_y = this.y;
		var p_z = this.z;
		var pl = new h3d_col_Plane(mvp._14 + mvp._11,mvp._24 + mvp._21,mvp._34 + mvp._31,-(mvp._44 + mvp._41));
		pl.normalize();
		if(pl.nx * p_x + pl.ny * p_y + pl.nz * p_z - pl.d < -this.r) return false;
		var pl1 = new h3d_col_Plane(mvp._14 - mvp._11,mvp._24 - mvp._21,mvp._34 - mvp._31,mvp._41 - mvp._44);
		pl1.normalize();
		if(pl1.nx * p_x + pl1.ny * p_y + pl1.nz * p_z - pl1.d < -this.r) return false;
		var pl2 = new h3d_col_Plane(mvp._14 + mvp._12,mvp._24 + mvp._22,mvp._34 + mvp._32,-(mvp._44 + mvp._42));
		pl2.normalize();
		if(pl2.nx * p_x + pl2.ny * p_y + pl2.nz * p_z - pl2.d < -this.r) return false;
		var pl3 = new h3d_col_Plane(mvp._14 - mvp._12,mvp._24 - mvp._22,mvp._34 - mvp._32,mvp._42 - mvp._44);
		pl3.normalize();
		if(pl3.nx * p_x + pl3.ny * p_y + pl3.nz * p_z - pl3.d < -this.r) return false;
		var pl4 = new h3d_col_Plane(mvp._13,mvp._23,mvp._33,-mvp._43);
		pl4.normalize();
		if(pl4.nx * p_x + pl4.ny * p_y + pl4.nz * p_z - pl4.d < -this.r) return false;
		var pl5 = new h3d_col_Plane(mvp._13,mvp._23,mvp._33,-mvp._43);
		pl5.normalize();
		if(pl5.nx * p_x + pl5.ny * p_y + pl5.nz * p_z - pl5.d < -this.r) return false;
		return true;
	}
	,toString: function() {
		return "Sphere{" + Std.string(new h3d_col_Point(this.x,this.y,this.z)) + "," + hxd_Math.fmt(this.r) + "}";
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
	,isSupportedFormat: function(fmt) {
		return false;
	}
	,isDisposed: function() {
		return true;
	}
	,dispose: function() {
	}
	,begin: function(frame) {
	}
	,log: function(str) {
	}
	,getNativeShaderCode: function(shader) {
		return null;
	}
	,logImpl: function(str) {
	}
	,clear: function(color,depth,stencil) {
	}
	,captureRenderBuffer: function(pixels) {
	}
	,getDriverName: function(details) {
		return "Not available";
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
	,getShaderInputNames: function() {
		return null;
	}
	,selectBuffer: function(buffer) {
	}
	,selectMultiBuffers: function(buffers) {
	}
	,draw: function(ibuf,startIndex,ntriangles) {
	}
	,setRenderZone: function(x,y,width,height) {
	}
	,setRenderTarget: function(tex) {
	}
	,setRenderTargets: function(textures) {
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
	,uploadIndexBytes: function(i,startIndice,indiceCount,buf,bufPos) {
	}
	,uploadVertexBuffer: function(v,startVertex,vertexCount,buf,bufPos) {
	}
	,uploadVertexBytes: function(v,startVertex,vertexCount,buf,bufPos) {
	}
	,uploadTextureBitmap: function(t,bmp,mipLevel,side) {
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
h3d_impl_GlDriver.bytesToUint8Array = function(b) {
	return new Uint8Array(b.b.bufferValue);
};
h3d_impl_GlDriver.__super__ = h3d_impl_Driver;
h3d_impl_GlDriver.prototype = $extend(h3d_impl_Driver.prototype,{
	logImpl: function(str) {
		console.log(str);
	}
	,begin: function(frame) {
		this.frame = frame;
		this.gl.useProgram(null);
		this.curShader = null;
		this.curBuffer = null;
	}
	,getShaderInputNames: function() {
		return this.curShader.attribNames;
	}
	,getNativeShaderCode: function(shader) {
		var glout = new hxsl_GlslOut();
		return "// vertex:\n" + glout.run(shader.vertex.data) + "// fragment:\n" + glout.run(shader.fragment.data);
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
	,isSupportedFormat: function(fmt) {
		switch(fmt[1]) {
		case 2:case 5:
			return true;
		case 4:
			return this.hasFeature(h3d_impl_Feature.FloatTextures);
		default:
			return false;
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
	,uploadTextureBitmap: function(t,bmp,mipLevel,side) {
		if(t.format != hxd_PixelFormat.RGBA) {
			var pixels = bmp.getPixels();
			this.uploadTexturePixels(t,pixels,mipLevel,side);
			pixels.dispose();
		} else {
			var img = bmp.ctx;
			this.gl.bindTexture(3553,t.t.t);
			this.gl.texImage2D(3553,mipLevel,t.t.internalFmt,this.getChannels(t.t),t.t.pixelFmt,img.getImageData(0,0,bmp.ctx.canvas.width,bmp.ctx.canvas.height));
			if((t.flags & 1 << h3d_mat_TextureFlags.MipMapped[1]) != 0) this.gl.generateMipmap(3553);
			this.gl.bindTexture(3553,null);
			t.flags |= 1 << h3d_mat_TextureFlags.WasCleared[1];
		}
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
	,uploadVertexBytes: function(v,startVertex,vertexCount,buf,bufPos) {
		var stride = v.stride;
		this.gl.bindBuffer(34962,v.b);
		var buf1 = new Uint8Array(buf.b.bufferValue);
		var sub = new Uint8Array(buf1.buffer,bufPos,vertexCount * stride * 4);
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
	,uploadIndexBytes: function(i,startIndice,indiceCount,buf,bufPos) {
		this.gl.bindBuffer(34963,i);
		var buf1 = new Uint8Array(buf.b.bufferValue);
		var sub = new Uint8Array(buf1.buffer,bufPos,indiceCount * 2);
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
	,selectMultiBuffers: function(buffers) {
		var _g = 0;
		var _g1 = this.curShader.attribs;
		while(_g < _g1.length) {
			var a = _g1[_g];
			++_g;
			this.gl.bindBuffer(34962,buffers.buffer.buffer.vbuf.b);
			this.gl.vertexAttribPointer(a.index,a.size,a.type,false,buffers.buffer.buffer.stride * 4,buffers.offset * 4);
			buffers = buffers.next;
		}
		this.curBuffer = null;
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
	,setRenderZone: function(x,y,width,height) {
		if(x == 0 && y == 0 && width < 0 && height < 0) this.gl.disable(3089); else {
			this.gl.enable(3089);
			this.gl.scissor(x,this.bufferHeight - (y + height),width,height);
		}
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
	,setRenderTargets: function(textures) {
		throw new js__$Boot_HaxeError("TODO");
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
	,captureRenderBuffer: function(pixels) {
		if(this.curTarget == null) throw new js__$Boot_HaxeError("Can't capture main render buffer in GL");
		this.gl.readPixels(0,0,pixels.width,pixels.height,6408,5121,pixels.bytes.b);
		pixels.set_format(hxd_PixelFormat.RGBA);
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
	,uploadVertexBytes: function(start,vertices,data,dataPos) {
		if(dataPos == null) dataPos = 0;
		this.mem.driver.uploadVertexBytes(this.vbuf,start,vertices,data,dataPos);
	}
	,alloc: function(vertices,align) {
		var p = this.allocPosition(vertices,align);
		if(p < 0) return null;
		var b = new h3d_Buffer(vertices,this.stride,[h3d_BufferFlag.NoAlloc]);
		b.position = p;
		b.buffer = this;
		return b;
	}
	,getFreeVertices: function() {
		var m = 0;
		var l = this.freeList;
		while(l != null) {
			m += l.count;
			l = l.next;
		}
		return m;
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
	,isDisposed: function() {
		return this.vbuf == null;
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
	,stats: function() {
		var total = 0;
		var free = 0;
		var count = 0;
		var _g = 0;
		var _g1 = this.buffers;
		while(_g < _g1.length) {
			var b = _g1[_g];
			++_g;
			var b1 = b;
			while(b1 != null) {
				total += b1.stride * b1.size * 4;
				var f = b1.freeList;
				while(f != null) {
					free += f.count * b1.stride * 4;
					f = f.next;
				}
				count++;
				b1 = b1.next;
			}
		}
		return { bufferCount : this.bufferCount, freeManagedMemory : free, managedMemory : total, totalMemory : this.usedMemory + this.texMemory, textureCount : this.textures.length, textureMemory : this.texMemory};
	}
	,allocStats: function() {
		return [];
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
	get: function(index) {
		if(index == null) index = 0;
		return this.cache[index];
	}
	,set: function(t,index) {
		this.cache[index] = t;
	}
	,begin: function(ctx) {
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
	,dispose: function() {
		var _g = 0;
		var _g1 = this.cache;
		while(_g < _g1.length) {
			var t = _g1[_g];
			++_g;
			t.dispose();
		}
		this.cache = [];
		this.frame = -1;
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
var h3d_mat_TextureFlags = $hxClasses["h3d.mat.TextureFlags"] = { __ename__ : true, __constructs__ : ["Target","TargetDepth","TargetUseDefaultDepth","Cubic","MipMapped","IsNPOT","NoAlloc","Dynamic","AlphaPremultiplied","WasCleared"] };
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
h3d_mat_TextureFlags.__empty_constructs__ = [h3d_mat_TextureFlags.Target,h3d_mat_TextureFlags.TargetDepth,h3d_mat_TextureFlags.TargetUseDefaultDepth,h3d_mat_TextureFlags.Cubic,h3d_mat_TextureFlags.MipMapped,h3d_mat_TextureFlags.IsNPOT,h3d_mat_TextureFlags.NoAlloc,h3d_mat_TextureFlags.Dynamic,h3d_mat_TextureFlags.AlphaPremultiplied,h3d_mat_TextureFlags.WasCleared];
var h3d_mat_Defaults = function() { };
$hxClasses["h3d.mat.Defaults"] = h3d_mat_Defaults;
h3d_mat_Defaults.__name__ = ["h3d","mat","Defaults"];
h3d_mat_Defaults.get_shadowShader = function() {
	var s = h3d_mat_Defaults.shadowShader;
	if(s == null) h3d_mat_Defaults.set_shadowShader(s = new h3d_shader_Shadow());
	return s;
};
h3d_mat_Defaults.set_shadowShader = function(s) {
	return h3d_mat_Defaults.shadowShader = s;
};
h3d_mat_Defaults.makeVolumeDecal = function(bounds) {
	return new h3d_shader_VolumeDecal(bounds.xMax - bounds.xMin,bounds.yMax - bounds.yMin);
};
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
	,removePass: function(p) {
		var prev = null;
		var cur = this.passes;
		while(cur != null) {
			if(cur == p) {
				if(prev == null) this.passes = p.nextPass; else prev.nextPass = p.nextPass;
				p.nextPass = null;
				return true;
			}
			prev = cur;
			cur = cur.nextPass;
		}
		return false;
	}
	,get_mainPass: function() {
		return this.passes;
	}
	,getPasses: function() {
		var p = this.passes;
		var out = [];
		while(p != null) {
			out.push(p);
			p = p.nextPass;
		}
		return HxOverrides.iter(out);
	}
	,getPass: function(name) {
		var p = this.passes;
		while(p != null) {
			if(p.name == name) return p;
			p = p.nextPass;
		}
		return null;
	}
	,allocPass: function(name,inheritMain) {
		if(inheritMain == null) inheritMain = true;
		var p = this.getPass(name);
		if(p != null) return p;
		var p1 = new h3d_mat_Pass(name,null,inheritMain?this.passes:null);
		this.addPass(p1);
		return p1;
	}
	,clone: function(m) {
		if(m == null) m = new h3d_mat_Material();
		m.passes.loadProps(this.passes);
		m.set_castShadows(this.castShadows);
		m.set_receiveShadows(this.receiveShadows);
		m.name = this.name;
		return m;
	}
	,get_shadows: function() {
		return this.castShadows && this.receiveShadows;
	}
	,set_shadows: function(v) {
		this.set_castShadows(v);
		this.set_receiveShadows(v);
		return v;
	}
	,set_castShadows: function(v) {
		if(this.castShadows == v) return v;
		if(v) this.addPass(new h3d_mat_Pass("shadow",null,this.passes)); else this.removePass(this.getPass("shadow"));
		return this.castShadows = v;
	}
	,set_receiveShadows: function(v) {
		if(v == this.receiveShadows) return v;
		var shadows = h3d_mat_Defaults.get_shadowShader();
		if(v) this.passes.addShader(shadows); else this.passes.removeShader(shadows);
		return this.receiveShadows = v;
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
	get_specularPower: function() {
		return this.mshader.specularPower__;
	}
	,set_specularPower: function(v) {
		return this.mshader.specularPower__ = v;
	}
	,get_specularAmount: function() {
		return this.mshader.specularAmount__;
	}
	,set_specularAmount: function(v) {
		return this.mshader.specularAmount__ = v;
	}
	,get_color: function() {
		return this.mshader.color__;
	}
	,set_color: function(v) {
		return this.mshader.color__ = v;
	}
	,clone: function(m) {
		var m1;
		if(m == null) m1 = new h3d_mat_MeshMaterial(); else m1 = m;
		h3d_mat_Material.prototype.clone.call(this,m1);
		m1.set_texture(this.get_texture());
		if(this.textureShader != null) {
			m1.textureShader.set_additive(this.textureShader.additive__);
			m1.textureShader.set_killAlpha(this.textureShader.killAlpha__);
			m1.textureShader.killAlphaThreshold__ = this.textureShader.killAlphaThreshold__;
		}
		m1.mshader.color__ = this.mshader.color__;
		m1.set_blendMode(this.blendMode);
		return m1;
	}
	,set_blendMode: function(v) {
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
	,get_specularTexture: function() {
		if(this.specularShader == null) return null; else return this.specularShader.texture__;
	}
	,get_texture: function() {
		if(this.textureShader == null) return null; else return this.textureShader.texture__;
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
	,set_specularTexture: function(t) {
		if(t == null) {
			if(this.specularShader != null) {
				this.passes.removeShader(this.specularShader);
				this.specularShader = null;
			}
		} else {
			if(this.specularShader == null) {
				this.specularShader = new h3d_shader_SpecularTexture();
				this.passes.addShader(this.specularShader);
			}
			this.specularShader.texture__ = t;
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
h3d_mat_Pass.getCulling = function(v) {
	return v & 3;
};
h3d_mat_Pass.getDepthWrite = function(v) {
	return v >> 2 & 1;
};
h3d_mat_Pass.getDepthTest = function(v) {
	return v >> 3 & 7;
};
h3d_mat_Pass.getBlendSrc = function(v) {
	return v >> 6 & 15;
};
h3d_mat_Pass.getBlendDst = function(v) {
	return v >> 10 & 15;
};
h3d_mat_Pass.getBlendAlphaSrc = function(v) {
	return v >> 14 & 15;
};
h3d_mat_Pass.getBlendAlphaDst = function(v) {
	return v >> 18 & 15;
};
h3d_mat_Pass.getBlendOp = function(v) {
	return v >> 22 & 3;
};
h3d_mat_Pass.getBlendAlphaOp = function(v) {
	return v >> 24 & 3;
};
h3d_mat_Pass.getColorMask = function(v) {
	return v >> 26 & 15;
};
h3d_mat_Pass.prototype = {
	loadProps: function(p) {
		this.name = p.name;
		this.passId = p.passId;
		this.bits = p.bits;
		this.enableLights = p.enableLights;
		this.dynamicParameters = p.dynamicParameters;
		this.set_culling(p.culling);
		this.set_depthWrite(p.depthWrite);
		this.set_depthTest(p.depthTest);
		this.set_blendSrc(p.blendSrc);
		this.set_blendDst(p.blendDst);
		this.set_blendOp(p.blendOp);
		this.set_blendAlphaSrc(p.blendAlphaSrc);
		this.set_blendAlphaDst(p.blendAlphaDst);
		this.set_blendAlphaOp(p.blendAlphaOp);
		this.set_colorMask(p.colorMask);
	}
	,setPassName: function(name) {
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
	,setColorMask: function(r,g,b,a) {
		this.set_colorMask((r?1:0) | (g?2:0) | (b?4:0) | (a?8:0));
	}
	,addShader: function(s) {
		this.shaders = new hxsl_ShaderList(s,this.shaders);
		return s;
	}
	,addShaderAt: function(s,index) {
		var prev = null;
		var cur = this.shaders;
		while(index > 0 && cur != this.parentShaders) {
			prev = cur;
			cur = cur.next;
			index--;
		}
		if(prev == null) this.shaders = new hxsl_ShaderList(s,cur); else prev.next = new hxsl_ShaderList(s,cur);
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
	,getShader: function(t) {
		var s = this.shaders;
		while(s != this.parentShaders) {
			var sh = Std.instance(s.s,t);
			if(sh != null) return sh;
			s = s.next;
		}
		return null;
	}
	,getShaders: function() {
		return new hxsl__$ShaderList_ShaderIterator(this.shaders,this.parentShaders);
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
	,clone: function() {
		var p = new h3d_mat_Pass(this.name,this.shaders.clone());
		p.bits = this.bits;
		p.enableLights = this.enableLights;
		return p;
	}
	,getDebugShaderCode: function(scene,toHxsl) {
		if(toHxsl == null) toHxsl = true;
		var shader = scene.renderer.compileShader(this);
		var toString;
		if(toHxsl) toString = (function(f,a1) {
			return function(s) {
				return f(s,a1);
			};
		})(hxsl_Printer.shaderToString,true); else toString = hxsl_GlslOut.toGlsl;
		return "VERTEX=\n" + toString(shader.vertex.data) + "\n\nFRAGMENT=\n" + toString(shader.fragment.data);
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
h3d_mat_Texture.fromBitmap = function(bmp,allocPos) {
	var t = new h3d_mat_Texture(bmp.ctx.canvas.width,bmp.ctx.canvas.height,null,null,allocPos);
	t.uploadBitmap(bmp);
	return t;
};
h3d_mat_Texture.fromPixels = function(pixels,allocPos) {
	var t = new h3d_mat_Texture(pixels.width,pixels.height,null,null,allocPos);
	t.uploadPixels(pixels);
	return t;
};
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
h3d_mat_Texture.genNoise = function(size) {
	var t = h3d_mat_Texture.noiseTextures.h[size];
	if(t != null && !(t.t == null && t.realloc == null)) return t;
	var t1 = new h3d_mat_Texture(size,size,[h3d_mat_TextureFlags.NoAlloc]);
	t1.realloc = (function(f,t2,a1) {
		return function() {
			f(t2,a1);
		};
	})(h3d_mat_Texture.allocNoise,t1,size);
	h3d_mat_Texture.noiseTextures.h[size] = t1;
	return t1;
};
h3d_mat_Texture.allocNoise = function(t,size) {
	var b = new hxd_BitmapData(size,size);
	var _g = 0;
	while(_g < size) {
		var x = _g++;
		var _g1 = 0;
		while(_g1 < size) {
			var y = _g1++;
			var n = Std.random(256);
			b.setPixel(x,y,-16777216 | n | n << 8 | n << 16);
		}
	}
	t.uploadBitmap(b);
	b.ctx = null;
	b.pixel = null;
};
h3d_mat_Texture.prototype = {
	alloc: function() {
		if(this.t == null) this.mem.allocTexture(this);
	}
	,toString: function() {
		var str = this.name;
		if(this.name == null) str = "Texture_" + this.id;
		return str + "(" + this.width + "x" + this.height + ")";
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
	,hasDefaultFlags: function() {
		return (this.bits & 524288) == 0;
	}
	,isDisposed: function() {
		return this.t == null && this.realloc == null;
	}
	,resize: function(width,height) {
		this.dispose();
		var tw = 1;
		var th = 1;
		while(tw < width) tw <<= 1;
		while(th < height) th <<= 1;
		if(tw != width || th != height) this.flags |= 1 << h3d_mat_TextureFlags.IsNPOT[1]; else this.flags &= 268435455 - (1 << h3d_mat_TextureFlags.IsNPOT[1]);
		this.width = width;
		this.height = height;
		if(!((this.flags & 1 << h3d_mat_TextureFlags.NoAlloc[1]) != 0)) this.alloc();
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
	,uploadBitmap: function(bmp,mipLevel,side) {
		if(side == null) side = 0;
		if(mipLevel == null) mipLevel = 0;
		this.alloc();
		this.mem.driver.uploadTextureBitmap(this,bmp,mipLevel,side);
		this.flags |= 1 << h3d_mat_TextureFlags.WasCleared[1];
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
	,capturePixels: function() {
		var e = h3d_Engine.CURRENT;
		e.pushTarget(this);
		if(e.needFlushTarget) e.doFlushTarget();
		var pixels = hxd_Pixels.alloc(this.width,this.height,hxd_PixelFormat.RGBA);
		e.driver.captureRenderBuffer(pixels);
		e.popTarget();
		return pixels;
	}
	,__class__: h3d_mat_Texture
};
var h3d_pass_Base = function() {
	this.forceProcessing = false;
	this.priority = 0;
};
$hxClasses["h3d.pass.Base"] = h3d_pass_Base;
h3d_pass_Base.__name__ = ["h3d","pass","Base"];
h3d_pass_Base.prototype = {
	getTexture: function(index) {
		if(index == null) index = 0;
		return null;
	}
	,setTexture: function(t,index) {
		if(index == null) index = 0;
		throw new js__$Boot_HaxeError("Not implemented");
	}
	,compileShader: function(p) {
		throw new js__$Boot_HaxeError("Not implemented for this pass");
		return null;
	}
	,setContext: function(ctx) {
		this.ctx = ctx;
	}
	,dispose: function() {
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
	,set_depthBlur: function(d) {
		this.depthBlur = d;
		if(d == null) {
			this.shader.set_isDepthDependant(false);
			this.shader.depthTexture__ = null;
			this.shader.normalTexture__ = null;
		} else {
			this.shader.set_isDepthDependant(true);
			this.shader.depthTexture__ = d.depths;
			this.shader.normalTexture__ = d.normals;
		}
		return d;
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
		if(this.quality <= 0 || this.passes <= 0 || this.sigma <= 0) return;
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
	,clone: function() {
		return this;
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
	get_color: function() {
		return this.color__;
	}
	,set_color: function(_v) {
		return this.color__ = _v;
	}
	,updateConstants: function(globals) {
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
	,clone: function() {
		var s = Type.createEmptyInstance(h3d_pass__$Border_BorderShader);
		s.shader = this.shader;
		s.color__ = this.color__;
		return s;
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
	get_globals: function() {
		return this.manager.globals;
	}
	,getTexture: function(index) {
		if(index == null) index = 0;
		return this.tcache.cache[index];
	}
	,setTexture: function(t,index) {
		if(index == null) index = 0;
		this.tcache.set(t,index);
	}
	,dispose: function() {
		h3d_pass_Base.prototype.dispose.call(this);
		this.tcache.dispose();
	}
	,getOutputs: function() {
		return ["output.position","output.color"];
	}
	,compileShader: function(p) {
		return this.manager.compileShaders(p.getShadersRec());
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
	,log: function(str) {
		null;
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
			this.ctx.drawPass = p1;
			this.ctx.engine.selectMaterial(p1.pass);
			p1.obj.draw(this.ctx);
			p1 = p1.next;
		}
		if(this.ctx.engine.driver.logEnable) null;
		this.ctx.nextPass();
		return passes;
	}
	,get_cameraView: function() {
		return this.manager.globals.map.h[this.cameraView_id];
	}
	,set_cameraView: function(v) {
		this.manager.globals.fastSet(this.cameraView_id,v);
		return v;
	}
	,get_cameraNear: function() {
		return this.manager.globals.map.h[this.cameraNear_id];
	}
	,set_cameraNear: function(v) {
		this.manager.globals.fastSet(this.cameraNear_id,v);
		return v;
	}
	,get_cameraFar: function() {
		return this.manager.globals.map.h[this.cameraFar_id];
	}
	,set_cameraFar: function(v) {
		this.manager.globals.fastSet(this.cameraFar_id,v);
		return v;
	}
	,get_cameraProj: function() {
		return this.manager.globals.map.h[this.cameraProj_id];
	}
	,set_cameraProj: function(v) {
		this.manager.globals.fastSet(this.cameraProj_id,v);
		return v;
	}
	,get_cameraPos: function() {
		return this.manager.globals.map.h[this.cameraPos_id];
	}
	,set_cameraPos: function(v) {
		this.manager.globals.fastSet(this.cameraPos_id,v);
		return v;
	}
	,get_cameraProjDiag: function() {
		return this.manager.globals.map.h[this.cameraProjDiag_id];
	}
	,set_cameraProjDiag: function(v) {
		this.manager.globals.fastSet(this.cameraProjDiag_id,v);
		return v;
	}
	,get_cameraViewProj: function() {
		return this.manager.globals.map.h[this.cameraViewProj_id];
	}
	,set_cameraViewProj: function(v) {
		this.manager.globals.fastSet(this.cameraViewProj_id,v);
		return v;
	}
	,get_cameraInverseViewProj: function() {
		return this.manager.globals.map.h[this.cameraInverseViewProj_id];
	}
	,set_cameraInverseViewProj: function(v) {
		this.manager.globals.fastSet(this.cameraInverseViewProj_id,v);
		return v;
	}
	,get_globalTime: function() {
		return this.manager.globals.map.h[this.globalTime_id];
	}
	,set_globalTime: function(v) {
		this.manager.globals.fastSet(this.globalTime_id,v);
		return v;
	}
	,get_pixelSize: function() {
		return this.manager.globals.map.h[this.pixelSize_id];
	}
	,set_pixelSize: function(v) {
		this.manager.globals.fastSet(this.pixelSize_id,v);
		return v;
	}
	,get_globalModelView: function() {
		return this.manager.globals.map.h[this.globalModelView_id];
	}
	,set_globalModelView: function(v) {
		this.manager.globals.fastSet(this.globalModelView_id,v);
		return v;
	}
	,get_globalModelViewInverse: function() {
		return this.manager.globals.map.h[this.globalModelViewInverse_id];
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
	get_additiveLighting: function() {
		return Std.instance(this.ambientShader,h3d_shader_AmbientLight).get_additive();
	}
	,set_additiveLighting: function(b) {
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
	,dispose: function() {
		h3d_pass_Default.prototype.dispose.call(this);
		this.blur.dispose();
		if(this.border != null) this.border.dispose();
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
var h3d_prim_Primitive = function() { };
$hxClasses["h3d.prim.Primitive"] = h3d_prim_Primitive;
h3d_prim_Primitive.__name__ = ["h3d","prim","Primitive"];
h3d_prim_Primitive.prototype = {
	triCount: function() {
		if(this.indexes != null) return this.indexes.count / 3 | 0; else if(this.buffer == null) return 0; else return Std["int"](this.buffer.totalVertices() / 3);
	}
	,vertexCount: function() {
		return 0;
	}
	,getCollider: function() {
		throw new js__$Boot_HaxeError("not implemented");
		return null;
	}
	,getBounds: function() {
		throw new js__$Boot_HaxeError("not implemented");
		return null;
	}
	,alloc: function(engine) {
		throw new js__$Boot_HaxeError("not implemented");
	}
	,selectMaterial: function(material) {
	}
	,buildNormalsDisplay: function() {
		throw new js__$Boot_HaxeError("not implemented");
		return null;
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
var h3d_prim_BigPrimitive = function(stride,isRaw,pos) {
	if(isRaw == null) isRaw = false;
	this.isRaw = isRaw;
	this.buffers = [];
	this.allIndexes = [];
	this.bounds = new h3d_col_Bounds();
	this.stride = stride;
	if(stride < 3) throw new js__$Boot_HaxeError("Minimum stride = 3");
};
$hxClasses["h3d.prim.BigPrimitive"] = h3d_prim_BigPrimitive;
h3d_prim_BigPrimitive.__name__ = ["h3d","prim","BigPrimitive"];
h3d_prim_BigPrimitive.__super__ = h3d_prim_Primitive;
h3d_prim_BigPrimitive.prototype = $extend(h3d_prim_Primitive.prototype,{
	begin: function(vcount,icount) {
		this.startIndex = this.bufPos / this.stride | 0;
		if(this.startIndex + vcount >= 65535) {
			if(vcount >= 65535) throw new js__$Boot_HaxeError("Too many vertices in begin()");
			this.flush();
		}
		if(this.tmpBuf == null) {
			this.tmpBuf = h3d_prim_BigPrimitive.PREV_BUFFER;
			if(this.tmpBuf == null) {
				var this1;
				this1 = new Array(0);
				this.tmpBuf = this1;
			} else h3d_prim_BigPrimitive.PREV_BUFFER = null;
			var this2 = this.tmpBuf;
			while(this2.length < 65535 * this.stride) this2.push(0.);
		}
		if(this.tmpIdx == null) {
			this.tmpIdx = h3d_prim_BigPrimitive.PREV_INDEX;
			if(this.tmpIdx == null) {
				var this3;
				this3 = new Array(0);
				this.tmpIdx = this3;
			} else h3d_prim_BigPrimitive.PREV_INDEX = null;
		}
		if(this.idxPos + icount > this.tmpIdx.length) {
			var size;
			if(this.tmpIdx.length == 0) size = 1024; else size = this.tmpIdx.length;
			var req = this.idxPos + icount;
			while(size < req) size <<= 1;
			var this4 = this.tmpIdx;
			while(this4.length < size) this4.push(0);
		}
	}
	,addPoint: function(x,y,z) {
		var key = this.bufPos++;
		this.tmpBuf[key] = x;
		var key1 = this.bufPos++;
		this.tmpBuf[key1] = y;
		var key2 = this.bufPos++;
		this.tmpBuf[key2] = z;
		this.bounds.addPos(x,y,z);
	}
	,addBounds: function(x,y,z) {
		this.bounds.addPos(x,y,z);
	}
	,addVertexValue: function(v) {
		var key = this.bufPos++;
		this.tmpBuf[key] = v;
	}
	,addIndex: function(i) {
		var key = this.idxPos++;
		this.tmpIdx[key] = i + this.startIndex;
	}
	,triCount: function() {
		var count = 0;
		var _g = 0;
		var _g1 = this.allIndexes;
		while(_g < _g1.length) {
			var i = _g1[_g];
			++_g;
			count += i.count;
		}
		count += this.idxPos;
		return count / 3 | 0;
	}
	,vertexCount: function() {
		var count = 0;
		var _g = 0;
		var _g1 = this.buffers;
		while(_g < _g1.length) {
			var b = _g1[_g];
			++_g;
			count += b.vertices;
		}
		count += this.bufPos / this.stride | 0;
		return count;
	}
	,flush: function() {
		if(this.tmpBuf != null) {
			if(this.bufPos > 0 && this.idxPos > 0) {
				var b = h3d_Buffer.ofSubFloats(this.tmpBuf,this.stride,this.bufPos / this.stride | 0);
				if(this.isRaw) b.flags |= 1 << h3d_BufferFlag.RawFormat[1];
				this.buffers.push(b);
				this.allIndexes.push(h3d_Indexes.alloc(this.tmpIdx,0,this.idxPos));
			}
			if(h3d_prim_BigPrimitive.PREV_BUFFER == null || h3d_prim_BigPrimitive.PREV_BUFFER.length < this.tmpBuf.length) h3d_prim_BigPrimitive.PREV_BUFFER = this.tmpBuf;
			if(h3d_prim_BigPrimitive.PREV_INDEX == null || h3d_prim_BigPrimitive.PREV_INDEX.length < this.tmpIdx.length) h3d_prim_BigPrimitive.PREV_INDEX = this.tmpIdx;
			this.tmpBuf = null;
			this.tmpIdx = null;
			this.bufPos = 0;
			this.idxPos = 0;
			this.startIndex = 0;
		}
	}
	,render: function(engine) {
		if(this.tmpBuf != null) this.flush();
		var _g1 = 0;
		var _g = this.buffers.length;
		while(_g1 < _g) {
			var i = _g1++;
			engine.renderIndexed(this.buffers[i],this.allIndexes[i]);
		}
	}
	,getBounds: function() {
		return this.bounds;
	}
	,dispose: function() {
		this.clear();
	}
	,clear: function() {
		this.bounds.empty();
		var _g = 0;
		var _g1 = this.buffers;
		while(_g < _g1.length) {
			var b = _g1[_g];
			++_g;
			b.dispose();
		}
		var _g2 = 0;
		var _g11 = this.allIndexes;
		while(_g2 < _g11.length) {
			var i = _g11[_g2];
			++_g2;
			i.dispose();
		}
		this.buffers = [];
		this.allIndexes = [];
		this.bufPos = 0;
		this.tmpBuf = null;
		this.tmpIdx = null;
	}
	,add: function(buf,idx,dx,dy,dz,rotation,scale,stride) {
		if(stride == null) stride = -1;
		if(scale == null) scale = 1.;
		if(rotation == null) rotation = 0.;
		if(dz == null) dz = 0.;
		if(dy == null) dy = 0.;
		if(dx == null) dx = 0.;
		this.addSub(buf,idx,0,0,buf.length / (stride < 0?this.stride:stride) | 0,idx.length / 3 | 0,dx,dy,dz,rotation,scale,stride);
		return;
	}
	,addSub: function(buf,idx,startVert,startTri,nvert,triCount,dx,dy,dz,rotation,scale,stride,deltaU,deltaV,color) {
		if(color == null) color = 1.;
		if(deltaV == null) deltaV = 0.;
		if(deltaU == null) deltaU = 0.;
		if(stride == null) stride = -1;
		if(scale == null) scale = 1.;
		if(rotation == null) rotation = 0.;
		if(dz == null) dz = 0.;
		if(dy == null) dy = 0.;
		if(dx == null) dx = 0.;
		if(stride < 0) stride = this.stride;
		if(stride < this.stride) throw new js__$Boot_HaxeError("only stride >= " + this.stride + " allowed");
		this.begin(nvert,triCount * 3);
		var start = this.startIndex;
		var cr = Math.cos(rotation);
		var sr = Math.sin(rotation);
		var pos = this.bufPos;
		var tmpBuf = this.tmpBuf;
		var _g = 0;
		while(_g < nvert) {
			var i = _g++;
			var p = (i + startVert) * stride;
			var x;
			var key = p++;
			x = buf[key];
			var y;
			var key1 = p++;
			y = buf[key1];
			var z;
			var key2 = p++;
			z = buf[key2];
			var tx = (x * cr - y * sr) * scale;
			var ty = (x * sr + y * cr) * scale;
			var vx = dx + tx;
			var vy = dy + ty;
			var vz = dz + z * scale;
			var key3 = pos++;
			tmpBuf[key3] = vx;
			var key4 = pos++;
			tmpBuf[key4] = vy;
			var key5 = pos++;
			tmpBuf[key5] = vz;
			this.bounds.addPos(vx,vy,vz);
			var _g1 = this.stride;
			switch(_g1) {
			case 3:
				continue;
				break;
			case 4:
				var v;
				var key7 = p++;
				v = buf[key7];
				var key6 = pos++;
				tmpBuf[key6] = v;
				break;
			case 5:
				var v1;
				v1 = (function($this) {
					var $r;
					var key9 = p++;
					$r = buf[key9];
					return $r;
				}(this)) + deltaU;
				var key8 = pos++;
				tmpBuf[key8] = v1;
				var v2;
				v2 = (function($this) {
					var $r;
					var key11 = p++;
					$r = buf[key11];
					return $r;
				}(this)) + deltaV;
				var key10 = pos++;
				tmpBuf[key10] = v2;
				break;
			case 6:
				var nx;
				var key12 = p++;
				nx = buf[key12];
				var ny;
				var key13 = p++;
				ny = buf[key13];
				var nz;
				var key14 = p++;
				nz = buf[key14];
				var tnx = nx * cr - ny * sr;
				var tny = nx * sr + ny * cr;
				var key15 = pos++;
				tmpBuf[key15] = tnx;
				var key16 = pos++;
				tmpBuf[key16] = tny;
				var key17 = pos++;
				tmpBuf[key17] = nz;
				break;
			case 7:
				var nx1;
				var key18 = p++;
				nx1 = buf[key18];
				var ny1;
				var key19 = p++;
				ny1 = buf[key19];
				var nz1;
				var key20 = p++;
				nz1 = buf[key20];
				var tnx1 = nx1 * cr - ny1 * sr;
				var tny1 = nx1 * sr + ny1 * cr;
				var key21 = pos++;
				tmpBuf[key21] = tnx1;
				var key22 = pos++;
				tmpBuf[key22] = tny1;
				var key23 = pos++;
				tmpBuf[key23] = nz1;
				var v3;
				v3 = (function($this) {
					var $r;
					var key25 = p++;
					$r = buf[key25];
					return $r;
				}(this)) + deltaU;
				var key24 = pos++;
				tmpBuf[key24] = v3;
				break;
			case 8:case 9:case 10:
				var nx2;
				var key26 = p++;
				nx2 = buf[key26];
				var ny2;
				var key27 = p++;
				ny2 = buf[key27];
				var nz2;
				var key28 = p++;
				nz2 = buf[key28];
				var tnx2 = nx2 * cr - ny2 * sr;
				var tny2 = nx2 * sr + ny2 * cr;
				var key29 = pos++;
				tmpBuf[key29] = tnx2;
				var key30 = pos++;
				tmpBuf[key30] = tny2;
				var key31 = pos++;
				tmpBuf[key31] = nz2;
				var v4;
				v4 = (function($this) {
					var $r;
					var key33 = p++;
					$r = buf[key33];
					return $r;
				}(this)) + deltaU;
				var key32 = pos++;
				tmpBuf[key32] = v4;
				var v5;
				v5 = (function($this) {
					var $r;
					var key35 = p++;
					$r = buf[key35];
					return $r;
				}(this)) + deltaV;
				var key34 = pos++;
				tmpBuf[key34] = v5;
				var _g3 = 8;
				var _g2 = this.stride;
				while(_g3 < _g2) {
					var i1 = _g3++;
					var v6;
					var key37 = p++;
					v6 = buf[key37];
					var key36 = pos++;
					tmpBuf[key36] = v6;
				}
				break;
			default:
				var nx3;
				var key38 = p++;
				nx3 = buf[key38];
				var ny3;
				var key39 = p++;
				ny3 = buf[key39];
				var nz3;
				var key40 = p++;
				nz3 = buf[key40];
				var tnx3 = nx3 * cr - ny3 * sr;
				var tny3 = nx3 * sr + ny3 * cr;
				var key41 = pos++;
				tmpBuf[key41] = tnx3;
				var key42 = pos++;
				tmpBuf[key42] = tny3;
				var key43 = pos++;
				tmpBuf[key43] = nz3;
				var v7;
				v7 = (function($this) {
					var $r;
					var key45 = p++;
					$r = buf[key45];
					return $r;
				}(this)) + deltaU;
				var key44 = pos++;
				tmpBuf[key44] = v7;
				var v8;
				v8 = (function($this) {
					var $r;
					var key47 = p++;
					$r = buf[key47];
					return $r;
				}(this)) + deltaV;
				var key46 = pos++;
				tmpBuf[key46] = v8;
				var v9;
				v9 = (function($this) {
					var $r;
					var key49 = p++;
					$r = buf[key49];
					return $r;
				}(this)) * color;
				var key48 = pos++;
				tmpBuf[key48] = v9;
				var v10;
				v10 = (function($this) {
					var $r;
					var key51 = p++;
					$r = buf[key51];
					return $r;
				}(this)) * color;
				var key50 = pos++;
				tmpBuf[key50] = v10;
				var v11;
				v11 = (function($this) {
					var $r;
					var key53 = p++;
					$r = buf[key53];
					return $r;
				}(this)) * color;
				var key52 = pos++;
				tmpBuf[key52] = v11;
				var _g31 = 11;
				var _g21 = this.stride;
				while(_g31 < _g21) {
					var i2 = _g31++;
					var v12;
					var key55 = p++;
					v12 = buf[key55];
					var key54 = pos++;
					tmpBuf[key54] = v12;
				}
			}
		}
		this.bufPos = pos;
		start -= startVert;
		var _g11 = 0;
		var _g4 = triCount * 3;
		while(_g11 < _g4) {
			var i3 = _g11++;
			var key56 = this.idxPos++;
			this.tmpIdx[key56] = idx[i3 + startTri * 3] + start;
		}
	}
	,__class__: h3d_prim_BigPrimitive
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
	,vertexCount: function() {
		return 4;
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
	,vertexCount: function() {
		return this.vcount;
	}
	,__class__: h3d_prim_RawPrimitive
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
	get_visible: function() {
		return (this.flags & 2) != 0;
	}
	,get_allocated: function() {
		return (this.flags & 32) != 0;
	}
	,get_posChanged: function() {
		return (this.flags & 1) != 0;
	}
	,get_culled: function() {
		return (this.flags & 4) != 0;
	}
	,get_followPositionOnly: function() {
		return (this.flags & 8) != 0;
	}
	,get_lightCameraCenter: function() {
		return (this.flags & 16) != 0;
	}
	,get_alwaysSync: function() {
		return (this.flags & 64) != 0;
	}
	,get_inheritCulled: function() {
		return (this.flags & 128) != 0;
	}
	,set_posChanged: function(b) {
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
	,set_followPositionOnly: function(b) {
		var f = 8;
		if(b) this.flags |= f; else this.flags &= ~f;
		return b;
	}
	,set_lightCameraCenter: function(b) {
		var f = 16;
		if(b) this.flags |= f; else this.flags &= ~f;
		return b;
	}
	,set_alwaysSync: function(b) {
		var f = 64;
		if(b) this.flags |= f; else this.flags &= ~f;
		return b;
	}
	,set_inheritCulled: function(b) {
		var f = 128;
		if(b) this.flags |= f; else this.flags &= ~f;
		return b;
	}
	,playAnimation: function(a) {
		return this.currentAnimation = a.createInstance(this);
	}
	,switchToAnimation: function(a) {
		return this.currentAnimation = a;
	}
	,stopAnimation: function() {
		this.currentAnimation = null;
	}
	,applyAnimationTransform: function(recursive) {
		if(recursive == null) recursive = true;
		if(this.defaultTransform != null) {
			var s = this.defaultTransform.getScale();
			this.set_scaleX(s.x);
			this.set_scaleY(s.y);
			this.set_scaleZ(s.z);
			this.qRot.initRotateMatrix(this.defaultTransform);
			this.set_x(this.defaultTransform._41);
			this.set_y(this.defaultTransform._42);
			this.set_z(this.defaultTransform._43);
			this.defaultTransform = null;
			this.set_posChanged(true);
			null;
		}
		if(recursive) {
			var _g = 0;
			var _g1 = this.childs;
			while(_g < _g1.length) {
				var c = _g1[_g];
				++_g;
				c.applyAnimationTransform();
			}
		}
	}
	,getObjectsCount: function() {
		var k = 0;
		var _g = 0;
		var _g1 = this.childs;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			k += c.getObjectsCount() + 1;
		}
		return k;
	}
	,getMaterialByName: function(name) {
		var _g = 0;
		var _g1 = this.childs;
		while(_g < _g1.length) {
			var o = _g1[_g];
			++_g;
			var m = o.getMaterialByName(name);
			if(m != null) return m;
		}
		return null;
	}
	,getMaterials: function(a) {
		if(a == null) a = [];
		var _g = 0;
		var _g1 = this.childs;
		while(_g < _g1.length) {
			var o = _g1[_g];
			++_g;
			o.getMaterials(a);
		}
		return a;
	}
	,localToGlobal: function(pt) {
		this.syncPos();
		if(pt == null) pt = new h3d_Vector();
		pt.transform3x4(this.absPos);
		return pt;
	}
	,globalToLocal: function(pt) {
		pt.transform3x4(this.getInvPos());
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
	,getBounds: function(b,rec) {
		if(rec == null) rec = false;
		if(!rec) this.syncPos();
		if(b == null) b = new h3d_col_Bounds();
		if((this.flags & 1) != 0) {
			var _g = 0;
			var _g1 = this.childs;
			while(_g < _g1.length) {
				var c = _g1[_g];
				++_g;
				c.set_posChanged(true);
			}
			this.set_posChanged(false);
			this.calcAbsPos();
		}
		var _g2 = 0;
		var _g11 = this.childs;
		while(_g2 < _g11.length) {
			var c1 = _g11[_g2];
			++_g2;
			c1.getBounds(b,true);
		}
		return b;
	}
	,getMeshes: function(out) {
		if(out == null) out = [];
		var m;
		m = (this instanceof h3d_scene_Mesh)?this:null;
		if(m != null) out.push(m);
		var _g = 0;
		var _g1 = this.childs;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			c.getMeshes(out);
		}
		return out;
	}
	,getObjectByName: function(name) {
		if(this.name == name) return this;
		var _g = 0;
		var _g1 = this.childs;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			var o = c.getObjectByName(name);
			if(o != null) return o;
		}
		return null;
	}
	,clone: function(o) {
		if(o == null) o = new h3d_scene_Object();
		o.set_x(this.x);
		o.set_y(this.y);
		o.set_z(this.z);
		o.set_scaleX(this.scaleX);
		o.set_scaleY(this.scaleY);
		o.set_scaleZ(this.scaleZ);
		o.name = this.name;
		o.set_follow(this.follow);
		o.set_followPositionOnly((this.flags & 8) != 0);
		o.set_visible((this.flags & 2) != 0);
		if(this.defaultTransform != null) o.set_defaultTransform(this.defaultTransform.clone());
		var _g = 0;
		var _g1 = this.childs;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			var c1 = c.clone();
			c1.parent = o;
			o.childs.push(c1);
		}
		return o;
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
	,getAbsPos: function() {
		this.syncPos();
		return this.absPos;
	}
	,isMesh: function() {
		return ((this instanceof h3d_scene_Mesh)?this:null) != null;
	}
	,toMesh: function() {
		var m;
		m = (this instanceof h3d_scene_Mesh)?this:null;
		if(m != null) return m;
		throw new js__$Boot_HaxeError(Std.string(this) + " is not a Mesh");
	}
	,remove: function() {
		if(this.parent != null) this.parent.removeChild(this);
	}
	,draw: function(ctx) {
	}
	,set_follow: function(v) {
		this.set_posChanged(true);
		return this.follow = v;
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
	,set_scaleX: function(v) {
		this.scaleX = v;
		this.set_posChanged(true);
		return v;
	}
	,set_scaleY: function(v) {
		this.scaleY = v;
		this.set_posChanged(true);
		return v;
	}
	,set_scaleZ: function(v) {
		this.scaleZ = v;
		this.set_posChanged(true);
		return v;
	}
	,set_defaultTransform: function(v) {
		this.defaultTransform = v;
		this.set_posChanged(true);
		return v;
	}
	,setPos: function(x,y,z) {
		this.x = x;
		this.set_posChanged(true);
		x;
		this.y = y;
		this.set_posChanged(true);
		y;
		this.z = z;
		this.set_posChanged(true);
		z;
		this.set_posChanged(true);
	}
	,rotate: function(rx,ry,rz) {
		var qTmp = new h3d_Quat();
		qTmp.initRotate(rx,ry,rz);
		this.qRot.multiply(qTmp,this.qRot);
		this.set_posChanged(true);
	}
	,setRotate: function(rx,ry,rz) {
		this.qRot.initRotate(rx,ry,rz);
		this.set_posChanged(true);
	}
	,setRotateAxis: function(ax,ay,az,angle) {
		this.qRot.initRotateAxis(ax,ay,az,angle);
		this.set_posChanged(true);
	}
	,getRotationQuat: function() {
		return this.qRot;
	}
	,setRotationQuat: function(q) {
		this.qRot = q;
		this.set_posChanged(true);
	}
	,scale: function(v) {
		var _g = this;
		_g.set_scaleX(_g.scaleX * v);
		var _g1 = this;
		_g1.set_scaleY(_g1.scaleY * v);
		var _g2 = this;
		_g2.set_scaleZ(_g2.scaleZ * v);
		this.set_posChanged(true);
	}
	,setScale: function(v) {
		this.scaleX = v;
		this.set_posChanged(true);
		v;
		this.scaleY = v;
		this.set_posChanged(true);
		v;
		this.scaleZ = v;
		this.set_posChanged(true);
		v;
		this.set_posChanged(true);
	}
	,toString: function() {
		return Type.getClassName(js_Boot.getClass(this)).split(".").pop() + (this.name == null?"":"(" + this.name + ")");
	}
	,getChildAt: function(n) {
		return this.childs[n];
	}
	,get_numChildren: function() {
		return this.childs.length;
	}
	,iterator: function() {
		return new hxd_impl_ArrayIterator_$h3d_$scene_$Object(this.childs);
	}
	,dispose: function() {
		var _g = 0;
		var _g1 = this.childs;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			c.dispose();
		}
	}
	,__class__: h3d_scene_Object
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
	get_color: function() {
		return new h3d_Vector();
	}
	,get_enableSpecular: function() {
		return false;
	}
	,set_enableSpecular: function(b) {
		if(b) throw new js__$Boot_HaxeError("Not implemented for this light");
		return false;
	}
	,emit: function(ctx) {
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
	get_color: function() {
		return this.dshader.color__;
	}
	,get_enableSpecular: function() {
		return this.dshader.enableSpecular__;
	}
	,set_enableSpecular: function(b) {
		return this.dshader.set_enableSpecular(b);
	}
	,emit: function(ctx) {
		this.dshader.direction__.set(this.direction.x,this.direction.y,this.direction.z,null);
		this.dshader.direction__.normalize();
		h3d_scene_Light.prototype.emit.call(this,ctx);
	}
	,__class__: h3d_scene_DirLight
});
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
	getBounds: function(b,rec) {
		if(rec == null) rec = false;
		b = h3d_scene_Object.prototype.getBounds.call(this,b,rec);
		var tmp = this.primitive.getBounds().clone();
		tmp.transform3x4(this.absPos);
		if(tmp.xMin < b.xMin) b.xMin = tmp.xMin;
		if(tmp.xMax > b.xMax) b.xMax = tmp.xMax;
		if(tmp.yMin < b.yMin) b.yMin = tmp.yMin;
		if(tmp.yMax > b.yMax) b.yMax = tmp.yMax;
		if(tmp.zMin < b.zMin) b.zMin = tmp.zMin;
		if(tmp.zMax > b.zMax) b.zMax = tmp.zMax;
		return b;
	}
	,clone: function(o) {
		var m;
		if(o == null) m = new h3d_scene_Mesh(null,this.material); else m = o;
		m.primitive = this.primitive;
		m.material = this.material.clone();
		h3d_scene_Object.prototype.clone.call(this,m);
		return m;
	}
	,draw: function(ctx) {
		this.primitive.render(ctx.engine);
	}
	,emit: function(ctx) {
		ctx.emit(this.material,this,null);
	}
	,getMaterialByName: function(name) {
		if(this.material != null && this.material.name == name) return this.material;
		return h3d_scene_Object.prototype.getMaterialByName.call(this,name);
	}
	,getMaterials: function(a) {
		if(a == null) a = [];
		if(this.material != null) a.push(this.material);
		return h3d_scene_Object.prototype.getMaterials.call(this,a);
	}
	,dispose: function() {
		if(this.primitive != null) this.primitive.dispose();
		h3d_scene_Object.prototype.dispose.call(this);
	}
	,__class__: h3d_scene_Mesh
});
var h3d_scene_Graphics = function(parent) {
	this.lineSize = 0.;
	this.curR = 0.;
	this.curZ = 0.;
	this.curY = 0.;
	this.curX = 0.;
	this.bprim = new h3d_prim_BigPrimitive(12);
	h3d_scene_Mesh.call(this,this.bprim,null,parent);
	this.material.passes.addShader(new h3d_shader_LineShader());
	this.material.passes.addShader(new h3d_shader_VertexColorAlpha());
	this.material.passes.set_culling(h3d_mat_Face.None);
};
$hxClasses["h3d.scene.Graphics"] = h3d_scene_Graphics;
h3d_scene_Graphics.__name__ = ["h3d","scene","Graphics"];
h3d_scene_Graphics.__super__ = h3d_scene_Mesh;
h3d_scene_Graphics.prototype = $extend(h3d_scene_Mesh.prototype,{
	draw: function(ctx) {
		this.bprim.flush();
		h3d_scene_Mesh.prototype.draw.call(this,ctx);
	}
	,clear: function() {
		this.bprim.clear();
	}
	,lineStyle: function(size,color,alpha) {
		if(alpha == null) alpha = 1.;
		if(color == null) color = 0;
		if(size == null) size = 0.;
		if(size > 0 && this.lineSize != size) {
			this.lineSize = size;
			this.material.passes.getShader(h3d_shader_LineShader).set_width(this.lineSize);
		}
		this.setColor(color,alpha);
	}
	,setColor: function(color,alpha) {
		if(alpha == null) alpha = 1.;
		this.curA = alpha;
		this.curR = (color >> 16 & 255) / 255.;
		this.curG = (color >> 8 & 255) / 255.;
		this.curB = (color & 255) / 255.;
	}
	,drawLine: function(p1,p2) {
		this.moveTo(p1.x,p1.y,p1.z);
		this.lineTo(p2.x,p2.y,p2.z);
	}
	,moveTo: function(x,y,z) {
		this.curX = x;
		this.curY = y;
		this.curZ = z;
	}
	,lineTo: function(x,y,z) {
		var _g = this;
		this.bprim.begin(4,6);
		var nx = x - this.curX;
		var ny = y - this.curY;
		var nz = z - this.curZ;
		this.bprim.bounds.addPos(this.curX,this.curY,this.curZ);
		this.bprim.bounds.addPos(x,y,z);
		_g.bprim.addVertexValue(_g.curX);
		_g.bprim.addVertexValue(_g.curY);
		_g.bprim.addVertexValue(_g.curZ);
		_g.bprim.addVertexValue(nx);
		_g.bprim.addVertexValue(ny);
		_g.bprim.addVertexValue(nz);
		_g.bprim.addVertexValue(0);
		_g.bprim.addVertexValue(0);
		_g.bprim.addVertexValue(_g.curR);
		_g.bprim.addVertexValue(_g.curG);
		_g.bprim.addVertexValue(_g.curB);
		_g.bprim.addVertexValue(_g.curA);
		_g.bprim.addVertexValue(_g.curX);
		_g.bprim.addVertexValue(_g.curY);
		_g.bprim.addVertexValue(_g.curZ);
		_g.bprim.addVertexValue(nx);
		_g.bprim.addVertexValue(ny);
		_g.bprim.addVertexValue(nz);
		_g.bprim.addVertexValue(0);
		_g.bprim.addVertexValue(1);
		_g.bprim.addVertexValue(_g.curR);
		_g.bprim.addVertexValue(_g.curG);
		_g.bprim.addVertexValue(_g.curB);
		_g.bprim.addVertexValue(_g.curA);
		_g.bprim.addVertexValue(_g.curX);
		_g.bprim.addVertexValue(_g.curY);
		_g.bprim.addVertexValue(_g.curZ);
		_g.bprim.addVertexValue(nx);
		_g.bprim.addVertexValue(ny);
		_g.bprim.addVertexValue(nz);
		_g.bprim.addVertexValue(1);
		_g.bprim.addVertexValue(0);
		_g.bprim.addVertexValue(_g.curR);
		_g.bprim.addVertexValue(_g.curG);
		_g.bprim.addVertexValue(_g.curB);
		_g.bprim.addVertexValue(_g.curA);
		_g.bprim.addVertexValue(_g.curX);
		_g.bprim.addVertexValue(_g.curY);
		_g.bprim.addVertexValue(_g.curZ);
		_g.bprim.addVertexValue(nx);
		_g.bprim.addVertexValue(ny);
		_g.bprim.addVertexValue(nz);
		_g.bprim.addVertexValue(1);
		_g.bprim.addVertexValue(1);
		_g.bprim.addVertexValue(_g.curR);
		_g.bprim.addVertexValue(_g.curG);
		_g.bprim.addVertexValue(_g.curB);
		_g.bprim.addVertexValue(_g.curA);
		this.bprim.addIndex(0);
		this.bprim.addIndex(1);
		this.bprim.addIndex(2);
		this.bprim.addIndex(2);
		this.bprim.addIndex(3);
		this.bprim.addIndex(1);
		this.curX = x;
		this.curY = y;
		this.curZ = z;
	}
	,__class__: h3d_scene_Graphics
});
var h3d_scene_Interactive = function(shape,parent) {
	this.hitPoint = new h3d_Vector();
	this.propagateEvents = false;
	this.cancelEvents = false;
	h3d_scene_Object.call(this,parent);
	this.shape = shape;
	this.set_cursor(hxd_Cursor.Button);
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
	,set_cursor: function(c) {
		this.cursor = c;
		if(this.isOver()) hxd_System.setCursor(this.cursor);
		return c;
	}
	,focus: function() {
		if(this.scene == null || this.scene.events == null) return;
		this.scene.events.focus(this);
	}
	,blur: function() {
		if(this.hasFocus()) this.scene.events.blur();
	}
	,isOver: function() {
		return this.scene != null && this.scene.events != null && this.scene.events.currentOver == this;
	}
	,hasFocus: function() {
		return this.scene != null && this.scene.events != null && this.scene.events.currentFocus == this;
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
var h3d_scene_MultiMaterial = function(prim,mats,parent) {
	h3d_scene_Mesh.call(this,prim,mats == null?null:mats[0],parent);
	if(mats == null) this.materials = [this.material]; else this.materials = mats;
};
$hxClasses["h3d.scene.MultiMaterial"] = h3d_scene_MultiMaterial;
h3d_scene_MultiMaterial.__name__ = ["h3d","scene","MultiMaterial"];
h3d_scene_MultiMaterial.__super__ = h3d_scene_Mesh;
h3d_scene_MultiMaterial.prototype = $extend(h3d_scene_Mesh.prototype,{
	clone: function(o) {
		var m;
		if(o == null) m = new h3d_scene_MultiMaterial(null,this.materials); else m = o;
		var _g = [];
		var _g1 = 0;
		var _g2 = this.materials;
		while(_g1 < _g2.length) {
			var m1 = _g2[_g1];
			++_g1;
			_g.push(m1.clone());
		}
		m.materials = _g;
		h3d_scene_Mesh.prototype.clone.call(this,m);
		m.material = m.materials[0];
		return m;
	}
	,emit: function(ctx) {
		var _g1 = 0;
		var _g = this.materials.length;
		while(_g1 < _g) {
			var i = _g1++;
			var m = this.materials[i];
			if(m != null) ctx.emit(m,this,i);
		}
	}
	,getMaterialByName: function(name) {
		var _g = 0;
		var _g1 = this.materials;
		while(_g < _g1.length) {
			var m = _g1[_g];
			++_g;
			if(m.name == name) return m;
		}
		return h3d_scene_Mesh.prototype.getMaterialByName.call(this,name);
	}
	,getMaterials: function(a) {
		if(a == null) a = [];
		var _g = 0;
		var _g1 = this.materials;
		while(_g < _g1.length) {
			var m = _g1[_g];
			++_g;
			if(m != null) a.push(m);
		}
		var _g2 = 0;
		var _g11 = this.childs;
		while(_g2 < _g11.length) {
			var o = _g11[_g2];
			++_g2;
			o.getMaterials(a);
		}
		return a;
	}
	,draw: function(ctx) {
		if(this.materials.length > 1) this.primitive.selectMaterial(ctx.drawPass.index);
		h3d_scene_Mesh.prototype.draw.call(this,ctx);
	}
	,__class__: h3d_scene_MultiMaterial
});
var h3d_scene__$Object_ObjectFlags_$Impl_$ = {};
$hxClasses["h3d.scene._Object.ObjectFlags_Impl_"] = h3d_scene__$Object_ObjectFlags_$Impl_$;
h3d_scene__$Object_ObjectFlags_$Impl_$.__name__ = ["h3d","scene","_Object","ObjectFlags_Impl_"];
h3d_scene__$Object_ObjectFlags_$Impl_$._new = function() {
	return 0;
};
h3d_scene__$Object_ObjectFlags_$Impl_$.toInt = function(this1) {
	return this1;
};
h3d_scene__$Object_ObjectFlags_$Impl_$.has = function(this1,f) {
	return (this1 & f) != 0;
};
h3d_scene__$Object_ObjectFlags_$Impl_$.set = function(this1,f,b) {
	if(b) this1 |= f; else this1 &= ~f;
	return b;
};
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
	,getGlobal: function(name) {
		var id = hxsl_Globals.allocID(name);
		var _g = 0;
		var _g1 = this.sharedGlobals;
		while(_g < _g1.length) {
			var g = _g1[_g];
			++_g;
			if(g.gid == id) return g.value;
		}
		return null;
	}
	,setGlobal: function(name,value) {
		this.setGlobalID(hxsl_Globals.allocID(name),value);
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
	dispose: function() {
		var _g = 0;
		var _g1 = this.allPasses;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			p.p.dispose();
		}
		this.passes = new haxe_ds_StringMap();
		this.allPasses = [];
		this.passGroups = new haxe_ds_StringMap();
		this.tcache.dispose();
		this.def = this.depth = this.normal = this.shadow = null;
	}
	,compileShader: function(pass) {
		return this.getPass(pass.name).compileShader(pass);
	}
	,createDefaultPass: function(name) {
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
	,front2back: function(passes) {
		return this.depthSort(passes,true);
	}
	,back2front: function(passes) {
		return this.depthSort(passes,false);
	}
	,allocTarget: function(name,size,depth) {
		if(depth == null) depth = true;
		if(size == null) size = 0;
		return this.tcache.allocTarget(name,this.ctx,this.ctx.engine.width >> size,this.ctx.engine.height >> size,depth);
	}
	,clear: function(color,depth,stencil) {
		this.ctx.engine.clear(color,depth,stencil);
	}
	,pushTarget: function(tex) {
		this.ctx.engine.pushTarget(tex);
	}
	,setTarget: function(tex) {
		if(this.hasSetTarget) this.ctx.engine.popTarget();
		this.ctx.engine.pushTarget(tex);
		this.hasSetTarget = true;
	}
	,popTarget: function() {
		this.ctx.engine.popTarget();
	}
	,get: function(name) {
		var p = this.passGroups.get(name);
		if(p == null) return null;
		p.rendered = true;
		return p.passes;
	}
	,draw: function(name) {
		if(this.def == null) this.def = new h3d_pass_Default();
		this.def.draw(this.get(name));
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
	,process: function(ctx,passes) {
		this.ctx = ctx;
		this.hasSetTarget = false;
		var _g = 0;
		while(_g < passes.length) {
			var p = passes[_g];
			++_g;
			this.getPass(p.name).setContext(ctx);
			this.passGroups.set(p.name,p);
		}
		this.render();
		if(this.hasSetTarget) {
			ctx.engine.popTarget();
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
	this.renderer = new h3d_scene_Renderer();
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
	,clone: function(o) {
		var s;
		if(o == null) s = new h3d_scene_Scene(); else s = o;
		s.camera = this.camera.clone();
		h3d_scene_Object.prototype.clone.call(this,s);
		return s;
	}
	,dispose: function() {
		h3d_scene_Object.prototype.dispose.call(this);
		this.renderer.dispose();
		this.renderer = new h3d_scene_Renderer();
	}
	,addPass: function(p,before) {
		if(before == null) before = false;
		if(before) this.prePasses.push(p); else this.postPasses.push(p);
	}
	,removePass: function(p) {
		HxOverrides.remove(this.postPasses,p);
		HxOverrides.remove(this.prePasses,p);
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
		this.renderer.process(this.ctx,passes);
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
var h3d_scene_Joint = function(skin,j) {
	h3d_scene_Object.call(this,null);
	this.name = j.name;
	this.skin = skin;
	this.parent = skin;
	this.index = j.index;
};
$hxClasses["h3d.scene.Joint"] = h3d_scene_Joint;
h3d_scene_Joint.__name__ = ["h3d","scene","Joint"];
h3d_scene_Joint.__super__ = h3d_scene_Object;
h3d_scene_Joint.prototype = $extend(h3d_scene_Object.prototype,{
	syncPos: function() {
		var p = this.parent;
		while(p != null) {
			if((p.flags & 1) != 0) {
				if(this.skin.jointsAbsPosInv == null) {
					this.skin.jointsAbsPosInv = new h3d_Matrix();
					this.skin.jointsAbsPosInv.zero();
				}
				if(this.skin.jointsAbsPosInv._44 == 0) this.skin.jointsAbsPosInv.inverse3x4(this.parent.absPos);
				this.parent.syncPos();
				this.lastFrame = -1;
				break;
			}
			p = p.parent;
		}
		if(this.lastFrame != this.skin.lastFrame) {
			this.lastFrame = this.skin.lastFrame;
			this.absPos.loadFrom(this.skin.currentAbsPose[this.index]);
			if(this.skin.jointsAbsPosInv != null && this.skin.jointsAbsPosInv._44 != 0) {
				this.absPos.multiply3x4(this.absPos,this.skin.jointsAbsPosInv);
				this.absPos.multiply3x4(this.absPos,this.parent.absPos);
			}
		}
	}
	,__class__: h3d_scene_Joint
});
var h3d_scene_Skin = function(s,mat,parent) {
	h3d_scene_MultiMaterial.call(this,null,mat,parent);
	if(s != null) this.setSkinData(s);
};
$hxClasses["h3d.scene.Skin"] = h3d_scene_Skin;
h3d_scene_Skin.__name__ = ["h3d","scene","Skin"];
h3d_scene_Skin.__super__ = h3d_scene_MultiMaterial;
h3d_scene_Skin.prototype = $extend(h3d_scene_MultiMaterial.prototype,{
	clone: function(o) {
		var s;
		if(o == null) s = new h3d_scene_Skin(null,this.materials.slice()); else s = o;
		h3d_scene_MultiMaterial.prototype.clone.call(this,s);
		s.setSkinData(this.skinData);
		s.currentRelPose = this.currentRelPose.slice();
		return s;
	}
	,getBounds: function(b,rec) {
		if(rec == null) rec = false;
		b = h3d_scene_MultiMaterial.prototype.getBounds.call(this,b,rec);
		var tmp = this.primitive.getBounds().clone();
		var b0 = this.skinData.allJoints[0];
		if(b0 != null && b0.parent == null) {
			var mtmp = this.absPos.clone();
			var r = this.currentRelPose[b0.index];
			if(r != null) mtmp.multiply3x4(r,mtmp); else mtmp.multiply3x4(b0.defMat,mtmp);
			if(b0.transPos != null) mtmp.multiply3x4(b0.transPos,mtmp);
			tmp.transform3x4(mtmp);
		} else tmp.transform3x4(this.absPos);
		if(tmp.xMin < b.xMin) b.xMin = tmp.xMin;
		if(tmp.xMax > b.xMax) b.xMax = tmp.xMax;
		if(tmp.yMin < b.yMin) b.yMin = tmp.yMin;
		if(tmp.yMax > b.yMax) b.yMax = tmp.yMax;
		if(tmp.zMin < b.zMin) b.zMin = tmp.zMin;
		if(tmp.zMax > b.zMax) b.zMax = tmp.zMax;
		return b;
	}
	,getObjectByName: function(name) {
		if(this.skinData != null && this.skinData.name == name) return this;
		var o = h3d_scene_MultiMaterial.prototype.getObjectByName.call(this,name);
		if(o != null) return o;
		if(this.skinData != null) {
			var j = this.skinData.namedJoints.get(name);
			if(j != null) return new h3d_scene_Joint(this,j);
		}
		return null;
	}
	,calcAbsPos: function() {
		h3d_scene_MultiMaterial.prototype.calcAbsPos.call(this);
		this.jointsUpdated = true;
	}
	,getSkinData: function() {
		return this.skinData;
	}
	,setSkinData: function(s) {
		this.skinData = s;
		this.jointsUpdated = true;
		this.primitive = s.primitive;
		this.skinShader = new h3d_shader_Skin();
		var maxBones = 0;
		if(this.skinData.splitJoints != null) {
			var _g = 0;
			var _g1 = this.skinData.splitJoints;
			while(_g < _g1.length) {
				var s1 = _g1[_g];
				++_g;
				if(s1.joints.length > maxBones) maxBones = s1.joints.length;
			}
		} else maxBones = this.skinData.boundJoints.length;
		if(this.skinShader.MaxBones__ < maxBones) this.skinShader.set_MaxBones(maxBones);
		var _g2 = 0;
		var _g11 = this.materials;
		while(_g2 < _g11.length) {
			var m = _g11[_g2];
			++_g2;
			if(m != null) {
				m.passes.addShader(this.skinShader);
				if(this.skinData.splitJoints != null) m.passes.dynamicParameters = true;
			}
		}
		this.currentRelPose = [];
		this.currentAbsPose = [];
		this.currentPalette = [];
		this.paletteChanged = true;
		var _g3 = 0;
		var _g12 = this.skinData.allJoints;
		while(_g3 < _g12.length) {
			var j = _g12[_g3];
			++_g3;
			this.currentAbsPose.push(h3d_Matrix.I());
		}
		var _g13 = 0;
		var _g4 = this.skinData.boundJoints.length;
		while(_g13 < _g4) {
			var i = _g13++;
			this.currentPalette.push(h3d_Matrix.I());
		}
		if(this.skinData.splitJoints != null) {
			this.splitPalette = [];
			var _g5 = 0;
			var _g14 = this.skinData.splitJoints;
			while(_g5 < _g14.length) {
				var a = _g14[_g5];
				++_g5;
				this.splitPalette.push((function($this) {
					var $r;
					var _g21 = [];
					{
						var _g31 = 0;
						var _g41 = a.joints;
						while(_g31 < _g41.length) {
							var j1 = _g41[_g31];
							++_g31;
							_g21.push($this.currentPalette[j1.bindIndex]);
						}
					}
					$r = _g21;
					return $r;
				}(this)));
			}
		} else this.splitPalette = null;
	}
	,sync: function(ctx) {
		if(!ctx.visibleFlag) return;
		if(this.jointsUpdated || (this.flags & 1) != 0) {
			var _g = 0;
			var _g1 = this.skinData.allJoints;
			while(_g < _g1.length) {
				var j = _g1[_g];
				++_g;
				var id = j.index;
				var m = this.currentAbsPose[id];
				var r = this.currentRelPose[id];
				var bid = j.bindIndex;
				if(r == null) r = j.defMat; else if(j.retargetAnim) {
					r._41 = j.defMat._41;
					r._42 = j.defMat._42;
					r._43 = j.defMat._43;
				}
				if(j.parent == null) m.multiply3x4inline(r,this.absPos); else m.multiply3x4inline(r,this.currentAbsPose[j.parent.index]);
				if(bid >= 0) this.currentPalette[bid].multiply3x4inline(j.transPos,m);
			}
			this.skinShader.bonesMatrixes__ = this.currentPalette;
			if(this.jointsAbsPosInv != null) this.jointsAbsPosInv._44 = 0;
			this.jointsUpdated = false;
		}
	}
	,emit: function(ctx) {
		if(this.splitPalette == null) h3d_scene_MultiMaterial.prototype.emit.call(this,ctx); else {
			var _g1 = 0;
			var _g = this.splitPalette.length;
			while(_g1 < _g) {
				var i = _g1++;
				var m = this.materials[this.skinData.splitJoints[i].material];
				if(m != null) ctx.emit(m,this,i);
			}
		}
		if(this.showJoints) {
			if(this.jointsGraphics == null) {
				this.jointsGraphics = new h3d_scene_Graphics(this);
				this.jointsGraphics.material.passes.depth(false,h3d_mat_Compare.Always);
				this.jointsGraphics.material.passes.setPassName("add");
			}
			var topParent = this;
			while(topParent.parent != null) topParent = topParent.parent;
			this.jointsGraphics.set_follow(topParent);
			var g = this.jointsGraphics;
			g.clear();
			var _g2 = 0;
			var _g11 = this.skinData.allJoints;
			while(_g2 < _g11.length) {
				var j = _g11[_g2];
				++_g2;
				var m1 = this.currentAbsPose[j.index];
				var mp;
				if(j.parent == null) mp = this.absPos; else mp = this.currentAbsPose[j.parent.index];
				g.lineStyle(1,j.parent == null?-16776961:-256);
				g.moveTo(mp._41,mp._42,mp._43);
				g.lineTo(m1._41,m1._42,m1._43);
			}
		} else if(this.jointsGraphics != null) {
			this.jointsGraphics.remove();
			this.jointsGraphics = null;
		}
	}
	,draw: function(ctx) {
		if(this.splitPalette == null) h3d_scene_MultiMaterial.prototype.draw.call(this,ctx); else {
			var i = ctx.drawPass.index;
			this.skinShader.bonesMatrixes__ = this.splitPalette[i];
			this.primitive.selectMaterial(i);
			ctx.uploadParams();
			this.primitive.render(ctx.engine);
		}
	}
	,__class__: h3d_scene_Skin
});
var h3d_shader_AmbientLight = function() {
	hxsl_Shader.call(this);
};
$hxClasses["h3d.shader.AmbientLight"] = h3d_shader_AmbientLight;
h3d_shader_AmbientLight.__name__ = ["h3d","shader","AmbientLight"];
h3d_shader_AmbientLight.__super__ = hxsl_Shader;
h3d_shader_AmbientLight.prototype = $extend(hxsl_Shader.prototype,{
	get_additive: function() {
		return this.additive__;
	}
	,set_additive: function(_v) {
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
	,clone: function() {
		var s = Type.createEmptyInstance(h3d_shader_AmbientLight);
		s.shader = this.shader;
		s.additive__ = this.additive__;
		return s;
	}
	,__class__: h3d_shader_AmbientLight
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
	get_zValue: function() {
		return this.zValue__;
	}
	,set_zValue: function(_v) {
		return this.zValue__ = _v;
	}
	,get_absoluteMatrixA: function() {
		return this.absoluteMatrixA__;
	}
	,set_absoluteMatrixA: function(_v) {
		return this.absoluteMatrixA__ = _v;
	}
	,get_hasUVPos: function() {
		return this.hasUVPos__;
	}
	,set_hasUVPos: function(_v) {
		this.constModified = true;
		return this.hasUVPos__ = _v;
	}
	,get_texture: function() {
		return this.texture__;
	}
	,set_texture: function(_v) {
		return this.texture__ = _v;
	}
	,get_pixelAlign: function() {
		return this.pixelAlign__;
	}
	,set_pixelAlign: function(_v) {
		this.constModified = true;
		return this.pixelAlign__ = _v;
	}
	,get_halfPixelInverse: function() {
		return this.halfPixelInverse__;
	}
	,set_halfPixelInverse: function(_v) {
		return this.halfPixelInverse__ = _v;
	}
	,get_uvPos: function() {
		return this.uvPos__;
	}
	,set_uvPos: function(_v) {
		return this.uvPos__ = _v;
	}
	,get_isRelative: function() {
		return this.isRelative__;
	}
	,set_isRelative: function(_v) {
		this.constModified = true;
		return this.isRelative__ = _v;
	}
	,get_absoluteMatrixB: function() {
		return this.absoluteMatrixB__;
	}
	,set_absoluteMatrixB: function(_v) {
		return this.absoluteMatrixB__ = _v;
	}
	,get_color: function() {
		return this.color__;
	}
	,set_color: function(_v) {
		return this.color__ = _v;
	}
	,get_filterMatrixA: function() {
		return this.filterMatrixA__;
	}
	,set_filterMatrixA: function(_v) {
		return this.filterMatrixA__ = _v;
	}
	,get_filterMatrixB: function() {
		return this.filterMatrixB__;
	}
	,set_filterMatrixB: function(_v) {
		return this.filterMatrixB__ = _v;
	}
	,get_viewport: function() {
		return this.viewport__;
	}
	,set_viewport: function(_v) {
		return this.viewport__ = _v;
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
	,clone: function() {
		var s = Type.createEmptyInstance(h3d_shader_Base2d);
		s.shader = this.shader;
		s.zValue__ = this.zValue__;
		s.absoluteMatrixA__ = this.absoluteMatrixA__;
		s.hasUVPos__ = this.hasUVPos__;
		s.texture__ = this.texture__;
		s.pixelAlign__ = this.pixelAlign__;
		s.halfPixelInverse__ = this.halfPixelInverse__;
		s.uvPos__ = this.uvPos__;
		s.isRelative__ = this.isRelative__;
		s.absoluteMatrixB__ = this.absoluteMatrixB__;
		s.color__ = this.color__;
		s.filterMatrixA__ = this.filterMatrixA__;
		s.filterMatrixB__ = this.filterMatrixB__;
		s.viewport__ = this.viewport__;
		return s;
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
	get_specularAmount: function() {
		return this.specularAmount__;
	}
	,set_specularAmount: function(_v) {
		return this.specularAmount__ = _v;
	}
	,get_specularColor: function() {
		return this.specularColor__;
	}
	,set_specularColor: function(_v) {
		return this.specularColor__ = _v;
	}
	,get_specularPower: function() {
		return this.specularPower__;
	}
	,set_specularPower: function(_v) {
		return this.specularPower__ = _v;
	}
	,get_color: function() {
		return this.color__;
	}
	,set_color: function(_v) {
		return this.color__ = _v;
	}
	,updateConstants: function(globals) {
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
	,clone: function() {
		var s = Type.createEmptyInstance(h3d_shader_BaseMesh);
		s.shader = this.shader;
		s.specularAmount__ = this.specularAmount__;
		s.specularColor__ = this.specularColor__;
		s.specularPower__ = this.specularPower__;
		s.color__ = this.color__;
		return s;
	}
	,__class__: h3d_shader_BaseMesh
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
	get_Quality: function() {
		return this.Quality__;
	}
	,set_Quality: function(_v) {
		this.constModified = true;
		return this.Quality__ = _v;
	}
	,get_pixel: function() {
		return this.pixel__;
	}
	,set_pixel: function(_v) {
		return this.pixel__ = _v;
	}
	,get_hasFixedColor: function() {
		return this.hasFixedColor__;
	}
	,set_hasFixedColor: function(_v) {
		this.constModified = true;
		return this.hasFixedColor__ = _v;
	}
	,get_fixedColor: function() {
		return this.fixedColor__;
	}
	,set_fixedColor: function(_v) {
		return this.fixedColor__ = _v;
	}
	,get_values: function() {
		return this.values__;
	}
	,set_values: function(_v) {
		return this.values__ = _v;
	}
	,get_texture: function() {
		return this.texture__;
	}
	,set_texture: function(_v) {
		return this.texture__ = _v;
	}
	,get_isDepth: function() {
		return this.isDepth__;
	}
	,set_isDepth: function(_v) {
		this.constModified = true;
		return this.isDepth__ = _v;
	}
	,get_normalTexture: function() {
		return this.normalTexture__;
	}
	,set_normalTexture: function(_v) {
		return this.normalTexture__ = _v;
	}
	,get_isDepthDependant: function() {
		return this.isDepthDependant__;
	}
	,set_isDepthDependant: function(_v) {
		this.constModified = true;
		return this.isDepthDependant__ = _v;
	}
	,get_hasNormal: function() {
		return this.hasNormal__;
	}
	,set_hasNormal: function(_v) {
		this.constModified = true;
		return this.hasNormal__ = _v;
	}
	,get_cameraInverseViewProj: function() {
		return this.cameraInverseViewProj__;
	}
	,set_cameraInverseViewProj: function(_v) {
		return this.cameraInverseViewProj__ = _v;
	}
	,get_depthTexture: function() {
		return this.depthTexture__;
	}
	,set_depthTexture: function(_v) {
		return this.depthTexture__ = _v;
	}
	,get_smoothFixedColor: function() {
		return this.smoothFixedColor__;
	}
	,set_smoothFixedColor: function(_v) {
		this.constModified = true;
		return this.smoothFixedColor__ = _v;
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
	,clone: function() {
		var s = Type.createEmptyInstance(h3d_shader_Blur);
		s.shader = this.shader;
		s.Quality__ = this.Quality__;
		s.pixel__ = this.pixel__;
		s.hasFixedColor__ = this.hasFixedColor__;
		s.fixedColor__ = this.fixedColor__;
		s.values__ = this.values__;
		s.texture__ = this.texture__;
		s.isDepth__ = this.isDepth__;
		s.normalTexture__ = this.normalTexture__;
		s.isDepthDependant__ = this.isDepthDependant__;
		s.hasNormal__ = this.hasNormal__;
		s.cameraInverseViewProj__ = this.cameraInverseViewProj__;
		s.depthTexture__ = this.depthTexture__;
		s.smoothFixedColor__ = this.smoothFixedColor__;
		return s;
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
var h3d_shader_ColorAdd = function(color) {
	if(color == null) color = 0;
	this.color__ = new h3d_Vector();
	hxsl_Shader.call(this);
	this.color__.setColor(color,null);
};
$hxClasses["h3d.shader.ColorAdd"] = h3d_shader_ColorAdd;
h3d_shader_ColorAdd.__name__ = ["h3d","shader","ColorAdd"];
h3d_shader_ColorAdd.__super__ = hxsl_Shader;
h3d_shader_ColorAdd.prototype = $extend(hxsl_Shader.prototype,{
	get_color: function() {
		return this.color__;
	}
	,set_color: function(_v) {
		return this.color__ = _v;
	}
	,updateConstants: function(globals) {
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
	,clone: function() {
		var s = Type.createEmptyInstance(h3d_shader_ColorAdd);
		s.shader = this.shader;
		s.color__ = this.color__;
		return s;
	}
	,__class__: h3d_shader_ColorAdd
});
var h3d_shader_ColorKey = function(v) {
	if(v == null) v = 0;
	this.colorKey__ = new h3d_Vector();
	hxsl_Shader.call(this);
	this.colorKey__.setColor(v,null);
};
$hxClasses["h3d.shader.ColorKey"] = h3d_shader_ColorKey;
h3d_shader_ColorKey.__name__ = ["h3d","shader","ColorKey"];
h3d_shader_ColorKey.__super__ = hxsl_Shader;
h3d_shader_ColorKey.prototype = $extend(hxsl_Shader.prototype,{
	get_colorKey: function() {
		return this.colorKey__;
	}
	,set_colorKey: function(_v) {
		return this.colorKey__ = _v;
	}
	,updateConstants: function(globals) {
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
	,clone: function() {
		var s = Type.createEmptyInstance(h3d_shader_ColorKey);
		s.shader = this.shader;
		s.colorKey__ = this.colorKey__;
		return s;
	}
	,__class__: h3d_shader_ColorKey
});
var h3d_shader_ColorMatrix = function(m) {
	this.matrix__ = new h3d_Matrix();
	hxsl_Shader.call(this);
	if(m != null) this.matrix__.load(m); else this.matrix__.identity();
};
$hxClasses["h3d.shader.ColorMatrix"] = h3d_shader_ColorMatrix;
h3d_shader_ColorMatrix.__name__ = ["h3d","shader","ColorMatrix"];
h3d_shader_ColorMatrix.__super__ = hxsl_Shader;
h3d_shader_ColorMatrix.prototype = $extend(hxsl_Shader.prototype,{
	get_matrix: function() {
		return this.matrix__;
	}
	,set_matrix: function(_v) {
		return this.matrix__ = _v;
	}
	,updateConstants: function(globals) {
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
	,clone: function() {
		var s = Type.createEmptyInstance(h3d_shader_ColorMatrix);
		s.shader = this.shader;
		s.matrix__ = this.matrix__;
		return s;
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
	get_enableSpecular: function() {
		return this.enableSpecular__;
	}
	,set_enableSpecular: function(_v) {
		this.constModified = true;
		return this.enableSpecular__ = _v;
	}
	,get_color: function() {
		return this.color__;
	}
	,set_color: function(_v) {
		return this.color__ = _v;
	}
	,get_direction: function() {
		return this.direction__;
	}
	,set_direction: function(_v) {
		return this.direction__ = _v;
	}
	,updateConstants: function(globals) {
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
	,clone: function() {
		var s = Type.createEmptyInstance(h3d_shader_DirLight);
		s.shader = this.shader;
		s.enableSpecular__ = this.enableSpecular__;
		s.color__ = this.color__;
		s.direction__ = this.direction__;
		return s;
	}
	,__class__: h3d_shader_DirLight
});
var h3d_shader_LineShader = function(width,lengthScale) {
	if(lengthScale == null) lengthScale = 1.;
	if(width == null) width = 1.5;
	this.width__ = 0;
	this.lengthScale__ = 0;
	hxsl_Shader.call(this);
	this.width__ = width;
	this.lengthScale__ = lengthScale;
};
$hxClasses["h3d.shader.LineShader"] = h3d_shader_LineShader;
h3d_shader_LineShader.__name__ = ["h3d","shader","LineShader"];
h3d_shader_LineShader.__super__ = hxsl_Shader;
h3d_shader_LineShader.prototype = $extend(hxsl_Shader.prototype,{
	get_lengthScale: function() {
		return this.lengthScale__;
	}
	,set_lengthScale: function(_v) {
		return this.lengthScale__ = _v;
	}
	,get_width: function() {
		return this.width__;
	}
	,set_width: function(_v) {
		return this.width__ = _v;
	}
	,updateConstants: function(globals) {
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
	,clone: function() {
		var s = Type.createEmptyInstance(h3d_shader_LineShader);
		s.shader = this.shader;
		s.lengthScale__ = this.lengthScale__;
		s.width__ = this.width__;
		return s;
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
var h3d_shader_Shadow = function() {
	hxsl_Shader.call(this);
};
$hxClasses["h3d.shader.Shadow"] = h3d_shader_Shadow;
h3d_shader_Shadow.__name__ = ["h3d","shader","Shadow"];
h3d_shader_Shadow.__super__ = hxsl_Shader;
h3d_shader_Shadow.prototype = $extend(hxsl_Shader.prototype,{
	get_perPixel: function() {
		return this.perPixel__;
	}
	,set_perPixel: function(_v) {
		this.constModified = true;
		return this.perPixel__ = _v;
	}
	,updateConstants: function(globals) {
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
	,clone: function() {
		var s = Type.createEmptyInstance(h3d_shader_Shadow);
		s.shader = this.shader;
		s.perPixel__ = this.perPixel__;
		return s;
	}
	,__class__: h3d_shader_Shadow
});
var h3d_shader_Skin = function() {
	this.MaxBones__ = 0;
	this.bonesMatrixes__ = [];
	hxsl_Shader.call(this);
	this.constModified = true;
	this.MaxBones__ = 34;
};
$hxClasses["h3d.shader.Skin"] = h3d_shader_Skin;
h3d_shader_Skin.__name__ = ["h3d","shader","Skin"];
h3d_shader_Skin.__super__ = hxsl_Shader;
h3d_shader_Skin.prototype = $extend(hxsl_Shader.prototype,{
	get_bonesMatrixes: function() {
		return this.bonesMatrixes__;
	}
	,set_bonesMatrixes: function(_v) {
		return this.bonesMatrixes__ = _v;
	}
	,get_MaxBones: function() {
		return this.MaxBones__;
	}
	,set_MaxBones: function(_v) {
		this.constModified = true;
		return this.MaxBones__ = _v;
	}
	,updateConstants: function(globals) {
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
	,clone: function() {
		var s = Type.createEmptyInstance(h3d_shader_Skin);
		s.shader = this.shader;
		s.bonesMatrixes__ = this.bonesMatrixes__;
		s.MaxBones__ = this.MaxBones__;
		return s;
	}
	,__class__: h3d_shader_Skin
});
var h3d_shader_SpecularTexture = function(tex) {
	hxsl_Shader.call(this);
	this.texture__ = tex;
};
$hxClasses["h3d.shader.SpecularTexture"] = h3d_shader_SpecularTexture;
h3d_shader_SpecularTexture.__name__ = ["h3d","shader","SpecularTexture"];
h3d_shader_SpecularTexture.__super__ = hxsl_Shader;
h3d_shader_SpecularTexture.prototype = $extend(hxsl_Shader.prototype,{
	get_texture: function() {
		return this.texture__;
	}
	,set_texture: function(_v) {
		return this.texture__ = _v;
	}
	,updateConstants: function(globals) {
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
	,clone: function() {
		var s = Type.createEmptyInstance(h3d_shader_SpecularTexture);
		s.shader = this.shader;
		s.texture__ = this.texture__;
		return s;
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
	get_additive: function() {
		return this.additive__;
	}
	,set_additive: function(_v) {
		this.constModified = true;
		return this.additive__ = _v;
	}
	,get_texture: function() {
		return this.texture__;
	}
	,set_texture: function(_v) {
		return this.texture__ = _v;
	}
	,get_killAlphaThreshold: function() {
		return this.killAlphaThreshold__;
	}
	,set_killAlphaThreshold: function(_v) {
		return this.killAlphaThreshold__ = _v;
	}
	,get_killAlpha: function() {
		return this.killAlpha__;
	}
	,set_killAlpha: function(_v) {
		this.constModified = true;
		return this.killAlpha__ = _v;
	}
	,updateConstants: function(globals) {
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
	,clone: function() {
		var s = Type.createEmptyInstance(h3d_shader_Texture);
		s.shader = this.shader;
		s.additive__ = this.additive__;
		s.texture__ = this.texture__;
		s.killAlphaThreshold__ = this.killAlphaThreshold__;
		s.killAlpha__ = this.killAlpha__;
		return s;
	}
	,__class__: h3d_shader_Texture
});
var h3d_shader_VertexColorAlpha = function() {
	hxsl_Shader.call(this);
};
$hxClasses["h3d.shader.VertexColorAlpha"] = h3d_shader_VertexColorAlpha;
h3d_shader_VertexColorAlpha.__name__ = ["h3d","shader","VertexColorAlpha"];
h3d_shader_VertexColorAlpha.__super__ = hxsl_Shader;
h3d_shader_VertexColorAlpha.prototype = $extend(hxsl_Shader.prototype,{
	get_additive: function() {
		return this.additive__;
	}
	,set_additive: function(_v) {
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
	,clone: function() {
		var s = Type.createEmptyInstance(h3d_shader_VertexColorAlpha);
		s.shader = this.shader;
		s.additive__ = this.additive__;
		return s;
	}
	,__class__: h3d_shader_VertexColorAlpha
});
var h3d_shader_VolumeDecal = function(objectWidth,objectHeight) {
	this.normal__ = new h3d_Vector();
	this.scale__ = new h3d_Vector();
	hxsl_Shader.call(this);
	this.normal__.set(0,0,1,null);
	this.scale__.set(1 / objectWidth,1 / objectHeight,null,null);
};
$hxClasses["h3d.shader.VolumeDecal"] = h3d_shader_VolumeDecal;
h3d_shader_VolumeDecal.__name__ = ["h3d","shader","VolumeDecal"];
h3d_shader_VolumeDecal.__super__ = hxsl_Shader;
h3d_shader_VolumeDecal.prototype = $extend(hxsl_Shader.prototype,{
	get_scale: function() {
		return this.scale__;
	}
	,set_scale: function(_v) {
		return this.scale__ = _v;
	}
	,get_normal: function() {
		return this.normal__;
	}
	,set_normal: function(_v) {
		return this.normal__ = _v;
	}
	,updateConstants: function(globals) {
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
	,clone: function() {
		var s = Type.createEmptyInstance(h3d_shader_VolumeDecal);
		s.shader = this.shader;
		s.scale__ = this.scale__;
		s.normal__ = this.normal__;
		return s;
	}
	,__class__: h3d_shader_VolumeDecal
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
var haxe_crypto_Crc32 = function() {
	this.crc = -1;
};
$hxClasses["haxe.crypto.Crc32"] = haxe_crypto_Crc32;
haxe_crypto_Crc32.__name__ = ["haxe","crypto","Crc32"];
haxe_crypto_Crc32.prototype = {
	'byte': function(b) {
		var tmp = (this.crc ^ b) & 255;
		var _g = 0;
		while(_g < 8) {
			var j = _g++;
			if((tmp & 1) == 1) tmp = tmp >>> 1 ^ -306674912; else tmp >>>= 1;
		}
		this.crc = this.crc >>> 8 ^ tmp;
	}
	,update: function(b,pos,len) {
		var b1 = b.b.bufferValue;
		var _g1 = pos;
		var _g = pos + len;
		while(_g1 < _g) {
			var i = _g1++;
			var tmp = (this.crc ^ b1.bytes[i]) & 255;
			var _g2 = 0;
			while(_g2 < 8) {
				var j = _g2++;
				if((tmp & 1) == 1) tmp = tmp >>> 1 ^ -306674912; else tmp >>>= 1;
			}
			this.crc = this.crc >>> 8 ^ tmp;
		}
	}
	,get: function() {
		return this.crc ^ -1;
	}
	,__class__: haxe_crypto_Crc32
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
	,__class__: haxe_ds_StringMap
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
haxe_io_Bytes.ofString = function(s) {
	var a = [];
	var i = 0;
	while(i < s.length) {
		var c = StringTools.fastCodeAt(s,i++);
		if(55296 <= c && c <= 56319) c = c - 55232 << 10 | StringTools.fastCodeAt(s,i++) & 1023;
		if(c <= 127) a.push(c); else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe_io_Bytes(new Uint8Array(a).buffer);
};
haxe_io_Bytes.ofData = function(b) {
	var hb = b.hxBytes;
	if(hb != null) return hb;
	return new haxe_io_Bytes(b);
};
haxe_io_Bytes.prototype = {
	get: function(pos) {
		return this.b[pos];
	}
	,set: function(pos,v) {
		this.b[pos] = v & 255;
	}
	,blit: function(pos,src,srcpos,len) {
		if(pos < 0 || srcpos < 0 || len < 0 || pos + len > this.length || srcpos + len > src.length) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
		if(srcpos == 0 && len == src.length) this.b.set(src.b,pos); else this.b.set(src.b.subarray(srcpos,srcpos + len),pos);
	}
	,fill: function(pos,len,value) {
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			this.set(pos++,value);
		}
	}
	,getInt32: function(pos) {
		if(this.data == null) this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		return this.data.getInt32(pos,true);
	}
	,setInt32: function(pos,v) {
		if(this.data == null) this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		this.data.setInt32(pos,v,true);
	}
	,__class__: haxe_io_Bytes
};
var haxe_io_BytesBuffer = function() {
	this.b = [];
};
$hxClasses["haxe.io.BytesBuffer"] = haxe_io_BytesBuffer;
haxe_io_BytesBuffer.__name__ = ["haxe","io","BytesBuffer"];
haxe_io_BytesBuffer.prototype = {
	add: function(src) {
		var b1 = this.b;
		var b2 = src.b;
		var _g1 = 0;
		var _g = src.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.b.push(b2[i]);
		}
	}
	,addBytes: function(src,pos,len) {
		if(pos < 0 || len < 0 || pos + len > src.length) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
		var b1 = this.b;
		var b2 = src.b;
		var _g1 = pos;
		var _g = pos + len;
		while(_g1 < _g) {
			var i = _g1++;
			this.b.push(b2[i]);
		}
	}
	,getBytes: function() {
		var bytes = new haxe_io_Bytes(new Uint8Array(this.b).buffer);
		this.b = null;
		return bytes;
	}
	,__class__: haxe_io_BytesBuffer
};
var haxe_io_Input = function() { };
$hxClasses["haxe.io.Input"] = haxe_io_Input;
haxe_io_Input.__name__ = ["haxe","io","Input"];
haxe_io_Input.prototype = {
	readByte: function() {
		throw new js__$Boot_HaxeError("Not implemented");
	}
	,readBytes: function(s,pos,len) {
		var k = len;
		var b = s.b;
		if(pos < 0 || len < 0 || pos + len > s.length) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
		while(k > 0) {
			b[pos] = this.readByte();
			pos++;
			k--;
		}
		return len;
	}
	,read: function(nbytes) {
		var s = haxe_io_Bytes.alloc(nbytes);
		var p = 0;
		while(nbytes > 0) {
			var k = this.readBytes(s,p,nbytes);
			if(k == 0) throw new js__$Boot_HaxeError(haxe_io_Error.Blocked);
			p += k;
			nbytes -= k;
		}
		return s;
	}
	,readUInt16: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		if(this.bigEndian) return ch2 | ch1 << 8; else return ch1 | ch2 << 8;
	}
	,__class__: haxe_io_Input
};
var haxe_io_BytesInput = function(b,pos,len) {
	if(pos == null) pos = 0;
	if(len == null) len = b.length - pos;
	if(pos < 0 || len < 0 || pos + len > b.length) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
	this.b = b.b;
	this.pos = pos;
	this.len = len;
	this.totlen = len;
};
$hxClasses["haxe.io.BytesInput"] = haxe_io_BytesInput;
haxe_io_BytesInput.__name__ = ["haxe","io","BytesInput"];
haxe_io_BytesInput.__super__ = haxe_io_Input;
haxe_io_BytesInput.prototype = $extend(haxe_io_Input.prototype,{
	readByte: function() {
		if(this.len == 0) throw new js__$Boot_HaxeError(new haxe_io_Eof());
		this.len--;
		return this.b[this.pos++];
	}
	,readBytes: function(buf,pos,len) {
		if(pos < 0 || len < 0 || pos + len > buf.length) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
		if(this.len == 0 && len > 0) throw new js__$Boot_HaxeError(new haxe_io_Eof());
		if(this.len < len) len = this.len;
		var b1 = this.b;
		var b2 = buf.b;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			b2[pos + i] = b1[this.pos + i];
		}
		this.pos += len;
		this.len -= len;
		return len;
	}
	,__class__: haxe_io_BytesInput
});
var haxe_io_Output = function() { };
$hxClasses["haxe.io.Output"] = haxe_io_Output;
haxe_io_Output.__name__ = ["haxe","io","Output"];
haxe_io_Output.prototype = {
	writeByte: function(c) {
		throw new js__$Boot_HaxeError("Not implemented");
	}
	,writeBytes: function(s,pos,len) {
		var k = len;
		var b = s.b.bufferValue;
		if(pos < 0 || len < 0 || pos + len > s.length) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
		while(k > 0) {
			this.writeByte(b[pos]);
			pos++;
			k--;
		}
		return len;
	}
	,set_bigEndian: function(b) {
		this.bigEndian = b;
		return b;
	}
	,write: function(s) {
		var l = s.length;
		var p = 0;
		while(l > 0) {
			var k = this.writeBytes(s,p,l);
			if(k == 0) throw new js__$Boot_HaxeError(haxe_io_Error.Blocked);
			p += k;
			l -= k;
		}
	}
	,writeFullBytes: function(s,pos,len) {
		while(len > 0) {
			var k = this.writeBytes(s,pos,len);
			pos += k;
			len -= k;
		}
	}
	,writeInt32: function(x) {
		if(this.bigEndian) {
			this.writeByte(x >>> 24);
			this.writeByte(x >> 16 & 255);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x & 255);
		} else {
			this.writeByte(x & 255);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x >> 16 & 255);
			this.writeByte(x >>> 24);
		}
	}
	,writeString: function(s) {
		var b = haxe_io_Bytes.ofString(s);
		this.writeFullBytes(b,0,b.length);
	}
	,__class__: haxe_io_Output
};
var haxe_io_BytesOutput = function() {
	this.b = new haxe_io_BytesBuffer();
};
$hxClasses["haxe.io.BytesOutput"] = haxe_io_BytesOutput;
haxe_io_BytesOutput.__name__ = ["haxe","io","BytesOutput"];
haxe_io_BytesOutput.__super__ = haxe_io_Output;
haxe_io_BytesOutput.prototype = $extend(haxe_io_Output.prototype,{
	writeByte: function(c) {
		this.b.b.push(c);
	}
	,writeBytes: function(buf,pos,len) {
		this.b.addBytes(buf,pos,len);
		return len;
	}
	,getBytes: function() {
		return this.b.getBytes();
	}
	,__class__: haxe_io_BytesOutput
});
var haxe_io_Eof = function() {
};
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
var hxd_BitmapData = function(width,height) {
	if(width == -101 && height == -102) {
	} else {
		var canvas;
		var _this = window.document;
		canvas = _this.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		this.ctx = canvas.getContext("2d",null);
	}
};
$hxClasses["hxd.BitmapData"] = hxd_BitmapData;
hxd_BitmapData.__name__ = ["hxd","BitmapData"];
hxd_BitmapData.notImplemented = function() {
	throw new js__$Boot_HaxeError("Not implemented");
};
hxd_BitmapData.fromNative = function(data) {
	var b = new hxd_BitmapData(-101,-102);
	b.ctx = data;
	return b;
};
hxd_BitmapData.prototype = {
	clear: function(color) {
		this.fill(0,0,this.ctx.canvas.width,this.ctx.canvas.height,color);
	}
	,fill: function(x,y,width,height,color) {
		this.ctx.fillStyle = "rgba(" + (color >> 16 & 255) + ", " + (color >> 8 & 255) + ", " + (color & 255) + ", " + (color >>> 24) / 255 + ")";
		this.ctx.fillRect(x,y,width,height);
	}
	,draw: function(x,y,src,srcX,srcY,width,height,blendMode) {
		throw new js__$Boot_HaxeError("Not implemented");
	}
	,drawScaled: function(x,y,width,height,src,srcX,srcY,srcWidth,srcHeight,blendMode,smooth) {
		if(smooth == null) smooth = true;
		if(blendMode == null) blendMode = h2d_BlendMode.Alpha;
		throw new js__$Boot_HaxeError("Not implemented");
	}
	,line: function(x0,y0,x1,y1,color) {
		var dx = x1 - x0;
		var dy = y1 - y0;
		if(dx == 0) {
			if(y1 < y0) {
				var tmp = y0;
				y0 = y1;
				y1 = tmp;
			}
			var _g1 = y0;
			var _g = y1 + 1;
			while(_g1 < _g) {
				var y = _g1++;
				this.setPixel(x0,y,color);
			}
		} else if(dy == 0) {
			if(x1 < x0) {
				var tmp1 = x0;
				x0 = x1;
				x1 = tmp1;
			}
			var _g11 = x0;
			var _g2 = x1 + 1;
			while(_g11 < _g2) {
				var x = _g11++;
				this.setPixel(x,y0,color);
			}
		} else throw new js__$Boot_HaxeError("TODO : brensenham line");
	}
	,dispose: function() {
		this.ctx = null;
		this.pixel = null;
	}
	,clone: function() {
		return this.sub(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
	}
	,sub: function(x,y,w,h) {
		throw new js__$Boot_HaxeError("Not implemented");
		return null;
	}
	,lock: function() {
		if(this.lockImage == null) this.lockImage = this.ctx.getImageData(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
	}
	,unlock: function() {
		if(this.lockImage != null) {
			this.ctx.putImageData(this.lockImage,0,0);
			this.lockImage = null;
		}
	}
	,getPixel: function(x,y) {
		var i = this.lockImage;
		var a;
		if(i != null) a = x + y * i.width << 2; else {
			a = 0;
			i = this.ctx.getImageData(x,y,1,1);
		}
		return i.data[a] << 16 | i.data[a | 1] << 8 | i.data[a | 2] | i.data[a | 3] << 24;
	}
	,setPixel: function(x,y,c) {
		var i = this.lockImage;
		if(i != null) {
			var a = x + y * i.width << 2;
			i.data[a] = c >> 16 & 255;
			i.data[a | 1] = c >> 8 & 255;
			i.data[a | 2] = c & 255;
			i.data[a | 3] = c >>> 24 & 255;
			return;
		}
		var i1 = this.pixel;
		if(i1 == null) {
			i1 = this.ctx.createImageData(1,1);
			this.pixel = i1;
		}
		i1.data[0] = c >> 16 & 255;
		i1.data[1] = c >> 8 & 255;
		i1.data[2] = c & 255;
		i1.data[3] = c >>> 24 & 255;
		this.ctx.putImageData(i1,x,y);
	}
	,get_width: function() {
		return this.ctx.canvas.width;
	}
	,get_height: function() {
		return this.ctx.canvas.height;
	}
	,getPixels: function() {
		var w = this.ctx.canvas.width;
		var h = this.ctx.canvas.height;
		var data = this.ctx.getImageData(0,0,w,h).data;
		var pixels = data.buffer;
		return new hxd_Pixels(w,h,haxe_io_Bytes.ofData(pixels),hxd_PixelFormat.RGBA);
	}
	,setPixels: function(pixels) {
		if(pixels.width != this.ctx.canvas.width || pixels.height != this.ctx.canvas.height) throw new js__$Boot_HaxeError("Invalid pixels size");
		pixels.setFlip(false);
		var img = this.ctx.createImageData(pixels.width,pixels.height);
		pixels.convert(hxd_PixelFormat.RGBA);
		var _g1 = 0;
		var _g = pixels.width * pixels.height * 4;
		while(_g1 < _g) {
			var i = _g1++;
			img.data[i] = pixels.bytes.b[i];
		}
		this.ctx.putImageData(img,0,0);
	}
	,toNative: function() {
		return this.ctx;
	}
	,toPNG: function() {
		var pixels = this.getPixels();
		var png = pixels.toPNG();
		pixels.dispose();
		return png;
	}
	,__class__: hxd_BitmapData
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
	toString: function() {
		return Std.string(this.kind) + "[" + (this.relX | 0) + "," + (this.relY | 0) + "]";
	}
	,__class__: hxd_Event
};
var hxd__$FloatBuffer_InnerIterator = function(b) {
	this.b = b;
	this.len = this.b.length;
	this.pos = 0;
};
$hxClasses["hxd._FloatBuffer.InnerIterator"] = hxd__$FloatBuffer_InnerIterator;
hxd__$FloatBuffer_InnerIterator.__name__ = ["hxd","_FloatBuffer","InnerIterator"];
hxd__$FloatBuffer_InnerIterator.prototype = {
	hasNext: function() {
		return this.pos < this.len;
	}
	,next: function() {
		return this.b[this.pos++];
	}
	,__class__: hxd__$FloatBuffer_InnerIterator
};
var hxd__$FloatBuffer_FloatBuffer_$Impl_$ = {};
$hxClasses["hxd._FloatBuffer.FloatBuffer_Impl_"] = hxd__$FloatBuffer_FloatBuffer_$Impl_$;
hxd__$FloatBuffer_FloatBuffer_$Impl_$.__name__ = ["hxd","_FloatBuffer","FloatBuffer_Impl_"];
hxd__$FloatBuffer_FloatBuffer_$Impl_$._new = function(length) {
	if(length == null) length = 0;
	var this1;
	this1 = new Array(length);
	return this1;
};
hxd__$FloatBuffer_FloatBuffer_$Impl_$.push = function(this1,v) {
	this1.push(v);
};
hxd__$FloatBuffer_FloatBuffer_$Impl_$.grow = function(this1,v) {
	while(this1.length < v) this1.push(0.);
};
hxd__$FloatBuffer_FloatBuffer_$Impl_$.resize = function(this1,v) {
	while(this1.length < v) this1.push(0.);
	if(this1.length > v) this1.splice(v,this1.length - v);
};
hxd__$FloatBuffer_FloatBuffer_$Impl_$.arrayRead = function(this1,key) {
	return this1[key];
};
hxd__$FloatBuffer_FloatBuffer_$Impl_$.arrayWrite = function(this1,key,value) {
	return this1[key] = value;
};
hxd__$FloatBuffer_FloatBuffer_$Impl_$.getNative = function(this1) {
	return this1;
};
hxd__$FloatBuffer_FloatBuffer_$Impl_$.iterator = function(this1) {
	return new hxd__$FloatBuffer_InnerIterator(this1);
};
hxd__$FloatBuffer_FloatBuffer_$Impl_$.get_length = function(this1) {
	return this1.length;
};
var hxd__$IndexBuffer_InnerIterator = function(b) {
	this.b = b;
	this.len = this.b.length;
	this.pos = 0;
};
$hxClasses["hxd._IndexBuffer.InnerIterator"] = hxd__$IndexBuffer_InnerIterator;
hxd__$IndexBuffer_InnerIterator.__name__ = ["hxd","_IndexBuffer","InnerIterator"];
hxd__$IndexBuffer_InnerIterator.prototype = {
	hasNext: function() {
		return this.pos < this.len;
	}
	,next: function() {
		return this.b[this.pos++];
	}
	,__class__: hxd__$IndexBuffer_InnerIterator
};
var hxd__$IndexBuffer_IndexBuffer_$Impl_$ = {};
$hxClasses["hxd._IndexBuffer.IndexBuffer_Impl_"] = hxd__$IndexBuffer_IndexBuffer_$Impl_$;
hxd__$IndexBuffer_IndexBuffer_$Impl_$.__name__ = ["hxd","_IndexBuffer","IndexBuffer_Impl_"];
hxd__$IndexBuffer_IndexBuffer_$Impl_$._new = function(length) {
	if(length == null) length = 0;
	var this1;
	this1 = new Array(length);
	return this1;
};
hxd__$IndexBuffer_IndexBuffer_$Impl_$.push = function(this1,v) {
	this1.push(v);
};
hxd__$IndexBuffer_IndexBuffer_$Impl_$.grow = function(this1,v) {
	while(this1.length < v) this1.push(0);
};
hxd__$IndexBuffer_IndexBuffer_$Impl_$.arrayRead = function(this1,key) {
	return this1[key];
};
hxd__$IndexBuffer_IndexBuffer_$Impl_$.arrayWrite = function(this1,key,value) {
	return this1[key] = value;
};
hxd__$IndexBuffer_IndexBuffer_$Impl_$.getNative = function(this1) {
	return this1;
};
hxd__$IndexBuffer_IndexBuffer_$Impl_$.iterator = function(this1) {
	return new hxd__$IndexBuffer_InnerIterator(this1);
};
hxd__$IndexBuffer_IndexBuffer_$Impl_$.get_length = function(this1) {
	return this1.length;
};
var hxd_Key = function() { };
$hxClasses["hxd.Key"] = hxd_Key;
hxd_Key.__name__ = ["hxd","Key"];
hxd_Key.isDown = function(code) {
	return hxd_Key.keyPressed[code] > 0;
};
hxd_Key.getFrame = function() {
	return h3d_Engine.CURRENT.frameCount + 1;
};
hxd_Key.isPressed = function(code) {
	return hxd_Key.keyPressed[code] == h3d_Engine.CURRENT.frameCount + 1;
};
hxd_Key.isReleased = function(code) {
	return hxd_Key.keyPressed[code] == -(h3d_Engine.CURRENT.frameCount + 1);
};
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
hxd_Math.get_POSITIVE_INFINITY = function() {
	return Infinity;
};
hxd_Math.get_NEGATIVE_INFINITY = function() {
	return -Infinity;
};
hxd_Math.get_NaN = function() {
	return NaN;
};
hxd_Math.isNaN = function(v) {
	return isNaN(v);
};
hxd_Math.fmt = function(v) {
	var neg;
	if(v < 0) {
		neg = -1.0;
		v = -v;
	} else neg = 1.0;
	if(isNaN(v) || !isFinite(v)) return v;
	var digits = Std["int"](4 - Math.log(v) / Math.log(10));
	if(digits < 1) digits = 1; else if(digits >= 10) return 0.;
	var exp = Math.pow(10,digits);
	return Math.floor(v * exp + .49999) * neg / exp;
};
hxd_Math.floor = function(f) {
	return Math.floor(f);
};
hxd_Math.ceil = function(f) {
	return Math.ceil(f);
};
hxd_Math.round = function(f) {
	return Math.round(f);
};
hxd_Math.clamp = function(f,min,max) {
	if(max == null) max = 1.;
	if(min == null) min = 0.;
	if(f < min) return min; else if(f > max) return max; else return f;
};
hxd_Math.pow = function(v,p) {
	return Math.pow(v,p);
};
hxd_Math.cos = function(f) {
	return Math.cos(f);
};
hxd_Math.sin = function(f) {
	return Math.sin(f);
};
hxd_Math.tan = function(f) {
	return Math.tan(f);
};
hxd_Math.acos = function(f) {
	return Math.acos(f);
};
hxd_Math.asin = function(f) {
	return Math.asin(f);
};
hxd_Math.atan = function(f) {
	return Math.atan(f);
};
hxd_Math.sqrt = function(f) {
	return Math.sqrt(f);
};
hxd_Math.invSqrt = function(f) {
	return 1. / Math.sqrt(f);
};
hxd_Math.atan2 = function(dy,dx) {
	return Math.atan2(dy,dx);
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
hxd_Math.iabs = function(i) {
	if(i < 0) return -i; else return i;
};
hxd_Math.imax = function(a,b) {
	if(a < b) return b; else return a;
};
hxd_Math.imin = function(a,b) {
	if(a > b) return b; else return a;
};
hxd_Math.iclamp = function(v,min,max) {
	if(v < min) return min; else if(v > max) return max; else return v;
};
hxd_Math.lerp = function(a,b,k) {
	return a + k * (b - a);
};
hxd_Math.bitCount = function(v) {
	v = v - (v >> 1 & 1431655765);
	v = (v & 858993459) + (v >> 2 & 858993459);
	return (v + (v >> 4) & 252645135) * 16843009 >> 24;
};
hxd_Math.distanceSq = function(dx,dy,dz) {
	if(dz == null) dz = 0.;
	return dx * dx + dy * dy + dz * dz;
};
hxd_Math.distance = function(dx,dy,dz) {
	if(dz == null) dz = 0.;
	return Math.sqrt(dx * dx + dy * dy + dz * dz);
};
hxd_Math.colorLerp = function(c1,c2,k) {
	var a1 = c1 >>> 24;
	var r1 = c1 >> 16 & 255;
	var g1 = c1 >> 8 & 255;
	var b1 = c1 & 255;
	var a2 = c2 >>> 24;
	var r2 = c2 >> 16 & 255;
	var g2 = c2 >> 8 & 255;
	var b2 = c2 & 255;
	var a = a1 * (1 - k) + a2 * k | 0;
	var r = r1 * (1 - k) + r2 * k | 0;
	var g = g1 * (1 - k) + g2 * k | 0;
	var b = b1 * (1 - k) + b2 * k | 0;
	return a << 24 | r << 16 | g << 8 | b;
};
hxd_Math.angle = function(da) {
	da %= 6.28318530717958623;
	if(da > 3.14159265358979323) da -= 6.28318530717958623; else if(da <= -3.14159265358979312) da += 6.28318530717958623;
	return da;
};
hxd_Math.angleLerp = function(a,b,k) {
	return a + hxd_Math.angle(b - a) * k;
};
hxd_Math.angleMove = function(a,b,max) {
	var da = hxd_Math.angle(b - a);
	if(da > -max && da < max) return b; else return a + (da < 0?-max:max);
};
hxd_Math.shuffle = function(a) {
	var len = a.length;
	var _g = 0;
	while(_g < len) {
		var i = _g++;
		var x = Std.random(len);
		var y = Std.random(len);
		var tmp = a[x];
		a[x] = a[y];
		a[y] = tmp;
	}
};
hxd_Math.random = function(max) {
	if(max == null) max = 1.0;
	return Math.random() * max;
};
hxd_Math.srand = function(max) {
	if(max == null) max = 1.0;
	return (Math.random() - 0.5) * (max * 2);
};
hxd_Math.b2f = function(v) {
	return (v & 255) * 0.0039215686274509803921568627451;
};
hxd_Math.f2b = function(v) {
	return (v < 0.?0.:v > 1.?1.:v) * 255.0 | 0;
};
hxd_Math.umod = function(value,modulo) {
	var r = value % modulo;
	if(r >= 0) return r; else return r + modulo;
};
hxd_Math.ufmod = function(value,modulo) {
	var r = value % modulo;
	if(r >= 0) return r; else return r + modulo;
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
var hxd__$Pixels_PixelsARGB_$Impl_$ = {};
$hxClasses["hxd._Pixels.PixelsARGB_Impl_"] = hxd__$Pixels_PixelsARGB_$Impl_$;
hxd__$Pixels_PixelsARGB_$Impl_$.__name__ = ["hxd","_Pixels","PixelsARGB_Impl_"];
hxd__$Pixels_PixelsARGB_$Impl_$.getPixel = function(this1,x,y) {
	return hxd_Pixels.switchEndian(this1.bytes.getInt32((x + y * this1.width << 2) + this1.offset));
};
hxd__$Pixels_PixelsARGB_$Impl_$.setPixel = function(this1,x,y,v) {
	this1.bytes.setInt32((x + y * this1.width << 2) + this1.offset,v >>> 24 | v >> 8 & 65280 | v << 8 & 16711680 | v << 24);
};
hxd__$Pixels_PixelsARGB_$Impl_$.fromPixels = function(p) {
	p.convert(hxd_PixelFormat.ARGB);
	p.setFlip(false);
	return p;
};
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
hxd_Pixels.switchEndian = function(v) {
	return v >>> 24 | v >> 8 & 65280 | v << 8 & 16711680 | v << 24;
};
hxd_Pixels.switchBR = function(v) {
	return v & -16711936 | v << 16 & 16711680 | v >> 16 & 255;
};
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
	,invalidFormat: function() {
		throw new js__$Boot_HaxeError("Unsupported format for this operation : " + Std.string(this.format));
	}
	,sub: function(x,y,width,height) {
		if(x < 0 || y < 0 || x + width > this.width || y + height >= this.height) throw new js__$Boot_HaxeError("Pixels.sub() outside bounds");
		var out = hxd_impl_Tmp.getBytes(width * height * this.bpp);
		var stride = width * this.bpp;
		var outP = 0;
		var _g = 0;
		while(_g < height) {
			var dy = _g++;
			var p = (x + this.yflip(y + dy) * this.width) * this.bpp + this.offset;
			out.blit(outP,this.bytes,p,stride);
			outP += stride;
		}
		return new hxd_Pixels(width,height,out,this.format);
	}
	,yflip: function(y) {
		if((this.flags & 1 << hxd_Flags.FlipY[1]) != 0) return this.height - 1 - y; else return y;
	}
	,blit: function(x,y,src,srcX,srcY,width,height) {
		if(x < 0 || y < 0 || x + width > this.width || y + height > this.height) throw new js__$Boot_HaxeError("Pixels.blit() outside bounds");
		if(srcX < 0 || srcX < 0 || srcX + width > src.width || srcY + height > src.height) throw new js__$Boot_HaxeError("Pixels.blit() outside src bounds");
		if((this.flags & 1 << hxd_Flags.ReadOnly[1]) != 0) this.copyInner();
		src.convert(this.format);
		var stride = width * this.bpp;
		var _g = 0;
		while(_g < height) {
			var dy = _g++;
			var srcP = (srcX + src.yflip(dy + srcY) * src.width) * this.bpp + src.offset;
			var dstP = (x + this.yflip(dy + y) * this.width) * this.bpp + this.offset;
			this.bytes.blit(dstP,src.bytes,srcP,stride);
		}
	}
	,clear: function(color) {
		if((this.flags & 1 << hxd_Flags.ReadOnly[1]) != 0) this.copyInner();
		if(color == 0) {
			this.bytes.fill(this.offset,this.width * this.height * this.bpp,0);
			return;
		}
		var _g = this.format;
		switch(_g[1]) {
		case 1:
			break;
		case 2:
			color = color & -16711936 | color << 16 & 16711680 | color >> 16 & 255;
			break;
		case 0:
			color = color >>> 24 | color >> 8 & 65280 | color << 8 & 16711680 | color << 24;
			break;
		default:
			this.invalidFormat();
		}
		var p = this.offset;
		var _g1 = 0;
		var _g2 = this.width * this.height;
		while(_g1 < _g2) {
			var i = _g1++;
			this.bytes.setInt32(p,color);
			p += 4;
		}
	}
	,toVector: function() {
		var vec;
		var this1;
		this1 = new Array(this.width * this.height);
		vec = this1;
		var idx = 0;
		var p = this.offset;
		var dl = 0;
		if((this.flags & 1 << hxd_Flags.FlipY[1]) != 0) {
			p += (this.height - 1) * this.width * this.bpp;
			dl = -this.width * 2 * this.bpp;
		}
		var _g = this.format;
		switch(_g[1]) {
		case 1:
			var _g2 = 0;
			var _g1 = this.height;
			while(_g2 < _g1) {
				var y = _g2++;
				var _g4 = 0;
				var _g3 = this.width;
				while(_g4 < _g3) {
					var x = _g4++;
					var index = idx++;
					var val = this.bytes.getInt32(p);
					vec[index] = val;
					p += 4;
				}
				p += dl;
			}
			break;
		case 2:
			var _g21 = 0;
			var _g11 = this.height;
			while(_g21 < _g11) {
				var y1 = _g21++;
				var _g41 = 0;
				var _g31 = this.width;
				while(_g41 < _g31) {
					var x1 = _g41++;
					var v = this.bytes.getInt32(p);
					var index1 = idx++;
					vec[index1] = v & -16711936 | v << 16 & 16711680 | v >> 16 & 255;
					p += 4;
				}
				p += dl;
			}
			break;
		case 0:
			var _g22 = 0;
			var _g12 = this.height;
			while(_g22 < _g12) {
				var y2 = _g22++;
				var _g42 = 0;
				var _g32 = this.width;
				while(_g42 < _g32) {
					var x2 = _g42++;
					var v1 = this.bytes.getInt32(p);
					var index2 = idx++;
					vec[index2] = v1 >>> 24 | v1 >> 8 & 65280 | v1 << 8 & 16711680 | v1 << 24;
					p += 4;
				}
				p += dl;
			}
			break;
		default:
			this.invalidFormat();
		}
		return vec;
	}
	,makeSquare: function(copy) {
		var w = this.width;
		var h = this.height;
		var tw;
		if(w == 0) tw = 0; else tw = 1;
		var th;
		if(h == 0) th = 0; else th = 1;
		while(tw < w) tw <<= 1;
		while(th < h) th <<= 1;
		if(w == tw && h == th) return this;
		var out = hxd_impl_Tmp.getBytes(tw * th * 4);
		var p = 0;
		var b = this.offset;
		var _g = 0;
		while(_g < h) {
			var y = _g++;
			out.blit(p,this.bytes,b,w * 4);
			p += w * 4;
			b += w * 4;
			var _g2 = 0;
			var _g1 = tw - w;
			while(_g2 < _g1) {
				var i = _g2++;
				out.setInt32(p,0);
				p += 4;
			}
		}
		var _g11 = 0;
		var _g3 = (th - h) * tw;
		while(_g11 < _g3) {
			var i1 = _g11++;
			out.setInt32(p,0);
			p += 4;
		}
		if(copy) return new hxd_Pixels(tw,th,out,this.format);
		if(!((this.flags & 1 << hxd_Flags.ReadOnly[1]) != 0)) hxd_impl_Tmp.saveBytes(this.bytes);
		this.bytes = out;
		this.width = tw;
		this.height = th;
		return this;
	}
	,copyInner: function() {
		var old = this.bytes;
		this.bytes = hxd_impl_Tmp.getBytes(this.width * this.height * 4);
		this.bytes.blit(0,old,this.offset,this.width * this.height * 4);
		this.offset = 0;
		this.flags &= 268435455 - (1 << hxd_Flags.ReadOnly[1]);
	}
	,willChange: function() {
		if((this.flags & 1 << hxd_Flags.ReadOnly[1]) != 0) this.copyInner();
	}
	,setFlip: function(b) {
		if(b == null) b = false;
		if((this.flags & 1 << hxd_Flags.FlipY[1]) != 0 == b) return;
		if((this.flags & 1 << hxd_Flags.ReadOnly[1]) != 0) this.copyInner();
		if(b) this.flags |= 1 << hxd_Flags.FlipY[1]; else this.flags &= 268435455 - (1 << hxd_Flags.FlipY[1]);
		var stride = this.width * this.bpp;
		var _g1 = 0;
		var _g = this.height >> 1;
		while(_g1 < _g) {
			var y = _g1++;
			var p1 = y * stride;
			var p2 = (this.height - 1 - y) * stride;
			var _g3 = 0;
			var _g2 = stride >> 2;
			while(_g3 < _g2) {
				var x = _g3++;
				var a = this.bytes.getInt32(p1);
				var b1 = this.bytes.getInt32(p2);
				this.bytes.setInt32(p1,b1);
				this.bytes.setInt32(p2,a);
				p1 += 4;
				p2 += 4;
			}
		}
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
	,getPixel: function(x,y) {
		var p;
		p = (x + ((this.flags & 1 << hxd_Flags.FlipY[1]) != 0?this.height - 1 - y:y) * this.width) * this.bpp + this.offset;
		var _g = this.format;
		switch(_g[1]) {
		case 1:
			return this.bytes.getInt32(p);
		case 2:
			return hxd_Pixels.switchBR(this.bytes.getInt32(p));
		case 0:
			return hxd_Pixels.switchEndian(this.bytes.getInt32(p));
		default:
			this.invalidFormat();
			return 0;
		}
	}
	,setPixel: function(x,y,color) {
		var p;
		p = (x + ((this.flags & 1 << hxd_Flags.FlipY[1]) != 0?this.height - 1 - y:y) * this.width) * this.bpp + this.offset;
		if((this.flags & 1 << hxd_Flags.ReadOnly[1]) != 0) this.copyInner();
		var _g = this.format;
		switch(_g[1]) {
		case 1:
			this.bytes.setInt32(p,color);
			break;
		case 2:
			this.bytes.setInt32(p,color & -16711936 | color << 16 & 16711680 | color >> 16 & 255);
			break;
		case 0:
			this.bytes.setInt32(p,color >>> 24 | color >> 8 & 65280 | color << 8 & 16711680 | color << 24);
			break;
		default:
			this.invalidFormat();
		}
	}
	,dispose: function() {
		if(this.bytes != null) {
			if(!((this.flags & 1 << hxd_Flags.ReadOnly[1]) != 0)) hxd_impl_Tmp.saveBytes(this.bytes);
			this.bytes = null;
		}
	}
	,toPNG: function() {
		var png;
		var _g = this.format;
		switch(_g[1]) {
		case 0:
			png = format_png_Tools.build32ARGB(this.width,this.height,this.bytes);
			break;
		default:
			this.convert(hxd_PixelFormat.BGRA);
			png = format_png_Tools.build32BGRA(this.width,this.height,this.bytes);
		}
		var o = new haxe_io_BytesOutput();
		new format_png_Writer(o).write(png);
		return o.getBytes();
	}
	,clone: function() {
		var p = new hxd_Pixels(this.width,this.height,null,this.format);
		p.flags = this.flags;
		p.flags &= 268435455 - (1 << hxd_Flags.ReadOnly[1]);
		if(this.bytes != null) {
			var size = this.width * this.height * this.bpp;
			p.bytes = hxd_impl_Tmp.getBytes(size);
			p.bytes.blit(0,this.bytes,this.offset,size);
		}
		return p;
	}
	,__class__: hxd_Pixels
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
	,removeScene: function(s) {
		if(HxOverrides.remove(this.scenes,s)) s.setEvents(null);
	}
	,dispose: function() {
		hxd_Stage.getInstance().removeEventTarget($bind(this,this.onEvent));
	}
	,focus: function(i) {
		if(this.currentFocus == i) return;
		if(i == null) {
			this.blur();
			return;
		}
		if(this.currentFocus != null) {
			this.blur();
			if(this.currentFocus != null) return;
		}
		var e = new hxd_Event(hxd_EventKind.EFocus);
		i.handleEvent(e);
		if(!e.cancel) this.currentFocus = i;
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
	,startDrag: function(f,onCancel,refEvent) {
		if(this.currentDrag != null && this.currentDrag.onCancel != null) this.currentDrag.onCancel();
		this.currentDrag = { f : f, ref : refEvent == null?null:refEvent.touchId, onCancel : onCancel};
	}
	,stopDrag: function() {
		this.currentDrag = null;
	}
	,getFocus: function() {
		return this.currentFocus;
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
	onClose: function() {
		return true;
	}
	,event: function(e) {
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
	,removeResizeEvent: function(f) {
		this.resizeEvents.remove(f);
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
	,get_mouseLock: function() {
		return false;
	}
	,set_mouseLock: function(b) {
		throw new js__$Boot_HaxeError("Mouse lock not supported");
		return false;
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
hxd_System.getCurrentLoop = function() {
	return hxd_System.LOOP;
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
hxd_System.getClipboard = function() {
	return "";
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
hxd_System.get_lang = function() {
	return "en";
};
hxd_System.get_screenDPI = function() {
	return 72.;
};
hxd_System.get_isAndroid = function() {
	return false;
};
hxd_System.get_isIOS = function() {
	return false;
};
hxd_System.get_isWindowed = function() {
	return true;
};
hxd_System.get_isTouch = function() {
	return false;
};
hxd_System.get_width = function() {
	return hxd_Math.round(window.document.body.clientWidth * window.devicePixelRatio);
};
hxd_System.get_height = function() {
	return hxd_Math.round(window.document.body.clientHeight * window.devicePixelRatio);
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
hxd_Timer.fps = function() {
	return hxd_Timer.wantedFPS / hxd_Timer.calc_tmod;
};
hxd_Timer.skip = function() {
	hxd_Timer.oldTime = haxe_Timer.stamp();
};
var hxd_impl_ArrayIterator = function(a) {
	this.i = 0;
	this.a = a;
	this.l = this.a.length;
};
$hxClasses["hxd.impl.ArrayIterator"] = hxd_impl_ArrayIterator;
hxd_impl_ArrayIterator.__name__ = ["hxd","impl","ArrayIterator"];
hxd_impl_ArrayIterator.prototype = {
	hasNext: function() {
		return this.i < this.l;
	}
	,next: function() {
		return this.a[this.i++];
	}
	,__class__: hxd_impl_ArrayIterator
};
var hxd_impl_ArrayIterator_$h2d_$Sprite = function(a) {
	this.i = 0;
	this.a = a;
	this.l = this.a.length;
};
$hxClasses["hxd.impl.ArrayIterator_h2d_Sprite"] = hxd_impl_ArrayIterator_$h2d_$Sprite;
hxd_impl_ArrayIterator_$h2d_$Sprite.__name__ = ["hxd","impl","ArrayIterator_h2d_Sprite"];
hxd_impl_ArrayIterator_$h2d_$Sprite.prototype = {
	hasNext: function() {
		return this.i < this.l;
	}
	,next: function() {
		return this.a[this.i++];
	}
	,__class__: hxd_impl_ArrayIterator_$h2d_$Sprite
};
var hxd_impl_ArrayIterator_$h3d_$scene_$Object = function(a) {
	this.i = 0;
	this.a = a;
	this.l = this.a.length;
};
$hxClasses["hxd.impl.ArrayIterator_h3d_scene_Object"] = hxd_impl_ArrayIterator_$h3d_$scene_$Object;
hxd_impl_ArrayIterator_$h3d_$scene_$Object.__name__ = ["hxd","impl","ArrayIterator_h3d_scene_Object"];
hxd_impl_ArrayIterator_$h3d_$scene_$Object.prototype = {
	hasNext: function() {
		return this.i < this.l;
	}
	,next: function() {
		return this.a[this.i++];
	}
	,__class__: hxd_impl_ArrayIterator_$h3d_$scene_$Object
};
var hxd_impl_MemoryReader = function() {
};
$hxClasses["hxd.impl.MemoryReader"] = hxd_impl_MemoryReader;
hxd_impl_MemoryReader.__name__ = ["hxd","impl","MemoryReader"];
hxd_impl_MemoryReader.prototype = {
	b: function(addr) {
		return hxd_impl_Memory.current.b[addr];
	}
	,wb: function(addr,v) {
		hxd_impl_Memory.current.b[addr] = v & 255;
	}
	,'double': function(addr) {
		throw new js__$Boot_HaxeError("TODO");
		return 0.;
	}
	,'float': function(addr) {
		throw new js__$Boot_HaxeError("TODO");
		return 0.;
	}
	,wfloat: function(addr,v) {
		throw new js__$Boot_HaxeError("TODO");
	}
	,wdouble: function(addr,v) {
		throw new js__$Boot_HaxeError("TODO");
	}
	,i32: function(addr) {
		throw new js__$Boot_HaxeError("TODO");
		return 0;
	}
	,end: function() {
		hxd_impl_Memory.end();
	}
	,__class__: hxd_impl_MemoryReader
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
var hxsl_VarQualifier = $hxClasses["hxsl.VarQualifier"] = { __ename__ : true, __constructs__ : ["Const","Private","Nullable","PerObject","Name","Shared","Precision"] };
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
hxsl_VarQualifier.__empty_constructs__ = [hxsl_VarQualifier.Private,hxsl_VarQualifier.Nullable,hxsl_VarQualifier.PerObject,hxsl_VarQualifier.Shared];
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
var hxsl_ExprDef = $hxClasses["hxsl.ExprDef"] = { __ename__ : true, __constructs__ : ["EConst","EIdent","EParenthesis","EField","EBinop","EUnop","ECall","EBlock","EVars","EFunction","EIf","EDiscard","EFor","EReturn","EBreak","EContinue","EArray","EArrayDecl"] };
hxsl_ExprDef.EConst = function(c) { var $x = ["EConst",0,c]; $x.__enum__ = hxsl_ExprDef; $x.toString = $estr; return $x; };
hxsl_ExprDef.EIdent = function(i) { var $x = ["EIdent",1,i]; $x.__enum__ = hxsl_ExprDef; $x.toString = $estr; return $x; };
hxsl_ExprDef.EParenthesis = function(e) { var $x = ["EParenthesis",2,e]; $x.__enum__ = hxsl_ExprDef; $x.toString = $estr; return $x; };
hxsl_ExprDef.EField = function(e,f) { var $x = ["EField",3,e,f]; $x.__enum__ = hxsl_ExprDef; $x.toString = $estr; return $x; };
hxsl_ExprDef.EBinop = function(op,e1,e2) { var $x = ["EBinop",4,op,e1,e2]; $x.__enum__ = hxsl_ExprDef; $x.toString = $estr; return $x; };
hxsl_ExprDef.EUnop = function(op,e1) { var $x = ["EUnop",5,op,e1]; $x.__enum__ = hxsl_ExprDef; $x.toString = $estr; return $x; };
hxsl_ExprDef.ECall = function(e,args) { var $x = ["ECall",6,e,args]; $x.__enum__ = hxsl_ExprDef; $x.toString = $estr; return $x; };
hxsl_ExprDef.EBlock = function(el) { var $x = ["EBlock",7,el]; $x.__enum__ = hxsl_ExprDef; $x.toString = $estr; return $x; };
hxsl_ExprDef.EVars = function(v) { var $x = ["EVars",8,v]; $x.__enum__ = hxsl_ExprDef; $x.toString = $estr; return $x; };
hxsl_ExprDef.EFunction = function(f) { var $x = ["EFunction",9,f]; $x.__enum__ = hxsl_ExprDef; $x.toString = $estr; return $x; };
hxsl_ExprDef.EIf = function(econd,eif,eelse) { var $x = ["EIf",10,econd,eif,eelse]; $x.__enum__ = hxsl_ExprDef; $x.toString = $estr; return $x; };
hxsl_ExprDef.EDiscard = ["EDiscard",11];
hxsl_ExprDef.EDiscard.toString = $estr;
hxsl_ExprDef.EDiscard.__enum__ = hxsl_ExprDef;
hxsl_ExprDef.EFor = function(v,loop,block) { var $x = ["EFor",12,v,loop,block]; $x.__enum__ = hxsl_ExprDef; $x.toString = $estr; return $x; };
hxsl_ExprDef.EReturn = function(e) { var $x = ["EReturn",13,e]; $x.__enum__ = hxsl_ExprDef; $x.toString = $estr; return $x; };
hxsl_ExprDef.EBreak = ["EBreak",14];
hxsl_ExprDef.EBreak.toString = $estr;
hxsl_ExprDef.EBreak.__enum__ = hxsl_ExprDef;
hxsl_ExprDef.EContinue = ["EContinue",15];
hxsl_ExprDef.EContinue.toString = $estr;
hxsl_ExprDef.EContinue.__enum__ = hxsl_ExprDef;
hxsl_ExprDef.EArray = function(e,eindex) { var $x = ["EArray",16,e,eindex]; $x.__enum__ = hxsl_ExprDef; $x.toString = $estr; return $x; };
hxsl_ExprDef.EArrayDecl = function(el) { var $x = ["EArrayDecl",17,el]; $x.__enum__ = hxsl_ExprDef; $x.toString = $estr; return $x; };
hxsl_ExprDef.__empty_constructs__ = [hxsl_ExprDef.EDiscard,hxsl_ExprDef.EBreak,hxsl_ExprDef.EContinue];
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
hxsl_Tools.isStruct = function(v) {
	{
		var _g = v.type;
		switch(_g[1]) {
		case 12:
			return true;
		default:
			return false;
		}
	}
};
hxsl_Tools.isArray = function(v) {
	{
		var _g = v.type;
		switch(_g[1]) {
		case 14:
			return true;
		default:
			return false;
		}
	}
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
hxsl_Tools.toType = function(t) {
	switch(t[1]) {
	case 1:
		return hxsl_Type.TFloat;
	case 2:
		return hxsl_Type.TBool;
	case 0:
		return hxsl_Type.TInt;
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
hxsl_Tools.size = function(t) {
	switch(t[1]) {
	case 0:
		return 0;
	case 3:case 1:
		return 1;
	case 5:
		var n = t[2];
		return n;
	case 12:
		var vl = t[2];
		var s = 0;
		var _g = 0;
		while(_g < vl.length) {
			var v = vl[_g];
			++_g;
			s += hxsl_Tools.size(v.type);
		}
		return s;
	case 6:
		return 9;
	case 7:
		return 16;
	case 8:
		return 12;
	case 9:
		var s1 = t[2];
		return s1;
	case 2:case 4:case 10:case 11:case 13:
		return 0;
	case 14:
		switch(t[3][1]) {
		case 0:
			var t1 = t[2];
			var v1 = t[3][2];
			return hxsl_Tools.size(t1) * v1;
		case 1:
			return 0;
		}
		break;
	}
};
var hxsl_Tools2 = function() { };
$hxClasses["hxsl.Tools2"] = hxsl_Tools2;
hxsl_Tools2.__name__ = ["hxsl","Tools2"];
hxsl_Tools2.toString = function(g) {
	var n = g[0];
	return n.charAt(0).toLowerCase() + HxOverrides.substr(n,1,null);
};
var hxsl_Tools3 = function() { };
$hxClasses["hxsl.Tools3"] = hxsl_Tools3;
hxsl_Tools3.__name__ = ["hxsl","Tools3"];
hxsl_Tools3.toString = function(s) {
	return hxsl_Printer.shaderToString(s);
};
var hxsl_Tools4 = function() { };
$hxClasses["hxsl.Tools4"] = hxsl_Tools4;
hxsl_Tools4.__name__ = ["hxsl","Tools4"];
hxsl_Tools4.toString = function(e) {
	return hxsl_Printer.toString(e);
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
hxsl_Cache.clear = function() {
	hxsl_Cache.INST = null;
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
	,mkInt: function(v,pos) {
		return { e : hxsl_TExprDef.TConst(hxsl_Const.CInt(v)), t : hxsl_Type.TInt, p : pos};
	}
	,readIndex: function(a,index,pos) {
		return { e : hxsl_TExprDef.TArray({ e : hxsl_TExprDef.TVar(a.g), t : a.g.type, p : pos},{ e : hxsl_TExprDef.TConst(hxsl_Const.CInt((a.pos >> 2) + index)), t : hxsl_Type.TInt, p : pos}), t : hxsl_Type.TVec(4,a.t), p : pos};
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
var hxsl__$Globals_GlobalSlot_$Impl_$ = {};
$hxClasses["hxsl._Globals.GlobalSlot_Impl_"] = hxsl__$Globals_GlobalSlot_$Impl_$;
hxsl__$Globals_GlobalSlot_$Impl_$.__name__ = ["hxsl","_Globals","GlobalSlot_Impl_"];
hxsl__$Globals_GlobalSlot_$Impl_$._new = function(name) {
	var this1;
	this1 = hxsl_Globals.allocID(name);
	return this1;
};
hxsl__$Globals_GlobalSlot_$Impl_$.toInt = function(this1) {
	return this1;
};
hxsl__$Globals_GlobalSlot_$Impl_$.set = function(this1,globals,v) {
	globals.fastSet(this1,v);
};
hxsl__$Globals_GlobalSlot_$Impl_$.get = function(this1,globals) {
	return globals.map.h[this1];
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
	,get: function(path) {
		var key = hxsl_Globals.allocID(path);
		return this.map.h[key];
	}
	,fastSet: function(id,v) {
		var value = v;
		this.map.set(id,value);
	}
	,fastGet: function(id) {
		return this.map.h[id];
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
hxsl_GlslOut.toGlsl = function(s) {
	return new hxsl_GlslOut().run(s);
};
hxsl_GlslOut.prototype = {
	add: function(v) {
		this.buf.add(v);
	}
	,ident: function(v) {
		this.add(this.varName(v));
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
	debug: function(msg,pos) {
	}
	,error: function(msg,p) {
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
hxsl_Printer.toString = function(e,varId) {
	if(varId == null) varId = false;
	return new hxsl_Printer(varId).exprString(e);
};
hxsl_Printer.shaderToString = function(s,varId) {
	if(varId == null) varId = false;
	return new hxsl_Printer(varId).shaderString(s);
};
hxsl_Printer.check = function(s,from) {
	try {
		var vars = new haxe_ds_IntMap();
		var regVars = [];
		var regVar;
		var regVar1 = null;
		regVar1 = function(v,reg) {
			if(reg) {
				if(vars.h.hasOwnProperty(v.id)) throw new js__$Boot_HaxeError("Duplicate var " + v.id);
				vars.h[v.id] = v;
				regVars.push(v);
			} else vars.remove(v.id);
			{
				var _g = v.type;
				switch(_g[1]) {
				case 12:
					var vl = _g[2];
					var _g1 = 0;
					while(_g1 < vl.length) {
						var v1 = vl[_g1];
						++_g1;
						regVar1(v1,reg);
					}
					break;
				default:
				}
			}
		};
		regVar = regVar1;
		var checkExpr;
		var checkExpr1 = null;
		checkExpr1 = function(e) {
			{
				var _g2 = e.e;
				switch(_g2[1]) {
				case 1:
					var v2 = _g2[2];
					if(!vars.h.hasOwnProperty(v2.id)) throw new js__$Boot_HaxeError("Unbound var " + v2.name + "@" + v2.id);
					break;
				case 7:
					var init = _g2[3];
					var v3 = _g2[2];
					if(init != null) checkExpr1(init);
					regVar(v3,true);
					break;
				case 4:
					var el = _g2[2];
					var old = regVars;
					regVars = [];
					var _g11 = 0;
					while(_g11 < el.length) {
						var e1 = el[_g11];
						++_g11;
						checkExpr1(e1);
					}
					var _g12 = 0;
					while(_g12 < regVars.length) {
						var v4 = regVars[_g12];
						++_g12;
						regVar(v4,false);
					}
					regVars = old;
					break;
				case 13:
					var loop = _g2[4];
					var it = _g2[3];
					var v5 = _g2[2];
					checkExpr1(it);
					regVar(v5,true);
					checkExpr1(loop);
					regVar(v5,false);
					break;
				default:
					hxsl_Tools.iter(e,checkExpr1);
				}
			}
		};
		checkExpr = checkExpr1;
		var _g3 = 0;
		var _g13 = s.vars;
		while(_g3 < _g13.length) {
			var v6 = _g13[_g3];
			++_g3;
			regVar(v6,true);
		}
		var _g4 = 0;
		var _g14 = s.funs;
		while(_g4 < _g14.length) {
			var f = _g14[_g4];
			++_g4;
			var _g21 = 0;
			var _g31 = f.args;
			while(_g21 < _g31.length) {
				var v7 = _g31[_g21];
				++_g21;
				regVar(v7,true);
			}
			checkExpr(f.expr);
			var _g22 = 0;
			var _g32 = f.args;
			while(_g22 < _g32.length) {
				var v8 = _g32[_g22];
				++_g22;
				regVar(v8,false);
			}
		}
	} catch( e2 ) {
		if (e2 instanceof js__$Boot_HaxeError) e2 = e2.val;
		if( js_Boot.__instanceof(e2,String) ) {
			var msg = e2 + "\n    in\n" + hxsl_Printer.shaderToString(s,true);
			if(from != null) msg += "\n    from\n\n" + ((function($this) {
				var $r;
				var _g5 = [];
				{
					var _g15 = 0;
					while(_g15 < from.length) {
						var s1 = from[_g15];
						++_g15;
						_g5.push(hxsl_Printer.shaderToString(s1,true));
					}
				}
				$r = _g5;
				return $r;
			}(this))).join("\n\n");
			throw new js__$Boot_HaxeError(msg);
		} else throw(e2);
	}
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
	,varString: function(v) {
		this.buffer = new StringBuf();
		this.addVar(v,null);
		return this.buffer.b;
	}
	,funString: function(f) {
		this.buffer = new StringBuf();
		this.addFun(f);
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
	hasGlobal: function(gid) {
		return this.globals.h.hasOwnProperty(gid);
	}
	,__class__: hxsl_RuntimeShader
};
var hxsl_ShaderList = function(s,n) {
	this.s = s;
	this.next = n;
};
$hxClasses["hxsl.ShaderList"] = hxsl_ShaderList;
hxsl_ShaderList.__name__ = ["hxsl","ShaderList"];
hxsl_ShaderList.prototype = {
	clone: function() {
		return new hxsl_ShaderList(this.s.clone(),this.next == null?null:this.next.clone());
	}
	,iterator: function() {
		return new hxsl__$ShaderList_ShaderIterator(this,null);
	}
	,iterateTo: function(s) {
		return new hxsl__$ShaderList_ShaderIterator(this,s);
	}
	,__class__: hxsl_ShaderList
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
	,addSelfParam: function(i,v) {
		{
			var _g = v.type;
			switch(_g[1]) {
			case 12:
				var vl = _g[2];
				var _g1 = 0;
				while(_g1 < vl.length) {
					var v1 = vl[_g1];
					++_g1;
					this.addSelfParam(i,v1);
				}
				break;
			default:
				if(v.kind == hxsl_VarKind.Param) {
					i.params.h[v.id] = this.paramsCount;
					this.paramsCount++;
				}
			}
		}
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
		var $it0 = vvars.iterator();
		while( $it0.hasNext() ) {
			var inf = $it0.next();
			var v = inf.v;
			var _g3 = v.kind;
			switch(_g3[1]) {
			case 3:case 4:
				if(fvars.h.hasOwnProperty(v.id)) v.kind = hxsl_VarKind.Var; else v.kind = hxsl_VarKind.Local;
				break;
			default:
			}
			var _g4 = v.kind;
			switch(_g4[1]) {
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
		var $it1 = fvars.iterator();
		while( $it1.hasNext() ) {
			var inf1 = $it1.next();
			var v1 = inf1.v;
			var _g5 = v1.kind;
			switch(_g5[1]) {
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
				fvars.h[nv1.id] = fp;
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
		var $it2 = vvars.iterator();
		while( $it2.hasNext() ) {
			var v2 = $it2.next();
			this.checkVar(v2,true,vvars);
		}
		var $it3 = fvars.iterator();
		while( $it3.hasNext() ) {
			var v3 = $it3.next();
			this.checkVar(v3,false,vvars);
		}
		var $it4 = this.varMap.keys();
		while( $it4.hasNext() ) {
			var v4 = $it4.next();
			var v21;
			var key = this.varMap.h[v4.__id__];
			v21 = this.varMap.h[key.__id__];
			if(v21 != null) this.varMap.set(v4,v21);
		}
		ffun = { ret : ffun.ret, ref : ffun.ref, kind : ffun.kind, args : ffun.args, expr : this.mapVars(ffun.expr)};
		{
			var _g6 = ffun.expr.e;
			switch(_g6[1]) {
			case 4:
				var el = _g6[2];
				var _g11 = 0;
				while(_g11 < finits.length) {
					var e1 = finits[_g11];
					++_g11;
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
		var $it5 = vvars.iterator();
		while( $it5.hasNext() ) {
			var v5 = $it5.next();
			if(!v5.local) _g7.push(v5.v);
		}
		vvars1 = _g7;
		var fvars1;
		var _g12 = [];
		var $it6 = fvars.iterator();
		while( $it6.hasNext() ) {
			var v6 = $it6.next();
			if(!v6.local) _g12.push(v6.v);
		}
		fvars1 = _g12;
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
var ArrayBuffer = $global.ArrayBuffer || js_html_compat_ArrayBuffer;
if(ArrayBuffer.prototype.slice == null) ArrayBuffer.prototype.slice = js_html_compat_ArrayBuffer.sliceImpl;
var DataView = $global.DataView || js_html_compat_DataView;
var Uint8Array = $global.Uint8Array || js_html_compat_Uint8Array._new;
format_tools__$InflateImpl_Window.SIZE = 32768;
format_tools__$InflateImpl_Window.BUFSIZE = 65536;
format_tools_InflateImpl.LEN_EXTRA_BITS_TBL = [0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,-1,-1];
format_tools_InflateImpl.LEN_BASE_VAL_TBL = [3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258];
format_tools_InflateImpl.DIST_EXTRA_BITS_TBL = [0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,-1,-1];
format_tools_InflateImpl.DIST_BASE_VAL_TBL = [1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577];
format_tools_InflateImpl.CODE_LENGTHS_POS = [16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];
h2d_RenderContext.BUFFERING = false;
h3d_Buffer.GUID = 0;
h3d_BufferOffset.UID = 0;
h3d_Matrix.tmp = new h3d_Matrix();
h3d_Matrix.lumR = 0.212671;
h3d_Matrix.lumG = 0.71516;
h3d_Matrix.lumB = 0.072169;
h3d_Matrix.SQ13 = 0.57735026918962576450914878050196;
h3d_anim_Animation.EPSILON = 0.000001;
h3d_impl_GlDriver.TFILTERS = [[[9728,9728],[9729,9729]],[[9728,9984],[9729,9985]],[[9728,9986],[9729,9987]]];
h3d_impl_GlDriver.TWRAP = [33071,10497];
h3d_impl_GlDriver.FACES = [0,1028,1029,1032];
h3d_impl_GlDriver.BLEND = [1,0,770,768,772,774,771,769,773,775,32769,32771,32770,32772,776];
h3d_impl_GlDriver.COMPARE = [519,512,514,517,516,518,513,515];
h3d_impl_GlDriver.OP = [32774,32778,32779];
h3d_impl_MemoryManager.MAX_MEMORY = 262144000;
h3d_impl_MemoryManager.MAX_BUFFERS = 4096;
h3d_impl_MemoryManager.SIZE = 65533;
h3d_impl_MemoryManager.ALL_FLAGS = Type.allEnums(h3d_BufferFlag);
h3d_mat_Defaults.defaultKillAlphaThreshold = 0.5;
h3d_mat_Defaults.loadingTextureColor = -65281;
h3d_mat_Pass.culling_bits = 2;
h3d_mat_Pass.culling_offset = 0;
h3d_mat_Pass.culling_mask = 3;
h3d_mat_Pass.depthWrite_bits = 1;
h3d_mat_Pass.depthWrite_offset = 2;
h3d_mat_Pass.depthWrite_mask = 4;
h3d_mat_Pass.depthTest_bits = 3;
h3d_mat_Pass.depthTest_offset = 3;
h3d_mat_Pass.depthTest_mask = 56;
h3d_mat_Pass.blendSrc_bits = 4;
h3d_mat_Pass.blendSrc_offset = 6;
h3d_mat_Pass.blendSrc_mask = 960;
h3d_mat_Pass.blendDst_bits = 4;
h3d_mat_Pass.blendDst_offset = 10;
h3d_mat_Pass.blendDst_mask = 15360;
h3d_mat_Pass.blendAlphaSrc_bits = 4;
h3d_mat_Pass.blendAlphaSrc_offset = 14;
h3d_mat_Pass.blendAlphaSrc_mask = 245760;
h3d_mat_Pass.blendAlphaDst_bits = 4;
h3d_mat_Pass.blendAlphaDst_offset = 18;
h3d_mat_Pass.blendAlphaDst_mask = 3932160;
h3d_mat_Pass.blendOp_bits = 2;
h3d_mat_Pass.blendOp_offset = 22;
h3d_mat_Pass.blendOp_mask = 12582912;
h3d_mat_Pass.blendAlphaOp_bits = 2;
h3d_mat_Pass.blendAlphaOp_offset = 24;
h3d_mat_Pass.blendAlphaOp_mask = 50331648;
h3d_mat_Pass.colorMask_bits = 4;
h3d_mat_Pass.colorMask_offset = 26;
h3d_mat_Pass.colorMask_mask = 1006632960;
h3d_mat_Texture.UID = 0;
h3d_mat_Texture.nativeFormat = hxd_PixelFormat.RGBA;
h3d_mat_Texture.nativeFlip = false;
h3d_mat_Texture.COLOR_CACHE = new haxe_ds_IntMap();
h3d_mat_Texture.noiseTextures = new haxe_ds_IntMap();
h3d_pass__$Border_BorderShader.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:5:0y4:namey8:positiony4:typejy9:hxsl.Type:5:2i4jy12:hxsl.VecType:1:0y6:parentoR6r10R8y6:outputR10jR11:12:1ar9oR6r10R8y5:colorR10jR11:5:2i4r11R13r13y2:idi-234ghR16i-232gR16i-233gy1:poy4:filey61:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fpass%2FBorder.hxy3:maxi295y3:mini280gy1:tr12goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:40:0R17oR18R19R20i302R21i298gR22jR11:13:1ahgaoR3jR4:1:1oR6jR7:1:0R8R9R10jR11:5:2i2r11R13oR6r30R8y5:inputR10jR11:12:1ar29hR16i-230gR16i-231gR17oR18R19R20i317R21i303gR22r31goR3jR4:0:1jy10:hxsl.Const:3:1zR17oR18R19R20i320R21i319gR22jR11:3:0goR3jR4:0:1jR25:3:1i1R17oR18R19R20i323R21i322gR22r41ghR17oR18R19R20i324R21i298gR22jR11:5:2i4r11gR17oR18R19R20i324R21i280gR22r12ghR17oR18R19R20i330R21i274gR22jR11:0:0gR6jy17:hxsl.FunctionKind:0:0y3:refoR6jR7:6:0R8y6:vertexR10jR11:13:1aoR1ahy3:retr53ghR16i-235gR29r53goR1ahR2oR3jR4:4:1aoR3jR4:5:3r7oR3jR4:1:1r15R17oR18R19R20i374R21i362gR22r16goR3jR4:1:1oR6jR7:2:0R8R15R10jR11:5:2i4r11R16i-229gR17oR18R19R20i382R21i377gR22r72gR17oR18R19R20i382R21i362gR22r16ghR17oR18R19R20i388R21i356gR22r53gR6jR26:1:0R27oR6r56R8y8:fragmentR10jR11:13:1aoR1ahR29r53ghR16i-236gR29r53ghR8y29:h3d.pass._Border.BorderShadery4:varsar55r80r13r32r70hg";
h3d_pass_Default.__meta__ = { fields : { cameraView : { global : ["camera.view"]}, cameraNear : { global : ["camera.zNear"]}, cameraFar : { global : ["camera.zFar"]}, cameraProj : { global : ["camera.proj"]}, cameraPos : { global : ["camera.position"]}, cameraProjDiag : { global : ["camera.projDiag"]}, cameraViewProj : { global : ["camera.viewProj"]}, cameraInverseViewProj : { global : ["camera.inverseViewProj"]}, globalTime : { global : ["global.time"]}, pixelSize : { global : ["global.pixelSize"]}, globalModelView : { global : ["global.modelView"]}, globalModelViewInverse : { global : ["global.modelViewInverse"]}}};
h3d_prim_BigPrimitive.TOTAL = 0;
h3d_scene_Object.ROT2RAD = -0.017453292519943295769236907684886;
h3d_scene__$Object_ObjectFlags_$Impl_$.FPosChanged = 1;
h3d_scene__$Object_ObjectFlags_$Impl_$.FVisible = 2;
h3d_scene__$Object_ObjectFlags_$Impl_$.FCulled = 4;
h3d_scene__$Object_ObjectFlags_$Impl_$.FFollowPositionOnly = 8;
h3d_scene__$Object_ObjectFlags_$Impl_$.FLightCameraCenter = 16;
h3d_scene__$Object_ObjectFlags_$Impl_$.FAllocated = 32;
h3d_scene__$Object_ObjectFlags_$Impl_$.FAlwaysSync = 64;
h3d_scene__$Object_ObjectFlags_$Impl_$.FInheritCulled = 128;
h3d_shader_AmbientLight.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey10:lightColory4:typejy9:hxsl.Type:5:2i3jy12:hxsl.VecType:1:0y2:idi-214gy1:poy4:filey69:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FAmbientLight.hxy3:maxi349y3:mini339gy1:tr12goR3jR4:10:3oR3jR4:1:1oR6jR7:2:0R8y8:additiveR10jR11:2:0y10:qualifiersajy17:hxsl.VarQualifier:0:1nhR13i-215gR14oR15R16R17i360R18i352gR19r19goR3jR4:1:1oR6jR7:0:0R8y12:ambientLightR10jR11:5:2i3r11y6:parentoR6r26R8y6:globalR10jR11:12:1ar25oR6r26R8y16:perPixelLightingR10r19R24r28R21ajR22:0:1nhR13i-211ghR13i-209gR13i-210gR14oR15R16R17i382R18i363gR19r27goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:39:0R14oR15R16R17i389R18i385gR19jR11:13:1ahgaoR3jR4:0:1jy10:hxsl.Const:3:1d0R14oR15R16R17i392R18i390gR19jR11:3:0ghR14oR15R16R17i393R18i385gR19jR11:5:2i3r11gR14oR15R16R17i393R18i352gR19r27gR14oR15R16R17i393R18i339gR19r12ghR14oR15R16R17i399R18i333gR19jR11:0:0gR6jy17:hxsl.FunctionKind:2:0y3:refoR6jR7:6:0R8y8:__init__R10jR11:13:1aoR1ahy3:retr58ghR13i-216gR32r58goR1ahR2oR3jR4:4:1aoR3jR4:5:3r7oR3jR4:1:1oR6r10R8y15:lightPixelColorR10jR11:5:2i3r11R13i-213gR14oR15R16R17i454R18i439gR19r73goR3jR4:10:3oR3jR4:1:1r17R14oR15R16R17i465R18i457gR19r19goR3jR4:1:1r25R14oR15R16R17i487R18i468gR19r27goR3jR4:8:2oR3jR4:2:1r38R14oR15R16R17i494R18i490gR19r42gaoR3jR4:0:1jR28:3:1d0R14oR15R16R17i497R18i495gR19r48ghR14oR15R16R17i498R18i490gR19jR11:5:2i3r11gR14oR15R16R17i498R18i457gR19r27gR14oR15R16R17i498R18i439gR19r73ghR14oR15R16R17i504R18i433gR19r58gR6r59R30oR6r61R8y16:__init__fragmentR10jR11:13:1aoR1ahR32r58ghR13i-217gR32r58goR1aoR6r10R8R9R10jR11:5:2i3r11R13i-218ghR2oR3jR4:4:1aoR3jR4:12:1oR3jR4:10:3oR3jR4:1:1r17R14oR15R16R17i578R18i570gR19r19goR3jR4:1:1r108R14oR15R16R17i591R18i581gR19r109goR3jR4:3:1oR3jR4:5:3jR5:0:0oR3jR4:1:1r25R14oR15R16R17i614R18i595gR19r27goR3jR4:5:3jR5:1:0oR3jR4:8:2oR3jR4:2:1jR27:22:0R14oR15R16R17i642R18i617gR19jR11:13:1aoR1aoR8y1:_R10r27goR8y1:bR10r48ghR32jR11:5:2i3r11ghgaoR3jR4:3:1oR3jR4:5:3jR5:3:0oR3jR4:0:1jR28:3:1i1R14oR15R16R17i619R18i618gR19r48goR3jR4:1:1r25R14oR15R16R17i641R18i622gR19r27gR14oR15R16R17i641R18i618gR19r27gR14oR15R16R17i642R18i617gR19r27goR3jR4:0:1jR28:3:1d0R14oR15R16R17i649R18i647gR19r48ghR14oR15R16R17i650R18i617gR19r138goR3jR4:1:1r108R14oR15R16R17i663R18i653gR19r109gR14oR15R16R17i663R18i617gR19jR11:5:2i3r11gR14oR15R16R17i663R18i595gR19jR11:5:2i3r11gR14oR15R16R17i664R18i594gR19r169gR14oR15R16R17i664R18i570gR19r109gR14oR15R16R17i664R18i563gR19r58ghR14oR15R16R17i670R18i557gR19r58gR6jR29:3:0R30oR6r61R8y9:calcLightR10jR11:13:1aoR1aoR8R9R10r109ghR32jR11:5:2i3r11ghR13i-219gR32r184goR1ahR2oR3jR4:4:1aoR3jR4:10:3oR3jR4:6:2jy15:haxe.macro.Unop:2:0oR3jR4:1:1r30R14oR15R16R17i728R18i705gR19r19gR14oR15R16R17i728R18i704gR19r19goR3jR4:5:3jR5:20:1r127oR3jR4:9:2oR3jR4:1:1oR6r10R8y10:pixelColorR10jR11:5:2i4r11R13i-212gR14oR15R16R17i741R18i731gR19r203gajy14:hxsl.Component:0:0jR40:1:0jR40:2:0hR14oR15R16R17i745R18i731gR19jR11:5:2i3r11goR3jR4:8:2oR3jR4:1:1r179R14oR15R16R17i758R18i749gR19r185gaoR3jR4:1:1r9R14oR15R16R17i769R18i759gR19r12ghR14oR15R16R17i770R18i749gR19r184gR14oR15R16R17i770R18i731gR19r212gnR14oR15R16R17i770R18i700gR19r58ghR14oR15R16R17i776R18i694gR19r58gR6jR29:0:0R30oR6r61R8y6:vertexR10jR11:13:1aoR1ahR32r58ghR13i-220gR32r58goR1ahR2oR3jR4:4:1aoR3jR4:10:3oR3jR4:1:1r30R14oR15R16R17i835R18i812gR19r19goR3jR4:5:3jR5:20:1r127oR3jR4:9:2oR3jR4:1:1r202R14oR15R16R17i848R18i838gR19r203gar207r208r209hR14oR15R16R17i852R18i838gR19jR11:5:2i3r11goR3jR4:8:2oR3jR4:1:1r179R14oR15R16R17i865R18i856gR19r185gaoR3jR4:1:1r72R14oR15R16R17i881R18i866gR19r73ghR14oR15R16R17i882R18i856gR19r184gR14oR15R16R17i882R18i838gR19r252gnR14oR15R16R17i882R18i808gR19r58ghR14oR15R16R17i888R18i802gR19r58gR6jR29:1:0R30oR6r61R8y8:fragmentR10jR11:13:1aoR1ahR32r58ghR13i-221gR32r58ghR8y23:h3d.shader.AmbientLighty4:varsar230r9r60r270r17r101r179r28r202r72hg";
h3d_shader_Base2d.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey14:spritePositiony4:typejy9:hxsl.Type:5:2i4jy12:hxsl.VecType:1:0y2:idi-11gy1:poy4:filey63:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FBase2d.hxy3:maxi919y3:mini905gy1:tr12goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:40:0R14oR15R16R17i926R18i922gR19jR11:13:1ahgaoR3jR4:1:1oR6jR7:1:0R8y8:positionR10jR11:5:2i2r11y6:parentoR6r25R8y5:inputR10jR11:12:1ar24oR6r25R8y2:uvR10jR11:5:2i2r11R22r27R13i-3goR6r25R8y5:colorR10jR11:5:2i4r11R22r27R13i-4ghR13i-1gR13i-2gR14oR15R16R17i941R18i927gR19r26goR3jR4:1:1oR6jR7:2:0R8y6:zValueR10jR11:3:0R13i-9gR14oR15R16R17i949R18i943gR19r39goR3jR4:0:1jy10:hxsl.Const:3:1i1R14oR15R16R17i952R18i951gR19r39ghR14oR15R16R17i953R18i922gR19jR11:5:2i4r11gR14oR15R16R17i953R18i905gR19r12goR3jR4:10:3oR3jR4:1:1oR6r38R8y10:isRelativeR10jR11:2:0y10:qualifiersajy17:hxsl.VarQualifier:0:1nhR13i-16gR14oR15R16R17i973R18i963gR19r54goR3jR4:4:1aoR3jR4:5:3r7oR3jR4:9:2oR3jR4:1:1oR6r10R8y16:absolutePositionR10jR11:5:2i4r11R13i-12gR14oR15R16R17i999R18i983gR19r65gajy14:hxsl.Component:0:0hR14oR15R16R17i1001R18i983gR19r39goR3jR4:8:2oR3jR4:2:1jR20:29:0R14oR15R16R17i1029R18i1004gR19jR11:13:1aoR1aoR8y1:_R10jR11:5:2i3r11goR8y1:bR10jR11:5:2i3r11ghy3:retr39ghgaoR3jR4:8:2oR3jR4:2:1jR20:39:0R14oR15R16R17i1008R18i1004gR19jR11:13:1ahgaoR3jR4:9:2oR3jR4:1:1r9R14oR15R16R17i1023R18i1009gR19r12gar69jR32:1:0hR14oR15R16R17i1026R18i1009gR19jR11:5:2i2r11goR3jR4:0:1jR27:3:1i1R14oR15R16R17i1028R18i1027gR19r39ghR14oR15R16R17i1029R18i1004gR19r81goR3jR4:1:1oR6r38R8y15:absoluteMatrixAR10jR11:5:2i3r11R13i-18gR14oR15R16R17i1049R18i1034gR19r111ghR14oR15R16R17i1050R18i1004gR19r39gR14oR15R16R17i1050R18i983gR19r39goR3jR4:5:3r7oR3jR4:9:2oR3jR4:1:1r64R14oR15R16R17i1073R18i1057gR19r65gar99hR14oR15R16R17i1075R18i1057gR19r39goR3jR4:8:2oR3jR4:2:1r74R14oR15R16R17i1103R18i1078gR19jR11:13:1aoR1aoR8R33R10jR11:5:2i3r11gr82hR35r39ghgaoR3jR4:8:2oR3jR4:2:1r88R14oR15R16R17i1082R18i1078gR19r92gaoR3jR4:9:2oR3jR4:1:1r9R14oR15R16R17i1097R18i1083gR19r12gar69r99hR14oR15R16R17i1100R18i1083gR19jR11:5:2i2r11goR3jR4:0:1jR27:3:1i1R14oR15R16R17i1102R18i1101gR19r39ghR14oR15R16R17i1103R18i1078gR19r134goR3jR4:1:1oR6r38R8y15:absoluteMatrixBR10jR11:5:2i3r11R13i-19gR14oR15R16R17i1123R18i1108gR19r158ghR14oR15R16R17i1124R18i1078gR19r39gR14oR15R16R17i1124R18i1057gR19r39goR3jR4:5:3r7oR3jR4:9:2oR3jR4:1:1r64R14oR15R16R17i1147R18i1131gR19r65gajR32:2:0jR32:3:0hR14oR15R16R17i1150R18i1131gR19jR11:5:2i2r11goR3jR4:9:2oR3jR4:1:1r9R14oR15R16R17i1167R18i1153gR19r12gar171r172hR14oR15R16R17i1170R18i1153gR19jR11:5:2i2r11gR14oR15R16R17i1170R18i1131gR19r175ghR14oR15R16R17i1177R18i976gR19jR11:0:0goR3jR4:5:3r7oR3jR4:1:1r64R14oR15R16R17i1204R18i1188gR19r65goR3jR4:1:1r9R14oR15R16R17i1221R18i1207gR19r12gR14oR15R16R17i1221R18i1188gR19r65gR14oR15R16R17i1221R18i959gR19r188goR3jR4:5:3r7oR3jR4:1:1oR6jR7:3:0R8y12:calculatedUVR10jR11:5:2i2r11R13i-15gR14oR15R16R17i1239R18i1227gR19r204goR3jR4:10:3oR3jR4:1:1oR6r38R8y8:hasUVPosR10r54R29ajR30:0:1nhR13i-22gR14oR15R16R17i1250R18i1242gR19r54goR3jR4:5:3jR5:0:0oR3jR4:5:3jR5:1:0oR3jR4:1:1r29R14oR15R16R17i1261R18i1253gR19r30goR3jR4:9:2oR3jR4:1:1oR6r38R8y5:uvPosR10jR11:5:2i4r11R13i-23gR14oR15R16R17i1269R18i1264gR19r224gar171r172hR14oR15R16R17i1272R18i1264gR19jR11:5:2i2r11gR14oR15R16R17i1272R18i1253gR19jR11:5:2i2r11goR3jR4:9:2oR3jR4:1:1r223R14oR15R16R17i1280R18i1275gR19r224gar69r99hR14oR15R16R17i1283R18i1275gR19jR11:5:2i2r11gR14oR15R16R17i1283R18i1253gR19jR11:5:2i2r11goR3jR4:1:1r29R14oR15R16R17i1294R18i1286gR19r30gR14oR15R16R17i1294R18i1242gR19r244gR14oR15R16R17i1294R18i1227gR19r204goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y10:pixelColorR10jR11:5:2i4r11R13i-13gR14oR15R16R17i1310R18i1300gR19r255goR3jR4:10:3oR3jR4:1:1r53R14oR15R16R17i1323R18i1313gR19r54goR3jR4:5:3r217oR3jR4:1:1oR6r38R8R25R10jR11:5:2i4r11R13i-17gR14oR15R16R17i1331R18i1326gR19r265goR3jR4:1:1r31R14oR15R16R17i1345R18i1334gR19r32gR14oR15R16R17i1345R18i1326gR19jR11:5:2i4r11goR3jR4:1:1r31R14oR15R16R17i1359R18i1348gR19r32gR14oR15R16R17i1359R18i1313gR19r273gR14oR15R16R17i1359R18i1300gR19r255goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y12:textureColorR10jR11:5:2i4r11R13i-14gR14oR15R16R17i1377R18i1365gR19r284goR3jR4:8:2oR3jR4:2:1jR20:33:0R14oR15R16R17i1387R18i1380gR19jR11:13:1aoR1aoR8R33R10jR11:10:0goR8R34R10jR11:5:2i2r11ghR35jR11:5:2i4r11ghgaoR3jR4:1:1oR6r38R8y7:textureR10r296R13i-10gR14oR15R16R17i1387R18i1380gR19r296goR3jR4:1:1r202R14oR15R16R17i1404R18i1392gR19r204ghR14oR15R16R17i1405R18i1380gR19r299gR14oR15R16R17i1405R18i1365gR19r284goR3jR4:5:3jR5:20:1r217oR3jR4:1:1r254R14oR15R16R17i1421R18i1411gR19r255goR3jR4:1:1r283R14oR15R16R17i1437R18i1425gR19r284gR14oR15R16R17i1437R18i1411gR19r255ghR14oR15R16R17i1443R18i899gR19r188gR6jy17:hxsl.FunctionKind:2:0y3:refoR6jR7:6:0R8y8:__init__R10jR11:13:1aoR1ahR35r188ghR13i-27gR35r188goR1ahR2oR3jR4:4:1aoR3jR4:7:2oR6r10R8y3:tmpR10jR11:5:2i3r11R13i-30goR3jR4:8:2oR3jR4:2:1r88R14oR15R16R17i1546R18i1542gR19r92gaoR3jR4:9:2oR3jR4:1:1r64R14oR15R16R17i1563R18i1547gR19r65gar69r99hR14oR15R16R17i1566R18i1547gR19jR11:5:2i2r11goR3jR4:0:1jR27:3:1i1R14oR15R16R17i1569R18i1568gR19r39ghR14oR15R16R17i1570R18i1542gR19r338gR14oR15R16R17i1571R18i1532gR19r188goR3jR4:5:3r7oR3jR4:9:2oR3jR4:1:1r64R14oR15R16R17i1592R18i1576gR19r65gar69hR14oR15R16R17i1594R18i1576gR19r39goR3jR4:8:2oR3jR4:2:1r74R14oR15R16R17i1600R18i1597gR19jR11:13:1aoR1aoR8R33R10r338gr82hR35r39ghgaoR3jR4:1:1r337R14oR15R16R17i1600R18i1597gR19r338goR3jR4:1:1oR6r38R8y13:filterMatrixAR10jR11:5:2i3r11R13i-20gR14oR15R16R17i1618R18i1605gR19r383ghR14oR15R16R17i1619R18i1597gR19r39gR14oR15R16R17i1619R18i1576gR19r39goR3jR4:5:3r7oR3jR4:9:2oR3jR4:1:1r64R14oR15R16R17i1641R18i1625gR19r65gar99hR14oR15R16R17i1643R18i1625gR19r39goR3jR4:8:2oR3jR4:2:1r74R14oR15R16R17i1649R18i1646gR19jR11:13:1aoR1aoR8R33R10r338gr82hR35r39ghgaoR3jR4:1:1r337R14oR15R16R17i1649R18i1646gR19r338goR3jR4:1:1oR6r38R8y13:filterMatrixBR10jR11:5:2i3r11R13i-21gR14oR15R16R17i1667R18i1654gR19r413ghR14oR15R16R17i1668R18i1646gR19r39gR14oR15R16R17i1668R18i1625gR19r39goR3jR4:5:3r7oR3jR4:9:2oR3jR4:1:1r64R14oR15R16R17i1719R18i1703gR19r65gar69r99hR14oR15R16R17i1722R18i1703gR19jR11:5:2i2r11goR3jR4:5:3r217oR3jR4:3:1oR3jR4:5:3r215oR3jR4:9:2oR3jR4:1:1r64R14oR15R16R17i1742R18i1726gR19r65gar69r99hR14oR15R16R17i1745R18i1726gR19jR11:5:2i2r11goR3jR4:9:2oR3jR4:1:1oR6r38R8y8:viewportR10jR11:5:2i4r11R13i-26gR14oR15R16R17i1756R18i1748gR19r443gar69r99hR14oR15R16R17i1759R18i1748gR19jR11:5:2i2r11gR14oR15R16R17i1759R18i1726gR19jR11:5:2i2r11gR14oR15R16R17i1760R18i1725gR19r452goR3jR4:9:2oR3jR4:1:1r442R14oR15R16R17i1771R18i1763gR19r443gar171r172hR14oR15R16R17i1774R18i1763gR19jR11:5:2i2r11gR14oR15R16R17i1774R18i1725gR19jR11:5:2i2r11gR14oR15R16R17i1774R18i1703gR19r428goR3jR4:10:3oR3jR4:1:1oR6r38R8y10:pixelAlignR10r54R29ajR30:0:1nhR13i-24gR14oR15R16R17i1880R18i1870gR19r54goR3jR4:5:3jR5:20:1jR5:3:0oR3jR4:9:2oR3jR4:1:1r64R14oR15R16R17i1899R18i1883gR19r65gar69r99hR14oR15R16R17i1902R18i1883gR19jR11:5:2i2r11goR3jR4:1:1oR6r38R8y16:halfPixelInverseR10jR11:5:2i2r11R13i-25gR14oR15R16R17i1922R18i1906gR19r488gR14oR15R16R17i1922R18i1883gR19r485gnR14oR15R16R17i1922R18i1866gR19r188goR3jR4:5:3r7oR3jR4:1:1oR6jR7:5:0R8R21R10jR11:5:2i4r11R22oR6r498R8y6:outputR10jR11:12:1ar497oR6r498R8R25R10jR11:5:2i4r11R22r500R13i-7ghR13i-5gR13i-6gR14oR15R16R17i1943R18i1928gR19r499goR3jR4:1:1r64R14oR15R16R17i1962R18i1946gR19r65gR14oR15R16R17i1962R18i1928gR19r499ghR14oR15R16R17i1968R18i1467gR19r188gR6jR44:0:0R45oR6r327R8y6:vertexR10jR11:13:1aoR1ahR35r188ghR13i-28gR35r188goR1ahR2oR3jR4:4:1aoR3jR4:5:3r7oR3jR4:1:1r502R14oR15R16R17i2012R18i2000gR19r503goR3jR4:1:1r254R14oR15R16R17i2025R18i2015gR19r255gR14oR15R16R17i2025R18i2000gR19r503ghR14oR15R16R17i2031R18i1994gR19r188gR6jR44:1:0R45oR6r327R8y8:fragmentR10jR11:13:1aoR1ahR35r188ghR13i-29gR35r188ghR8y17:h3d.shader.Base2dy4:varsar202r515r37r110r209r326r64r536r303r470r487r283r223r9r500r53r157r27r264oR6jR7:0:0R8y4:timeR10r39R13i-8gr382r254r412r442hg";
h3d_shader_BaseMesh.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey16:relativePositiony4:typejy9:hxsl.Type:5:2i3jy12:hxsl.VecType:1:0y2:idi-86gy1:poy4:filey65:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FBaseMesh.hxy3:maxi1241y3:mini1225gy1:tr12goR3jR4:1:1oR6jR7:1:0R8y8:positionR10jR11:5:2i3r11y6:parentoR6r17R8y5:inputR10jR11:12:1ar16oR6r17R8y6:normalR10jR11:5:2i3r11R21r19R13i-80ghR13i-78gR13i-79gR14oR15R16R17i1258R18i1244gR19r18gR14oR15R16R17i1258R18i1225gR19r12goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y19:transformedPositionR10jR11:5:2i3r11R13i-87gR14oR15R16R17i1283R18i1264gR19r31goR3jR4:5:3jR5:1:0oR3jR4:1:1r9R14oR15R16R17i1302R18i1286gR19r12goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:50:0R14oR15R16R17i1321R18i1305gR19jR11:13:1ahgaoR3jR4:1:1oR6jR7:0:0R8y9:modelViewR10jR11:7:0R21oR6r49R8y6:globalR10jR11:12:1aoR6r49R8y4:timeR10jR11:3:0R21r51R13i-74goR6r49R8y9:pixelSizeR10jR11:5:2i2r11R21r51R13i-75gr48oR6r49R8y16:modelViewInverseR10r50R21r51y10:qualifiersajy17:hxsl.VarQualifier:3:0hR13i-77ghR13i-73gR31ar59hR13i-76gR14oR15R16R17i1321R18i1305gR19r50ghR14oR15R16R17i1330R18i1305gR19jR11:8:0gR14oR15R16R17i1330R18i1286gR19jR11:5:2i3r11gR14oR15R16R17i1330R18i1264gR19r31goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y17:projectedPositionR10jR11:5:2i4r11R13i-90gR14oR15R16R17i1353R18i1336gR19r75goR3jR4:5:3r35oR3jR4:8:2oR3jR4:2:1jR25:40:0R14oR15R16R17i1360R18i1356gR19jR11:13:1ahgaoR3jR4:1:1r30R14oR15R16R17i1380R18i1361gR19r31goR3jR4:0:1jy10:hxsl.Const:3:1i1R14oR15R16R17i1383R18i1382gR19r54ghR14oR15R16R17i1384R18i1356gR19jR11:5:2i4r11goR3jR4:1:1oR6r49R8y8:viewProjR10r50R21oR6r49R8y6:cameraR10jR11:12:1aoR6r49R8y4:viewR10r50R21r99R13i-64goR6r49R8y4:projR10r50R21r99R13i-65goR6r49R8R20R10jR11:5:2i3r11R21r99R13i-66goR6r49R8y8:projDiagR10jR11:5:2i3r11R21r99R13i-67gr98oR6r49R8y15:inverseViewProjR10r50R21r99R13i-69goR6r49R8y5:zNearR10r54R21r99R13i-70goR6r49R8y4:zFarR10r54R21r99R13i-71goR6jR7:3:0R8y3:dirR10jR11:5:2i3r11R21r99R13i-72ghR13i-63gR13i-68gR14oR15R16R17i1402R18i1387gR19r50gR14oR15R16R17i1402R18i1356gR19jR11:5:2i4r11gR14oR15R16R17i1402R18i1336gR19r75goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y17:transformedNormalR10jR11:5:2i3r11R13i-89gR14oR15R16R17i1425R18i1408gR19r124goR3jR4:8:2oR3jR4:2:1jR25:31:0R14oR15R16R17i1468R18i1428gR19jR11:13:1aoR1aoR8y1:_R10r69ghy3:retr69ghgaoR3jR4:3:1oR3jR4:5:3r35oR3jR4:1:1r21R14oR15R16R17i1441R18i1429gR19r22goR3jR4:8:2oR3jR4:2:1jR25:48:0R14oR15R16R17i1460R18i1444gR19jR11:13:1ahgaoR3jR4:1:1r48R14oR15R16R17i1460R18i1444gR19r50ghR14oR15R16R17i1467R18i1444gR19jR11:6:0gR14oR15R16R17i1467R18i1429gR19r69gR14oR15R16R17i1468R18i1428gR19r69ghR14oR15R16R17i1480R18i1428gR19r69gR14oR15R16R17i1480R18i1408gR19r124goR3jR4:5:3r7oR3jR4:1:1r110R14oR15R16R17i1496R18i1486gR19r112goR3jR4:8:2oR3jR4:2:1r129R14oR15R16R17i1538R18i1499gR19jR11:13:1aoR1aoR8R45R10jR11:5:2i3r11ghR46r69ghgaoR3jR4:3:1oR3jR4:5:3jR5:3:0oR3jR4:1:1r103R14oR15R16R17i1515R18i1500gR19r104goR3jR4:1:1r30R14oR15R16R17i1537R18i1518gR19r31gR14oR15R16R17i1537R18i1500gR19r177gR14oR15R16R17i1538R18i1499gR19r177ghR14oR15R16R17i1550R18i1499gR19r69gR14oR15R16R17i1550R18i1486gR19r112goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y10:pixelColorR10jR11:5:2i4r11R13i-91gR14oR15R16R17i1566R18i1556gR19r200goR3jR4:1:1oR6jR7:2:0R8y5:colorR10jR11:5:2i4r11R13i-96gR14oR15R16R17i1574R18i1569gR19r206gR14oR15R16R17i1574R18i1556gR19r200goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y9:specPowerR10r54R13i-94gR14oR15R16R17i1589R18i1580gR19r54goR3jR4:1:1oR6r205R8y13:specularPowerR10r54R13i-97gR14oR15R16R17i1605R18i1592gR19r54gR14oR15R16R17i1605R18i1580gR19r54goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y9:specColorR10jR11:5:2i3r11R13i-95gR14oR15R16R17i1620R18i1611gR19r225goR3jR4:5:3r35oR3jR4:1:1oR6r205R8y13:specularColorR10jR11:5:2i3r11R13i-99gR14oR15R16R17i1636R18i1623gR19r231goR3jR4:1:1oR6r205R8y14:specularAmountR10r54R13i-98gR14oR15R16R17i1653R18i1639gR19r54gR14oR15R16R17i1653R18i1623gR19r231gR14oR15R16R17i1653R18i1611gR19r225goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y8:screenUVR10jR11:5:2i2r11R13i-93gR14oR15R16R17i1667R18i1659gR19r245goR3jR4:5:3jR5:0:0oR3jR4:5:3r35oR3jR4:3:1oR3jR4:5:3jR5:2:0oR3jR4:9:2oR3jR4:1:1r74R14oR15R16R17i1688R18i1671gR19r75gajy14:hxsl.Component:0:0jR55:1:0hR14oR15R16R17i1691R18i1671gR19jR11:5:2i2r11goR3jR4:9:2oR3jR4:1:1r74R14oR15R16R17i1711R18i1694gR19r75gajR55:3:0hR14oR15R16R17i1713R18i1694gR19r54gR14oR15R16R17i1713R18i1671gR19r263gR14oR15R16R17i1714R18i1670gR19r263goR3jR4:8:2oR3jR4:2:1jR25:38:0R14oR15R16R17i1721R18i1717gR19jR11:13:1ahgaoR3jR4:0:1jR34:3:1d0.5R14oR15R16R17i1725R18i1722gR19r54goR3jR4:0:1jR34:3:1d-0.5R14oR15R16R17i1731R18i1727gR19r54ghR14oR15R16R17i1732R18i1717gR19jR11:5:2i2r11gR14oR15R16R17i1732R18i1670gR19jR11:5:2i2r11goR3jR4:0:1jR34:3:1d0.5R14oR15R16R17i1738R18i1735gR19r54gR14oR15R16R17i1738R18i1670gR19r297gR14oR15R16R17i1738R18i1659gR19r245goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y5:depthR10r54R13i-92gR14oR15R16R17i1749R18i1744gR19r54goR3jR4:5:3r253oR3jR4:9:2oR3jR4:1:1r74R14oR15R16R17i1769R18i1752gR19r75gajR55:2:0hR14oR15R16R17i1771R18i1752gR19r54goR3jR4:9:2oR3jR4:1:1r74R14oR15R16R17i1791R18i1774gR19r75gar269hR14oR15R16R17i1793R18i1774gR19r54gR14oR15R16R17i1793R18i1752gR19r54gR14oR15R16R17i1793R18i1744gR19r54ghR14oR15R16R17i1799R18i1219gR19jR11:0:0gR6jy17:hxsl.FunctionKind:2:0y3:refoR6jR7:6:0R8y8:__init__R10jR11:13:1aoR1ahR46r333ghR13i-100gR46r333goR1ahR2oR3jR4:4:1aoR3jR4:5:3r7oR3jR4:1:1r123R14oR15R16R17i1856R18i1839gR19r124goR3jR4:8:2oR3jR4:2:1r129R14oR15R16R17i1876R18i1859gR19jR11:13:1aoR1aoR8R45R10r124ghR46r69ghgaoR3jR4:1:1r123R14oR15R16R17i1876R18i1859gR19r124ghR14oR15R16R17i1888R18i1859gR19r69gR14oR15R16R17i1888R18i1839gR19r124goR3jR4:5:3r7oR3jR4:1:1r244R14oR15R16R17i1997R18i1989gR19r245goR3jR4:5:3r249oR3jR4:5:3r35oR3jR4:3:1oR3jR4:5:3r253oR3jR4:9:2oR3jR4:1:1r74R14oR15R16R17i2018R18i2001gR19r75gar259r260hR14oR15R16R17i2021R18i2001gR19jR11:5:2i2r11goR3jR4:9:2oR3jR4:1:1r74R14oR15R16R17i2041R18i2024gR19r75gar269hR14oR15R16R17i2043R18i2024gR19r54gR14oR15R16R17i2043R18i2001gR19r381gR14oR15R16R17i2044R18i2000gR19r381goR3jR4:8:2oR3jR4:2:1r278R14oR15R16R17i2051R18i2047gR19r282gaoR3jR4:0:1jR34:3:1d0.5R14oR15R16R17i2055R18i2052gR19r54goR3jR4:0:1jR34:3:1d-0.5R14oR15R16R17i2061R18i2057gR19r54ghR14oR15R16R17i2062R18i2047gR19jR11:5:2i2r11gR14oR15R16R17i2062R18i2000gR19jR11:5:2i2r11goR3jR4:0:1jR34:3:1d0.5R14oR15R16R17i2068R18i2065gR19r54gR14oR15R16R17i2068R18i2000gR19r411gR14oR15R16R17i2068R18i1989gR19r245goR3jR4:5:3r7oR3jR4:1:1r308R14oR15R16R17i2079R18i2074gR19r54goR3jR4:5:3r253oR3jR4:9:2oR3jR4:1:1r74R14oR15R16R17i2099R18i2082gR19r75gar317hR14oR15R16R17i2101R18i2082gR19r54goR3jR4:9:2oR3jR4:1:1r74R14oR15R16R17i2121R18i2104gR19r75gar269hR14oR15R16R17i2123R18i2104gR19r54gR14oR15R16R17i2123R18i2082gR19r54gR14oR15R16R17i2123R18i2074gR19r54goR3jR4:5:3r7oR3jR4:1:1r213R14oR15R16R17i2216R18i2207gR19r54goR3jR4:1:1r217R14oR15R16R17i2232R18i2219gR19r54gR14oR15R16R17i2232R18i2207gR19r54goR3jR4:5:3r7oR3jR4:1:1r224R14oR15R16R17i2247R18i2238gR19r225goR3jR4:5:3r35oR3jR4:1:1r230R14oR15R16R17i2263R18i2250gR19r231goR3jR4:1:1r235R14oR15R16R17i2280R18i2266gR19r54gR14oR15R16R17i2280R18i2250gR19r231gR14oR15R16R17i2280R18i2238gR19r225ghR14oR15R16R17i2286R18i1833gR19r333gR6r334R58oR6r336R8y16:__init__fragmentR10jR11:13:1aoR1ahR46r333ghR13i-101gR46r333goR1ahR2oR3jR4:4:1aoR3jR4:5:3r7oR3jR4:1:1oR6jR7:5:0R8R20R10jR11:5:2i4r11R21oR6r481R8y6:outputR10jR11:12:1ar480oR6r481R8R48R10jR11:5:2i4r11R21r483R13i-83goR6r481R8R56R10jR11:5:2i4r11R21r483R13i-84goR6r481R8R23R10jR11:5:2i4r11R21r483R13i-85ghR13i-81gR13i-82gR14oR15R16R17i2331R18i2316gR19r482goR3jR4:1:1r74R14oR15R16R17i2351R18i2334gR19r75gR14oR15R16R17i2351R18i2316gR19r482goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y24:pixelTransformedPositionR10jR11:5:2i3r11R13i-88gR14oR15R16R17i2381R18i2357gR19r502goR3jR4:1:1r30R14oR15R16R17i2403R18i2384gR19r31gR14oR15R16R17i2403R18i2357gR19r502ghR14oR15R16R17i2409R18i2310gR19r333gR6jR57:0:0R58oR6r336R8y6:vertexR10jR11:13:1aoR1ahR46r333ghR13i-102gR46r333goR1ahR2oR3jR4:4:1aoR3jR4:5:3r7oR3jR4:1:1r485R14oR15R16R17i2453R18i2441gR19r486goR3jR4:1:1r199R14oR15R16R17i2466R18i2456gR19r200gR14oR15R16R17i2466R18i2441gR19r486goR3jR4:5:3r7oR3jR4:1:1r487R14oR15R16R17i2484R18i2472gR19r488goR3jR4:8:2oR3jR4:2:1jR25:52:0R14oR15R16R17i2491R18i2487gR19jR11:13:1aoR1aoR8y5:valueR10r54ghR46jR11:5:2i4r11ghgaoR3jR4:1:1r308R14oR15R16R17i2497R18i2492gR19r54ghR14oR15R16R17i2498R18i2487gR19r544gR14oR15R16R17i2498R18i2472gR19r488goR3jR4:5:3r7oR3jR4:1:1r489R14oR15R16R17i2517R18i2504gR19r490goR3jR4:8:2oR3jR4:2:1jR25:54:0R14oR15R16R17i2530R18i2520gR19jR11:13:1aoR1aoR8R64R10jR11:5:2i3r11ghR46jR11:5:2i4r11ghgaoR3jR4:1:1r123R14oR15R16R17i2548R18i2531gR19r124ghR14oR15R16R17i2549R18i2520gR19r568gR14oR15R16R17i2549R18i2504gR19r490ghR14oR15R16R17i2555R18i2435gR19r333gR6jR57:1:0R58oR6r336R8y8:fragmentR10jR11:13:1aoR1ahR46r333ghR13i-103gR46r333ghR8y19:h3d.shader.BaseMeshy4:varsar74r308r513r123r235r224r230r335r581r217r469r9r99r483r244r51r19r30r204r213r501r199hg";
h3d_shader_ScreenShader.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:5:0y4:namey8:positiony4:typejy9:hxsl.Type:5:2i4jy12:hxsl.VecType:1:0y6:parentoR6r10R8y6:outputR10jR11:12:1ar9oR6r10R8y5:colorR10jR11:5:2i4r11R13r13y2:idi-227ghR16i-225gR16i-226gy1:poy4:filey69:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FScreenShader.hxy3:maxi262y3:mini247gy1:tr12goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:40:0R17oR18R19R20i269R21i265gR22jR11:13:1ahgaoR3jR4:1:1oR6jR7:1:0R8R9R10jR11:5:2i2r11R13oR6r30R8y5:inputR10jR11:12:1ar29oR6r30R8y2:uvR10jR11:5:2i2r11R13r32R16i-224ghR16i-222gR16i-223gR17oR18R19R20i284R21i270gR22r31goR3jR4:0:1jy10:hxsl.Const:3:1zR17oR18R19R20i287R21i286gR22jR11:3:0goR3jR4:0:1jR26:3:1i1R17oR18R19R20i290R21i289gR22r43ghR17oR18R19R20i291R21i265gR22jR11:5:2i4r11gR17oR18R19R20i291R21i247gR22r12ghR17oR18R19R20i297R21i241gR22jR11:0:0gR6jy17:hxsl.FunctionKind:0:0y3:refoR6jR7:6:0R8y6:vertexR10jR11:13:1aoR1ahy3:retr55ghR16i-228gR30r55ghR8y23:h3d.shader.ScreenShadery4:varsar57r13r32hg";
h3d_shader_Blur.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:5:0y4:namey8:positiony4:typejy9:hxsl.Type:5:2i4jy12:hxsl.VecType:1:0y6:parentoR6r10R8y6:outputR10jR11:12:1ar9oR6r10R8y5:colorR10jR11:5:2i4r11R13r13y2:idi-242ghR16i-240gR16i-241gy1:poy4:filey69:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FScreenShader.hxy3:maxi262y3:mini247gy1:tr12goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:40:0R17oR18R19R20i269R21i265gR22jR11:13:1ahgaoR3jR4:1:1oR6jR7:1:0R8R9R10jR11:5:2i2r11R13oR6r30R8y5:inputR10jR11:12:1ar29oR6r30R8y2:uvR10jR11:5:2i2r11R13r32R16i-239ghR16i-237gR16i-238gR17oR18R19R20i284R21i270gR22r31goR3jR4:0:1jy10:hxsl.Const:3:1zR17oR18R19R20i287R21i286gR22jR11:3:0goR3jR4:0:1jR26:3:1i1R17oR18R19R20i290R21i289gR22r43ghR17oR18R19R20i291R21i265gR22jR11:5:2i4r11gR17oR18R19R20i291R21i247gR22r12ghR17oR18R19R20i297R21i241gR22jR11:0:0gR6jy17:hxsl.FunctionKind:0:0y3:refoR6jR7:6:0R8y6:vertexR10jR11:13:1aoR1ahy3:retr55ghR16i-256gR30r55goR1ahR2oR3jR4:4:1aoR3jR4:10:3oR3jR4:1:1oR6jR7:2:0R8y16:isDepthDependantR10jR11:2:0y10:qualifiersajy17:hxsl.VarQualifier:0:1nhR16i-253gR17oR18y61:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FBlur.hxR20i638R21i622gR22r71goR3jR4:4:1aoR3jR4:7:2oR6jR7:4:0R8y4:pcurR10jR11:5:2i3r11R16i-260goR3jR4:8:2oR3jR4:1:1oR6r58R8y11:getPositionR10jR11:13:1aoR1aoR8R25R10jR11:5:2i2r11ghR30r81ghR16i-259gR17oR18R34R20i670R21i659gR22r90gaoR3jR4:1:1r34R17oR18R34R20i679R21i671gR22r35ghR17oR18R34R20i680R21i659gR22r81gR17oR18R34R20i681R21i648gR22r55goR3jR4:7:2oR6r80R8y4:ccurR10jR11:5:2i4r11R16i-261goR3jR4:8:2oR3jR4:2:1jR23:33:0R17oR18R34R20i705R21i698gR22jR11:13:1aoR1aoR8y1:_R10jR11:10:0goR8y1:bR10jR11:5:2i2r11ghR30r103ghgaoR3jR4:1:1oR6r70R8y7:textureR10r113R16i-244gR17oR18R34R20i705R21i698gR22r113goR3jR4:1:1r34R17oR18R34R20i718R21i710gR22r35ghR17oR18R34R20i719R21i698gR22r103gR17oR18R34R20i720R21i687gR22r55goR3jR4:7:2oR6r80R8R15R10jR11:5:2i4r11R16i-262goR3jR4:8:2oR3jR4:2:1r22R17oR18R34R20i742R21i738gR22r26gaoR3jR4:0:1jR26:3:1zR17oR18R34R20i744R21i743gR22r43goR3jR4:0:1jR26:3:1zR17oR18R34R20i747R21i746gR22r43goR3jR4:0:1jR26:3:1zR17oR18R34R20i750R21i749gR22r43goR3jR4:0:1jR26:3:1zR17oR18R34R20i753R21i752gR22r43ghR17oR18R34R20i754R21i738gR22r131gR17oR18R34R20i755R21i726gR22r55goR3jR4:7:2oR6r80R8y4:ncurR10jR11:5:2i3r11R16i-263goR3jR4:8:2oR3jR4:2:1jR23:55:0R17oR18R34R20i784R21i772gR22jR11:13:1aoR1aoR8y5:valueR10jR11:5:2i4r11ghR30r159ghgaoR3jR4:8:2oR3jR4:2:1r106R17oR18R34R20i798R21i785gR22jR11:13:1aoR1aoR8R38R10r113gr114hR30r103ghgaoR3jR4:1:1oR6r70R8y13:normalTextureR10r113R16i-255gR17oR18R34R20i798R21i785gR22r113goR3jR4:1:1r34R17oR18R34R20i811R21i803gR22r35ghR17oR18R34R20i812R21i785gR22r103ghR17oR18R34R20i813R21i772gR22r159gR17oR18R34R20i814R21i761gR22r55goR3jR4:13:3oR6r80R8y1:iR10jR11:1:0R16i-264goR3jR4:5:3jR5:21:0oR3jR4:5:3jR5:0:0oR3jR4:6:2jy15:haxe.macro.Unop:3:0oR3jR4:1:1oR6r70R8y7:QualityR10r197R32ajR33:0:1nhR16i-246gR17oR18R34R20i838R21i831gR22r197gR17oR18R34R20i838R21i830gR22r197goR3jR4:0:1jR26:2:1i1R17oR18R34R20i845R21i841gR22r197gR17oR18R34R20i845R21i830gR22r197goR3jR4:1:1r205R17oR18R34R20i852R21i845gR22r197gR17oR18R34R20i852R21i830gR22jR11:14:2r197jy13:hxsl.SizeDecl:0:1zgoR3jR4:4:1aoR3jR4:7:2oR6r80R8R25R10jR11:5:2i2r11R16i-265goR3jR4:5:3r201oR3jR4:1:1r34R17oR18R34R20i880R21i872gR22r35goR3jR4:5:3jR5:1:0oR3jR4:1:1oR6r70R8y5:pixelR10jR11:5:2i2r11R16i-249gR17oR18R34R20i888R21i883gR22r238goR3jR4:8:2oR3jR4:2:1jR23:36:0R17oR18R34R20i896R21i891gR22jR11:13:1aoR1aoR8R42R10r197ghR30r43ghgaoR3jR4:1:1r196R17oR18R34R20i898R21i897gR22r197ghR17oR18R34R20i899R21i891gR22r43gR17oR18R34R20i899R21i883gR22r238gR17oR18R34R20i899R21i872gR22r229gR17oR18R34R20i900R21i863gR22r55goR3jR4:7:2oR6r80R8y1:cR10r103R16i-266goR3jR4:8:2oR3jR4:2:1r106R17oR18R34R20i922R21i915gR22jR11:13:1aoR1aoR8R38R10r113gr114hR30r103ghgaoR3jR4:1:1r119R17oR18R34R20i922R21i915gR22r113goR3jR4:1:1r228R17oR18R34R20i929R21i927gR22r229ghR17oR18R34R20i930R21i915gR22r103gR17oR18R34R20i931R21i907gR22r55goR3jR4:7:2oR6r80R8R17R10r81R16i-267goR3jR4:8:2oR3jR4:1:1r84R17oR18R34R20i957R21i946gR22r90gaoR3jR4:1:1r228R17oR18R34R20i960R21i958gR22r229ghR17oR18R34R20i961R21i946gR22r81gR17oR18R34R20i962R21i938gR22r55goR3jR4:7:2oR6r80R8y1:dR10r43R16i-268goR3jR4:8:2oR3jR4:2:1jR23:29:0R17oR18R34R20i987R21i977gR22jR11:13:1aoR1aoR8R38R10jR11:5:2i3r11goR8R39R10jR11:5:2i3r11ghR30r43ghgaoR3jR4:3:1oR3jR4:5:3jR5:3:0oR3jR4:1:1r286R17oR18R34R20i979R21i978gR22r81goR3jR4:1:1r79R17oR18R34R20i986R21i982gR22r81gR17oR18R34R20i986R21i978gR22r310gR17oR18R34R20i987R21i977gR22r310goR3jR4:5:3r317oR3jR4:1:1r286R17oR18R34R20i993R21i992gR22r81goR3jR4:1:1r79R17oR18R34R20i1000R21i996gR22r81gR17oR18R34R20i1000R21i992gR22jR11:5:2i3r11ghR17oR18R34R20i1001R21i977gR22r43gR17oR18R34R20i1002R21i969gR22r55goR3jR4:7:2oR6r80R8y1:nR10r159R16i-269goR3jR4:8:2oR3jR4:2:1r162R17oR18R34R20i1029R21i1017gR22r170gaoR3jR4:8:2oR3jR4:2:1r106R17oR18R34R20i1043R21i1030gR22jR11:13:1aoR1aoR8R38R10r113gr114hR30r103ghgaoR3jR4:1:1r183R17oR18R34R20i1043R21i1030gR22r113goR3jR4:1:1r228R17oR18R34R20i1050R21i1048gR22r229ghR17oR18R34R20i1051R21i1030gR22r103ghR17oR18R34R20i1052R21i1017gR22r159gR17oR18R34R20i1053R21i1009gR22r55goR3jR4:5:3r7oR3jR4:1:1r264R17oR18R34R20i1063R21i1062gR22r103goR3jR4:8:2oR3jR4:2:1jR23:24:0R17oR18R34R20i1069R21i1066gR22jR11:13:1aoR1aoR8y1:xR10r103goR8y1:yR10r103goR8y1:aR10r43ghR30r103ghgaoR3jR4:1:1r102R17oR18R34R20i1074R21i1070gR22r103goR3jR4:1:1r264R17oR18R34R20i1077R21i1076gR22r103goR3jR4:8:2oR3jR4:2:1r303R17oR18R34R20i1083R21i1079gR22jR11:13:1aoR1aoR8R38R10r159gr311hR30r43ghgaoR3jR4:1:1r158R17oR18R34R20i1083R21i1079gR22r159goR3jR4:1:1r343R17oR18R34R20i1089R21i1088gR22r159ghR17oR18R34R20i1090R21i1079gR22r43ghR17oR18R34R20i1091R21i1066gR22r103gR17oR18R34R20i1091R21i1062gR22r103goR3jR4:5:3r7oR3jR4:1:1r264R17oR18R34R20i1100R21i1099gR22r103goR3jR4:8:2oR3jR4:2:1r377R17oR18R34R20i1106R21i1103gR22jR11:13:1ar381hgaoR3jR4:1:1r264R17oR18R34R20i1108R21i1107gR22r103goR3jR4:1:1r102R17oR18R34R20i1114R21i1110gR22r103goR3jR4:8:2oR3jR4:2:1jR23:21:0R17oR18R34R20i1146R21i1116gR22jR11:13:1aoR1aoR8R38R10r43goR8R39R10r43ghR30r43ghgaoR3jR4:3:1oR3jR4:5:3r235oR3jR4:8:2oR3jR4:2:1jR23:22:0R17oR18R34R20i1128R21i1117gR22jR11:13:1aoR1aoR8R38R10r43gr442hR30r43ghgaoR3jR4:3:1oR3jR4:5:3r317oR3jR4:1:1r300R17oR18R34R20i1119R21i1118gR22r43goR3jR4:0:1jR26:3:1d0.001R17oR18R34R20i1127R21i1122gR22r43gR17oR18R34R20i1127R21i1118gR22r43gR17oR18R34R20i1128R21i1117gR22r43goR3jR4:0:1jR26:3:1d0R17oR18R34R20i1135R21i1133gR22r43ghR17oR18R34R20i1136R21i1117gR22r43goR3jR4:0:1jR26:3:1i100000R17oR18R34R20i1145R21i1139gR22r43gR17oR18R34R20i1145R21i1117gR22r43gR17oR18R34R20i1146R21i1116gR22r43goR3jR4:0:1jR26:3:1d1R17oR18R34R20i1153R21i1151gR22r43ghR17oR18R34R20i1154R21i1116gR22r43ghR17oR18R34R20i1155R21i1103gR22r103gR17oR18R34R20i1155R21i1099gR22r103goR3jR4:5:3jR5:20:1r201oR3jR4:1:1r130R17oR18R34R20i1168R21i1163gR22r131goR3jR4:5:3r235oR3jR4:1:1r264R17oR18R34R20i1173R21i1172gR22r103goR3jR4:16:2oR3jR4:1:1oR6r70R8y6:valuesR10jR11:14:2r43jR47:1:1r205R16i-248gR17oR18R34R20i1182R21i1176gR22r508goR3jR4:10:3oR3jR4:5:3jR5:9:0oR3jR4:1:1r196R17oR18R34R20i1184R21i1183gR22r197goR3jR4:0:1jR26:2:1zR17oR18R34R20i1188R21i1187gR22r197gR17oR18R34R20i1188R21i1183gR22r71goR3jR4:6:2r203oR3jR4:1:1r196R17oR18R34R20i1193R21i1192gR22r197gR17oR18R34R20i1193R21i1191gR22r197goR3jR4:1:1r196R17oR18R34R20i1197R21i1196gR22r197gR17oR18R34R20i1197R21i1183gR22r197gR17oR18R34R20i1198R21i1176gR22r43gR17oR18R34R20i1198R21i1172gR22r103gR17oR18R34R20i1198R21i1163gR22r131ghR17oR18R34R20i1206R21i855gR22r55gR17oR18R34R20i1206R21i820gR22r55goR3jR4:5:3r7oR3jR4:1:1r15R17oR18R34R20i1224R21i1212gR22r16goR3jR4:1:1r130R17oR18R34R20i1232R21i1227gR22r131gR17oR18R34R20i1232R21i1212gR22r16ghR17oR18R34R20i1239R21i641gR22r55goR3jR4:10:3oR3jR4:1:1oR6r70R8y7:isDepthR10r71R32ajR33:0:1nhR16i-247gR17oR18R34R20i1260R21i1253gR22r71goR3jR4:4:1aoR3jR4:7:2oR6r80R8y3:valR10r43R16i-270goR3jR4:0:1jR26:3:1d0R17oR18R34R20i1282R21i1280gR22r43gR17oR18R34R20i1283R21i1270gR22r55goR3jR4:13:3oR6r80R8R44R10r197R16i-271goR3jR4:5:3r199oR3jR4:5:3r201oR3jR4:6:2r203oR3jR4:1:1r205R17oR18R34R20i1307R21i1300gR22r197gR17oR18R34R20i1307R21i1299gR22r197goR3jR4:0:1jR26:2:1i1R17oR18R34R20i1314R21i1310gR22r197gR17oR18R34R20i1314R21i1299gR22r197goR3jR4:1:1r205R17oR18R34R20i1321R21i1314gR22r197gR17oR18R34R20i1321R21i1299gR22jR11:14:2r197jR47:0:1zgoR3jR4:5:3jR5:20:1r201oR3jR4:1:1r565R17oR18R34R20i1333R21i1330gR22r43goR3jR4:5:3r235oR3jR4:8:2oR3jR4:2:1jR23:53:0R17oR18R34R20i1343R21i1337gR22jR11:13:1aoR1aoR8R42R10jR11:5:2i4r11ghR30r43ghgaoR3jR4:8:2oR3jR4:2:1r106R17oR18R34R20i1351R21i1344gR22jR11:13:1aoR1aoR8R38R10r113gr114hR30r103ghgaoR3jR4:1:1r119R17oR18R34R20i1351R21i1344gR22r113goR3jR4:5:3r201oR3jR4:1:1r34R17oR18R34R20i1364R21i1356gR22r35goR3jR4:5:3r235oR3jR4:1:1r237R17oR18R34R20i1372R21i1367gR22r238goR3jR4:8:2oR3jR4:2:1r243R17oR18R34R20i1380R21i1375gR22jR11:13:1ar247hgaoR3jR4:1:1r573R17oR18R34R20i1382R21i1381gR22r197ghR17oR18R34R20i1383R21i1375gR22r43gR17oR18R34R20i1383R21i1367gR22r238gR17oR18R34R20i1383R21i1356gR22jR11:5:2i2r11ghR17oR18R34R20i1384R21i1344gR22r103ghR17oR18R34R20i1385R21i1337gR22r43goR3jR4:16:2oR3jR4:1:1r506R17oR18R34R20i1394R21i1388gR22r508goR3jR4:10:3oR3jR4:5:3r513oR3jR4:1:1r573R17oR18R34R20i1396R21i1395gR22r197goR3jR4:0:1jR26:2:1zR17oR18R34R20i1400R21i1399gR22r197gR17oR18R34R20i1400R21i1395gR22r71goR3jR4:6:2r203oR3jR4:1:1r573R17oR18R34R20i1405R21i1404gR22r197gR17oR18R34R20i1405R21i1403gR22r197goR3jR4:1:1r573R17oR18R34R20i1409R21i1408gR22r197gR17oR18R34R20i1409R21i1395gR22r197gR17oR18R34R20i1410R21i1388gR22r43gR17oR18R34R20i1410R21i1337gR22r43gR17oR18R34R20i1410R21i1330gR22r43gR17oR18R34R20i1410R21i1289gR22r55goR3jR4:5:3r7oR3jR4:1:1r15R17oR18R34R20i1429R21i1417gR22r16goR3jR4:8:2oR3jR4:2:1jR23:52:0R17oR18R34R20i1436R21i1432gR22jR11:13:1aoR1aoR8R42R10r43ghR30jR11:5:2i4r11ghgaoR3jR4:8:2oR3jR4:2:1r435R17oR18R34R20i1440R21i1437gR22jR11:13:1aoR1aoR8R38R10r43gr442hR30r43ghgaoR3jR4:1:1r565R17oR18R34R20i1440R21i1437gR22r43goR3jR4:0:1jR26:3:1d0.9999999R17oR18R34R20i1454R21i1445gR22r43ghR17oR18R34R20i1455R21i1437gR22r43ghR17oR18R34R20i1456R21i1432gR22r702gR17oR18R34R20i1456R21i1417gR22r16ghR17oR18R34R20i1463R21i1263gR22r55goR3jR4:4:1aoR3jR4:7:2oR6r80R8R15R10jR11:5:2i4r11R16i-272goR3jR4:8:2oR3jR4:2:1r22R17oR18R34R20i1492R21i1488gR22r26gaoR3jR4:0:1jR26:3:1zR17oR18R34R20i1494R21i1493gR22r43goR3jR4:0:1jR26:3:1zR17oR18R34R20i1497R21i1496gR22r43goR3jR4:0:1jR26:3:1zR17oR18R34R20i1500R21i1499gR22r43goR3jR4:0:1jR26:3:1zR17oR18R34R20i1503R21i1502gR22r43ghR17oR18R34R20i1504R21i1488gR22r734gR17oR18R34R20i1505R21i1476gR22r55goR3jR4:13:3oR6r80R8R44R10r197R16i-273goR3jR4:5:3r199oR3jR4:5:3r201oR3jR4:6:2r203oR3jR4:1:1r205R17oR18R34R20i1529R21i1522gR22r197gR17oR18R34R20i1529R21i1521gR22r197goR3jR4:0:1jR26:2:1i1R17oR18R34R20i1536R21i1532gR22r197gR17oR18R34R20i1536R21i1521gR22r197goR3jR4:1:1r205R17oR18R34R20i1543R21i1536gR22r197gR17oR18R34R20i1543R21i1521gR22jR11:14:2r197jR47:0:1zgoR3jR4:5:3jR5:20:1r201oR3jR4:1:1r733R17oR18R34R20i1557R21i1552gR22r734goR3jR4:5:3r235oR3jR4:8:2oR3jR4:2:1r106R17oR18R34R20i1568R21i1561gR22jR11:13:1aoR1aoR8R38R10r113gr114hR30r103ghgaoR3jR4:1:1r119R17oR18R34R20i1568R21i1561gR22r113goR3jR4:5:3r201oR3jR4:1:1r34R17oR18R34R20i1581R21i1573gR22r35goR3jR4:5:3r235oR3jR4:1:1r237R17oR18R34R20i1589R21i1584gR22r238goR3jR4:8:2oR3jR4:2:1r243R17oR18R34R20i1597R21i1592gR22jR11:13:1ar247hgaoR3jR4:1:1r761R17oR18R34R20i1599R21i1598gR22r197ghR17oR18R34R20i1600R21i1592gR22r43gR17oR18R34R20i1600R21i1584gR22r238gR17oR18R34R20i1600R21i1573gR22jR11:5:2i2r11ghR17oR18R34R20i1601R21i1561gR22r103goR3jR4:16:2oR3jR4:1:1r506R17oR18R34R20i1610R21i1604gR22r508goR3jR4:10:3oR3jR4:5:3r513oR3jR4:1:1r761R17oR18R34R20i1612R21i1611gR22r197goR3jR4:0:1jR26:2:1zR17oR18R34R20i1616R21i1615gR22r197gR17oR18R34R20i1616R21i1611gR22r71goR3jR4:6:2r203oR3jR4:1:1r761R17oR18R34R20i1621R21i1620gR22r197gR17oR18R34R20i1621R21i1619gR22r197goR3jR4:1:1r761R17oR18R34R20i1625R21i1624gR22r197gR17oR18R34R20i1625R21i1611gR22r197gR17oR18R34R20i1626R21i1604gR22r43gR17oR18R34R20i1626R21i1561gR22r103gR17oR18R34R20i1626R21i1552gR22r734gR17oR18R34R20i1626R21i1511gR22r55goR3jR4:5:3r7oR3jR4:1:1r15R17oR18R34R20i1645R21i1633gR22r16goR3jR4:1:1r733R17oR18R34R20i1653R21i1648gR22r734gR17oR18R34R20i1653R21i1633gR22r16ghR17oR18R34R20i1660R21i1469gR22r55gR17oR18R34R20i1660R21i1249gR22r55gR17oR18R34R20i1660R21i618gR22r55goR3jR4:10:3oR3jR4:1:1oR6r70R8y13:hasFixedColorR10r71R32ajR33:0:1nhR16i-250gR17oR18R34R20i1682R21i1669gR22r71goR3jR4:4:1aoR3jR4:5:3r7oR3jR4:9:2oR3jR4:1:1r15R17oR18R34R20i1704R21i1692gR22r16gajy14:hxsl.Component:0:0jR59:1:0jR59:2:0hR17oR18R34R20i1708R21i1692gR22jR11:5:2i3r11goR3jR4:9:2oR3jR4:1:1oR6r70R8y10:fixedColorR10jR11:5:2i4r11R16i-252gR17oR18R34R20i1721R21i1711gR22r902gar893r894r895hR17oR18R34R20i1725R21i1711gR22jR11:5:2i3r11gR17oR18R34R20i1725R21i1692gR22r898goR3jR4:10:3oR3jR4:1:1oR6r70R8y16:smoothFixedColorR10r71R32ajR33:0:1nhR16i-251gR17oR18R34R20i1752R21i1736gR22r71goR3jR4:5:3jR5:20:1r235oR3jR4:9:2oR3jR4:1:1r15R17oR18R34R20i1773R21i1761gR22r16gajR59:3:0hR17oR18R34R20i1775R21i1761gR22r43goR3jR4:9:2oR3jR4:1:1r901R17oR18R34R20i1789R21i1779gR22r902gar925hR17oR18R34R20i1791R21i1779gR22r43gR17oR18R34R20i1791R21i1761gR22r43goR3jR4:5:3r7oR3jR4:9:2oR3jR4:1:1r15R17oR18R34R20i1821R21i1809gR22r16gar925hR17oR18R34R20i1823R21i1809gR22r43goR3jR4:5:3r235oR3jR4:9:2oR3jR4:1:1r901R17oR18R34R20i1836R21i1826gR22r902gar925hR17oR18R34R20i1838R21i1826gR22r43goR3jR4:8:2oR3jR4:2:1r243R17oR18R34R20i1846R21i1841gR22jR11:13:1aoR1aoR8R42R10r71ghR30r43ghgaoR3jR4:5:3jR5:7:0oR3jR4:9:2oR3jR4:1:1r15R17oR18R34R20i1859R21i1847gR22r16gar925hR17oR18R34R20i1861R21i1847gR22r43goR3jR4:0:1jR26:3:1zR17oR18R34R20i1865R21i1864gR22r43gR17oR18R34R20i1865R21i1847gR22r71ghR17oR18R34R20i1866R21i1841gR22r43gR17oR18R34R20i1866R21i1826gR22r43gR17oR18R34R20i1866R21i1809gR22r43gR17oR18R34R20i1866R21i1732gR22r55ghR17oR18R34R20i1873R21i1685gR22r55gnR17oR18R34R20i1873R21i1665gR22r55ghR17oR18R34R20i1878R21i612gR22r55gR6jR27:1:0R28oR6r58R8y8:fragmentR10jR11:13:1aoR1ahR30r55ghR16i-257gR30r55goR1aoR6r80R8R25R10r89R16i-258ghR2oR3jR4:4:1aoR3jR4:7:2oR6r80R8y5:depthR10r43R16i-274goR3jR4:8:2oR3jR4:2:1r603R17oR18R34R20i1949R21i1943gR22r611gaoR3jR4:8:2oR3jR4:2:1r106R17oR18R34R20i1962R21i1950gR22jR11:13:1aoR1aoR8R38R10r113gr114hR30r103ghgaoR3jR4:1:1oR6r70R8y12:depthTextureR10r113R16i-245gR17oR18R34R20i1962R21i1950gR22r113goR3jR4:1:1r1000R17oR18R34R20i1969R21i1967gR22r89ghR17oR18R34R20i1970R21i1950gR22r103ghR17oR18R34R20i1971R21i1943gR22r43gR17oR18R34R20i1972R21i1931gR22r55goR3jR4:7:2oR6r80R8y3:uv2R10jR11:5:2i2r11R16i-275goR3jR4:5:3r235oR3jR4:3:1oR3jR4:5:3r317oR3jR4:1:1r1000R17oR18R34R20i1990R21i1988gR22r89goR3jR4:0:1jR26:3:1d0.5R17oR18R34R20i1996R21i1993gR22r43gR17oR18R34R20i1996R21i1988gR22r89gR17oR18R34R20i1997R21i1987gR22r89goR3jR4:8:2oR3jR4:2:1jR23:38:0R17oR18R34R20i2004R21i2000gR22jR11:13:1ahgaoR3jR4:0:1jR26:3:1i2R17oR18R34R20i2006R21i2005gR22r43goR3jR4:0:1jR26:3:1i-2R17oR18R34R20i2010R21i2008gR22r43ghR17oR18R34R20i2011R21i2000gR22jR11:5:2i2r11gR17oR18R34R20i2011R21i1987gR22r1035gR17oR18R34R20i2012R21i1977gR22r55goR3jR4:7:2oR6r80R8y4:tempR10r103R16i-276goR3jR4:5:3r235oR3jR4:8:2oR3jR4:2:1r22R17oR18R34R20i2032R21i2028gR22r26gaoR3jR4:1:1r1034R17oR18R34R20i2036R21i2033gR22r1035goR3jR4:1:1r1004R17oR18R34R20i2043R21i2038gR22r43goR3jR4:0:1jR26:3:1i1R17oR18R34R20i2046R21i2045gR22r43ghR17oR18R34R20i2047R21i2028gR22jR11:5:2i4r11goR3jR4:1:1oR6r70R8y21:cameraInverseViewProjR10jR11:7:0R16i-243gR17oR18R34R20i2071R21i2050gR22r1096gR17oR18R34R20i2071R21i2028gR22r103gR17oR18R34R20i2072R21i2017gR22r55goR3jR4:7:2oR6r80R8y8:originWSR10jR11:5:2i3r11R16i-277goR3jR4:5:3jR5:2:0oR3jR4:9:2oR3jR4:1:1r1074R17oR18R34R20i2096R21i2092gR22r103gar893r894r895hR17oR18R34R20i2100R21i2092gR22r1105goR3jR4:9:2oR3jR4:1:1r1074R17oR18R34R20i2107R21i2103gR22r103gar925hR17oR18R34R20i2109R21i2103gR22r43gR17oR18R34R20i2109R21i2092gR22r1105gR17oR18R34R20i2110R21i2077gR22r55goR3jR4:12:1oR3jR4:1:1r1104R17oR18R34R20i2130R21i2122gR22r1105gR17oR18R34R20i2130R21i2115gR22r55ghR17oR18R34R20i2136R21i1925gR22r55gR6jR27:3:0R28r84R30r81ghR8y15:h3d.shader.Blury4:varsar57r205r237r880r901r506r993r84r119r557r183r69r13r32oR6r70R8y9:hasNormalR10r71R32ajR33:0:1nhR16i-254gr1095r1021r913hg";
h3d_shader_ColorAdd.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:20:1jR5:0:0oR3jR4:9:2oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey10:pixelColory4:typejy9:hxsl.Type:5:2i4jy12:hxsl.VecType:1:0y2:idi-278gy1:poy4:filey65:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FColorAdd.hxy3:maxi180y3:mini170gy1:tr14gajy14:hxsl.Component:0:0jR20:1:0jR20:2:0hR14oR15R16R17i184R18i170gR19jR11:5:2i3r13goR3jR4:1:1oR6jR7:2:0R8y5:colorR10jR11:5:2i3r13R13i-279gR14oR15R16R17i193R18i188gR19r27gR14oR15R16R17i193R18i170gR19r23ghR14oR15R16R17i199R18i164gR19jR11:0:0gR6jy17:hxsl.FunctionKind:1:0y3:refoR6jR7:6:0R8y8:fragmentR10jR11:13:1aoR1ahy3:retr34ghR13i-280gR25r34ghR8y19:h3d.shader.ColorAddy4:varsar36r25r11hg";
h3d_shader_ColorKey.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:7:2oy4:kindjy12:hxsl.VarKind:4:0y4:namey5:cdiffy4:typejy9:hxsl.Type:5:2i4jy12:hxsl.VecType:1:0y2:idi-284goR3jR4:5:3jy16:haxe.macro.Binop:3:0oR3jR4:1:1oR5r8R7y12:textureColorR9jR10:5:2i4r9R12i-282gy1:poy4:filey65:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FColorKey.hxy3:maxi197y3:mini185gy1:tr15goR3jR4:1:1oR5jR6:2:0R7y8:colorKeyR9jR10:5:2i4r9R12i-281gR15oR16R17R18i208R19i200gR20r21gR15oR16R17R18i208R19i185gR20r10gR15oR16R17R18i209R19i173gR20jR10:0:0goR3jR4:10:3oR3jR4:5:3jR13:9:0oR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:29:0R15oR16R17R18i223R19i218gR20jR10:13:1aoR1aoR7y1:_R9r10goR7y1:bR9jR10:5:2i4r9ghy3:retjR10:3:0ghgaoR3jR4:1:1r7R15oR16R17R18i223R19i218gR20r10goR3jR4:1:1r7R15oR16R17R18i233R19i228gR20r10ghR15oR16R17R18i234R19i218gR20r43goR3jR4:0:1jy10:hxsl.Const:3:1d1e-05R15oR16R17R18i244R19i237gR20r43gR15oR16R17R18i244R19i218gR20jR10:2:0goR3jR4:11:0R15oR16R17R18i254R19i247gR20r28gnR15oR16R17R18i254R19i214gR20r28ghR15oR16R17R18i260R19i167gR20r28gR5jy17:hxsl.FunctionKind:1:0y3:refoR5jR6:6:0R7y8:fragmentR9jR10:13:1aoR1ahR25r28ghR12i-283gR25r28ghR7y19:h3d.shader.ColorKeyy4:varsar69r19r14hg";
h3d_shader_ColorMatrix.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:7:2oy4:kindjy12:hxsl.VarKind:4:0y4:namey3:rgby4:typejy9:hxsl.Type:5:2i3jy12:hxsl.VecType:1:0y2:idi-288goR3jR4:5:3jy16:haxe.macro.Binop:1:0oR3jR4:9:2oR3jR4:1:1oR5r8R7y10:pixelColorR9jR10:5:2i4r9R12i-285gy1:poy4:filey68:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FColorMatrix.hxy3:maxi194y3:mini184gy1:tr16gajy14:hxsl.Component:0:0jR21:1:0jR21:2:0hR15oR16R17R18i198R19i184gR20jR10:5:2i3r9goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:50:0R15oR16R17R18i207R19i201gR20jR10:13:1ahgaoR3jR4:1:1oR5jR6:2:0R7y6:matrixR9jR10:7:0R12i-286gR15oR16R17R18i207R19i201gR20r37ghR15oR16R17R18i216R19i201gR20jR10:8:0gR15oR16R17R18i216R19i184gR20r10gR15oR16R17R18i217R19i174gR20jR10:0:0goR3jR4:5:3jR13:4:0oR3jR4:9:2oR3jR4:1:1r15R15oR16R17R18i232R19i222gR20r16gajR21:3:0hR15oR16R17R18i234R19i222gR20jR10:3:0goR3jR4:9:2oR3jR4:3:1oR3jR4:5:3r12oR3jR4:1:1r15R15oR16R17R18i248R19i238gR20r16goR3jR4:1:1r35R15oR16R17R18i257R19i251gR20r37gR15oR16R17R18i257R19i238gR20jR10:5:2i4r9gR15oR16R17R18i258R19i237gR20r70gar55hR15oR16R17R18i260R19i237gR20r58gR15oR16R17R18i260R19i222gR20r58goR3jR4:5:3r49oR3jR4:9:2oR3jR4:1:1r15R15oR16R17R18i276R19i266gR20r16gar20r21r22hR15oR16R17R18i280R19i266gR20jR10:5:2i3r9goR3jR4:1:1r7R15oR16R17R18i286R19i283gR20r10gR15oR16R17R18i286R19i266gR20r86ghR15oR16R17R18i292R19i168gR20r47gR5jy17:hxsl.FunctionKind:1:0y3:refoR5jR6:6:0R7y8:fragmentR9jR10:13:1aoR1ahy3:retr47ghR12i-287gR27r47ghR7y22:h3d.shader.ColorMatrixy4:varsar95r35r15hg";
h3d_shader_DirLight.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:7:2oy4:kindjy12:hxsl.VarKind:4:0y4:namey4:diffy4:typejy9:hxsl.Type:3:0y2:idi-45goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:22:0y1:poy4:filey65:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FDirLight.hxy3:maxi501y3:mini468gy1:tjR10:13:1aoR1aoR7y1:_R9r9goR7y1:bR9r9ghy3:retr9ghgaoR3jR4:8:2oR3jR4:2:1jR12:29:0R13oR14R15R16i485R17i468gR18jR10:13:1aoR1aoR7R19R9jR10:5:2i3jy12:hxsl.VecType:1:0goR7R20R9jR10:5:2i3r31ghR21r9ghgaoR3jR4:1:1oR5r8R7y17:transformedNormalR9r32R11i-38gR13oR14R15R16i485R17i468gR18r32goR3jR4:6:2jy15:haxe.macro.Unop:3:0oR3jR4:1:1oR5jR6:2:0R7y9:directionR9jR10:5:2i3r31R11i-32gR13oR14R15R16i500R17i491gR18r46gR13oR14R15R16i500R17i490gR18r46ghR13oR14R15R16i501R17i468gR18r9goR3jR4:0:1jy10:hxsl.Const:3:1d0R13oR14R15R16i508R17i506gR18r9ghR13oR14R15R16i509R17i468gR18r9gR13oR14R15R16i510R17i457gR18jR10:0:0goR3jR4:10:3oR3jR4:6:2jR24:2:0oR3jR4:1:1oR5r45R7y14:enableSpecularR9jR10:2:0y10:qualifiersajy17:hxsl.VarQualifier:0:1nhR11i-33gR13oR14R15R16i534R17i520gR18r67gR13oR14R15R16i534R17i519gR18r67goR3jR4:12:1oR3jR4:5:3jy16:haxe.macro.Binop:1:0oR3jR4:1:1oR5r45R7y5:colorR9jR10:5:2i3r31R11i-31gR13oR14R15R16i554R17i549gR18r79goR3jR4:1:1r7R13oR14R15R16i561R17i557gR18r9gR13oR14R15R16i561R17i549gR18r79gR13oR14R15R16i561R17i542gR18r61gnR13oR14R15R16i561R17i515gR18r61goR3jR4:7:2oR5r8R7y1:rR9r34R11i-46goR3jR4:8:2oR3jR4:2:1jR12:31:0R13oR14R15R16i612R17i575gR18jR10:13:1aoR1aoR7R19R9r34ghR21r34ghgaoR3jR4:8:2oR3jR4:2:1jR12:32:0R13oR14R15R16i582R17i575gR18jR10:13:1aoR1aoR7y1:aR9r34goR7R20R9r34ghR21r34ghgaoR3jR4:1:1r44R13oR14R15R16i592R17i583gR18r46goR3jR4:1:1r38R13oR14R15R16i611R17i594gR18r32ghR13oR14R15R16i612R17i575gR18r34ghR13oR14R15R16i624R17i575gR18r34gR13oR14R15R16i625R17i567gR18r61goR3jR4:7:2oR5r8R7y9:specValueR9r9R11i-47goR3jR4:8:2oR3jR4:2:1r12R13oR14R15R16i704R17i646gR18jR10:13:1aoR1aoR7R19R9r9gr19hR21r9ghgaoR3jR4:8:2oR3jR4:2:1r24R13oR14R15R16i647R17i646gR18jR10:13:1aoR1aoR7R19R9r34gr33hR21r9ghgaoR3jR4:1:1r92R13oR14R15R16i647R17i646gR18r34goR3jR4:8:2oR3jR4:2:1r95R13oR14R15R16i691R17i652gR18jR10:13:1aoR1aoR7R19R9jR10:5:2i3r31ghR21r34ghgaoR3jR4:3:1oR3jR4:5:3jR30:3:0oR3jR4:1:1oR5jR6:0:0R7y8:positionR9jR10:5:2i3r31y6:parentoR5r169R7y6:cameraR9jR10:12:1ar168hR11i-34gR11i-35gR13oR14R15R16i668R17i653gR18r170goR3jR4:1:1oR5r8R7y19:transformedPositionR9jR10:5:2i3r31R11i-39gR13oR14R15R16i690R17i671gR18r178gR13oR14R15R16i690R17i653gR18r161gR13oR14R15R16i691R17i652gR18r161ghR13oR14R15R16i703R17i652gR18r34ghR13oR14R15R16i704R17i646gR18r9goR3jR4:0:1jR26:3:1d0R13oR14R15R16i711R17i709gR18r9ghR13oR14R15R16i712R17i646gR18r9gR13oR14R15R16i713R17i630gR18r61goR3jR4:12:1oR3jR4:5:3r76oR3jR4:1:1r78R13oR14R15R16i730R17i725gR18r79goR3jR4:3:1oR3jR4:5:3jR30:0:0oR3jR4:1:1r7R13oR14R15R16i738R17i734gR18r9goR3jR4:5:3r76oR3jR4:1:1oR5r8R7y9:specColorR9jR10:5:2i3r31R11i-41gR13oR14R15R16i750R17i741gR18r211goR3jR4:8:2oR3jR4:2:1jR12:8:0R13oR14R15R16i756R17i753gR18jR10:13:1aoR1aoR7R33R9r9gr19hR21r9ghgaoR3jR4:1:1r129R13oR14R15R16i766R17i757gR18r9goR3jR4:1:1oR5r8R7y9:specPowerR9r9R11i-40gR13oR14R15R16i777R17i768gR18r9ghR13oR14R15R16i778R17i753gR18r9gR13oR14R15R16i778R17i741gR18r211gR13oR14R15R16i778R17i734gR18r211gR13oR14R15R16i779R17i733gR18r211gR13oR14R15R16i779R17i725gR18jR10:5:2i3r31gR13oR14R15R16i779R17i718gR18r61ghR13oR14R15R16i785R17i451gR18r61gR5jy17:hxsl.FunctionKind:3:0y3:refoR5jR6:6:0R7y12:calcLightingR9jR10:13:1aoR1ahR21jR10:5:2i3r31ghR11i-42gR21r253goR1ahR2oR3jR4:4:1aoR3jR4:5:3jR30:20:1r204oR3jR4:9:2oR3jR4:1:1oR5r8R7y10:lightColorR9jR10:5:2i3r31R11i-36gR13oR14R15R16i825R17i815gR18r264gajy14:hxsl.Component:0:0jR45:1:0jR45:2:0hR13oR14R15R16i829R17i815gR18jR10:5:2i3r31goR3jR4:8:2oR3jR4:1:1r248R13oR14R15R16i845R17i833gR18r254gahR13oR14R15R16i847R17i833gR18r253gR13oR14R15R16i847R17i815gR18r273ghR13oR14R15R16i853R17i809gR18r61gR5jR41:0:0R42oR5r249R7y6:vertexR9jR10:13:1aoR1ahR21r61ghR11i-43gR21r61goR1ahR2oR3jR4:4:1aoR3jR4:5:3jR30:20:1r204oR3jR4:9:2oR3jR4:1:1oR5r8R7y15:lightPixelColorR9jR10:5:2i3r31R11i-37gR13oR14R15R16i900R17i885gR18r300gar268r269r270hR13oR14R15R16i904R17i885gR18jR10:5:2i3r31goR3jR4:8:2oR3jR4:1:1r248R13oR14R15R16i920R17i908gR18r254gahR13oR14R15R16i922R17i908gR18r253gR13oR14R15R16i922R17i885gR18r306ghR13oR14R15R16i928R17i879gR18r61gR5jR41:1:0R42oR5r249R7y8:fragmentR9jR10:13:1aoR1ahR21r61ghR11i-44gR21r61ghR7y19:h3d.shader.DirLighty4:varsar286r66r38r263r210r319r248r171r78r177r44r229r299hg";
h3d_shader_LineShader.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:4:1aoR3jR4:7:2oy4:kindjy12:hxsl.VarKind:4:0y4:namey3:diry4:typejy9:hxsl.Type:5:2i3jy12:hxsl.VecType:1:0y2:idi-203goR3jR4:5:3jy16:haxe.macro.Binop:1:0oR3jR4:1:1oR5jR6:1:0R7y6:normalR9jR10:5:2i3r11y6:parentoR5r17R7y5:inputR9jR10:12:1aoR5r17R7y8:positionR9jR10:5:2i3r11R15r19R12i-190gr16oR5r17R7y2:uvR9jR10:5:2i2r11R15r19R12i-192ghR12i-189gR12i-191gy1:poy4:filey67:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FLineShader.hxy3:maxi683y3:mini671gy1:tr18goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:48:0R19oR20R21R22i702R23i686gR24jR10:13:1ahgaoR3jR4:1:1oR5jR6:0:0R7y9:modelViewR9jR10:7:0R15oR5r38R7y6:globalR9jR10:12:1aoR5r38R7y9:pixelSizeR9jR10:5:2i2r11R15r40R12i-187gr37hR12i-186gy10:qualifiersajy17:hxsl.VarQualifier:3:0hR12i-188gR19oR20R21R22i702R23i686gR24r39ghR19oR20R21R22i709R23i686gR24jR10:6:0gR19oR20R21R22i709R23i671gR24r12gR19oR20R21R22i710R23i661gR24jR10:0:0goR3jR4:5:3jR13:4:0oR3jR4:1:1oR5r10R7y4:pdirR9jR10:5:2i4r11R12i-200gR19oR20R21R22i734R23i730gR24r61goR3jR4:5:3r14oR3jR4:8:2oR3jR4:2:1jR25:40:0R19oR20R21R22i741R23i737gR24jR10:13:1ahgaoR3jR4:5:3r14oR3jR4:1:1r9R19oR20R21R22i745R23i742gR24r12goR3jR4:8:2oR3jR4:2:1r30R19oR20R21R22i752R23i748gR24jR10:13:1ahgaoR3jR4:1:1oR5r38R7y4:viewR9r39R15oR5r38R7y6:cameraR9jR10:12:1ar85oR5r38R7y4:projR9r39R15r86R12i-184goR5r38R7y8:viewProjR9r39R15r86R12i-185ghR12i-182gR12i-183gR19oR20R21R22i764R23i753gR24r39ghR19oR20R21R22i765R23i748gR24r51gR19oR20R21R22i765R23i742gR24r12goR3jR4:0:1jy10:hxsl.Const:3:1i1R19oR20R21R22i768R23i767gR24jR10:3:0ghR19oR20R21R22i769R23i737gR24jR10:5:2i4r11goR3jR4:1:1r88R19oR20R21R22i783R23i772gR24r39gR19oR20R21R22i783R23i737gR24jR10:5:2i4r11gR19oR20R21R22i783R23i730gR24r61goR3jR4:5:3jR13:20:1r14oR3jR4:9:2oR3jR4:1:1r60R19oR20R21R22i794R23i790gR24r61gajy14:hxsl.Component:0:0jR37:1:0hR19oR20R21R22i797R23i790gR24jR10:5:2i2r11goR3jR4:5:3jR13:2:0oR3jR4:0:1jR36:3:1i1R19oR20R21R22i802R23i801gR24r101goR3jR4:8:2oR3jR4:2:1jR25:13:0R19oR20R21R22i809R23i805gR24jR10:13:1aoR1aoR7y5:valueR9r101ghy3:retr101ghgaoR3jR4:5:3jR13:0:0oR3jR4:5:3r14oR3jR4:9:2oR3jR4:1:1r60R19oR20R21R22i814R23i810gR24r61gar120hR19oR20R21R22i816R23i810gR24r101goR3jR4:9:2oR3jR4:1:1r60R19oR20R21R22i823R23i819gR24r61gar120hR19oR20R21R22i825R23i819gR24r101gR19oR20R21R22i825R23i810gR24r101goR3jR4:5:3r14oR3jR4:9:2oR3jR4:1:1r60R19oR20R21R22i832R23i828gR24r61gar121hR19oR20R21R22i834R23i828gR24r101goR3jR4:9:2oR3jR4:1:1r60R19oR20R21R22i841R23i837gR24r61gar121hR19oR20R21R22i843R23i837gR24r101gR19oR20R21R22i843R23i828gR24r101gR19oR20R21R22i843R23i810gR24r101ghR19oR20R21R22i844R23i805gR24r101gR19oR20R21R22i844R23i801gR24r101gR19oR20R21R22i844R23i790gR24r124goR3jR4:5:3jR13:20:1r143oR3jR4:1:1oR5r10R7y19:transformedPositionR9jR10:5:2i3r11R12i-196gR19oR20R21R22i870R23i851gR24r190goR3jR4:5:3r14oR3jR4:5:3r14oR3jR4:1:1r9R19oR20R21R22i877R23i874gR24r12goR3jR4:9:2oR3jR4:1:1r23R19oR20R21R22i888R23i880gR24r24gar120hR19oR20R21R22i890R23i880gR24r101gR19oR20R21R22i890R23i874gR24r12goR3jR4:1:1oR5jR6:2:0R7y11:lengthScaleR9r101R12i-198gR19oR20R21R22i904R23i893gR24r101gR19oR20R21R22i904R23i874gR24r12gR19oR20R21R22i904R23i851gR24r190goR3jR4:5:3r58oR3jR4:1:1oR5r10R7y17:transformedNormalR9jR10:5:2i3r11R12i-195gR19oR20R21R22i928R23i911gR24r219goR3jR4:8:2oR3jR4:2:1jR25:31:0R19oR20R21R22i934R23i931gR24jR10:13:1aoR1aoR7y1:_R9r12ghR39r12ghgaoR3jR4:1:1r9R19oR20R21R22i934R23i931gR24r12ghR19oR20R21R22i946R23i931gR24r12gR19oR20R21R22i946R23i911gR24r219ghR19oR20R21R22i953R23i654gR24r56ghR19oR20R21R22i958R23i648gR24r56gR5jy17:hxsl.FunctionKind:2:0y3:refoR5jR6:6:0R7y8:__init__R9jR10:13:1aoR1ahR39r56ghR12i-201gR39r56goR1ahR2oR3jR4:4:1aoR3jR4:5:3jR13:20:1r143oR3jR4:9:2oR3jR4:1:1oR5r10R7y17:projectedPositionR9jR10:5:2i4r11R12i-197gR19oR20R21R22i1005R23i988gR24r260gar120r121hR19oR20R21R22i1008R23i988gR24jR10:5:2i2r11goR3jR4:5:3r14oR3jR4:5:3r14oR3jR4:5:3r14oR3jR4:5:3r14oR3jR4:3:1oR3jR4:5:3r14oR3jR4:9:2oR3jR4:1:1r60R19oR20R21R22i1017R23i1013gR24r61gar121r120hR19oR20R21R22i1020R23i1013gR24jR10:5:2i2r11goR3jR4:8:2oR3jR4:2:1jR25:38:0R19oR20R21R22i1027R23i1023gR24jR10:13:1ahgaoR3jR4:0:1jR36:3:1i1R19oR20R21R22i1029R23i1028gR24r101goR3jR4:0:1jR36:3:1i-1R19oR20R21R22i1032R23i1030gR24r101ghR19oR20R21R22i1033R23i1023gR24jR10:5:2i2r11gR19oR20R21R22i1033R23i1013gR24jR10:5:2i2r11gR19oR20R21R22i1034R23i1012gR24r302goR3jR4:3:1oR3jR4:5:3jR13:3:0oR3jR4:9:2oR3jR4:1:1r23R19oR20R21R22i1046R23i1038gR24r24gar121hR19oR20R21R22i1048R23i1038gR24r101goR3jR4:0:1jR36:3:1d0.5R19oR20R21R22i1054R23i1051gR24r101gR19oR20R21R22i1054R23i1038gR24r101gR19oR20R21R22i1055R23i1037gR24r101gR19oR20R21R22i1055R23i1012gR24r302goR3jR4:9:2oR3jR4:1:1r259R19oR20R21R22i1075R23i1058gR24r260gajR37:2:0hR19oR20R21R22i1077R23i1058gR24r101gR19oR20R21R22i1077R23i1012gR24r302goR3jR4:1:1r42R19oR20R21R22i1096R23i1080gR24r43gR19oR20R21R22i1096R23i1012gR24jR10:5:2i2r11goR3jR4:1:1oR5r209R7y5:widthR9r101R12i-199gR19oR20R21R22i1104R23i1099gR24r101gR19oR20R21R22i1104R23i1012gR24r340gR19oR20R21R22i1104R23i988gR24r266ghR19oR20R21R22i1110R23i982gR24r56gR5jR44:0:0R45oR5r246R7y6:vertexR9jR10:13:1aoR1ahR39r56ghR12i-202gR39r56ghR7y21:h3d.shader.LineShadery4:varsar259r352r218r245r208r60r86oR5jR6:5:0R7y6:outputR9jR10:12:1aoR5r359R7R17R9jR10:5:2i4r11R15r358R12i-194ghR12i-193gr40r19r189r342hg";
h3d_shader_Shadow.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:10:3oR3jR4:6:2jy15:haxe.macro.Unop:2:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:2:0y4:namey8:perPixely4:typejy9:hxsl.Type:2:0y10:qualifiersajy17:hxsl.VarQualifier:0:1nhy2:idi-125gy1:poy4:filey63:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FShadow.hxy3:maxi416y3:mini408gy1:tr12gR15oR16R17R18i416R19i407gR20r12goR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oR6jR7:3:0R8y9:shadowPosR10jR11:5:2i3jy12:hxsl.VecType:1:0R12ajR13:1:0hR14i-124gR15oR16R17R18i428R19i419gR20r25goR3jR4:5:3jR21:0:0oR3jR4:5:3jR21:1:0oR3jR4:5:3r33oR3jR4:1:1oR6jR7:4:0R8y19:transformedPositionR10jR11:5:2i3r24R14i-122gR15oR16R17R18i450R19i431gR20r38goR3jR4:1:1oR6jR7:0:0R8y4:projR10jR11:8:0y6:parentoR6r43R8y6:shadowR10jR11:12:1aoR6r43R8y3:mapR10jR11:10:0R26r45R14i-116gr42oR6r43R8y5:colorR10jR11:5:2i3r24R26r45R14i-118goR6r43R8y5:powerR10jR11:3:0R26r45R14i-119goR6r43R8y4:biasR10r52R26r45R14i-120ghR14i-115gR14i-117gR15oR16R17R18i464R19i453gR20r44gR15oR16R17R18i464R19i431gR20jR11:5:2i3r24goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:39:0R15oR16R17R18i471R19i467gR20jR11:13:1ahgaoR3jR4:0:1jy10:hxsl.Const:3:1d0.5R15oR16R17R18i475R19i472gR20r52goR3jR4:0:1jR33:3:1d-0.5R15oR16R17R18i481R19i477gR20r52goR3jR4:0:1jR33:3:1i1R15oR16R17R18i484R19i483gR20r52ghR15oR16R17R18i485R19i467gR20jR11:5:2i3r24gR15oR16R17R18i485R19i431gR20jR11:5:2i3r24goR3jR4:8:2oR3jR4:2:1r62R15oR16R17R18i492R19i488gR20r66gaoR3jR4:0:1jR33:3:1d0.5R15oR16R17R18i496R19i493gR20r52goR3jR4:0:1jR33:3:1d0.5R15oR16R17R18i501R19i498gR20r52goR3jR4:0:1jR33:3:1zR15oR16R17R18i504R19i503gR20r52ghR15oR16R17R18i505R19i488gR20jR11:5:2i3r24gR15oR16R17R18i505R19i431gR20jR11:5:2i3r24gR15oR16R17R18i505R19i419gR20r25gnR15oR16R17R18i505R19i403gR20jR11:0:0ghR15oR16R17R18i511R19i397gR20r113gR6jy17:hxsl.FunctionKind:0:0y3:refoR6jR7:6:0R8y6:vertexR10jR11:13:1aoR1ahy3:retr113ghR14i-126gR37r113goR1ahR2oR3jR4:4:1aoR3jR4:7:2oR6r37R8R22R10jR11:5:2i3r24R14i-128goR3jR4:10:3oR3jR4:1:1r10R15oR16R17R18i573R19i565gR20r12goR3jR4:5:3r31oR3jR4:5:3r33oR3jR4:5:3r33oR3jR4:1:1oR6r37R8y24:pixelTransformedPositionR10jR11:5:2i3r24R14i-123gR15oR16R17R18i600R19i576gR20r139goR3jR4:1:1r42R15oR16R17R18i614R19i603gR20r44gR15oR16R17R18i614R19i576gR20r59goR3jR4:8:2oR3jR4:2:1r62R15oR16R17R18i621R19i617gR20r66gaoR3jR4:0:1jR33:3:1d0.5R15oR16R17R18i625R19i622gR20r52goR3jR4:0:1jR33:3:1d-0.5R15oR16R17R18i631R19i627gR20r52goR3jR4:0:1jR33:3:1i1R15oR16R17R18i634R19i633gR20r52ghR15oR16R17R18i635R19i617gR20jR11:5:2i3r24gR15oR16R17R18i635R19i576gR20jR11:5:2i3r24goR3jR4:8:2oR3jR4:2:1r62R15oR16R17R18i642R19i638gR20r66gaoR3jR4:0:1jR33:3:1d0.5R15oR16R17R18i646R19i643gR20r52goR3jR4:0:1jR33:3:1d0.5R15oR16R17R18i651R19i648gR20r52goR3jR4:0:1jR33:3:1zR15oR16R17R18i654R19i653gR20r52ghR15oR16R17R18i655R19i638gR20jR11:5:2i3r24gR15oR16R17R18i655R19i576gR20r129goR3jR4:1:1r22R15oR16R17R18i670R19i661gR20r25gR15oR16R17R18i670R19i561gR20r129gR15oR16R17R18i671R19i545gR20r113goR3jR4:7:2oR6r37R8y5:depthR10r52R14i-129goR3jR4:8:2oR3jR4:2:1jR32:53:0R15oR16R17R18i696R19i690gR20jR11:13:1aoR1aoR8y5:valueR10jR11:5:2i4r24ghR37r52ghgaoR3jR4:8:2oR3jR4:2:1jR32:33:0R15oR16R17R18i707R19i697gR20jR11:13:1aoR1aoR8y1:_R10r48goR8y1:bR10jR11:5:2i2r24ghR37jR11:5:2i4r24ghgaoR3jR4:1:1r47R15oR16R17R18i707R19i697gR20r48goR3jR4:9:2oR3jR4:1:1r128R15oR16R17R18i721R19i712gR20r129gajy14:hxsl.Component:0:0jR43:1:0hR15oR16R17R18i724R19i712gR20jR11:5:2i2r24ghR15oR16R17R18i725R19i697gR20r224ghR15oR16R17R18i726R19i690gR20r52gR15oR16R17R18i727R19i678gR20r113goR3jR4:7:2oR6r37R8y4:zMaxR10r52R14i-130goR3jR4:8:2oR3jR4:2:1jR32:51:0R15oR16R17R18i919R19i908gR20jR11:13:1aoR1aoR8R41R10r52ghR37r52ghgaoR3jR4:9:2oR3jR4:1:1r128R15oR16R17R18i917R19i908gR20r129gajR43:2:0hR15oR16R17R18i919R19i908gR20r52ghR15oR16R17R18i930R19i908gR20r52gR15oR16R17R18i931R19i897gR20r113goR3jR4:7:2oR6r37R8y5:deltaR10r52R14i-131goR3jR4:5:3jR21:3:0oR3jR4:8:2oR3jR4:2:1jR32:21:0R15oR16R17R18i969R19i948gR20jR11:13:1aoR1aoR8R41R10r52goR8R42R10r52ghR37r52ghgaoR3jR4:3:1oR3jR4:5:3r31oR3jR4:1:1r200R15oR16R17R18i954R19i949gR20r52goR3jR4:1:1r53R15oR16R17R18i968R19i957gR20r52gR15oR16R17R18i968R19i949gR20r52gR15oR16R17R18i969R19i948gR20r52goR3jR4:1:1r247R15oR16R17R18i978R19i974gR20r52ghR15oR16R17R18i979R19i948gR20r52goR3jR4:1:1r247R15oR16R17R18i986R19i982gR20r52gR15oR16R17R18i986R19i948gR20r52gR15oR16R17R18i987R19i936gR20r113goR3jR4:7:2oR6r37R8y5:shadeR10r52R14i-132goR3jR4:8:2oR3jR4:2:1r250R15oR16R17R18i1032R19i1004gR20jR11:13:1aoR1aoR8R41R10r52ghR37r52ghgaoR3jR4:8:2oR3jR4:2:1jR32:9:0R15oR16R17R18i1007R19i1004gR20jR11:13:1aoR1aoR8R40R10r52ghR37r52ghgaoR3jR4:5:3r33oR3jR4:1:1r51R15oR16R17R18i1021R19i1009gR20r52goR3jR4:1:1r272R15oR16R17R18i1029R19i1024gR20r52gR15oR16R17R18i1029R19i1009gR20r52ghR15oR16R17R18i1032R19i1004gR20r52ghR15oR16R17R18i1043R19i1004gR20r52gR15oR16R17R18i1044R19i992gR20r113goR3jR4:5:3jR21:20:1r33oR3jR4:9:2oR3jR4:1:1oR6r37R8y10:pixelColorR10jR11:5:2i4r24R14i-121gR15oR16R17R18i1059R19i1049gR20r354gar235r236r264hR15oR16R17R18i1063R19i1049gR20jR11:5:2i3r24goR3jR4:5:3r31oR3jR4:5:3r33oR3jR4:3:1oR3jR4:5:3r274oR3jR4:0:1jR33:3:1i1R15oR16R17R18i1069R19i1068gR20r52goR3jR4:1:1r312R15oR16R17R18i1077R19i1072gR20r52gR15oR16R17R18i1077R19i1068gR20r52gR15oR16R17R18i1078R19i1067gR20r52goR3jR4:9:2oR3jR4:1:1r49R15oR16R17R18i1093R19i1081gR20r50gar235r236r264hR15oR16R17R18i1097R19i1081gR20jR11:5:2i3r24gR15oR16R17R18i1097R19i1067gR20r383goR3jR4:1:1r312R15oR16R17R18i1105R19i1100gR20r52gR15oR16R17R18i1105R19i1067gR20r383gR15oR16R17R18i1105R19i1049gR20r360ghR15oR16R17R18i1111R19i537gR20r113gR6jR34:1:0R35oR6r118R8y8:fragmentR10jR11:13:1aoR1ahR37r113ghR14i-127gR37r113ghR8y17:h3d.shader.Shadowy4:varsar117r396r45r22r36r353r138r10hg";
h3d_shader_Skin.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey19:transformedPositiony4:typejy9:hxsl.Type:5:2i3jy12:hxsl.VecType:1:0y2:idi-110gy1:poy4:filey61:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FSkin.hxy3:maxi538y3:mini519gy1:tr12goR3jR4:5:3jR5:0:0oR3jR4:5:3r16oR3jR4:5:3jR5:1:0oR3jR4:3:1oR3jR4:5:3r19oR3jR4:1:1oR6r10R8y16:relativePositionR10jR11:5:2i3r11R13i-109gR14oR15R16R17i563R18i547gR19r24goR3jR4:16:2oR3jR4:1:1oR6jR7:2:0R8y13:bonesMatrixesR10jR11:14:2jR11:8:0jy13:hxsl.SizeDecl:1:1oR6r30R8y8:MaxBonesR10jR11:1:0y10:qualifiersajy17:hxsl.VarQualifier:0:1nhR13i-112gR13i-113gR14oR15R16R17i579R18i566gR19r37goR3jR4:9:2oR3jR4:1:1oR6jR7:1:0R8y7:indexesR10jR11:9:1i4y6:parentoR6r43R8y5:inputR10jR11:12:1aoR6r43R8y8:positionR10jR11:5:2i3r11R27r45R13i-105goR6r43R8y6:normalR10jR11:5:2i3r11R27r45R13i-106goR6r43R8y7:weightsR10jR11:5:2i3r11R27r45R13i-107gr42hR13i-104gR13i-108gR14oR15R16R17i593R18i580gR19r44gajy14:hxsl.Component:0:0hR14oR15R16R17i595R18i580gR19r33gR14oR15R16R17i596R18i566gR19r31gR14oR15R16R17i596R18i547gR19jR11:5:2i3r11gR14oR15R16R17i597R18i546gR19r64goR3jR4:9:2oR3jR4:1:1r51R14oR15R16R17i613R18i600gR19r52gar57hR14oR15R16R17i615R18i600gR19jR11:3:0gR14oR15R16R17i615R18i546gR19r64goR3jR4:5:3r19oR3jR4:3:1oR3jR4:5:3r19oR3jR4:1:1r23R14oR15R16R17i640R18i624gR19r24goR3jR4:16:2oR3jR4:1:1r29R14oR15R16R17i656R18i643gR19r37goR3jR4:9:2oR3jR4:1:1r42R14oR15R16R17i670R18i657gR19r44gajR32:1:0hR14oR15R16R17i672R18i657gR19r33gR14oR15R16R17i673R18i643gR19r31gR14oR15R16R17i673R18i624gR19r64gR14oR15R16R17i674R18i623gR19r64goR3jR4:9:2oR3jR4:1:1r51R14oR15R16R17i690R18i677gR19r52gar92hR14oR15R16R17i692R18i677gR19r74gR14oR15R16R17i692R18i623gR19r64gR14oR15R16R17i692R18i546gR19jR11:5:2i3r11goR3jR4:5:3r19oR3jR4:3:1oR3jR4:5:3r19oR3jR4:1:1r23R14oR15R16R17i717R18i701gR19r24goR3jR4:16:2oR3jR4:1:1r29R14oR15R16R17i733R18i720gR19r37goR3jR4:9:2oR3jR4:1:1r42R14oR15R16R17i747R18i734gR19r44gajR32:2:0hR14oR15R16R17i749R18i734gR19r33gR14oR15R16R17i750R18i720gR19r31gR14oR15R16R17i750R18i701gR19r64gR14oR15R16R17i751R18i700gR19r64goR3jR4:9:2oR3jR4:1:1r51R14oR15R16R17i767R18i754gR19r52gar128hR14oR15R16R17i769R18i754gR19r74gR14oR15R16R17i769R18i700gR19r64gR14oR15R16R17i769R18i546gR19jR11:5:2i3r11gR14oR15R16R17i769R18i519gR19r12goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y17:transformedNormalR10jR11:5:2i3r11R13i-111gR14oR15R16R17i792R18i775gR19r154goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:31:0R14oR15R16R17i804R18i795gR19jR11:13:1aoR1aoR8y5:valueR10r64ghy3:retr64ghgaoR3jR4:5:3r16oR3jR4:5:3r16oR3jR4:5:3r19oR3jR4:3:1oR3jR4:5:3r19oR3jR4:1:1r49R14oR15R16R17i824R18i812gR19r50goR3jR4:8:2oR3jR4:2:1jR34:48:0R14oR15R16R17i831R18i827gR19jR11:13:1ahgaoR3jR4:16:2oR3jR4:1:1r29R14oR15R16R17i845R18i832gR19r37goR3jR4:9:2oR3jR4:1:1r42R14oR15R16R17i859R18i846gR19r44gar57hR14oR15R16R17i861R18i846gR19r33gR14oR15R16R17i862R18i832gR19r31ghR14oR15R16R17i863R18i827gR19jR11:6:0gR14oR15R16R17i863R18i812gR19r64gR14oR15R16R17i864R18i811gR19r64goR3jR4:9:2oR3jR4:1:1r51R14oR15R16R17i880R18i867gR19r52gar57hR14oR15R16R17i882R18i867gR19r74gR14oR15R16R17i882R18i811gR19r64goR3jR4:5:3r19oR3jR4:3:1oR3jR4:5:3r19oR3jR4:1:1r49R14oR15R16R17i903R18i891gR19r50goR3jR4:8:2oR3jR4:2:1r178R14oR15R16R17i910R18i906gR19r182gaoR3jR4:16:2oR3jR4:1:1r29R14oR15R16R17i924R18i911gR19r37goR3jR4:9:2oR3jR4:1:1r42R14oR15R16R17i938R18i925gR19r44gar92hR14oR15R16R17i940R18i925gR19r33gR14oR15R16R17i941R18i911gR19r31ghR14oR15R16R17i942R18i906gR19r199gR14oR15R16R17i942R18i891gR19r64gR14oR15R16R17i943R18i890gR19r64goR3jR4:9:2oR3jR4:1:1r51R14oR15R16R17i959R18i946gR19r52gar92hR14oR15R16R17i961R18i946gR19r74gR14oR15R16R17i961R18i890gR19r64gR14oR15R16R17i961R18i811gR19jR11:5:2i3r11goR3jR4:5:3r19oR3jR4:3:1oR3jR4:5:3r19oR3jR4:1:1r49R14oR15R16R17i982R18i970gR19r50goR3jR4:8:2oR3jR4:2:1r178R14oR15R16R17i989R18i985gR19r182gaoR3jR4:16:2oR3jR4:1:1r29R14oR15R16R17i1003R18i990gR19r37goR3jR4:9:2oR3jR4:1:1r42R14oR15R16R17i1017R18i1004gR19r44gar128hR14oR15R16R17i1019R18i1004gR19r33gR14oR15R16R17i1020R18i990gR19r31ghR14oR15R16R17i1021R18i985gR19r199gR14oR15R16R17i1021R18i970gR19r64gR14oR15R16R17i1022R18i969gR19r64goR3jR4:9:2oR3jR4:1:1r51R14oR15R16R17i1038R18i1025gR19r52gar128hR14oR15R16R17i1040R18i1025gR19r74gR14oR15R16R17i1040R18i969gR19r64gR14oR15R16R17i1040R18i811gR19jR11:5:2i3r11ghR14oR15R16R17i1041R18i795gR19r64gR14oR15R16R17i1041R18i775gR19r154ghR14oR15R16R17i1056R18i420gR19jR11:0:0gR6jy17:hxsl.FunctionKind:0:0y3:refoR6jR7:6:0R8y6:vertexR10jR11:13:1aoR1ahR36r303ghR13i-114gR36r303ghR8y15:h3d.shader.Skiny4:varsar305r153r29r23r45r9r32hg";
h3d_shader_SpecularTexture.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:20:1jR5:1:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey9:specColory4:typejy9:hxsl.Type:5:2i3jy12:hxsl.VecType:1:0y2:idi-50gy1:poy4:filey72:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FSpecularTexture.hxy3:maxi218y3:mini209gy1:tr13goR3jR4:9:2oR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:33:0R14oR15R16R17i229R18i222gR19jR11:13:1aoR1aoR8y1:_R10jR11:10:0goR8y1:bR10jR11:5:2i2r12ghy3:retjR11:5:2i4r12ghgaoR3jR4:1:1oR6jR7:2:0R8y7:textureR10r26R13i-48gR14oR15R16R17i229R18i222gR19r26goR3jR4:1:1oR6r11R8y12:calculatedUVR10jR11:5:2i2r12R13i-49gR14oR15R16R17i246R18i234gR19r39ghR14oR15R16R17i247R18i222gR19r29gajy14:hxsl.Component:0:0jR26:1:0jR26:2:0hR14oR15R16R17i251R18i222gR19jR11:5:2i3r12gR14oR15R16R17i251R18i209gR19r13ghR14oR15R16R17i257R18i203gR19jR11:0:0gR6jy17:hxsl.FunctionKind:1:0y3:refoR6jR7:6:0R8y8:fragmentR10jR11:13:1aoR1ahR23r55ghR13i-51gR23r55ghR8y26:h3d.shader.SpecularTexturey4:varsar38r10r57r33hg";
h3d_shader_Texture.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey12:calculatedUVy4:typejy9:hxsl.Type:5:2i2jy12:hxsl.VecType:1:0y2:idi-58gy1:poy4:filey64:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FTexture.hxy3:maxi370y3:mini358gy1:tr12goR3jR4:1:1oR6jR7:1:0R8y2:uvR10jR11:5:2i2r11y6:parentoR6r17R8y5:inputR10jR11:12:1ar16hR13i-52gR13i-53gR14oR15R16R17i381R18i373gR19r18gR14oR15R16R17i381R18i358gR19r12ghR14oR15R16R17i387R18i352gR19jR11:0:0gR6jy17:hxsl.FunctionKind:0:0y3:refoR6jR7:6:0R8y6:vertexR10jR11:13:1aoR1ahy3:retr28ghR13i-60gR26r28goR1ahR2oR3jR4:4:1aoR3jR4:7:2oR6r10R8y1:cR10jR11:5:2i4r11R13i-62goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:33:0R14oR15R16R17i434R18i427gR19jR11:13:1aoR1aoR8y1:_R10jR11:10:0goR8y1:bR10jR11:5:2i2r11ghR26r42ghgaoR3jR4:1:1oR6jR7:2:0R8y7:textureR10r52R13i-57gR14oR15R16R17i434R18i427gR19r52goR3jR4:1:1r9R14oR15R16R17i451R18i439gR19r12ghR14oR15R16R17i452R18i427gR19r42gR14oR15R16R17i453R18i419gR19r28goR3jR4:10:3oR3jR4:5:3jR5:14:0oR3jR4:1:1oR6r59R8y9:killAlphaR10jR11:2:0y10:qualifiersajy17:hxsl.VarQualifier:0:1nhR13i-55gR14oR15R16R17i471R18i462gR19r74goR3jR4:5:3jR5:9:0oR3jR4:5:3jR5:3:0oR3jR4:9:2oR3jR4:1:1r41R14oR15R16R17i476R18i475gR19r42gajy14:hxsl.Component:3:0hR14oR15R16R17i478R18i475gR19jR11:3:0goR3jR4:1:1oR6r59R8y18:killAlphaThresholdR10r91R13i-56gR14oR15R16R17i499R18i481gR19r91gR14oR15R16R17i499R18i475gR19r91goR3jR4:0:1jy10:hxsl.Const:3:1zR14oR15R16R17i503R18i502gR19r91gR14oR15R16R17i503R18i475gR19r74gR14oR15R16R17i503R18i462gR19r74goR3jR4:11:0R14oR15R16R17i513R18i506gR19r28gnR14oR15R16R17i513R18i458gR19r28goR3jR4:10:3oR3jR4:1:1oR6r59R8y8:additiveR10r74R33ajR34:0:1nhR13i-54gR14oR15R16R17i531R18i523gR19r74goR3jR4:5:3jR5:20:1jR5:0:0oR3jR4:1:1oR6r10R8y10:pixelColorR10jR11:5:2i4r11R13i-59gR14oR15R16R17i549R18i539gR19r123goR3jR4:1:1r41R14oR15R16R17i554R18i553gR19r42gR14oR15R16R17i554R18i539gR19r123goR3jR4:5:3jR5:20:1jR5:1:0oR3jR4:1:1r122R14oR15R16R17i580R18i570gR19r123goR3jR4:1:1r41R14oR15R16R17i585R18i584gR19r42gR14oR15R16R17i585R18i570gR19r123gR14oR15R16R17i585R18i519gR19r28ghR14oR15R16R17i591R18i413gR19r28gR6jR23:1:0R24oR6r31R8y8:fragmentR10jR11:13:1aoR1ahR26r28ghR13i-61gR26r28ghR8y18:h3d.shader.Texturey4:varsar9r30r147r113r58r93r19r73r122hg";
h3d_shader_VertexColorAlpha.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:10:3oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:2:0y4:namey8:additivey4:typejy9:hxsl.Type:2:0y10:qualifiersajy17:hxsl.VarQualifier:0:1nhy2:idi-207gy1:poy4:filey73:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FVertexColorAlpha.hxy3:maxi245y3:mini237gy1:tr10goR3jR4:5:3jy16:haxe.macro.Binop:20:1jR20:0:0oR3jR4:1:1oR5jR6:4:0R7y10:pixelColorR9jR10:5:2i4jy12:hxsl.VecType:1:0R13i-206gR14oR15R16R17i263R18i253gR19r22goR3jR4:1:1oR5jR6:1:0R7y5:colorR9jR10:5:2i4r21y6:parentoR5r27R7y5:inputR9jR10:12:1ar26hR13i-204gR13i-205gR14oR15R16R17i278R18i267gR19r28gR14oR15R16R17i278R18i253gR19r22goR3jR4:5:3jR20:20:1jR20:1:0oR3jR4:1:1r19R14oR15R16R17i304R18i294gR19r22goR3jR4:1:1r26R14oR15R16R17i319R18i308gR19r28gR14oR15R16R17i319R18i294gR19r22gR14oR15R16R17i319R18i233gR19jR10:0:0ghR14oR15R16R17i325R18i227gR19r49gR5jy17:hxsl.FunctionKind:1:0y3:refoR5jR6:6:0R7y8:fragmentR9jR10:13:1aoR1ahy3:retr49ghR13i-208gR29r49ghR7y27:h3d.shader.VertexColorAlphay4:varsar53r8r29r19hg";
h3d_shader_VolumeDecal.SRC = "oy4:funsaoy4:argsahy4:exproy1:ejy13:hxsl.TExprDef:4:1aoR3jR4:5:3jy16:haxe.macro.Binop:4:0oR3jR4:1:1oy4:kindjy12:hxsl.VarKind:4:0y4:namey17:transformedNormaly4:typejy9:hxsl.Type:5:2i3jy12:hxsl.VecType:1:0y2:idi-159gy1:poy4:filey68:%2Fhome%2Faaron%2Fhaxe%2Fheaps%2Fgit%2Fh3d%2Fshader%2FVolumeDecal.hxy3:maxi282y3:mini265gy1:tr12goR3jR4:1:1oR6jR7:2:0R8y6:normalR10jR11:5:2i3r11R13i-172gR14oR15R16R17i291R18i285gR19r18gR14oR15R16R17i291R18i265gR19r12ghR14oR15R16R17i297R18i259gR19jR11:0:0gR6jy17:hxsl.FunctionKind:0:0y3:refoR6jR7:6:0R8y6:vertexR10jR11:13:1aoR1ahy3:retr25ghR13i-174gR24r25goR1ahR2oR3jR4:4:1aoR3jR4:7:2oR6r10R8y6:matrixR10jR11:7:0R13i-176goR3jR4:5:3jR5:1:0oR3jR4:1:1oR6jR7:0:0R8y15:inverseViewProjR10r39y6:parentoR6r44R8y6:cameraR10jR11:12:1aoR6r44R8y4:viewR10r39R27r45R13i-134goR6r44R8y4:projR10r39R27r45R13i-135goR6r44R8y8:positionR10jR11:5:2i3r11R27r45R13i-136goR6r44R8y8:projDiagR10jR11:5:2i3r11R27r45R13i-137goR6r44R8y8:viewProjR10r39R27r45R13i-138gr43oR6r44R8y5:zNearR10jR11:3:0R27r45R13i-140goR6r44R8y4:zFarR10r55R27r45R13i-141goR6jR7:3:0R8y3:dirR10jR11:5:2i3r11R27r45R13i-142ghR13i-133gR13i-139gR14oR15R16R17i364R18i342gR19r39goR3jR4:1:1oR6r44R8y16:modelViewInverseR10r39R27oR6r44R8y6:globalR10jR11:12:1aoR6r44R8y4:timeR10r55R27r65R13i-144goR6r44R8y9:pixelSizeR10jR11:5:2i2r11R27r65R13i-145goR6r44R8y9:modelViewR10r39R27r65y10:qualifiersajy17:hxsl.VarQualifier:3:0hR13i-146gr64hR13i-143gR42ar72hR13i-147gR14oR15R16R17i390R18i367gR19r39gR14oR15R16R17i390R18i342gR19r39gR14oR15R16R17i391R18i329gR19r25goR3jR4:7:2oR6r10R8y9:screenPosR10jR11:5:2i2r11R13i-177goR3jR4:5:3jR5:2:0oR3jR4:9:2oR3jR4:1:1oR6r10R8y17:projectedPositionR10jR11:5:2i4r11R13i-160gR14oR15R16R17i429R18i412gR19r89gajy14:hxsl.Component:0:0jR46:1:0hR14oR15R16R17i432R18i412gR19r83goR3jR4:9:2oR3jR4:1:1r88R14oR15R16R17i452R18i435gR19r89gajR46:3:0hR14oR15R16R17i454R18i435gR19r55gR14oR15R16R17i454R18i412gR19r83gR14oR15R16R17i455R18i396gR19r25goR3jR4:7:2oR6r10R8y3:tuvR10jR11:5:2i2r11R13i-178goR3jR4:5:3jR5:0:0oR3jR4:5:3r41oR3jR4:1:1r82R14oR15R16R17i479R18i470gR19r83goR3jR4:8:2oR3jR4:2:1jy12:hxsl.TGlobal:38:0R14oR15R16R17i486R18i482gR19jR11:13:1ahgaoR3jR4:0:1jy10:hxsl.Const:3:1d0.5R14oR15R16R17i490R18i487gR19r55goR3jR4:0:1jR49:3:1d-0.5R14oR15R16R17i496R18i492gR19r55ghR14oR15R16R17i497R18i482gR19jR11:5:2i2r11gR14oR15R16R17i497R18i470gR19jR11:5:2i2r11goR3jR4:8:2oR3jR4:2:1r120R14oR15R16R17i504R18i500gR19r124gaoR3jR4:0:1jR49:3:1d0.5R14oR15R16R17i508R18i505gR19r55goR3jR4:0:1jR49:3:1d0.5R14oR15R16R17i513R18i510gR19r55ghR14oR15R16R17i514R18i500gR19jR11:5:2i2r11gR14oR15R16R17i514R18i470gR19r111gR14oR15R16R17i515R18i460gR19r25goR3jR4:7:2oR6r10R8y3:ruvR10jR11:5:2i4r11R13i-179goR3jR4:8:2oR3jR4:2:1jR48:40:0R14oR15R16R17i534R18i530gR19jR11:13:1ahgaoR3jR4:1:1r82R14oR15R16R17i550R18i541gR19r83goR3jR4:8:2oR3jR4:2:1jR48:53:0R14oR15R16R17i563R18i557gR19jR11:13:1aoR1aoR8y5:valueR10jR11:5:2i4r11ghR24r55ghgaoR3jR4:8:2oR3jR4:2:1jR48:33:0R14oR15R16R17i572R18i564gR19jR11:13:1aoR1aoR8y1:_R10jR11:10:0goR8y1:bR10jR11:5:2i2r11ghR24jR11:5:2i4r11ghgaoR3jR4:1:1oR6r44R8y8:depthMapR10r195R13i-170gR14oR15R16R17i572R18i564gR19r195goR3jR4:1:1r110R14oR15R16R17i580R18i577gR19r111ghR14oR15R16R17i581R18i564gR19r198ghR14oR15R16R17i582R18i557gR19r55goR3jR4:0:1jR49:3:1i1R14oR15R16R17i590R18i589gR19r55ghR14oR15R16R17i596R18i530gR19r162gR14oR15R16R17i597R18i520gR19r25goR3jR4:7:2oR6r10R8y4:wposR10r198R13i-180goR3jR4:5:3r41oR3jR4:1:1r161R14oR15R16R17i616R18i613gR19r162goR3jR4:1:1r38R14oR15R16R17i625R18i619gR19r39gR14oR15R16R17i625R18i613gR19r198gR14oR15R16R17i626R18i602gR19r25goR3jR4:7:2oR6r10R8y4:pposR10r198R13i-181goR3jR4:5:3r41oR3jR4:1:1r161R14oR15R16R17i645R18i642gR19r162goR3jR4:1:1r43R14oR15R16R17i670R18i648gR19r39gR14oR15R16R17i670R18i642gR19r198gR14oR15R16R17i671R18i631gR19r25goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y24:pixelTransformedPositionR10jR11:5:2i3r11R13i-158gR14oR15R16R17i700R18i676gR19r249goR3jR4:5:3r85oR3jR4:9:2oR3jR4:1:1r234R14oR15R16R17i707R18i703gR19r198gar93r94jR46:2:0hR14oR15R16R17i711R18i703gR19jR11:5:2i3r11goR3jR4:9:2oR3jR4:1:1r234R14oR15R16R17i718R18i714gR19r198gar102hR14oR15R16R17i720R18i714gR19r55gR14oR15R16R17i720R18i703gR19r261gR14oR15R16R17i720R18i676gR19r249goR3jR4:5:3r7oR3jR4:1:1oR6r10R8y12:calculatedUVR10jR11:5:2i2r11R13i-173gR14oR15R16R17i738R18i726gR19r276goR3jR4:5:3r113oR3jR4:5:3r41oR3jR4:1:1oR6r17R8y5:scaleR10jR11:5:2i2r11R13i-171gR14oR15R16R17i746R18i741gR19r283goR3jR4:3:1oR3jR4:5:3r85oR3jR4:9:2oR3jR4:1:1r221R14oR15R16R17i754R18i750gR19r198gar93r94hR14oR15R16R17i757R18i750gR19jR11:5:2i2r11goR3jR4:9:2oR3jR4:1:1r221R14oR15R16R17i764R18i760gR19r198gar102hR14oR15R16R17i766R18i760gR19r55gR14oR15R16R17i766R18i750gR19r295gR14oR15R16R17i767R18i749gR19r295gR14oR15R16R17i767R18i741gR19jR11:5:2i2r11goR3jR4:0:1jR49:3:1d0.5R14oR15R16R17i773R18i770gR19r55gR14oR15R16R17i773R18i741gR19r309gR14oR15R16R17i773R18i726gR19r276goR3jR4:10:3oR3jR4:5:3jR5:9:0oR3jR4:8:2oR3jR4:2:1jR48:21:0R14oR15R16R17i786R18i783gR19jR11:13:1aoR1aoR8y1:aR10r55goR8R53R10r55ghR24r55ghgaoR3jR4:8:2oR3jR4:2:1r323R14oR15R16R17i790R18i787gR19jR11:13:1ar327hgaoR3jR4:9:2oR3jR4:1:1r275R14oR15R16R17i803R18i791gR19r276gar93hR14oR15R16R17i805R18i791gR19r55goR3jR4:9:2oR3jR4:1:1r275R14oR15R16R17i819R18i807gR19r276gar94hR14oR15R16R17i821R18i807gR19r55ghR14oR15R16R17i822R18i787gR19r55goR3jR4:8:2oR3jR4:2:1r323R14oR15R16R17i827R18i824gR19jR11:13:1ar327hgaoR3jR4:5:3jR5:3:0oR3jR4:0:1jR49:3:1i1R14oR15R16R17i829R18i828gR19r55goR3jR4:9:2oR3jR4:1:1r275R14oR15R16R17i844R18i832gR19r276gar93hR14oR15R16R17i846R18i832gR19r55gR14oR15R16R17i846R18i828gR19r55goR3jR4:5:3r364oR3jR4:0:1jR49:3:1i1R14oR15R16R17i849R18i848gR19r55goR3jR4:9:2oR3jR4:1:1r275R14oR15R16R17i864R18i852gR19r276gar94hR14oR15R16R17i866R18i852gR19r55gR14oR15R16R17i866R18i848gR19r55ghR14oR15R16R17i867R18i824gR19r55ghR14oR15R16R17i868R18i783gR19r55goR3jR4:0:1jR49:3:1zR14oR15R16R17i872R18i871gR19r55gR14oR15R16R17i872R18i783gR19jR11:2:0goR3jR4:11:0R14oR15R16R17i882R18i875gR19r25gnR14oR15R16R17i882R18i779gR19r25ghR14oR15R16R17i888R18i323gR19r25gR6jR21:1:0R22oR6r28R8y8:fragmentR10jR11:13:1aoR1ahR24r25ghR13i-175gR24r25ghR8y22:h3d.shader.VolumeDecaly4:varsar88oR6r10R8y5:depthR10r55R13i-162gr275r27r9r282oR6r10R8y9:specColorR10jR11:5:2i3r11R13i-165gr16r411r202oR6r10R8y16:relativePositionR10jR11:5:2i3r11R13i-156gr45oR6jR7:5:0R8y6:outputR10jR11:12:1aoR6r423R8R31R10jR11:5:2i4r11R27r422R13i-152goR6r423R8y5:colorR10jR11:5:2i4r11R27r422R13i-153goR6r423R8R64R10jR11:5:2i4r11R27r422R13i-154goR6r423R8R20R10jR11:5:2i4r11R27r422R13i-155ghR13i-151goR6r10R8y8:screenUVR10jR11:5:2i2r11R13i-163gr65oR6jR7:1:0R8y5:inputR10jR11:12:1aoR6r437R8R31R10jR11:5:2i3r11R27r436R13i-149goR6r437R8R20R10jR11:5:2i3r11R27r436R13i-150ghR13i-148goR6r10R8y19:transformedPositionR10jR11:5:2i3r11R13i-157goR6r10R8y9:specPowerR10r55R13i-164gr248oR6r10R8y10:pixelColorR10jR11:5:2i4r11R13i-161ghg";
haxe_Unserializer.DEFAULT_RESOLVER = Type;
haxe_Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe_ds_ObjectMap.count = 0;
haxe_io_FPHelper.i64tmp = (function($this) {
	var $r;
	var x = new haxe__$Int64__$_$_$Int64(0,0);
	$r = x;
	return $r;
}(this));
hxd_Key.BACKSPACE = 8;
hxd_Key.TAB = 9;
hxd_Key.ENTER = 13;
hxd_Key.SHIFT = 16;
hxd_Key.CTRL = 17;
hxd_Key.ALT = 18;
hxd_Key.ESCAPE = 27;
hxd_Key.SPACE = 32;
hxd_Key.PGUP = 33;
hxd_Key.PGDOWN = 34;
hxd_Key.END = 35;
hxd_Key.HOME = 36;
hxd_Key.LEFT = 37;
hxd_Key.UP = 38;
hxd_Key.RIGHT = 39;
hxd_Key.DOWN = 40;
hxd_Key.INSERT = 45;
hxd_Key.DELETE = 46;
hxd_Key.NUMBER_0 = 48;
hxd_Key.NUMBER_1 = 49;
hxd_Key.NUMBER_2 = 50;
hxd_Key.NUMBER_3 = 51;
hxd_Key.NUMBER_4 = 52;
hxd_Key.NUMBER_5 = 53;
hxd_Key.NUMBER_6 = 54;
hxd_Key.NUMBER_7 = 55;
hxd_Key.NUMBER_8 = 56;
hxd_Key.NUMBER_9 = 57;
hxd_Key.NUMPAD_0 = 96;
hxd_Key.NUMPAD_1 = 97;
hxd_Key.NUMPAD_2 = 98;
hxd_Key.NUMPAD_3 = 99;
hxd_Key.NUMPAD_4 = 100;
hxd_Key.NUMPAD_5 = 101;
hxd_Key.NUMPAD_6 = 102;
hxd_Key.NUMPAD_7 = 103;
hxd_Key.NUMPAD_8 = 104;
hxd_Key.NUMPAD_9 = 105;
hxd_Key.A = 65;
hxd_Key.B = 66;
hxd_Key.C = 67;
hxd_Key.D = 68;
hxd_Key.E = 69;
hxd_Key.F = 70;
hxd_Key.G = 71;
hxd_Key.H = 72;
hxd_Key.I = 73;
hxd_Key.J = 74;
hxd_Key.K = 75;
hxd_Key.L = 76;
hxd_Key.M = 77;
hxd_Key.N = 78;
hxd_Key.O = 79;
hxd_Key.P = 80;
hxd_Key.Q = 81;
hxd_Key.R = 82;
hxd_Key.S = 83;
hxd_Key.T = 84;
hxd_Key.U = 85;
hxd_Key.V = 86;
hxd_Key.W = 87;
hxd_Key.X = 88;
hxd_Key.Y = 89;
hxd_Key.Z = 90;
hxd_Key.F1 = 112;
hxd_Key.F2 = 113;
hxd_Key.F3 = 114;
hxd_Key.F4 = 115;
hxd_Key.F5 = 116;
hxd_Key.F6 = 117;
hxd_Key.F7 = 118;
hxd_Key.F8 = 119;
hxd_Key.F9 = 120;
hxd_Key.F10 = 121;
hxd_Key.F11 = 122;
hxd_Key.F12 = 123;
hxd_Key.NUMPAD_MULT = 106;
hxd_Key.NUMPAD_ADD = 107;
hxd_Key.NUMPAD_ENTER = 108;
hxd_Key.NUMPAD_SUB = 109;
hxd_Key.NUMPAD_DOT = 110;
hxd_Key.NUMPAD_DIV = 111;
hxd_Key.MOUSE_LEFT = 0;
hxd_Key.MOUSE_RIGHT = 1;
hxd_Key.MOUSE_WHEEL_UP = 2;
hxd_Key.MOUSE_WHEEL_DOWN = 3;
hxd_Key.LOC_LEFT = 256;
hxd_Key.LOC_RIGHT = 512;
hxd_Key.LSHIFT = 272;
hxd_Key.RSHIFT = 528;
hxd_Key.LCTRL = 273;
hxd_Key.RCTRL = 529;
hxd_Key.LALT = 274;
hxd_Key.RALT = 530;
hxd_Key.initDone = false;
hxd_Key.keyPressed = [];
hxd_Math.PI = 3.14159265358979323;
hxd_Math.EPSILON = 1e-10;
hxd_Stage.ENABLE_TOUCH = true;
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
js_html_compat_Uint8Array.BYTES_PER_ELEMENT = 1;
Main.main();
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
