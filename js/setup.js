var undo = [];
var rando = false;

var Player = function(question, questions){
	this.Name = "p310";
	this.Parents = "";
	this.Age = "";
	this["Senior Artisan"] = "";
	this.Home ="";
	this.Mentor = "";
	this["Fur Color"] = "Brown, Blonde, Gray, Black, Red";
	this.Rank = "";
	this.Cloak = "Choose a color";
	this.Enemy = "p310";
	this.Friend = "p310";
	// abilities
	this.Nature = 0;
	this.Will = 0;
	this.Health = 0;
	this.Resources = 0;
	this.Circles = 0;
	
	this.Belief = "Choose an ideal p42";
	this.Goal = "Leave blank (chosen each session after mission briefing p45)";
	this.Instinct = "Choose something you do a lot p47";
	this.Skills = {};
	this.Wises = {};
	this.Traits = {};
	this.Gear = "Choose 1 weapon and some simple items";
	
	this.info = [
		"Name",
		"Parents",
		"Age",
		"Senior Artisan",
		"Home",
		"Mentor",
		"Fur Color",
		"Friend",
		"Rank",
		"Enemy",
		"Cloak",
		"Belief",
		"Goal",
		"Instinct",
		"<hr />",
		"Nature",
		"Will",
		"Health",
		"Resources",
		"Circles",
		"Skills",
		"Wises",
		"Traits",
		"Gear"
	];
	
	this.question = question;
	this.questions = questions;
	
	// building questions
	this.saveForWinter = false;
	this.fearWeasels = false;
	this.wiseChoices = 0;
	this.answers = 0;
}
	
Player.init = function(){
	
	// for(var i = 0; i < 22; i++){
	// 	$("#q"+i).hide();
	// }
	// $("#q"+this.question).show();
	
	var m = new Player(0, $("li").get());
	undo = [];
	
	for(var i = 0; i < m.questions.length; i++){
		$(m.questions[i]).hide();
	}
	this.current = m;
	m.getQ().show();
}

Player.save = function(){
	var m = new Player(Player.current.question, Player.current.questions);
	m.copy(Player.current);
	undo.push(m);
}

Player.prototype.copy = function(source){
	for(var k in source){
		var item = source[k];
		if(typeof(item) === "object"){
			var obj = {};
			for(var key in item){
				obj[key] = item[key];
			}
			this[k] = obj;
		} else {
			this[k] = item;
		}
	}
}
	
Player.prototype.getQ = function(){
	return $(this.questions[this.question]);
}
	
Player.prototype.render = function(target){
	var str = "";
	// str += this.header(this.Name);
	for(var n in this.info){
		var k = this.info[n];
		if(k == "<hr />") str += "<hr />";
		else str += this.addCharInfo(k);
	}
	$("#result").html(str);
};
	
Player.prototype.addCharInfo = function(name){
	if(typeof this[name] === "string"){
		return this.item(name)+this[name]+"<br />";
	} else if(typeof this[name] === "number"){
		return this.item(name)+this[name]+"<br />";
	} else {
		var str = this.item(name);
		str += "<p>";
		// console.log(name);
		// console.log(this[name]);
		if(name == "Wises"){
			str += this.suffixList(this[name], "-wise");
		} else {
			str += this.valueList(this[name]);
		}
		return str + "<p/>"
	}
}
	
Player.prototype.printChar = function(){
	$("#questions").toggle();
	// dodging around shitty mobile preview updates
	setTimeout(function(){
		// some browsers can't print
		try {
			window.print();
			setTimeout(function(){
				$("#questions").toggle();
			}, 1000);
		} catch(e){
			alert(e.message);
			$("#questions").toggle();
		}
	}, 100);
}

Player.prototype.header = function(str){
	return "<h2>"+str+"</h2>";
}
	
Player.prototype.item = function(str){
	return "<b>"+str+":</b> ";
}
	
Player.prototype.answerList = function(list, suffix, omit, newline){
	var str = "";
	var answers = 0;
	for(var i = 0; i < list.length; i++){
		
		if(omit && omit[list[i]]) continue;
		
		var item = "<a href='javascript:Player.current.selectAnswer("+i+");'>"+list[i]+(suffix ? suffix : "")+"</a>";
		str += item;
		if(i < list.length - 1) str += ", "+(newline ? "<br />" : "");
		answers++;
	}
	this.answers = answers;
	return str;
}
	
Player.prototype.valueList = function(obj, suffix){
	var str = "";
	var list = [];
	for(var k in obj){
		list.push(k+": "+obj[k]);
	}
	for(var i = 0; i < list.length; i++){
		str += list[i] + (suffix ? suffix : "");
		if(i < list.length - 1) str += ", ";
	}
	return str;
}
	
Player.prototype.suffixList = function(obj, suffix){
	var str = "";
	var list = [];
	for(var k in obj){
		list.push(k+suffix);
	}
	for(var i = 0; i < list.length; i++){
		str += list[i];
		if(i < list.length - 1) str += ", ";
	}
	return str;
}
	
Player.prototype.keyArray = function(obj){
	var list = [];
	for(var k in obj){
		list.push(k);
	}
	return list;
}
	
Player.prototype.bumpSkill = function(name){
	if(this.Skills[name]){
		this.Skills[name]++;
	} else {
		this.Skills[name] = 2;
	}
}
	
Player.prototype.bumpTrait = function(name){
	if(this.Traits[name]){
		this.Traits[name]++;
	} else {
		this.Traits[name] = 1;
	}
}
	
Player.prototype.addWise = function(name){
	this.Wises[name] = true;
}

Player.prototype.stepBack = function(){
	this.getQ().hide();
	Player.current = undo.pop();
	var c = Player.current;
	c.question--;
	if(c.question == -1){
		c.question = 0;
		c.getQ().show();
	} else {
		Player.current.nextQuestion();
	}
	Player.current.render();
}

Player.prototype.startOver = function(){
	while(Player.current.question > 0){
		Player.current.stepBack();
	}
}

Player.prototype.randomise = function(){
	rando = true;
	this.nextQuestion();
	rando = false;
}
	
Player.prototype.nextQuestion = function(){
	this.getQ().hide();
	this.question++;
	
	var str = "";
	var list;
	var answer = -1;
	var skip = false;
	//
	// SORRY ABOUT THE MAGIC NUMBERS
	//
	switch(this.question){
		case 1: // Rank
			str = this.answerList(ranks, undefined, undefined, true);
			
			break;
		case 2: // Home
			str = this.answerList(this.keyArray(homes));
			for(var k in homes){
				var ref = " ("+homes[k].Book+" p"+homes[k].Page+")"
				str += "<p><b>"+k+ref+"<br /></b> Skills: "+homes[k].Skills.join(", ")+"<br />Traits: "+homes[k].Traits.join(", ")+"</p>";
			}
			break;
		case 3: // Home Skill
			list = homes[this.Home].Skills;
			str = this.answerList(list);
			break;
		case 4: // Home Trait
			list = homes[this.Home].Traits;
			str = this.answerList(list);
			if(list.length == 1) answer = 0;
			break;
		case 5: // Natural Talent
			str = this.answerList(skills);
			break;
		case 6: // Parent's Trade
			str = this.answerList(parentSkills);
			break;
		case 7: // Convince People
			str = this.answerList(conviceSkills);
			break;
		case 8: // Senior Artisan
			str = this.answerList(seniorArtisanSkills);
			break;
		case 9: // Mentor
			str = this.answerList(mentorSkills);
			break;
		case 10: // Speciality
			if(this.Rank == "Tenderpaw"){
				skip = true;
			} else {
				str = this.answerList(mentorSkills);
			}
			break;
		case 11: // Nature
			str = this.answerList(yesNo)
			break;
		case 12:
			if(this.saveForWinter){
				skip = true;
			} else {
				str = this.answerList(generousTraits);
			}
			break;
		case 13: // Nature
			str = this.answerList(yesNo)
			break;
		case 14: // Nature
			str = this.answerList(yesNo)
			break;
		case 15: // Nature
			if(this.fearWeasels){
				skip = true;
			} else {
				str = this.answerList(braveTraits);
			}
			break;
		case 16: // Tenderpaw or Guard Captain
			if(this.Rank == "Tenderpaw"){
				str = this.answerList(tenderpawWises, "-wise");
			} else if(this.Rank == "Guard Captain"){
				str = this.answerList(guardCaptainWises, "-wise");
			} else {
				skip = true;
			}
			break;
		case 17: // Wises
			if(this.wiseChoices == 0){
				skip = true;
				break;
			}
			if(this.wiseChoices > 1){
				str = "Choices remaining: "+this.wiseChoices+"<br /><br />";
			} else {
				str = "";
			}
			str += this.answerList(wises, "-wise", this.Wises);
			break;
		case 18: // Traits
			str += this.answerList(traits);
			break;
		case 19: // Tenderpaw Traits
			if(this.Rank == "Tenderpaw"){
				str += this.answerList(tenderpawTraits);
			} else {
				skip = true;
			}
			break;
		case 20: // Guard Captain Traits
			if(this.Rank == "Guard Captain"){
				str += this.answerList(guardCaptainTraits);
			} else {
				skip = true;
			}
			break;
		case 21:
			this.getQ().show();
			return;
		
	}
	var q = this.getQ();
	str += "<br /><br /><a href='javascript:Player.current.stepBack();'>Back</a>";
	if(this.question > 1) str += "<br /><br /><a href='javascript:Player.current.startOver();'>Start Over</a>";
	q.children("p").html(str);
	q.show();
	if(answer > -1){
		this.selectAnswer(answer, true);
	} else if(skip){
		this.nextQuestion();
	} else if(rando){
		if(this.question < 21){
			// rank needs weighting
			var c = Math.floor(Math.random() * this.answers);
			if(this.question == 1){
				var r = Math.random();
				if(r < 0.15){
					c = 0; // Tenderpaw
				} else if(r < 0.5){
					c = 1; // Guardmouse
				} else if(r < 0.8){
					c = 2; // Patrol Guard
				} else if(r < 0.95){
					c = 3; // Patrol Leader
				} else {
					c = 4; // Guard Captain
				}
			}
			this.selectAnswer(c);
		}
	}
}
	
Player.prototype.selectAnswer = function(n, auto){
	if(!auto) Player.save();
	var list;
	switch(this.question){
		case 1: // Rank
			this.Rank = ranks[n];
			this.Nature = 3;
			switch(n){
				case 0: // Tenderpaw
					this.Age = "14-17";
					this.Cloak = "None";
					this.Will = 3;
					this.Health = 6;
					this.Skills = {
						Pathfinder:2,
						Scout: 2,
						Laborer: 2
					};
					this.Circles = 1;
					this.Resources = 1;
					break;
				case 1: // Guardmouse
					this.Age = "18-25";
					this.Will = 3;
					this.Health = 5;
					this.Skills = {
						Fighter: 3,
						Haggler: 2,
						Pathfinder:3,
						Scout: 2,
						Survivalist: 2
					};
					this.wiseChoices = 1;
					this.Circles = 2;
					this.Resources = 2;
					break;
				case 2: // Patrol Guard
					this.Age = "21-50";
					this.Will = 4;
					this.Health = 4;
					this.Skills = {
						Cook: 2,
						Fighter: 3,
						Hunter: 3,
						Scout: 2,
						Healer: 2,
						Pathfinder:2,
						Survivalist: 2,
						"Weather Watcher": 2
					};
					this.wiseChoices = 2;
					this.Circles = 3;
					this.Resources = 3;
					break;
				case 3: // Patrol Leader
					this.Age = "21-60";
					this.Will = 5;
					this.Health = 4;
					this.Skills = {
						Fighter: 3,
						Hunter: 3,
						Instructor: 2,
						Loremouse: 2,
						Persuader: 2,
						Pathfinder:2,
						Scout: 2,
						Survivalist: 3,
						"Weather Watcher": 2
					};
					this.wiseChoices = 3;
					this.Circles = 3;
					this.Resources = 4;
					break;
				case 4: // Guard Captain
					this.Age = "41-60";
					this.Will = 6;
					this.Health = 3;
					this.Skills = {
						Administrator: 3,
						Fighter: 3,
						Healer: 2,
						Hunter: 3,
						Instructor: 2,
						Militarist: 3,
						Orator: 2,
						Pathfinder: 3,
						Scout: 3,
						Survivalist: 3,
						"Weather Watcher": 3
					};
					this.wiseChoices = 3;
					this.Circles = 4;
					this.Resources = 5;
					break;
			}
			break;
		case 2: // Home
			this.Home = this.keyArray(homes)[n];
			break;
		case 3: // Home Skill
			this.bumpSkill(homes[this.Home].Skills[n]);
			break;
		case 4: // Home Traits
			this.bumpTrait(homes[this.Home].Traits[n]);
			break;
		case 5: // Natural Talent
			this.bumpSkill(skills[n]);
			break;
		case 6: // Parent's Trade
			this.Parents = "p310 ("+parentSkills[n]+")";
			this.bumpSkill(parentSkills[n]);
			break;
		case 7: // Convince People
			this.bumpSkill(conviceSkills[n]);
			break;
		case 8: // Senior Artisan
			this["Senior Artisan"] = "p310 ("+seniorArtisanSkills[n]+")";
			this.bumpSkill(seniorArtisanSkills[n]);
			break;
		case 9: // Mentor
			this.Mentor = "p310 ("+mentorSkills[n]+")";
			this.bumpSkill(mentorSkills[n]);
			break;
		case 10: // Speciality
			this.bumpSkill(mentorSkills[n]);
			break;
		case 11: // Nature
			if(n == 0){
				this.Nature++;
				this.saveForWinter = true;
			}
			break;
		case 12: // Nature
			this.bumpTrait(generousTraits[n]);
			break;
		case 13: // Nature
			if(n == 1){
				this.Nature++;
				if(this.Skills.Fighter){
					this.Skills.Fighter--;
				}
			}
			break;
		case 14: // Nature
			if(n == 0){
				this.Nature++;
				this.fearWeasels = true;
			}
			break;
		case 15: // Nature
			this.bumpTrait(braveTraits[n]);
			break;
		case 16: // Tenderpaw or Guard Captain
			if(this.Rank == "Tenderpaw"){
				this.addWise(tenderpawWises[n]);
			} else if(this.Rank == "Guard Captain"){
				this.addWise(guardCaptainWises[n]);
			}
			break;
		case 17: // Wises
			this.addWise(wises[n]);
			this.wiseChoices--;
			if(this.wiseChoices > 0) this.question--;
			break;
		case 18: // Traits
			this.bumpTrait(traits[n]);
			break;
		case 19: // Tenderpaw Traits
			this.bumpTrait(tenderpawTraits[n]);
			break;
		case 20: // Guard Captain Traits
			this.bumpTrait(guardCaptainTraits[n]);
			break;
		break;
	}
	this.nextQuestion();
	this.render();
}

var ranks = ["Tenderpaw", "Guardmouse", "Patrol Guard", "Patrol Leader", "Guard Captain"];
var homes = {
	"Barkstone":{
		Book:"MG2e",
		Page:170,
		Skills:["Carpenter", "Potter", "Glazier"],
		Traits:["Steady Paw"]
	},
	"Copperwood":{
		Book:"MG2e",
		Page:170,
		Skills:["Smith", "Haggler"],
		Traits:["Independent"]
	},
	"Elmoss":{
		Book:"MG2e",
		Page:172,
		Skills:["Carpenter", "Harvester"],
		Traits:["Alert"]
	},
	"Flintrust":{
		Book:"NRNM",
		Page:8,
		Skills:["Smith", "Laborer"],
		Traits:["Bold", "Determined"]
	},
	"Grasslake":{
		Book:"NRNM",
		Page:10,
		Skills:["Insectrist", "Militarist"],
		Traits:["Nimble", "Defender"]
	},
	"Ivydale":{
		Book:"MG2e",
		Page:173,
		Skills:["Harvester", "Baker"],
		Traits:["Hard Worker"]
	},
	"Lockhaven":{
		Book:"MG2e",
		Page:174,
		Skills:["Weaver", "Armorer"],
		Traits:["Generous", "Guard's Honor"]
	},
	"Port Sumac":{
		Book:"MG2e",
		Page:175,
		Skills:["Boatcrafter", "Weather Watcher"],
		Traits:["Tough", "Weather Sense"]
	},
	"Sandmason":{
		Book:"NRNM",
		Page:9,
		Skills:["Weather Watcher", "Glazier"],
		Traits:["Nocturnal", "Quiet"]
	},
	"Shaleburrow":{
		Book:"MG2e",
		Page:176,
		Skills:["Mason", "Harvester", "Miller"],
		Traits:["Open-Minded"]
	},
	"Sprucetuck":{
		Book:"MG2e",
		Page:177,
		Skills:["Scientist", "Loremouse"],
		Traits:["Inquisitive", "Rational"]
	}
};
var skills = [
	"Administrator", "Apiarist", "Archivist", "Armorer", "Baker",
	"Boatcrafter", "Brewer", "Carpenter", "Cartographer", "Cook",
	"Manipulator", "Fighter", "Glazier", "Haggler", "Harvester",
	"Healer", "Hunter", "Insectrist", "Instructor", "Laborer",
	"Loremouse", "Militarist", "Miller", "Orator", "Pathfinder",
	"Persuader", "Potter", "Scientist", "Scout", "Smith",
	"Stonemason", "Survivalist", "Weather Watcher", "Weaver"
];
var parentSkills = [
	"Apiarist", "Archivist", "Armorer", "Baker",
	"Boatcrafter", "Brewer", "Carpenter", "Cartographer",
	"Glazier", "Harvester",
	"Insectrist",
	"Miller",
	"Potter", "Smith",
	"Stonemason", "Weaver"
];
var conviceSkills = [
	"Manipulator", "Orator", "Persuader"
];
var seniorArtisanSkills = [
	"Apiarist", "Archivist", "Armorer", "Baker",
	"Brewer", "Carpenter", "Cartographer", "Cook",
	"Glazier", "Harvester",
	"Healer", "Insectrist", "Laborer",
	"Miller", "Potter", "Smith",
	"Stonemason", "Weaver"
];
var mentorSkills = [ // also speciality
	"Fighter",
	"Healer", "Hunter", "Instructor", "Pathfinder",
	"Scout", "Survivalist", "Weather Watcher"
];
var yesNo = ["Yes", "No"];
var generousTraits = ["Bold", "Generous", "Impetuous"];
var braveTraits = ["Fearless", "Brave", "Foolish"];
var tenderpawWises = ["Code of the Guard", "Legends of the Guard"];
var guardCaptainWises = ["Lockhaven", "Matriarch"];
var wises = [
	"Apiary", "Armor", "Autumn storm", "Badger", "Barkstone", "Bird",
	"Blizzard", "Bramble", "Brush fire", "Burrow", "Celebrations", "Clear and warm weather",
	"Coast", "Cold rain", "Cold snap", "Copperwood", "Coyote", "Craft",
	"Crime", "Darkheather", "Deer", "Drought", "Elmoss", "Epidemic",
	"Escort", "Famine", "Flash flood", "Forest fire", "Forest", "Fox",
	"Freezing", "Frog", "Governor", "Grain", "Guard captain", "Guardmouse",
	"Harvest", "Hawk", "Heat wave", "Herb", "Hidey hole", "Ice storm",
	"Ice", "Lake", "Leaf cover", "Lockhaven", "Mail", "Medicine",
	"Moose", "Moss", "Mouse Guard", "Mud", "Night", "Nut",
	"Open ground", "Owl", "Path", "Patrol guard", "Patrol leader", "Planting",
	"Poison", "Pond", "Predator", "Raccoon", "Rain", "Raven",
	"Rebellion", "Recipe", "Road", "Rocky terrain", "Scent Border", "Shaleburrow",
	"Shield", "Shore", "Shortages", "Snake", "Snow", "Sprucetuck",
	"Squirrel", "Star", "Stream", "Swamps", "Tall grass", "Tenderpaw",
	"Thorn", "Thunderstorm", "Tide", "Tradesmouse", "Trail", "Transport",
	"Trap", "Tunnel", "Turtle", "Unseasonably cold", "Unseasonably warm",
	"War", "Weasel", "Widget", "Wild country", "Wild mouse", "Wolf"
];
var traits = [
	"Bigpaw", "Bitter", "Bodyguard", "Bold", "Brave",
	"Calm", "Clever", "Compassionate", "Cunning", "Curious",
	"Deep Ear", "Defender", "Determined", "Driven", "Early Riser",
	"Extrovert", "Fat", "Fearful", "Fearless", "Fiery",
	"Generous", "Graceful", "Guard’s Honor", "Innocent", "Jaded",
	"Leader", "Longtail", "Lost", "Natural Bearings", "Nimble",
	"Nocturnal", "Oldfur", "Quick-Witted", "Quiet", "Scarred",
	"Sharp-Eyed", "Sharptooth", "Short", "Skeptical", "Skinny",
	"Stoic", "Stubborn", "Suspicious", "Tall", "Thoughtful",
	"Tough", "Weather Sense", "Wise", "Wolf’s Snout", "Young"
];
var tenderpawTraits = [
	"Bigpaw", "Brave",
	"Calm", "Clever", "Compassionate", "Curious",
	"Deep Ear", "Defender", "Determined", "Driven", "Early Riser",
	"Extrovert", "Fearful", "Fearless", "Fiery",
	"Generous", "Graceful",
	"Longtail", "Lost", "Natural Bearings", "Nimble",
	"Quick-Witted", "Quiet", "Scarred",
	"Sharptooth", "Short", "Skeptical", "Skinny",
	"Stubborn", "Suspicious", "Tall",
	"Tough", "Wolf’s Snout"
];
var guardCaptainTraits = [
	"Bitter", "Bodyguard", "Brave",
	"Calm", "Clever", "Compassionate", "Cunning", "Curious",
	"Defender", "Driven", "Early Riser",
	"Fearful", "Fearless",
	"Jaded",
	"Leader", "Natural Bearings",
	"Nocturnal", "Oldfur", "Quiet", "Scarred",
	"Sharp-Eyed", "Skeptical", "Skinny",
	"Stoic", "Thoughtful",
	"Tough", "Weather Sense", "Wise"
];
