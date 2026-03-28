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
      <div className="min-h-screen bg-stone-50 text-stone-900">
        <header className="border-b border-stone-200 bg-white">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <a href="/idea/" className="text-lg font-bold text-stone-900 hover:text-amber-700 transition">
                Ideas for the World
              </a>
              <p className="text-xs text-stone-400 mt-0.5">Open source ideas, free to build on</p>
            </div>
            <div>
              {auth.loading && <span className="text-sm text-stone-400">Signing in...</span>}
              {auth.error && <span className="text-sm text-red-500">{auth.error}</span>}
              {auth.user ? (
                <UserBadge user={auth.user} onLogout={auth.logout} />
              ) : !auth.loading && (
                <button
                  onClick={auth.login}
                  className="text-sm px-4 py-2 border border-stone-200 rounded-lg hover:bg-stone-50 transition"
                >
                  Sign in
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-8">
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
