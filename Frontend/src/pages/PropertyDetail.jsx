import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import ImageGallery from "../components/ImageGallery";
import AnalysisView from "../components/AnalysisView";
import ValuationCard from "../components/ValuationCard";
import Navbar from "../components/Navbar";

function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-slate-400 font-medium">Analyzing property data...</p>
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
    <div className="min-h-screen bg-slate-900 text-white pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
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

          <div className="flex gap-3">
            <span className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-sm font-semibold backdrop-blur-sm">
              AI Analyzed
            </span>
            <span className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-semibold backdrop-blur-sm">
              Verified
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-10">
            {/* Gallery Section */}
            <section className="bg-slate-800/50 border border-slate-700/50 rounded-3xl overflow-hidden backdrop-blur-sm p-4">
              <ImageGallery property={property} />
            </section>

            {/* AI Analysis Section */}
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

            {/* Description Section */}
            {property.description && (
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
                  <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-line">
                    {property.description}
                  </p>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar (Right) */}
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

