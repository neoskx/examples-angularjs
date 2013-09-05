var myApp = angular.module('myApp', ['tea.ui.core', 'tea.ui.element']);

function MyCtrl($scope, element){
	$scope.text= "Template";
	elm = new element.Element("2.0.0");
	console.info(element);
}

function uiCore(){
	this.version = '1.0.0';

	this.getVersion = function(){
		return this.version;
	}

	this.setVersion = function(v){
		console.info("uiCore setVersion");
		this.v = v;
	}
}

uiCore.prototype.version = "2.0.0";

uiCore.prototype.setVersion = function(v){
	console.info("uiCore.prototype setVersion");
	this.version = v+' prototype';
}


function button(){
	this.text = 'defaultText';

	this.getText = function(){
		return this.text;
	}

	this.setText = function(t){
		this.text = t;
	}
}

button.prototype = new uiCore();

button.prototype.click = function(){
	alert(this.text);
}

// button.prototype.setVersion = function(v){
// 	console.info("button.prototype.setVersion");
// 	this.version = v + 'prototype';
// }

var core = new uiCore();
var btn = new button();