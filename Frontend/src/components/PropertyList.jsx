import PropertyCard from "./PropertyCard";

<<<<<<< HEAD
function PropertyList({ properties, onSelect, selectedIds, selectionEnabled }) {

  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-800/20 rounded-3xl border border-slate-700/50 border-dashed">
        <p className="text-slate-500 font-medium">No properties found in your portfolio.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          onSelect={onSelect}
          isSelected={selectedIds?.includes(property.id)}
          selectionEnabled={selectionEnabled}
        />
      ))}
=======
function PropertyList({ properties }) {

  return (
    <div className="grid md:grid-cols-3 gap-6 mt-6">

      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}

>>>>>>> origin/issue-11-display-properties
    </div>
  );
}

export default PropertyList;
