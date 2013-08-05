// document.addEventListener("DOMContentLoaded", load, true);

// function load(){
// 	console.info("load");
// 	console.info(arguments);
// }

angular.element(document).ready(function(){
	angular.bootstrap(document, ['MyApp']);
});

var MyApp = angular.module('MyApp', {
  setup: function() {
    // setup for MyApp 
  },
  teardown: function() {
    //teardown for MyApp
  }
})
MyApp.controller('MyCtrl', ['$document' ,'$scope' ,function($document, $scope){
	$scope.world = "China";
}]);