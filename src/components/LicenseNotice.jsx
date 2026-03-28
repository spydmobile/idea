import { CONFIG } from '../config';

export default function LicenseNotice() {
  return (
    <footer className="border-t border-stone-200 mt-12 py-6 text-center text-xs text-stone-400 space-y-1">
      <p>
        All ideas on this platform are released under{' '}
        <a href="https://creativecommons.org/licenses/by-sa/4.0/" className="underline hover:text-stone-600" target="_blank" rel="noopener noreferrer">
          CC BY-SA 4.0
        </a>.
      </p>
      <p>
        App source:{' '}
        <a href={`https://github.com/${CONFIG.owner}/${CONFIG.repo}`} className="underline hover:text-stone-600" target="_blank" rel="noopener noreferrer">
          AGPL v3
        </a>.{' '}
        <a href={`https://github.com/${CONFIG.owner}/${CONFIG.repo}/fork`} className="underline hover:text-stone-600" target="_blank" rel="noopener noreferrer">
          Fork this platform
        </a>.
      </p>
    </footer>
  );
}
