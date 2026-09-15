import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Award, Hash, Building2, Calendar, Image as ImageIcon, ArrowLeft, Loader2, Save, Upload, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const AddCourse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.course || null;

  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    certificateNumber: "",
    organization: "",
    issueDate: "",
    certificateUrl: "",
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title || "",
        certificateNumber: editData.certificateNumber || "",
        organization: editData.organization || "",
        issueDate: editData.issueDate || "",
        certificateUrl: editData.certificateUrl || "",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ছবি প্রসেস করার ফাংশন
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

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, certificateUrl: reader.result }));
      toast.success("Image selected successfully!");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileProcess(file);
  };

  // Drag & Drop হ্যান্ডলার
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
    const file = e.dataTransfer.files[0];
    handleFileProcess(file);
  };

  const removeImage = (e) => {
    e.stopPropagation(); // যাতে ছবি রিমুভ বাটনে ক্লিক করলে ফাইল ডায়ালগ না খুলে
    e.preventDefault();
    setFormData((prev) => ({ ...prev, certificateUrl: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const id = editData?._id || editData?.id;

    try {
      if (editData) {
        await axios.patch(`http://localhost:3000/courses/${id}`, formData);
        toast.success("Course updated successfully!");
      } else {
        await axios.post("http://localhost:3000/courses", formData);
        toast.success("Course added successfully!");
      }
      setTimeout(() => navigate("/courses/all"), 1200);
    } catch (err) {
      toast.error(editData ? "Failed to update course!" : "Failed to add course!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto space-y-6 font-sans px-4 py-6">
      <Toaster position="top-center" containerStyle={{ top: 80, zIndex: 99999 }} />

      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-[#163A2D] to-[#0D251D] p-6 sm:p-8 rounded-3xl text-white shadow-xl">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight flex items-center gap-3">
            <Award className="w-7 h-7 text-amber-400" />
            {editData ? "Edit Certification / Course" : "Add New Course"}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80">
            {editData ? "Update existing course details." : "Fill in the details to add a new course or certificate."}
          </p>
        </div>
        <button
          onClick={() => navigate("/courses")}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Courses
        </button>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Title */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider">
              <Award className="w-4 h-4 text-emerald-600" /> Course / Certification Title *
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Introduction to Critical Infrastructure Protection (CIP)"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          {/* Certificate Number */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider">
              <Hash className="w-4 h-4 text-emerald-600" /> Certificate ID / Number
            </label>
            <input
              type="text"
              name="certificateNumber"
              placeholder="e.g. cDaP5Qdj5Q"
              value={formData.certificateNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          {/* Organization */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-emerald-600" /> Organization / Issued From *
            </label>
            <input
              type="text"
              name="organization"
              required
              placeholder="e.g. OPSWAT Academy"
              value={formData.organization}
              onChange={handleChange}
              className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          {/* Issue Date */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-emerald-600" /> Awarded / Issue Date *
            </label>
            <input
              type="text"
              name="issueDate"
              required
              placeholder="e.g. 12th August, 2026"
              value={formData.issueDate}
              onChange={handleChange}
              className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          {/* Clickable Drag & Drop Zone */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-xs font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider">
              <ImageIcon className="w-4 h-4 text-emerald-600" /> Certificate Image (Upload or URL)
            </span>
            
            {/* Clickable Full Box */}
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
                onChange={handleFileChange}
                className="hidden"
              />

              {formData.certificateUrl ? (
                <div className="relative group w-full max-w-sm h-48 rounded-2xl overflow-hidden border border-gray-200 bg-white">
                  <img
                    src={formData.certificateUrl}
                    alt="Uploaded Certificate"
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
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
                    <p className="text-sm font-semibold text-gray-700">
                      Click anywhere or Drag & Drop your certificate image here
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Supports PNG, JPG, JPEG, WEBP (Max 5MB)</p>
                  </div>
                </>
              )}
            </label>

            {/* Direct Image URL Input */}
            <div className="pt-2">
              <span className="text-xs text-gray-400 font-medium block mb-1">Or paste an Image URL directly:</span>
              <input
                type="url"
                name="certificateUrl"
                placeholder="https://example.com/certificate.jpg"
                value={formData.certificateUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-[#163A2D] font-bold text-sm rounded-2xl shadow-lg hover:shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {editData ? "Update Course" : "Save Course"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourse;