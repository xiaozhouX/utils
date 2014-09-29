var define, requireModule, require, requirejs;
(function () {
	var registry = {}, seen = {};

	define = function(name, deps, callback) {
		registry[name] = {deps: deps, callback: callback};
	};

	require = requirejs = requireModule = function(name) {
		if(seen[name]) {return seen[name];}
		seen[name] = {};

		if(!registry[name]) {
			dynamicLoading(registry[name] +'.js');
      // throw new Error("Could not find module " + name);
		}

		var mod = registry[name],
			reified = [],
			deps = mod.deps,
			callback = mod.callback,
			i, length, dep_name,
			exports;

		for(i = 0, length = deps.length; i< length; i++) {
			dep_name = deps[i];
			if(dep_name === 'exports') {
				reified.push(exports = {});
			} else {
				reified.push(requireModule(resolve(dep_name)));
			}
		}

		value = callback.apply(this, reified);
		console.log('[Load Module Finished]: ' + name);
		return seen[name] = exports ? exports : value;

		function resolve(depName) {
			if(depName.charAt(0) !== '.') {return depName;}
			var presentPath = nam.split('/').splice(0, -1),
				depPaths = depName.split('/'),
				i, length;
			for(i = 0, length = depPaths.length; i < length; i++) {
				if(depPaths[i] === '.') {
					continue;
				} else if(depPaths[i] === '..') {
					presentPath.pop();
				} else {
					presentPath.push(depPaths[i]);
				}
			}
			return presentPath.join('/')
		}
		function dynamicLoading(url){
			console.log(url);
		}
	}
}());