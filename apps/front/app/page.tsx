type Post = {
  id: number;
  title: string;
  content: string;
  slug?: string | null;
  published: boolean;
  createAt?: string;
  updateAt?: string;
};

async function getPosts(): Promise<Post[]> {
  const res = await fetch("http://localhost:8000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        {
          posts {
            id
            title
            content
            slug
            published
          }
        }
      `,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  const json = await res.json();
  return json?.data?.posts ?? [];
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
              Blog Platform
            </p>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Fresh stories for modern readers
            </h1>
          </div>
          <div className="flex gap-3">
            <a
              href="/login"
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:border-slate-400"
            >
              Login
            </a>
            <a
              href="/register"
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Register
            </a>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {posts.length > 0 ? (
            posts.map((post) => (
              <article
                key={post.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-wide text-slate-500">
                  <span>{post.published ? "Published" : "Draft"}</span>
                  <span>#{post.id}</span>
                </div>
                <h2 className="mb-3 text-2xl font-semibold text-slate-900">{post.title}</h2>
                <p className="mb-4 line-clamp-4 text-sm leading-7 text-slate-600">
                  {post.content}
                </p>
                <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-500">
                  <span>{post.slug ?? "untitled-post"}</span>
                  <a href={`/posts/${post.id}`} className="font-medium text-indigo-600 hover:text-indigo-500">
                    Read more →
                  </a>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-slate-600 md:col-span-3">
              No posts have been published yet. Connect the API and create your first post.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
