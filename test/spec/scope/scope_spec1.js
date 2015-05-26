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