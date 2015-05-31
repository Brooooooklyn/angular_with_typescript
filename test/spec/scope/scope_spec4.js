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
	});
});