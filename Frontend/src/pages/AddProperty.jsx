import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PropertyForm from "../components/PropertyForm";
import ImageUploader from "../components/ImageUploader";
import Navbar from "../components/Navbar";

function AddProperty() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [propertyType, setPropertyType] = useState("");
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
    formData.append("propertyType", propertyType);
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
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
    if (name === "address") setAddress(value);
    if (name === "propertyType") setPropertyType(value);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-20">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <Link
            to="/dashboard"
            className="group flex items-center text-slate-400 hover:text-white transition-colors mb-4"
          >
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Add New Property
          </h1>
          <p className="mt-2 text-slate-400">
            Enter the property details and upload images for AI analysis.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-8 backdrop-blur-sm shadow-2xl space-y-10"
        >
          <PropertyForm
            name={name}
            address={address}
            propertyType={propertyType}
            onChange={handleChange}
          />

          <div className="pt-6 border-t border-white/5">
            <ImageUploader
              mainImage={mainImage}
              floorPlan={floorPlan}
              setMainImage={setMainImage}
              setFloorPlan={setFloorPlan}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black text-lg transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-3 ${loading
              ? "bg-slate-700 text-slate-500 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20"
              }`}
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-3 border-slate-500 border-t-white rounded-full animate-spin"></div>
                Uploading Property...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                Upload Property
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}

export default AddProperty;
