//TODO

//1. Little stuff
//	pause: esc to pause game
//	make invader types different/ sprites change on move
//  Display score and lives at top

//2/3. Make player able to die/ Make enemies shoot.
//4. Add barriers.
//5. Add bonus ships
//6. Add game over text / Restart handling.


//Player Object
//Represents the player
//Takes a starting position (x and y)
function Player(startX,startY) {
	//starting position
	this.x = startX;
	this.y = startY;
	
	//rect1: main body
	this.width1 = 36;
	this.height1 = 20;
	
	//rect2: top
	this.width2 = 10;
	this.height2 = 20;
	this.x_offset = 13;
	this.y_offset = -12;
	
	//horizontal speed
	this.x_speed = 3;
	
	//bullet object 
	this.bullet = undefined;
	
	//draws the player object each frame
	this.draw = function() {
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.width1, this.height1);
		ctx.rect(this.x + this.x_offset, this.y + this.y_offset, this.width2, this.height2);
		ctx.fillStyle = "white";
		ctx.fill();
		ctx.closePath();
		
		//handles bullet object deletion
		//Should be moved elsewhere
		if (this.bullet != undefined && this.bullet.y < 0){
			this.bullet = undefined; 
		}
	};

	//Passed 2 (x,y) pairs, it determines if any part of the rectangle formed by the two intersects with the player sprite
	//Needs work!
	this.inHitbox = function(x1,y1,x2,y2) {
		if ((this.x < x1 && this.x + this.width1 > x1) || (this.x < x2 && this.x + this.width1 > x2)){
			if ((this.y < y1 && this.y + this.height1 > y1) || (this.y < y2 && this.y + this.height1 > y2)){
				return true;
			}
		}
		
		return false; 
	}
	
	//Moves left by this.x_speed
	this.moveLeft = function() {
		if (this.x > 0){ 
			this.x -= this.x_speed;
		}
	}
	
	//Moves right by this.x_speed
	this.moveRight = function() {
		if (this.x + this.width1 < canvas.width){ 
			this.x += this.x_speed;
		}
	}
	
	//Spawns PlayerBullet
	this.shoot = function() {
		if (this.bullet == undefined){
			this.bullet = new PlayerBullet(this.x,this.y + this.y_offset);
		}
	}
	
}

//PlayerBullet Object
//Represents the objects fired by the player
//Takes a starting position (x and y)
function PlayerBullet(startX,startY) {
	//starting position
	this.x = startX;
	this.y = startY;
	
	//offset accounts for player's width
	this.x_offset = 15;
	
	//How fast the bullet moves in the y direction
	this.move_speed = 6;
	
	//bullet size
	this.width = 5;
	this.height = 10;
	
	//draw function
	//Draws the bullet each frame
	this.draw = function(){
				
		ctx.beginPath();
		ctx.rect(this.x + this.x_offset, this.y, this.width, this.height);
		ctx.fillStyle = "white";
		ctx.fill();
		ctx.closePath();
	}
	
	//move bullet
	this.move = function(){
		this.y -= this.move_speed;
	}
}

//Enemy object
//Represents the various enemies at the top of the screen 
//Takes a starting position (x and y) and enemy type (1-3)
function Enemy(startX,startY,type) {
	//Starting position
	this.x = startX;
	this.y = startY;
	
	//Enemy size 
	this.width = 20;
	this.height = 20;
	
	//Move distances for enemies
	this.xDistance = 20;
	this.yDistance = 30; 
	
	//Type of enemy used
	this.type = 1;
	
	//Sprites used by game 
	this.img1 = new Image();
	this.img1.src = "invader" + this.type + "1.png";
	this.img2 = new Image();
	this.img2.src = "invader" + this.type + "2.png";
	
	//What motion the enemy is making
	this.drawState = 1;
	
	//Passed 2 (x,y) pairs, it determines if any part of the rectangle formed by the two intersects with the character
	this.inHitbox = function(x1,y1,x2,y2) {
		if (
		this.x < x2 &&
		this.x + this.width > x1 &&
		this.y < y2 && 
		this.y + this.height > y1){
			return true;
		}
		
		return false; 
	}
	
	//Draws the enemy each frame 
	//Needs work!
	this.draw = function(){
		if (this.drawState == 1){
			ctx.drawImage(this.img1,this.x,this.y,this.width,this.height);
		}
	}
	
	//Moves the enemy
	//inputs are "right", "left" or "down"
	this.move = function(direction){
		if (direction == "right"){
			this.x += this.xDistance;
		}
		if (direction == "left"){
			this.x -= this.xDistance;
		}
		if (direction == "down"){
			this.y += this.yDistance; 
		}
	}
	
	//Handles shooting for the enemy object, spawning an EnemyBullet
	this.shoot = function(){
		if (this.bullet == undefined){
			this.bullet = new EnemyBullet(this.x,this.y);
		}
	}
}

//EnemyBullet object
//Represents enemy bullets 
function EnemyBullet(startX,startY) {
	this.x = startX;
	this.y = startY;
	this.x_offset = 15;
	this.move_speed = 6;
	this.width = 5;
	this.height = 10;
	
	//moves and draws the bullet object
	this.draw = function(){
		this.y += this.move_speed;
				
		ctx.beginPath();
		ctx.rect(this.x + this.x_offset, this.y, this.width, this.height);
		ctx.fillStyle = "white";
		ctx.fill();
		ctx.closePath();
	}
}

//gameController object
//Handles the control flow of the game 
function gameController() {
	//current score
	this.score = 0;
	
	//player lives
	this.lives = 3;
	
	//movement variables 
	this.rightPressed = false;
	this.leftPressed = false;
	
	//Player object 
	this.player = undefined;
	
	//true if player object is not destroyed
	this.gameStarted = false; 
	
	//true if wave of enemies has spawned 
	this.waveActive = false;
	
	//true if game is paused
	this.paused = false; 
	
	//Number of enemy rows and columns
	this.enemyColumns = 11;
	this.enemyRows = 5;
	
	//List that holds enemies
	this.enemiesList = [];
	
	//Vars for placement of enemies in their waves at start
	this.enemyRowSpacingX = 50;
	this.enemyStartSpacingX = 235;
	this.enemyRowSpacingY = 50;
	this.enemyStartSpacingY = 60; 
	
	//Movement boundaries for enemies to left and right
	this.rightBoundary = 950;
	this.leftBoundary = 40;
	
	//Timing between enemy movements 
	this.enemyDefaultTime = 80;
	this.enemyTime = this.enemyDefaultTime;

	//Spawn a new wave
	this.newWave = function() {

		//direction invaders move in
		this.direction = "right";
		
		//Loop spawns enemies in lists by column. 
		//It's row/column rather than the traditional col/row to make the right and left boundary checks easier 
		var x = this.enemyStartSpacingX;
		for (var i = 0; i< this.enemyColumns; i++){
			//Add new column 
			this.enemiesList[i] = [];
			
			var y = this.enemyStartSpacingY;
			
			for(var j = 0; j < this.enemyRows; j++){	
				//generate types
				if (j == 0 || j == 1){
					var type = 0;
				}
				if (j == 2 || j == 3){
					var type = 1;
				}
				if (j == 4){
					var type = 2;
				}

				//Fill in enemies list 
				this.enemiesList[i][j] = new Enemy(x,y,type);
				y += this.enemyRowSpacingY;
			}
			
			x += this.enemyRowSpacingX;
		}

	}
	
	//Checks if enemy is hit by bullet
	this.checkEnemyCollisions = function(){
		
		//bullet boundaries
		var x1 = this.player.bullet.x + this.player.bullet.x_offset;
		var x2 = x1 + this.player.bullet.width;
		var y1 = this.player.bullet.y;
		var y2 = y1 + this.player.bullet.height;
		
		//check each enemy object to see if player bullet is colliding
		for (var i = 0; i< this.enemyColumns; i++){
			for(var j = 0; j < this.enemyRows; j++){
				if (this.enemiesList[i][j] != undefined){
					if (this.enemiesList[i][j].inHitbox(x1,y1,x2,y2)) {
						
						//if so, add to score, delete both bullet and enemy, update default time to go faster, then break
						this.score += this.enemiesList[i][j].type *= 10;					
						delete (this.enemiesList[i][j]);
						delete this.player.bullet;
						this.enemyDefaultTime -= 1;
						break; 
					}
				}
			}
		}
	}
	
	//These two function check if the rightmost or leftmost enemies are at the rightmost or leftmost boundaries
	this.checkLeft = function(){
		for (var i = 0; i< this.enemyColumns; i++){
			if (this.enemiesList[i] != []){
				for(var j = 0; j < this.enemyRows; j++){
					if (this.enemiesList[i][j] != undefined){
						if (this.enemiesList[i][j].x <= this.leftBoundary){
							return true;
						}
						else {
							return false;
						}
					}
				}
			}
		}
	}
	this.checkRight = function(){
		for (var i = this.enemyColumns - 1; i >= 0; i--){
			if (this.enemiesList[i] != []){
				for(var j = 0; j < this.enemyRows; j++){
					if (this.enemiesList[i][j] != undefined){
						if (this.enemiesList[i][j].x >= this.rightBoundary){
							return true;
						}
						else {
							return false;
						}
					}
				}
			}
		}
	}
	
	
	//draw player, bullets and enemy objects 
	this.draw = function(){
		//Clears the screen 
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		//Draw score, high score and lives 
		ctx.font = "25px Inconsolata";
		ctx.fillStyle = "white";
		ctx.fillText("SCORE: " + this.score,10,25); 
		ctx.fillText("HI-SCORE: " + this.score,450,25);
		//draw lives
		
		//draw extra text if paused
		if (this.paused == true){
			ctx.fillText("PAUSED",475,375);
		}
		
		//draw player
		this.player.draw();
		
		//draw player bullet
		if (this.player.bullet != undefined){
			this.player.bullet.draw();
		}
		
		//draw enemies 
		for (var i = 0; i< this.enemyColumns; i++){
			for(var j = 0; j < this.enemyRows; j++){
				if (this.enemiesList[i][j] != undefined){
					this.enemiesList[i][j].draw();
				}
			}
		}
	}

	//Handles key inputs 
	this.keyDownHandler = function(e) {
		if(e.keyCode == 39) {
			this.rightPressed = true;
		}
		else if(e.keyCode == 37) {
			this.leftPressed = true;
		}
		else if(e.keyCode == 32) {
			this.player.shoot();
		}
		else if(e.keyCode == 27) {
			if (this.paused == true){
				this.paused = false;
			}
			else{
				this.paused = true; 
			}
		};
	}
	
	//Handles key inputs 
	this.keyUpHandler = function(e) {
		if(e.keyCode == 39) {
			this.rightPressed = false;
		}
		else if(e.keyCode == 37) {
			this.leftPressed = false;
		}
	}
	
	//Main loop of game, where the main control flow happens
	this.mainLoop = function() {
		//Check if player object is started. If not, make player object
		if (this.gameStarted == false){
			this.gameStarted = true;
			this.player = new Player((canvas.width-35)/2,canvas.height-25);
		}
		
		//Check if a new wave needs to be spawned. 
		if (this.waveActive == false){
			this.newWave()
			this.waveActive = true;
		}
		
		if (this.paused == false){
		
			//Handle player movement. 
			if (this.rightPressed == true){
				this.player.moveRight();
			}
			if (this.leftPressed == true){
				this.player.moveLeft();
			}
			
			//Move the enemies every this.enemyDefaultTime frames
			this.enemyTime -= 1;
			if (this.enemyTime == 0) {
					
				//Update enemy movement directions 
				if (this.direction == "down"){
					this.direction = this.nextDir;
				}
				if (this.direction == "left"){
					if (this.checkLeft() == true){
						this.direction = "down";
						this.nextDir = "right";
					}
				}
				if (this.direction == "right"){
					if (this.checkRight() == true){
						this.direction = "down";
						this.nextDir = "left";
					}
				}

				//update all enemies to move to new position
				for (var i = 0; i< this.enemyColumns; i++){
					for(var j = 0; j < this.enemyRows; j++){
						if (this.enemiesList[i][j] != undefined){
							this.enemiesList[i][j].move(this.direction);
						}
					}
				}
				
				//reset frames till move
				this.enemyTime = this.enemyDefaultTime;
			}
			
			//If a player bullet exists, check for collision with enemy objects 
			if (this.player.bullet != undefined){
				this.player.bullet.move();
				this.checkEnemyCollisions();
			}
		}
		//draw all changes
		this.draw();
	};
}

//Canvas object to play the game in
var canvas = document.querySelector("#mainCanvas");
//Context object for canvas
var ctx = canvas.getContext("2d");
//New gameController
var gc = new gameController();

document.addEventListener("keydown", gc.keyDownHandler.bind(gc), false);
document.addEventListener("keyup", gc.keyUpHandler.bind(gc), false);
setInterval(gc.mainLoop.bind(gc),10);