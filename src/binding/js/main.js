function bootstrap(){
	console.group("bootstrap");
	angular.bootstrap($('body'));
	console.groupEnd();
}

function MyCtrl($scope){
	$scope.text = "Hello World";
}