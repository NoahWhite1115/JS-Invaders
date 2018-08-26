//TODO
//1. Display score and lives at top
//2. Make player able to die
//3. Make enemies shoot.
//4. Add barriers.
//5. Add bonus ships
//6. Add game over text. 


function Player(startX,startY) {
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
	
	this.bullet = undefined;
	
	this.draw = function() {
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.width1, this.height1);
		ctx.rect(this.x + this.x_offset, this.y + this.y_offset, this.width2, this.height2);
		ctx.fillStyle = "white";
		ctx.fill();
		ctx.closePath();
		
		if (this.bullet != undefined && this.bullet.y < 0){
			this.bullet = undefined; 
		}
	};

	//Passed 2 (x,y) pairs, it determines if any part of the rectangle formed by the two intersects with the character
	this.inHitbox = function(x1,y1,x2,y2) {
		if ((this.x < x1 && this.x + this.width1 > x1) || (this.x < x2 && this.x + this.width1 > x2)){
			if ((this.y < y1 && this.y + this.height1 > y1) || (this.y < y2 && this.y + this.height1 > y2)){
				return true;
			}
		}
		
		return false; 
	}
	
	this.moveLeft = function() {
		if (this.x > 0){ 
			this.x -= this.x_speed;
		}
	}
	
	this.moveRight = function() {
		if (this.x + this.width1 < canvas.width){ 
			this.x += this.x_speed;
		}
	}
	
	this.shoot = function() {
		if (this.bullet == undefined){
			this.bullet = new PlayerBullet(this.x,this.y + this.y_offset);
		}
	}
	
}

function PlayerBullet(startX,startY) {
	this.x = startX;
	this.y = startY;
	this.x_offset = 15;
	this.move_speed = 6;
	this.width = 5;
	this.height = 10;
	
	this.draw = function(){
		this.y -= this.move_speed;
				
		ctx.beginPath();
		ctx.rect(this.x + this.x_offset, this.y, this.width, this.height);
		ctx.fillStyle = "white";
		ctx.fill();
		ctx.closePath();
	}
}

function Enemy(startX,startY,type) {
	this.x = startX;
	this.y = startY;
	this.width = 20;
	this.height = 20;
	this.xDistance = 20;
	this.yDistance = 30; 
	this.img1 = new Image();
	this.img1.src = "invader" + type + "1.png";
	this.img2 = new Image();
	this.img2.src = "invader" + type + "2.png";
	
	this.type = type;
	
	this.drawState = 1;
	this.state = "alive";
	
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
	
	this.draw = function(){
		if (this.drawState == 1){
			ctx.drawImage(this.img1,this.x,this.y,this.width,this.height);
		}
	}
	
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
	
	this.shoot = function(){
		if (this.bullet == undefined){
			this.bullet = new EnemyBullet(this.x,this.y);
		}
	}
}

function EnemyBullet(startX,startY) {
	this.x = startX;
	this.y = startY;
	this.x_offset = 15;
	this.move_speed = 6;
	this.width = 5;
	this.height = 10;
	
	this.draw = function(){
		this.y += this.move_speed;
				
		ctx.beginPath();
		ctx.rect(this.x + this.x_offset, this.y, this.width, this.height);
		ctx.fillStyle = "white";
		ctx.fill();
		ctx.closePath();
	}
}

function gameController() {
	this.score = 0;
	this.lives = 3;
	this.waveSpeed = 2;
	this.rightPressed = false;
	this.leftPressed = false;
	this.player = new Player((canvas.width-35)/2,canvas.height-25);

	this.rightBoundary = 950;
	this.leftBoundary = 40;
	
	this.waveActive = false;

	this.enemyColumns = 11;
	this.enemyRows = 5;
	this.enemiesList = [];
	this.enemyRowSpacingX = 50;
	this.enemyStartSpacingX = 235;
	this.enemyRowSpacingY = 50;
	this.enemyStartSpacingY = 60; 
	this.enemyDefaultTime = 80;
	this.enemyTime = this.enemyDefaultTime;
	this.direction = "right";

	this.newWave = function() {

		this.direction = "right";
		var x = this.enemyStartSpacingX;
	
		for (var i = 0; i< this.enemyColumns; i++){
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
				
				var type = 1;

				this.enemiesList[i][j] = new Enemy(x,y,type);
				y += this.enemyRowSpacingY;
			}
			
			x += this.enemyRowSpacingX;
		}

	}
	
	this.checkEnemyCollisions = function(){
		var x1 = this.player.bullet.x + this.player.bullet.x_offset;
		var x2 = x1 + this.player.bullet.width;
		var y1 = this.player.bullet.y;
		var y2 = y1 + this.player.bullet.height;
		
		for (var i = 0; i< this.enemyColumns; i++){
			for(var j = 0; j < this.enemyRows; j++){
				if (this.enemiesList[i][j] != undefined){
					if (this.enemiesList[i][j].inHitbox(x1,y1,x2,y2)) {
						this.score += this.enemiesList[i][j].type *= 10;					
						delete (this.enemiesList[i][j]);
						delete this.player.bullet;
						this.enemyDefaultTime -= 1;
						
					}
				}
			}
		}
	}
	
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
	
	
	this.draw = function(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.font = "25px Inconsolata";
		ctx.fillStyle = "white";
		ctx.fillText("SCORE: " + this.score,10,25); 
		//draw hi-score
		//draw lives
		
		this.player.draw();
		
		if (this.player.bullet != undefined){
			this.player.bullet.draw();
		}
		
		for (var i = 0; i< this.enemyColumns; i++){
			for(var j = 0; j < this.enemyRows; j++){
				if (this.enemiesList[i][j] != undefined){
					this.enemiesList[i][j].draw();
				}
			}
		}
	}

	
	this.keyDownHandler = function(e) {
		if(e.keyCode == 39) {
			this.rightPressed = true;
		}
		else if(e.keyCode == 37) {
			this.leftPressed = true;
		}
		else if(e.keyCode == 32) {
			this.player.shoot();
		};
	}
	
	this.keyUpHandler = function(e) {
		if(e.keyCode == 39) {
			this.rightPressed = false;
		}
		else if(e.keyCode == 37) {
			this.leftPressed = false;
		}
	}
	
	this.mainLoop = function() {
		if (this.waveActive == false){
			this.newWave()
			this.waveActive = true;
		}
		
		if (this.rightPressed == true){
			this.player.moveRight();
		}
		if (this.leftPressed == true){
			this.player.moveLeft();
		}
		
		this.enemyTime -= 1;
		if (this.enemyTime == 0) {
				
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

			
			for (var i = 0; i< this.enemyColumns; i++){
				for(var j = 0; j < this.enemyRows; j++){
					if (this.enemiesList[i][j] != undefined){
						this.enemiesList[i][j].move(this.direction);
					}
				}
			}
			
			
			this.enemyTime = this.enemyDefaultTime;
		}
		
		this.draw();
		
		if (this.player.bullet != undefined){
			this.checkEnemyCollisions();
		}
	};
}

var canvas = document.querySelector("#mainCanvas");
var ctx = canvas.getContext("2d");
var gc = new gameController();

document.addEventListener("keydown", gc.keyDownHandler.bind(gc), false);
document.addEventListener("keyup", gc.keyUpHandler.bind(gc), false);
setInterval(gc.mainLoop.bind(gc),10);