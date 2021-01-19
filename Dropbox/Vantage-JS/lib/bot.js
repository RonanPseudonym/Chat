/*
VANTAGE.JS 

CREATED: 1/18/2021
AUTHOR: PIXELDIP STUDIOS
DESCRIPTION: A CITY-BUILDING DISCORD BOT WRITTEN IN DISCORD.JS
*/

const { debug } = require('console');
const Discord = require('discord.js');
const fs = require('fs');
const { exit } = require('process');
const { exec } = require("child_process");

const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

console.clear()

var t0 = Date.now(); // Checking how long the program took to boot by subtracting the end time by the time it started (ms)

// ========== UTILS ==========



function time(time) { // Turning '6' to '06'
    time = JSON.stringify(time);
    time = "0".repeat(2-time.length)+time;
    return time;
}

function log(text, color, self) { // Printing "[h:m:s] text"
    let end = "";
    if(color==undefined) {
        color = "";
    }
    else {
        try {
            end = data.colors.reset;
        }
        catch {
            end = self.colors.reset;
        }
    }

    let date = new Date();

    console.log("["+time(date.getHours())+":"+time(date.getMinutes())+":"+time(date.getSeconds())+"] "+color+text+end);
}

function header(text) { // Nice, fancy header
    console.log()
    log(text.toUpperCase(), data.colors.blue);
}

function define(path) { // Loading JSON data from path
    let t = JSON.parse(fs.readFileSync(path));
    log("Loaded "+path, data.colors.green, this);
    return t;
}

function define_script(path) {
    const command = require(`./commands/${path}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
    
    log('Imported '+command.name, data.colors.green);
}


// ========== LOADING JSON ==========



data = {
    "colors": {
        "reset":"\x1b[0m",
        "green":"\x1b[32m",
        "red":"\x1b[31m",
        "blue":"\x1b[1m\x1b[34m"
    }
};

log("BOT.JS BEGIN", data.colors.blue);
header("Load JSON Data");

const jsonData = fs.readdirSync('../assets').filter(file => file.endsWith('.json')); // Defining them by checking all the files in the commands folder
for (const file of jsonData) {
    data[file.replace(".json","")] = define('../assets/'+file);
}

data['package'] = define('../package.json');

// ========== DISCORD.JS INTERACTION ==========


const client = new Discord.Client();
client.commands = new Discord.Collection(); // A bunch of commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); // Defining them by checking all the files in the commands folder

header("Load command files");

for (const file of commandFiles) {
	define_script(file);
}

client.once('ready', () => { // On bootup
    header("Bot Online");

    client.user.setActivity(data.settings.status.text, { type: data.settings.status.type });
    log('Changed status to '+data.settings.status.type+" "+data.settings.status.text, data.colors.green);

    header("Bot Data");
    log('   Name        '+data.package.name);
    log('   Version     '+data.package.version);
    log('   Description '+data.package.description);
    log('   Git         '+data.package.repository.url);
    log('   Author      '+data.package.author);

    header("Booted in "+((Date.now()-t0)/1000)+" seconds")

    shell();
});

client.on('message', message => { // On message

    if(message.content.includes(data.settings.wake)) { // If message conforms to $[command]
        let content = message.content.replace(data.settings.wake, "").toLowerCase(); // The message, but without '$'
        let args = message.content.replace(data.settings.wake+content+" ","").trim().split(/ +/); // Any additional argumentss

        if(content in data.autoreply) // Autoreplying (autoreply.json)
        {
            message.channel.send(data.autoreply[content]);
            log(data.autoreply[content]);
        } else {
            try {
                client.commands.get(content).execute(message, args);
            } catch (error) {
                log('Command Execution Error', data.colors.red);
                log(error, data.colors.red);
            }
        }
    }
    
});

var shell = function () {
    rl.question("> ", function (cmd) {
        log("Recived command "+cmd);

        args = cmd.split(/ +/);

        if(cmd === "quit"){exit()}

        if(args[0] === "load"){

            if(args[1].split(".")[1] === "js") {
                delete require.cache[require.resolve(`./commands/${args[1]}`)];
                define_script(args[1])
            }

            if(args[1].split(".")[1] === "json") {
                data[args[1].split(".")[0].split("/")[1]] = define("../"+args[1]);
            }

        }

        if(args[0] === "commit") {
            log("Pushing to GitHub with commit "+cmd.replace(args[0]+" ",""));
            exec("git add .");
            exec("git commit -m "+cmd.replace(args[0]+" ",""));
            exec("git push origin master");
        }

        shell();

    });
};

client.login(data.bot_data.token);  