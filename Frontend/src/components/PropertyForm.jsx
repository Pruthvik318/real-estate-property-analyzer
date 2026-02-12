function PropertyForm({ name, address, onChange }) {
  return (
    <>
      <div>
        <label className="block mb-1 font-medium">Property Name</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={onChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Address</label>
        <input
          type="text"
          name="address"
          value={address}
          onChange={onChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>
    </>
  );
}

export default PropertyForm;
