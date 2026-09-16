import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  GraduationCap, 
  Building2, 
  Phone, 
  Mail, 
  Copy, 
  ExternalLink, 
  Trash2, 
  Edit3, 
  X, 
  Loader2, 
  CheckCircle2,
  Sparkles,
  UserCheck
} from "lucide-react";
import useAxiosSecure from "../../hook/useAxiosSecure"; 

const AllReferees = () => {
  const [editingReferee, setEditingReferee] = useState(null);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, setValue } = useForm();

  // GET: Fetch all referees with TanStack Query
  const { data: referees = [], isLoading: loading } = useQuery({
    queryKey: ["referees"],
    queryFn: async () => {
      const res = await axiosSecure.get("/referees");
      return res.data;
    },
  });

  // DELETE: Delete referee mutation
  const { mutate: deleteReferee } = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.delete(`/referees/${id}`);
    },
    onSuccess: () => {
      toast.success("Referee deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["referees"] });
    },
    onError: (err) => {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to delete referee.");
    },
  });

  // PATCH: Update referee mutation
  const { mutate: updateReferee, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await axiosSecure.patch(`/referees/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Referee details updated successfully!");
      setEditingReferee(null);
      reset();
      queryClient.invalidateQueries({ queryKey: ["referees"] });
    },
    onError: (err) => {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update referee.");
    },
  });

  // Copy text to clipboard
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  // Trigger delete operation
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this referee?")) {
      deleteReferee(id);
    }
  };

  // Open edit modal and set default form values
  const handleEditClick = (referee) => {
    setEditingReferee(referee);
    setValue("tag", referee.tag || "");
    setValue("name", referee.name || "");
    setValue("designation", referee.designation || "");
    setValue("department", referee.department || "");
    setValue("institution", referee.institution || "");
    setValue("phone", referee.phone || "");
    setValue("email", referee.email || "");
    setValue("secondaryEmail", referee.secondaryEmail || "");
  };

  // Submit update form handler
  const onUpdate = (data) => {
    const targetId = editingReferee._id || editingReferee.id;
    updateReferee({ id: targetId, data });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50 gap-3">
        <Loader2 className="w-10 h-10 text-emerald-700 animate-spin" />
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loading Referees...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen p-4 sm:p-6 lg:p-10 font-sans">
      <Toaster position="top-center" containerStyle={{ top: 80, zIndex: 99999 }} />

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-900 text-amber-300 rounded-2xl shadow-md">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Academic Referees
              </h1>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Manage professional contacts and reference profiles
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto px-4 py-1.5 bg-emerald-100/70 border border-emerald-200 text-emerald-900 text-xs font-bold rounded-full shadow-sm">
            Total Referees: {referees.length}
          </span>
        </div>

        {/* REFEREE CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {referees.map((ref) => (
            <div
              key={ref._id || ref.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between relative group"
            >
              <div>
                {/* TOP BAR: Tag Badge & Action Control Buttons */}
                <div className="flex items-center justify-between gap-2 mb-5">
                  <span className="text-[11px] font-extrabold px-3 py-1 bg-emerald-50 border border-emerald-200/60 text-emerald-800 rounded-full tracking-wide">
                    {ref.tag}
                  </span>

                  {/* VISIBLE ACTION BUTTONS */}
                  <div className="flex items-center gap-1.5 bg-slate-50 p-1 border border-slate-100 rounded-full shadow-inner">
                    <button
                      onClick={() => handleEditClick(ref)}
                      title="Edit Referee"
                      className="p-1.5 bg-white text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200/60 rounded-full transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(ref._id || ref.id)}
                      title="Delete Referee"
                      className="p-1.5 bg-white text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/60 rounded-full transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* NAME & DESIGNATION */}
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-xl font-black text-slate-900 leading-snug font-['Playfair_Display',serif]">
                      {ref.name}
                    </h2>
                    <GraduationCap className="w-5 h-5 text-amber-600 shrink-0 mt-1" />
                  </div>
                  <p className="text-[11px] font-extrabold text-amber-700 tracking-wider uppercase">
                    {ref.designation}
                  </p>
                </div>

                {/* DEPARTMENT & INSTITUTION */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs font-medium text-slate-600">
                  <p className="leading-relaxed">{ref.department}</p>
                  <p className="flex items-start gap-1.5 text-emerald-950 font-bold">
                    <Building2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>{ref.institution}</span>
                  </p>
                </div>

                {/* CONTACT INFO BLOCKS */}
                <div className="mt-5 space-y-2">
                  {/* Phone */}
                  {ref.phone && (
                    <div className="flex items-center justify-between p-2.5 bg-slate-50/80 hover:bg-slate-100/60 transition-colors rounded-xl text-xs font-medium text-slate-700 border border-slate-200/60">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="font-semibold text-slate-800">{ref.phone}</span>
                      </div>
                      <button 
                        onClick={() => handleCopy(ref.phone)} 
                        title="Copy Phone"
                        className="text-slate-400 hover:text-emerald-700 p-1 rounded-md transition-colors cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Primary Email */}
                  {ref.email && (
                    <div className="flex items-center justify-between p-2.5 bg-slate-50/80 hover:bg-slate-100/60 transition-colors rounded-xl text-xs font-medium text-slate-700 border border-slate-200/60">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <Mail className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="truncate font-semibold text-slate-800">{ref.email}</span>
                      </div>
                      <button 
                        onClick={() => handleCopy(ref.email)} 
                        title="Copy Email"
                        className="text-slate-400 hover:text-emerald-700 p-1 rounded-md transition-colors shrink-0 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Secondary Email */}
                  {ref.secondaryEmail && (
                    <div className="flex items-center justify-between p-2.5 bg-slate-50/80 hover:bg-slate-100/60 transition-colors rounded-xl text-xs font-medium text-slate-700 border border-slate-200/60">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <Mail className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="truncate font-semibold text-slate-800">{ref.secondaryEmail}</span>
                      </div>
                      <button 
                        onClick={() => handleCopy(ref.secondaryEmail)} 
                        title="Copy Email"
                        className="text-slate-400 hover:text-emerald-700 p-1 rounded-md transition-colors shrink-0 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* DIRECT MAIL BUTTON */}
              <a
                href={`mailto:${ref.email}`}
                className="mt-6 w-full py-3 bg-[#112D23] hover:bg-[#0A1C16] text-amber-300 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer active:scale-[0.99]"
              >
                <span>Send Direct Email</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* EDIT REFEREE MODAL */}
      {editingReferee && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-emerald-100 shadow-2xl relative">
            <button
              onClick={() => setEditingReferee(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-emerald-700" />
              <h3 className="text-xl font-extrabold text-slate-900">Edit Referee Information</h3>
            </div>

            <form onSubmit={handleSubmit(onUpdate)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Tag</label>
                  <input {...register("tag")} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Full Name</label>
                  <input {...register("name")} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Designation</label>
                  <input {...register("designation")} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Department</label>
                  <input {...register("department")} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Institution</label>
                <input {...register("institution")} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Phone</label>
                  <input {...register("phone")} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Primary Email</label>
                  <input {...register("email")} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Secondary Email</label>
                <input {...register("secondaryEmail")} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all" />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full py-3.5 bg-[#163A2D] hover:bg-[#0C2219] text-amber-300 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-70"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Update Referee</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllReferees;