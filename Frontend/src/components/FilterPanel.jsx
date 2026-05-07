function FilterPanel({ filterType, minPrice, maxPrice, onFilterChange }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center w-full">
      {/* Property Type Filter */}
      <div className="relative w-full md:w-48">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </div>
        <select
          name="type"
          value={filterType}
          onChange={(e) => onFilterChange("type", e.target.value)}
          className="w-full bg-slate-800/50 border border-slate-700/50 focus:border-indigo-500/50 rounded-2xl pl-12 pr-10 py-4 text-white appearance-none outline-none transition-all backdrop-blur-sm cursor-pointer text-sm"
        >
          <option value="">All Types</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
          <option value="office">Office</option>
        </select>
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Min Price Filter */}
      <div className="relative w-full md:w-40">
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => onFilterChange("minPrice", e.target.value)}
          className="w-full bg-slate-800/50 border border-slate-700/50 focus:border-indigo-500/50 rounded-2xl px-4 py-4 text-white placeholder-slate-600 outline-none transition-all backdrop-blur-sm text-sm"
        />
      </div>

      {/* Max Price Filter */}
      <div className="relative w-full md:w-40">
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => onFilterChange("maxPrice", e.target.value)}
          className="w-full bg-slate-800/50 border border-slate-700/50 focus:border-indigo-500/50 rounded-2xl px-4 py-4 text-white placeholder-slate-600 outline-none transition-all backdrop-blur-sm text-sm"
        />
      </div>
    </div>
  );
}

export default FilterPanel;
