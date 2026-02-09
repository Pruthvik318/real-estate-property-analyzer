import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropertyForm from "../components/PropertyForm";
import ImageUploader from "../components/ImageUploader";

function AddProperty() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [floorPlan, setFloorPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mainImage) {
      alert("Main image is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("address", address);
    formData.append("mainImage", mainImage);

    if (floorPlan) {
      formData.append("floorPlan", floorPlan);
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/properties", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      alert("Property uploaded successfully");
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white p-8 rounded shadow space-y-4"
    >
      <h2 className="text-2xl font-bold text-center">Add Property</h2>

      <PropertyForm
        name={name}
        address={address}
        onChange={(e) =>
          e.target.name === "name"
            ? setName(e.target.value)
            : setAddress(e.target.value)
        }
      />

      <ImageUploader
        mainImage={mainImage}
        floorPlan={floorPlan}
        setMainImage={setMainImage}
        setFloorPlan={setFloorPlan}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        {loading ? "Uploading..." : "Upload Property"}
      </button>
    </form>
  );
}

export default AddProperty;
