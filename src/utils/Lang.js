define('utils/Lang', [], function() {
  var _ = {};
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  function _toString(obj) {
    return Object.prototype.toString.call(obj);
  }
  _.isFunction = function(fn) {
    return !!fn && _toString(fn) === '[object Function]';
  };
  _.isObject = function(obj) {
    return !!obj && _toString(obj) === '[object Object]';
  };
  _.isArray = function(array) {
    return !!array && _toString(array) === '[object Array]';
  };
  _.extend = function(obj) {
    var length = arguments.length,
      index, source, key;
    if (length < 2) {
      return obj;
    }
    for (index = 1; index < length; index++) {
      source = arguments[index];
      for (key in source) {
        if (_.has(source, key)) {
          obj[key] = source[key];
        }
      }
    }
    return obj;
  };
  _.matches = function(attr) {
    var pairs = _.pairs(attr),
      length = pairs.length;
    return function(obj) {
      var index = 0;
      for (index = 0; index < length; index++) {
        key = pairs[index][0];
        value = pairs[index][1];
        if (!obj[key] || obj[key] !== value) {
          return false;
        }
      }
      return true;
    };
  };
  _.negate = function(predicator) {
    return function() {
      return !predicator.apply(this, arguments);
    };
  };
  
  return _ ;
});