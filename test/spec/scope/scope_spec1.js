/* global describe, it, expect Scope1 */
'use strict';

(function(){
  var scope;
  beforeEach(function() {
    scope = new Scope1();
  });
  it('can be constructed and used as an object', function () {
    scope.aProperty = 1;
    expect(scope.aProperty).to.equal(1);
  });
})();
