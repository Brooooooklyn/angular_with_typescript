class Scope5 {
  private $$watchers: Array<any> = [];
  
  private initWatchVal(): void {
    
  }
  
  public $watch(watchFn: Function, listenerFn: Function): void {
    var watcher: any = {
      watchFn: watchFn,
      listenerFn: listenerFn || function() {},
      last: this.initWatchVal
    }
    this.$$watchers.push(watcher);
  }
  
  private $digestOnce(): Boolean {
    var self: Object = this;
    var oldValue: String;
    var newValue: String;
    var dirty: Boolean;
    this.$$watchers.map(function(watcher: any) {
       newValue = watcher.watchFn(self);
       oldValue = watcher.last;
       if(newValue !== oldValue) {
         watcher.last = newValue;
         watcher.listenerFn(newValue,
          (oldValue === this.initWatchValue ? newValue : oldValue), 
          self);
          dirty = true;
       }
    });
    return dirty;
  }
  
  public $digest(): void {
    var dirty: Boolean;
    do {
      dirty = this.$digestOnce();
      
    } while (dirty);
  }
}