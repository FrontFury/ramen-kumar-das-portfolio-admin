import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hook/useAxiosSecure"; 
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Award,
  Eye,
  Edit3,
  Trash2,
  X,
  Loader2,
  Upload,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Building2,
  Hash
} from "lucide-react";

const AllMemberShip = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [selectedMembership, setSelectedMembership] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editImagePreview, setEditImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  // 1. Fetch all memberships
  const {
    data: memberships = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["memberships"],
    queryFn: async () => {
      const res = await axiosSecure.get("/memberships");
      return res.data;
    },
  });

  // 2. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/memberships/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Membership deleted successfully! 🗑️");
      queryClient.invalidateQueries({ queryKey: ["memberships"] });
    },
    onError: (err) => {
      console.error(err);
      toast.error(err?.response?.data?.message || "Delete failed!");
    },
  });

  // 3. Update Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, updatedData }) => {
      const res = await axiosSecure.patch(`/memberships/${id}`, updatedData);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Membership updated successfully! ✨");
      queryClient.invalidateQueries({ queryKey: ["memberships"] });
      setIsEditModalOpen(false);
    },
    onError: (err) => {
      console.error(err);
      toast.error(err?.response?.data?.message || "Update failed!");
    },
  });

  // Actions
  const handleView = (item) => {
    setSelectedMembership(item);
    setIsViewModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedMembership(item);
    reset({
      position: item.position,
      organization: item.organization,
      membershipNo: item.membershipNo,
      imageFile: null,
    });
    setEditImagePreview(item.image || null);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this membership?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setValue("imageFile", file);
      setEditImagePreview(URL.createObjectURL(file));
    } else {
      toast.error("Please select a valid image file!");
    }
  };

  const onUpdateSubmit = async (data) => {
    try {
      let imageUrl = editImagePreview;

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

      const updatedData = {
        position: data.position,
        organization: data.organization,
        membershipNo: data.membershipNo,
        image: imageUrl,
      };

      const targetId = selectedMembership._id || selectedMembership.id;
      await updateMutation.mutateAsync({ id: targetId, updatedData });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update record");
    }
  };

  if (isError) {
    return (
      <div className="w-full bg-slate-50 min-h-screen p-6 flex justify-center items-center">
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-6 py-4 rounded-2xl shadow-sm">
          <p className="font-semibold">Error loading data: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen font-sans p-4 sm:p-8 lg:pr-24">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HERO BANNER / HEADER */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#163A2D] via-[#1a4737] to-[#0f281e] p-8 rounded-3xl text-white shadow-xl">
          <div className="absolute -right-10 -bottom-10 opacity-10 text-white pointer-events-none">
            <Award className="w-72 h-72" />
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-amber-400/20 backdrop-blur-md text-amber-300 rounded-2xl border border-amber-300/30 shadow-inner">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-4xl font-extrabold font-['Playfair_Display',serif] tracking-wide">
                    All Memberships
                  </h1>
                  <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                </div>
                <p className="text-slate-300 text-sm font-normal mt-1">
                  Manage and showcase your verified professional affiliations.
                </p>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-xs font-semibold text-amber-300 tracking-wider uppercase">
              Total Records: {memberships.length}
            </div>
          </div>
        </div>

        {/* LIST CONTAINER */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-16 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <Loader2 className="w-10 h-10 text-[#163A2D] animate-spin mb-3" />
            <p className="text-sm text-slate-500 font-medium">Fetching active memberships...</p>
          </div>
        ) : memberships.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-dashed border-slate-200 text-slate-400">
            <Award className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-base font-semibold">No membership records found.</p>
            <p className="text-xs text-slate-400 mt-1">Add a new membership to display here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {memberships.map((item, index) => (
              <div
                key={item._id || item.id || index}
                className="group relative bg-white rounded-2xl border border-slate-100 p-5 shadow-xs hover:shadow-xl hover:border-emerald-200/80 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                {/* Visual Rank Accent */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-transparent group-hover:bg-[#163A2D] rounded-l-2xl transition-all duration-300" />

                {/* Left Side: Badge Preview + Info */}
                <div className="flex items-center gap-5">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200/60 shadow-inner group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.position}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <ImageIcon className="w-7 h-7" />
                        <span className="text-[10px] uppercase font-bold mt-1">No Badge</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/60 text-amber-700 text-xs font-bold">
                        #{index + 1}
                      </span>
                      <h3 className="text-lg font-bold text-[#163A2D] group-hover:text-emerald-700 transition-colors">
                        {item.position}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 text-sm font-semibold">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span>{item.organization}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                      <Hash className="w-3.5 h-3.5 text-amber-500" />
                      <span>ID: <strong className="text-slate-800">{item.membershipNo}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Quick Action Buttons */}
                <div className="flex items-center gap-2.5 self-end sm:self-center bg-slate-50 p-2 rounded-2xl border border-slate-100">
                  <button
                    onClick={() => handleView(item)}
                    className="p-2.5 text-emerald-700 bg-emerald-100/60 hover:bg-emerald-600 hover:text-white rounded-xl transition-all cursor-pointer shadow-2xs"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2.5 text-amber-700 bg-amber-100/60 hover:bg-amber-500 hover:text-white rounded-xl transition-all cursor-pointer shadow-2xs"
                    title="Edit Record"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id || item.id)}
                    disabled={deleteMutation.isPending}
                    className="p-2.5 text-rose-600 bg-rose-100/60 hover:bg-rose-600 hover:text-white rounded-xl transition-all cursor-pointer disabled:opacity-50 shadow-2xs"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* VIEW MODAL (GLASSMORPISM) */}
      {isViewModalOpen && selectedMembership && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full relative shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#163A2D] to-[#0f281e] p-6 text-white relative">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4" /> Verified Membership
              </div>
              <h2 className="text-xl font-bold font-['Playfair_Display',serif]">
                {selectedMembership.position}
              </h2>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto">
              {/* Badge Preview */}
              {selectedMembership.image && (
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Badge / Document Proof
                  </p>
                  <div className="w-full bg-slate-50 rounded-2xl p-3 border border-slate-100 shadow-inner flex items-center justify-center relative group">
                    <img
                      src={selectedMembership.image}
                      alt={selectedMembership.position}
                      className="max-h-56 object-contain rounded-xl"
                    />
                    <a
                      href={selectedMembership.image}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute bottom-4 right-4 p-2 bg-black/60 hover:bg-black/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-xs flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Open Full
                    </a>
                  </div>
                </div>
              )}

              {/* Data Cards */}
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Organization / Institution
                  </span>
                  <p className="text-sm font-bold text-[#163A2D]">
                    {selectedMembership.organization}
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Membership Registration Number
                  </span>
                  <p className="text-sm font-mono font-bold text-amber-600">
                    {selectedMembership.membershipNo}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && selectedMembership && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full relative shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-[#163A2D] p-6 text-white relative">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <h2 className="text-xl font-bold font-['Playfair_Display',serif]">
                Update Membership Info
              </h2>
              <p className="text-xs text-slate-300 mt-1">Modify record details or replace existing badge image.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onUpdateSubmit)} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  Position / Member Type *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                  {...register("position", { required: true })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  Organization Name *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                  {...register("organization", { required: true })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  Membership Number *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                  {...register("membershipNo", { required: true })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  Badge / Certificate Image
                </label>
                <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <label className="flex items-center gap-2 px-4 py-2 bg-[#163A2D] hover:bg-[#0c2219] text-amber-300 text-xs font-bold rounded-xl cursor-pointer transition-all shadow-xs">
                    <Upload className="w-4 h-4" /> Upload File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageChange}
                      className="hidden"
                    />
                  </label>
                  {editImagePreview && (
                    <img
                      src={editImagePreview}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded-xl border border-slate-200 shadow-2xs"
                    />
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="w-full py-3.5 bg-gradient-to-r from-[#163A2D] to-[#0f281e] hover:from-[#0c2219] hover:to-[#081713] text-amber-300 font-bold rounded-2xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-6"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  "Update Membership"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllMemberShip;