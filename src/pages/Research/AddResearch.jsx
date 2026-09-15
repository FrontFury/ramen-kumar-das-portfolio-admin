import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BookOpen, UploadCloud, Loader2, Sparkles } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const AddResearch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.research || null;

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      authors: "",
      title: "",
      conference: "",
      eventDate: "",
      location: "",
      certificateUrl: "",
    },
  });

  // Populate data if Editing
  useEffect(() => {
    if (editData) {
      reset({
        authors: editData.authors || "",
        title: editData.title || "",
        conference: editData.conference || "",
        eventDate: editData.eventDate || "",
        location: editData.location || "",
        certificateUrl: editData.certificateUrl || "",
      });
      setImagePreview(editData.certificateUrl || null);
    }
  }, [editData, reset]);

  // Set Local Image Preview and File State
  const handleImageFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      toast.success("Certificate image selected!");
    } else {
      toast.error("Please upload a valid image file!");
    }
  };

  // POST or PATCH Submit Handler
  const onSubmit = async (data) => {
    setLoading(true);

    const id = editData?._id || editData?.id;
    const url = id
      ? `http://localhost:3000/researches/${id}`
      : "http://localhost:3000/researches";

    try {
      let finalCertificateUrl = data.certificateUrl;

      // যদি ফাইল চুজ বা ড্র্যাগ-অ্যান্ড-ড্রপ করা হয়ে থাকে
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
        ...data,
        certificateUrl: finalCertificateUrl,
        updatedAt: new Date().toISOString(),
      };

      if (id) {
        await axios.patch(url, payload);
        toast.success("Research updated successfully!");
      } else {
        await axios.post(url, payload);
        toast.success("Research added successfully!");
      }

      setTimeout(() => navigate("/research/all"), 1500);
    } catch (err) {
      console.error("Submission error:", err);
      toast.error(err.message || err.response?.data?.message || "Operation failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl border border-emerald-100 p-6 sm:p-10 shadow-sm space-y-6 font-sans">
      <Toaster position="top-center" containerStyle={{ top: 80, zIndex: 99999 }} />

      <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
        <div className="p-3 bg-[#163A2D] text-amber-300 rounded-xl">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#163A2D]">
            {editData ? "Edit Research Paper" : "Add Research Paper"}
          </h1>
          <p className="text-xs text-gray-500">Insert publication, conference details, and certificate.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Authors */}
        <div>
          <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Authors</label>
          <input
            type="text"
            placeholder="e.g. Ramen Kumar Das, Sharier Jahan Rafi"
            {...register("authors", { required: "Authors field is required" })}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
          />
          {errors.authors && <span className="text-xs text-rose-500 mt-1">{errors.authors.message}</span>}
        </div>

        {/* Paper Title */}
        <div>
          <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Paper Title</label>
          <input
            type="text"
            placeholder="e.g. Data Analysis and Death Rate Prediction..."
            {...register("title", { required: "Title field is required" })}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
          />
          {errors.title && <span className="text-xs text-rose-500 mt-1">{errors.title.message}</span>}
        </div>

        {/* Conference / Journal */}
        <div>
          <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Conference / Journal</label>
          <input
            type="text"
            placeholder="e.g. INTERNATIONAL ANTALYA SCIENTIFIC RESEARCH..."
            {...register("conference", { required: "Conference field is required" })}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
          />
          {errors.conference && <span className="text-xs text-rose-500 mt-1">{errors.conference.message}</span>}
        </div>

        {/* Held Date & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Held Date</label>
            <input
              type="text"
              placeholder="e.g. May 24-25, 2026"
              {...register("eventDate", { required: "Date is required" })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
            />
            {errors.eventDate && <span className="text-xs text-rose-500 mt-1">{errors.eventDate.message}</span>}
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Location</label>
            <input
              type="text"
              placeholder="e.g. Antalya- Türkiye"
              {...register("location", { required: "Location is required" })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
            />
            {errors.location && <span className="text-xs text-rose-500 mt-1">{errors.location.message}</span>}
          </div>
        </div>

        {/* Drag & Drop Image */}
        <div>
          <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Certificate Image</label>
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files[0]) handleImageFile(e.dataTransfer.files[0]);
            }}
            className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              isDragging ? "border-emerald-600 bg-emerald-50/50" : "border-gray-200 bg-gray-50/50 hover:border-emerald-400"
            }`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && handleImageFile(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {imagePreview ? (
              <div className="flex flex-col items-center gap-2">
                <img src={imagePreview} alt="Certificate Preview" className="h-32 object-contain rounded-md border bg-white p-1" />
                <p className="text-xs text-emerald-800 font-semibold">Click or Drag to replace image.</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-500">
                <UploadCloud className="w-8 h-8 text-emerald-700" />
                <p className="text-xs font-medium">Drag & drop certificate image here, or click to browse</p>
                <span className="text-[10px] text-gray-400">PNG, JPG, WEBP (Max 5MB)</span>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#163A2D] hover:bg-[#0C2219] text-amber-300 font-semibold text-sm rounded-xl flex items-center justify-center gap-2 mt-4 cursor-pointer shadow-md transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{editData ? "Update Research" : "Save Research"}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddResearch;