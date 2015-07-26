/// <reference path="../lodash.d.ts" />
class Scope7 {
  private $$watchers: Array<any> = [];
  private $$lastDirtyWatch: any = null;
  private $$asyncQueue: Array<any> = [];
  private $$applyAsyncQueue: Array<any> = [];
  private $$applyAsyncId: number = null;
  private $$postDigestQueue: Array<any> = [];
  private $$phase: string = null;
  
  private initWatchVal(): void { }
  
  public $watch(watchFn: Function, listenerFn: Function, valueEq: boolean): void {
    var watcher: Object = {
      watchFn: watchFn,
      listenerFn: listenerFn || function() {},
      valueEq: !!valueEq,
      last: this.initWatchVal
    }
    this.$$watchers.push(watcher);
    this.$$lastDirtyWatch = null;
  }
  
  private $digestOnce(): boolean {
    var self: any = this;
    var oldValue: string;
    var newValue: string;
    var dirty: boolean;
    _.forEach(this.$$watchers, function(watcher: any) {
      try {
        newValue = watcher.watchFn(self);
        oldValue = watcher.last;
        if(!self.$$areEqual(newValue, oldValue, watcher.valueEq)) {
          self.$$lastDirtyWatch = watcher;
          watcher.last = (watcher.valueEq ? _.cloneDeep(newValue) : newValue);
          watcher.listenerFn(newValue,
          (oldValue === this.initWatchValue ? newValue : oldValue), 
            self);
          dirty = true;
        }else if(self.$$lastDirtyWatch === watcher) {
          return false;
        }
      } catch(e) {
        console.error(e);
      }
    });
    return dirty;
  }
  
  private $$areEqual(newValue: any, oldValue: any, valueEq): boolean {
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
    this.$$lastDirtyWatch = null;
    this.$beginPhase("$digest");
    
    if(this.$$applyAsyncId) {
      clearTimeout(this.$$applyAsyncId);
      this.$$flushApplyAsync();
    }
    
    do {
      while (this.$$asyncQueue.length) {
        var asyncTask = this.$$asyncQueue.shift();
        asyncTask.scope.$eval(asyncTask.expression);
      }
      dirty = this.$digestOnce();
      if ((dirty || this.$$asyncQueue.length) && !(ttl--)) {
        this.$clearPhase();
        throw '10 digest iterations reached';
      }
    } while (dirty || this.$$asyncQueue.length);
    this.$clearPhase();
    
    while(this.$$postDigestQueue.length) {
      this.$$postDigestQueue.shift()();
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
      this.$digest();
    }
  }
  
  public $applyAsync(expr: Function): void {
    var self: Scope7 = this;
    self.$$applyAsyncQueue.push(function() {
      self.$eval(expr);
    });
    if (self.$$applyAsyncId === null) {
      self.$$applyAsyncId = setTimeout(function() {
        self.$apply(_.bind(self.$$flushApplyAsync, self));
      }, 0);
    }
   
  }
  
  public $evalAsync(expr: Function): void {
    var self: Scope7 = this;
    if(!self.$$phase && !self.$$asyncQueue.length) {
      setTimeout(function() {
        if (self.$$asyncQueue.length) {
          self.$digest();
        }
      }, 0);
    }
    self.$$asyncQueue.push({scope: this, expression: expr});
  }
  
  private $$flushApplyAsync (): void {
    while (this.$$applyAsyncQueue.length) {
      this.$$applyAsyncQueue.shift()();
    }
    this.$$applyAsyncId = null;
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
  
}