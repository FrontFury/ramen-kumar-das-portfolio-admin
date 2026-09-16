import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  FolderGit2,
  Loader2,
  PlusCircle,
  Upload,
  X,
  Trash2,
  Plus,
  CheckCircle2,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../hook/useAxiosSecure"; 

const AddProjectSupervision = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      status: "Ongoing", // Default Status
      students: [{ name: "", regNo: "", session: "" }],
      imageFile: null,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "students",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const selectedImageFile = watch("imageFile");
  const selectedStatus = watch("status");

  useEffect(() => {
    toast.dismiss();
  }, []);

  // TanStack Query Mutation for posting data
  const addSupervisionMutation = useMutation({
    mutationFn: async (newSupervision) => {
      const res = await axiosSecure.post("/project-supervision", newSupervision);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Project Supervision added successfully! 🎉");
      queryClient.invalidateQueries({ queryKey: ["project-supervisions"] });
      reset();
      setImagePreview(null);

      setTimeout(() => {
        navigate("/project-supervision/all");
      }, 1500);
    },
    onError: (err) => {
      console.error(err);
      toast.error(err?.response?.data?.message || err.message || "Failed to save data!");
    },
  });

  const processFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setValue("imageFile", file, { shouldValidate: true });
      setImagePreview(URL.createObjectURL(file));
    } else {
      toast.error("Please select a valid image file!");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
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
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleRemoveImage = () => {
    setValue("imageFile", null, { shouldValidate: true });
    setImagePreview(null);
  };

  const onSubmit = async (data) => {
    try {
      let imageUrl = "";

      // Upload image to ImageBB if selected
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

        if (!imgBbResult.success) {
          throw new Error("Image upload failed.");
        }
        imageUrl = imgBbResult.data.display_url;
      }

      const newSupervision = {
        title: data.title,
        status: data.status,
        students: data.students,
        image: imageUrl,
        createdAt: new Date().toISOString(),
      };

      // Trigger mutation
      await addSupervisionMutation.mutateAsync(newSupervision);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong during image processing!");
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen font-sans p-4 sm:p-6 lg:pr-24">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#163A2D] text-amber-300 rounded-xl shadow-md">
              <FolderGit2 className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#163A2D] font-['Playfair_Display',serif]">
                Add Project Supervision
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                Record details of supervised thesis, projects, or research.
              </p>
            </div>
          </div>
        </div>

        {/* FORM CARD */}
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-xs p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              {/* Project Title & Status Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                    Project Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ocular Diseases Detection and Classification Using Deep Learning."
                    className={`w-full px-4 py-2.5 bg-gray-50 border ${
                      errors.title
                        ? "border-rose-500"
                        : "border-gray-200 focus:border-emerald-600"
                    } rounded-xl text-sm focus:outline-none focus:bg-white transition-all`}
                    {...register("title", {
                      required: "Project Title is required",
                    })}
                  />
                  {errors.title && (
                    <p className="text-xs text-rose-500 mt-1 font-medium">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* STATUS SELECTION BUTTONS */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                    Project Status <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
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
              </div>

              {/* Dynamic Students Fields */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <label className="block text-xs font-bold uppercase text-gray-600">
                    Students Information{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => append({ name: "", regNo: "", session: "" })}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition-all border border-emerald-200 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Student
                  </button>
                </div>

                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200 relative space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#163A2D]">
                        Student #{index + 1}
                      </span>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <input
                          type="text"
                          placeholder="Student Name"
                          className={`w-full px-3 py-2 bg-white border ${
                            errors.students?.[index]?.name
                              ? "border-rose-500"
                              : "border-gray-200 focus:border-emerald-600"
                          } rounded-xl text-sm focus:outline-none transition-all`}
                          {...register(`students.${index}.name`, {
                            required: "Name is required",
                          })}
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Registration No"
                          className={`w-full px-3 py-2 bg-white border ${
                            errors.students?.[index]?.regNo
                              ? "border-rose-500"
                              : "border-gray-200 focus:border-emerald-600"
                          } rounded-xl text-sm focus:outline-none transition-all`}
                          {...register(`students.${index}.regNo`, {
                            required: "Reg No is required",
                          })}
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Session (e.g. 2019-2020)"
                          className={`w-full px-3 py-2 bg-white border ${
                            errors.students?.[index]?.session
                              ? "border-rose-500"
                              : "border-gray-200 focus:border-emerald-600"
                          } rounded-xl text-sm focus:outline-none transition-all`}
                          {...register(`students.${index}.session`, {
                            required: "Session is required",
                          })}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* DRAG AND DROP IMAGE */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                  Project Poster / Image (Optional)
                </label>

                <Controller
                  name="imageFile"
                  control={control}
                  render={() => (
                    <>
                      {!imagePreview ? (
                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          className={`relative border-2 border-emerald-300 bg-gray-50 border-dashed rounded-2xl p-6 text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                            isDragging
                              ? "border-emerald-600 bg-emerald-50/70 scale-[1.01]"
                              : "hover:bg-emerald-50/30"
                          }`}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className="p-3 bg-emerald-100/70 text-emerald-800 rounded-full mb-3">
                            <Upload className="w-6 h-6" />
                          </div>
                          <p className="text-sm font-semibold text-gray-700">
                            <span className="text-emerald-700 font-bold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            PNG, JPG, or WEBP up to 10MB
                          </p>
                        </div>
                      ) : (
                        <div className="relative p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-20 h-20 object-cover rounded-xl border border-emerald-300 shadow-xs"
                            />
                            <div>
                              <p className="text-sm font-bold text-[#163A2D] truncate max-w-[200px] sm:max-w-xs">
                                {selectedImageFile?.name}
                              </p>
                              <p className="text-xs text-emerald-700 font-medium mt-0.5">
                                Ready to Upload
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={addSupervisionMutation.isPending}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#163A2D] hover:bg-[#0C2219] text-amber-300 font-semibold text-sm rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-70"
              >
                {addSupervisionMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Data...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Save Supervision</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProjectSupervision;