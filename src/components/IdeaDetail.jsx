import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { marked } from 'marked';
import { fetchIdea } from '../api/github';
import VoteButton from './VoteButton';
import CommentThread from './CommentThread';

export default function IdeaDetail({ auth }) {
  const { number } = useParams();
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchIdea(number)
      .then(({ issue, comments }) => {
        setIssue(issue);
        setComments(comments);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [number]);

  if (loading) return <div className="text-center py-12 text-stone-400">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
  if (!issue) return null;

  const title = issue.title.replace(/^\[IDEA\]\s*/i, '');
  const tags = (issue.labels || []).filter(l => l.name !== 'idea');

  return (
    <div className="space-y-8">
      <Link to="/" className="text-sm text-amber-700 hover:text-amber-800 transition">
        &larr; Back to ideas
      </Link>

      <article className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
          {title}
        </h1>

        <div className="flex items-center gap-2 text-sm text-stone-500">
          {issue.user && (
            <>
              <img src={issue.user.avatar_url} alt={issue.user.login} className="w-6 h-6 rounded-full" />
              <span className="font-medium text-stone-700">{issue.user.login}</span>
              <span className="text-stone-300">·</span>
            </>
          )}
          <span>{new Date(issue.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map(tag => (
              <span key={tag.id} className="text-xs px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600">
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <div
          className="prose prose-stone max-w-none"
          dangerouslySetInnerHTML={{ __html: marked.parse(issue.body || '') }}
        />

        <VoteButton
          issueNumber={issue.number}
          reactions={issue.reactions}
          token={auth.token}
        />
      </article>

      <CommentThread
        comments={comments}
        issueNumber={issue.number}
        token={auth.token}
        onNewComment={(c) => setComments(prev => [...prev, c])}
      />

      <div className="text-xs text-stone-400 border-t border-stone-100 pt-4">
        This idea is released under <a href="https://creativecommons.org/licenses/by-sa/4.0/" className="underline" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a>. You are free to build on it — attribution required, derivatives must use the same license.
      </div>
    </div>
  );
}
