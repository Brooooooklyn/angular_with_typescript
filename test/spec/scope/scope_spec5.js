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
    
	});
});