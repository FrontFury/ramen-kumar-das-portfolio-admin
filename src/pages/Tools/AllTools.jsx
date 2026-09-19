import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Wrench, Search, Trash2, Edit3, Loader2, X, AlertTriangle, CheckCircle2, Layers } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import useAxiosSecure from "../../hook/useAxiosSecure";

const categories = [
  { id: "ml-ai", label: "ML & AI / Vision" },
  { id: "nlp-sec", label: "NLP & Security" },
  { id: "prog-web", label: "Languages & Web" },
  { id: "code-editor", label: "Code Editor" }, // <--- Code Editor added
  { id: "research", label: "Research & Tools" },
  { id: "db-office", label: "DB & Office" },
];

const toastOptions = {
  duration: 3000,
  style: {
    background: "#163A2D",
    color: "#FDE68A",
    fontSize: "14px",
    fontWeight: "600",
    borderRadius: "12px",
  },
};

const AllTools = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [editingTool, setEditingTool] = useState(null);
  const [deletingTool, setDeletingTool] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // GET Query
  const { data: rawTools = [], isLoading } = useQuery({
    queryKey: ["tools"],
    queryFn: async () => {
      const res = await axiosSecure.get("/tools");
      return res.data;
    },
  });

  // Reverse tools array so newly created items appear first
  const tools = Array.isArray(rawTools) ? [...rawTools].reverse() : [];

  // PATCH Mutation
  const updateToolMutation = useMutation({
    mutationFn: async (tool) => {
      const id = tool._id || tool.id;
      const res = await axiosSecure.patch(`/tools/${id}`, {
        name: tool.name,
        category: tool.category,
        desc: tool.desc,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      setEditingTool(null);
      toast.success("Tool details updated!", toastOptions);
    },
    onError: () => toast.error("Failed to update tool!", toastOptions),
  });

  // DELETE Mutation
  const deleteToolMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/tools/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      setDeletingTool(null);
      setShowSuccessModal(true);
    },
    onError: () => toast.error("Failed to delete tool!", toastOptions),
  });

  const filteredTools = tools.filter(
    (tool) =>
      tool.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.desc?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto bg-[#F8FAFC] font-sans space-y-6 p-4 sm:p-6 lg:pr-16">
      <Toaster position="top-center" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#163A2D] text-amber-300 rounded-xl shadow-md">
            <Wrench className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#163A2D] font-['Playfair_Display',serif]">All Technical Tools</h1>
            <p className="text-sm text-gray-500 font-medium">Manage your tools, frameworks, and programming stack database.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-600 transition-colors"
            />
          </div>
          <span className="text-xs text-gray-400 font-medium">
            Showing {filteredTools.length} of {tools.length} items
          </span>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-emerald-800 gap-2 font-medium">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
              Loading stack inventory...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-emerald-950 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                  <th className="p-4">Tool Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Description Tag</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs sm:text-sm text-gray-700">
                {filteredTools.length > 0 ? (
                  filteredTools.map((tool) => {
                    const id = tool._id || tool.id;
                    return (
                      <tr key={id} className="hover:bg-emerald-50/40 transition-colors">
                        <td className="p-4 font-semibold text-gray-900">{tool.name}</td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                            <Layers className="w-3 h-3" />
                            {tool.category}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500">{tool.desc}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => setEditingTool(tool)} className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => setDeletingTool(tool)} className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-400 text-sm">No matching tools found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingTool && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl relative border border-emerald-100">
            <button onClick={() => setEditingTool(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-[#163A2D] mb-4">Edit Tool Details</h2>
            <form onSubmit={(e) => { e.preventDefault(); updateToolMutation.mutate(editingTool); }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Tool Name</label>
                <input
                  type="text"
                  value={editingTool.name}
                  onChange={(e) => setEditingTool({ ...editingTool, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Category</label>
                <select
                  value={editingTool.category}
                  onChange={(e) => setEditingTool({ ...editingTool, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600 capitalize"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Description Tag</label>
                <input
                  type="text"
                  value={editingTool.desc}
                  onChange={(e) => setEditingTool({ ...editingTool, desc: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button type="button" onClick={() => setEditingTool(null)} className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateToolMutation.isPending}
                  className="px-4 py-2 bg-[#163A2D] hover:bg-[#0C2219] text-amber-300 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  {updateToolMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deletingTool && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl relative border border-rose-100 text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Remove Tool?</h3>
            <p className="text-xs text-gray-500 mb-6">
              Are you sure you want to remove <span className="font-semibold text-gray-800">{deletingTool.name}</span>?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button type="button" onClick={() => setDeletingTool(null)} className="w-full py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteToolMutation.mutate(deletingTool._id || deletingTool.id)}
                disabled={deleteToolMutation.isPending}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-md"
              >
                {deleteToolMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl relative text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Item Deleted</h3>
            <p className="text-xs text-gray-500 mb-6">Tool removed from server.</p>
            <button onClick={() => setShowSuccessModal(false)} className="w-full py-2.5 bg-[#163A2D] text-amber-300 text-xs font-semibold rounded-xl">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTools;