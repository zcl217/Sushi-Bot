/*
	Simple discord level up by Zeb.
	Using discord.js api to work with the discord chat,
	and amazon web services to connect with a noSQL database.
*/
const fs = require('fs');
const AWS = require("aws-sdk");
const Discord = require("discord.js");
const client = new Discord.Client();
var mBot = require("discord-music-bot");

var serverName = "Hangout Utopia";
var textChannelName = "bot-command-test";
var voiceChannelName = "ADMIN Meeting";
var aliasesFile = "aliases";
var botToken;



AWS.config.update({
  region: "us-west-2",
  endpoint: "https://dynamodb.us-west-2.amazonaws.com"
});

const docClient = new AWS.DynamoDB.DocumentClient()

const face = [":muscle: :alien:", ":hear_no_evil:", ":grinning:", ":smiley:", ":hugging:"]

const sushi = [
	"Here is a delicious California Sushi roll at your service!",
	":sushi::sushi::sushi:",
	"I got you the flaming hot spicy Volcano Sushi Roll be careful it packs a bunch!",
	"Dynamite Sushi Roll on the dial! It has an explosion of flavors!",
	"Dragon Sushi Roll will def exceed your expectations, try it now!",
	"Looking for a crunch?! Well here's a Sushi Crunchy Roll!",
	"You want a party in your mouth!? Rainbow Sushi Roll will blast you with flavor!",
	"Oh noo! Bad luck for you! >:D You will now eat a POISON SUSHI Roll! MWAHahaha.... I'm just kidding c:"
]

var levelUpReq = [];
var channel;
var owner;
var newsAndEvents;
var applications;

fs.readFile('./json/data.json', {encoding:'utf8'}, function(err, data) {
	if (err){
		console.log(err);
	}else{
		
		let obj = JSON.parse(data);
		for (let a = 0; a < 10; a++){
			levelUpReq[a] = obj[a];
		}
		owner = obj.owner;
		channel = obj.chatChannel;
		newsAndEvents = obj.news;
		applications = obj.applications;
		console.log(levelUpReq);
		botToken = obj.token;
		client.login(obj.token);
		
		
		
		//mBot.run(serverName, textChannelName, voiceChannelName, aliasesFile, botToken);
		
		
	}
	
}); 


client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`);
 
});

//char limit is 2k
//set lvl 1 to like 100, level 2 to 2300 total or something

//so all we have to do is += the length to the user's schema in the database
//user id is a string not int

client.on('message', function(message) {
	
	//we never want the bot to reply to anything it says
	if (message.author.id.localeCompare("276207143961755648") !== 0){
		
		
		if (message.content.toLowerCase() === 'give me sushi' || message.content.toLowerCase() === 'sushi please') {
			message.reply(sushi[Math.floor(Math.random()*8)]);

		}else if (message.content.toLowerCase() === "what is hangout utopia?"){
			message.reply("Hangout Utopia is a discord server that Supports Gaming and Art, we're a very Active / Friendly community that has a lot of fun events that you can get involved in!\n\n If you'd like to learn more, then check out " + `${client.channels.get(newsAndEvents)}` + " for all the fun activities! If you want to get involved then check out " + `${client.channels.get(applications)}` + ". We have a lot of a roles that you def would be able to apply for!");
			
		}else if (message.content.toLowerCase() === "!level"){
			let params = {
				TableName: "discordBot",
				Key:{
					"userID": message.author.id
				}
			};

			//look up a user's level. if the user never talked before, create new entry
			docClient.get(params, function(err, data) {
				if (err) {
					console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
				} else {
					console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
					console.log(data);
					
					if (data.Item == undefined){
								//create new table entry
								
								let newID = {
									TableName:"discordBot",
									Item:{
										"userID": message.author.id,
										"lvl": 0,
										"exp": 0
									}
								}
								
								docClient.put(newID, function(err, data){
									  if (err) {
										console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
									} else {
										console.log("Created new table entry for " + message.author.username, JSON.stringify(data, null, 2));
									}
								});
								message.reply("You are currently a level 0 :sushi:");
					}else{
						message.reply("You are currently a level " + data.Item.lvl + " :sushi:");
					}
				}
			});
		}
		
		//if the message isn't a pm and is in the correct channel, give them exp
		if (message.channel.type === "dm") {
			message.reply("(Private) " + `${message.author.username}: ` + " Yo fam I ain't here for your personal service. You ain't gon get no exp unless you talk in the main chat. :^)");
			
		//if not a PM, then add it towards the user's word count.
		} else if (message.channel.id.localeCompare(channel) === 0){
			message.channel.startTyping();
				
				
				let params = {
					TableName: "discordBot",
					Key:{
						"userID": message.author.id
					}
				}
			//	console.log("before docClient");
				
				var exp = 0;
				docClient.get(params, function(err, data){
					if (err){
						console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
						
					}else{
						
						//if this is the user's first time talking, create new entry
						if (data.Item == undefined){
							
							let newID = {
								TableName:"discordBot",
								Item:{
									"userID": message.author.id,
									"lvl": 0,
									"exp": 0
								}
							}
							
							docClient.put(newID, function(err, data){
								  if (err) {
									console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
								} else {
									console.log("Created new table entry for " + message.author.username, JSON.stringify(data, null, 2));
								}
							});
							
						}else{
							
							let curUser = data.Item;
							let exp = message.content.length + curUser.exp;
							let lvl = curUser.lvl;
							
							if (exp >= levelUpReq[lvl]){
								console.log("Level up!");
								lvl++;
								
								let random = Math.floor(Math.random()*5);
								
								if (message.author.id.localeCompare(owner) === 0){
									message.channel.sendMessage("Congratulations master " + message.author.username + ", you just leveled up!");
								}else{
									message.channel.sendMessage(message.author.username + " just leveled up to level " + lvl + "! " + face[random]);
								}
							}
								
							
							
							let updatedUser = {
								TableName:"discordBot",
								Key:{
									"userID": message.author.id
								},
								UpdateExpression: "set lvl = :l, exp = :e",
								ExpressionAttributeValues:{
									":l":lvl,
									":e":exp
								},
								ReturnValues:"UPDATED_NEW"
							};
							
							
							docClient.update(updatedUser, function(err, data) {
								if (err) {
									console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
								} else {
									console.log("Successfully updated", JSON.stringify(data, null, 2));
								}
							});
							
						}
					}
				});
				
			message.channel.stopTyping(true);
		}
		
	}
});

/*
client.on('message', function(message) {
	console.log(client);
        client.sendMessage(message, "Hello!");
});*/


//to type normally in a channel:
// msg.channel.sendMessage('pong');
