"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db } from "../../../lib/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "athlete";

  // Login with Email/Password
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = res.user;

      // Ensure role is stored in Firestore
      await setDoc(doc(db, "users", user.uid), { email: user.email, role }, { merge: true });

      if (role === "coach") router.push("/coach/dashboard");
      else router.push("/athlete/dashboard");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        alert("⚠️ No account found. Please register first.");
        router.push(`/auth/register?role=${role}`);
      } else if (err.code === "auth/wrong-password") {
        alert("❌ Wrong password. Try again.");
      } else {
        alert("❌ " + err.message);
      }
    }
  };

  // Login with Google
  const handleGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const user = res.user;

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
          {role === "coach" ? "Coach Login" : "Athlete Login"}
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
            className="w-full py-3 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition"
          >
            Login
          </button>
        </form>

        <div className="mt-6">
          <button
            onClick={handleGoogle}
            className="w-full py-3 bg-red-600 rounded-lg hover:bg-red-500 transition"
          >
            Login with Google
          </button>
        </div>

        <p className="mt-4 text-gray-300 text-center">
          Don’t have an account?{" "}
          <a href={`/auth/register?role=${role}`} className="text-indigo-400 hover:underline">
            Register
          </a>
        </p>
      </div>
    </main>
  );
}
