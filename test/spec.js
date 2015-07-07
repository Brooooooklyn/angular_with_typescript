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
  
/* global describe, it, expect, beforeEach, Scope6 */
'use strict';

beforeEach(function() {
  scope = new Scope6();
});

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

it('does not end digest so that new watches are not run', function() {
  scope.aValue = 'abc';
  scope.counter = 0;
  
  scope.$watch(
    function(scope) { return scope.aValue; },
    function(newValue, oldValue, scope) {
      scope.counter ++;  
    }
  );
  
  scope.$digest();
  expect(scope.counter).to.equal(1);
});

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

});