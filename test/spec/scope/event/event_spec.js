/* global scope describe, it, expect, beforeEach, Scope13, _ */
describe('$watchCollection test', function() {
  (function() {
    var parent;
    var scope;
    var child;
    var isolatedChild;
    beforeEach(function() {
      parent = new Scope13();
      scope = parent.$new();
      child = scope.$new();
      isolatedChild = scope.$new(true);
    });

    it('allows registering listeners', function() {
      var listener1 = function() {};
      var listener2 = function() {};
      var listener3 = function() {};

      scope.$on('someEvent', listener1);
      scope.$on('someEvent', listener2);
      scope.$on('someOtherEvent', listener3);

      expect(scope.$$listeners).deep.equal({
        someEvent: [listener1, listener2],
        someOtherEvent: [listener3]
      })
    });

    it('registers different listeners for every scope', function() {
      var listener1 = function() {};
      var listener2 = function() {};
      var listener3 = function() {};

      scope.$on('someEvent', listener1);
      child.$on('someEvent', listener2);
      isolatedChild.$on('someEvent', listener3);

      expect(scope.$$listeners).deep.equal({'someEvent': [listener1]});
      expect(child.$$listeners).deep.equal({'someEvent': [listener2]});
      expect(isolatedChild.$$listeners).deep.equal({'someEvent': [listener3]});
    });

    _.forEach(['$emit', '$broadcast'], function(method) {
      it('calls the listeners of the matching event on ' + method, function() {
        var listener1 = chai.spy();
        var listener2 = chai.spy();

        scope.$on('someEvent', listener1);
        scope.$on('someOtherEvent', listener2);

        scope[method]('someEvent');

        expect(listener1).to.have.been.called();
        expect(listener2).not.have.been.called();
      });

      it('passes an event object with a name to listeners on ' + method, function() {
        var listener = chai.spy();
        scope.$on('someEvent', listener);

        scope[method]('someEvent');

        expect(listener).to.have.been.called();
        expect(listener).to.have.been.called.with('someEvent');
      });

      it('passes the same event object to each listener on ' + method, function() {
        var listener1 = chai.spy();
        var listener2 = chai.spy();
        scope.$on('someEvent', listener1);
        scope.$on('someEvent', listener2);

        scope[method]('someEvent');
        console.log(listener1.__spy.calls[0]);
      });
    });

  })();
});