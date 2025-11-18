# ElevenLabs AI Geography Tutor - Interactive Seminar Platform

An autonomous online seminar platform powered by **LiveKit** and **ElevenLabs AI Agents**. Students can join audio-only rooms and interact with an AI tutor in real-time.

## 🎯 Features

- ✅ **Audio-Only Seminar Rooms** - Zoom-like interface for 1-on-1 sessions
- ✅ **ElevenLabs Managed Agent** - AI tutor auto-connects to rooms
- ✅ **Real-time WebRTC** - Low-latency audio streaming (150-300ms)
- ✅ **Autonomous Operation** - No manual intervention required
- ✅ **Scalable** - Multiple concurrent sessions supported
- ✅ **Zero Custom Backend** - Serverless architecture on Vercel

## 🏗️ Architecture

```
Student Browser
  ↓ (WebRTC)
LiveKit Cloud Room
  ↓ (Auto-dispatch)
ElevenLabs Agent (g-gymnasiou)
  ↓ (WebRTC)
Real-time Audio Exchange
```

### Tech Stack
- **Frontend**: Next.js 14 + React + TypeScript + Tailwind CSS
- **WebRTC**: LiveKit Cloud + @livekit/components-react
- **AI Agent**: ElevenLabs Agents Platform (Managed)
- **Deployment**: Vercel (Serverless Functions)

## 📋 Prerequisites

1. **LiveKit Account** - [cloud.livekit.io](https://cloud.livekit.io)
2. **ElevenLabs Account** - [elevenlabs.io](https://elevenlabs.io)
3. **Node.js 18+** installed
4. **Vercel Account** (optional, for deployment)

## 🚀 Setup Instructions

### Step 1: Clone and Install

```bash
git clone https://github.com/trisstann-design/elevenlabs-geography-tutor.git
cd elevenlabs-geography-tutor
npm install
```

### Step 2: Configure Environment Variables

Copy the example file:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:

```env
# ElevenLabs Configuration
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_AGENT_ID=agent_4601ka9befc7evebb2pmh2kpana4

# LiveKit Configuration
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
LIVEKIT_URL=wss://your-project.livekit.cloud

# Public URLs
NEXT_PUBLIC_LIVEKIT_URL=wss://your-project.livekit.cloud
```

### Step 3: Get Your API Keys

#### LiveKit Setup
1. Go to [cloud.livekit.io/projects](https://cloud.livekit.io/projects)
2. Create a new project (or select existing)
3. Copy:
   - API Key → `LIVEKIT_API_KEY`
   - API Secret → `LIVEKIT_API_SECRET`
   - WebSocket URL → `LIVEKIT_URL` and `NEXT_PUBLIC_LIVEKIT_URL`

#### ElevenLabs Setup
1. Go to [elevenlabs.io/app/api-keys](https://elevenlabs.io/app/api-keys)
2. Create API key → `ELEVENLABS_API_KEY`
3. Your deployed agent ID is already set: `agent_4601ka9befc7evebb2pmh2kpana4`

### Step 4: Run Locally

```bash
npm run dev
```

Open [http://localhost:3000/seminar](http://localhost:3000/seminar)

### Step 5: Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or use the [Vercel Dashboard](https://vercel.com):
1. Import repository
2. Add environment variables in Settings → Environment Variables
3. Deploy

## 📱 Usage

1. Navigate to `/seminar` route
2. Enter your name
3. Click "Start Seminar"
4. Agent automatically joins the room
5. Start speaking - the AI tutor responds in real-time

## 🛠️ API Endpoints

### `POST /api/room/create`

Creates a new LiveKit room and returns credentials.

**Request:**
```json
{
  "studentName": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "room": {
    "name": "seminar-1234567890-abc123",
    "url": "wss://your-project.livekit.cloud",
    "sid": "RM_xxxxx"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "agentId": "agent_4601ka9befc7evebb2pmh2kpana4"
}
```

## 🧪 Testing

### Local Testing
1. Start dev server: `npm run dev`
2. Open `/seminar` in browser
3. Enter name and join
4. Verify agent connection in UI
5. Test audio input/output

### Production Testing
1. Deploy to Vercel
2. Set environment variables in Vercel dashboard
3. Test with multiple concurrent sessions

## 📊 Cost Estimation

| Service | Free Tier | Cost After Free |
|---------|-----------|------------------|
| LiveKit Cloud | 50GB/month | $0.01/GB |
| ElevenLabs Agents | 10k characters | ~$0.30/1k chars |
| Vercel | 100GB bandwidth | $0 (Hobby) |

## 🔧 Customization

### Change Agent Behavior
1. Go to [ElevenLabs Agents Platform](https://elevenlabs.io/app/agents)
2. Edit agent `g-gymnasiou`
3. Update prompt, voice, or tools
4. Changes apply instantly (no deployment needed)

### Add Video Support
1. Update `app/seminar/page.tsx`: Change `video={false}` to `video={true}`
2. Add video tracks in LiveKit room configuration
3. Deploy

### Increase Max Participants
Edit `app/api/room/create/route.ts`:
```typescript
maxParticipants: 10, // Change from 2 to desired number
```

## 🐛 Troubleshooting

### Agent Not Connecting
- Verify `ELEVENLABS_AGENT_ID` is correct
- Check LiveKit room metadata includes `agentId`
- Ensure ElevenLabs agent is deployed and active

### Audio Issues
- Check browser microphone permissions
- Test with different browsers (Chrome recommended)
- Verify LiveKit URL is correct (wss:// protocol)

### Room Creation Fails
- Verify all environment variables are set
- Check LiveKit API key has room creation permissions
- Review Vercel function logs for errors

## 📚 Resources

- [LiveKit Docs](https://docs.livekit.io)
- [ElevenLabs Agents Docs](https://elevenlabs.io/docs/agents)
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Deployment](https://vercel.com/docs)

## 📄 License

MIT License - feel free to use for your own projects!

## 🤝 Contributing

Pull requests welcome! For major changes, open an issue first.

---

**Built with ❤️ using LiveKit, ElevenLabs, and Next.js**
