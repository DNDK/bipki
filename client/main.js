var bipkaEffects = {
	"time_slow":
	{ 
		"func": ()=>{
			intervalImmutable = true;
			spawnIntervalMiliseconds = 2000;
			setTimeout(()=>{
				spawnIntervalMiliseconds = 1000;
				intervalImmutable = false;

			}, 8000)
		},
		"icon": "PICS/timer.png"
	},
	"large_bipkas": 
	{
		"func": ()=>{
			img_width = "100px";
			setTimeout(()=>{img_width = "50px"}, 6000);
		},
		"icon": "PICS/big.png"
	},
	"pop_bipkis": {
		"func":()=>{
			score+=30;
			for(let i = 0; i<3; i++){
				bipkis.pop();
			}
		},
		"icon": "PICS/pop.png"
	},
	
	"regular_bipka": {
		"func": ()=>{
			score+=10;
		},
		"icon": "PICS/regular.png"
	}
};

class Bipka{
	constructor(id, pos, effect, icon){
		this.id = id;
		this.pos = pos;
		this.effect = effect;
		this.icon = icon;
	}

}

var score = 0;
var intervalImmutable = false;
let spawnIntervalMiliseconds = 1000;
var spawnInterval;

var bipkis = [];
let counter = 0;

var img_width = "50px";

//draw the game field
function render(){
	document.getElementById("game").innerHTML = "";
	bipkis.map(i => {
		document.getElementById("game").innerHTML += `<div class = "bipka" style = "top: ${i.pos.y}px; left: ${i.pos.x}px;" onclick = "claimBipka(${i.id})" id = "${i.id}"><img src = "${i.icon}" width = ${img_width}></div>`;
	})
	document.getElementById("score").innerText = score;
}
function deleteBipka(id){
	let bp = bipkis.find((bipka) => bipka.id === id);
	bipkis.splice(bipkis.indexOf(bp), 1);

}

var probability = function(n) {
     return !!n && Math.random() <= n;
};

function spawnBipka(){
	//coordinates
	let height = document.getElementById("game").clientHeight-50;
	let width = document.getElementById("game").clientWidth-50;
	let rect = document.getElementById("game").getBoundingClientRect();
	
	let rnd_num = Math.floor(Math.random()*3);
	let effects = Object.keys(bipkaEffects);
	let effect_num = probability(0.8) ? 3 : rnd_num;
	let bipka = new Bipka(counter, {x: Math.floor(rect.x+Math.random()*width), y: Math.floor(rect.y+Math.random()*height)}, bipkaEffects[effects[effect_num]]["func"], bipkaEffects[effects[effect_num]]["icon"]);
	counter++;//bipka id
	bipkis.push(bipka);
	spawnIntervalMiliseconds -= intervalImmutable || spawnIntervalMiliseconds==500 ? 0 : 5;//make bipkas gradually spawn faster
	if(bipkis.length < 30){
		setTimeout(spawnBipka, spawnIntervalMiliseconds);
		render();
	}else{
		gameOver();
	}
}

function claimBipka(id){
	let bipka = bipkis.find(bp => bp.id === id);
	bipka.effect();
	deleteBipka(id);
	render();
	
}
//end the game and send the reults to the server
function gameOver(){
	console.log(1);
	clearTimeout(spawnInterval);
	game.innerHTML = "<h1>Game Over</h1>";
	fetch("/users/sethi", {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({
			highscore: score
		})
	}).then(res=>res.json()).then(res=>{
		console.log(res);
	})
}

window.onload = () => {
	spawnInterval = setTimeout(spawnBipka, spawnIntervalMiliseconds);
	$.ajax({
		method: "GET",
		url: "/users/list"
	}).done((data) => {
		data.users.map(i=>{
			let el = document.createElement("li");
			el.innerHTML = `<b>${i.username}</b> - ${i.highscore}`;
			document.getElementById("scorelist").appendChild(el);
		});
		document.getElementById("uname").innerText = data.curr
	})
}
