const { Client, Intents, MessageEmbed } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const config = require("./config.json");
const prefix = "!";

client.on("messageCreate", function(message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    if (command === "team") {
        if (1 >= args[0]) {
            message.reply("You need to specify a number of team superior !");
            return;
        }

        let numberTeam = args[0];
        // Current channel
        //console.log(message.member.voice.channel.id)

        // take all user connected in same channel
        let teams = [];
        let playerNumber = message.member.voice.channel.members.size

        if (numberTeam > playerNumber) {
            message.reply("You need more player to create a team !");
             return;
        }

        message.member.voice.channel.members.each(member=>{
            teams.push(member.user.toString());
        })

        // shuffle teams
        shuffleArray(teams);

        // make random teams with random player from teams
        let teamsRandom = [];
        for (let i = 0; i < numberTeam; i++) {
            let team = [];
            for (let j = 0; j < playerNumber/numberTeam; j++) {
                team.push(teams.pop());
            }
            teamsRandom.push(team);
        }

        // format message fields
        let teamFields = teamsRandom.map(team =>{
            return { name : "Team " + (teamsRandom.indexOf(team) + 1), value : team.join("\n"), inline: true };
        })

        // create embed
        let embed = new MessageEmbed()
        .setColor('#fb9201')
        .setTitle('Team Generator')
        .setDescription('For ' + args[0] + ' teams')
        .addFields(teamFields)
        .setTimestamp()

        message.reply({ embeds: [embed]})
    }
});

function shuffleArray(inputArray){
    inputArray.sort(()=> Math.random() - 0.5);
}

client.login(config.BOT_TOKEN);
