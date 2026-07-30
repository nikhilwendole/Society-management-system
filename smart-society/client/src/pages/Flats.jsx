import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import Table from "../components/Table";
import Modal from "../components/Modal";
import { Input, Button } from "../components/FormElements";
import * as resourceService from "../services/resourceService";

const Flats = () => {
  const [flats, setFlats] = useState([]);
  const [residents, setResidents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ flatNumber: "", block: "", owner: "" });

  const loadData = () => {
    resourceService.getFlats().then((res) => setFlats(res.data.flats)).catch(() => toast.error("Could not load flats"));
    resourceService.getUsers("member").then((res) => setResidents(res.data.users)).catch(() => {});
  };

  useEffect(loadData, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await resourceService.createFlat(form);
      toast.success("Flat added");
      setModalOpen(false);
      setForm({ flatNumber: "", block: "", owner: "" });
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add flat");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await resourceService.deleteFlat(id);
      toast.success("Flat removed");
      loadData();
    } catch {
      toast.error("Failed to remove flat");
    }
  };

  const columns = [
    { key: "block", label: "Block" },
    { key: "flatNumber", label: "Flat No." },
    { key: "owner", label: "Owner", render: (row) => row.owner?.name || "Unassigned" },
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

  return (
    <DashboardLayout title="Flats">
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
          <Plus size={16} /> Add Flat
        </Button>
      </div>

      <Table columns={columns} data={flats} emptyMessage="No flats added yet" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add flat">
        <form onSubmit={handleSubmit}>
          <Input
            label="Block"
            value={form.block}
            onChange={(e) => setForm({ ...form, block: e.target.value })}
            required
          />
          <Input
            label="Flat number"
            value={form.flatNumber}
            onChange={(e) => setForm({ ...form, flatNumber: e.target.value })}
            required
          />
          <label className="mb-3 block text-sm">
            <span className="mb-1 block font-medium text-ink/70">Owner (optional)</span>
            <select
              value={form.owner}
              onChange={(e) => setForm({ ...form, owner: e.target.value })}
              className="w-full rounded-md border border-border bg-white px-3 py-2 text-ink outline-none focus:border-primary"
            >
              <option value="">Unassigned</option>
              {residents.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>
          <Button type="submit" disabled={submitting} className="mt-2 w-full">
            {submitting ? "Adding..." : "Add flat"}
          </Button>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default Flats;
