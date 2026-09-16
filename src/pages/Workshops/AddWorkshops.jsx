import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hook/useAxiosSecure"; 
import { 
  Presentation, 
  Building2, 
  Calendar, 
  Upload, 
  X, 
  PlusCircle, 
  Loader2, 
  Sparkles,
  Tag,
  ImageIcon
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const AddWorkshops = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // TanStack Query Mutation for adding a workshop
  const { mutateAsync: addWorkshop, isPending } = useMutation({
    mutationFn: async (newWorkshop) => {
      const res = await axiosSecure.post("/workshops", newWorkshop);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Workshop added successfully!");
      // Invalidate workshops list query to refresh cached data
      queryClient.invalidateQueries({ queryKey: ["workshops"] });
      
      reset();
      setSelectedFile(null);
      setPreviewUrl("");

      setTimeout(() => {
        navigate("/workshops/all");
      }, 1000);
    },
    onError: (error) => {
      console.error("Error adding workshop:", error);
      toast.error(error?.response?.data?.message || error.message || "Failed to add workshop!");
    },
  });

  // Selected file validation and preview setup
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
    setPreviewUrl(URL.createObjectURL(file));
    toast.success("Certificate image selected!");
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
    setPreviewUrl("");
  };

  // Submit Handler with ImageBB Upload & Mutation
  const onSubmit = async (data) => {
    try {
      let finalCertificateUrl = data.certificateUrlInput || "";

      // Upload file to ImageBB if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);

        const imgBbRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
          {
            method: "POST",
            body: formData,
          }
        );

        const imgBbResult = await imgBbRes.json();

        if (!imgBbResult.success) {
          throw new Error("Image upload to ImageBB failed!");
        }

        finalCertificateUrl = imgBbResult.data.display_url;
      }

      const payload = {
        title: data.title,
        type: data.type || "Workshop",
        organizer: data.organizer,
        date: data.date,
        certificateUrl: finalCertificateUrl,
      };

      // Trigger TanStack Query Mutation
      await addWorkshop(payload);

    } catch (error) {
      toast.error(error.message || "Something went wrong during submission!");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 font-sans space-y-8">
      <Toaster position="top-center" containerStyle={{ top: 80, zIndex: 99999 }} />

      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0D251D] via-[#163A2D] to-[#0A1E17] p-8 sm:p-10 rounded-3xl text-white shadow-2xl border border-emerald-800/40">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-400/15 border border-amber-400/30 rounded-full backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-xs font-bold tracking-wider text-amber-300 uppercase">
              Add New Record
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3 uppercase">
            <Presentation className="w-8 h-8 text-amber-400" /> Add Workshop / Seminar
          </h1>
          <p className="text-sm text-emerald-100/80 max-w-xl leading-relaxed">
            Add detailed records of workshops, training sessions, and academic seminars attended or organized.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Title */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider">
                <Presentation className="w-4 h-4 text-emerald-600" /> Workshop Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Workshop on 3D Printing Technology"
                {...register("title", { required: "Workshop title is required" })}
                className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
              {errors.title && (
                <p className="text-xs text-rose-500 font-semibold">{errors.title.message}</p>
              )}
            </div>

            {/* Type / Badge */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider">
                <Tag className="w-4 h-4 text-emerald-600" /> Event Category / Type
              </label>
              <input
                type="text"
                placeholder="e.g. Workshop, Seminar, Training"
                defaultValue="Workshop"
                {...register("type")}
                className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-emerald-600" /> Date / Duration *
              </label>
              <input
                type="text"
                placeholder="e.g. October 5, 2017"
                {...register("date", { required: "Date is required" })}
                className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
              {errors.date && (
                <p className="text-xs text-rose-500 font-semibold">{errors.date.message}</p>
              )}
            </div>

            {/* Organizer */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-emerald-600" /> Organizer / Department *
              </label>
              <input
                type="text"
                placeholder="e.g. Department of Information & Communication Engineering, University of Rajshahi"
                {...register("organizer", { required: "Organizer details are required" })}
                className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
              {errors.organizer && (
                <p className="text-xs text-rose-500 font-semibold">{errors.organizer.message}</p>
              )}
            </div>

            {/* Image Upload Area */}
            <div className="md:col-span-2 space-y-3">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider">
                <ImageIcon className="w-4 h-4 text-emerald-600" /> Certificate Document / Image
              </span>
              
              <label
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-3xl p-6 transition-all flex flex-col items-center justify-center gap-3 text-center cursor-pointer block ${
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

                {previewUrl ? (
                  <div className="relative group w-full max-w-sm h-40 rounded-2xl overflow-hidden border border-gray-200 bg-white">
                    <img
                      src={previewUrl}
                      alt="Certificate Preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-full shadow-md hover:bg-rose-700 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="p-3 bg-emerald-100/60 rounded-full text-emerald-700">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">
                        Click or Drag & Drop Certificate Image
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">PNG, JPG or WebP up to 5MB</p>
                    </div>
                  </>
                )}
              </label>

              <input
                type="url"
                placeholder="Or paste image URL directly"
                {...register("certificateUrlInput")}
                className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-[#0D251D] font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" /> Add Workshop
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWorkshops;