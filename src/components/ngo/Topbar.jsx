function Topbar() {
  return (
    <div className="bg-white shadow p-4 flex justify-between">
      
      <input 
        type="text" 
        placeholder="Search volunteers..." 
        className="border px-3 py-1 rounded"
      />

      <div>
        🔔 👤
      </div>

    </div>
  );
}

export default Topbar;