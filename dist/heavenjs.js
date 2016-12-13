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
        this.getHvObj = function(){
          return hvObj;
        };
        this.init=function(){

        }
        this.get = function () {
          return {setHvObj:this.setHvObj,getHvObj:this.getHvObj};
        };
        typeof arg === "object" && this.setHvObj(arg);
        typeof hvObj.control != "undefined" && typeof hvObj.commandExclusive !== "undefined" && hvObj.commandExclusive && hv.prototype.modules();

    }
    hv.prototype.control = function (controller) {
        typeof controller === "string" && this.setHvObj({control:controller});
        return this;
    }
    hv.prototype.modules = function(){
      console.log(this);

    }
    return hv;
});
