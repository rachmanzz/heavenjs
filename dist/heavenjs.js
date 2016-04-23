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
    function each(each){
        var convertHtml;
        $.each(each.obj, function (key,value) {
            if(typeof value !== "object"){
                console.log('Value is not JSON Object');
                return false;
            }
            convertHtml=each.html;
            $.each(each.getMatch(each.html,'gi'), function (key,val) {
                pattern = each.getMatch(val)[1];
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
                else if(typeof value[pattern]!="undefined"){
                    convertHtml =convertHtml.replace(val,value[pattern]);
                }
            });
            each.modelUri.append(convertHtml);
        });
    }
    var heavenJS = function (GLOBAL) {
        var controller, storage={}, model={},GLOBALS={syBegin:"\\(\\[",syEnd:"\\]\\)"};
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
    };
    heavenJS.prototype.control= function (control) {
        this.setController(control);
        return this;
    };
    heavenJS.prototype.model= function (obj) {
        console.log(obj(this.getModel()));
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
                var model = model.match(/([_a-zA-Z0-9]+) as ([_a-zA-Z0-9]+)/),setModel={},getModel=model[2];
                setModel[getModel]= function () {}; this.setModel(setModel); this.getModel()[getModel](getModel);
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
                /*
                $.each(obj, function (key,value) {
                    if(typeof value !== "object"){
                        console.log('Value is not JSON Object');
                        return false;
                    }
                    convertHtml=html;
                    $.each(getMatch(html,'gi'), function (key,val) {
                        pattern = getMatch(val)[1];
                        if(pattern == 'num++'){
                            convertHtml=convertHtml.replace(val,number++);
                            setStorageAsset({number:number});
                        }
                        else if((/num\[\d+\]\+/).test(pattern)){
                            if(hasNumber==false){
                                numberSet=(pattern.match(/num\[(\d+)\]\+/))[1];
                                hasNumber=true;
                            }
                            convertHtml=convertHtml.replace(val,numberSet++);
                            setStorageAsset({numberSet:numberSet});
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
                        else if(typeof value[pattern]!="undefined"){
                            convertHtml =convertHtml.replace(val,value[pattern]);
                        }
                    });
                    modelUri.append(convertHtml);
                });
                */
            }
        }
    };
    heavenJS.prototype.pagination= function () {

    };
    heavenJS.prototype.check= function () {

    };
    return heavenJS;
});