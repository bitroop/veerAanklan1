// lib/roboflow.js

export async function analyzeWithRoboflow(blob) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_ROBOFLOW_API_KEY;
    const modelId = "YOUR_MODEL"; // replace with actual model name from Roboflow
    const version = 1;

    const res = await fetch(
      `https://detect.roboflow.com/${modelId}/${version}?api_key=${apiKey}`,
      {
        method: "POST",
        body: blob,
      }
    );

    if (!res.ok) {
      throw new Error(`Roboflow request failed: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Roboflow error:", err);
    return { error: true, message: err.message };
  }
}
