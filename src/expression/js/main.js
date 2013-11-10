function ExpressionsCtrl($scope) {
	$scope.attributes = {};

	$scope.expressions = [];

	$scope.x=0;

	$scope.addAttribute = function() {
		console.group("AddAttribute");
		console.log("%s", $scope.attrName);
		console.log("%s", $scope.attrValue);
		$scope[$scope.attrName] = $scope.attrValue;
		if (Number($scope.attrValue)!== NaN) {
			console.log("Number");
			$scope.attributes[$scope.attrName] = Number($scope.attrValue);
			$scope[$scope.attrName] = Number($scope.attrValue);
		} else {
			console.log("String");
			$scope.attributes[$scope.attrName] = $scope.attrValue;
		}
		console.groupEnd();
	};

	$scope.removeAttribute = function() {
		delete $scope[$scope.attrName];
		delete $scope.attributes[$scope.attrName];
	};

	$scope.addExpression = function(exp) {
		console.info(exp);
		var value = $scope.$eval(exp);
		var obj = {
			exp: exp,
			value: value
		};
		$scope.expressions.push(obj);
	};
}