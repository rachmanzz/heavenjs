(function (GLOBAL,MAIN) {
    typeof GLOBAL !== "undefined" ? MAIN(GLOBAL) :
        console.log('heavenJS just support a browser');
    
})(typeof window !== "undefined" ? window : this, function (__GLOBAL) {
    var isObject=function(v){
            return !Array.isArray(v) ? typeof v === "object" : false;
        },
        isUndef =function(v){
            return typeof v === "undefined";
        },
        isNull = function(v){
            return typeof v === "null";
        },
    // chek is array
        isArray =function(v){
            return Array.isArray(v);
        },
    // requestAjax
        reqAjax =function(obj,res){
            var xhttp = new XMLHttpRequest();

            xhttp.open(obj.method.toUpperCase(),
                obj.url, typeof obj.async !== "undefined" ?
                    obj.async : true);
            typeof obj.requestHeader !== "undefined" &&
            obj.requestHeader === "function" &&
            obj.requestHeader(xhttp);
            xhttp.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 200)
                    res(this.responseText,'success');
                if(this.status !== 200)
                    res(this.status,'error');
            };
            typeof obj.send !== "undefined" ? xhttp.send(obj.send) :
                xhttp.send();
        },
    // merger Object
        mObject = function(obj,obj1){
            for(var key in obj){
                if(obj1.hasOwnProperty(key) &&
                    isObject(obj[key]) && isObject(obj1[key]))
                    mObject(obj[key],obj1[key]);
                else obj1[key] = obj[key];
            }
            return obj1;
        },
    // data parsing
        parseData = function(v){
            var data={test:false,val:{}};
            if(/[\w]+ :: \[[A-Z]+\] [\w\D]+/.test(v)){
                v=v.match(/\@([\w]+) :: \[([A-Z]+)\] ([\w\D]+)/);
                data.test = true;
                data.val.request=new Object;
                data.val.request[v[1]]  = {
                    url : v[3],
                    method: v[2]
                }
            }
            if(/([\w]+) :: ([ \w]+)/.test(v)){
                v=v.match(/\@([\w]+) :: ([ \w]+)/);
                data.test = true;
                data.val.data=new Object;
                data.val.data[v[1]]  = v[2];
            }
            return data;
        },

        rExp    = function(v){
            this.Exp  = v;
            return this;
        };
            rExp.prototype={
                raw:function(){
                    var Exp = this.Exp;
                    return new RegExp(Exp);
                },
                get : function(d,f){
                    var Exp = this.Exp;
                    if(!isUndef(f)) Exp = new RegExp(Exp,f);
                    else Exp = new RegExp(Exp);
                    return d.match(Exp);
                }
            };
    Object.prototype.getProp = function (str) {
        var result=null;
        if(isObject(this) && typeof str === "string"){
            str = str.split('.');
            while (str.length) result=this[str.shift()];
        }
        return result;
    };

    var heavenJS = function (inst) {
        var storage ={data:{},request:{},autoRender:true, commandExclusive:true, symbolMapper:{at:"#"}},
            rawTpl;
        // store an object
        if(!isUndef(inst) && isObject(inst)){
            if(!isUndef(inst.vData) && isObject(inst.vData)) mObject(inst.vData,storage.data) && delete inst.vData;
            storage = mObject(inst,storage);
        }

        var setStorage  = function (d) {
                storage = mObject(d,storage);
        };
        var setData = function (key,d) {
                storage.data[key]=d;
        },
            setRequest = function (key,d) {
                storage.request[key]=d;
        },
            setRawTpl   =function (tpl) {
                rawTpl  =tpl;
        },
            getStorage  = function () {
                return storage;
        },
            getRawTpl   = function () {
                return rawTpl;
        };
        var commandExclusive=function (sel,tpl) {
            var control = document.querySelector('[control="'+storage.control+'"]');
            // chek and set template
            if(isUndef(rawTpl)) rawTpl=control.innerHTML;
            //chek and set selected template
            if(!isUndef(tpl)) control = control.querySelector(sel);
            var rawHTML = !isUndef(tpl) ? tpl : rawTpl;
            var exp = '<!--:';
                exp+= '[`~\\@#\\$\\%\\^\\&\\*\\(\\)\\-_=+\\{\\}\\[\\]\\|;:"\'\\<\\,\\>\\.\\?\\/\\w\\s]+';
                exp+= ':-->';
            var re  =new rExp(exp);
            if(re.raw().test(rawHTML)){
                var expCode =new rExp(/<!--:([\w\s\D]+):-->/);


                re.get(rawHTML,'g').forEach(function (so) {
                    var loop="";
                    if(expCode.raw().test(so)){
                        var rawCode = expCode.get(so)[1];
                        var vOb     = new rExp(storage.symbolMapper.at+"([\\w]+) :: ([\\w ]+)");
                        vOb.raw().test(rawCode) && vOb.get(rawCode,'g').forEach(function (index) {
                            index =vOb.get(index);
                            setData(index[1],index[2]);
                        });
                        var vRe     = new rExp(storage.symbolMapper.at+"([\\w]+) :: \\[([A-Z]+)\\] ([\\w\\?\\/\\@\\#\\$\\%\\&\\*:\\.\\,=]+)");
                        vRe.raw().test(rawCode) && vRe.get(rawCode,'g').forEach(function (index) {
                            index = vRe.get(index);
                            setRequest(index[1],{method:index[2],url:index[3]});
                        });
                        var vFu     = new rExp(/[~\w]+ :: [\w]+ [a-z]+ [\w]+\.\s[\?\{\}\(\)\[\]"`:+\@\*\$\/\.\^\,>%<=\s\w\-]+::end\./);
                        vFu.raw().test(rawCode) && vFu.get(rawCode,'g').forEach(function (index) {
                            //forEach
                            var fE = new rExp(/forEach :: ([\w]+) as ([\w]+)\.\s([\w\s\D]+)::end\./);
                            if(fE.raw().test(index)){
                                fE = fE.get(index);
                                var vO,asIs=fE[2], eL = fE[3];
                                if(storage.data.hasOwnProperty(fE[1])){
                                    vO = storage.data[fE[1]];
                                    isArray(vO) && vO.forEach(function(v){
                                        var nEl=eL;
                                        /::[\w]+\.[\.\w]+|::[\w]+/.test(eL) && eL
                                            .match(/::[\w]+\.[\.\w]+|::[\w]+/g).forEach(function(vE){
                                                var vOe;
                                                if(/::[\w]+\.[\.\w]+/.test(vE)){
                                                    vOe = vE.match(/::([\w]+)\.([\.\w]+)/);
                                                    if(asIs === vOe[1]) vOe = v.getProp(vOe[2]);
                                                    else if(storage.data.hasOwnProperty(vOe[1])) vOe= storage.data[vOe[1]].getProp(vOe[2]);
                                                }
                                                else {
                                                    vOe = vE.match(/::([\w]+)/)[1];
                                                    if(asIs === vOe) vOe = v;
                                                    else if(storage.data.hasOwnProperty(vOe)) vOe = storage.data[vOe]
                                                }
                                                nEl= nEl.replace(vE,vOe);
                                            });
                                        loop += nEl;
                                    });
                                }
                            }
                            //end forEach

                        });
                        var vEl     = new rExp(/[~\w]+ :: [\w]+\.\s[\?\{\}\(\)\[\]"`:+\@\*\$\/\.\^\,>%<=\s\w\-]+\s::end\./);
                        vEl.raw().test(rawCode) && vEl.get(rawCode,'g').forEach(function (index) {
                            var eL = new rExp(/return :: element\.\s([\w\s\D]+)::end\./);
                            if(eL.raw().test(index)){
                                eL = eL.get(index);
                                var patt= new rExp("::([\\w]+)\\.([\\.\\w]+)|::([\\w]+)"),
                                    nEl=eL[1];
                                patt.raw().test(eL[1]) && patt.get(eL[1],'g').forEach(function (v) {
                                    var vI= new rExp(/::([\w]+)/).get(v)[1],vO;
                                    if(storage.data.hasOwnProperty(vI)){
                                        if(/::[\w]+\.[\.\w]+/.test(v)){
                                            vO = v.match(/::[\w]+\.([\.\w]+)/);
                                            vO = storage.data[vI].getProp(vO[1]);
                                        }else vO=storage.data[vI];
                                        nEl = nEl.replace(v,vO);
                                    }
                                });
                                loop += nEl;
                            }
                        });
                        rawHTML = rawHTML.replace(so,loop);
                        control.innerHTML = rawHTML;
                    }
                });
            }
        };
        this.setStorage         = setStorage;
        this.setData            = setData;
        this.setRawTpl          = setRawTpl;
        this.getStorage         = getStorage;
        this.getRawTpl          = getRawTpl;
        this.commandExclusive   = commandExclusive;

        if(storage.autoRender && !isUndef(storage.control) && typeof storage.control === "string"){
            storage.commandExclusive && commandExclusive();
        }
    };
    heavenJS.prototype.control = function (cont) {
        typeof cont === "string" && this.setStorage({control:cont});
        return this;
    };
    heavenJS.prototype.data= function(key,arg){
        typeof key === "string" && this.setData(key,obj);
    };
    heavenJS.prototype.request=function(arg,render){
        var self    = this;
        var req     = new rExp(/^([\w]+) applyTo ([\w]+)/);
        var storage = this.getStorage(),
            renderTpl = this.render,
            setData   =this.setData;
        if(req.raw().test(arg)){
            var vO = req.get(arg);
            if(!isUndef(storage.request[vO[1]])){
                reqAjax(storage.request[vO[1]],function(res,status){
                    if(status == "success"){
                        var data = typeof res === "object" ? res : JSON.parse(res);
                        setData(vO[2],data);
                        if(!isUndef(render) && typeof render === "string"){
                            if(/^render\([\w\W]+\)/.test(render)){
                                render = render.match(/^render\(([\w\W]+)\)/)[1];
                                renderTpl(render,self);
                            }
                            else if(/^[\w]+/.test(render))
                                renderTpl('[stage="'+render+'"',self);
                        }
                    }
                });
            }
        }
    };
    heavenJS.prototype.render =function(selector,own){
        var parser = new DOMParser,
            self = isUndef(own) ? this : own,
            rawTpl = isUndef(self.getRawTpl()) ?
                document.querySelector('[control="'+self.getStorage().control+'"]') :
                self.getRawTpl();
        var documents    = parser.parseFromString(rawTpl, "text/html");
        var element  = documents.querySelector(selector);
        if(!isUndef(selector)) self.commandExclusive(selector,element.innerHTML);
        else self.commandExclusive();
    };
    __GLOBAL.heavenJS = heavenJS;
});