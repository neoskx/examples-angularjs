angular.module('MyApp',[])
// .directive('calculator', [function(){
// 	// Runs during compile
// 	return {
// 		// name: '',
// 		// priority: 1,
// 		// terminal: true,
// 		scope: {}, // {} = isolate, true = child, false/undefined = no change
// 		controller: function($scope, $element, $attrs) {
// 			$scope.result = 'Please input number.';
// 			$scope.plus = function(){
// 				$scope.result = $scope.value1+$scope.value2;
// 			};

// 			$scope.minus = function(){
// 				$scope.result = $scope.value1-$scope.value2;	
// 			};

// 			$scope.times = function(){
// 				$scope.result = $scope.value1*$scope.value2;	
// 			};

// 			$scope.divide = function(){
// 				$scope.result = $scope.value1/$scope.value2;	
// 			};

// 		},
// 		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
// 		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
// 		// template: '',
// 		templateUrl: 'partials/template.tpl.html',
// 		replace: true
// 		// transclude: true,
// 		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
// 		// link: function($scope, iElm, iAttrs, controller) {
			
// 		// }
// 	};
// }])

.provider("calculatorService", function(){
	this.$get = function(){
		return {
			plus: function(a, b){
				return a+b;
			}
		};
	};
})

.directive('calculator', ['calculatorService', function(calculatorService){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		controller: function($scope, $element, $attrs) {
			$scope.result = 'Please input number.';
			$scope.plus = function(){
				$scope.result = calculatorService.plus($scope.value1, $scope.value2);
			};

			$scope.minus = function(){
				// $scope.result = $scope.value1-$scope.value2;	
			};

			$scope.times = function(){
				// $scope.result = $scope.value1*$scope.value2;	
			};

			$scope.divide = function(){
				// $scope.result = $scope.value1/$scope.value2;	
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
}])

;


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

function MoneyCtrl($scope, calculatorService){
	$scope.tellMe = function(){
		var money = calculatorService.plus($scope.p1, $scope.p2);
		alert(money);
	}
}


function PersonCtrl($scope, $timeout){
	$scope.beSend = false;

	$scope.getPersonInfo = function(){
		// Send request server
		// Response the data
		// 
		$scope.person = {
			name: "Some Person",
			age: 23,
			address: 'China'
		};
		// $scope.$apply();
	};

	$scope.send = function(){

		// Send the data in person
		// 
		// Send sucessful
		
		$scope.beSend = true;
		$scope.$apply();
	};

	$scope.getPersonInfo();
}