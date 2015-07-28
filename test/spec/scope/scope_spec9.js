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