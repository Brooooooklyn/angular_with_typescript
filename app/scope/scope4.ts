/// <reference path="../lodash.d.ts" />
class Scope4 {
  private $$watchers: Array<any> = [];
  
  private initWatchVal(): void {
    
  }
  
  public $watch(watchFn: Function, listenerFn: Function) {
    var watcher: any = {
      watchFn: watchFn,
      listenerFn: listenerFn || function() {},
      last: this.initWatchVal
    }
    this.$$watchers.push(watcher);
  }
  
  public $digest() {
    var self: Scope4 = this;
    var oldValue: any;
    var newValue: any;
    _.forEach(this.$$watchers, function(watcher: any) {
       newValue = watcher.watchFn(self);
       oldValue = watcher.last;
       if(newValue !== oldValue) {
         watcher.last = newValue;
         watcher.listenerFn(newValue,
          (oldValue === self.initWatchVal ? newValue : oldValue), 
          self);
       }
    });
  }
}