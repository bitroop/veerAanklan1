// lib/pose.js

// Utility: angle between 3 body points
function getAngle(a, b, c) {
  const ab = [a.x - b.x, a.y - b.y];
  const cb = [c.x - b.x, c.y - b.y];
  const dot = ab[0] * cb[0] + ab[1] * cb[1];
  const magAB = Math.sqrt(ab[0] ** 2 + ab[1] ** 2);
  const magCB = Math.sqrt(cb[0] ** 2 + cb[1] ** 2);
  return Math.acos(dot / (magAB * magCB)) * (180 / Math.PI);
}

// Main function to analyze posture
export function analyzePose(task, keypoints) {
  let feedback = "Keep going!";
  let grade = "C";
  let points = 0;

  if (task.includes("pushups")) {
    const elbow = keypoints.find((p) => p.name === "left_elbow");
    const shoulder = keypoints.find((p) => p.name === "left_shoulder");
    const wrist = keypoints.find((p) => p.name === "left_wrist");

    if (elbow && shoulder && wrist) {
      const angle = getAngle(shoulder, elbow, wrist);
      if (angle < 100) {
        feedback = "Nice pushup depth!";
        grade = "A";
        points = 10;
      } else {
        feedback = "Bend elbows more, go lower.";
        grade = "C";
        points = 4;
      }
    }
  }

  if (task.includes("plank")) {
    const hip = keypoints.find((p) => p.name === "left_hip");
    const shoulder = keypoints.find((p) => p.name === "left_shoulder");
    const ankle = keypoints.find((p) => p.name === "left_ankle");

    if (hip && shoulder && ankle) {
      const angle = getAngle(shoulder, hip, ankle);
      if (angle > 160) {
        feedback = "Great plank posture!";
        grade = "A";
        points = 10;
      } else {
        feedback = "Keep your back straight, don’t sag hips.";
        grade = "D";
        points = 3;
      }
    }
  }

  return { grade, feedback, points };
}
