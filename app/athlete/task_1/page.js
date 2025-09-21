"use client";
import { useState, useRef, useEffect } from "react";
import { storage, db } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { analyzePosture } from "@/lib/pose";

const tasks = [
  { text: "Do 10 pushups", time: 20 },
  { text: "Hold a plank for 30 seconds", time: 30 },
  { text: "Do 15 squats", time: 25 },
  { text: "Jumping jacks for 20 seconds", time: 20 },
];

export default function AthleteTask() {
  const videoRef = useRef(null);
  const previewRef = useRef(null);
  const mediaRecorder = useRef(null);
  const recordedChunks = useRef([]);
  const [streaming, setStreaming] = useState(false);
  const [task, setTask] = useState(tasks[Math.floor(Math.random() * tasks.length)]);
  const [timer, setTimer] = useState(task.time);
  const [videoURL, setVideoURL] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [streak, setStreak] = useState(0);

  // Timer countdown
  useEffect(() => {
    let interval;
    if (streaming && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0) {
      stopCamera();
    }
    return () => clearInterval(interval);
  }, [streaming, timer]);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    setStreaming(true);
    setTimer(task.time);

    recordedChunks.current = [];
    mediaRecorder.current = new MediaRecorder(stream);
    mediaRecorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) recordedChunks.current.push(event.data);
    };
    mediaRecorder.current.onstop = () => {
      const blob = new Blob(recordedChunks.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setVideoURL(url);
    };
    mediaRecorder.current.start();
  };

  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    if (stream) stream.getTracks().forEach((track) => track.stop());
    setStreaming(false);
    if (mediaRecorder.current) mediaRecorder.current.stop();
  };

  const analyzeVideo = async () => {
    if (!videoURL) return;

    // fake grading logic until joints detection integrated
    const grades = ["A", "B+", "B", "C", "F"];
    const chosenGrade = grades[Math.floor(Math.random() * grades.length)];
    const fakeIssues = ["arms not fully extended", "back posture uneven"];
    const points = chosenGrade === "A" ? 100 : chosenGrade === "B+" ? 80 : 50;

    const feedbackText = await analyzePosture(task.text, chosenGrade, fakeIssues);

    setAnalysis({
      grade: chosenGrade,
      feedback: feedbackText,
      points,
    });
    setStreak((prev) => prev + 1);

    // Save in DB
    const fileRef = ref(storage, `videos/${Date.now()}.webm`);
    const blob = new Blob(recordedChunks.current, { type: "video/webm" });
    await uploadBytes(fileRef, blob);
    const url = await getDownloadURL(fileRef);

    await addDoc(collection(db, "submissions"), {
      task: task.text,
      videoUrl: url,
      athlete: "Test Athlete", // replace with auth
      grade: chosenGrade,
      feedback: feedbackText,
      points,
      createdAt: new Date(),
    });
  };

  return (
    <div className="flex flex-col items-center p-8 text-white">
      <h1 className="text-2xl font-bold">🎯 Task: {task.text}</h1>
      <p className="mt-2 text-lg">⏳ Time Left: {timer}s</p>

      <video ref={videoRef} autoPlay muted className="w-96 h-64 bg-black mt-4 rounded" />

      {videoURL && (
        <div className="mt-4">
          <p className="mb-2">📹 Preview your video:</p>
          <video ref={previewRef} src={videoURL} controls className="w-96 rounded" />
        </div>
      )}

      <div className="mt-4 flex gap-4">
        {!streaming ? (
          <button onClick={startCamera} className="px-4 py-2 bg-blue-600 rounded">
            Start Task
          </button>
        ) : (
          <button onClick={stopCamera} className="px-4 py-2 bg-red-600 rounded">
            Stop Task
          </button>
        )}
        {videoURL && (
          <button onClick={analyzeVideo} className="px-4 py-2 bg-green-600 rounded">
            Submit & Analyze
          </button>
        )}
      </div>

      {analysis && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg w-96">
          <p className="text-lg">🏆 Grade: {analysis.grade}</p>
          <p className="text-yellow-400">⭐ Points: {analysis.points}</p>
          <p className="text-blue-300">🔥 Streak: {streak}</p>
          <div className="mt-4">{analysis.feedback}</div>
        </div>
      )}
    </div>
  );
}
