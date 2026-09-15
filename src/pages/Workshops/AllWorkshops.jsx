import React, { useState, useEffect } from "react";
import {
  Eye,
  Edit3,
  Trash2,
  X,
  Loader2,
  Award,
  ExternalLink,
  Calendar,
  Building2,
  Sparkles,
  Clock,
  CheckCircle2,
  Tag,
  Upload,
  Presentation,
} from "lucide-react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

const AllWorkshops = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [modalCertUrl, setModalCertUrl] = useState("");
  const [activeImage, setActiveImage] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // GET: Fetch Workshops
  const fetchWorkshops = async () => {
    try {
      const res = await fetch("http://localhost:3000/workshops");
      if (!res.ok) throw new Error("Failed to fetch workshops");
      const data = await res.json();
      setWorkshops(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load workshops list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  // Open View Modal
  const handleView = (item) => {
    setSelectedWorkshop(item);
    setIsViewModalOpen(true);
  };

  // Open Edit Modal
  const handleEdit = (item) => {
    setSelectedWorkshop(item);
    setModalCertUrl(item.certificateUrl || "");
    reset({
      title: item.title || "",
      type: item.type || "Workshop",
      organizer: item.organizer || "",
      date: item.date || "",
      certificateUrlInput: item.certificateUrl || "",
    });
    setIsEditModalOpen(true);
  };

  // Handle Certificate Image File Upload (Base64)
  const handleModalFileProcess = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setModalCertUrl(reader.result);
      setValue("certificateUrlInput", reader.result);
      toast.success("Image uploaded!");
    };
    reader.readAsDataURL(file);
  };

  // DELETE: Remove Workshop
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this workshop record?"))
      return;

    try {
      const res = await fetch(`http://localhost:3000/workshops/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete workshop.");

      toast.success("Workshop record deleted! 🗑️");
      setWorkshops((prev) =>
        prev.filter((item) => (item.id || item._id) !== id)
      );
    } catch (err) {
      console.error(err);
      toast.error("Error deleting item!");
    }
  };

  // PATCH: Update Workshop
  const onUpdateSubmit = async (data) => {
    setUpdating(true);

    try {
      const updatedData = {
        title: data.title,
        type: data.type,
        organizer: data.organizer,
        date: data.date,
        certificateUrl: modalCertUrl || data.certificateUrlInput || "",
      };

      const targetId = selectedWorkshop.id || selectedWorkshop._id;

      const backendRes = await fetch(
        `http://localhost:3000/workshops/${targetId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );

      if (!backendRes.ok) throw new Error("Failed to update workshop data.");

      toast.success("Workshop updated successfully! ✨");
      setIsEditModalOpen(false);
      fetchWorkshops();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen font-sans p-4 sm:p-6 lg:pr-24">
      <Toaster position="top-center" containerStyle={{ top: 80, zIndex: 99999 }} />

      <div className="max-w-5xl mx-auto space-y-8">
        {/* HERO / HEADER SECTION */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#163A2D] via-[#102a21] to-[#0A1C16] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-900/50">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-amber-300 rounded-2xl backdrop-blur-md shadow-inner">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Playfair_Display',serif] tracking-wide">
                    Workshops & Seminars
                  </h1>
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <p className="text-sm text-emerald-200/80 mt-1 font-medium">
                  Organize, manage and showcase your academic achievements & certifications.
                </p>
              </div>
            </div>

            <div className="bg-emerald-950/60 border border-emerald-800/40 px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-300">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Total Entries: {workshops.length}</span>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 bg-white rounded-3xl border border-emerald-100 shadow-xs">
            <Loader2 className="w-10 h-10 text-[#163A2D] animate-spin mb-3" />
            <p className="text-sm text-gray-500 font-semibold tracking-wide">
              Fetching your workshop events...
            </p>
          </div>
        ) : workshops.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-emerald-100 shadow-xs space-y-3">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <p className="text-base font-bold text-gray-700">No Workshops Found</p>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Start expanding your portfolio by adding certificates, seminars, or workshop records.
            </p>
          </div>
        ) : (
          /* TIMELINE WRAPPER */
          <div className="relative pl-4 sm:pl-8 space-y-6 before:absolute before:left-2 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-emerald-600 before:via-emerald-200 before:to-gray-200">
            {workshops.map((item, index) => {
              const id = item._id || item.id;

              return (
                <div key={id || index} className="relative group">
                  {/* Timeline Dot Node */}
                  <div className="absolute -left-[21px] sm:-left-[37px] top-6 w-4 h-4 rounded-full border-2 border-emerald-600 bg-emerald-500 ring-4 ring-emerald-100 transition-all duration-300 group-hover:scale-125" />

                  {/* Workshop Card */}
                  <div className="bg-white rounded-2xl border border-emerald-100/80 shadow-xs hover:shadow-lg hover:border-emerald-300 transition-all duration-300 p-6 space-y-4">
                    {/* Header Row: Title, Tag & Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-gray-100 pb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-lg sm:text-xl font-bold text-[#163A2D] font-['Playfair_Display',serif] tracking-wide">
                            {item.title}
                          </h2>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Tag className="w-3 h-3 text-emerald-600" />
                            {item.type || "Workshop"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm font-bold text-[#C2410C]">
                          <Building2 className="w-4 h-4 shrink-0" />
                          <span>{item.organizer}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5 self-end sm:self-start bg-gray-50/80 p-1 rounded-xl border border-gray-100">
                        <button
                          onClick={() => handleView(item)}
                          className="p-2 text-emerald-700 hover:bg-white hover:shadow-xs rounded-lg transition-all cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-amber-700 hover:bg-white hover:shadow-xs rounded-lg transition-all cursor-pointer"
                          title="Edit Record"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(id)}
                          className="p-2 text-rose-600 hover:bg-white hover:shadow-xs rounded-lg transition-all cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Content Preview & Thumbnail */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-1.5 bg-emerald-50/50 px-3 py-1.5 rounded-lg border border-emerald-100/60 text-emerald-900 text-xs font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{item.date}</span>
                      </div>

                      {item.certificateUrl && (
                        <button
                          onClick={() => setActiveImage(item.certificateUrl)}
                          className="flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50/80 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-emerald-600" />
                          <span>View Certificate</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* VIEW MODAL */}
      {isViewModalOpen && selectedWorkshop && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full relative shadow-2xl space-y-6 border border-emerald-100 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#163A2D] font-['Playfair_Display',serif]">
                  Workshop Details
                </h2>
                <p className="text-xs text-gray-400">Detailed record inspection</p>
              </div>
            </div>

            <div className="space-y-4 font-sans text-sm">
              <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Event Title & Organizer
                </span>
                <p className="text-lg font-bold text-[#163A2D]">
                  {selectedWorkshop.title}
                </p>
                <p className="text-sm font-semibold text-[#C2410C]">
                  {selectedWorkshop.organizer}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    Category Type
                  </span>
                  <p className="text-xs font-bold text-emerald-950 mt-1">
                    {selectedWorkshop.type || "Workshop"}
                  </p>
                </div>

                <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    Date / Period
                  </span>
                  <p className="text-xs font-bold text-emerald-950 mt-1">
                    {selectedWorkshop.date}
                  </p>
                </div>
              </div>

              {selectedWorkshop.certificateUrl && (
                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                    Certificate Document
                  </span>
                  <div className="relative rounded-2xl overflow-hidden border border-gray-200 max-h-56 bg-slate-50 group">
                    <img
                      src={selectedWorkshop.certificateUrl}
                      alt={selectedWorkshop.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setActiveImage(selectedWorkshop.certificateUrl)}
                      className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-amber-300" />
                      <span>Click to view full image</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && selectedWorkshop && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl space-y-6 border border-emerald-100 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-xl font-bold text-[#163A2D] font-['Playfair_Display',serif]">
                Update Workshop
              </h2>
              <p className="text-xs text-gray-500">
                Modify details for {selectedWorkshop.title}
              </p>
            </div>

            <form onSubmit={handleSubmit(onUpdateSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                  Workshop / Event Title
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-xl text-sm focus:outline-none transition-all"
                  {...register("title", { required: true })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                  Organizer / Institution Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-xl text-sm focus:outline-none transition-all"
                  {...register("organizer", { required: true })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                    Category Type
                  </label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-xl text-sm focus:outline-none transition-all"
                    {...register("type")}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                    Date / Period
                  </label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-xl text-sm focus:outline-none transition-all"
                    {...register("date", { required: true })}
                  />
                </div>
              </div>

              {/* Upload Certificate Image */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="block text-xs font-bold uppercase text-gray-600">
                  Certificate Image
                </label>

                <label className="border-2 border-dashed border-gray-200 hover:border-emerald-600 rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer bg-gray-50 hover:bg-emerald-50/50 transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleModalFileProcess(e.target.files[0])}
                    className="hidden"
                  />
                  <Upload className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold text-gray-600">Choose File to Upload</span>
                </label>

                <input
                  type="url"
                  placeholder="Or paste image URL"
                  {...register("certificateUrlInput")}
                  onChange={(e) => setModalCertUrl(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-xl text-xs focus:outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full py-3 bg-[#163A2D] hover:bg-[#0C2219] text-amber-300 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-70 mt-2"
              >
                {updating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating Record...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FULL IMAGE PREVIEW MODAL */}
      {activeImage && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/90 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center">
            <button
              onClick={() => setActiveImage(null)}
              className="absolute -top-10 right-0 p-2 text-white hover:text-amber-400 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={activeImage}
              alt="Full Preview"
              className="w-full h-full object-contain rounded-2xl border border-white/20"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllWorkshops;