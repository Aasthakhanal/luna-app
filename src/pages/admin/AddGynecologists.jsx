import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateGynecologistMutation } from "../../app/gynecologistsApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  ArrowLeft,
  User,
  Stethoscope,
  Phone,
  MapPin,
  Globe,
  Info,
  CheckCircle,
} from "lucide-react";

const AddGynecologists = () => {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      specialty: "",
      latitude: "",
      longitude: "",
    },
  });

  const [createGynecologist, { isLoading }] = useCreateGynecologistMutation();

  const onSubmit = async (data) => {
    try {
      await createGynecologist({
        name: data.name,
        address: data.address,
        phone: data.phone,
        specialty: data.specialty,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
      }).unwrap();
      toast.success("Gynecologist added successfully");
      form.reset();
    } catch (error) {
      console.error("Error adding gynecologist:", error);
      toast.error("Failed to add gynecologist");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-full">
                <Plus className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Add New Gynecologist
                </h1>
                <p className="text-gray-600">
                  Expand the Luna healthcare network
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/admin/gynecologists")}
              className="inline-flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to List
            </button>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6">
            <h2 className="text-xl font-bold flex items-center">
              <span className="text-2xl mr-2">👩‍⚕️</span>
              Doctor Information
            </h2>
            <p className="text-purple-100 mt-1">
              Please fill in all the required details
            </p>
          </div>

          <div className="p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: "Doctor name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-gray-700 font-medium">
                          <User className="w-4 h-4 mr-2" />
                          Doctor Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter doctor's full name"
                            className="h-12 border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specialty"
                    rules={{ required: "Specialty is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-gray-700 font-medium">
                          <Stethoscope className="w-4 h-4 mr-2" />
                          Specialty
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., Gynecology, Obstetrics"
                            className="h-12 border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    rules={{ required: "Phone number is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-gray-700 font-medium">
                          <Phone className="w-4 h-4 mr-2" />
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            {...field}
                            placeholder="Enter contact number"
                            className="h-12 border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    rules={{ required: "Address is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-gray-700 font-medium">
                          <MapPin className="w-4 h-4 mr-2" />
                          Clinic Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter clinic address"
                            className="h-12 border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Location Coordinates
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Provide precise location coordinates for accurate mapping
                    and directions.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="latitude"
                      rules={{ required: "Latitude is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center text-gray-700 font-medium">
                            <Globe className="w-4 h-4 mr-2" />
                            Latitude
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.000001"
                              {...field}
                              placeholder="e.g., 27.7172"
                              className="h-12 border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="longitude"
                      rules={{ required: "Longitude is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center text-gray-700 font-medium">
                            <Globe className="w-4 h-4 mr-2" />
                            Longitude
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.000001"
                              {...field}
                              placeholder="e.g., 85.3240"
                              className="h-12 border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => form.reset()}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Reset Form
                  </button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Adding Doctor...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Gynecologist
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Location Tips</h3>
            </div>
            <p className="text-sm text-gray-600">
              Use Google Maps to find precise latitude and longitude
              coordinates. Right-click on the clinic location and select the
              coordinates.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Verification</h3>
            </div>
            <p className="text-sm text-gray-600">
              All doctor information will be verified before being made
              available to Luna users for appointments and consultations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGynecologists;
