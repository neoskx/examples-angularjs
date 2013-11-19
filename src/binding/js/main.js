function bootstrap(){
	console.group("bootstrap");
	angular.bootstrap($('body'));
	console.groupEnd();
}

function MyCtrl($scope, $timeout){
	$scope.text = "Hello World";

	$scope.testString = "Test String";

	$timeout(function(){
		$scope.testString = new Date().getTime();
		$scope.$apply();
	}, 5000);

	// setTimeout
}