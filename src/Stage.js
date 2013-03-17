function Stage(game, layers, stageWidth, stageHeight) {
	this.collisionManager = new CollisionManager();
    this.layers = layers;
	this.objectFactory = new ObjectFactory(this, this.layers);

    this.objectMap = {};
    this.objectMap['ship'] = ship;
    this.objectMap['bullet'] = bullet;
    this.objectMap['asteroid'] = asteroid;
    this.objectMap['particle'] = particle;

	this.scoreText = new Kinetic.Text({ 
		x: 10,
        y: 10,
        text: 'Score: 0',
        fontSize: 30,
        fontFamily: 'Calibri',
        fill: 'black'
    });
    this.layers[0].add(this.scoreText);
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;

    this.initialize();
}

Stage.prototype.initialize = function() {
	this.score = 0;
	this.gameTime = 0;
	this.objects = [];
	this.easiness = 5;
	this.difficultyTimer = 10;
	this.spawnCounter = this.easiness;
	this.spawnObject('ship', { position: {x:this.stageWidth/2, y:this.stageHeight*0.8} });
}

Stage.prototype.destroy = function() {
    for (var i = 0; i < this.objects.length; i++) {
        this.objects[i].broadcast(new Message('kill', { mode: 'final' }, this));
    }
}

Stage.prototype.restart = function() {
    this.destroy();
    this.initialize();
}

Stage.prototype.update = function(frametime) {
    for (var i = this.objects.length-1; i >= 0; i--) {
        this.objects[i].update(frametime);
    }

    this.collisionManager.checkCollisions();

    for (var i = this.objects.length-1; i >= 0; i--) {
        if (!this.objects[i].alive) {
            this.objects.splice(i, 1);
        }
    }

    this.spawnCounter -= frametime;
    if (this.spawnCounter <= 0) {
        this.spawnCounter = this.easiness;
        var size = Math.ceil(Math.random()*4);
        this.spawnObject('asteroid', { position: {x: Math.random()*this.stageWidth, y: -100}, 
                size: size, 
                velocity: { x: Math.random()*100-50, y: Math.random()*50 },
                points: 100*size});
    }


    this.gameTime += frametime;
    this.difficultyTimer -= frametime;
    if (this.difficultyTimer <= 0) {
        this.easiness *= 0.9;
        this.difficultyTimer = 10;
    }
}

Stage.prototype.broadcast = function(message, sender) {
    for (var i = 0; i < this.objects.length; i++) {
        this.objects[i].broadcast(message, sender);
    }
    this.receiveMessage(message, sender);
}

Stage.prototype.receiveMessage = function(message, sender) {
	switch (message.subject) {
        case 'spawn':
            this.spawnObject(message.data.type, message.data.config);
            break;   
		case 'score':
			this.score += message.data;
			this.scoreText.setText('Score: ' + this.score);
            break;
        case 'kill':
			if (message.sender.owner && message.sender.owner.type == 'ship') {
				this.gameOver()
			}
			break;
	}
}

Stage.prototype.spawnObject = function(type, config) {
    var go = this.objectFactory.createObject(this.objectMap[type], config);

    this.objects.push(go);
}

Stage.prototype.gameOver = function() {
	var gameOverText = new Kinetic.Text({
		x: this.stageWidth/2,
        y: this.stageHeight/2-50,
        text: 'Game over!',
        fontSize: 70,
        fontFamily: 'Calibri',
        fill: 'black',
    });
	var gameOverText2 = new Kinetic.Text({
		x: this.stageWidth/2,
        y: this.stageHeight/2+50,
        text: 'Game restarts in 5 seconds.',
        fontSize: 20,
        fontFamily: 'Calibri',
        fill: 'black',
    });
	gameOverText.setOffset({
        x: gameOverText.getWidth() / 2
    });
	gameOverText2.setOffset({
        x: gameOverText2.getWidth() / 2
    });
	this.layers[0].add(gameOverText);
	this.layers[0].add(gameOverText2);
    var that = this;
	setTimeout(function() {that.restart(); gameOverText.remove(); gameOverText2.remove()}, 5000);
}