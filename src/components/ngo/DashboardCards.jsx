function DashboardCards() {
  return (
    <div className="grid grid-cols-3 gap-4">
      
      <div className="bg-white p-4 shadow rounded">
        <h3>Total Volunteers</h3>
        <p className="text-xl font-bold">120</p>
      </div>

      <div className="bg-white p-4 shadow rounded">
        <h3>Active Campaigns</h3>
        <p className="text-xl font-bold">8</p>
      </div>

      <div className="bg-white p-4 shadow rounded">
        <h3>Pending Requests</h3>
        <p className="text-xl font-bold">15</p>
      </div>

    </div>
  );
}

export default DashboardCards;