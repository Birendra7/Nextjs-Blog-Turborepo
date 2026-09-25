'use client';

import { FormEvent, useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('Logging in...');

    const res = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation Login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
              id
              name
              email
              bio
              avatar
              token
            }
          }
        `,
        variables: { email, password },
      }),
    });

    const json = await res.json();

    if (json.errors) {
      setStatus(json.errors[0]?.message ?? 'Login failed');
      return;
    }

    const token = json.data.login.token;
    localStorage.setItem('blog_token', token);
    setStatus(`Welcome ${json.data.login.name}`);
    window.location.href = '/profile';
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f1ea] px-6 py-12">
      <div className="w-full max-w-md rounded-[2rem] border border-[#111111]/10 bg-[#f5f1ea] p-8 shadow-[0_30px_80px_rgba(17,17,17,0.08)]">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111111] text-lg font-semibold text-[#f5f1ea]">
            B
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#111111]/60">Journal</p>
            <h1 className="text-2xl font-semibold text-[#111111]">Login</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#111111]/80">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-[#111111]/15 bg-[#f5f1ea] px-4 py-3 text-[#111111] outline-none focus:border-[#111111]"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#111111]/80">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-[#111111]/15 bg-[#f5f1ea] px-4 py-3 text-[#111111] outline-none focus:border-[#111111]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-[#111111] px-4 py-3 text-sm font-medium text-[#f5f1ea] hover:translate-y-[-1px]"
          >
            Log in
          </button>

          {status ? <p className="text-sm text-[#111111]/70">{status}</p> : null}
        </form>
      </div>
    </main>
  );
}
