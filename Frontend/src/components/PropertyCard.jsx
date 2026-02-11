import { Link } from "react-router-dom";

function PropertyCard({ property }) {
  if (!property) return null;

  return (
    <Link to={`/properties/${property.id}`} className="block group">
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 backdrop-blur-sm h-full flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={`http://127.0.0.1:8000/${property.mainImage}`}
            alt={property.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white text-[10px] font-bold uppercase tracking-wider">
              {property.floorPlan ? "Analysis Ready" : "Market View"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="font-bold text-xl text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
            {property.name}
          </h3>
          <p className="text-slate-400 text-sm mt-2 flex items-center mb-4">
            <svg className="w-4 h-4 mr-1.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {property.address}
          </p>

          <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">View Details</span>
            <svg className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PropertyCard;

