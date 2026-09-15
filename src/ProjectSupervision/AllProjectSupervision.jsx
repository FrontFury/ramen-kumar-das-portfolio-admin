import React, { useState, useEffect } from "react";
import {
  Eye,
  Edit3,
  Trash2,
  X,
  Plus,
  Loader2,
  FolderGit2,
  Upload,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import toast from "react-hot-toast";

const AllProjectSupervision = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Edit Modal Form Setup
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "students",
  });

  const [editImagePreview, setEditImagePreview] = useState(null);
  const selectedStatus = watch("status");

  // Fetch Data from Server
  const fetchProjects = async () => {
    try {
      const res = await fetch("http://localhost:3000/project-supervision");
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load supervision list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Open View Modal
  const handleView = (project) => {
    setSelectedProject(project);
    setIsViewModalOpen(true);
  };

  // Open Edit Modal
  const handleEdit = (project) => {
    setSelectedProject(project);
    reset({
      title: project.title,
      status: project.status || "Ongoing", // Default status setup
      students: project.students || [{ name: "", regNo: "", session: "" }],
      imageFile: null,
    });
    setEditImagePreview(project.image || null);
    setIsEditModalOpen(true);
  };

  // Delete Record
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this supervision record?"
      )
    )
      return;

    try {
      const res = await fetch(
        `http://localhost:3000/project-supervision/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to delete record.");

      toast.success("Supervision deleted successfully! 🗑️");
      setProjects((prev) => prev.filter((p) => p.id !== id && p._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Error deleting item!");
    }
  };

  // Process image for Edit Form
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setValue("imageFile", file);
      setEditImagePreview(URL.createObjectURL(file));
    } else {
      toast.error("Please select a valid image file!");
    }
  };

  // Update Submission
  const onUpdateSubmit = async (data) => {
    setUpdating(true);

    try {
      let imageUrl = editImagePreview;

      // If user uploads new file to ImgBB
      if (data.imageFile) {
        const imgData = new FormData();
        imgData.append("image", data.imageFile);

        const imgBbRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
          {
            method: "POST",
            body: imgData,
          }
        );

        const imgBbResult = await imgBbRes.json();
        if (imgBbResult.success) {
          imageUrl = imgBbResult.data.display_url;
        }
      }

      const updatedData = {
        title: data.title,
        status: data.status, // Included updated status
        students: data.students,
        image: imageUrl,
      };

      const targetId = selectedProject.id || selectedProject._id;

      const backendRes = await fetch(
        `http://localhost:3000/project-supervision/${targetId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );

      if (!backendRes.ok) throw new Error("Failed to update project data.");

      toast.success("Supervision updated successfully! ✨");
      setIsEditModalOpen(false);
      fetchProjects();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen font-sans p-4 sm:p-6 lg:pr-24">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#163A2D] text-amber-300 rounded-xl shadow-md">
              <FolderGit2 className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#163A2D] font-['Playfair_Display',serif]">
                All Project Supervisions
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                Manage and review all supervised projects and theses.
              </p>
            </div>
          </div>
        </div>

        {/* LIST CONTAINER */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-emerald-100">
            <Loader2 className="w-8 h-8 text-[#163A2D] animate-spin mb-2" />
            <p className="text-sm text-gray-500 font-medium">
              Loading records...
            </p>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-2xl border border-emerald-100 text-gray-500">
            No supervision records found.
          </div>
        ) : (
          <div className="space-y-6">
            {projects.map((project, index) => (
              <div
                key={project.id || project._id || index}
                className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 space-y-4 hover:border-emerald-300 transition-all"
              >
                {/* Header Title + Status + Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-3">
                  <div className="flex items-wrap items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-[#163A2D]">
                      <span className="text-amber-500 mr-1.5">
                        {index + 1}. TITLE:
                      </span>
                      {project.title?.toUpperCase()}
                    </h3>

                    {/* STATUS BADGE */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-xs ${
                        project.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {project.status === "Completed" ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          COMPLETED
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          ONGOING
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleView(project)}
                      className="p-2 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-2 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl transition-all"
                      title="Edit Record"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id || project._id)}
                      className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Student Info Display (ALL UPPERCASE) */}
                <div className="space-y-3 font-sans">
                  <p className="text-xs font-bold uppercase text-gray-400">
                    STUDENT NAME:
                  </p>
                  {project.students?.map((st, i) => (
                    <div
                      key={i}
                      className="pl-3 border-l-2 border-amber-400 space-y-0.5"
                    >
                      <p className="text-amber-600 font-semibold text-sm">
                        {st.name?.toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-600">
                        REGISTRATION NO: {st.regNo?.toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-600">
                        SESSION: {st.session?.toUpperCase()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Project Image Poster */}
                {project.image && (
                  <div className="pt-2">
                    <img
                      src={project.image}
                      alt="Project Banner"
                      className="max-h-56 object-contain rounded-xl border border-gray-200 bg-gray-50"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* VIEW MODAL */}
      {isViewModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl space-y-4">
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-[#163A2D] font-['Playfair_Display',serif] border-b pb-2">
              PROJECT SUPERVISION DETAILS
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold uppercase text-gray-400">
                  PROJECT TITLE
                </p>
                <p className="text-base font-semibold text-gray-800">
                  {selectedProject.title?.toUpperCase()}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase text-gray-400 mb-1">
                  STATUS
                </p>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedProject.status === "Completed"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {selectedProject.status === "Completed" ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      COMPLETED
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      ONGOING
                    </>
                  )}
                </span>
              </div>

              <div>
                <p className="text-xs font-bold uppercase text-gray-400 mb-2">
                  STUDENTS
                </p>
                <div className="space-y-2">
                  {selectedProject.students?.map((st, i) => (
                    <div
                      key={i}
                      className="p-3 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <p className="text-amber-600 font-bold text-sm">
                        {st.name?.toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-600">
                        REGISTRATION NO: {st.regNo?.toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-600">
                        SESSION: {st.session?.toUpperCase()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedProject.image && (
                <div>
                  <p className="text-xs font-bold uppercase text-gray-400 mb-2">
                    POSTER / BANNER
                  </p>
                  <img
                    src={selectedProject.image}
                    alt="Poster"
                    className="w-full rounded-xl border border-gray-200"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl space-y-4">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-[#163A2D] font-['Playfair_Display',serif] border-b pb-2">
              Edit Project Supervision
            </h2>

            <form onSubmit={handleSubmit(onUpdateSubmit)} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                  {...register("title", { required: true })}
                />
              </div>

              {/* Edit Status Radio Input */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                  Project Status
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                      selectedStatus === "Ongoing"
                        ? "bg-amber-50 border-amber-500 text-amber-800 shadow-xs"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="radio"
                      value="Ongoing"
                      className="hidden"
                      {...register("status")}
                    />
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Ongoing</span>
                  </label>

                  <label
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                      selectedStatus === "Completed"
                        ? "bg-emerald-50 border-emerald-600 text-emerald-800 shadow-xs"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="radio"
                      value="Completed"
                      className="hidden"
                      {...register("status")}
                    />
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Completed</span>
                  </label>
                </div>
              </div>

              {/* Edit Dynamic Students */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase text-gray-600">
                    Students
                  </label>
                  <button
                    type="button"
                    onClick={() => append({ name: "", regNo: "", session: "" })}
                    className="flex items-center gap-1 text-xs bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200"
                  >
                    <Plus className="w-3 h-3" /> Add Student
                  </button>
                </div>

                {fields.map((field, idx) => (
                  <div
                    key={field.id}
                    className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#163A2D]">
                        Student #{idx + 1}
                      </span>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(idx)}
                          className="text-rose-500 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Name"
                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                        {...register(`students.${idx}.name`, {
                          required: true,
                        })}
                      />
                      <input
                        type="text"
                        placeholder="Reg No"
                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                        {...register(`students.${idx}.regNo`, {
                          required: true,
                        })}
                      />
                      <input
                        type="text"
                        placeholder="Session"
                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                        {...register(`students.${idx}.session`, {
                          required: true,
                        })}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit Image Upload */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                  Change Poster / Banner
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl cursor-pointer">
                    <Upload className="w-4 h-4" /> Choose File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageChange}
                      className="hidden"
                    />
                  </label>
                  {editImagePreview && (
                    <img
                      src={editImagePreview}
                      alt="Preview"
                      className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                    />
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full py-3 bg-[#163A2D] hover:bg-[#0C2219] text-amber-300 font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {updating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Supervision"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProjectSupervision;