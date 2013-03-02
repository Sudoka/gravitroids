function Message(subject, data, sender) {
	this.subject = subject;
	this.data = data;
	this.sender = sender;
}


function Game(container, width, height, layers) {
	this.frameRate = 60;
	this.intervalId = null;
	this.speedMultiplier = 10;
	this.stage = new Kinetic.Stage({
		container: container,
		width: width,
		height: height
	});
	$('#' + container).attr('width', width);
	this.stageWidth = width;
	this.stageHeight = height;
	this.layers = [];

	for (var i = 0; i < layers; i++) {
		this.layers.push(new Kinetic.Layer());
		this.stage.add(this.layers[i]);
	}
	
	this.scoreText = new Kinetic.Text({ 
		x: 10,
        y: 10,
        text: 'Score: 0',
        fontSize: 30,
        fontFamily: 'Calibri',
        fill: 'black'
      });
	  this.layers[0].add(this.scoreText);

      this.objectMap = {};
      this.objectMap['ship'] = ship;
      this.objectMap['bullet'] = bullet;
      this.objectMap['asteroid'] = asteroid;
      this.objectMap['particle'] = particle;
}

Game.prototype.initialize = function() {
	this.objects = [];
	this.easiness = 5;
	this.spawnCounter = this.easiness;
	this.score = 0;
	this.collisionManager = new CollisionManager();
	
	this.objectFactory = new ObjectFactory(this, this.layers[0]);
	this.spawnObject('ship', { position: {x:this.stageWidth/2, y:this.stageHeight-200} });
	this.gameTime = 0;
	this.difficultyTimer = 10;
}

Game.prototype.tell = function(message) {
	switch (message.subject) {
        case 'spawn':
            this.spawnObject(message.data.type, message.data.config);
            break;   
		case 'score':
			this.score += message.data;
			this.scoreText.setText('Score: ' + this.score);
            break;
        case 'kill':
			if (message.sender.owner.type == 'ship') {
				this.gameOver()
			}
			break;
	}
}

Game.prototype.spawnObject = function(type, config) {
    var go = this.objectFactory.createObject(this.objectMap[type], config);

    this.objects.push(go);
}

Game.prototype.gameOver = function() {
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
        text: 'Refresh the page to play again.',
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
	setTimeout(function() {this.stop();}, 5000);
}

Game.prototype.update = function() {
    try 
    {
        var frametime = 1.0 / this.frameRate;
        for (var i = this.objects.length-1; i >= 0; i--) {
            this.objects[i].update(frametime);
        }

        for (var i = 0; i < this.layers.length; i++) {
            this.layers[i].draw();
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
        
        this.collisionManager.checkCollisions();

        for (var i = this.objects.length-1; i >= 0; i--) {
            if (!this.objects[i].alive) {
                this.objects.splice(i, 1);
            }
        }

        this.gameTime += frametime;
        this.difficultyTimer -= frametime;
        if (this.difficultyTimer <= 0) {
            this.easiness *= 0.9;
            this.difficultyTimer = 10;
        }
    }
    catch (ex)
    {
        this.stop();
        throw ex;
    }
}

Game.prototype.start = function() {
	var that = this;
	if (this.intervalId != null)
		return;
	this.initialize();
	this.intervalId = setInterval(function() { that.update() }, 1000 / this.frameRate);
}

Game.prototype.stop = function() {
	if (this.intervalId == null)
		return;
	clearInterval(this.intervalId);
}