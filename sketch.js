/*

The Game Project 7 - Bring it all together

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;
var lives;
var score;
var deathtimer;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var JumpDuration;
var fireworkDuration;
var platforms;
var enemies;

//Declare Sound variables
var jumpSound;
var collectSound;
var loseLiveSound;
var backgroundTrack;

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
	collectSound = loadSound('assets/collectcoin.wav');
	collectSound.setVolume(0.1);
	loseLiveSound = loadSound('assets/loseLive.wav');
	loseLiveSound.setVolume(0.1);
	slimeJump = loadSound('assets/slime.wav');
	slimeJump.setVolume(0.1);
	backgroundTrack = loadSound('assets/Bruv Protecta.wav');
	backgroundTrack.setVolume(0.1);
}

function setup()
{
	createCanvas(1024, 576);	
	//Initial of floor position
	floorPos_y = height * 4/5;	
	//Initial values of Lives and Score
	lives = 3;
	score = 0;
	startGame();	
	//Initiate Background 
	//Track DOES NOT WORK  Maybe file too big to play in setup
	//backgroundTrack.play(); 	
	//Level Design for collectables;
	collectables = [
		//hidden left
		{x_pos:50,y_pos:floorPos_y - 50,size: 1},
		{x_pos:50,y_pos:floorPos_y - 125,size: 1},
		{x_pos:50,y_pos:floorPos_y - 200,size: 1},
		{x_pos:50,y_pos:floorPos_y - 275,size: 1},
		{x_pos:50,y_pos:floorPos_y - 350,size: 1},
		//Enemy Jump
		{x_pos:850,y_pos:floorPos_y,size: 1},
		{x_pos:1150,y_pos:floorPos_y,size: 1},
		//first platforms
		{x_pos:1325,y_pos:floorPos_y-400,size: 1},
		{x_pos:1408,y_pos:floorPos_y-400,size: 1},
		{x_pos:1491,y_pos:floorPos_y-400,size: 1},
		{x_pos:1575,y_pos:floorPos_y-400,size: 1},
		// Enemey 3
		{x_pos:1850,y_pos:floorPos_y,size: 1},
		{x_pos:2250,y_pos:floorPos_y,size: 1},
		//Platform 2
		{x_pos:2400,y_pos:floorPos_y-150,size: 1},
		{x_pos:2480,y_pos:floorPos_y-200,size: 1},
		{x_pos:2560,y_pos:floorPos_y-150,size: 1},
		{x_pos:2640,y_pos:floorPos_y-200,size: 1},
		{x_pos:2720,y_pos:floorPos_y-150,size: 1},
		{x_pos:2800,y_pos:floorPos_y-200,size: 1},
		//Jumping Platforms
		{x_pos:3400,y_pos:floorPos_y-130,size: 1},
		{x_pos:3500,y_pos:floorPos_y-130,size: 1},
		{x_pos:3650,y_pos:floorPos_y-230,size: 1},
		{x_pos:3750,y_pos:floorPos_y-230,size: 1},
		{x_pos:3900,y_pos:floorPos_y-330,size: 1},
		{x_pos:4000,y_pos:floorPos_y-330,size: 1},
		//Enemies Jump
		{x_pos:4300,y_pos:floorPos_y,size: 1},
		{x_pos:4500,y_pos:floorPos_y,size: 1},
		{x_pos:4600,y_pos:floorPos_y-100,size: 1},	
		{x_pos:4700,y_pos:floorPos_y,size: 1},
		{x_pos:4800,y_pos:floorPos_y-100,size: 1},
		{x_pos:4900,y_pos:floorPos_y,size: 1},
		{x_pos:5000,y_pos:floorPos_y,size: 1},
		//Puzzle Jump First Row
		{x_pos:5175,y_pos:floorPos_y-130,size: 1},
		{x_pos:5375,y_pos:floorPos_y-130,size: 1},
		{x_pos:5575,y_pos:floorPos_y-130,size: 1},
		{x_pos:5775,y_pos:floorPos_y-130,size: 1},
		{x_pos:5975,y_pos:floorPos_y-130,size: 1},
		//Puzzle Jump Second Row
		{x_pos:5275,y_pos:floorPos_y-230,size: 1},
		{x_pos:5475,y_pos:floorPos_y-230,size: 1},
		{x_pos:5675,y_pos:floorPos_y-230,size: 1},
		{x_pos:5875,y_pos:floorPos_y-230,size: 1},
		//Puzzle Jump Third Row
		{x_pos:5175,y_pos:floorPos_y-330,size: 1},
		{x_pos:5375,y_pos:floorPos_y-330,size: 1},
		{x_pos:5575,y_pos:floorPos_y-330,size: 1},
		{x_pos:5775,y_pos:floorPos_y-330,size: 1},
		{x_pos:5975,y_pos:floorPos_y-330,size: 1},
		//Puzzle Jump Fourth Row
		{x_pos:5275,y_pos:floorPos_y-430,size: 1},
		{x_pos:5475,y_pos:floorPos_y-430,size: 1},
		{x_pos:5675,y_pos:floorPos_y-430,size: 1},
		{x_pos:5875,y_pos:floorPos_y-430,size: 1},			
	];	
	// Correcting the distance between floor and collectable no matter the  object scale
	for(var i=0;i < collectables.length;i++)
	{
		if(collectables[i].y_pos == floorPos_y)
		{
			collectables[i].y_pos = floorPos_y - collectables[i].size * 20 - 10;
		}	
	}	
}

function startGame()
{
	//Initial values of variables
	gameChar_x = width/2;
	gameChar_y = floorPos_y;
	deathtimer = 0;
	// Variable to control the background scrolling.
	scrollPos = -100;
	// Variable to store the real position of the gameChar in the gameworld. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
	// Initialise arrays of scenery objects.	
	//Initialize trees array and populate it
	trees_x = [];
	trees_y = floorPos_y;
	// Minimum Tree Distance
	minTreeDistance = 200;
	//Ammount of Trees
	treeAmt = 20;
	//Poulate Trees_x array
	for(var t = 0; t < treeAmt; t++)
	{
		//Create new tree
		trees_x.push(t*325+random(-100,100));
	}		
	//Initialize clouds array and populate it with random clouds
	clouds = [];
	//Amount of clouds
	cloudAmt = 100;	
	//Populate Clouds Array
	for(var c = 0; c < cloudAmt; c++)
	{
		clouds.push({x_pos:random(0,3000), y_pos:random(0,height/2), size: floor(random(1,5))});
	}	
	//Initialize big Mountains array and populate it
	bigMountains =[];
	// Amount of big Mountains
	bigMountainsAmt = 10;
	// Populate BigMountains Array
	for(bm = 0; bm < bigMountainsAmt; bm++)
	{
		bigMountains.push({x_pos: random(0,3000), y_pos: floorPos_y,size: floor(random(5,10))});
	}	
	//Initialize small Mountains array and populate it
	smallMountains =[];
	// Amount of big Mountains
	smallMountainsAmt = 40;
	// Populate BigMountains Array
	for(bm = 0; bm < smallMountainsAmt; bm++)
	{
		smallMountains.push({x_pos: random(0,6000), y_pos: floorPos_y,size: floor(random(4,10))});
	}	
	//Initialize flagpole Object	
	flagpole = {x_pos: 6500,
				size: 1,
				isReached: false
	}	
	//Initialize firework Object
	fireworkPos = {
			x_Pos1: [20,60,100,170,-20,-60,-100,-170],
			y_Pos1: [30,110,190,270,30,110,190,270],
			x_Pos2: [30,70,110,170,-30,-70,-110,-170],
			y_Pos2: [50,140,230,270,50,140,230,270],
			index: 0
		}	
	//Initialize Lives UI Object
	livesPos = {
		x_pos: 30,
		y_pos: 30,
		size: 1
	}	
	// Level Design with obstacles, platforms, enemies
	canyons = [
				//hidden
				{x_pos:-100,width: 300},
				//first jump
			   	{x_pos:750,width: 50},
				//first platforms
				{x_pos:1200,width: 600},
				//second jump
				{x_pos:2300,width: 700},
				//Platform Jumps
				{x_pos:3300,width: 1000},
				//Puzzle Jump
				{x_pos:5100,width:1000},
				//Last
				{x_pos:8000,width:10},
		];
	platforms = [];
	platforms.push(new CreatePlatform(0,floorPos_y-400,100,"vertical",380,1));
	platforms.push(new CreatePlatform(1250,floorPos_y-200,50,"vertical",100,1.2));
	platforms.push(new CreatePlatform(1300,floorPos_y-300,100,"horizontal",300,1.5));
	platforms.push(new CreatePlatform(2350,floorPos_y-50,100,"horizontal",500,3));
	platforms.push(new CreatePlatform(3350,floorPos_y-100,200,""));
	platforms.push(new CreatePlatform(3600,floorPos_y-200,200,""));
	platforms.push(new CreatePlatform(3850,floorPos_y-300,200,""));
	//Jump Puzzle First Row
	platforms.push(new CreatePlatform(5150,floorPos_y-100,50,""));
	platforms.push(new CreatePlatform(5350,floorPos_y-100,50,""));
	platforms.push(new CreatePlatform(5550,floorPos_y-100,50,""));
	platforms.push(new CreatePlatform(5750,floorPos_y-100,50,""));
	platforms.push(new CreatePlatform(5950,floorPos_y-100,50,""));
	//Jump Puzzle Second Row
	platforms.push(new CreatePlatform(5250,floorPos_y-200,50,""));
	platforms.push(new CreatePlatform(5450,floorPos_y-200,50,""));
	platforms.push(new CreatePlatform(5650,floorPos_y-200,50,""));
	platforms.push(new CreatePlatform(5850,floorPos_y-200,50,""));
	//Jump Puzzle Third Row
	platforms.push(new CreatePlatform(5150,floorPos_y-300,50,""));
	platforms.push(new CreatePlatform(5350,floorPos_y-300,50,""));
	platforms.push(new CreatePlatform(5550,floorPos_y-300,50,""));
	platforms.push(new CreatePlatform(5750,floorPos_y-300,50,""));
	platforms.push(new CreatePlatform(5950,floorPos_y-300,50,""));
	//Jump Puzzle Fourth Row
	platforms.push(new CreatePlatform(5250,floorPos_y-400,50,""));
	platforms.push(new CreatePlatform(5450,floorPos_y-400,50,""));
	platforms.push(new CreatePlatform(5650,floorPos_y-400,50,""));
	platforms.push(new CreatePlatform(5850,floorPos_y-400,50,""));	
	enemies = [];	
	enemies.push(new CreateEnemy(350,floorPos_y,"standing"));
	enemies.push(new CreateEnemy(850,floorPos_y,"running",200,1));
	enemies.push(new CreateEnemy(2050,floorPos_y,"surprise jump"));
	enemies.push(new CreateEnemy(3355,floorPos_y-105,"running",190,2));
	enemies.push(new CreateEnemy(3605,floorPos_y-205,"running",190,2));
	enemies.push(new CreateEnemy(3855,floorPos_y-305,"running",190,2));
	enemies.push(new CreateEnemy(4400,floorPos_y-305,"running",600,3));
	enemies.push(new CreateEnemy(4600,floorPos_y-305,"jumping",400,1));
	enemies.push(new CreateEnemy(4800,floorPos_y-305,"surprise jump",400,1));
}

function draw()
{
	// fill the sky blue
	background(100, 155, 255); 
	// draw some green ground
	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); 
	// Draw clouds with set scrolling speed
	push();	// Start new drawing style
	translate(scrollPos*0.1,0); //Translate value for cloud scrolling
	drawClouds();
	pop();
	// Draw Big Mountains with set scrolling speed
	push();	// Start new drawing style
	translate(scrollPos*0.3,0); //Translate value for big Mountain scrolling
	drawBigMountains();
	pop();
	// Draw Small Mountains with set scrolling speed
	push();	// Start new drawing style
	translate(scrollPos*0.6,0); //Translate value for small Mountain scrolling
	drawSmallMountains();
	pop();
	// Draw forground with set scrolling speed
	push();	// Start new drawing style
	translate(scrollPos,0); // regular scrolling for forground objects
	// Draw trees.
	drawTrees();
	// Draw canyons.
	for(var i = 0; i < canyons.length; i++)
	{
		drawCanyon(canyons[i]);
		checkCanyon(canyons[i]);
	}
	// Draw collectable items
	for(var j = 0; j < collectables.length; j++)
	{
		if(collectables[j].isFound == true){continue;}
		drawCollectable(collectables[j]);
		checkCollectable(collectables[j]);
	}	
	// Draw the flagpole	
	renderFlagpole(flagpole);
	if(!flagpole.isReached)
	{
		checkFlagpole();
	}	
	// Draw platforms	
	for(var i = 0; i < platforms.length; i++)
	{
		platforms[i].draw();
		platforms[i].update();
	}
	// Draw enemies	
	for(var i = 0; i < enemies.length; i++)
	{
		enemies[i].draw();
		enemies[i].update();
		enemies[i].checkCollision(gameChar_world_x,gameChar_y-40);
	}
	// Reset drawing style for no scrolling
	pop();		
	// Draw game character.
	drawGameChar();	
	//End Game States
	// Game Over
	if(lives == 0)
	{
		textSize(100);
		text("Game Over",width/2 - 270,height/2);
		textSize(30);
		text("Your Score:" + score,width/2-100,height/2+35);		
		text("Press Spacebar to Restart",width/2-180,height/2+70);
		stroke(0);
		return;
	}
	// Winning Screen
	if(flagpole.isReached)
	{
		textSize(100);
		text("Level Complete",width/2 - 270,height/2);
		textSize(30);
		text("Your Score:" + score,width/2-100,height/2+35);		
		text("Press Spacebar to Restart",width/2-180,height/2+70);
		stroke(0);
		return;
	}		
	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5; // move GameChar left
		}
		else
		{
			if(gameChar_world_x != 0)
			{
				scrollPos += 5; // move background right
			}
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.6)
		{
			gameChar_x  += 5; // move gameChar right
		}
		else
		{
			if(gameChar_world_x != 10000)
			{
				scrollPos -= 5; // move background left
			}
		}
	}
	// Logic to make the game character fall after jumping
	if(frameCount >= JumpDuration)
	{
		if (abs(dist(gameChar_world_x,gameChar_y,gameChar_world_x,floorPos_y)) < 5)
		{
			gameChar_y = floorPos_y;
			isFalling = false
		}
		else
		{
			var isContact = false;
			for(var i=0; i<platforms.length;i++)
			{
				if(platforms[i].checkContact(gameChar_world_x,gameChar_y))
				{
					isContact = true;
					if(platforms[i].direction == "vertical")
					{
						gameChar_y = platforms[i].currenty;
					}
					else if (platforms[i].direction == "horizontal")
					{
						gameChar_x += platforms[i].speed;
					}					

					break;
				}
			}
			if(!isContact)
			{
				gameChar_y += 5;
			}
			else
			{
				isFalling = false;
			}

		}
	}
	// Update real position of gameChar for collision detection.
		gameChar_world_x = constrain(gameChar_x - scrollPos,0,6500);
	//Logic for Jump
		if(frameCount < JumpDuration)
		{
			gameChar_y -= 10;	
		}
	//Logic for Respawn
		if(gameChar_y > height)
		{			
			//decrease lives by 1
			lives -= 1;
			loseLiveSound.play();
			if(lives>0)
			{
				//Reset Game
				startGame();	
			}			
		}
	//Information Interface for Lives and Score during play
		drawLives(livesPos);
		fill(0);
		textSize(30);
		text("Score: " + score,850,35);
}
// ---------------------
// Key control functions
// ---------------------
function keyPressed()
{
	if (keyCode == 65) // A Key to love left
		{
			isLeft = true;	
		}
	
	if (keyCode == 68) // D Key to move right
		{
			isRight = true;
		}
	
	if (keyCode == 87 && !isFalling) // W Key to jump when on floor level
		{
			//gameChar_y -= 150;
			JumpDuration = frameCount + 15;
			isFalling = true;
			jumpSound.play();
		}
	if(keyCode == 32 && (flagpole.isReached || lives == 0))
	   {
	   	setup();
	   }
}
function keyReleased()
{

	if (keyCode == 65) // A Key to stop moving left
		{
			isLeft = false;
		}
	
	if (keyCode == 68) // D Key to stop moving right
		{
			isRight = false;
		}
}
// ------------------------------
// Game character render function
// ------------------------------
// Function to draw the game character.
function drawGameChar()
{
	// draw game character
	//Jump Left Drawing
	if(isLeft && isFalling)
	{
		//hair back
			fill(0);
			ellipse(gameChar_x - 3,gameChar_y - 50,25,35);
		//backpack
			fill(139,69,19);
			ellipse(gameChar_x + 5,gameChar_y-25,30,30)
		//hand behind
			fill(255,218,185)
			ellipse(gameChar_x - 12,gameChar_y - 70,8,8);
		//body
			fill(220,20,60);
			ellipse(gameChar_x - 5,gameChar_y-20,15,40);
		//face
			fill(255,218,185);
			rect(gameChar_x - 12,gameChar_y - 60,10,25,3);
			ellipse(gameChar_x - 4,gameChar_y-47,15,23);
		//hand front
			fill(255,218,185)
			ellipse(gameChar_x + 3,gameChar_y - 70,8,8);
		//eyes
			fill(255);
			ellipse(gameChar_x - 10,gameChar_y - 45,5,10);
			fill(0);
			ellipse(gameChar_x - 11,gameChar_y - 44,3,5);
		//hair front
			fill(0);
			triangle(gameChar_x-13,gameChar_y - 50 // bottom 
					 ,gameChar_x,gameChar_y - 61 // top right
					 ,gameChar_x - 13,gameChar_y - 61); // top left
			triangle(gameChar_x-3,gameChar_y-61,// top left
					 gameChar_x+6,gameChar_y-61 // top right
					 ,gameChar_x+6,gameChar_y-40); // bottom
	}
	// Jump Right Drawing
	else if(isRight && isFalling)
	{
		//hair back
			fill(0);
			ellipse(gameChar_x + 3,gameChar_y - 50,25,35);
		//backpack
			fill(139,69,19);
			ellipse(gameChar_x - 5,gameChar_y-25,30,30)
		//hand behind
			fill(255,218,185)
			ellipse(gameChar_x + 12,gameChar_y - 70,8,8);
		//body
			fill(220,20,60);
			ellipse(gameChar_x + 5,gameChar_y-20,15,40);
		//face
			fill(255,218,185);
			rect(gameChar_x + 2,gameChar_y - 60,10,25,3);
			ellipse(gameChar_x + 3,gameChar_y-47,15,23);
		//hand front
			fill(255,218,185)
			ellipse(gameChar_x - 3,gameChar_y - 70,8,8);
		//eyes
		fill(255);
			ellipse(gameChar_x + 10,gameChar_y - 45,5,10);
			fill(0);
			ellipse(gameChar_x + 11,gameChar_y - 44,3,5);
		//hair front
			fill(0);
			triangle(gameChar_x + 2,gameChar_y - 50 // bottom
					 ,gameChar_x + 2,gameChar_y - 61 // top left
					 ,gameChar_x + 13,gameChar_y - 61); // top right
			triangle(gameChar_x-8,gameChar_y-45,// bottom left
					 gameChar_x + 2,gameChar_y-64 // top
					 ,gameChar_x + 2,gameChar_y - 50); // bottom right

	}
	//Walk Left Drawing
	else if(isLeft)
	{
		//hair back
			fill(0);
			ellipse(gameChar_x - 3,gameChar_y - 50,25,35);
		//backpack
			fill(139,69,19);
			ellipse(gameChar_x + 5,gameChar_y-25,30,30)
		//hand behind
			fill(255,218,185)
			ellipse(gameChar_x - 12,gameChar_y - 25,8,8);
		//body
			fill(220,20,60);
			ellipse(gameChar_x - 5,gameChar_y-20,15,40);
		//face
			fill(255,218,185);
			rect(gameChar_x - 12,gameChar_y - 60,10,25,3);
			ellipse(gameChar_x - 4,gameChar_y-47,15,23);
		//hand front
			fill(255,218,185)
			ellipse(gameChar_x + 3,gameChar_y - 10,8,8);
		//eyes
			fill(255);
			ellipse(gameChar_x - 10,gameChar_y - 45,5,10);
			fill(0);
			ellipse(gameChar_x - 11,gameChar_y - 44,3,5);
		//hair front
			fill(0);
			triangle(gameChar_x-13,gameChar_y - 50 // bottom 
					 ,gameChar_x,gameChar_y - 61 // top right
					 ,gameChar_x - 13,gameChar_y - 61); // top left
			triangle(gameChar_x-3,gameChar_y-61,// top left
					 gameChar_x+6,gameChar_y-61 // top right
					 ,gameChar_x+6,gameChar_y-40); // bottom

	}
	//Walk Right Drawing
	else if(isRight)
	{
		//hair back
			fill(0);
			ellipse(gameChar_x + 3,gameChar_y - 50,25,35);
		//backpack
			fill(139,69,19);
			ellipse(gameChar_x - 5,gameChar_y-25,30,30)
		//hand behind
			fill(255,218,185)
			ellipse(gameChar_x + 12,gameChar_y - 25,8,8);
		//body
			fill(220,20,60);
			ellipse(gameChar_x + 5,gameChar_y-20,15,40);
		//face
			fill(255,218,185);
			rect(gameChar_x + 2,gameChar_y - 60,10,25,3);
			ellipse(gameChar_x + 3,gameChar_y-47,15,23);
		//hand front
			fill(255,218,185)
			ellipse(gameChar_x - 3,gameChar_y - 10,8,8);
		//eyes
			fill(255);
			ellipse(gameChar_x + 10,gameChar_y - 45,5,10);
			fill(0);
			ellipse(gameChar_x + 11,gameChar_y - 44,3,5);
		//hair front
			fill(0);
			triangle(gameChar_x + 1,gameChar_y - 50 // bottom
					 ,gameChar_x + 1,gameChar_y - 61 // top left
					 ,gameChar_x + 13,gameChar_y - 61); // top right
			triangle(gameChar_x-8,gameChar_y-45,// bottom left
					 gameChar_x + 2,gameChar_y-64 // top
					 ,gameChar_x + 2,gameChar_y - 50); // bottom right

	}
	//Fall into canyon Drawing
	else if(isFalling || isPlummeting)
	{
		//hair back
			fill(0);
			ellipse(gameChar_x - 1,gameChar_y - 50,35,35);
		//backpack
			fill(139,69,19);
			ellipse(gameChar_x,gameChar_y-25,30,30)
		//body
			fill(220,20,60);
			ellipse(gameChar_x,gameChar_y - 20,25,40);
		//face
			fill(255,218,185);
			rect(gameChar_x - 13,gameChar_y - 60,25,25,3);
		//hands
			ellipse(gameChar_x - 15,gameChar_y - 70,8,8);
			ellipse(gameChar_x + 15,gameChar_y - 70,8,8);
		//eyes
			fill(255);
			ellipse(gameChar_x - 5,gameChar_y - 45,5,10);
			ellipse(gameChar_x + 5,gameChar_y - 45,5,10);
			fill(0);
			ellipse(gameChar_x - 5,gameChar_y - 44,3,5);
			ellipse(gameChar_x + 5,gameChar_y - 44,3,5);
		//hair front
			fill(0);
			triangle(gameChar_x -15,gameChar_y - 50,
					 gameChar_x -15,gameChar_y - 61,
					 gameChar_x + 10,gameChar_y - 61);
	}
	//Face infront Drawing
	else
	{	
		//hair back
			fill(0);
			ellipse(gameChar_x - 1,gameChar_y - 50,35,35); 
		//backpack
			fill(139,69,19);
			ellipse(gameChar_x,gameChar_y-25,30,30)
		//body
			fill(220,20,60);
			ellipse(gameChar_x,gameChar_y - 20,25,40);
		//face
			fill(255,218,185);
			rect(gameChar_x - 13,gameChar_y - 60,25,25,3);
		//hands
			ellipse(gameChar_x - 10,gameChar_y - 10,8,8);
			ellipse(gameChar_x + 10,gameChar_y - 10,8,8);
		//eyes
			fill(255);
			ellipse(gameChar_x - 5,gameChar_y - 45,5,10);
			ellipse(gameChar_x + 5,gameChar_y - 45,5,10);
			fill(0);
			ellipse(gameChar_x - 5,gameChar_y - 44,3,5);
			ellipse(gameChar_x + 5,gameChar_y - 44,3,5);
		//hair front
			fill(0);
			triangle(gameChar_x -15,gameChar_y - 50  // bottom 
					 ,gameChar_x -15,gameChar_y - 61 // top left
					 ,gameChar_x + 10,gameChar_y - 61); // top right
	}
}
// ---------------------------
// Background render functions
// ---------------------------
// Function to draw cloud objects.
function drawClouds ()
{
	for(var i = 0; i < clouds.length; i++)
	{
	// Basic Shape
		noStroke();
		fill(255);
		ellipse(clouds[i].x_pos + clouds[i].size * 20,
				clouds[i].y_pos + clouds[i].size * 0,
				clouds[i].size * 10,
				clouds[i].size * 16);
	
		ellipse(clouds[i].x_pos + clouds[i].size * 13,
				clouds[i].y_pos + clouds[i].size * 3,
				clouds[i].size * 15,
				clouds[i].size * 11);
	
		ellipse(clouds[i].x_pos + clouds[i].size * 6,
				clouds[i].y_pos + clouds[i].size * 4,
				clouds[i].size * 16,
				clouds[i].size * 8);
	
		ellipse(clouds[i].x_pos + clouds[i].size * 26,
				clouds[i].y_pos + clouds[i].size * 2,
				clouds[i].size * 12,
				clouds[i].size * 13);
	
		ellipse(clouds[i].x_pos + clouds[i].size * 34,
				clouds[i].y_pos + clouds[i].size * 4,
				clouds[i].size * 17,
				clouds[i].size * 8);
	
		ellipse(clouds[i].x_pos + clouds[i].size * 20,
				clouds[i].y_pos + clouds[i].size * 6.6,
				clouds[i].size * 40,
				clouds[i].size * 4);
		
	//Shadow
		fill(200);
		ellipse(clouds[i].x_pos + clouds[i].size * 19,
		   		clouds[i].y_pos + clouds[i].size * 6.6,
				clouds[i].size * 36,
				clouds[i].size * 3);
	}
}
// Function to draw mountains objects.
// Draw big mountains.
function drawBigMountains()
{
	for(var i = 0; i < bigMountains.length; i++)
	{
	//Big Mountain
	// Left Side Big Mountain
		fill(160,82,45);
		beginShape();
			vertex(bigMountains[i].x_pos,bigMountains[i].y_pos); // Left Bottom
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 35,bigMountains[i].y_pos - bigMountains[i].size * 20.2); // Left Fifth
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 42,bigMountains[i].y_pos - bigMountains[i].size * 36.2); // Left Fhourth
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 47,bigMountains[i].y_pos - bigMountains[i].size * 37.2); //Left Third
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 48,bigMountains[i].y_pos - bigMountains[i].size * 40.7); // Left Second
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 50.5,bigMountains[i].y_pos - bigMountains[i].size * 41.2); // Left First
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 52.5 ,bigMountains[i].y_pos - bigMountains[i].size * 42.7); // bigMountains[i]top
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 54,bigMountains[i].y_pos - bigMountains[i].size * 27.2); // Middle First
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 51.5,bigMountains[i].y_pos - bigMountains[i].size * 15.2); // Middle Second
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 44.5,bigMountains[i].y_pos - bigMountains[i].size * 0); //Middle Third
		endShape();
	
	//Snow Left Side Big Mountain
		fill(255,250,250,200);
		beginShape();
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 31.5,bigMountains[i].y_pos - bigMountains[i].size * 18.2); // Left Sixth
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 35,bigMountains[i].y_pos - bigMountains[i].size * 20.2); //Left Fifth
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 42,bigMountains[i].y_pos - bigMountains[i].size * 36.2); // Left Fhourth
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 47,bigMountains[i].y_pos - bigMountains[i].size * 37.2); //Left Third
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 48,bigMountains[i].y_pos - bigMountains[i].size * 40.7); // Left Second
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 50.5,bigMountains[i].y_pos - bigMountains[i].size * 41.2); // Left First
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 52.5,bigMountains[i].y_pos - bigMountains[i].size * 42.7); // bigMountains[i]top
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 54,bigMountains[i].y_pos - bigMountains[i].size * 27.2); //Middle First
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 52.6,bigMountains[i].y_pos - bigMountains[i].size * 20.2); // Middle Second
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 38,bigMountains[i].y_pos - bigMountains[i].size * 15.2); // Bottom First from Left
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 35,bigMountains[i].y_pos - bigMountains[i].size * 15.2); //Bottom Second from Left
		endShape();
	
	//Right Side Big Mountain
		fill(222,184,135);
		beginShape();
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 52.5,bigMountains[i].y_pos - bigMountains[i].size * 42.7); // bigMountains[i]top
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 58.5,bigMountains[i].y_pos - bigMountains[i].size * 41.7); //Right First
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 61.5,bigMountains[i].y_pos - bigMountains[i].size * 34.7); //Right Second
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 73,bigMountains[i].y_pos - bigMountains[i].size * 24.7); //Right Third
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 74,bigMountains[i].y_pos - bigMountains[i].size * 14.7); // Right Fourth
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 87.4,bigMountains[i].y_pos - bigMountains[i].size * 8.2); // Right Border 
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 94,bigMountains[i].y_pos - bigMountains[i].size * 0); //Bottom Right Corner
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 67,bigMountains[i].y_pos - bigMountains[i].size * 0); //Bottom Middle
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 51.5,bigMountains[i].y_pos - bigMountains[i].size * 15.2); // Middle Second
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 54,bigMountains[i].y_pos - bigMountains[i].size * 27.2); //Middle First
		endShape();
	
	//Snow Right Side Big Mountain
		fill(255,250,250,200);
		beginShape();
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 73,bigMountains[i].y_pos - bigMountains[i].size * 24.7); // Right Third
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 61.5,bigMountains[i].y_pos - bigMountains[i].size * 34.7); //Right Second
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 58.5,bigMountains[i].y_pos - bigMountains[i].size * 41.7); //Right First
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 52.5,bigMountains[i].y_pos - bigMountains[i].size * 42.7); // bigMountains[i]top
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 54,bigMountains[i].y_pos - bigMountains[i].size * 27.2); //Middle First
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 52.5,bigMountains[i].y_pos - bigMountains[i].size * 20.2); // Middle Second
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 59.5,bigMountains[i].y_pos - bigMountains[i].size * 16.2); // Bottom First
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 63.5,bigMountains[i].y_pos - bigMountains[i].size * 16.2); //Bottom Second
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 73.5,bigMountains[i].y_pos - bigMountains[i].size * 20.2); // Bottom Right
		
		endShape();
	
	//Middle Big Mountain
		fill(205,133,63);
		beginShape();
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 51.5,bigMountains[i].y_pos - bigMountains[i].size * 15.2);
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 67,bigMountains[i].y_pos - bigMountains[i].size * 0);
			vertex(bigMountains[i].x_pos + bigMountains[i].size * 44.5,bigMountains[i].y_pos - bigMountains[i].size * 0);
		endShape();
	}
}
// Draw small Mountains
function drawSmallMountains()
{
	for(var i = 0; i < smallMountains.length; i++)
	{
	//Small Mountains
	// Left Side Small Mountain
		fill(160,82,45);
		beginShape();
			vertex(smallMountains[i].x_pos - smallMountains[i].size * 11,smallMountains[i].y_pos -  smallMountains[i].size * 0); // Left Border Bottom
			vertex(smallMountains[i].x_pos + smallMountains[i].size * 0, smallMountains[i].y_pos - smallMountains[i].size * 5.2); //Left Border Top
			vertex(smallMountains[i].x_pos + smallMountains[i].size * 12.1,smallMountains[i].y_pos -  smallMountains[i].size * 8.7); //Uphill
			vertex(smallMountains[i].x_pos + smallMountains[i].size * 20, smallMountains[i].y_pos -  smallMountains[i].size * 14.4); //smallMountains[i] Top
			vertex(smallMountains[i].x_pos + smallMountains[i].size * 21.5, smallMountains[i].y_pos -  smallMountains[i].size * 7.7); // Middle First from Top
			vertex(smallMountains[i].x_pos + smallMountains[i].size * 18, smallMountains[i].y_pos -  smallMountains[i].size * 3.7); // Middle Second from Top
			vertex(smallMountains[i].x_pos + smallMountains[i].size * 19.5, smallMountains[i].y_pos -  smallMountains[i].size * 0); // Middle Bottom
		endShape();
		
	// Snow Left Side Small Mountain
		fill(255,250,250,200);
		beginShape();
			vertex(smallMountains[i].x_pos + smallMountains[i].size * 20,smallMountains[i].y_pos -  smallMountains[i].size * 14.4); // smallMountains[i] Top
			vertex(smallMountains[i].x_pos + smallMountains[i].size * 21,smallMountains[i].y_pos -  smallMountains[i].size * 10.2); // Middle
			vertex(smallMountains[i].x_pos + smallMountains[i].size * 19.3,smallMountains[i].y_pos -  smallMountains[i].size * 9.2); // Slope First from Right
			vertex(smallMountains[i].x_pos + smallMountains[i].size * 17.5,smallMountains[i].y_pos -  smallMountains[i].size * 8.7); // Slope Second from Right
			vertex(smallMountains[i].x_pos + smallMountains[i].size * 17,smallMountains[i].y_pos -  smallMountains[i].size * 9.2); // Slope Third from Right
			vertex(smallMountains[i].x_pos + smallMountains[i].size * 12.1,smallMountains[i].y_pos -  smallMountains[i].size * 8.7); // smallMountains[i]side
		endShape();
	
	// Right Side Small Mountain
		fill(222,184,135);
		beginShape();
			vertex(smallMountains[i].x_pos + smallMountains[i].size * 20, smallMountains[i].y_pos -  smallMountains[i].size * 14.4); //smallMountains[i] Top
			vertex(smallMountains[i].x_pos + smallMountains[i].size * 21.5, smallMountains[i].y_pos -  smallMountains[i].size * 7.7); // Middle First from Top
			vertex(smallMountains[i].x_pos + smallMountains[i].size * 18, smallMountains[i].y_pos -  smallMountains[i].size * 3.7); // Middle Second from Top
			vertex(smallMountains[i].x_pos + smallMountains[i].size * 19.5, smallMountains[i].y_pos -  smallMountains[i].size * 0); // Middle Bottom
			vertex(smallMountains[i].x_pos + smallMountains[i].size * 70,smallMountains[i].y_pos -  smallMountains[i].size * 0); // Corner Bottom Right
			vertex(smallMountains[i].x_pos + smallMountains[i].size * 38,smallMountains[i].y_pos -  smallMountains[i].size * 10.2); // Right Side in Slope
		endShape();
	
	// Snow Right Side Small Mountain
		fill(255,250,250);
		beginShape();
			vertex(smallMountains[i].x_pos + smallMountains[i].size * 20,smallMountains[i].y_pos -  smallMountains[i].size * 14.4); // smallMountains[i] Top
			vertex(smallMountains[i].x_pos + smallMountains[i].size * 20.9,smallMountains[i].y_pos -  smallMountains[i].size * 10.2); // Middle
			vertex(smallMountains[i].x_pos + smallMountains[i].size * 24,smallMountains[i].y_pos -  smallMountains[i].size * 9.2); // Slope First from Left
			vertex(smallMountains[i].x_pos + smallMountains[i].size * 26.5,smallMountains[i].y_pos -  smallMountains[i].size * 8.7); // Slope Second from Left
			vertex(smallMountains[i].x_pos + smallMountains[i].size * 33.8,smallMountains[i].y_pos -  smallMountains[i].size * 9.2); // Slope Third from Left
			vertex(smallMountains[i].x_pos + smallMountains[i].size * 35,smallMountains[i].y_pos -  smallMountains[i].size * 10.9); // smallMountains[i]side
		endShape();
	}
}
// Function to draw trees objects.
function drawTrees()
{
	// Draw Trees
	for(var i = 0; i < trees_x.length; i++)
	{
		//Leafs
			fill(34,139,34);
			ellipse(trees_x[i] + 103,trees_y -302,70,70); // Middle
			ellipse(trees_x[i] + 58,trees_y -252,120,120);//Left First
			ellipse(trees_x[i] + 28,trees_y -182,100,100);//Left Second
			ellipse(trees_x[i] + 148,trees_y -272,50,50); //First Right
			ellipse(trees_x[i] + 178,trees_y -232,60,60); // Second Right
			ellipse(trees_x[i] + 188,trees_y -172,80,80); // Third Right
			ellipse(trees_x[i] + 103,trees_y -140,200,20); // Bottom
			rect(trees_x[i] + 58,trees_y -282,110,140);
		//Trunk
			fill(210,105,30);
			rect(trees_x[i] + 88,trees_y -182,30,182);
			triangle(trees_x[i] + 68,trees_y,trees_x[i] +  88,trees_y,trees_x[i] + 88,trees_y -9);
			triangle(trees_x[i] + 138,trees_y,trees_x[i] + 118,trees_y,trees_x[i] + 118,trees_y-9);
			stroke(139,69,19);
			line(trees_x[i] + 98,trees_y -157,trees_x[i] + 98,trees_y -112);
			line(trees_x[i] + 93,trees_y -57,trees_x[i] + 93,trees_y -112);
			line(trees_x[i] + 113,trees_y -142,trees_x[i] + 113,trees_y -97);
			line(trees_x[i] + 108,trees_y -67,trees_x[i] + 108,trees_y -22);
			noFill()
			arc(trees_x[i] + 106,trees_y -82,10,20,HALF_PI,PI + HALF_PI);
			arc(trees_x[i] + 110,trees_y -82,10,20,PI + HALF_PI,PI + HALF_PI);
			noStroke();
			fill(0);
			ellipse(trees_x[i] + 108,trees_y -82,5,10);
			gradientRect(trees_x[i]+ 80,trees_y-200,50,50,color(34,139,34,100),color(34,139,34,80));
			stroke(0);
			point(trees_x[i],trees_y);
			noStroke();
	}
}

// Draw Gradiant Rect Original: https://editor.p5js.org/REAS/sketches/S1TNUPzim
function gradientRect(x,y,width,height,c1, c2) 
{
  noFill();
  for (var i = y; i < y + height; i++) 
  {
	var inter = map(i, 0, y + height, 0, 1);
	var c = lerpColor(c1, c2, inter);
	stroke(c);
	line(x, i, x + width, i);
  }
	noStroke();
}
// ---------------------------------
// Canyon render and check functions
// ---------------------------------
// Function to draw canyon objects.
function drawCanyon(t_canyon)
{
	// Background
			fill(165,42,42);
			rect(t_canyon.x_pos,floorPos_y,t_canyon.width,floorPos_y);
		// Stones
		//left side
			fill(128,128,128);
			triangle(t_canyon.x_pos,floorPos_y,t_canyon.x_pos + 16,floorPos_y,t_canyon.x_pos,floorPos_y+48);
			fill(105,105,105);
			triangle(t_canyon.x_pos,floorPos_y+18,t_canyon.x_pos,floorPos_y+113,t_canyon.x_pos + 11,floorPos_y+48);
			fill(119,136,153);
			triangle(t_canyon.x_pos,floorPos_y+113,t_canyon.x_pos + 11,floorPos_y+144,t_canyon.x_pos,floorPos_y+144);
		//right side
			fill(128,128,128);
			triangle(t_canyon.x_pos + t_canyon.width - 34,floorPos_y+144,t_canyon.x_pos + t_canyon.width,floorPos_y+144,t_canyon.x_pos + t_canyon.width,floorPos_y+98);
			fill(105,105,105);
			triangle(t_canyon.x_pos + t_canyon.width,floorPos_y,t_canyon.x_pos + t_canyon.width - 16,floorPos_y,t_canyon.x_pos + t_canyon.width,floorPos_y+78);
			fill(119,136,153);
			triangle(t_canyon.x_pos + t_canyon.width,floorPos_y+98,t_canyon.x_pos + t_canyon.width,floorPos_y+78,t_canyon.x_pos + t_canyon.width - 9,floorPos_y+88);
}
// Function to check character is over a canyon.
function checkCanyon(t_canyon)
{
	// Logic for gravity over canyons
	if((gameChar_world_x > t_canyon.x_pos && gameChar_world_x < t_canyon.x_pos + t_canyon.width && gameChar_y >= floorPos_y) || gameChar_y > floorPos_y)
		{
			isPlummeting = true;
		}
	else
		{
			isPlummeting = false;
		}
	if(isPlummeting)
		{
			gameChar_y += 4;
		}
}
// ----------------------------------
// Collectable items render and check functions
// ----------------------------------
// Function to draw collectable objects.
function drawCollectable(t_collectable)
{
	//scale values
		var scale_x = t_collectable.size * 30; // with scale 1 length: 30px 
		var scale_y = t_collectable.size * 40; // with scale 1 height: 40px		
	// use x and y position for middle of object
		push();
		translate(-scale_x/2,(-scale_y/2));
	// draw Collectable
			noStroke();
		// Basic rectangle
			fill(169,169,169);
			rect(t_collectable.x_pos,t_collectable.y_pos,scale_x,scale_y);
		// Grey Stripe
			fill(192,192,192);
			rect(t_collectable.x_pos + (scale_x)/6,t_collectable.y_pos,(scale_x)/6,scale_y);
		// Game Label
			fill(255);
			rect(t_collectable.x_pos + (scale_x)/2.5,t_collectable.y_pos,(scale_x)/2,(scale_y)*0.6);
		pop();
}

// Function to check character has collected an item.
function checkCollectable(t_collectable)
{
	if(dist(gameChar_world_x,gameChar_y,t_collectable.x_pos,t_collectable.y_pos) < t_collectable.size * 40)
	{
		t_collectable.isFound = true;
		collectSound.play();
		score += 100;
	};
}

// ----------------------------------
// Flagpole render and check functions
// ----------------------------------

// Function to draw the flagpole.
function renderFlagpole(t_flagpole)
{
	// Flagpole Base
		fill(184,134,11);
		rect(t_flagpole.x_pos - (t_flagpole.size * 10),floorPos_y - (t_flagpole.size * 20),t_flagpole.size * 20,t_flagpole.size * 20);
		stroke(139,69,19);
		strokeWeight(t_flagpole.size * 2);
		point(t_flagpole.x_pos - (t_flagpole.size * 5),floorPos_y- (t_flagpole.size * 15));
		point(t_flagpole.x_pos + (t_flagpole.size * 5),floorPos_y-(t_flagpole.size * 15));
		point(t_flagpole.x_pos - (t_flagpole.size * 5),floorPos_y-(t_flagpole.size * 5));
		point(t_flagpole.x_pos + (t_flagpole.size * 5),floorPos_y-(t_flagpole.size * 5));
		// Pole
		noStroke();
		strokeWeight(1);
		fill(169,169,169);
		rect(t_flagpole.x_pos - (t_flagpole.size * 2.5), floorPos_y - (t_flagpole.size * 300),t_flagpole.size * 5,t_flagpole.size * 280);
	// Ball on Top
		fill(255,215,0);
		ellipse(t_flagpole.x_pos,floorPos_y - (t_flagpole.size * 300),15);
	// Flag
	//Back Part Pattern
	//White Background
		noStroke();
		fill(255);
		rect(t_flagpole.x_pos + (t_flagpole.size * 45),floorPos_y - (t_flagpole.size * 256),t_flagpole.size * 30,t_flagpole.size * 42);
		arc(t_flagpole.x_pos + (t_flagpole.size * 61),floorPos_y - (t_flagpole.size * 215),t_flagpole.size * 30,t_flagpole.size * 10,0,PI);
		stroke(255);
		strokeWeight(t_flagpole.size * 2);
		noFill();
		arc(t_flagpole.x_pos + (t_flagpole.size * 61),floorPos_y - (t_flagpole.size * 259),t_flagpole.size * 30,t_flagpole.size * 10,0,PI);
	//Horizontal Stripes
		stroke(0);
		strokeWeight(t_flagpole.size * 2);
		noFill();
		arc(t_flagpole.x_pos + (t_flagpole.size * 61),floorPos_y - (t_flagpole.size * 251),t_flagpole.size * 30,t_flagpole.size * 10,0,PI);
		arc(t_flagpole.x_pos + (t_flagpole.size * 61),floorPos_y - (t_flagpole.size * 250),t_flagpole.size * 30,t_flagpole.size * 10,0,PI);
		arc(t_flagpole.x_pos + (t_flagpole.size * 61),floorPos_y - (t_flagpole.size * 242),t_flagpole.size * 30,t_flagpole.size * 10,0,PI);
		arc(t_flagpole.x_pos + (t_flagpole.size * 61),floorPos_y - (t_flagpole.size * 241),t_flagpole.size * 30,t_flagpole.size * 10,0,PI);
		arc(t_flagpole.x_pos + (t_flagpole.size * 61),floorPos_y - (t_flagpole.size * 234),t_flagpole.size * 30,t_flagpole.size * 10,0,PI);
		arc(t_flagpole.x_pos + (t_flagpole.size * 61),floorPos_y - (t_flagpole.size * 233),t_flagpole.size * 30,t_flagpole.size * 10,0,PI);
		arc(t_flagpole.x_pos + (t_flagpole.size * 61),floorPos_y - (t_flagpole.size * 226),t_flagpole.size * 30,t_flagpole.size * 10,0,PI);
		arc(t_flagpole.x_pos + (t_flagpole.size * 61),floorPos_y - (t_flagpole.size * 225),t_flagpole.size * 30,t_flagpole.size * 10,0,PI);
	//Vertical Stripes
		line(t_flagpole.x_pos + (t_flagpole.size * 65),floorPos_y - (t_flagpole.size * 255),
			 t_flagpole.x_pos + (t_flagpole.size * 65),floorPos_y - (t_flagpole.size * 211));
		line(t_flagpole.x_pos + (t_flagpole.size * 67),floorPos_y - (t_flagpole.size * 255),
			 t_flagpole.x_pos + (t_flagpole.size * 67),floorPos_y - (t_flagpole.size * 211));
		line(t_flagpole.x_pos + (t_flagpole.size * 55),floorPos_y - (t_flagpole.size * 255),
			 t_flagpole.x_pos + (t_flagpole.size * 55),floorPos_y - (t_flagpole.size * 211));
		line(t_flagpole.x_pos + (t_flagpole.size * 57),floorPos_y - (t_flagpole.size * 255),
			 t_flagpole.x_pos + (t_flagpole.size * 57),floorPos_y - (t_flagpole.size * 211));
	//Back Part Shape
		stroke(0);
		strokeWeight(t_flagpole.size*2);
		noFill();
		arc(t_flagpole.x_pos + (t_flagpole.size * 61),floorPos_y - (t_flagpole.size * 260),t_flagpole.size * 30,t_flagpole.size * 10,0,PI);
		arc(t_flagpole.x_pos + (t_flagpole.size * 61),floorPos_y - (t_flagpole.size * 215),t_flagpole.size * 30,t_flagpole.size * 10,0,PI);
		line(t_flagpole.x_pos + (t_flagpole.size * 76),floorPos_y - (t_flagpole.size * 260),
			 t_flagpole.x_pos + (t_flagpole.size * 76),floorPos_y - (t_flagpole.size * 215));	
	//Front Part Pattern
	//White Background
		noStroke();
		fill(255);
		rect(t_flagpole.x_pos,floorPos_y - (t_flagpole.size * 280),t_flagpole.size * 50,t_flagpole.size * 53);
		arc(t_flagpole.x_pos + (t_flagpole.size * 25),floorPos_y - (t_flagpole.size * 279),t_flagpole.size * 50,t_flagpole.size * 15,PI,TWO_PI);
		triangle(t_flagpole.x_pos,floorPos_y - (t_flagpole.size * 228),
				 t_flagpole.x_pos,floorPos_y - (t_flagpole.size * 222),
				 t_flagpole.x_pos+ (t_flagpole.size *20),floorPos_y - (t_flagpole.size * 228));
		triangle(t_flagpole.x_pos+ (t_flagpole.size * 50),floorPos_y - (t_flagpole.size * 228),
				 t_flagpole.x_pos+ (t_flagpole.size * 50),floorPos_y - (t_flagpole.size * 224),
				 t_flagpole.x_pos+ (t_flagpole.size *20),floorPos_y - (t_flagpole.size * 228))
	//Horizontal Stripes
		stroke(0);
		strokeWeight(t_flagpole.size*2);
		noFill();
		arc(t_flagpole.x_pos + (t_flagpole.size * 25),floorPos_y - (t_flagpole.size * 269),t_flagpole.size * 50,t_flagpole.size * 15,PI,TWO_PI);
		arc(t_flagpole.x_pos + (t_flagpole.size * 25),floorPos_y - (t_flagpole.size * 268),t_flagpole.size * 50,t_flagpole.size * 15,PI,TWO_PI);
		arc(t_flagpole.x_pos + (t_flagpole.size * 25),floorPos_y - (t_flagpole.size * 257),t_flagpole.size * 50,t_flagpole.size * 15,PI,TWO_PI);
		arc(t_flagpole.x_pos + (t_flagpole.size * 25),floorPos_y - (t_flagpole.size * 256),t_flagpole.size * 50,t_flagpole.size * 15,PI,TWO_PI);
		arc(t_flagpole.x_pos + (t_flagpole.size * 25),floorPos_y - (t_flagpole.size * 245),t_flagpole.size * 50,t_flagpole.size * 15,PI,TWO_PI);
		arc(t_flagpole.x_pos + (t_flagpole.size * 25),floorPos_y - (t_flagpole.size * 244),t_flagpole.size * 50,t_flagpole.size * 15,PI,TWO_PI);
		arc(t_flagpole.x_pos + (t_flagpole.size * 25),floorPos_y - (t_flagpole.size * 233),t_flagpole.size * 50,t_flagpole.size * 15,PI,TWO_PI);
		arc(t_flagpole.x_pos + (t_flagpole.size * 25),floorPos_y - (t_flagpole.size * 232),t_flagpole.size * 50,t_flagpole.size * 15,PI,TWO_PI);
	//Vertical Stripes
		line(t_flagpole.x_pos + (t_flagpole.size * 10),floorPos_y - (t_flagpole.size * 286),
			 t_flagpole.x_pos + (t_flagpole.size * 10),floorPos_y - (t_flagpole.size * 227));
		line(t_flagpole.x_pos + (t_flagpole.size * 12),floorPos_y - (t_flagpole.size * 286),
			 t_flagpole.x_pos + (t_flagpole.size * 12),floorPos_y - (t_flagpole.size * 227));
		line(t_flagpole.x_pos + (t_flagpole.size * 25),floorPos_y - (t_flagpole.size * 286),
			 t_flagpole.x_pos + (t_flagpole.size * 25),floorPos_y - (t_flagpole.size * 228));
		line(t_flagpole.x_pos + (t_flagpole.size * 27),floorPos_y - (t_flagpole.size * 286),
			 t_flagpole.x_pos + (t_flagpole.size * 27),floorPos_y - (t_flagpole.size * 228));
		line(t_flagpole.x_pos + (t_flagpole.size * 40),floorPos_y - (t_flagpole.size * 285),
			 t_flagpole.x_pos + (t_flagpole.size * 40),floorPos_y - (t_flagpole.size * 227));
		line(t_flagpole.x_pos + (t_flagpole.size * 42),floorPos_y - (t_flagpole.size * 285),
			 t_flagpole.x_pos + (t_flagpole.size * 42),floorPos_y - (t_flagpole.size * 227));
	//Front Part Shape
		stroke(0);
		strokeWeight(t_flagpole.size*2);
		noFill();
		arc(t_flagpole.x_pos + (t_flagpole.size * 25),floorPos_y - (t_flagpole.size * 280),t_flagpole.size * 50,t_flagpole.size * 15,PI,TWO_PI);
		arc(t_flagpole.x_pos + (t_flagpole.size * 25),floorPos_y - (t_flagpole.size * 220),t_flagpole.size * 50,t_flagpole.size * 15,PI,TWO_PI + radians(10));
		line(t_flagpole.x_pos + (t_flagpole.size * 50),floorPos_y - (t_flagpole.size * 280),
			 t_flagpole.x_pos + (t_flagpole.size * 50),floorPos_y - (t_flagpole.size * 220));
		line(t_flagpole.x_pos,floorPos_y - (t_flagpole.size * 280),
			 t_flagpole.x_pos,floorPos_y - (t_flagpole.size * 220));
		line(t_flagpole.x_pos + (t_flagpole.size * 46),floorPos_y - (t_flagpole.size * 223),
			 t_flagpole.x_pos + (t_flagpole.size * 46),floorPos_y - (t_flagpole.size * 215));
	
	// Fireworks if isReached
	if(t_flagpole.isReached == true)
	{
		//Animation Logic
		if(frameCount > fireworkDuration)
		{
			if(fireworkPos.index == fireworkPos.x_Pos1.length)
			{
				fireworkPos.index = 0;
			}
			else
			{
				fireworkPos.index += 1;
			}
			fireworkDuration = frameCount + 20;
		}
		
		//Animation Drawing
		//"Rocket"
		stroke(128,0,128);
		line(t_flagpole.x_pos - (t_flagpole.size * fireworkPos.x_Pos1[fireworkPos.index]),floorPos_y - (t_flagpole.size * fireworkPos.y_Pos1[fireworkPos.index]),
			 t_flagpole.x_pos - (t_flagpole.size * fireworkPos.x_Pos2[fireworkPos.index]),floorPos_y - (t_flagpole.size * fireworkPos.y_Pos2[fireworkPos.index]));
		
		//"Flower"
		
		
		
		if(fireworkPos.index == 3)
		{
			line(t_flagpole.x_pos - (t_flagpole.size * 175),
				 floorPos_y - (t_flagpole.size * 275),
			 t_flagpole.x_pos - (t_flagpole.size * 205),
				 floorPos_y - (t_flagpole.size * 305));
			line(t_flagpole.x_pos - (t_flagpole.size * 165),
				 floorPos_y - (t_flagpole.size * 275),
			 t_flagpole.x_pos - (t_flagpole.size * 135),
				 floorPos_y - (t_flagpole.size * 305));
			line(t_flagpole.x_pos - (t_flagpole.size * 175),
				 floorPos_y - (t_flagpole.size * 265),
			 t_flagpole.x_pos - (t_flagpole.size * 205),
				 floorPos_y - (t_flagpole.size * 235));
			line(t_flagpole.x_pos - (t_flagpole.size * 165),
				 floorPos_y - (t_flagpole.size * 265),
			 t_flagpole.x_pos - (t_flagpole.size * 135),
				 floorPos_y - (t_flagpole.size * 235));
			line(t_flagpole.x_pos - (t_flagpole.size * 170),
				 floorPos_y - (t_flagpole.size * 280),
			 t_flagpole.x_pos - (t_flagpole.size * 170),
				 floorPos_y - (t_flagpole.size * 320));
			line(t_flagpole.x_pos - (t_flagpole.size * 170),
				 floorPos_y - (t_flagpole.size * 260),
			 t_flagpole.x_pos - (t_flagpole.size * 170),
				 floorPos_y - (t_flagpole.size * 220));
			line(t_flagpole.x_pos - (t_flagpole.size * 180),
				 floorPos_y - (t_flagpole.size * 270),
			 t_flagpole.x_pos - (t_flagpole.size * 220),
				 floorPos_y - (t_flagpole.size * 270));
			line(t_flagpole.x_pos - (t_flagpole.size * 160),
				 floorPos_y - (t_flagpole.size * 270),
			 t_flagpole.x_pos - (t_flagpole.size * 120),
				 floorPos_y - (t_flagpole.size * 270));	
		}
		else if(fireworkPos.index == 7)
		{
			line(t_flagpole.x_pos - (t_flagpole.size * -175),
				 floorPos_y - (t_flagpole.size * 275),
			 t_flagpole.x_pos - (t_flagpole.size * -205),
				 floorPos_y - (t_flagpole.size * 305));
			line(t_flagpole.x_pos - (t_flagpole.size * -165),
				 floorPos_y - (t_flagpole.size * 275),
			 t_flagpole.x_pos - (t_flagpole.size * -135),
				 floorPos_y - (t_flagpole.size * 305));
			line(t_flagpole.x_pos - (t_flagpole.size * -175),
				 floorPos_y - (t_flagpole.size * 265),
			 t_flagpole.x_pos - (t_flagpole.size * -205),
				 floorPos_y - (t_flagpole.size * 235));
			line(t_flagpole.x_pos - (t_flagpole.size * -165),
				 floorPos_y - (t_flagpole.size * 265),
			 t_flagpole.x_pos - (t_flagpole.size * -135),
				 floorPos_y - (t_flagpole.size * 235));
			line(t_flagpole.x_pos - (t_flagpole.size * -170),
				 floorPos_y - (t_flagpole.size * 280),
			 t_flagpole.x_pos - (t_flagpole.size * -170),
				 floorPos_y - (t_flagpole.size * 320));
			line(t_flagpole.x_pos - (t_flagpole.size * -170),
				 floorPos_y - (t_flagpole.size * 260),
			 t_flagpole.x_pos - (t_flagpole.size * -170),
				 floorPos_y - (t_flagpole.size * 220));
			line(t_flagpole.x_pos - (t_flagpole.size * -180),
				 floorPos_y - (t_flagpole.size * 270),
			 t_flagpole.x_pos - (t_flagpole.size * -220),
				 floorPos_y - (t_flagpole.size * 270));
			line(t_flagpole.x_pos - (t_flagpole.size * -160),
				 floorPos_y - (t_flagpole.size * 270),
			 t_flagpole.x_pos - (t_flagpole.size * -120),
				 floorPos_y - (t_flagpole.size * 270));	
		}

	}
}

// Function to check if the Gamecharacter is near the flagpole.
function checkFlagpole()
{
	if(abs(dist(gameChar_world_x,floorPos_y,flagpole.x_pos,floorPos_y))<10)
	{
		flagpole.isReached = true;
		fireworkDuration = frameCount + 20
	}
}
// ----------------------------------
// Lives render and check functions
// ----------------------------------

// Function to draw lives icons.

function drawLives(t_lives)
{
	for(var i = 0; i<lives;i++)
	{
	fill(220,20,60);
	ellipse(t_lives.x_pos - (t_lives.size * 10) + (i * 50),t_lives.y_pos - (t_lives.size * 10),t_lives.size*20);
	ellipse(t_lives.x_pos + (t_lives.size * 10) + (i * 50),t_lives.y_pos - (t_lives.size * 10),t_lives.size*20);
	ellipse(t_lives.x_pos + (i * 50),t_lives.y_pos - (t_lives.size * 5),t_lives.size*10);
	triangle(t_lives.x_pos + (i * 50),t_lives.y_pos + (t_lives.size * 20),
			 t_lives.x_pos - (t_lives.size * 18) + (i * 50),t_lives.y_pos - (t_lives.size * 5),
			 t_lives.x_pos + (t_lives.size * 18) + (i * 50),t_lives.y_pos - (t_lives.size * 5));
	fill(250,128,114);
	ellipse(t_lives.x_pos + (t_lives.size * 12.5) + (i * 50),t_lives.y_pos - (t_lives.size * 12.5),10,10);
	}
}

// ----------------------------------
// Platforms render and check functions
// ----------------------------------

// Cunstructor function for platforms
function CreatePlatform(x,y,length,direction,range,speed)
{
	this.x = x,
	this.y = y,
	this.length = length,
	this.currentx = x;
	this.currenty = y;
	this.direction = direction;
	this.speed = speed;
	this.range = range;
	//Drawing the shape
	this.draw = function()
	{
		noStroke();
		fill(205,133,63);
		rect(this.currentx,this.currenty,this.length,20);
		fill(50,205,50);
		rect(this.currentx,this.currenty,this.length,3);
	},
	// Check if character or slime is in contact
	this.checkContact = function(gc_x,gc_y)
	{
		//Checks if Character is on a platform
		if(gc_x > this.currentx && gc_x < this.currentx + this.length)
		{
			var d = abs(this.currenty - gc_y)
			if(d >= 0 && d < 5)
			{
				return true;
			}
		}			
		return false;
	}
	// Animation
	this.update = function()
	{
		//Vertical ANimation
		if (direction == "vertical")
		{
			this.currenty += this.speed;
			if(this.currenty < this.y)
			{
				this.speed = -this.speed;
			}
			else if (this.currenty > this.y + this.range)
			{
				this.speed = -this.speed;
			}
		}
		//Horizontal Animation
		else if (direction == "horizontal")
		{
			this.currentx += this.speed;
			if(this.currentx < this.x)
			{
				this.speed = -this.speed;
			}
			else if (this.currentx > this.x + this.range)
			{
				this.speed = -this.speed;
			}
		}
		//Standing Animation
		else if(!direction)
		{
			return;
		}
	}
}
// ----------------------------------
// Enemy render and check functions
// ----------------------------------

// Cunstructor function for  enemies

function CreateEnemy(x,y,mode,range,speed)
{
	this.x = x;
	this.y = y;
	this.currentx = x;
	this.currenty = y;
	this.mode = mode;
	this.range = range;
	this.speed = speed;
	this.baseWidth = 50;
	this.baseHeight = 50;
	this.headWidth = 20;
	this.headHeight = 20;
	this.incr = 0.2;
	this.JumpDuration =  frameCount;
	this.PauseDuration = this.JumpDuration;
	this.surprise = false;
	this.jumpCooldown
	//Draw the body
	this.draw = function()
	{
		// Body Shape
		noStroke();
		fill(0,255,127);
		ellipse(this.currentx,this.currenty - this.baseHeight/2,this.baseWidth,this.baseHeight);
		ellipse(this.currentx,this.currenty - this.baseHeight - this.headHeight/2,this.headWidth,this.headHeight);
		triangle(	this.currentx - (cos(0.524)*this.baseWidth/2),this.currenty - this.baseHeight/2 - (sin(0.524)*this.baseHeight/2),
					this.currentx - (cos(0.524)*this.headWidth/2),this.currenty - this.baseHeight - this.headHeight/2 - (sin(0.524)*this.headHeight/2),
					this.currentx,this.currenty - this.baseHeight);
		triangle(	this.currentx + (cos(0.524)*this.baseWidth/2),this.currenty - this.baseHeight/2 - (sin(0.524)*this.baseHeight/2),
					this.currentx + (cos(0.524)*this.headWidth/2),this.currenty - this.baseHeight - this.headHeight/2 - (sin(0.524)*this.headHeight/2),
					this.currentx,this.currenty - this.baseHeight);
		//Eye
		fill(255);
		ellipse(this.currentx,this.currenty - this.baseHeight,10,15);
		fill(0);
		ellipse(this.currentx,this.currenty- this.baseHeight + 2.5,5,10);
		//Mouth
		fill(0);
		arc(this.currentx,this.currenty - this.baseHeight/2,20,20,0.175,PI-0.175);
		fill(220,20,60);
		arc(this.currentx,this.currenty - this.baseHeight/2 + 10,10,10,PI+0.175,TWO_PI-0.175);	
	}
	// Collision detection with the player
	this.checkCollision = function(gc_x,gc_y)
	{
		if(gc_x > this.currentx - this.baseWidth/2  && 
		   gc_x < this.currentx + this.baseWidth/2 &&
		   gc_y < this.currenty &&
		   gc_y > this.currenty - this.baseHeight - this.headHeight)
		{
			lives -=1;
			startGame();
		}
	}
	
	//Animation and Actions
	this.update = function()
	{
		// Idle Animation
		this.baseWidth += this.incr;
		this.baseHeight -= this.incr;
		if((this.baseWidth > 55 && this.baseHeight < 45) || (this.baseWidth < 45 && this.baseHeight >55))
		{
			this.incr = -this.incr;
		}
		// Check Platforms and Gravity
		if(frameCount >= this.JumpDuration)
		{
			if (abs(dist(this.currentx,this.currenty,this.currentx,floorPos_y)) < 5)
			{
				this.currenty = floorPos_y;
			}
			else
			{
				var isContact = false;
				for(var i=0; i<platforms.length;i++)
				{
					if(platforms[i].checkContact(this.currentx,this.currenty))
					{
						isContact = true;
						this.currenty = platforms[i].currenty;
						break;
					}
				}
				if(!isContact)
				{
					this.currenty += 5;
				}
			}
		}
		else
		{
			this.currenty -= 8;
		}
		// Different Modes
		//Standing still
		if(this.mode == "standing")
		{
			//break;
		}
		//Running back and forth
		else if (this.mode == "running")
		{
			this.currentx += this.speed
			if(this.currentx < this.x || this.currentx > this.x + this.range)
			{
				this.speed = -this.speed;
			}
		}
		//Jumping animation
		else if (this.mode == "jumping")
		{
			if(frameCount >= this.PauseDuration && this.currenty == floorPos_y)
			{
				if(abs(gameChar_world_x-this.currentx) < 500)
				{
					slimeJump.play();	
				}
				this.JumpDuration = frameCount + 15;
				this.PauseDuration = this.JumpDuration + 60;
			}
		}
		//Surprise Jump
		else if (this.mode == "surprise jump")
		{
			if(dist(gameChar_world_x,gameChar_y,this.currentx,this.currenty) < 100 && !this.surprise)
			{
				if(abs(gameChar_world_x-this.currentx) < 500)
				{
					slimeJump.play();	
				}
				this.JumpDuration = frameCount + 15;
				this.PauseDuration = this.JumpDuration + 60;
				this.surprise = true;
				this.jumpCooldown = frameCount + 120;
			}
			else if(frameCount >= this.jumpCooldown)
			{
				this.surprise = false;
			}
		}
	}
}
