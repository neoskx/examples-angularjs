angular.module('serviceApp',['ng']);

/**
 * Three way to define a service in AngularJS
 * 1. factory
 * 2. service
 * 3. provider
 */

angular.module("serviceApp")
 	.controller("MainCtrl", MainCtrl);

MainCtrl.$inject = ["$scope", "calculateFactory", "calculateService", "calculateProvider"];
// MainCtrl.$inject = ["$scope", "calculateFactory", "calculateService"];
// MainCtrl.$inject = ["$scope", "calculateFactory"];

function MainCtrl($scope, calculateFactory, calculateService, calculateProvider){
// function MainCtrl($scope, calculateFactory, calculateService){
// function MainCtrl($scope, calculateFactory){
	console.info(calculateProvider.random());
	console.info(calculateService.random());
	console.info(calculateFactory.random());

	this.alert = function(){
		alert(calculateFactory.random());
	}
}



angular.module("serviceApp")
	.config(['calculateProviderProvider', function(calculateProviderProvider){
		console.info("In serviceApp module config calculateProvider at %o", new Date());
		calculateProviderProvider.setBaseValue(10000);
	}]);