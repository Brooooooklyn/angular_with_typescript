class Scope3 {
  $$watchers: Array<any> = [];
  
  $watch(watchFn: Function, listenerFn: Function) {
    var watcher: any = {
      watchFn: watchFn,
      listenerFn: listenerFn
    }
    this.$$watchers.push(watcher);
  }
  
  $digest() {
    var self = this;
    this.$$watchers.map(function(watcher: any) {
       watcher.watchFn(self);
       watcher.listenerFn();
    });
  }
}