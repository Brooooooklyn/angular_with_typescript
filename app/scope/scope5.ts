/// <reference path="../lodash.d.ts" />
class Scope5 {
  private $$watchers: Array<any> = [];
  
  private initWatchVal(): void {
    
  }
  
  public $watch(watchFn: Function, listenerFn: Function): void {
    var self: Scope5 = this;
    var watcher: any = {
      watchFn: watchFn,
      listenerFn: listenerFn || function() {},
      last: self.initWatchVal
    }
    this.$$watchers.push(watcher);
  }
  
  private $digestOnce(): boolean {
    var self: Scope5 = this;
    var oldValue: any;
    var newValue: any;
    var dirty: boolean;
    _.forEach(this.$$watchers ,function(watcher: any) {
       newValue = watcher.watchFn(self);
       oldValue = watcher.last;
       if(newValue !== oldValue) {
         watcher.last = newValue;
         watcher.listenerFn(newValue,
          (oldValue === self.initWatchVal ? newValue : oldValue), 
          self);
          dirty = true;
       }
    });
    return dirty;
  }
  
  public $digest(): void {
    var dirty: boolean;
    var ttl : number = 10;
    do {
      dirty = this.$digestOnce();
      if (dirty && !(ttl--)) {
        throw '10 digest iterations reached';
      }
    } while (dirty);
  }
}