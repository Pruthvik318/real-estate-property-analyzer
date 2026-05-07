import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SignupForm from "../components/SignupForm";

function Signup() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <SignupForm />
      </div>

      <Footer />
    </>
  );
}

export default Signup;
