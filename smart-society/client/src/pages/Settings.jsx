import { useState } from "react";
import toast from "react-hot-toast";
import { Sparkles, Send } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { Textarea, Button } from "../components/FormElements";
import { useAuth } from "../context/AuthContext";
import * as resourceService from "../services/resourceService";

const ChatbotPanel = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    const userMsg = question;
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setQuestion("");
    setLoading(true);
    try {
      const res = await resourceService.aiChatbot(userMsg);
      setMessages((m) => [...m, { role: "bot", text: res.data.answer }]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Chatbot failed to respond");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-panel p-5">
      <h3 className="mb-3 flex items-center gap-2 font-display font-semibold text-ink">
        <Sparkles size={16} className="text-primary" /> Society Chatbot
      </h3>
      <div className="mb-3 h-64 overflow-y-auto rounded-md bg-surface p-3">
        {messages.length === 0 && (
          <p className="text-sm text-ink/40">
            Ask about your maintenance dues, complaints, or recent notices.
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-2 max-w-[85%] rounded-md px-3 py-2 text-sm ${
              m.role === "user" ? "ml-auto bg-primary text-white" : "bg-panel text-ink/80"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleAsk} className="flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. When is my maintenance due?"
          className="flex-1 rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <Button type="submit" disabled={loading}>
          <Send size={16} />
        </Button>
      </form>
    </div>
  );
};

const MeetingSummaryPanel = () => {
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!notes.trim()) return toast.error("Paste meeting notes first");
    setLoading(true);
    try {
      const res = await resourceService.aiMeetingSummary(notes);
      setResult(res.data.result);
    } catch (err) {
      toast.error(err.response?.data?.message || "Summary generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-panel p-5">
      <h3 className="mb-3 flex items-center gap-2 font-display font-semibold text-ink">
        <Sparkles size={16} className="text-primary" /> Meeting Summary Generator
      </h3>
      <Textarea
        placeholder="Paste raw committee meeting notes here..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={5}
      />
      <Button onClick={handleSummarize} disabled={loading} variant="outline">
        {loading ? "Summarizing..." : "Generate summary"}
      </Button>

      {result && (
        <div className="mt-4 space-y-3 text-sm">
          <div>
            <p className="font-medium text-ink/70">Summary</p>
            <p className="text-ink/60">{result.summary}</p>
          </div>
          <div>
            <p className="font-medium text-ink/70">Decisions</p>
            <ul className="list-inside list-disc text-ink/60">
              {result.decisions?.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium text-ink/70">Action Items</p>
            <ul className="list-inside list-disc text-ink/60">
              {result.actionItems?.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

const Settings = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout title="Settings">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChatbotPanel />
        {user.role === "admin" && <MeetingSummaryPanel />}
      </div>
    </DashboardLayout>
  );
};

export default Settings;
