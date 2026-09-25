type Post = {
  id: number;
  title: string;
  content: string;
  slug?: string | null;
  published: boolean;
  tags?: { id: number; name: string }[];
};

type Tag = {
  id: number;
  name: string;
};

async function getPosts(): Promise<Post[]> {
  const res = await fetch('http://localhost:8000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        {
          posts {
            id
            title
            content
            slug
            published
            tags {
              id
              name
            }
          }
        }
      `,
    }),
    cache: 'no-store',
  });

  if (!res.ok) {
    return [];
  }

  const json = await res.json();
  return json?.data?.posts ?? [];
}

async function getTags(): Promise<Tag[]> {
  const res = await fetch('http://localhost:8000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        {
          tags {
            id
            name
          }
        }
      `,
    }),
    cache: 'no-store',
  });

  if (!res.ok) {
    return [];
  }

  const json = await res.json();
  return json?.data?.tags ?? [];
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ tag?: string }> | { tag?: string };
}) {
  const resolvedSearchParams = searchParams ? await Promise.resolve(searchParams) : {};
  const selectedTag = resolvedSearchParams.tag ?? '';
  const [posts, tags] = await Promise.all([getPosts(), getTags()]);
  const filteredPosts = selectedTag
    ? posts.filter((post) => post.tags?.some((tag) => tag.name.toLowerCase() === selectedTag.toLowerCase()))
    : posts;

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

        <div className="mb-8 flex flex-wrap items-center gap-3">
          <a
            href="/"
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              !selectedTag
                ? 'bg-slate-900 text-white'
                : 'border border-slate-300 bg-white text-slate-700 hover:border-slate-400'
            }`}
          >
            All posts
          </a>

          {tags.length > 0 ? (
            tags.map((tag) => {
              const isActive = selectedTag.toLowerCase() === tag.name.toLowerCase();

              return (
                <a
                  key={tag.id}
                  href={isActive ? '/' : `/?tag=${encodeURIComponent(tag.name)}`}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                    isActive
                      ? 'border-indigo-700 bg-indigo-700 text-white'
                      : 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:border-indigo-300'
                  }`}
                >
                  #{tag.name}
                </a>
              );
            })
          ) : (
            <span className="text-sm text-slate-500">No tags yet.</span>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <article
                key={post.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-wide text-slate-500">
                  <span>{post.published ? 'Published' : 'Draft'}</span>
                  <span>#{post.id}</span>
                </div>
                <h2 className="mb-3 text-2xl font-semibold text-slate-900">{post.title}</h2>
                <p className="mb-4 line-clamp-4 text-sm leading-7 text-slate-600">
                  {post.content}
                </p>
                <div className="mb-4 flex flex-wrap gap-2">
                  {(post.tags ?? []).map((tag) => (
                    <span
                      key={`${post.id}-${tag.id}`}
                      className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-500">
                  <span>{post.slug ?? 'untitled-post'}</span>
                  <a href={`/posts/${post.id}`} className="font-medium text-indigo-600 hover:text-indigo-500">
                    Read more →
                  </a>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-slate-600 md:col-span-3">
              {selectedTag
                ? `No posts found for #${selectedTag}. Try another tag.`
                : 'No posts have been published yet. Connect the API and create your first post.'}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
