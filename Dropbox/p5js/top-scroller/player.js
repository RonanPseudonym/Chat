class Player { // Making the player

    constructor(x, y) { // Defining vars
        this.x = x; // xPos
        this.y = y; // yPos
        this.width = 40;
        this.height = 40;
        this.ybuffer = 20;
        this.xbuffer = 0;
        this.walkSpeed = 10;
        this.scrollX = 0;
        this.scrollY = 0;
        this.dir = "down";
        this.frame = 0;
        this.health = 100;

    } collision(xPos, yPos, data) {

        var returnData = [] // What to return

        for (i=0;i<data.length;i++) { // For gamedata.length

            gameDataSelection = data[i]; // Just a convinience

            if ((xPos <= (gameDataSelection["x"]+gameDataSelection["width"]-playerObj.walkSpeed)) && xPos >= (gameDataSelection["x"]-playerObj.width+playerObj.walkSpeed)) { // If the x is greater than x pos and smaller than x pos + width (Accounting for the walking speed)

                if ((yPos <= (gameDataSelection["y"]+gameDataSelection["height"]-playerObj.walkSpeed)) && yPos >= (gameDataSelection["y"]-playerObj.height-playerObj.ybuffer+playerObj.walkSpeed)) { // If the y is greater than y pos and smaller than y pos + height (Accounting for the walking speed)

                    if (gameDataSelection["collision"]) { // If we're looking for collision

                        returnData.push({"type":gameDataSelection["type"]}); // Push the type
                    };

                };

            };

        };

        return returnData // Done!

    };

};

let playerObj = new Player(0, 0); // Creating new