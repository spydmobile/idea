import { Link } from 'react-router-dom';

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  const intervals = [
    [31536000, 'y'], [2592000, 'mo'], [86400, 'd'],
    [3600, 'h'], [60, 'm'],
  ];
  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count}${label} ago`;
  }
  return 'just now';
}

export default function IdeaCard({ idea, index = 0 }) {
  const title = idea.title.replace(/^\[IDEA\]\s*/i, '');
  const reactions = idea.reactions || {};
  const tags = (idea.labels || [])
    .filter(l => l.name !== 'idea')
    .slice(0, 3);
  const totalReactions = (reactions['+1'] || 0) + (reactions.heart || 0) + (reactions.rocket || 0);

  return (
    <Link
      to={`/ideas/${idea.number}`}
      className="group block animate-fade-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <article className="py-6 border-b border-rule-light">
        <div className="flex gap-5">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-xl font-semibold text-ink leading-snug group-hover:text-sienna transition-colors duration-200">
              {title}
            </h3>

            <div className="flex items-center gap-2 mt-2.5 text-sm text-ink-muted font-body">
              {idea.user && (
                <>
                  <img
                    src={idea.user.avatar_url}
                    alt={idea.user.login}
                    className="w-5 h-5 rounded-full ring-1 ring-rule"
                  />
                  <span className="font-medium text-ink-light">{idea.user.login}</span>
                  <span className="text-rule">|</span>
                </>
              )}
              <span className="italic">{timeAgo(idea.created_at)}</span>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {tags.map(tag => (
                  <span
                    key={tag.id}
                    className="text-xs font-body px-2.5 py-0.5 bg-parchment text-ink-muted rounded"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col items-end justify-between shrink-0 pt-1">
            {totalReactions > 0 && (
              <div className="flex items-center gap-1 text-sm text-ink-muted">
                <span className="text-sienna-light">{reactions['+1'] > 0 && reactions['+1']}</span>
                {reactions.heart > 0 && <span className="text-terracotta ml-1">{reactions.heart}</span>}
              </div>
            )}
            {idea.comments > 0 && (
              <span className="text-xs text-ink-muted italic mt-auto">
                {idea.comments} {idea.comments === 1 ? 'reply' : 'replies'}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
