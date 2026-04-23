import { useState } from "react";

import { auth, db } from "./firebase";
import NGODashboard from "./pages/ngo_dashboard";
import VolunteerDashboard from "./pages/volunteer_dashboard";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification
} from "firebase/auth";

import { setDoc, doc, getDoc } from "firebase/firestore";

export default function App() {
  const [page, setPage] = useState("login");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white flex items-center justify-center p-4">

      {page === "login" && <Login setPage={setPage} />}
      {page === "register" && <Register setPage={setPage} />}
      {page === "volunteer" && <VolunteerForm />}
      {page === "ngo" && <NGOForm />}
      {page === "ngo-dashboard" && <NGODashboard />}
      {page === "volunteer-dashboard" && <VolunteerDashboard />}
      

    </div>
  );
}

/* ================= LOGIN ================= */
function Login({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  

  const login = async () => {
    if (!email || !password) {
      alert("Enter email & password");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // 🔥 Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        alert("User data not found");
        return;
      }

      const userData = userDoc.data();

      // ❗ Check email verification
      await user.reload(); // 🔥 IMPORTANT

      if (!user.emailVerified) {
        alert("Please verify your email first 📩");
        return;
      }

      // 🚀 Auto redirect (NO OK BUTTON)
      setTimeout(() => {
        if (userData.role === "ngo") {
          setPage("ngo-dashboard");
        } else {
          setPage("volunteer-dashboard");
        }
      }, 1000);

    } catch (error) {
      // 🔥 Proper error handling
      if (error.code === "auth/user-not-found") {
        alert("No account found. Redirecting to register...");
        setTimeout(() => setPage("register"), 1500);
      } else if (error.code === "auth/wrong-password") {
        alert("Incorrect password. Try again.");
      } else if (error.code === "auth/invalid-email") {
        alert("Invalid email format.");
      } else {
        alert(error.message);
      }
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

  <button className="btn" onClick={login}>
    Login
  </button>

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
  const [phone, setPhone] = useState("");
  
  

  const resendVerification = async () => {
  try {
   let user = auth.currentUser;

// 🔥 Fix token expired issue
if (user) {
  try {
    await user.reload();
  } catch (error) {
    // force re-login silently
    const credential = await signInWithEmailAndPassword(auth, email, password);
    user = credential.user;
  }
} 

    // 🔥 If user not created yet → create temporary account
    if (!user) {
  if (!email || !password) {
    alert("Enter email & password first");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      role: "volunteer",
      isEmailVerified: false
    });

  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      alert("Email already registered. Please login.");
      return;
    } else {
      throw error;
    }
  }
}

    // ✅ Send verification email

// now send email
     await sendEmailVerification(user);
     await user.reload();

     alert("Verification email sent 📩. Please click the link in your email before continuing.");

  } catch (error) {
    alert(error.message);
  }
};

  const registerVolunteer = async () => {
  try {
    const user = auth.currentUser;

    if (!user) {
  alert("Please click Verify Email first");
  return;
}

await user.reload();

if (!user.emailVerified) {
  alert("Please verify your email before submitting 📩");
  return;
}

    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      phone: phone.trim(),
      role: "volunteer",
      isEmailVerified: user.emailVerified,
    }, { merge: true });

    alert("Registration completed ✅");

  } catch (error) {
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

          <button className="btn mt-2" onClick={resendVerification}>
  Verify Email
</button>

          

        <select className="field">
          <option>Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

      <input
  className="field"
  placeholder="Phone (+91...)"
  value={phone || ""}
  onChange={(e) => {
  let value = e.target.value;

  // remove everything except digits
  value = value.replace(/[^0-9]/g, "");

  setPhone(value);
}}
/>  
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

  const resendVerification = async () => {
  try {
    let user = auth.currentUser;

    if (user) {
      try {
        await user.reload();
      } catch {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        user = credential.user;
      }
    }

    if (!user) {
      if (!email || !password) {
        alert("Enter email & password first");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        ngoName,
        role: "ngo",
        isEmailVerified: false
      });
    }

    await sendEmailVerification(user);
    await user.reload();

    alert("Verification email sent 📩");

  } catch (error) {
    alert(error.message);
  }
};
const registerNGO = async () => {
  const user = auth.currentUser;

  if (!user) {
    alert("Please click Verify Email first");
    return;
  }

  await user.reload();

  if (!user.emailVerified) {
    alert("Please verify your email before submitting 📩");
    return;
  }

  try {
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      ngoName,
      role: "ngo",
      isEmailVerified: user.emailVerified
    }, { merge: true });

    alert("NGO Registration completed ✅");

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
        <button className="btn mt-2" onClick={resendVerification}>
          Verify Email
         </button>
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
