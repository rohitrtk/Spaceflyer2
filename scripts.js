//Program Space Flyer 2
//Created by Rohit Terry Kisto
//Purpose is to play as a spaceship and advance through different levels of difficulty

//VERSIONS
//V1.0 Created basic structure for the game 22/12/2014
//V1.1 Added backing track & sound effects with mute button. Added effect where the colour of the shields change depending on the shield power. Changed colours of the asteroids 14/01/2015

//PSEUDOCODE
/*
Initialize the spaceflyer
Initialize the movement controls
Initialize the star array 
Initialize the asteroid array
	Small
	Medium
	Large
Initialize score system
Initialize shields
Initialize the hit detection 
Initialize level system
Initialize upgrade shop
Initialize the ranking system dependant on the final score
*/
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var gamestate = 0; //0 = Main Menu, 1 = The Actual Game, 2 = Colour Selection, 3 = Game Over Screen, 4 = Instructions Screen, 5 = Game Shop, 6 = Game Menu 
var spaceflyerModel;
//1 = Grey&Purple, 2 = Grey&Blue, 3 = Grey&Green, 4 = Grey&Cyan, Anything else = White
var colour1, colour2;

var keys = [];

//SPACEFLYER 
var spaceflyer = { //Variables for the spaceflyer
	x: 640,
	y: 680,
	width: 30,
	height: 20,
	radius: 10, //There is a circle drawn behind the flyer that is used to centre the flyer
	speed: 6
}
//The drawing for the spaceflyer
function drawSpaceflyer(x, y, c1, c2) {
	//Hidden circle acting as the spaceflyer x and y position 
	ctx.beginPath();
	ctx.arc(x, y, spaceflyer.radius, 0, Math.PI * 2, false);
	ctx.fill();
	//Spaceflyer main body
	ctx.fillStyle = c1 //------------------------
	ctx.fillRect(x - spaceflyer.width - 15, y - spaceflyer.height/2, spaceflyer.width * 3, spaceflyer.height);
	ctx.fillStyle = "red"
	ctx.font = "bold 13px helvetica"
	ctx.fillText("Space Flyer II", x - 45 , y + 5); //words on the body 
	ctx.fillStyle = c2 //------------------------
	//Spaceflyer triangle body 
	ctx.beginPath();
	ctx.moveTo(x - spaceflyer.width - 15, y - 10);
	ctx.lineTo(x + spaceflyer.width + 15, y - 10);
	ctx.lineTo(x, y - 35);
	ctx.fill();
	ctx.closePath();
	//Dinky rectangles at the bottom 
	ctx.fillRect(x - 15, y + 10, 10, 15);
	ctx.fillRect(x + 8, y + 10, 10, 15);
	//Top rectangles from middle to left to right
	ctx.fillRect(x - 10, y - 50, 20, 30);
	ctx.fillRect(x - spaceflyer.width - 15, y - 30, 10, 20);
	ctx.fillRect(x + spaceflyer.width + 5, y - 30, 10, 20);
	//Top triangle
	ctx.fillStyle = c1 //------------------------
	ctx.beginPath();
	ctx.moveTo(x - 10, y - 50);
	ctx.lineTo(x + 10, y - 50);
	ctx.lineTo(x, y - 70);
	ctx.fill();
	ctx.closePath();
	//Dinky Triangles from left to right
	ctx.beginPath();
	ctx.moveTo(x - spaceflyer.width - 15, y - 30);
	ctx.lineTo(x - spaceflyer.width - 5, y - 30);
	ctx.lineTo(x - spaceflyer.width - 10, y - 45);
	ctx.fill();
	ctx.closePath();
	ctx.beginPath();
	ctx.moveTo(x + spaceflyer.width + 15, y - 30);
	ctx.lineTo(x + spaceflyer.width + 5, y - 30);
	ctx.lineTo(x + spaceflyer.width + 10, y - 45);
	ctx.fill();
	ctx.closePath();
}
//STARS============================================================
//Declaring stars
function drawStar(x, y) {
	ctx.fillStyle = "#FFFFFF"
	ctx.beginPath();
	ctx.arc(x, y, 3, 0, Math.PI * 2, false);
	ctx.fill();
}

var numStars = 200;
var starX = [];
var starY = [];
var starSpeeds = [];

for(var i = 0; i < numStars; i++) {
	starX[i] = 0;
	starY[i] = 710;
	starSpeeds[i] = Math.floor((Math.random() * 10) + 4);
}

//ASTEROIDS=========================================================

function drawSmallAsteroid(x, y) {
	ctx.fillStyle = "#7C5300"
	ctx.beginPath();
	ctx.arc(x, y, 10, 0, Math.PI * 2, false);
	ctx.fill();
}
//Declaring small asteroids
var numSmallAsteroids = 100;
var smAX = [];
var smAY = [];
var smASpeeds = [];

for(var i = 0; i < numSmallAsteroids; i++) {
	smAX[i] = 0;
	smAY[i] = 710;
	smASpeeds[i] = Math.floor((Math.random() * 5) + 4);
}

function drawMediumAsteroid(x, y) {
	ctx.fillStyle = "#754719"
	ctx.beginPath();
	ctx.arc(x, y, 20, 0, Math.PI * 2, false);
	ctx.fill();
}
//Declaring medium asteroids
var numMediumAsteroids = 100;
var meAX = [];
var meAY = [];
var meASpeeds = [];

for(var i = 0; i < numMediumAsteroids; i++) {
	meAX[i] = 0;
	meAY[i] = 710;
	meASpeeds[i] = Math.floor((Math.random() * 3) + 2);
}

function drawLargeAsteroid(x, y) {
	ctx.fillStyle = "#6B2400"
	ctx.beginPath();
	ctx.arc(x, y, 30, 0, Math.PI * 2, false);
	ctx.fill();
}
//Declaring large asteroids
var numLargeAsteroids = 100;
var LAX = [];
var LAY = [];
var LASpeeds = [];

for(var i = 0; i < numLargeAsteroids; i++) {
	LAX[i] = 0;
	LAY[i] = 710;
	LASpeeds[i] = Math.floor((Math.random() * 2) + 1);
}
//==================================================================

var numShieldBars;	//Display for the shield power
var shieldBarX = 10;
var shieldBarY = [90, 110, 130, 150, 170, 190, 210, 230, 250, 270]; 
function drawShieldBar() {
	for(var i = 0; i < numShieldBars; i++) {
		if (shieldPower >= 75) ctx.fillStyle = "#00FF00"
		else if (shieldPower >= 25) ctx.fillStyle = "#FFFF00"
		else if (shieldPower > 0) ctx.fillStyle = "#CC0000"
		ctx.font = "bold 20px helvetica"
		ctx.fillText("Shield Status", 10, 83);
		ctx.fillRect(shieldBarX, shieldBarY[i], 30, 15);
	}
	if (shieldPower >= 220) numShieldBars = 12;
	else if (shieldPower >= 200) numShieldBars = 11;
	else if (shieldPower >= 180) numShieldBars = 10;
	else if (shieldPower >= 160) numShieldBars = 9;
	else if (shieldPower >= 140) numShieldBars = 8;
	else if (shieldPower >= 120) numShieldBars = 7;
	else if (shieldPower >= 100) numShieldBars = 6;
	else if (shieldPower >= 80) numShieldBars = 5;
	else if (shieldPower >= 60) numShieldBars = 4;
	else if (shieldPower >= 40) numShieldBars = 3;
	else if (shieldPower >= 20) numShieldBars = 2;
	else if (shieldPower >= 1) numShieldBars = 1;
	else if (shieldPower <= 0) numShieldBars = 0;		
}
var skillBool = true;
var exBool = true;
var soundBool = true;
var rank;
var shieldPower = 100; //Health
var score = 0;
var timerX = -10;
var timerY = 0;
var skillPoints = 0;
var level;
var mouse = {
x: 0,
y: 0,
down: false
};
var gameSoundtrack = new Audio("B7 Theme.mp3");
gameSoundtrack.loop = true;
gameSoundtrack.play();
var initExplosion = new Audio("Explosion.mp3");
//mouse and keyboard interactions
window.onmousemove = function(e) { //mouseX and mouseY positions
	mouse.x = e.pageX;
	mouse.y = e.pageY;
}
window.onmousedown = function(e) { //Mouse Down function
	mouse.down = true;
}
window.onmouseup = function(e) { //Mouse Up function 
	mouse.down = false;
}
window.addEventListener("keydown", function(e) { //Key Down function 
	keys[e.keyCode] = true;
}, false);
window.addEventListener("keyup", function(e) { //Key Up function
	delete keys[e.keyCode];
}, false);
//==================================================================
function mainMenu() { 
	menuUpdate();
	menuRender();
}

function menuUpdate() { //Updates on the menu
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	starAnimation();
	if (mouse.x > 540 && mouse.y > 484 && mouse.x < 704 && mouse.y < 512 && mouse.down == true) gamestate = 2; //Play Game Button
	if (mouse.x > 528 && mouse.y > 380 && mouse.x < 713 && mouse.y < 410 && mouse.down == true) gamestate = 4; //Instructions Button
}

function menuRender() { //The menu render
	var spaceFlyerLogo = new Image();
	spaceFlyerLogo.onload = function() {
		ctx.drawImage(spaceFlyerLogo, 425, 0);
	}
	spaceFlyerLogo.src = 'spaceFlyerLogo.png';
	ctx.fillStyle = "#800000"
	ctx.font = "bold 30px Lucida Sans Unicode"
	ctx.fillStyle = "#CCCCCC"
	ctx.fillRect(canvas.width / 2 - 80, 375, 190, 30);
	ctx.fillRect(canvas.width / 2 - 68, 475, 165, 30);
	ctx.fillStyle = "red"
	ctx.fillText("Instructions", canvas.width / 2 - 80, 400);
	ctx.fillText("Play Game", canvas.width / 2 - 68, 500);
}

function preGame() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	starAnimation();
	ctx.font = "bold 50px Lucida Sans Unicode"
	ctx.fillStyle = "white"
	ctx.fillRect(canvas.width / 4 + 45, 55, 560, 50);
	ctx.fillStyle = "red"
	ctx.fillText("CHOOSE YOUR FLYER!", canvas.width / 4 + 50, 100);
	drawSpaceflyer(325, 400, "#727272", "#660066"); //spaceFlyerModel 1
	drawSpaceflyer(525, 400, "#727272", "#000099");	//spaceFlyerModel 2
	drawSpaceflyer(725, 400, "#727272", "#003300"); //spaceFlyerModel 3
	drawSpaceflyer(925, 400, "#727272", "#66FFFF"); //spaceFlyerModel 4
	if (mouse.x > 285 && mouse.y > 335 && mouse.x < 365 && mouse.y < 430 && mouse.down == true) {
		spaceflyerModel = 1;
		gamestate = 1; 
	}
	else if (mouse.x > 485 && mouse.y > 335 && mouse.x < 565 && mouse.y < 430 && mouse.down == true) {
		spaceflyerModel = 2;
		gamestate = 1;
	}
	else if (mouse.x > 685 && mouse.y > 335 && mouse.x < 765 && mouse.y < 430 && mouse.down == true) {
		spaceflyerModel = 3;
		gamestate = 1;
	}
	else if (mouse.x > 885 && mouse.y > 335 && mouse.x < 965 && mouse.y < 430 && mouse.down == true) {
		spaceflyerModel = 4;
		gamestate = 1;
	}
	ctx.font = "bold 20px helvetica"
	ctx.fillStyle = "white"
	ctx.fillRect(canvas.width / 15, canvas.height - 120, 50, 22);
	ctx.fillStyle = "red"
	ctx.fillText("Back", canvas.width / 15, canvas.height - 100);
	if (mouse.x > 85 && mouse.y > 605 && mouse.x < 140 && mouse.y < 627 && mouse.down == true) {
		gamestate = 0;
	}
}

function runGame() {
	update();
	render();
}

function update() { //In game updates
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	keyControls();
	borderControls();
	starAnimation();
	timer(timerX, timerY);
	timerY += 11;
	ctx.font = "bold 20px helvetica"
	ctx.fillStyle = "#0ddfff"
	ctx.fillText("Available skill points: " + skillPoints, 960, 80);
	if (timerY > canvas.height) {
		timerY = 0;
		score += 1;
		level = Math.floor(score / 20) + 1;
		if (score % 20 == 0) {
			skillPoints ++ ;
		}
	}
	if (mouse.x > 1058 && mouse.y > 15 && mouse.x < 1116 && mouse.y < 50 && mouse.down == true) { //shop screen
		gamestate = 5;
		
	}
	else if (mouse.x > 1138 && mouse.y > 15 && mouse.x < 1195 && mouse.y < 50 && mouse.down == true) { //menu screen
		gamestate = 6;
	}
	if (mouse.x > 975 && mouse.y > 15 && mouse.x < 1035 && mouse.y < 45 && mouse.down == true) {
		if (soundBool) {
			gameSoundtrack.pause();
			soundBool = false;
		}
		else if (soundBool == false) {
			gameSoundtrack.play();
			soundBool = true;
		}	
	}
	if (shieldPower < 0) gamestate = 3;
	numSmallAsteroids = level * 3;	//declaration of asteroid numbers
	numMediumAsteroids = (level * 2) - 2;
	numLargeAsteroids = (level * 1) - 2;
}

function render() { //The game render
	smallAsteroids(); //small asteroid array
	mediumAsteroids(); //medium asteroid array
	largeAsteroids(); //large asteroid array
	ctx.fillStyle = "Red"
	ctx.font = "bold 20px helvetica";
	ctx.fillText("Score: " + score, 10, 30);
	ctx.fillStyle = "#0ddfff"
	ctx.fillText("Level: " + level, 10, 55);
	ctx.fillStyle = "white"
	ctx.fillRect(canvas.width - 70, canvas.height - 710, 58, 30);
	ctx.fillStyle = "red"
	ctx.fillText("MENU", canvas.width - 70, canvas.height - 690);
	ctx.fillStyle = "white"
	ctx.fillRect(canvas.width - 150, canvas.height - 710, 58, 30);
	ctx.fillStyle = "red"
	ctx.fillText("SHOP", canvas.width - 150, canvas.height - 690);
	ctx.fillStyle = "white"
	ctx.fillRect(canvas.width - 230, canvas.height - 710, 58, 30);
	ctx.fillStyle = "red"
	ctx.fillText("MUTE", canvas.width - 230, canvas.height - 690);
	drawSpaceflyer(spaceflyer.x, spaceflyer.y, colour1, colour2);
	spaceflyerColour();
	drawShieldBar();
	if (gamestate == 3) {
		ctx.fillStyle = "#E64016"
		ctx.beginPath();
		ctx.arc(spaceflyer.x, spaceflyer.y, spaceflyer.radius, 0, Math.PI * 2, false);
		ctx.fill();
		spaceflyer.radius += 10;
		if (exBool) {
			initExplosion.play();
			exBool = false;
		}
		if (spaceflyer.radius > canvas.width) {
			timerY = 0;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			starAnimation();
			rankSystem();
			ctx.font = "40px bold helvetica"
			ctx.fillStyle = "#FFFF00"
			ctx.fillText("You made it to level " + level + "!", 450, 150);
			ctx.fillText("Your rank was", 510, 200);
			ctx.fillText(rank, canvas.width - 630, 250);
			ctx.fillStyle = "white"
			ctx.fillRect(530, 470, 190, 40);
			ctx.fillStyle = "red"
			ctx.fillText("Play Again", 530, 500);
			if (mouse.x > 530 && mouse.y > 470 && mouse.x < 730 && mouse.y < 520 && mouse.down == true) gameReset();
		}
	}
	if (gamestate == 5) {
		shopMenu();
	}
	if (gamestate == 6) {
		inGameMenu();
	}
}
function keyControls() { //left&right arrow
	if(keys[37]) spaceflyer.x -= spaceflyer.speed;
	if(keys[39]) spaceflyer.x += spaceflyer.speed;
}

function borderControls() { //sets the boundries for the spaceflyer
	if(spaceflyer.x < 0) spaceflyer.x = 0;
	if(spaceflyer.x > canvas.width) spaceflyer.x = canvas.width;
}

function timer(x, y) {
	ctx.fillStyle = "green"
	ctx.fillRect(x, y, 10, 10);
}

function spaceflyerColour() { //Initializes the colour of the spaceflyer
	//1 = Grey&Purple, 2 = Grey&Blue, 3 = Grey&Green, 4 = Grey&Cyan, Anything else = White
	if (spaceflyerModel == 1) {
		colour1 = "#727272"
		colour2 = "#660066"
	}
	else if (spaceflyerModel == 2) {
		colour1 = "#727272"
		colour2 = "#000099"
	}
	else if (spaceflyerModel == 3) {
		colour1 = "#727272"
		colour2 = "#003300"
	}
	else if (spaceflyerModel == 4) {
		colour1 = "#727272"
		colour2 = "#66FFFF"
	}
	else {
		colour1 = "#FFFFFF"
		colour2 = "#FFFFFF"
	}
}

function starAnimation() { //star array
	for (var i = 0; i < numStars; i++) {
		drawStar(starX[i], starY[i]);
		starY[i] += starSpeeds[i];
		
		if (starY[i] > 720) {
			starY[i] = -100;
			starX[i] = Math.floor((Math.random() * canvas.width) + 1);
			starSpeeds[i] = Math.floor((Math.random() * 10) + 4);
		}
	}
}

function smallAsteroids() { //small asteroid array
	for (var i = 0; i < numSmallAsteroids; i++) {
		drawSmallAsteroid(smAX[i], smAY[i]);
		smAY[i] += smASpeeds[i];
		
		if (smAY[i] > 720) {
			smAY[i] = -100;
			smAX[i] = Math.floor((Math.random() * canvas.width) + 1);
			smASpeeds[i] = Math.floor((Math.random() * 10) + 4);
		}
		
		var distance;
		distance = Math.sqrt(((spaceflyer.x - smAX[i]) * (spaceflyer.x - smAX[i]) +
							((spaceflyer.y - smAY[i]) * (spaceflyer.y - smAY[i]))));
		if (distance < spaceflyer.width + 10) {
			shieldPower -= 5;
			smAY[i] = -100;
			smAX[i] = Math.floor((Math.random() * canvas.width) + 1);
			smASpeeds[i] = Math.floor((Math.random() * 10) + 4);
		}
		/* Old detect hit statement 
		if(spaceflyer.x + spaceflyer.width + 10 > smAX[i]
		&& spaceflyer.x < smAX[i] + spaceflyer.width + 10
		&& spaceflyer.y + spaceflyer.width + 10 > smAY[i]
		&& spaceflyer.y < smAY[i] + spaceflyer.width + 10) {
			shieldPower -= 10;
		}
		*/
	}
}

function mediumAsteroids() { //medium asteroid array
	for (var i = 0; i < numMediumAsteroids; i++) {
		drawMediumAsteroid(meAX[i], meAY[i]);
		meAY[i] += meASpeeds[i];
		
		if (meAY[i] > 720) {
			meAY[i] = -100;
			meAX[i] = Math.floor((Math.random() * 1280) + 1);
			meASpeeds[i] = Math.floor((Math.random() * 10) + 4);
		}
		
		var distance;
		distance = Math.sqrt(((spaceflyer.x - meAX[i]) * (spaceflyer.x - meAX[i]) +
							((spaceflyer.y - meAY[i]) * (spaceflyer.y - meAY[i]))));
		if (distance < spaceflyer.width + 10) {
			shieldPower -= 10;
			meAY[i] = -100;
			meAX[i] = Math.floor((Math.random() * canvas.width) + 1);
			meASpeeds[i] = Math.floor((Math.random() * 10) + 4);
		}
	}
}

function largeAsteroids() { //large asteroid array
	for (var i = 0; i < numLargeAsteroids; i++) {
		drawLargeAsteroid(LAX[i], LAY[i]);
		LAY[i] += LASpeeds[i];
		
		if (LAY[i] > 720) {
			LAY[i] = -100;
			LAX[i] = Math.floor((Math.random() * canvas.width) + 1);
			LASpeeds[i] = Math.floor((Math.random() * 10) + 4);
		}
		
		var distance;
		distance = Math.sqrt(((spaceflyer.x - LAX[i]) * (spaceflyer.x - LAX[i]) +
							((spaceflyer.y - LAY[i]) * (spaceflyer.y - LAY[i]))));
		if (distance < spaceflyer.width + 10) {
			shieldPower -= 20;
			LAY[i] = -100;
			LAX[i] = Math.floor((Math.random() * canvas.width) + 1);
			LASpeeds[i] = Math.floor((Math.random() * 10) + 4);
		}
	}
}

function inGameMenu() { //yes and no menu in game
	ctx.fillStyle = "white"
		ctx.fillRect(canvas.width / 3, canvas.height / 4, 400, 300);
		ctx.fillStyle = "red"
		ctx.font = "bold 25px helvetica"
		ctx.fillText("Are you sure you want to go back", canvas.width / 3, canvas.height / 4 + 25)
		ctx.fillText("to the main menu?", canvas.width / 3 + 100, canvas.height / 4 + 50);
		ctx.fillStyle = "#B2B2B2"
		ctx.fillRect(canvas.width / 3 + 50, canvas.height - 400, 100, 40);
		ctx.fillRect(canvas.width / 3 + 250, canvas.height - 400, 100, 40);
		ctx.fillStyle = "red"
		ctx.fillText("Yes", canvas.width / 3 + 75, canvas.height - 375);
		ctx.fillText("No", canvas.width / 3 + 280, canvas.height - 375);
		if (mouse.x > 460 && mouse.y > 327 && mouse.x < 548 && mouse.y < 367 && mouse.down == true) { //yes button
			gamestate = 0;
		}
		else if (mouse.x > 640 && mouse.y > 327 && mouse.x < 748 && mouse.y < 367 && mouse.down == true) { //no button
			gamestate = 1;
		}
}

function shopMenu() {	//shop menu
	spaceflyer.y = 800;
	var shieldIcon = new Image(); //shield image
	var bootsIcon = new Image(); //boots image
	ctx.fillStyle = "white"
	ctx.fillRect(canvas.width - 900, 50, 600, 600);
	ctx.fillStyle = "#B2B2B2"
	ctx.fillRect(canvas.width - 890, 60, 90, 32)
	ctx.font = "bold 40px helvetica"
	ctx.fillStyle = "red"
	ctx.fillText("Power Ups", canvas.width - 700, 90);
	ctx.font = "bold 20px helvetica"
	ctx.fillText("Back", canvas.width - 870, 85);
	ctx.fillText("Available skill points: " + skillPoints, 310, 120);
	ctx.fillText("Click on the picture to apply upgrade", 310, 150);
	shieldIcon.onload = function() {
		ctx.drawImage(shieldIcon, 300, 200)
	}
	shieldIcon.src = 'shield_icon.png'
	bootsIcon.onload = function() {
		ctx.drawImage(bootsIcon, 300, 350)
	}
	bootsIcon.src = 'boots_icon.png'
	if (mouse.x > 308 && mouse.y > 215 && mouse.x < 370 && mouse.y < 280 && skillPoints > 0 && mouse.down == true) {
		if (skillBool) {
			if (shieldPower < 100) {
				shieldPower = 100;
			}
			shieldPower += 4;
			skillPoints -= 1;
			skillBool = false;
		}
	}
	if (mouse.down == false)
	{
		skillBool = true;
	}
	
	ctx.font = "bold 15px helvetica"
	ctx.fillText("Upgrades how many shields you have allowing you to get hit more", 378, 215);
	if (mouse.x > 308 && mouse.y > 360 && mouse.x < 370 && mouse.y < 420 && skillPoints > 0 && mouse.down == true) {
		spaceflyer.speed += 0.5;
		skillPoints -= 1;
	}
	ctx.fillText("Upgrades ships speed allowing you to move faster", 378, 360);	
	if (mouse.x > 318 && mouse.y > 69 && mouse.x < 410 && mouse.y < 99 && mouse.down == true) { //back button
		gamestate = 1;
		spaceflyer.y = 680;
	}
}

function instructions() { //game instructions
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#CCCCCC"
	ctx.fillRect(200, 400, 100, 50);
	ctx.fillRect(975, 400, 100, 50);
	ctx.fillStyle = "red"
	ctx.font = "bold 40px helvetica"
	ctx.fillText("Instructions", 500, 50);
	ctx.font = "bold 20px helvetica"
	ctx.fillText("The aim of the game is to survive as long as possible while dodging asteroids", 250, 100);
	ctx.fillText("of different sizes. You will gain points every second and the amount of points", 250, 125);
	ctx.fillText("you have will determine what level you are on. As you advance through the levels", 250, 150);
	ctx.fillText("the number of asteroids will increase making it more difficult. Each time your", 250, 175);
	ctx.fillText("level increases, you will gain a skill point. You can spend these skill points", 250, 200);
	ctx.fillText("in the shop on upgrades which will help you as the levels increase. Use the arrow", 250, 225);
	ctx.fillText("keys to move your flyer around. Good Luck Commander!", 325, 250);
	ctx.fillText("Back", 220, 430);
	ctx.fillText("Play", 1000, 430);
	if (mouse.x > 200 && mouse.y > 400 && mouse.x < 305 && mouse.y < 460 && mouse.down == true) gamestate = 0;
	if (mouse.x > 975 && mouse.y > 400 && mouse.x < 1085 && mouse.y < 460 && mouse.down == true) gamestate = 2;
} 

function rankSystem() { //rank declaration 
	if (level == 1) rank = "Scrub";
	else if (level == 2) rank = "Crewman 3rd Class";
	else if (level == 3) rank = "Crewman 2nd Class";
	else if (level == 4) rank = "Crewman 1st Class";
	else if (level == 5) rank = "Ensign";
	else if (level == 6) rank = "Lieutenant";
	else if (level == 7) rank = "Commander";
	else if (level == 8) rank = "Captain";
	else if (level == 9) rank = "Commodore";
	else if (level == 10) rank = "Lieutenant Admiral";
	else if (level == 11) rank = "Major Admiral";
	else if (level >= 12) rank = "Admiral";
}

function gameReset() { //reseting the variables
	gamestate = 0;
	spaceflyer = {
	x: 640,
	y: 680,
	width: 30,
	height: 20,
	radius: 10,
	speed: 6
	}	
	shieldPower = 100; 
	score = 0;
	timerX = -10;
	timerY = 0;
	skillPoints = 0;
	level = 0;
	exBool = true;
}

function makeButton(x, y, l, w, text, runFunction) {
	ctx.font = "bold 25px helvetica"
	ctx.fillStyle = "white";
	ctx.fillRect(x, y, l, w);
	ctx.fillStyle = "red";
	ctx.fillText(text, x + 15, y + 5);
	if (mouse.x > x && mouse.y > y && mouse.x < l && mouse.y < w && mouse.down == true) {
		runFunction;
	}
}

setInterval(function() { //Draw Loop
	if (gamestate == 0) mainMenu();
	else if (gamestate == 1 || gamestate == 3 || gamestate == 5 || gamestate == 6) runGame(); 
	else if (gamestate == 2) preGame();
	else if (gamestate == 4) instructions(); 
	else if (gamestate == 5) shopMenu(); 
}, 1000/60);