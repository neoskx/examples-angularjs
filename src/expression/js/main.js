function ExpressionsCtrl($scope) {

	function parseJSON(str){
		try{
			var obj = JSON.parse(str);
			return obj;
		}catch(e){
			return undefined;
		}
	}

	$scope.attributes = {};

	$scope.expressions = [];

	$scope.addAttribute = function() {
		console.group("AddAttribute");
		console.log("%s", $scope.attrName);
		console.log("%s", $scope.attrValue);
		$scope[$scope.attrName] = $scope.attrValue;
		var obj = parseJSON($scope.attrValue);
		if (!isNaN(Number($scope.attrValue))) {
			console.log("Number");
			$scope.attributes[$scope.attrName] = Number($scope.attrValue);
			$scope[$scope.attrName] = Number($scope.attrValue);
		} else if(obj){
			$scope[$scope.attrName] = obj;
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
		console.group("addExpression, exp=%s", exp);
		var scope = $scope;
		var value = $scope.$eval(exp);
		$scope.$watch(function(){
			return $scope.$eval(exp);
		}, function(newValue, olderValue){
			console.log("%o", arguments);
			var obj = {
				exp: exp,
				value: newValue
			};
			var bExist = false;
			for(var i = 0; i<$scope.expressions.length;i++){
				console.log('$scope.expresions[i].exp = %s',$scope.expressions[i].exp);
				console.log('exp = %s', exp);
				if($scope.expressions[i].exp == exp){
					$scope.expressions[i] = obj;
					bExist = true;
				}
			}
			if(!bExist) {
				$scope.expressions.push(obj);
			}
		});
		console.groupEnd();
	};
}