
//Constants for Discord API
const Discord = require("discord.js");
const config = require("./Config.json");

//Constants for OpenAI API
const  openAiAPI = require("openai");

const openAi = new openAiAPI(
    {apiKey: config.openAI_Key}
);
async function promptAI(prompt) {

    const chatCompletion = await openAi.chat.completions.create({
        messages: [{ role: "system", content: prompt }],
        model: "gpt-3.5-turbo",
    });
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
