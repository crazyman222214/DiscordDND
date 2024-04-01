module.exports = {
    Discord : require("discord.js"),
    config: require("./Config.json"),

};



//Constants for Node
const fs = require("fs");

//Constants for Discord API
const Discord = require("discord.js");
const config = require("./Config.json");

//Constants for OpenAI API
const  openAiAPI = require("openai");
const openAi = new openAiAPI({apiKey: config.openAI_Key});

//The message for the DND Ai's role
const aiRole = `You are a Dungeon Master running a dnd campaign.
Please describe to the players the scenery of the world in detail.
Also make sure that you don't do any actions for the players.
Let the players tell you how to control the campaign and describe what their actions do in relation of the world.
Encourage Dialog between characters within the world.`;
/*

 */

// A 'system' message tells the Ai how it should behave. A set of rules
const aiMessages = [{role: "system", content: aiRole}];
const aiResponses = [];

/**
 * This function is the main function prompting the Ai <br>
 * It creates a chat completion of the messages that the user has given
 * @param prompt The input to the Ai
 * @returns {Promise<string>} The Promise version of the response from OpenAI (async)
 */
async function promptAI(prompt) {
    var message = { role: "user", content: prompt };
    if (aiMessages.length > 3) { //only summarizes if there are 3 prompts (Technically 4 but the first is the System message)
        await summarizeAI();
        console.log(aiMessages);
    }
    aiMessages.push(message);

    const chatCompletion = await openAi.chat.completions.create({
        max_tokens: 250,
        top_p: 0.3,
        presence_penalty: 2,
        messages: aiMessages,
        model: "gpt-3.5-turbo-1106",
    });
    aiResponses.push(chatCompletion.choices[0].message);
    return chatCompletion.choices[0].message.content;
}

/**
 * This is the method that summarizes the chat log for the Ai so that it doesn't spit out the same answer for previous responses <br>
 * Takes in both the input and output of the Ai conversation
 * @returns Promise<void> Although it returns, we never capture the response
 */
async function summarizeAI() {
    const summaryAiRole = `You are a summary ai. Your task is to summarize the messages you are given into a short story. Do not give information that is not needed to give context for the most recent message`;
    const summaryMessages = [{role: "system", content: summaryAiRole}];
    console.log(aiResponses);
    let chatSummary;
    for (var i = 0; i < aiMessages.length-1; i++) {
        summaryMessages.push(aiMessages[i+1]);
        summaryMessages.push(aiResponses[i]);
    }

    console.log(summaryMessages);
    chatSummary = await openAi.chat.completions.create({
        max_tokens: 200,
        top_p: 0.75,
        messages: summaryMessages,
        model: "gpt-3.5-turbo-1106"
    });

    aiMessages.splice(1);
    aiMessages.push({role: "user", content: chatSummary.choices[0].message.content});
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


/**
 * This is the event that runs when a message is created in Discord<br>
 * This method checks if it has the correct prefix for a command<br>
 * And it checks if the command is valid:<br>
 * &emsp; if it is, then it runs the according function
 */
function onMessageCreate(msg) {
    if(msg.author.bot) return; // Doesn't respond to bots
    if(msg.content.indexOf(config.prefix) !== 0) return; // Only responding to existing commands that start with "!"
    const args = msg.content.slice(config.prefix.length).trim().split(/ +/g); // Configure arguments for the commands
    const command = args.shift().toLowerCase(); // Detect existing commands



    if (command === "ping") {
        promptAI(args.join(" ")).then(a => msg.reply(a));
    }

    if (command === "start") {
        promptAI("Describe the world of this campaign").then(a => msg.reply(a));
    }
}
client.on("messageCreate", (msg) => {onMessageCreate(msg)});


client.login(config.token);
