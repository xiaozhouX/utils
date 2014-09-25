function topo(rootFn){
  var explored = {};
  function search(rFn){
    if(explored[rFn.id]) return [];
    explored[rFn.id] = true;
    return rFn.dependents.reduce(function(memo, dep){
      return memo.concat(search(dep));
    }, []).concat(rFn);
  }
  return search(rootFn).reverse();
}
function wrap(rfn){
    return rfn && rfn._isReactive ? rfn : $R(function(){
      return rfn;
    });
}
var _uniqueId = function(){
  var iCounts = 0;
  return function(prefix){
    iCounts++;
    prefix = prefix || '';
    return prefix + '' + iCounts;
  };
}();
function _extend(obj/*, extObjs*/){
  var extensions = Array.prototype.slice.call(arguments, 1),
      key;
  extensions.forEach(function(extension){
    for(key in extension){
      if(extension.hasOwnProperty(key)){
        obj[key] = extension[key];
      }
    }
  });
  return obj;
}
function $R(fn, context){
  var rf = function(){
    var fnNode = topo(rf),
        result = fnNode[0].run.apply(rf, arguments);
    if(result === $R._){
      return;
    }
    fnNode.slice(1).forEach(function(d, val){
      d.run();
    });
    return result;
  }
  rf.id = _uniqueId('$R');
  rf.dependents = [];
  rf.dependencies = [];
  rf.memo = $R.empty;
  rf.context = context || rf;
  rf.fn = fn;
  return _extend(rf, reactiveExtensions);
}
  $R.empty = {};
  $R._ = {};
  $R.status = function(initial){
    var rfn = $R(function(){
      if(arguments.length > 0){
        this.val = arguments[0];
      }
      return this.val;
    });
    rfn.val = initial;
    rfn.context = rfn;
    return rfn;
  };
var reactiveExtensions = {
  _isReactive: true,
  run: function(){
    var args = Array.prototype.slice.call(arguments);
    return this.memo = this.fn.apply(this.context, this.argumentList(args));
  },
  get: function(){
    return this.memo === $R.empty ? this.run() : this.memo;
  },
  bindTo: function(){
    var oldDependencies = this.dependencies,
        newDependencies = Array.prototype.slice.call(arguments).map(wrap);

    oldDependencies.forEach(function(dep){
      if(dep !== $R._){
        dep.removeDependent(this);
      }
    }, this);
    this.dependencies = newDependencies = newDependencies.filter(function(dep){
      return dep !== this;
    }, this);
    newDependencies.map(function(dep){
        if(dep !== $R._){
          dep.addDependent(this);
        }
    }, this);
    return this;
  },
  addDependent: function(dep){
    if(!this.dependents.some(function(value){
      return value === dep;
    })){
      this.dependents.push(dep);
    }
  },
  removeDependent: function(dep){
    this.dependents = this.dependents.filter(function(value){
      return value !== dep;
    });
  },
  argumentList: function(args){
    return this.dependencies.map(function(dep){
      if(dep === $R._){
        return args.shift();
      }else if(dep._isReactive){
        return dep.get();
      }else {
        return undefined;
      }
    }).concat(args);
  }
}