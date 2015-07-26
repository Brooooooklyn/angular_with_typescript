class Scope3 {
  private $$watchers: Array<any> = [];
  
  public $watch(watchFn: Function, listenerFn: Function) {
    var watcher: any = {
      watchFn: watchFn,
      listenerFn: listenerFn
    }
    this.$$watchers.push(watcher);
  }
  
  public $digest() {
    var self = this;
    this.$$watchers.forEach(function(watcher: any) {
       watcher.watchFn(self);
       watcher.listenerFn();
    });
  }
}