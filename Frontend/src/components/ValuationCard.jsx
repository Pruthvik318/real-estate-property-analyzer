function ValuationCard({ valuation, reasoning }) {
  return (
    <div className="bg-slate-800/80 border border-indigo-500/30 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden group">
      {/* Glow Effect */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors duration-500"></div>

      <div className="relative z-10">
        <h3 className="text-slate-400 font-semibold uppercase tracking-[0.2em] text-xs mb-6">
          Estimated Valuation
        </h3>

        <div className="flex items-baseline gap-2 mb-8">
          <span className="text-4xl md:text-5xl font-black text-white">
            {valuation ? `$${valuation.toLocaleString()}` : "Calculating..."}
          </span>
          {valuation && <span className="text-emerald-400 font-bold text-sm">+2.4% market avg</span>}
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
            <p className="text-slate-300 text-sm leading-relaxed italic">
              " {reasoning || "Evaluation in progress. Our AI is crunching local market data and property unique features to provide the most accurate estimate."} "
            </p>
          </div>

          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium px-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Refined by AI Market Vision™
          </div>
        </div>
      </div>
    </div>
  );
}

export default ValuationCard;

