'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  type: 'user' | 'agent';
  text: string;
}

export default function GeographyLesson() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const connectToAgent = async () => {
    if (isConnected || isConnecting) return;
    setIsConnecting(true);

    try {
      const signedUrlResponse = await fetch('/api/agents/signed-url', {
        method: 'POST',
      });
      const { signed_url } = await signedUrlResponse.json();

      wsRef.current = new WebSocket(signed_url);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        setMessages([{ type: 'agent', text: 'Hello! I\'m your geography tutor. Let\'s explore the world together!' }]);
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'conversation_initiation_client_data') {
          // Handle agent response
          setMessages(prev => [...prev, { type: 'agent', text: data.user_message || data.message }]);
        }
      };

      wsRef.current.onerror = () => {
        setIsConnected(false);
        setIsConnecting(false);
        alert('Connection error');
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
      };
    } catch (error) {
      console.error('Failed to connect:', error);
      setIsConnecting(false);
      alert('Failed to connect to tutor');
    }
  };

  const sendMessage = () => {
    if (!input.trim() || !wsRef.current || !isConnected) return;

    setMessages(prev => [...prev, { type: 'user', text: input }]);

    wsRef.current.send(JSON.stringify({
      type: 'user_message',
      text: input,
    }));

    setInput('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">Geography Tutor</h1>

      {!isConnected ? (
        <div className="text-center py-12">
          <p className="mb-4 text-gray-600">Connect to your AI geography tutor to begin learning</p>
          <button
            onClick={connectToAgent}
            disabled={isConnecting}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-8 rounded"
          >
            {isConnecting ? 'Connecting...' : 'Start Lesson'}
          </button>
        </div>
      ) : (
        <div className="border rounded-lg h-96 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-4 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block max-w-xs px-4 py-2 rounded-lg ${
                  msg.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask a geography question..."
              className="flex-1 border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
