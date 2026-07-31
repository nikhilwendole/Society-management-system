// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { Sparkles, Plus } from "lucide-react";
// import DashboardLayout from "../components/DashboardLayout";
// import Table from "../components/Table";
// import Modal from "../components/Modal";
// import Badge from "../components/Badge";
// import { Input, Textarea, Select, Button } from "../components/FormElements";
// import { useAuth } from "../context/AuthContext";
// import * as resourceService from "../services/resourceService";

// const Complaints = () => {
//   const { user } = useAuth();
//   const [complaints, setComplaints] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [aiLoading, setAiLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [rawText, setRawText] = useState("");
//   const [image, setImage] = useState(null);
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     category: "Other",
//     priority: "Medium",
//   });

//   const loadComplaints = () => {
//     resourceService
//       .getComplaints()
//       .then((res) => setComplaints(res.data.complaints))
//       .catch(() => toast.error("Could not load complaints"));
//   };

//   useEffect(loadComplaints, []);

//   // Sends the resident's raw text to the AI Complaint Assistant and
//   // auto-fills the professional title/description/category/priority
//   const handleAiImprove = async () => {
//     if (!rawText.trim()) return toast.error("Describe the issue first");
//     setAiLoading(true);
//     try {
//       const res = await resourceService.aiComplaintAssistant(rawText);
//       setForm(res.data.result);
//       toast.success("AI improved your complaint - review below");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "AI Assistant failed");
//     } finally {
//       setAiLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       const data = new FormData();
//       Object.entries(form).forEach(([key, val]) => data.append(key, val));
//       if (image) data.append("image", image);

//       await resourceService.createComplaint(data);
//       toast.success("Complaint submitted");
//       setModalOpen(false);
//       setForm({ title: "", description: "", category: "Other", priority: "Medium" });
//       setRawText("");
//       setImage(null);
//       loadComplaints();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to submit complaint");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleStatusChange = async (id, status) => {
//     try {
//       await resourceService.updateComplaintStatus(id, status);
//       toast.success("Status updated");
//       loadComplaints();
//     } catch {
//       toast.error("Failed to update status");
//     }
//   };

//   const columns = [
//     { key: "title", label: "Title" },
//     { key: "category", label: "Category" },
//     { key: "priority", label: "Priority", render: (row) => <Badge value={row.priority} /> },
//     { key: "status", label: "Status", render: (row) => <Badge value={row.status} /> },
//     {
//       key: "createdBy",
//       label: "Resident",
//       render: (row) => row.createdBy?.name || "-",
//     },
//     ...(user.role === "admin"
//       ? [
//           {
//             key: "actions",
//             label: "Update status",
//             render: (row) => (
//               <Select
//                 value={row.status}
//                 onChange={(e) => handleStatusChange(row._id, e.target.value)}
//                 options={["Pending", "In Progress", "Resolved"]}
//               />
//             ),
//           },
//         ]
//       : []),
//   ];

//   return (
//     <DashboardLayout title="Complaints">
//       <div className="mb-4 flex justify-end">
//         {user.role === "member" && (
//           <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
//             <Plus size={16} /> New Complaint
//           </Button>
//         )}
//       </div>

//       <Table columns={columns} data={complaints} emptyMessage="No complaints yet" />

//       <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Raise a complaint">
//         <div className="mb-4 rounded-md border border-dashed border-primary/40 bg-primary/5 p-3">
//           <p className="mb-2 flex items-center gap-1 text-xs font-medium text-primary">
//             <Sparkles size={14} /> AI Complaint Assistant
//           </p>
//           <Textarea
//             placeholder='e.g. "Water leakage in kitchen"'
//             value={rawText}
//             onChange={(e) => setRawText(e.target.value)}
//           />
//           <Button type="button" variant="outline" onClick={handleAiImprove} disabled={aiLoading}>
//             {aiLoading ? "Improving..." : "Improve with AI"}
//           </Button>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <Input
//             label="Title"
//             value={form.title}
//             onChange={(e) => setForm({ ...form, title: e.target.value })}
//             required
//           />
//           <Textarea
//             label="Description"
//             value={form.description}
//             onChange={(e) => setForm({ ...form, description: e.target.value })}
//             required
//           />
//           <Select
//             label="Category"
//             value={form.category}
//             onChange={(e) => setForm({ ...form, category: e.target.value })}
//             options={["Plumbing", "Electrical", "Security", "Cleanliness", "Noise", "Other"]}
//           />
//           <Select
//             label="Priority"
//             value={form.priority}
//             onChange={(e) => setForm({ ...form, priority: e.target.value })}
//             options={["Low", "Medium", "High"]}
//           />
//           <Input
//             label="Attach photo (optional)"
//             type="file"
//             accept="image/*"
//             onChange={(e) => setImage(e.target.files[0])}
//           />
//           <Button type="submit" disabled={submitting} className="mt-2 w-full">
//             {submitting ? "Submitting..." : "Submit complaint"}
//           </Button>
//         </form>
//       </Modal>
//     </DashboardLayout>
//   );
// };

// export default Complaints;









import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Sparkles, Plus, Eye } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import Table from "../components/Table";
import Modal from "../components/Modal";
import Badge from "../components/Badge";
import { Input, Textarea, Select, Button } from "../components/FormElements";
import { useAuth } from "../context/AuthContext";
import * as resourceService from "../services/resourceService";

// ---------- Full complaint detail modal (description + full-size image) ----------
const DetailModal = ({ complaint, onClose }) => {
  if (!complaint) return null;

  return (
    <Modal open={!!complaint} onClose={onClose} title={complaint.title}>
      <div className="space-y-4">
        {complaint.image?.url && (
          <img
            src={complaint.image.url}
            alt={complaint.title}
            className="max-h-80 w-full rounded-md object-contain bg-surface"
          />
        )}

        <div className="flex flex-wrap gap-2">
          <Badge value={complaint.category} />
          <Badge value={complaint.priority} />
          <Badge value={complaint.status} />
        </div>

        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-ink/40">Description</p>
          <p className="whitespace-pre-wrap text-sm text-ink/80">{complaint.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-border pt-3 text-xs text-ink/50">
          <p>
            <span className="font-medium text-ink/70">Raised by:</span>{" "}
            {complaint.createdBy?.name || "-"}
          </p>
          <p>
            <span className="font-medium text-ink/70">Date:</span>{" "}
            {new Date(complaint.createdAt).toLocaleString()}
          </p>
          {complaint.resolvedAt && (
            <p className="col-span-2">
              <span className="font-medium text-ink/70">Resolved:</span>{" "}
              {new Date(complaint.resolvedAt).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

const Complaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rawText, setRawText] = useState("");
  const [image, setImage] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Other",
    priority: "Medium",
  });

  const loadComplaints = () => {
    resourceService
      .getComplaints()
      .then((res) => setComplaints(res.data.complaints))
      .catch(() => toast.error("Could not load complaints"));
  };

  useEffect(loadComplaints, []);

  const handleAiImprove = async () => {
    if (!rawText.trim()) return toast.error("Describe the issue first");
    setAiLoading(true);
    try {
      const res = await resourceService.aiComplaintAssistant(rawText);
      setForm(res.data.result);
      toast.success("AI improved your complaint - review below");
    } catch (err) {
      toast.error(err.response?.data?.message || "AI Assistant failed");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, val]) => data.append(key, val));
      if (image) data.append("image", image);

      await resourceService.createComplaint(data);
      toast.success("Complaint submitted");
      setModalOpen(false);
      setForm({ title: "", description: "", category: "Other", priority: "Medium" });
      setRawText("");
      setImage(null);
      loadComplaints();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit complaint");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await resourceService.updateComplaintStatus(id, status);
      toast.success("Status updated");
      loadComplaints();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const openDetail = async (id) => {
    try {
      const res = await resourceService.getComplaintById(id);
      setSelectedComplaint(res.data.complaint);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not load complaint details");
    }
  };

  const columns = [
    {
      key: "image",
      label: "Photo",
      render: (row) =>
        row.image?.url ? (
          <img
            src={row.image.url}
            alt={row.title}
            className="h-10 w-10 cursor-pointer rounded-md object-cover"
            onClick={() => openDetail(row._id)}
          />
        ) : (
          <div className="h-10 w-10 rounded-md bg-surface" />
        ),
    },
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "priority", label: "Priority", render: (row) => <Badge value={row.priority} /> },
    { key: "status", label: "Status", render: (row) => <Badge value={row.status} /> },
    {
      key: "createdBy",
      label: "Resident",
      render: (row) => row.createdBy?.name || "-",
    },
    {
      key: "view",
      label: "Details",
      render: (row) => (
        <button
          onClick={() => openDetail(row._id)}
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <Eye size={14} /> View
        </button>
      ),
    },
    ...(user.role === "admin"
      ? [
          {
            key: "actions",
            label: "Update status",
            render: (row) => (
              <Select
                value={row.status}
                onChange={(e) => handleStatusChange(row._id, e.target.value)}
                options={["Pending", "In Progress", "Resolved"]}
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <DashboardLayout title="Complaints">
      <div className="mb-4 flex justify-end">
        {user.role === "member" && (
          <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
            <Plus size={16} /> New Complaint
          </Button>
        )}
      </div>

      <Table columns={columns} data={complaints} emptyMessage="No complaints yet" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Raise a complaint">
        <div className="mb-4 rounded-md border border-dashed border-primary/40 bg-primary/5 p-3">
          <p className="mb-2 flex items-center gap-1 text-xs font-medium text-primary">
            <Sparkles size={14} /> AI Complaint Assistant
          </p>
          <Textarea
            placeholder='e.g. "Water leakage in kitchen"'
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />
          <Button type="button" variant="outline" onClick={handleAiImprove} disabled={aiLoading}>
            {aiLoading ? "Improving..." : "Improve with AI"}
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
          <Select
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            options={["Plumbing", "Electrical", "Security", "Cleanliness", "Noise", "Other"]}
          />
          <Select
            label="Priority"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            options={["Low", "Medium", "High"]}
          />
          <label className="mb-3 block text-sm">
            <span className="mb-1 block font-medium text-ink/70">Attach photo (optional)</span>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="mt-2 h-20 w-20 rounded-md object-cover"
              />
            )}
          </label>
          <Button type="submit" disabled={submitting} className="mt-2 w-full">
            {submitting ? "Submitting..." : "Submit complaint"}
          </Button>
        </form>
      </Modal>

      <DetailModal complaint={selectedComplaint} onClose={() => setSelectedComplaint(null)} />
    </DashboardLayout>
  );
};

export default Complaints;