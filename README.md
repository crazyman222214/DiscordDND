# DiscordDND

## The Premise
This is a DM for a Dungeons and Dragons Campaign. Ideally, this will:
* Keep track of a story and keep it consistent -WIP-
* Keep track of players stats and do a milestone/xp system for level up
* Take care of combat and enemies

Each campaign will be unique, while being able to dynamically update the current campaign according to how the players act

**_Sounds Like Something An AI would do_**
#
This bot should be focused more on roleplaying and immersiveness

*More dialog, less game actions*

I am going to make this bot more advanced as time goes on until I feel like it has all the features that a good discord bot has while also making it easy to use for those who don't understand dnd

# How It Works
First I made a discord bot that just uses a standard command system

* !ping - talk to the AI
* !start - start the campaign

I am using OpenAI model gpt-3-turbo-1106 to generate prompts based on the user's input

Model settings:
* max_tokens: 250
* top_p: 0.3
* presense_penalty: 2
