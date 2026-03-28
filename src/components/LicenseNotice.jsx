import { CONFIG } from '../config';

export default function LicenseNotice() {
  return (
    <footer className="mt-16 mb-8">
      <div className="editorial-rule mx-6" />
      <div className="max-w-2xl mx-auto px-6 py-8 text-center font-body text-xs text-ink-muted/60 space-y-1.5 leading-relaxed">
        <p>
          All ideas on this platform are released under{' '}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/" className="underline decoration-rule underline-offset-2 hover:text-sienna transition-colors" target="_blank" rel="noopener noreferrer">
            CC BY-SA 4.0
          </a>.
        </p>
        <p>
          App source:{' '}
          <a href={`https://github.com/${CONFIG.owner}/${CONFIG.repo}`} className="underline decoration-rule underline-offset-2 hover:text-sienna transition-colors" target="_blank" rel="noopener noreferrer">
            AGPL v3
          </a>
          {' · '}
          <a href={`https://github.com/${CONFIG.owner}/${CONFIG.repo}/fork`} className="underline decoration-rule underline-offset-2 hover:text-sienna transition-colors" target="_blank" rel="noopener noreferrer">
            Fork this platform
          </a>
        </p>
      </div>
    </footer>
  );
}
