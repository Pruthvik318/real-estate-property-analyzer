import { useEffect, useState } from "react";
import PropertyList from "../components/PropertyList";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import Navbar from "../components/Navbar";
import { useNavigate, Link } from "react-router-dom";

function Dashboard() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const navigate = useNavigate();

  const handleSelect = (id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      if (prev.length >= 2) {
        alert("You can only select up to 2 properties for comparison.");
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleCompare = () => {
    if (selectedIds.length === 2) {
      navigate(`/compare?id1=${selectedIds[0]}&id2=${selectedIds[1]}`);
    }
  };

  const handleFilterChange = (name, value) => {
    if (name === "type") setFilterType(value);
    if (name === "minPrice") setMinPrice(value);
    if (name === "maxPrice") setMaxPrice(value);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterType("");
    setMinPrice("");
    setMaxPrice("");
  };

  useEffect(() => {
    const fetchFilteredProperties = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchQuery) params.append("query", searchQuery);
        if (filterType) params.append("type", filterType);
        if (minPrice !== "") params.append("minPrice", minPrice);
        if (maxPrice !== "") params.append("maxPrice", maxPrice);

        const response = await fetch(`http://127.0.0.1:8000/api/search?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to search properties");
        }
        const data = await response.json();
        setProperties(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchFilteredProperties();
    }, 400);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, filterType, minPrice, maxPrice]);

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Property Dashboard
            </h1>
            <p className="mt-2 text-slate-400">
              Manage and analyze your real estate portfolio with AI.
            </p>
          </div>

          <Link
            to="/properties/new"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95 group"
          >
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New Property
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-6 mb-10">
          <SearchBar
            query={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <FilterPanel
            filterType={filterType}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            <p className="mt-4 text-slate-400">Loading your properties...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center backdrop-blur-sm">
            <p className="text-red-400 font-medium mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-bold flex items-center gap-2">
                Recently Added
                <span className="px-2 py-0.5 bg-slate-800 rounded text-xs text-slate-400 font-normal">
                  {properties.length}
                </span>
              </h2>
            </div>
            {properties.length === 0 && (searchQuery || filterType || minPrice || maxPrice) ? (
              <div className="text-center py-20 bg-slate-800/20 rounded-3xl border border-slate-700/50 border-dashed animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                  <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-slate-400 font-medium mb-6 text-lg">No properties match your search criteria.</p>
                <button
                  onClick={clearFilters}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <PropertyList
                properties={properties}
                onSelect={handleSelect}
                selectedIds={selectedIds}
                selectionEnabled={true}
              />
            )}
          </div>
        )}
      </main>

      {/* Floating Selection Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-slate-800/90 backdrop-blur-xl border border-white/10 rounded-3xl px-6 py-4 shadow-2xl flex items-center gap-8 min-w-[320px]">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {selectedIds.map(id => (
                  <div key={id} className="w-10 h-10 rounded-full border-2 border-slate-800 bg-indigo-500 flex items-center justify-center text-[10px] font-bold">
                    {properties.find(p => p.id === id)?.name.slice(0, 1) || "P"}
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium text-slate-300">
                {selectedIds.length} propert{selectedIds.length > 1 ? "ies" : "y"} selected
              </span>
            </div>

            <div className="h-8 w-[1px] bg-white/10"></div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedIds([])}
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                Clear
              </button>
              <button
                onClick={handleCompare}
                disabled={selectedIds.length < 2}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${selectedIds.length === 2
                  ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 active:scale-95"
                  : "bg-slate-700 text-slate-500 cursor-not-allowed"
                  }`}
              >
                Compare Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

