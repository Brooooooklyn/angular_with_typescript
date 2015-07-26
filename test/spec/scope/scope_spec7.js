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