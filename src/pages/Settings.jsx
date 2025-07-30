import React, { useState, useEffect } from "react";
import { ToggleLeft, ToggleRight } from "lucide-react";
import {
  useFindUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/app/userApi";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const Settings = () => {
  const userId = useSelector((state) => state.auth.users?.id); 
  const { data: user, isLoading } = useFindUserQuery(userId);
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
  });

  const [notifications, setNotifications] = useState(true); 

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ id: userId, ...formData }).unwrap();
      toast.success("User updated successfully");
    } catch (err) {
      toast.error("Failed to update user");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(userId).unwrap();
      toast.success("Account deleted");
      // Redirect or logout here
    } catch (err) {
      toast.error("Failed to delete account");
    }
  };

  if (isLoading) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Page Header */}
      <h1 className="text-3xl font-bold mb-2 text-primary">Settings</h1>
      <p className="text-gray-600 mb-8">
        Manage your account settings and preferences.
      </p>

      {/* Personal Info */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
        <form className="space-y-4 max-w-lg" onSubmit={handleUpdate}>
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700 transition"
          >
            Save Changes
          </button>
        </form>
      </section>

      {/* Preferences */}
      <section className="mb-10 max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">Preferences</h2>
        <div className="space-y-4">
          <ToggleSwitch
            label="Enable Notifications"
            enabled={notifications}
            onToggle={() => setNotifications(!notifications)}
          />
        </div>
      </section>

      {/* Danger Zone */}
      <section className="max-w-lg">
        <h2 className="text-2xl font-semibold mb-4 text-rose-600">
          Danger Zone
        </h2>
        <button
          onClick={handleDelete}
          className="text-rose-600 border border-rose-400 px-4 py-2 rounded hover:bg-rose-50 transition"
        >
          Delete Account
        </button>
      </section>
    </div>
  );
};

const ToggleSwitch = ({ label, enabled, onToggle }) => {
  return (
    <div
      onClick={onToggle}
      className="flex items-center justify-between cursor-pointer px-4 py-2 bg-rose-50 rounded"
      role="switch"
      aria-checked={enabled}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onToggle();
      }}
    >
      <span className="text-gray-700">{label}</span>
      <span className="text-rose-700">
        {enabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
      </span>
    </div>
  );
};

export default Settings;
