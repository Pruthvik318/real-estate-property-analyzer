import PropertyCard from "./PropertyCard";

function PropertyList() {
  return (
    <div className="grid md:grid-cols-3 gap-6 mt-6">
      <PropertyCard />
      <PropertyCard />
      <PropertyCard />
    </div>
  );
}

export default PropertyList;
