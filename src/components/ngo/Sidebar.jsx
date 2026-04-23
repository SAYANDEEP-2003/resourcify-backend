function Sidebar() {
  return (
    <div className="w-64 bg-blue-700 text-white p-4">
      <h2 className="text-xl font-bold mb-6">NGO Panel</h2>

      <ul className="space-y-3">
        <li>📊 Dashboard</li>
        <li>👥 Volunteers</li>
        <li>📢 Campaigns</li>
        <li>⚙️ Settings</li>
      </ul>
    </div>
  );
}

export default Sidebar;