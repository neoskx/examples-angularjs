var myApp = angular.module('myApp', []);

myApp.directive('currentTime', ['$timeout','$filter',function($timeout, $filter){
	// Runs during compile
	return {
		name: 'currentTime',
		priority: 2,
		// terminal: true,
		scope: true, // {} = isolate, true = child, false/undefined = no change
		// cont­rol­ler: function($scope, $element, $attrs, $transclue) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		// templateUrl: '',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			console.info("currentTime");
			var timer;
			function updateTime(){
				$scope.currentTime = $filter('date')(new Date().getTime(), $scope.format);
			}

			function updateTimeContinuous(){
				timer = $timeout(function(){
					updateTime();
					updateTimeContinuous();
				}, 1000);
			}

			$scope.$watch(iAttrs.currentTime, function(scope, newValue, oldValue) {
				scope.format = newValue;
			});

			iElm.bind('$destory', function(){
				$timeout.cancel(timer);
			});

			updateTime();
			updateTimeContinuous();
		}
	};
}]);

myApp.directive('myPassedTime', [function(){
	// Runs during compile
	return {
		name: 'myPassedTime',
		// priority: 0,
		// terminal: true,
		scope: {
			passedTime:'@myPassedTime'
		}, // {} = isolate, true = child, false/undefined = no change
		// cont­rol­ler: function($scope, $element, $attrs, $transclue) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		// templateUrl: '',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			console.info("myPassedTime");
			iAttrs.$observe('myPassedTime', function(value){
				console.info(value);
			});
		}
	};
}]);

myApp.directive('myCurrentTime', [function(){
	// Runs during compile
	return {
		name: 'myCurrentTime',
		priority: undefined,
		// terminal: true,
		scope: {
			currentTime:'=myCurrentTime'
		}, // {} = isolate, true = child, false/undefined = no change
		// cont­rol­ler: function($scope, $element, $attrs, $transclue) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		// templateUrl: '',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			console.info("myCurrentTime");
			iAttrs.$observe('myCurrentTime', function(value){
				console.info(value);
			});
		}
	};
}]);

myApp.directive('myFutureTime', [function(){
	// Runs during compile
	return {
		name: 'myFutureTime',
		priority: undefined,
		// terminal: true,
		scope: {
			futureTime:'&myFutureTime'
		}, // {} = isolate, true = child, false/undefined = no change
		// cont­rol­ler: function($scope, $element, $attrs, $transclue) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		// templateUrl: '',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			console.info("myFutureTime");
			iAttrs.$observe('myFutureTime', function(value){
				console.info(value);
			});
		}
	};
}]);

myApp.directive('dialog', ['', function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		controller: function($scope, $element, $attrs, $transclue) {

		},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		// templateUrl: '',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			
		}
	};
}]);

function MyCtrl($scope){
	$scope.format= "M/d/yy h:mm:ss a";
	$scope.name= "AngularJS";
	$scope.name1= "Name1";
	$scope.name2= "Name2";
	$scope.name3= "Name3";
}