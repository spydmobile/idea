export default function UserBadge({ user, onLogout }) {
  return (
    <div className="flex items-center gap-2">
      <img src={user.avatar_url} alt={user.login} className="w-7 h-7 rounded-full" />
      <span className="text-sm font-medium text-stone-700 hidden sm:inline">{user.login}</span>
      <button
        onClick={onLogout}
        className="text-xs text-stone-400 hover:text-stone-600 transition ml-1"
      >
        Sign out
      </button>
    </div>
  );
}
