(function (GLOBAL,mainjs) {
    typeof GLOBAL !== "undefined" ? GLOBAL.heavenJS=mainjs() :
        console.log('heavenJS just support a browser');
})(this,function () {
    "use strict";
    //check is object & not array
    var isObject=function (val) {
        return !Array.isArray(val) ? typeof val === "object" : false;
        }
        ,

        // check is array
        isArray=function (val) {
            return Array.isArray(val);
        }
        ,
        // ajax request
        reqAjax = function (obj,arg) {
            var xhttp = new XMLHttpRequest();
            xhttp.open(obj.method.toUpperCase(),obj.url, typeof obj.async !== "undefined" ? obj.async : true);
            //xhttp.setRequestHeader("Content-type", typeof obj.type !== "undefined" ? obj.type : "application/json");
            xhttp.onreadystatechange = function () {
                if(this.readyState == 4 && this.status == 200)
                    arg(this.responseText,'success');
                if(this.status != 200)
                    arg(this.status,'error');
            };
            typeof obj.data != "undefined" ? xhttp.send(obj.data) : xhttp.send();
        },
        parseVariable = function (v) {
            var Case;
            if(/\@[\w]+ :: \[[A-Z]+\] [\w\.\/:]+/.test(v)){
                Case=v.match(/\@([\w]+) :: \[([A-Z]+)\] ([\w\.\/:]+)/);
                return {
                    ajaxReq : true,
                    variable : Case[1],
                    method:Case[2],
                    url:Case[3]
                }
            }
            else{
                Case=v.match(/\@([\w]+) :: ([\w\W\s]+)/);
                return {
                    ajaxReq : false,
                    variable : Case[1],
                    value:Case[2]
                }
            }
        };
    var hv = function (arg) {
        var hvObj ={data:{}};
        //set Global heavenJS object
        this.setHvObj = function (obj) {
            hvObj=Object.assign(obj,hvObj);
        };
        this.getHvOb = hvObj;
        typeof arg === "object" && this.setHvObj(arg);
        typeof hvObj.control != "undefined" && typeof hvObj.commandExclusive !== "undefined" && hvObj.commandExclusive && hv.prototype.modules.commandExclusive();

    }

    hv.prototype.control = function (controller) {
        typeof controller === "string" && this.setHvObj({control:controller});
        return this;
    }
    hv.prototype.modules = {
        commit : function (par) {
            if(isArray(par))
                par.forEach(function (el) {
                    /^forEach$|^[\w]+\.forEach$/.test(el) ?
                        console.log('forEach') :
                        /^push|^[\w]+\.push$/.test(el) &&
                            console.log('push');
                });
        },
        commandExclusive : function () {
        var hvObj=this.getHvOb,
            setHvObj=this.setHvObj,
            parentSelector=document.querySelector('[control="'+hvObj.control+'"]');

        var html = parentSelector.innerHTML;
        var varb = html.match(/<!--:[\[\]\:\@\/\.\,\>\<\=\s\t\w]+:-->/g);
        varb.forEach(function (i) {
            var par =i.match(/<!--:([\[\]\:\@\/\.\,\>\<\=\s\t\w]+):-->/)[1], // index paramenter
                Res=par.match(/\@[\w]+ :: [\w\[\]\:\/\.\s]+|[\w]+ :: [\w]+ as [\w]+\.\s[<>\/\w\s:]+::end\./gi);
            Res.forEach(function (result) {
                if(/\@[\w]+/.test(result) && parseVariable(result).ajaxReq){
                    reqAjax(parseVariable(result),function (a,v) {
                        setHvObj({data:{web:'23'}});
                        console.log(hvObj);
                    })
                }


            });

        });
        //console.log(varb);
    }
    }
    return hv;
});