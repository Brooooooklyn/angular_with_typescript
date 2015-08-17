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
	
})();