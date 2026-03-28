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
      <div className="text-center py-16 space-y-4 animate-fade-up">
        <p className="font-display text-2xl text-ink-muted/50 italic">Sign in to share your idea</p>
        <button onClick={auth.login} className="px-5 py-2.5 bg-ink text-cream font-body text-sm font-medium hover:bg-ink-light transition-colors">
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
    <div className="max-w-2xl mx-auto space-y-10 animate-fade-up">
      <header>
        <h1 className="font-display text-3xl font-bold text-ink tracking-tight">Submit an idea</h1>
        <p className="font-body text-sm text-ink-muted mt-2">Share something the world can build on.</p>
      </header>

      <div className="bg-sienna-wash border-l-2 border-sienna p-5 font-body text-sm text-ink-light leading-relaxed">
        <strong className="text-sienna">CC BY-SA 4.0 License Notice</strong>
        <p className="mt-1">
          By submitting, you release this idea under{' '}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/" className="underline text-sienna underline-offset-2" target="_blank" rel="noopener noreferrer">
            CC BY-SA 4.0
          </a>. Anyone may build on it. You cannot revoke this.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-body font-medium text-ink mb-1.5">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="w-full px-4 py-3 bg-white border border-rule text-ink font-body rounded-none focus:outline-none focus:border-sienna/50 transition-all"
            placeholder="A concise name for your idea"
          />
        </div>

        <div>
          <label className="block text-sm font-body font-medium text-ink mb-1.5">Summary</label>
          <textarea
            value={summary}
            onChange={e => setSummary(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-3 bg-white border border-rule text-ink font-body rounded-none focus:outline-none focus:border-sienna/50 resize-y transition-all"
            placeholder="One paragraph. What is the idea?"
          />
        </div>

        <div>
          <label className="block text-sm font-body font-medium text-ink mb-1.5">Problem it solves</label>
          <textarea
            value={problem}
            onChange={e => setProblem(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-white border border-rule text-ink font-body rounded-none focus:outline-none focus:border-sienna/50 resize-y transition-all"
            placeholder="What harm does this reduce or what good does it create?"
          />
        </div>

        <div>
          <label className="block text-sm font-body font-medium text-ink mb-1.5">Tags</label>
          {availableTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {availableTags.map(label => (
                <button
                  key={label.id}
                  type="button"
                  onClick={() => toggleTag(label.name)}
                  className={`text-xs font-body px-3 py-1 border transition-all duration-200 ${
                    selectedTags.includes(label.name)
                      ? 'bg-sienna text-white border-sienna'
                      : 'bg-transparent border-rule text-ink-muted hover:border-ink-muted/50'
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
            className="w-full px-4 py-3 bg-white border border-rule text-ink font-body rounded-none focus:outline-none focus:border-sienna/50 transition-all"
            placeholder="Additional tags, comma-separated"
          />
        </div>

        {error && <p className="text-sienna text-sm font-body">{error}</p>}

        <button
          type="submit"
          disabled={submitting || !title.trim() || !summary.trim()}
          className="px-6 py-3 bg-sienna text-white font-body text-sm font-medium hover:bg-sienna-dark disabled:opacity-40 transition-colors"
        >
          {submitting ? 'Submitting...' : 'Submit idea'}
        </button>
      </form>

      <div>
        <div className="editorial-rule mb-6" />
        <h2 className="text-xs font-body text-ink-muted italic uppercase tracking-widest mb-4">Preview</h2>
        <div className="bg-white border border-rule p-8">
          <h2 className="font-display text-xl font-bold text-ink mb-4">[IDEA] {title || '...'}</h2>
          <div className="prose-editorial font-body text-sm" dangerouslySetInnerHTML={{ __html: marked.parse(previewBody) }} />
        </div>
      </div>
    </div>
  );
}
