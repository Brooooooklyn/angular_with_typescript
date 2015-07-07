/* global describe, it, expect, chai, Scope, beforeEach Scope2 */
'use strict';

scope = new Scope2();

it("calls the listener function of a watch on first $digest", function() {

  var watchFn = function() { return 'wat'};
  var listenerFn = chai.spy();
  scope.$watch(watchFn, listenerFn);
  
  scope.$digest();
  
  expect(listenerFn).to.have.been.called();
});