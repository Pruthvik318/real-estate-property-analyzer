import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ComparisonView from "../components/ComparisonView";

function PropertyComparison() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [verdict, setVerdict] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const id1 = searchParams.get("id1");
    const id2 = searchParams.get("id2");

    useEffect(() => {
        const fetchComparison = async () => {
            if (!id1 || !id2) {
                setError("Please select exactly 2 properties to compare.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await fetch(`http://127.0.0.1:8000/api/properties/compare?id1=${id1}&id2=${id2}`);
                if (!response.ok) {
                    const data = await response.json();
                    const errorMsg = typeof data.detail === 'string'
                        ? data.detail
                        : (Array.isArray(data.detail) ? "Invalid comparison parameters." : "Failed to fetch comparison data.");
                    throw new Error(errorMsg);
                }
                const data = await response.json();
                setProperties(data.properties);
                setVerdict(data.verdict);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchComparison();
    }, [id1, id2]);

    return (
        <div className="min-h-screen bg-slate-900 text-white pb-20">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="group flex items-center text-slate-400 hover:text-white transition-colors mb-8"
                >
                    <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Dashboard
                </button>

                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Property Comparison
                    </h1>
                    <p className="mt-4 text-slate-400 text-lg">
                        Analyzing key differences and AI metrics between your selected holdings.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
                        <p className="mt-6 text-slate-400 font-medium">Crunching AI comparison data...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-12 text-center backdrop-blur-sm">
                        <h2 className="text-2xl font-bold text-red-400 mb-4">Comparison Unavailable</h2>
                        <p className="text-slate-300 mb-8 max-w-md mx-auto">{error}</p>
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-bold transition-all"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                        <ComparisonView properties={properties} verdict={verdict} />
                    </div>
                )}
            </main>
        </div>
    );
}

export default PropertyComparison;
