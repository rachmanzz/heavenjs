(function (GLOBAL,MAIN) {
    typeof GLOBAL !== "undefined" ? MAIN(GLOBAL) :
        console.log('heavenJS just support a browser');
    
})(typeof window !== "undefined" ? window : this, function (__GLOBAL) {
    var ajaxHeader;
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
            if(!isUndef(ajaxHeader)){
                ajaxHeader(xhttp);
            }
            if(!isUndef(obj.requestHeader)){
                obj.requestHeader(xhttp);
            }
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
        each = function (l,call) {
            var i=0;
            for(i; i < l.length; ++i){
                call(i,l[i]);
            }
        },
    // data parsing
        parentAttr =function (selector,callback) {
            if(selector.parentNode.getAttribute('stage') == null){
                parentAttr(selector.parentNode,parent);
            }
            else {
                callback(selector.parentNode);
            }
        },

        rExp    = function(v){
            this.Exp  = v;
            return this;
        },
        gForm   = function (f) {
            this.form = f;
            this.setValidate={};
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
            gForm.prototype = {
                attr:function (att) {
                    return this.form.getAttribute(att);
                },
                tObject: function () {
                    var val={},validate={},hasValidation=function (res) {
                        var result = false;
                        if(res.hasAttribute('h:validate') || res.hasAttribute('h:vld')) result = true;
                        return result;
                    },getValidation=function (res) {
                            var result;
                            if(res.hasAttribute('h:validate')) result = res.getAttribute('h:validate');
                            else if(res.hasAttribute('h:vld')) result = res.getAttribute('h:vld');
                            return result;
                     };
                    each(this.form,function (i,res) {
                        var attr=function (attr) {
                            return res.getAttribute(attr);
                        };
                        switch (res.tagName.toLowerCase()){
                            case "input":
                                if(res.hasAttribute('name')) val[attr('name')] = res.value;
                                if(hasValidation(res)) validate[attr('name')] = getValidation(res);
                                break;
                            case "textarea":
                                if(res.hasAttribute('name')) val[attr('name')] = res.value;
                                if(hasValidation(res)) validate[attr('name')] = getValidation(res);
                                break;
                            case "select":
                                if(res.hasAttribute('name')) val[attr('name')] = res.value;
                                if(hasValidation(res)) validate[attr('name')] = getValidation(res);
                        }
                    });
                    this.setValidate = validate;
                    return val;
                },
                getValidation : function () {
                    return this.setValidate;
                }
            };
    Object.defineProperty(Object.prototype, 'getProp',{
        value : function (str) {
            var result=null;
            if(isObject(this) && typeof str === "string"){
                str = str.split('.');
                while (str.length) result=this[str.shift()];
            }
            return result;
        },
        enumerable : false
    });

    var heavenJS = function (inst) {
        var storage ={data:{},request:{},autoRender:true, commandExclusive:true, symbolMapper:{at:"#"}},
            rawTpl,asset={};
        // store an object
        if(!isUndef(inst) && isObject(inst)){
            if(!isUndef(inst.requestHeader)){
                ajaxHeader = inst.requestHeader;
                delete inst.requestHeader;
            }
            if(!isUndef(inst.vData) && isObject(inst.vData)) mObject(inst.vData,storage.data) && delete inst.vData;
            storage = mObject(inst,storage);
        }

        var setStorage  = function (d) {
                storage = mObject(d,storage);
        };
        var setData = function (key,d) {
            if(isObject(d)) storage.data[key]=mObject(d,storage.data[key]);
            else storage.data[key] =d;
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
                exp+= '[`~\\@#\\$\\%\\^\\&\\*\\(\\)\\-_=+\\{\\}\\[\\]\\|;:"\'\\<\\,\\>\\.\\?\\/\\w\\s\\|]+';
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
                        var vRe     = new rExp(storage.symbolMapper.at+"([\\w]+) :: \\[([A-Z]+)\\] ([\\-\\w\\?\\/\\@\\#\\$\\%\\&\\*:\\.\\,=]+)");
                        vRe.raw().test(rawCode) && vRe.get(rawCode,'g').forEach(function (index) {
                            index = vRe.get(index);
                            setRequest(index[1],{method:index[2],url:index[3]});
                        });
                        var vFu     = new rExp(/[~\w]+ :: [\w]+ [a-z]+ [\w]+\.\s[\?\{\}\(\)\[\]"`:+\@#\&\*\$\/\.\^\,>%<=\s\w\-\|\\]+::end\./);
                        vFu.raw().test(rawCode) && vFu.get(rawCode,'g').forEach(function (index) {
                            //forEach
                            var fE = new rExp(/forEach :: ([\w]+) as ([\w]+)\.\s([\w\s\D]+)::end\./);
                            if(fE.raw().test(index)){
                                fE = fE.get(index);
                                var vO,asIs=fE[2], eL = fE[3],num;
                                if(!isUndef(asset[fE[1]]) && !isUndef(asset[fE[1]].num)) num =asset[fE[1]].num;
                                if(storage.data.hasOwnProperty(fE[1])){
                                    vO = storage.data[fE[1]];
                                    isArray(vO) && vO.forEach(function(v){
                                        var nEl=eL;
                                        /::[\w]+\.[\.\w]+|::[\w\(\)]+/.test(eL) && eL
                                            .match(/::[\w]+\.[\.\w]+|::[\w]+\{[ \,\.><#\&\|"'\+\=\-\%\*\?\/\:\w\(\)]+\}|::[\w]+/g).forEach(function(vE){
                                                var vOe;
                                                if(/::[\w]+\{[ \,\.><#\&\|"'\+\=\-\%\*\?\/\:\w\(\)]+\}/.test(vE)){
                                                    var vOf = vE.match(/::([\w]+)\{([ \D\w]+)\}/);
                                                    if(vOf[1] === 'loop'){
                                                        if(isUndef(num)) num =parseInt(vOf[2]);
                                                        vOe = num;
                                                        num++;
                                                    }else if(vOf[1] === 'js'){
                                                        var vOb = new rExp(/[a-zA-Z]+[\w\.]+/);
                                                        vOb.raw().test(vOf[2]) && vOb.get(vOf[2],'g').forEach(function (oL) {
                                                            var vOl;
                                                            if(/[\w]+\.[\w\.]+/.test(oL)){
                                                                vOl = oL.match(/([\w]+)\.([\.\w]+)/);
                                                                if(asIs === vOl[1]) vOl = v.getProp(vOl[2]);
                                                                else if(storage.data.hasOwnProperty(vOl[1])) vOl= storage.data[vOl[1]].getProp(vOl[2]);
                                                            }else{
                                                                vOl = oL.match(/([\w]+)/)[1];
                                                                if(asIs === vOl) vOl = v;
                                                                else if(storage.data.hasOwnProperty(vOl)) vOl = storage.data[vOl]
                                                            }
                                                            if(!isUndef(vOl)) vOf[2] = vOf[2].replace(oL,vOl);
                                                        });
                                                        if(/\&not/.test(vOf[2])) vOf[2]=vOf[2].replace(/\&not/,'!==');
                                                        vOe = eval(vOf[2]);
                                                    }

                                                }
                                                else if(/::[\w]+\.[\.\w]+/.test(vE)){
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
                        var vEl     = new rExp(/[~\w]+ :: [\w]+\.\s[\&\#\?\{\}\(\)\[\]"`:+\@\*\$\/\.\^\,>%<=\s\w\-\|\\]+\s::end\./);
                        vEl.raw().test(rawCode) && vEl.get(rawCode,'g').forEach(function (index) {
                            var eL = new rExp(/return :: element\.\s([\w\s\D]+)::end\./);
                            if(eL.raw().test(index)){
                                eL = eL.get(index);
                                var patt= new rExp("::([\\w]+)\\.([\\.\\w]+)|::[\\w]+\\{[ \\,\\.><#\\&\\|\"'\\+\\=\\-\\%\\*\\?\\/\\:\\w\\(\\)]+\\}|::([\\w]+)"),
                                    nEl=eL[1];
                                patt.raw().test(eL[1]) && patt.get(eL[1],'g').forEach(function (v) {
                                    var vI= new rExp(/::([\w]+)/).get(v)[1],vO;
                                    if(/::js\{[ \,\.><#\&\|"'\+\=\-\%\*\?\/\:\w\(\)]+\}/.test(v)) {
                                        var vOf = v.match(/::[\w]+\{([ \D\w]+)\}/);
                                            var vOb = new rExp(/[a-zA-Z]+[\w\.]+/);
                                            vOb.raw().test(vOf[1]) && vOb.get(vOf[1],'g').forEach(function (oL) {
                                                var vOl;
                                                if (/[\w]+\.[\w\.]+/.test(oL)) {
                                                    vOl = oL.match(/([\w]+)\.([\.\w]+)/);
                                                    if (storage.data.hasOwnProperty(vOl[1])) vOl = storage.data[vOl[1]].getProp(vOl[2]);
                                                } else {
                                                    vOl = oL.match(/([\w]+)/)[1];
                                                    if (storage.data.hasOwnProperty(vOl)) vOl = storage.data[vOl]
                                                }
                                                if (!isUndef(vOl)) vOf[1] = vOf[1].replace(oL, vOl);
                                            });
                                            if (/\&not/.test(vOf[1])) vOf[1] = vOf[1].replace(/\&not/, '!==');
                                            vO = eval(vOf[1]);
                                    }
                                    else if(storage.data.hasOwnProperty(vI)){
                                        if(/::[\w]+\.[\.\w]+/.test(v)){
                                            vO = v.match(/::[\w]+\.([\.\w]+)/);
                                            vO = storage.data[vI].getProp(vO[1]);
                                        }else vO=storage.data[vI];
                                    }
                                    nEl = nEl.replace(v,vO);
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
        this.asset              = function (key) {
            return asset[key];
        };

        if(storage.autoRender && !isUndef(storage.control) && typeof storage.control === "string"){
            storage.commandExclusive && commandExclusive();
        }
    };
    heavenJS.prototype.control = function (cont) {
        typeof cont === "string" && this.setStorage({control:cont});
        return this;
    };
    heavenJS.prototype.data= function(key,arg){
        typeof key === "string" && this.setData(key,arg);
    };
    heavenJS.prototype.request=function(arg,render){
        var self    = this;
        var req     = new rExp(/^([\w]+) applyTo ([\w]+)$|^([\w]+)$/);
        var storage = this.getStorage(),
            renderTpl = this.render,
            setData   =this.setData;
        if(req.raw().test(arg)){
            var vO = /^([\w]+) applyTo ([\w]+)$/.test(arg) ? arg.match(/^([\w]+) applyTo ([\w]+)$/):
                arg.match(/^([\w]+)$/);
            if(!isUndef(storage.request[vO[1]])){
                reqAjax(storage.request[vO[1]],function(res,status){
                    if(status == "success"){
                        var rendering=function (render) {
                            if(typeof render === "string"){
                                if(/^render\([\w\W]+\)/.test(render)){
                                    render = render.match(/^render\(([\w\W]+)\)/)[1];
                                    renderTpl(render,self);
                                }
                                else if(/^[\w]+/.test(render))
                                    renderTpl('[stage="'+render+'"',self);
                            }
                        };
                        var data = typeof res === "object" ? res : JSON.parse(res);
                        if(!/^([\w]+) applyTo ([\w]+)$/.test(arg)){
                            render(data);
                        }else{
                            if(!isUndef(render) && typeof render === "function"){
                                render({
                                    nData : function (nData) {
                                        if(isObject(nData)) setData(vO[2],mObject(nData,data));
                                        else setData(vO[2],nData);
                                    },
                                    eRender : function (render) {
                                        var nData={};
                                        if(isUndef(this.nData)){
                                            for(var key in this){
                                                if(key !== 'eRender' || key !==nData) nData[key] = this[key];
                                            }
                                            setData(vO[2],mObject(nData,data));
                                        }
                                        rendering(render);
                                    }
                                },data);
                            }
                            else{
                                setData(vO[2],data);
                                rendering(render);
                            }
                        }
                    }
                });
            }
        }
    };
    heavenJS.prototype.form = function (sel,req) {
        document.querySelector('body')
            .onsubmit = function (e) {
            if(e.target.getAttribute('h:submit') === sel){
                e.preventDefault();
                tForm = e.target;
                var nForm = new gForm(tForm.querySelectorAll('[name]'));
                var fData = nForm.tObject();
                var vldMess = {};
                var validation = nForm.getValidation();
                if(!isUndef(req) && isObject(req)){
                    req.autoSend = true;
                    req.notValid = false;
                    // add rules validation
                    req.validation = function (vld) {
                        validation = mObject(vld,validation);
                    };
                    //end rules
                    // before process
                    if(!isUndef(req.before())) req.before({add:function () {
                        for(var key in this){
                            if(typeof this[key] !== "function") fData[key] = this[key];
                        }
                    }});
                    // end before
                    if(Object.getOwnPropertyNames(validation).length !== 0){
                        // validator rules
                        for(var key in validation){
                            if(fData.hasOwnProperty(key)){
                                if(typeof validation[key] === "function"){
                                }
                                else{
                                    // looping validation rules
                                    var res = validation[key].split('|');
                                    each(res,function (i,val) {
                                        if(val === "required"){
                                            var mess = {code:1,message:'field required'};
                                            if(fData[key].length === 0) {
                                                if(vldMess.hasOwnProperty(key)) vldMess[key].push(mess);
                                                else vldMess[key] =  [mess];
                                            }
                                        }
                                        if(/^min:[0-9]+$/.test(val)){
                                            var min = val.match(/^min:([0-9]+)$/)[1];
                                            var mess={code:2,message:'field length less than '+min};
                                            if(fData[key].length < min){
                                                if(vldMess.hasOwnProperty(key)) vldMess[key].push(mess);
                                                else vldMess[key] =  [mess];
                                            }
                                        }
                                        if(/^max:[0-9]+$/.test(val)){
                                            var max = val.match(/^max:([0-9]+)$/)[1];
                                            var mess={code:3,message:'field length more than '+max};
                                            if(fData[key].length > max){
                                                if(vldMess.hasOwnProperty(key)) vldMess[key].push(mess);
                                                else vldMess[key] =  [mess];
                                            }
                                        }
                                        if(/^eq:[\w]+$/.test(val)){
                                            var eq = val.match(/^eq:([\w]+)$/)[1];
                                            var mess={code:4,message:key+ ' not match with '+eq};
                                            if(fData[key] !== fData[eq]){
                                                if(vldMess.hasOwnProperty(key)) vldMess[key].push(mess);
                                                else vldMess[key] =  [mess];
                                            }
                                        }
                                        if(val === 'email' && !/^[_\.\w]+\@[_\.\w]+/.test(fData[key])){
                                            var mess = {code:5,message:'email field incorrect'};
                                            if(vldMess.hasOwnProperty(key)) vldMess[key].push(mess);
                                            else vldMess[key] =  [mess];
                                        }
                                        if(/^\[[-+\w]+\]$/.test(val)){
                                            var exp = new rExp(val+'+');
                                            var mess = {code:6,message:'field is incorrect'};
                                            if(!exp.raw().test(fData[key])){
                                                if(vldMess.hasOwnProperty(key)) vldMess[key].push(mess);
                                                else vldMess[key] =  [mess];
                                            }
                                        }
                                    });
                                }
                            }
                        }
                        //end validator
                    }
                    // if error rules error
                    if(Object.getOwnPropertyNames(vldMess).length !== 0){
                        req.notValid = true;
                        req.validateError = vldMess;

                    }
                    // end error rules
                    else{
                        if(req.autoSend){
                            var mForm= new gForm(tForm),
                                fSetup={url:mForm.attr('action'),method:mForm.attr('method'),send:JSON.stringify(fData),
                                    requestHeader : function (xhttp) {
                                        xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
                                    }
                                };
                            reqAjax(fSetup,function (data,status) {
                                !isUndef(req.onReceive) && req.onReceive(data,status);
                            });

                        }
                    }
                    !isUndef(req.readyState) && req.readyState();
                }

            }
        };
    };
    heavenJS.prototype.helpme=function (data) {
        data({render:function () {
            for(var key in this){
                console.log(key);
            }
        }});
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