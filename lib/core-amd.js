(function (root) {
  var i = 0;
  var seen = {}, _Pending = {}, registry = {};
  var customPath = {}, rootPath = location.pathname;
  var depsLoadPromise = {}, loadJsFilePromise = {};
  var test = {};
  var define = function(name, deps, callback) {
    depsLoadPromise[name] = new Promise(function(modResolve, modReject) {
      var promiseMap = deps.map(function(dep){
        var runNow = false;
        /*判断该模块是否立即执行*/
        if(dep.indexOf('run:') === 0){
          dep = dep.slice(4);
          runNow = true;
        }
        var depName = getModPath(dep, name);
        if(runNow){
          makeLoadJsFilePromise(depName).then(function(){
            seen[depName] = seen[depName] || require(depName);
          })
        }
        return makeLoadJsFilePromise(depName);
      });
      return Promise.all(promiseMap).then(function(results){
        registry[name] = {name: name, deps: results, callback: callback};
        modResolve(registry[name]);
        console.log('[Load Module]: ' + name);
      }, modReject);
    }).catch(function(e){
      console.error('[Error]: ' + e);
      throw Error('load module ' + name + ' faild: ')
    });
    return {
      run: function(){
        depsLoadPromise[name].then(function(){
          require(name);
        }, function(e){
          console.error('[Error]: ' + e);
        });
      }
    }
  };

  var defineConfig = function(options){
    for(var key in options){
      if(key !== 'root'){
        customPath[key] = options[key];
      }
    }
    var configRootPath = options.root || '';
    rootPath = getModPath(configRootPath, rootPath);
  }

  function require(name){
    if(!registry[name]){
      return makeLoadJsFilePromise(name).then(function(){
        return require(name);
      }).catch(function(e){
        throw Error('[Error]: can not find module ' + name);
      });
    }
    if(seen[name]){
      return seen[name];
    }
    var mod = registry[name],
        deps = mod.deps,
        callback = mod.callback,
        depsResult = [],
        depName;
    for(var i in deps) {
      depName = deps[i].name;
      seen[depName] = seen[depName] || require(depName);
      depsResult.push(seen[depName]);
    }
    return callback.apply(null, depsResult);
  }

  function makeLoadJsFilePromise(modName) {
    if(customPath[modName]){
      modName = customPath[modName];
    }
    if(loadJsFilePromise[modName]){
      return loadJsFilePromise[modName];
    }
    var basePath = rootPath.split('/').slice(0, -1),
        modPath = (modName).split('/'),
        filePath = basePath.concat(modPath).join('/');
    if(filePath.slice(-3) !== '.js') {
      filePath = filePath + '.js';
    }
    loadJsFilePromise[modName] = mekeJsFileimportPromise(filePath).then(function(){
      return depsLoadPromise[modName] || Promise.reject('can not find module ' + modName);
    });
    return loadJsFilePromise[modName];
  }

  /*Load JS File in Browser*/
  function mekeJsFileimportPromise(filePath){
    return new Promise(function(resolve, reject){
      var script = document.createElement('script');
      script.src = filePath;
      document.body.appendChild(script);
      script.onload = function(){
        resolve(script);
      };
      script.onerror = function(){
        reject('Error: can not find file: ' + filePath);
      };
    }).then(function(elem){
      document.body.removeChild(elem);
    });
  }

  function getModPath(depName, baseName) {
    var presentPath = baseName ? baseName.split('/').slice(0, -1) : [],
      depPaths = depName.split('/'),
      i, length;
    if(depName.charAt(0) !== '.') {return depName;}
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
    root.define = root.define || define;
    root.defineConfig = root.defineConfig || defineConfig;

}(window));