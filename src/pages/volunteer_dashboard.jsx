import { useEffect, useState } from "react";
import Sidebar from "../components/volunteer/Sidebar";
import Navbar from "../components/volunteer/Navbar"; 
import { auth } from "../firebase";
import { db } from "../firebase";
import { updateDoc } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import {
  getAllOpportunities,
  applyToOpportunity,
  getMyApplications
} from "../components/volunteer/volunteerService";

export default function VolunteerDashboard() {
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [view, setView] = useState("dashboard");
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
  name: "",
  phone: ""
});
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const opps = await getAllOpportunities();
  const apps = await getMyApplications(user.uid);

  setOpportunities(opps);
  setApplications(apps);

  const userDoc = await getDoc(doc(db, "users", user.uid));

  if (userDoc.exists()) {
    setUserData(userDoc.data());
    setFormData({
      name: userDoc.data().name || "",
      phone: userDoc.data().phone || ""
    });
  }
};

const handleApply = async (oppId) => {
  const user = auth.currentUser;
  if (!user) {
    alert("Login required");
    return;
  }

  try {
    await applyToOpportunity(user.uid, oppId);
    alert("Applied successfully ✅");
    loadData();
  } catch (err) {
    alert(err.message);
  }
};

const getOpportunityTitle = (id) => {
  const opp = opportunities.find((o) => o.id === id);
  return opp ? opp.title : id;
};

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};

const handleSave = async () => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    setSaving(true);

    await updateDoc(doc(db, "users", user.uid), {
      name: formData.name,
      phone: formData.phone
    });

    alert("Profile updated ✅");
    setEditMode(false);
    loadData();
  } catch (err) {
    alert("Error updating profile");
  } finally {
    setSaving(false);
  }
};
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">

  {/* 🔥 MAIN SQUARE PANEL */}
    <div className="flex w-full max-w-6xl min-h-[600px] bg-slate-900/60 backdrop-blur border border-slate-700 rounded-2xl shadow-lg overflow-hidden">

    {/* Sidebar INSIDE */}
    <Sidebar setView={setView} view={view} />

    {/* Content */}
    <div className="flex-1 p-6">

      <Navbar />
      <div className="mt-4 bg-slate-900/40 rounded-xl p-6 border border-slate-700">

        {/* ================= DASHBOARD ================= */}
        {view === "dashboard" && (
  <>
     {/* ✅ STEP 3 (ADD HERE) */}
    <h2 className="text-lg text-gray-400 mb-1">
  Welcome back {userData?.name || "Volunteer"} 👋
    </h2>

    <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

    {/* 🔥 STATS CARDS */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

        <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-5 rounded-xl shadow-lg border border-slate-700 hover:scale-105 transition">
        <p className="text-gray-400">Applications</p>
        <h2 className="text-2xl font-bold">{applications.length}</h2>
      </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-5 rounded-xl shadow-lg border border-slate-700 hover:scale-105 transition">
        <p className="text-gray-400">Opportunities</p>
        <h2 className="text-2xl font-bold">{opportunities.length}</h2>
      </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-5 rounded-xl shadow-lg border border-slate-700 hover:scale-105 transition">
        <p className="text-gray-400">Tasks</p>
        <h2 className="text-2xl font-bold">0</h2>
      </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-5 rounded-xl shadow-lg border border-slate-700 hover:scale-105 transition">
        <p className="text-gray-400">Badges</p>
        <h2 className="text-2xl font-bold">0</h2>
      </div>

    </div>

    {/* 🔥 TWO COLUMN SECTION */}
    <div className="grid md:grid-cols-2 gap-6">

      {/* Opportunities Preview */}
        <div className="bg-slate-800/80 backdrop-blur p-5 rounded-xl border border-slate-700 shadow-lg">
        <h3 className="text-lg font-semibold mb-3">Latest Opportunities</h3>

        {opportunities.slice(0, 3).map((opp) => (
          <div key={opp.id} className="mb-2 border-b border-slate-700 pb-2">
            <p className="font-medium">{opp.title}</p>
            <p className="text-sm text-gray-400">{opp.location}</p>
          </div>
        ))}

        {opportunities.length === 0 && (
          <p className="text-gray-400">No opportunities yet</p>
        )}
      </div>

      {/* Applications Preview */}
      <div className="bg-slate-800/80 backdrop-blur p-5 rounded-xl border border-slate-700 shadow-lg">
        <h3 className="text-lg font-semibold mb-3">Recent Applications</h3>

        {applications.slice(0, 3).map((app) => (
          <div key={app.id} className="mb-2 border-b border-slate-700 pb-2">
            <p className="font-medium">
            Applied to: {getOpportunityTitle(app.opportunityId)}
            </p>
           <p
              className={`text-sm font-semibold ${
                app.status === "pending"
                  ? "text-yellow-400"
                  : app.status === "accepted"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {app.status.toUpperCase()}
            </p> 
          </div>
        ))}

        {applications.length === 0 && (
          <p className="text-gray-400">No applications yet</p>
        )}
      </div>

    </div>
  </>
)}

        {/* ================= OPPORTUNITIES ================= */}
        {view === "opportunities" && (
          <>
            <h2 className="text-xl mb-4">Opportunities</h2>

           {opportunities.map((opp) => {
  const alreadyApplied = applications.some(
    (app) => app.opportunityId === opp.id
  );

  return (
    <div key={opp.id} className="bg-slate-800 p-4 mb-3 rounded">
      <h3 className="font-bold">{opp.title}</h3>
      <p>{opp.location}</p>

      <button
        disabled={alreadyApplied}
        className={`px-4 py-2 mt-2 rounded-lg transition shadow ${
          alreadyApplied
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        onClick={() => handleApply(opp.id)}
      >
        {alreadyApplied ? "Applied ✅" : "Apply"}
      </button>
    </div>
  );
})}

          </>
        )}

        {/* ================= APPLICATIONS ================= */}
        {view === "applications" && (
          <>
            <h2 className="text-xl mb-4">My Applications</h2>

            {applications.map((app) => (
              <div key={app.id} className="bg-slate-800 p-4 mb-3 rounded">
               <p className="font-medium">
                     Applied to: {getOpportunityTitle(app.opportunityId)} 
                    </p>

                    <p
                      className={`text-sm font-semibold ${
                        app.status === "pending"
                          ? "text-yellow-400"
                          : app.status === "accepted"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {app.status.toUpperCase()}
                    </p> 
              </div>
            ))}
          </>
        )}

        {/* ================= PROFILE ================= */}
        {view === "profile" && (
  <div className="max-w-md">
    <h2 className="text-2xl font-bold mb-4">My Profile</h2>

    {/* Name */}
    <div className="mb-3">
      <label className="text-sm text-gray-400">Name</label>
      {editMode ? (
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 rounded bg-slate-800 border border-slate-700"
        />
      ) : (
        <p>{userData?.name}</p>
      )}
    </div>

    {/* Email (readonly) */}
    <div className="mb-3">
      <label className="text-sm text-gray-400">Email</label>
      <p>{auth.currentUser?.email}</p>
    </div>

    {/* Phone */}
    <div className="mb-3">
      <label className="text-sm text-gray-400">Phone</label>
      {editMode ? (
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2 rounded bg-slate-800 border border-slate-700"
        />
      ) : (
        <p>{userData?.phone || "Not added"}</p>
      )}
    </div>

    {/* Buttons */}
    <div className="mt-4 space-x-2">
      {editMode ? (
        <>
          <button
            className="bg-green-600 px-4 py-2 rounded disabled:opacity-50"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
              </button>
          <button
            className="bg-gray-500 px-4 py-2 rounded"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          className="bg-blue-600 px-4 py-2 rounded"
          onClick={() => setEditMode(true)}
        >
          Edit Profile
        </button>
      )}
    </div>
  </div>
)}

      </div>
    </div>
    </div>
  </div>
);
}
