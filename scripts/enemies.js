/*
	Enemy attributes:
	pos: Position in enemy array
	sprite: Sprite
	anim: Current animation frame
	timer: Animation timer
	delay: Delay between frames
	coords: Local coordinates
	health: Amount of health [optional]
	armor: Amount of armor
	dir: Direction vector
	movementPattern:
		0 - Frozen
		1 - Afraid
		2 - Aggressive
		3 - Rotating
	touchDamage: (Negative) amount to adjust player health [optional]
	touchTimer: Touch timer [required if touchDamage]
	touchDelay: Delay between touches [required if touchDamage]
	attackParticle: constructor function for a particle [optional]
	attackTimer: Attack timer [required if attackParticle]
	attackDelay: Delay between attacks [required if attackParticle]
*/

var Enemy = {
	step: function() {
		var cx = characterArray[0].coords[0];
		var cy = characterArray[0].coords[1];
		var dc = Math.sqrt((this.coords[0]-cx)*(this.coords[0]-cx) + (this.coords[1]-cy)*(this.coords[1]-cy));
		var dx = 0;
		var dy = 0;
		// Set dx & dy; Anim
		switch (this.movementPattern) {
			case 1:
				var c;
				if (dc >= 5) c = 1;
				else c = dc/5;
				this.timer++;
				if (this.timer >= this.delay) {
					this.timer = 0;
					this.anim++;
					this.anim %= enemySprite[this.sprite][direction(this.dir[0],this.dir[1])].length;
					this.dir[0] = (this.coords[0]-cx)/dc;
					this.dir[1] = (this.coords[1]-cy)/dc;
				}
				var m = 1 - Math.random()*c;
				dx = this.dir[0] * m;
				dy = this.dir[1] * m;
				break;
		}
		// Move
		if (!walkable(null, [this.coords[0]+dx/16, this.coords[1]+dy/16])) {
			if(!walkable(null, [this.coords[0]+dx/16, this.coords[1]])) dx = 0;
			if(!walkable(null, [this.coords[0], this.coords[1]+dy/16]) || dx) dy = 0;
		}
		this.coords[0] += dx/16;
		this.coords[1] += dy/16;
		// Attack
		if (this.attackParticle) {
			this.attackTimer++;
			if (this.attackTimer >= this.attackDelay) {
				this.attackTimer = 0;
				particle[particle.length] = new this.attackParticle;
			}
		}
		// onParticleCollision
		var p;
		var pList = ["boomerang"];
		for (var i=0; i<pList.length; i++) {
			p = checkParticle(pList[i]);
			if (p) {
				p--;
				if (this.health) this.health += particle[p].d;
				particle.splice(p,1);
			}
		}
		// onPlayerTouch
		var r = false;
		for (m=-1; m<2; m++) {
			for (n=-1; n<2; n++) {
				if (insideNPC([this.coords[0] + .5*m, this.coords[1] + .5*n], characterArray[0].gCoords) === 0) r = true;
			}
		}
		if (this.touchDamage && this.touchTimer <= 0 && r) {
			adjustPlayerHealth(this.touchDamage);
			this.touchTimer = this.touchDelay;
		}
		if (this.touchTimer > 0) this.touchTimer--;
		if (this.health <= 0) enemy.splice(this.pos, 1);
	}
}

function createEnemy(n,x,y,d) {
	i = enemy.length;
	switch (n) {
		case "porcumouse":
			enemy[i] = Object.create(Enemy);
			enemy[i].pos = i;
			enemy[i].sprite = "porcumouse";
			enemy[i].anim = 0;
			enemy[i].timer = 0;
			enemy[i].delay = 8;
			enemy[i].coords = [x,y];
			enemy[i].health = 1;
			enemy[i].armor = 0;
			enemy[i].dir = d;
			enemy[i].movementPattern = 1;
			enemy[i].touchDamage = -1;
			enemy[i].touchTimer = 0;
			enemy[i].touchDelay = 60;
			break;
	}
}

function generateEnemies() {
	switch (characterArray[0].gCoords[0]+"x"+characterArray[0].gCoords[1]) {
		case "12x0":
			createEnemy("porcumouse", 9, 5, [0,0]);
			break;
		default:
			enemy = [];
	}
}
