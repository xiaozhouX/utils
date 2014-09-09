define('utils', ['exports', 'utils/Array', 'utils/Lang', 'utils/Function'], function (_, Array, Lang, Fn)  {
	return Lang.extend(_, Array, Lang, Fn);
});

define('utils/Array', ['utils/Lang', 'exports'], function (Lang, _) {

	var nativeKeys = Object.keys;

	function _createCallback(fn, context) {
		return function() {
			return fn.apply(context, arguments);
		};
	}

	function _arrEach(array, iteratee) {
		var length = array.length,
				index;
		for(index = 0; index < length; index++) {
			if(iteratee(array[index], index, array, index)){
				break;
			}
		}
	}

	function _objEach(obj, iteratee) {
		var index = 0, key;
		for(key in obj) {
			if(Lang.has(obj, key)){
				if(iteratee(obj[key], key, obj, index)){
					break;
				}
				index ++;
			}
		}
	}

	function _loopEach(obj, iteratee, context) {
		iteratee = _createCallback(iteratee, context);
		if(Lang.isObject(obj)) {
			return _objEach(obj, iteratee);
		}else if(Lang.isArray(obj)) {
			return _arrEach(obj, iteratee);
		}
		return obj;
	}

	function _getElement(obj, id) {
		var tempElem = null;
		_loopEach(obj, function(value, key, obj, index){
			if(index == id) {
				tempElem = value;
				return true;		//break the loop
			}
			console.log(index);
		});
		return tempElem;
	}

	function _makeEqualLengthArray(obj) {
		var length = _.keys(obj).length;
		return new Array(length);
	}

	_.iteratee = function(value, context) {
		if(!value) {return _.identity;}
		if(Lang.isFunction(value)) {return _createCallback(value, context);}
		if(Lang.isObject(value)) {return Lang.matches(value);}
	}

	_.identity = function(value) {
		return value;
	}

	// for Object
	_.keys = function(obj) {
		if(!Lang.isObject(obj) && !Lang.isArray(obj)) {return [];}
		if(nativeKeys) {return nativeKeys(obj);}
		return _.map(obj, function(value, key){
			return key;
		});
	};

	_.values = function(obj) {
		return _.map(obj, function(value){
			return value;
		});
	};

	_.pairs = function(obj) {
		return _.map(obj, function(value, key){
			return [key, value];
		});
	};

	_.invert = function(obj) {
		var results = [];
		_loopEach(obj, function(value, key) {
			results[value] = key;
		});
		return results;
	};

	//for Array
	_.each = _.forEach = _loopEach;

	_.map = _.collect = function(obj, iteratee, context) {
		var results = _makeEqualLengthArray(obj),
				index = 0;
		_loopEach(obj, function(value, key, obj, index){
			results[index] = iteratee(value, key, obj);
		});
		return results;
	};

	_.reduce = function(obj, iteratee, memo, context) {
		iteratee =  _createCallback(iteratee, context);
		memo = !mome ? _getElement(obj, 0) : mome;

		_loopEach(obj, function(value, key, obj){
			mome = iteratee(memo, value, key, obj);
		});
		return memo;
	};

	_.reduceRight = _.foldr = function(obj, iteratee, memo, context) {
		var index = obj.length,
			iteratee =  _createCallback(iteratee, context),
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
			memo = iteratee(memo, obj[key], key, obj) || memo;
		}
		return memo;
	};

	// unfinished
	_.find = _.detect = function(obj, predicate, context) {
		var result = null;
		predicate = _.iteratee(predicate, context)
			_.some(obj, function(value, key, obj){
				if(predicate(value, key, obj)){
					result = value;
					return true;
				}
			});
			return result;
	};

	_.filter = _.select = function(obj, predicate, context) {
		predicate = _.iteratee(predicate, context);
		var results = [];
		_loopEach(obj, function(value, key){
			if(predicate(value, key, obj)){
				results.push(value);
			}
		});
		return results;
	};

	_.reject = function(obj, predicate, context) {
		return _.filter(obj, Lang.negate(_.iteratee(predicate, context)));
	};

	_.some = _.any = function(obj, predicate, context) {
		if(!obj) return false;
		predicate = _.iteratee(predicate, context);
		var value = false;
		_loopEach(obj, function(value, key){
			if(predicate(value, key, obj)) {
				value = true;
				return true;		//break the loop
			}
		});
		return value;
	};

	_.every = _.all = function(obj, predicate, context) {
		if(!obj) return false;
		predicate = _.iteratee(predicate, context);
		var value = true;
		_loopEach(obj, function(value, key){
			if(!predicate(value, key, obj)) {
				value = false;
				return true;		//break the loop
			}
		});
		return value;
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
