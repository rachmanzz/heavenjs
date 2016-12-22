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
            var expression = "<!--:";
            expression+="[\\?\\{\\}\\(\\)\\[\\]\"`~:+@\\*\\$\\/\\.\\^\\,>%<=\\s\\t\\w\\-]+";
            expression+=":-->";
            // controller  selector
            var parentSelector = document.querySelector('[control="'+hvObj.control+'"]');
            // Check if raw Template is undefined & save html Template
            if(typeof rawTpl == 'undefined') rawTpl=parentSelector.innerHTML;
            //find match template of heavenJS command && process command
            typeof rawTpl.match(new RegExp(expression,'g')) !== "null" &&
              rawTpl.match(new RegExp(expression,'g')).forEach(function(so){
                //so || source of heavenJS
                var rawCode = so.match(/<!--:([\w\s\D]+):-->/)[1];
                typeof rawCode !== "null" &&
                  rawCode.match(/\@[\w]+ :: [\w\[\]\:\/\.\s]+|[\w]+ :: [\w]+ as [\w]+\.\s[\w\s\D]+::end\./g)
                  .forEach(function(ix){
                    // index of variable and other method
                    if(parseVariable(ix).test){
                      var getVar = parseVariable(ix);
                      if(hvObj.data.hasOwnProperty(getVar.variable)){
                        for(var key in getVar){
                          if(!hvObj.data[getVar.variable].hasOwnProperty(key)) hvObj.data[getVar.variable][key] = getVar[key];
                        }
                      }
                      else{
                        hvObj.data[getVar.variable]=getVar;
                      }
                    }
                    //
                    if(/[\w]+ :: [\w]+ as [\w]+\.\s[\w\s\D]+::end\./.test(ix)){
                      var forEach= ix.match(/^forEach :: ([\w]+) as ([\w]+)\.\s([\w\s\D]+)::end\./);
                      if(typeof forEach !== "null" && hvObj.data.hasOwnProperty(forEach[1])){
                        var v=hvObj.data[forEach[1]],asIs=forEach[2];
                        if(v.ajaxReq){
                          console.log("skip ajax");
                        }
                        else{
                          console.log('prossess data');
                        }

                        //var html=rawTpl.replace(so,forEach[3]);
                        //parentSelector.innerHTML =html;

                      }
                    }
                  });
              });
        }
        typeof arg === "object" && this.setHvObj(arg);
        typeof hvObj.registerModule !== "undefined" && function(){

        }
        if(hvObj.autoRender && typeof hvObj.control != "undefined"){
          typeof hvObj.commandExclusive !== "undefined" && hvObj.commandExclusive && this.commandExclusive();
        }
        console.log(hvObj);
    }
    hv.prototype.control = function (controller) {
        typeof controller === "string" && this.setHvObj({control:controller});
        return this;
    }
    GLOBAL.heavenJS=hv;
});
