import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import Table from "../components/Table";
import Modal from "../components/Modal";
import { Input, Select, Button } from "../components/FormElements";
import * as resourceService from "../services/resourceService";

const Residents = () => {
  const [residents, setResidents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "member" });

  const loadResidents = () => {
    resourceService
      .getUsers()
      .then((res) => setResidents(res.data.users))
      .catch(() => toast.error("Could not load residents"));
  };

  useEffect(loadResidents, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await resourceService.createUser(form);
      toast.success("Resident added");
      setModalOpen(false);
      setForm({ name: "", email: "", password: "", phone: "", role: "member" });
      loadResidents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add resident");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await resourceService.deleteUser(id);
      toast.success("Resident removed");
      loadResidents();
    } catch {
      toast.error("Failed to remove resident");
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "role", label: "Role" },
    {
      key: "flat",
      label: "Flat",
      render: (row) => (row.flat ? `${row.flat.block}-${row.flat.flatNumber}` : "-"),
    },
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
    <DashboardLayout title="Residents">
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
          <Plus size={16} /> Add Resident
        </Button>
      </div>

      <Table columns={columns} data={residents} emptyMessage="No residents yet" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add resident">
        <form onSubmit={handleSubmit}>
          <Input
            label="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          <Input
            label="Temporary password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={6}
          />
          <Select
            label="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            options={["member", "guard"]}
          />
          <Button type="submit" disabled={submitting} className="mt-2 w-full">
            {submitting ? "Adding..." : "Add resident"}
          </Button>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default Residents;
