import React from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  UserCheck, 
  Tag, 
  User, 
  Briefcase, 
  Building2, 
  GraduationCap, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Loader2, 
  Sparkles 
} from "lucide-react";
import useAxiosSecure from "../../hook/useAxiosSecure"; 

const AddReferees = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // TanStack Query Mutation for posting referee data
  const { mutate: addReferee, isPending: loading } = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosSecure.post("/referees", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Referee added successfully! ✨");
      queryClient.invalidateQueries({ queryKey: ["referees"] });
      reset();
      setTimeout(() => {
        navigate("/referees/all");
      }, 1000);
    },
    onError: (err) => {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to add referee.");
    },
  });

  const onSubmit = (data) => {
    addReferee(data);
  };

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <Toaster position="top-center" containerStyle={{ top: 80, zIndex: 99999 }} />

      <div className="max-w-3xl mx-auto space-y-6">
        {/* HEADER SECTION */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#163A2D] via-[#102a21] to-[#0A1C16] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-900/50">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex items-center gap-5">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-amber-300 rounded-2xl backdrop-blur-md shadow-inner">
              <UserCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                  Add New Referee
                </h1>
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <p className="text-sm text-emerald-200/80 mt-1 font-medium">
                Add academic or professional referee details for verification.
              </p>
            </div>
          </div>
        </div>

        {/* FORM CONTAINER */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Tag & Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-700" />
                  Tag / Badge (e.g. PUST Reference)
                </label>
                <input
                  type="text"
                  placeholder="e.g. BUET Reference"
                  {...register("tag", { required: "Tag is required" })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-xl text-sm font-medium focus:outline-none transition-all"
                />
                {errors.tag && <span className="text-xs text-rose-500 mt-1 block">{errors.tag.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Md. Sarwar Hosain"
                  {...register("name", { required: "Name is required" })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-xl text-sm font-medium focus:outline-none transition-all"
                />
                {errors.name && <span className="text-xs text-rose-500 mt-1 block">{errors.name.message}</span>}
              </div>
            </div>

            {/* Designation & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-700" />
                  Designation
                </label>
                <input
                  type="text"
                  placeholder="e.g. PROFESSOR"
                  {...register("designation", { required: "Designation is required" })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-xl text-sm font-medium focus:outline-none transition-all"
                />
                {errors.designation && <span className="text-xs text-rose-500 mt-1 block">{errors.designation.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                  Department
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dept. of Information & Communication Engineering"
                  {...register("department", { required: "Department is required" })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-xl text-sm font-medium focus:outline-none transition-all"
                />
                {errors.department && <span className="text-xs text-rose-500 mt-1 block">{errors.department.message}</span>}
              </div>
            </div>

            {/* Institution */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                Institution / University
              </label>
              <input
                type="text"
                placeholder="e.g. Pabna University of Science & Technology"
                {...register("institution", { required: "Institution is required" })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-xl text-sm font-medium focus:outline-none transition-all"
              />
              {errors.institution && <span className="text-xs text-rose-500 mt-1 block">{errors.institution.message}</span>}
            </div>

            {/* Phone & Primary Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. +8801722047833"
                  {...register("phone", { required: "Phone is required" })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-xl text-sm font-medium focus:outline-none transition-all"
                />
                {errors.phone && <span className="text-xs text-rose-500 mt-1 block">{errors.phone.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-700" />
                  Primary Email
                </label>
                <input
                  type="email"
                  placeholder="e.g. sarwar.ice@pust.ac.bd"
                  {...register("email", { required: "Email is required" })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-xl text-sm font-medium focus:outline-none transition-all"
                />
                {errors.email && <span className="text-xs text-rose-500 mt-1 block">{errors.email.message}</span>}
              </div>
            </div>

            {/* Secondary Email (Optional) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-700" />
                Secondary Email (Optional)
              </label>
              <input
                type="email"
                placeholder="e.g. alternative.email@gmail.com"
                {...register("secondaryEmail")}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-emerald-600 focus:bg-white rounded-xl text-sm font-medium focus:outline-none transition-all"
              />
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
                  Saving Referee...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Referee</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddReferees;