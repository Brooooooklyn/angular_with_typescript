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