function SearchBar({ query, onSearchChange }) {
  return (
    <div className="relative group w-full">
      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
        <svg
          className="w-5 h-5 text-slate-500 group-focus-within:text-indigo-500 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search by property name, address or style..."
        value={query}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full bg-slate-800/50 border border-slate-700/50 focus:border-indigo-500/50 rounded-2xl pl-14 pr-6 py-4 text-white placeholder-slate-600 outline-none transition-all backdrop-blur-sm focus:bg-slate-800/80 group-hover:border-slate-600/50"
      />
    </div>
  );
}

export default SearchBar;
