(function (GLOBAL,mainjs) {
    typeof GLOBAL !== "undefined" ? mainjs(GLOBAL) :
        console.log('heavenJS just support a browser');
})(this,function (GLOBAL) {
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
            typeof obj.type !== "undefined" && xhttp.setRequestHeader("Content-type", obj.type);
            xhttp.onreadystatechange = function () {
                if(this.readyState == 4 && this.status == 200)
                    arg(this.responseText,'success');
                if(this.status != 200)
                    arg(this.status,'error');
            };
            typeof obj.data != "undefined" ? xhttp.send(obj.data) : xhttp.send();
        },
        parseVariable = function (v) {
            var Case,variable={test:false};

            if(/\@[\w]+ :: \[[A-Z]+\] [\w\.\/:]+/.test(v)){
                Case=v.match(/\@([\w]+) :: \[([A-Z]+)\] ([\w\.\/:]+)/);
                variable= {
                    test:true,
                    ajaxReq : true,
                    variable : Case[1],
                    method:Case[2],
                    url:Case[3]
                }
            }else{
              if(/\@([\w]+) :: ([\w\W\s]+)/.test(v)){
                  Case=v.match(/\@([\w]+) :: ([\w\W\s]+)/);
                  variable= {
                      test:true,
                      ajaxReq : false,
                      variable : Case[1],
                      value:Case[2]
                  }
            }
            }
            return variable;
        },
        mergerObj=function(obj,newObj){
          for(var key in newObj){
            if (newObj.hasOwnProperty(key)) obj[key] = newObj[key];
          }
          return obj;
        };
    var module = function(){
      this.modules = {}
      this.registerModule = function(m,arg){
        this.modules[m] = arg;
      }
    }
    var hv = function (arg) {
        var hvObj ={data:{},autoRender:true},rawTpl;


        //set Global heavenJS object
        this.setHvObj = function (obj) {
            hvObj=mergerObj(hvObj,obj);
        };
        //
        this.getHvObj = function(){
          return hvObj;
        };

        this.commandExclusive = function() {
            var parentSelector = document.querySelector('[control="'+hvObj.control+'"]');
            if(typeof rawTpl == 'undefined') rawTpl=parentSelector.innerHTML;
            rawTpl.match(/<!--:[\[\]\:\@\/\.\,\>\<\=\s\t\w]+:-->/g)
              .forEach(function(iHvCode){
                var rawCode =iHvCode.match(/<!--:([\[\]\:\@\/\.\,\>\<\=\s\t\w]+):-->/)[1]; // index paramenter
                rawCode.match(/\@[\w]+ :: [\w\[\]\:\/\.\s]+|[\w]+ :: [\w]+ as [\w]+\.\s[<>\/\w\s:]+::end\./gi)
                  .forEach(function(iPar){
                    var variable;
                    if(parseVariable(iPar).test){
                      variable=parseVariable(iPar).variable;
                      hvObj.data[variable]=parseVariable(iPar);
                    }
                  });
              });
        }
        typeof arg === "object" && this.setHvObj(arg);
        typeof hvObj.registerModule !== "undefined" && function(){

        }
        if(hvObj.autoRender){
          typeof hvObj.control != "undefined" && typeof hvObj.commandExclusive !== "undefined" && hvObj.commandExclusive && this.commandExclusive();
        }
        console.log(hvObj);
    }
    hv.prototype.control = function (controller) {
        typeof controller === "string" && this.setHvObj({control:controller});
        return this;
    }
    GLOBAL.heavenJS=hv;
});
