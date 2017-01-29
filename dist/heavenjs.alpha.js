(function(SELF,main){
  typeof module !== 'undefined' && typeof module.exports !== 'undefined' ?
  module.exports = main() : SELF.heavenJS = main()
})(this,function(){

  // check is array
  var isArray = function(v){
    return Array.isArray(v)
  },
  // check is Object but not Array
  isObject = function(v){
    return !isArray(v) && typeof v === 'object'
  },
  // check is number
  isNumber = function(v){
    return typeof v === 'number'
  },
  //check is string
  isString = function(v){
    return typeof v === 'string'
  },
  //check is function
  isFunc = function(v){
    return typeof v === 'function'
  },
  // check if undefined
  isUndef= function(v){
    return typeof v === 'undefined'
  },
  isNull = function(v){
    return v == 'null';
  },
  // merge object
  mObject = function(obj,obj1){
      for(var key in obj){
          if(obj1.hasOwnProperty(key) &&
              isObject(obj[key]) && isObject(obj1[key]))
              mObject(obj[key],obj1[key]);
          else obj1[key] = obj[key];
      }
      return obj1;
  },
  // extract array
  each = function (l,call) {
      if(isArray(l)){
        var i=0;
        for(i; i < l.length; ++i){
            call(i,l[i]);
        }
      } else console.log("it's not an array [each]")
  }


})
