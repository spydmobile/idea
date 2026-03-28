import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchIdeas } from '../api/github';
import IdeaCard from './IdeaCard';
import SearchBar from './SearchBar';
import TagFilter from './TagFilter';

export default function IdeaFeed({ auth }) {
  const [ideas, setIdeas] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeTags, setActiveTags] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchIdeas({ page, search })
      .then(data => setIdeas(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [page, search]);

  const handleSearch = useCallback((q) => {
    setSearch(q);
    setPage(1);
  }, []);

  const toggleTag = useCallback((tag) => {
    setActiveTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  }, []);

  const filtered = activeTags.length > 0
    ? ideas.filter(idea => {
        const names = idea.labels.map(l => l.name);
        return activeTags.every(t => names.includes(t));
      })
    : ideas;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 w-full sm:max-w-sm">
          <SearchBar onSearch={handleSearch} />
        </div>
        {auth.token ? (
          <Link
            to="/submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-sienna text-white font-body text-sm font-medium hover:bg-sienna-dark transition-colors duration-200 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Submit an idea
          </Link>
        ) : (
          <button
            onClick={auth.login}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-cream font-body text-sm font-medium hover:bg-ink-light transition-colors duration-200"
          >
            Sign in to contribute
          </button>
        )}
      </div>

      <TagFilter activeTags={activeTags} onToggleTag={toggleTag} />

      {loading && (
        <div className="space-y-6 pt-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="py-6 border-b border-rule-light">
              <div className="h-6 w-3/4 loading-shimmer rounded" />
              <div className="h-4 w-1/3 loading-shimmer rounded mt-3" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-16 font-body">
          <p className="text-sienna italic">Failed to load ideas</p>
          <p className="text-sm text-ink-muted mt-1">{error}</p>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16 font-body">
          <p className="font-display text-2xl text-ink-muted/50 italic">No ideas yet</p>
          <p className="text-sm text-ink-muted mt-2">Be the first to plant a seed.</p>
        </div>
      )}

      <div>
        {filtered.map((idea, i) => (
          <IdeaCard key={idea.id} idea={idea} index={i} />
        ))}
      </div>

      {!loading && ideas.length > 0 && (
        <div className="flex justify-center items-center gap-6 pt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="text-sm font-body text-ink-muted hover:text-sienna disabled:opacity-20 disabled:hover:text-ink-muted transition-colors"
          >
            &larr; Previous
          </button>
          <span className="text-xs text-ink-muted/50 italic font-body">{page}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={ideas.length < 20}
            className="text-sm font-body text-ink-muted hover:text-sienna disabled:opacity-20 disabled:hover:text-ink-muted transition-colors"
          >
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
