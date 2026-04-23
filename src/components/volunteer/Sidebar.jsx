export default function Sidebar({ setView, view }) {
  return (
    <div className="w-60 bg-slate-900/80 backdrop-blur p-4 border-r border-slate-700 flex flex-col justify-between">

      {/* Top Section */}
      <div>
        <h2 className="text-xl mb-6">Volunteer</h2>

        <ul className="space-y-3">

          <li
            className={`cursor-pointer hover:text-blue-400 ${
              view === "dashboard" ? "text-blue-400 font-semibold" : ""
            }`}
            onClick={() => setView("dashboard")}
          >
            <span className="flex items-center gap-2">
              🏠 Dashboard
            </span>
          </li>

          <li
            className={`cursor-pointer hover:text-blue-400 ${
              view === "opportunities" ? "text-blue-400 font-semibold" : ""
            }`}
            onClick={() => setView("opportunities")}
          >
            <span className="flex items-center gap-2">
              📋 Opportunities
            </span>
          </li>

          <li
            className={`cursor-pointer hover:text-blue-400 ${
              view === "applications" ? "text-blue-400 font-semibold" : ""
            }`}
            onClick={() => setView("applications")}
          >
            <span className="flex items-center gap-2">
              📄 My Applications
            </span>
          </li>

          <li
            className={`cursor-pointer hover:text-blue-400 ${
              view === "profile" ? "text-blue-400 font-semibold" : ""
            }`}
            onClick={() => setView("profile")}
          >
            <span className="flex items-center gap-2">
              👤 Profile
            </span>
          </li>

        </ul>
      </div>

      {/* Bottom Section */}
      <button
        className="text-sm text-red-400 hover:text-red-500 text-left"
        onClick={() => {
          alert("Add logout logic here");
        }}
      >
        Logout
      </button>

    </div>
  );
}