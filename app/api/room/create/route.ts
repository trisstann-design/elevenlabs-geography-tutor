import { NextRequest, NextResponse } from 'next/server';
import { RoomServiceClient, AccessToken } from 'livekit-server-sdk';

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY!;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET!;
const LIVEKIT_URL = process.env.LIVEKIT_URL!;
const ELEVENLABS_AGENT_ID = process.env.ELEVENLABS_AGENT_ID!;

interface CreateRoomRequest {
  studentName?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: CreateRoomRequest = await request.json();
    const studentName = body.studentName || 'Student';
    
    // Generate unique room name
    const roomName = `seminar-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    
    // Initialize LiveKit Room Service Client
    const roomService = new RoomServiceClient(LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
    
    // Create room with ElevenLabs agent configuration
    const room = await roomService.createRoom({
      name: roomName,
      emptyTimeout: 300, // 5 minutes - room auto-closes when empty
      maxParticipants: 2, // Student + Agent
      metadata: JSON.stringify({
        agentId: ELEVENLABS_AGENT_ID,
        createdAt: new Date().toISOString(),
        studentName,
      }),
    });

    // Generate access token for student
    const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity: studentName,
      name: studentName,
      ttl: '1h', // Token valid for 1 hour
    });

    // Grant permissions
    token.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canPublishData: true,
      canSubscribe: true,
    });

    const accessToken = await token.toJwt();

    // Dispatch ElevenLabs agent to room
    // Note: ElevenLabs agent auto-connects via WebRTC when room is created
    // The agent listens for rooms with matching agentId in metadata

    return NextResponse.json({
      success: true,
      room: {
        name: roomName,
        url: LIVEKIT_URL,
        sid: room.sid,
      },
      token: accessToken,
      agentId: ELEVENLABS_AGENT_ID,
    });
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create room',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
