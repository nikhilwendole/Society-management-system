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

const Maintenance = () => {
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [flats, setFlats] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ flat: "", resident: "", amount: "", month: "" });

  const loadBills = () => {
    resourceService
      .getBills()
      .then((res) => setBills(res.data.bills))
      .catch(() => toast.error("Could not load maintenance bills"));
  };

  useEffect(() => {
    loadBills();
    if (user.role === "admin") {
      resourceService.getFlats().then((res) => setFlats(res.data.flats)).catch(() => {});
    }
  }, []);

  const handleFlatChange = (flatId) => {
    const flat = flats.find((f) => f._id === flatId);
    setForm({ ...form, flat: flatId, resident: flat?.owner?._id || "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await resourceService.createBill(form);
      toast.success("Bill created");
      setModalOpen(false);
      setForm({ flat: "", resident: "", amount: "", month: "" });
      loadBills();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create bill");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkPaid = async (id) => {
    try {
      await resourceService.markBillPaid(id);
      toast.success("Marked as paid");
      loadBills();
    } catch {
      toast.error("Failed to update bill");
    }
  };

  const columns = [
    { key: "month", label: "Month" },
    { key: "flat", label: "Flat", render: (row) => `${row.flat?.block}-${row.flat?.flatNumber}` },
    { key: "resident", label: "Resident", render: (row) => row.resident?.name },
    { key: "amount", label: "Amount", render: (row) => `₹${row.amount}` },
    { key: "paymentStatus", label: "Status", render: (row) => <Badge value={row.paymentStatus} /> },
    ...(user.role === "admin"
      ? [
          {
            key: "actions",
            label: "Action",
            render: (row) =>
              row.paymentStatus === "Pending" ? (
                <Button variant="outline" onClick={() => handleMarkPaid(row._id)}>
                  Mark Paid
                </Button>
              ) : (
                "-"
              ),
          },
        ]
      : []),
  ];

  return (
    <DashboardLayout title="Maintenance">
      {user.role === "admin" && (
        <div className="mb-4 flex justify-end">
          <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
            <Plus size={16} /> New Bill
          </Button>
        </div>
      )}

      <Table columns={columns} data={bills} emptyMessage="No maintenance bills yet" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create maintenance bill">
        <form onSubmit={handleSubmit}>
          <label className="mb-3 block text-sm">
            <span className="mb-1 block font-medium text-ink/70">Flat</span>
            <select
              value={form.flat}
              onChange={(e) => handleFlatChange(e.target.value)}
              required
              className="w-full rounded-md border border-border bg-white px-3 py-2 text-ink outline-none focus:border-primary"
            >
              <option value="">Select a flat</option>
              {flats.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.block}-{f.flatNumber} ({f.owner?.name || "unassigned"})
                </option>
              ))}
            </select>
          </label>
          <Input
            label="Amount (₹)"
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />
          <Input
            label="Month"
            type="month"
            value={form.month}
            onChange={(e) => setForm({ ...form, month: e.target.value })}
            required
          />
          <Button type="submit" disabled={submitting} className="mt-2 w-full">
            {submitting ? "Creating..." : "Create bill"}
          </Button>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default Maintenance;
