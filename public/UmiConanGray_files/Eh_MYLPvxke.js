if (self.CavalryLogger) { CavalryLogger.start_js(["5G3P3"]); }

__d("JSLogger",["lowerFacebookDomain"],(function(a,b,c,d,e,f){__p&&__p();var g={MAX_HISTORY:500,counts:{},categories:{},seq:0,pageId:(Math.random()*2147483648|0).toString(36),forwarding:!1};function h(a){if(a=="/"||a.indexOf("/",1)<0)return!1;var b=/^\/(v\d+\.\d\d?|head)\//.test(a);return b?/^\/(dialog|plugins)\//.test(a.substring(a.indexOf("/",1))):/^\/(dialog|plugins)\//.test(a)}function i(b){b instanceof Error&&a.ErrorUtils&&(b=a.ErrorUtils.normalizeError(b));try{return JSON.stringify(b)}catch(a){return"{}"}}function j(a,b,c){g.counts[a]||(g.counts[a]={}),g.counts[a][b]||(g.counts[a][b]=0),c=c==null?1:Number(c),g.counts[a][b]+=isFinite(c)?c:0}g.logAction=function(a,b,c){__p&&__p();if(this.type=="bump")j(this.cat,a,b);else if(this.type=="rate")b&&j(this.cat,a+"_n",c),j(this.cat,a+"_d",c);else{c={cat:this.cat,type:this.type,event:a,data:b!=null?i(b):null,date:Date.now(),seq:g.seq++};g.head=g.head?g.head.next=c:g.tail=c;while(g.head.seq-g.tail.seq>g.MAX_HISTORY)g.tail=g.tail.next;return c}};function c(c){__p&&__p();if(!g.categories[c]){g.categories[c]={};var d=function(d){__p&&__p();var e={cat:c,type:d};g.categories[c][d]=function(){__p&&__p();g.forwarding=!1;var c=null;if(b("lowerFacebookDomain").isValidDocumentDomain())return;c=g.logAction;if(h(location.pathname))g.forwarding=!1;else try{c=a.top.require("JSLogger")._.logAction,g.forwarding=c!==g.logAction}catch(a){}c&&c.apply(e,arguments)}};d("debug");d("log");d("warn");d("error");d("bump");d("rate")}return g.categories[c]}function d(a,b){var c=[];for(var b=b||g.tail;b;b=b.next)if(!a||a(b)){var d={type:b.type,cat:b.cat,date:b.date,event:b.event,seq:b.seq};b.data&&(d.data=JSON.parse(b.data));c.push(d)}return c}e.exports={_:g,DUMP_EVENT:"jslogger/dump",create:c,getEntries:d}}),null);
__d("BanzaiScuba",["Banzai","FBLogger"],(function(a,b,c,d,e,f){__p&&__p();var g="scuba_sample";a=function(){"use strict";__p&&__p();function a(a,c,d){this.posted=!1,a||b("FBLogger")("BanzaiScuba").warn("Can't post a sample without a dataset"),this.dataset=a,this.$1=c,this.options=d}var c=a.prototype;c.$2=function(a,c,d){if(this.posted){b("FBLogger")("BanzaiScuba").warn("Trying to add to an already posted sample");return a}a=a||{};a[c]=d;return a};c.addNormal=function(a,b){this.normal=this.$2(this.normal,a,b);return this};c.addInteger=function(a,b){this["int"]=this.$2(this["int"],a,b);return this};c.addDenorm=function(a,b){this.denorm=this.$2(this.denorm,a,b);return this};c.addTagSet=function(a,b){this.tags=this.$2(this.tags,a,b);return this};c.addNormVector=function(a,b){this.normvector=this.$2(this.normvector,a,b);return this};c.post=function(a){__p&&__p();if(this.posted){b("FBLogger")("BanzaiScuba").warn("Trying to re-post");return}if(!this.dataset)return;var c={};c._ds=this.dataset;c._options=this.options;this.normal&&(c.normal=this.normal);this["int"]&&(c["int"]=this["int"]);this.denorm&&(c.denorm=this.denorm);this.tags&&(c.tags=this.tags);this.normvector&&(c.normvector=this.normvector);this.$1!==null&&this.$1!==""&&this.$1!==void 0&&(c._lid=this.$1);b("Banzai").post(g,c,a);this.posted=!0};return a}();e.exports=a}),null);
__d("monitorCodeUse",["invariant","BanzaiScuba","ErrorNormalizeUtils","ScriptPath","SiteData","forEachObject","gkx","ReactCurrentOwner"],(function(a,b,c,d,e,f,g){__p&&__p();function h(a){a=a.type;if(typeof a==="string")return a;return typeof a==="function"?a.displayName||a.name:null}function i(a){var b=1e3,c=[];while(a&&c.length<b)c.push(h(a)||""),typeof a.tag==="number"?a=a["return"]:a=a._currentElement&&a._currentElement._owner;return c}function j(a){return Array.isArray(a)?"[...]":k(a)}function k(a){__p&&__p();if(a==null)return""+String(a);if(Array.isArray(a)){if(a.length>10){var b=a.slice(0,5).map(j);return"["+b.join(", ")+", ...]"}b=a.map(j);return"["+b.join(", ")+"]"}if(typeof a==="string")return"'"+a+"'";if(typeof a==="object"){b=Object.keys(a).map(function(a){return a+"=..."});return"{"+b.join(", ")+"}"}return String(a)}function l(a){return a.identifier||""}function m(a){var b;return a.script+"  "+((b=a.line)!=null?b:"")+":"+((b=a.column)!=null?b:"")}var n;function a(a,c,d){__p&&__p();c===void 0&&(c={});d===void 0&&(d={});a&&!/[^a-z0-9_]/.test(a)||g(0,2789);var e={};d.sampleRate!=null&&(e.sampleRate=d.sampleRate);var f=new(b("BanzaiScuba"))("core_monitor",null,e);f.addNormal("event",a);n===void 0&&(n=b("gkx")("708253"));f.addNormal("is_comet",n);e=b("ReactCurrentOwner");f.addNormVector("owners",i(e.current));f.addNormal("uri",window.location.href);f.addNormal("script_path",b("ScriptPath").getScriptPath());f.addNormal("devserver_username",b("SiteData").devserver_username||"");e=!1;d.forceIncludeStackTrace&&(e=!0);if(e)try{d=new Error(a);d.framesToPop=1;e=b("ErrorNormalizeUtils").normalizeError(d).stackFrames;a=e.map(l);d=e.map(m).join("\n");f.addNormVector("stacktrace",a);f.addDenorm("stack",d)}catch(a){}b("forEachObject")(c,function(a,b,c){typeof a==="string"?f.addNormal(b,a):typeof a==="number"&&(a|0)===a?f.addInteger(b,a):Array.isArray(a)?f.addNormVector(b,a.map(k)):f.addNormal(b,k(a))});f.post()}e.exports=a}),null);
__d("concatArrays",[],(function(a,b,c,d,e,f){function a(a){var b;return(b=[]).concat.apply(b,a)}e.exports=a}),null);
__d("distinctArray",[],(function(a,b,c,d,e,f){__p&&__p();function a(a){__p&&__p();if(a==null)return[];if(Array.isArray(a)){var b=a.length;if(b<=200){var c=[];for(var d=0;d<b;d++){var e=a[d];c.indexOf(e)===-1&&c.push(e)}return c}}return Array.from(new Set(a).values())}e.exports=a}),null);
__d("Dispatcher_DEPRECATED",["invariant","FBLogger","monitorCodeUse"],(function(a,b,c,d,e,f,g){"use strict";__p&&__p();var h="ID_";a=function(){__p&&__p();function a(){this.$1=new Map(),this.$2=!1,this.$3=new Map(),this.$4=new Map(),this.$5=1}var b=a.prototype;b.register=function(a,b){b=this.__genID(b);this.$1.set(b,a);return b};b.unregister=function(a){this.$1.get(a)||g(0,1331,a),this.$1["delete"](a)};b.waitFor=function(a){__p&&__p();this.$2||g(0,1332);for(var b=0;b<a.length;b++){var c=a[b];if(this.$4.get(c)){this.$3.get(c)||g(0,2380,c);continue}this.$1.get(c)||g(0,2381,c);this.$7(c)}};b.dispatch=function(a){var b=this;j(this.$2,this.$6,a);this.$8(a);try{this.$1.forEach(function(a,c){if(b.$4.get(c))return;b.$7(c)})}finally{this.$9()}};b.isDispatching=function(){return this.$2};b.$7=function(a){this.$4.set(a,!0);var b=this.$1.get(a);b&&this.__invokeCallback(a,b,this.$6);this.$3.set(a,!0)};b.__invokeCallback=function(a,b,c){b(c)};b.$8=function(a){__p&&__p();for(var b=this.$1.keys(),c=Array.isArray(b),d=0,b=c?b:b[typeof Symbol==="function"?Symbol.iterator:"@@iterator"]();;){var e;if(c){if(d>=b.length)break;e=b[d++]}else{d=b.next();if(d.done)break;e=d.value}e=e;this.$4.set(e,!1);this.$3.set(e,!1)}this.$6=a;this.$2=!0};b.$9=function(){delete this.$6,this.$2=!1};b.__genID=function(a){var b=a?a+"_":h;a=a||b+this.$5++;while(this.$1.get(a))a=b+this.$5++;return a};return a}();function i(a){__p&&__p();var b="<unknown>";if(!a)return b;if(typeof a.type==="string")return a.type;if(typeof a.actionType==="string")return a.actionType;if(!a.action)return b;if(typeof a.action.type==="string")return a.action.type;return typeof a.action.actionType==="string"?a.action.actionType:b}function j(a,c,d){if(a){a=new Error("Cannot dispatch in the middle of a dispatch");b("FBLogger")("flux_dispatcher").catching(a).mustfix("Tried to dispatch action %s while already dispatching %s",i(d),i(c));throw a}}e.exports=a}),null);
__d("ExplicitRegistrationDispatcherUtils",["emptyFunction","gkx","setImmediate"],(function(a,b,c,d,e,f){"use strict";a=!1;c=b("emptyFunction");e.exports={warn:c,inlineRequiresEnabled:a}}),null);
__d("ExplicitRegistrationDispatcher",["Dispatcher_DEPRECATED","ExplicitRegistrationDispatcherUtils","setImmediate"],(function(a,b,c,d,e,f){"use strict";__p&&__p();a=function(a){__p&&__p();babelHelpers.inheritsLoose(b,a);function b(b){var c;b=b.strict;c=a.call(this)||this;c.$ExplicitRegistrationDispatcher2=b;c.$ExplicitRegistrationDispatcher1={};return c}var c=b.prototype;c.explicitlyRegisterStore=function(a){a=a.getDispatchToken();this.$ExplicitRegistrationDispatcher1[a]=!0;return a};c.explicitlyRegisterStores=function(a){var b=this;return a.map(function(a){return b.explicitlyRegisterStore(a)})};c.register=function(b,c){var d=this;d=this.__genID(c);this.$ExplicitRegistrationDispatcher1[d]=!1;c=a.prototype.register.call(this,this.$ExplicitRegistrationDispatcher4.bind(this,d,b),d);return c};c.$ExplicitRegistrationDispatcher4=function(a,b,c){(this.$ExplicitRegistrationDispatcher1[a]||!this.$ExplicitRegistrationDispatcher2)&&this.__invokeCallback(a,b,c)};c.unregister=function(b){a.prototype.unregister.call(this,b),delete this.$ExplicitRegistrationDispatcher1[b]};c.__getMaps=function(){};return b}(b("Dispatcher_DEPRECATED"));e.exports=a}),null);
__d("FluxStoreInstrumentation",["invariant"],(function(a,b,c,d,e,f,g){"use strict";var h=null;a={inject:function(a){h==null||g(0,2260),h=a},onEmitChange:function(a){return h?h.emitChange(a):null}};e.exports=a}),null);
__d("FluxStore",["invariant","EventEmitter","FluxStoreInstrumentation","concatArrays","distinctArray"],(function(a,b,c,d,e,f,g){"use strict";__p&&__p();a=function(){__p&&__p();function a(a){this.__className=this.constructor.name,this.__moduleID=this.constructor.__moduleID,this.__changed=!1,this.__changeEvent="change",this.__dispatcher=a,this.__emitter=new(b("EventEmitter"))(),this.$3=!1,this.__registerDispatcherCallback(a)}var c=a.prototype;c.__registerDispatcherCallback=function(a){var b=this;this.$2=a.register(function(a){return b.__invokeOnDispatch(a)},this.__getIDForDispatcher(),this,this.__moduleID)};c.addListener=function(a){return this.__emitter.addListener(this.__changeEvent,a)};c.getActionTypes=function(){__p&&__p();if(!this.$1){var a=this.__getActionTypes();if(a!=null){var c=this.getDependencyStores();if(c.length>0){var d=!1;c=b("concatArrays")(c.map(function(a){a=a&&a.getActionTypes?a.getActionTypes():null;a==null&&(d=!0);return a}).filter(Boolean));d?a=null:a=b("distinctArray")(a.concat(c))}}this.$1=a}return this.$1};c.getDispatcher=function(){return this.__dispatcher};c.getDispatchToken=function(){return this.$2};c.getDependencyDispatchTokens=function(){this.$5||(this.$5=this.getDependencyStores().map(function(a){return a&&a.getDispatchToken&&a.getDispatchToken()}));return this.$5};c.getDependencyStores=function(){this.$4||(this.$4=b("distinctArray")(this.__getDependencyStores()));return this.$4};c.addStoreDependency=function(a){var b=this.__dispatcher.registerDependency;b&&b(this.getDispatchToken(),a.getDispatchToken())};c.hasChanged=function(){this.__dispatcher.isDispatching()||g(0,1147,this.__className);return this.__changed};c.__setAsUnchanged=function(){this.__changed=!1};c.__emitChange=function(){this.__dispatcher.isDispatching()||g(0,1148,this.__className);if(this.__changed)return;b("FluxStoreInstrumentation").onEmitChange(this.__moduleID!=null?this.__moduleID:"unknown");this.__changed=!0};c.__invokeOnDispatch=function(a){this.__changed=!1,this.__onDispatch(a),this.__inform()};c.__inform=function(a){this.$3=this.__changed||this.$3;var b=this.__dispatcher.shouldAllowInforms==null||this.__dispatcher.shouldAllowInforms();b&&this.$3&&(this.$3=!1,this.__emitter.emit(a||this.__changeEvent))};c.__onDispatch=function(a){g(0,1149,this.__className)};c.__getActionTypes=function(){return null};c.__getDependencyStores=function(){return[]};c.__getIDForDispatcher=function(){return this.__className};return a}();a;e.exports=a}),null);
__d("TypedFluxStore",["FluxStore"],(function(a,b,c,d,e,f){"use strict";e.exports=b("FluxStore")}),null);
__d("abstractMethod",["invariant"],(function(a,b,c,d,e,f,g){"use strict";function a(a,b){g(0,1537,a,b)}e.exports=a}),null);
__d("FluxReduceStore",["invariant","TypedFluxStore","abstractMethod"],(function(a,b,c,d,e,f,g){"use strict";__p&&__p();a=function(a){__p&&__p();babelHelpers.inheritsLoose(c,a);function c(b){b=a.call(this,b)||this;b.$FluxReduceStore1=b.getInitialState();return b}var d=c.prototype;d.getState=function(){return this.$FluxReduceStore1};d.getInitialState=function(){return b("abstractMethod")("FluxReduceStore","getInitialState")};d.reduce=function(a,c){return b("abstractMethod")("FluxReduceStore","reduce")};d.areEqual=function(a,b){return a===b};d.__invokeOnDispatch=function(a,b){b===void 0&&(b=!0);this.__changed=!1;var c=this.$FluxReduceStore1;a=this.reduce(c,a);a!==void 0||g(0,2189,this.constructor.name);this.areEqual(c,a)||(this.$FluxReduceStore1=a,this.__emitChange());b&&this.__inform()};d.__setState=function(a){this.$FluxReduceStore1=a};return c}(b("TypedFluxStore"));a.__moduleID=e.id;e.exports=a}),null);
__d("fbglyph",[],(function(a,b,c,d,e,f){function a(a){throw new Error("fbglyph("+JSON.stringify(a)+"): Unexpected fbglyph reference.")}e.exports=a}),null);
__d("requestIdleCallback",["requireCond","cr:694370"],(function(a,b,c,d,e,f){e.exports=b("cr:694370")}),null);
__d("cssVar",[],(function(a,b,c,d,e,f){function a(a){throw new Error('cssVar("'+a+'"): Unexpected class transformation.')}e.exports=a}),null);