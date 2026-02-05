function Features() {
  return (
    <section className="py-16 px-6 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-10">Features</h2>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 shadow rounded">
          <h3 className="font-bold mb-2">AI Image Analysis</h3>
          <p>Detect rooms and property condition automatically.</p>
        </div>

        <div className="bg-white p-6 shadow rounded">
          <h3 className="font-bold mb-2">Property Valuation</h3>
          <p>Estimate property value using AI.</p>
        </div>

        <div className="bg-white p-6 shadow rounded">
          <h3 className="font-bold mb-2">Property Comparison</h3>
          <p>Compare properties side by side.</p>
        </div>
      </div>
    </section>
  );
}

export default Features;
