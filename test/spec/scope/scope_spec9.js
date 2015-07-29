/* global scope describe, it, expect, beforeEach, Scope9, _ */

describe('$watchGroup', function() {
  var scope;
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
    expect(gotOldValues).deep.equal([1, 2]);
    
  });
  
  it('only calls listener once per digest', function() {
    var counter = 0;
    
    scope.aValue = 1;
    scope.anotherValue = 2;
    
    scope.$watchGroup([
      function(scope) { return scope.aValue; },
      function(scope) { return scope.anotherValue; }
    ], function(newValues, oldValues, scope) {
      counter ++;
    });
    scope.$digest();
    
    expect(counter).to.equal(1);
  });
  
  it('uses the same array of old and new values on first run', function() {
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
    
    expect(gotNewValues).deep.equal(gotOldValues)
  });
  
  it('uses different arrays for old and new values on subsequent runs', function() {
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
    
    scope.anotherValue = 3;
    scope.$digest();
    
    expect(gotNewValues).deep.equal([1, 3]);
    expect(gotOldValues).deep.equal([1, 2]);
    
  });
  
  it('calls the listener once when the watch array is empty', function() {
    var gotNewValues, gotOldValues;
    
    scope.$watchGroup([], function(newValues, oldValues, scope) {
      gotNewValues = newValues;
      gotOldValues = oldValues;
    });
    scope.$digest();
    
    expect(gotNewValues).deep.equal([]);
    expect(gotOldValues).deep.equal([]);
  });
  
  it('can be deregistered', function() {
    var counter = 0;
    
    scope.aValue = 1;
    scope.anotherValue = 2;
    
    var destroyGroup = scope.$watchGroup([
      function(scope) { return scope.aValue; },
      function(scope) { return scope.anotherValue; }
    ], function(newValues, oldValues, scope) {
      counter ++;
    });
    scope.$digest();
    
    scope.anotherValue = 3;
    destroyGroup();
    scope.$digest();
    
    expect(counter).to.equal(1);
    
  });
  
  it('does not call the zero-watch listener when deregistered first', function() {
    var counter = 0;
    
    var destroyGroup = scope.$watchGroup([], function(newValues, oldValues, scope) {
      counter ++;
    });
    destroyGroup();
    scope.$digest();
    
    expect(counter).to.equal(0);
    
    
  });
  
});