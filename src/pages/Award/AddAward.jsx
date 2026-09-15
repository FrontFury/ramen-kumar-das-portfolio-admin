import React, { useState, useRef, useEffect } from "react";
import { 
  Award, 
  Image as ImageIcon, 
  Loader2, 
  PlusCircle, 
  Upload, 
  X, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const AddAward = () => {
  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    dateReceived: "", // Date field
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // --- Datepicker States & Logic ---
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const datePickerRef = useRef(null);

  // Close DatePicker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Date Selection Handler
  const handleDateSelect = (day) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const selectedDate = `${year}-${month}-${formattedDay}`;

    setFormData((prev) => ({ ...prev, dateReceived: selectedDate }));
    setShowDatePicker(false);
  };

  // Calendar Helpers
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // File Handlers
  const processFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      toast.error("Please select or drop a valid image file!");
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
    setImageFile(null);
    setImagePreview(null);
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please provide an award image!");
      return;
    }

    if (!formData.dateReceived) {
      toast.error("Please select the received date!");
      return;
    }

    setLoading(true);

    try {
      const imgData = new FormData();
      imgData.append("image", imageFile);

      const imgBbRes = await fetch(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
        {
          method: "POST",
          body: imgData,
        }
      );

      const imgBbResult = await imgBbRes.json();

      if (!imgBbResult.success) {
        throw new Error("Image upload failed. Check your ImageBB API key.");
      }

      const imageUrl = imgBbResult.data.display_url;

      const newAward = {
        ...formData,
        image: imageUrl,
        createdAt: new Date().toISOString(),
      };

      const backendRes = await fetch("http://localhost:3000/awards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAward),
      });

      if (!backendRes.ok) {
        throw new Error("Failed to save award details to the server.");
      }

      toast.success("Award added successfully! 🎉");
      setFormData({ title: "", organization: "", dateReceived: "", description: "" });
      handleRemoveImage();
    } catch (err) {
      console.error("Submission Error:", err);
      toast.error(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen font-sans p-4 sm:p-6 lg:pr-24">
      <Toaster position="top-center" reverseOrder={false} />

      {/* CONTAINER WITH MATCHED WIDTH */}
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#163A2D] text-amber-300 rounded-xl shadow-md">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#163A2D] font-['Playfair_Display',serif]">
                Add New Award
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                Acknowledge honors, achievements, and recognition milestones.
              </p>
            </div>
          </div>
        </div>

        {/* FORM CARD */}
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Award Title */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                  Award Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Best Researcher Award"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                  required
                />
              </div>

              {/* Organization / Issuer */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                  Organization / Issuer <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="e.g. National Science Foundation"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                  required
                />
              </div>

              {/* EYE CATCHING DATE RECEIVED (CUSTOM DATEPICKER) */}
              <div className="md:col-span-2 relative" ref={datePickerRef}>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                  Date Received <span className="text-rose-500">*</span>
                </label>
                
                <div
                  onClick={() => setShowDatePicker((prev) => !prev)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm flex items-center justify-between cursor-pointer hover:bg-emerald-50/40 hover:border-emerald-300 transition-all group"
                >
                  <span className={formData.dateReceived ? "text-gray-800 font-semibold" : "text-gray-400"}>
                    {formData.dateReceived
                      ? new Date(formData.dateReceived).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Select date received..."}
                  </span>
                  <CalendarIcon className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                </div>

                {/* POPUP DATEPICKER CARD */}
                {showDatePicker && (
                  <div className="absolute top-full left-0 mt-2 z-50 w-80 bg-white border border-emerald-100 rounded-2xl shadow-2xl p-4 transition-all animate-in fade-in zoom-in-95">
                    {/* Header: Month & Navigation */}
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                      <button
                        type="button"
                        onClick={prevMonth}
                        className="p-1.5 hover:bg-emerald-50 text-emerald-800 rounded-lg transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-[#163A2D] text-sm font-['Playfair_Display',serif]">
                        {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
                      </span>
                      <button
                        type="button"
                        onClick={nextMonth}
                        className="p-1.5 hover:bg-emerald-50 text-emerald-800 rounded-lg transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Day Names */}
                    <div className="grid grid-cols-7 text-center text-[11px] font-bold text-emerald-800/70 mb-2">
                      <span>Su</span>
                      <span>Mo</span>
                      <span>Tu</span>
                      <span>We</span>
                      <span>Th</span>
                      <span>Fr</span>
                      <span>Sa</span>
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {/* Empty cells for padding before day 1 */}
                      {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                        <div key={`empty-${index}`} />
                      ))}

                      {/* Actual Days */}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateString = `${currentMonth.getFullYear()}-${String(
                          currentMonth.getMonth() + 1
                        ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                        const isSelected = formData.dateReceived === dateString;

                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleDateSelect(day)}
                            className={`py-2 rounded-xl font-medium transition-all ${
                              isSelected
                                ? "bg-[#163A2D] text-amber-300 font-bold shadow-md scale-105"
                                : "hover:bg-emerald-50 text-gray-700 hover:text-emerald-800"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* DRAG AND DROP ZONE */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                Award Image / Certificate <span className="text-rose-500">*</span>
              </label>

              {!imagePreview ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-2xl p-6 text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isDragging
                      ? "border-emerald-600 bg-emerald-50/70 scale-[1.01]"
                      : "border-emerald-300 bg-gray-50 hover:bg-emerald-50/30"
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
                    <span className="text-emerald-700 font-bold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP, or GIF up to 10MB</p>
                </div>
              ) : (
                /* PREVIEW AREA */
                <div className="relative p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={imagePreview}
                      alt="Award Preview"
                      className="w-20 h-20 object-cover rounded-xl border border-emerald-300 shadow-sm"
                    />
                    <div>
                      <p className="text-sm font-bold text-[#163A2D] truncate max-w-[200px] sm:max-w-xs">
                        {imageFile?.name}
                      </p>
                      <p className="text-xs text-emerald-700 font-medium mt-0.5">
                        {(imageFile?.size / (1024 * 1024)).toFixed(2)} MB • Ready to Upload
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    title="Remove Image"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                Award Description
              </label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief summary of why or how this award was received..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#163A2D] hover:bg-[#0C2219] text-amber-300 font-semibold text-sm rounded-xl transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading & Saving...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Publish Award</span>
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

export default AddAward;