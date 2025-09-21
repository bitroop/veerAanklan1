"use client";

import { useState, useEffect } from "react";
import SplashScreen from "../components/SplashScreen";
import { useLanguage } from "../components/LanguageContext";
import { useRouter } from "next/navigation";
import { Trophy, Users, Target, Award } from "lucide-react"; // icons

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();

  const hindiStates = ["Uttar Pradesh", "Delhi", "Bihar", "Madhya Pradesh", "Rajasthan", "Haryana"];

  useEffect(() => {
    if (!showSplash) {
      const storedLang = localStorage.getItem("lang");
      if (storedLang) return;

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            try {
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
              );
              const data = await res.json();
              const state = data?.address?.state || "Unknown";

              if (hindiStates.includes(state)) {
                setLanguage("hi");
              } else {
                setLanguage("en");
              }
            } catch {
              router.push("/language");
            }
          },
          () => {
            router.push("/language");
          }
        );
      } else {
        router.push("/language");
      }
    }
  }, [showSplash, setLanguage, router]);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <main className="bg-black text-white">
      {/* HERO with stats */}
      <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-black to-purple-800 relative overflow-hidden px-6">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-indigo-500 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>

        <h1 className="text-5xl font-extrabold mb-6 text-center drop-shadow-lg">
          {t.landing.title}
        </h1>

        <p className="text-lg text-gray-300 mb-12 text-center max-w-3xl leading-relaxed">
          {t.landing.paragraph}
        </p>

        {/* Stats embedded inside hero */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          <div className="bg-black/40 p-6 rounded-xl shadow-lg text-center hover:scale-105 transition-transform">
            <h2 className="text-3xl font-bold text-indigo-400">1,250+</h2>
            <p className="mt-2 text-gray-300">
              {language === "hi" ? "पंजीकृत खिलाड़ी" : "Athletes Registered"}
            </p>
          </div>
          <div className="bg-black/40 p-6 rounded-xl shadow-lg text-center hover:scale-105 transition-transform">
            <h2 className="text-3xl font-bold text-indigo-400">320+</h2>
            <p className="mt-2 text-gray-300">
              {language === "hi" ? "कोच जुड़े" : "Coaches Onboarded"}
            </p>
          </div>
          <div className="bg-black/40 p-6 rounded-xl shadow-lg text-center hover:scale-105 transition-transform">
            <h2 className="text-3xl font-bold text-indigo-400">5,400+</h2>
            <p className="mt-2 text-gray-300">
              {language === "hi" ? "असेसमेंट पूरे" : "Assessments Completed"}
            </p>
          </div>
          <div className="bg-black/40 p-6 rounded-xl shadow-lg text-center hover:scale-105 transition-transform">
            <h2 className="text-3xl font-bold text-indigo-400">950+</h2>
            <p className="mt-2 text-gray-300">
              {language === "hi" ? "प्रमाणपत्र जारी" : "Certifications Issued"}
            </p>
          </div>
        </div>
      </section>

      {/* ROLE SELECTION (big cards, improved colors) */}
      <section className="py-20 bg-gradient-to-r from-gray-950 to-gray-900">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-6">
            <a
            href="/auth/login?role=athlete"
            className="flex flex-col items-center p-10 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-xl hover:scale-105 hover:shadow-indigo-500/40 transition-transform text-center"
            >
            <Users className="w-14 h-14 text-white mb-6" />
            <h3 className="text-2xl font-bold mb-4 text-white">
                {language === "hi" ? "मैं खिलाड़ी हूँ" : "I’m an Athlete"}
            </h3>
            <p className="text-gray-200">
                {language === "hi"
                ? "अपनी प्रतिभा दिखाएँ और मार्गदर्शन प्राप्त करें।"
                : "Showcase your talent and receive expert guidance."}
            </p>
            </a>

            <a
            href="/auth/login?role=coach"
            className="flex flex-col items-center p-10 bg-gradient-to-br from-pink-600 to-rose-700 rounded-2xl shadow-xl hover:scale-105 hover:shadow-pink-400/40 transition-transform text-center"
            >
            <Trophy className="w-14 h-14 text-white mb-6" />
            <h3 className="text-2xl font-bold mb-4 text-white">
                {language === "hi" ? "मैं कोच हूँ" : "I’m a Coach"}
            </h3>
            <p className="text-gray-200">
                {language === "hi"
                ? "खिलाड़ियों को प्रशिक्षित करें और उनकी क्षमता को निखारें।"
                : "Train athletes and nurture their full potential."}
            </p>
            </a>
        </div>
        </section>


      {/* FEATURE CARDS */}
      <section className="py-20 bg-gradient-to-r from-indigo-950 to-purple-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
          <FeatureCard
            title={language === "hi" ? "असेसमेंट दें" : "Take Assessment"}
            text={
              language === "hi"
                ? "AI आधारित परीक्षण से अपनी क्षमताओं को परखें।"
                : "Test your skills with AI-powered assessments."
            }
            link="/assessment"
            icon={<Target className="w-10 h-10 text-indigo-400" />}
          />
          <FeatureCard
            title={language === "hi" ? "लीडरबोर्ड देखें" : "View Leaderboard"}
            text={
              language === "hi"
                ? "देखें कौन सबसे आगे है।"
                : "See who’s leading the game."
            }
            link="/leaderboard"
            icon={<Award className="w-10 h-10 text-indigo-400" />}
          />
          <FeatureCard
            title={language === "hi" ? "चैलेंज में शामिल हों" : "Join Challenges"}
            text={
              language === "hi"
                ? "रोमांचक स्पोर्ट्स चैलेंज में हिस्सा लें।"
                : "Participate in exciting sports challenges."
            }
            link="/challenges"
            icon={<Trophy className="w-10 h-10 text-indigo-400" />}
          />
          <FeatureCard
            title={language === "hi" ? "प्रमाणपत्र प्राप्त करें" : "Get Certified"}
            text={
              language === "hi"
                ? "AI द्वारा मान्य प्रमाणपत्र हासिल करें।"
                : "Earn AI-backed certifications for your progress."
            }
            link="/certifications"
            icon={<Users className="w-10 h-10 text-indigo-400" />}
          />
        </div>
      </section>
    </main>
  );
}

// Small reusable card component
function FeatureCard({ title, text, link, icon }) {
  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-lg hover:scale-105 hover:shadow-indigo-500/40 transition-transform text-center flex flex-col items-center">
      {icon}
      <h3 className="text-xl font-bold mt-4 mb-2">{title}</h3>
      <p className="text-gray-300 mb-6">{text}</p>
      <a href={link} className="text-indigo-400 hover:underline">
        → 
      </a>
    </div>
  );
}
