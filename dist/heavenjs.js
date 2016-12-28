(function(GLOBAL,main){
  typeof GLOBAL !== "undefined" ? main(GLOBAL) :
      console.log('heavenJS just support a browser');
})(this,function(__GLOBAL){
  "use strict";

  // check is object & not array
  var isObject=function(v){
        return !Array.isArray(v) ? typeof v === "object" : false;
      },
      isUndef =function(v){
        return typeof v === "undefined";
      },
      isNull = function(v){
        return typeof v === "null";
      },
      // chek is array
      isArray =function(v){
        return Array.isArray(v);
      },
      // requestAjax
      reqAjax =function(obj,res){
        var xhttp = new XMLHttpRequest();

            xhttp.open(obj.method.toUpperCase(),
                       obj.url, typeof obj.async !== "undefined" ?
                       obj.async : true);
            typeof obj.requestHeader !== "undefined" &&
                       obj.requestHeader === "function" &&
                       obj.requestHeader(xhttp);
            xhttp.onreadystatechange = function(){
                          if(this.readyState == 4 && this.status == 200)
                              res(this.responseText,'success');
                          if(this.status !== 200)
                              res(this.status,'error');
                        };
            typeof obj.send !== "undefined" ? xhttp.send(obj.send) :
                          xhttp.send();
      },
      // merger Object
      mObject = function(obj,obj1){
                    for(var key in obj){
                      if(obj1.hasOwnProperty(key) &&
                              isObject(obj[key]) && isObject(obj1[key]))
                                  mObject(obj[key],obj1[key]);
                      else obj1[key] = obj[key];
                    }
                    return obj1;
                },
      // data parsing
      parseData = function(v){
                  var data={test:false,val:{}};
                  if(/\@[\w]+ :: \[[A-Z]+\] [\w\D]+/.test(v)){
                    v=v.match(/\@([\w]+) :: \[([A-Z]+)\] ([\w\D]+)/);
                    data.test = true;
                    data.val.request=new Object;
                    data.val.request[v[1]]  = {
                                                url : v[3],
                                                method: v[2]
                                              }
                  }
                  if(/\@([\w]+) :: ([ \w]+)/.test(v)){
                      v=v.match(/\@([\w]+) :: ([ \w]+)/);
                      data.test = true;
                      data.val.data=new Object;
                      data.val.data[v[1]]  = v[2];
                  }
                  return data;
                },
        rExp    = {
                    set : function(v){
                      this.Exp  = v;
                      return this;
                    },
                    raw:function(){
                      var Exp = this.Exp;
                      return new RegExp(Exp);
                    },
                    get : function(d,f){
                      var Exp = this.Exp;
                      if(!isUndef(f)) Exp = new RegExp(Exp,f);
                      else Exp = new RegExp(Exp);
                      return d.match(Exp);
                    }
                  };
      Object.prototype.getProp = function (str) {
                  var result=null;
                  if(isObject(this) && typeof str === "string"){
                    str = str.split('.');
                    while (str.length) result=this[str.shift()];
                  }
                  return result;
                }
  // heavenJS instance
  var hv = function(inst){
            var hvStorage = {data:{},autoRender:true,commandExclusive:true},
                rawTpl;
            // set heavenjs data
            this.setHvStorage = function(data){
                  hvStorage = mObject(data,hvStorage);
                 }
            this.getHvStorage = function(){
                  return hvStorage;
                 }
            this.setHvData = function(key,data){
                  hvStorage.data[key] =data;
                 }
            // set Raw Templates
            this.setRawTpl = function(tpl){
                  rawTpl = tpl;
                 }
            this.getRawTpl = function(){
                  return rawTpl;
                 }
            this.commandExclusive = function(selector,tpl){
                    var exp = "<!--:";
                        exp+="[\\?\\{\\}\\(\\)\\[\\]\"`~:+@\\*\\$\\/\\.\\^\\,>%<=\\s\\t\\w\\-]+";
                        exp+=":-->";

                    // get Controller
                    var control = document.querySelector('[control="'+hvStorage.control+'"]');
                    // chek and set template
                    if(isUndef(rawTpl)) rawTpl=control.innerHTML;
                    //chek and set selected template
                    if(!isUndef(tpl)) control = control.querySelector(selector);
                    // html template will be renders
                    var rawHTML = !isUndef(tpl) ? tpl : rawTpl;
                    new RegExp(exp).test(rawHTML) &&
                        rawHTML.match(new RegExp(exp,"g")).forEach(function(so){
                          var rawCode = so.match(/<!--:([\w\s\D]+):-->/)[1];
                          //chek it again -- dev
                          var loop="";
                          !isNull(rawCode) && rawCode
                            .match(/\@[\w]+ :: [ \w\[\]\:\/\.\?=]+|[~\w]+ :: [\w]+\.\s[\?\{\}\(\)\[\]"`:+@\*\$\/\.\^\,>%<=\s\w\-]+::end\.|[~\w]+ :: [\w]+ [a-z]+ [\w]+\.\s[\?\{\}\(\)\[\]"`:+@\*\$\/\.\^\,>%<=\s\w\-]+::end\./g)
                            .forEach(function(ix){
                              if(parseData(ix).test) mObject(parseData(ix).val,hvStorage);
                              // parsing forEach and other function
                              if(/^[~\w]+ :: [\w]+ [a-z]+ [\w]+\.\s[\w\s\D]+::end\./.test(ix)){
                                // forEach
                                var fE= ix.match(/forEach :: ([\w]+) as ([\w]+)\.\s([\w\s\D]+)::end\./);
                                    if(!isNull(fE)){
                                      // chek request ajax
                                      var vO,asIs=fE[2], eL = fE[3];;
                                      if(hvStorage.request.hasOwnProperty(fE[1])){
                                        vO = hvStorage.request[fE[1]];
                                      }

                                      else if(hvStorage.data.hasOwnProperty(fE[1])){
                                        // vO value array return
                                        vO = hvStorage.data[fE[1]];
                                        isArray(vO) && vO.forEach(function(v){
                                          // v is vO loop
                                          var nEl=eL;
                                          /::[\w]+\.[\.\w]+|::[\w]+/.test(eL) && eL
                                          .match(/::[\w]+\.[\.\w]+|::[\w]+/g).forEach(function(vE){
                                            //ve is element variable return
                                            var vOe;
                                            if(/::[\w]+\.[\.\w]+/.test(vE)){
                                              vOe = vE.match(/::([\w]+)\.([\.\w]+)/);
                                              if(asIs === vOe[1]) vOe = v.getProp(vOe[2]);
                                              else if(hvStorage.data.hasOwnProperty(vOe[1])) vOe= hvStorage.data[vOe[1]].getProp(vOe[2]);
                                            }
                                            else {
                                              vOe = vE.match(/::([\w]+)/)[1];
                                              if(asIs === vOe) vOe = v;
                                              else if(hvStorage.data.hasOwnProperty(vOe)) vOe = hvStorage.data[vOe]
                                            };
                                            nEl= nEl.replace(vE,vOe);
                                          });
                                          loop += nEl;
                                        });
                                      }

                                    }
                                    //end of forEach
                              }

                              //html element parsing
                              if(/^[~\w]+ :: [\w]+\.\s[\w\s\D]+\s::end\.$/.test(ix)){
                                // html element renders
                                var eL  = ix.match(/return :: element\.\s([\w\s\D]+)::end\./),
                                    patt= rExp.set("::([\\w]+)\\.([\\.\\w]+)|::([\\w]+)"),
                                    hasRequest=false,
                                    nEl=eL[1];
                                    !isNull(eL) && patt.get(eL[1],'g').forEach(function(v){
                                      var vI= rExp.set(/::([\w]+)/).get(v)[1],vO;
                                      if(hvStorage.request.hasOwnProperty(vI)){
                                        hasRequest=true;
                                      }
                                      else if(hvStorage.data.hasOwnProperty(vI)){
                                        if(/::[\w]+\.[\.\w]+/.test(v)){
                                          vO = v.match(/::[\w]+\.([\.\w]+)/);
                                          vO = hvStorage.data[vI].getProp(vO[1]);
                                        }else vO=hvStorage.data[vI];
                                        nEl = nEl.replace(v,vO);
                                      }
                                    });
                                    loop += nEl;
                              }
                            });
                            rawHTML = rawHTML.replace(so,loop);
                            control.innerHTML = rawHTML;
                        });
                 }
            if(isObject(inst.vData)) mObject(inst.vData,hvStorage) && delete inst.vData;
            if(isObject(inst)) this.setHvStorage(inst);
            // empty space, maybe for installation modules
            //check autoRender & control
            if(hvStorage.autoRender && !isUndef(hvStorage.control)){
              //rendering here
              hvStorage.commandExclusive && this.commandExclusive();
            }
          }
          hv.prototype.control = function (cont) {
              typeof cont === "string" && this.setHvStorage({control:cont});
              return this;
          }
          hv.prototype.data= function(key,arg){
            typeof key === "string" && this.setHvData(key,obj);
          }
          hv.prototype.request=function(arg,render){
            var self    = this;
            var req     = rExp.set(/^([\w]+) applyTo ([\w]+)/);
            var storage = this.getHvStorage(),
            renderTpl = this.render,
            hvData      =this.setHvData;
            if(req.raw().test(arg)){
              var vO = req.get(arg);
              if(!isUndef(storage.request[vO[1]])){
                reqAjax(storage.request[vO[1]],function(res,status){
                  if(status == "success"){
                    var data = isObject(res) ? res : JSON.parse(res);
                    hvData(vO[2],data);
                    if(!isUndef(render) && typeof render === "string"){
                      if(/^render\([\w\W]+\)/.test(render)){
                        render = render.match(/^render\(([\w\W]+)\)/)[1];
                        renderTpl(render,self);
                      }
                      else if(/^[\w]+/.test(render))
                        renderTpl('[stage="'+render+'"',self);
                    }
                  }
                });
              }
            }
          };
          hv.prototype.render =function(selector,self){
            var parser = new DOMParser,
            self = isUndef(self) ? this : self,
            rawTpl = isUndef(self.getRawTpl()) ?
              document.querySelector('[control="'+self.getHvStorage().control+'"]') :
              self.getRawTpl();
            var documents    = parser.parseFromString(rawTpl, "text/html");
            var element  = documents.querySelector(selector);
            if(typeof selector !== "undefined") self.commandExclusive(selector,element.innerHTML);
            else self.commandExclusive();
          }

  __GLOBAL.heavenJS = hv;
});
