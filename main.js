//beginning of js code
const discord = require("discord.js");
const config = require("./config.json");

const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbClient = new MongoClient(url);

const dbName = 'jsdb';


const client = new discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});
const prefix = "/"
console.log("running code")
ownerid = config.ownerid
console.log("code ownerid : " + ownerid)

let embedVar = new discord.MessageEmbed()

function emb(t,desc="", col = 0x3AABC2) 
{
        embedVar.setTitle(t);
        embedVar.setColor(col);
        embedVar.setDescription(desc);

        return embedVar;
}


	// .setColor('#0099ff')
	// .setTitle('Some title')
	// .setURL('https://discord.js.org/')
	// .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
	// .setDescription('Some description here')
	// .setThumbnail('https://i.imgur.com/wSTFkRM.png')
	// .addFields(
	// 	{ name: 'Regular field title', value: 'Some value here' },
	// 	{ name: '\u200B', value: '\u200B' },
	// 	{ name: 'Inline field title', value: 'Some value here', inline: true },
	// 	{ name: 'Inline field title', value: 'Some value here', inline: true },
	// )
	// .addField('Inline field title', 'Some value here', true)
	// .setImage('https://i.imgur.com/wSTFkRM.png')
	// .setTimestamp()
	// .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

async function dbmain() 
{
  await dbClient.connect();
  console.log('Connected successfully to server');
  const db = dbClient.db(dbName);
  collection = db.collection('documents');

  // the following code examples can be pasted here...

  return 'done.';

}

client.on('ready', () => {
  // client.setStatus('available')
  client.user.setActivity(`/help`, {type: 'LISTENING'});
  dbmain();

});

// client.on("messageCreate", function(message) 
// {
//     if (message.author.bot) return;
//     con = message.content;
//     channel= message.channel;
//     con = con.split(" ")

//     if (con[0].toUpperCase() == prefix.toUpperCase()) 
//     {
//       con = con[1]
//       if (con == "quit")
//       {
//         if (message.author.id = ownerid) 
//         {
//         channel.send("``` shutting down ```")
//         setTimeout(() => { process.exit(); }, 2000);
//         }
//         else
//         {
//           message.reply("Nice try...")
//         }
//       }
//       else if (con == "ping") 
//         message.channel.send("pong!")
//         // client.emit('interactionCreate', message);
//       else if (con == "help") {
//         let e = emb("**For more info:** ` "+prefix+" help [command] `", "**Add ` "+prefix+" ` before any command**");
//         e.set_author("Commands", url="", icon_url="https://image.freepik.com/free-vector/blue-pencil-with-pixel-art-style_475147-504.jpg")
        
//         channel.send({ embeds: [e] })

//       }


//     }
// }
// );

client.on('interactionCreate', async interaction => {
	
  if (!interaction.isCommand()) return;
  // console.log(interaction.toString())
  // console.log(interaction)
  const channel=interaction.channel;
  let filteredDocs = {};
  if ((interaction.commandName != 'start') && (interaction.commandName != 'help') && (interaction.member.id != ownerid))
  {
    // try {
      console.log("trigger user check in db");
      filteredDocs = await collection.find({ 'userid': interaction.member.id }).toArray();
      if (!filteredDocs['gameid']){
        console.log("User not in db. Response sent.")
        interaction.reply("You are a new face! Check out `"+prefix+" help` or `"+prefix+" start` <@" + interaction.member.id + ">");
        return;
      }
      else {
        console.log("Existing user");
      }
    // }
    // catch{
        //  await interaction.reply("You are a new face! Check out `"+prefix+" help` or `"+prefix+" start`")
    //   return;
    // }
  }

	if (interaction.commandName === 'ping') {
		await interaction.reply({ content: 'Pong!', ephemeral: 0 });
	}
  else if (interaction.commandName === 'quit')
  {
       if (interaction.member.id === ownerid) 
          {
            // channel.send(interaction.member.id);
            // channel.send(ownerid);
            interaction.reply("``` shutting down ```");
            dbClient.close();
            setTimeout(() => { process.exit(); }, 2000);
          }
       else
          { 
            // channel.send(interaction.member.id);
            // channel.send(ownerid);
            console.log ("Mismatch ids for staff only cmd : " + interaction.member.id + " vs " + ownerid)
            interaction.reply("Nice try...");
          }
  }
  else if(interaction.commandName === 'help')
  {
    let e=emb("**For more info:** ` "+prefix+" help [command] `", "**Add ` "+prefix+" ` before any command**");
    // e.setAuthor("Commands","https://image.freepik.com/free-vector/blue-pencil-with-pixel-art-style_475147-504.jpg", "");
    //await interaction.channel.send({ embeds: [embedVar] });
    // console.log("\nEmbed !!!!!: \n"+e+"\n");
    e.setAuthor(
      {
        name: 'Commands',
        url: '',
        iconURL: 'https://i.imgur.com/D6u3P8Z.jpg'
    }
    )
    function em(a, b, c="")
    {
    let st = "";
    console.log(b);
    for (const s in b)
    {
      st += "`" + b[s] +"`, ";
    }
 
    st = st.slice(0, -2);
    e.addField("\u200B"+"\n" + "\u200B" + a,st + c, false)
    }
    

    em(":bookmark: Profile commands :bookmark:", ["start", "profile", "attributes", "boosts", "events", "likes", "inventory", "cooldowns"])
    em(":beginner: Menu commands :beginner:", ["bank", "shop", "jobs", "education", "health", "apartments", "relationship"])
    em(":gift: Rewards commands :gift:", ["daily", "weekly", "votetrend", "checkin", "redeem", "quiz"])
    em(":currency_exchange: Interaction commands :currency_exchange:", ["mail", "give", "phone"])
    em(":diamonds: Misc commands :diamonds:", ["action", "gameplayinfo", "rules", "noticeboard", "invite","sos"])

    await interaction.reply({ embeds: [e] })
  }
  else if(interaction.commandName === 'start')
  {
    if (!filteredDocs['gameid']) 
    {
    let msg = await interaction.reply({content: ">>> [ boots up ]\n\nYou want to play Disco-Life! \nCheck out gameplayinfo,\nMake sure you have read and\naccepted the rules .\nThen react with :thumbsup: !\n\n`"+prefix.toLowerCase()+" gameplayinfo`, `"+prefix.toLowerCase()+" rules`", fetchReply:true})
    await msg.react('👍')
    }
    else {
      if(filteredDocs['status']  != 'customize')
        interaction.reply("You already have an account.");
      else
      {
        //customize profile , resume.
      }
    }
}
});


client.login(config.BOT_TOKEN);
