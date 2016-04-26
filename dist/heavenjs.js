/**
 * Created by Quesha-Lania on 22/04/2016.
 */
(function (GLOBAL,$,heavenJS) {
    if(typeof GLOBAL != 'undefined' && typeof $ !== 'undefined'){
        GLOBAL.heavenJS=heavenJS($);
    }else{
        GLOBAL.heavenJS= function () {
            console.log("jQuery is undefined");
        };
    }
})(window,jQuery, function ($) {
    function getLength(l){
        var length;
        if(typeof Object.keys(l).length != "undefined"){
            length=Object.keys(l).length;
        }else{
            var count = 0;
            var i;

            for (i in l) {
                if (l.hasOwnProperty(i)) {
                    count++;
                }
            }
            length=count;
        }
        return length;
    }
    function each(each){
        var convertHtml;
        $.each(each.obj, function (key,value) {
            if(typeof value !== "object"){
                console.log('Value is not JSON Object');
                return false;
            }
            if(typeof each.model != "undefined"){
                var getPull={};
                if(typeof each.model.pull == 'object' && each.model.pull.length >=1){
                    for(var i=0; i<=each.model.pull.length-1;i++){
                        if(typeof value[each.model.pull[i]] != 'undefined'){
                            getPull[each.model.pull[i]]=value[each.model.pull[i]];
                        }
                    }
                }
                if(typeof each.model.pull == 'string' && each.model.pull.toLowerCase() == 'all'){
                    getPull=value;
                }
                else if(typeof each.model.pull == 'string' && each.model.pull != ''){
                    if(typeof value[each.model.pull] != 'undefined'){
                        getPull = value[each.model.pull];
                    }
                }
                each.model.get(getPull);
            }
            convertHtml=each.html;
            $.each(each.getMatch(each.html,'gi'), function (key,val) {
                pattern = each.getMatch(val)[1];
                if(typeof each.model != "undefined" && typeof each.model.data[pattern] != "undefined"){
                    convertHtml=convertHtml.replace(val,each.model.data[pattern](value[pattern]));
                }else if(typeof each.model != "undefined" && typeof each.model.put[pattern] != "undefined") {
                    convertHtml=convertHtml.replace(val,each.model.put[pattern]);
                }else{
                    if(pattern == 'num++'){
                        convertHtml=convertHtml.replace(val,each.number++);
                        each.setStorageAsset({number:each.number});
                    }
                    else if((/num\[\d+\]\+/).test(pattern)){
                        if(each.hasNumber==false){
                            each.numberSet=(pattern.match(/num\[(\d+)\]\+/))[1];
                            each.hasNumber=true;
                        }
                        convertHtml=convertHtml.replace(val,each.numberSet++);
                        each.setStorageAsset({numberSet:each.numberSet});
                    }
                    else if((/replace\[[_a-zA-Z0-9.]+\]\([ #:_a-zA-Z0-9.]+\)/).test(pattern)){
                        var getAttribute, hasReplace=(pattern.match(/replace\[([_a-zA-Z0-9.]+)\]\(([ #:_a-zA-Z0-9.]+)\)/));
                        if((/([#_a-zA-Z0-9.]+):([ #_a-zA-Z0-9.]+)/).test((hasReplace[2]))){
                            getAttribute=(hasReplace[2]).match(/([#_a-zA-Z0-9.]+):([ #_a-zA-Z0-9.]+)/);
                            hasReplace=value[hasReplace[1]].replace(getAttribute[1],getAttribute[2]);
                        }else{
                            getAttribute=(hasReplace[2]).match(/([#_a-zA-Z0-9.]+)/);
                            hasReplace=value[hasReplace[1]].replace(getAttribute[1],"");
                        }
                        convertHtml =convertHtml.replace(val,hasReplace);
                    }
                    else if((/numberFormat(\[[_a-zA-Z0-9.]+\]|\[[_a-zA-Z0-9.]+\]\([#-_a-zA-Z0-9.]+\))/).test(pattern)){
                        var getNumberFormat;
                        if(((/numberFormat(\[[_a-zA-Z0-9.]+\]\([#-_a-zA-Z0-9.]+\))/).test(pattern))){
                            getNumberFormat=pattern.match(/numberFormat\[([_a-zA-Z0-9.]+)\]\(([#-_a-zA-Z0-9.]+)\)/);
                            getNumberFormat=new Intl.NumberFormat(getNumberFormat[2]).format(parseInt(value[getNumberFormat[1]]));
                        }else{
                            getNumberFormat=pattern.match(/numberFormat\[([_a-zA-Z0-9.]+)\]/);
                            getNumberFormat=new Intl.NumberFormat().format(parseInt(value[getNumberFormat[1]]));
                        }
                        convertHtml =convertHtml.replace(val,getNumberFormat);
                    }
                    else if((/math\[[()+-/*_a-zA-Z0-9.]+\]|math\[[()+-/*_a-zA-Z0-9.]+\]\([-_a-zA-Z0-9.]+\)/).test(pattern)){
                        var result,mathValue= function (mathValue) {
                            var result=mathValue;
                            mathValue=mathValue.match(/([_a-zA-Z0-9.]+)/gi);
                            for(var i=0; i < mathValue.length; i++){
                                if(!(/[0-9]+/).test(mathValue[i])){
                                    result=result.replace(mathValue[i],value[mathValue[i]]);
                                }
                            }
                            return eval(result);
                        };
                        if((/math\[[+-/*_a-zA-Z0-9.]+\]\([-_a-zA-Z0-9.]+\)/).test(pattern)){
                            result=pattern.match(/math\[([()+-/*_a-zA-Z0-9.]+)\]\(([-_a-zA-Z0-9.]+)\)/);
                            if(result[2]=='default'){
                                result=new Intl.NumberFormat().format(parseInt(mathValue(result[1])));
                            }else{
                                result=new Intl.NumberFormat(result[2]).format(parseInt(mathValue(result[1])));
                            }
                        }else{
                            result=pattern.match(/math\[([()+-/*_a-zA-Z0-9.]+)\]/);
                            result=mathValue(result[1]);
                        }

                        convertHtml =convertHtml.replace(val,result);
                    }
                    else if((/limitText\[[_a-zA-Z0-9.]+\]\([ #:_a-zA-Z0-9.]+\)/).test(pattern)){
                        var getAtt, getText=pattern.match(/limitText\[([_a-zA-Z0-9.]+)\]\(([ #:_a-zA-Z0-9.]+)\)/);
                        if((/([#_a-zA-Z0-9.]+):([ #_a-zA-Z0-9.]+)/).test((getText[2]))){
                            getAtt=(getText[2].match(/([#_a-zA-Z0-9.]+):([ #_a-zA-Z0-9.]+)/));
                            getText=value[getText[1]].substring(getAtt[1],getAtt[2]);

                        }else{
                            getText=value[getText[1]].substring(0,getText[2]);
                        }
                        convertHtml =convertHtml.replace(val,getText);
                    }
                    else if((/ /).test(pattern)){

                    }
                    else if(typeof value[pattern]!="undefined"){
                        convertHtml =convertHtml.replace(val,value[pattern]);
                    }
                   }
            });
            each.modelUri.append(convertHtml);
        });
    }
    function push(data){
        var push=data.getController().find('*[push-data]');
        if(typeof push.attr('push-data') != "undefined" ){
            push.each(function () {
                push =$(this).attr('push-data');
                if((/[_a-zA-Z0-9]+ as [_a-zA-Z0-9]+$/).test(push)){
                    push=push.match(/([_a-zA-Z0-9]+) as ([_a-zA-Z0-9]+)$/);
                    data.setPushData(push[2],{
                        key : push[1],
                        object: $(this),
                        html:$(this).html(),
                        get:function(){},
                        put:{},
                        data:{}
                    });
                }
            });
        }
    }
    function getObjectProp(obj, str) {
        var str = str.split(".");
        while(str.length && (obj = obj[str.shift()]));
        return obj;
    }
    var heavenJS = function (GLOBAL) {
        var controller, storage={},dataPush={}, model={},GLOBALS={syBegin:"\\(\\[",syEnd:"\\]\\)"};
        if(typeof GLOBAL !== 'undefined' && typeof GLOBAL.control !== 'undefined'){
            controller = GLOBAL.control;
            delete GLOBAL.control;
        }
        typeof GLOBAL !== 'undefined' && Object.keys(GLOBAL).length >= 1 && $.extend(GLOBALS,GLOBAL);
        this.setController = function (c) {
            controller = c;
        };
        this.getController= function () {
            return  $('*[control="'+controller+'"]');
        };
        this.setModel= function (m) {
            if(typeof m == 'object'){
                model=m;
            }
        };
        this.getModel=function(){
            return model;
        };
        this.getGlobal=function(){
            return GLOBALS;
        };
        this.setStorage=function(model,obj){
            if(typeof storage[model]!='undefined'){
                $.extend(storage[model],obj);
            }else{
                storage[model]=obj;
            }
        };
        this.getStorage= function () {
            return storage;
        };
        this.setPushData=function(key,obj){
            if(typeof dataPush[key]!='undefined'){
                $.extend(dataPush[key],obj);
            }else{
                dataPush[key]=obj;
            }
        };
        this.getPushData= function () {
            return dataPush;
        };
        if(typeof controller!='undefined'){
            push(this);
        }
    };
    heavenJS.prototype.control= function (control) {
        this.setController(control);
        if(typeof control!='undefined'){
            push(this);
        }
        return this;
    };
    heavenJS.prototype.model= function (obj) {
        obj =obj(this.getModel());var model=obj.name, html, modelUri,Opt=this.getGlobal();
        var getMatch= function (str,flags) {
            var symbol, Expression, result=null;
            symbol=Opt.syBegin;
            symbol +="([_a-zA-Z0-9.]+|[a-z.++]+|[a-z.]+\\[\\d+\\]\\+|math\\[[()+-/*_a-zA-Z0-9.]+\\]|math\\[[()+-/*_a-zA-Z0-9.]+\\]\\([-_a-zA-Z0-9.]+\\)|[a-zA-Z.]+\\[[_a-zA-Z0-9.]+\\]|[a-zA-Z.]+\\[[_a-zA-Z0-9.]+\\]\\([#-:_a-zA-Z0-9.]+\\))";
            symbol +=Opt.syEnd;
            Expression = typeof flags != 'undefined' ?
                new RegExp(symbol,flags) :
                new RegExp(symbol);
            if(typeof str != 'undefined'){
                result= str.match(Expression);
            }
            return result;
        };
        modelUri=this.getController().find('*[model="'+model+'"]'); html=modelUri.html();
        if(typeof this.getStorage()[model] != 'undefined'){
            if(typeof this.getStorage()[model].html != 'undefined')
                html = this.getStorage()[model].html;
        }else{
            this.setStorage(model,{html:html});
        }
        modelUri.html("");
        var pattern,convertHtml,number=typeof this.getStorage()[model].number == 'undefined'? 1 : this.getStorage()[model].number,hasNumber=false;
        var numberSet=typeof this.getStorage()[model].numberSet == 'undefined'? 0 : this.getStorage()[model].numberSet, storageAsset=this.setStorage;
        var setStorageAsset= function (num) {
            storageAsset(model,num);
        };
        each({
            model:obj,
            obj : obj.object,
            html:html,
            getMatch:getMatch,
            number:number,
            setStorageAsset:setStorageAsset,
            hasNumber:hasNumber,
            numberSet:numberSet,
            modelUri:modelUri
        });
    };
    heavenJS.prototype.foreach= function (obj, model) {
        var html, modelUri,Opt=this.getGlobal();
        var getMatch= function (str,flags) {
            var symbol, Expression, result=null;
            symbol=Opt.syBegin;
            symbol +="([_a-zA-Z0-9.]+|[a-z.++]+|[a-z.]+\\[\\d+\\]\\+|math\\[[()+-/*_a-zA-Z0-9.]+\\]|math\\[[()+-/*_a-zA-Z0-9.]+\\]\\([-_a-zA-Z0-9.]+\\)|[a-zA-Z.]+\\[[_a-zA-Z0-9.]+\\]|[a-zA-Z.]+\\[[_a-zA-Z0-9.]+\\]\\([#-:_a-zA-Z0-9.]+\\))";
            symbol +=Opt.syEnd;
            Expression = typeof flags != 'undefined' ?
                new RegExp(symbol,flags) :
                new RegExp(symbol);
            if(typeof str != 'undefined'){
                result= str.match(Expression);
            }
            return result;
        };
        if(typeof obj != 'undefined' && typeof obj == 'object' && typeof model != 'undefined'){
            if((/[_a-zA-Z0-9]+ as [_a-zA-Z0-9]+/).test(model)){
                var model = model.match(/([_a-zA-Z0-9]+) as ([_a-zA-Z0-9]+)/),setModel={},getModel={};getModel[model[2]]= function () {};
                setModel[model[2]]= {name:model[1],object:obj,data:{},get:function(x){},pull:[],put:{}}; this.setModel(setModel);
                return this;
            }else{
                modelUri=this.getController().find('*[model="'+model+'"]'); html=modelUri.html();
                if(typeof this.getStorage()[model] != 'undefined'){
                    if(typeof this.getStorage()[model].html != 'undefined')
                    html = this.getStorage()[model].html;
                }else{
                    this.setStorage(model,{html:html});
                }
                modelUri.html("");
                var pattern,convertHtml,number=typeof this.getStorage()[model].number == 'undefined'? 1 : this.getStorage()[model].number,hasNumber=false;
                var numberSet=typeof this.getStorage()[model].numberSet == 'undefined'? 0 : this.getStorage()[model].numberSet;
                var storageAsset=this.setStorage;
                var setStorageAsset= function (num) {
                    storageAsset(model,num);
                };
                each({
                    obj : obj,
                    html:html,
                    getMatch:getMatch,
                    number:number,
                    setStorageAsset:setStorageAsset,
                    hasNumber:hasNumber,
                    numberSet:numberSet,
                    modelUri:modelUri
                });
            }
        }
    };
    heavenJS.prototype.parseContent= function () {
        var data,html,GLOBAL=this.getGlobal(),push=this.getController().find('*[push-data]');
        var getMatch= function (str,flags) {
            var symbol, Expression, result=null;
            symbol=GLOBAL.syBegin;
            symbol +="([a-zA-Z]+:[_.a-zA-Z0-9]+|[()+-/*%:_a-zA-Z0-9.]+|[()+-/*%:_a-zA-Z0-9.]+\\[[(-_a-zA-Z0-9.]+\\])";
            symbol +="()";
            symbol +=GLOBAL.syEnd;
            Expression = typeof flags != 'undefined' ?
                new RegExp(symbol,flags) :
                new RegExp(symbol);
            if(typeof str != 'undefined'){
                result= str.match(Expression);
            }
            return result;
        };
        if(typeof push.attr('push-data') != "undefined" ){
            push.each(function () {
                push =$(this).attr('push-data');
                html =$(this).html();
                if((/[a-zA-Z0-9]+ as [a-zA-Z0-9]+\{[':"{,}a-zA-Z0-9]+\}/).test(push)){
                    data=push.match(/([a-zA-Z0-9]+) as ([a-zA-Z0-9]+)(\{.*\})/);
                    var array= $.parseJSON(JSON.stringify(eval('('+data[3]+')')));
                    if(getMatch(html) != null){
                        $.each(getMatch(html,'gi'), function (key,value) {
                            var pattern=getMatch(value)[1],result,getValue;
                            if((/[-%*()-+:_a-zA-Z0-9]+\[[_a-zA-Z]+[-:()_a-zA-Z0-9]+\]/).test(pattern)){
                                result = pattern.match(/([-%*()-+:_a-zA-Z0-9]+)(\[[_a-zA-Z]+[-:()_a-zA-Z0-9]+\])/);
                                if((/\[number|number:[_a-zA-Z0-9]+\]/).test(result[2])){
                                    var mathValue= function (mathValue) {
                                        var result=mathValue;
                                        mathValue=mathValue.match(new RegExp("([:_a-zA-Z0-9.]+)",'gi'));
                                        for(var i=0; i < mathValue.length; i++){
                                            if(!(/[0-9]+/).test(mathValue[i])){
                                                result=result.replace(mathValue[i],array[mathValue[i].match(new RegExp(data[1]+":([_a-zA-Z0-9]+)"))[1]]);
                                            }
                                        }
                                        return eval(result);
                                    };
                                    if((/number:[-_a-zA-Z0-9]+]/).test(result[2])){
                                        result=new Intl.NumberFormat(result[2].match(/number:([-_a-zA-Z0-9]+)/)[1]).format(parseInt(mathValue(result[1])));
                                    }else{
                                        result=new Intl.NumberFormat().format(parseInt(mathValue(result[1])));
                                    }
                                    html=html.replace(value,result);
                                }
                            }
                            else if((new RegExp(data[1]+":[_.a-zA-Z0-9]+")).test(pattern)){
                                result=pattern.match(new RegExp(data[1]+":([_.a-zA-Z0-9]+)"));
                                if((/[a-zA-Z0-9]+\.[a-zA-Z0-9]+/).test(result[1])){
                                    result=getObjectProp(array,result[1]);
                                }else if(typeof array[result[1]] != 'undefined'){
                                    result=array[result[1]];
                                }
                                html=html.replace(value,result);
                            }
                        });
                    }
                }
                $(this).html(html);
            });
        }
    };
    heavenJS.prototype.push= function (push) {
        push=push(this.getPushData());
        var html =push.html, GLOBAL=this.getGlobal(),array=push.data;
        var getMatch= function (str,flags) {
            var symbol, Expression, result=null;
            symbol=GLOBAL.syBegin;
            symbol +="([a-zA-Z]+:[_.a-zA-Z0-9]+|[()+-/*%:_a-zA-Z0-9.]+|[()+-/*%:_a-zA-Z0-9.]+\\[[(-_a-zA-Z0-9.]+\\])";
            symbol +="()";
            symbol +=GLOBAL.syEnd;
            Expression = typeof flags != 'undefined' ?
                new RegExp(symbol,flags) :
                new RegExp(symbol);
            if(typeof str != 'undefined'){
                result= str.match(Expression);
            }
            return result;
        };
        if(getMatch(html) != null){
            var key=push.key;
            $.each(getMatch(html,'gi'), function (keys,value) {
                var pattern=getMatch(value)[1],result;
                if(getLength(push.put)>=1 && new RegExp(key+":([_a-zA-Z0-9]+)").test(pattern) && typeof push.put[pattern.match(new RegExp(key+":([_a-zA-Z0-9]+)"))[1]] != 'undefined'){
                    html=html.replace(value,push.put[pattern.match(new RegExp(key+":([_a-zA-Z0-9]+)"))[1]]);
                }
                if((/[-%*()-+:_a-zA-Z0-9]+\[[_a-zA-Z]+[-:()_a-zA-Z0-9]+\]/).test(pattern)){
                    result = pattern.match(/([-%*()-+:_a-zA-Z0-9]+)(\[[_a-zA-Z]+[-:()_a-zA-Z0-9]+\])/);
                    if((/\[number|number:[_a-zA-Z0-9]+\]/).test(result[2])){
                        var mathValue= function (mathValue) {
                            var result=mathValue;
                            mathValue=mathValue.match(new RegExp("([:_a-zA-Z0-9.]+)",'gi'));
                            for(var i=0; i < mathValue.length; i++){
                                if(!(/[0-9]+/).test(mathValue[i])){
                                    result=result.replace(mathValue[i],array[mathValue[i].match(new RegExp(key+":([_a-zA-Z0-9]+)"))[1]]);
                                }
                            }
                            return eval(result);
                        };
                        if((/number:[-_a-zA-Z0-9]+]/).test(result[2])){
                            result=new Intl.NumberFormat(result[2].match(/number:([-_a-zA-Z0-9]+)/)[1]).format(parseInt(mathValue(result[1])));
                        }else{
                            result=new Intl.NumberFormat().format(parseInt(mathValue(result[1])));
                        }
                        html=html.replace(value,result);
                    }
                }
                else if((new RegExp(key+":[_.a-zA-Z0-9]+")).test(pattern)){
                    result=pattern.match(new RegExp(key+":([_.a-zA-Z0-9]+)"));
                    if((/[a-zA-Z0-9]+\.[a-zA-Z0-9]+/).test(result[1])){
                        result=getObjectProp(array,result[1]);
                        html=html.replace(value,result);
                    }else if(typeof array[result[1]] != 'undefined'){
                        result=array[result[1]];
                        html=html.replace(value,result);
                    }
                }
            });
            push.object.html(html);
        }

    };
    heavenJS.prototype.pagination= function () {

    };
    return heavenJS;
});