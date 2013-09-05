
function extend(object1, object2){
	for(var i in object2){
			console.info(i);
			object1[i]=object2[i];
	}
}

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
	Person.call(this,id);
}

Teacher.prototype = new Person("-1");
Teacher.prototype.constractor = Teacher;
Teacher.prototype.setMajor = function(major){
	this.major = major;
};
Teacher.prototype.getMajor = function(){
	return this.major;
};

function Developer(id){
	Person.call(this,id);
}

Developer.prototype = new Person("-1");
Developer.prototype.constractor = Developer;


var p1 = new Person("1");
var t1 = new Teacher("2");
var d1 = new Developer("3");
console.info(p1.getID());
console.info(t1.getID());
console.info(d1.getID());
extend(d1,t1);