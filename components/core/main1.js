function Person(){

}

Person.prototype.getName = function(){
	return this.name ?this.name.toUpperCase():"Please set name first!";
};

Person.prototype.setName = function(name){
	var rg = /\d/;
	if(name.search(rg)!=-1){
		console.error("Name should't have number!");
		return;
	}

	this.name = name;
};

Person.prototype.saySomeThing = function(word){
	console.info(word);
};

function Teacher(){

}

Teacher.prototype = new Person();
Teacher.prototype.constructor = Teacher;
Teacher.prototype.setMajor = function(major){
	this.major = major;
};
Teacher.prototype.getMajor = function(){
	return this.major;
};


var p = new Person();
p.setName("Blithe Xu 12");
console.info(p.getName());

var t = new Teacher();
t.setName("Kevin");
console.info(t.getName());
t.setMajor("Math");
console.info(t.getMajor());

