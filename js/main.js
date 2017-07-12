//alert("running properly")


function Hero(game, x,y) {  //hero's location -------------- CONSTRUCTOR 
	//call phaser sprite constructor, creates hero 
	Phaser.Sprite.call(this, game, x, y, 'hero');
	this.anchor.set(0.5, 0.5); //not sure if .5 is equal to 50%
	this.game.physics.enable(this); // enables physics engine 
	this.body.collideWorldBounds = true; //stops hero from sliding offscreen 

}

// inherit from Phaser.Sprite
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.move = function (direction){ //keep this code below the .prototype in order to make sure it doesn't get overidden 
	const SPEED = 200;
	this.body.velocity.x = direction * SPEED;

}



PlayState = {};

PlayState.init = function (){  //maps key input for controlling the player 
	this.game.renderer.renderSession.roundPixels = true; // stops an anti aliasing effect tat blurs pixel games, is reusable 
	this.keys = this.game.input.keyboard.addKeys({
		left : Phaser.KeyCode.LEFT,
		right: Phaser.KeyCode.RIGHT,
		up   : Phaser.KeyCode.UP
	});

};

//load game assets here -------------------------PRE-LOAD HERE 
PlayState.preload = function () {
	this.game.load.image('background','images/background.png');//specifies where and what to call background image 
	this.game.load.json('level:1' , 'data/level01.json'); //specifies JSON level load data for rendering
	//loads enviroment images 
	this.game.load.image('ground', 'images/ground.png' );
	this.game.load.image('grass:8x1', 'images/grass_8x1.png');
	this.game.load.image('grass:6x1', 'images/grass_6x1.png');
	this.game.load.image('grass:4x1', 'images/grass_4x1.png');  //all this code just gives a path to a folder when one of the names is referenced 
	this.game.load.image('grass:2x1', 'images/grass_2x1.png');
	this.game.load.image('grass:1x1', 'images/grass_1x1.png');
	//loads player images 
	this.game.load.image('hero', 'images/hero_stopped.png'); //idle script for hero img 

};



//game entities and world set up goes here --------------------- CREATE HERE
PlayState.create = function () {
	this.game.add.image(0, 0, 'background'); //actually places and renders the background
	this._loadLevel(this.game.cache.getJSON('level:1')); //renders level 1 in the JSON file 
};

PlayState.update = function () { //checks constantly for something 
	this._handleCollisions();
	this._handleInput();

};

PlayState._handleCollisions = function () {
	this.game.physics.arcade.collide(this.hero, this.platforms) //specifies what collides and what doesnt 
}


PlayState._handleInput = function (){
	if (this.keys.left.isDown) { //takes a path back too earlier using move to determine left or right 
		this.hero.move(-1);
	}
	else if(this.keys.right.isDown){ //goes right
		this.hero.move(1);
	}
	else {                        //sets velocity to zero when no keys pressed
		this.hero.move(0);
	};
};



PlayState._loadLevel  = function (data) {     //pairs with the JSON file to load all level sprites 
	//console.log(data) <- run this code to test 
	data.platforms.forEach(this._spawnPlatform, this); //says when level load for each platform run platform code below 
	this._spawnCharacters({hero: data.hero}) //refs the JSON file to know where the hero spawns 

	this.platforms = this.game.add.group(); //places platforms into a group 

	const GRAVITY = 1200; //enables gravity, set to 
	this.game.physics.arcade.gravity.y = GRAVITY; //placing it here allows each level to have its own gravity


};

PlayState._spawnPlatform = function (platform) {
	let sprite = this.platforms.create(
        platform.x, platform.y, platform.image);

    this.game.physics.enable(sprite);

	this.game.body.allowGravity = false; //turns of grav for platforms  
	sprite.body.immovable = true ; 
};

PlayState._spawnCharacters = function (data) {
	this.hero = new Hero(this.game, data.hero.x, data.hero.y);
	this.game.add.existing(this.hero);
};



//commas are the bane of my existance 


//loads everything into the window 
window.onload = function (){
	let game = new Phaser.Game(960,600, Phaser.AUTO, 'game'); //sets the game window size and speicifies the div the game is in 
	game.state.add('play',PlayState);
	game.state.start('play');

};
//////////////////////////////////////////FAR AS I GOT BEFORE AN ERROR, LINE 102 'create'


