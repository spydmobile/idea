import { useState, useEffect } from 'react';
import { fetchLabels } from '../api/github';

export default function TagFilter({ activeTags, onToggleTag }) {
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    fetchLabels()
      .then(data => setLabels(data.filter(l => l.name !== 'idea')))
      .catch(() => {});
  }, []);

  if (labels.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {labels.map(label => {
        const active = activeTags.includes(label.name);
        return (
          <button
            key={label.id}
            onClick={() => onToggleTag(label.name)}
            className={`text-xs px-3 py-1 rounded-full border transition ${
              active
                ? 'bg-amber-100 border-amber-400 text-amber-800'
                : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
            }`}
          >
            {label.name}
          </button>
        );
      })}
    </div>
  );
}
