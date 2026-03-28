export default function UserBadge({ user, onLogout }) {
  return (
    <div className="flex items-center gap-2.5">
      <img src={user.avatar_url} alt={user.login} className="w-7 h-7 rounded-full ring-2 ring-parchment" />
      <span className="text-sm font-body font-medium text-ink-light hidden sm:inline">{user.login}</span>
      <button
        onClick={onLogout}
        className="text-xs font-body text-ink-muted/50 border-b border-transparent hover:border-ink-muted/30 hover:text-ink-muted transition-colors ml-0.5"
      >
        sign out
      </button>
    </div>
  );
}
