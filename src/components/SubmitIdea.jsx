import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { marked } from 'marked';
import { submitIdea, fetchLabels } from '../api/github';
import { CONFIG } from '../config';

export default function SubmitIdea({ auth }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [problem, setProblem] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLabels()
      .then(data => setAvailableTags(data.filter(l => l.name !== 'idea')))
      .catch(() => {});
  }, []);

  if (!auth.token) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-stone-600">You need to sign in to submit an idea.</p>
        <button onClick={auth.login} className="px-5 py-2.5 bg-stone-800 text-white rounded-lg font-medium hover:bg-stone-900 transition">
          Sign in with GitHub
        </button>
      </div>
    );
  }

  const allTags = [
    ...selectedTags,
    ...tagInput.split(',').map(t => t.trim()).filter(t => t && !selectedTags.includes(t)),
  ];

  const previewBody = `## Summary\n${summary || '*...*'}\n\n## Problem it solves\n${problem || '*...*'}\n\n## Tags\n${allTags.map(t => `\`${t}\``).join(', ') || '*none*'}\n\n---\n${CONFIG.licenseText}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const issue = await submitIdea({
        title,
        summary,
        problem,
        tags: allTags,
        token: auth.token,
      });
      navigate(`/ideas/${issue.number}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-stone-900">Submit an idea</h1>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
        <strong>CC BY-SA 4.0 License Notice:</strong> By submitting, you release this idea under{' '}
        <a href="https://creativecommons.org/licenses/by-sa/4.0/" className="underline" target="_blank" rel="noopener noreferrer">
          CC BY-SA 4.0
        </a>. Anyone may build on it. You cannot revoke this.
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-stone-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition"
            placeholder="A concise name for your idea"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Summary</label>
          <textarea
            value={summary}
            onChange={e => setSummary(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-3 border border-stone-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 resize-y transition"
            placeholder="One paragraph. What is the idea?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Problem it solves</label>
          <textarea
            value={problem}
            onChange={e => setProblem(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-stone-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 resize-y transition"
            placeholder="What harm does this reduce or what good does it create?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Tags</label>
          {availableTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {availableTags.map(label => (
                <button
                  key={label.id}
                  type="button"
                  onClick={() => toggleTag(label.name)}
                  className={`text-xs px-3 py-1 rounded-full border transition ${
                    selectedTags.includes(label.name)
                      ? 'bg-amber-100 border-amber-400 text-amber-800'
                      : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                  }`}
                >
                  {label.name}
                </button>
              ))}
            </div>
          )}
          <input
            type="text"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            className="w-full px-4 py-2.5 border border-stone-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition"
            placeholder="Additional tags, comma-separated"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting || !title.trim() || !summary.trim()}
          className="px-6 py-2.5 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50 transition"
        >
          {submitting ? 'Submitting...' : 'Submit idea'}
        </button>
      </form>

      <div className="border-t border-stone-200 pt-6">
        <h2 className="text-sm font-medium text-stone-500 mb-3">Preview</h2>
        <div className="bg-white border border-stone-200 rounded-lg p-6 prose prose-sm prose-stone max-w-none">
          <h2 className="text-xl font-bold">[IDEA] {title || '...'}</h2>
          <div dangerouslySetInnerHTML={{ __html: marked.parse(previewBody) }} />
        </div>
      </div>
    </div>
  );
}
