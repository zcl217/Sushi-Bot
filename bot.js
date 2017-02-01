var Discordie = require('discordie');


const Events = Discordie.Events;
const client = new Discordie();

client.connect({
	token: 'Mjc2MjA3MTQzOTYxNzU1NjQ4.C3L3uA.Di2UZA-Y5MeX3AaGG89cDLBKT9c'
	
});

client.Dispatcher.on(Events.GATEWAY_READY, e =>{
	console.log('Connected as: ' + client.User.username);
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e =>{
	if (e.message.content == 'PING'){
		e.message.channel.sendMessage('PONG');
	}
});


// Mjc2MjA3MTQzOTYxNzU1NjQ4.C3L3uA.Di2UZA-Y5MeX3AaGG89cDLBKT9c




