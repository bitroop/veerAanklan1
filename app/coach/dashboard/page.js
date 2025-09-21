"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export default function CoachDashboard() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "submissions"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSubmissions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  const handleContact = (athlete) => {
    if (!athlete || athlete === "Unknown Athlete") {
      alert("❌ Athlete contact info unavailable.");
      return;
    }
    window.location.href = `mailto:${athlete}?subject=Feedback from Coach&body=Hello ${athlete},%0D%0A%0D%0AI reviewed your submission and here’s some feedback: `;
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">🏋️ Coach Dashboard</h1>

      {submissions.length === 0 ? (
        <p className="text-gray-400">No submissions yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {submissions.map((sub) => (
            <div key={sub.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-2">
                👤 {sub.athlete || "Unknown Athlete"}
              </h2>
              <p className="mb-2">🎯 Task: {sub.task}</p>

              <video
                controls
                src={sub.videoUrl}
                className="w-full h-64 object-cover rounded mb-4"
              />

              <div className="space-y-1">
                <p>📚 Grade: <span className="font-bold">{sub.grade || "Pending"}</span></p>
                <p>💬 Feedback: {sub.feedback || "No feedback yet."}</p>
                <p>⭐ Points Earned: {sub.points ?? 0}</p>
              </div>

              <button
                onClick={() => handleContact(sub.athlete)}
                className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
              >
                📩 Contact Athlete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
