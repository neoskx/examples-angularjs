angular.module('MyApp',[])
.directive('calculator', [function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		controller: function($scope, $element, $attrs) {
			$scope.result = 'Please input number.';
			$scope.plus = function(){
				$scope.result = $scope.value1+$scope.value2;
			};

			$scope.minus = function(){
				$scope.result = $scope.value1-$scope.value2;	
			};

			$scope.times = function(){
				$scope.result = $scope.value1*$scope.value2;	
			};

			$scope.divide = function(){
				$scope.result = $scope.value1/$scope.value2;	
			};

		},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		templateUrl: 'partials/template.tpl.html',
		replace: true
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		// link: function($scope, iElm, iAttrs, controller) {
			
		// }
	};
}]);

function ExampleCtrl($scope) {
	$scope.name = "SomePerson";
	$scope.age = "20";
	$scope.phone = "12345678901";
	$scope.sayHello = function() {
		alert("Hello, World!");
	};

	setInterval(function(){
		$scope.timestap = new Date().getTime();
		$scope.$apply();
	}, 1000);
}