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

    setStatus(`User created: ${json.data.register.name}`);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center justify-center px-6 py-12">
      <form onSubmit={handleSubmit} className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-3xl font-bold text-slate-900">Register</h1>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none ring-0 transition focus:border-indigo-500"
            required
          />
        </div>

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
          className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-medium text-white transition hover:bg-indigo-500"
        >
          Create account
        </button>

        {status ? <p className="mt-4 text-sm text-slate-600">{status}</p> : null}
      </form>
    </main>
  );
}
