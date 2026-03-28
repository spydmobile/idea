import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './auth/useAuth';
import IdeaFeed from './components/IdeaFeed';
import IdeaDetail from './components/IdeaDetail';
import SubmitIdea from './components/SubmitIdea';
import LicenseNotice from './components/LicenseNotice';
import UserBadge from './components/UserBadge';

export default function App() {
  const auth = useAuth();

  return (
    <BrowserRouter basename="/idea">
      <div className="min-h-screen bg-cream text-ink">
        <header className="relative">
          <div className="max-w-2xl mx-auto px-6 pt-8 pb-6">
            <div className="flex items-end justify-between">
              <div>
                <a href="/idea/" className="group">
                  <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight leading-none">
                    Ideas
                    <span className="text-sienna ml-1 italic font-semibold">for the World</span>
                  </h1>
                </a>
                <p className="font-body text-sm text-ink-muted mt-2 tracking-wide">
                  Open source ideas, free to build on
                </p>
              </div>
              <div className="pb-1">
                {auth.loading && <span className="text-sm text-ink-muted italic">Signing in...</span>}
                {auth.error && <span className="text-sm text-sienna">{auth.error}</span>}
                {auth.user ? (
                  <UserBadge user={auth.user} onLogout={auth.logout} />
                ) : !auth.loading && (
                  <button
                    onClick={auth.login}
                    className="text-sm font-body text-ink-muted border-b border-ink-muted/30 hover:text-sienna hover:border-sienna/50 transition-colors pb-0.5"
                  >
                    Sign in with GitHub
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="editorial-rule mx-6" />
        </header>

        <main className="max-w-2xl mx-auto px-6 py-10">
          <Routes>
            <Route path="/" element={<IdeaFeed auth={auth} />} />
            <Route path="/ideas/:number" element={<IdeaDetail auth={auth} />} />
            <Route path="/submit" element={<SubmitIdea auth={auth} />} />
          </Routes>
        </main>

        <LicenseNotice />
      </div>
    </BrowserRouter>
  );
}
