/* global describe, it, expect, beforeEach, Scope6, _ */
'use strict';

(function(){
  var scope;
  beforeEach(function(){
    scope = new Scope6();
  });
  /**
   * Short-Circuiting The Digest When The Last Watch Is Clean
   * 在digest的时候,会对值进行比较。在已有的策略digest策略中:
   * 只要有一次digest检测出了值的变化,那么在后面的所有digest中,
   * 即使watchFn判断listener监测的值没有变化,也会继续digest下去
   * 这里的一步是优化掉可能浪费的检测，在digest过程中,如果两次digest发现他们的lastDirtyWatch 是同一个
   * 就直接return false, false代表后面的watcher都是clean的
   */
  it('ends the digest when the last watch is clean', function() {
    
    scope.array = _.range(100);
    var watchExecutions = 0;
    
    _.times(100, function(i) {
      scope.$watch(
        function(scope) {
          watchExecutions ++;
          return scope.array[i];
        },
        function(newValue, oldValue, scope) {}
      );
    });
    
    scope.$digest();
    expect(watchExecutions).to.equal(200);
    
    scope.array[0] = 420;
    scope.$digest();
    expect(watchExecutions).to.equal(301);  
  });
  
  /**
   * 在上一步的设计中会导致一个问题：如果一个watch是在listener中新创建的
   * 那么在digest的时候新的watchFn不会被执行，因为$$lastDirtyWatch 在新的watchFn执行前一直指向原来的watch
   * 我们需要在watch初始化的时候把$$lastDirtyWatch 指向null 来避免这个问题
   */
  
  it('does not end digest so that new watches are not run', function() {
    scope.aValue = 'abc';
    scope.counter = 0;
    
    scope.$watch(
      function(scope) { return scope.aValue; },
      function(newValue, oldValue, scope) {
        scope.$watch(
          function(scope) { return scope.aValue; },
          function(newValue, oldValue, scope) {
            scope.counter ++;  
          }
        )
      }
    );
    
    scope.$digest();
    expect(scope.counter).to.equal(1);
  });
  
  /**
   * Value-Based Dirty-Checking
   * 这里书中的做法是将 === 判断换成了lodash的isEqual方法
   * 这个方法是针对直接变量量与引用类型的变量进行不同策略的判断
   * angular采用了类似的策略
   * 需要注意的是，在angulr 1.x 中, 将scope下的一个对象的一个属性绑定到前端view的时候，实际上是监听的这个属性的值而不是整个对象
   */
  it('compares based on value if enable', function() {
    scope.aValue = [1, 2, 3];
    scope.counter = 0;
    
    scope.$watch(
      function(scope) { return scope.aValue; },
      function(newValue, oldValue, scope) {
        scope.counter ++;
      },
      true
    );
    
    scope.$digest();
    expect(scope.counter).to.equal(1);
    
    scope.aValue.push(4);
    scope.$digest();
    expect(scope.counter).to.equal(2);
  });
  
  /**
   * NaN !== NaN 需要特别的去处理NaN
   */
  it('currectly handlers NaNs', function() {
    scope.number = 0/0; //NaN
    scope.counter = 0;
    
    scope.$watch(
      function(scope) { return scope.number; },
      function(newValue, oldValue, scope) {
        scope.counter ++;
      }
    );
    
    scope.$digest();
    expect(scope.counter).to.equal(1);
    
    scope.$digest();
    expect(scope.counter).to.equal(1);
  });
})();