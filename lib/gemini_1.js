// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// export async function analyzePosture(task, grade, issues) {
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // ✅ correct name

//   const prompt = `
//   Task: ${task}
//   Grade: ${grade}
//   Issues: ${issues.join(", ")}

//   1. Explain why this grade was given.
//   2. Suggest how to fix posture.
//   3. Give motivational feedback.
//   `;

//   const result = await model.generateContent(prompt);
//   return result.response.text();
// }
