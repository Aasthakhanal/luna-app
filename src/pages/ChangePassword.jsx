import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ChangePassword = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      // Replace with your API call
      // await api.changePassword(form);
      toast({ title: "Success", description: "Password changed successfully" });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 space-y-6 bg-white p-6 rounded shadow"
    >
      <h2 className="text-xl font-semibold">Change Password</h2>

      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input
          type="password"
          name="currentPassword"
          id="currentPassword"
          required
          value={form.currentPassword}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          type="password"
          name="newPassword"
          id="newPassword"
          required
          value={form.newPassword}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          required
          value={form.confirmPassword}
          onChange={handleChange}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Updating..." : "Change Password"}
      </Button>
    </form>
  );
};

export default ChangePassword;
