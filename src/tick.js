define('tick', [], function() {
  var interval = {},
    _uniqueId = (function() {
      var uniqueId = 0;
      return function() {
        return uniqueId++;
      };
    })();

  function setCorrectInterval(fn, delay) {
    var id = _uniqueId(),
      plannedTime = new Date().valueOf() + delay;
    switch(typeof fn) {
      case 'function':
        break;
      case 'string':
        var sfn = fn;
        fn = function(){
          eval(sfn);
        };
        break;
      default:
        fn = function(){};
    }
    function tick() {
      fn();
      if (interval[id]) {
        var adjustTime = plannedTime - new Date().valueOf();
        plannedTime += delay;
        interval[id] = setTimeout(tick, delay + adjustTime);
      }
    }
    interval[id] = setTimeout(tick, delay);
    return id;
  }

  function clearCorrectingInterval(id) {
    clearTimeout(interval[id]);
    delete interval[id];
  }
  return {
    setCorrectInterval: setCorrectInterval,
    clearCorrectingInterval: clearCorrectingInterval
  };
});