function ImageUploader({ mainImage, floorPlan, setMainImage, setFloorPlan }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block mb-2 text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Main Property Image <span className="text-red-500">*</span>
        </label>
        <div className="relative group">
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setMainImage(e.target.files[0])}
            className="w-full bg-slate-800/50 border border-slate-700/50 focus:border-indigo-500/50 rounded-2xl px-4 py-3 text-white file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer outline-none transition-all backdrop-blur-sm"
          />
          {mainImage && (
            <p className="mt-2 text-indigo-400 text-xs font-medium">
              ✅ {mainImage.name} selected
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Floor Plan (Optional)
        </label>
        <div className="relative group">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFloorPlan(e.target.files[0])}
            className="w-full bg-slate-800/50 border border-slate-700/50 focus:border-indigo-500/50 rounded-2xl px-4 py-3 text-white file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-slate-700 file:text-white hover:file:bg-slate-600 cursor-pointer outline-none transition-all backdrop-blur-sm"
          />
          {floorPlan && (
            <p className="mt-2 text-indigo-400 text-xs font-medium">
              ✅ {floorPlan.name} selected
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageUploader;

