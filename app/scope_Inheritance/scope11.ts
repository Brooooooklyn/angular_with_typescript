/// <reference path="../lodash.d.ts" />
class Scope11 {
  private $$watchers: Array<any> = [];
  private $$lastDirtyWatch: any = null;
  private $$asyncQueue: Array<any> = [];
  private $$applyAsyncQueue: Array<any> = [];
  private $$applyAsyncId: number = null;
  private $$postDigestQueue: Array<any> = [];
  private $root: Scope11 = this;  
  private $$children: Array<Scope11> = [];
  private $$phase: string = null;
  public  $parent: Scope11 = null;
  
  private initWatchVal(): void { }
  
  public $watch(watchFn: Function, listenerFn: Function, valueEq: boolean = true): Function {
    var self: Scope11 = this;
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
    var self: Scope11 = this;
    var dirty: boolean;
    var continueLoop: boolean = true;
    this.$$everyScope(function(scope) {
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
    var self: Scope11 = this;
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
    var self: Scope11 = this;
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
    var self: Scope11 = this;
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
  
  public $new(isolated: boolean, parent: Scope11): Scope11 {
    var child: Scope11;
    parent = parent || this;
    if(isolated) {
      child = new Scope11();
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
  
}