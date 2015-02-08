/**
 * Service Pattern to create a service. 
 * In this pattern, You are writting a constrator function
 */

console.info("loaded calculateService.js at %o", new Date());

(function(){
	angular.module('serviceApp')
		.service('calculateService', calculateService);

	calculateService.$inject = ["$log"];
	function calculateService($log){

		console.info("calculateService init at %o", new Date());

		var baseValue = 100;

		this.plus = function(a, b){
			return a+b;
		}

		this.minus = function(a, b) {
			return a-b;
		}

		this.multiplied = function(a, b){
			return a*b;
		}

		this.random = function(){
			return Math.random()*baseValue;
		}
	}

	calculateService.prototype.divided = function(a, b){
		if(b===0){
			throw "Denominator cannot be 0";
		}
		return a/b;
	}
})();