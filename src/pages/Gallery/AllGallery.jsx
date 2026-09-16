import React, { useState } from "react";
import {
  Eye, Edit3, Trash2, X, Loader2, Image as ImageIcon,
  MapPin, Calendar, Tag, Sparkles, Upload, CheckCircle2,
  Clock, RefreshCw
} from "lucide-react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hook/useAxiosSecure"; 

const AllGallery = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalImgUrl, setModalImgUrl] = useState("");
  const [activeImage, setActiveImage] = useState(null);

  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
  } = useForm();

  // 1. Fetch Gallery Data with TanStack useQuery
  const {
    data: gallery = [],
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const res = await axiosSecure.get("/gallery");
      return res.data;
    },
  });

  // 2. Delete Gallery Item Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/gallery/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Photo removed from gallery! 🗑️");
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
    onError: (err) => {
      console.error(err);
      toast.error(err?.response?.data?.message || "Error deleting gallery item!");
    },
  });

  // 3. Update Gallery Item Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, updatedData }) => {
      const res = await axiosSecure.patch(`/gallery/${id}`, updatedData);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Gallery item updated! ✨");
      setIsEditModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
    onError: (err) => {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update item.");
    },
  });

  const handleView = (item) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setModalImgUrl(item.imageUrl || "");
    reset({
      category: item.category || "Conferences",
      title: item.title || "",
      location: item.location || "",
      date: item.date || "",
      imageUrlInput: item.imageUrl || "",
    });
    setIsEditModalOpen(true);
  };

  const handleModalFileProcess = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setModalImgUrl(reader.result);
      setValue("imageUrlInput", "");
      toast.success("New image loaded!");
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this photo item?")) {
      deleteMutation.mutate(id);
    }
  };

  const onUpdateSubmit = (data) => {
    const targetId = selectedItem.id || selectedItem._id;
    const updatedData = {
      category: data.category,
      title: data.title,
      location: data.location,
      date: data.date,
      imageUrl: modalImgUrl || data.imageUrlInput || "",
    };

    updateMutation.mutate({ id: targetId, updatedData });
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <Toaster position="top-center" containerStyle={{ top: 40, zIndex: 99999 }} />

      <div className="max-w-7xl mx-auto space-y-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0F291E] via-[#163A2D] to-[#0A1C16] text-white p-6 sm:p-10 rounded-3xl shadow-2xl border border-emerald-800/40">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 text-amber-400 rounded-2xl shadow-inner backdrop-blur-md">
                <ImageIcon className="w-9 h-9" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-4xl font-black text-white tracking-wide">Photo Gallery</h1>
                  <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
                </div>
                <p className="text-sm text-emerald-200/90 mt-1 font-medium">
                  Manage, update, and organize event memories and media seamlessly.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => refetch()}
                disabled={isRefetching}
                className="p-2.5 bg-emerald-950/80 border border-emerald-800/50 hover:border-emerald-500/50 text-emerald-200 hover:text-white rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
                title="Refresh Gallery"
              >
                <RefreshCw className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`} />
              </button>
              <div className="bg-emerald-950/80 border border-emerald-800/50 px-4 py-2.5 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-emerald-300 shadow-sm">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Total Photos: <strong className="text-white text-sm">{gallery.length}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
            <Loader2 className="w-10 h-10 text-emerald-700 animate-spin mb-4" />
            <p className="text-sm text-slate-600 font-semibold tracking-wide">Loading gallery collection...</p>
          </div>
        ) : gallery.length === 0 ? (
          <div className="bg-white p-16 text-center rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <ImageIcon className="w-8 h-8" />
            </div>
            <p className="text-lg font-bold text-slate-800">No Gallery Items Found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Start expanding your gallery by uploading pictures and conference moments.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((item, index) => {
              const id = item._id || item.id;

              return (
                <div
                  key={id || index}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 overflow-hidden flex flex-col group"
                >
                  <div className="relative h-56 bg-slate-100 overflow-hidden">
                    <img
                      src={item.imageUrl || "https://via.placeholder.com/600x400?text=No+Image"}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-md flex items-center gap-1.5">
                      <Tag className="w-3 h-3 text-amber-400" />
                      <span className="text-[11px] font-semibold text-white tracking-wider uppercase">
                        {item.category || "Conferences"}
                      </span>
                    </div>

                    <button
                      onClick={() => setActiveImage(item.imageUrl)}
                      className="absolute top-3 right-3 p-2 bg-slate-900/60 hover:bg-slate-900/90 text-white rounded-full backdrop-blur-md border border-white/10 transition-all cursor-pointer shadow-md"
                      title="Quick Preview"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-base font-bold text-slate-800 group-hover:text-emerald-800 transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h3>

                      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                        <div className="flex items-center gap-1.5 font-medium text-slate-600 truncate max-w-[55%]">
                          <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                          <span className="truncate">{item.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-medium text-slate-500 shrink-0">
                          <Calendar className="w-3.5 h-3.5 text-amber-600" />
                          <span>{item.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleView(item)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      <button
                        onClick={() => handleEdit(item)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDelete(id)}
                        disabled={deleteMutation.isPending}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isViewModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full relative shadow-2xl space-y-4 border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/60 rounded-full text-xs font-bold uppercase tracking-wider">
                {selectedItem.category}
              </span>
            </div>

            <h2 className="text-lg font-bold text-slate-800 leading-snug">{selectedItem.title}</h2>

            <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-72 bg-slate-50">
              <img src={selectedItem.imageUrl} alt={selectedItem.title} className="w-full h-full object-cover" />
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" /> {selectedItem.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-600" /> {selectedItem.date}
              </span>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl space-y-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Update Gallery Photo</h2>
              <p className="text-xs text-slate-500 mt-0.5">Modify event details or uploaded photo image</p>
            </div>

            <form onSubmit={handleSubmit(onUpdateSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Category</label>
                <select
                  {...register("category")}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-xs font-medium text-slate-800 focus:outline-none transition-all"
                >
                  <option value="Conferences">Conferences</option>
                  <option value="Moments">Moments</option>
                  <option value="Seminars">Seminars</option>
                  <option value="Workshops">Workshops</option>
                  <option value="Awards">Awards</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Title / Caption</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-xs font-medium text-slate-800 focus:outline-none transition-all"
                  {...register("title", { required: true })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Location</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-xs font-medium text-slate-800 focus:outline-none transition-all"
                    {...register("location", { required: true })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Date</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-xs font-medium text-slate-800 focus:outline-none transition-all"
                    {...register("date", { required: true })}
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Update Image</label>

                <label className="border-2 border-dashed border-slate-200 hover:border-emerald-600 rounded-2xl p-4 flex items-center justify-center gap-2 cursor-pointer bg-slate-50 hover:bg-emerald-50/40 transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleModalFileProcess(e.target.files[0])}
                    className="hidden"
                  />
                  <Upload className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold text-slate-700">Choose New Image File</span>
                </label>

                <input
                  type="url"
                  placeholder="Or paste direct image URL"
                  {...register("imageUrlInput")}
                  onChange={(e) => {
                    setValue("imageUrlInput", e.target.value);
                    setModalImgUrl("");
                  }}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-xs font-medium text-slate-800 focus:outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="w-full py-3 bg-[#163A2D] hover:bg-[#0C2219] text-amber-300 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-70 mt-4"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Updating Gallery...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Save Changes
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {activeImage && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center">
            <button
              onClick={() => setActiveImage(null)}
              className="absolute -top-10 right-0 p-2 text-white hover:text-amber-400 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img src={activeImage} alt="Full Preview" className="w-full h-full object-contain rounded-2xl border border-white/20 shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllGallery;