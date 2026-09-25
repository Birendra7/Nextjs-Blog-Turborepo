type PostDetailProps = {
  params: Promise<{ id: string }>;
};

async function getPost(id: string) {
  const res = await fetch(`http://localhost:8000/graphql`, {
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
      variables: { id: Number(id) },
    }),
    cache: 'no-store',
  });

  const json = await res.json();
  return json?.data?.post ?? null;
}

export default async function PostDetailPage({ params }: PostDetailProps) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold text-slate-900">Post not found</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
          {post.published ? 'Published' : 'Draft'}
        </p>
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900">{post.title}</h1>
        <p className="mb-8 text-sm text-slate-500">{post.slug ?? 'untitled-post'}</p>
        <div className="prose max-w-none text-slate-700">
          <p className="whitespace-pre-line leading-8">{post.content}</p>
        </div>
      </article>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">Add comment</h2>
        <form
          action="http://localhost:8000/graphql"
          method="POST"
          className="space-y-4"
        >
          <input type="hidden" name="query" value={`mutation CreateComment($createCommentInput: CreateCommentInput!) { createComment(createCommentInput: $createCommentInput) { id content } }`} />
          <input type="hidden" name="variables" value={JSON.stringify({ createCommentInput: { content: '', postId: Number(id), authorId: 1 } })} />
          <textarea
            name="comment"
            rows={4}
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-indigo-500 focus:outline-none"
            placeholder="Write a comment..."
          />
          <button type="submit" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700">
            Comment
          </button>
        </form>
      </section>
    </main>
  );
}
