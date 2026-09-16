import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Sparkles, PlusCircle, Loader2, UploadCloud, Plus, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import useAxiosSecure from "../../hook/useAxiosSecure";

const initialCategories = [
  { id: "ml-ai", label: "ML & AI / Vision" },
  { id: "nlp-sec", label: "NLP & Security" },
  { id: "prog-web", label: "Languages & Web" },
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
    zIndex: 99999,
  },
};

const AddTools = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [categories, setCategories] = useState(initialCategories);
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [newCatLabel, setNewCatLabel] = useState("");
  const [formData, setFormData] = useState({ name: "", category: "ml-ai", desc: "", imageUrl: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // TanStack Mutation for Posting New Tool
  const addToolMutation = useMutation({
    mutationFn: async (newToolData) => {
      let finalImageUrl = newToolData.imageUrl;

      if (selectedFile) {
        const imgData = new FormData();
        imgData.append("image", selectedFile);
        const imgBbRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
          imgData
        );
        if (!imgBbRes.data.success) throw new Error("Image upload failed");
        finalImageUrl = imgBbRes.data.data.display_url;
      }

      const res = await axiosSecure.post("/tools", {
        ...newToolData,
        imageUrl: finalImageUrl,
        createdAt: new Date().toISOString(),
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      toast.success("New tool added successfully! 🎉", toastOptions);
      setFormData({ name: "", category: categories[0].id, desc: "", imageUrl: "" });
      setSelectedFile(null);
      setImagePreview(null);
      setTimeout(() => navigate("/tools/all"), 1500);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to add tool!", toastOptions);
    },
  });

  const handleAddCategory = () => {
    if (!newCatLabel.trim()) return;
    const catId = newCatLabel.toLowerCase().replace(/[^a-z0-9]/g, "-");
    setCategories([...categories, { id: catId, label: newCatLabel }]);
    setFormData({ ...formData, category: catId });
    setNewCatLabel("");
    setShowNewCatInput(false);
    toast.success("New category added!", toastOptions);
  };

  const handleImageFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      toast.success("Icon selected successfully!", toastOptions);
    } else {
      toast.error("Please upload a valid image file!", toastOptions);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile && !formData.imageUrl) {
      toast.error("Please upload an image for the tool!", toastOptions);
      return;
    }
    addToolMutation.mutate(formData);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl border border-emerald-100 p-6 sm:p-10 shadow-sm font-sans space-y-6">
      <Toaster position="top-center" containerStyle={{ top: 80, zIndex: 99999 }} />

      <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
        <div className="p-3 bg-[#163A2D] text-amber-300 rounded-xl">
          <PlusCircle className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#163A2D] font-['Playfair_Display',serif]">Add New Tech Tool</h1>
          <p className="text-xs text-gray-500">Insert new software into your stack ecosystem.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Tool / Language Name</label>
            <input
              type="text"
              placeholder="e.g. PyTorch"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold uppercase text-gray-600">Category</label>
              <button
                type="button"
                onClick={() => setShowNewCatInput(!showNewCatInput)}
                className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                {showNewCatInput ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                {showNewCatInput ? "Cancel" : "New Category"}
              </button>
            </div>

            {showNewCatInput ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Category Name"
                  value={newCatLabel}
                  onChange={(e) => setNewCatLabel(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-emerald-300 rounded-xl text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-3 py-2 bg-[#163A2D] text-amber-300 text-xs font-semibold rounded-xl"
                >
                  Add
                </button>
              </div>
            ) : (
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 capitalize"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Short Description / Tag</label>
          <input
            type="text"
            placeholder="e.g. Deep Learning"
            value={formData.desc}
            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Upload Icon / Image</label>
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files?.[0]) handleImageFile(e.dataTransfer.files[0]);
            }}
            className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
              isDragging ? "border-emerald-600 bg-emerald-50/50" : "border-gray-200 hover:border-emerald-400 bg-gray-50/50"
            }`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {imagePreview ? (
              <div className="flex flex-col items-center gap-2">
                <img src={imagePreview} alt="Preview" className="w-16 h-16 object-contain rounded-lg border border-emerald-200 p-1 bg-white" />
                <p className="text-xs text-emerald-800 font-semibold">Image selected! Click or Drag to replace.</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                <UploadCloud className="w-8 h-8 text-emerald-700" />
                <p className="text-xs font-medium">
                  <span className="font-semibold text-emerald-800">Drag & drop</span> an image here, or click to browse
                </p>
                <span className="text-[10px] text-gray-400">PNG, JPG, SVG up to 5MB</span>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={addToolMutation.isPending}
          className="w-full py-3 bg-[#163A2D] hover:bg-[#0C2219] text-amber-300 font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-4"
        >
          {addToolMutation.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Add Tool to Ecosystem</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddTools;