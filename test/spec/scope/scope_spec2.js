/* global describe, it, expect, chai, Scope, beforeEach */
'use strict';

describe('Scope', function () {
	describe('Core function test', function () {
		it('can be constructed and used as an object', function () {
      var scope = new Scope();
      scope.aProperty = 1;
      expect(scope.aProperty).to.equal(1);
    });
	});
  
  describe('digest', function() {
    var scope;
    beforeEach(function() {
      scope = new Scope();
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