//Constants for Node
const fs = require("fs");

//Constants for Discord API
const Discord = require("discord.js");
const config = require("./Config.json");

//Constants for OpenAI API
const  openAiAPI = require("openai");
const openAi = new openAiAPI(
    {apiKey: config.openAI_Key}
);
const aiRole = `You are a Dungeon Master running a dnd campaign. 
Please describe to the players the scenery of the world in detail.
Also make sure that you don't do any actions for the players. 
Let the players tell you how to control the campaign and describe what their actions do in relation of the world.
Encourage Dialog between characters within the world. Keep your response under 200 tokens`;

const aiMessages = [{"role": "system", "content": aiRole}];

async function promptAI(prompt) {
    var message = { role: "user", content: prompt };
    aiMessages.push(message);
    if (aiMessages.length > 5) {
        aiMessages.splice(1, 1);
    }
    const chatCompletion = await openAi.chat.completions.create({
        max_tokens: 250,
        top_p: 0.3,
        presence_penalty: 2,
        messages: aiMessages,
        model: "gpt-3.5-turbo-1106",
    });
    console.log(chatCompletion.model);
    return chatCompletion.choices[0].message.content;
}


//Discord stuff
const client = new Discord.Client({
    intents:[Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent]});

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
        promptAI(args.join(" ")).then(a => msg.reply(a));
    }
});

client.login(config.token);
