import PropertyCard from "./PropertyCard";

function PropertyList({ properties }) {

  return (
    <div className="grid md:grid-cols-3 gap-6 mt-6">

      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}

    </div>
  );
}

export default PropertyList;
