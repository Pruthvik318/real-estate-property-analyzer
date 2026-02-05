import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoginForm from "../components/LoginForm";

function Login() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <LoginForm />
      </div>

      <Footer />
    </>
  );
}

export default Login;
