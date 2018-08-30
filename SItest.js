//TODO

//1. Little stuff
// make invader types different/ sprites change on move
// Shift invader starting positions right a bit
// Make invaders bigger

//4. Add barriers.
//5. Add bonus ships
//6. Add game over text / Restart handling. / save hi-score as cookie


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
	
	//draws the player object each frame
	this.draw = function() {
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.width1, this.height1);
		ctx.rect(this.x + this.x_offset, this.y + this.y_offset, this.width2, this.height2);
		ctx.fillStyle = "white";
		ctx.fill();
		ctx.closePath();
	};

	//Passed 2 (x,y) pairs, it determines if any part of the rectangle formed by the two intersects with the player sprite
	this.inHitbox = function(x1,y1,x2,y2) {
		if (
		this.x < x2 &&
		this.x + this.width1 > x1 &&
		this.y < y2 && 
		this.y + this.height1 > y1){
			return true;
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
		if (playerBullet == undefined){
			playerBullet = new PlayerBullet(this.x,this.y + this.y_offset);
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
	this.width = 30;
	this.height = 30;
	
	//Move distances for enemies
	this.xDistance = 30;
	this.yDistance = 50; 
	
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
		bulletList.push(new EnemyBullet(this.x,this.y));
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

				
		ctx.beginPath();
		ctx.rect(this.x + this.x_offset, this.y, this.width, this.height);
		ctx.fillStyle = "white";
		ctx.fill();
		ctx.closePath();
	}
	
	this.move = function(){
		this.y += this.move_speed;
	}
}

function Barrier(x,y){
	this.blockList = [];
	this.width = 15;
	this.height = 10;
	
	this.startX = x;
	this.startY = y;
	
	//generate the blocks making up a barrier
	this.generate = function(){
		var y = this.startY;
		for (var i=0; i<4; i++){
			var x = this.startX; 
			for (var j=0; j<4; j++){
				//generate the blocks, skipping 2 in the last row
				if (i != 3 || (j != 1 && j != 2)){
					this.blockList.push(new BarrierBlock(x,y,this.width,this.height));
				}
				
				x += this.width; 
			}
		
			y += this.height;
		}
	}
	
	this.draw = function(){
		for (var i = 0; i < this.blockList.length; i++){
			if (this.blockList[i] != undefined){
				this.blockList[i].draw();
			}
		}
	}
	
	this.inHitbox = function(x1,y1,x2,y2){
		for (var i = 0; i < this.blockList.length; i++){
			if (this.blockList[i] != undefined && this.blockList[i].inHitbox(x1,y1,x2,y2) == true){
				return i; 
			}
		}
		
		return null;
	}
}

function BarrierBlock(x,y,width,height){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	
	this.draw = function(){
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.width, this.height);
		ctx.fillStyle = "white";
		ctx.fill();
		ctx.closePath();
	}
	
	this.inHitbox = function(x1,y1,x2,y2){
		if (
			this.x < x2 &&
			this.x + this.width > x1 &&
			this.y < y2 && 
			this.y + this.height > y1){
				return true;
			}
		
			return false; 
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

	//true if player object is not destroyed
	this.gameStarted = false; 
	
	//true if wave of enemies has spawned 
	this.waveActive = false;
	
	//true if game is paused
	this.paused = false; 
	
	//Number of enemy rows and columns
	this.enemyColumns = 11;
	this.enemyRows = 5;
	
	//There is a 'one in x' chance an enemy will shoot this time.
	this.shot_chance = 2;
	
	//Used to store wait times between death and rounds 
	this.delay = -1;
	
	//Vars for placement of enemies in their waves at start
	this.enemyRowSpacingX = 50;
	this.enemyStartSpacingX = 235;
	this.enemyRowSpacingY = 50;
	this.enemyStartSpacingY = 60; 
	
	//vars for barrier spacing
	this.barrierStartX = 130;
	this.barrierSpacingX = 225;
	
	//Movement boundaries for enemies to left and right
	this.rightBoundary = 930;
	this.leftBoundary = 40;
	
	//Timing between enemy movements 
	this.enemyDefaultTime = 40;
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
			enemiesList[i] = [];
			
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
				enemiesList[i][j] = new Enemy(x,y,type);
				y += this.enemyRowSpacingY;
			}
			
			x += this.enemyRowSpacingX;
		}

	}
	
	this.waveReset = function(){
		//reset direction
		this.direction = "right";

		//
		var x = this.enemyStartSpacingX;
		for (var i = 0; i< this.enemyColumns; i++){
			//
			var y = this.enemyStartSpacingY;
			for(var j = 0; j < this.enemyRows; j++){	
				
				if (enemiesList[i][j] != undefined){
					enemiesList[i][j].x = x;
					enemiesList[i][j].y = y; 
				}
				
				y += this.enemyRowSpacingY;
			}
			
			x += this.enemyRowSpacingX;
		}
	}

	this.barrierReset = function(){
		var x = this.barrierStartX; 
		var y = 660;
		
		barrierList = [];
		
		for (var i = 0; i < 4; i++){
			barrierList.push(new Barrier(x,y))
			barrierList[i].generate();
			x += this.barrierSpacingX;
			
		}
	}
	
	//Checks if enemy is hit by bullet
	this.checkEnemyCollisions = function(){
		
		//bullet boundaries
		var x1 = playerBullet.x + playerBullet.x_offset;
		var x2 = x1 + playerBullet.width;
		var y1 = playerBullet.y;
		var y2 = y1 + playerBullet.height;
		
		//check each enemy object to see if player bullet is colliding
		for (var i = 0; i< this.enemyColumns; i++){
			for(var j = 0; j < this.enemyRows; j++){
				if (enemiesList[i][j] != undefined){
					if (enemiesList[i][j].inHitbox(x1,y1,x2,y2)) {
						
						//if so, add to score, delete both bullet and enemy, update default time to go faster, then break
						this.score += enemiesList[i][j].type *= 10;					
						enemiesList[i][j] = undefined;
						playerBullet = undefined;
						this.enemyDefaultTime -= 1;
						break; 
					}
				}
			}
		}
	}
	
	this.checkPlayerCollisions = function(index){
		
		//bullet boundaries
		var x1 = bulletList[index].x + bulletList[index].x_offset;
		var x2 = x1 + bulletList[index].width;
		var y1 = bulletList[index].y;
		var y2 = y1 + bulletList[index].height;
		
		if (player.inHitbox(x1,y1,x2,y2)){
			bulletList.splice(index, 1);
			player = undefined;
			this.lives -= 1;
			this.gameStarted = false; 
		}
	}
	
	//These two function check if the rightmost or leftmost enemies are at the rightmost or leftmost boundaries
	this.checkLeft = function(){
		for (var i = 0; i< this.enemyColumns; i++){
			if (enemiesList[i] != []){
				for(var j = 0; j < this.enemyRows; j++){
					if (enemiesList[i][j] != undefined){
						if (enemiesList[i][j].x <= this.leftBoundary){
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
			if (enemiesList[i] != []){
				for(var j = 0; j < this.enemyRows; j++){
					if (enemiesList[i][j] != undefined){
						if (enemiesList[i][j].x >= this.rightBoundary){
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
		ctx.beginPath();
		ctx.rect(905, 15, 27, 15);
		ctx.rect(905 + 10, 15 + -8, 7.5, 15);
		ctx.fillStyle = "white";
		ctx.fill();
		ctx.closePath();
		ctx.fillText("X" + this.lives ,940,25);
		
		//draw extra text if paused
		if (this.paused == true){
			ctx.fillText("PAUSED",475,375);
		}
		//Get ready text
		if (this.delay > 0){
			ctx.fillText("GET READY",450,375);
		}
		
		//draw player
		if (player != undefined){
			player.draw();
		}
	
		//draw player bullet
		if (playerBullet != undefined){
			playerBullet.draw();
		}
		
		//draw enemies 
		for (var i = 0; i< this.enemyColumns; i++){
			for(var j = 0; j < this.enemyRows; j++){
				if (enemiesList[i][j] != undefined){
					enemiesList[i][j].draw();
				}
			}
		}
		
		//draw bullets
		for (var i = 0; i < bulletList.length; i++){
			bulletList[i].draw();
		}
		
		//draw barriers
		for (var i = 0; i < barrierList.length; i++){
			barrierList[i].draw();
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
			player.shoot();
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


	//check if bullets are in barrier
	this.barrierCheck = function(){
		
		if (playerBullet != undefined){
			//check player bullet
			var x1 = playerBullet.x + playerBullet.x_offset;
			var x2 = x1 + playerBullet.width;
			var y1 = playerBullet.y;
			var y2 = y1 + playerBullet.height;
			
			for (var i = 0; i < 4; i++){
				var block = barrierList[i].inHitbox(x1,y1,x2,y2);
				
				if (block != null){
					barrierList[i].blockList[block] = undefined;
					playerBullet = undefined; 
				}
			}
		}
		
		for(var i = 0; i < bulletList.length; i++){
			var x1 = bulletList[i].x + bulletList[i].x_offset;
			var x2 = x1 + bulletList[i].width;
			var y1 = bulletList[i].y;
			var y2 = y1 + bulletList[i].height;
			
			for (var j = 0; j < 4; j++){
				var block = barrierList[j].inHitbox(x1,y1,x2,y2);
				
				if (block != null){
					barrierList[j].blockList[block] = undefined;
					bulletList.splice(i, 1); 
				}
			}
		}
	}
	
	//Main loop of game, where the main control flow happens
	this.mainLoop = function() {
		//Check if player object is started. If not, make player object
		if (this.gameStarted == false){
			//reset wave position here
			if (this.waveActive == true){
				this.waveReset();
			}
			
			//clear bullets
			playerBullet = undefined;
			bulletList = []; 
			
			this.barrierReset();
			
			this.gameStarted = true;
			player = new Player((canvas.width-35)/2,canvas.height-25);
			this.delay = 200; 
		}
		
		//Check if a new wave needs to be spawned. 
		if (this.waveActive == false){
			this.newWave();
			//reset player position
			player.x = (canvas.width-35)/2;
			//clear bullets
			playerBullet = undefined;
			bulletList = []; 
			
			this.barrierReset();
			
			this.enemyDefaultTime += 50; 
			
			this.waveActive = true;
			this.delay = 200; 
		}
		
		if (this.paused == false && this.delay < 0){
		
			//Handle player movement. 
			if (this.rightPressed == true){
				player.moveRight();
			}
			if (this.leftPressed == true){
				player.moveLeft();
			}
			
			//Move the enemies every this.enemyDefaultTime frames
			this.enemyTime -= 1;
			if (this.enemyTime == 0) {
				
				//Update enemy movement directions 
				if (this.direction == "down"){
					this.direction = this.nextDir;
				}
				else if (this.direction == "left"){
					if (this.checkLeft() == true){
						this.direction = "down";
						this.nextDir = "right";
					}
				}
				else if (this.direction == "right"){
					if (this.checkRight() == true){
						this.direction = "down";
						this.nextDir = "left";
					}
				}

				//update all enemies to move to new position
				for (var i = 0; i< this.enemyColumns; i++){
					for(var j = 0; j < this.enemyRows; j++){
						if (enemiesList[i][j] != undefined){
							enemiesList[i][j].move(this.direction);
						}
					}
				}
				
				//Enemy Shooting
				if (Math.floor(Math.random() * this.shot_chance) == 0){
					//Get the columns with an enemy still in them.
					var active_cols = [];
					for (var i = 0; i< this.enemyColumns; i++){
						for(var j = this.enemyRows; j >= 0; j--){
							if (enemiesList[i][j] != undefined){
								active_cols.push(enemiesList[i][j]);
								break;
							}
						}
					}
					
					if (active_cols.length != 0){
						var selected = Math.floor(Math.random() * active_cols.length);
						active_cols[selected].shoot();
					}
					//check if wave is done. This isn't the best place to do it, but it works. 
					else{
						this.waveActive = false;
					}
				}
				
				//reset frames till move
				this.enemyTime = this.enemyDefaultTime;
			}
			
			//move the enemy bullets, check for collision and delete any past player
			for(var i = 0; i < bulletList.length; i++){
				bulletList[i].move();
				
				this.checkPlayerCollisions(i);
				
				//delete bullets if past player.
				if (bulletList[i] != undefined && bulletList[i].y > 740){
					bulletList.splice(i, 1);
				}
			}
			
			//If a player bullet exists, move, check for collision with enemy objects, and delete if past enemy 
			if (playerBullet != undefined){
				playerBullet.move();
					
				this.checkEnemyCollisions();

				if (playerBullet != undefined && playerBullet.y < 35) {
					playerBullet = undefined;
				} 
			}
			
			this.barrierCheck();
		}
		
		this.delay -= 1;
		//draw all changes
		this.draw();
	};
}

//Canvas object to play the game in
var canvas = document.querySelector("#mainCanvas");
//Context object for canvas
var ctx = canvas.getContext("2d");
//New gameController

var player = undefined;
var playerBullet = undefined;

var enemiesList = [];
var bulletList = [];
var barrierList = [];

var gc = new gameController();

document.addEventListener("keydown", gc.keyDownHandler.bind(gc), false);
document.addEventListener("keyup", gc.keyUpHandler.bind(gc), false);
setInterval(gc.mainLoop.bind(gc),10);