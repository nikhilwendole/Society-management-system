const { askGemini, askGeminiJSON } = require("../utils/geminiClient");
const Notice = require("../models/Notice");
const Maintenance = require("../models/Maintenance");
const Complaint = require("../models/Complaint");

// @desc    AI Complaint Assistant - takes raw resident text, returns improved
//          title, description, category, priority as structured JSON
// @route   POST /api/ai/complaint-assistant
// @access  Private/Member
const complaintAssistant = async (req, res, next) => {
  try {
    const { rawText } = req.body;
    if (!rawText) {
      return res.status(400).json({ success: false, message: "rawText is required" });
    }

    const prompt = `You are an assistant for a residential society complaint system.
A resident submitted this raw complaint text: "${rawText}"

Return ONLY valid JSON (no markdown, no extra text) with exactly these keys:
{
  "title": "a short professional complaint title (max 8 words)",
  "description": "a clear, professional rewrite of the complaint (2-3 sentences)",
  "category": "one of: Plumbing, Electrical, Security, Cleanliness, Noise, Other",
  "priority": "one of: Low, Medium, High"
}`;

    const result = await askGeminiJSON(prompt);
    res.status(200).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};

// @desc    AI Notice Generator - admin gives a short instruction, AI writes
//          a professional notice
// @route   POST /api/ai/notice-generator
// @access  Private/Admin
const noticeGenerator = async (req, res, next) => {
  try {
    const { rawText } = req.body;
    if (!rawText) {
      return res.status(400).json({ success: false, message: "rawText is required" });
    }

    const prompt = `You are writing an official notice for residents of a housing society.
Admin's instruction: "${rawText}"

Write a short, professional, polite notice (title + body). Return ONLY valid JSON:
{
  "title": "notice title",
  "description": "notice body, 2-4 sentences"
}`;

    const result = await askGeminiJSON(prompt);
    res.status(200).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};

// @desc    Society Chatbot - answers resident questions using real data
//          (notices + the user's own maintenance/complaint records) as context
// @route   POST /api/ai/chatbot
// @access  Private
const societyChatbot = async (req, res, next) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ success: false, message: "question is required" });
    }

    const [notices, bills, complaints] = await Promise.all([
      Notice.find().sort({ createdAt: -1 }).limit(5),
      Maintenance.find({ resident: req.user._id }).sort({ createdAt: -1 }).limit(5),
      Complaint.find({ createdBy: req.user._id }).sort({ createdAt: -1 }).limit(5),
    ]);

    const context = `
Recent Notices:
${notices.map((n) => `- ${n.title}: ${n.description}`).join("\n") || "None"}

This resident's Maintenance Bills:
${bills.map((b) => `- ${b.month}: amount ${b.amount}, status ${b.paymentStatus}`).join("\n") || "None"}

This resident's Complaints:
${complaints.map((c) => `- ${c.title} (${c.status})`).join("\n") || "None"}
`;

    const prompt = `You are a helpful chatbot for a residential society, answering only using the data below.
If the answer isn't in the data, politely say you don't have that information and suggest contacting the admin.

DATA:
${context}

Resident's question: "${question}"

Answer concisely in 2-3 sentences.`;

    const answer = await askGemini(prompt);
    res.status(200).json({ success: true, answer });
  } catch (error) {
    next(error);
  }
};

// @desc    Meeting Summary Generator - admin pastes raw meeting notes, AI
//          returns summary, decisions, action items
// @route   POST /api/ai/meeting-summary
// @access  Private/Admin
const meetingSummary = async (req, res, next) => {
  try {
    const { notes } = req.body;
    if (!notes) {
      return res.status(400).json({ success: false, message: "notes is required" });
    }

    const prompt = `You are summarizing a society committee meeting. Here are the raw notes:
"${notes}"

Return ONLY valid JSON with exactly these keys:
{
  "summary": "a short paragraph summarizing the meeting",
  "decisions": ["decision 1", "decision 2"],
  "actionItems": ["action item 1", "action item 2"]
}`;

    const result = await askGeminiJSON(prompt);
    res.status(200).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};

module.exports = { complaintAssistant, noticeGenerator, societyChatbot, meetingSummary };
