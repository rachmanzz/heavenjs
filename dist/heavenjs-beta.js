/**
 * Created by Quesha-Lania on 30/04/2016.
 */
(function(GLOBAL,$,heavenJS){
    if(typeof GLOBAL != 'undefined' && typeof $ !== 'undefined'){
        GLOBAL.heavenJS=heavenJS($);
    }else{
        GLOBAL.heavenJS= function () {
            console.log("jQuery is undefined");
        };
    }
})(window,jQuery, function ($) {
    // non GLOBAL variable
    var objectLength=function(l){
        var i=0;
        return typeof Object.keys(l).length != "undefined" ?
            Object.keys(l).length :
            $.each(l,function(){
                i++;
            }) && i;
    };
    var getObjectProp=function(obj, str) {
        str = str.split(".");
        while(str.length && (obj = obj[str.shift()]));
        return obj;
    };
    var parseUri= function (method,url,data,callback) {
        $.ajax({
            url:url,
            type:method.toUpperCase(),
            data:typeof data != "undefined"? data:{},
            success: function(result,status,xhr){
                typeof callback != "undefined" ?callback(result,status,xhr):data(result,status,xhr);
            },
            error: function(xhr,status,error){
                typeof callback != "undefined" ?callback(xhr,status,error):data(xhr,status,error);
            }
        });

    };
    var parseModel= function (data) {
        var symbol=data.symbol, convertHTML,pattern,result;
        var getMatch=function(str,flags){
            var reExp, Expression, result=null;
            reExp  = symbol.begin;
            reExp += "(";
            reExp += "([-%*()/+\\w\\d\\s]+|[\\w\\s]+\\[[0-9]+\\][+\\s]+|[-%*)(/+\\w\\d\\s]+\\[[-:)#@$%(\\w\\d\\s]+\\]|[-%*)(/+\\w\\d\\s]+\\[[-:)#@$%(\\w\\d\\s]+\\]\\s)";
            reExp += ")";
            reExp += symbol.end;
            Expression = typeof flags != "undefined" ?
                new RegExp(reExp,flags) :
                new RegExp(reExp);
            if(typeof str != "undefined"){
                result =str.match(Expression);
            }
            return result;
        };
        $.each(data.object, function (index, value) {
           if(typeof value !== "object"){
                console.log('Value is not JSON Object');
                return false;
           }
           if(typeof data.model != "undefined"){
               var pull={};
               if(typeof data.model.pull == "object" && objectLength(data.model.pull) >= 1){
                   for(var i=0; i<objectLength(data.model.pull);i++){
                       if(typeof value[data.model.pull[i]] != 'undefined'){
                           pull[data.model.pull[i]]=value[data.model.pull[i]];
                       }
                   }
               }
               if(typeof data.model.pull == 'string' && data.model.pull.toLowerCase() == 'all'){
                   pull=value;
               }
               else if(typeof data.model.pull == 'string' && data.model.pull != ''){
                   if(typeof value[data.model.pull] != 'undefined'){
                       pull = value[data.model.pull];
                   }
               }
               data.model.get(pull);
           }
            convertHTML= data.html;
            $.each(getMatch(data.html,'gi'), function (index,patternValue) {
                pattern = getMatch(patternValue)[1].replace(/\s/g,'');
                if(typeof data.model != "undefined" && typeof data.model.data[pattern] != "undefined"){
                    convertHTML=convertHTML.replace(patternValue,data.model.data[pattern](value[pattern]));
                }
                else if(typeof data.model != "undefined" && typeof data.model.put[pattern] != "undefined") {
                    convertHTML=convertHTML.replace(patternValue,data.model.put[pattern]);
                }
                else{
                    var mathValue= function (mathValue) {
                        var result=mathValue;
                        mathValue=mathValue.match(/[\w\d]+/gi);
                        for(var i=0; i < mathValue.length; i++){
                            if(!(/^[0-9]+$/).test(mathValue[i])){
                                result=result.replace(mathValue[i],value[mathValue[i]]);
                            }
                        }
                        return eval(result);
                    };
                    if(pattern == 'num++'){
                        convertHTML=convertHTML.replace(patternValue,data.storage.number++);
                        data.storage.set({number:data.storage.number});
                    }
                    else if((/num\[\d+\]\+/).test(pattern)){
                        if(data.storage.numberSet==false){
                            data.storage.numberSet=(pattern.match(/num\[(\d+)\]\+/))[1];
                        }
                        convertHTML=convertHTML.replace(patternValue,data.storage.numberSet++);
                        data.storage.set({numberSet:data.storage.numberSet});
                    }
                    else if(/[*)(-=/%\w\d]+\[[-_#$@(:)\w\d]+\]/.test(pattern)){
                        result=pattern.match(/([*)(-=/%\w\d]+)\[([-_#$@(:)\w\d]+)\]/);
                        if(/remove:[_#$@(:)\w\d]+/.test(result[2])){
                            result[2]=result[2].match(/remove:([_#$@(:)\w\d]+)/);
                            result[1]=value[result[1]].replace(result[2][1],'');
                            convertHTML=convertHTML.replace(patternValue,result[1]);
                        }
                        else if(/replace\([_#$@:\w\d]+\)/.test(result[2])){
                            result[2]=result[2].match(/replace\(([_#$@\w\d]+):([_#$@\w\d]+)\)/);
                            result[1]=value[result[1]].replace(result[2][1],result[2][2]);
                            convertHTML=convertHTML.replace(patternValue,result[1]);
                        }
                        else if(/number|number:[-\w\d]+/.test(result[2])){
                            if((/number:[-\w\d]+/).test(result[2])){
                                result=new Intl.NumberFormat(result[2].match(/number:([-\w\d]+)/)[1]).format(mathValue(result[1]));
                            }else{
                                result=new Intl.NumberFormat().format(mathValue(result[1]));
                            }
                            convertHTML=convertHTML.replace(patternValue,result);
                        }
                        else if(/limit:[\d]+|limit\([\d]+:[\d]+\)/.test(result[2])){
                            if(/limit\([\d]+:[\d]+\)/.test(result[2])){
                                result[2]= result[2].match(/limit\(([\d]+):([\d]+)\)/);
                                result[1]=value[result[1]].substring(result[2][1],result[2][2]);
                            }
                            else{
                                result[2]= result[2].match(/limit:([\d]+)/);
                                result[1]= value[result[1]].substring(0,result[2][1]);
                            }
                            convertHTML=convertHTML.replace(patternValue,result[1]);
                        }
                    }
                    else{
                        if(/[-)*(%/\w\d]+/.test(pattern)){
                            convertHTML=convertHTML.replace(patternValue,mathValue(pattern));
                        }else if(typeof value[pattern] != "undefined"){
                            convertHTML=convertHTML.replace(patternValue,value[pattern]);
                        }
                    }
                }
            });
            data.modelTag.append(convertHTML);
        });
    };
    var indexOf= function (array,regex) {
        var value=false;
        $.each(array, function (i,v) {
            if(regex.test(v)){
                value = true;
            }
        });
        return value;
    };

    // heavenJS function
    var heavenJS = function (option) {
        var controller, storage={},dataPush={}, model={},assets={syBegin:"\\(\\[",syEnd:"\\]\\)"};
        if(typeof option !== 'undefined' && typeof option.control !== 'undefined'){
            controller = option.control;
            delete option.control;
        }
        typeof option !== 'undefined' && objectLength(option) >= 1 && $.extend(assets,option);
        this.setController = function (c) {
            controller = c;
        };
        this.getController= function () {
            return  $('*[control="'+controller+'"]');
        };
        this.getAssets=function(){
            return assets;
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
    heavenJS.prototype.modules= function (modules,option) {
        var controller=this.getController(),uri, getStorage=this.getStorage(), setStorage=this.setStorage;
        var symbol={
            begin : this.getAssets().syBegin,
            end : this.getAssets().syEnd
        };
        function eachModel(model){
            if(/[\w\d]+\.url:[\w]+\[[\w\W\d]+\]|[\w\d]+\.[\w]+\[[\w\W\d]+\]/.test(model.attr('model'))){
                uri=model.attr('model').match(/([\w]+)\[([\w\W\d]+)\]/);
                var html=model.html(),getModel=model.attr('model').match(/([\w\d]+)\.[\w]+/)[1];
                if(typeof model.attr('put-data') != "undefined"){
                    parseUri(uri[1],uri[2],model.attr('put-data').replace(/[']/g,'"'), function (data,status) {
                        if(typeof getStorage[getModel] != 'undefined'){
                            if(typeof getStorage[getModel].html != 'undefined')
                                html = getStorage[getModel].html;
                        }else{
                            setStorage(getModel,{html:html});
                        }
                        var setNumber=function (obj) {
                            setStorage(getModel,obj);
                        };
                        model.html('');
                        status == 'success' && parseModel({
                            symbol:symbol,
                            object:typeof model.attr('select-data') != "undefined" && typeof getObjectProp(JSON.parse(data),model.attr('select-data')) ?getObjectProp(JSON.parse(data),model.attr('select-data')): JSON.parse(data),
                            html:html,
                            modelTag:model,
                            storage:{
                                number:typeof getStorage[getModel].number == "undefined" ? 1 : getStorage[getModel].number,
                                numberSet: typeof getStorage[getModel].numberSet == "undefined" ? false : getStorage[getModel].numberSet,
                                set:setNumber
                            }
                        });
                    });
                }else{
                    parseUri(uri[1],uri[2], function (data,status) {
                        if(typeof getStorage[getModel] != 'undefined'){
                            if(typeof getStorage[getModel].html != 'undefined')
                                html = getStorage[getModel].html;
                        }else{
                            setStorage(getModel,{html:html});
                        }
                        var setNumber=function (obj) {
                            setStorage(getModel,obj);
                        };
                        model.html('');
                        status == 'success' && parseModel({
                            symbol:symbol,
                            object:typeof model.attr('select-data') != "undefined" && typeof getObjectProp(JSON.parse(data),model.attr('select-data')) ?getObjectProp(JSON.parse(data),model.attr('select-data')): JSON.parse(data),
                            html:html,
                            modelTag:model,
                            storage:{
                                number:typeof getStorage[getModel].number == "undefined" ? 1 : getStorage[getModel].number,
                                numberSet: typeof getStorage[getModel].numberSet == "undefined" ? false : getStorage[getModel].numberSet,
                                set:setNumber
                            }
                        });
                    });
                }
            }
        }
        if(modules.indexOf('model')>=0){
            var model=controller.find('*[model]'),getModel;
            typeof model.attr('model') != "undefined" &&
            model.each(function(){
                model = $(this);
                if(/[\w\d]+\.[\w]+/.test($(this).attr('model')) && typeof option != "undefined" && typeof option.except != "undefined" && indexOf(option.except,/model\.[\w\d]+/)){
                    getModel=$(this).attr('model').match(/([\w\d]+)\.[\w]+/)[1];
                    $.each(option.except, function (i,value) {
                        if(/model\.[\w\d]+/.test(value) && value.match(/model\.([\w\d]+)/)[1] != getModel){
                            eachModel(model);
                        }
                    });
                }
                else if(/[\w\d]+\.[\w]+/.test($(this).attr('model')) && typeof option != "undefined" && typeof option.only != "undefined" && indexOf(option.only,/model\.[\w\d]+/)){
                    getModel=$(this).attr('model').match(/([\w\d]+)\.[\w]+/)[1];
                    $.each(option.only, function (i,value) {
                        if(/model\.[\w\d]+/.test(value) && value.match(/model\.([\w\d]+)/)[1] == getModel){
                            eachModel(model);
                        }
                    });
                }
                else{
                    eachModel(model);
                }
            });
        }
        return this;
    };
    return heavenJS;
});
