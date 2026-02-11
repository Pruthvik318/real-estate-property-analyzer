import PropertyCard from "./PropertyCard";

function PropertyList({ properties }) {

  if (!properties || properties.length === 0) {
    return <p className="text-center">No properties found</p>;
  }

  return (
    <div className="grid md:grid-cols-3 gap-6 mt-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
        />
      ))}
    </div>
  );
}

export default PropertyList;
