const Server = require("ws").Server;
const port = process.env.PORT || 9030;
const ws = new Server({port: port});

gameData = [
    {
        "x": 100,
        "y": 100,
        "width": 500,
        "height": 500,
        "texture": "test",
        "collision": true,
    },
    {
      "x": -200,
      "y": -200,
      "width": 100,
      "height": 100,
      "texture": "test",
      "collision": true,
      "sincount": 0,
    }
]

let text;
var standard_input = process.stdin;
var players = [];
var walkSpeed = 10;
var ybuffer = 50;
var xbuffer = 30;

function checkCollision(xPos, yPos, data, player) {

    bufferWidth = 50

    for(i=0;i<data.length;i++) {
      gameDataSelection = data[i];
        leftSide = gameDataSelection.x-player.width-xbuffer; // Defining the location of all the sides
        rightSide = gameDataSelection.x+gameDataSelection.width;
        topSide = gameDataSelection.y-walkSpeed-ybuffer;
        bottomSide = gameDataSelection.y+gameDataSelection.height;

        // console.log(leftSide, rightSide, bottomSide, topSide)
        // console.log(gameDataSelection)

        while (xPos > leftSide && xPos < rightSide && yPos > topSide && yPos < bottomSide && gameDataSelection.collision == true) {

            if (xPos < leftSide+bufferWidth) {
              console.log("Left");
              xPos --;
            }

            if (xPos > rightSide-bufferWidth) {
              console.log("Right")
              xPos ++;
            }

            if (yPos < topSide+bufferWidth) {
              console.log("Up")
              yPos --;
            }

            if (yPos > bottomSide-bufferWidth) {
              console.log("Down")
              yPos ++;
            }
        }

        return [xPos, yPos];
    }
}

function checkIfNameInList(msg) { // Checking if you should add a new character
    playerNameLoc = "none";

    for (i=0;i<players.length;i++) { // For lengh of player data
      if (players[i].name == msg.name) { // If their playerName is the same
          playerNameLoc = i; // Idk lol I'm tired
      };
    };

    return playerNameLoc;
};

function processMessage(msg, w) {

    msg = JSON.parse(msg); // Converting msg back
    if (msg.type == "player.loc") { // Updating player data
      playerNameLoc = checkIfNameInList(msg);
      if(msg.x >= -1 && msg.x <= 1 && msg.y >= -1 && msg.y <= 1) { // If the move is possible
        players[playerNameLoc].x += msg.x*walkSpeed;
        players[playerNameLoc].y += msg.y*walkSpeed;
        players[playerNameLoc].frame = msg.frame;
        players[playerNameLoc].dir = msg.dir; // Updating all of the things
        newData = checkCollision(players[playerNameLoc].x, players[playerNameLoc].y, gameData, players[playerNameLoc])
        players[playerNameLoc].x = newData[0]
      } else {
        console.log("ERROR 1")
      }
    } else if (msg.type=="player.new") { // Creating new player
      players.push({
        "x": 0,
        "y": 0,
        "width": 0,
        "height": 0,
        "name": msg.name,
        "id": w,
        "frame": 0,
        "dir": "down",
      });
    } else {
      console.log("ERROR 2")
    };
};

function globalMessage(txt)
 { // Send a global message
      for (i=0;i<players.length;i++) {
        players[i].id.send(JSON.stringify(txt)); // send message back to everyone
    }
}

function sendLocationData(w) {    
    sendFreindlyPlayers = []; // players without w
    for (i=0;i<players.length;i++) { // Living up to the magical promise of peace and prosperity for all... sorry, I got a bit carried away and iTs mIdNiGhT lFGygaHFUJHfug
      currentPlayers = { ...players[i] } // https://www.javascripttutorial.net/object/3-ways-to-copy-objects-in-javascript/
      delete currentPlayers["id"];
      sendFreindlyPlayers.push(currentPlayers);
    }

    dataToSend = {
      "type":"player.data", // The type
      "data": JSON.stringify(sendFreindlyPlayers) // The data
    }
    globalMessage(dataToSend)
}

standard_input.setEncoding('utf-8');

ws.on("connection", function(w) { // On connection
    console.log(w+" connected");
    w.send(JSON.stringify({type:"game.data","data":gameData})); // Sending the board
    globalMessage
    // connection

  w.on('close', function () { // If someone leaves
    console.log(w+" disconnected");
    for (i=0;i<players.length;i++) {
      if (players[i].id == w) {
        delete players.splice(i); // Delete them from the list
      };
    };
    sendLocationData(w);
  });


  w.on("message", function(data) { // Activate any time this client sends a message
    processMessage(data, w);
    sendLocationData(w);
  });
});

function mainLoop() {
  gameData[1].y = Math.sin(gameData[1].sincount)*100-200;
  gameData[1].sincount += 0.1;
  globalMessage({type:"game.data","data":gameData})

  for(playerSelection=0;playerSelection<players.length;playerSelection++) {
    newData = checkCollision(players[playerSelection].x, players[playerSelection].y, gameData, players[playerSelection]); // Checking collision
    try {
    oldx = players[playerSelection].x;
    oldy = players[playerSelection].y;
    players[playerSelection].x = newData[0];
    players[playerSelection].y = newData[1];

    if (oldx != players[playerSelection].x || oldy != players[playerSelection].y) { // If there's some sort of change
      sendLocationData();
    }
    
    } catch {
      console.log("ERROR 3")
    }
  }
}

setInterval(mainLoop, 100);