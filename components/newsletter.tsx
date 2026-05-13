'use client';
import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!email) return;
    setStatus('loading');

    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus('success');
      setMessage("You're subscribed!");
      setEmail('');
    } else {
      setStatus('error');
      setMessage(data.error || 'Something went wrong.');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-10">
      <p className="font-bold">Join the Newsletter</p>
      <p>Get notifications when new photos are posted!</p>
      <div className="flex gap-2 pt-5">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-100"
        />
        <button
          onClick={handleSubmit}
          disabled={status === 'loading'}
          className="bg-black text-white px-5 font-bold hover:opacity-80 disabled:opacity-50"
        >
          {status === 'loading' ? '...' : 'JOIN'}
        </button>
      </div>
      {message && (
        <p className={`pt-3 text-sm ${status === 'success' ? 'text-green-600' : 'text-red-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
}