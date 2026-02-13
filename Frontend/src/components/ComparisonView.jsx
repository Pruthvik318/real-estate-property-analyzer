import { API_URL } from "../config";

function ComparisonView({ properties, verdict }) {
    if (!properties || properties.length !== 2) return null;

    const [prop1, prop2] = properties;

    const MetricRow = ({ label, value1, value2, isPrice }) => (
        <div className="grid grid-cols-5 gap-4 py-6 border-b border-white/5 hover:bg-white/[0.02] transition-colors px-4 group">
            <div className="col-span-1 text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center">
                {label}
            </div>
            <div className="col-span-2 text-white font-medium text-lg flex items-center">
                {isPrice ? (value1 ? `$${Number(value1).toLocaleString()}` : "N/A") : (value1 || "N/A")}
            </div>
            <div className="col-span-2 text-white font-medium text-lg flex items-center">
                {isPrice ? (value2 ? `$${Number(value2).toLocaleString()}` : "N/A") : (value2 || "N/A")}
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-3xl overflow-hidden backdrop-blur-md">
                {/* Header with Images */}
                <div className="grid grid-cols-5 gap-4 border-b border-slate-700/50 bg-slate-800/50">
                    <div className="col-span-1 flex items-center justify-center p-4 border-r border-white/5">
                        <div className="w-12 h-12 rounded-full bg-slate-900 border border-indigo-500/30 flex items-center justify-center font-black text-indigo-500 text-xl">VS</div>
                    </div>
                    <div className="col-span-2 p-6 border-r border-white/5">
                        <div className="aspect-video rounded-2xl overflow-hidden mb-4 border border-white/10 shadow-lg">
                            <img
                                src={`${API_URL}/${prop1.mainImage}`}
                                alt={prop1.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h3 className="text-xl font-bold line-clamp-1 text-white">{prop1.name}</h3>
                        <p className="text-sm text-slate-400 line-clamp-1">{prop1.address}</p>
                    </div>
                    <div className="col-span-2 p-6">
                        <div className="aspect-video rounded-2xl overflow-hidden mb-4 border border-white/10 shadow-lg">
                            <img
                                src={`${API_URL}/${prop2.mainImage}`}
                                alt={prop2.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h3 className="text-xl font-bold line-clamp-1 text-white">{prop2.name}</h3>
                        <p className="text-sm text-slate-400 line-clamp-1">{prop2.address}</p>
                    </div>
                </div>

                {/* Metrics Section */}
                <div className="flex flex-col">
                    <MetricRow
                        label="Estimated Value"
                        value1={prop1.valuation}
                        value2={prop2.valuation}
                        isPrice={true}
                    />
                    <MetricRow
                        label="Style"
                        value1={prop1.analysis?.style}
                        value2={prop2.analysis?.style}
                    />
                    <MetricRow
                        label="Condition"
                        value1={prop1.analysis?.condition}
                        value2={prop2.analysis?.condition}
                    />
                    <MetricRow
                        label="Room Count"
                        value1={prop1.analysis?.room_count}
                        value2={prop2.analysis?.room_count}
                    />

                    {/* Features Comparison */}
                    <div className="grid grid-cols-5 gap-4 py-8 px-4 border-b border-white/5">
                        <div className="col-span-1 text-slate-500 text-xs font-bold uppercase tracking-widest">
                            Key Features
                        </div>
                        <div className="col-span-2 pr-4">
                            <div className="flex flex-wrap gap-2">
                                {prop1.analysis?.features?.map((f, i) => (
                                    <span key={i} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-300 text-xs">
                                        {f}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="col-span-2 pl-4">
                            <div className="flex flex-wrap gap-2">
                                {prop2.analysis?.features?.map((f, i) => (
                                    <span key={i} className="px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-lg text-violet-300 text-xs">
                                        {f}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* AI Reasoning Preview */}
                    <div className="grid grid-cols-5 gap-4 py-8 bg-slate-800/10 px-4">
                        <div className="col-span-1 text-slate-500 text-xs font-bold uppercase tracking-widest">
                            AI Context
                        </div>
                        <div className="col-span-2 pr-4">
                            <p className="text-slate-400 text-xs leading-relaxed italic border-l-2 border-indigo-500/30 pl-3">
                                {prop1.valuation_reasoning || "Valuation reasoning not available."}
                            </p>
                        </div>
                        <div className="col-span-2 pl-4">
                            <p className="text-slate-400 text-xs leading-relaxed italic border-l-2 border-violet-500/30 pl-3">
                                {prop2.valuation_reasoning || "Valuation reasoning not available."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Verdict - Now at the Bottom */}
            {verdict && (
                <div className="bg-gradient-to-r from-indigo-900/40 to-slate-800/40 border border-indigo-500/30 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden group animate-in fade-in slide-in-from-top-4 duration-1000">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="w-24 h-24 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" />
                        </svg>
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
                                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-indigo-400 font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-2">
                                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                                    Final AI Investment Verdict
                                </h3>
                                <p className="text-slate-400 text-xs mt-1">Based on location, valuation, and architectural analysis.</p>
                            </div>
                        </div>
                        <p className="text-xl md:text-2xl font-semibold text-white leading-relaxed italic">
                            "{verdict}"
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ComparisonView;
