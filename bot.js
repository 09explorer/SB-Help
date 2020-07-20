//Packages
const Discord = require('discord.js');

//Client  
const client = new Discord.Client();

//Settings
const settings = require('./config.json')

//Events
client.on('ready', () =>{
    client.user.setActivity( 'use ;ticket for help!', {type: 'PLAYING'}).catch(console.error); 
    console.log(`Startup Complete!, Loaded Version ${settings.version}`)
})
client.on('message', async message => {
    var command = message.content.toLowerCase().slice(settings.prefix.length).split(' ')[0];
    //Command Arguments
    var args = message.content.split(' ').slice(1);
    //No prefix return
    if (!message.content.startsWith(settings.prefix) || message.author.bot) return;

    //Commmands
    
    if (command === 'ticket') {
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;
        let member = message.member
        var num = Math.floor(Math.random() * 9999)
        var alertchnl = message.guild.channels.cache.find(channel => channel.name === 'alerts')
        var authoruser = message.author.username
        let ticketrole = await message.guild.roles.create( {
            data: {
                name: `ticket-${num}`
            }
        })
        let channel = await message.guild.channels.create(`ticket-${num}`, {
            type: 'text',
            parent: '704457429970321519',
            permissionOverwrites: [
                {
                    type: 'role',
                    id: `${ticketrole.id}`,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'], 
                },
                {
                    type: 'role',
                    id: message.guild.id,
                    deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                },
                {
                    type: 'role',
                    id: '560957120116293642',
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                },
                {
                    type: 'role',
                    id: '636960920634916881',
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                },
            ]
        })
        member.roles.add(ticketrole)
        message.channel.send(`**Ticket filed for ${member}!**`)
        const HelpEmbed = new Discord.MessageEmbed()
            .setTitle('New Ticket Filed!')
            .setColor('#2e8500')
            .setDescription(`User **${member}** has requested help! A member of staff will be with you shortly. Please describe your issue while you wait.`)
            .setFooter(`Ticket ID: ${num}`)
        channel.send(HelpEmbed)
        message.delete();
        const AlertEmbed = new Discord.MessageEmbed()
            .setTitle('Ticket Alert!')
            .setColor('#2e8500')
            .addFields(
                { name: 'User Filing', value: `${member}`, inline: true},
                { name: 'Action', value: 'Create ticket', inline: true},
                { name: 'ID', value: `${num}`, inline: true},
                { name: 'Time', value: `${dateTime}`, inline: true},
            )
            .setFooter(`${authoruser}`)
        alertchnl.send(AlertEmbed)
        console.log('New Ticket Created!')
    }
    if(command === 'close') {
        if(!message.member.hasPermission("MANAGE_CHANNELS"))
    return message.channel.send("**Hey! You don't have the required permission to do that!**");
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;
        var alertchnl = message.guild.channels.cache.find(channel => channel.name === 'alerts')
        var id = args[0]
        message.guild.channels.cache.find(channel => channel.name === `ticket-${id}`).delete()
        let { cache } = message.guild.roles;
        let role = cache.find(role => role.name  === `ticket-${id}`)
        role.delete()
        var mod = message.member
        const closeEmbed = new Discord.MessageEmbed()
            .setTitle('Ticket Alert!')
            .setColor('#fc1303')
            .addFields(
                { name: 'User', value: `${mod}`, inline:  true},
                { name: 'Action', value: 'Close ticket', inline: true},
                { name: 'Ticket ID', value: `${id}`, inline: true},
                { name: 'Time', value: `${dateTime}`, inline : true},
            )
        alertchnl.send(closeEmbed)
        console.log('Ticket Closed!')
    }
    if(command === 'suggest') {
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;
        var chnl = message.guild.channels.cache.find(channel => channel.name === 'suggestions')
        const id = Math.floor(Math.random() * 999) + 1;
        var data = args.join(' ')
        var author = message.author.username
        const suggestion = new Discord.MessageEmbed()
            .setColor('#65c4ff')
            .setTitle('New Suggestion!')
            .addFields(
                {name: 'User Sending', value: `${author}`},
                {name: 'Suggestion', value: `${data}`},
                {name: 'Date', value: `${dateTime}`}
            )
            .setDescription(`**${author} requested the following suggestion to be implimented. Please take the following into consideration! Vote with either :white_check_mark: or :x: and the staff will take the vote into account!**`)
        chnl.send(suggestion).then((sentMessage) => { sentMessage.react('✅'), sentMessage.react('❌')})

        message.delete();
    }
    if(command === 'help') {
        const help = new Discord.MessageEmbed()
            .setTitle('Help Message')
            .setColor('#65c4ff')
            .addFields(
                {name: 'Ticket Commands', value: '`ticket`, `close`'},
                {name: 'Other Commands', value: '`suggest`, `poll`'},
                {name: 'Version', value: `${settings.version}`},
                {name: 'Info', value: '**If there are any issues please DM C-46#5475 and he will do his best to resolve them in a timely manner.**'}
            )
        message.channel.send(help)
    }
    if(command === 'veto') {
        var idarg = args[0]
        
    }
    if (command === 'ping') {
        message.channel.send('Pong!')
    }
});
client.login(settings.token)