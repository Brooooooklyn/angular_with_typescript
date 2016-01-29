/// <reference path="../lodash.d.ts" />
/// <reference path="../Angular.d.ts" />

class Scope13 {
  public  $parent: Scope13 = null;

  private $$watchers: Array<any> = [];
  private $$lastDirtyWatch: any = null;
  private $$asyncQueue: Array<any> = [];
  private $$applyAsyncQueue: Array<any> = [];
  private $$applyAsyncId: number = null;
  private $$postDigestQueue: Array<any> = [];
  private $root: Scope13 = this;
  private $$children: Array<Scope13> = [];
  private $$phase: string = null;
  private $$listeners: {
    [index: string]: any[];
  };

  constructor() {
    this.$$listeners = {};
  }

  private initWatchVal(): void { }

  public $watch(watchFn: Function, listenerFn: Function, valueEq: boolean = true): Function {
    var self: Scope13 = this;
    var watcher: Object = {
      watchFn: watchFn,
      listenerFn: listenerFn || function() {},
      valueEq: !!valueEq,
      last: self.initWatchVal
    }
    this.$$watchers.unshift(watcher);
    this.$root.$$lastDirtyWatch = null;
    return function(): void {
      var index = self.$$watchers.indexOf(watcher);
      if(index >= 0) {
        self.$$watchers.splice(index, 1);
        self.$root.$$lastDirtyWatch = null;
      }
    }
  }

  private $$everyScope(fn: Function): any {
    if(fn(this)) {
      return this.$$children.every(function(child) {
        return child.$$everyScope(fn);
      });
    }else {
      return false;
    }
  }

  private $digestOnce(): boolean {
    var self: Scope13 = this;
    var dirty: boolean;
    var continueLoop: boolean = true;
    this.$$everyScope(function(scope: Scope13) {
      var oldValue: any;
      var newValue: any;
      _.forEachRight(scope.$$watchers, function(watcher: any) {
        try {
          if(watcher) {
            newValue = watcher.watchFn(scope);
            oldValue = watcher.last;
            if(!scope.$$areEqual(newValue, oldValue, watcher.valueEq)) {
              scope.$root.$$lastDirtyWatch = watcher;
              watcher.last = (watcher.valueEq ? _.cloneDeep(newValue) : newValue);
              watcher.listenerFn(newValue,
              (oldValue === self.initWatchVal ? newValue : oldValue),
                scope);
              dirty = true;
            }else if(scope.$root.$$lastDirtyWatch === watcher) {
              continueLoop = false;
              return false;
            }
          }
        } catch(e) {
          console.error(e);
        }
      });
      return continueLoop;
    });
    return dirty;
  }

  private $$areEqual(newValue: any, oldValue: any, valueEq: boolean): boolean {
    if(valueEq) {
      return _.isEqual(newValue, oldValue);
    }else {
      return newValue === oldValue ||
        (typeof newValue === 'number' && typeof oldValue === 'number' &&
          isNaN(newValue) && isNaN(oldValue));
    }
  }

  public $digest(): void {
    var dirty: boolean;
    var ttl : number = 10;
    this.$root.$$lastDirtyWatch = null;
    this.$beginPhase("$digest");

    if(this.$root.$$applyAsyncId) {
      clearTimeout(this.$$applyAsyncId);
      this.$$flushApplyAsync();
    }

    do {
      while (this.$$asyncQueue.length) {
        try {
          var asyncTask = this.$$asyncQueue.shift();
          asyncTask.scope.$eval(asyncTask.expression);
        }catch(e) {
          console.error(e);
        }
      }
      dirty = this.$digestOnce();
      if ((dirty || this.$$asyncQueue.length) && !(ttl--)) {
        this.$clearPhase();
        throw '10 digest iterations reached';
      }
    } while (dirty || this.$$asyncQueue.length);
    this.$clearPhase();

    while(this.$$postDigestQueue.length) {
      try {
        this.$$postDigestQueue.shift()();
      }catch(e) {
        console.error(e);
      }
    }
  }

  public $eval(expr: Function, locals: any = undefined): any {
    return expr(this, locals);
  }

  public $apply(expr: Function) :any {
    try {
      this.$beginPhase('$apply');
      return this.$eval(expr);
    } finally {
      this.$clearPhase();
      this.$root.$digest();
    }
  }

  public $applyAsync(expr: Function): void {
    var self: Scope13 = this;
    self.$$applyAsyncQueue.push(function() {
      self.$eval(expr);
    });
    if (self.$root.$$applyAsyncId === null) {
      self.$root.$$applyAsyncId = setTimeout(function() {
        self.$apply(_.bind(self.$$flushApplyAsync, self));
      }, 0);
    }

  }

  public $evalAsync(expr: Function): void {
    var self: Scope13 = this;
    if(!self.$$phase && !self.$$asyncQueue.length) {
      setTimeout(function() {
        if (self.$$asyncQueue.length) {
          self.$root.$digest();
        }
      }, 0);
    }
    self.$$asyncQueue.push({scope: this, expression: expr});
  }

  private $$flushApplyAsync (): void {
    while (this.$$applyAsyncQueue.length) {
      try {
        this.$$applyAsyncQueue.shift()();
      }catch(e) {
        console.error(e);
      }
    }
    this.$root.$$applyAsyncId = null;
  }

  public $beginPhase(phase: string): void {
    if (this.$$phase) {
      throw this.$$phase + ' already in progress.';
    }
    this.$$phase = phase;
  }

  private $clearPhase(): void {
    this.$$phase = null;
  }

  public $$postDigest(fn): void {
    this.$$postDigestQueue.push(fn);
  }

  public $watchGroup(watchFns: Array<Function>, listenerFn: Function): Function {
    var self: Scope13 = this;
    var newValues: Array<Function> = new Array(watchFns.length);
    var oldValues: Array<Function> = new Array(watchFns.length);
    var changeReactionScheduled: boolean = false;
    var firstRun: boolean = true;

    if(watchFns.length === 0) {
      var shouldCall: boolean = true;
      self.$evalAsync(function() {
        if(shouldCall) {
          listenerFn(newValues, newValues, self);
        }
      });
      return function() {
        shouldCall = false;
      };
    }

    function watchGroupListener() {
      if(firstRun) {
        firstRun = false;
        listenerFn(newValues, newValues, self);
      } else {
        listenerFn(newValues, oldValues, self);
      }
      changeReactionScheduled = false;

    }

    var destroyFunctions = _.map(watchFns, function(watchFn, i) {
      return self.$watch(watchFn, function(newValue, oldValue) {
        newValues[i] = newValue;
        oldValues[i] = oldValue;

        if(!changeReactionScheduled) {
          changeReactionScheduled = true;
          self.$evalAsync(watchGroupListener);
        }
      });
    });

    return function() {
      _.forEach(destroyFunctions, function(destroyFunction) {
        destroyFunction();
      });
    }
  }

  public $new(isolated: boolean, parent: Scope13): Scope13 {
    var child: Scope13;
    parent = parent || this;
    if(isolated) {
      child = new Scope13();
      child.$root = parent.$root;
      child.$$asyncQueue = parent.$$asyncQueue;
      child.$$postDigestQueue = parent.$$postDigestQueue;
      child.$$applyAsyncQueue = parent.$$applyAsyncQueue;
    }else {
      child = Object.create(this);
    }
    parent.$$children.push(child);
    child.$$watchers = [];
    child.$$children = [];
    child.$$listeners = {};
    child.$parent = parent;
    return child;
  }

  public $destroy(): void {
    if(this === this.$root) {
      return ;
    }
    var siblings = this.$parent.$$children;
    var indexOfThis = siblings.indexOf(this);
    if (indexOfThis >= 0) {
      siblings.splice(indexOfThis, 1);
    }
  }

  public $watchCollection(watchFn: Function, listenerFn: Function): Function {
    var self: Scope13 = this;
    var newValue: any;
    var oldValue: any;
    var oldLength: number;
    var veryOldValue: any;
    var trackVeryOldValue: boolean = (listenerFn.length > 1);
    var changeCount: number = 0;
    var firstRun: boolean = true;

    var internalWatchFn = function(scope) {
      var newLength: number;
      var key: string;
      newValue = watchFn(scope);

      if(_.isObject(newValue)) {
        if(Angular.isArrayLike(newValue)) {
          if(!_.isArray(oldValue)) {
            changeCount ++;
            oldValue = [];
          }
          if(newValue.length !== oldValue.length) {
            changeCount ++;
            oldValue.length = newValue.length;
          }
          _.forEach(newValue, function(newItem, i) {
            var bothNaN: boolean = _.isNaN(newItem) && _.isNaN(oldValue[i]);
            if (!bothNaN && newItem !== oldValue[i]) {
              changeCount ++;
              oldValue[i] = newItem;
            }
          });
        }else {
          if(!_.isObject(oldValue) || Angular.isArrayLike(oldValue)) {
            changeCount ++;
            oldValue = {};
            oldLength = 0;
          }
          newLength = 0;
          _.forOwn(newValue, function(newVal: any, key: string) {
            newLength ++;
            if(oldValue.hasOwnProperty(key)) {
              var bothNaN = _.isNaN(newVal) && _.isNaN(oldValue[key]);
              if(!bothNaN && oldValue[key] !== newVal) {
                changeCount ++;
                oldValue[key] = newVal;
              }
            }else {
              changeCount ++;
              oldLength ++;
              oldValue[key] = newVal;
            }
          });
          if(oldLength > newLength) {
            changeCount ++;
            _.forOwn(oldValue, function(oldVal: any, key: string) {
              if (!newValue.hasOwnProperty(key)) {
                oldLength --;
                delete oldValue[key];
              }
            });
          }
        }
      }else {
        if(!self.$$areEqual(newValue, oldValue, false)) {
          changeCount ++;
        }
        oldValue = newValue;
      }

      return changeCount;
    };

    var internalListenerFn = function(scope) {
      if(firstRun) {
        listenerFn(newValue, newValue, self);
        firstRun = false;
      }else {
        listenerFn(newValue, veryOldValue, self);
      }

      if(trackVeryOldValue) {
        veryOldValue = _.clone(newValue);
      }
    };

    return this.$watch(internalWatchFn, internalListenerFn);
  }

  public $on(eventName: string, listener: Function) {
    var listeners = this.$$listeners[eventName];
    if (!listeners) {
      this.$$listeners[eventName] = listeners = [];
    }
    listeners.push(listener);
  }

  public $emit(eventName: string) {
    this.$$fireEventOnScope(eventName);
  }

  public $broadcast(eventName: string) {
    this.$$fireEventOnScope(eventName);
  }

  private $$fireEventOnScope(eventName: string) {
    var listeners = this.$$listeners[eventName] || [];
    _.forEach(listeners, (listener: Function) => {
      if (typeof(listener) === 'function') {
        listener();
      }
    });
  }

}