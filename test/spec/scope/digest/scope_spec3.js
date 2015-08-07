/* global describe, it, expect Scope4*/
'use strict';

(function(){
  var scope;
  beforeEach(function(){
    scope = new Scope3();
  });
  it('calls the watch function with the scope as the argument', function () {
    var watchFn = chai.spy();
    var listenFn = function () {};
    
    scope.$watch(watchFn, listenFn);
    
    scope.$digest();
    
    expect(watchFn).to.have.be.called.with(scope);
  });
})();

