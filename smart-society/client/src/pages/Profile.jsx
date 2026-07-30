import { useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";
import { Input, Button } from "../components/FormElements";
import { useAuth } from "../context/AuthContext";
import * as resourceService from "../services/resourceService";
import api from "../services/api";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, phone: user.phone });
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await resourceService.updateUser(user.id, form);
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async () => {
    if (!image) return toast.error("Choose an image first");
    setSaving(true);
    try {
      const data = new FormData();
      data.append("image", image);
      const res = await api.put(`/users/${user.id}/profile-image`, data);
      const updated = { ...user, profileImage: res.data.profileImage };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      toast.success("Profile photo updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Profile">
      <div className="max-w-lg rounded-lg border border-border bg-panel p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-primary/10 font-display text-xl font-semibold text-primary">
            {user.profileImage?.url ? (
              <img src={user.profileImage.url} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              user.name?.[0]?.toUpperCase()
            )}
          </div>
          <div className="flex-1">
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            <Button type="button" variant="outline" onClick={handleImageUpload} className="ml-2">
              Upload
            </Button>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <Input
            label="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Input label="Email" value={user.email} disabled />
          <Button type="submit" disabled={saving} className="mt-2 w-full">
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
