/* global scope describe, it, expect, beforeEach, Scope8, _ */

(function(){
  var scope;
  beforeEach(function() {
    scope = new Scope8;
  });
  it("catches exceptions in $evalAsync", function(done) {
    scope.aVaule = 'abc';
    scope.counter = 0;
    
    scope.$watch(
      function(scope) { return scope.aValue; },
      function(newValue, oldValue, scope) {
        scope.counter ++;
      }
    );
    
    scope.$evalAsync(function(scope) {
      throw 'Error';
    });
    
    setTimeout(function() {
      expect(scope.counter).to.equal(1);
      done();
    }, 50);
  });
  
  it("catches expections in $applyAsync", function(done) {
    scope.$applyAsync(function(scope) {
      throw 'Error';
    });
    scope.$applyAsync(function(scope) {
      throw 'Error';
    });
    scope.$applyAsync(function(scope) {
      scope.applied = true;
    });
    
    setTimeout(function() {
      expect(scope.applied).to.equal(true);
      done();
    }, 50);
  
  });
  
  it("catches exceptions in $$postDigest", function() {
    var didRun = false;
    
    scope.$$postDigest(function() {
      throw 'Error';
    });
    scope.$$postDigest(function() {
      didRun = true;
    });
    
    scope.$digest();
    expect(didRun).to.equal(true);
    
  });
  
  it("allows destroying a $watch with a removal function", function() {
    scope.aValue = 'abc';
    scope.counter = 0;
    
    var destroyWatch = scope.$watch(
      function(scope) { return scope.aValue; },
      function(newValue, oldValue, scope) {
        scope.counter ++;
      }
    );
    
    scope.$digest();
    expect(scope.counter).to.equal(1);
    
    scope.aValue = 'def';
    scope.$digest();
    expect(scope.counter).to.equal(2);
    
    scope.aValue = 'ghi';
    
    destroyWatch();
    scope.$digest();
    expect(scope.counter).to.equal(2);
  });
  
  it("allows destroying a $watch druing digest", function() {
    scope.aValue = 'abc';
    
    var watchCalls = [];
    
    scope.$watch(
      function(scope) {
        watchCalls.push('first');
        return scope.aValue;
      }
    );
    
    var destroyWatch = scope.$watch(
      function(scope) {
        watchCalls.push('second');
        destroyWatch();
      }
    );
    
    scope.$watch(
      function(scope) {
        watchCalls.push('third');
        return scope.aValue;
      }
    );
    
    scope.$digest();
    expect(watchCalls).deep.equal(['first', 'second', 'third', 'first', 'third']);
  });
  
  it("allows a $watch to destroy another during digest", function() {
    scope.aValue = 'abc';
    scope.counter = 0;
    
    scope.$watch(
      function(scope) {
        return scope.aValue;
      },
      function(newValue, oldValue, scope) {
        destroyWatch();
      }
    );
    
    var destroyWatch = scope.$watch(
      function(scope) {},
      function(newValue, oldValue, scope) { }
    );
    
    scope.$watch(
      function(scope) { return scope.aValue; },
      function(newValue, oldValue, scope) {
        scope.counter ++;
      }
    );
    
    scope.$digest();
    expect(scope.counter).to.equal(1);
  });
  
  it("allows destroying several $watches during digest", function() {
    scope.aValue = 'abc';
    scope.counter = 0;
    
    var destroyWatch1 = scope.$watch(
      function(scope) {
        destroyWatch1();
        destroyWatch2();
      }
    );
    
    var destroyWatch2 = scope.$watch(
      function(scope) { return scope.aValue; },
      function(newValue, oldValue, scope) {
        scope.counter ++;
      }
    );
    
    scope.$digest();
    expect(scope.counter).to.equal(0);
  });
})();