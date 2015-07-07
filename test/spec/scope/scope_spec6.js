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