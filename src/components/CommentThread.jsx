import { useState } from 'react';
import { marked } from 'marked';
import { postComment } from '../api/github';

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

export default function CommentThread({ comments, issueNumber, token, onNewComment }) {
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!body.trim() || !token) return;
    setSubmitting(true);
    try {
      const comment = await postComment({ issueNumber, body, token });
      onNewComment(comment);
      setBody('');
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-stone-800">
        Comments ({comments.length})
      </h3>

      {comments.length === 0 && (
        <p className="text-stone-400 text-sm">No comments yet. Start the conversation.</p>
      )}

      <div className="space-y-3">
        {comments.map(c => (
          <div key={c.id} className="border border-stone-200 rounded-lg p-4 bg-white">
            <div className="flex items-center gap-2 text-sm text-stone-500 mb-2">
              <img src={c.user.avatar_url} alt={c.user.login} className="w-5 h-5 rounded-full" />
              <span className="font-medium text-stone-700">{c.user.login}</span>
              <span className="text-stone-300">·</span>
              <span>{timeAgo(c.created_at)}</span>
            </div>
            <div
              className="prose prose-sm prose-stone max-w-none"
              dangerouslySetInnerHTML={{ __html: marked.parse(c.body) }}
            />
          </div>
        ))}
      </div>

      {token && (
        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            className="w-full px-4 py-3 border border-stone-200 rounded-lg bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 resize-y transition"
          />
          <button
            type="submit"
            disabled={submitting || !body.trim()}
            className="px-5 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50 transition"
          >
            {submitting ? 'Posting...' : 'Post comment'}
          </button>
        </form>
      )}
    </div>
  );
}
