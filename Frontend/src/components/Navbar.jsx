import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/5 text-white px-6 md:px-12 py-4 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h1 className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Estate<span className="text-indigo-400">AI</span>
        </h1>
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
          Dashboard
        </Link>
        <Link to="/signup" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
          Sign Up
        </Link>
        <Link to="/login" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-full text-sm font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
          Login
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

