import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PropertyList from "../components/PropertyList";
import UploadButton from "../components/UploadButton";

function Dashboard() {

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch properties
  const fetchProperties = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/properties");

      if (!response.ok) throw new Error("Failed to fetch properties");

      const data = await response.json();
      setProperties(data);

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <>
      <Navbar />

      <div className="p-6">

        <UploadButton />

        {loading && <p>Loading properties...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && properties.length === 0 && (
          <p>No properties uploaded yet</p>
        )}

        <PropertyList properties={properties} />

      </div>

      <Footer />
    </>
  );
}

export default Dashboard;
