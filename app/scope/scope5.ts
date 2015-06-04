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
  
  private $digestOnce(): boolean {
    var self: Object = this;
    var oldValue: string;
    var newValue: string;
    var dirty: boolean;
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