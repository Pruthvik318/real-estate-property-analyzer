import { useState } from "react";
import { API_URL } from "../config";

export default function QuoteGenerator() {
  const [quote, setQuote] = useState("");
  const [error, setError] = useState("");

  const generateQuote = async () => {
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/random-quote`);
      const data = await res.json();
      setQuote(data.quote);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch quote");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={generateQuote}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Generate Quote
      </button>

      {quote && <p className="text-lg">{quote}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
