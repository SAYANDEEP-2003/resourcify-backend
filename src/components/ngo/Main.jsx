import DashboardCards from "./DashboardCards";

function Main() {
  return (
    <div className="p-6 bg-gray-100 flex-1">
      <h1 className="text-2xl font-bold mb-4">Overview</h1>
      <DashboardCards />
    </div>
  );
}

export default Main;