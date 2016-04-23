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
        var controller, storage={}, model={},GLOBALS={syBegin:"\\(\\[",syEnd:"//]//)"};
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
        this.setStorage=function(s,v){
            storage[s]=v;
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
        var html, modelUri;
        var getMatch= function (str,flags) {
            var symbol, Expression, result=null;
            symbol=this.getGlobal().syBegin;
            symbol +="[_a-zA-Z0-9.]+|[a-z.++]+|[a-z.]+\\[\\d+\\]\\+|math\\[[+-/*_a-zA-Z0-9.]+\\]|math\\[[+-/*_a-zA-Z0-9.]+\\]\\([-_a-zA-Z0-9.]+\\)|[a-zA-Z.]+\\[[_a-zA-Z0-9.]+\\]|[a-zA-Z.]+\\[[_a-zA-Z0-9.]+\\]\\([#-:_a-zA-Z0-9.]+\\)";
            symbol +=this.getGlobal().syEnd;
            Expression = typeof flags != 'undefined' ?
                new RegExp(symbol) :
                new RegExp(symbol);
            if(typeof str != 'undefined'){
                result= str.match(Expression);
            }
            return result;
        };
        if(typeof obj != 'undefined' && typeof model != 'undefined'){
            if((/[_a-zA-Z0-9]+ as [_a-zA-Z0-9]+/).test(model)){
                var model = model.match(/([_a-zA-Z0-9]+) as ([_a-zA-Z0-9]+)/),setModel={},getModel=model[2];
                setModel[getModel]= function () {}; this.setModel(setModel); this.getModel()[getModel](getModel);
            }else{
                modelUri=this.getController().find('*[model="'+model+'"]'); html=modelUri.html();
                if(typeof this.getStorage()[model] != 'undefined'){
                    html = this.getStorage()[model];
                }else{
                    this.setStorage(model,html);
                }
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