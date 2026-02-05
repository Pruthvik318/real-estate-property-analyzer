function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between">
      <h1 className="text-xl font-bold">Real Estate Analyzer</h1>

      <div className="space-x-4">
        <a href="/signup">Sign Up</a>
        <a href="/login">Login</a>
      </div>
    </nav>
  );
}

export default Navbar;
