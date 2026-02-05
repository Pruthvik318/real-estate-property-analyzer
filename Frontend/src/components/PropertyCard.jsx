function PropertyCard() {
  return (
    <div className="bg-white shadow rounded p-4">
      <img
        src="https://via.placeholder.com/300"
        alt="property"
        className="rounded mb-3"
      />

      <h3 className="font-bold text-lg">Sample Property</h3>
      <p>123 Main Street</p>
      <p className="text-blue-600 font-semibold">$250,000</p>
    </div>
  );
}

export default PropertyCard;
