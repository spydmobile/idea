import { useState } from 'react';
import { addReaction } from '../api/github';

const REACTIONS = [
  { content: '+1', emoji: '👍' },
  { content: 'heart', emoji: '❤️' },
  { content: 'rocket', emoji: '🚀' },
  { content: 'eyes', emoji: '👀' },
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
    <div className="flex gap-2">
      {REACTIONS.map(({ content, emoji }) => (
        <button
          key={content}
          onClick={() => handleVote(content)}
          disabled={!token || voted[content]}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-lg transition ${
            voted[content]
              ? 'bg-amber-50 border-amber-300 text-amber-700'
              : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
          } disabled:opacity-50`}
        >
          <span>{emoji}</span>
          <span>{counts[content]}</span>
        </button>
      ))}
    </div>
  );
}
