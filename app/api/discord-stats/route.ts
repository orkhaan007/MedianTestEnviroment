import { NextResponse } from 'next/server';

// Discord API endpoint for getting server widget data
const DISCORD_API_URL = 'https://discord.com/api/v10';

// Your Discord server ID - Replace this with your Median Discord server ID
const DISCORD_SERVER_ID = '1322654030509641858';

// Your Discord bot token
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const server = searchParams.get('server');
    
    if (!server || server !== 'median') {
      return NextResponse.json({ error: 'Invalid server parameter' }, { status: 400 });
    }
    
    // Fetch server stats
    const statsResponse = await fetch(
      `${DISCORD_API_URL}/guilds/${DISCORD_SERVER_ID}/widget.json`,
      {
        headers: {
          'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );
    
    if (!statsResponse.ok) {
      console.error('Discord API error:', await statsResponse.text());
      throw new Error('Failed to fetch Discord server stats');
    }
    
    const statsData = await statsResponse.json();
    
    // Fetch member count data (requires privileged intents)
    const countResponse = await fetch(
      `${DISCORD_API_URL}/guilds/${DISCORD_SERVER_ID}?with_counts=true`,
      {
        headers: {
          'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );
    
    if (!countResponse.ok) {
      console.error('Discord API error:', await countResponse.text());
      throw new Error('Failed to fetch Discord member counts');
    }
    
    const countData = await countResponse.json();
    
    // Combine the data
    const responseData = {
      name: countData.name,
      approximate_member_count: countData.approximate_member_count,
      approximate_presence_count: countData.approximate_presence_count,
      members: statsData.members || [],
      instant_invite: statsData.instant_invite,
      icon_url: countData.icon ? `https://cdn.discordapp.com/icons/${DISCORD_SERVER_ID}/${countData.icon}.${countData.icon.startsWith('a_') ? 'gif' : 'png'}` : null,
    };
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching Discord stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Discord stats' },
      { status: 500 }
    );
  }
}
