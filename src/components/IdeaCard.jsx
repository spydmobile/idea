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

export default function IdeaCard({ idea }) {
  const title = idea.title.replace(/^\[IDEA\]\s*/i, '');
  const reactions = idea.reactions || {};
  const tags = (idea.labels || [])
    .filter(l => l.name !== 'idea')
    .slice(0, 3);

  return (
    <Link
      to={`/ideas/${idea.number}`}
      className="block bg-white border border-stone-200 rounded-xl p-6 hover:shadow-md hover:border-stone-300 transition-all duration-200"
    >
      <h3 className="text-lg font-semibold text-stone-900 leading-snug mb-2">
        {title}
      </h3>

      <div className="flex items-center gap-2 text-sm text-stone-500 mb-3">
        {idea.user && (
          <>
            <img
              src={idea.user.avatar_url}
              alt={idea.user.login}
              className="w-5 h-5 rounded-full"
            />
            <span>{idea.user.login}</span>
            <span className="text-stone-300">·</span>
          </>
        )}
        <span>{timeAgo(idea.created_at)}</span>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.map(tag => (
            <span
              key={tag.id}
              className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 text-sm text-stone-400">
        {reactions['+1'] > 0 && <span>👍 {reactions['+1']}</span>}
        {reactions.heart > 0 && <span>❤️ {reactions.heart}</span>}
        {reactions.rocket > 0 && <span>🚀 {reactions.rocket}</span>}
        {idea.comments > 0 && (
          <span className="ml-auto">💬 {idea.comments}</span>
        )}
      </div>
    </Link>
  );
}
