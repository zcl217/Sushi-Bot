const Discord = require("discord.js");
const client = new Discord.Client();

/*
var serverName = "bot testing";
var textChannelName = "tester";
var voiceChannelName = "General";
var botToken = "Mjc2MjA3MTQzOTYxNzU1NjQ4.C3ORXQ.nXFQh5Ad6PP2qPktNtan6AEEpO8";
bot.run(serverName, textChannelName, voiceChannelName, botToken);
*/

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`);
  
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
	
  }
});

client.login('Mjc2MjA3MTQzOTYxNzU1NjQ4.C3L3uA.Di2UZA-Y5MeX3AaGG89cDLBKT9c');
        

// Mjc2MjA3MTQzOTYxNzU1NjQ4.C3L3uA.Di2UZA-Y5MeX3AaGG89cDLBKT9c



//to type normally in a channel:
// msg.channel.sendMessage('pong');
