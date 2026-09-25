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

    const token = localStorage.getItem('blog_token');

    const res = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
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
    <main className="flex min-h-screen items-center justify-center bg-[#f5f1ea] px-6 py-12">
      <div className="w-full max-w-2xl rounded-[2rem] border border-[#111111]/10 bg-[#f5f1ea] p-8 shadow-[0_30px_80px_rgba(17,17,17,0.08)]">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111111] text-lg font-semibold text-[#f5f1ea]">
              P
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#111111]/60">New story</p>
              <h1 className="text-2xl font-semibold text-[#111111]">Create Post</h1>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#111111]/80">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl border border-[#111111]/15 bg-[#f5f1ea] px-4 py-3 text-[#111111] outline-none focus:border-[#111111]"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#111111]/80">Slug</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-2xl border border-[#111111]/15 bg-[#f5f1ea] px-4 py-3 text-[#111111] outline-none focus:border-[#111111]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#111111]/80">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={7}
              className="w-full rounded-2xl border border-[#111111]/15 bg-[#f5f1ea] px-4 py-3 text-[#111111] outline-none focus:border-[#111111]"
              required
            />
          </div>

          <label className="flex items-center gap-3 text-sm text-[#111111]/80">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 accent-[#111111]"
            />
            Publish now
          </label>

          <button
            type="submit"
            className="w-full rounded-2xl bg-[#111111] px-4 py-3 text-sm font-medium text-[#f5f1ea] hover:translate-y-[-1px]"
          >
            Publish post
          </button>

          {status ? <p className="text-sm text-[#111111]/70">{status}</p> : null}
        </form>
      </div>
    </main>
  );
}
