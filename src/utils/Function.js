define('utils/Function', ['utils/Array'], function(Arr) {
      var _ = {} ;
  function ftl(array) {
    var length = array.length,
      first = array[0];
    args = new Array(length);
    for (index = 0; index < length - 1; index++) {
      args[index] = array[index + 1];
    }
    args[index] = first;
    return args;
  }
  _.revertFn = function(fn) {
    return function() {
      if (arguments.length < 2) {
        return fn;
      }
      var args = ftl(arguments);
      return fn.apply(this, args);
    };
  };
  _.partial = function(fn) {
    var boundArgs = Arr.slice.call(arguments, 1),
      PLACEHOLDER = _;
    return function() {
      var position = 0,
        args = Arr.map(boundArgs, function(value) {
          return (value === PLACEHOLDER) ? arguments[position++] : value;
        });
      Arr.push.apply(args, Arr.slice.call(arguments, position));
      return fn.apply(this, args);
    }
  };
  _.variadic = function(fn) {
    var count = ( fn.length -1 > 0) ? fn.length - 1 : 0;
    return function(){
      // var args = new Array(count);
      // Arr.forEach(args, function(value, index){
      //   args[index] = value;
      // });
      var args = Arr.slice.call(arguments, 0, count);
      args.length = count;
      args.push(Arr.slice.call(arguments, count));
      return fn.apply(this, args);
    };
  };
  _.debounce = function(fn, wait, context){
    var pending = false;
    return function(){
      if(!pending){
        fn.apply(context, arguments);
        pending = true;
        setTimeout(function(){
          pending = false;
        }, wait);
      }
    };
  };
  _.when = function(condition, fuc){
    if(condition()){
      return fuc();
    }
  };
  return _;
});