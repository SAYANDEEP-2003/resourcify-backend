import { useState } from "react";

import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { sendEmailVerification } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

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

  const login = async () => {
  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    console.log(userCredential.user);

    alert("Login Successful 🚀");
  } catch (error) {
    alert(error.message);
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerVolunteer = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    alert("Registered Successfully ✅");

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

  return (
    <div className="form-card">
      <h2 className="title">Volunteer Registration</h2>

      <div className="section">
        <input 
            className="field" 
            placeholder="Full Name" 
            onChange={(e)=>setName(e.target.value)} 
          />
        <input 
            className="field" 
            placeholder="Email" 
            onChange={(e)=>setEmail(e.target.value)} 
          />

          <input 
            className="field" 
            type="password" 
            placeholder="Password" 
            onChange={(e)=>setPassword(e.target.value)} 
           />

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

      <button className="btn" onClick={registerVolunteer}>
       Submit
      </button>
    </div>
  );
}

/* ================= NGO FORM ================= */
function NGOForm() {
  const [licensed, setLicensed] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ngoName, setNgoName] = useState("");

  const registerNGO = async () => {
  if (!email || !password || !ngoName) {
    alert("Fill all required fields");
    return;
  }

  try {
    // ✅ Create account (same as volunteer)
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // ✅ Save NGO data in Firestore
    await setDoc(doc(db, "ngos", user.uid), {
      name,
      email,
      ngoName,
      role: "ngo"
    });

    alert("NGO Registered Successfully ✅");

  } catch (error) {
    alert(error.message);
  }
};

  return (
    <div className="form-card">
      <h2 className="title">NGO Registration</h2>

      <div className="section">
        <input className="field" placeholder="Full Name" onChange={(e)=>setName(e.target.value)} />
        <input className="field" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
        <input className="field" type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />
        <input className="field" placeholder="Age" />
        <input className="field" placeholder="Phone Number" />

        <select className="field">
          <option>Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        
        
      </div>

      <div className="section">
        <input className="field" placeholder="NGO Name" onChange={(e)=>setNgoName(e.target.value)} />
        <input className="field" placeholder="Position at NGO" />

        {/* ✅ FIXED: INPUT (NOT DROPDOWN) */}
        <input className="field" placeholder="Type of NGO" />

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

      <button className="btn" onClick={registerNGO}>
         Submit
      </button>
    </div>
  );
}
