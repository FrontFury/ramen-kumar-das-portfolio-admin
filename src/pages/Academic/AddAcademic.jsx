import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  GraduationCap, 
  Building2, 
  BookOpen, 
  Award, 
  Calendar, 
  ArrowLeft, 
  Loader2, 
  Save, 
  Upload, 
  X, 
  Image as ImageIcon 
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const AddAcademic = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.academic || null;

  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    department: "",
    cgpa: "",
    duration: "",
    certificateUrl: "",
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        degree: editData.degree || "",
        institution: editData.institution || "",
        department: editData.department || "",
        cgpa: editData.cgpa || "",
        duration: editData.duration || "",
        certificateUrl: editData.certificateUrl || "",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, certificateUrl: reader.result }));
      toast.success("Certificate image selected!");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    handleFileProcess(e.target.files[0]);
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
    handleFileProcess(e.dataTransfer.files[0]);
  };

  const removeImage = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setFormData((prev) => ({ ...prev, certificateUrl: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const id = editData?._id || editData?.id;

    try {
      if (editData) {
        await axios.patch(`http://localhost:3000/academics/${id}`, formData);
        toast.success("Academic qualification updated!");
      } else {
        await axios.post("http://localhost:3000/academics", formData);
        toast.success("Academic qualification added!");
      }
      setTimeout(() => navigate("/academic/all"), 1200);
    } catch (err) {
      toast.error(editData ? "Failed to update record!" : "Failed to add record!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 font-sans px-4 py-8">
      <Toaster position="top-center" containerStyle={{ top: 80, zIndex: 99999 }} />

      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-[#0D251D] via-[#163A2D] to-[#0A1E17] p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-emerald-800/40">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-amber-400" />
            {editData ? "Edit Qualification" : "Add Academic Record"}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80">
            {editData ? "Update your academic degree details." : "Fill in your educational background details."}
          </p>
        </div>
        <button
          onClick={() => navigate("/academic/all")}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Academics
        </button>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Degree */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 text-emerald-600" /> Degree Title *
            </label>
            <input
              type="text"
              name="degree"
              required
              placeholder="e.g. M.Sc. Eng. in Information Security (Ongoing)"
              value={formData.degree}
              onChange={handleChange}
              className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          {/* Institution */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-emerald-600" /> Institution Name *
            </label>
            <input
              type="text"
              name="institution"
              required
              placeholder="e.g. Bangladesh University of Engineering & Technology (BUET)"
              value={formData.institution}
              onChange={handleChange}
              className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          {/* Department / Institute */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-emerald-600" /> Department / Institute
            </label>
            <input
              type="text"
              name="department"
              placeholder="e.g. Institute of Information & Communication Technology (IICT)"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          {/* CGPA */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider">
              <Award className="w-4 h-4 text-emerald-600" /> CGPA / Result
            </label>
            <input
              type="text"
              name="cgpa"
              placeholder="e.g. CGPA 3.30 out of 4"
              value={formData.cgpa}
              onChange={handleChange}
              className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          {/* Duration / Timeline */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-emerald-600" /> Session / Duration *
            </label>
            <input
              type="text"
              name="duration"
              required
              placeholder="e.g. September 2024- till (more than 80% marks-coursework completed)"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          {/* Certificate Image Upload */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-xs font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider">
              <ImageIcon className="w-4 h-4 text-emerald-600" /> Academic Document / Certificate (Optional)
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
                      Click anywhere or Drag & Drop transcript/certificate image
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG, WEBP (Max 5MB)</p>
                  </div>
                </>
              )}
            </label>

            <div className="pt-2">
              <span className="text-xs text-gray-400 font-medium block mb-1">Or paste document URL directly:</span>
              <input
                type="url"
                name="certificateUrl"
                placeholder="https://example.com/transcript.jpg"
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
            className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-[#0D251D] font-extrabold text-sm rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {editData ? "Update Record" : "Save Record"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAcademic;