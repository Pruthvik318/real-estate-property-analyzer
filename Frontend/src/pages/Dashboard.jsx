import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import PropertyList from "../components/PropertyList";
import UploadButton from "../components/UploadButton";

function Dashboard() {
  return (
    <>
      <Navbar />

      <div className="p-6 min-h-screen bg-gray-100">
        <div className="flex justify-between mb-4">
          <SearchBar />
          <UploadButton />
        </div>

        <FilterPanel />
        <PropertyList />
      </div>

      <Footer />
    </>
  );
}

export default Dashboard;
