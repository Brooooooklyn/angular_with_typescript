class Scope4 {
  private $$watchers: Array<any> = [];
  
  private initWatchVal():void {
    
  }
  
  public $watch(watchFn: Function, listenerFn: Function) {
    var watcher: any = {
      watchFn: watchFn,
      listenerFn: listenerFn,
      last: this.initWatchVal
    }
    this.$$watchers.push(watcher);
  }
  
  public $digest() {
    var self: Object = this;
    var oldValue: String;
    var newValue: String;
    this.$$watchers.map(function(watcher: any) {
       newValue = watcher.watchFn(self);
       oldValue = watcher.last;
       if(newValue !== oldValue) {
         watcher.last = newValue;
         watcher.listenerFn(newValue,
          (oldValue === this.initWatchValue ? newValue : oldValue), 
          self);
       }
    });
  }
}