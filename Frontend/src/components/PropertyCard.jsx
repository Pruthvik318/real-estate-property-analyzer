import { Link } from "react-router-dom";

function PropertyCard({ property, onSelect, isSelected, selectionEnabled }) {
  if (!property) return null;

  const handleSelect = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSelect) {
      onSelect(property.id);
    }
  };

  return (
    <div className="relative group h-full">
      {/* Improved Selection Checkbox */}
      {selectionEnabled && (
        <button
          onClick={handleSelect}
          type="button"
          className={`absolute top-4 left-4 z-30 w-10 h-10 rounded-2xl border-2 flex items-center justify-center cursor-pointer transition-all duration-300 active:scale-90 ${isSelected
            ? "bg-indigo-600 border-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.4)]"
            : "bg-slate-900/80 border-white/20 hover:border-indigo-500/50 hover:bg-slate-800 backdrop-blur-xl"
            }`}
        >
          {isSelected ? (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white/20 group-hover:text-white/50 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          )}
        </button>
      )}

      <Link to={`/properties/${property.id}`} className="block h-full">
        <div className={`bg-slate-800/50 border rounded-3xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 backdrop-blur-sm h-full flex flex-col ${isSelected ? "border-indigo-500 ring-4 ring-indigo-500/10" : "border-slate-700/50"
          }`}>
          {/* Image Container */}
          <div className="relative aspect-video overflow-hidden">
            <img
              src={`http://127.0.0.1:8000/${property.mainImage}`}
              alt={property.name}
              className="w-full h-full object-cover transition-transform duration-710 group-hover:scale-110"
            />
            <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
              <span className="px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white text-[10px] font-bold uppercase tracking-wider">
                {property.floorPlan ? "AI Analysis Ready" : "Inventory"}
              </span>
              {property.propertyType && (
                <span className="px-3 py-1 bg-indigo-500/40 backdrop-blur-md border border-indigo-500/30 rounded-full text-white text-[10px] font-bold uppercase tracking-wider">
                  {property.propertyType}
                </span>
              )}
            </div>

            {/* Dark Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-xl text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                {property.name}
              </h3>
            </div>

            <p className="text-slate-400 text-sm flex items-center mb-6">
              <svg className="w-4 h-4 mr-1.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {property.address}
            </p>

            <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
              <div className="flex items-baseline gap-1">
                <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Value</span>
                <span className="text-indigo-400 font-bold">
                  {property.valuation ? `$${Number(property.valuation).toLocaleString()}` : "Pending"}
                </span>
              </div>
              <div className="flex items-center text-xs font-bold text-slate-500 group-hover:text-indigo-400 transition-colors uppercase tracking-widest gap-2">
                Details
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default PropertyCard;
