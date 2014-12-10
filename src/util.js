define('util', ['./utils/Array', './utils/Lang', './utils/Function'], function(Array, Lang, Fn) {
  return Lang.extend({}, Array, Lang, Fn);
});

