define('utils', ['utils/Array', 'exports'], function (Array, _) {
	_.Array = Array;
});

define('utils/Array', ['utils/lang', 'exports'], function (lang, _) {

	var nativeKeys = Object.keys;

	function createCallback(fn, context) {
		return function() {
			return fn.apply(context, arguments);
		};
	}

	// for Object
	_.keys = function(obj) {
		if(!lang.isObject(obj)) {return [];}
		if(nativeKeys) {return nativeKeys(obj);}
		var keys = [], key;
		for(key in obj) {
			if(lang.has(keys, key)){
				keys.push(key);
			}
		}
		return keys;
	};

	_.values = function(obj) {
		var keys = _.keys(obj),
			length = keys.length,
			values = [],
			i = 0;
		for(; i < length; i++) {
			values[i] = obj[keys[i]];
		}
		return values;
	};

	_.pairs = function(obj) {
		var keys = _.keys(obj),
			length = keys.length,
			pairs = [],
			i, pair;
		for(i = 0; i< length; i++) {
			pair = keys[i];
			pairs[i] = [pair, obj[pair]];
		}
		return pairs;
	};

	//for Array
	_.each = _.forEach = function(obj, iterator, context) {
		var length = obj.length,
			iterator = createCallback(iterator, context),
			index, keys, key;
		if(length !== +length) {
			keys = _.keys(obj);
			length = keys.length;
		}
		for(index = 0; index< length; index++) {
			key = keys ? keys[index] : index;
			iterator(obj[key], key, obj);
		}
		return obj;
	};

	_.map = _.collect = function(obj, iterator, context) {
		var length = obj.length,
			iterator = createCallback(iterator, context),
			results, keys, key, index;
		if(length !== +length) {
			keys = _.keys(obj);
			length = keys.length;
		}
		results = new Array(length);
		for(index = 0; index< length; index++) {
			key = keys ? keys[index] : index;
			results[index] = iterator(obj[key], key, obj);
		}
		return results;
	};

	_.reduce = function(obj, iterator, memo, context) {
		var length = obj.length,
			iterator =  createCallback(iterator, context),
			index = 0,
			keys;
		if(length !== +length) {
			keys = _.keys(obj);
			length = keys.length;
		}
		if(!memo) {
			memo = obj[keys ? keys[index++] : index++];
		}
		for(;index< length; index++) {
			key = keys ? keys[index] : index;
			memo = iterator(memo, obj[key], key, obj) || memo;
		}
		return memo;
	};

/*	  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    // if (nativeReduce && obj.reduce === nativeReduce) {
    //   if (context) iterator = _.bind(iterator, context);
    //   return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    // }
    _.each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };
*/
	_.reduceRight = _.foldr = function(obj, iterator, memo, context) {
		var index = obj.length,
			iterator =  createCallback(iterator, context),
			keys;
		if(index !== +index) {
			keys = _.keys(obj);
			index = keys.length;
		}
		if(!memo) {
			memo = obj[keys ? keys[index++] : index++];
		}
		while(index--) {
			key = keys ? keys[index] : index;
			memo = iterator(memo, obj[key], key, obj) || memo;
		}
		return memo;
	};

	// unfinished
	_.find = _.detect = function(obj, iterator, context) {
		var length = obj.length,
			keys, key;
		if(length !== +length) {
			keys = _.keys(obj);
			length = keys.length;
		}
		for(index = 0; index< length; index++) {
			key = keys ? keys[index] : index;
			if(iterator(obj[key], key, obj)) return obj[key];
		}
		return undefined;
	};

	_.filter = _.select = function(obj, iterator, context) {
		var length = obj.length,
			results = [],
			keys, key;
		if(length !== +length) {
			keys = _.keys(obj);
			length = keys.length;
		}
		for(index = 0; index< length; index++) {
			key = keys ? keys[index] : index;
			if(iterator(obj[key], key, obj)) {
				results.push(obj[key]);
			} 
		}
		return results;
	};
});

define('utils/lang', ['exports'], function (_) {
	_.has = function(obj, key) {
			return hasOwnProperty.call(obj, key);
	}

	_.isObject = function(obj) {
		var type = typeof obj;
		return type === 'object' && !!type;
	}
});
