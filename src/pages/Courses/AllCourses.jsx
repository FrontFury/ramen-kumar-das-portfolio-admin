import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Trash2, 
  Edit3, 
  Calendar, 
  Loader2, 
  BookOpen, 
  Plus, 
  Maximize2, 
  X, 
  Award, 
  Hash, 
  Building2, 
  Sparkles,
  CheckCircle2
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import useAxiosSecure from "../../hook/useAxiosSecure";

const AllCourses = () => {
  const [activeImage, setActiveImage] = useState(null);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // 1. Fetch Courses using TanStack Query
  const {
    data: courses = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await axiosSecure.get("/courses");
      return response.data;
    },
  });

  // 2. Delete Course Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axiosSecure.delete(`/courses/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Course deleted successfully!");
      // ক্যাশ ইনভ্যালিডেট করে নতুন ডাটা স্বয়ংক্রিয়ভাবে ফেচ করা
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (err) => {
      console.error("Delete Error:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to delete course!");
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this course certification?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
          <Award className="w-6 h-6 text-emerald-700 absolute" />
        </div>
        <p className="text-sm font-bold tracking-wide text-emerald-950 animate-pulse">
          FETCHING CERTIFICATIONS...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-2 text-rose-600">
        <p className="font-bold">Failed to load courses!</p>
        <p className="text-xs text-gray-500">{error?.message}</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 font-sans px-4 py-8 max-w-7xl mx-auto">
      <Toaster position="top-center" containerStyle={{ top: 80, zIndex: 99999 }} />

      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0D251D] via-[#163A2D] to-[#0A1E17] p-8 sm:p-10 rounded-3xl text-white shadow-2xl border border-emerald-800/40">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-400/15 border border-amber-400/30 rounded-full backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-xs font-bold tracking-wider text-amber-300 uppercase">
                Verified Credentials
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3 uppercase">
              <BookOpen className="w-8 h-8 text-amber-400" /> Professional Courses
            </h1>
            <p className="text-sm text-emerald-100/80 max-w-xl leading-relaxed">
              Explore accredited certifications, academic milestones, and specialized technical training.
            </p>
          </div>

          <button
            onClick={() => navigate("/courses/add")}
            className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#0D251D] font-extrabold text-sm rounded-2xl shadow-xl shadow-amber-500/10 hover:shadow-amber-500/25 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
            <span>Add New Course</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {courses.length === 0 && (
        <div className="text-center py-20 bg-emerald-50/30 rounded-3xl border-2 border-dashed border-emerald-200/70 space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Award className="w-8 h-8 opacity-80" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-800">No Certifications Yet</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Your repository is empty. Start adding your completed courses and achievements above!
            </p>
          </div>
        </div>
      )}

      {/* Courses List */}
      <div className="space-y-6">
        {courses.map((item, index) => {
          const id = item._id || item.id;
          return (
            <div
              key={id}
              className="group relative bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-2xl hover:border-emerald-200/80 transition-all duration-500 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch overflow-hidden"
            >
              {/* Left Stripe Highlight */}
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-amber-400 via-emerald-500 to-[#163A2D] opacity-80 group-hover:opacity-100 transition-opacity" />

              {/* Certificate Image Preview Box */}
              <div className="md:col-span-5 flex justify-center items-center">
                {item.certificateUrl ? (
                  <div className="relative group/img overflow-hidden rounded-2xl border border-gray-100 bg-gray-900/5 shadow-md w-full max-h-64 h-full flex items-center justify-center min-h-[200px]">
                    <img
                      src={item.certificateUrl}
                      alt="Course Certificate"
                      className="w-full h-full object-contain transform group-hover/img:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div 
                      onClick={() => setActiveImage(item.certificateUrl)}
                      className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover/img:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer backdrop-blur-[2px]"
                    >
                      <span className="px-4 py-2 bg-white/95 text-gray-900 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg transform translate-y-2 group-hover/img:translate-y-0 transition-transform">
                        <Maximize2 className="w-4 h-4 text-emerald-700" /> Quick Preview
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-gray-50 to-emerald-50/30 rounded-2xl flex flex-col items-center justify-center gap-2 text-xs text-gray-400 border border-dashed border-gray-200">
                    <Award className="w-10 h-10 text-emerald-300" />
                    <span className="font-semibold text-gray-400">No Image Provided</span>
                  </div>
                )}
              </div>

              {/* Content Details */}
              <div className="md:col-span-7 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  {/* Header Badges & Title */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 text-amber-900 font-black text-xs flex items-center justify-center shadow-sm border border-amber-300/50 mt-0.5">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 leading-snug uppercase tracking-tight group-hover:text-[#163A2D] transition-colors">
                        {item.title}
                      </h2>
                    </div>

                    {/* Metadata Section */}
                    <div className="pl-11 space-y-2">
                      {item.organization && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-bold text-emerald-950">
                          <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{item.organization}</span>
                        </div>
                      )}

                      {item.certificateNumber && (
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 pt-1">
                          <div className="p-1 bg-gray-100 rounded-md">
                            <Hash className="w-3.5 h-3.5 text-gray-500" />
                          </div>
                          <span>ID: <strong className="font-mono text-gray-900">{item.certificateNumber}</strong></span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pl-11 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 mt-auto">
                  <div className="flex items-center gap-2">
                    {item.issueDate && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-600">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" /> {item.issueDate}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50/60 px-2 py-1 rounded-lg">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  </div>

                  {/* Right Bottom Actions */}
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      onClick={() => navigate("/courses/add", { state: { course: item } })}
                      className="px-4 py-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-300 shadow-sm hover:shadow-emerald-600/20 active:scale-95 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(id)}
                      disabled={deleteMutation.isPending}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-300 shadow-sm hover:shadow-rose-600/20 active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      {deleteMutation.isPending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full-screen Image Preview Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setActiveImage(null)}
              className="absolute -top-12 right-0 p-2.5 bg-white/10 hover:bg-white/30 text-white rounded-full transition-all cursor-pointer backdrop-blur-sm"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={activeImage}
              alt="Full Certificate Preview"
              className="w-full h-full object-contain rounded-2xl shadow-2xl border border-white/15"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCourses;