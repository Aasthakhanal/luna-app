import React from "react";

const Support = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-2 text-primary hover:text-rose-600">Support</h1>
      <p className="text-gray-600 mb-8">
        We're here to help! Browse our FAQs or contact support.
      </p>

      {/* FAQs Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="bg-pink-50 p-4 rounded shadow-sm">
            <summary className="font-medium cursor-pointer">
              How can I reset my password?
            </summary>
            <p className="mt-2 text-sm text-gray-700">
              Go to "Change Password" under your profile settings and follow the
              steps.
            </p>
          </details>

          <details className="bg-pink-50 p-4 rounded shadow-sm">
            <summary className="font-medium cursor-pointer">
              I can't log in. What should I do?
            </summary>
            <p className="mt-2 text-sm text-gray-700">
              Make sure your credentials are correct. If the issue continues,
              contact us below.
            </p>
          </details>

          <details className="bg-pink-50 p-4 rounded shadow-sm">
            <summary className="font-medium cursor-pointer">
              How do I update my profile information?
            </summary>
            <p className="mt-2 text-sm text-gray-700">
              Go to "My Account" from your profile and edit the details as
              needed.
            </p>
          </details>
        </div>
      </section>

      {/* Contact Support Form */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Contact Support</h2>
        <form className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              required
              className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-rose-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              required
              className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-rose-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Message</label>
            <textarea
              rows="4"
              required
              className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-rose-300"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded hover:bg-rose-700 transition"
          >
            Submit
          </button>
        </form>
      </section>

      {/* Contact Info */}
      <section className="mt-10 text-sm text-gray-500">
        <p>Email: support@example.com</p>
        <p>Phone: +977-9800000000</p>
        <p>Support Hours: Mon–Fri, 9 AM–6 PM</p>
      </section>
    </div>
  );
};

export default Support;
