class Scope2 {
  private $$watchers: Array<any> = [];
  
  public $watch(watchFn: Function, listenerFn: Function) {
    var watcher: any = {
      watchFn: watchFn,
      listenerFn: listenerFn
    }
    this.$$watchers.push(watcher);
  }
  
  public $digest() {
    this.$$watchers.map(function(watcher: any) {
       watcher.listenerFn();
    });
  }
}