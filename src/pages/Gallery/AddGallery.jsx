import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { 
  ImagePlus, 
  Tag, 
  Type, 
  MapPin, 
  Calendar, 
  Upload, 
  CheckCircle2, 
  Loader2, 
  Sparkles,
  X
} from "lucide-react";

const AddGallery = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Handle File Upload (Convert to Base64)
  const handleFileProcess = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result);
      setValue("imageUrl", reader.result);
      toast.success("Image selected!");
    };
    reader.readAsDataURL(file);
  };

  // POST: Add new gallery item using Axios
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        category: data.category || "Conferences",
        title: data.title,
        location: data.location,
        date: data.date,
        imageUrl: imageUrl || data.imageUrlInput || "",
      };

      const res = await axios.post("http://localhost:3000/gallery", payload);

      if (res.status === 201 || res.status === 200) {
        toast.success("Gallery item added successfully! ✨");
        reset();
        setImageUrl("");
        
        // Redirect to /gallery/all after a brief delay for toast visibility
        setTimeout(() => {
          navigate("/gallery/all");
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add gallery item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <Toaster position="top-center" containerStyle={{ top: 40, zIndex: 99999 }} />

      <div className="max-w-3xl mx-auto space-y-6">
        {/* HEADER SECTION */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0F291E] via-[#163A2D] to-[#0A1C16] text-white p-6 sm:p-10 rounded-3xl shadow-2xl border border-emerald-800/40">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex items-center gap-5">
            <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 text-amber-400 rounded-2xl shadow-inner backdrop-blur-md">
              <ImagePlus className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                  Add New Photo
                </h1>
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
              <p className="text-sm text-emerald-200/90 mt-1 font-medium">
                Upload and showcase your memorable moments and event photos.
              </p>
            </div>
          </div>
        </div>

        {/* FORM CONTAINER */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Category Dropdown/Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-700" />
                Category
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-sm font-medium text-slate-800 focus:outline-none transition-all"
              >
                <option value="Conferences">Conferences</option>
                <option value="Moments">Moments</option>
                <option value="Seminars">Seminars</option>
                <option value="Workshops">Workshops</option>
                <option value="Awards">Awards</option>
              </select>
              {errors.category && (
                <span className="text-xs text-rose-500 mt-1 block">{errors.category.message}</span>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-emerald-700" />
                Title / Caption
              </label>
              <input
                type="text"
                placeholder="e.g. Receiving the Award for Poster Presentation @ ISRT"
                {...register("title", { required: "Title is required" })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-sm font-medium text-slate-800 focus:outline-none transition-all"
              />
              {errors.title && (
                <span className="text-xs text-rose-500 mt-1 block">{errors.title.message}</span>
              )}
            </div>

            {/* Location and Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  Location / Venue
                </label>
                <input
                  type="text"
                  placeholder="e.g. ISRT, University of Dhaka"
                  {...register("location", { required: "Location is required" })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-sm font-medium text-slate-800 focus:outline-none transition-all"
                />
                {errors.location && (
                  <span className="text-xs text-rose-500 mt-1 block">{errors.location.message}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                  Date / Month Year
                </label>
                <input
                  type="text"
                  placeholder="e.g. December 2025"
                  {...register("date", { required: "Date is required" })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-sm font-medium text-slate-800 focus:outline-none transition-all"
                />
                {errors.date && (
                  <span className="text-xs text-rose-500 mt-1 block">{errors.date.message}</span>
                )}
              </div>
            </div>

            {/* Image Upload Option */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-emerald-700" />
                Upload Photo / Image URL
              </label>

              <label className="border-2 border-dashed border-slate-200 hover:border-emerald-600 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50 hover:bg-emerald-50/40 transition-all group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileProcess(e.target.files[0])}
                  className="hidden"
                />
                <Upload className="w-6 h-6 text-emerald-700 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-700">
                  Click to Choose File (Image)
                </span>
              </label>

              <input
                type="url"
                placeholder="Or paste Direct Image URL"
                {...register("imageUrlInput")}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-xs font-medium text-slate-800 focus:outline-none transition-all"
              />

              {imageUrl && (
                <div className="mt-3 relative rounded-xl overflow-hidden border border-emerald-200 h-44 bg-slate-900/5 flex items-center justify-center">
                  <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl("");
                      setValue("imageUrlInput", "");
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#163A2D] hover:bg-[#0C2219] text-amber-300 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl disabled:opacity-70 mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Gallery Entry...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish to Gallery</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddGallery;