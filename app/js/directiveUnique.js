var myApp = angular.module('myApp', ['components']);

function MyCtrl($scope){
	$scope.text= "Template";
}

var components = angular.module('components', []);

components.directive('resizable', [function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		controller: function($scope, $element, $attrs) {
			console.group("resizable->controller");

			console.groupEnd();
		},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		template: '<div>resizable</div>',
		// templateUrl: '',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			console.group("resizable->link");

			console.log("%s", iAttrs['text']);

			console.groupEnd();
		}
	};
}]);