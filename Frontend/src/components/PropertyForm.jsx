function PropertyForm({ name, address, propertyType, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block mb-2 text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Property Name
        </label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={onChange}
          required
          placeholder="e.g. Modern Glass Villa"
          className="w-full bg-slate-800/50 border border-slate-700/50 focus:border-indigo-500/50 rounded-2xl px-4 py-3 text-white placeholder-slate-600 outline-none transition-all backdrop-blur-sm"
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Address
        </label>
        <input
          type="text"
          name="address"
          value={address}
          onChange={onChange}
          required
          placeholder="e.g. 123 Ocean Drive, Malibu, CA"
          className="w-full bg-slate-800/50 border border-slate-700/50 focus:border-indigo-500/50 rounded-2xl px-4 py-3 text-white placeholder-slate-600 outline-none transition-all backdrop-blur-sm"
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Property Type
        </label>
        <select
          name="propertyType"
          value={propertyType}
          onChange={onChange}
          required
          className="w-full bg-slate-800/50 border border-slate-700/50 focus:border-indigo-500/50 rounded-2xl px-4 py-3 text-white outline-none transition-all backdrop-blur-sm cursor-pointer"
        >
          <option value="" disabled>Select Type</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
          <option value="office">Office</option>
        </select>
      </div>
    </div>
  );
}

export default PropertyForm;
