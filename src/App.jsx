import { useState } from "react";

export default function App() {
  const [page, setPage] = useState("login");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white flex items-center justify-center p-4">

      {page === "login" && <Login setPage={setPage} />}
      {page === "register" && <Register setPage={setPage} />}
      {page === "volunteer" && <VolunteerForm />}
      {page === "ngo" && <NGOForm />}

    </div>
  );
}

/* ================= LOGIN ================= */
function Login({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    if (email && password) {
      alert("Login Successful 🚀");
    } else {
      alert("Please enter email and password");
    }
  };

  return (
    <div className="form-card">
      <h1 className="title">Login</h1>

      <input
        className="field"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="field"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="btn" onClick={login}>Login</button>

      <p
        className="text-center mt-4 text-green-300 cursor-pointer"
        onClick={() => setPage("register")}
      >
        Don't have an account? Register
      </p>
    </div>
  );
}

/* ================= REGISTER ================= */
function Register({ setPage }) {
  return (
    <div className="form-card text-center">
      <h1 className="title">Register</h1>

      <p className="mb-6 text-gray-300">
        Choose registration type
      </p>

      {/* VOLUNTEER */}
      <div className="card mb-4" onClick={() => setPage("volunteer")}>
        🤝 Register as Volunteer
      </div>

      {/* NGO */}
      <div className="card" onClick={() => setPage("ngo")}>
        🏢 Register as NGO
      </div>

      <p
        className="mt-6 text-sm text-blue-300 cursor-pointer"
        onClick={() => setPage("login")}
      >
        ← Back to Login
      </p>
    </div>
  );
}

/* ================= VOLUNTEER FORM ================= */
function VolunteerForm() {
  const [hasExperience, setHasExperience] = useState(false);

  return (
    <div className="form-card">
      <h2 className="title">Volunteer Registration</h2>

      <div className="section">
        <input className="field" placeholder="Full Name" />
        <input className="field" placeholder="Age" />

        <select className="field">
          <option>Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <input className="field" placeholder="Email" />
        <input className="field" placeholder="Phone Number" />
        <input className="field" placeholder="Address" />
      </div>

      <div className="section">
        <p className="label">Have you previously done volunteer work?</p>

        <select
          className="field"
          onChange={(e) => setHasExperience(e.target.value === "yes")}
        >
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>

        {hasExperience && (
          <div>
            <input className="field" placeholder="NGO Name" />
            <input className="field" placeholder="Duration of Work" />
            <textarea className="field" placeholder="Description (optional)" />
          </div>
        )}
      </div>

      <button className="btn">Submit</button>
    </div>
  );
}

/* ================= NGO FORM ================= */
function NGOForm() {
  const [licensed, setLicensed] = useState(false);

  return (
    <div className="form-card">
      <h2 className="title">NGO Registration</h2>

      <div className="section">
        <input className="field" placeholder="Full Name" />
        <input className="field" placeholder="Age" />

        <select className="field">
          <option>Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <input className="field" placeholder="Email" />
        <input className="field" placeholder="Phone Number" />
      </div>

      <div className="section">
        <input className="field" placeholder="NGO Name" />
        <input className="field" placeholder="Position at NGO" />

        {/* ✅ FIXED: INPUT (NOT DROPDOWN) */}
        <input className="field" placeholder="Type of NGO" />

        <input className="field" placeholder="NGO Email" />
        <input className="field" placeholder="NGO Phone Number" />
        <input className="field" placeholder="NGO Address" />
      </div>

      <div className="section">
        <p className="label">Is your NGO licensed?</p>

        <select
          className="field"
          onChange={(e) => setLicensed(e.target.value === "yes")}
        >
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>

        {licensed && (
          <div>
            <input className="field" placeholder="Issuing Authority" />
            <input className="field" placeholder="Registration ID" />
            <input className="field" type="file" />
            <input className="field" type="file" />
          </div>
        )}
      </div>

      <button className="btn">Submit</button>
    </div>
  );
}
