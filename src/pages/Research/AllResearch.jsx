import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Trash2, 
  Edit3, 
  MapPin, 
  Calendar, 
  Loader2, 
  BookOpen, 
  Plus, 
  Maximize2, 
  X, 
  Award, 
  Save,
  Upload,
  ImageIcon
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import useAxiosSecure from "../../hook/useAxiosSecure"; 

const AllResearch = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [activeImage, setActiveImage] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // TanStack Query GET: Fetch Researches
  const { data: researches = [], isLoading: loading } = useQuery({
    queryKey: ["researches"],
    queryFn: async () => {
      const res = await axiosSecure.get("/researches");
      return res.data;
    },
  });

  // TanStack Mutation DELETE: Delete Research
  const { mutate: deleteResearch } = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.delete(`/researches/${id}`);
    },
    onSuccess: () => {
      toast.success("Publication deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["researches"] });
    },
    onError: (err) => {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to delete publication!");
    },
  });

  // TanStack Mutation PATCH: Update Research
  const { mutate: updateResearch, isPending: updating } = useMutation({
    mutationFn: async () => {
      const id = editingItem._id || editingItem.id;
      let finalCertificateUrl = editFormData.certificateUrl;

      if (selectedFile) {
        const imgData = new FormData();
        imgData.append("image", selectedFile);

        const imgBbRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
          {
            method: "POST",
            body: imgData,
          }
        );

        const imgBbResult = await imgBbRes.json();

        if (!imgBbResult.success) {
          throw new Error("Image upload to ImageBB failed!");
        }

        finalCertificateUrl = imgBbResult.data.display_url;
      }

      const payload = {
        ...editFormData,
        certificateUrl: finalCertificateUrl,
        updatedAt: new Date().toISOString(),
      };

      const res = await axiosSecure.patch(`/researches/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Publication updated successfully!");
      setEditingItem(null);
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ["researches"] });
    },
    onError: (err) => {
      console.error("Patch Error:", err);
      toast.error(err.message || "Failed to update publication!");
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this research publication?")) {
      deleteResearch(id);
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setSelectedFile(null);
    setEditFormData({
      title: item.title || "",
      authors: item.authors || "",
      conference: item.conference || "",
      eventDate: item.eventDate || "",
      location: item.location || "",
      certificateUrl: item.certificateUrl || "",
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileProcess = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file!");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setSelectedFile(file);
    setEditFormData((prev) => ({
      ...prev,
      certificateUrl: URL.createObjectURL(file),
    }));
    toast.success("New certificate image selected!");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setEditFormData((prev) => ({ ...prev, certificateUrl: "" }));
  };

  const handlePatchSubmit = (e) => {
    e.preventDefault();
    updateResearch();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-700" />
        <p className="text-sm font-medium text-emerald-900 animate-pulse">Loading Publications...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 font-sans px-4 py-6">
      <Toaster position="top-center" containerStyle={{ top: 80, zIndex: 99999 }} />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#163A2D] to-[#0D251D] p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-semibold tracking-wide uppercase">
              Academic & Conference
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3 pt-1 uppercase">
            <BookOpen className="w-7 h-7 text-amber-400" /> Research Publications
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80">
            Showcasing papers, international conference presentations, and certifications.
          </p>
        </div>

        <button
          onClick={() => navigate("/research/add")}
          className="z-10 self-start sm:self-center px-5 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-[#163A2D] font-bold text-sm rounded-2xl shadow-lg hover:shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-4 h-4" /> Add New Paper
        </button>
      </div>

      {/* Empty State */}
      {researches.length === 0 && (
        <div className="text-center py-16 bg-emerald-50/40 rounded-3xl border border-dashed border-emerald-200 space-y-3">
          <Award className="w-12 h-12 text-emerald-600 mx-auto opacity-50" />
          <h3 className="text-base font-bold text-gray-700">No Publications Found</h3>
          <p className="text-xs text-gray-500">Click the button above to add your first research publication.</p>
        </div>
      )}

      {/* Publications List */}
      <div className="space-y-6">
        {researches.map((item, index) => {
          const id = item._id || item.id;
          return (
            <div
              key={id}
              className="group bg-white rounded-3xl border border-gray-100 p-5 sm:p-7 shadow-sm hover:shadow-xl hover:border-emerald-200/60 transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-400 via-emerald-600 to-[#163A2D] opacity-80 group-hover:opacity-100 transition-opacity" />

              <div className="md:col-span-5 flex justify-center items-center">
                {item.certificateUrl ? (
                  <div className="relative group/img overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm w-full max-h-60 h-full flex items-center justify-center">
                    <img
                      src={item.certificateUrl}
                      alt="Certificate"
                      className="w-full h-full object-contain transform group-hover/img:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div 
                      onClick={() => setActiveImage(item.certificateUrl)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer backdrop-blur-[2px]"
                    >
                      <span className="px-3 py-1.5 bg-white/90 text-gray-900 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md">
                        <Maximize2 className="w-3.5 h-3.5" /> Preview Certificate
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-44 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 text-xs text-gray-400 border border-dashed border-gray-200">
                    <Award className="w-8 h-8 text-gray-300" />
                    <span>No Certificate Image</span>
                  </div>
                )}
              </div>

              <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-xl bg-amber-100 text-amber-800 font-extrabold text-xs flex items-center justify-center shadow-inner mt-0.5">
                        {index + 1}
                      </span>
                      <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-snug uppercase group-hover:text-[#163A2D] transition-colors">
                        {item.title}
                      </h2>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-amber-700 pl-10">
                      {item.authors}
                    </p>
                  </div>

                  <div className="pl-10">
                    <div className="inline-block px-3 py-1 bg-emerald-50 border border-emerald-100/80 rounded-xl text-xs font-bold text-[#163A2D] uppercase tracking-wider">
                      {item.conference}
                    </div>
                  </div>
                </div>

                <div className="pl-10 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 mt-auto">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-gray-500">
                    <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" /> {item.eventDate}
                    </span>
                    <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {item.location}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all duration-200 shadow-sm"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(id)}
                      className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all duration-200 shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* EDIT MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6 relative my-8">
            <button
              onClick={() => setEditingItem(null)}
              className="absolute top-5 right-5 p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-gray-900 uppercase flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-600" /> Edit Research Publication
              </h2>
              <p className="text-xs text-gray-500">Update research info and image via PATCH operation.</p>
            </div>

            <form onSubmit={handlePatchSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={editFormData.title}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Authors
                </label>
                <input
                  type="text"
                  name="authors"
                  value={editFormData.authors}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Conference / Journal
                </label>
                <input
                  type="text"
                  name="conference"
                  value={editFormData.conference}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Event Date
                  </label>
                  <input
                    type="text"
                    name="eventDate"
                    value={editFormData.eventDate}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={editFormData.location}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              {/* Drag & Drop Image Upload Section */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <span className="text-xs font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider">
                  <ImageIcon className="w-4 h-4 text-emerald-600" /> Update Certificate Image
                </span>
                
                <label
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-2xl p-4 transition-all flex flex-col items-center justify-center gap-2 text-center cursor-pointer block ${
                    isDragging
                      ? "border-emerald-500 bg-emerald-50/50 scale-[1.01]"
                      : "border-gray-200 bg-gray-50/50 hover:bg-gray-100/60 hover:border-emerald-300"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileProcess(e.target.files[0])}
                    className="hidden"
                  />

                  {editFormData.certificateUrl ? (
                    <div className="relative group w-full max-w-xs h-36 rounded-xl overflow-hidden border border-gray-200 bg-white">
                      <img
                        src={editFormData.certificateUrl}
                        alt="Certificate Preview"
                        className="w-full h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage();
                        }}
                        className="absolute top-2 right-2 p-1 bg-rose-600 text-white rounded-full shadow-md hover:bg-rose-700 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="p-2.5 bg-emerald-100/60 rounded-full text-emerald-700">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">
                          Click or Drag & Drop New Image
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">PNG, JPG or WebP up to 5MB</p>
                      </div>
                    </>
                  )}
                </label>

                <input
                  type="text"
                  name="certificateUrl"
                  placeholder="Or paste image URL directly"
                  value={editFormData.certificateUrl}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {updating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full-screen Image Preview Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setActiveImage(null)}
              className="absolute -top-12 right-0 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={activeImage}
              alt="Full Certificate Preview"
              className="w-full h-full object-contain rounded-2xl shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllResearch;