var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var ms = require('./minestat');
//Minecraft utilities
var request = require('request');
var mcIP = '185.25.206.71'; // Your MC server IP
var mcPort = 25566; // Your MC server port
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});

logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('guildMemberAdd',member => {

  console.log("E' entrato l'utente " + member.nickname + " , ID: " + member.id);

  bot.addToRole({
    serverID: "518884342051897346",
    userID: member.id,
    roleID: "518902446588952596"
  });

  bot.sendMessage({
    to: member.id,
    message: "Benvenuto nel server Discord di Age of Feuds! Se riscontri problemi, contatta lo staff in privato o nei canli appositi."
  });

});

bot.on('message', function (user, userID, channelID, message, evt) {

        // Our bot needs to know if it will execute a command
        // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);

        //Elimino il comando, qualsiasi esso sia
        bot.deleteMessage({
          channelID: channelID,
          messageID: evt.d.id
        });

        switch(cmd) {
//Comando per links
            case 'links':
                bot.sendMessage({
                    to: channelID,
                    message: " :globe_with_meridians:  __Questa e' la lista di tutti i nostri link!__ :globe_with_meridians:  \n <:minecraft:519173973162983439> **IP:** `mc.ageoffeuds.it` \n <:forum:519173528847646741> **FORUM:** http://www.ageoffeuds-forum.it  \n :moneybag:  **VIP:** http://aof.buycraft.net/ \n <:teamspeak:519173783777705984> **TEAMSPEAK:** `ageoffeuds.voicehosting.it` \n <:telegram:519173825603043338> **TELEGRAM:** https://t.me/ageoffeuds \n <:whatsapp:519172755577503764> **WHATSAPP:** chiedi al nostro staff di essere aggiunto!"
                });
            break;

//Comando per comandi
            case 'comandi':

                bot.sendMessage({
                    to: channelID,
                    message: ':mag_right: Lista dei miei comandi:\n`!links` ottieni tutti i nostri link \n`!stato` recupera lo stato del server\n`!comandi` lista dei comandi (questa)\n`!regole` restituisce il regolamento delle nostre piattaforme\n`!regole_` restituisce il regolamento senza blocco di codice\n`!assistenza` link per assistenza sul forum\n`!segnalazione` link per aprire una segnalazione sul forum'
                });
            break;

//Comando per stato server
            case 'stato':

	status = " ? ";
	ms.init('mc.ageoffeuds.it', 25565, function(result)
	{
  	console.log("Minecraft server status of " + ms.address + " on port " + ms.port + ":");
	status = "Minecraft server status of " + ms.address + " on port " + ms.port + ":"
	if(ms.online)
  	{
    	console.log("Server is online running version " + ms.version + " with " + ms.current_players + " out of " + ms.max_players + " players.");
	status = "**Stato:** `Online` :white_check_mark: \n**Giocatori:** `"+ms.current_players + "/"+ ms.max_players + "` :busts_in_silhouette:";
                bot.sendMessage({
                    to: channelID,
                    message: status
                });
    	console.log("Message of the day: " + ms.motd);
  	}
  	else
  	{
    	console.log("Server is offline!");
	status = "**Stato:** `Offline` :no_entry_sign:";
                bot.sendMessage({
                    to: channelID,
                    message: status
                });
  	}
	});
            break;

            case 'stop':

	console.log('Bot scollegato!');
	bot.disconnect();
            break;

//Comando per regole con blocco
	case 'regole':

	 bot.sendMessage({
	  to: channelID,
	  message: ":scroll: _Il nostro regolamento_ :scroll:\n```**1) LINGUAGGIO** \nE' vietato bestemmiare (da 12h a perma), insultare (da 5h a perma) e utilizzare riferimenti non consoni (da 1h a perma) (sesso, droga, politica, religione)\n\n**2) PROFILO**\nIl nickname deve essere sempre lo stesso che avete in game, in modo tale che lo Staff possa riconoscervi. (da 5m a 24h)\nE' vietato inserirne uno falso o che vi renda irriconoscibili. (da 10m a 48h)\nE' vietato usare una foto profilo che violi una o piu' regole (come riferimenti non consoni) (da 20m a perma)\n\n**3) SPAM - FLOOD**\nE' vietato divulgare, spammare o anche solo citare il nome o l'ip di server Minecraft estranei ad AoF. (da 1h a perma)\n\n**4) DISTURBO**\nE' vietato scrivere troppi messaggi in un ristretto lasso di tempo, con lo scopo di intasare la chat o infastidire (da 10m a perma), cosi' come e' vietato procurare disturbo attraverso Music Bot, urla...ecc. (da 1h a perma)\n\n**5) DIVULGAZIONE**\nE' assolutamente vietato divulgare (da 24h a perma), attraverso qualsiasi mezzo di comunicazio e dati personali di una o piu' persone, senza l'autorizzazione dei diretti interessati.\n\n**6) DENIGRAZIONE**\nE' vietata qualunque forma di denigrazione nei confronti del server, della community o di qualunque piattaforma di AgeOfFeuds. (da 2d a perma)\nPer denigrazione si intende un qualunque riferimento atto a sminuire AgeOfFeuds e affini.\nE' vietato insultare o denigrare lo Staff o le attivita' da esso svolte. (da 24h a perma)\nSono vietati atteggiamenti esibizionisti atti a minare la credibilita' del server o che scoraggino la permanenza di altri giocatori (es. 'Lascio il server, ora chiudete senza di me') (da 1h a 72h)\n\n**7) MULTIACCOUNT**\nE' vietato accedere a qualunque piattaforma tramite un secondo account se si e' stati bannati con un altro profilo._ (perma)\n\n**8) ABUSO DI POTERE**\nViolazione di una o piu' regole del server da parte di un membro dello Staff. (probabile rimozione della targhetta + eventuale ban in base ai casi)```"
	  });
	break;

// Comando per regole senza blocco
	case 'regole_':

	 bot.sendMessage({
	  to: channelID,
	  message: ":scroll: _Il nostro regolamento_ :scroll:\n\n**1) LINGUAGGIO** \nE' vietato bestemmiare (da 12h a perma), insultare (da 5h a perma) e utilizzare riferimenti non consoni (da 1h a perma) (sesso, droga, politica, religione)\n\n**2) PROFILO**\nIl nickname deve essere sempre lo stesso che avete in game, in modo tale che lo Staff possa riconoscervi. (da 5m a 24h)\nE' vietato inserirne uno falso o che vi renda irriconoscibili. (da 10m a 48h)\nE' vietato usare una foto profilo che violi una o piu' regole (come riferimenti non consoni) (da 20m a perma)\n\n**3) SPAM - FLOOD**\nE' vietato divulgare, spammare o anche solo citare il nome o l'ip di server Minecraft estranei ad AoF. (da 1h a perma)\n\n**4) DISTURBO**\nE' vietato scrivere troppi messaggi in un ristretto lasso di tempo, con lo scopo di intasare la chat o infastidire (da 10m a perma), cosi' come e' vietato procurare disturbo attraverso Music Bot, urla...ecc. (da 1h a perma)\n\n**5) DIVULGAZIONE**\nE' assolutamente vietato divulgare (da 24h a perma), attraverso qualsiasi mezzo di comunicazio e dati personali di una o piu' persone, senza l'autorizzazione dei diretti interessati.\n\n**6) DENIGRAZIONE**\nE' vietata qualunque forma di denigrazione nei confronti del server, della community o di qualunque piattaforma di AgeOfFeuds. (da 2d a perma)\nPer denigrazione si intende un qualunque riferimento atto a sminuire AgeOfFeuds e affini.\nE' vietato insultare o denigrare lo Staff o le attivita' da esso svolte. (da 24h a perma)\nSono vietati atteggiamenti esibizionisti atti a minare la credibilita' del server o che scoraggino la permanenza di altri giocatori (es. 'Lascio il server, ora chiudete senza di me') (da 1h a 72h)\n\n**7) MULTIACCOUNT**\nE' vietato accedere a qualunque piattaforma tramite un secondo account se si e' stati bannati con un altro profilo._ (perma)\n\n**8) ABUSO DI POTERE**\nViolazione di una o piu' regole del server da parte di un membro dello Staff. (probabile rimozione della targhetta + eventuale ban in base ai casi)"
	  });
	break;

	case 'assistenza':
	 bot.deleteMessage({
	  channelID: channelID,
	  messageID: evt.d.id
	  });
	 bot.sendMessage({
	  to: channelID,
	  message: ":pencil: **Clicka qui per ottenere assistenza!** :pencil:: http://www.ageoffeuds-forum.it/forums/assistenza.42/"
	  });
	break;

//Comando per segnalazioni in forum
	case 'segnalazione':

	 bot.sendMessage({
	  to: channelID,
	  message: ":no_entry: **Clicka qui per fare una segnalazione!** :no_entry:: http://www.ageoffeuds-forum.it/forums/segnalazioni.39/"
	  });
	break;

  //Comando interno per il messaggio di Accettazione
  case 'accettazione_!':

    bot.sendMessage({
      to: channelID,
      message: "Scrivi `accetto` / `ACCETTO` / `Accetto` per accettare il regolamento e diventare un **Utente** ufficiale. :grinning:"
    })
  break;



         }
     }

     /////////////////
});
