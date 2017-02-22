//list of constants used in bot messages
const Discord = require("discord.js");
const client = new Discord.Client();

const face = [":muscle: :alien:", ":hear_no_evil:", ":grinning:", ":smiley:", ":hugging:", ":scream_cat:", ":heart_eyes_cat:", ":up:", ":cool:", ":lifter:"];

const sushi = [
	"Here is a delicious California Sushi roll at your service!",
	":sushi::sushi::sushi:",
	"I got you the flaming hot spicy Volcano Sushi Roll be careful it packs a bunch!",
	"Dynamite Sushi Roll on the dial! It has an explosion of flavors!",
	"Dragon Sushi Roll will def exceed your expectations, try it now!",
	"Looking for a crunch?! Well here's a Sushi Crunchy Roll!",
	"You want a party in your mouth!? Rainbow Sushi Roll will blast you with flavor!",
	"Oh noo! Bad luck for you! >:D You will now eat a POISON SUSHI Roll! MWAHahaha.... I'm just kidding c:"
];

const funFacts = [
	"Did you know that in Korea, live Octopus is considered a delicious treat! They believe eating live Octopus, is a sheer way to build strength and stamina.",
	"The most dangerous sushi, is the pufferfish sushi. Sushi Chef requires a license to even prepare or make them.",
	"In order for Octopus to have a nice texture and a higher refined taste, Chefs would massage the Octopus for about 20 mins before preparing them."

];

const trophyList = [
	"bronze",
	"silver",
	"gold",
	"master",
	"shiftknight",
	"shiftbaron",
	"shiftprince",
	"shiftking",
	"duelerscrest",
	"flashyassault",
	"heatedup",
	"motionbeatdown",
	"animationflames",
	"brushutopia",
	"duoace",
	"handtriumph",
	"warmintroduction",
	"helpinghand",
	"overwhelmingdedication",
	"hourglassutopia",
	"filmdasher",
	"luxuryinvasion",
	"thelottery",
	"thefootdown",
	"legendscraft",
	"inkmaster",
	"ht",
	"brush",
	"od"
	
];

const commands = "You requested the commands? Here is a list of all the functions / commands you can do (none of them are case sensitive).\n\n" +
			
			" 1) **!Sushi please** : Gives you a random sushi\n\n"+
			" 2) **!What is Hangout Utopia?** : Gives you information about the server\n\n" +
			" 3) **!fun fact** : Gives you a random fact\n\n" + 
			" 4) **!level** : Displays your current level (exp gained through typing in chat-topia)\n\n" +
			" 5) **!commands** :^)\n\n" +
			" 6) **!trophies** : Displays all the trophies you currently possess\n\n" +
			" 7) **!trophiesOther** : Displays all the trophies another user possesses.\n\n\t>HOW TO USE<\nThe format is: ```diff\n!trophiesOther <username>```\n For example: !trophiesOther MangoLover\nPlease keep in mind that the username is case sensitive.\nIf, for some reason, the target's username contains characters you are unable to type, you can also use their ID. To learn how to search by ID, type \"searching by id\" (no quotes) in this chat (this private chat).\nAlso, please keep in mind that a user's username could be different from the one the nickname they have in the Hangout Utopia discord chat (in this case, you can either ask for their username, or search by ID).\n\n";
			//" 8) **!coins** : Displays the current amount of coins you possess.\n\n";

/* const shortcuts = "List of short names for the trophies:\n"+
" Dot master = dot\n Overwhelming Dedication = od\n Hand Triumph = ht\n Brush Utopia = brush\n Division Conqueror = dc\n Flashy Assault = fa\n Warm Introduction = wi\n Dueler's Crest = crest\n";
			*/
const trophies = "You desire to see the list of wonderful trophies in store? Seek no further:\n\n" +
			
			" 1) " + client.emojis.find('name', 'bronze') + " The bronze trophy is granted upon reaching level 10.\n\n" +
			" 2) " + client.emojis.find('name', 'silver') + " The silver trophy is  granted upon reaching level 20.\n\n" +
			" 3) " + client.emojis.find('name', 'gold') + " The gold trophy is granted upon reaching level 30.\n\n" + 
			// waiting for the 4th trophy
			" 4) " + "" + "The ? trophy is granted upon reaching level 40.\n\n" +
			" 5) " + client.emojis.find('name', 'master') + " The master trophy is granted upon reaching level 50.\n\n" +
			" 6) " + client.emojis.find('name', 'od') + " Overwhelming Dedication - Only those whose contributed to the community with flying colors, will be able to receive this trophy. Taking part in the community activities and events boost up your goal a lot. Taking part in voice calls and community discussions is an excellent way achieve Overwhelming Dedication.\n\n" +
			" 7) " + client.emojis.find('name', 'ht') + " Hand Triumph - This is earned by creating your own unique art style that is perfectly refined and interesting. Only those who are skilled in multiple fields can obtain this trophy. This is analyzed from shading through anatomy and more.\n\n" +
			" 8) " + client.emojis.find('name', 'brush') + " Brush Utopia - This trophy is individually selected by KnockoutSushi for creating an amazing digital painting that meets his 10/10 standards.\n\n" +
			" 9) " + client.emojis.find('name', 'dc') + ` Division Conqueror - For those who have contributed to a division within ${client.channels.get(267682600192180224)} and stays consistent with the designated task for that particular role.\n\n` +
			" 10) " + client.emojis.find('name', 'fa') + " Flashy Assault - Those who participated and won in a Fighting Game Tournament will earn this Trophy!\n\n" +
			" 11) " + client.emojis.find('name', 'wi') + " Warm Introduction - This achievement is gained from always staying on top of welcoming members to make them feel more comfortable and apart of Hangout Utopia.\n\n" +
			" 12) " + client.emojis.find('name', 'crest') + " Dueler's Crest - This achievement is given to the dedicated pro gamers of Hangout Utopia whose won 3 or more Game Tournaments hosted by our community.\n\n";
			
module.exports = {
	commands: commands,
    trophies: trophies,
	face: face,
	sushi: sushi,
	funFacts: funFacts,
	trophyList: trophyList,
	
    // ...
}