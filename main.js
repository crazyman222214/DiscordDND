const Discord = require("discord.js");
const config = require("./Config.json");

const client = new Discord.Client({
    intents:[Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent]})

//This runs when the bot is ready to start being used
client.on("ready", () =>{
    console.log(`Logged in as ${client.user.tag}!`);
});


//This runs when there is a new message in the server
client.on("messageCreate", msg => {
    if(msg.author.bot) return; // Doesn't respond to bots
    if(msg.content.indexOf(config.prefix) !== 0) return; // Only responding to existing commands that start with "!"
    const args = msg.content.slice(config.prefix.length).trim().split(/ +/g); // Configure arguments for the commands
    const command = args.shift().toLowerCase(); // Detect existing commands



    if (command === "ping") {
        msg.reply("pong");
    }
});

client.login(config.token);
