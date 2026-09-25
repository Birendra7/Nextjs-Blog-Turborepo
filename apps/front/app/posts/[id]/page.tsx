'use client';

import { useEffect, useState } from 'react';

type Post = {
  id: number;
  title: string;
  content: string;
  slug?: string | null;
  published: boolean;
};

type Comment = {
  id: number;
  content: string;
  author?: { id: number; name: string } | null;
  post?: { id: number } | null;
};

type PostDetailProps = {
  params: Promise<{ id: string }>;
};

export default function PostDetailPage({ params }: PostDetailProps) {
  const [id, setId] = useState<string>('');
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', slug: '', published: true });
  const [status, setStatus] = useState('');

  useEffect(() => {
    const load = async () => {
      const { id: postId } = await params;
      setId(postId);
      await loadPost(postId);
      await loadComments();
    };

    load();
  }, [params]);

  async function loadPost(postId: string) {
    const res = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query Post($id: Int!) {
            post(id: $id) {
              id
              title
              content
              slug
              published
            }
          }
        `,
        variables: { id: Number(postId) },
      }),
    });

    const json = await res.json();
    const nextPost = json?.data?.post ?? null;
    setPost(nextPost);

    if (nextPost) {
      setForm({
        title: nextPost.title,
        content: nextPost.content,
        slug: nextPost.slug ?? '',
        published: nextPost.published,
      });
    }
  }

  async function loadComments() {
    const res = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query Comments {
            comments {
              id
              content
              post {
                id
              }
              author {
                id
                name
              }
            }
          }
        `,
      }),
    });

    const json = await res.json();
    setComments(json?.data?.comments ?? []);
  }

  async function handleCreateComment() {
    if (!commentText.trim()) return;

    const res = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation CreateComment($createCommentInput: CreateCommentInput!) {
            createComment(createCommentInput: $createCommentInput) {
              id
              content
              post { id }
              author { id name }
            }
          }
        `,
        variables: {
          createCommentInput: {
            content: commentText,
            postId: Number(id),
          },
        },
      }),
    });

    const json = await res.json();
    if (json.errors) {
      setStatus(json.errors[0]?.message ?? 'Something went wrong');
      return;
    }

    setCommentText('');
    await loadComments();
    setStatus('Comment added successfully');
  }

  async function handleDeletePost() {
    const res = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation RemovePost($id: Int!) {
            removePost(id: $id)
          }
        `,
        variables: { id: Number(id) },
      }),
    });

    const json = await res.json();
    if (json.errors) {
      setStatus(json.errors[0]?.message ?? 'Delete failed');
      return;
    }

    setStatus('Post deleted');
    window.location.href = '/';
  }

  async function handleUpdatePost() {
    const res = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation UpdatePost($id: Int!, $updatePostDto: UpdatePostDto!) {
            updatePost(id: $id, updatePostDto: $updatePostDto) {
              id
              title
              content
              slug
              published
            }
          }
        `,
        variables: {
          id: Number(id),
          updatePostDto: form,
        },
      }),
    });

    const json = await res.json();
    if (json.errors) {
      setStatus(json.errors[0]?.message ?? 'Update failed');
      return;
    }

    setPost(json.data.updatePost);
    setIsEditing(false);
    setStatus('Post updated successfully');
  }

  if (!post) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold text-slate-900">Post not found</h1>
      </main>
    );
  }

  const filteredComments = comments.filter((item) => item.post?.id === Number(id));

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
            {post.published ? 'Published' : 'Draft'}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setIsEditing((value) => !value)}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
            <button
              type="button"
              onClick={handleDeletePost}
              className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
            >
              Delete
            </button>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-indigo-500 focus:outline-none"
              placeholder="Title"
            />
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-indigo-500 focus:outline-none"
              placeholder="Slug"
            />
            <textarea
              rows={8}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-indigo-500 focus:outline-none"
              placeholder="Content"
            />
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
              Publish this post
            </label>
            <button
              type="button"
              onClick={handleUpdatePost}
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700"
            >
              Save changes
            </button>
          </div>
        ) : (
          <>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900">{post.title}</h1>
            <p className="mb-8 text-sm text-slate-500">{post.slug ?? 'untitled-post'}</p>
            <div className="prose max-w-none text-slate-700">
              <p className="whitespace-pre-line leading-8">{post.content}</p>
            </div>
          </>
        )}
      </article>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">Comments</h2>
        <div className="space-y-3">
          {filteredComments.length > 0 ? (
            filteredComments.map((comment) => (
              <div key={comment.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="mb-1 text-sm font-medium text-slate-800">{comment.author?.name ?? 'Anonymous'}</p>
                <p className="text-slate-600">{comment.content}</p>
              </div>
            ))
          ) : (
            <p className="text-slate-500">No comments yet.</p>
          )}
        </div>

        <div className="mt-6 space-y-4">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-indigo-500 focus:outline-none"
            placeholder="Write a comment..."
          />
          <button
            type="button"
            onClick={handleCreateComment}
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700"
          >
            Add comment
          </button>
        </div>

        {status ? <p className="mt-4 text-sm text-slate-600">{status}</p> : null}
      </section>
    </main>
  );
}
