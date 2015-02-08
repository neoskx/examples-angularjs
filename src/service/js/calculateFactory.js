/**
 * Factory to create a service. 
 * In factory pattern, you need to return an object.
 */

console.info("loaded calculateFactory.js at %o", new Date());
(function(){
	angular.module('serviceApp')
		.factory('calculateFactory', calculateFactory);

	calculateFactory.$inject = ["$log"];

	function calculateFactory($log){

		var baseValue = 100;

		console.info("calculateFactory init at %o", new Date());

		var service = {
			plus: plus,
			minus: minus,
			multiplied: multiplied,
			divided: divided,
			random: random
		}

		return service;

		///////////////////////////////////////////

		function plus(a, b){
			return a+b;
		}

		function minus (a, b) {
			return a-b;
		}

		function multiplied(a, b){
			return a*b;
		}

		function divided(a, b){
			if(b===0){
				throw "Denominator cannot be 0";
			}
			return a/b;
		}

		function random(){
			return Math.random()*baseValue;
		}
	}
})();