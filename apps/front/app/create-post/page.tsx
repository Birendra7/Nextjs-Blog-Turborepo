'use client';

import { FormEvent, useState } from 'react';

export default function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [slug, setSlug] = useState('');
  const [published, setPublished] = useState(true);
  const [status, setStatus] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('Creating post...');

    const res = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation CreatePost($createPostDto: CreatePostDto!) {
            createPost(createPostDto: $createPostDto) {
              id
              title
              content
              published
            }
          }
        `,
        variables: {
          createPostDto: {
            title,
            content,
            slug,
            published,
            authorId: 1,
          },
        },
      }),
    });

    const json = await res.json();

    if (json.errors) {
      setStatus(json.errors[0]?.message ?? 'Post creation failed');
      return;
    }

    setStatus(`Post created: ${json.data.createPost.title}`);
    setTitle('');
    setContent('');
    setSlug('');
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-3xl font-bold text-slate-900">Create Post</h1>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-700">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-indigo-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-700">Slug</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-700">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={7}
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-indigo-500"
            required
          />
        </div>

        <label className="mb-6 flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Publish now
        </label>

        <button
          type="submit"
          className="w-full rounded-xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-700"
        >
          Publish post
        </button>

        {status ? <p className="mt-4 text-sm text-slate-600">{status}</p> : null}
      </form>
    </main>
  );
}
