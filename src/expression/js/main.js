function ExpressionsCtrl($scope) {

	function parseJSON(str) {
		try {
			var obj = JSON.parse(str);
			return obj;
		} catch (e) {
			return undefined;
		}
	}

	/**
	 * Give an expression, and test whether this expression is added before
	 * @param  {String} exp: the expression need to verfiy
	 * @return {Number}: The index of expression in array. Default is -1, is value is -1 then means didn't find this expression
	 */
	function indexOfExpression(exp){
		console.group("indexOfExpression, exp = %s", exp);
		var bExist = -1;
		for (var i = 0; i < $scope.expressions.length; i++) {
			if ($scope.expressions[i].exp === exp) {
				bExist = i;
			}
		}
		console.groupEnd();
		return bExist;
	}

	/**
	 * Judge a str whether a javascript string
	 * @param  {String} str: the str want to test
	 * @return {Boolean}: true means this is a valid javascript function string, otherwise means it isn't a valid javascript function string
	 */
	function whetherIsAFunction(str){
		var reg = /function\s*(\s*[a-z0-9]*)\s*\((.*)\)(\t|\r|\s)*\{(.*\r*\n*)*\}/gi;
		return reg.test(str);
	}

	// Store all the attributes add to this scope
	$scope.attributes = {};

	// Store all the expressions add by user
	$scope.expressions = [];

	$scope.addAttribute = function() {
		console.group("AddAttribute");
		console.log("%s", $scope.attrName);
		console.log("%s", $scope.attrValue);
		$scope[$scope.attrName] = $scope.attrValue;
		var obj = parseJSON($scope.attrValue);
		var bFunction = whetherIsAFunction($scope.attrValue);
		if (!isNaN(Number($scope.attrValue))) {
			console.log("Number");
			$scope.attributes[$scope.attrName] = Number($scope.attrValue);
			$scope[$scope.attrName] = Number($scope.attrValue);
		} else if(bFunction){
			$scope.attributes[$scope.attrName] = Function('return '+$scope.attrValue)();
			$scope[$scope.attrName] = $scope.attributes[$scope.attrName];
		} else if (obj) {
			$scope[$scope.attrName] = obj;
			$scope.attributes[$scope.attrName] = obj;
		} else {
			console.log("String");
			$scope.attributes[$scope.attrName] = $scope.attrValue;
		}
		console.groupEnd();
	};

	$scope.removeAttribute = function() {
		console.group("removeAttribute");
		delete $scope[$scope.attrName];
		delete $scope.attributes[$scope.attrName];
		console.groupEnd();
	};

	$scope.addExpression = function(exp) {
		console.group("addExpression, exp=%s", exp);
		var scope = $scope;
		var value = $scope.$eval(exp);
		if (indexOfExpression(exp) === -1) {	//If isn't added before
			$scope.$watch(function() {
				return $scope.$eval(exp);
			}, function(newValue, olderValue) {
				console.log("%o", arguments);
				var obj = {
					exp: exp,
					value: newValue
				};
				var indexValue = indexOfExpression(exp);

				if(indexValue===-1){
					$scope.expressions.push(obj);
				}else{
					$scope.expressions[indexValue].value=obj.value;
				}
			});
		}
		console.groupEnd();
	};
}