define('event/delegate', ['event/unifyEvent'], function(UnifyEvent) {
  // TODO: add off function,
  //       change match function logic
  var CAPTURE_TYPE = ['focus', 'blur', 'load', 'error'];
  function Delegate(rootElem) {
    this.rootElem = rootElem || document;
    this.listenerMap = {};
    this.handle = Delegate.prototype.handle.bind(this);
  }
  Delegate.prototype.on = function(eventType, childSelector, handler) {
    var listenerList = this.listenerMap,
        rootElem = this.rootElem,
        isCapture;
    if (!rootElem) {
      return;
    }
    if (!listenerList[eventType]) {
      isCapture = CAPTURE_TYPE.indexOf(eventType) !== -1; //判断该事件的监听方式 捕获或者冒泡
      listenerList[eventType] = [];
      rootElem.addEventListener(eventType, this.handle, isCapture);
    }
    listenerList[eventType].push({
      selector: childSelector,
      matche: matcheFn,
      handler: handler
    });
    return this;
  };
  Delegate.prototype.off = function(eventType, childSelector, handler) {
    var listenerList = this.listenerMap,
        rootElem = this.rootElem,
        i, eventListenerList, listener;
    if(!eventType){
      for(eachEventType in listenerList){
        if(listenerList.hasOwnProperty(eachEventType)){
          this.off(eachEventType, childSelector, handler);
        }
      }
      return this;
    }
    childSelector = !childSelector ? '*' : childSelector;
    eventListenerList = listenerList[eventType];
    for(i = eventListenerList.length - 1; i >= 0; i--) {
      listener = eventListenerList[i];
      if(selectorMatch(listener.selector, childSelector) && (!handler || listener.handler === handler)) {
        eventListenerList.splice(i, 1);
      }
    }
    return this;
  };
  Delegate.prototype.handle = function(event) {
    var target = event.target,
      eventType = event.type,
      rootElem = this.rootElem,
      eventListenerList = this.listenerMap[eventType],
      length = eventListenerList.length,
      unifyEvent = new UnifyEvent(event),
      returned, listener, i, stopPropagate = false;
    while (target) {
      unifyEvent.reset(target);
      for (i = 0; i < length; i++) {
        listener = eventListenerList[i];
        if (!listener) break;
        if (listener.matche.call(target, listener.selector, target)) {
          returned = this.fireHandlerEvent(unifyEvent, target, listener);
          if (returned.fnReturned === false) {
            unifyEvent.preventDefault();
          }
          if(returned.stopPropagate){ //if stopPropagation is called
            stopPropagate = true;
          }
          if (returned.stopImmediate === true) {  //if stopImmediatePropagation is called
            break;
          }
        }
      }
      if (target === rootElem || stopPropagate) {
        break;
      }
      length = eventListenerList.length;
      target = target.parentElement;
    }
  };
  Delegate.prototype.fireHandlerEvent = function(event, target, listener) {
    return {
      fnReturned: listener.handler.call(target, event, target),
      stopImmediate: event.stopImmediate,
      stopPropagate: event.stopPropagate
    };
  }

  function matcheFn(selector, elem) {
    return elem.matches(selector);
    // if(selector === '*') return true;
    // var queryResults = document.querySelectorAll(selector),
    //   length = queryResults.length,
    //   i;
    // for (i = 0; i < length; i++) {
    //   if (queryResults[i] == elem) {
    //     return true;
    //   }
    // }
    // return false;

    // var type = selector.slice(0, 1);
    // if(type === '#'){
    //   return elem.id == selector.slice(1);
    // }else if(type === '.') {
    //   return Array.prototype.slice.call(elem.classList).indexOf(selector.slice(1)) !== -1;
    // }else {
    //   return elem.tagName.toLowerCase() === selector.toLowerCase();
    // }
  }
  function selectorMatch(targetSelector, matchSelector){
    return matchSelector === '*' || matchSelector === targetSelector;
  }
  return Delegate;
});

define('event/unifyEvent', [], function(){
  function UnifyEvent(event) {
    this.originEvent = event;
    this.hasCreated = true;
    this.target = event.target;
    this.stopImmediate = false;
    this.stopPropagate = false;
  }
  UnifyEvent.prototype.reset = function(target){
    this.currentTarget = target;
    this.stopImmediate = false;
    this.stopPropagate = false;
  };
  UnifyEvent.prototype.preventDefault = function() {
    this.originEvent.preventDefault();
  };
  UnifyEvent.prototype.stopImmediatePropagation = function() {
    this.stopImmediate = true;
    this.stopPropagate = true;
  };
  UnifyEvent.prototype.stopPropagation = function() {
    this.stopPropagate = true;
  };
  return UnifyEvent;
});