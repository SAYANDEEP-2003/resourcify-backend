import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../../firebase";

// 🔹 1. Get all opportunities
export const getAllOpportunities = async () => {
  const snapshot = await getDocs(collection(db, "opportunities"));

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// 🔹 2. Apply to opportunity
export const applyToOpportunity = async (volunteerId, opportunityId) => {

  // 🔥 Prevent duplicate application
  const q = query(
    collection(db, "applications"),
    where("volunteerId", "==", volunteerId),
    where("opportunityId", "==", opportunityId)
  );

  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    throw new Error("Already applied ❌");
  }

  // ✅ Save application
  await addDoc(collection(db, "applications"), {
    volunteerId,
    opportunityId,
    status: "pending",
    appliedAt: serverTimestamp()
  });
};

// 🔹 3. Get my applications
export const getMyApplications = async (volunteerId) => {
  const q = query(
    collection(db, "applications"),
    where("volunteerId", "==", volunteerId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};