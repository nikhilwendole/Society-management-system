import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Sparkles, Plus, Trash2 } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import Modal from "../components/Modal";
import { Input, Textarea, Button } from "../components/FormElements";
import { useAuth } from "../context/AuthContext";
import * as resourceService from "../services/resourceService";

const NoticeBoard = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [rawText, setRawText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });

  const loadNotices = () => {
    resourceService
      .getNotices()
      .then((res) => setNotices(res.data.notices))
      .catch(() => toast.error("Could not load notices"));
  };

  useEffect(loadNotices, []);

  const handleAiGenerate = async () => {
    if (!rawText.trim()) return toast.error("Enter a short instruction first");
    setAiLoading(true);
    try {
      const res = await resourceService.aiNoticeGenerator(rawText);
      setForm(res.data.result);
      toast.success("Notice drafted - review below");
    } catch (err) {
      toast.error(err.response?.data?.message || "AI generation failed");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await resourceService.createNotice(form);
      toast.success("Notice published");
      setModalOpen(false);
      setForm({ title: "", description: "" });
      setRawText("");
      loadNotices();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to publish notice");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await resourceService.deleteNotice(id);
      toast.success("Notice removed");
      loadNotices();
    } catch {
      toast.error("Failed to delete notice");
    }
  };

  return (
    <DashboardLayout title="Notice Board">
      {user.role === "admin" && (
        <div className="mb-4 flex justify-end">
          <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
            <Plus size={16} /> New Notice
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {notices.length === 0 && (
          <p className="text-ink/50">No notices posted yet.</p>
        )}
        {notices.map((notice) => (
          <div key={notice._id} className="rounded-lg border border-border bg-panel p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <h3 className="font-display font-semibold text-ink">{notice.title}</h3>
              {user.role === "admin" && (
                <button onClick={() => handleDelete(notice._id)} className="text-ink/30 hover:text-danger">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            <p className="mt-2 text-sm text-ink/70">{notice.description}</p>
            <p className="mt-3 text-xs text-ink/40">
              By {notice.createdBy?.name} · {new Date(notice.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Publish a notice">
        <div className="mb-4 rounded-md border border-dashed border-primary/40 bg-primary/5 p-3">
          <p className="mb-2 flex items-center gap-1 text-xs font-medium text-primary">
            <Sparkles size={14} /> AI Notice Generator
          </p>
          <Textarea
            placeholder='e.g. "Water supply will be off tomorrow"'
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />
          <Button type="button" variant="outline" onClick={handleAiGenerate} disabled={aiLoading}>
            {aiLoading ? "Generating..." : "Generate with AI"}
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <Button type="submit" disabled={submitting} className="mt-2 w-full">
            {submitting ? "Publishing..." : "Publish notice"}
          </Button>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default NoticeBoard;
