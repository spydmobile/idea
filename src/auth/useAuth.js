import { useState, useEffect, useCallback } from 'react';
import { CONFIG } from '../config';

const TOKEN_KEY = 'gh_access_token';
const USER_KEY = 'gh_user';

export function useAuth() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const u = sessionStorage.getItem(USER_KEY);
    return u ? JSON.parse(u) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (!code || token) return;

    setLoading(true);
    window.history.replaceState({}, '', window.location.pathname);

    fetch(CONFIG.oauthProxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
      .then(r => r.json())
      .then(async data => {
        if (!data.access_token) throw new Error(data.error || 'OAuth failed');
        sessionStorage.setItem(TOKEN_KEY, data.access_token);
        setToken(data.access_token);

        const userRes = await fetch('https://api.github.com/user', {
          headers: { Authorization: `Bearer ${data.access_token}` },
        });
        const userData = await userRes.json();
        sessionStorage.setItem(USER_KEY, JSON.stringify(userData));
        setUser(userData);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(() => {
    const url = `https://github.com/login/oauth/authorize?client_id=${CONFIG.clientId}&scope=public_repo`;
    window.location.href = url;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return { token, user, login, logout, loading, error };
}
