import React, { useState } from "react";

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

      {/* Preferences */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Enable Notifications</span>
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
              className="accent-rose-600"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-700">Dark Mode</span>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="accent-rose-600"
            />
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section>
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

export default Settings;
