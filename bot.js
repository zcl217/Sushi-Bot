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

var serverName = "Greed Utopia";
var textChannelName = "bot-command-test";
var voiceChannelName = "ADMIN Meeting";
var aliasesFile = "aliases";
var botToken;

var docClient;

//global variables to be read from locally stored json file
var levelUpReq = [];
var channel;
var owner;
var newsAndEvents;
var applications;
var userSushi;
var userYang
var test;
var gameChannel;

fs.readFile('./json/data.json', {encoding:'utf8'}, function(err, data) {
	if (err){
		console.log(err);
	}else{
		
		
		let obj = JSON.parse(data);
		for (let a = 0; a < 50; a++){
			levelUpReq[a] = obj[a];
		}

		AWS.config.update({
		  region: "us-west-2",
  		  endpoint: "https://dynamodb.us-west-2.amazonaws.com",
		 accessKeyId: obj.accessID,
  		 secretAccessKey: obj.accessKey
		});

		docClient = new AWS.DynamoDB.DocumentClient();

		owner = obj.owner;
		channel = obj.chatChannel;
		newsAndEvents = obj.news;
		applications = obj.applications;
		botToken = obj.token;
		userSushi = obj.sushi;
		test = obj.test;
		gameChannel = obj.game;
		client.login(obj.token);
		
		//music bot currently uses up too many resources. disabling for now
		//mBot.run(serverName, textChannelName, voiceChannelName, aliasesFile, botToken);
		
	}
	
}); 


client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`);
});

client.on('guildMemberAdd', (guildMember) =>{
	client.channels.get(channel).sendMessage("Welcome to the server, " + guildMember.user.username + "! :hugging:");
});


//message.reply replies to the user
//message.channel.sendMessage sends a message without mentioning 

client.on('message', function(message) {
	
	//we never want the bot to reply to anything it says
	if (message.author.id.localeCompare("276207143961755648") !== 0){
		
		
		if (message.content.toLowerCase() === '!give me sushi' || message.content.toLowerCase() === '!sushi please') {
			message.channel.startTyping();
			message.reply(botConstants.sushi[Math.floor(Math.random()*8)]);
			
			message.channel.stopTyping(true);
			
		}else if (message.content.toLowerCase() === '!commands'){
			
			//PM the user the commands
			message.author.sendMessage(botConstants.commands);
			
		}else if (message.content.toLowerCase() === '!fun fact'){
			
			message.channel.startTyping();
			
			message.channel.sendMessage(botConstants.funFacts[Math.floor(Math.random()*3)]);
		
			message.channel.stopTyping(true);	
		
		}else if (message.content.toLowerCase() === "!what is greed utopia?"){
			
			message.channel.startTyping();
			
			//not putting in botconstants because it relies on variables in bot.js and I don't want cyclic dependencies
			message.reply("Greed Utopia is a discord server that Supports Gaming and Art, we're a very Active / Friendly community that has a lot of fun events that you can get involved in!\n\n If you'd like to learn more, then check out " + `${client.channels.get(newsAndEvents)}` + " for all the fun activities! If you want to get involved then check out " + `${client.channels.get(applications)}` + ". We have a lot of a roles that you def would be able to apply for!");
			
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
								message.channel.send(message.author.username + " is currently a level 0 :sushi:");
					}else{
						message.channel.send(message.author.username + " is currently a level " + data.Item.lvl + " :sushi:");
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
			docClient.get(params, function(err, dataTrophy) {
				if (err) {
					console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
					message.reply("Error :/ Please contact Zeb about this");
				} else {
					console.log("GetItem succeeded:", JSON.stringify(dataTrophy, null, 2));
					console.log(dataTrophy.Item);
					
					if (dataTrophy.Item == undefined){
								//create new table entry
								
								let newID = {
									TableName:"discordBot",
									Item:{
										"userID": message.author.id,
										"lvl": 0,
										"exp": 0,
										"trophies": [],
										"coins": 0
									}
								}
								
								docClient.put(newID, function(err, data){
									  if (err) {
										console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
									} else {
										console.log("Created new table entry for " + message.author.username, JSON.stringify(data, null, 2));
									}
								});
								message.channel.send(message.author.username + " currently has no trophies.");
					}else{
						
						//emojis is a collection, so use .find to get the emoji object
						//alternatively, you can use 'get' to find via ID
						//message.reply(client.emojis.find('name', 'bronze'));
						let trophies = "";
						
						dataTrophy.Item.trophies.forEach(trophy =>{
							trophies += client.emojis.find('name', trophy);
						});
						
						if (trophies === ""){
							message.channel.send(message.author.username + " currently has no trophies.");
						}else{
							console.log(typeof(trophies));
							
							message.channel.send("Here is your list of trophies. :heart_eyes_cat:");
							message.channel.send(trophies);
						}
					}
				}
			});
			
			message.channel.stopTyping(true);
			
		}else if (message.content.toLowerCase().substring(0, 14) === "!trophiesother"){
			
			let user = client.users.find("username", message.content.substring(message.content.indexOf(" ")+1));
			let userID = "";
			
			let values = message.content.split(" ");
			
			message.channel.startTyping();
			
			if (user == null){
				
				userID = values[1];
				
			}else{
				userID = user.id;
				
				//if the person opts to search by username and not by ID, then we still pretend they searched
				//by ID to make checking valid IDs easier
				values[1] = userID;
			}
			
			if (client.users.get(values[1]) == undefined){
				message.reply(" Invalid ID/username. Please make sure you wrote it correctly (or maybe their username is not the same as their nickname :sushi:).");
				
				message.channel.stopTyping(true);
				
			}else{
			
				let params = {
					TableName: "discordBot",
					Key:{
						"userID": userID
					}
				};

				//search for target user's trophylist
				docClient.get(params, function(err, dataTrophy) {
					if (err) {
						console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
						message.reply("Error :/ Please contact Zeb about this");
					} else {
						console.log("GetItem succeeded:", JSON.stringify(dataTrophy, null, 2));
						console.log(dataTrophy.Item);

						if (dataTrophy.Item == undefined){
										
								message.reply(" Invalid ID/username. Please make sure you wrote it correctly (or maybe their username is not the same as their nickname :sushi:).");
						}else{
							
							//emojis is a collection, so use .find to get the emoji object
							//alternatively, you can use 'get' to find via ID
							//message.reply(client.emojis.find('name', 'bronze'));
							let trophies = "";
							
							dataTrophy.Item.trophies.forEach(trophy =>{
								trophies += client.emojis.find('name', trophy);
							});
							
							if (trophies === ""){
								message.channel.send(client.users.get(values[1]).username + " currently has no trophies.");
							}else{
								console.log(typeof(trophies));
								console.log(typeof(client.users.get(values[1])));
								console.log(client.users.get(values[1]));
								message.channel.send("Here is a list of " + client.users.get(values[1]).username + "'s trophies:");
								message.channel.send(trophies);
							}
						}
						
					}
				});
				
				
				
			}
			
			message.channel.stopTyping(true);
			
			
		//tell the user how many coins they have
		}else if (message.content.toLowerCase() === "!coinsA"){
				
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
										"trophies": [],
										"coins": 0
									}
								}
								
								docClient.put(newID, function(err, data){
									  if (err) {
										console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
									} else {
										console.log("Created new table entry for " + message.author.username, JSON.stringify(data, null, 2));
									}
								});
								message.reply(" You currently have 0 coins. " + client.emojis.find('name', 'HUCoins'));
					}else{
						
						if (data.Item.coins == undefined){
							
							message.reply(" You currently have 0 coins. " + client.emojis.find('name', 'HUCoins'))
						}else{
							message.reply(" You currently have " + data.Item.coins + " coins. " + client.emojis.find('name', 'HUCoins'));
						}
					}
				}
			});
			
			message.channel.stopTyping(true);
			
		//only admins can give/remove stuff	
		}else if (message.content.substring(0, 1) === "!" && (message.author.id === userSushi || message.author.id === owner || message.author.id === userYang)){
			
			let values = message.content.split(" ");
			
			//grant user of choice a trophy
			if (message.content.toLowerCase().substring(0, 11) === "!givetrophy"){
						
				console.log(values);
				
				let trophy = "";
				for (let a = 0; a < values.length-2; a++){
					trophy += values[a+2];
				}
				//check if trophy is valid, otherwise just restart
				if (botConstants.trophyList.indexOf(trophy.toLowerCase()) > -1){
					console.log("valid trophy");
					let params = {
						TableName: "discordBot",
						Key:{
							"userID": values[1]
						}
					};

					//look up a user's trophy list. if the user never talked before, create new entry
					docClient.get(params, function(err, dataTrophy) {
						if (err) {
							console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
							message.reply("Error :/ Please contact Zeb about this");
						} else {
							
							console.log(dataTrophy.Item);
							
							
							if (dataTrophy.Item == undefined){
										
								message.reply(" The ID you included either isn't valid, or the person has never talked in all chat before (he/she needs to type something in chat-topia to have a profile created).");
								
							}else{
								
								//capitalize and space the trophy name
								let trophyPrint = "";
								for (let a = 0; a < values.length-2; a++){
									
									let temp = values[a+2].toLowerCase();
									temp = temp.charAt(0).toUpperCase() + temp.slice(1);
									
									trophyPrint += temp;
									if (a != values.length-3){
										trophyPrint += " ";
									}
								}
							
								
								let userTrophies = dataTrophy.Item.trophies;
								console.log(userTrophies);
								//check whether or not the user already has the trophy
								if (userTrophies.indexOf(trophy.toLowerCase()) > -1){
									
									message.reply("This user already has the " + trophyPrint + " trophy.");
									
								}else{
									
									
									userTrophies.push(trophy.toLowerCase());
									let updatedUser = {
										TableName:"discordBot",
										Key:{
											"userID": values[1]
										},
										UpdateExpression: "set lvl = :l, exp = :e, trophies = :t",
										ExpressionAttributeValues:{
											":l":dataTrophy.Item.lvl,
											":e":dataTrophy.Item.exp,
											":t":userTrophies
										},
										ReturnValues:"UPDATED_NEW"
									};
									
									
									docClient.update(updatedUser, function(err, data) {
										if (err) {
											console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
											message.reply("Error :/ Please contact Zeb about this");
										} else {
											
											
											console.log("Successfully updated (trophy granted)", JSON.stringify(data, null, 2));
											
											message.reply("Trophy successfully granted! :smiley:");
											console.log(client.users.get(values[1]));
											console.log(data);
											
											
											
											
											//broadcast the good news
											message.reply("Congratulations! " + client.users.get(values[1]).username + " just earned the " + trophyPrint + " trophy!");
											
											client.channels.get(newsAndEvents).sendMessage("Congratulations! " + client.users.get(values[1]) + " just earned the " + trophyPrint + " trophy!");
										}
									});
										
								}
										
									
							}
						}
					});
				
			
				}else{
					message.reply("No such trophy exists. Did you make a typo?");
				}
				
				
			//remove a user's trophy	
			}else if(message.content.toLowerCase().substring(0, 13) === '!removetrophy'){
				let values = message.content.split(" ");
				console.log(values);
				
				let trophy = "";
				for (let a = 0; a < values.length-2; a++){
					trophy += values[a+2];
				}
				
				//check if trophy is valid, otherwise just restart
				if (botConstants.trophyList.indexOf(trophy.toLowerCase()) > -1){
				
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
							console.log("450");
							console.log(data);
							
							if (data.Item == undefined){
										
								message.reply(" The ID you included either isn't valid, or the person has never talked in all chat before (he/she needs to type something in chat-topia to have a profile created.");
								
							}else{
								
								let userTrophies = data.Item.trophies;
								console.log(userTrophies);
								
								let index = userTrophies.indexOf(trophy.toLowerCase());
								
								//capitalize and space the trophy name
								let trophyPrint = "";
								for (let a = 0; a < values.length-2; a++){
									
									let temp = values[a+2].toLowerCase();
									temp = temp.charAt(0).toUpperCase() + temp.slice(1);
									
									trophyPrint += temp;
									if (a != values.length-3){
										trophyPrint += " ";
									}
								}
							
								//check whether or not the user already has the trophy
								if (index > -1){
									
									console.log(userTrophies.splice(index, 1));
									console.log("index: " + index);
									console.log("after splice : " + userTrophies);
									let updatedUser = {
											TableName:"discordBot",
											Key:{
												"userID": values[1]
											},
											UpdateExpression: "set lvl = :l, exp = :e, trophies = :t",
											ExpressionAttributeValues:{
												":l":data.Item.lvl,
												":e":data.Item.exp,
												":t":userTrophies
											},
											ReturnValues:"UPDATED_NEW"
										};
										console.log(updatedUser + " line 496");
										
										docClient.update(updatedUser, function(err, data) {
											if (err) {
												console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
												message.reply("Error :/ Please contact Zeb about this");
											} else {
												
												console.log(data);
												console.log("Successfully updated (trophy removed)", JSON.stringify(data, null, 2));
												message.channel.send("The " + trophyPrint + " trophy has been successfully removed.");
												
											}
										});
									
								}else{
														
									message.reply("This user does not have the " + trophyPrint + " trophy.");
									
									
										
								}
									
									
							}
						}
						console.log("523");
						console.log(data);
						
					});
				}
				
			}else if (message.content.toLowerCase().substring(0, 10) === "!givecoins" && values.length === 3){
						
				console.log(values);
			
				let params = {
					TableName: "discordBot",
					Key:{
						"userID": values[1]
					}
				};

				docClient.get(params, function(err, data) {
					if (err) {
						console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
						message.reply("Error :/ Please contact Zeb about this");
					} else {
						
						console.log(data.Item);
						
						if (data.Item == undefined){
									
							message.reply(" The ID you included either isn't valid, or the person has never talked in all chat before (he/she needs to type something in chat-topia to have a profile created).");
							
						}else{
							
							let coinValue = parseInt(values[2]);
							
							if (isNaN(coinValue)){
								message.reply(" Invalid coin value.");
								
							}else{
							
								let userCoins = 0;
								
								if (data.Item.coins == undefined){
									userCoins = coinValue;
								}else{
									userCoins = data.Item.coins + coinValue;
								}
							
									let updatedUser = {
										TableName:"discordBot",
										Key:{
											"userID": values[1]
										},
										UpdateExpression: "set coins = :c",
										ExpressionAttributeValues:{
											":c":userCoins
										},
										ReturnValues:"UPDATED_NEW"
									};
									
									
									docClient.update(updatedUser, function(err, data) {
										if (err) {
											console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
										//	message.reply("Error :/ Please contact Zeb about this");
										} else {
											
											
											console.log("Successfully updated", JSON.stringify(data, null, 2));
											message.reply("Coins successfully granted! :smiley:");
											console.log(client.users.get(values[1]));
											console.log(data);
										}
									});
									
							}
							
									
								
						}
					}
				});
				
			}else if(message.content.toLowerCase().substring(0, 12) === "!removecoins" && values.length === 3){
						
				console.log(values);
			
				let params = {
					TableName: "discordBot",
					Key:{
						"userID": values[1]
					}
				};

				docClient.get(params, function(err, data) {
					if (err) {
						console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
						message.reply("Error :/ Please contact Zeb about this");
					} else {
						
						console.log(data.Item);
						
						if (data.Item == undefined){
									
							message.reply(" The ID you included either isn't valid, or the person has never talked in all chat before (he/she needs to type something in chat-topia to have a profile created).");
							
						}else{
							
							let coinValue = parseInt(values[2]);
							
							if (isNaN(coinValue)){
								message.reply(" Invalid coin value.");
								
							}else{
								
								let userCoins = data.Item.coins;
								
								if (coinValue >= userCoins){
									userCoins = 0;
								}else{
									userCoins -= coinValue;
								}
								
						
								let updatedUser = {
									TableName:"discordBot",
									Key:{
										"userID": values[1]
									},
									UpdateExpression: "set coins = :c",
									ExpressionAttributeValues:{
										":c":userCoins
									},
									ReturnValues:"UPDATED_NEW"
								};
								
								
								docClient.update(updatedUser, function(err, data) {
									if (err) {
										console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
										message.reply("Error :/ Please contact Zeb about this");
									} else {
										
										
										console.log("Successfully updated", JSON.stringify(data, null, 2));
										message.reply("Coins successfully subtracted!");
										console.log(client.users.get(values[1]));
										console.log(data);
									}
								});
									
							}
							
									
								
						}
					}
				});
			}
				
		}else	
		//if the message isn't a pm and is in the correct channel, give them exp
		if (message.channel.type === "dm") {
			if (message.content.toLowerCase() === "searching by id"){
				message.reply("Hey " + `${message.author.username}` + ", to find someone's ID, follow these three easy steps:\n\n\t1. Press settings (bottom left) and go to appearance.\n\t2. Check the \"Developer Mode\" option.\n\t3. In Greed Utopia, right click a user's username and select \"Copy ID\" (it's the last option).");
				
			}else{
				message.reply("Yo " + `${message.author.username}` + " I ain't here for your personal service. The only function that will work here is \"searching by id\" (no quotes and not case sensitive) :^)");
			}
			
			//message.reply("(Private) " + `${message.author.username}: ` + " Yo fam I ain't here for your personal service. My functions will only work in the main chat :^)");
			
		} else if (message.channel.id.localeCompare(channel) === 0 || message.channel.id.localeCompare(test) === 0 || message.channel.id.localeCompare(gameChannel) === 0){
		//}else if (message.content === 'ultra secret command'){	
				
				console.log(message.author.id + " author id");
				
				let params = {
					TableName: "discordBot",
					Key:{
						"userID": message.author.id
					}
				}
			//	console.log("before docClient");
				
				var exp = 0;
				docClient.get(params, function(err, dataEXP){
					if (err){
						console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
						message.reply("Error :/ Please contact Zeb about this");
						
					}else{
						
						//if this is the user's first time talking, create new entry
						if (dataEXP.Item == undefined){
							
							let newID = {
								TableName:"discordBot",
								Item:{
									"userID": message.author.id,
									"lvl": 0,
									"exp": 0,
									"trophies": [],
									"coins": 0
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
							
							let curUser = dataEXP.Item;
							
							console.log(curUser);
							
							let exp = message.content.length + curUser.exp;
							let lvl = curUser.lvl;
							let userTrophies = curUser.trophies;
							console.log("TROPHIES HEREEEEEEEEEEE");
							console.log(curUser.trophies);
							let temp = 0;
							while (exp >= levelUpReq[lvl]){
								temp = 1;
								message.channel.startTyping();
								console.log("Level up!");
								lvl++;
								
								let random = Math.floor(Math.random()*10);
								
								
								if (message.author.id.localeCompare(owner) === 0){
									message.channel.sendMessage("Congratulations master " + message.author.username + ", you just leveled up! (to level " + lvl + ")!");
									
								}else if (message.author.id.localeCompare(userSushi) === 0){
									message.channel.sendMessage("The King of Sushi, KNOCKOUTSUSHI, has just gained yet ANOTHER level :muscle::muscle::muscle:(level " + lvl + ").");
									
								}else if (message.author.id.localeCompare(userYang) === 0){
									message.channel.sendMessage("Grand Master Yang Lee chops through another level! :ghost: (level " + lvl + ").");
								
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
									
									
								}else if (lvl == 50){
									userTrophies.push("bronze");
									message.channel.sendMessage(message.author.username + " also earned a bronze trophy! Congratulations!");
									
								}
				
								
								message.channel.stopTyping(true);
							}
								
							
							
							let updatedUserExp = {
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
							
							
							docClient.update(updatedUserExp, function(err, data) {
								if (err) {
									console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
								} else {
									console.log("Successfully updated (exp given)", JSON.stringify(data, null, 2));
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
