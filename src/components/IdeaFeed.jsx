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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex-1 w-full sm:max-w-md">
          <SearchBar onSearch={handleSearch} />
        </div>
        {auth.token ? (
          <Link
            to="/submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition shrink-0"
          >
            + Submit an idea
          </Link>
        ) : (
          <button
            onClick={auth.login}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-800 text-white rounded-lg font-medium hover:bg-stone-900 transition shrink-0"
          >
            Sign in to contribute
          </button>
        )}
      </div>

      <TagFilter activeTags={activeTags} onToggleTag={toggleTag} />

      {loading && (
        <div className="text-center py-12 text-stone-400">Loading ideas...</div>
      )}

      {error && (
        <div className="text-center py-12 text-red-500">
          Failed to load ideas: {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-12 text-stone-400">
          No ideas found. Be the first to submit one!
        </div>
      )}

      <div className="grid gap-4">
        {filtered.map(idea => (
          <IdeaCard key={idea.id} idea={idea} />
        ))}
      </div>

      {!loading && ideas.length > 0 && (
        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm border border-stone-200 rounded-lg disabled:opacity-30 hover:bg-stone-50 transition"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-stone-500">Page {page}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={ideas.length < 20}
            className="px-4 py-2 text-sm border border-stone-200 rounded-lg disabled:opacity-30 hover:bg-stone-50 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
