function MyCtrl($scope) {

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
		'+': function(self, locals, a, b) {
			a = a(self, locals);
			b = b(self, locals);
			if (isDefined(a)) {
				if (isDefined(b)) {
					return a + b;
				}
				return a;
			}
			return isDefined(b) ? b : undefined;
		},
		'-': function(self, locals, a, b) {
			a = a(self, locals);
			b = b(self, locals);
			return (isDefined(a) ? a : 0) - (isDefined(b) ? b : 0);
		},
		'*': function(self, locals, a, b) {
			return a(self, locals) * b(self, locals);
		},
		'/': function(self, locals, a, b) {
			return a(self, locals) / b(self, locals);
		},
		'%': function(self, locals, a, b) {
			return a(self, locals) % b(self, locals);
		},
		'^': function(self, locals, a, b) {
			return a(self, locals) ^ b(self, locals);
		},
		// '=': noop,
		'==': function(self, locals, a, b) {
			return a(self, locals) == b(self, locals);
		},
		'!=': function(self, locals, a, b) {
			return a(self, locals) != b(self, locals);
		},
		'<': function(self, locals, a, b) {
			return a(self, locals) < b(self, locals);
		},
		'>': function(self, locals, a, b) {
			return a(self, locals) > b(self, locals);
		},
		'<=': function(self, locals, a, b) {
			return a(self, locals) <= b(self, locals);
		},
		'>=': function(self, locals, a, b) {
			return a(self, locals) >= b(self, locals);
		},
		'&&': function(self, locals, a, b) {
			return a(self, locals) && b(self, locals);
		},
		'||': function(self, locals, a, b) {
			return a(self, locals) || b(self, locals);
		},
		'&': function(self, locals, a, b) {
			return a(self, locals) & b(self, locals);
		},
		//    '|':function(self, locals, a,b){return a|b;},
		'|': function(self, locals, a, b) {
			return b(self, locals)(self, locals, a(self, locals));
		},
		'!': function(self, locals, a) {
			return !a(self, locals);
		}
	};

	function lex(chars) {

		/**
		 * Search a character whether is in given string
		 * @param  {String}  chars: the given string used to be search
		 * @param  {String}  ch: the character used to search
		 * @return {Boolean} `true` means find it, otherwise not find
		 */
		function is(chars, ch){
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
				fch = index -1 > 0 ? chars.charAt(index-1):null;
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

		function isValidOperator(chars, ch, index){
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
				'(':1
			};

			// an operation's length <=3. so try to check the sub string from currently position to before or after
			var nop1 = chars.slice(index, index+2),
				nop2 = chars.slice(index, index+3),
				pop1 = chars.slice(index-1, index+1),
				pop2 = chars.slice(index-2, index+1);
			// any one of them is valid operatior, return `true` means correct operator
			if(validOperators[ch] || validOperators[nop1] || validOperators[nop2] || validOperators[pop1] || validOperators[pop2]){
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
			var start = index, tch, mark=0;
			tch = chars.charAt(index);
			if(tch === '('){		// if it is `(`
				if(index === 0){	// if first element is `(`
					return true;
				}else{
					// start to check whether this `(` is an operator not a function call. If it is an operator so the element before it, should also be a operator
					index -=1;
					while(index>=0){
						tch = chars.charAt(index);
						if(isWhitespace(tch)){		// if it is a `whitespace`, index--
							if(index == 0){			// if until first elment is `whitespace`
								return true;
							}
							index--;				// if it is a `whitespace`, continue to check before character
						}else if(isValidOperator(chars, tch, index)){	// if it is a valid operator
							return true;
						}else{
							return false;
						}
					}
				}
			}else if( tch === ')'){					// if it is `)`
				index -=1;
				while(index>=0){
					tch = chars.charAt(index);
					if(tch === ')'){
						mark++;
					}else if(tch === '('){
						if(mark>0){
							mark--;
						}else{
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
		function readExpression(expressions, chars, index){
			//console.group('readExpression, expressions=%o, ch=%s, index=%s', expressions, chars, index);
			var start = index;
			var expression = '';
			var tch = null;
			while(index<chars.length){
				tch = chars.charAt(index);
				if(isLogicOperator(chars, tch, index)){	// if it is logic operator
					break;
				}else if(isBracketOperator(chars, tch, index)){	// if it is a bracket operator
					break;
				} else{									// else continue to read this expression
					expression+=tch;
					index++;
				}
			}

			if(expression){
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
		function readLogicOperator(expressions, chars, index){
			//console.group('readLogicOperator, expressions=%o, ch=%s, index=%s', expressions, chars, index);
			var start = index;
			var lo = chars.slice(index,index+2);
			expressions.push(lo);
			//console.groupEnd();
			return index+2;
		}

		/**
		 * Read a bracket operator and put it to expressions array
		 * @param  {Array} expressions: the array stores expression 
		 * @param  {String} chars: the expressions string
		 * @param  {Number} index: currently character's index number
		 * @return {Number}: return new index value
		 */
		function readBracket(expressions, chars, index){
			//console.group('readBracket, expressions=%o chars=%s, index=%s', expressions, chars, index);
			var start = index;
			var ch = chars.charAt(index);
			expressions.push(ch);
			//console.groupEnd();
			return index+1;
		}

		function parseExpression(arrExp) {
			//console.group('parseExpression');
			var expressions = arrExp||[],
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

	$scope.parse = function() {
		if (!$scope.text || $scope.text === '') {
			//console.info("Please input parse string");
			return;
		}else{
			$scope.expressions = lex($scope.text);
		}
	}
}