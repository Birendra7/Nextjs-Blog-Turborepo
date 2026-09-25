'use client';

import { FormEvent, useEffect, useState } from 'react';

type ProfileUser = {
  id: number;
  name: string;
  email: string;
  bio?: string | null;
  avatar?: string | null;
};

export default function ProfilePage() {
  const [user, setUser] = useState<ProfileUser>({ id: 0, name: '', email: '', bio: '', avatar: '' });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('blog_token');

    if (!token) {
      window.location.href = '/login';
      return;
    }

    const loadProfile = async () => {
      const res = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            query Me {
              me {
                id
                name
                email
                bio
                avatar
              }
            }
          `,
        }),
      });

      const json = await res.json();

      if (json.errors) {
        setStatus(json.errors[0]?.message ?? 'Failed to load profile');
        setLoading(false);
        return;
      }

      const profile = json.data?.me ?? null;

      if (!profile) {
        localStorage.removeItem('blog_token');
        window.location.href = '/login';
        return;
      }

      setUser(profile);
      setName(profile.name ?? '');
      setEmail(profile.email ?? '');
      setBio(profile.bio ?? '');
      setAvatar(profile.avatar ?? '');
      setLoading(false);
    };

    loadProfile();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('Saving profile...');

    const token = localStorage.getItem('blog_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const updateUserInput: Record<string, string | number | undefined> = {
      id: user.id,
      name,
      email,
      bio,
      avatar,
    };

    if (password.trim()) {
      updateUserInput.password = password;
    }

    const res = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
          mutation UpdateUser($id: Int!, $updateUserInput: UpdateUserInput!) {
            updateUser(id: $id, updateUserInput: $updateUserInput) {
              id
              name
              email
              bio
              avatar
            }
          }
        `,
        variables: {
          id: user.id,
          updateUserInput,
        },
      }),
    });

    const json = await res.json();

    if (json.errors) {
      setStatus(json.errors[0]?.message ?? 'Profile update failed');
      return;
    }

    const nextProfile = json.data?.updateUser;
    setUser(nextProfile);
    setStatus('Profile updated successfully');
    setPassword('');
  }

  function handleLogout() {
    localStorage.removeItem('blog_token');
    window.location.href = '/login';
  }

  return (
    <main className="min-h-screen bg-[#f5f1ea] px-6 py-16 text-[#111111]">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#111111]/10 bg-[#f5f1ea] p-8 shadow-[0_30px_80px_rgba(17,17,17,0.08)]">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#111111]/60">Account</p>
            <h1 className="text-3xl font-semibold tracking-[-0.06em]">Your profile</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="/create-post"
              className="rounded-full border border-[#111111]/20 bg-transparent px-4 py-2 text-sm font-medium text-[#111111]"
            >
              New post
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-[#111111] px-4 py-2 text-sm font-medium text-[#f5f1ea]"
            >
              Log out
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-[#111111]/70">Loading profile...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-5 rounded-[1.5rem] border border-[#111111]/10 bg-[#111111] p-5 text-[#f5f1ea]">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f1ea] text-lg font-semibold text-[#111111]">
                {name?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#f5f1ea]/60">Profile</p>
                <h2 className="text-2xl font-semibold">{name || 'Unnamed user'}</h2>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#111111]/80">Name</label>
              <input
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
              <label className="mb-2 block text-sm font-medium text-[#111111]/80">Avatar URL</label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full rounded-2xl border border-[#111111]/15 bg-[#f5f1ea] px-4 py-3 text-[#111111] outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#111111]/80">Bio</label>
              <textarea
                rows={5}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-2xl border border-[#111111]/15 bg-[#f5f1ea] px-4 py-3 text-[#111111] outline-none focus:border-[#111111]"
                placeholder="Tell readers a little about yourself..."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#111111]/80">New password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-[#111111]/15 bg-[#f5f1ea] px-4 py-3 text-[#111111] outline-none focus:border-[#111111]"
                placeholder="Leave blank to keep current password"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-[#111111] px-4 py-3 text-sm font-medium text-[#f5f1ea] hover:translate-y-[-1px]"
            >
              Save changes
            </button>

            {status ? <p className="text-sm text-[#111111]/70">{status}</p> : null}
          </form>
        )}
      </div>
    </main>
  );
}
