import { useNavigate } from "react-router-dom";

function UploadButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/add-property")}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Upload Property
    </button>
  );
}

export default UploadButton;
