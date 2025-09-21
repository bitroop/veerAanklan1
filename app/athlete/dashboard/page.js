"use client";
import { useState, useRef } from "react";
import { storage, db, auth } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";

// 🎯 Training tasks
const tasks = [
  "Do 10 pushups",
  "Hold a plank for 30 seconds",
  "Do 15 squats",
  "Jumping jacks for 20 seconds",
];

// 🧠 Fake AI Feedback Generator
function generateFeedback(task) {
  const rand = Math.random();

  if (task.includes("pushup")) {
    return rand > 0.5
      ? { grade: "A", feedback: "✅ Great pushups! Full range of motion.", points: 15 }
      : { grade: "C", feedback: "⚠️ Go lower and keep elbows tighter.", points: 5 };
  }

  if (task.includes("plank")) {
    return rand > 0.5
      ? { grade: "A", feedback: "✅ Strong plank! Back is straight.", points: 15 }
      : { grade: "B", feedback: "⚠️ Hips too low, keep core tight.", points: 10 };
  }

  if (task.includes("squat")) {
    return rand > 0.5
      ? { grade: "A", feedback: "✅ Perfect squat depth.", points: 15 }
      : { grade: "C", feedback: "⚠️ Knees caving in, push them out.", points: 5 };
  }

  if (task.includes("Jumping jacks")) {
    return rand > 0.5
      ? { grade: "A", feedback: "✅ Excellent energy, arms fully extended!", points: 15 }
      : { grade: "B", feedback: "⚠️ Try to keep rhythm consistent.", points: 10 };
  }

  return { grade: "B", feedback: "👍 Decent form, keep practicing.", points: 10 };
}

export default function AthleteDashboard() {
  const videoRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [task, setTask] = useState(tasks[0]);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [grade, setGrade] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [points, setPoints] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const mediaRecorder = useRef(null);
  const recordedChunks = useRef([]);
  const countdownRef = useRef(null);

  // 🎥 Start Camera
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    setStreaming(true);

    recordedChunks.current = [];
    mediaRecorder.current = new MediaRecorder(stream);
    mediaRecorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) recordedChunks.current.push(event.data);
    };
    mediaRecorder.current.start();

    // ⏳ Start a 30s timer
    setTimer(30);
    countdownRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          stopCamera();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Reset session
    setIsSubmitted(false);
    setGrade(null);
    setFeedback("");
    setPoints(0);
  };

  // 🛑 Stop Camera
  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStreaming(false);

    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: "video/webm" });
        const videoURL = URL.createObjectURL(blob);
        setRecordedVideo({ blob, url: videoURL });
      };
    }

    // Stop timer
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setTimer(0);
  };

  // 📤 Submit Task
  const submitTask = async () => {
    if (!recordedVideo || isSubmitting || isSubmitted) return;
    setIsSubmitting(true);

    try {
      // Upload video
      const fileRef = ref(storage, `videos/${Date.now()}.webm`);
      await uploadBytes(fileRef, recordedVideo.blob);
      const url = await getDownloadURL(fileRef);

      // 🧠 Generate Fake AI Feedback
      const { grade: g, feedback: f, points: p } = generateFeedback(task);

      const user = auth.currentUser;
      await addDoc(collection(db, "submissions"), {
        task,
        videoUrl: url,
        athlete: user?.displayName || user?.email || "Unknown Athlete",
        createdAt: new Date(),
        grade: g,
        feedback: f,
        points: p,
      });

      setGrade(g);
      setFeedback(f);
      setPoints(p);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Error uploading:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-white">
      <h1 className="text-2xl font-bold">💪 Athlete Dashboard</h1>
      <h2 className="text-lg mt-2">🎯 Task: {task}</h2>
      {timer > 0 && <h3 className="mt-2 text-red-400">⏳ Time Left: {timer}s</h3>}

      <video ref={videoRef} autoPlay className="w-96 h-64 bg-black mt-4 rounded" />

      {recordedVideo && (
        <div className="mt-4">
          <h3 className="mb-2">🎥 Your Recording:</h3>
          <video controls src={recordedVideo.url} className="w-80 rounded" />
        </div>
      )}

      <div className="mt-4 flex gap-4">
        {!streaming ? (
          <button onClick={startCamera} className="px-4 py-2 bg-blue-600 rounded">
            Start Camera
          </button>
        ) : (
          <button onClick={stopCamera} className="px-4 py-2 bg-red-600 rounded">
            Stop Camera
          </button>
        )}

        {recordedVideo && (
          <button
            onClick={submitTask}
            disabled={isSubmitting || isSubmitted}
            className={`px-4 py-2 rounded ${
              isSubmitted
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isSubmitted ? "Submitted ✅" : "Submit & Analyze"}
          </button>
        )}

        <button
          onClick={() => setTask(tasks[Math.floor(Math.random() * tasks.length)])}
          className="px-4 py-2 bg-purple-600 rounded"
        >
          Get New Task
        </button>
      </div>

      {grade && (
        <div className="mt-6 text-lg font-semibold text-center">
          🏆 Grade: {grade}
          <p className="mt-2">💬 Feedback: {feedback}</p>
          <p className="mt-1">⭐ Points Earned: {points}</p>
        </div>
      )}
    </div>
  );
}
