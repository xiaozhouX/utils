function Promise(fn){
	var state = 'pending',
			value = null,
			deferreds = [];

	this.then = function(onFulfilled, onRejected){
		return new Promise(function(resolve, reject){
			handle(new Handle(onFulfilled, onRejected, resolve, reject));
		})
	}

	function handle(deferred){
		if(state === 'pending'){
			deferreds.push(deferred);
			return ;
		}

		var cb = state === 'fulfilled' ? deferred.onFulfilled : deferred.onRejected,
				result;
		if(!cb){
			(state === 'fulfilled' ? deferred.resolve : deferred.reject)(value);
		}
		try {
			result = cb(value);
		}
		catch(e) {
			deferred.reject(e);
			return;
		}
		deferred.resolve(result);
	}

	function resolve(newValue){
		try {
			if(newValue === self){
				throw TypeError('Promise can not resolve itself!');
			}
			if(isLikePromise(newValue)) {
				var then = newValue.then;
				doResolve(then.bind(newValue), resolve, reject);
				return ;
			}
			state = 'fulfilled';
			value = newValue;
			finale();
		}
		catch(e) {
			reject(e)
		}
	}

	function reject(newValue){
		state = 'rejected';
		value = newValue;
		finale();
	}

	function finale(){
		for(var i = 0, length = deferreds.length; i < length; i++){
			handle(deferreds[i])
		}
		deferreds = null;
	}

	doResolve(fn, resolve, reject);
}

function Handle(onFulfilled, onRejected, resolve, reject){
	this.resolve = resolve;
	this.onFulfilled = onFulfilled;
	this.reject = reject;
	this.onRejected = onRejected;
}

function doResolve(fn, onFulfilled, onRejected){
	var done = false;
	try{
		fn(function(value){
			if(done) return;
			done = true;
			onFulfilled(value);
		}, function(reason){
			if(done) return;
			done = true;
			onRejected(reason);
		});
	}
	catch(e) {
		if(done) return;
		done = true;
		onRejected(e)
	}
}

function isLikePromise(value) {
	return value && (typeof value === 'function' || typeof value === 'object') && (typeof value.then === 'function');
}


function valuePromise(value){
	this.then = function(onFulfilled) {
		if(typeof onFulfilled === 'function') {
			return new Promise(function(resolve, reject){
				try{
					resolve(onFulfilled(value));
				}
				catch (e) {
					reject(e);
				}
			});
		}
	};
}

valuePromise.prototype = Promise.prototype;

Promise.resolve = function(value) {
	if(!value) return new valuePromise(null);
	if(value.constructor == Promise){
		return value;
	}
	if(isLikePromise(newValue)) {
		try{	
			var then = value.then;
			return new Promise(then.bind(value));
		}
		catch (ex) {
			return new Promise(function(resolve, reject){
				reject(ex);
			});
		}
	}
	return new valuePromise(value);
};

Promise.all = function(arr) {
	var args = Array.prototype.slice.call(arr),
			results = [];
	return new Promise(function(resolve, reject) {
		if(args.length === 0){
			resolve([]);
		}
		var remaining = args.length;
		function res(i, val){
			try{
				if(isLikePromise(val)){
					var then = val.then;
					then.call(val, function(value){
						res(i, value);
					}, reject);
					return ;
				}
				results[i] = val;
				if(--remaining === 0){
					resolve(results);
				}
			}
			catch(e) {
				reject(e);
			}
		}
		for(var i = 0, length = args.length; i < length; i++) {
			res(i, args[i]);
		}
	});
};

Promise.reject = function(value) {
	return new Promise(function(){
		reject(value);
	})
};

Promise.race = function(args) {
	return new Promise(function(resolve, reject){
		for(var i = 0, length = args.length; i <length; i++) {
			Promise.resolve(args[i]).then(resolve, reject);
		}
	});
};

Promise.prototype['catch'] = function(onRejected) {
	return this.then(null, onRejected);
}

var deferred = function() {
	var resolveFn, rejectFn;
	var newPromise = new Promise(function(resolve, reject) {
		resolveFn = function(value) {
			resolve(value);
		};
		rejectFn = function(err) {
			reject(err);
		}
	});
	return {
		promise: newPromise,
		resolve: resolveFn,
		reject: rejectFn
	}
};

module.exports = {
	resolved: Promise.resolved,
	rejected: Promise.rejected,
	deferred: deferred
};



