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
        var controller, model={},GLOBALS={syBegin:"\\(\\[",syEnd:"//]//)"};
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
        }
    };
    heavenJS.prototype.control= function (control) {
        this.setController(control);
        return this;
    };
    heavenJS.prototype.model= function (obj) {
        console.log(obj(this.getModel()));
    };
    heavenJS.prototype.foreach= function (object, model) {
        var html;
        var getMatch= function (str,flags) {
            var symbol;
            symbol=this.getGlobal().syBegin;
            symbol +="[_a-zA-Z0-9.]+|[a-z.++]+|[a-z.]+\\[\\d+\\]\\+|math\\[[+-/*_a-zA-Z0-9.]+\\]|math\\[[+-/*_a-zA-Z0-9.]+\\]\\([-_a-zA-Z0-9.]+\\)|[a-zA-Z.]+\\[[_a-zA-Z0-9.]+\\]|[a-zA-Z.]+\\[[_a-zA-Z0-9.]+\\]\\([#-:_a-zA-Z0-9.]+\\)";
            symbol +=this.getGlobal().syEnd;
            
        };

        if((/[_a-zA-Z0-9]+ as [_a-zA-Z0-9]+/).test(model)){
            var model = model.match(/([_a-zA-Z0-9]+) as ([_a-zA-Z0-9]+)/),setModel={},getModel=model[2];
            setModel[getModel]= function () {}; this.setModel(setModel); this.getModel()[getModel](getModel);
        }else{
            html=this.getController().find('*[model="'+model+'"]').html();
            console.log(html);
        }

    };
    heavenJS.prototype.check= function () {

    };
    return heavenJS;
});