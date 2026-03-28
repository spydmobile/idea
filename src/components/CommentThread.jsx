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
    <div className="space-y-6">
      <h3 className="font-display text-xl font-semibold text-ink">
        Conversation
        {comments.length > 0 && (
          <span className="text-ink-muted font-body text-sm font-normal italic ml-2">
            ({comments.length})
          </span>
        )}
      </h3>

      {comments.length === 0 && (
        <p className="text-ink-muted text-sm italic font-body">No comments yet. Start the conversation.</p>
      )}

      <div className="space-y-1">
        {comments.map((c, i) => (
          <div
            key={c.id}
            className="py-5 animate-fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center gap-2.5 text-sm font-body text-ink-muted mb-3">
              <img src={c.user.avatar_url} alt={c.user.login} className="w-6 h-6 rounded-full ring-1 ring-rule" />
              <span className="font-medium text-ink-light">{c.user.login}</span>
              <span className="text-rule">|</span>
              <span className="italic">{timeAgo(c.created_at)}</span>
            </div>
            <div
              className="prose-editorial font-body text-sm pl-8"
              dangerouslySetInnerHTML={{ __html: marked.parse(c.body) }}
            />
            {i < comments.length - 1 && <div className="editorial-rule mt-5" />}
          </div>
        ))}
      </div>

      {token && (
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Add to the conversation..."
            rows={3}
            className="w-full px-4 py-3 bg-parchment/40 border border-rule text-ink font-body text-sm placeholder-ink-muted/40 rounded-none focus:outline-none focus:border-sienna/50 focus:bg-white resize-y transition-all"
          />
          <button
            type="submit"
            disabled={submitting || !body.trim()}
            className="px-5 py-2 bg-sienna text-white font-body text-sm font-medium hover:bg-sienna-dark disabled:opacity-40 transition-colors"
          >
            {submitting ? 'Posting...' : 'Post comment'}
          </button>
        </form>
      )}
    </div>
  );
}
