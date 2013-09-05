
function Person(id){

	if(!id)
		throw "Without id, who I am?";
	this.getID = function(){
		if(id==-1){
			throw "You are not a human!";
			return;
		}
		return id;
	};
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

function Teacher(id){
	//Person.call(this,id);
}

Teacher.prototype = new Person("-1");
Teacher.prototype.constractor = Teacher;
Teacher.prototype.setMajor = function(major){
	this.major = major;
};
Teacher.prototype.getMajor = function(){
	return this.major;
};


var p1 = new Person("123456");
var t1 = new Teacher("11111");
console.info(p1.getID());
console.info(t1.getID());