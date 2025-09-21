export function generateFeedback(task) {
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

  return { grade: "B", feedback: "👍 Decent form, keep practicing.", points: 10 };
}
