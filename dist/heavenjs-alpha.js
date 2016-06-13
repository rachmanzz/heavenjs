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
    var objLength=function(l){
        var i=0;
        return typeof Object.keys(l).length != "undefined" ?
            Object.keys(l).length :
        $.each(l,function(){
            i++;
        }) && i;
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
    var parseURL= function (method,url,data,callback) {
        $.ajax({
            url:url,
            type:method.toUpperCase(),
            data:typeof data == "object"? data:{},
            success: function(result,status,xhr){
                typeof callback != "undefined" ?callback(result,status,xhr):data(result,status,xhr);
            },
            error: function(xhr,status,error){
                typeof callback != "undefined" ?callback(xhr,status,error):data(xhr,status,error);
            }
        });

    };
    var syncTask= function (option) {
        return typeof option.sync != "undefined" &&
        option.sync == true ? heavenJS.prototype.sync({
            timing :option.timing,
            run : function (x) {
                option.run(x);
            }
        }) : option.run();
    };
    var forEachModule= function (data) {
        var symbol=data.symbol, convertHTML,pattern,result;
        var getMatch=function(str,flags){
            var reExp, Expression, result=null;
            reExp  = symbol.begin;
            reExp += "([-%*()/+\\w\\d\\s]+|[\\w\\s]+\\[[0-9]+\\][+\\s]+|[-%*)(/+\\w\\d\\s]+\\[[-:)#@$%(\\w\\d\\s]+\\]|[-%*)(/+\\w\\d\\s]+\\[[-:)#@$%(\\w\\d\\s]+\\]\\s)";
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
                    }
                    else if((/num\[\d+\]\+/).test(pattern)){
                        if(data.storage.numberSet==false){
                            data.storage.numberSet=(pattern.match(/num\[(\d+)\]\+/))[1];
                        }
                        convertHTML=convertHTML.replace(patternValue,data.storage.numberSet++);
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
                        if(/[-)*(%/]+/.test(pattern)){
                            convertHTML=convertHTML.replace(patternValue,mathValue(pattern));
                        }else if(typeof value[pattern] != "undefined"){
                            convertHTML=convertHTML.replace(patternValue,value[pattern]);
                        }
                    }
                }
            });
            data.module.append(convertHTML);
        });
    };
    var pushModule = function (data) {
        var symbol=data.symbol, convertHTML, pattern, result, value;
        var getMatch=function(str,flags){
            var reExp, Expression, result=null;
            reExp  = symbol.begin;
            reExp += "([-%*()/+\\w\\d\\s]+|[\\w\\s]+\\[[0-9]+\\][+\\s]+|[-%*)(/+\\w\\d\\s]+\\[[-:)#@$%(\\w\\d\\s]+\\]|[-%*)(/+\\w\\d\\s]+\\[[-:)#@$%(\\w\\d\\s]+\\]\\s)";
            reExp += symbol.end;
            Expression = typeof flags != "undefined" ?
                new RegExp(reExp,flags) :
                new RegExp(reExp);
            if(typeof str != "undefined"){
                result =str.match(Expression);
            }
            return result;
        };
        var keys=null;
        var expression= function (data) {
            data = keys != null ? keys + ':' + data : data;
            return new RegExp(data);
        };
        convertHTML=data.pushTag.html();
        data.pushTag.html("");
        value=data.object;
        typeof data.object == "object" && typeof getMatch(convertHTML,'gi') != null &&
        $.each(getMatch(convertHTML,'gi'), function (index, patternValue) {
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
                    if(/[-)*(%/]+/.test(pattern)){
                        convertHTML=convertHTML.replace(patternValue,mathValue(pattern));
                    }else if(typeof value[pattern] != "undefined"){
                        convertHTML=convertHTML.replace(patternValue,value[pattern]);
                    }
                }
            }
        });
        data.pushTag.append(convertHTML);
    };
    var getObjectProp=function(obj, str) {
        str = str.split(".");
        while(str.length && (obj = obj[str.shift()]));
        return obj;
    };
    // heavenJS Construct
    var heavenJS = function (option) {
        var assets = {syBegin:"\\(\\[",syEnd:"\\]\\)"};
        var controller, storage={};
        if(typeof option !== 'undefined' && typeof option.control !== 'undefined'){
            controller = option.control;
            delete option.control;
        }
        typeof option != 'undefined' && typeof option == "object" && objLength(option) >= 1 && $.extend(assets,option);
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
    heavenJS.prototype.modules = function (modules,option) {
        var controller=this.getController(), setStorage=this.setStorage,storage=this.getStorage();
        var module, model, symbol={begin : this.getAssets().syBegin,end : this.getAssets().syEnd};
        var ExploreModules = function (moduleName,module,eventData) {
            console.log(moduleName);
            if(typeof moduleName != "undefined" && typeof moduleName == "string" && moduleName == 'forEach' && typeof module != "undefined"){
                var forEachExpression = typeof eventData != "undefined" ?
                    /^[\w\d]+\.bind\.url:[\w]+\[[\w\W\d]+\]|^[\w\d]+\.bind\.[\w]+\[[\w\W\d]+\]/ :
                    /^[\w\d]+\.url:[\w]+\[[\w\W\d]+\]|^[\w\d]+\.[\w]+\[[\w\W\d]+\]/;
                if(forEachExpression.test(module.attr('forEach'))){
                    var uri = module.attr('forEach').match(/([\w]+)\[([\w\W\d]+)\]/);
                    var model = module.attr('forEach').match(/(^[\w\d]+)\.[\w]+/)[1], html = typeof eventData != "undefined" ? eventData[model].html : module.html(), data={};
                    typeof module.attr('put-data') != "undefined" && $.extend(data,$.parseJSON(module.attr('put-data').replace(/'/g,'"')));
                    typeof eventData != "undefined" && $.extend(data,eventData[model].input);
                        syncTask({
                            sync:typeof module.attr('sync-timing') != "undefined",
                            timing:typeof module.attr('sync-timing') != "undefined" ? parseInt(module.attr('sync-timing')) : 2000,
                            run: function () {
                                parseURL(uri[1],uri[2],data, function (data, status) {
                                    module.html('');
                                    status == 'success' && forEachModule({
                                        symbol:symbol,
                                        object:typeof module.attr('select-data') != "undefined" && typeof getObjectProp(JSON.parse(data),model.attr('select-data')) ?getObjectProp(JSON.parse(data),model.attr('select-data')): JSON.parse(data),
                                        html:html,
                                        module:module,
                                        storage:{
                                            number : 1,
                                            setNumber:false
                                        }
                                    });
                                });
                            }
                        });
                }
            }
            if(typeof moduleName != "undefined" && typeof moduleName == "string" && moduleName == 'push' && typeof module != "undefined"){
                var regExp = /^[\w]+ as [\w\d]+\.url:[\w]+\[[\w\W\d]+\]|^[\w]+ as [\w\d]+\.[\w]+\[[\w\W\d]+\]|^[\w\d]+\.url:[\w]+\[[\w\W\d]+\]|^[\w\d]+\.[\w]+\[[\w\W\d]+\]/;
                if(regExp.test(module.attr('push-data'))){

                }
            }
        };
        if(modules.indexOf('event')>=0){
            module=controller.find('*[event-handler]');
            var event ={onChange:'change',onKeyup:'keyup'},event_data,moduleName;
            typeof module.attr('event-handler') != "undefined" &&
                module.each(function () {
                    if(/^[\w]+ module\[[\w\.]+\]$/.test(module.attr('event-handler'))){
                        event_data =module.attr('event-handler').match(/^([\w]+) module\[([\w\.]+)\]$/);
                        event_data[2]=event_data[2].match(/^(\w+)\.(\w+)$/);
                        moduleName=event_data[2][1];
                        model=event_data[2][2];
                        var eventData={};
                        if(moduleName=='forEach'){
                            module= controller.find('*[forEach^="'+model+'.bind"]');
                            if(typeof eventData[model] == "undefined"){
                                eventData[model] = {html: module.html(),input:{}};
                            }
                            module.html('');
                            typeof event[event_data[1]] != "undefined" &&
                            $(this).on(event[event_data[1]] , function(event) {
                                module= controller.find('*[forEach^="'+model+'.bind"]');
                                eventData[model]['input'][$(this).attr('name')] = $(this).val();
                                ExploreModules(moduleName,module,eventData);
                                event.preventDefault();
                            });
                        }
                    }
                });
        }
        if(modules.indexOf('forEach')>=0){
            module=controller.find('*[forEach]');
            typeof module.attr('forEach') != "undefined" &&
            module.each(function(){
                module = $(this);
                var forEach = module.attr('forEach');
                if(/^[\w\d]+\.[\w]+/.test(forEach) && typeof option != "undefined" && typeof option.except != "undefined" && indexOf(option.except,/forEach\.[\w\d]+/)){
                    model=forEach.match(/([\w\d]+)\.[\w]+/)[1];
                    $.each(option.except, function (i,value) {
                        if(/forEach\.[\w\d]+/.test(value) && value.match(/forEach\.([\w\d]+)/)[1] != model){
                            ExploreModules('forEach',module);
                        }
                    });
                }
                else if(/^[\w\d]+\.[\w]+/.test($(this).attr('forEach')) && typeof option != "undefined" && typeof option.only != "undefined" && indexOf(option.only,/forEach\.[\w\d]+/)){
                    model=$(this).attr('forEach').match(/([\w\d]+)\.[\w]+/)[1];
                    $.each(option.only, function (i,value) {
                        if(/forEach\.[\w\d]+/.test(value) && value.match(/forEach\.([\w\d]+)/)[1] == model){
                            ExploreModules('forEach',module);
                        }
                    });
                }
                else{
                    ExploreModules('forEach',module);
                }
            });
        }
        if(modules.indexOf('push')>=0){
            module=controller.find('*[push-data]');
            typeof  module.attr('push-data') != "undefined" &&
            module.each(function () {
                module= $(this);
                if(/^[\w]+ as [\w\d]+\.[\w]+|^[\w]+ as [\w\d]+\{[\W\w\d\s]+\}$|^[\w\d]+\.[\w]+/.test(module.attr('push-data')) && typeof option != "undefined" && typeof option.except != "undefined" && indexOf(option.except,/push\.[\w\d]+/)){
                    model=$(this).attr('push-data').match(/([\w\d]+)\.[\w]+/)[1];
                    $.each(option.except, function (i,value) {
                        if(/push\.[\w\d]+/.test(value) && value.match(/push\.([\w\d]+)/)[1] != model){
                            ExploreModules('push',module);
                        }
                    });
                }
                else if(/^[\w]+ as [\w\d]+\.[\w]+|^[\w]+ as [\w\d]+\{[\W\w\d\s]+\}$|^[\w\d]+\.[\w]+/.test($(this).attr('push-data')) && typeof option != "undefined" && typeof option.only != "undefined" && indexOf(option.only,/push\.[\w\d]+/)){
                    model=$(this).attr('push-data').match(/([\w\d]+)\.[\w]+/)[1];
                    $.each(option.only, function (i,value) {
                        if(/push\.[\w\d]+/.test(value) && value.match(/push\.([\w\d]+)/)[1] == model){
                            ExploreModules('push',module);
                        }
                    });
                }
                else{
                    ExploreModules('push',module);
                }
            });
        }
    };
    heavenJS.prototype.sync= function (sync) {
        var timing=typeof sync.timing != "undefined" ? sync.timing : 2000;
        var loop_number=0;
        var looping = function () {
            sync.run(loop_number++);
            setTimeout(looping,timing);
        };
        looping(sync);
        return this;
    };
    return heavenJS;
});
