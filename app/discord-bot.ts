import { Client, GatewayIntentBits } from 'discord.js';
import {
  AudioPlayerStatus,
  AudioResource,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  VoiceConnection,
} from '@discordjs/voice';
import path from 'node:path';
import dotenv from 'dotenv';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
});
let connection: VoiceConnection | null = null;
let player = createAudioPlayer();

client.on('ready', () => {
  console.log(`Logged in as ${client?.user?.tag}`);
});

client.on('error', console.error);

export async function loginBot() {
  return new Promise(async (resolve) => {
    console.log(process.env.DISCORD_TOKEN);
    await client.login(process.env.DISCORD_TOKEN);
    setTimeout(() => {
      resolve(null);
    }, 2000);
  });
}

export function connectToVoice() {
  const guild = client.guilds.cache.first();
  if (!guild) {
    console.error('No Guild found.');
    return;
  }
  const channel = guild.channels.cache.find(
    (ch) => ch.isVoiceBased() && ch.joinable,
  );
  if (channel && channel.isVoiceBased()) {
    connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
    });
    const member = guild.members.me;
    if (member && member.voice) {
      member.voice.setMute(false).catch(console.error);
    }
  } else {
    console.error('No channel found.');
  }
}

export function streamAudioData(audioResource: AudioResource) {
  if (!connection) {
    console.error('Bot is not connected to a voice channel.');
    return;
  }

  player.play(audioResource);
  connection.setSpeaking(true);
  connection.subscribe(player);
}

export function disconnectBot() {
  connection?.destroy();
  client?.destroy();
}
