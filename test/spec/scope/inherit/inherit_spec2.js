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