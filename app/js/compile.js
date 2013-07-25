var myApp = angular.module('myApp', []);

myApp.directive('compile', ['$compile', function($compile){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		// cont­rol­ler: function($scope, $element, $attrs, $transclue) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		// templateUrl: '',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			$scope.$watch(function($scope){
				return $scope.$eval(iAttrs.compile);
			}, function(scope, newValue, oldValue) {
				iElm.html(newValue);
				$compile(iElm.contents())($scope);
			});
		}
	};
}]);

function MyCtrl($scope){
	$scope.name = 'Angular';
 	$scope.html = 'Hello {{name}}';
}