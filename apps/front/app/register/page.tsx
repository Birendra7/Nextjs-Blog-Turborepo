'use client';

import { FormEvent, useState } from 'react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('Creating account...');

    const res = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation Register($createUserInput: CreateUserInput!) {
            register(createUserInput: $createUserInput) {
              id
              name
              email
            }
          }
        `,
        variables: {
          createUserInput: { name, email, password },
        },
      }),
    });

    const json = await res.json();

    if (json.errors) {
      setStatus(json.errors[0]?.message ?? 'Registration failed');
      return;
    }

    const token = json.data.register.token;
    localStorage.setItem('blog_token', token);
    setStatus(`User created: ${json.data.register.name}`);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f1ea] px-6 py-12">
      <div className="w-full max-w-md rounded-[2rem] border border-[#111111]/10 bg-[#f5f1ea] p-8 shadow-[0_30px_80px_rgba(17,17,17,0.08)]">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111111] text-lg font-semibold text-[#f5f1ea]">
            J
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#111111]/60">Join</p>
            <h1 className="text-2xl font-semibold text-[#111111]">Register</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#111111]/80">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-[#111111]/15 bg-[#f5f1ea] px-4 py-3 text-[#111111] outline-none focus:border-[#111111]"
              required
            />
          </div>

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
            Create account
          </button>

          {status ? <p className="text-sm text-[#111111]/70">{status}</p> : null}
        </form>
      </div>
    </main>
  );
}
