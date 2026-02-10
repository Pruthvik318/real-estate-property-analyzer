function PropertyCard({ property }) {

  return (
    <div className="bg-white shadow rounded p-4">

      <img
        src={`http://127.0.0.1:8000/${property.thumbnail}`}
        alt="property"
        className="w-full h-40 object-cover rounded"
      />

      <h3 className="font-bold text-lg mt-2">
        {property.name}
      </h3>

      <p className="text-gray-600">
        {property.address}
      </p>

      <p className="text-sm text-blue-600 mt-2">
        {property.valuation}
      </p>

    </div>
  );
}

export default PropertyCard;
