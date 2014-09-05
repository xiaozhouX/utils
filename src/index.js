define('utils', ['exports', 'utils/Array', 'utils/Lang', 'utils/Function'], function (_, Array, Lang, Fn)  {
	return Lang.extend(_, Array, Lang, Fn);
});

define('utils/Array', ['utils/Lang', 'exports'], function (Lang, _) {

	var nativeKeys = Object.keys;

	function createCallback(fn, context) {
		return function() {
			return fn.apply(context, arguments);
		};
	}

	_.iteratee = function(value, context) {
		if(!value) {return _.identity;}
		if(Lang.isFunction(value)) {return createCallback(value, context);}
		if(Lang.isObject(value)) {return Lang.matches(value);}
	}

	_.identity = function(value) {
		return value;
	}

	// for Object
	_.keys = function(obj) {
		if(!Lang.isObject(obj)) {return [];}
		if(nativeKeys) {return nativeKeys(obj);}
		var keys = [], key;
		for(key in obj) {
			if(Lang.has(keys, key)){
				keys.push(key);
			}
		}
		return keys;
	};

	_.values = function(obj) {
		var keys = _.keys(obj),
			length = keys.length,
			values = [],
			index;
		for(index = 0; index < length; index++) {
			values[index] = obj[keys[index]];
		}
		return values;
	};

	_.pairs = function(obj) {
		var keys = _.keys(obj),
			length = keys.length,
			pairs = [],
			index, pair;
		for(index = 0; index< length; index++) {
			pair = keys[index];
			pairs[index] = [pair, obj[pair]];
		}
		return pairs;
	};

	_.invert = function(obj) {
		var results = [];
		_.forEach(obj, function(value, key) {
			results[value] = key;
		});
		return results;
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
	_.find = _.detect = function(obj, predicate, context) {
		var result;
			_.some(obj, function(value, key, context){
				if(predicate(value, key, obj)){
					result = value;
					return true;
				}
			})
			return result;
	};

	_.filter = _.select = function(obj, predicate, context) {
		var results = [];
			_.each(obj, function(value, key, context){
				if(predicate(value, key, obj)){
					results.push(value);
				}
			})
			return result;
	};

	_.reject = function(obj, predicate, context) {
		return _.filter(obj, _.negate(_.iterator(predicate), context));
	};

	_.some = _.any = function(obj, predicate, context) {
		if(!obj) return false;
		var length = obj.length,
			keys = length !== +length && _.keys(obj),
			length = length || keys.length,
			index;
			for(index = 0; index< length; index++) {
				key = keys ? keys[index] : index;
				if(predicate(obj[key], key, obj)) {
					return true;
				}
			}
			return false;
	};

	_.every = _.all = function(obj, predicate, context) {
		if(!obj) return false;
		var length = obj.length,
			keys = length !== +length && _.keys(obj),
			length = length || keys.length,
			index;
			for(index = 0; index< length; index++) {
				key = keys ? keys[index] : index;
				if(!predicate(obj[key], key, obj)) {
					return false;
				}
			}
			return true;
	};

	_.where = function(obj, atrr) {
		return _.filter(obj, Lang.matches(attr));
	};

	_.findWhere = function(obj, attr) {
		return _.find(obj, Lang.matches(attr));
	};

	_.invoke = function(obj, method) {
		var isMethodFn = Lang.isFunction(method),
			arg = Array.prototype.slice.call(arguments, 2);
		return _.map(obj, function(value) {
			return isMethodFn ? method.apply(value, arg) : value[method].apply(value, arg);
		});
	};

	_.pluck = function(obj, propertyName) {
		propertyName = propertyName || '';
		return _.reduce(obj, function(mome, value) {
			if(propertyName in value) {
				mome.push(value[propertyName]);
			}
			return mome;
		}, []);
	};

	_.max = function(obj, iteratee, context) {
		var result = -Infinity, temp;
		iteratee = _.iteratee(iteratee, context);
		return _.reduce(obj, function(mome, value, index, obj) {
			temp = iteratee(value, index, obj);
			return mome > temp ? mome : temp;
		}, result);
	};

	_.min = function(obj, iteratee, context) {
		var result = +Infinity, temp;
		iteratee = _.iteratee(iteratee, context);
		return _.reduce(obj, function(mome, value, index, obj) {
			temp = iteratee(value, index, obj, context);
			return mome < temp ? mome : temp;
		}, result);
	};

	_.sortBy = function(obj, iteratee, context) {
		var result = +Infinity, temp;
		iteratee = _.iteratee(iteratee, context);
		return _.reduce(obj, function(mome, value, index, obj) {
			temp = iteratee(value, index, obj, context);
			return mome < temp ? mome : temp;
		}, result);
	};
});

define('utils/Function', ['exports'], function (_) {

	function ftl(array) {
			var length = array.length,
			first = array[0];
			args = new Array(length);
			for(index = 0; index< length - 1; index++) {
				args[index] = array[index+1];
			}
			args[index] = first;
			return args;
	}

	_.revertFn = function(fn) {
		return function() {
			if(arguments.length < 2) {return fn;}
			var args = ftl(arguments);
			return fn.apply(this, args);
		};
	};
});


define('utils/Lang', ['exports'], function (_) {
	_.has = function(obj, key) {
			return hasOwnProperty.call(obj, key);
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
		var length = arguments.length, index, source, key;
		if(length < 2) {return obj;}
		for(index = 1; index < length; index++) {
			source = arguments[index];
			for(key in source) {
				if(_.has(source, key)){
					obj[key] = source[key];
				}
			}
		}
		return obj;
	};

	_.matches = function(attr){
		var pairs = _.pairs(attr),
			length = pairs.length;
		return function(obj) {
			var index = 0;
			for(index = 0; index< length; index++){
				key = pairs[index][0];
				value = pairs[index][1];
				if( !obj[key] || obj[key] !== value) { return false; }
			}
			return true;
		};
	};

	_.negate = function(predicate) {
		return function(){
			return !predicate.apply(this, arguments);
		};
	};
});
