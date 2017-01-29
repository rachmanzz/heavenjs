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
  isUndef= function(v){
    return typeof v === 'undefined'
  },
  isNull = function(v){
    return v == 'null';
  }


})
