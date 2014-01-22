var MyApp = angular.module('MyApp', []);

MyApp.filter('combinationFilter', function() {
	return function(array, scope, expression) {

		console.group("combinationFilter. array=%o, scope=%o, expression=%o", array, scope, expression);
		// All support operators 
		var OPERATORS = {
			'null': function() {
				return null;
			},
			'true': function() {
				return true;
			},
			'false': function() {
				return false;
			},
			// undefined: noop,
			'+': function(self, locals, member, a, b) {
				a = a(self, locals, member);
				b = b(self, locals, member);
				if (isDefined(a)) {
					if (isDefined(b)) {
						return a + b;
					}
					return a;
				}
				return isDefined(b) ? b : undefined;
			},
			'-': function(self, locals, member, a, b) {
				a = a(self, locals, member);
				b = b(self, locals, member);
				return (isDefined(a) ? a : 0) - (isDefined(b) ? b : 0);
			},
			'*': function(self, locals, member, a, b) {
				return a(self, locals, member) * b(self, locals, member);
			},
			'/': function(self, locals, member, a, b) {
				return a(self, locals, member) / b(self, locals, member);
			},
			'%': function(self, locals, member, a, b) {
				return a(self, locals, member) % b(self, locals, member);
			},
			'^': function(self, locals, member, a, b) {
				return a(self, locals, member) ^ b(self, locals, member);
			},
			// '=': noop,
			'==': function(self, locals, member, a, b) {
				return a(self, locals, member) == b(self, locals, member);
			},
			'!=': function(self, locals, member, a, b) {
				return a(self, locals, member) != b(self, locals, member);
			},
			'<': function(self, locals, member, a, b) {
				return a(self, locals, member) < b(self, locals, member);
			},
			'>': function(self, locals, member, a, b) {
				return a(self, locals, member) > b(self, locals, member);
			},
			'<=': function(self, locals, member, a, b) {
				return a(self, locals, member) <= b(self, locals, member);
			},
			'>=': function(self, locals, member, a, b) {
				return a(self, locals, member) >= b(self, locals, member);
			},
			'&&': function(self, locals, member, a, b) {
				return a(self, locals, member) && b(self, locals, member);
			},
			'||': function(self, locals, member, a, b) {
				return a(self, locals, member) || b(self, locals, member);
			},
			'&': function(self, locals, member, a, b) {
				return a(self, locals, member) & b(self, locals, member);
			},
			//    '|':function(self, locals, member, a,b){return a|b;},
			'|': function(self, locals, member, a, b) {
				return b(self, locals, member)(self, locals, a(self, locals, member));
			},
			'!': function(self, locals, member, a) {
				return !a(self, locals, member);
			}
		};

		function lex(chars) {

			/**
			 * Search a character whether is in given string
			 * @param  {String}  chars: the given string used to be search
			 * @param  {String}  ch: the character used to search
			 * @return {Boolean} `true` means find it, otherwise not find
			 */
			function is(chars, ch) {
				//console.group('is, chars=%s, ch=%s', chars, ch);
				//console.groupEnd();
				return chars.indexOf(ch) !== -1;

			}

			/**
			 * Judge currently operator wether is logic operator
			 * @param  {String}  chars: the expression string
			 * @param  {String}  ch: currently character
			 * @param  {Number}  index: currently character's index
			 * @return {Boolean}: `true` - means it is a logic operator, `false` - means it is not a logic operator
			 */
			function isLogicOperator(chars, ch, index) {
				//console.group('isLogicOperator, chars=%s, ch=%s, index=%s', chars, ch, index);
				var bch, fch;
				index = index >= 0 ? index : 0;
				if (is('|&', ch)) { // currently character is | or &
					bch = index + 1 < chars.length ? chars.charAt(index + 1) : null;
					fch = index - 1 > 0 ? chars.charAt(index - 1) : null;
					if (ch === bch || ch === fch) {
						return true;
					}
				}
				//console.groupEnd();
				return false;
			}

			/**
			 * Judge a character whether is a `whitespace`
			 * @param  {String}  ch: the character need to judge
			 * @return {Boolean}: `true` - means it is a `whitespace`; `false` - means it isn't a `whitespace`
			 */
			function isWhitespace(ch) {
				//console.group('isWhitespace, ch=%s', ch);
				//console.groupEnd();
				return ch === ' ' || ch === '\r' || ch === '\t' || ch === '\n' || ch === '\v' || ch === '\u00A0'; // IE treats non-breaking space as \u00A0
			}

			function isValidOperator(chars, ch, index) {
				// valid operator could be appear before `(`
				var validOperators = {
					'+': 1,
					'-': 1,
					'*': 1,
					'/': 1,
					'%': 1,
					'^': 1,
					'==': 1,
					'!=': 1,
					'===': 1,
					'!==': 1,
					'<': 1,
					'>': 1,
					'<=': 1,
					'>=': 1,
					'&&': 1,
					'||': 1,
					'!': 1,
					'(': 1
				};

				// an operation's length <=3. so try to check the sub string from currently position to before or after
				var nop1 = chars.slice(index, index + 2),
					nop2 = chars.slice(index, index + 3),
					pop1 = chars.slice(index - 1, index + 1),
					pop2 = chars.slice(index - 2, index + 1);
				// any one of them is valid operatior, return `true` means correct operator
				if (validOperators[ch] || validOperators[nop1] || validOperators[nop2] || validOperators[pop1] || validOperators[pop2]) {
					return true;
				}

				return false;
			}

			/**
			 * Bracket have two kinds:
			 *  1. function call. Like this: alert('This is a function call bracket');
			 *  2. operator. Like this: (1+2)*3;
			 *  This function is try to judge whether a bracket is an operator or function call.
			 *  How to judge:
			 *    If it is a operator, there must be another operator connect it or it is first element.
			 * @param  {String}  chars: the expression string
			 * @param  {String}  ch: the currently character need to judge.
			 * @param  {Number}  index: the index of currently character
			 * @return {Boolean}: `true` - valid bracket; `false` - not valid bracket
			 */
			function isBracketOperator(chars, ch, index) {
				//console.group('isBracketOperator, chars=%s, ch=%s, index=%s', chars, ch, index);
				var start = index,
					tch, mark = 0;
				tch = chars.charAt(index);
				if (tch === '(') { // if it is `(`
					if (index === 0) { // if first element is `(`
						return true;
					} else {
						// start to check whether this `(` is an operator not a function call. If it is an operator so the element before it, should also be a operator
						index -= 1;
						while (index >= 0) {
							tch = chars.charAt(index);
							if (isWhitespace(tch)) { // if it is a `whitespace`, index--
								if (index == 0) { // if until first elment is `whitespace`
									return true;
								}
								index--; // if it is a `whitespace`, continue to check before character
							} else if (isValidOperator(chars, tch, index)) { // if it is a valid operator
								return true;
							} else {
								return false;
							}
						}
					}
				} else if (tch === ')') { // if it is `)`
					index -= 1;
					while (index >= 0) {
						tch = chars.charAt(index);
						if (tch === ')') {
							mark++;
						} else if (tch === '(') {
							if (mark > 0) {
								mark--;
							} else {
								return isBracketOperator(chars, tch, index);
							}
						}
						index--;
					}
				}
				//console.groupEnd();
				return false;
			}

			/**
			 * Read an expression until it is a logic operator or bracket operator and put it to expressions array
			 * @param  {Array} expressions: the array stores expression
			 * @param  {String} chars: the expressions string
			 * @param  {Number} index: currently character's index number
			 * @return {Number}: return new index value
			 */
			function readExpression(expressions, chars, index) {
				//console.group('readExpression, expressions=%o, ch=%s, index=%s', expressions, chars, index);
				var start = index;
				var expression = '';
				var tch = null;
				while (index < chars.length) {
					tch = chars.charAt(index);
					if (isLogicOperator(chars, tch, index)) { // if it is logic operator
						break;
					} else if (isBracketOperator(chars, tch, index)) { // if it is a bracket operator
						break;
					} else { // else continue to read this expression
						expression += tch;
						index++;
					}
				}

				if (expression) {
					expressions.push(expression);
				}

				//console.groupEnd();
				return index;
			}

			/**
			 * Read a logic operator and put it to expressions array
			 * @param  {Array} expressions: the array stores expression
			 * @param  {String} chars: the expressions string
			 * @param  {Number} index: currently character's index number
			 * @return {Number}: return new index value
			 */
			function readLogicOperator(expressions, chars, index) {
				//console.group('readLogicOperator, expressions=%o, ch=%s, index=%s', expressions, chars, index);
				var start = index;
				var lo = chars.slice(index, index + 2);
				expressions.push(lo);
				//console.groupEnd();
				return index + 2;
			}

			/**
			 * Read a bracket operator and put it to expressions array
			 * @param  {Array} expressions: the array stores expression
			 * @param  {String} chars: the expressions string
			 * @param  {Number} index: currently character's index number
			 * @return {Number}: return new index value
			 */
			function readBracket(expressions, chars, index) {
				//console.group('readBracket, expressions=%o chars=%s, index=%s', expressions, chars, index);
				var start = index;
				var ch = chars.charAt(index);
				expressions.push(ch);
				//console.groupEnd();
				return index + 1;
			}

			function parseExpression(arrExp) {
				//console.group('parseExpression');
				var expressions = arrExp || [],
					expression,
					ch,
					index = 0,
					lastEx = '';

				while (index < chars.length) {
					ch = chars.charAt(index);
					if (isLogicOperator(chars, ch, index)) { //when currently is a logic operator
						index = readLogicOperator(expressions, chars, index);
					} else if (isBracketOperator(chars, ch, index)) {
						index = readBracket(expressions, chars, index);
					} else {
						index = readExpression(expressions, chars, index);
					}
				}
				//console.groupEnd();
				return expressions;
			}

			var expressions = parseExpression();

			return expressions;
			//console.info(expressions);
		}

		function process(tokens, scope) {

			function peek(e1, e2, e3, e4) {
				if (tokens.length > 0) {
					var token = tokens[0];
					var t = token;
					if (t == e1 || t == e2 || t == e3 || t == e4 ||
						(!e1 && !e2 && !e3 && !e4)) {
						return token;
					}
				}
				return false;
			}

			function expect(e1, e2, e3, e4) {
				var token = peek(e1, e2, e3, e4);
				if (token) {
					tokens.shift();
					return token;
				}
				return false;
			}

			function consume(e1) {
				if (!expect(e1)) {
					throw("is unexpected, expecting [" + e1 + "]");
				}
			}

			/**
			 * Return the value accesible from the object by path. Any undefined traversals are ignored
			 * @param {Object} obj starting object
			 * @param {string} path path to traverse
			 * @param {boolean=true} bindFnToScope
			 * @returns value as accesbile by path
			 */
			//TODO(misko): this function needs to be removed
			function getter(obj, path, bindFnToScope) {
				if (!path) return obj;
				var keys = path.split('.');
				var key;
				var lastInstance = obj;
				var len = keys.length;

				for (var i = 0; i < len; i++) {
					key = keys[i];
					if (obj) {
						obj = (lastInstance = obj)[key];
					}
				}
				if (!bindFnToScope && angular.isFunction(obj)) {
					return angular.bind(lastInstance, obj);
				}
				return obj;
			}

			function valueFn(value){
				return function(){
					return Number(value);
				}
			}

			function evalExpression(expression){
				return scope.$eval(expression);
			}

			/**
			 * use `expression` to filter `member`
			 * @param  {Object} member     [description]
			 * @param  {String|Object|function()} expression: be used to filter `member`
			 * @return {Boolean}: `true` - match; `false` - not match
			 */
			function filter(self, locals, member, expression) {
				console.group("filter");
				console.info('expression = %s', expression.toString());

				var predicates = [];
				predicates.check = function(value) {
					for (var j = 0; j < predicates.length; j++) {
						if (!predicates[j](value)) {
							return false;
						}
					}
					return true;
				};
				var search = function(obj, text) {
					if (text.charAt(0) === '!') {
						return !search(obj, text.substr(1));
					}
					switch (typeof obj) {
						case "boolean":
						case "number":
						case "string":
							return ('' + obj).toLowerCase().indexOf(text) > -1;
						case "object":
							for (var objKey in obj) {
								if (objKey.charAt(0) !== '$' && search(obj[objKey], text)) {
									return true;
								}
							}
							return false;
						case "array":
							for (var i = 0; i < obj.length; i++) {
								if (search(obj[i], text)) {
									return true;
								}
							}
							return false;
						default:
							return false;
					}
				};
				switch (typeof expression) {
					case "boolean":
					case "number":
					case "string":
						expression = {
							$: expression
						};
					case "object":
						for (var key in expression) {
							if (key == '$') {
								(function() {
									var text = ('' + expression[key]).toLowerCase();
									if (!text) return;
									predicates.push(function(value) {
										return search(value, text);
									});
								})();
							} else {
								(function() {
									var path = key;
									var text = ('' + expression[key]).toLowerCase();
									if (!text) return;
									predicates.push(function(value) {
										return search(getter(value, path), text);
									});
								})();
							}
						}
						break;
					case 'function':
						predicates.push(expression);
						break;
					default:
						return array;
				}

				console.groupEnd();
				return predicates.check(member);
			}

			function assignment() {
				var left = logicalOR();
				return left;
			}

			function logicalOR() {
				var left = logicalAND();
				var token;
				while (true) {
					if ((token = expect('||'))) {
						left = binaryFn(left, OPERATORS[token], logicalAND());
					} else {
						return left;
					}
				}
				return left;
			}

			function logicalAND() {
				var left = equality();
			    var token;
			    if ((token = expect('&&'))) {
			      left = binaryFn(left, OPERATORS[token], logicalAND());
			    }
				return left;
			}

			function equality() {
				var left = relational();
			    var token;
			    if ((token = expect('==','!='))) {
			      left = binaryFn(left, OPERATORS[token], equality());
			    }
				return left;
			}

			function relational() {
				var left = additive();
				var token;
				if ((token = expect('<', '>', '<=', '>='))) {
					left = binaryFn(left, OPERATORS[token], relational());
				}
				return left;
			}

			function additive() {
				var left = multiplicative();
				var token;
				while((token = expect('+', '-'))){
					left = binaryFn(left, OPERATORS[token], additive());
				}
				return left;
			}

			function multiplicative() {
				var left = unary();
				var token;

				while((token = expect('*', '/', '%'))){
					left = binaryFn(left, OPERATORS[token], multiplicative());
				}
				return left;
			}

			function unary() {
				var token;
				if(expect('+')){
					return primary();
				}else if((token = expect('-'))){
					return binaryFn(valueFn(0), OPERATORS[token], unary());
				}else if((token = expect('!'))){
					return unaryFn(OPERATORS[token], unary());
				}else{
					return primary();
				}
			}

			function primary() {
				var expression, token;
				if(expect('(')){
					expression = assignment();
					consume(')');
					return expression;
				}else{
					token = expect();
					expression = evalExpression(token);
					return function(self, locals, member){
						return filter(self, locals, member, expression);
					};
				}
			}

			function unaryFn(fn, right) {
				return function(self, locals, member, member) {
					return fn(self, locals, member, right);
				};
			}

			function binaryFn(left, fn, right) {
				return function(self, locals, member) {
					return fn(self, locals, member, left, right);
				};
			}

			return assignment();
		}

		function combinationFilter(array, scope, expression) {
			console.group('combinationFilter');
			var operatorArray = lex(expression);
			console.info('operatorArray = %s', operatorArray.toString());
			var filterExpression = process(operatorArray, scope);
			var newArray = [];

			for(var i = 0; i<array.length; i++){
				var result = filterExpression(scope, undefined, array[i]);
				if(result){
					newArray.push(array[i]);
				}
				console.info(result)
			}
			console.groupEnd();

			return newArray;
		}

		console.groupEnd();

		return combinationFilter(array, scope, expression);
	};
});

MyApp.controller('MyCtrl', ['$scope',
	function($scope) {

		$scope.members = [{
			"description": "This node is used for test. 102",
			"config": {
				"checked": false,
				"status": "1",
				"attributes": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper Lorem ipsum dolor sit amet, consecte",
				"appNum": "2",
				"expensive": false,
				"favored": true
			},
			"status": {
				"state": "1",
				"description": ""
			},
			"name": "Node102",
			"type": "UIAgent:1.0:Node",
			"agentId": "uiagent",
			"key": "Node102"
		}, {
			"description": "This node is used for test. 101",
			"config": {
				"checked": false,
				"status": "2",
				"attributes": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper Lorem ipsum dolor sit amet, consecte",
				"appNum": "14",
				"expensive": true,
				"favored": true
			},
			"status": {
				"state": "2",
				"description": ""
			},
			"name": "Node101",
			"type": "UIAgent:1.0:Node",
			"agentId": "uiagent",
			"key": "Node101"
		}, {
			"description": "This node is used for test. 103",
			"config": {
				"checked": true,
				"status": "3",
				"attributes": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper Lorem ipsum dolor sit amet, consecte",
				"appNum": "20",
				"expensive": false,
				"favored": false
			},
			"status": {
				"state": "3",
				"description": ""
			},
			"name": "Node100",
			"type": "UIAgent:1.0:Node",
			"agentId": "uiagent",
			"key": "Node100"
		}];


		// $scope.parse = function() {
		// 	if (!$scope.text || $scope.text === '') {
		// 		//console.info("Please input parse string");
		// 		return;
		// 	} else {
		// 		$scope.expressions = lex($scope.text);
		// 	}
		// }
	}
])