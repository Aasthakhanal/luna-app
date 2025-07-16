import React, { useState } from "react";
import { ToggleLeft, ToggleRight } from "lucide-react";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);


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
        <form className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              defaultValue="John Doe"
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              defaultValue="john@example.com"
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Profile Picture</label>
            <input type="file" className="mt-1" />
          </div>

          <button
            type="submit"
            className="bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700 transition"
          >
            Save Changes
          </button>
        </form>
      </section>

      {/* Links: Edit Profile, Privacy Policy, About Us */}
      <section className="mb-10 max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">More Options</h2>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => alert("Edit Profile clicked")}
            className="text-left px-4 py-2 rounded hover:bg-rose-50 transition text-rose-700 font-medium"
          >
            Edit Profile
          </button>
          <button
            onClick={() => alert("Privacy Policy clicked")}
            className="text-left px-4 py-2 rounded hover:bg-rose-50 transition text-rose-700 font-medium"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => alert("About Us clicked")}
            className="text-left px-4 py-2 rounded hover:bg-rose-50 transition text-rose-700 font-medium"
          >
            About Us
          </button>
        </div>
      </section>

      {/* Preferences with toggle icons */}
      <section className="mb-10 max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">Preferences</h2>
        <div className="space-y-4">
          {/* Enable Notifications */}
          <ToggleSwitch
            label="Enable Notifications"
            enabled={notifications}
            onToggle={() => setNotifications(!notifications)}
          />
          {/* Dark Mode */}
          <ToggleSwitch
            label="Dark Mode"
            enabled={darkMode}
            onToggle={() => setDarkMode(!darkMode)}
          />
        </div>
      </section>

      {/* Danger Zone */}
      <section className="max-w-lg">
        <h2 className="text-2xl font-semibold mb-4 text-rose-600">
          Danger Zone
        </h2>
        <button className="text-rose-600 border border-rose-400 px-4 py-2 rounded hover:bg-rose-50 transition">
          Delete Account
        </button>
      </section>
    </div>
  );
};

// ToggleSwitch Component for preference toggles
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
