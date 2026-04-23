export default function Navbar() {
  return (
    <div className="flex justify-between items-center bg-slate-800 p-4 rounded mb-6">
      <input
        className="bg-slate-700 px-4 py-2 rounded w-1/2"
        placeholder="Search NGOs..."
      />

      <div className="flex gap-4">
        <span>🔔</span>
        <span>👤</span>
      </div>
    </div>
  );
}