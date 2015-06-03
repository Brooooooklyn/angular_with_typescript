/* global describe, it, expect */
'use strict';

describe('Scope test', function () {
	describe('Core function test', function () {
		it('can be constructed and used as an object', function () {
      var scope = new Scope1();
      scope.aProperty = 1;
      expect(scope.aProperty).to.equal(1);
    });
	});
});
/* global describe, it, expect, chai, Scope, beforeEach */
'use strict';

describe('Scope', function () {
  describe('digest', function() {
    var scope;
    beforeEach(function() {
      scope = new Scope2();
    });
    
    it("calls the listener function of a watch on first $digest", function() {
      var watchFn = function() { return 'wat'};
      var listenerFn = chai.spy();
      scope.$watch(watchFn, listenerFn);
      
      scope.$digest();
      
      expect(listenerFn).to.have.been.called();
    });
  });
});
/* global describe, it, expect */
'use strict';

describe('Scope test', function () {
	describe('Core function test', function () {
    var scope;
    beforeEach(function() {
      scope = new Scope3();
    });
		it('calls the watch function with the scope as the argument', function () {
      var watchFn = chai.spy();
      var listenFn = function () {};
      
      scope.$watch(watchFn, listenFn);
      
      scope.$digest();
      
      expect(watchFn).to.have.be.called.with(scope);
    });
	});
});
/* global describe, it, expect */
'use strict';

describe('Scope test', function () {
	describe('Core function test', function () {
    var scope;
    beforeEach(function() {
      scope = new Scope4();
    });
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
	});
});
/* global describe, it, expect, beforeEach, Scope5 */
'use strict';

describe('Scope test', function () {
	describe('$digest', function () {
    var scope;
    beforeEach(function () {
      scope = new Scope5();
    });
    
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
	});
});