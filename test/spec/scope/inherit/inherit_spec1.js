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