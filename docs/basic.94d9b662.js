parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"stiy":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.entityIdGenerator=m,exports.lsb=n,exports.msb=o,exports.toggleFunc=h,exports.setFunc=a,exports.unsetFunc=u,exports.and=l,exports.or=c,exports.xor=f,exports.BitSet=exports.multiplyDeBruijnBitPosition=exports.BITS_PER_INT=exports.Component=exports.World=exports.System=exports.Entity=void 0;class t{constructor(t){this.id=t,this.version=0}}exports.Entity=t;class e{}exports.System=e;const s=31;exports.BITS_PER_INT=s;const r=[0,1,28,2,29,14,24,3,30,22,20,15,25,17,4,8,31,27,13,23,21,19,16,7,26,12,18,6,11,5,10,9];exports.multiplyDeBruijnBitPosition=r;class i{constructor(t){let e,r,i,n,o;if(this.MAX_BIT=0,"number"==typeof t)t=t||s,e=Math.ceil(t/s),this.arr=new Uint32Array(e),this.MAX_BIT=t-1;else{if(r=JSON.parse("["+t+"]"),this.MAX_BIT=r.pop(),(n=r.pop())>0){for(i=[],o=0;o<n;o++)i[o]=0;for(o=0;o<r.length;o++)i[n+o]=r[o];r=i}e=Math.ceil((this.MAX_BIT+1)/s),this.arr=new Uint32Array(e),this.arr.set(r)}}get(t){const e=this.getWord(t);return-1!==e&&1==(this.arr[e]>>t%s&1)}set(t){const e=this.getWord(t);return-1!==e&&(this.arr[e]|=1<<t%s,!0)}setRange(t,e){return this.doRange(t,e,a)}unset(t){const e=this.getWord(t);return-1!==e&&(this.arr[e]&=~(1<<t%s),!0)}toggle(t){const e=this.getWord(t);return-1!==e&&(this.arr[e]^=1<<t%s,!0)}toggleRange(t,e){return this.doRange(t,e,h)}clear(){for(let t=0;t<this.arr.length;t++)this.arr[t]=0;return!0}clone(){return new i(this.dehydrate())}dehydrate(){let t,e,s=0,r=0;for(t=0;t<this.arr.length&&0===this.arr[t];t++)r++;for(t=this.arr.length-1;t>=r;t--)if(0!==this.arr[t]){s=t;break}for(e="",t=r;t<=s;t++)e+=this.arr[t]+",";return e+=r+","+this.MAX_BIT}and(t){return this.op(t,l)}or(t){return this.op(t,c)}xor(t){return this.op(t,f)}forEach(t){for(let e=this.ffs();-1!==e;e=this.nextSetBit(e+1))t(e)}circularShift(t){t=-t;const e=this,r=e.MAX_BIT+1,n=e.arr.length,o=s-(n*s-r),h=new i(r);let a=0,u=0,l=0,c=~~((t=(r+t%r)%r)/s)%n,f=t%s;for(;l<r;){const t=c===n-1?o:s;let r=e.arr[c];f>0&&(r>>>=f),u>0&&(r<<=u),h.arr[a]=h.arr[a]|r;const i=Math.min(s-u,t-f);l+=i,(u+=i)>=s&&(h.arr[a]=2147483647&h.arr[a],u=0,a++),(f+=i)>=t&&(f=0,c++),c>=n&&(c-=n)}return h.arr[n-1]=h.arr[n-1]&2147483647>>>s-o,h}getCardinality(){let t=0;for(let e=this.arr.length-1;e>=0;e--){let s=this.arr[e];t+=16843009*((s=(858993459&(s-=s>>1&1431655765))+(s>>2&858993459))+(s>>4)&252645135)>>24}return t}getIndices(){const t=[];return this.forEach(e=>{t.push(e)}),t}isSubsetOf(t){const e=this.arr,s=t.arr,r=e.length;for(let i=0;i<r;i++)if((e[i]&s[i])!==e[i])return!1;return!0}isEmpty(){let t,e;for(e=this.arr,t=0;t<e.length;t++)if(e[t])return!1;return!0}isEqual(t){let e;for(e=0;e<this.arr.length;e++)if(this.arr[e]!==t.arr[e])return!1;return!0}toString(){let t,e,r="";for(t=this.arr.length-1;t>=0;t--)r+=("0000000000000000000000000000000"+(e=this.arr[t].toString(2))).slice(-s);return r}ffs(t=0){let e,r,i=-1;for(r=t;r<this.arr.length;r++)if(0!==(e=this.arr[r])){i=n(e)+r*s;break}return i<=this.MAX_BIT?i:-1}ffz(t){let e,r,i=-1;for(e=t=t||0;e<this.arr.length;e++)if(2147483647!==(r=this.arr[e])){i=n(r^=2147483647)+e*s;break}return i<=this.MAX_BIT?i:-1}fls(t=this.arr.length-1){let e,r,i=-1;for(e=t;e>=0;e--)if(0!==(r=this.arr[e])){i=o(r)+e*s;break}return i}flz(t){let e,r,i=-1;for(void 0===t&&(t=this.arr.length-1),e=t;e>=0;e--){if(r=this.arr[e],e===this.arr.length-1){const t=this.MAX_BIT%s;r|=(1<<s-t-1)-1<<t+1}if(2147483647!==r){i=o(r^=2147483647)+e*s;break}}return i}nextSetBit(t){const e=this.getWord(t);if(-1===e)return-1;const r=t%s,i=(1<<s-r)-1<<r,o=this.arr[e]&i;return o>0?n(o)+e*s:this.ffs(e+1)}nextUnsetBit(t){const e=this.getWord(t);if(-1===e)return-1;const r=(1<<t%s)-1,i=this.arr[e]|r;return 2147483647===i?this.ffz(e+1):n(2147483647^i)+e*s}previousSetBit(t){const e=this.getWord(t);if(-1===e)return-1;const r=2147483647>>>s-t%s-1,i=this.arr[e]&r;return i>0?o(i)+e*s:this.fls(e-1)}previousUnsetBit(t){const e=this.getWord(t);if(-1===e)return-1;const r=t%s,i=(1<<s-r-1)-1<<r+1,n=this.arr[e]|i;return 2147483647===n?this.flz(e-1):o(2147483647^n)+e*s}getWord(t){return t<0||t>this.MAX_BIT?-1:~~(t/s)}doRange(t,e,r){let i,n,o,h;e<t&&(e^=t,e^=t^=e);const a=this.getWord(t),u=this.getWord(e);if(-1===a||-1===u)return!1;for(i=a;i<=u;i++)h=(o=i===u?e%s:s-1)-(n=i===a?t%s:0)+1,this.arr[i]=r(this.arr[i],h,n);return!0}op(t,e){let r,n,o,h,a,u;if(n=this.arr,"number"==typeof t)u=this.getWord(t),a=this.clone(),-1!==u&&(a.arr[u]=e(n[u],1<<t%s));else for(o=t.arr,h=n.length,a=new i(this.MAX_BIT+1),r=0;r<h;r++)a.arr[r]=e(n[r],o[r]);return a}}function n(t){return r[125613361*(t&-t)>>>27]}function o(t){return t|=t>>1,t|=t>>2,t|=t>>4,t|=t>>8,r[125613361*(t=1+((t|=t>>16)>>1))>>>27]}function h(t,e,s){return t^(1<<e)-1<<s}function a(t,e,s){return t|(1<<e)-1<<s}function u(t,e,s){return t&(2147483647^(1<<e)-1<<s)}function l(t,e){return t&e}function c(t,e){return t|e}function f(t,e){return t^e}exports.BitSet=i;class d{constructor(){this.bitmask=new i(0),this.map=new Map}get(t){const e=this.map.get(t);return null!=e?e:void 0}set(...t){let e=new i(0);for(const s of t)!1===this.map.has(s.constructor)&&(e=e.or(s.constructor.bitmask)),this.map.set(s.constructor,s);this.bitmask=this.bitmask.or(e)}remove(...t){let e=new i(0);for(const s of t)this.map.has(s)&&(e=e.or(s.bitmask)),this.map.delete(s);this.bitmask=this.bitmask.xor(e)}clear(){this.map.clear(),this.bitmask.clear()}keys(){return this.map.keys()}has(t){return this.map.has(t)}get size(){return this.map.size}}function*m(){let t=0;for(;;)++t,yield t}class p{constructor(t=m()){this.idGenerator=t,this.systems=[],this.systemsToRemove=[],this.systemsToAdd=[],this.entities=new Map,this.deletedEntities=new Set,this.componentEntities=new Map}update(t){this.updateSystems(t)}createEntity(){if(this.deletedEntities.size>0){const t=this.deletedEntities.values().next().value;return this.deletedEntities.delete(t),t}const e=new t(this.idGenerator.next().value);return this.entities.set(e,new d),e}deleteEntity(t){if(this.deletedEntities.has(t))return!1;if(this.entities.has(t)){const e=this.entities.get(t);for(const s of e.keys())this.componentEntities.get(s).delete(t);return e.clear(),this.deletedEntities.add(t),!0}return!1}findEntity(...t){if(0===t.length)return;if(!1===t.every(t=>this.componentEntities.has(t)))return;const e=t.map(t=>this.componentEntities.get(t)),s=e.reduce((t,e)=>(null==t?t=e:e.size<t.size&&(t=e),t)),r=e.filter(t=>t!==s);for(const i of s.values()){if(!0===r.every(t=>t.has(i)))return i}}addEntityComponents(t,...e){if(this.deletedEntities.has(t))throw new Error("Entity has been deleted");const s=this.entities.get(t);if(null!=s){s.set(...e);for(const e of s.keys())this.componentEntities.has(e)?this.componentEntities.get(e).add(t):this.componentEntities.set(e,new Set([t]))}return this}getEntityComponents(t){if(!this.deletedEntities.has(t))return this.entities.get(t)}removeEntityComponents(t,...e){if(this.deletedEntities.has(t))throw new Error("Entity has been deleted");const s=this.entities.get(t);return null!=s&&(s.remove(...e.map(t=>t.constructor)),e.forEach(e=>{const s=e.constructor;this.componentEntities.has(s)&&this.componentEntities.get(s).delete(t)})),this}addSystem(t){this.systemsToAdd.push(t)}removeSystem(t){this.systemsToRemove.push(t)}updateSystems(t){this.systemsToRemove.length>0&&(this.systems=this.systems.filter(t=>this.systemsToRemove.includes(t)),this.systemsToRemove=[]),this.systemsToAdd.length>0&&(this.systemsToAdd.forEach(t=>{!1===this.systems.includes(t)&&this.systems.push(t)}),this.systemsToAdd=[]);for(const e of this.systems)e.update(this,t)}view(...t){const e=new Map;if(0===t.length)return e;const s=t.map(t=>{if(!1===this.componentEntities.has(t))throw new Error(`Component ${t.name} not found`);return this.componentEntities.get(t)}),r=s.reduce((t,e)=>(null==t?t=e:e.size<t.size&&(t=e),t)),i=s.filter(t=>t!==r);for(const n of r){!0===i.every(t=>t.has(n))&&e.set(n,this.getEntityComponents(n))}return e}}function*g(){let t=1;for(;;){const e=new i(t);e.set(t-1),++t,yield e}}exports.World=p;class y{constructor(){this.__component=!0}static get bitmask(){return null==this._bitmask&&(this._bitmask=this._bitmaskGenerator.next().value),this._bitmask}}exports.Component=y,y._bitmaskGenerator=g();
},{}],"vHPO":[function(require,module,exports) {
var define;
var t;!function(n){function e(t){if(o=M(e),!(t<r+p)){for(u+=t-r,r=t,x(t,u),t>s+c&&(a=f*m*1e3/(t-s)+(1-f)*a,s=t,m=0),m++,l=0;u>=i;)if(S(i),u-=i,++l>=240){w=!0;break}b(u/i),y(a,w),w=!1}}var o,i=1e3/60,u=0,r=0,a=60,f=.9,c=1e3,s=0,m=0,l=0,p=0,d=!1,h=!1,w=!1,F="object"==typeof window?window:n,M=F.requestAnimationFrame||function(){var t,n,e=Date.now();return function(o){return t=Date.now(),n=Math.max(0,i-(t-e)),e=t+n,setTimeout(function(){o(t+n)},n)}}(),g=F.cancelAnimationFrame||clearTimeout,v=function(){},x=v,S=v,b=v,y=v;n.MainLoop={getSimulationTimestep:function(){return i},setSimulationTimestep:function(t){return i=t,this},getFPS:function(){return a},getMaxAllowedFPS:function(){return 1e3/p},setMaxAllowedFPS:function(t){return void 0===t&&(t=1/0),0===t?this.stop():p=1e3/t,this},resetFrameDelta:function(){var t=u;return u=0,t},setBegin:function(t){return x=t||x,this},setUpdate:function(t){return S=t||S,this},setDraw:function(t){return b=t||b,this},setEnd:function(t){return y=t||y,this},start:function(){return h||(h=!0,o=M(function(t){b(1),d=!0,r=t,s=t,m=0,o=M(e)})),this},stop:function(){return d=!1,h=!1,g(o),this},isRunning:function(){return d}},"function"==typeof t&&t.amd?t(n.MainLoop):"object"==typeof module&&null!==module&&"object"==typeof module.exports&&(module.exports=n.MainLoop)}(this);
},{}],"HrZ7":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Color=void 0;var e=require("@jakeklassen/ecs");class o extends e.Component{constructor(e){super(),this.color=e}}exports.Color=o;
},{"@jakeklassen/ecs":"stiy"}],"VT3m":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Rectangle=void 0;var e=require("@jakeklassen/ecs");class t extends e.Component{constructor(e,t,s,r){super(),this.x=e,this.y=t,this.width=s,this.height=r}}exports.Rectangle=t;
},{"@jakeklassen/ecs":"stiy"}],"r6OU":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Vector2=void 0;var e=require("@jakeklassen/ecs");class t extends e.Component{constructor(e=0,t=0){super(),this.x=0,this.y=0,this.x=e,this.y=t}static zero(){return new t(0,0)}}exports.Vector2=t;
},{"@jakeklassen/ecs":"stiy"}],"K6mT":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Transform=void 0;var e=require("@jakeklassen/ecs"),r=require("../vector2");class o extends e.Component{constructor(e=r.Vector2.zero()){super(),this.position=r.Vector2.zero(),this.position=e}}exports.Transform=o;
},{"@jakeklassen/ecs":"stiy","../vector2":"r6OU"}],"N8rm":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Velocity=void 0;var e=require("@jakeklassen/ecs");class s extends e.Component{constructor(e=0,s=0){super(),this.x=e,this.y=s}flipX(){this.x*=-1}flipY(){this.y*=-1}}exports.Velocity=s;
},{"@jakeklassen/ecs":"stiy"}],"BIpl":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("./color");Object.keys(e).forEach(function(r){"default"!==r&&"__esModule"!==r&&Object.defineProperty(exports,r,{enumerable:!0,get:function(){return e[r]}})});var r=require("./rectangle");Object.keys(r).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(exports,e,{enumerable:!0,get:function(){return r[e]}})});var t=require("./transform");Object.keys(t).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(exports,e,{enumerable:!0,get:function(){return t[e]}})});var n=require("./velocity");Object.keys(n).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(exports,e,{enumerable:!0,get:function(){return n[e]}})});
},{"./color":"HrZ7","./rectangle":"VT3m","./transform":"K6mT","./velocity":"N8rm"}],"JSPL":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.BallTag=void 0;var e=require("@jakeklassen/ecs");class s extends e.Component{}exports.BallTag=s;
},{"@jakeklassen/ecs":"stiy"}],"fK63":[function(require,module,exports) {
"use strict";var t=require("@jakeklassen/ecs"),e=s(require("mainloop.js")),o=require("../shared/components"),i=require("../shared/vector2"),n=require("./components/ball-tag");function s(t){return t&&t.__esModule?t:{default:t}}const r=document.querySelector("#canvas"),a=r.getContext("2d");if(null==a)throw new Error("failed to obtain canvas 2d context");const l=new t.World,c=l.createEntity();l.addEntityComponents(c,new n.BallTag,new o.Transform(new i.Vector2(10,10)),new o.Velocity(100,200),new o.Rectangle(10,10,12,12),new o.Color("red"));class h extends t.System{constructor(t){super(),this.viewport=t}update(t,e){const i=t.findEntity(n.BallTag);if(null==i)throw new Error("Entity with BallTag not found");const s=t.getEntityComponents(i),r=s.get(o.Rectangle),a=s.get(o.Transform),l=s.get(o.Velocity);a.position.x+=l.x*e,a.position.y+=l.y*e,a.position.x+r.width>this.viewport.width?(a.position.x=this.viewport.width-r.width,l.flipX()):a.position.x<0&&(a.position.x=0,l.flipX()),a.position.y+r.height>this.viewport.height?(a.position.y=this.viewport.height-r.height,l.flipY()):a.position.y<0&&(a.position.y=0,l.flipY())}}class p extends t.System{constructor(t){super(),this.context=t}update(t){this.context.clearRect(0,0,640,480);for(const[e,i]of t.view(o.Rectangle,o.Color,o.Transform)){const{color:t}=i.get(o.Color),{width:e,height:n}=i.get(o.Rectangle),s=i.get(o.Transform);this.context.fillStyle=t,this.context.fillRect(s.position.x,s.position.y,e,n)}}}l.addSystem(new h(new o.Rectangle(0,0,r.width,r.height))),l.addSystem(new p(a)),e.default.setUpdate(t=>{l.updateSystems(t/1e3)}).start();
},{"@jakeklassen/ecs":"stiy","mainloop.js":"vHPO","../shared/components":"BIpl","../shared/vector2":"r6OU","./components/ball-tag":"JSPL"}]},{},["fK63"], null)
//# sourceMappingURL=/ecs-examples/basic.94d9b662.js.map