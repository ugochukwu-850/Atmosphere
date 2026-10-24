import { SectionTitle } from "@/components/detail/Sections";
import { getFeed } from "@/lib/data/people";
import type { FeedPost } from "@/lib/data/types";
import { formatDate } from "@/lib/format";
import { PLATFORM_LABEL, type SocialPlatform } from "@/lib/validators/account";

const GRID = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";

/** "Latest on Instagram": the feed the person chose to show. Hidden when empty. */
export async function LatestPosts({
  personId,
  platform,
}: {
  personId: string;
  platform: SocialPlatform;
}) {
  const posts = await getFeed(personId, platform);
  if (posts.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <SectionTitle>Latest on {PLATFORM_LABEL[platform]}</SectionTitle>
      <ul className={GRID}>
        {posts.map((post) => (
          <li key={post.id}>
            <PostCard post={post} platform={PLATFORM_LABEL[platform]} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Same card fill, border and radii as the catalog cards. */
function PostCard({ post, platform }: { post: FeedPost; platform: string }) {
  const body = (
    <>
      {post.imageUrl && (
        <div className="aspect-square overflow-hidden rounded-lg bg-muted">
          {/* Feed images come from social CDNs that next/image isn't configured for. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.imageUrl}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            className="size-full object-cover"
          />
        </div>
      )}
      {post.caption && (
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {post.caption}
        </p>
      )}
      {post.postedAt && (
        <p className="text-xs text-subtle-foreground">
          {formatDate(post.postedAt)}
        </p>
      )}
    </>
  );
  const card =
    "flex h-full flex-col gap-3 rounded-xl border bg-card p-3 text-card-foreground";

  return post.url ? (
    <a
      href={post.url}
      target="_blank"
      rel="noreferrer"
      className={`${card} transition-colors hover:border-primary/40`}
    >
      {body}
      <span className="sr-only">Open this post on {platform}</span>
    </a>
  ) : (
    <div className={card}>{body}</div>
  );
}

export function LatestPostsSkeleton() {
  return (
    <div className={GRID} aria-hidden>
      {Array.from({ length: 3 }, (_, i) => (
        <div
          key={i}
          className="aspect-square animate-pulse rounded-xl bg-muted"
        />
      ))}
    </div>
  );
}
