'use client';

import { useState, useEffect } from 'react';

export default function Page() {
  const [type, setType] = useState<'Suggestion' | 'Bug'>('Suggestion');
  const [content, setContent] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStatus('idle');

    if (content.trim() === '') {
      setError('The "Details" field must be filled.');
      return;
    }

    setStatus('loading');

    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, content, name, email }),
    });

    if (res.ok) {
      setStatus('success');
      setContent('');
      setName('');
      setEmail('');
    } else {
      setStatus('error');
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4 font-sans">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 shadow-xl border border-gray-700 rounded-2xl p-6 w-full max-w-lg space-y-5"
      >
        {/* Branding Header */}
        <div className="text-center">
          <div className="text-3xl font-extrabold tracking-wide text-blue-400">GSRP</div>
          <div className="text-sm text-gray-400">Georgia State Roleplay - Community Feedback</div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Username</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded"
            placeholder="Your Username"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email (optional)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'Suggestion' | 'Bug')}
            className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded"
          >
            <option value="Suggestion">Suggestion</option>
            <option value="Bug">Bug Report</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Details</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`w-full p-2 bg-gray-800 text-white border ${
              error ? 'border-red-500' : 'border-gray-700'
            } rounded h-32 resize-none`}
            placeholder="Write your suggestion or bug report here..."
          />
          {error && <p className="text-red-400 mt-1 text-sm">{error}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Submitting...' : 'Submit'}
        </button>

        {/* Success and Error Messages */}
        {status === 'success' && (
          <div className="mt-4 text-green-600 bg-green-200 p-3 rounded-xl flex items-center space-x-4">
            <svg
              className="w-8 h-8 text-green-700"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-lg font-semibold">✅ Submission Successful!</span>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-4 text-red-600 bg-red-200 p-3 rounded-xl flex items-center space-x-4">
            <svg
              className="w-8 h-8 text-red-700"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM10 2a8 8 0 1 1 0 16A8 8 0 0 1 10 2zm-1 4h2v4h-2V6zm0 6h2v2h-2v-2z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-lg font-semibold">❌ Something went wrong. Please try again!</span>
          </div>
        )}
      </form>
    </main>
  );
}
