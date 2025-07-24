// src/pages/admin/Gynecologists.jsx
import { useState } from "react";
import {
  useGetGynecologistsQuery,
  useDeleteGynecologistMutation,
  useUpdateGynecologistMutation,
} from "../../app/gynecologistsApi";
import { useNavigate } from "react-router-dom";

const Gynecologists = () => {
  const navigate = useNavigate();
  const { data: gynecologistData, isLoading } = useGetGynecologistsQuery({
    page: 1,
    limit: 20,
  });

  const [deleteGynecologist] = useDeleteGynecologistMutation();
  const [updateGynecologist] = useUpdateGynecologistMutation();
  const [selectedGynecologist, setSelectedGynecologist] = useState(null);
  const [editForm, setEditForm] = useState({});

  const gynecologists = gynecologistData?.data || [];

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleGynecologistUpdate = async () => {
    await updateGynecologist({ id: selectedGynecologist.id, ...editForm });
    setSelectedGynecologist(null);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate("/admin/add-gynecologist")}
          className="bg-primary hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
        >
          + Add Gynecologist
        </button>
      </div>
      <h2 className="text-xl font-semibold mb-3">All Gynecologists</h2>
      {isLoading ? (
        <p>Loading gynecologists...</p>
      ) : (
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="text-left">Specialty</th>
              <th className="text-left">Phone</th>
              <th className="text-left">Address</th>
              <th className="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {gynecologists.map((doc) => (
              <tr key={doc.id} className="border-t">
                <td className="p-2">{doc.name}</td>
                <td>{doc.specialty}</td>
                <td>{doc.phone}</td>
                <td>{doc.address}</td>
                <td className="space-x-3">
                  <button
                    onClick={() => {
                      setSelectedGynecologist(doc);
                      setEditForm(doc);
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteGynecologist(doc.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedGynecologist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[90%] max-w-md space-y-4">
            <h3 className="text-lg font-semibold">Edit Gynecologist</h3>
            <input
              name="name"
              value={editForm.name || ""}
              onChange={handleEditChange}
              placeholder="Name"
              className="w-full border px-2 py-1 rounded"
            />
            <input
              name="specialty"
              value={editForm.specialty || ""}
              onChange={handleEditChange}
              placeholder="Specialty"
              className="w-full border px-2 py-1 rounded"
            />
            <input
              name="phone"
              value={editForm.phone || ""}
              onChange={handleEditChange}
              placeholder="Phone"
              className="w-full border px-2 py-1 rounded"
            />
            <input
              name="address"
              value={editForm.address || ""}
              onChange={handleEditChange}
              placeholder="Address"
              className="w-full border px-2 py-1 rounded"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setSelectedGynecologist(null)}
                className="text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleGynecologistUpdate}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Gynecologists;
