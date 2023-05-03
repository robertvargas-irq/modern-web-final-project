
import { ComponentType,EmbedBuilder,ButtonBuilder,ButtonStyle,ActionRowBuilder, Message, ComponentBuilder} from "discord.js";

const __interactive: InteractionHandlerPayloads.GuildChatInputCommand = {
    name: "interactive",
    description: "An interactive menu to start!",
    async execute(interaction) {


        const button = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('button')
                .setLabel('Drug?')
                .setStyle(ButtonStyle.Primary),
                
            );
        
        const embed2 = new EmbedBuilder()
            .setTitle('Page 2 of BlackJack bot')
            .setDescription('Testing page 2')
            .setColor(0x32CD32)
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setImage("https://media.discordapp.net/attachments/1090471775768428627/1099094479903928330/bpt24i98nsp41.jpg?width=554&height=543")
            .setTimestamp();

        const embed = new EmbedBuilder()
            .setTitle("Welcome to BlackJack bot")
            .setDescription("This is our bot for you to play BlackJack!")
            .setColor(0x32CD32)
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setImage("https://media.discordapp.net/attachments/1090471775768428627/1099094479903928330/bpt24i98nsp41.jpg?width=554&height=543")
            .setTimestamp()
            .addFields([
                {
                    name: 'First Field Test',
                    value: 'Field field value',
                    inline: true
                },
                {
                    name: 'Second Field Test',
                    value: 'Second field value',
                    inline: true
                }
            ]);
            
        const message = await interaction.reply({
            embeds: [embed],
            components: [button],
            fetchReply:true,
        });

        

        const collector = message.createMessageComponentCollector({
            filter: (i)=> i.user.id === message.author.id,
            componentType: ComponentType.Button,
            time: 1000 * 10
        });

        collector.on('collect',(i) =>{
            console.log("Here!")
            
            i.update({embeds: [embed2], components:[]});
        });

        collector.on('end', collected=>{
            console.log(`Collected ${collected.size} interactions`)
        });
    },
};

export default __interactive;
