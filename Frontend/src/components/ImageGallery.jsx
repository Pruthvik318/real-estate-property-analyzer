import { API_URL } from "../config";

function ImageGallery({ property }) {
  const images = [
    { src: `${API_URL}/${property.mainImage}`, label: "Main View" }
  ];

  if (property.floorPlan) {
    images.push({ src: `${API_URL}/${property.floorPlan}`, label: "Floor Plan" });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((img, index) => (
          <div
            key={index}
            className={`relative rounded-2xl overflow-hidden group ${images.length === 1 ? "md:col-span-2 aspect-video" : "aspect-square md:aspect-auto h-[400px]"
              }`}
          >
            <img
              src={img.src}
              alt={img.label}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <span className="text-white font-medium text-lg">{img.label}</span>
            </div>
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg text-white text-xs font-medium">
                {img.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageGallery;

