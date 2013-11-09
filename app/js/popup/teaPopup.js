teaDirectives

.provider('teaPopupCoreLink', function() {

	// Default setting of pop up
	var defaultOptions = {
		placement: 'top'
		,animation: true
		,popupDelay: 0
		,trigger:'click'
		,appendToBody:false
	};

	var triggerMap = {
		'mouseenter': 'mouseleave',
		'click': 'click',
		'focus': 'blur'
	};

	var globalOptions = {};

	this.setOptions = function setOptions(values) {
		angular.extend(globalOptions, values);
	};

	this.setTriggerMap = function setTriggerMap(map) {
		angular.extend(triggerMap, map);
	};

	this.$get = ['$window','$compile', '$timeout', '$parse', '$document', '$interpolate', 'teaUIElement', 'teaPosition',
		function($window, $compile, $timeout, $parse, $document, $interpolate, teaUIElement, teaPosition) {

			function TeaPopupCoreLink(scope, element, attrs, directiveName, prefix, options) {
				if(!directiveName){
					throw "You must pass a directive name. For example: tooltip";
				}

				if(!prefix){
					throw "To avoid conflict with other directive, you must pass a prefix for your directive";
				}

				options = angular.extend({}, defaultOptions, globalOptions, options);

				this.getDirectiveName = function(){
					return this.snakeCase(directiveName);
				};

				this.getPrefix = function(){
					return prefix;
				};

				this.getScope = function(){
					return scope;
				};

				this.getElement = function(){
					return element;
				};

				this.getAttrs = function(){
					return attrs;
				};

				this.getOptions = function(){
					return options;
				};

				this.setOptions = function(values){
					angular.extend(options, values);
				};

				this.getAppendToBody = function(){
					return options.appendToBody || false;
				};

				this.setAppendToBody = function(val){
					
					val = val!==undefined && val.toString();

					if(val == "false" || val == '0'){
						val = false;
					}else if(val == 'true' || val != '0'){
						val = true;
					}else{
						val = undefined;
					}

					if(val!==undefined && (typeof val == 'boolean')){
						angular.extend(options,{appendToBody:val});
					}
				};

				this.triggers = this.setTriggers(this.getOptions().trigger);
				scope[this.getPropertyName('isOpen')]=false;

				var template = this.getTemplate();
				this.tooltip = $compile(template)(scope);

				console.info(this.tooltip);

				this.observeAttributes();
			}
			
			/**
			 * Format a string to xx-xx-xx, and all letter is lower case.
			 * For example: ToolTip to tool-tip
			 * @param  {String} name: the string you want to format
			 * @return {String}: the string after format
			 */
			TeaPopupCoreLink.prototype.snakeCase=function(name) {
				var regexp = /[A-Z]/g;
				var separator = '-';
				return name.replace(regexp, function(letter, index) {
					return (index ? separator : '') + letter.toLowerCase();
				});
			};

			TeaPopupCoreLink.prototype.setTriggers = function(trigger){
				var show, hide;

				show = trigger || this.getOptions().trigger || 'mouseenter';
				hide = triggerMap[show] || show;
				
				return {
					show: show
					,hide: hide
				};
			};

			/**
			 * the diretive name, will create a new directive with the format "directiveName-popup"
			 * @param  {String} directiveName
			 * @return {String} The template of new directive("directiveName-popup")
			 */
			TeaPopupCoreLink.prototype.getTemplate = function() {
				var startSym = $interpolate.startSymbol();
				var endSym = $interpolate.endSymbol();
				var directiveName = this.getDirectiveName();
				var prefix = this.getPrefix();

				var template =
					'<' + directiveName + '-popup ' +
					prefix + '-title="' + startSym + prefix + '_title' + endSym + '" ' +
					prefix + '-content="' + startSym + prefix + '_content' + endSym + '" ' +
					prefix + '-placement="' + startSym + prefix + '_placement' + endSym + '" ' +
					prefix + '-animation="' + prefix + '_animation()" ' +
					// prefix+'-is-open="'+startSym+prefix+'_isOpen"'+endSym+
					'>' +
					'</' + directiveName + '-popup>';

				return template;
			};

			TeaPopupCoreLink.prototype.getPropertyName = function(name){
				console.info("getPropertyName");
				var prefix = this.getPrefix();
				return prefix+"_"+name;
			};

			TeaPopupCoreLink.prototype.observeAttributes = function(){
				console.info("observeAttributes");
				var attrs = this.getAttrs();
				var scope = this.getScope();
				var prefix = this.getPrefix();
				var triggers = this.triggers;
				var element = this.getElement();
				var self = this;

				attrs.$observe(prefix+"Content", function(val){
					scope[self.getPropertyName('content')] = val;
				});

				attrs.$observe(prefix+"Title", function(val){
					scope[self.getPropertyName('title')] = val;
				});

				attrs.$observe(prefix + "Placement", function(val) {
					if (val) {
						scope[self.getPropertyName('placement')] = val;
					} else {
						scope[self.getPropertyName('placement')] = self.getOptions().placement;
					}
				});

				attrs.$observe(prefix+"Animation", function(val){
					scope[self.getPropertyName('animation')] = angular.isDefined(val) ? $parse(val) : function(){ return options.animation;};
				});

				attrs.$observe(prefix+"Popupdelay", function(val){
					var delay = parseInt( val, 10 );
					scope[self.getPropertyName('popupdelay')] = !isNaN(delay)? delay : 0;
				});

				attrs.$observe(prefix+'Trigger', function(val){

					element.unbind(triggers.show);
					element.unbind(triggers.hide);

					triggers = self.setTriggers(val);

					if( triggers.show === triggers.hide ){
						element.bind(triggers.show, function(){
							self.toggleTooltipBind();
						});
					}else{
						element.bind(triggers.show, function() {
							self.showTooltipBind();
						});
						element.bind(triggers.hide, function() {
							self.hideTooltipBind();
						});
					}
				});

				attrs.$observe( prefix+'AppendToBody', function(val){
					if(angular.isDefined(val)) {
						self.setAppendToBody($parse(val)(scope));
					}
				});

				attrs.$observe( prefix+"Hide", function(val){
					self.tooltip.remove();
				});
			};

			TeaPopupCoreLink.prototype.toggleTooltipBind = function() {
				console.info("toggleTooltipBind");
				var scope = this.getScope();
				if (!scope[this.getPropertyName('isOpen')]) {
					this.showTooltipBind();
				} else {
					this.hideTooltipBind();
				}
			};

			TeaPopupCoreLink.prototype.showTooltipBind = function(){
				console.info("showTooltipBind");
				var scope = this.getScope();
				var self = this;
				if (scope[this.getPropertyName('popupdelay')]){
					popupTimeout = $timeout(function() {
						scope.$apply(function() {
							self.show();
						});
					}, scope[this.getPropertyName('popupdelay')]);
				}else{
					scope.$apply(function() {
						self.show();
					});
				}
			};

			TeaPopupCoreLink.prototype.hideTooltipBind = function(){
				console.info("hideTooltipBind");
				var self = this;
				var scope = this.getScope();
				scope.$apply(function(){
					self.hide();
				});
			};

			TeaPopupCoreLink.prototype.show = function(){
				console.info("show");
				var position
					,ttWidth
					,ttHeight
					,ttPosition
					;
				var scope = this.getScope();
				var element = this.getElement();
				var appendToBody = this.getAppendToBody();

				// if(!scope[this.getPropertyName('content')]){
				// 	return;
				// }

				if(!this.tooltip){
					return;
				}

				// if (transitionTimeout) {
				// 	$timeout.cancel(transitionTimeout);
				// }

				this.tooltip.css({top:0, left:0, display:'block'});

				if(appendToBody){
					$body = $body || $document.find('body');
					$body.append(this.tooltip);
				}else{
					element.after(this.tooltip);
				}

				position = appendToBody ? teaPosition.offset(element) : teaPosition.position(element);

				ttWidth = this.tooltip.prop('offsetWidth');
				ttHeight = this.tooltip.prop('offsetHeight');

				// Calculate the tooltip's top and left coordinates to center it with
	            // this directive.
				switch (scope[this.getPropertyName('placement')]) {
					case 'mouse':
						var mousePos = teaPosition.mouse();
						ttPosition = {
							top: mousePos.y,
							left: mousePos.x
						};
						break;
					case 'right':
						ttPosition = {
							top: position.top + position.height / 2 - ttHeight / 2,
							left: position.left + position.width
						};
						break;
					case 'bottom':
						ttPosition = {
							top: position.top + position.height,
							left: position.left + position.width / 2 - ttWidth / 2
						};
						break;
					case 'left':
						ttPosition = {
							top: position.top + position.height / 2 - ttHeight / 2,
							left: position.left - ttWidth
						};
						break;
					default:
						ttPosition = {
							top: position.top - ttHeight,
							left: position.left + position.width / 2 - ttWidth / 2
						};
						break;
				}

				ttPosition.top += 'px';
				ttPosition.left += 'px';

				// Now set the calculated positioning.
				this.tooltip.css(ttPosition);

				// And show the tooltip.
				scope[this.getPropertyName('isOpen')] = true;
			};

			TeaPopupCoreLink.prototype.hide = function() {
				console.info("hide");
				var scope = this.getScope();
				// First things first: we don't show it anymore.
				scope[this.getPropertyName('isOpen')] = false;

				//if tooltip is going to be shown after delay, we must cancel this
				// $timeout.cancel( popupTimeout );

				// And now we remove it from the DOM. However, if we have animation, we 
				// need to wait for it to expire beforehand.
				// FIXME: this is a placeholder for a port of the transitions library.
				// if ( angular.isDefined( scope.tt_animation ) && scope.tt_animation() ) {
				//   transitionTimeout = $timeout( function () { tooltip.remove(); }, 500 );
				// } else {
				//   tooltip.remove();
				// }
				// this.tooltip.remove();
			};

			return {
				TeaPopupCoreLink: TeaPopupCoreLink
			};
		}
	];
})

.directive('tooltipPopup', function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {
		},
		templateUrl: 'templates/tea-tooltip-popup.html'
	};
})

.directive('tooltip', ['teaPopupCoreLink',
	function(teaPopupCoreLink) {

		return {
			restrict: "A"
			,scope: true
			,link:function(scope, element, attrs){
				var link = new teaPopupCoreLink.TeaPopupCoreLink(scope, element, attrs, "tooltip", 'tt', {});
			}
		};
	}
])

.directive('filterPopupPopup', function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			
		},
		templateUrl: 'templates/tea-filter-popup.html'
	};
})

.directive('filterPopup', ['teaPopupCoreLink',
	function(teaPopupCoreLink) {

		return {
			restrict: "A"
			,scope: true
			,link:function(scope, element, attrs){
				var link = new teaPopupCoreLink.TeaPopupCoreLink(scope, element, attrs, "filterPopup", 'ft', {trigger:'click', placement:'right'});
			}
		};
	}
]);