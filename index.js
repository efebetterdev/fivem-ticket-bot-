const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionsBitField } = require("discord.js");
const { createTranscript } = require('discord-html-transcripts');
const { joinVoiceChannel } = require('@discordjs/voice');
require("dotenv").config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildVoiceStates
    ],
    partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember]
});

// Environment Variables
const TOKEN = process.env.TOKEN;
const TICKET_CATEGORY_ID = process.env.TICKET_CATEGORY_ID;
const SUPPORT_ROLE_ID = process.env.SUPPORT_ROLE_ID;
const SUPPORT_CHANNEL_ID = process.env.SUPPORT_CHANNEL_ID;
const STAFF_ROLE_ID = process.env.STAFF_ROLE_ID;
const TICKET_LOG_CHANNEL_ID = process.env.TICKET_LOG_CHANNEL_ID;
const IMAGE_URL = process.env.IMAGE_URL || "https://www.example.com/default-image.png";
const VOICE_CHANNEL_ID = process.env.VOICE_CHANNEL_ID;
const GUILD_ID = process.env.GUILD_ID;
const PD_APPLICATION_CHANNEL_ID = process.env.PD_APPLICATION_CHANNEL_ID;
const PD_REVIEW_ROLE_ID = process.env.PD_REVIEW_ROLE_ID;
const PD_RESULT_CHANNEL_ID = process.env.PD_RESULT_CHANNEL_ID;
const PD_ACCEPTED_ROLE_ID = process.env.PD_ACCEPTED_ROLE_ID;
const PD_REQUIRED_ROLE_ID = process.env.PD_REQUIRED_ROLE_ID;
const MAINTENANCE_CHANNEL_ID = process.env.MAINTENANCE_CHANNEL_ID;

// Emojis
const EMOJIS = {
    ADD_USER: "<:sh12:1348263865065930752>",
    REMOVE_USER: "<:sh18:1348266374723801210>",
    POLICE: "👮",
    CHECK: "✅",
    WARNING: "⚠️",
    CROSS: "❌",
    MAINTENANCE: "🔧"
};

client.once("ready", async () => {
    console.log(`✅ Bot ${client.user.tag} olarak giriş yaptı!`);
    await initializeTicketSystem();
    await initializePDApplicationSystem();
    await connectToVoiceChannel();
});

async function connectToVoiceChannel() {
    if (VOICE_CHANNEL_ID && GUILD_ID) {
        try {
            const guild = client.guilds.cache.get(GUILD_ID);
            if (!guild) throw new Error("Sunucu bulunamadı!");

            const voiceChannel = guild.channels.cache.get(VOICE_CHANNEL_ID);
            if (!voiceChannel) throw new Error("Ses kanalı bulunamadı!");

            joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: guild.id,
                adapterCreator: guild.voiceAdapterCreator,
                selfDeaf: true,
                selfMute: false,
            });

            console.log(`🔊 Ses kanalına bağlanıldı: ${voiceChannel.name}`);
        } catch (error) {
            console.error("Ses kanalına bağlanırken hata:", error);
        }
    }
}

client.on("messageCreate", async (message) => {
    if (message.content === "!pdbasvuru" && !message.author.bot) {
        try {
            const embed = new EmbedBuilder()
                .setTitle("Efebetter.dev - Polis Departmanı Başvuru")
                .setDescription("Aşağıdaki butona tıklayarak Polis Departmanı için başvuru yapabilirsiniz.\n\n**Başvuru Şartları:**\n- 16 yaşından büyük olmalısınız\n- Mikrofonunuz çalışıyor olmalı\n- Rol bilgisine sahip olmalısınız")
                .setColor("#0000FF")
                .setImage(IMAGE_URL)
                .setFooter({
                    text: "Başvurunuz incelendikten sonra size dönüş yapılacaktır.",
                    iconURL: client.user.displayAvatarURL()
                });

            const button = new ButtonBuilder()
                .setCustomId("pd_application")
                .setLabel("Başvuruyu Başlat")
                .setStyle(ButtonStyle.Primary)
                .setEmoji(EMOJIS.POLICE);

            const buttonRow = new ActionRowBuilder().addComponents(button);

            await message.reply({
                embeds: [embed],
                components: [buttonRow]
            });
        } catch (error) {
            console.error("❌ PD başvuru butonu gönderilirken hata:", error);
            await message.reply("Başvuru butonu gönderilirken bir hata oluştu! Lütfen daha sonra tekrar deneyin.");
        }
    }


    if (message.content.toLowerCase() === "!ip" && !message.author.bot) {
        try {
            const embed = new EmbedBuilder()
                .setTitle("Efebetter.dev 💯  #eniyisi Server IP Bilgi:")
                .setDescription("Server IP :\nSİZİN ip ")
                .setColor("#FF0000")
                .setImage("") // İsteğe bağlı olarak bir resim ekleyebilirsiniz
                .setFooter({
                    text: "Efebetter.dev - Resmi Discord",
                    iconURL: client.user.displayAvatarURL()
                });

            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error("❌ IP mesajı gönderilirken hata:", error);
            await message.reply("IP bilgisi gösterilirken bir hata oluştu!");
        }
    }

    if (message.content.toLowerCase() === "!workshop" && !message.author.bot) {
        try {
            const embed = new EmbedBuilder()
                .setTitle("Efebetter.dev - Workshop İçeriği")
                .setDescription("Oyundaki propları ve diğer içerikleri aşağıdaki linkten indirebilirsiniz:\n\n||||")
                .setImage("") // İsteğe bağlı olarak bir resim ekleyebilirsiniz
                .setColor("#00FF00")
                .setFooter({
                    text: "Efebetter.dev - Resmi Discord",
                    iconURL: client.user.displayAvatarURL()
                });

            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error("❌ Workshop mesajı gönderilirken hata:", error);
            await message.reply("Workshop bilgisi gösterilirken bir hata oluştu!");
        }
    }

    
    if (message.content.toLowerCase() === "!grub" && !message.author.bot) {
        try {
            const embed = new EmbedBuilder()
                .setTitle("Efebetter.dev - Steam Grubumuz")
                .setDescription("Steam grubumuza aşağıdaki linkten katılabilirsiniz:\n\n|| ||") // Linki buraya ekleyin
                .setColor("#00A2E8")
                .setThumbnail("") // İsteğe bağlı olarak bir resim ekleyebilirsiniz
                .setFooter({
                    text: "Efebetter.dev - Resmi Discord",
                    iconURL: client.user.displayAvatarURL()
                });

            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error("❌ Steam grubu mesajı gönderilirken hata:", error);
            await message.reply("Steam grubu bilgisi gönderilirken bir hata oluştu!");
        }
    }


    if (message.content.startsWith("!bakım") && !message.author.bot) {
        try {
            if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return message.reply("Bu komutu kullanmak için yönetici yetkisine sahip olmalısınız!");
            }

            const args = message.content.split(" ").slice(1);
            if (args.length < 2) {
                return message.reply("Kullanım: !bakım <süre> <sebep>\nÖrnekler:\n!bakım 2h  sunucu güncellemesi\n!bakım 3gün donanım yenileme");
            }

            const durationInput = args[0].toLowerCase();
            const reason = args.slice(1).join(" ");

            // Süre ayrıştırma
            let durationText = "";
            let durationHours = 0;

            if (durationInput.includes("h")) {
                const hours = parseInt(durationInput.replace("h", "d", "s", "g"));
                if (!isNaN(hours)) {
                    durationHours = hours;
                    durationText = hours === 1 ? "1 Saat" : `${hours} Saat`;
                }
            } else if (durationInput.includes("gün") || durationInput.includes("gun")) {
                const days = parseInt(durationInput.replace("gün", "").replace("gun", ""));
                if (!isNaN(days)) {
                    durationHours = days * 24;
                    durationText = days === 1 ? "1 Gün" : `${days} Gün`;
                }
            } else {
                return message.reply("Geçersiz süre formatı! Örnekler:\n2h (2 saat)\n3gün (3 gün)");
            }

            if (durationHours <= 0) {
                return message.reply("Süre 0'dan büyük olmalıdır!");
            }

            const maintenanceChannel = await client.channels.fetch(MAINTENANCE_CHANNEL_ID);
            if (!maintenanceChannel) {
                return message.reply("Bakım kanalı bulunamadı!");
            }

            const embed = new EmbedBuilder()
                .setTitle("🚧 Sunucu Bakım Duyurusu 🚧")
                .setDescription(`**Süre:** ${durationText}\n**Sebep:** ${reason}\n\nSunucumuz bakım nedeniyle geçici olarak kapatılmıştır. Lütfen belirtilen süre sonunda tekrar kontrol ediniz.`)
                .setColor("#FFA500")
                .setThumbnail("") // İsteğe bağlı olarak bir resim ekleyebilirsiniz
                .setFooter({
                    text: "Efebetter.dev - Resmi Discord",
                    iconURL: client.user.displayAvatarURL()
                });

            await maintenanceChannel.send({ embeds: [embed] });
            await message.reply(`Bakım duyurusu başarıyla gönderildi! Süre: ${durationText}`);

        } catch (error) {
            console.error("❌ Bakım komutu işlenirken hata:", error);
            await message.reply("Bakım duyurusu gönderilirken bir hata oluştu!");
        }
    }
    // Aktif komutu
    if (message.content === "!aktif" && !message.author.bot) {
        try {
            if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return message.reply("Bu komutu kullanmak için yönetici yetkisine sahip olmalısınız!");
            }

            const maintenanceChannel = await client.channels.fetch(MAINTENANCE_CHANNEL_ID);
            if (!maintenanceChannel) {
                return message.reply("Bakım kanalı bulunamadı!");
            }

            const embed = new EmbedBuilder()
                .setTitle("✅ Sunucu Aktif Duyurusu ✅")
                .setDescription("Sunucumuz tekrar aktif hale gelmiştir! Aşağıdaki IP adresini kullanarak bağlanabilirsiniz:\n\n**IP:** 93.113.57.59:27015")
                .setColor("#00FF00")
                .setThumbnail("") // İsteğe bağlı olarak bir resim ekleyebilirsiniz
                .setFooter({
                    text: "Efebetter.dev - Resmi Discord",
                    iconURL: client.user.displayAvatarURL()
                });

            await maintenanceChannel.send({ embeds: [embed] });
            await message.reply("Aktif duyurusu başarıyla gönderildi!");
        } catch (error) {
            console.error("❌ Aktif komutu işlenirken hata:", error);
            await message.reply("Aktif duyurusu gönderilirken bir hata oluştu!");
        }
    }

    // Help komutu
    if (message.content === "!help" && !message.author.bot) {
        try {
            const embed = new EmbedBuilder()
                .setTitle("Efebetter.dev - Yardım Menüsü")
                .setDescription("Aşağıda botun kullanabileceğiniz komutları listelenmiştir:")
                .setColor("#0099FF")
                .addFields(
                    { name: "🎫 Ticket Sistemi", value: "Destek kanalındaki menüden ticket açabilirsiniz", inline: false },
                    { name: "👮 Polis Başvurusu", value: "`!pdbasvuru` - Polis Departmanı başvurusu yaparsınız", inline: true },
                    { name: "🌐 IP Bilgisi", value: "`!ip` - Sunucu IP adresini gösterir", inline: true },
                    { name: "🛠️ Workshop", value: "`!workshop` - Workshop içeriğini gösterir", inline: true },
                    { name: "👥 Steam Grubu", value: "`!grub` - Steam grubumuzu gösterir", inline: true },
                    { name: "🔧 Bakım Duyurusu", value: "`!bakım <süre> <sebep>` - Bakım duyurusu yapar (Yönetici)", inline: true },
                    { name: "✅ Aktif Duyurusu", value: "`!aktif` - Sunucunun aktif olduğunu duyurur (Yönetici)", inline: true }
                )
                .setImage(IMAGE_URL)
                .setFooter({
                    text: "Efebetter.dev - Resmi Discord",
                    iconURL: client.user.displayAvatarURL()
                });

            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error("❌ Help komutu işlenirken hata:", error);
            await message.reply("Yardım menüsü gösterilirken bir hata oluştu!");
        }
    }
});

async function initializeTicketSystem() {
    try {
        const supportChannel = await client.channels.fetch(SUPPORT_CHANNEL_ID);
        if (!supportChannel) {
            console.error("❌ Destek kanalı bulunamadı! SUPPORT_CHANNEL_ID doğru mu?");
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle("Efebetter.dev - Destek Sistemi")
            .setDescription("Lütfen aşağıdan **ilgili destek kategorisini** seçerek ticket açınız.\n\nDestek kurallarına uygun şekilde talebinizi oluşturunuz.\nYetkililerin sizi daha hızlı görmesi için detaylı açıklama yapınız.")
            .setColor("#FFD700")
            .setImage(IMAGE_URL)
            .setFooter({
                text: "Destek Saatleri: 07:00 - 02:00",
                iconURL: client.user.displayAvatarURL()
            });

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("ticket_menu")
            .setPlaceholder("🎫 Destek Kategorisini Seçiniz")
            .addOptions([
                { label: "Yetkili Şikayeti", value: "Yetkili Şikayeti", emoji: "" }, // emoji eklemek isterseniz buraya ekleyebilirsiniz
                { label: "Oyuncu Şikayeti", value: "Oyuncu Şikayeti", emoji: "" }, // emoji eklemek isterseniz buraya ekleyebilirsiniz
                { label: "Bug Bildirimi", value: "Bug Bildirimi", emoji: "" }, // emoji eklemek isterseniz buraya ekleyebilirsiniz
                { label: "Market Sorunları", value: "Market Sorunları", emoji: "" }, // emoji eklemek isterseniz buraya ekleyebilirsiniz
                { label: "Diğer", value: "Diğer", emoji: "" }, // emoji eklemek isterseniz buraya ekleyebilirsiniz
                { label: "Seçimi Sıfırla", value: "reset", emoji: EMOJIS.CROSS }
            ]);

        const menuRow = new ActionRowBuilder().addComponents(selectMenu);

        const messages = await supportChannel.messages.fetch({ limit: 10 });
        const botMessages = messages.filter(m => m.author.id === client.user.id && m.embeds.length > 0);

        if (botMessages.size === 0) {
            await supportChannel.send({ embeds: [embed], components: [menuRow] });
            console.log("🎫 Ticket mesajı destek kanalına gönderildi");
        }
    } catch (error) {
        console.error("❌ Ticket sistemi başlatılırken hata:", error);
    }
}

async function initializePDApplicationSystem() {
    try {
        const pdChannel = await client.channels.fetch(PD_APPLICATION_CHANNEL_ID);
        if (!pdChannel) {
            console.error("❌ PD başvuru kanalı bulunamadı! PD_APPLICATION_CHANNEL_ID doğru mu?");
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle("Efebetter.dev - Polis Departmanı Başvuru")
            .setDescription("Aşağıdaki butona tıklayarak Polis Departmanı için başvuru yapabilirsiniz.\n\n**Başvuru Şartları:**\n- 16 yaşından büyük olmalısınız\n- Mikrofonunuz çalışıyor olmalı\n- Rol bilgisine sahip olmalısınız")
            .setColor("#0000FF")
            .setImage(IMAGE_URL)
            .setFooter({
                text: "Başvurunuz incelendikten sonra size dönüş yapılacaktır.",
                iconURL: client.user.displayAvatarURL()
            });

        const button = new ButtonBuilder()
            .setCustomId("pd_application")
            .setLabel("Başvuruyu Başlat")
            .setStyle(ButtonStyle.Primary)
            .setEmoji(EMOJIS.POLICE);

        const buttonRow = new ActionRowBuilder().addComponents(button);

        const messages = await pdChannel.messages.fetch({ limit: 10 });
        const botMessages = messages.filter(m => m.author.id === client.user.id && m.embeds.length > 0);

        if (botMessages.size === 0) {
            await pdChannel.send({
                embeds: [embed],
                components: [buttonRow]
            });
            console.log("👮 PD başvuru mesajı kanala gönderildi");
        }
    } catch (error) {
        console.error("❌ PD başvuru sistemi başlatılırken hata:", error);
    }
}

client.on("interactionCreate", async (interaction) => {
    try {
        if (interaction.isStringSelectMenu() && interaction.customId === "ticket_menu") {
            await handleSelectMenu(interaction);
        } else if (interaction.isButton()) {
            if (interaction.customId === "pd_application") {
                await handlePDApplicationButton(interaction);
            } else {
                await handleButton(interaction);
            }
        } else if (interaction.isModalSubmit()) {
            if (interaction.customId === 'add_user_modal') {
                await handleAddUserModal(interaction);
            } else if (interaction.customId === 'remove_user_modal') {
                await handleRemoveUserModal(interaction);
            } else if (interaction.customId === 'pd_application_modal') {
                await handlePDApplicationModal(interaction);
            }
        }
    } catch (error) {
        console.error("❌ InteractionCreate hatası:", error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: "Bir hata oluştu! Lütfen daha sonra tekrar deneyin.",
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: "Bir hata oluştu! Lütfen daha sonra tekrar deneyin.",
                ephemeral: true
            });
        }
    }
});

async function handlePDApplicationButton(interaction) {
    try {
        // Gerekli rol kontrolü
        if (PD_REQUIRED_ROLE_ID) {
            const member = await interaction.guild.members.fetch(interaction.user.id);
            if (!member.roles.cache.has(PD_REQUIRED_ROLE_ID)) {
                return interaction.reply({
                    content: "Bu başvuruyu yapmak için gerekli role sahip değilsiniz!",
                    ephemeral: true
                });
            }
        }

        const modal = new ModalBuilder()
            .setCustomId('pd_application_modal')
            .setTitle('Polis Departmanı Başvuru Formu');

        const icNameInput = new TextInputBuilder()
            .setCustomId('ic_name')
            .setLabel("RP İsminiz")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setPlaceholder("Örnek: John_Doe");

        const ageInput = new TextInputBuilder()
            .setCustomId('age')
            .setLabel("Gerçek Yaşınız")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setPlaceholder("Örnek: 18");

        const roleKnowledgeInput = new TextInputBuilder()
            .setCustomId('role_knowledge')
            .setLabel("Rol Bilginiz (1-10)")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setPlaceholder("1-10 arası bir sayı giriniz");

        const steamInput = new TextInputBuilder()
            .setCustomId('steam')
            .setLabel("Steam Profil Linki")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setPlaceholder("https://steamcommunity.com/id/...");

        const scenarioInput = new TextInputBuilder()
            .setCustomId('scenario')
            .setLabel("K.O.S Senaryo Cevabı")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setPlaceholder("Bu durumda izleyeceğin prosedür...");

        const firstActionRow = new ActionRowBuilder().addComponents(icNameInput);
        const secondActionRow = new ActionRowBuilder().addComponents(ageInput);
        const thirdActionRow = new ActionRowBuilder().addComponents(roleKnowledgeInput);
        const fourthActionRow = new ActionRowBuilder().addComponents(steamInput);
        const fifthActionRow = new ActionRowBuilder().addComponents(scenarioInput);

        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow, fifthActionRow);

        await interaction.showModal(modal);
    } catch (error) {
        console.error("❌ PD başvuru modalı gösterilirken hata:", error);
        await interaction.reply({
            content: "Başvuru formu açılırken bir hata oluştu! Lütfen daha sonra tekrar deneyin.",
            ephemeral: true
        });
    }
}

async function handlePDApplicationModal(interaction) {
    try {
        const icName = interaction.fields.getTextInputValue('ic_name');
        const age = interaction.fields.getTextInputValue('age');
        const roleKnowledge = interaction.fields.getTextInputValue('role_knowledge');
        const steamLink = interaction.fields.getTextInputValue('steam');
        const scenario = interaction.fields.getTextInputValue('scenario');

        const ageNum = parseInt(age);
        const roleKnowledgeNum = parseInt(roleKnowledge);

        if (isNaN(ageNum)) {
            return await interaction.reply({
                content: "Lütfen geçerli bir yaş giriniz!",
                ephemeral: true
            });
        }

        if (ageNum < 16) {
            return await interaction.reply({
                content: "Başvuru için 16 yaşından büyük olmalısınız!",
                ephemeral: true
            });
        }

        if (isNaN(roleKnowledgeNum) || roleKnowledgeNum < 1 || roleKnowledgeNum > 10) {
            return await interaction.reply({
                content: "Rol bilginizi 1-10 arasında bir sayı ile puanlamalısınız!",
                ephemeral: true
            });
        }

        if (!steamLink.startsWith('https://steamcommunity.com/')) {
            return await interaction.reply({
                content: "Lütfen geçerli bir Steam profili linki giriniz!",
                ephemeral: true
            });
        }

        const pdChannel = await client.channels.fetch(PD_APPLICATION_CHANNEL_ID);
        if (!pdChannel) {
            return await interaction.reply({
                content: "Başvuru kanalı bulunamadı! Lütfen yetkililere bildirin.",
                ephemeral: true
            });
        }

        const applicationEmbed = new EmbedBuilder()
            .setTitle(`Yeni PD Başvurusu - ${icName}`)
            .setColor("#0000FF")
            .addFields(
                { name: "Kullanıcı Bilgileri", value: `**Discord:** ${interaction.user.tag}\n**Steam:** [Profil Linki](${steamLink})\n**Yaş:** ${age}\n**Rol Bilgisi:** ${roleKnowledge}/10`, inline: false },
                { name: "K.O.S Senaryosu", value: scenario, inline: false }
            )
            .setFooter({
                text: `Başvuran: ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL()
            });

        const actionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`pd_approve_${interaction.user.id}`)
                .setLabel("Onayla")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(`pd_reject_${interaction.user.id}`)
                .setLabel("Reddet")
                .setStyle(ButtonStyle.Danger)
        );

        await pdChannel.send({
            content: `<@&${PD_REVIEW_ROLE_ID}>`,
            embeds: [applicationEmbed],
            components: [actionRow]
        });

        await interaction.reply({
            content: "Başvurunuz başarıyla gönderildi! Yetkililer tarafından incelenecektir.",
            ephemeral: true
        });

    } catch (error) {
        console.error("❌ PD başvuru modalı işlenirken hata:", error);
        await interaction.reply({
            content: "Başvurunuz gönderilirken bir hata oluştu! Lütfen daha sonra tekrar deneyin.",
            ephemeral: true
        });
    }
}

async function handleSelectMenu(interaction) {
    const guild = interaction.guild;
    const selectedCategory = interaction.values[0];

    if (selectedCategory === "reset") {
        return interaction.reply({ content: "Seçim sıfırlandı! Tekrar seçim yapabilirsiniz.", ephemeral: true });
    }

    const existingTicket = guild.channels.cache.find(c =>
        c.parentId === TICKET_CATEGORY_ID &&
        c.permissionOverwrites.cache.has(interaction.user.id)
    );

    if (existingTicket) {
        return interaction.reply({
            content: `Zaten açık bir ticket'ınız var! Lütfen önce ${existingTicket} kanalını kapatın.`,
            ephemeral: true
        });
    }

    const staffRole = guild.roles.cache.get(STAFF_ROLE_ID);
    if (!staffRole) {
        return interaction.reply({ content: "Yetkili rolü bulunamadı!", ephemeral: true });
    }

    try {
        await interaction.deferReply({ ephemeral: true });

        const categoryNames = {
            "Yetkili Şikayeti": "Yetkili Şikayeti Konuları",
            "Oyuncu Şikayeti": "Oyuncu Şikayeti Konuları",
            "Bug Bildirimi": "Bug Bildirimi İle Konular",
            "Market Sorunları": "Market İle İlgili Sorunlar",
            "Diğer": "Diğer Konular"
        };

        const categoryName = categoryNames[selectedCategory] || "Genel Destek";

        const channel = await guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: 0,
            parent: TICKET_CATEGORY_ID,
            permissionOverwrites: [
                { id: guild.id, deny: ["ViewChannel"] },
                { id: interaction.user.id, allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"] },
                { id: staffRole.id, allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"] }
            ]
        });

        const embed = new EmbedBuilder()
            .setTitle("Efebetter.dev - Destek Sistemi")
            .setDescription("Yetkililerimizin mesaj yazmasını beklemeden sorununuzu anlatınız.")
            .setColor("#00FF00")
            .addFields(
                { name: "**Destek Açan:**", value: `<@${interaction.user.id}>`, inline: true },
                { name: "**Destek Kategorisi:**", value: `${categoryName}`, inline: true },
                { name: "Destek Devralan:", value: "Henüz bir yetkili ilgilenmiyor", inline: true }
            )
            .setImage(IMAGE_URL)
            .setFooter({
                text: "Lütfen sabırlı olun.",
                iconURL: client.user.displayAvatarURL()
            });

        const buttonRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("devral")
                .setLabel("Destek Devral")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji(EMOJIS.ADD_USER),
            new ButtonBuilder()
                .setCustomId("kapat")
                .setLabel("Kapat")
                .setStyle(ButtonStyle.Danger)
                .setEmoji(EMOJIS.REMOVE_USER),
            new ButtonBuilder()
                .setCustomId("uye_ekle")
                .setLabel("Üye Ekle")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("➕"),
            new ButtonBuilder()
                .setCustomId("uye_cikar")
                .setLabel("Üye Çıkar")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("➖")
        );

        await sendTicketLog(guild, "Yeni Ticket Oluşturuldu", `Yeni bir ticket oluşturuldu!\n**Açan:** <@${interaction.user.id}>\n**Kategori:** ${categoryName}\n**Ticket Kanalı:** <#${channel.id}>`, "#00FF00");

        await channel.send({
            content: `<@${interaction.user.id}> | <@&${STAFF_ROLE_ID}>`,
            embeds: [embed],
            components: [buttonRow]
        });

        await interaction.editReply({
            content: `${categoryName} kategorisi için ticket açıldı: ${channel}`
        });
    } catch (error) {
        console.error("❌ Ticket oluşturulurken hata:", error);
        await interaction.editReply({
            content: "Ticket oluşturulamadı! Lütfen daha sonra tekrar deneyin."
        });
    }
}

async function handleButton(interaction) {
    const guild = interaction.guild;
    const channel = interaction.channel;
    const member = interaction.member;

    try {
        if (interaction.customId === "devral") {
            if (!member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
                return interaction.reply({
                    content: "Bu butonu kullanmak için 'Mesajları Yönet' yetkisine sahip olmalısınız!",
                    ephemeral: true
                });
            }

            const embed = interaction.message.embeds[0];
            const newEmbed = EmbedBuilder.from(embed)
                .spliceFields(2, 1, {
                    name: "Destek Devralan:",
                    value: `<@${interaction.user.id}>`,
                    inline: true
                });

            await interaction.update({
                embeds: [newEmbed],
                components: interaction.message.components
            });

            await sendTicketLog(guild, "Ticket Devralındı", `Ticket devralındı!\n**Devralan:** <@${interaction.user.id}>\n**Ticket Kanalı:** <#${channel.id}>`, "#FF4500");
        }

        if (interaction.customId === "kapat") {
            await interaction.reply({
                content: "Ticket kapatılıyor... 10 saniye içinde kanal silinecektir.",
                ephemeral: false
            });

            try {
                const transcript = await createTranscript(channel, {
                    limit: -1,
                    returnBuffer: false,
                    fileName: `ticket-${channel.name}.html`
                });

                if (TICKET_LOG_CHANNEL_ID) {
                    const ticketLogChannel = guild.channels.cache.get(TICKET_LOG_CHANNEL_ID);
                    if (ticketLogChannel) {
                        await ticketLogChannel.send({
                            content: `Ticket kapatıldı!\n**Kapatılan Ticket Kanalı:** ${channel.name}\n**Kapatılan:** <@${interaction.user.id}>`,
                            files: [transcript]
                        });
                    }
                }

                setTimeout(async () => {
                    try {
                        await channel.delete("Ticket kapatıldı");
                    } catch (deleteError) {
                        console.error("❌ Ticket kanalı silinirken hata:", deleteError);
                    }
                }, 10000);

            } catch (error) {
                console.error("❌ Ticket kapatılırken hata:", error);
                await interaction.followUp({
                    content: "Ticket kapatılırken bir hata oluştu! Lütfen yetkililere bildirin.",
                    ephemeral: true
                });
            }
        }

        if (interaction.customId === "uye_ekle") {
            const modal = new ModalBuilder()
                .setCustomId('add_user_modal')
                .setTitle('Üye Ekle');

            const userIdInput = new TextInputBuilder()
                .setCustomId('user_id_input')
                .setLabel("Eklenecek Kullanıcı ID")
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                .setPlaceholder("Örnek: 123456789012345678");

            const firstActionRow = new ActionRowBuilder().addComponents(userIdInput);
            modal.addComponents(firstActionRow);

            await interaction.showModal(modal);
        }

        if (interaction.customId === "uye_cikar") {
            const modal = new ModalBuilder()
                .setCustomId('remove_user_modal')
                .setTitle('Üye Çıkar');

            const userIdInput = new TextInputBuilder()
                .setCustomId('user_id_input')
                .setLabel("Çıkarılacak Kullanıcı ID")
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                .setPlaceholder("Örnek: 123456789012345678");

            const firstActionRow = new ActionRowBuilder().addComponents(userIdInput);
            modal.addComponents(firstActionRow);

            await interaction.showModal(modal);
        }

        // PD başvuru sonuç butonları
        if (interaction.customId.startsWith('pd_approve_') ||
            interaction.customId.startsWith('pd_reject_')) {

            const userId = interaction.customId.split('_')[2];
            const action = interaction.customId.split('_')[1];

            const user = await client.users.fetch(userId).catch(() => null);
            if (!user) {
                return interaction.reply({
                    content: "Kullanıcı bulunamadı!",
                    ephemeral: true
                });
            }

            const guildMember = await guild.members.fetch(userId).catch(() => null);
            if (!guildMember) {
                return interaction.reply({
                    content: "Kullanıcı sunucuda bulunamadı!",
                    ephemeral: true
                });
            }

            let responseMessage = "";
            let dmMessage = "";
            let logColor = "";
            let actionText = "";

            switch (action) {
                case 'approve':
                    responseMessage = `Başvuru ${interaction.user} tarafından onaylandı!`;
                    dmMessage = `🎉 Tebrikler! Polis Departmanı başvurunuz **onaylandı**!\n\nEn kısa sürede mülakata girmeniz gerekmektedir.`;
                    logColor = "#00FF00";
                    actionText = "Onaylandı";

                    // Onaylanan kullanıcıya rol ver
                    if (PD_ACCEPTED_ROLE_ID) {
                        try {
                            await guildMember.roles.add(PD_ACCEPTED_ROLE_ID);
                            console.log(`✅ ${user.tag} kullanıcısına PD rolü verildi`);
                        } catch (roleError) {
                            console.error("❌ Rol verilirken hata:", roleError);
                            responseMessage += "\n\n⚠️ Kullanıcıya rol verilemedi!";
                        }
                    }
                    break;

                case 'reject':
                    responseMessage = `Başvuru ${interaction.user} tarafından reddedildi!`;
                    dmMessage = `❌ Maalesef Polis Departmanı başvurunuz **reddedildi**.\n\nDaha sonra tekrar başvurabilirsiniz.`;
                    logColor = "#FF0000";
                    actionText = "Reddedildi";
                    break;
            }

            try {
                await user.send(dmMessage);
            } catch (dmError) {
                console.log("Kullanıcı DM'leri kapalı:", user.tag);
                responseMessage += "\n\n⚠️ Kullanıcıya DM gönderilemedi (DM'leri kapalı olabilir).";
            }

            await interaction.update({
                content: responseMessage,
                components: []
            });

            if (PD_RESULT_CHANNEL_ID) {
                const resultChannel = guild.channels.cache.get(PD_RESULT_CHANNEL_ID);
                if (resultChannel) {
                    const resultEmbed = new EmbedBuilder()
                        .setTitle(`PD Başvuru Sonucu - ${actionText}`)
                        .setDescription(`**Başvuran:** <@${userId}>\n**Karar Veren:** ${interaction.user}\n**Sonuç:** ${actionText}`)
                        .setColor(logColor)
                        .setTimestamp();

                    await resultChannel.send({
                        content: `<@${userId}>`,
                        embeds: [resultEmbed]
                    });
                }
            }

            await sendTicketLog(guild, "PD Başvuru Sonucu",
                `**Başvuran:** <@${userId}>\n**Karar Veren:** ${interaction.user.tag}\n**Sonuç:** ${actionText}`,
                logColor);
        }
    } catch (error) {
        console.error("❌ Button işlemi sırasında hata:", error);
        await interaction.reply({
            content: "Bir hata oluştu! Lütfen daha sonra tekrar deneyin.",
            ephemeral: true
        }).catch(console.error);
    }
}

async function handleAddUserModal(interaction) {
    const userId = interaction.fields.getTextInputValue('user_id_input');
    const channel = interaction.channel;

    try {
        await interaction.deferReply({ ephemeral: true });

        const user = await client.users.fetch(userId).catch(() => null);
        if (!user) {
            return interaction.editReply({
                content: "Geçerli bir kullanıcı ID'si giriniz!"
            });
        }

        await channel.permissionOverwrites.edit(userId, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true
        });

        await interaction.editReply({
            content: `<@${userId}> kullanıcısı başarıyla ticket'a eklendi!`
        });

        await sendTicketLog(interaction.guild, "Ticket'a Üye Eklendi",
            `**Ticket:** <#${channel.id}>\n**Ekleyen:** ${interaction.user.tag}\n**Eklenen:** <@${userId}>`,
            "#00FF00");
    } catch (error) {
        console.error("❌ Kullanıcı ekleme hatası:", error);
        await interaction.editReply({
            content: "Kullanıcı eklenirken bir hata oluştu! Geçerli bir kullanıcı ID'si girdiğinizden emin olun."
        });
    }
}

async function handleRemoveUserModal(interaction) {
    const userId = interaction.fields.getTextInputValue('user_id_input');
    const channel = interaction.channel;

    try {
        await interaction.deferReply({ ephemeral: true });

        const user = await client.users.fetch(userId).catch(() => null);
        if (!user) {
            return interaction.editReply({
                content: "Geçerli bir kullanıcı ID'si giriniz!"
            });
        }

        await channel.permissionOverwrites.delete(userId);

        await interaction.editReply({
            content: `<@${userId}> kullanıcısı başarıyla ticket'tan çıkarıldı!`
        });

        await sendTicketLog(interaction.guild, "Ticket'tan Üye Çıkarıldı",
            `**Ticket:** <#${channel.id}>\n**Çıkaran:** ${interaction.user.tag}\n**Çıkarılan:** <@${userId}>`,
            "#FF0000");
    } catch (error) {
        console.error("❌ Kullanıcı çıkarma hatası:", error);
        await interaction.editReply({
            content: "Kullanıcı çıkarılırken bir hata oluştu! Geçerli bir kullanıcı ID'si girdiğinizden emin olun."
        });
    }
}

async function sendTicketLog(guild, title, description, color) {
    try {
        if (!TICKET_LOG_CHANNEL_ID) return;

        const ticketLogChannel = guild.channels.cache.get(TICKET_LOG_CHANNEL_ID);
        if (!ticketLogChannel) return;

        const logEmbed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color)
            .setTimestamp();

        await ticketLogChannel.send({ embeds: [logEmbed] });
    } catch (error) {
        console.error("❌ Log gönderilirken hata:", error);
    }
}

client.login(TOKEN).catch(error => {
    console.error("❌ Bot giriş hatası:", error);
    process.exit(1);
});