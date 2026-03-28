import { useState } from 'react';
import { addReaction } from '../api/github';

const REACTIONS = [
  { content: '+1', emoji: '👍', label: 'Support' },
  { content: 'heart', emoji: '❤️', label: 'Love' },
  { content: 'rocket', emoji: '🚀', label: 'Launch it' },
  { content: 'eyes', emoji: '👀', label: 'Watching' },
];

export default function VoteButton({ issueNumber, reactions = {}, token }) {
  const [counts, setCounts] = useState(() => {
    const c = {};
    for (const r of REACTIONS) c[r.content] = reactions[r.content] || 0;
    return c;
  });
  const [voted, setVoted] = useState({});

  const handleVote = async (content) => {
    if (!token) return;
    setCounts(prev => ({ ...prev, [content]: prev[content] + 1 }));
    setVoted(prev => ({ ...prev, [content]: true }));
    try {
      await addReaction({ issueNumber, content, token });
    } catch {
      setCounts(prev => ({ ...prev, [content]: prev[content] - 1 }));
      setVoted(prev => ({ ...prev, [content]: false }));
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {REACTIONS.map(({ content, emoji, label }) => (
        <button
          key={content}
          onClick={() => handleVote(content)}
          disabled={!token || voted[content]}
          title={label}
          className={`group inline-flex items-center gap-2 px-4 py-2 text-sm font-body border transition-all duration-200 ${
            voted[content]
              ? 'bg-sienna-wash border-sienna-light text-sienna'
              : 'bg-cream border-rule text-ink-muted hover:border-sienna-light hover:text-sienna'
          } disabled:cursor-default`}
        >
          <span className="text-base">{emoji}</span>
          <span className="font-medium tabular-nums">{counts[content]}</span>
        </button>
      ))}
    </div>
  );
}
