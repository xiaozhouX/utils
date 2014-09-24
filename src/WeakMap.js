function privateStore(_key){
  return function(obj){
    if(typeof obj !== 'object'){
      throw Error('param must be object');
    }
    var store = obj.valueOf(_key);
    return (store && store.__identify__ === _key) ? store : _initStore(obj, _key);
  }
}

function _initStore(obj, _key){
  var store = Object.create(null, {
    '__identify__': {
      value: _key
    }
  }),
  valueOf = obj.valueOf;
  Object.defineProperty(obj, 'valueOf', {
    value: function(key){
        return _key === key ? store : valueOf.apply(this, key);
    }
  });
  return store;
}

function WeakMapModule(useNative){
  if(!WeakMap || !useNative) {
    return WeakMap = function(){
      var _store = privateStore(Object.create(null));
      return Object.create({
        get: function(key){
          return _store(key).value;
        },
        set: function(key, value){
          _store(key).value = value
        },
        has: function(key){
          return _store(key) != null;
        }
      });
    };
  }else {
    return WeakMap();
  }
}