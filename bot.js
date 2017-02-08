/*
	Simple discord level up by Zeb.
	Using discord.js api to work with the discord chat,
	and amazon web services to connect with a noSQL database.
*/


//initialization
const fs = require('fs');
const AWS = require("aws-sdk");
const Discord = require("discord.js");
const client = new Discord.Client();
const botConstants = require("./botConstants.js");
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

//global variables to be read from locally stored json file
var levelUpReq = [];
var channel;
var owner;
var newsAndEvents;
var applications;
var userSushi;
var test;

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
		botToken = obj.token;
		userSushi = obj.sushi;
		test = obj.test;
		client.login(obj.token);
		
		//music bot currently uses up too many resources. disabling for now
		//mBot.run(serverName, textChannelName, voiceChannelName, aliasesFile, botToken);
		
	}
	
}); 


client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`);
});

client.on('guildMemberAdd', () =>{
	client.channels.get(channel).sendMessage("Welcome to the server!");
});


//message.reply replies to the user
//message.channel.sendMessage sends a message without mentioning 

client.on('message', function(message) {
	
	//we never want the bot to reply to anything it says
	if (message.author.id.localeCompare("276207143961755648") !== 0){
		
		
		if (message.content.toLowerCase() === 'give me sushi' || message.content.toLowerCase() === 'sushi please') {
			message.channel.startTyping();
			message.reply(botConstants.sushi[Math.floor(Math.random()*8)]);
			
			message.channel.stopTyping(true);
			
		}else if (message.content.toLowerCase() === '!commands'){
			
			//PM the user the commands
			message.author.sendMessage(botConstants.commands);
			//" 7) **!trophyList** : Displays all available trophies");
		
		}else if (message.content.toLowerCase() === '!trophyList GGGGGG'){
		
			//PM the user the list of trophies
			message.author.sendMessage(botConstants.trophies);
		
		}else if (message.content.toLowerCase() === '!fun fact'){
			
			message.channel.startTyping();
			
			message.channel.sendMessage(botConstants.funFacts[Math.floor(Math.random()*3)]);
		
			message.channel.stopTyping(true);	
		
		}else if (message.content.toLowerCase() === "what is hangout utopia?"){
			
			message.channel.startTyping();
			
			//not putting in botconstants because it relies on variables in bot.js and I don't want cyclic dependencies
			message.reply("Hangout Utopia is a discord server that Supports Gaming and Art, we're a very Active / Friendly community that has a lot of fun events that you can get involved in!\n\n If you'd like to learn more, then check out " + `${client.channels.get(newsAndEvents)}` + " for all the fun activities! If you want to get involved then check out " + `${client.channels.get(applications)}` + ". We have a lot of a roles that you def would be able to apply for!");
			
			message.channel.stopTyping(true);
			
		}else if (message.content.toLowerCase() === "!level"){
			
			message.channel.startTyping();
			
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
					message.reply("Error :/ Please contact Zeb about this");
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
										"exp": 0,
										"trophies": []
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
			
			message.channel.stopTyping(true);
			
			
		}else if (message.content.toLowerCase() === '!trophies'){
			
			message.channel.startTyping();
			
			let params = {
				TableName: "discordBot",
				Key:{
					"userID": message.author.id
				}
			};

			//look up a user's trophy list. if the user never talked before, create new entry
			docClient.get(params, function(err, data) {
				if (err) {
					console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
					message.reply("Error :/ Please contact Zeb about this");
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
										"exp": 0,
										"trophies": []
									}
								}
								
								docClient.put(newID, function(err, data){
									  if (err) {
										console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
									} else {
										console.log("Created new table entry for " + message.author.username, JSON.stringify(data, null, 2));
									}
								});
								message.reply("You currently have no trophies.");
					}else{
						
						//emojis is a collection, so use .find to get the emoji object
						//alternatively, you can use 'get' to find via ID
						//message.reply(client.emojis.find('name', 'bronze'));
						let trophies = "";
						
						data.Item.trophies.forEach(trophy =>{
							trophies += client.emojis.find('name', trophy);
						});
						
						if (trophies === ""){
							message.reply("You currently have no trophies.");
						}else{
							console.log(typeof(trophies));
							
							message.reply(trophies);
						}
					}
				}
			});
			
			message.channel.stopTyping(true);
			
			//grant user of choice a trophy
		}else if (message.author.id === userSushi || message.author.id === owner){
			
			if (message.content.toLowerCase().substring(0, 5) === "!give"){
				
				let values = message.content.split(" ");
				console.log(values);
				//check if trophy is valid, otherwise just restart
				//if (values[2]){
				
					let params = {
						TableName: "discordBot",
						Key:{
							"userID": values[1]
						}
					};

					//look up a user's trophy list. if the user never talked before, create new entry
					docClient.get(params, function(err, data) {
						if (err) {
							console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
							message.reply("Error :/ Please contact Zeb about this");
						} else {
							
							console.log(data);
							
							if (data.Item == undefined){
										
								message.reply(" The ID you included either isn't valid, or the person has never talked in all chat before (he/she needs to type something in chat-topia to have a profile created.");
								
							}else{
								
								let userTrophies = data.Item.trophies;
								
								//check whether or not the user already has the trophy
								if (trophyList.indexOf(values[2]) > -1){
								
									let updatedUser = {
											TableName:"discordBot",
											Key:{
												"userID": message.author.id
											},
											UpdateExpression: "set lvl = :l, exp = :e, trophies = :t",
											ExpressionAttributeValues:{
												":l":data.Item.lvl,
												":e":data.Item.exp,
												":t":userTrophies
											},
											ReturnValues:"UPDATED_NEW"
										};
										
										
										docClient.update(updatedUser, function(err, data) {
											if (err) {
												console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
												message.reply("Error :/ Please contact Zeb about this");
											} else {
												
												
												console.log("Successfully updated", JSON.stringify(data, null, 2));
												message.reply("Trophy successfully granted! :smiley:");
												
												//broadcast the good news
												client.channels.get(newsAndEvents).sendMessage("")
											}
										});
								}else{
									
									message.reply("This user already has the " + values[2] + " trophy.");
								}
									
									
							}
						}
					});
				}
				
			}
		
		
		//if the message isn't a pm and is in the correct channel, give them exp
		if (message.channel.type === "dm") {
			message.reply("(Private) " + `${message.author.username}: ` + " Yo fam I ain't here for your personal service. My functions will only work in the main chat :^)");
			
		//if not a PM, then add it towards the user's word count.
		} else if (message.channel.id.localeCompare(test) === 0){
		//}else if (message.content === 'ultra secret command'){	
				
				
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
						message.reply("Error :/ Please contact Zeb about this");
						
					}else{
						
						//if this is the user's first time talking, create new entry
						if (data.Item == undefined){
							
							let newID = {
								TableName:"discordBot",
								Item:{
									"userID": message.author.id,
									"lvl": 0,
									"exp": 0,
									"trophies": []
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
							let userTrophies = curUser.trophies;
							while (exp >= levelUpReq[lvl]){
								message.channel.startTyping();
								console.log("Level up!");
								lvl++;
								
								let random = Math.floor(Math.random()*5);
								
								
								if (message.author.id.localeCompare(owner) === 0){
									message.channel.sendMessage("Congratulations master " + message.author.username + ", you just leveled up! (to level " + lvl + ") :^)");
									
								}else if (message.author.id.localeCompare(userSushi) === 0){
									message.channel.sendMessage("The King of Sushi, KNOCKOUTSUSHI, has just gained yet ANOTHER level (level " + lvl + ").");
								
								}else{
									message.channel.sendMessage(message.author.username + " just leveled up to level " + lvl + "! " + botConstants.face[random]);
								}
								
								if (lvl == 10){
									userTrophies.push("bronze");
									message.channel.sendMessage(message.author.username + " also earned a bronze trophy! Congratulations!");
									
								}else if (lvl == 20){
									userTrophies.push("silver");
									message.channel.sendMessage(message.author.username + " also earned a silver trophy! Congratulations!");
									
								}else if (lvl == 30){
									userTrophies.push("gold");
									message.channel.sendMessage(message.author.username + " also earned a gold trophy! Congratulations!");
									
								}else if (lvl == 40){
									userTrophies.push("bronze");
									message.channel.sendMessage(message.author.username + " also earned a bronze trophy! Congratulations!");
									
								}else if (lvl == 50){
									userTrophies.push("bronze");
									message.channel.sendMessage(message.author.username + " also earned a bronze trophy! Congratulations!");
									
								}
								
								message.channel.stopTyping(true);
							}
								
							
							
							let updatedUser = {
								TableName:"discordBot",
								Key:{
									"userID": message.author.id
								},
								UpdateExpression: "set lvl = :l, exp = :e, trophies = :t",
								ExpressionAttributeValues:{
									":l":lvl,
									":e":exp,
									":t":userTrophies
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
