class Scope {
  $$watchers: Array<any> = [];
  
  $watch(watchFn: Function, listenerFn: Function) {
    var watcher: any = {
      watchFn: watchFn,
      listenerFn: listenerFn
    }
    this.$$watchers.push(watcher);
  }
  
  $digest() {
    this.$$watchers.map(function(watcher: any) {
       watcher.listenerFn();
    });
  }
}