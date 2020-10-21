var canvas_width = 1000, canvas_height = 700; // Defining width and height of canvas

var stars = []
var sinWave = 0;
var weapons = [];

fancyxCount = 0;
fancyyCount = 0;

fadeCount = 255;

function setup() { // Setting up the game

    createCanvas(canvas_width, canvas_height); // Creating the inital canvas
    fill(0); // Color: Black
    noStroke() // Don't draw a border

    textSize(15); // SETTING UP TEXT
    textStyle(BOLD);
    textAlign(CENTER);

    for(i=0;i<100;i++) {
        row = [];
        row.push(random(1000), random(1000), random(-30)); // Making starfield
        stars.push(row);
    }

    pause = 10; // Making sure that when you stop, you stop fOr rEalZ
} ;

function preload() { // Preloading assets
    tile = loadImage("assets/tile.png");
    web = loadImage("assets/web.png");

    down_idle = loadImage("assets/front_idle.png");
    down_1 = loadImage("assets/front_1.png");
    down_2 = loadImage("assets/front_2.png");

    up_idle = loadImage("assets/back_idle.png");
    up_1 = loadImage("assets/back_1.png");
    up_2 = loadImage("assets/back_2.png");

    left_idle = loadImage("assets/left_idle.png");
    left_1 = loadImage("assets/left_1.png");
    left_2 = loadImage("assets/left_2.png");

    right_idle = loadImage("assets/right_idle.png");
    right_1 = loadImage("assets/right_1.png");
    right_2 = loadImage("assets/right_2.png");

    slime = loadImage("assets/slime.png");

    swordRight = loadImage("assets/sword1.png");
    swordLeft = loadImage("assets/sword2.png");
    swordUp = loadImage("assets/sword3.png");
    swordDown = loadImage("assets/sword4.png");

    lavaImg = loadImage("assets/lava.png");
    plankImg = loadImage("assets/plank.png");
    sideWalk = loadImage("assets/sidewalk.png");

    orbit = loadSound("assets/orbit.mp3");
    hitSound = loadSound("assets/hit1.mp3");
    boomSound = loadSound("assets/hitxplosion.mp3");
    pHitSound = loadSound("assets/hit2.mp3");
}

function drawExplosion() {
    for(y=0;y<explosions.length;y++) {
        explosions[y][2] ++;
        if(explosions[y][3] == "dead") {
            fill(255, 0, 0, 255-(explosions[y][2]*2.55))
        } else {
            fill(255, 255, 0, 255-(explosions[y][2]*2.55)) 
        }
        ellipse(explosions[y][0]-playerObj.scrollX, explosions[y][1]-playerObj.scrollY, explosions[y][2]*10)
        if(explosions[y][2]>=100){
            explosions.splice(y, 1)
        }
    }
}

function drawWeapon(weapon, x, y, dir) {
    if(weapon == "dsword") {
        if(dir == "up") {
            image(swordUp, x, y, 50, 50)
        }
        else if(dir == "down") {
            image(swordDown, x, y, 50, 50)
        }
        else if(dir == "left") {
            image(swordLeft, x, y, 50, 50)
        }
        else if(dir == "right") {
            image(swordRight, x, y, 50, 50)
        }
    }
}



function toggleWalk() { // Toggling the walk animation
    if (playerObj.frame == 0) {
        playerObj.frame = 1;
    } else if (playerObj.frame >= 1 && playerObj.frame < 3) {
        playerObj.frame += 0.05; // Slowing down the walk cycle
    } else if (playerObj.frame >= 3) {
        playerObj.frame = 1;
    }
}

function playSoundtrack() { // Playing the music
    if (orbit.isPlaying()) {
    } else {
        orbit.play();
    }
}

function drawSprite(dir, frame, x, y, width, height) { // Draw the player
    if (dir == "down") {
        if (floor(frame) == 0) {
            image(down_idle,x-playerObj.scrollX,y-playerObj.scrollY, width*1.5, height*1.5);
        } else if (floor(frame) == 1) {
            image(down_1,x-playerObj.scrollX,y-playerObj.scrollY, width*1.5, height*1.5);
        } else if (floor(frame) == 2) {
            image(down_2,x-playerObj.scrollX,y-playerObj.scrollY, width*1.5, height*1.5);
        }
    } if (dir == "up") {
        if (floor(frame) == 0) {
            image(up_idle,x-playerObj.scrollX,y-playerObj.scrollY, width*1.5, height*1.5);
        } else if (floor(frame) == 1) {
            image(up_1,x-playerObj.scrollX,y-playerObj.scrollY, width*1.5, height*1.5);
        } else if (floor(frame) == 2) {
            image(up_2,x-playerObj.scrollX,y-playerObj.scrollY, width*1.5, height*1.5);
        }
    } if (dir == "left") {
        if (floor(frame) == 0) {
            image(left_idle,x-playerObj.scrollX,y-playerObj.scrollY, width*1.5, height*1.5);
        } else if (floor(frame) == 1) {
            image(left_1,x-playerObj.scrollX,y-playerObj.scrollY, width*1.5, height*1.5);
        } else if (floor(frame) == 2) {
            image(left_2,x-playerObj.scrollX,y-playerObj.scrollY, width*1.5, height*1.5);
        }
    } if (dir == "right") {
        if (floor(frame) == 0) {
            image(right_idle,x-playerObj.scrollX,y-playerObj.scrollY, width*1.5, height*1.5);
        } else if (floor(frame) == 1) {
            image(right_1,x-playerObj.scrollX,y-playerObj.scrollY, width*1.5, height*1.5);
        } else if (floor(frame) == 2) {
            image(right_2,x-playerObj.scrollX,y-playerObj.scrollY, width*1.5, height*1.5);
        }
    } else {
        console.log(dir, frame)
    }
};

function drawAllWeapons() {
    for(i=0;i<weapons.length;i++) {
        drawWeapon("dsword", weapons[i].x-playerObj.scrollX, weapons[i].y-playerObj.scrollY, weapons[i].dir)
    }
}

function starryBackground() { // Creating a nice starry background
    background(0);
    fill(200)
    for(i=0;i<stars.length;i++) {
        rect(((playerObj.x/stars[i][2])+stars[i][0]),((playerObj.y/stars[i][2])+stars[i][1]), 4, 4); // Oof
    }
}

function infiniteTiles() { // Draw infinite tiles
    fancyX = (floor((playerObj.x)/100)*100)-playerObj.x // Making a nice fancy x for use in scrolling
    fancyY = (floor((playerObj.y)/100)*100)-playerObj.y // Same thing here

    for(y=0;y<(canvas_height/100)+1;y++) {
        for(x=0;x<(canvas_width/100)+2;x++) {
            image(tile, (x*100)+fancyX-25, (y*100)+fancyY+25, 50, 50)
        }
    }
}

function tileFloor() { // N I C E
    background(255);
    fancyX = (floor((playerObj.x)/30)*30)-playerObj.x // Making a nice fancy x for use in scrolling
    fancyY = (floor((playerObj.y)/30)*30)-playerObj.y // Same thing here
    for(i=0;i<canvas_width;i+= 30) {
        for(j=0;j<canvas_height;j+= 30) {
            noStroke();
            fill(200);
            ellipse(i+fancyX, j+fancyY, 5)
        }
    }
}

function lavaFloor() { // N I C E
    background(255);
    (fancyyCount += 0.5);

    fancyY = (Math.floor((fancyyCount-(playerObj.y/5))/70)*70)-(fancyyCount-(playerObj.y/5))

    fancyX = (Math.floor((playerObj.x/5)/70)*70)-((playerObj.x/5))
    for(i=0;i<canvas_width+140;i+= 70) {
        for(j=0;j<canvas_height+70;j+= 70) {
            image(lavaImg, i+fancyX-70, j-fancyY-70, 70, 70)
        }
    }
}

function draw() { // Drawing the graphics

    // ========================================

    // DRAW

    sinWave += 0.1

    fill(255); // WHITE
    // starryBackground(); // BG
    // infiniteTiles() // Tiles

    lavaFloor();

    for (i=0;i<gameData.length;i++) { // For gamedata.length

        gameDataSelection = gameData[i]; // Just a convinience


            if(gameDataSelection.timeout==0) {
                if (gameDataSelection["texture"] == "test") { // If this is of texture 'test'
                rect(gameDataSelection["x"]-playerObj.scrollX, gameDataSelection["y"]-playerObj.scrollY, gameDataSelection["width"], gameDataSelection["height"]) // Draw object

            } 

            else if (gameDataSelection.texture == "slime") {
                    if(gameDataSelection.awake == true){ // Drawing a "!"
                        textSize(25);
                        text("!", gameDataSelection["x"]-playerObj.scrollX+gameDataSelection.width/2, gameDataSelection["y"]-playerObj.scrollY-10)
                        textSize(15);
                    }
                    if(gameDataSelection.takesDamage == true) {
                        pWidth = gameDataSelection.width
                        healthOffset = (pWidth/5)*gameDataSelection.health;

                        fill(0, 255, 0)
                        rect(gameDataSelection.x-playerObj.scrollX, gameDataSelection.y-playerObj.scrollY, healthOffset, 10)

                        fill(255, 0, 0)
                        rect(gameDataSelection.x+healthOffset-playerObj.scrollX, gameDataSelection.y-playerObj.scrollY, pWidth-healthOffset, 10)
                    }

                    image(slime, gameDataSelection["x"]-playerObj.scrollX, gameDataSelection["y"]-playerObj.scrollY, gameDataSelection["width"], gameDataSelection["height"])

            } else if (gameDataSelection.texture == "plank") {
                for(q=gameDataSelection.x;q<gameDataSelection.width+gameDataSelection.x;q+=50) {
                    for(j=gameDataSelection.y;j<gameDataSelection.height+gameDataSelection.y;j+=20) {
                        image(plankImg, q-playerObj.scrollX, j-playerObj.scrollY, 50, 20);
                    }
                }

            } else if (gameDataSelection.texture == "sidewalk") {
                for(q=gameDataSelection.x;q<gameDataSelection.width+gameDataSelection.x;q+=50) {
                    for(j=gameDataSelection.y;j<gameDataSelection.height+gameDataSelection.y;j+=50) {
                        image(sideWalk, q-playerObj.scrollX, j-playerObj.scrollY, 50, 20);
                    }
                }
            } else if (gameDataSelection.texture == "teleport") {
                fill(255, 255, 255)
                ellipse(gameDataSelection["x"]-playerObj.scrollX, gameDataSelection["y"]-playerObj.scrollY, gameDataSelection["width"]+((Math.sin(sinWave)+1)*5), gameDataSelection["height"]+((Math.sin(sinWave)+1)*5))
            }

            else if (gameDataSelection["texture"] == "tile") { // If this is of texture 'tile'
            image(tile, gameDataSelection["x"]-playerObj.scrollX, gameDataSelection["y"]-playerObj.scrollY, gameDataSelection["width"], gameDataSelection["height"]);
            }
        }
    };

    // drawSprite(playerObj.dir, playerObj.frame, playerObj.x, playerObj.y, playerObj.width, playerObj.height); // Drawing you

    drawAllWeapons()
    drawExplosion()

    fill(255, 0, 0, 200-((playerObj.health*5)+(Math.sin(sinWave)*10)));
    rect(0, 0, canvas_width, canvas_height);

    fill(0, 0, 0, fadeCount)
    rect(0, 0, canvas_width, canvas_height);

    if(fadeCount>0) {
        fadeCount -= 10;
    }

    for (omg=0;omg<players.length;omg++) {
        currentPlayer = players[omg]
        if(currentPlayer.name == playerName) {
            newMg = omg;
        }
        // if(player.name == playerName) {
        //     var playerLoc = i;
        // }
        drawSprite(currentPlayer.dir, currentPlayer.frame, currentPlayer.x, currentPlayer.y, 40, 40); // Drawing player
            fill(255);
            text(currentPlayer.name, currentPlayer.x-playerObj.scrollX+ 25,currentPlayer.y-playerObj.scrollY-5); // Draw name
        // }

    }

    fill(0, 255, 0);
    rect(20, 20, playerObj.health, 30);
    fill(200);
    rect(20+playerObj.health, 20, 100-playerObj.health, 30);



    playSoundtrack();

    // ========================================

    // KEYBOARD INPUT

    bufferSpeed = 10;

    if (keyIsDown(LEFT_ARROW)) { // Left
        playerObj.dir = "left";
        sendData(-1, 0)
        // players[newMg].x -= bufferSpeed;
        pause = 0;
    }

    if (keyIsDown(RIGHT_ARROW)) { // Right
        playerObj.dir = "right";
        sendData(1, 0)
        // players[newMg].x += bufferSpeed;
        pause = 0;
    }

    if (keyIsDown(UP_ARROW)) { // Up
        playerObj.dir = "up";
        sendData(0, -1)
        // players[newMg].y -= bufferSpeed;
        pause = 0;
    }

    if (keyIsDown(DOWN_ARROW)) { // Down
        playerObj.dir = "down";
        sendData(0, 1)
        // players[newMg].y += bufferSpeed;
        pause = 0;
    }

    else {
        pause ++;
        if(pause>10) {
            sendData(0, 0);
        }
    };

    if (keyIsDown(32)) { // Space
        send({"type":"weapon.event"})
    };

    playerObj.scrollX = (playerObj.x - ((canvas_width/2)-(playerObj.width/2))) // Adjusting for scrolling
    playerObj.scrollY = (playerObj.y - ((canvas_height/2)-(playerObj.height/2)));

};