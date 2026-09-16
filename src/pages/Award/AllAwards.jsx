import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Trophy,
  Eye,
  Edit3,
  Trash2,
  Loader2,
  X,
  Upload,
  Calendar,
  Building,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hook/useAxiosSecure"; 

const AllAwards = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Modal States
  const [viewAward, setViewAward] = useState(null);
  const [editAward, setEditAward] = useState(null);
  const [deleteAwardId, setDeleteAwardId] = useState(null);

  // Edit Form States
  const [editForm, setEditForm] = useState({
    title: "",
    organization: "",
    dateReceived: "",
    description: "",
    image: "",
  });
  const [newImageFile, setNewImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  const IMGBB_API_KEY = import.meta.env.VITE_image_host_key || "YOUR_IMGBB_API_KEY";

  // Clear toasts on mount
  useEffect(() => {
    toast.dismiss();
  }, []);

  // 1. Fetch All Awards using TanStack Query
  const {
    data: awards = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["awards"],
    queryFn: async () => {
      const res = await axiosSecure.get("/awards");
      return res.data;
    },
  });

  // 2. Mutation: Update Award (PATCH)
  const updateAwardMutation = useMutation({
    mutationFn: async ({ id, updatedData }) => {
      const res = await axiosSecure.patch(`/awards/${id}`, updatedData);
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.success || data) {
        toast.success("Award updated successfully! 🎉");
        queryClient.invalidateQueries({ queryKey: ["awards"] });
        setEditAward(null);
      } else {
        toast.error(data?.message || "Failed to update award");
      }
    },
    onError: (err) => {
      console.error("Update Error:", err);
      toast.error(err.response?.data?.message || err.message || "Update failed!");
    },
  });

  // 3. Mutation: Delete Award (DELETE)
  const deleteAwardMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/awards/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Award deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["awards"] });
      setDeleteAwardId(null);
    },
    onError: (err) => {
      console.error("Delete Error:", err);
      toast.error(err.response?.data?.message || err.message || "Delete failed!");
    },
  });

  // Open Edit Modal
  const handleOpenEdit = (award) => {
    setEditAward(award);
    setEditForm({
      title: award.title || "",
      organization: award.organization || "",
      dateReceived: award.dateReceived || "",
      description: award.description || "",
      image: award.image || "",
    });
    setEditImagePreview(award.image || null);
    setNewImageFile(null);
  };

  // Submit Handler for Update
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      let finalImageUrl = editForm.image;

      // ১. নতুন ফাইল সিলেক্ট করা থাকলে ImageBB-তে আপলোড
      if (newImageFile) {
        const imgData = new FormData();
        imgData.append("image", newImageFile);

        const imgBbRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
          { method: "POST", body: imgData }
        );
        const imgBbResult = await imgBbRes.json();

        if (!imgBbResult.success) {
          throw new Error("Image upload to ImageBB failed.");
        }

        finalImageUrl = imgBbResult.data.display_url;
      }

      // ২. আপডেট ডাটা প্রিপেয়ার করা
      const updatedData = {
        title: editForm.title,
        organization: editForm.organization,
        dateReceived: editForm.dateReceived,
        description: editForm.description,
        image: finalImageUrl,
      };

      // ৩. Mutation ট্রিগার করা
      await updateAwardMutation.mutateAsync({
        id: editAward._id,
        updatedData,
      });
    } catch (err) {
      toast.error(err.message || "An error occurred during update.");
    }
  };

  // Submit Handler for Delete
  const handleDelete = () => {
    if (deleteAwardId) {
      deleteAwardMutation.mutate(deleteAwardId);
    }
  };

  if (isError) {
    toast.error(error?.message || "Failed to load awards");
  }

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen font-sans p-4 sm:p-6 lg:pr-24">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#163A2D] text-amber-300 rounded-xl shadow-md">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#163A2D] font-['Playfair_Display',serif]">
                All Awards
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                Manage, edit, and view all recorded honors and achievements.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full w-fit">
            Total Awards: {awards.length}
          </span>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 space-y-3">
              <Loader2 className="w-8 h-8 text-emerald-700 animate-spin" />
              <p className="text-sm font-semibold text-gray-500">
                Loading awards...
              </p>
            </div>
          ) : awards.length === 0 ? (
            <div className="p-12 text-center text-gray-500 font-medium">
              No awards found. Add your first award!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold uppercase text-gray-500 tracking-wider">
                    <th className="p-4">Award Details</th>
                    <th className="p-4">Organization</th>
                    <th className="p-4">Date Received</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {awards.map((award) => (
                    <tr
                      key={award._id}
                      className="hover:bg-emerald-50/30 transition-colors group"
                    >
                      {/* Title & Image */}
                      <td className="p-4">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={award.image}
                            alt={award.title}
                            className="w-12 h-12 rounded-xl object-cover border border-gray-200 shrink-0"
                          />
                          <div>
                            <h3 className="font-bold text-[#163A2D] line-clamp-1">
                              {award.title}
                            </h3>
                            <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                              {award.description || "No description provided"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Organization */}
                      <td className="p-4 text-gray-700 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Building className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span className="line-clamp-1">
                            {award.organization}
                          </span>
                        </div>
                      </td>

                      {/* Date Received */}
                      <td className="p-4 text-gray-600 font-medium whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>{award.dateReceived || "N/A"}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setViewAward(award)}
                            className="p-2 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(award)}
                            className="p-2 text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Award"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteAwardId(award._id)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Award"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ==================== VIEW MODAL ==================== */}
      {viewAward && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 border border-emerald-100 shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setViewAward(null)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg z-10 bg-white/80 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full bg-gray-50 rounded-xl border border-gray-100 overflow-hidden p-2">
              <img
                src={viewAward.image}
                alt={viewAward.title}
                className="w-full h-auto max-h-[60vh] object-contain rounded-lg mx-auto"
              />
            </div>

            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                {viewAward.dateReceived}
              </span>
              <h2 className="text-xl font-bold text-[#163A2D] mt-1 font-['Playfair_Display',serif]">
                {viewAward.title}
              </h2>
              <p className="text-sm font-semibold text-emerald-800 mt-1">
                {viewAward.organization}
              </p>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              {viewAward.description || "No detailed description available."}
            </p>
          </div>
        </div>
      )}

      {/* ==================== EDIT MODAL ==================== */}
      {editAward && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 border border-emerald-100 shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditAward(null)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-[#163A2D] font-['Playfair_Display',serif]">
              Edit Award
            </h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                  Award Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                    Organization
                  </label>
                  <input
                    type="text"
                    value={editForm.organization}
                    onChange={(e) =>
                      setEditForm({ ...editForm, organization: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                    Date Received
                  </label>
                  <input
                    type="date"
                    value={editForm.dateReceived}
                    onChange={(e) =>
                      setEditForm({ ...editForm, dateReceived: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                    required
                  />
                </div>
              </div>

              {/* Image Change */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                  Award Image
                </label>
                <div className="flex items-center gap-3">
                  <img
                    src={editImagePreview}
                    alt="Preview"
                    className="w-14 h-14 object-cover rounded-xl border border-gray-200"
                  />
                  <label className="flex-1 px-4 py-2 bg-gray-50 border border-dashed border-emerald-300 rounded-xl text-xs text-gray-600 cursor-pointer hover:bg-emerald-50/50 flex items-center justify-between">
                    <span>
                      {newImageFile
                        ? newImageFile.name
                        : "Change image file..."}
                    </span>
                    <Upload className="w-4 h-4 text-emerald-700" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setNewImageFile(file);
                          setEditImagePreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditAward(null)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateAwardMutation.isPending}
                  className="px-5 py-2 bg-[#163A2D] hover:bg-[#0C2219] text-amber-300 font-semibold text-sm rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {updateAwardMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== DELETE CONFIRMATION MODAL ==================== */}
      {deleteAwardId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-rose-100 shadow-2xl text-center animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Are you sure you want to delete?
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                This action cannot be undone. The award record will be
                permanently deleted.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteAwardId(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteAwardMutation.isPending}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {deleteAwardMutation.isPending && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                <span>Delete Award</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAwards;