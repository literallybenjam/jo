/* To Do:
Visual:
	Path textures
	Walking sprites
	More characters
	Boat
	Attacking sprites
	Particles (Butterflies! Ducks! Fishes!)
	Flowers?!
	3DS Virtual Console-esque "View at original size with cool graphic"
	HUD
	Cutscenes
	Title Screen

Mechanical:
	Attacking/Item Use
	Enemy support
	Particle/NPC animation support
	Recieving items? (Or pass to cutscenes)
*/

var advance = window.setTimeout;
var next = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame;

var overworld = document.getElementById("overworld");
var text = document.getElementById("text");
var inventory = document.getElementById("inventory");
var map = document.getElementById("map");
var menu = document.getElementById("menu");
var video = document.getElementById("video");
var context = overworld.getContext("2d");

var k = {
	37:"Lf",38:"Up",39:"Rt",40:"Dn",88:"X",90:"Z",
	Lf:false,Up:false,Rt:false,Dn:false,X:false,Z:false,
    dn: function(e)	{
		if (e.keyCode === 83 && map.dataset.state === "out" && menu.dataset.state === "out" && video.dataset.state === "out") {
			if (inventory.dataset.state === "out") inventory.dataset.state = "in";
			else inventory.dataset.state = "out";
		}
		if (e.keyCode === 32 && menu.dataset.state === "out" && video.dataset.state === "out") {
			if (map.dataset.state === "out") map.dataset.state = "in";
			else map.dataset.state = "out";
		}
		if (e.keyCode === 65) {
			if (menu.dataset.state === "out") menu.dataset.state = "in";
			else menu.dataset.state = "out";
		}
		if (e.keyCode === 9) {
			if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement) {
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
		else if (k[e.keyCode])k[k[e.keyCode]]=true;
	},
    up: function(e) {
		k[k[e.keyCode]] = false;
	}
}

var player = {
	coords: [5.5,7.5],
	dir: "down"
}
var global = [1,1];
var globalAnimation = {
	anim: 0,
	timer: 0
}

var title = {
	"boomerang": "Boomerang",
	"thrown-boomerang": "Throwing Boomerang"
}

var walkMap;

var tileMap = [
	[
		[0x20,0x20,0x20,0x16,0x13,0x13,0x13,0x13,0x13,0x13,0x13,0x13,0x13,0x17,0x20,0x20,
		 0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,
		 0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,
		 0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,
		 0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x14,0x12,
		 0x20,0x20,0x20,0x20,0x20,0x20,0x14,0x12,0x12,0x12,0x12,0x12,0x12,0x12,0x18,0x01,
		 0x20,0x20,0x20,0x14,0x12,0x12,0x18,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,
		 0x20,0x20,0x14,0x18,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,
		 0x20,0x20,0x10,0x01,0x01,0x01,0x01,0x01,0x01,0x31,0x01,0x01,0x01,0x01,0x01,0x01,
		 0x20,0x20,0x10,0x01,0x01,0x01,0x01,0x01,0x01,0x31,0x01,0x01,0x01,0x01,0x01,0x01],
		[0x20,0x20,0x10,0x01,0x01,0x01,0x01,0x01,0x01,0x31,0x01,0x01,0x01,0x01,0x01,0x01,
		 0x20,0x20,0x10,0x01,0x01,0x01,0x01,0x01,0x01,0x31,0x01,0x01,0x01,0x01,0x01,0x01,
		 0x20,0x20,0x10,0x01,0x01,0x01,0x01,0x01,0x01,0x31,0x01,0x01,0x01,0x01,0x01,0x01,
		 0x20,0x20,0x10,0x01,0x01,0x30,0x30,0x30,0x30,0x37,0x30,0x30,0x39,0x30,0x30,0x30,
		 0x20,0x20,0x10,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x31,0x01,0x01,0x01,
		 0x20,0x20,0x10,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x31,0x01,0x01,0x01,
		 0x20,0x20,0x10,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,
		 0x20,0x20,0x10,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,
		 0x20,0x20,0x10,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,
		 0x20,0x20,0x10,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01]
	],
	[
		[0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x14,0x18,0x01,0x01,0x01,0x01,0x01,
		 0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x14,0x18,0x01,0x01,0x01,0x01,0x01,0x01,
		 0x20,0x20,0x20,0x20,0x20,0x20,0x14,0x12,0x18,0x01,0x01,0x01,0x01,0x01,0x01,0x01,
		 0x20,0x20,0x20,0x20,0x14,0x12,0x18,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,
		 0x12,0x12,0x12,0x12,0x18,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,
		 0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,
		 0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,
		 0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x31,0x01,0x01,0x01,0x01,0x01,0x01,
		 0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x31,0x01,0x01,0x01,0x01,0x01,0x01,
		 0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x31,0x01,0x01,0x01,0x01,0x01,0x01],
		[0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x31,0x01,0x01,0x01,0x01,0x01,0x01,
		 0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x31,0x01,0x01,0x01,0x01,0x01,0x01,
		 0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x35,0x37,0x34,0x01,0x01,0x01,0x01,0x01,
		 0x30,0x30,0x30,0x30,0x30,0x30,0x30,0x30,0x3A,0x01,0x38,0x30,0x30,0x30,0x01,0x01,
		 0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x33,0x39,0x32,0x01,0x01,0x01,0x01,0x01,
		 0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x31,0x01,0x01,0x01,0x01,0x01,0x01,
		 0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x31,0x01,0x01,0x01,0x01,0x01,0x01,
		 0x01,0x01,0x01,0x01,0x01,0x00,0x01,0x01,0x01,0x31,0x01,0x01,0x01,0x01,0x01,0x01,
		 0x01,0x01,0x01,0x01,0x01,0x33,0x30,0x30,0x30,0x3A,0x01,0x01,0x01,0x01,0x01,0x01,
		 0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x31,0x01,0x01,0x01,0x01,0x01,0x01]
	]
]

var structureMap = [
	[
		[0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x30,0x20,0x20,0x20,0x31,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x0A,0x00,0x00,0x32,0x21,0x21,0x21,0x33,0x00,0x00,0x00,0x08,
		 0x00,0x00,0x00,0x08,0x05,0x06,0x09,0x22,0x24,0x25,0x24,0x26,0x08,0x06,0x06,0x06,
		 0x00,0x00,0x00,0x00,0x07,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00],
		[0x00,0x00,0x00,0x00,0x0B,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x34,0x20,0x35,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x36,0x37,0x38,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x39,0x21,0x3A,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x22,0x24,0x26,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x0A,0x00,0x00,0x00,0x00,0x00,0x30,0x20,0x20,0x20,0x31,0x00,
		 0x00,0x00,0x00,0x00,0x07,0x01,0x02,0x01,0x02,0x00,0x32,0x21,0x21,0x21,0x33,0x00,
		 0x00,0x00,0x00,0x00,0x07,0x03,0x04,0x03,0x04,0x00,0x22,0x24,0x23,0x24,0x26,0x00,
		 0x00,0x00,0x00,0x00,0x07,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x08,0x05,0x06,0x06,0x06,0x06,0x06,0x06,0x06,0x06,0x06,0x06,0x06]
	],
	[
		[0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01,0x02,0x00,0x01,0x02,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01,0x02,0x00,0x00,0x03,0x04,0x00,0x03,0x04,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x03,0x04,0x00,0x01,0x02,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x03,0x04,0x00,0x00,0x01,0x02,
		 0x00,0x00,0x00,0x00,0x01,0x02,0x30,0x20,0x20,0x20,0x31,0x00,0x01,0x02,0x03,0x04,
		 0x0A,0x00,0x00,0x00,0x03,0x04,0x32,0x21,0x21,0x21,0x33,0x00,0x03,0x04,0x0A,0x00,
		 0x05,0x06,0x06,0x06,0x06,0x09,0x22,0x24,0x23,0x25,0x26,0x08,0x06,0x06,0x05,0x09,
		 0x05,0x09,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x07,0x00,
		 0x0B,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x07,0x00],
		[0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x0B,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x34,0x20,0x35,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x36,0x37,0x38,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x0C,0x00,0x00,0x00,0x39,0x21,0x3A,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x22,0x23,0x26,
		 0x00,0x00,0x00,0x00,0x30,0x20,0x31,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x0A,0x00,
		 0x00,0x00,0x00,0x00,0x32,0x21,0x33,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x07,0x00,
		 0x00,0x00,0x00,0x00,0x22,0x27,0x26,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x07,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x07,0x00,
		 0x06,0x06,0x06,0x06,0x06,0x06,0x06,0x06,0x06,0x06,0x06,0x06,0x06,0x06,0x05,0x09]
	]
]

var characterMap = [
	[
		[0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00],
		[0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00]
	],
	[
		[0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x02,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00],
		[0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00]
	]
]

function generateWalkMap(m,n) {
	var tmap = new Array();
	var t;
	var s;
	var c;
	for (var i=0; i<10; i++) {
		for (var j=0; j<16; j++) {
			t=tileMap[m][n][i*16+j];
			s=structureMap[m][n][i*16+j];
			c=characterMap[m][n][i*16+j];
			if (t === 0x12 || t === 0x14 || t === 0x1C || t === 0x1D || t === 0x1E || t === 0x1F || t === 0x20 || t === 0x21 || t === 0x23 || t === 0x24 || t === 0x25 || (s>0x02 && s<0x11 && s !== 0x0C) || (s>0x20 && s<0x30 && s !== 0x27) || (s>0x31 && s !== 0x34 && s!== 0x35) || c) {
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
			c=characterMap[m][n][i*16+j];
			if (t === 0x13 || t === 0x16 || t === 0x17 || t === 0x1C || t === 0x1D || t === 0x1E || t === 0x1F || t === 0x20 || t === 0x21 || t === 0x23 || t === 0x24 || t === 0x25 || (s>0x02 && s<0x11) || (Math.floor(s/0x10) === 0x2 && s !== 0x27) || (s>0x31 && s !== 0x34 && s!== 0x35) || c) {
				tmap[tmap.length] = 0;
				tmap[tmap.length] = 0;
			}
			else if (t === 0x10 || t === 0x14 || t === 0x1A || s === 0x31 || s === 0x35) {
				tmap[tmap.length] = 0;
				tmap[tmap.length] = 1;
			}
			else if (t === 0x11 || t === 0x15 || t === 0x1B || s === 0x30 || s === 0x34) {
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

function focus() {
	var f;
	if (player.dir === "down") f = Math.floor(player.coords[0]) + Math.floor(player.coords[1]+1)*16;
	if (player.dir === "left") f = Math.floor(player.coords[0]-.75) + Math.floor(player.coords[1])*16;
	if (player.dir === "up") f = Math.floor(player.coords[0]) + Math.floor(player.coords[1]-1)*16;
	if (player.dir === "right") f = Math.floor(player.coords[0]+.75) + Math.floor(player.coords[1])*16;
	return f;
}

function receive(n) {
	document.getElementById(n).setAttribute("data-item",n);
	document.getElementById(n).setAttribute("title",title[n]);
	text.innerHTML += "<p>You got the <strong>"+title[n]+"</strong>!</p><div style='width:5vw;height:5vw;margin:auto;border:thick black outset;' data-item="+n+"></div>";
	text.dataset.state = "in";
}

function equip(e,n) {
	var i = document.getElementById(n);
	var x = document.getElementById("xSlot");
	var z = document.getElementById("zSlot");
	if (i.dataset.item) {
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

function logic() {
	if (inventory.dataset.state === "out" && map.dataset.state === "out" && menu.dataset.state === "out" && video.dataset.state === "out" && text.dataset.state === "out") {
		var dx = 0;
	    var dy = 0;
	    if (k.Up && k.Lf && k.Dn && k.Rt) dy = dx = 0;
	    else if (k.Lf && k.Dn && k.Rt) {
		dy = 1;
		dx = 0;
		player.dir = "down";
	    }
	    else if (k.Up && k.Dn && k.Rt) {
		dy = 0;
		dx = 1;
		player.dir = "right";
	    }
	    else if (k.Up && k.Lf && k.Rt) {
		dy = -1;
		dx = 0;
		player.dir = "up";
	    }
	    else if (k.Up && k.Lf && k.Dn) {
		dy = 0;
		dx = -1;
		player.dir = "left";
	    }
	    else if (k.Up && k.Lf) {
		dy = -1/Math.SQRT2;
		dx = -1/Math.SQRT2;
		player.dir = "up";
	    }
	    else if (k.Up && k.Rt) {
		dy = -1/Math.SQRT2;
		dx = 1/Math.SQRT2;
		player.dir = "up";
	    }
	    else if (k.Dn && k.Lf) {
		dy = 1/Math.SQRT2;
		dx = -1/Math.SQRT2;
		player.dir = "down";
	    }
	    else if (k.Dn && k.Rt) {
		dy = 1/Math.SQRT2;
		dx = 1/Math.SQRT2;
		player.dir = "down";
	    }
	    else if (k.Up && k.Dn) dy = dx = 0;
	    else if (k.Lf && k.Rt) dy = dx = 0;
	    else if (k.Up) {
	        dy = -1;
	        player.dir = "up";
	    }
	    else if (k.Dn) {
	        dy = 1;
	        player.dir = "down";
	    }
	    else if (k.Lf) {
	        dx = -1;
	        player.dir = "left";
	    }
	    else if (k.Rt) {
	        dx = 1;
	        player.dir = "right";
		}
		if (!walkMap) walkMap = generateWalkMap(global[0],global[1]);
		if (player.coords[0]-.5+dx/16 < 0 && generateWalkMap(global[0]-1,global[1])[31+32*Math.floor(2*(player.coords[1]-.4375))] && generateWalkMap(global[0]-1,global[1])[31+32*Math.floor(2*(player.coords[1]+.4375))] && generateWalkMap(global[0]-1,global[1])[30+32*Math.floor(2*(player.coords[1]-.4375))] && generateWalkMap(global[0]-1,global[1])[30+32*Math.floor(2*(player.coords[1]+.4375))]) {
		player.coords[0] = 15.5;
		walkMap = generateWalkMap(--global[0],global[1]);
		}
		if (player.coords[0]+.5+dx/16 >= 16 && generateWalkMap(global[0]+1,global[1])[0+32*Math.floor(2*(player.coords[1]-.4375))] && generateWalkMap(global[0]+1,global[1])[0+32*Math.floor(2*(player.coords[1]+.4375))] && generateWalkMap(global[0]+1,global[1])[1+32*Math.floor(2*(player.coords[1]-.4375))] && generateWalkMap(global[0]+1,global[1])[1+32*Math.floor(2*(player.coords[1]+.4375))]) {
		player.coords[0] = 0.5;
		walkMap = generateWalkMap(++global[0],global[1]);
		}
		if (player.coords[1]-.4375+dy/16 < 0 && generateWalkMap(global[0],global[1]-1)[Math.floor(2*(player.coords[0]-.375))+32*18] && generateWalkMap(global[0],global[1]-1)[Math.floor(2*(player.coords[0]+.375))+32*18] && generateWalkMap(global[0],global[1]-1)[Math.floor(2*(player.coords[0]-.375))+32*19] && generateWalkMap(global[0],global[1]-1)[Math.floor(2*(player.coords[0]+.375))+32*19]) {
		player.coords[1] = 9.5;
		walkMap = generateWalkMap(global[0],--global[1]);
		}
		if (player.coords[1]+.4375+dy/16 >= 10 && generateWalkMap(global[0],global[1]+1)[Math.floor(2*(player.coords[0]-.375))+32*0] && generateWalkMap(global[0],global[1]+1)[Math.floor(2*(player.coords[0]+.375))+32*0] && generateWalkMap(global[0],global[1]+1)[Math.floor(2*(player.coords[0]-.375))+32*1] && generateWalkMap(global[0],global[1]+1)[Math.floor(2*(player.coords[0]+.375))+32*1]) {
		player.coords[1] = 0.5;
		walkMap = generateWalkMap(global[0],++global[1]);
		}
		if (walkMap[Math.floor(2*(player.coords[0]-.375+dx/16)) + Math.floor(2*(player.coords[1]-.4375+dy/16))*32] && walkMap[Math.floor(2*(player.coords[0]+.375+dx/16)) + Math.floor(2*(player.coords[1]-.4375+dy/16))*32] && walkMap[Math.floor(2*(player.coords[0]+.375+dx/16)) + Math.floor(2*(player.coords[1]+.4375+dy/16))*32] && walkMap[Math.floor(2*(player.coords[0]-.375+dx/16)) + Math.floor(2*(player.coords[1]+.4375+dy/16))*32] && walkMap[Math.floor(2*(player.coords[0]+dx/16)) + Math.floor(2*(player.coords[1]-.4375+dy/16))*32] && walkMap[Math.floor(2*(player.coords[0]+dx/16)) + Math.floor(2*(player.coords[1]-.4375+dy/16))*32] && walkMap[Math.floor(2*(player.coords[0]+.375+dx/16)) + Math.floor(2*(player.coords[1]+dy/16))*32] && walkMap[Math.floor(2*(player.coords[0]-.375+dx/16)) + Math.floor(2*(player.coords[1]+dy/16))*32]) {
			player.coords[0] += dx/16;
			player.coords[1] += dy/16;
			if (!dx && !dy) {
				characterTexture[0].anim = 0;
				characterTexture[0].timer = 0;
			}
			else characterTexture[0].timer++;
			if (characterTexture[0].timer >= characterTexture[0].delay) {
				characterTexture[0].anim++;
				characterTexture[0].anim %= 2;
				characterTexture[0].timer = 0;
			}
		}
		if (k.X) {
			switch (characterMap[global[0]][global[1]][focus()]) {
				case 1:
					text.innerHTML = "<blockquote><b><!--Fat-->Kid:</b> Now you can store items in your inventory! Isn't technology amazing?</blockquote><p>(Press 'S' to open your inventory)</p>";
					text.dataset.state = "in";
					break;

				case 2:
					if (document.getElementById("boomerang").dataset.item !== "boomerang") {
						text.innerHTML = "<blockquote><b>Old Man:</b> You can't use this yet, but take it anyway.</blockquote>"
						receive("boomerang");
					}
					else if (document.getElementById("thrown-boomerang").dataset.item !== "thrown-boomerang") {
						text.innerHTML = "<blockquote><b>Old Man:</b> You know, you should be able to throw that boomerang…</blockquote>";
						receive("thrown-boomerang");
					}
					else {
						text.innerHTML = "<blockquote><b>Old Man:</b> It's dangerous to go alone…</blockquote>";
						text.dataset.state = "in";
					}
					break;
			}
		}
	}
	else if (text.dataset.state === "in" && k.Z) {
		text.innerHTML = "";
		text.dataset.state = "out";
	}
	if (++globalAnimation.timer === 8) {
		globalAnimation.timer = 0;
		globalAnimation.anim++;
		globalAnimation.anim %=4;
	}
	advance(logic,50/3);
}

function render() {
	var spriteLoader = context.createImageData(16,16);
	for (var i=0; i<160; i++) {
		for (var j=0; j<0x100; j++) {
			spriteLoader.data[j*4] = color[tileTexture[tileMap[global[0]][global[1]][i]][j]][0];
			spriteLoader.data[j*4+1] = color[tileTexture[tileMap[global[0]][global[1]][i]][j]][1];
			spriteLoader.data[j*4+2] = color[tileTexture[tileMap[global[0]][global[1]][i]][j]][2];
			spriteLoader.data[j*4+3] = 0xFF;
		}
		context.putImageData(spriteLoader,16*(i%16),16*Math.floor(i/16));
	}
	var a;
	spriteLoader = context.getImageData(Math.floor(16*(player.coords[0]-1/2)),Math.floor(16*(player.coords[1]-1/2)),16,16);
	for (var i=0; i<0x100; i++) {
		if(characterTexture[0][player.dir][characterTexture[0].anim][i]) {
			spriteLoader.data[i*4] = color[characterTexture[0][player.dir][characterTexture[0].anim][i]][0];
			spriteLoader.data[i*4+1] = color[characterTexture[0][player.dir][characterTexture[0].anim][i]][1];
			spriteLoader.data[i*4+2] = color[characterTexture[0][player.dir][characterTexture[0].anim][i]][2];
			spriteLoader.data[i*4+3] = 0xFF;
		}
	}
	context.putImageData(spriteLoader,Math.floor(16*(player.coords[0]-1/2)),Math.floor(16*(player.coords[1]-1/2)));
	for (var i=0; i<160; i++) {
		if(characterMap[global[0]][global[1]][i]) {
			spriteLoader = context.getImageData(16*(i%16),16*Math.floor(i/16),16,16);
			for (var j=0; j<0x100; j++) {
				if(characterTexture[characterMap[global[0]][global[1]][i]].sprite[j]) {
					spriteLoader.data[j*4] = color[characterTexture[characterMap[global[0]][global[1]][i]].sprite[j]][0];
					spriteLoader.data[j*4+1] = color[characterTexture[characterMap[global[0]][global[1]][i]].sprite[j]][1];
					spriteLoader.data[j*4+2] = color[characterTexture[characterMap[global[0]][global[1]][i]].sprite[j]][2];
					spriteLoader.data[j*4+3] = 0xFF;
				}
			}
		context.putImageData(spriteLoader,16*(i%16),16*Math.floor(i/16));
		}
	}
	for (var i=0; i<160; i++) {
		if(structureMap[global[0]][global[1]][i]) {
			spriteLoader = context.getImageData(16*(i%16),16*Math.floor(i/16),16,16);
			for (var j=0; j<0x100; j++) {
				if(structureTexture[structureMap[global[0]][global[1]][i]][j]) {
					spriteLoader.data[j*4] = color[structureTexture[structureMap[global[0]][global[1]][i]][j]][0];
					spriteLoader.data[j*4+1] = color[structureTexture[structureMap[global[0]][global[1]][i]][j]][1];
					spriteLoader.data[j*4+2] = color[structureTexture[structureMap[global[0]][global[1]][i]][j]][2];
					spriteLoader.data[j*4+3] = 0xFF;
				}
			}
		context.putImageData(spriteLoader,16*(i%16),16*Math.floor(i/16));
		}
	}
	next(render);
	return spriteLoader.data;
}

function init() {
	// Title Screen goes here!
	logic();
	render();
}

init();

window.addEventListener("keydown",k.dn,false);
window.addEventListener("keyup",k.up,false);

document.getElementById("boomerang").addEventListener("click", function(e){equip(e,"boomerang");}, false);
document.getElementById("thrown-boomerang").addEventListener("click", function(e){equip(e,"thrown-boomerang");}, false);
