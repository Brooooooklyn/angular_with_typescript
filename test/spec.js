describe('$scope test', function() {
describe('$watchGroup', function() {
/* global scope describe, it, expect, beforeEach, Scope9, _ */

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
describe('$watchCollection test', function() {

(function() {
	var scope;
	
	beforeEach(function() {
		scope = new Scope12();
	});
	
	it('works like a normal watch for non-collections', function() {
		var valueProvided;
		
		scope.aValue = 42;
		scope.counter = 0;
		
		scope.$watchCollection(
			function(scope) { return scope.aValue; },
			function(newValue, oldValue, scope) {
				valueProvided = newValue;
				scope.counter ++;
			}
		);
		
		scope.$digest();
		expect(scope.counter).to.equal(1);
		expect(valueProvided).to.equal(scope.aValue);
		
		scope.aValue = 43;
		scope.$digest();
		expect(scope.counter).to.equal(2);
		
		scope.$digest();
		expect(scope.counter).to.equal(2);
	});
	
	it('works like a normal watch for NaNs', function() {
		scope.aValue = 0/0;
		scope.counter = 0;
		
		scope.$watchCollection(
			function(scope) { return scope.aValue; },
			function(newValue, oldValue, scope) {
				scope.counter ++;
			}
		);
		
		scope.$digest();
		expect(scope.counter).to.equal(1);

		scope.$digest();
		expect(scope.counter).to.equal(1);
	});
	
	it('notices when the value becomes an array', function() {
		scope.counter = 0;
		
		scope.$watchCollection(
			function(scope) { return scope.arr; },
			function(newValue, oldValue, scope) {
				scope.counter ++;
			}
		);
		
		scope.$digest();
		expect(scope.counter).to.equal(1);
		
		scope.arr = [1, 2, 3];
		scope.$digest();
		expect(scope.counter).to.equal(2);
		
		scope.$digest();
		expect(scope.counter).to.equal(2);
	});
	
	it('notices an item added to an array', function() {
		scope.arr = [1, 2, 3];
		scope.counter = 0;
		
		scope.$watchCollection(
			function(scope) { return scope.arr; },
			function(newValue, oldValue, scope) {
				scope.counter ++;
			}
		);
		
		scope.$digest();
		expect(scope.counter).to.equal(1);
		
		scope.arr.push(4);
		scope.$digest();
		expect(scope.counter).to.equal(2);
		
		scope.$digest();
		expect(scope.counter).to.equal(2);
	});
	
	it('notices an item removed from an array', function() {
		scope.arr = [1, 2, 3];
		scope.counter = 0;
		
		scope.$watchCollection(
			function(scope) { return scope.arr; },
			function(newValue, oldValue, scope) {
				scope.counter ++;
			}
		);
		
		scope.$digest();
		expect(scope.counter).to.equal(1);
		
		scope.arr.shift();
		scope.$digest();
		expect(scope.counter).to.equal(2);
		
		scope.$digest();
		expect(scope.counter).to.equal(2);
	});
	
	it('notices an item replaced in an array', function() {
		scope.arr = [1, 2, 3];
		scope.counter = 0;
		
		scope.$watchCollection(
			function(scope) { return scope.arr; },
			function(newValue, oldValue, scope) {
				scope.counter ++;
			}
		);
		
		scope.$digest();
		expect(scope.counter).to.equal(1);
		
		scope.arr[1] = 42;
		scope.$digest();
		expect(scope.counter).to.equal(2);
		
		scope.$digest();
		expect(scope.counter).to.equal(2);
	});
	
	it('notices items recordered in an array', function() {
		scope.arr = [2, 1, 3];
		scope.counter = 0;
		
		scope.$watchCollection(
			function(scope) { return scope.arr; },
			function(newValue, oldValue, scope) {
				scope.counter ++;
			}
		);
		
		scope.$digest();
		expect(scope.counter).to.equal(1);
		
		scope.arr.sort();
		scope.$digest();
		expect(scope.counter).to.equal(2);
		
		scope.$digest();
		expect(scope.counter).to.equal(2);
	});
	
	it('does not fail on NaNs in arrays', function() {
		scope.arr = [2, NaN, 3];
		scope.counter = 0;
		
		scope.$watchCollection(
			function(scope) { return scope.arr; },
			function(newValue, oldValue, scope) {
				scope.counter ++;
			}
		);
		
		scope.$digest();
		expect(scope.counter).to.equal(1);
	});
	
	it('notices an item replaced in an arguments object', function() {
		(function() {
			scope.arrayLike = arguments;
		})(1, 2, 3);
		scope.counter = 0;
		
		scope.$watchCollection(
			function(scope) { return scope.arrayLike; },
			function(newValue, oldValue, scope) {
				scope.counter ++;
			}
		);
		
		scope.$digest();
		expect(scope.counter).to.equal(1);
		
		scope.arrayLike[1] = 42;
		scope.$digest();
		expect(scope.counter).to.equal(2);
		
		scope.$digest();
		expect(scope.counter).to.equal(2);
	});
	
	it('notices an item replaced in a NodeList object', function() {
		document.documentElement.appendChild(document.createElement('div'));
		scope.arrayLike = document.getElementsByTagName('div');
		
		scope.counter = 0;
		
		scope.$watchCollection(
			function(scope) { return scope.arrayLike; },
			function(newValue, oldValue, scope) {
				scope.counter ++;
			}
		);
		
		scope.$digest();
		expect(scope.counter).to.equal(1);
		
		document.documentElement.appendChild(document.createElement('div'));
		scope.$digest();
		expect(scope.counter).to.equal(2);
		
		scope.$digest();
		expect(scope.counter).to.equal(2);
	});
	
	it('notices when the value becomes an object', function() {
		scope.counter = 0;
		
		scope.$watchCollection(
			function(scope) { return scope.obj; },
			function(newValue, oldValue, scope) {
				scope.counter ++;
			}
		);
		
		scope.$digest();
		expect(scope.counter).to.equal(1);
		
		scope.obj = {a: 1};
		scope.$digest();
		expect(scope.counter).to.equal(2);
		
		scope.$digest();
		expect(scope.counter).to.equal(2);
	});
	
	it('notices when an attribute is added to an object', function() {
		scope.counter = 0;
		scope.obj = {a: 1};
		
		scope.$watchCollection(
			function(scope) { return scope.obj; },
			function(newValue, oldValue, scope) {
				scope.counter ++;
			}
		);
		
		scope.$digest();
		expect(scope.counter).to.equal(1);
		
		scope.obj.b = 2;
		scope.$digest();
		expect(scope.counter).to.equal(2);
		
		scope.$digest();
		expect(scope.counter).to.equal(2);
	});
	
	it('notices when an attribute is changed in an object', function() {
		scope.counter = 0;
		scope.obj = {a: 1};
		
		scope.$watchCollection(
			function(scope) { return scope.obj; },
			function(newValue, oldValue, scope) {
				scope.counter ++;
			}
		);
		
		scope.$digest();
		expect(scope.counter).to.equal(1);
		
		scope.obj.a = 2;
		scope.$digest();
		expect(scope.counter).to.equal(2);
		
		scope.$digest();
		expect(scope.counter).to.equal(2);
	});
	
	it('does not fail on NaN attributes in objects', function() {
		scope.counter = 0;
		scope.obj = {a: NaN};
		
		scope.$watchCollection(
			function(scope) { return scope.obj; },
			function(newValue, oldValue, scope) {
				scope.counter ++;
			}
		);
		
		scope.$digest();
		expect(scope.counter).to.equal(1);
	});
	
	it('notices when an attribute is removed from an object', function() {
		scope.counter = 0;
		scope.obj = {a: 1};
		
		scope.$watchCollection(
			function(scope) { return scope.obj; },
			function(newValue, oldValue, scope) {
				scope.counter ++;
			}
		);
		
		scope.$digest();
		expect(scope.counter).to.equal(1);
		
		delete scope.obj.a;
		scope.$digest();
		expect(scope.counter).to.equal(2);
		
		scope.$digest();
		expect(scope.counter).to.equal(2);
	});
	
	it('does not consider any object with a length property an array', function() {
		scope.obj = {length: 42, otherKey: 'abc'};
		scope.counter = 0;
		
		scope.$watchCollection(
			function(scope) { return scope.obj; },
			function(newValue, oldValue, scope) {
				scope.counter ++;
			}
		);
		
		scope.$digest();
		
		scope.obj.newKey = 'def';
		scope.$digest();
		
		expect(scope.counter).to.equal(2);
	});
	
	it('gives the old non-collection value to listeners', function() {
		scope.aValue = 42;
		var oldValueGiven;
		
		scope.$watchCollection(
			function(scope) { return scope.aValue; },
			function(newValue, oldValue, scope) {
				oldValueGiven = oldValue;
			}
		);
		
		scope.$digest();
		
		scope.aValue = 43;
		scope.$digest();
		
		expect(oldValueGiven).to.equal(42);
	});
	
	it('gives the old array value to listeners', function() {
		scope.aValue = [1, 2, 3];
		var oldValueGiven;
		
		scope.$watchCollection(
			function(scope) { return scope.aValue; },
			function(newValue, oldValue, scope) {
				oldValueGiven = oldValue;
			}
		);
		
		scope.$digest();
		
		scope.aValue.push(4);
		scope.$digest();
		
		expect(oldValueGiven).deep.equal([1, 2, 3]);
	});
	
	it('gives the old object value to listeners', function() {
		scope.aValue = {a: 1, b: 2};
		var oldValueGiven;
		
		scope.$watchCollection(
			function(scope) { return scope.aValue; },
			function(newValue, oldValue, scope) {
				oldValueGiven = oldValue;
			}
		);
		
		scope.$digest();
		
		scope.aValue.c = 3;
		scope.$digest();
		
		expect(oldValueGiven).deep.equal({a: 1, b: 2});
	});
	
	it('uses the new values as the old value on first digest', function() {
		scope.aValue = {a: 1, b: 2};
		var oldValueGiven;
		
		scope.$watchCollection(
			function(scope) { return scope.aValue; },
			function(newValue, oldValue, scope) {
				oldValueGiven = oldValue;
			}
		);
		
		scope.$digest();
		
		expect(oldValueGiven).deep.equal({a: 1, b: 2});
	});
	
})();
});
describe('inherit test', function() {
(function() {
	var Scope = Scope10;
	
	it('inherits_the_parent\'s_properties', function() {
		var parent = new Scope();
		parent.aValue = [1, 2, 3];
		
		var child = parent.$new();
		
		expect(child.aValue).deep.equal([1, 2, 3]);
	});
	
	it('does_not_cause_a_parent_to_inherit_its_properties', function() {
		var parent = new Scope();
		
		var child = parent.$new();
		child.aValue = [1, 2, 3];
		
		expect(parent.aValue).to.be.undefined;
	});
	
	it('inherits_the_parent\'s_properties_whenever_they_are_defined', function() {
		var parent = new Scope();
		var child = parent.$new();
		
		parent.aValue = [1, 2, 3];
		
		expect(child.aValue).deep.equal([1, 2, 3]);
	});
	
	it('can_amipulate_a_parent_scope\'s_paroperty', function() {
		var parent = new Scope();
		var child = parent.$new();
		parent.aValue = [1, 2, 3];
		
		child.aValue.push(4);
		
		expect(child.aValue).deep.equal([1, 2, 3, 4]);
		expect(parent.aValue).deep.equal([1, 2, 3, 4]);
	});
	
	it('can_watch_a_property_in_the_parent', function() {
		var parent = new Scope();
		var child = parent.$new();
		parent.aValue = [1, 2, 3];
		child.counter = 0;
		
		child.$watch(
			function(scope) { return scope.aValue; },
			function(newValue, oldValue, scope) {
				scope.counter++;
			},
			true
		);
		child.$digest();
		expect(child.counter).to.equal(1);
		
		parent.aValue.push(4);
		child.$digest();
		expect(child.counter).to.equal(2);
	});
	
	it('can_be_nested_at_any_depth', function() {
		var a   = new Scope();
		var aa  = a.$new();
		var aaa = aa.$new();
		var aab = aa.$new();
		var ab  = a.$new();
		var abb = ab.$new();
		
		a.value = 1;
		
		expect(aa.value).to.equal(1);
		expect(aaa.value).to.equal(1);
		expect(aab.value).to.equal(1);
		expect(ab.value).to.equal(1);
		expect(abb.value).to.equal(1);
		
		ab.anotherValue = 2;
		
		expect(abb.anotherValue).to.equal(2);
		expect(aa.anotherValue).to.be.undefined;
		expect(aaa.anotherValue).to.be.undefined;
	});
	
	it('shadows_a_parent\'s_property_with_the_same_name', function() {
		var parent = new Scope();
		var child = parent.$new();
		
		parent.name = 'Joe';
		child.name = 'Jill';
		
		expect(child.name).to.equal('Jill');
		expect(parent.name).to.equal('Joe');
	});
	
	it('does_not_shadow_members_of_parent_scope\'s_attributes', function() {
		var parent = new Scope();
		var child = parent.$new();
		
		parent.user = {name : 'Joe'};
		child.user.name = 'Jill';
		
		expect(child.user.name).to.equal('Jill');
		expect(child.user.name).to.equal('Jill');
	});
})();
(function() {
	var Scope = Scope11;
	
	it('does_not_digest_its_parent(s)', function() {
		var parent = new Scope();
		var child = parent.$new();
		parent.aValue = 'abc';
		parent.$watch(
			function(scope) { return scope.aValue; },
			function(newValue, oldValue, scope) {
				scope.aValueWas = newValue;
			}
		);
		
		child.$digest();
		expect(child.aValueWas).to.be.undefined;
	});
	
	it('keeps_a_record_its_children', function() {
		var parent = new Scope();
		var child1 = parent.$new();
		var child2 = parent.$new();
		var child2_1 = child2.$new();
		
		expect(parent.$$children.length).to.equal(2);
		expect(parent.$$children[0]).to.equal(child1);
		expect(parent.$$children[1]).to.equal(child2);
		
		expect(child1.$$children.length).to.equal(0);
		expect(child2.$$children.length).to.equal(1);
		expect(child2.$$children[0]).to.equal(child2_1);
	});
	
	it('digests_its_children', function() {
		var parent = new Scope();
		var child = parent.$new();
		
		parent.aValue = 'abc';
		child.$watch(
			function(scope){ return scope.aValue; },
			function(newValue, oldValue, scope) {
				scope.aValueWas = newValue;
			}
		);
		
		parent.$digest();
		expect(child.aValueWas).to.equal('abc');
	});
	
	it('digests_from_root_on_$apply', function() {
		var parent = new Scope();
		var child = parent.$new();
		var child2 = child.$new();
		
		parent.aValue = 'abc';
		parent.counter = 0;
		parent.$watch(
			function(scope) { return scope.aValue; },
			function(newValue, oldValue, scope) {
				scope.counter ++;
			}
		);
		
		child2.$apply(function(scope) { });
		
		expect(parent.counter).to.equal(1);
	});
	
	it('schedules_a_digest_from_root_on_$evalAsync', function(done) {
		var parent = new Scope();
		var child = parent.$new();
		var child2 = child.$new();
		
		parent.aValue = 'abc';
		parent.counter = 0;
		parent.$watch(
			function(scope) { return scope.aValue; },
			function(newValue, oldValue, scope) {
				scope.counter++;
			}
		);
		
		child2.$evalAsync(function(scope) { });
		
		setTimeout(function() {
			expect(parent.counter).to.equal(1);
			done();
		}, 50);
	});
	
	it('does not access to parent attributes when isolated', function() {
		var parent = new Scope();
		var child = parent.$new(true);
		
		parent.aValue = 'abc';
		
		expect(child.aValue).to.be.undefined;
	});
	
	it('cannot watch parent attributes when isolated', function() {
		var parent = new Scope();
		var child = parent.$new(true);
		
		parent.aValue = 'abc';
		child.$watch(
			function(scope) { return scope.aValue; },
			function(newValue, oldValue, scope) {
				scope.aValueWas = newValue;
			}
		);
		
		child.$digest();
		expect(child.aValueWas).to.be.undefined;
	});
	
	it('digests its isolated children', function() {
		var parent = new Scope();
		var child = parent.$new(true);
		
		child.aValue = 'abc';
		child.$watch(
			function(scope) { return scope.aValue; },
			function(newValue, oldValue, scope) {
				scope.aValueWas = newValue;
			}
		);
		
		parent.$digest();
		expect(child.aValueWas).to.equal('abc');
	});
	
	it('digests from root on $apply when isolated', function() {
		var parent = new Scope();
		var child = parent.$new(true);
		var child2 = child.$new();
		
		parent.aValue = 'abc';
		parent.counter = 0;
		parent.$watch(
			function(scope) { return scope.aValue; },
			function(newValue, oldValue, scope) {
				scope.counter++;
			}
		);
		
		child2.$apply(function(scope) {});
		expect(parent.counter).to.equal(1);
	});
	
	it('schedules a digest from root on $evalAsync when isolated', function(done) {
		var parent = new Scope();
		var child = parent.$new(true);
		var child2 = child.$new();
		
		parent.aValue = 'abc';
		parent.counter = 0;
		parent.$watch(
			function(scope) { return scope.aValue; },
			function(newValue, oldValue, scope) {
				scope.counter++;
			}
		);
		
		child2.$evalAsync(function() {});
		
		setTimeout(function() {
			expect(parent.counter).to.equal(1);
			done();
		})
	});
	
	it('executes $evalAsync functions on isolate scope', function(done) {
		var parent = new Scope();
		var child  = parent.$new(true);
		
		child.$evalAsync(function(scope) {
			scope.didEvalAsync = true;
		});
		
		setTimeout(function() {
			expect(child.didEvalAsync).to.equal(true);
			done();
		}, 50);
	});
	
	it('can take some other scope as the parent', function() {
		var prototypeParent = new Scope();
		var hierarchyParent = new Scope();
		var child = prototypeParent.$new(false, hierarchyParent);
		
		prototypeParent.a = 42;
		expect(child.a).to.equal(42);
		
		child.counter = 0;
		child.$watch(
			function(scope) { scope.counter++; }
		);
		
		prototypeParent.$digest();
		expect(child.counter).to.equal(0);
		
		hierarchyParent.$digest();
		expect(child.counter).to.equal(2);
	});
	
	it('is no longer digested when $destroy has been called', function() {
		var parent = new Scope();
		var child = parent.$new();
		
		child.aValue = [1, 2, ,3];
		child.counter = 0;
		child.$watch(
			function(scope) { return scope.aValue; },
			function(newValue, oldValue, scope) {
				scope.counter ++;
			},
			true
		);
		
		parent.$digest();
		expect(child.counter).to.equal(1);
		
		child.aValue.push(4);
		parent.$digest();
		expect(child.counter).to.equal(2);
		
		child.$destroy();
		child.aValue.push(5);
		parent.$digest();
		expect(child.counter).to.equal(2);
		
	});
	
})();
});
describe('digest', function() {

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

/* global describe, it, expect, chai, Scope, beforeEach Scope2 */
'use strict';

(function(){
  var scope;
  beforeEach(function(){
    scope = new Scope2();
  });
  it("calls the listener function of a watch on first $digest", function() {

    var watchFn = function() { return 'wat'};
    var listenerFn = chai.spy();
    scope.$watch(watchFn, listenerFn);
    
    scope.$digest();
    
    expect(listenerFn).to.have.been.called();
  });  
})();

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


/* global describe, it, expect Scope4*/
'use strict';

(function(){
  var scope;
  beforeEach(function(){
    scope = new Scope4();
  });
  it('calls the listener function when the watched value changes', function () {
    scope.someValue = 'a';
    scope.counter = 0;
    
    scope.$watch(
      function() { return scope.someValue; },
      function(newValue, oldValue, scope) { scope.counter++; }
    );
    
    expect(scope.counter).to.equal(0);
    
    scope.$digest();
    expect(scope.counter).to.equal(1);
          
    scope.$digest();
    expect(scope.counter).to.equal(1);
    
    scope.someValue = 'b';
    expect(scope.counter).to.equal(1);
    
    scope.$digest();
    expect(scope.counter).to.equal(2);
    
  });
  
  it('calls listener when watch value is first undefined', function () {
     scope.counter = 0;
     
     scope.$watch(
       function(scope) { return scope.someValue; },
       function(newValue, oldValue, scope) { scope.counter ++; }
     );
     
     scope.$digest();
     expect(scope.counter).to.equal(1);
  });
  
  it('calls listener with new value as old value the first time', function () {
    scope.someValue = 123;
    var oldValueGiven;
    
    scope.$watch(
      function(scope) { return scope.someValue; },
      function(oldValue, newValue, scope) { oldValueGiven = oldValue; }
    );
    
    scope.$digest();
    expect(oldValueGiven).to.equal(123);
  });
  
  it('may have watchers that omit the listener function', function () {
    var watchFn = chai.spy('something');
    scope.$watch(watchFn);
    
    scope.$digest();
    
    expect(watchFn).to.have.been.called();
  });
})();
/* global describe, it, expect, beforeEach, Scope5 */
'use strict';

(function(){
  var scope;
  beforeEach(function(){
    scope = new Scope5();
  });
  it('triggers chained watchers in same digest', function () {  
    scope.name = 'Jane';
    
    scope.$watch(
      function(scope) { return scope.nameUpper; },
      function(newValue, oldValue, scope) {
        if (newValue) {
          scope.initial = newValue.substring(0, 1) + '.';
        }
      }
    );
    
    scope.$watch(
      function (scope) { return scope.name; },
      function (newValue, oldValue, scope) {
        if (newValue) {
          scope.nameUpper = newValue.toUpperCase();
        }
      }        
    );
    
    scope.$digest();
    expect(scope.initial).to.equal('J.');
    
    scope.name = 'Bob';
    scope.$digest();
    expect(scope.initial).to.equal('B.');
    
  });
  
  it('gives up on the watches after 10 iterations', function () {
    scope.counterA = 0;
    scope.counterB = 0;
    
    scope.$watch(
      function(scope) { return scope.counterA; },
      function(newValue, oldValue, scope) {
        scope.counterB++;
      }
    );
    
    scope.$watch(
      function(scope) { return scope.counterB; },
      function(newValue, oldValue, scope) {
        scope.counterA++;
      }
    );
    
    expect((function() { scope.$digest(); })).to.throw();
  });
})();
  
/* global describe, it, expect, beforeEach, Scope6, _ */
'use strict';

(function(){
  var scope;
  beforeEach(function(){
    scope = new Scope6();
  });
  /**
   * Short-Circuiting The Digest When The Last Watch Is Clean
   * 在digest的时候,会对值进行比较。在已有的策略digest策略中:
   * 只要有一次digest检测出了值的变化,那么在后面的所有digest中,
   * 即使watchFn判断listener监测的值没有变化,也会继续digest下去
   * 这里的一步是优化掉可能浪费的检测，在digest过程中,如果两次digest发现他们的lastDirtyWatch 是同一个
   * 就直接return false, false代表后面的watcher都是clean的
   */
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
  
  /**
   * 在上一步的设计中会导致一个问题：如果一个watch是在listener中新创建的
   * 那么在digest的时候新的watchFn不会被执行，因为$$lastDirtyWatch 在新的watchFn执行前一直指向原来的watch
   * 我们需要在watch初始化的时候把$$lastDirtyWatch 指向null 来避免这个问题
   */
  
  it('does not end digest so that new watches are not run', function() {
    scope.aValue = 'abc';
    scope.counter = 0;
    
    scope.$watch(
      function(scope) { return scope.aValue; },
      function(newValue, oldValue, scope) {
        scope.$watch(
          function(scope) { return scope.aValue; },
          function(newValue, oldValue, scope) {
            scope.counter ++;  
          }
        )
      }
    );
    
    scope.$digest();
    expect(scope.counter).to.equal(1);
  });
  
  /**
   * Value-Based Dirty-Checking
   * 这里书中的做法是将 === 判断换成了lodash的isEqual方法
   * 这个方法是针对直接变量量与引用类型的变量进行不同策略的判断
   * angular采用了类似的策略
   * 需要注意的是，在angulr 1.x 中, 将scope下的一个对象的一个属性绑定到前端view的时候，实际上是监听的这个属性的值而不是整个对象
   */
  it('compares based on value if enable', function() {
    scope.aValue = [1, 2, 3];
    scope.counter = 0;
    
    scope.$watch(
      function(scope) { return scope.aValue; },
      function(newValue, oldValue, scope) {
        scope.counter ++;
      },
      true
    );
    
    scope.$digest();
    expect(scope.counter).to.equal(1);
    
    scope.aValue.push(4);
    scope.$digest();
    expect(scope.counter).to.equal(2);
  });
  
  /**
   * NaN !== NaN 需要特别的去处理NaN
   */
  it('currectly handlers NaNs', function() {
    scope.number = 0/0; //NaN
    scope.counter = 0;
    
    scope.$watch(
      function(scope) { return scope.number; },
      function(newValue, oldValue, scope) {
        scope.counter ++;
      }
    );
    
    scope.$digest();
    expect(scope.counter).to.equal(1);
    
    scope.$digest();
    expect(scope.counter).to.equal(1);
  });
})();
/* global scope describe, it, expect, beforeEach, Scope7, _ */
'use strict';

(function(){
  var scope;
  
  beforeEach(function() {
    scope = new Scope7();
  });
  
  it("excutes $eval'ed function and returns result", function() {
    scope.aValue = 42;
    
    var result = scope.$eval(function(scope) {
      return scope.aValue;
    });
    
    expect(result).to.equal(42);
  });
  
  it("passes the second $eval argument straight through", function() {
    scope.aValue = 42;
    
    var result = scope.$eval(function(scope, arg) {
      return scope.aValue + arg;
    }, 2);
    
    expect(result).to.equal(44);
  });
  
  it("executes $apply'ed function and starts the digest", function() {
    scope.aValue = 'someValue';
    scope.counter = 0;
    
    scope.$watch(
      function(scope) {
        return scope.aValue;
      },
      function(newValue, oldValue, scope) {
        scope.counter ++;
      }
    );
    
    scope.$digest();
    expect(scope.counter).to.equal(1);
    
    scope.$apply(function(scope) {
      scope.aValue = 'someOtherValue';
    });
    expect(scope.counter).to.equal(2);
  });
  
  it("executes $evalAsync'ed function later in the same cycle", function() {
    scope.aValue = [1, 2, 3];
    scope.asyncEvaluated = false;
    scope.asyncEvaluatedImmediately = false;
    
    scope.$watch(
      function(scope) { return scope.aValue; },
      function(newValue, oldValue, scope) {
        scope.$evalAsync(function(scope) {
          scope.asyncEvaluated = true;
        });
        scope.asyncEvaluatedImmediately = scope.asyncEvaluated;
      }
    );
    
    scope.$digest();
    expect(scope.asyncEvaluated).to.equal(true);
    expect(scope.asyncEvaluatedImmediately).to.equal(false);
  });
  
  it("executes $evalAsync'ed functions added by watch functions", function() {
    scope.aVaule = [1, 2, 3];
    scope.asyncEvaluated = false;
    
    scope.$watch(
      function(scope) {
        if (!scope.asyncEvaluated) {
          scope.$evalAsync(function(scope) {
            scope.asyncEvaluated = true;
          });
        }
        return scope.aValue;
      },
      function(newValue, oldValue, scope) { }
    );
    
    scope.$digest();
    
    expect(scope.asyncEvaluated).to.equal(true);
  });
  
  it("executes $evalAsync'ed functions even when not dirty", function() {
    scope.aVaule = [1, 2, 3];
    scope.asyncEvaluatedTimes = 0;
    
    scope.$watch(
      function(scope) {
        if (scope.asyncEvaluatedTimes < 2) {
          scope.$evalAsync(function(scope) {
            scope.asyncEvaluatedTimes ++;
          });
        }
        return scope.aValue;
      },
      function(newValue, oldValue, scope) { }
    );
    
    scope.$digest();
    
    expect(scope.asyncEvaluatedTimes).to.equal(2);
  });
  
  it("eventually halts $evalAsyncs added by watches", function() {
    scope.aValue = [1, 2, 3];
    
    scope.$watch(
      function(scope) {
        scope.$evalAsync(function(scope) { });
        return scope.aValue;
      },
      function(newValue, oldValue, scope) { }
    );
    
    expect(function() { scope.$digest(); }).to.throw();
  });
  
  it("has a $$phase field whose value is the current digest phase", function() {
    scope.aValue = [1, 2, 3];
    scope.phaseInWatchFunction = undefined;
    scope.phaseInListenerFunction = undefined;
    scope.phaseInApplyFunction = undefined;
    
    scope.$watch(
      function(scope) {
        scope.phaseInWatchFunction = scope.$$phase;
        return scope.aValue;
      },
      function(newValue, oldValue, scope) {
        scope.phaseInListenerFunction = scope.$$phase;
      }
    );
    
    scope.$apply(function(scope) {
      scope.phaseInApplyFunction = scope.$$phase;
    });
    
    expect(scope.phaseInWatchFunction).to.equal('$digest');
    expect(scope.phaseInListenerFunction).to.equal('$digest');
    expect(scope.phaseInApplyFunction).to.equal('$apply');
    
  });
  
  it("schedules a digest in $evalAsync", function(done) {
    scope.aValue = 'abc';
    scope.counter = 0;
    
    scope.$watch(
      function(scope) { return scope.aValue; },
      function(newValue, oldValue, scope) {
        scope.counter ++;
      }
    );
    
    scope.$evalAsync(function(scope) {
    });
    
    expect(scope.counter).to.equal(0);
    setTimeout(function() {
      expect(scope.counter).to.equal(1);
      done();
    }, 50);
    
  });
  
  it("allows async $apply with $applyAsync", function(done) {
    scope.counter = 0;
    scope.$watch(
      function(scope) { return scope.aValue; },
      function(newValue, oldValue, scope) {
        scope.counter ++;
      }
    );
    
    scope.$digest();
    expect(scope.counter).to.equal(1);
    
    scope.$applyAsync(function(scope) {
      scope.aValue = 'abc';
    });
    expect(scope.counter).to.equal(1);
    
    setTimeout(function() {
      expect(scope.counter).to.equal(2);
      done();
    }, 50);
    
  });
  
  it("never executes $applyAsync'ed function in the same cycle", function(done) {
    scope.aVaule = [1, 2, 3];
    scope.asyncApplied = false;
    
    scope.$watch(
      function(scope) { return scope.aValue; },
      function(newValue, oldValue, scope) {
        scope.$applyAsync(function(scope) {
          scope.asyncApplied = true;
        });
      }
    );
    
    scope.$digest();
    expect(scope.asyncApplied).to.equal(false);
    setTimeout(function() {
      expect(scope.asyncApplied).to.equal(true);
      done();
    }, 50);
  });
  
  it("coalesces many calls to $applyAsync", function(done) {
    scope.counter = 0;
    
    scope.$watch(
      function(scope) {
       scope.counter ++;
       return scope.aVaule; 
      },
      function(newValue, oldValue, scope) { }
    );
    
    scope.$applyAsync(function(scope) {
      scope.aVaule = 'abc';
    });
    scope.$applyAsync(function(scope) {
      scope.aValue = 'def';
    });
    
    setTimeout(function() {
      expect(scope.counter).to.equal(2);
      done();
    }, 50);
  });
  
  it("cancels and flushes $applyAsync if digest first", function(done) {
    scope.counter = 0;
    
    scope.$watch(
      function(scope) {
        scope.counter ++;
        return scope.aValue;
      },
      function(newValue, oldValue, scope) { }
    );
    
    scope.$applyAsync(function(scope) {
      scope.aValue = 'abc';
    });
    scope.$applyAsync(function(scope) {
      scope.aValue = 'def';
    });
    
    scope.$digest();
    expect(scope.counter).to.equal(2);
    expect(scope.aValue).to.equal('def');
    
    setTimeout(function() {
      expect(scope.counter).to.equal(2);
      done();
    }, 50);
  });
  
  it("runs a $$postDigest function after each digest", function() {
    scope.counter = 0;
    
    scope.$$postDigest(function() {
      scope.counter ++;
    });
    
    expect(scope.counter).to.equal(0);
    
    scope.$digest();
    expect(scope.counter).to.equal(1);
    
    scope.$digest();
    expect(scope.counter).to.equal(1);
  });
  
  it("does not include $$postDigest in the digest", function() {
    scope.aVaule = 'original value';
    
    scope.$$postDigest(function() {
      scope.aVaule = 'changed value';
    });
    scope.$watch(
      function(scope) {
        return scope.aVaule;
      },
      function(newValue, oldValue, scope) {
        scope.watchedValue = newValue;
      }
    );
    
    scope.$digest();
    expect(scope.watchedValue).to.equal('original value');
    
    scope.$digest();
    expect(scope.watchedValue).to.equal('changed value');
  
  });
  
  it("catches exceptions in watch functions and continues", function() {
    scope.aVaule = 'abc';
    scope.counter = 0;
    
    scope.$watch(
      function(scope) { throw 'error'; },
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
  
  it("catches exceptions in listener functions and continues", function() {
    scope.aValue = 'abc';
    scope.counter = 0;
    
    scope.$watch(
      function(scope) { return scope.aVaule; },
      function(newValue, oldValue, scope) {
        throw 'Error';
      }
    );
    scope.$watch(
      function(scope) { return scope.aValue; },
      function(newValue, oldValue, scope) {
        scope.counter ++;
      }
    )
    
    scope.$digest();
    expect(scope.counter).to.equal(1);
  
  });  
})();

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
});

});