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
        console.log(this.getGlobal());
        this.setStorage=function(model,obj){
            storage[model]=obj;
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
            symbol +="([_a-zA-Z0-9.]+|[a-z.++]+|[a-z.]+\\[\\d+\\]\\+|math\\[[+-/*_a-zA-Z0-9.]+\\]|math\\[[+-/*_a-zA-Z0-9.]+\\]\\([-_a-zA-Z0-9.]+\\)|[a-zA-Z.]+\\[[_a-zA-Z0-9.]+\\]|[a-zA-Z.]+\\[[_a-zA-Z0-9.]+\\]\\([#-:_a-zA-Z0-9.]+\\))";
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
                        }
                        else if((/num\[\d+\]\+/).test(pattern)){
                            if(hasNumber==false){
                                numberSet=(pattern.match(/num\[(\d+)\]\+/))[1];
                                hasNumber=true;
                            }
                            convertHtml=convertHtml.replace(val,numberSet++);
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
                    });
                    modelUri.append(convertHtml);
                });
                console.log(html);
            }
        }
    };
    heavenJS.prototype.pagination= function () {

    };
    heavenJS.prototype.check= function () {

    };
    return heavenJS;
});