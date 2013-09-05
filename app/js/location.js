var myApp = angular.module('myApp', []);

function MyCtrl($scope, $location, $rootScope){
	$scope.text= "Template";
	$scope.values = [];
	var obj = {
		title:"$location.absUrl():"
		,val:$location.absUrl()
	}
	$scope.values.push(obj);

	var obj = {
		title:"$location.host():"
		,val:$location.host()
	}
	$scope.values.push(obj);

	var obj = {
		title:"$location.path():"
		,val:$location.path()
	}
	$scope.values.push(obj);

	var obj = {
		title:"$location.port():"
		,val:$location.port()
	}
	$scope.values.push(obj);

	var obj = {
		title:"$location.protocol():"
		,val:$location.protocol()
	}
	$scope.values.push(obj);

	var obj = {
		title:"$location.search():"
		,val:$location.search()
	}
	$scope.values.push(obj);

	var obj = {
		title:"$location.url():"
		,val:$location.url()
	}
	$scope.values.push(obj);

	$rootScope.$on("$locationChangeStart", function(){
		$scope.locationChangeStart = "$locationChangeStart+"+(new Date().getTime());
		console.info(arguments);
	});	

	$rootScope.$on("$locationChangeSuccess", function(){
		$scope.locationChangeStart = (new Date())+": $locationChangeSuccess";
		console.info(arguments);
	});	

	setTimeout(function(){
		// $location.path("/test.html");
	}, 2000);
}