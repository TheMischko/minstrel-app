"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectBot = exports.streamAudioData = exports.connectToVoice = exports.loginBot = void 0;
const discord_js_1 = require("discord.js");
const voice_1 = require("@discordjs/voice");
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.GuildVoiceStates,
    ],
});
let connection = null;
let player = (0, voice_1.createAudioPlayer)();
client.on('ready', () => {
    console.log(`Logged in as ${client?.user?.tag}`);
});
client.on('error', console.error);
async function loginBot() {
    return new Promise(async (resolve) => {
        console.log(process.env.DISCORD_TOKEN);
        await client.login(process.env.DISCORD_TOKEN);
        setTimeout(() => {
            resolve(null);
        }, 2000);
    });
}
exports.loginBot = loginBot;
function connectToVoice() {
    const guild = client.guilds.cache.first();
    if (!guild) {
        console.error('No Guild found.');
        return;
    }
    const channel = guild.channels.cache.find((ch) => ch.isVoiceBased() && ch.joinable);
    if (channel && channel.isVoiceBased()) {
        connection = (0, voice_1.joinVoiceChannel)({
            channelId: channel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
        });
        const member = guild.members.me;
        if (member && member.voice) {
            member.voice.setMute(false).catch(console.error);
        }
    }
    else {
        console.error('No channel found.');
    }
}
exports.connectToVoice = connectToVoice;
function streamAudioData(audioResource) {
    if (!connection) {
        console.error('Bot is not connected to a voice channel.');
        return;
    }
    player.play(audioResource);
    connection.setSpeaking(true);
    connection.subscribe(player);
}
exports.streamAudioData = streamAudioData;
function disconnectBot() {
    connection?.destroy();
    client?.destroy();
}
exports.disconnectBot = disconnectBot;
//# sourceMappingURL=discord-bot.js.map