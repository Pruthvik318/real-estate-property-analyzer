import FormInput from "./FormInput";

function SignupForm() {
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Create Account
      </h2>

      <form className="space-y-4">

        {/* Email Field */}
        <FormInput
          label="Email"
          type="email"
          placeholder="Enter your email"
        />

        {/* Password Field */}
        <FormInput
          label="Password"
          type="password"
          placeholder="Enter your password"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>

      </form>
    </div>
  );
}

export default SignupForm;
