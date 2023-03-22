require("dotenv").config();

const {
  Client,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

const client = new Client({
  intents: [
    "Guilds",
    "MessageContent",
    "GuildMessages",
    "GuildMessageReactions",
    "GuildMessageTyping",
    "DirectMessages",
    "DirectMessageReactions",
    "DirectMessageTyping",
  ],
});

const PREFIX = "!";

client.on("ready", () => {
  console.log(`${client.user.tag} has logged in.`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.split(" ");
  const CMD_NAME = args[0] ? args[0].toLowerCase() : null;
  if (!CMD_NAME) return;

  if (CMD_NAME === PREFIX + "buzzers") {
    const delay = args[1] ? parseInt(args[1]) : Math.floor((Math.random() * 10) +5) * 1000; // default to random num between 5 to 15 seconds
    if (isNaN(delay) || delay < 1000 || delay > 60000) {
      return message.reply("Please enter a number between 1000 and 60000ms");
    }
    console.log(delay)
    const embed = new EmbedBuilder();
    let button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("buzzers")
        .setLabel("Click When Button Is Green")
        .setStyle(ButtonStyle.Danger)
        .setDisabled(true)
    );

    embed.setTitle("Buzzers");
    embed.setDescription("Click the button when it turns green");
    embed.setColor("Aqua");
    embed.setTimestamp();

    const buzzerMessage = await message.channel.send({
      embeds: [embed],
      components: [button],
    });

    setTimeout(() => {
      button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("buzzers")
          .setLabel("Click When Button Is Green")
          .setStyle(ButtonStyle.Success)
      );
      buzzerMessage.edit({
        embeds: [embed],
        components: [button],
      });

      const filter = (interaction) => interaction.customId === "buzzers";
      const collector = message.channel.createMessageComponentCollector({
        filter,
        time: delay,
      });

      collector.on("collect", async (interaction) => {
        if (interaction.isButton()) {
          collector.stop(interaction.user.tag);
        }
      });

      collector.on("end", async (collected, reason) => {
        if (reason === "time") {
          const buzzerTimeoutEmbed = new EmbedBuilder();
          buzzerTimeoutEmbed.setTitle("Buzzers");
          buzzerTimeoutEmbed.setDescription("Time's up!");
          buzzerTimeoutEmbed.setColor("Red");
          buzzerTimeoutEmbed.setTimestamp();
          await buzzerMessage.edit({
            embeds: [buzzerTimeoutEmbed],
            components: [],
          });
        } else {
          const winner = collected.first().user.tag;
          const buzzerWinnerEmbed = new EmbedBuilder();
          buzzerWinnerEmbed.setTitle("Buzzers");
          buzzerWinnerEmbed.setDescription(`${winner} buzzed first!`);
          buzzerWinnerEmbed.setColor("Green");
          buzzerWinnerEmbed.setTimestamp();
          await buzzerMessage.edit({
            embeds: [buzzerWinnerEmbed],
            components: [],
          });
        }
      });

    }, delay); // Turn button green on delay
} else if (CMD_NAME === PREFIX + "buzzers") {
  if (!message.member.permissions.has("ADMINISTRATOR")) {
    return message.reply(
      "You do not have the required permissions to use this command."
    );
  }

  const args = message.content.split(" ");
  const delay = parseInt(args[1], 10);

  if (!delay || delay < 5000) {
    return message.reply(
      "Please provide a valid delay (minimum 5000ms). Example: `!buzzers 10000`"
    );
  }

  const embed = new EmbedBuilder();
  let button = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("buzzers")
      .setLabel("Click When Button Is Green")
      .setStyle(ButtonStyle.Danger)
      .setDisabled(true)
  );

  embed.setTitle("Buzzers");
  embed.setDescription("Click the button when it turns green");
  embed.setColor("Aqua");
  embed.setTimestamp();

  const buzzerMessage = await message.channel.send({
    embeds: [embed],
    components: [button],
  });

  setTimeout(() => {
    button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("buzzers")
        .setLabel("Click When Button Is Green")
        .setStyle(ButtonStyle.Primary)
    );

    buzzerMessage.edit({
      embeds: [embed],
      components: [button],
    });

    setTimeout(() => {
      // Disable the button and end the collector
      button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("buzzers")
          .setLabel("Click When Button Is Green")
          .setStyle(ButtonStyle.Danger)
          .setDisabled(true)
      );

      buzzerMessage.edit({
        embeds: [embed],
        components: [button],
      });

      collector.stop("time");
    }, delay - 5000); // Turn button green 5 seconds before end

    // Enable the button after 5 seconds
    setTimeout(() => {
      button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("buzzers")
          .setLabel("Click When Button Is Green")
          .setStyle(ButtonStyle.Success)
      );
      buzzerMessage.edit({
        embeds: [embed],
        components: [button],
      });
    }, delay - 5000 - 5000); // Turn button green 5 seconds after start
  }, Math.floor(Math.random() * (delay - 10000) + 5000));
}
});
client.login(process.env._TOKEN);