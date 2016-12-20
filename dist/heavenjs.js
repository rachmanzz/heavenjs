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
            typeof obj.send != "undefined" ? xhttp.send(obj.send) : xhttp.send();
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
          // controller  selector
            var parentSelector = document.querySelector('[control="'+hvObj.control+'"]');
            // Check if raw Template is undefined & save html Template
            if(typeof rawTpl == 'undefined') rawTpl=parentSelector.innerHTML;
            //find match template of heavenJS command && process command
            rawTpl.match(/<!--:[\[\]\:\@\/\.\,\>\<\=\s\t\w]+:-->/g)
              .forEach(function(iHvCode){ // get global command
                var rawCode =iHvCode.match(/<!--:([\[\]\:\@\/\.\,\>\<\=\s\t\w]+):-->/)[1]; // index paramenter
                console.log("raw Code :" + rawCode);
                rawCode.match(/\@[\w]+ :: [\w\[\]\:\/\.\s]+|[\w]+ :: [\w]+ as [\w]+\.\s[<>\/\w\s:]+::end\./gi)
                  .forEach(function(iPar){
                    if(parseVariable(iPar).test){
                      var variable=parseVariable(iPar).variable;
                      if(hvObj.data.hasOwnProperty(variable)){
                        for(var key in parseVariable(iPar)){
                          if(!hvObj.data[variable].hasOwnProperty(key)) hvObj.data[variable][key] = parseVariable(iPar)[key];
                        }
                      }
                      else{
                        hvObj.data[variable]=parseVariable(iPar);
                      }
                    }
                    if(/[\w]+ :: [\w]+ as [\w]+\.\s[<>\/\w\s:]+::end\./.test(iPar)){
                      var forEach = iPar.match(/^forEach :: ([\w]+) as ([\w]+)\.\s([<>\/\w\s:]+)::end\./);
                      if(typeof hvObj.data[forEach[1]] !== "undefined"){
                         var variable = hvObj.data[forEach[1]];
                         variable.ajaxReq && reqAjax(variable,function(res,status){
                           if(status === 'success'){
                             var result = typeof variable.validate === "function" ? variable.validate(res) : res;
                             result= typeof result === "object" ? result : JSON.parse(result);
                             var reVar =forEach[2], getMatch = new RegExp("^::[\\w]+","g");
                             var opt=forEach[3].match(getMatch);
                             console.log(opt);
                             isArray(result) && result.forEach(function(i){
                               console.log(forEach[2]);
                             });
                           }
                         });
                      }
                    }
                  });
              });
        }
        console.log(hvObj);
        typeof arg === "object" && this.setHvObj(arg);
        typeof hvObj.registerModule !== "undefined" && function(){

        }
        if(hvObj.autoRender && typeof hvObj.control != "undefined"){
          typeof hvObj.commandExclusive !== "undefined" && hvObj.commandExclusive && this.commandExclusive();
        }
        //console.log(hvObj);
    }
    hv.prototype.control = function (controller) {
        typeof controller === "string" && this.setHvObj({control:controller});
        return this;
    }
    GLOBAL.heavenJS=hv;
});
