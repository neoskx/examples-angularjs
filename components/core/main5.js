angular.module('UIComponents',[])
.provider("directiveCtrl", function(){
	this.$get = ["$document",function($document){
		function DirectiveCtrl(){
			this.version = "1.0.0";
		}

		DirectiveCtrl.prototype.tellName = function(){
			alert("name:"+this.name+"  version: "+this.version);
			// alert(this.name);
		};

		return {
			DirectiveCtrl: DirectiveCtrl
		};
	}];
})

.directive('directive1', ['directiveCtrl', function(directiveCtrl){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		 scope: true, // {} = isolate, true = child, false/undefined = no change
		 controller: function($scope, $element, $attrs) {
		 	var ctrl = new directiveCtrl.DirectiveCtrl();
		 	$.extend($scope,ctrl);
		 },
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		 // template: '',
		templateUrl: 'core/directive1.html',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			
		}
	};
}])
.directive('directive2', ["directiveCtrl", function(directiveCtrl){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		 scope: true, // {} = isolate, true = child, false/undefined = no change
		 controller: function($scope, $element, $attrs) {
		 	directiveCtrl.DirectiveCtrl.prototype.tellAge = function(){
		 		alert($scope.age);
		 	};

		 	var ctrl = new directiveCtrl.DirectiveCtrl();
		 	$.extend($scope,ctrl);
		 },
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		 // template: '',
		templateUrl: 'core/directive2.html',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			
		}
	};
}])
;

angular.module('myApp',['UIComponents'])
.controller("MyCtrl",function(){

});
