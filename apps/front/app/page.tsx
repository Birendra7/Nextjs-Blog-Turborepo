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
    <main className="min-h-screen bg-[#f5f1ea] text-[#111111]">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 rounded-[2rem] border border-[#111111]/10 bg-[#111111] px-6 py-8 text-[#f5f1ea] shadow-[0_30px_80px_rgba(17,17,17,0.08)] md:px-8">
          <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-[#f5f1ea]/70">
                Journal
              </p>
              <h1 className="max-w-xl text-4xl font-semibold tracking-[-0.06em] md:text-6xl">
                Thoughtful stories for modern minds.
              </h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="/create-post"
                className="rounded-full border border-[#f5f1ea]/30 bg-transparent px-5 py-3 text-sm font-medium text-[#f5f1ea]"
              >
                Create Post
              </a>
              <a
                href="/profile"
                className="rounded-full border border-[#f5f1ea]/30 bg-transparent px-5 py-3 text-sm font-medium text-[#f5f1ea]"
              >
                Profile
              </a>
              <a
                href="/login"
                className="rounded-full bg-[#f5f1ea] px-5 py-3 text-sm font-medium text-[#111111]"
              >
                Login
              </a>
              <a
                href="/register"
                className="rounded-full bg-[#f5f1ea] px-5 py-3 text-sm font-medium text-[#111111]"
              >
                Register
              </a>
            </div>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-3">
          <a
            href="/"
            className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
              !selectedTag
                ? 'border-[#111111] bg-[#111111] text-[#f5f1ea]'
                : 'border-[#111111]/20 bg-[#f5f1ea] text-[#111111]'
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
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
                    isActive
                      ? 'border-[#111111] bg-[#111111] text-[#f5f1ea]'
                      : 'border-[#111111]/20 bg-[#f5f1ea] text-[#111111]'
                  }`}
                >
                  #{tag.name}
                </a>
              );
            })
          ) : (
            <span className="text-sm text-[#111111]/60">No tags yet.</span>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <article
                key={post.id}
                className="rounded-[1.75rem] border border-[#111111]/10 bg-[#f5f1ea] p-6 shadow-[0_18px_50px_rgba(17,17,17,0.05)]"
              >
                <div className="mb-4 flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.2em] text-[#111111]/60">
                  <span>{post.published ? 'Published' : 'Draft'}</span>
                  <span>#{post.id}</span>
                </div>
                <h2 className="mb-3 text-2xl font-semibold leading-tight text-[#111111]">{post.title}</h2>
                <p className="mb-4 line-clamp-4 text-sm leading-7 text-[#111111]/70">
                  {post.content}
                </p>
                <div className="mb-4 flex flex-wrap gap-2">
                  {(post.tags ?? []).map((tag) => (
                    <span
                      key={`${post.id}-${tag.id}`}
                      className="rounded-full border border-[#111111]/15 bg-[#111111] px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#f5f1ea]"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-[#111111]/10 pt-4 text-sm text-[#111111]/60">
                  <span>{post.slug ?? 'untitled-post'}</span>
                  <a href={`/posts/${post.id}`} className="font-medium text-[#111111] underline-offset-4 hover:underline">
                    Read more →
                  </a>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-[#111111]/20 bg-[#f5f1ea] p-10 text-[#111111]/70 md:col-span-3">
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
