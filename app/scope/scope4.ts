class Scope4 {
  $$watchers: Array<any> = [];
  
  $watch(watchFn: Function, listenerFn: Function) {
    var watcher: any = {
      watchFn: watchFn,
      listenerFn: listenerFn
    }
    this.$$watchers.push(watcher);
  }
  
  $digest() {
    var self: Object = this;
    var oldValue: String;
    var newValue: String;
    this.$$watchers.map(function(watcher: any) {
       newValue = watcher.watchFn(self);
       oldValue = watcher.last;
       if(newValue !== oldValue) {
         watcher.last = newValue;
         watcher.listenerFn(newValue, oldValue, self);
       }
    });
  }
}