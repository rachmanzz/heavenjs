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
              if(/\@([\w]+) :: ([ \w]+)/.test(v)){
                  Case=v.match(/\@([\w]+) :: ([ \w]+)/);
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
        Object.prototype.getProp = function (str) {
          var result=null;
          if(!isArray(this) && typeof this === "object" && typeof str === "string"){
            str = str.split('.');
            while (str.length) result=this[str.shift()];
          }
          return result;
        }
    var hv = function (arg) {
        var hvObj ={data:{},autoRender:true},rawTpl;


        //set Global heavenJS object
        this.setHvObj = function (obj) {
            hvObj=mergerObj(hvObj,obj);
        };
        this.setHvData=function(key,data){
          hvObj.data[key] =data;
        }
        //
        this.getHvObj = function(){
          return hvObj;
        };
        this.getRawTpl = function(){
          return rawTpl;
        }

        this.commandExclusive = function(selector,getTpl) {
            var expression = "<!--:";
            expression+="[\\?\\{\\}\\(\\)\\[\\]\"`~:+@\\*\\$\\/\\.\\^\\,>%<=\\s\\t\\w\\-]+";
            expression+=":-->";
            // controller  selector
            var parentSelector = document.querySelector('[control="'+hvObj.control+'"]');
            // Check if raw Template is undefined & save html Template
            if(typeof getTpl !== "undefined") parentSelector = parentSelector.querySelector(selector)
            if(typeof rawTpl == 'undefined') rawTpl=parentSelector.innerHTML;
            //find match template of heavenJS command && process command
            var html=typeof getTpl !== "undefined" ? getTpl : rawTpl;
            typeof html.match(new RegExp(expression,'g')) !== "null" &&
              html.match(new RegExp(expression,'g')).forEach(function(so){
                //so || source of heavenJS

                var rawCode = so.match(/<!--:([\w\s\D]+):-->/)[1];
                var loop="";
                typeof rawCode !== "null" &&
                  rawCode.match(/\@[\w]+ :: [\w\[\]\:\/\.\s]+|[~\w]+ :: [\w]+\.\s[\?\{\}\(\)\[\]"`:+@\*\$\/\.\^\,>%<=\s\w\-]+::end\.|[~\w]+ :: [\w]+ [a-z]+ [\w]+\.\s[\?\{\}\(\)\[\]"`:+@\*\$\/\.\^\,>%<=\s\w\-]+::end\./g)
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
                    if(/[\w]+ :: [\w]+ [a-z]+ [\w]+\.\s[\w\s\D]+::end\./.test(ix)){

                      // render forEach function
                      var forEach= ix.match(/forEach :: ([\w]+) as ([\w]+)\.\s([\w\s\D]+)::end\./);
                      if(typeof forEach !== "null" && hvObj.data.hasOwnProperty(forEach[1])){
                        var v=hvObj.data[forEach[1]],asIs=forEach[2];
                        if(!v.ajaxReq){
                            typeof v.value === "object" && isArray(v.value)
                            && v.value.forEach(function(v){
                              var val =forEach[3];
                              var pattern = '::'+asIs+'\\.([\\.a-zA-Z_]+)|::'+asIs;
                              new RegExp(pattern).test && val.match(new RegExp(pattern,'g'))
                                .forEach(function(i){
                                  var Res;
                                  if(/::[a-zA-Z_0-9]+\.[\.a-zA-Z_0-9]+/.test(i)) Res=v.getProp(i);
                                  else Res=v;
                                  val =val.replace(i,Res);
                                });
                                loop +=val;
                            });
                        }
                      }
                    }

                    if(/^[~\w]+ :: [\w]+\.\s[\w\s\D]+::end\./.test(ix)){
                      // html element render
                       var element= ix.match(/return :: element\.\s([\w\s\D]+)::end\./);
                       var pattern="::([\\w]+)\\.([\\.\\w]+)|::([\\w]+)";
                       var result="";
                       element !== "null" && element[1].match(new RegExp(pattern,'g'))
                        .forEach(function(v){
                          if(/::[\w]+\.[\.\w]+/.test(v)){
                            var val = v.match(/::([\w]+)\.([\.\w]+)/);
                            if(hvObj.data.hasOwnProperty(val[1])){
                              val = hvObj.data[val[1]].value.getProp(val[2]);
                              result = element[1].replace(v,val);
                            }
                          }
                          else{
                            if(/::([\w]+)/.test(v)){
                              var val = v.match(/::([\w]+)/)[1];
                              if(val !== "null" && hvObj.data.hasOwnProperty(val)){
                                val = hvObj.data[val].value;
                                result = element[1].replace(v,val);
                              }
                            }
                          }
                        });
                        loop += result;
                     }
                  });
                  html=html.replace(so,loop);
                  parentSelector.innerHTML =html;
              });
        }
        typeof arg === "object" && this.setHvObj(arg);
        typeof hvObj.registerModule !== "undefined" && function(){

        }
        if(hvObj.autoRender && typeof hvObj.control != "undefined"){
          typeof hvObj.commandExclusive !== "undefined" && hvObj.commandExclusive && this.commandExclusive();
        }
    }
    hv.prototype.control = function (controller) {
        typeof controller === "string" && this.setHvObj({control:controller});
        return this;
    }
    hv.prototype.data= function(key,obj){
      typeof key === "string" && typeof obj === "object"
        && !isArray(obj) && this.setHvData(key,obj);
    }
    hv.prototype.render=function(selector){
      var parser = new DOMParser,
      rawTpl = this.getRawTpl(),
      doc    = parser.parseFromString(rawTpl, "text/html");
      if(typeof selector !== "undefined"){
        var element  = doc.querySelector(selector);
        this.commandExclusive(selector,element.innerHTML);
      }

      //console.log(this.getHvObj());
    }
    GLOBAL.heavenJS=hv;
});
