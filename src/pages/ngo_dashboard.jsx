import Sidebar from "../components/ngo/Sidebar";
import Topbar from "../components/ngo/Topbar";
import Main from "../components/ngo/Main";

function NGODashboard() {
  return (
    <div className="flex h-screen">
      
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />
        <Main />
      </div>

    </div>
  );
}

export default NGODashboard;