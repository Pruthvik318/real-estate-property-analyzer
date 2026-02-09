function ImageUploader({ mainImage, floorPlan, setMainImage, setFloorPlan }) {
  return (
    <>
      <div>
        <label className="block mb-1 font-medium">
          Main Property Image (Required)
        </label>
        <input
          type="file"
          accept="image/*"
          required
          onChange={(e) => setMainImage(e.target.files[0])}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">
          Floor Plan (Optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFloorPlan(e.target.files[0])}
        />
      </div>
    </>
  );
}

export default ImageUploader;
