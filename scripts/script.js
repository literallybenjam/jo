/* To Do:
Visual:
~	Textures
	-	Bridge textures, esp. Bridge wall
≈	More characters
~	Finish map
	=	Castle
		Boat
-	Attacking animations
~	Particles (Ducks! Fishes!)
-	Flowers?!
	3DS Virtual Console-esque "View at original size with cool graphic"
-	Title Screen (with instructions!)
-	Piy - "Tao says the craziest things, sometimes…" Tao - "Piy thinks that some of my ideas sound crazy…" "…but usually, I'm right."
-	<img> Inventory?

Mechanical:
=	Enemy support
=	$$$ / Drops
-	Butterfly-based luck (More butterflies -> better chance of drops? Or more drops? Or better stats?)
	Touch screen UI (title.addEventListener('touchstart', initTouchInterface, false);)
	Local spritesheet support
	Save/Load
	In-game manual (as an overlay)
?	Secondary Inventory screen (story-specific/outfits)? A/S to switch btwn?
?	Q-menu W-Fullscreen
?	Particle constructors and prototype Particle.step
=	Ensure proper rounding at the ends of characterArray[n].path
*/

var next = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame;

var overworld = document.getElementById("overworld");
var HUD = document.getElementById("HUD");
var darken = document.getElementById("darken");
var dialogue = document.getElementById("dialogue");
var portraits = document.getElementById("portraits");
var speech = document.getElementById("speech");
var inventory = document.getElementById("inventory");
var items = document.getElementById("items");
var map = document.getElementById("map");
var menu = document.getElementById("menu");
var video = document.getElementById("video");
var context = overworld.getContext("2d");

var k = {
	16:"Sft", 37:"Lf", 38:"Up", 39:"Rt", 40:"Dn", 88:"X", 90:"Z",
	Sft:false, Lf:false, Up:false, Rt:false, Dn:false, X:false, Z:false,
    dn: function(e)	{
		if (document.getElementById("preGame").getAttribute("style") === "display: inline;") null;
		else if (e.keyCode === 83 && menu.dataset.state === "out") {
			if (inventory.dataset.state === "out") inventory.dataset.state = "in";
			else inventory.dataset.state = "out";
		}
		else if (e.keyCode === 65) {
			if (menu.dataset.state === "out") menu.dataset.state = "in";
			else menu.dataset.state = "out";
		}
		else if (e.keyCode === 70) {
			if (document.getElementById("gameWindow").fullscreenElement || document.getElementById("gameWindow").mozFullScreenElement || document.getElementById("gameWindow").webkitFullscreenElement) {
				if (document.cancelFullscreen) {
					document.cancelFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.webkitCancelFullscreen) {
					document.webkitCancelFullscreen();
				}
			}
			else {
				if (document.body.requestFullscreen) {
					document.body.requestFullscreen();
				} else if (document.body.mozRequestFullScreen) {
					document.body.mozRequestFullScreen();
				} else if (document.body.webkitRequestFullscreen) {
					document.body.webkitRequestFullscreen();
				}
			}
		}
		else if (k[e.keyCode]) k[k[e.keyCode]] = true;
	},
    up: function(e) {
		if (k[e.keyCode]) k[k[e.keyCode]] = false;
	},
	x: function(e) {
		var r = k.X;
		k.X = false;
		return r;
	},
	z: function(e) {
		var r = k.Z;
		k.Z = false;
		return r;
	}
}

var speechSequence = {
	pos: 0,
	run: [
		function () {
			say(characterArray[3],"<p>Hey, "+characterArray[0].u+"! Get up already! Today's your big day!</p>");
		},
		function () {
			say(characterArray[3], "<p>It's the day of the elections for Village Representative, remember?</p>");
		},
		function () {
			say(characterArray[3], "<p>You'll have to be in top form if you want to get elected!</p>");
		},
		function () {
			if (characterArray[3].coords[1] > 7) {
				characterArray[3].path = false;
				characterArray[3].pathPos = 0;
				characterArray[3].gCoords = [1,13];
				characterArray[3].coords = [3.5,7.5];
				generateCharacterList([12,0]);
				generateCharacterList([1,13]);
				speechSequence.pos++;
			}
			else if(!characterArray[3].path) characterArray[3].path = [[8,5.5],[8,7.5]];
		}
	],
	pause: false
}

var title = {
	"boomerang": "Boomerang",
	"token": "Village Token"
}

var walkMap = new Array();

var localCharacterList = new Array;

function s(n) {
	var r;
	if (n >= 0) r = 1;
	else r = -1;
	return r;
}

function generateWalkMap(m,n) {
	var tmap = new Array();
	var t;
	var s;
	var c;
	for (var i=0; i<10; i++) {
		for (var j=0; j<16; j++) {
			t=tileMap[m][n][i*16+j];
			s=structureMap[m][n][i*16+j];
			if (t === 0x12 || t === 0x14 || t === 0x1C || t === 0x1D || t === 0x1E || t === 0x1F || t === 0x20 || t === 0x51 || (t>0x52 && t<0x57) || (s>0x02 && s<0x11 && s !== 0x0C) || (s>0x20 && s<0x2F && s !== 0x27 && s !== 0x2C) || (s>0x31 && s !== 0x34 && s !== 0x35 && s<0x40) || (s>0x44 && s !== 0x49 && s !== 0x4E && s !== 0x50)) {
				tmap[tmap.length] = 0;
				tmap[tmap.length] = 0;
			}
			else if (t === 0x10 || t === 0x16 || t === 0x18) {
				tmap[tmap.length] = 0;
				tmap[tmap.length] = 1;
			}
			else if (t === 0x11 || t === 0x17 || t === 0x19) {
				tmap[tmap.length] = 1;
				tmap[tmap.length] = 0;
			}
			else {
				tmap[tmap.length] = 1;
				tmap[tmap.length] = 1;
			}
		}
		for (var j=0; j<16; j++) {
			t=tileMap[m][n][i*16+j];
			s=structureMap[m][n][i*16+j];
			if (t === 0x13 || t === 0x16 || t === 0x17 || t === 0x1C || t === 0x1D || t === 0x1E || t === 0x1F || t === 0x20 || t === 0x52 || (s>0x00 && s<0x11) || (s > 0x1F && s < 0x2F && s !== 0x27) || (s>0x31 && s !== 0x34 && s !== 0x35 && s!== 0x43 && s!== 0x44 && s !== 0x48 && s !== 0x4D)) {
				tmap[tmap.length] = 0;
				tmap[tmap.length] = 0;
			}
			else if (t === 0x10 || t === 0x14 || t === 0x1A || s === 0x31 || s === 0x35 || s === 0x43) {
				tmap[tmap.length] = 0;
				tmap[tmap.length] = 1;
			}
			else if (t === 0x11 || t === 0x15 || t === 0x1B || s === 0x30 || s === 0x34 || s === 0x44) {
				tmap[tmap.length] = 1;
				tmap[tmap.length] = 0;
			}
			else {
				tmap[tmap.length] = 1;
				tmap[tmap.length] = 1;
			}
		}
	}
	return tmap;
}

function insideNPC(c,g) {
	var r = null;
	for (var i=0; i<localCharacterList[g[0]][g[1]].length; i++) {
		if (c[0] <= characterArray[localCharacterList[g[0]][g[1]][i]].coords[0]+.375 && c[0] >= characterArray[localCharacterList[g[0]][g[1]][i]].coords[0]-.375 && c[1] <= characterArray[localCharacterList[g[0]][g[1]][i]].coords[1]+.4375 && c[1] >= characterArray[localCharacterList[g[0]][g[1]][i]].coords[1]-.4375) r = i;
	}
	if (r !== null) r = localCharacterList[g[0]][g[1]][r];
	return r;
}

function walkable(i,c,g) {
	var r = 1;
	var p = null;
	if (!g) g = [characterArray[0].gCoords[0], characterArray[0].gCoords[1]];
	for (var m=-1; m<2; m++) {
		for (var n=-1; n<2; n++) {
			if (i !== null) p = insideNPC([c[0] + m*.375, c[1] + n*.4375], g);
			if (p !== null && p !== i || !walkMap[g[0]][g[1]][Math.floor(2*(c[0]+m*.375)) + Math.floor(2*(c[1]+n*.4375))*32]) r = 0;
		}
	}
	return r;
}

function moveCharacter(n,dx,dy) {
	if (!walkable(n, [characterArray[n].coords[0]+dx/16, characterArray[n].coords[1]+dy/16], characterArray[n].gCoords)) {
		if (!walkable(n, [characterArray[n].coords[0]+dx/16, characterArray[n].coords[1]], characterArray[n].gCoords)) dx = 0;
		if (!walkable(n, [characterArray[n].coords[0], characterArray[n].coords[1]+dy/16], characterArray[n].gCoords) || dx) dy = 0;
	}
	characterArray[n].coords[0] += dx/16;
	characterArray[n].coords[1] += dy/16;
	if ((!dx && !dy)) characterArray[n].timer = 0;
	else {
		characterArray[n].dir = direction(dx,dy);
		if (characterArray[n].delay) {
			characterArray[n].timer++;
			if (characterArray[n].timer >= characterArray[n].delay) {
				characterArray[n].anim++;
				characterArray[n].anim %= characterSprite[characterArray[n].sprite][characterArray[n].dir].length;
				characterArray[n].timer = 0;
			}
		}
	}
}

function followPath(n) {
	var dx = characterArray[n].path[characterArray[n].pathPos][0] - characterArray[n].coords[0];
	var dy = characterArray[n].path[characterArray[n].pathPos][1] - characterArray[n].coords[1];
	var m = Math.sqrt(dx*dx + dy*dy);
	if (m*16 > 1) {
		dx /= m;
		dy /= m;
	}
	else {
		if(walkable(n, [characterArray[n].path[characterArray[n].pathPos][0], characterArray[n].path[characterArray[n].pathPos][1]], characterArray[n].gCoords)) {
			characterArray[n].pathPos++;
			characterArray[n].pathPos %= characterArray[n].path.length;
			characterArray[n].dir = direction(dx,dy);
			if (characterArray[n].delay) {
				characterArray[n].timer++;
				if (characterArray[n].timer >= characterArray[n].delay) {
					characterArray[n].anim++;
					characterArray[n].anim %= characterSprite[characterArray[n].sprite][characterArray[n].dir].length;
					characterArray[n].timer = 0;
				}
			}
		}
	}
	moveCharacter(n,dx,dy);
}

function direction(dx,dy) {
	var mx = Math.abs(dx);
	var my = Math.abs(dy);
	var r;
	if (mx > my && dx < 0) r = "left";
	else if (mx > my && dx > 0) r = "right";
	else if (mx <= my && dy < 0) r = "up";
	else if (mx <= my && dy > 0 || (!dx && !dy)) r = "down";
	return r;
}

function say(c,t,p) {
	var dx = 0;
	var dy = 0;
	if (c.coords[0] > 8) {
		dialogue.dataset.h = "left";
		dx = 25;
	}
	else dialogue.dataset.h = "right";
	if (c.coords[1] > 5) {
		dialogue.dataset.v = "up";
		dy = 10;
	}
	else dialogue.dataset.v = "down";
	dialogue.setAttribute("style", "left: "+(c.coords[0]*5-dx)+"rem; top: "+(c.coords[1]*5-dy)+"rem;");
	speech.innerHTML = t;
	if(p || (p === undefined && k.z()) && !speechSequence.pause) speechSequence.pause = 30;
	dialogue.dataset.state = "in";
}

/* Particle attributes:
	type = Type of particle;
	anim = Animation;
	timer = Animation timer;
	dir = Direction of sprite and/or motion (string or vector)
	coords = Particle coordinates;
	sprite = Sprite index;
	d = Amount to adjust health on collision
*/

var particle;

function generateParticles() {
	particle = new Array();
	var pCoords;
	for (var i=0; i<640; i++) {
		pCoords = [(i%32)/2,Math.floor(i/32)/2];
		if ((Math.random()<.0625 && structureMap[characterArray[0].gCoords[0]][characterArray[0].gCoords[1]][Math.floor(pCoords[0]) + Math.floor(pCoords[1]) * 16] === 0x0D) || (tileMap[characterArray[0].gCoords[0]][characterArray[0].gCoords[1]][Math.floor(pCoords[0]) + Math.floor(pCoords[1]) * 16] === 0x01 && Math.random()<.00390625 && walkable(null, pCoords))) {
			particle[particle.length] = {
				type: "butterfly",
				anim: Math.floor(Math.random()*2),
				timer: Math.floor(Math.random()*8),
				coords: pCoords,
				dir: [Math.random()*2-1,Math.random()*2-1],
				sprite: "butterfly"
			}
		}
	}
}

function particleStep(n) {
	switch (particle[n].type) {
		case "boomerang":
			if (!walkable(0, [particle[n].coords[0] += particle[n].dir[0]/16, particle[n].coords[1] += particle[n].dir[1]/16]) || particle[n].coords[0] > 16.5 || particle[n].coords[0] < -0.5 || particle[n].coords[1] > 10.5 || particle[n].coords[1] < -0.5) particle.splice(n,1);
			else {
				particle[n].timer++;
				if (particle[n].timer >= 5) {
					particle[n].timer = 0;
					particle[n].anim++;
					particle[n].anim %= 2;
				}
			}
			break;

		case "butterfly":
			if (walkable(null, [particle[n].coords[0]+particle[n].dir[0]/16, particle[n].coords[1]+particle[n].dir[1]/16])) {
				particle[n].coords[0] += particle[n].dir[0]/16;
				particle[n].coords[1] += particle[n].dir[1]/16;
			}
			particle[n].timer++;
			if (particle[n].timer >= 8) {
				particle[n].dir = [Math.random()*2-1, Math.random()*2-1];
				particle[n].timer = 0;
				particle[n].anim++;
				particle[n].anim %= 2;
			}
			break;
	}
}

function checkParticle(n) {
	var r = false;
	for (var i = 0; i < particle.length; i++) if (particle[i].type === n) r = i+1;
	return r;
}

enemy = [];

function focus() {
	var f;
	if (characterArray[0].dir === "down") f = [characterArray[0].coords[0], characterArray[0].coords[1]+.9375];
	if (characterArray[0].dir === "left") f = [characterArray[0].coords[0]-.875, characterArray[0].coords[1]];
	if (characterArray[0].dir === "up") f = [characterArray[0].coords[0], characterArray[0].coords[1]-.9375];
	if (characterArray[0].dir === "right") f = [characterArray[0].coords[0]+.875, characterArray[0].coords[1]];
	return f;
}

function readSign(c,n) {
	var t;
	if ((c.dir === "down" && characterArray[0].dir === "up") || (c.dir === "left" && characterArray[0].dir === "right") || (c.dir === "down" && characterArray[0].dir === "up") || (c.dir === "right" && characterArray[0].dir === "left")) t = n;
	else t = "<p>You can't read it from this side…</p>";
	speechSequence.run = [
		function() {
			say(c,t,k.z());
		}
	];
}

function useChest(c,n) {
	var r = false;
	var t;
	if (c.anim) speech.innerHTML = "<p>It's empty…</p>";
	else if ((c.dir === "down" && characterArray[0].dir === "up") || (c.dir === "left" && characterArray[0].dir === "right") || (c.dir === "down" && characterArray[0].dir === "up") || (c.dir === "right" && characterArray[0].dir === "left")) {
		if (Number.isFinite(n)) {
			adjustPlayerCoin(n);
			t = "<p>You got <b>" + n + "</b> coins!</p>";
			r = true;
		}
		else {
			document.getElementById(n).setAttribute("data-item",n);
			document.getElementById(n).setAttribute("title",title[n]);
			t = "<p>You got the <strong>"+title["token"]+"</strong>!</p><div style='width:3vw;height:3vw;margin:auto;border:.5rem black outset;' data-item=token></div>";
			r = true;
		}
	}
	else t = "<p>You can't open it from this side…</p>";
	speechSequence.run = [
		function() {
			say(c,t,k.z());
		}
	];
	return r;
}

function receive(n) {
	if (document.getElementById(n)) {
		document.getElementById(n).setAttribute("data-item", n);
		if(title[n]) {
			document.getElementById(n).setAttribute("title", title[n]);
			say(characterArray[0], "<p>You got the <strong>"+title[n]+"</strong>!</p><div style='width:3vw;height:3vw;margin:auto;border:.5rem black outset;' data-item='"+n+"'></div>");
		}
		else speechSequence.pos++;
	}
	else speechSequence.pos++;
}

function hasItem(n) {
	var r = false;
	if (document.getElementById(n) && document.getElementById(n).dataset.item === n) r = true;
	return r;
}

function equip(e,n) {
	var i = document.getElementById(n);
	var x = document.getElementById("xSlot");
	var z = document.getElementById("zSlot");
	if (hasItem(n) && i.dataset.equip === "true") {
		if (e.shiftKey) {
			if (i.dataset.equipped === "z") z.removeAttribute("data-item");
			if (x.dataset.item) document.getElementById(x.dataset.item).removeAttribute("data-equipped");
			i.dataset.equipped = "x";
			x.dataset.item = n;
			x.setAttribute("title", i.getAttribute("title"));
		}
		else {
			if (i.dataset.equipped === "x") x.removeAttribute("data-item");
			if (z.dataset.item) document.getElementById(z.dataset.item).removeAttribute("data-equipped");
			i.dataset.equipped = "z";
			z.dataset.item = n;
			z.setAttribute("title", i.getAttribute("title"));
		}
	}
}

function useItem (m) {
	var n = particle.length;
	switch (m) {
		case "boomerang":
			if (!checkParticle("boomerang")) {
				particle[n] = {
					type: "boomerang",
					anim: 0,
					timer: 0,
					coords: [characterArray[0].coords[0],characterArray[0].coords[1]],
					sprite: "boomerang",
					d: -3
				}
				if (characterArray[0].dir === "down") particle[n].dir = [0,1];
				else if (characterArray[0].dir === "left") particle[n].dir = [-1,0];
				else if (characterArray[0].dir === "right") particle[n].dir = [1,0];
				else if (characterArray[0].dir === "up") particle[n].dir = [0,-1];
				particle[n].coords[0] += particle[n].dir[0]*.75;
				particle[n].coords[1] += particle[n].dir[1];
			}
			break;
	}
}

var hudTimer = 0;

function adjustPlayerHealth(n) {
	var health = document.getElementById("health");
	var m = Number(health.getAttribute("min"));
	var x = Number(health.getAttribute("max"));
	n += Number(health.getAttribute("value"));
	if (n <= m) gameOver();
	else if (n > x) health.setAttribute("value", x);
	else health.setAttribute("value", n);
	hudTimer = -60;
}

function adjustPlayerCoin(n) {
	var money = document.getElementById("money");
	var m = Number(money.innerHTML);
	m += n;
	if (m < 0) m = 0;
	money.innerHTML = m;
	hudTimer = -60;
}

function generateCharacterList(g) {
	localCharacterList[g[0]][g[1]] = new Array();
	for (var i=0; i<characterArray.length; i++) {
		if (characterArray[i].gCoords[0] === g[0] && characterArray[i].gCoords[1] === g[1]) localCharacterList[g[0]][g[1]][localCharacterList[g[0]][g[1]].length] = i;
	}
}

function setGlobalPosition(g) {
	characterArray[0].gCoords = g;
	generateCharacterList(g);
	generateParticles();
	generateEnemies();
}

function teleport(dx,dy) {
	var r = false;
	var g = [characterArray[0].gCoords[0], characterArray[0].gCoords[1]];
	var c = [Math.floor(characterArray[0].coords[0]), Math.floor(characterArray[0].coords[1])];
	switch (g[0]) {
		case 0:
			if (g[1] === 0xC && c[0] === 9 && c[1] === 7) {
				setGlobalPosition([12,1]);
				characterArray[0].coords = [8,7.5];
				r = true;
			}
			else if (g[1] === 0xD && c[0] === 12 && c[1] === 5 && dy > 0) {				setGlobalPosition([12,2]);
				characterArray[0].coords = [8,2.5];
				r = true;
			}
			break;

		case 1:
			if (g[1] === 0xD && c[0] === 5 && c[1] === 7) {
				setGlobalPosition([12,0]);
				characterArray[0].coords = [8,6.5];
				r = true;
			}
			break;

		case 12:
			if (g[1] === 0x0 && (c[0] === 7 || c[0] === 8) && c[1] === 7) {
				setGlobalPosition([1,13]);
				characterArray[0].coords = [5.5,8.5];
				r = true;
			}
			if (g[1] === 0x1 && (c[0] === 7 || c[0] === 8) && c[1] === 8) {
				setGlobalPosition([0,12]);
				characterArray[0].coords = [9.5,8.5];
				r = true;
			}
			if (g[1] === 0x2 && (c[0] === 7 || c[0] === 8) && c[1] === 1) {
				setGlobalPosition([0,13]);
				characterArray[0].coords = [12.5,4.5];
				r = true;
			}
			break;
	}
	return r;
}

function gameOver() {
	speechSequence.run = [
		function() {
			say(characterArray[0], "Game Over");
		},
		function() {
			// confirm(characterAray[0], "Retry?");
		},
		function() {
			// reload();
		}
	];
}

function logic() {
	var l = localCharacterList[characterArray[0].gCoords[0]][characterArray[0].gCoords[1]];
	if (inventory.dataset.state === "out" && menu.dataset.state === "out" && !speechSequence.run) {
		if (k.Sft || hudTimer) {
			HUD.dataset.state = "in";
			items.dataset.state = "in";
			if (hudTimer) hudTimer++;
		}
		else {
			HUD.dataset.state = "out";
			items.dataset.state = "out";
		}
		darken.dataset.state = "out";
	}
	else {
		darken.dataset.state = "in";
		HUD.dataset.state = "out";
		if (inventory.dataset.state === "in") items.dataset.state = "in";
		else items.dataset.state = "out";
		if (speechSequence.run) {
			if (speechSequence.pause > 0) {
				dialogue.dataset.state = "out";
				speechSequence.pause--;
			}
			else {
				if (speechSequence.pause !== false) {
					speechSequence.pos++;
					speechSequence.pause = false;
				}
				if (speechSequence.pos >= speechSequence.run.length) {
					speechSequence.pos = 0;
					speechSequence.run = false;
					dialogue.dataset.state = "out";
				}
				else speechSequence.run[speechSequence.pos]();
			}
		}
	}
	for (var i=0; i<l.length; i++) {
		if (characterArray[l[i]].path) followPath(l[i]);
		if (characterArray[l[i]].step) characterArray[l[i]].step();
	}
	for (var i=0; i<particle.length; i++) {
		particleStep(i);
	}
	for (var i=0; i<enemy.length; i++) {
		enemy[i].step();
	}
	window.setTimeout(logic,50/3);
}

function render() {
	var spriteLoader = context.createImageData(16,16);
	var l;
	for (var i=0; i<160; i++) {
		for (var j=0; j<0x100; j++) {
			spriteLoader.data[j*4] = color[tileTexture[tileMap[characterArray[0].gCoords[0]][characterArray[0].gCoords[1]][i]][j]][0];
			spriteLoader.data[j*4+1] = color[tileTexture[tileMap[characterArray[0].gCoords[0]][characterArray[0].gCoords[1]][i]][j]][1];
			spriteLoader.data[j*4+2] = color[tileTexture[tileMap[characterArray[0].gCoords[0]][characterArray[0].gCoords[1]][i]][j]][2];
			spriteLoader.data[j*4+3] = 0xFF;
		}
		context.putImageData(spriteLoader,16*(i%16),16*Math.floor(i/16));
	}
	for (var i=0; i<enemy.length; i++) {
		spriteLoader = context.getImageData(Math.floor(16 * (enemy[i].coords[0] - 1/2)), Math.floor(16 * (enemy[i].coords[1] - 1/2)),16,16);
		for (var j=0; j<0x100; j++) {
			if (enemySprite[enemy[i].sprite][direction(enemy[i].dir[0],enemy[i].dir[1])][enemy[i].anim][j]) {
				spriteLoader.data[j*4] = color[enemySprite[enemy[i].sprite][direction(enemy[i].dir[0],enemy[i].dir[1])][enemy[i].anim][j]][0];
				spriteLoader.data[j*4+1] = color[enemySprite[enemy[i].sprite][direction(enemy[i].dir[0],enemy[i].dir[1])][enemy[i].anim][j]][1];
				spriteLoader.data[j*4+2] = color[enemySprite[enemy[i].sprite][direction(enemy[i].dir[0],enemy[i].dir[1])][enemy[i].anim][j]][2];
				spriteLoader.data[j*4+3] = 0xFF;
			}
		}
		context.putImageData(spriteLoader, Math.floor(16 * (enemy[i].coords[0] - .5)), Math.floor(16 * (enemy[i].coords[1] - .5)));
	}
	for (var i=0; i<localCharacterList[characterArray[0].gCoords[0]][characterArray[0].gCoords[1]].length; i++) {
		spriteLoader = context.getImageData(Math.floor(16 * (characterArray[localCharacterList[characterArray[0].gCoords[0]][characterArray[0].gCoords[1]][i]].coords[0] - 1/2)), Math.floor(16 * (characterArray[localCharacterList[characterArray[0].gCoords[0]][characterArray[0].gCoords[1]][i]].coords[1] - 1/2)), 16, 16);
		for (var j=0; j<0x100; j++) {
			l = characterArray[localCharacterList[characterArray[0].gCoords[0]][characterArray[0].gCoords[1]][i]];
			if(characterSprite[l.sprite][l.dir][l.anim][j]) {
				spriteLoader.data[j*4] = color[characterSprite[l.sprite][l.dir][l.anim][j]][0];
				spriteLoader.data[j*4 + 1] = color[characterSprite[l.sprite][l.dir][l.anim][j]][1];
				spriteLoader.data[j*4 + 2] = color[characterSprite[l.sprite][l.dir][l.anim][j]][2];
				spriteLoader.data[j*4 + 3] = 0xFF;
			}
		}
		context.putImageData(spriteLoader, Math.floor(16 * (l.coords[0] - 1/2)), Math.floor(16 * (l.coords[1] - 1/2)));
	}
	for (var i=0; i<160; i++) {
		if(structureMap[characterArray[0].gCoords[0]][characterArray[0].gCoords[1]][i]) {
			spriteLoader = context.getImageData(16*(i%16),16*Math.floor(i/16),16,16);
			for (var j=0; j<0x100; j++) {
				if(structureTexture[structureMap[characterArray[0].gCoords[0]][characterArray[0].gCoords[1]][i]][j]) {
					spriteLoader.data[j*4] = color[structureTexture[structureMap[characterArray[0].gCoords[0]][characterArray[0].gCoords[1]][i]][j]][0];
					spriteLoader.data[j*4+1] = color[structureTexture[structureMap[characterArray[0].gCoords[0]][characterArray[0].gCoords[1]][i]][j]][1];
					spriteLoader.data[j*4+2] = color[structureTexture[structureMap[characterArray[0].gCoords[0]][characterArray[0].gCoords[1]][i]][j]][2];
					spriteLoader.data[j*4+3] = 0xFF;
				}
			}
		context.putImageData(spriteLoader,16*(i%16),16*Math.floor(i/16));
		}
	}
	for (var i=0; i<particle.length; i++) {
		spriteLoader = context.getImageData(Math.floor(16 * (particle[i].coords[0] - 1/2)), Math.floor(16 * (particle[i].coords[1] - 1/2)),16,16);
		for (var j=0; j<0x100; j++) {
			if (particleSprite[particle[i].sprite][particle[i].anim][j]) {
				spriteLoader.data[j*4] = color[particleSprite[particle[i].sprite][particle[i].anim][j]][0];
				spriteLoader.data[j*4+1] = color[particleSprite[particle[i].sprite][particle[i].anim][j]][1];
				spriteLoader.data[j*4+2] = color[particleSprite[particle[i].sprite][particle[i].anim][j]][2];
				spriteLoader.data[j*4+3] = 0xFF;
			}
		}
		context.putImageData(spriteLoader, Math.floor(16 * (particle[i].coords[0] - .5)), Math.floor(16 * (particle[i].coords[1] - .5)));
	}
	document.getElementById("screenshot").setAttribute("href", overworld.toDataURL("image/png"));
	next(render);
}

function init() {
	for (var m=0; m<tileMap.length; m++) {
		localCharacterList[m] = new Array();
		walkMap[m] = new Array();
		for (var n=0; n<tileMap[m].length; n++) {
			generateCharacterList([m,n]);
			walkMap[m][n] = generateWalkMap(m,n);		}
	}
	setGlobalPosition([12,0]);
	render();
	logic();
}

window.addEventListener("keydown", k.dn, false);
window.addEventListener("keyup", k.up, false);

document.getElementById("boomerang").addEventListener("click", function(e){equip(e,"boomerang");}, false);

document.getElementById("goButton").addEventListener("click", function() {characterArray[0].u = "<b>"+document.getElementById("pName").value.trim()+"</b>"; document.getElementById("preGame").setAttribute("style", "display: none;"); document.getElementById("gameWindow").removeAttribute("style"); init();}, false);
