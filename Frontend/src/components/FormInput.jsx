function FormInput({ label, type, placeholder, value, onChange }) {
  return (
    <div>
      <label className="block mb-1 font-medium">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default FormInput;
