import { useState } from "react";
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../../app/userApi";

const Users = () => {
  const { data: usersData, isLoading } = useGetAllUsersQuery({
    page: 1,
    limit: 20,
    search: "",
  });
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({});

  const users = usersData?.data || [];

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUserUpdate = async () => {
    const payload = { id: selectedUser.id };

    // Add only fields that are different from original selectedUser
    Object.keys(editForm).forEach((key) => {
      if (editForm[key] !== selectedUser[key]) {
        payload[key] = editForm[key];
      }
    });

    await updateUser(payload).unwrap();
    setSelectedUser(null);
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-3">All Users</h2>
      {isLoading ? (
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

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[90%] max-w-md space-y-4">
            <h3 className="text-lg font-semibold">Edit User</h3>
            <input
              name="name"
              value={editForm.name || ""}
              onChange={handleEditChange}
              placeholder="Name"
              className="w-full border px-2 py-1 rounded"
            />
            <input
              name="phone_number"
              value={editForm.phone_number || ""}
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
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleUserUpdate}
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

export default Users;
