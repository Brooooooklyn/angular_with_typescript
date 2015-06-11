/* global describe, it, expect, beforeEach, Scope6 */
'use strict';

describe('Scope test', function () {
	var scope = new Scope6();
  describe('$digest', function () {
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
    
    
	});
});