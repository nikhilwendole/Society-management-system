// Minimal Gemini API wrapper using plain fetch - no extra SDK dependency needed.
// Docs: https://ai.google.dev/gemini-api/docs

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

const askGemini = async (prompt) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Gemini API request failed");
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return text.trim();
};

// Asks Gemini to return raw JSON and safely parses it (strips markdown fences if present)
const askGeminiJSON = async (prompt) => {
  const raw = await askGemini(prompt);
  const cleaned = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
};

module.exports = { askGemini, askGeminiJSON };
