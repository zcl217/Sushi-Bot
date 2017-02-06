/*
	Simple discord level up by Zeb.
	Using discord.js api to work with the discord chat,
	and amazon web services to connect with a noSQL database.
*/
const fs = require('fs');
const AWS = require("aws-sdk");
const Discord = require("discord.js");
const client = new Discord.Client();

AWS.config.update({
  region: "us-west-2",
  endpoint: "https://dynamodb.us-west-2.amazonaws.com"
});

const docClient = new AWS.DynamoDB.DocumentClient()

const face = [":muscle: :alien:", ":hear_no_evil:", ":grinning:", ":smiley:", ":hugging:"]

var levelUpReq = [];

fs.readFile('./json/data.json', {encoding:'utf8'}, function(err, data) {
	if (err){
		console.log(err);
	}else{
		
		let obj = JSON.parse(data);
		for (let a = 0; a < 10; a++){
			levelUpReq[a] = obj[a];
		}
		console.log(levelUpReq);
		client.login(obj.token);
		
		
	}
}); 


client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`);
  
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
	
  }
});

//char limit is 2k
//set lvl 1 to like 100, level 2 to 2300 total or something

//so all we have to do is += the length to the user's schema in the database
//user id is a string not int

client.on('message', function(message) {
	//console.log(message.channel);
	console.log(levelUpReq);
	//bind it to certain channels?
	
	console.log(message.author);
	if (message.author.id.localeCompare("276207143961755648") !== 0){
        if (message.channel.type === "dm") {
                console.log("(Private) " + `${message.author.username}: ${message.content}`);
        } else {
			//if not a PM, then add it towards the user's word count.
			
			let params = {
				TableName: "discordBot",
				Key:{
					"userID": message.author.id
				}
			}
			console.log("before docClient");
			
			var exp = 0;
			docClient.get(params, function(err, data){
				if (err){
					//does this mean it doesn't exist?
					console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
					
				}else{
					//we got it
					console.log("found");
					
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
						
						
					}else{
						
						let curUser = data.Item;
					//	exp = data.exp;
						let exp = message.content.length + curUser.exp;
						let lvl = curUser.lvl;
						console.log(exp + " " + lvl + " " + levelUpReq[lvl]);
						if (exp >= levelUpReq[lvl]){
							console.log("Level up!");
							lvl++;
							
							let random = Math.floor(1+Math.random()*5);
							
							message.channel.sendMessage(message.author.username + " just leveled up to level " + lvl + "! " + face[random]);
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
					
						//update entry here
						
					}
					console.log(data);
					//extract the # in database, add new #, put it back in
				}
			});
			
		
			
			/*
			docClient.query(params, function(err, data){
				if (err){
					console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
				}else{
					console.log("Successful query");
					
				}
				
			});
			*/
			
			//console.log("userid: " + id);
		
			//if id is not already in table, create new id
			
			
			
              //  console.log(`(${message.server.name} / ${message.channel.name}) ${message.author.name}: ${message.content}`);
			  /*
			  console.log(`(${message.channel.name}) ${message.author.username}: ${message.content}`);
			  console.log(typeof(message.content));
			  console.log(message.content.length);
			  */
        }
		
		//delete the else below >>>>
	}else{
		console.log("it was the bot that posted");
	}
});

/*
client.on('message', function(message) {
	console.log(client);
        client.sendMessage(message, "Hello!");
});*/


//to type normally in a channel:
// msg.channel.sendMessage('pong');
