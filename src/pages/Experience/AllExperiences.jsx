import React, { useState, useEffect } from "react";
import {
  Eye,
  Edit3,
  Trash2,
  X,
  Loader2,
  Briefcase,
  ExternalLink,
  Calendar,
  Building2,
  GraduationCap,
  MapPin,
  Sparkles,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const AllExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExp, setSelectedExp] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const isCurrentlyWorking = watch("currentlyWorking", false);

  // GET: Fetch Experiences
  const fetchExperiences = async () => {
    try {
      const res = await fetch("http://localhost:3000/experiences");
      if (!res.ok) throw new Error("Failed to fetch experiences");
      const data = await res.json();
      setExperiences(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load experience list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  // Open View Modal
  const handleView = (exp) => {
    setSelectedExp(exp);
    setIsViewModalOpen(true);
  };

  // Open Edit Modal
  const handleEdit = (exp) => {
    setSelectedExp(exp);
    reset({
      designation: exp.designation || "",
      organization: exp.organization || "",
      institutionDetails: exp.institutionDetails || "",
      topicsOrAddress: exp.topicsOrAddress || "",
      startDate: exp.startDate || "",
      endDate: exp.endDate === "till" ? "" : exp.endDate || "",
      currentlyWorking: exp.currentlyWorking || exp.endDate === "till",
      websiteLink: exp.websiteLink || "",
    });
    setIsEditModalOpen(true);
  };

  // DELETE: Remove Experience
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this experience record?"))
      return;

    try {
      const res = await fetch(`http://localhost:3000/experiences/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete experience.");

      toast.success("Experience record deleted! 🗑️");
      setExperiences((prev) =>
        prev.filter((item) => item.id !== id && item._id !== id)
      );
    } catch (err) {
      console.error(err);
      toast.error("Error deleting item!");
    }
  };

  // PATCH: Update Experience
  const onUpdateSubmit = async (data) => {
    setUpdating(true);

    try {
      const updatedData = {
        designation: data.designation,
        organization: data.organization,
        institutionDetails: data.institutionDetails || "",
        topicsOrAddress: data.topicsOrAddress || "",
        startDate: data.startDate,
        endDate: data.currentlyWorking ? "till" : data.endDate || "till",
        currentlyWorking: data.currentlyWorking || false,
        websiteLink: data.websiteLink || "",
      };

      const targetId = selectedExp.id || selectedExp._id;

      const backendRes = await fetch(
        `http://localhost:3000/experiences/${targetId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );

      if (!backendRes.ok) throw new Error("Failed to update experience data.");

      toast.success("Experience updated successfully! ✨");
      setIsEditModalOpen(false);
      fetchExperiences();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen font-sans p-4 sm:p-6 lg:pr-24">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* HERO / HEADER SECTION */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#163A2D] via-[#102a21] to-[#0A1C16] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-900/50">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-amber-300 rounded-2xl backdrop-blur-md shadow-inner">
                <Briefcase className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Playfair_Display',serif] tracking-wide">
                    Career Timeline
                  </h1>
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <p className="text-sm text-emerald-200/80 mt-1 font-medium">
                  Manage, organize and feature your professional trajectory.
                </p>
              </div>
            </div>

            <div className="bg-emerald-950/60 border border-emerald-800/40 px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-300">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Total Entries: {experiences.length}</span>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 bg-white rounded-3xl border border-emerald-100 shadow-xs">
            <Loader2 className="w-10 h-10 text-[#163A2D] animate-spin mb-3" />
            <p className="text-sm text-gray-500 font-semibold tracking-wide">
              Fetching your experience timeline...
            </p>
          </div>
        ) : experiences.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-emerald-100 shadow-xs space-y-3">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
              <Briefcase className="w-6 h-6" />
            </div>
            <p className="text-base font-bold text-gray-700">No Experiences Found</p>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Start building your professional resume by adding your past or present job roles.
            </p>
          </div>
        ) : (
          /* TIMELINE WRAPPER */
          <div className="relative pl-4 sm:pl-8 space-y-6 before:absolute before:left-2 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-emerald-600 before:via-emerald-200 before:to-gray-200">
            {experiences.map((exp, index) => {
              const isPresent = exp.currentlyWorking || exp.endDate === "till";

              return (
                <div key={exp.id || exp._id || index} className="relative group">
                  {/* Timeline Dot Node */}
                  <div
                    className={`absolute -left-[21px] sm:-left-[37px] top-6 w-4 h-4 rounded-full border-2 bg-white transition-all duration-300 ${
                      isPresent
                        ? "border-emerald-600 bg-emerald-500 ring-4 ring-emerald-100"
                        : "border-gray-300 group-hover:border-emerald-600 group-hover:scale-125"
                    }`}
                  />

                  {/* Experience Card */}
                  <div className="bg-white rounded-2xl border border-emerald-100/80 shadow-xs hover:shadow-lg hover:border-emerald-300 transition-all duration-300 p-6 space-y-4">
                    
                    {/* Header Row: Role & Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-gray-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-lg sm:text-xl font-bold text-[#163A2D] font-['Playfair_Display',serif] tracking-wide">
                            {exp.designation}
                          </h2>
                          {isPresent && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              Current Role
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-sm font-bold text-[#C2410C] mt-1">
                          <Building2 className="w-4 h-4 shrink-0" />
                          <span>{exp.organization}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5 self-end sm:self-start bg-gray-50/80 p-1 rounded-xl border border-gray-100">
                        <button
                          onClick={() => handleView(exp)}
                          className="p-2 text-emerald-700 hover:bg-white hover:shadow-xs rounded-lg transition-all cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(exp)}
                          className="p-2 text-amber-700 hover:bg-white hover:shadow-xs rounded-lg transition-all cursor-pointer"
                          title="Edit Record"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(exp.id || exp._id)}
                          className="p-2 text-rose-600 hover:bg-white hover:shadow-xs rounded-lg transition-all cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Metadata Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                      {exp.institutionDetails && (
                        <div className="flex items-start gap-2">
                          <GraduationCap className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                          <span className="text-gray-700 font-medium">
                            {exp.institutionDetails}
                          </span>
                        </div>
                      )}

                      {exp.topicsOrAddress && (
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                          <span className="text-gray-700 line-clamp-2">
                            {exp.topicsOrAddress}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Footer: Timeline & Portfolio */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-50 text-xs font-semibold text-gray-500">
                      <div className="flex items-center gap-1.5 bg-emerald-50/50 px-3 py-1.5 rounded-lg border border-emerald-100/60 text-emerald-900">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <span>
                          {exp.startDate} &mdash; {isPresent ? "Present" : exp.endDate}
                        </span>
                      </div>

                      {exp.websiteLink && (
                        <a
                          href={exp.websiteLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-all font-semibold"
                        >
                          <span>Visit Link</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
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
      {isViewModalOpen && selectedExp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full relative shadow-2xl space-y-6 border border-emerald-100 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#163A2D] font-['Playfair_Display',serif]">
                  Experience Overview
                </h2>
                <p className="text-xs text-gray-400">Detailed record inspection</p>
              </div>
            </div>

            <div className="space-y-4 font-sans text-sm">
              <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Role & Organization
                </span>
                <p className="text-lg font-bold text-[#163A2D]">
                  {selectedExp.designation}
                </p>
                <p className="text-sm font-semibold text-[#C2410C]">
                  {selectedExp.organization}
                </p>
              </div>

              {selectedExp.institutionDetails && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Institution Info
                  </span>
                  <p className="text-gray-700 font-medium">
                    {selectedExp.institutionDetails}
                  </p>
                </div>
              )}

              {selectedExp.topicsOrAddress && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Topics / Address
                  </span>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedExp.topicsOrAddress}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    Duration
                  </span>
                  <p className="text-xs font-bold text-emerald-950 mt-1">
                    {selectedExp.startDate} &mdash; {selectedExp.currentlyWorking || selectedExp.endDate === "till" ? "Present" : selectedExp.endDate}
                  </p>
                </div>

                {selectedExp.websiteLink && (
                  <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800">
                      Link Attached
                    </span>
                    <a
                      href={selectedExp.websiteLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 mt-1 truncate"
                    >
                      <span>Visit Site</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && selectedExp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl space-y-6 border border-emerald-100 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-xl font-bold text-[#163A2D] font-['Playfair_Display',serif]">
                Update Experience
              </h2>
              <p className="text-xs text-gray-500">
                Modify details for {selectedExp.designation}
              </p>
            </div>

            <form onSubmit={handleSubmit(onUpdateSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                  Designation / Role Title
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-xl text-sm focus:outline-none transition-all"
                  {...register("designation", { required: true })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                  Organization / Department Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-xl text-sm focus:outline-none transition-all"
                  {...register("organization", { required: true })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                  Institution Details
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-xl text-sm focus:outline-none transition-all"
                  {...register("institutionDetails")}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                  Topics / Address
                </label>
                <textarea
                  rows={2}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-xl text-sm focus:outline-none transition-all resize-none"
                  {...register("topicsOrAddress")}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-xl text-sm focus:outline-none transition-all"
                    {...register("startDate", { required: true })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                    End Date
                  </label>
                  <input
                    type="text"
                    disabled={isCurrentlyWorking}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-xl text-sm focus:outline-none disabled:opacity-50 disabled:bg-gray-100 transition-all"
                    {...register("endDate")}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="editCurrentlyWorking"
                  className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
                  {...register("currentlyWorking")}
                />
                <label
                  htmlFor="editCurrentlyWorking"
                  className="text-xs font-semibold text-gray-700 cursor-pointer"
                >
                  Currently working here (Sets End Date to 'till')
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                  Website / Portfolio Link
                </label>
                <input
                  type="url"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-xl text-sm focus:outline-none transition-all"
                  {...register("websiteLink")}
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
    </div>
  );
};

export default AllExperience;