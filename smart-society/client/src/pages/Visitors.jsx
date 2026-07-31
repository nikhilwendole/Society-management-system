// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { Plus } from "lucide-react";
// import DashboardLayout from "../components/DashboardLayout";
// import Table from "../components/Table";
// import Modal from "../components/Modal";
// import Badge from "../components/Badge";
// import { Input, Button } from "../components/FormElements";
// import { useAuth } from "../context/AuthContext";
// import * as resourceService from "../services/resourceService";

// const Visitors = () => {
//   const { user } = useAuth();
//   const [visitors, setVisitors] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [form, setForm] = useState({ visitorName: "", phone: "", visitPurpose: "" });

//   const loadVisitors = () => {
//     resourceService
//       .getVisitors()
//       .then((res) => setVisitors(res.data.visitors))
//       .catch(() => toast.error("Could not load visitors"));
//   };

//   useEffect(loadVisitors, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       await resourceService.createVisitor(form);
//       toast.success("Visitor invited - pending admin approval");
//       setModalOpen(false);
//       setForm({ visitorName: "", phone: "", visitPurpose: "" });
//       loadVisitors();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to invite visitor");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleApproval = async (id, status) => {
//     try {
//       await resourceService.updateVisitorApproval(id, status);
//       toast.success(`Visitor ${status.toLowerCase()}`);
//       loadVisitors();
//     } catch {
//       toast.error("Failed to update approval");
//     }
//   };

//   const handleEntry = async (id) => {
//     try {
//       await resourceService.markVisitorEntry(id);
//       toast.success("Entry marked");
//       loadVisitors();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to mark entry");
//     }
//   };

//   const handleExit = async (id) => {
//     try {
//       await resourceService.markVisitorExit(id);
//       toast.success("Exit marked");
//       loadVisitors();
//     } catch {
//       toast.error("Failed to mark exit");
//     }
//   };

//   const columns = [
//     { key: "visitorName", label: "Visitor" },
//     { key: "phone", label: "Phone" },
//     { key: "visitPurpose", label: "Purpose" },
//     { key: "resident", label: "Resident", render: (row) => row.resident?.name },
//     { key: "approvalStatus", label: "Approval", render: (row) => <Badge value={row.approvalStatus} /> },
//     {
//       key: "entryExit",
//       label: "Entry / Exit",
//       render: (row) =>
//         row.entryTime
//           ? row.exitTime
//             ? "Completed"
//             : new Date(row.entryTime).toLocaleTimeString()
//           : "-",
//     },
//     {
//       key: "actions",
//       label: "Actions",
//       render: (row) => (
//         <div className="flex gap-2">
//           {user.role === "admin" && row.approvalStatus === "Pending" && (
//             <>
//               <Button variant="outline" onClick={() => handleApproval(row._id, "Approved")}>
//                 Approve
//               </Button>
//               <Button variant="danger" onClick={() => handleApproval(row._id, "Rejected")}>
//                 Reject
//               </Button>
//             </>
//           )}
//           {user.role === "guard" && row.approvalStatus === "Approved" && !row.entryTime && (
//             <Button variant="outline" onClick={() => handleEntry(row._id)}>
//               Mark Entry
//             </Button>
//           )}
//           {user.role === "guard" && row.entryTime && !row.exitTime && (
//             <Button variant="outline" onClick={() => handleExit(row._id)}>
//               Mark Exit
//             </Button>
//           )}
//         </div>
//       ),
//     },
//   ];

//   return (
//     <DashboardLayout title="Visitors">
//       {user.role === "member" && (
//         <div className="mb-4 flex justify-end">
//           <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
//             <Plus size={16} /> Invite Visitor
//           </Button>
//         </div>
//       )}

//       <Table columns={columns} data={visitors} emptyMessage="No visitor records yet" />

//       <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Invite a visitor">
//         <form onSubmit={handleSubmit}>
//           <Input
//             label="Visitor name"
//             value={form.visitorName}
//             onChange={(e) => setForm({ ...form, visitorName: e.target.value })}
//             required
//           />
//           <Input
//             label="Phone"
//             value={form.phone}
//             onChange={(e) => setForm({ ...form, phone: e.target.value })}
//             required
//           />
//           <Input
//             label="Purpose of visit"
//             value={form.visitPurpose}
//             onChange={(e) => setForm({ ...form, visitPurpose: e.target.value })}
//             required
//           />
//           <Button type="submit" disabled={submitting} className="mt-2 w-full">
//             {submitting ? "Sending invite..." : "Send invite"}
//           </Button>
//         </form>
//       </Modal>
//     </DashboardLayout>
//   );
// };

// export default Visitors;






import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { Plus, Search, Trash2, DoorOpen, LogOut as LogOutIcon } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import Table from "../components/Table";
import Modal from "../components/Modal";
import Badge from "../components/Badge";
import { Input, Textarea, Select, Button } from "../components/FormElements";
import { useAuth } from "../context/AuthContext";
import * as resourceService from "../services/resourceService";

const VISITOR_TYPES = [
  "Guest",
  "Delivery",
  "Maid",
  "Electrician",
  "Plumber",
  "Technician",
  "Driver",
  "Family",
  "Relative",
  "Friend",
  "Courier",
  "Other",
];

const STATUS_TABS = ["All", "Pending", "Approved", "Entered", "Rejected", "Exited"];

const emptyForm = {
  visitorName: "",
  visitorType: "Guest",
  mobile: "",
  vehicleNumber: "",
  purpose: "",
  flat: "",
  numberOfVisitors: 1,
  expectedExitTime: "",
  remarks: "",
};

// ---------- Guard: new visitor entry form ----------
const NewVisitorModal = ({ open, onClose, flats, onCreated }) => {
  const [form, setForm] = useState(emptyForm);
  const [visitorPhoto, setVisitorPhoto] = useState(null);
  const [idProof, setIdProof] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const selectedFlat = flats.find((f) => f._id === form.flat);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^[0-9]{10}$/.test(form.mobile)) {
      return toast.error("Mobile number must be exactly 10 digits");
    }
    if (!form.flat) return toast.error("Select a flat");

    setSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, val]) => data.append(key, val));
      if (visitorPhoto) data.append("visitorPhoto", visitorPhoto);
      if (idProof) data.append("idProof", idProof);

      await resourceService.createVisitor(data);
      toast.success("Visitor request sent to resident for approval");
      setForm(emptyForm);
      setVisitorPhoto(null);
      setIdProof(null);
      onCreated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create visitor entry");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="New Visitor Entry">
      <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto pr-1">
        <Input
          label="Visitor name *"
          value={form.visitorName}
          onChange={(e) => setForm({ ...form, visitorName: e.target.value })}
          required
        />
        <Select
          label="Visitor type"
          value={form.visitorType}
          onChange={(e) => setForm({ ...form, visitorType: e.target.value })}
          options={VISITOR_TYPES}
        />
        <Input
          label="Mobile number *"
          value={form.mobile}
          onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, "") })}
          maxLength={10}
          placeholder="10 digit number"
          required
        />
        <Input
          label="Vehicle number (optional)"
          value={form.vehicleNumber}
          onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })}
          placeholder="MH12AB1234"
        />
        <Input
          label="Purpose of visit *"
          value={form.purpose}
          onChange={(e) => setForm({ ...form, purpose: e.target.value })}
          placeholder="e.g. Food Delivery, Family Visit"
          required
        />

        <label className="mb-3 block text-sm">
          <span className="mb-1 block font-medium text-ink/70">Flat *</span>
          <select
            value={form.flat}
            onChange={(e) => setForm({ ...form, flat: e.target.value })}
            required
            className="w-full rounded-md border border-border bg-white px-3 py-2 text-ink outline-none focus:border-primary"
          >
            <option value="">Select a flat</option>
            {flats.map((f) => (
              <option key={f._id} value={f._id}>
                {f.block}-{f.flatNumber}
              </option>
            ))}
          </select>
        </label>

        {/* Resident name is auto-populated once a flat is selected - read-only, not editable */}
        <Input label="Resident" value={selectedFlat?.owner?.name || "—"} disabled />

        <Input
          label="Number of visitors"
          type="number"
          min={1}
          value={form.numberOfVisitors}
          onChange={(e) => setForm({ ...form, numberOfVisitors: e.target.value })}
        />
        <Input
          label="Expected exit time (optional)"
          type="time"
          value={form.expectedExitTime}
          onChange={(e) => setForm({ ...form, expectedExitTime: e.target.value })}
        />
        <Textarea
          label="Remarks (optional)"
          value={form.remarks}
          onChange={(e) => setForm({ ...form, remarks: e.target.value })}
        />

        <label className="mb-3 block text-sm">
          <span className="mb-1 block font-medium text-ink/70">Visitor photo</span>
          <input type="file" accept="image/*" onChange={(e) => setVisitorPhoto(e.target.files[0])} />
          {visitorPhoto && (
            <img
              src={URL.createObjectURL(visitorPhoto)}
              alt="Preview"
              className="mt-2 h-20 w-20 rounded-md object-cover"
            />
          )}
        </label>

        <label className="mb-3 block text-sm">
          <span className="mb-1 block font-medium text-ink/70">
            ID proof (optional - Aadhaar / PAN / License / Passport)
          </span>
          <input type="file" accept="image/*" onChange={(e) => setIdProof(e.target.files[0])} />
        </label>

        <Button type="submit" disabled={submitting} className="mt-2 w-full">
          {submitting ? "Submitting..." : "Send for approval"}
        </Button>
      </form>
    </Modal>
  );
};

// ---------- Resident: pending approval card ----------
const ApprovalCard = ({ visitor, onApprove, onReject }) => (
  <div className="flex gap-4 rounded-lg border border-border bg-panel p-4 shadow-sm">
    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-surface">
      {visitor.visitorPhoto?.url ? (
        <img src={visitor.visitorPhoto.url} alt={visitor.visitorName} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs text-ink/30">No photo</div>
      )}
    </div>
    <div className="flex-1">
      <p className="font-medium text-ink">{visitor.visitorName}</p>
      <p className="text-xs text-ink/50">
        {visitor.visitorType} · {visitor.mobile}
        {visitor.vehicleNumber ? ` · ${visitor.vehicleNumber}` : ""}
      </p>
      <p className="mt-1 text-sm text-ink/70">{visitor.purpose}</p>
      <p className="mt-1 text-xs text-ink/40">{new Date(visitor.createdAt).toLocaleString()}</p>
      <div className="mt-3 flex gap-2">
        <Button onClick={() => onApprove(visitor._id)}>Approve</Button>
        <Button variant="danger" onClick={() => onReject(visitor._id)}>
          Reject
        </Button>
      </div>
    </div>
  </div>
);

const Visitors = () => {
  const { user } = useAuth();
  const [visitors, setVisitors] = useState([]);
  const [flats, setFlats] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const loadVisitors = useCallback(() => {
    const params = {};
    if (activeTab !== "All") params.status = activeTab;
    if (search) params.search = search;
    if (user.role === "guard") params.all = "true"; // guard: show full list, filter via tabs instead of "today only"

    resourceService
      .getVisitors(params)
      .then((res) => setVisitors(res.data.visitors))
      .catch(() => toast.error("Could not load visitors"));
  }, [activeTab, search, user.role]);

  useEffect(() => {
    loadVisitors();
  }, [loadVisitors]);

  useEffect(() => {
    if (user.role === "guard" || user.role === "admin") {
      resourceService.getFlats().then((res) => setFlats(res.data.flats)).catch(() => {});
    }
  }, [user.role]);

  const handleApprove = async (id) => {
    try {
      await resourceService.approveVisitor(id);
      toast.success("Visitor approved");
      loadVisitors();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve");
    }
  };

  const handleReject = async (id) => {
    try {
      await resourceService.rejectVisitor(id);
      toast.success("Visitor rejected");
      loadVisitors();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject");
    }
  };

  const handleEntry = async (id) => {
    try {
      await resourceService.markVisitorEntry(id);
      toast.success("Entry allowed");
      loadVisitors();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to mark entry");
    }
  };

  const handleExit = async (id) => {
    try {
      await resourceService.markVisitorExit(id);
      toast.success("Exit recorded");
      loadVisitors();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to mark exit");
    }
  };

  const handleDelete = async (id) => {
    try {
      await resourceService.deleteVisitor(id);
      toast.success("Visitor record deleted");
      loadVisitors();
    } catch {
      toast.error("Failed to delete visitor");
    }
  };

  const baseColumns = [
    {
      key: "visitorPhoto",
      label: "Photo",
      render: (row) =>
        row.visitorPhoto?.url ? (
          <img src={row.visitorPhoto.url} alt="" className="h-9 w-9 rounded-full object-cover" />
        ) : (
          <div className="h-9 w-9 rounded-full bg-surface" />
        ),
    },
    { key: "visitorName", label: "Visitor" },
    { key: "visitorType", label: "Type" },
    { key: "mobile", label: "Mobile" },
    { key: "vehicleNumber", label: "Vehicle", render: (row) => row.vehicleNumber || "-" },
    { key: "purpose", label: "Purpose" },
    {
      key: "flat",
      label: "Flat",
      render: (row) => (row.flat ? `${row.flat.block}-${row.flat.flatNumber}` : "-"),
    },
    { key: "resident", label: "Resident", render: (row) => row.resident?.name || "-" },
    { key: "status", label: "Status", render: (row) => <Badge value={row.status} /> },
  ];

  const guardColumns = [
    ...baseColumns,
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          {row.status === "Approved" && (
            <Button variant="outline" onClick={() => handleEntry(row._id)} className="flex items-center gap-1">
              <DoorOpen size={14} /> Allow Entry
            </Button>
          )}
          {row.status === "Entered" && (
            <Button variant="outline" onClick={() => handleExit(row._id)} className="flex items-center gap-1">
              <LogOutIcon size={14} /> Mark Exit
            </Button>
          )}
          {row.status === "Rejected" && <span className="text-xs text-danger">Entry denied</span>}
        </div>
      ),
    },
  ];

  const adminColumns = [
    ...baseColumns,
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <button onClick={() => handleDelete(row._id)} className="text-ink/40 hover:text-danger">
          <Trash2 size={16} />
        </button>
      ),
    },
  ];

  // ---------- Member (resident) view ----------
  if (user.role === "member") {
    const pending = visitors.filter((v) => v.status === "Pending");
    const history = visitors.filter((v) => v.status !== "Pending");

    return (
      <DashboardLayout title="Visitors">
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 font-display font-semibold text-ink">Pending Approval</h3>
            {pending.length === 0 ? (
              <p className="text-sm text-ink/40">No visitor requests waiting on you right now.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {pending.map((v) => (
                  <ApprovalCard key={v._id} visitor={v} onApprove={handleApprove} onReject={handleReject} />
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-3 font-display font-semibold text-ink">Visitor History</h3>
            <Table columns={baseColumns} data={history} emptyMessage="No visitor history yet" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ---------- Guard view ----------
  if (user.role === "guard") {
    return (
      <DashboardLayout title="Visitor Entry">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2 overflow-x-auto">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ${
                  activeTab === tab ? "bg-primary text-white" : "bg-surface text-ink/60 hover:bg-primary/10"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
            <Plus size={16} /> New Visitor Entry
          </Button>
        </div>

        <Table columns={guardColumns} data={visitors} emptyMessage="No visitors found" />

        <NewVisitorModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          flats={flats}
          onCreated={loadVisitors}
        />
      </DashboardLayout>
    );
  }

  // ---------- Admin view ----------
  return (
    <DashboardLayout title="Visitors">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 overflow-x-auto">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ${
                activeTab === tab ? "bg-primary text-white" : "bg-surface text-ink/60 hover:bg-primary/10"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, mobile, vehicle..."
            className="rounded-md border border-border py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>

      <Table columns={adminColumns} data={visitors} emptyMessage="No visitor records found" />
    </DashboardLayout>
  );
};

export default Visitors;