import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  GraduationCap, 
  Building2, 
  BookOpen, 
  Award, 
  Calendar, 
  Plus, 
  Edit3, 
  Trash2, 
  Maximize2, 
  X, 
  Sparkles,
  Loader2,
  Save,
  Upload,
  ImageIcon
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const AllAcademic = () => {
  const [academics, setAcademics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);

  // Modal & Edit State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    department: "",
    cgpa: "",
    duration: "",
    certificateUrl: "",
  });

  const fetchAcademics = async () => {
    try {
      const response = await axios.get("http://localhost:3000/academics");
      setAcademics(response.data);
    } catch (err) {
      toast.error("Failed to load academic records!");
    }  finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademics();
  }, []);

  // Open Modal for Edit
  const handleOpenEditModal = (item) => {
    const id = item._id || item.id;
    setEditingId(id);
    setFormData({
      degree: item.degree || "",
      institution: item.institution || "",
      department: item.department || "",
      cgpa: item.cgpa || "",
      duration: item.duration || "",
      certificateUrl: item.certificateUrl || "",
    });
    setIsModalOpen(true);
  };

  // Close Modal & Reset Form
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      degree: "",
      institution: "",
      department: "",
      cgpa: "",
      duration: "",
      certificateUrl: "",
    });
  };

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

  // Submit PATCH Request
  const handlePatchSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);

    try {
      const response = await axios.patch(
        `http://localhost:3000/academics/${editingId}`,
        formData
      );

      toast.success("Academic qualification updated!");

      // Update local state UI without full refetch
      setAcademics((prev) =>
        prev.map((item) =>
          (item._id || item.id) === editingId ? { ...item, ...formData } : item
        )
      );

      handleCloseModal();
    } catch (err) {
      console.error("PATCH Error:", err.response?.data || err.message);
      toast.error("Failed to update record!");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this academic record?")) return;

    try {
      await axios.delete(`http://localhost:3000/academics/${id}`);
      toast.success("Academic record deleted successfully!");
      setAcademics((prev) => prev.filter((item) => (item._id || item.id) !== id));
    } catch (err) {
      toast.error("Failed to delete record!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
          <GraduationCap className="w-6 h-6 text-emerald-700 absolute" />
        </div>
        <p className="text-sm font-bold tracking-wide text-emerald-950 animate-pulse">
          LOADING ACADEMIC RECORDS...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 font-sans px-4 py-8 max-w-7xl mx-auto">
      <Toaster position="top-center" containerStyle={{ top: 80, zIndex: 99999 }} />

      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0D251D] via-[#163A2D] to-[#0A1E17] p-8 sm:p-10 rounded-3xl text-white shadow-2xl border border-emerald-800/40">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-400/15 border border-amber-400/30 rounded-full backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-xs font-bold tracking-wider text-amber-300 uppercase">
                Educational Background
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3 uppercase">
              <GraduationCap className="w-8 h-8 text-amber-400" /> Academic Qualifications
            </h1>
            <p className="text-sm text-emerald-100/80 max-w-xl leading-relaxed">
              Academic degrees, engineering diplomas, and specialized university programs.
            </p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {academics.length === 0 && (
        <div className="text-center py-20 bg-emerald-50/30 rounded-3xl border-2 border-dashed border-emerald-200/70 space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <GraduationCap className="w-8 h-8 opacity-80" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-800">No Academic Records Found</h3>
          </div>
        </div>
      )}

      {/* List Display */}
      <div className="space-y-6">
        {academics.map((item, index) => {
          const id = item._id || item.id;
          return (
            <div
              key={id}
              className="group relative bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-2xl hover:border-emerald-200/80 transition-all duration-500 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-rose-400 via-emerald-600 to-[#163A2D] opacity-90 group-hover:opacity-100 transition-opacity" />

              <div className="md:col-span-4 flex justify-center items-center">
                {item.certificateUrl ? (
                  <div className="relative group/img overflow-hidden rounded-2xl border border-gray-100 bg-gray-900/5 shadow-md w-full max-h-56 h-full flex items-center justify-center min-h-[180px]">
                    <img
                      src={item.certificateUrl}
                      alt="Academic Certificate"
                      className="w-full h-full object-contain transform group-hover/img:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div 
                      onClick={() => setActiveImage(item.certificateUrl)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer backdrop-blur-[2px]"
                    >
                      <span className="px-4 py-2 bg-white text-gray-900 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg">
                        <Maximize2 className="w-4 h-4 text-emerald-700" /> Preview Document
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-44 bg-gradient-to-br from-emerald-50/50 to-amber-50/30 rounded-2xl flex flex-col items-center justify-center gap-2 text-xs text-gray-400 border border-dashed border-gray-200/80">
                    <GraduationCap className="w-10 h-10 text-emerald-500/60" />
                    <span className="font-bold text-emerald-900/40 uppercase tracking-wide text-[11px]">Degree Credential</span>
                  </div>
                )}
              </div>

              <div className="md:col-span-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-rose-100 to-rose-200 text-rose-800 font-black text-xs flex items-center justify-center shadow-sm border border-rose-300/40 mt-0.5">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-lg sm:text-xl font-extrabold text-rose-700 leading-snug tracking-tight">
                      • {item.degree}
                    </h2>
                  </div>

                  <div className="pl-11 space-y-2">
                    <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-gray-800">
                      <Building2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{item.institution}</span>
                    </div>

                    {item.department && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-600">
                        <BookOpen className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span>{item.department}</span>
                      </div>
                    )}

                    {item.cgpa && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/80 rounded-xl text-xs font-bold text-amber-900 mt-1">
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                        <span>{item.cgpa}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pl-11 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 mt-auto">
                  <div className="flex items-center gap-2">
                    {item.duration && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-xs font-medium text-gray-600">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" /> {item.duration}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="px-4 py-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-300 shadow-sm hover:shadow-emerald-600/20 active:scale-95 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(id)}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-300 shadow-sm hover:shadow-rose-600/20 active:scale-95 cursor-pointer"
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

      {/* EDIT MODAL WITH PATCH OPERATION */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 my-8 animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0D251D] via-[#163A2D] to-[#0A1E17] p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-amber-400" />
                <h2 className="text-xl font-bold uppercase tracking-wide">Edit Qualification</h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handlePatchSubmit} className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider">
                    <GraduationCap className="w-4 h-4 text-emerald-600" /> Degree Title *
                  </label>
                  <input
                    type="text"
                    name="degree"
                    required
                    placeholder="e.g. M.Sc. Eng. in Information Security"
                    value={formData.degree}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider">
                    <Building2 className="w-4 h-4 text-emerald-600" /> Institution Name *
                  </label>
                  <input
                    type="text"
                    name="institution"
                    required
                    placeholder="e.g. BUET"
                    value={formData.institution}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider">
                    <BookOpen className="w-4 h-4 text-emerald-600" /> Department / Institute
                  </label>
                  <input
                    type="text"
                    name="department"
                    placeholder="e.g. IICT"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  />
                </div>

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

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider">
                    <Calendar className="w-4 h-4 text-emerald-600" /> Session / Duration *
                  </label>
                  <input
                    type="text"
                    name="duration"
                    required
                    placeholder="e.g. September 2024- till"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  />
                </div>

                <div className="md:col-span-2 space-y-3">
                  <span className="text-xs font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider">
                    <ImageIcon className="w-4 h-4 text-emerald-600" /> Academic Document / Certificate
                  </span>
                  
                  <label
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-3xl p-5 transition-all flex flex-col items-center justify-center gap-2 text-center cursor-pointer block ${
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
                      <div className="relative group w-full max-w-xs h-36 rounded-2xl overflow-hidden border border-gray-200 bg-white">
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
                        <div className="p-2.5 bg-emerald-100/60 rounded-full text-emerald-700">
                          <Upload className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-semibold text-gray-700">
                          Click or Drag & Drop certificate image
                        </p>
                      </>
                    )}
                  </label>

                  <input
                    type="url"
                    name="certificateUrl"
                    placeholder="Or paste document URL directly"
                    value={formData.certificateUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-[#0D251D] font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {updateLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Update Qualification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Full Preview Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setActiveImage(null)}
              className="absolute -top-12 right-0 p-2.5 bg-white/10 hover:bg-white/30 text-white rounded-full transition-all cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={activeImage}
              alt="Academic Document Preview"
              className="w-full h-full object-contain rounded-2xl shadow-2xl border border-white/15"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAcademic;