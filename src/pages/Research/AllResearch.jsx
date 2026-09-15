import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Trash2, Edit3, MapPin, Calendar, Loader2, BookOpen, Plus, Maximize2, X, Award } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const AllResearch = () => {
  const [researches, setResearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);
  const navigate = useNavigate();

  const fetchResearches = async () => {
    try {
      const response = await axios.get("http://localhost:3000/researches");
      setResearches(response.data);
    } catch (err) {
      toast.error("Failed to load research items!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResearches();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this research publication?")) return;

    try {
      await axios.delete(`http://localhost:3000/researches/${id}`);
      toast.success("Publication deleted successfully!");
      setResearches((prev) => prev.filter((item) => (item._id || item.id) !== id));
    } catch (err) {
      toast.error("Failed to delete publication!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-700" />
        <p className="text-sm font-medium text-emerald-900 animate-pulse">Loading Publications...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 font-sans px-4 py-6">
      <Toaster position="top-center" containerStyle={{ top: 80, zIndex: 99999 }} />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#163A2D] to-[#0D251D] p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-semibold tracking-wide uppercase">
              Academic & Conference
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3 pt-1 uppercase">
            <BookOpen className="w-7 h-7 text-amber-400" /> Research Publications
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80">
            Showcasing papers, international conference presentations, and certifications.
          </p>
        </div>

        <button
          onClick={() => navigate("/research/add")}
          className="z-10 self-start sm:self-center px-5 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-[#163A2D] font-bold text-sm rounded-2xl shadow-lg hover:shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-4 h-4" /> Add New Paper
        </button>
      </div>

      {/* Empty State */}
      {researches.length === 0 && (
        <div className="text-center py-16 bg-emerald-50/40 rounded-3xl border border-dashed border-emerald-200 space-y-3">
          <Award className="w-12 h-12 text-emerald-600 mx-auto opacity-50" />
          <h3 className="text-base font-bold text-gray-700">No Publications Found</h3>
          <p className="text-xs text-gray-500">Click the button above to add your first research publication.</p>
        </div>
      )}

      {/* Publications List */}
      <div className="space-y-6">
        {researches.map((item, index) => {
          const id = item._id || item.id;
          return (
            <div
              key={id}
              className="group bg-white rounded-3xl border border-gray-100 p-5 sm:p-7 shadow-sm hover:shadow-xl hover:border-emerald-200/60 transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch relative overflow-hidden"
            >
              {/* Left Accent Stripe */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-400 via-emerald-600 to-[#163A2D] opacity-80 group-hover:opacity-100 transition-opacity" />

              {/* Certificate Image Frame */}
              <div className="md:col-span-5 flex justify-center items-center">
                {item.certificateUrl ? (
                  <div className="relative group/img overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm w-full max-h-60 h-full flex items-center justify-center">
                    <img
                      src={item.certificateUrl}
                      alt="Certificate"
                      className="w-full h-full object-contain transform group-hover/img:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div 
                      onClick={() => setActiveImage(item.certificateUrl)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer backdrop-blur-[2px]"
                    >
                      <span className="px-3 py-1.5 bg-white/90 text-gray-900 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md">
                        <Maximize2 className="w-3.5 h-3.5" /> Preview Certificate
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-44 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 text-xs text-gray-400 border border-dashed border-gray-200">
                    <Award className="w-8 h-8 text-gray-300" />
                    <span>No Certificate Image</span>
                  </div>
                )}
              </div>

              {/* Research Details */}
              <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  {/* Title & Authors */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-xl bg-amber-100 text-amber-800 font-extrabold text-xs flex items-center justify-center shadow-inner mt-0.5">
                        {index + 1}
                      </span>
                      <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-snug uppercase group-hover:text-[#163A2D] transition-colors">
                        {item.title}
                      </h2>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-amber-700 pl-10">
                      {item.authors}
                    </p>
                  </div>

                  {/* Conference Tag */}
                  <div className="pl-10">
                    <div className="inline-block px-3 py-1 bg-emerald-50 border border-emerald-100/80 rounded-xl text-xs font-bold text-[#163A2D] uppercase tracking-wider">
                      {item.conference}
                    </div>
                  </div>
                </div>

                {/* Footer Section: Date/Location & Right-Bottom Buttons */}
                <div className="pl-10 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 mt-auto">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-gray-500">
                    <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" /> {item.eventDate}
                    </span>
                    <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {item.location}
                    </span>
                  </div>

                  {/* Actions (Always Fixed to Bottom Right) */}
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      onClick={() => navigate("/researches/add", { state: { research: item } })}
                      className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all duration-200 shadow-sm"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(id)}
                      className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all duration-200 shadow-sm"
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

      {/* Full-screen Image Preview Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setActiveImage(null)}
              className="absolute -top-12 right-0 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={activeImage}
              alt="Full Certificate Preview"
              className="w-full h-full object-contain rounded-2xl shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllResearch;