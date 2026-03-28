import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { marked } from 'marked';
import { fetchIdea } from '../api/github';
import { CONFIG } from '../config';
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

  // Inject link[rel=alternate] pointing to raw GitHub API JSON
  useEffect(() => {
    if (!issue) return;
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.type = 'application/json';
    link.href = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/issues/${issue.number}`;
    link.title = issue.title;
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, [issue]);

  // Inject Open Graph + canonical meta tags for crawlers and AI agents
  useEffect(() => {
    if (!issue) return;
    const cleanTitle = issue.title.replace(/^\[IDEA\]\s*/i, '');
    const description = (issue.body || '').replace(/^##\s*Summary\s*\n*/i, '').slice(0, 200).trim();
    const url = `https://web.spyd.com/idea/ideas/${issue.number}`;

    const tags = [
      { property: 'og:title', content: cleanTitle },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:type', content: 'article' },
    ];
    const elements = tags.map(({ property, content }) => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', property);
      meta.content = content;
      document.head.appendChild(meta);
      return meta;
    });

    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = url;
    document.head.appendChild(canonical);
    elements.push(canonical);

    return () => elements.forEach(el => document.head.removeChild(el));
  }, [issue]);

  if (loading) {
    return (
      <div className="space-y-6 pt-4">
        <div className="h-4 w-24 loading-shimmer rounded" />
        <div className="h-8 w-3/4 loading-shimmer rounded" />
        <div className="h-4 w-1/3 loading-shimmer rounded" />
        <div className="h-32 w-full loading-shimmer rounded mt-6" />
      </div>
    );
  }
  if (error) return <div className="text-center py-16 text-sienna italic font-body">{error}</div>;
  if (!issue) return null;

  const title = issue.title.replace(/^\[IDEA\]\s*/i, '');
  const tags = (issue.labels || []).filter(l => l.name !== 'idea');

  return (
    <div className="space-y-10 animate-fade-up">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-body text-ink-muted hover:text-sienna transition-colors group">
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back to ideas
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink leading-tight tracking-tight">
            {title}
          </h1>

          <div className="flex items-center gap-3 mt-4 text-sm font-body text-ink-muted">
            {issue.user && (
              <>
                <img src={issue.user.avatar_url} alt={issue.user.login} className="w-7 h-7 rounded-full ring-2 ring-parchment" />
                <span className="font-medium text-ink-light">{issue.user.login}</span>
                <span className="text-rule">|</span>
              </>
            )}
            <time className="italic">
              {new Date(issue.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map(tag => (
                <span key={tag.id} className="text-xs font-body px-2.5 py-0.5 bg-parchment text-ink-muted">
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="editorial-rule mb-8" />

        <div
          className="prose-editorial font-body text-base leading-relaxed"
          dangerouslySetInnerHTML={{ __html: marked.parse(issue.body || '') }}
        />

        <div className="editorial-rule my-8" />

        <VoteButton
          issueNumber={issue.number}
          reactions={issue.reactions}
          token={auth.token}
        />
      </article>

      <div className="editorial-rule" />

      <CommentThread
        comments={comments}
        issueNumber={issue.number}
        token={auth.token}
        onNewComment={(c) => setComments(prev => [...prev, c])}
      />

      <div className="editorial-rule" />
      <p className="text-xs font-body text-ink-muted/60 italic text-center py-2">
        This idea is released under{' '}
        <a href="https://creativecommons.org/licenses/by-sa/4.0/" className="underline decoration-rule underline-offset-2 hover:text-sienna transition-colors" target="_blank" rel="noopener noreferrer">
          CC BY-SA 4.0
        </a>
        . You are free to build on it — attribution required, derivatives must use the same license.
      </p>
    </div>
  );
}
