import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom"; // 
import useAxiosSecure from "../../hook/useAxiosSecure"; 
import toast from "react-hot-toast";
import { Award, Upload, Loader2, PlusCircle } from "lucide-react";

const AddMemberShip = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate(); 
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Mutation for adding membership
  const addMutation = useMutation({
    mutationFn: async (newMembership) => {
      const res = await axiosSecure.post("/memberships", newMembership);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Membership added successfully! 🎉");
      queryClient.invalidateQueries({ queryKey: ["memberships"] });
      reset();
      setImagePreview(null);
      navigate("/membership/all"); // 3. এখানে Redirect কাজ করবে
    },
    onError: (err) => {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to add membership");
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setValue("imageFile", file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      toast.error("Please select a valid image file!");
    }
  };

  const onSubmit = async (data) => {
    try {
      let imageUrl = "";

      // Upload image to ImgBB if selected
      if (data.imageFile) {
        const formData = new FormData();
        formData.append("image", data.imageFile);

        const imgBbRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
          {
            method: "POST",
            body: formData,
          }
        );
        const imgBbResult = await imgBbRes.json();

        if (imgBbResult.success) {
          imageUrl = imgBbResult.data.display_url;
        } else {
          throw new Error("Image upload failed");
        }
      }

      const membershipData = {
        position: data.position,
        organization: data.organization,
        membershipNo: data.membershipNo,
        image: imageUrl,
      };

      await addMutation.mutateAsync(membershipData);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong!");
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen p-4 sm:p-6 lg:pr-24 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs">
          <div className="p-3 bg-[#163A2D] text-amber-300 rounded-xl shadow-md">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#163A2D] font-['Playfair_Display',serif]">
              Add New Membership
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Create a record for professional or academic memberships.
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-emerald-100 shadow-xs">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Position / Title */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                Position / Member Type *
              </label>
              <input
                type="text"
                placeholder="e.g. Student Member"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                {...register("position", { required: "Position is required" })}
              />
              {errors.position && (
                <p className="text-rose-500 text-xs mt-1">{errors.position.message}</p>
              )}
            </div>

            {/* Organization Name */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                Organization Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Association for Computing Machinery (ACM)"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                {...register("organization", { required: "Organization is required" })}
              />
              {errors.organization && (
                <p className="text-rose-500 text-xs mt-1">{errors.organization.message}</p>
              )}
            </div>

            {/* Membership Number */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                Membership Number *
              </label>
              <input
                type="text"
                placeholder="e.g. 0995988"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                {...register("membershipNo", { required: "Membership Number is required" })}
              />
              {errors.membershipNo && (
                <p className="text-rose-500 text-xs mt-1">{errors.membershipNo.message}</p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                Membership Image / Badge (Optional)
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl cursor-pointer transition-all">
                  <Upload className="w-4 h-4" /> Choose File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                  />
                )}
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={addMutation.isPending}
              className="w-full py-3 bg-[#163A2D] hover:bg-[#0C2219] text-amber-300 font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-6"
            >
              {addMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  Add Membership
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMemberShip;