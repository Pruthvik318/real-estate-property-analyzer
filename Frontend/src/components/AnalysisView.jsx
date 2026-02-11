function AnalysisView({ analysis }) {
  if (!analysis) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm text-center">
        <p className="text-slate-400 italic">No analysis data available for this property yet.</p>
      </div>
    );
  }

  const items = [
    { label: "Rooms", value: analysis.room_count, icon: "🏠" },
    { label: "Condition", value: analysis.condition, icon: "✨" },
    { label: "Style", value: analysis.style, icon: "🎨" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 backdrop-blur-sm hover:border-indigo-500/50 transition-colors group">
            <span className="text-2xl mb-3 block group-hover:scale-110 transition-transform">{item.icon}</span>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{item.label}</p>
            <p className="text-xl font-bold mt-1">{item.value || "N/A"}</p>
          </div>
        ))}
      </div>

      {analysis.features && analysis.features.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-4">Key Features</p>
          <div className="flex flex-wrap gap-2">
            {analysis.features.map((feature, idx) => (
              <span
                key={idx}
                className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-300 text-sm font-medium"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalysisView;

