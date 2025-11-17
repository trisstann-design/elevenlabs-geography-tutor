import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          ElevenLabs Geography Tutor
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Learn geography with an AI-powered Socratic tutor powered by ElevenLabs Agents
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">🌍</div>
            <h2 className="text-2xl font-bold mb-4">Interactive Learning</h2>
            <p className="text-gray-600">
              Engage in real-time conversations with an AI tutor that uses the Socratic method to guide your learning
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">🤖</div>
            <h2 className="text-2xl font-bold mb-4">AI-Powered</h2>
            <p className="text-gray-600">
              Powered by ElevenLabs Agents for natural, engaging conversations about geography topics
            </p>
          </div>
        </div>

        <Link href="/lessons/geography">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-200">
            Start Learning Now
          </button>
        </Link>
      </div>
    </div>
  );
}
