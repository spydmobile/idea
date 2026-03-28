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
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-xs text-ink-muted italic mr-1 font-body">Filter:</span>
      {labels.map(label => {
        const active = activeTags.includes(label.name);
        return (
          <button
            key={label.id}
            onClick={() => onToggleTag(label.name)}
            className={`text-xs font-body px-3 py-1 border transition-all duration-200 ${
              active
                ? 'bg-sienna text-white border-sienna'
                : 'bg-transparent border-rule text-ink-muted hover:border-ink-muted/50 hover:text-ink-light'
            }`}
          >
            {label.name}
          </button>
        );
      })}
    </div>
  );
}
