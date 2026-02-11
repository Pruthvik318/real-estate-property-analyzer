import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import ImageGallery from "../components/ImageGallery";
import AnalysisView from "../components/AnalysisView";
import ValuationCard from "../components/ValuationCard";
import PropertyForm from "../components/PropertyForm";
import Navbar from "../components/Navbar";

function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [valuating, setValuating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ name: "", address: "", propertyType: "" });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://127.0.0.1:8000/api/properties/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch property details");
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setProperty(data);
        setEditData({
          name: data.name,
          address: data.address,
          propertyType: data.propertyType || ""
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleUpdate = async (e) => {
    if (e) e.preventDefault();
    try {
      setUpdating(true);
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("address", editData.address);
      formData.append("propertyType", editData.propertyType);

      const response = await fetch(`http://127.0.0.1:8000/api/properties/${id}`, {
        method: 'PATCH',
        body: formData,
      });

      if (!response.ok) throw new Error("Update failed");

      setProperty(prev => ({
        ...prev,
        ...editData
      }));
      setShowEditModal(false);
      alert("Property updated successfully!");
    } catch (err) {
      alert("Error updating property: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleValuation = async () => {
    try {
      setValuating(true);
      const response = await fetch(`http://127.0.0.1:8000/api/properties/${id}/valuation`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Valuation failed");
      }

      const data = await response.json();

      setProperty(prev => ({
        ...prev,
        valuation: data.valuation,
        valuation_reasoning: data.reasoning
      }));

      alert("Valuation complete!");
    } catch (err) {
      alert("Valuation failed: " + err.message);
    } finally {
      setValuating(false);
    }
  };

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      const response = await fetch(`http://127.0.0.1:8000/api/properties/${id}/analyze`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();

      setProperty(prev => ({
        ...prev,
        description: data.description,
        analysis: data.analysis
      }));

      alert("AI Analysis complete!");
    } catch (err) {
      alert("Failed to analyze property: " + err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const response = await fetch(`http://127.0.0.1:8000/api/properties/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error("Failed to delete property");
      }

      navigate("/dashboard");
    } catch (err) {
      alert("Error deleting property: " + err.message);
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-slate-400 font-medium">Loading details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-red-400 mb-2">Error</h2>
            <p className="text-slate-300 mb-6">{error || "Property not found"}</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-20 relative">
      <Navbar />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowDeleteConfirm(false)}></div>
          <div className="relative bg-slate-800 border border-slate-700 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Delete Property?</h3>
            <p className="text-slate-400 mb-8">
              Are you sure you want to delete <span className="text-white font-semibold">"{property.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-2xl font-bold transition-colors"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 rounded-2xl font-bold transition-all shadow-lg shadow-red-500/20 active:scale-95 flex items-center justify-center gap-2"
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="group flex items-center text-slate-400 hover:text-white transition-colors mb-4"
            >
              <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              {property.name}
            </h1>
            <p className="mt-3 text-lg text-slate-400 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {property.address}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg active:scale-95 ${analyzing
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-500/20"
                }`}
            >
              {analyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-500 border-t-white rounded-full animate-spin"></div>
                  AI Analyzing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  ✨ Magic AI Re-Analyze
                </>
              )}
            </button>
            <button
              onClick={handleValuation}
              disabled={valuating}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg active:scale-95 ${valuating
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20"
                }`}
            >
              {valuating ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-500 border-t-white rounded-full animate-spin"></div>
                  Estimating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Estimate Value
                </>
              )}
            </button>

            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 px-6 py-3 border border-slate-700 bg-slate-800/50 hover:bg-indigo-500/10 hover:border-indigo-500/50 text-slate-400 hover:text-indigo-400 rounded-2xl font-bold transition-all backdrop-blur-sm active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-6 py-3 border border-slate-700 bg-slate-800/50 hover:bg-red-500/10 hover:border-red-500/50 text-slate-400 hover:text-red-500 rounded-2xl font-bold transition-all backdrop-blur-sm active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowEditModal(false)}></div>
            <div className="relative bg-slate-800 border border-slate-700 rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in duration-300">
              <h3 className="text-2xl font-bold mb-6">Edit Property Metadata</h3>
              <form onSubmit={handleUpdate} className="space-y-6">
                <PropertyForm
                  name={editData.name}
                  address={editData.address}
                  propertyType={editData.propertyType}
                  onChange={(e) => setEditData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                />
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-2xl font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                  >
                    {updating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <section className="bg-slate-800/50 border border-slate-700/50 rounded-3xl overflow-hidden backdrop-blur-sm p-4 text-center">
              <ImageGallery property={property} />
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">Property Analysis</h3>
              </div>
              <AnalysisView analysis={property.analysis} />
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">About this property</h3>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
                {property.description ? (
                  <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-line">
                    {property.description}
                  </p>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-slate-500 italic mb-4">No description generated yet.</p>
                    <button
                      onClick={handleAnalyze}
                      className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                    >
                      Click "Magic Re-Analyze" to generate one.
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <ValuationCard
              valuation={property.valuation}
              reasoning={property.valuation_reasoning}
            />

            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl transition-transform group-hover:scale-110 duration-700"></div>
              <h4 className="text-xl font-bold mb-4 relative z-10">Interested in this property?</h4>
              <p className="text-indigo-100 mb-8 relative z-10">Get in touch with our AI property experts for a personalized walkthrough.</p>
              <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-slate-100 transition-colors shadow-lg relative z-10">
                Contact Agent
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PropertyDetail;
