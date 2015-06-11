/// <reference path="../lodash.d.ts" />
class Scope6 {
  private $$watchers: Array<any> = [];
  private $$lastDirtyWatch: any = null;
  
  private initWatchVal(): void { }
  
  public $watch(watchFn: Function, listenerFn: Function): void {
    var watcher: any = {
      watchFn: watchFn,
      listenerFn: listenerFn || function() {},
      last: this.initWatchVal
    }
    this.$$watchers.push(watcher);
  }
  
  private $digestOnce(): boolean {
    var self: any = this;
    var oldValue: string;
    var newValue: string;
    var dirty: boolean;
    _.forEach(this.$$watchers, function(watcher: any) {
       newValue = watcher.watchFn(self);
       oldValue = watcher.last;
       if(newValue !== oldValue) {
         self.$$lastDirtyWatch = watcher;
         watcher.last = newValue;
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