import { useState, useEffect, useRef } from 'react';

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSearch(value.trim());
    }, 300);
    return () => clearTimeout(timerRef.current);
  }, [value, onSearch]);

  return (
    <div className="relative">
      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Search ideas..."
        className="w-full pl-10 pr-4 py-2.5 bg-parchment/60 border border-rule text-ink font-body text-sm placeholder-ink-muted/50 rounded-none focus:outline-none focus:border-sienna/50 focus:bg-white transition-all"
      />
    </div>
  );
}
