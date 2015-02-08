/**
 * Provider Pattern to create a service. 
 * In this pattern, Its seems to Factory Pattern, the different is you writting Factory Pattern in `this.$get` function. And User can use serviceProvider to config this service
 */

console.info("loaded calculateProvider.js at %o", new Date());

(function(){
	angular.module('serviceApp')
		.provider('calculateProvider', calculateProvider);

	calculateProvider.$inject = [];
	function calculateProvider(){

		console.info("calculateProvider config part excuted at %o", new Date());

		// Default baseValue is 100
		var baseValue = 100;

		// Set base value
		this.setBaseValue = function(value){
			baseValue = value;
		}

		this.$get = function(){

			console.info("calculateProvider init at %o", new Date());

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
	}
})();