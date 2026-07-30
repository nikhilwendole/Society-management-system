import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import Table from "../components/Table";
import Modal from "../components/Modal";
import Badge from "../components/Badge";
import { Input, Button } from "../components/FormElements";
import { useAuth } from "../context/AuthContext";
import * as resourceService from "../services/resourceService";

const Visitors = () => {
  const { user } = useAuth();
  const [visitors, setVisitors] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ visitorName: "", phone: "", visitPurpose: "" });

  const loadVisitors = () => {
    resourceService
      .getVisitors()
      .then((res) => setVisitors(res.data.visitors))
      .catch(() => toast.error("Could not load visitors"));
  };

  useEffect(loadVisitors, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await resourceService.createVisitor(form);
      toast.success("Visitor invited - pending admin approval");
      setModalOpen(false);
      setForm({ visitorName: "", phone: "", visitPurpose: "" });
      loadVisitors();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to invite visitor");
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproval = async (id, status) => {
    try {
      await resourceService.updateVisitorApproval(id, status);
      toast.success(`Visitor ${status.toLowerCase()}`);
      loadVisitors();
    } catch {
      toast.error("Failed to update approval");
    }
  };

  const handleEntry = async (id) => {
    try {
      await resourceService.markVisitorEntry(id);
      toast.success("Entry marked");
      loadVisitors();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to mark entry");
    }
  };

  const handleExit = async (id) => {
    try {
      await resourceService.markVisitorExit(id);
      toast.success("Exit marked");
      loadVisitors();
    } catch {
      toast.error("Failed to mark exit");
    }
  };

  const columns = [
    { key: "visitorName", label: "Visitor" },
    { key: "phone", label: "Phone" },
    { key: "visitPurpose", label: "Purpose" },
    { key: "resident", label: "Resident", render: (row) => row.resident?.name },
    { key: "approvalStatus", label: "Approval", render: (row) => <Badge value={row.approvalStatus} /> },
    {
      key: "entryExit",
      label: "Entry / Exit",
      render: (row) =>
        row.entryTime
          ? row.exitTime
            ? "Completed"
            : new Date(row.entryTime).toLocaleTimeString()
          : "-",
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          {user.role === "admin" && row.approvalStatus === "Pending" && (
            <>
              <Button variant="outline" onClick={() => handleApproval(row._id, "Approved")}>
                Approve
              </Button>
              <Button variant="danger" onClick={() => handleApproval(row._id, "Rejected")}>
                Reject
              </Button>
            </>
          )}
          {user.role === "guard" && row.approvalStatus === "Approved" && !row.entryTime && (
            <Button variant="outline" onClick={() => handleEntry(row._id)}>
              Mark Entry
            </Button>
          )}
          {user.role === "guard" && row.entryTime && !row.exitTime && (
            <Button variant="outline" onClick={() => handleExit(row._id)}>
              Mark Exit
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout title="Visitors">
      {user.role === "member" && (
        <div className="mb-4 flex justify-end">
          <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
            <Plus size={16} /> Invite Visitor
          </Button>
        </div>
      )}

      <Table columns={columns} data={visitors} emptyMessage="No visitor records yet" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Invite a visitor">
        <form onSubmit={handleSubmit}>
          <Input
            label="Visitor name"
            value={form.visitorName}
            onChange={(e) => setForm({ ...form, visitorName: e.target.value })}
            required
          />
          <Input
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          <Input
            label="Purpose of visit"
            value={form.visitPurpose}
            onChange={(e) => setForm({ ...form, visitPurpose: e.target.value })}
            required
          />
          <Button type="submit" disabled={submitting} className="mt-2 w-full">
            {submitting ? "Sending invite..." : "Send invite"}
          </Button>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default Visitors;
