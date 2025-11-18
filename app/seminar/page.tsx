'use client';

import { useState, useEffect } from 'react';
import {
  LiveKitRoom,
  useVoiceAssistant,
  BarVisualizer,
  RoomAudioRenderer,
  DisconnectButton,
  useConnectionState,
  useParticipants,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { ConnectionState } from 'livekit-client';

interface RoomCredentials {
  room: {
    name: string;
    url: string;
    sid: string;
  };
  token: string;
  agentId: string;
}

export default function SeminarPage() {
  const [credentials, setCredentials] = useState<RoomCredentials | null>(null);
  const [studentName, setStudentName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRoom = async () => {
    if (!studentName.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/room/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName: studentName.trim() }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create room');
      }

      setCredentials(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!credentials) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Join Seminar
          </h1>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && createRoom()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your name"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              onClick={createRoom}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Room...' : 'Start Seminar'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LiveKitRoom
      token={credentials.token}
      serverUrl={credentials.room.url}
      connect={true}
      audio={true}
      video={false}
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"
    >
      <SeminarRoom studentName={studentName} roomName={credentials.room.name} />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}

function SeminarRoom({ studentName, roomName }: { studentName: string; roomName: string }) {
  const connectionState = useConnectionState();
  const participants = useParticipants();
  const { state: agentState } = useVoiceAssistant();

  const isConnected = connectionState === ConnectionState.Connected;
  const agentParticipant = participants.find((p) => p.identity.includes('agent'));

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Seminar Session</h1>
        <p className="text-gray-600">Room: {roomName}</p>
        <p className="text-sm text-gray-500 mt-1">
          Connection: <span className={isConnected ? 'text-green-600' : 'text-yellow-600'}>
            {connectionState}
          </span>
        </p>
      </div>

      <div className="space-y-6">
        {/* Audio Visualizer */}
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-6 rounded-xl">
          <div className="flex items-center justify-center mb-4">
            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {studentName.charAt(0).toUpperCase()}
            </div>
          </div>
          <BarVisualizer state={agentState} barCount={5} className="h-12" />
        </div>

        {/* Participants */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-3">Participants ({participants.length})</h3>
          <div className="space-y-2">
            {participants.map((participant) => (
              <div
                key={participant.sid}
                className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
              >
                <span className="text-gray-800">{participant.identity}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  participant.isSpeaking ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                }`}>
                  {participant.isSpeaking ? 'Speaking' : 'Listening'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Status */}
        {agentParticipant && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
              <span className="text-blue-800 font-medium">AI Tutor is connected</span>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center pt-4">
          <DisconnectButton className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
            Leave Seminar
          </DisconnectButton>
        </div>
      </div>
    </div>
  );
}
