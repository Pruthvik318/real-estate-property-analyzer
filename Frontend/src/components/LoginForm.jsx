import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

function LoginForm() {

  // ===== STATE =====
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ===== LOGIN FUNCTION =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);

      alert("Login successful!");
      navigate("/dashboard");

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Login
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* EMAIL */}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>
    </div>
  );
}

export default LoginForm;
