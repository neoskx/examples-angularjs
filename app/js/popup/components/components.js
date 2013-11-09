
teaDirectives.factory('teaPosition', ['$document', '$window', function($document, $window){
	var mouseX, mouseY;

	$document.unbind('mousemove');
	$document.bind('mousemove', function mouseMoved(event){
		mouseX = event.pageX;
		mouseY = event.pageY;
	});

	function getStyle(el, cssprop){
		if(el.currentStyle){	// IE
			return el.currentStyle[cssprop];
		} else if($window.getComputedStyle){
			return $window.getComputedStyle(el)[cssprop];
		}

		// finally try and get inline style
		return el.style[cssprop];
	}

	/**
	 * Checks if a given element is statically positioned
	 * @param  {DOMElement}  el: the element need to be checked
	 * @return {Boolean} true/false
	 */
	function isStaticPositioned(el){
		return (getStyle(el, 'position') || 'static') === 'static';
	}

	function parentOffsetEl(el){
		var docDomEl = $document[0];
		var offsetParent = el.offsetParent || docDomEl;
		while(offsetParent && offsetParent!=docDomEl && isStaticPositioned(offsetParent)){
			offsetParent = offsetParent.offsetParent;
		}
		return offsetParent || docDomEl;
	}

	return {
		position:function(el){
			var elBCR = this.offset(el);
			var offsetParentBCR = {top:0, left:0};
			var offsetParentEl = parentOffsetEl(el[0]||el);
			if(offsetParentEl != $document[0]){
				offsetParentBCR = this.offset(angular.element(offsetParentEl));
				offsetParentBCR.top += offsetParentEl.clientTop;
				offsetParentBCR.left += offsetParentEl.clientLeft;
			}

			return{
				width: el.prop('offsetWidth')
				,height: el.prop('offsetHeight')
				,top: elBCR.top - offsetParentBCR.top
				,left: elBCR.left - offsetParentBCR.left
			};
		}
		/**
		 * [ description]
		 * @param  {[type]} el [description]
		 * @return {[type]}    [description]
		 */
		,offset:function(el){
			var boundingClientRect = el[0].getBoundingClientRect();
	        return {
	          width: el.prop('offsetWidth')
	          ,height: el.prop('offsetHeight')
	          ,top: boundingClientRect.top + ($window.pageYOffset || $document[0].body.scrollTop)
	          ,left: boundingClientRect.left + ($window.pageXOffset || $document[0].body.scrollLeft)
	        };
		}
		/**
		 * Get the coordinates of the mouse
		 * @return {Object}: an object that contains x and y coordinate
		 */
		,mouse:function(){
			return {x: mouseX ,y:mouseY};
		}
	}

}])
/**
 * Basice Class of TEA
 * @return {[type]} [description]
 */
.provider('teaUICore',function(){
	this.$get = ['$document', function($document) {
		function UICore() {
			this.version = "0.0.1";

			this.keyCode = {
				BACKSPACE: 8,
				COMMA: 188,
				DELETE: 46,
				DOWN: 40,
				END: 35,
				ENTER: 13,
				ESCAPE: 27,
				HOME: 36,
				LEFT: 37,
				NUMPAD_ADD: 107,
				NUMPAD_DECIMAL: 110,
				NUMPAD_DIVIDE: 111,
				NUMPAD_ENTER: 108,
				NUMPAD_MULTIPLY: 106,
				NUMPAD_SUBTRACT: 109,
				PAGE_DOWN: 34,
				PAGE_UP: 33,
				PERIOD: 190,
				RIGHT: 39,
				SPACE: 32,
				TAB: 9,
				UP: 38
			};
		}

		return {
			UICore: UICore
		};
	}];
})

.provider("teaUIElement", function() {
	
	var defaults = {};

	var globalOptions = {};

	/**
	 * You can use teaElementProvider to do some global config
	 * @param  {[type]} opts [description]
	 * @return {[type]}      [description]
	 */
	this.options = function(opts){
		globalOptions = opts;
	}

	this.$get = ['$compile', '$document','teaUICore', function($compile, $document, core) {
		/**
		 * [UIElement description]
		 * @param {[type]} $element   [description]
		 * @param {[type]} $attrs     [description]
		 * @param {[type]} controller [description]
		 * @param {[type]} opts       [description]
		 */
		function UIElement($element, $attrs, controller, opts){
			core.UICore.apply(this,arguments);
			var self = this, options = this.options = angular.extend({}, defaults, globalOptions, opts);
			this.$element = $element;
			this.$attrs = $attrs;
			this.controller = controller;
		}

		UIElement.prototype = new core.UICore();

		UIElement.prototype.constructor = UIElement;

		/**
		 * $apply() is used to execute an expression in angular from outside of the angular framework. (For example from browser DOM events, setTimeout, XHR or third party libraries). Because we are calling into the angular framework we need to perform proper scope life-cycle of exception handling, executing watches.
		 * For more detail, please see [AngularJS Scope](http://docs.angularjs.org/api/ng.$rootScope.Scope)
		 * @param  {string|function} exp: An angular expression to be executed.
		 * @return {*}: The result of evaluating the expression.
		 */
		UIElement.prototype.$apply = function(exp){
			throw "UIElment->$apply: Please implement $apply in ["+this.constructor.name+"]";
		}

		/**
		 * Dispatches an event `name` downwards to all child scopes(and their children) notifiying the registered [ng.$rootScope.Scope#$on](http://docs.angularjs.org/api/ng.$rootScope.Scope#$on) listerners
		 * For more detail, please see [AngularJS Scope](http://docs.angularjs.org/api/ng.$rootScope.Scope)
		 * @param  {string} name: Event name to broadcast
		 * @param  {...*} args: Optional set of arguments which will be passed onto the event listeners
		 * @return {Object}: Event object, see [ng.$rootScope.Scope#$on](http://docs.angularjs.org/api/ng.$rootScope.Scope#$on)
		 */
		UIElement.prototype.$broadcast = function(name, args){
			throw "UIElment->$broadcast: Please implement $broadcast in ["+this.constructor.name+"]";
		}

		/**
		 * Removes the current scope (and all of its children) from the parent scope. Removal implies that calls to $digest() will no longer propagate to the current scope and its children. Removal also implies that the current scope is eligible for garbage collection.
         * The $destroy() is usually used by directives such as ngRepeat for managing the unrolling of the loop.
		 * Just before a scope is destroyed a $destroy event is broadcasted on this scope. Application code can register a $destroy event handler that will give it chance to perform any necessary cleanup.
		 * Note that, in AngularJS, there is also a $destroy jQuery event, which can be used to clean up DOM bindings before an element is removed from the DOM.
		 * For more detail, please see [AngularJS Scope](http://docs.angularjs.org/api/ng.$rootScope.Scope)
		 */
		UIElement.prototype.$destroy = function(){
			throw "UIElment->$destroy: Please implement $destroy in ["+this.constructor.name+"]";
		}

		/**
		 * Processes all of the watchers of the current scope and its children. Because a watcher's listener can change the model, the $digest() keeps calling the watchers until no more listeners are firing. This means that it is possible to get into an infinite loop. This function will throw 'Maximum iteration limit exceeded.' if the number of iterations exceeds 10.
		 * Usually you don't call $digest() directly in controllers or in directives. Instead a call to $apply() (typically from within a directives) will force a $digest().
		 * If you want to be notified whenever $digest() is called, you can register a watchExpression function with $watch() with no listener.
		 * You may have a need to call $digest() from within unit-tests, to simulate the scope life-cycle.
		 * For more detail, please see [AngularJS Scope](http://docs.angularjs.org/api/ng.$rootScope.Scope)
		 */
		UIElement.prototype.$digest = function(){
			throw "UIElment->$digest: Please implement $digest in ["+this.constructor.name+"]";
		}

		/**
		 * Dispatches an event name upwards through the scope hierarchy notifying the registered ng.$rootScope.Scope#$on listeners.
		 * The event life cycle starts at the scope on which $emit was called. All listeners listening for name event on this scope get notified. Afterwards, the event traverses upwards toward the root scope and calls all registered listeners along the way. The event will stop propagating if one of the listeners cancels it.
		 * Any exception emitted from the listeners will be passed onto the $exceptionHandler service.
		 * For more detail, please see [AngularJS Scope](http://docs.angularjs.org/api/ng.$rootScope.Scope)
		 * @param  {string} name: Event name to emit
		 * @param  {...*} args: Optional set of arguments which will be passed onto the event listeners.
		 * @return {Object}: Event object, see ng.$rootScope.Scope#$on
		 */
		UIElement.prototype.$emit = function(name, args){
			throw "UIElment->$emit: Please implement $emit in ["+this.constructor.name+"]";
		}

		/**
		 * Executes the expression on the current scope returning the result. Any exceptions in the expression are propagated (uncaught). This is useful when evaluating Angular expressions.
		 * For more detail, please see [AngularJS Scope](http://docs.angularjs.org/api/ng.$rootScope.Scope)
		 * @param  {string|function} exp: An angular expression to be executed
		 * @return {*}: The result of evaluating the expression
		 */
		UIElement.prototype.$eval = function(exp){
			throw "UIElment->$eval: Please implement $eval in ["+this.constructor.name+"]";
		}

		/**
		 * Executes the expression on the current scope at a later point in time.
		 * The $evalAsync makes no guarantees as to when the expression will be executed, only that:
		 * it will execute in the current script execution context (before any DOM rendering).
		 * at least one $digest cycle will be performed after expression execution.
		 * Any exceptions from the execution of the expression are forwarded to the $exceptionHandler service.
		 * For more detail, please see [AngularJS Scope](http://docs.angularjs.org/api/ng.$rootScope.Scope)
		 * @param  {string|function} exp: An angular expression to be executed.
		 * @return {*}: The result of evaluating the expression
		 */
		UIElement.prototype.$evalAsync = function(exp){
			throw "UIElment->$evalAsync: Please implement $evalAsync in ["+this.constructor.name+"]";
		}

		/**
		 * Creates a new child scope.
         * The parent scope will propagate the $digest() and $digest() events. The scope can be removed from the scope hierarchy using $destroy().
         * $destroy() must be called on a scope when it is desired for the scope and its child scopes to be permanently detached from the parent and thus stop participating in model change detection and listener notification by invoking.
		 * For more detail, please see [AngularJS Scope](http://docs.angularjs.org/api/ng.$rootScope.Scope)
		 * @param  {boolean} isolate: if true then the scope does not prototypically inherit from the parent scope. The scope is isolated, as it can not see parent scope properties. When creating widgets it is useful for the widget to not accidentally read parent state.
		 * @return {Object}: The newly created child scope.
		 */
		UIElement.prototype.$new = function(isolate){
			throw "UIElment->$new: Please implement $new in ["+this.constructor.name+"]";
		}

		/**
		 * Listens on events of a given type. See $emit for discussion of event life cycle.
		 * For more detail, please see [AngularJS Scope](http://docs.angularjs.org/api/ng.$rootScope.Scope)
		 * @param  {string} name: Event name to listen on
		 * @param  {function} listener: Function to call when the event is emitted
		 * @return {function}: Returns a deregistration function for this listener.
		 */
		UIElement.prototype.$on = function(name, listener){
			throw "UIElment->$on: Please implement $on in ["+this.constructor.name+"]";
		}

		/**
		 * Registers a listener callback to be executed whenever the watchExpression changes.
		 * For more detail, please see [AngularJS Scope](http://docs.angularjs.org/api/ng.$rootScope.Scope)
		 * @param  {function|string} watchExpression: Expression that is evaluated on each $digest cycle. A change in the return value triggers a call to the listener.
		 * @param  {function|string} listener: Callback called whenever the return value of the watchExpression changes.
		 * @param  {boolean} objectEquality: Compare object for equality rather than for reference
		 * @return {function}: Returns a deregistration function for this listener
		 */
		UIElement.prototype.$watch = function(watchExpression, listener, objectEquality){
			throw "UIElment->$watch: Please implement $watch in ["+this.constructor.name+"]";
		}

		/**
		 * Unique scope ID (monotonically increasing alphanumeric sequence) useful for debugging.
		 * @type {number}
		 */
		UIElement.prototype.$id = undefined;

		/**
		 * Broadcasted when a scope and its children are being destroyed.
		 * @type {string}
		 */
		UIElement.prototype.$destroy = undefined;

		return {
			UIElement: UIElement
		};
	}];
})
;