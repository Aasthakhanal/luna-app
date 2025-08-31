// src/pages/admin/Gynecologists.jsx
import { useState } from "react";
import {
  useGetGynecologistsQuery,
  useDeleteGynecologistMutation,
  useUpdateGynecologistMutation,
} from "../../app/gynecologistsApi";
import { useNavigate } from "react-router-dom";
import {
  Building,
  Plus,
  User,
  MapPin,
  CheckCircle,
  Heart,
  Phone,
  Edit,
  Trash2,
} from "lucide-react";

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-purple-600 font-medium">
              Loading gynecologists...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-full">
                <Building className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Gynecologists Network
                </h1>
                <p className="text-gray-600">
                  Manage healthcare professionals in the Luna network
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/admin/add-gynecologist")}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Gynecologist
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Doctors
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {gynecologists.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-pink-500">
            <div className="flex items-center">
              <div className="bg-pink-100 p-3 rounded-full">
                <MapPin className="w-6 h-6 text-pink-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Locations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {gynecologists.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-rose-500">
            <div className="flex items-center">
              <div className="bg-rose-100 p-3 rounded-full">
                <CheckCircle className="w-6 h-6 text-rose-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-gray-900">
                  {gynecologists.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-indigo-500">
            <div className="flex items-center">
              <div className="bg-indigo-100 p-3 rounded-full">
                <Heart className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Specialties</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(gynecologists.map((g) => g.specialty)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gynecologists Grid */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <span className="text-2xl mr-2">👩‍⚕️</span>
              Healthcare Professionals
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {gynecologists.map((doc) => (
              <div
                key={doc.id}
                className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                      {doc.name?.charAt(0)?.toUpperCase() || "D"}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        Dr. {doc.name}
                      </h3>
                      <p className="text-purple-600 font-medium">
                        {doc.specialty}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedGynecologist(doc);
                        setEditForm(doc);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteGynecologist(doc.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-purple-500" />
                    <span className="text-sm">{doc.phone || "No phone"}</span>
                  </div>

                  <div className="flex items-start text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 text-purple-500" />
                    <span className="text-sm leading-relaxed">
                      {doc.address}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-purple-100">
                    <div className="flex items-center text-green-600">
                      <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-xs font-medium">Available</span>
                    </div>
                    <span className="text-xs text-gray-500">ID: {doc.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {gynecologists.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👩‍⚕️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No gynecologists found
              </h3>
              <p className="text-gray-600 mb-6">
                Start building your healthcare network by adding the first
                gynecologist.
              </p>
              <button
                onClick={() => navigate("/admin/add-gynecologist")}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add First Gynecologist
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {selectedGynecologist && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-2xl flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-t-2xl">
              <h3 className="text-xl font-bold flex items-center">
                <span className="text-2xl mr-2">👩‍⚕️</span>
                Edit Gynecologist
              </h3>
              <p className="text-purple-100 mt-1">Update doctor information</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  👤 Doctor Name
                </label>
                <input
                  name="name"
                  value={editForm.name || ""}
                  onChange={handleEditChange}
                  placeholder="Enter doctor name"
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🩺 Specialty
                </label>
                <input
                  name="specialty"
                  value={editForm.specialty || ""}
                  onChange={handleEditChange}
                  placeholder="Enter specialty"
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📱 Phone Number
                </label>
                <input
                  name="phone"
                  value={editForm.phone || ""}
                  onChange={handleEditChange}
                  placeholder="Enter phone number"
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📍 Address
                </label>
                <textarea
                  name="address"
                  value={editForm.address || ""}
                  onChange={handleEditChange}
                  placeholder="Enter clinic address"
                  rows="3"
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setSelectedGynecologist(null)}
                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleGynecologistUpdate}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 transition-all font-medium shadow-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gynecologists;
