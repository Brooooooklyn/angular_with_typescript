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
