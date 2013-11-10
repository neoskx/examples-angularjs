// 1. You must pass $scope, and cannot change to other name. 
function MyCtrl($scope){
	// Who should be said hello is defined in controller
	$scope.who = "Blithe";

	var callService = function(successFun, errorFun){
		var value = Math.random();

		var successtext = "Welcome to Angular";
		var errorText = "Cannot get data from server";

		if(value>=0.5){
			setTimeout(function(){
				successFun(successtext);
			},1000);
		}else{
			setTimeout(function(){
				errorFun(errorText);
			},1000);
		}
	}

	// Add a button - Greeting, when user click this show the text get from server
	$scope.greeting = function(){
		$scope.status = "Start call service...";
		var scope = $scope;
		callService(function(text){
			scope.status = "Success!";
			scope.$apply();
			alert(text);
		}, function(text){
			scope.status = "Fail!";
			scope.$apply()
			alert(text);
		});
	}
}