var myApp = angular.module('myApp', []);

myApp.directive('compile', ['$compile', function($compile){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		controller: function($scope, $element, $attrs) {
			console.group("compile->controller");
			console.groupEnd();
		},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		template: '<div> Just for test</div>',
		// templateUrl: '',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			console.group("compile->link");
			$scope.$watch(function($scope){
				return $scope.$eval(iAttrs.compile);
			}, function(scope, newValue, oldValue) {
				iElm.html(newValue);
				$compile(iElm.contents())($scope);
			});

			iAttrs.$observe('type', function(value){
				console.log("$observe, newValue = "+value);
			});

			$scope.$watch(function(){
				return iElm[0].getAttribute("type");
			}, function($scope, newValue, oldValue) {
				console.log("$watch, newValue = "+newValue);
			});

			console.groupEnd();
		}
	};
}]);

function MyCtrl($scope){
	$scope.name = 'Angular';
 	$scope.html = 'Hello {{name}}';
}