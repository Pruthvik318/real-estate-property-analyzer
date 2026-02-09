function FilterPanel() {
  return (
    <div className="border p-4 rounded mt-4">
      <h3 className="font-bold mb-2">Filters</h3>

      <select className="w-full border px-2 py-2 rounded">
        <option>Property Type</option>
        <option>House</option>
        <option>Apartment</option>
      </select>
    </div>
  );
}

export default FilterPanel;
