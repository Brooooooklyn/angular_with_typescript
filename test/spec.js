describe('$scope test', function() {
/* global describe, it, expect Scope1 */
'use strict';

  
var scope = new Scope1();

it('can be constructed and used as an object', function () {
  scope.aProperty = 1;
  expect(scope.aProperty).to.equal(1);
});
/* global describe, it, expect, chai, Scope, beforeEach Scope2 */
'use strict';

scope = new Scope2();

it("calls the listener function of a watch on first $digest", function() {

  var watchFn = function() { return 'wat'};
  var listenerFn = chai.spy();
  scope.$watch(watchFn, listenerFn);
  
  scope.$digest();
  
  expect(listenerFn).to.have.been.called();
});
/* global describe, it, expect Scope4*/
'use strict';

scope = new Scope3();

it('calls the watch function with the scope as the argument', function () {
  var watchFn = chai.spy();
  var listenFn = function () {};
  
  scope.$watch(watchFn, listenFn);
  
  scope.$digest();
  
  expect(watchFn).to.have.be.called.with(scope);
});
/* global describe, it, expect Scope4*/
'use strict';

scope = new Scope4();
it('calls the listener function when the watched value changes', function () {
  scope.someValue = 'a';
  scope.counter = 0;
  
  scope.$watch(
    function() { return scope.someValue; },
    function(newValue, oldValue, scope) { scope.counter++; }
  );
  
  expect(scope.counter).to.equal(0);
  
  scope.$digest();
  expect(scope.counter).to.equal(1);
        
  scope.$digest();
  expect(scope.counter).to.equal(1);
  
  scope.someValue = 'b';
  expect(scope.counter).to.equal(1);
  
  scope.$digest();
  expect(scope.counter).to.equal(2);
  
});

it('calls listener when watch value is first undefined', function () {
   scope.counter = 0;
   
   scope.$watch(
     function(scope) { return scope.someValue; },
     function(newValue, oldValue, scope) { scope.counter ++; }
   );
   
   scope.$digest();
   expect(scope.counter).to.equal(1);
});

it('calls listener with new value as old value the first time', function () {
  scope.someValue = 123;
  var oldValueGiven;
  
  scope.$watch(
    function(scope) { return scope.someValue; },
    function(oldValue, newValue, scope) { oldValueGiven = oldValue; }
  );
  
  scope.$digest();
  expect(oldValueGiven).to.equal(123);
});

it('may have watchers that omit the listener function', function () {
  var watchFn = chai.spy('something');
  scope.$watch(watchFn);
  
  scope.$digest();
  
  expect(watchFn).to.have.been.called();
});
/* global describe, it, expect, beforeEach, Scope5 */
'use strict';

beforeEach(function() {
  scope = new Scope5();
});

// scope = new Scope5();

it('triggers chained watchers in same digest', function () {  
  scope.name = 'Jane';
  
  scope.$watch(
    function(scope) { return scope.nameUpper; },
    function(newValue, oldValue, scope) {
      if (newValue) {
        scope.initial = newValue.substring(0, 1) + '.';
      }
    }
  );
  
  scope.$watch(
    function (scope) { return scope.name; },
    function (newValue, oldValue, scope) {
      if (newValue) {
        scope.nameUpper = newValue.toUpperCase();
      }
    }        
  );
  
  scope.$digest();
  expect(scope.initial).to.equal('J.');
  
  scope.name = 'Bob';
  scope.$digest();
  expect(scope.initial).to.equal('B.');
  
});

it('gives up on the watches after 10 iterations', function () {
  scope.counterA = 0;
  scope.counterB = 0;
  
  scope.$watch(
    function(scope) { return scope.counterA; },
    function(newValue, oldValue, scope) {
      scope.counterB++;
    }
  );
  
  scope.$watch(
    function(scope) { return scope.counterB; },
    function(newValue, oldValue, scope) {
      scope.counterA++;
    }
  );
  
  expect((function() { scope.$digest(); })).to.throw();
});
  
/* global describe, it, expect, beforeEach, Scope6, _ */
'use strict';

beforeEach(function() {
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
/* global scope describe, it, expect, beforeEach, Scope7, _ */
'use strict';

beforeEach(function() {
  scope = new Scope7();
});

it("excutes $eval'ed function and returns result", function() {
  scope.aValue = 42;
  
  var result = scope.$eval(function(scope) {
    return scope.aValue;
  });
  
  expect(result).to.equal(42);
});

it("passes the second $eval argument straight through", function() {
  scope.aValue = 42;
  
  var result = scope.$eval(function(scope, arg) {
    return scope.aValue + arg;
  }, 2);
  
  expect(result).to.equal(44);
});

it("executes $apply'ed function and starts the digest", function() {
  scope.aValue = 'someValue';
  scope.counter = 0;
  
  scope.$watch(
    function(scope) {
      return scope.aValue;
    },
    function(newValue, oldValue, scope) {
      scope.counter ++;
    }
  );
  
  scope.$digest();
  expect(scope.counter).to.equal(1);
  
  scope.$apply(function(scope) {
    scope.aValue = 'someOtherValue';
  });
  expect(scope.counter).to.equal(2);
});

it("executes $evalAsync'ed function later in the same cycle", function() {
  scope.aValue = [1, 2, 3];
  scope.asyncEvaluated = false;
  scope.asyncEvaluatedImmediately = false;
  
  scope.$watch(
    function(scope) { return scope.aValue; },
    function(newValue, oldValue, scope) {
      scope.$evalAsync(function(scope) {
        scope.asyncEvaluated = true;
      });
      scope.asyncEvaluatedImmediately = scope.asyncEvaluated;
    }
  );
  
  scope.$digest();
  expect(scope.asyncEvaluated).to.equal(true);
  expect(scope.asyncEvaluatedImmediately).to.equal(false);
});

it("executes $evalAsync'ed functions added by watch functions", function() {
  scope.aVaule = [1, 2, 3];
  scope.asyncEvaluated = false;
  
  scope.$watch(
    function(scope) {
      if (!scope.asyncEvaluated) {
        scope.$evalAsync(function(scope) {
          scope.asyncEvaluated = true;
        });
      }
      return scope.aValue;
    },
    function(newValue, oldValue, scope) { }
  );
  
  scope.$digest();
  
  expect(scope.asyncEvaluated).to.equal(true);
});

it("executes $evalAsync'ed functions even when not dirty", function() {
  scope.aVaule = [1, 2, 3];
  scope.asyncEvaluatedTimes = 0;
  
  scope.$watch(
    function(scope) {
      if (scope.asyncEvaluatedTimes < 2) {
        scope.$evalAsync(function(scope) {
          scope.asyncEvaluatedTimes ++;
        });
      }
      return scope.aValue;
    },
    function(newValue, oldValue, scope) { }
  );
  
  scope.$digest();
  
  expect(scope.asyncEvaluatedTimes).to.equal(2);
});

it("eventually halts $evalAsyncs added by watches", function() {
  scope.aValue = [1, 2, 3];
  
  scope.$watch(
    function(scope) {
      scope.$evalAsync(function(scope) { });
      return scope.aValue;
    },
    function(newValue, oldValue, scope) { }
  );
  
  expect(function() { scope.$digest(); }).to.throw();
});

it("has a $$phase field whose value is the current digest phase", function() {
  scope.aValue = [1, 2, 3];
  scope.phaseInWatchFunction = undefined;
  scope.phaseInListenerFunction = undefined;
  scope.phaseInApplyFunction = undefined;
  
  scope.$watch(
    function(scope) {
      scope.phaseInWatchFunction = scope.$$phase;
      return scope.aValue;
    },
    function(newValue, oldValue, scope) {
      scope.phaseInListenerFunction = scope.$$phase;
    }
  );
  
  scope.$apply(function(scope) {
    scope.phaseInApplyFunction = scope.$$phase;
  });
  
  expect(scope.phaseInWatchFunction).to.equal('$digest');
  expect(scope.phaseInListenerFunction).to.equal('$digest');
  expect(scope.phaseInApplyFunction).to.equal('$apply');
  
});

it("schedules a digest in $evalAsync", function(done) {
  scope.aValue = "abc";
  scope.counter = 0;
  
  scope.$watch(
    function(scope) { return scope.aValue; },
    function(newValue, oldValue, scope) {
      scope.counter ++;
    }
  );
  
  scope.$evalAsync(function(scope) {
  });
  
  expect(scope.counter).to.equal(0);
  setTimeout(function() {
    expect(scope.counter).to.equal(1);
    done();
  }, 50);
  
});

it("allows async $apply with $applyAsync", function(done) {
  scope.counter = 0;
  
  scope.$watch(
    function(scope) { return scope.aValue; },
    function(newValue, oldValue, scope) {
      scope.counter ++;
    }
  );
  
  scope.$digest();
  expect(scope.counter).to.equal(1);
  
  scope.$applyAsync(function(scope) {
    scope.aValue = 'abc';
  });
  expect(scope.counter).to.equal(1);
  
  setTimeout(function() {
    expect(scope.counter).to.equal(2);
    done();
  }, 50);
  
});

it("never executes $applyAsync'ed function in the same cycle", function(done) {
  scope.aVaule = [1, 2, 3];
  scope.asyncApplied = false;
  
  scope.$watch(
    function(scope) { return scope.aValue; },
    function(newValue, oldValue, scope) {
      scope.$applyAsync(function(scope) {
        scope.asyncApplied = true;
      });
    }
  );
  
  scope.$digest();
  expect(scope.asyncApplied).to.equal(false);
  setTimeout(function() {
    expect(scope.asyncApplied).to.equal(true);
    done();
  }, 50);
});

it("coalesces many calls to $applyAsync", function(done) {
  scope.counter = 0;
  
  scope.$watch(
    function(scope) {
     scope.counter ++;
     return scope.aVaule; 
    },
    function(newValue, oldValue, scope) { }
  );
  
  scope.$applyAsync(function(scope) {
    scope.aVaule = 'abc';
  });
  scope.$applyAsync(function(scope) {
    scope.aValue = 'def';
  });
  
  setTimeout(function() {
    expect(scope.counter).to.equal(2);
    done();
  }, 50);
});

it("cancels and flushes $applyAsync if digest first", function(done) {
  scope.counter = 0;
  
  scope.$watch(
    function(scope) {
      scope.counter ++;
      return scope.aValue;
    },
    function(newValue, oldValue, scope) { }
  );
  
  scope.$applyAsync(function(scope) {
    scope.aValue = 'abc';
  });
  scope.$applyAsync(function(scope) {
    scope.aValue = 'def';
  });
  
  scope.$digest();
  expect(scope.counter).to.equal(2);
  expect(scope.aValue).to.equal('def');
  
  setTimeout(function() {
    expect(scope.counter).to.equal(2);
    done();
  }, 50);
});

it("runs a $$postDigest function after each digest", function() {
  scope.counter = 0;
  
  scope.$$postDigest(function() {
    scope.counter ++;
  });
  
  expect(scope.counter).to.equal(0);
  
  scope.$digest();
  expect(scope.counter).to.equal(1);
  
  scope.$digest();
  expect(scope.counter).to.equal(1);
});

it("does not include $$postDigest in the digest", function() {
  scope.aVaule = 'original value';
  
  scope.$$postDigest(function() {
    scope.aVaule = 'changed value';
  });
  scope.$watch(
    function(scope) {
      return scope.aVaule;
    },
    function(newValue, oldValue, scope) {
      scope.watchedValue = newValue;
    }
  );
  
  scope.$digest();
  expect(scope.watchedValue).to.equal('original value');
  
  scope.$digest();
  expect(scope.watchedValue).to.equal('changed value');

});

it("catches exceptions in watch functions and continues", function() {
  scope.aVaule = 'abc';
  scope.counter = 0;
  
  scope.$watch(
    function(scope) { throw 'error'; },
    function(newValue, oldValue, scope) { }
  );
  scope.$watch(
    function(scope) { return scope.aValue; },
    function(newValue, oldValue, scope) {
      scope.counter ++;
    }
  );
  
  scope.$digest();
  expect(scope.counter).to.equal(1);
});

it("catches exceptions in listener functions and continues", function() {
  scope.aValue = 'abc';
  scope.counter = 0;
  
  scope.$watch(
    function(scope) { return scope.aVaule; },
    function(newValue, oldValue, scope) {
      throw 'Error';
    }
  );
  scope.$watch(
    function(scope) { return scope.aValue; },
    function(newValue, oldValue, scope) {
      scope.counter ++;
    }
  )
  
  scope.$digest();
  expect(scope.counter).to.equal(1);

});
/* global scope describe, it, expect, beforeEach, Scope8, _ */

beforeEach(function() {
  scope = new Scope8;
});

it("catches exceptions in $evalAsync", function(done) {
  scope.aVaule = 'abc';
  scope.counter = 0;
  
  scope.$watch(
    function(scope) { return scope.aValue; },
    function(newValue, oldValue, scope) {
      scope.counter ++;
    }
  );
  
  scope.$evalAsync(function(scope) {
    throw 'Error';
  });
  
  setTimeout(function() {
    expect(scope.counter).to.equal(1);
    done();
  }, 50);
});

it("catches expections in $applyAsync", function(done) {
  scope.$applyAsync(function(scope) {
    throw 'Error';
  });
  scope.$applyAsync(function(scope) {
    throw 'Error';
  });
  scope.$applyAsync(function(scope) {
    scope.applied = true;
  });
  
  setTimeout(function() {
    expect(scope.applied).to.equal(true);
    done();
  }, 50);

});

it("catches exceptions in $$postDigest", function() {
  var didRun = false;
  
  scope.$$postDigest(function() {
    throw 'Error';
  });
  scope.$$postDigest(function() {
    didRun = true;
  });
  
  scope.$digest();
  expect(didRun).to.equal(true);
  
});

it("allows destroying a $watch with a removal function", function() {
  scope.aValue = 'abc';
  scope.counter = 0;
  
  var destroyWatch = scope.$watch(
    function(scope) { return scope.aValue; },
    function(newValue, oldValue, scope) {
      scope.counter ++;
    }
  );
  
  scope.$digest();
  expect(scope.counter).to.equal(1);
  
  scope.aValue = 'def';
  scope.$digest();
  expect(scope.counter).to.equal(2);
  
  scope.aValue = 'ghi';
  
  destroyWatch();
  scope.$digest();
  expect(scope.counter).to.equal(2);
});

it("allows destroying a $watch druing digest", function() {
  scope.aValue = 'abc';
  
  var watchCalls = [];
  
  scope.$watch(
    function(scope) {
      watchCalls.push('first');
      return scope.aValue;
    }
  );
  
  var destroyWatch = scope.$watch(
    function(scope) {
      watchCalls.push('second');
      destroyWatch();
    }
  );
  
  scope.$watch(
    function(scope) {
      watchCalls.push('third');
      return scope.aValue;
    }
  );
  
  scope.$digest();
  expect(watchCalls).deep.equal(['first', 'second', 'third', 'first', 'third']);
});

it("allows a $watch to destroy another during digest", function() {
  scope.aValue = 'abc';
  scope.counter = 0;
  
  scope.$watch(
    function(scope) {
      return scope.aValue;
    },
    function(newValue, oldValue, scope) {
      destroyWatch();
    }
  );
  
  var destroyWatch = scope.$watch(
    function(scope) {},
    function(newValue, oldValue, scope) { }
  );
  
  scope.$watch(
    function(scope) { return scope.aValue; },
    function(newValue, oldValue, scope) {
      scope.counter ++;
    }
  );
  
  scope.$digest();
  expect(scope.counter).to.equal(1);
});

it("allows destroying several $watches during digest", function() {
  scope.aValue = 'abc';
  scope.counter = 0;
  
  var destroyWatch1 = scope.$watch(
    function(scope) {
      destroyWatch1();
      destroyWatch2();
    }
  );
  
  var destroyWatch2 = scope.$watch(
    function(scope) { return scope.aValue; },
    function(newValue, oldValue, scope) {
      scope.counter ++;
    }
  );
  
  scope.$digest();
  expect(scope.counter).to.equal(0);
});
/* global scope describe, it, expect, beforeEach, Scope9, _ */

describe('$watchGroup', function() {
  
  beforeEach(function() {
    scope = new Scope9();
  });
  
  it('takes watches as an array and calls listener with arrays', function() {
    var gotNewValues, gotOldValues;
    
    scope.aValue = 1;
    scope.anotherValue = 2;
    
    scope.$watchGroup([
      function(scope) { return scope.aValue; },
      function(scope) { return scope.anotherValue; }
    ], function(newValues, oldValues, scope) {
      gotNewValues = newValues;
      gotOldValues = oldValues;
    });
    
    scope.$digest();
    expect(gotNewValues).deep.equal([1, 2]);
    expect(gotOldValues.length).to.equal(2);
    
  });
});

});