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
        reqAjax = function (obj,arg) {
            var xhttp = new XMLHttpRequest();
            xhttp.setRequestHeader("Content-type", typeof obj.type !== "undefined" ? obj.type : "application/javascript");
            xhttp.open(obj.method.toUpperCase(),obj.url, typeof obj.async !== "undefined" ? obj.async : true);
            xhttp.onreadystatechange = function () {
                if(this.readyState == 4 && this.status == 200)
                    arg(this.responseText,'success');
                if(this.status != 200)
                    arg(this.status,'error');
            };
            typeof xhttp.send();
        }
        ;
    var hv = function (arg) {
        var hvObj ={};
        //set Global heavenJS object
        this.setHvObj = function (obj) {
            hvObj=Object.assign(obj,hvObj);
        };
        typeof arg === "object" && this.setHvObj(arg);

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
        }
    }
    return hv;
});