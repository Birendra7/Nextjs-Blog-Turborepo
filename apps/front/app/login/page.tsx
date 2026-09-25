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
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center justify-center px-6 py-12">
      <form onSubmit={handleSubmit} className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-3xl font-bold text-slate-900">Login</h1>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none ring-0 transition focus:border-indigo-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none ring-0 transition focus:border-indigo-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-700"
        >
          Log in
        </button>

        {status ? <p className="mt-4 text-sm text-slate-600">{status}</p> : null}
      </form>
    </main>
  );
}
