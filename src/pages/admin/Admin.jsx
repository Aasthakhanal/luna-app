import { useState } from "react";
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../../app/userApi";
import {
  useGetGynecologistsQuery,
  useDeleteGynecologistMutation,
  useUpdateGynecologistMutation,
} from "../../app/gynecologistsApi";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("users");

  const { data: usersData, isLoading: loadingUsers } = useGetAllUsersQuery({
    page: 1,
    limit: 20,
    search: "",
  });

  const { data: gynecologistData, isLoading: loadingGynecologists } =
    useGetGynecologistsQuery({ page: 1, limit: 20 });

  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteGynecologist] = useDeleteGynecologistMutation();
  const [updateGynecologist] = useUpdateGynecologistMutation();

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGynecologist, setSelectedGynecologist] = useState(null);

  const [editForm, setEditForm] = useState({});

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUserUpdate = async () => {
    await updateUser({ id: selectedUser.id, ...editForm });
    setSelectedUser(null);
  };

  const handleGynecologistUpdate = async () => {
    await updateGynecologist({ id: selectedGynecologist.id, ...editForm });
    setSelectedGynecologist(null);
  };

  const users = usersData?.data || [];
  const gynecologists = gynecologistData?.data || [];

  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      {/* Tabs */}
      <div className="flex space-x-4">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded ${
            activeTab === "users" ? "bg-primary text-white" : "bg-gray-200"
          }`}
        >
          Manage Users
        </button>
        <button
          onClick={() => setActiveTab("gynecologists")}
          className={`px-4 py-2 rounded ${
            activeTab === "gynecologists"
              ? "bg-primary text-white"
              : "bg-gray-200"
          }`}
        >
          Manage Gynecologists
        </button>
      </div>

      {/* Users Table */}
      {activeTab === "users" && (
        <div>
          <h2 className="text-xl font-semibold mb-3">All Users</h2>
          {loadingUsers ? (
            <p>Loading users...</p>
          ) : (
            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="text-left">Email</th>
                  <th className="text-left">Phone</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="p-2">{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone_number}</td>
                    <td className="space-x-3">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setEditForm(user);
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
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
        </div>
      )}

      {/* Gynecologists Table */}
      {activeTab === "gynecologists" && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => navigate("/admin/add-gynecologist")}
              className="bg-primary hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
            >
              + Add Gynecologist
            </button>
          </div>
          <h2 className="text-xl font-semibold mb-3">All Gynecologists</h2>
          {loadingGynecologists ? (
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
        </div>
      )}

      {/* Edit Modal */}
      {(selectedUser || selectedGynecologist) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[90%] max-w-md space-y-4">
            <h3 className="text-lg font-semibold">Edit Details</h3>
            <input
              name="name"
              value={editForm.name || ""}
              onChange={handleEditChange}
              placeholder="Name"
              className="w-full border px-2 py-1 rounded"
            />
            <input
              name="phone"
              value={editForm.phone || editForm.phone_number || ""}
              onChange={handleEditChange}
              placeholder="Phone"
              className="w-full border px-2 py-1 rounded"
            />
            <input
              name="email"
              value={editForm.email || ""}
              onChange={handleEditChange}
              placeholder="Email"
              className="w-full border px-2 py-1 rounded"
            />
            {selectedGynecologist && (
              <>
                <input
                  name="specialty"
                  value={editForm.specialty || ""}
                  onChange={handleEditChange}
                  placeholder="Specialty"
                  className="w-full border px-2 py-1 rounded"
                />
                <input
                  name="address"
                  value={editForm.address || ""}
                  onChange={handleEditChange}
                  placeholder="Address"
                  className="w-full border px-2 py-1 rounded"
                />
              </>
            )}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setSelectedGynecologist(null);
                }}
                className="text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={
                  selectedUser ? handleUserUpdate : handleGynecologistUpdate
                }
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
