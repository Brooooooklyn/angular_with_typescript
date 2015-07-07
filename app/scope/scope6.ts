/// <reference path="../lodash.d.ts" />
class Scope6 {
  private $$watchers: Array<any> = [];
  private $$lastDirtyWatch: any = null;
  
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
    do {
      dirty = this.$digestOnce();
      if (dirty && !(ttl--)) {
        throw '10 digest iterations reached';
      }
    } while (dirty);
  }
}