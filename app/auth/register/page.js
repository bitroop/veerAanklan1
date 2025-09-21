"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db } from "../../../lib/firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "athlete"; // role is passed in query

  // Register with Email/Password
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;

      // Save user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        role,
      });

      // Redirect based on role
      if (role === "coach") router.push("/coach/dashboard");
      else router.push("/athlete/dashboard");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        alert("⚠️ This email is already registered. Please login instead.");
        router.push(`/auth/login?role=${role}`);
      } else {
        alert("❌ " + err.message);
      }
    }
  };

  // Google Auth
  const handleGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const user = res.user;

      // Save Google user to Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          role,
        },
        { merge: true }
      );

      if (role === "coach") router.push("/coach/dashboard");
      else router.push("/athlete/dashboard");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white px-6">
      <div className="bg-gray-800 p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {role === "coach" ? "Coach Registration" : "Athlete Registration"}
        </h1>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            className="px-4 py-3 rounded bg-gray-700 text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-3 rounded bg-gray-700 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-3 rounded bg-gray-700 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full py-3 bg-purple-600 rounded-lg hover:bg-purple-500 transition"
          >
            Register
          </button>
        </form>

        <div className="mt-6">
          <button
            onClick={handleGoogle}
            className="w-full py-3 bg-red-600 rounded-lg hover:bg-red-500 transition"
          >
            Register with Google
          </button>
        </div>

        <p className="mt-4 text-gray-300 text-center">
          Already have an account?{" "}
          <a href={`/auth/login?role=${role}`} className="text-purple-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </main>
  );
}
