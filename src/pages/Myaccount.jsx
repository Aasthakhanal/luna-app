import { useState } from "react";

const MyAccount = () => {
  // Mocked user data (replace with actual user data via Redux or API)
  const [userInfo, setUserInfo] = useState({
    name: "Aastha Khanal",
    email: "aasthakhanal02@gmail.com",
    phone: "9800000000",
    facebook: "www.facebook.com",
    address: "Biratnagar",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Replace with actual save logic: API call or Redux dispatch
    console.log("Saved user info:", userInfo);
    alert("Changes saved!");
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-2xl text-primary font-semibold text-center">My Account</h2>

      <div className="flex flex-col gap-4">
        <label className="flex flex-col text-sm font-medium">
          Name
          <input
            name="name"
            value={userInfo.name}
            onChange={handleChange}
            className="border px-3 py-2 rounded mt-1"
          />
        </label>

        <label className="flex flex-col text-sm font-medium">
          Email
          <input
            name="email"
            value={userInfo.email}
            readOnly
            className="border px-3 py-2 rounded mt-1 bg-gray-100 cursor-not-allowed"
          />
        </label>

        <label className="flex flex-col text-sm font-medium">
          Phone Number
          <input
            name="phone"
            value={userInfo.phone}
            onChange={handleChange}
            className="border px-3 py-2 rounded mt-1"
          />
        </label>

        <label className="flex flex-col text-sm font-medium">
          Facebook URL
          <input
            name="facebook"
            value={userInfo.facebook}
            onChange={handleChange}
            className="border px-3 py-2 rounded mt-1"
          />
        </label>

        <label className="flex flex-col text-sm font-medium">
          Address
          <input
            name="address"
            value={userInfo.address}
            onChange={handleChange}
            className="border px-3 py-2 rounded mt-1"
          />
        </label>

        <button
          onClick={handleSave}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-rose-700 transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default MyAccount;
